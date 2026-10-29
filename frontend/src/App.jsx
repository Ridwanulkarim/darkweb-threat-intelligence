import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Modal from './components/Modal';
import Toast from './components/Toast';
import StatusBadge from './components/StatusBadge';
import { api } from './api/client';
import cyberBg from './assets/cyber-bg.jpg';

// Views
import DashboardOverview from './views/DashboardOverview';
import ThreatReportsView from './views/ThreatReportsView';
import IndicatorsView from './views/IndicatorsView';
import HackerGroupsView from './views/HackerGroupsView';
import DataLeaksView from './views/DataLeaksView';
import IncidentsView from './views/IncidentsView';
import InvestigationsView from './views/InvestigationsView';
import MalwareView from './views/MalwareView';
import AdminAuditView from './views/AdminAuditView';

import { 
  FileWarning, 
  ShieldAlert, 
  Crosshair, 
  AlertTriangle, 
  CheckCircle2, 
  Copy, 
  Check, 
  UserCheck, 
  Lock,
  Plus,
  Send,
  LayoutDashboard,
  AlertOctagon,
  Menu
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [simulationMode, setSimulationMode] = useState(api.simulationMode);
  const [currentUser, setCurrentUser] = useState(api.user);

  // Data states
  const [reports, setReports] = useState([]);
  const [indicators, setIndicators] = useState([]);
  const [groups, setGroups] = useState([]);
  const [leaks, setLeaks] = useState([]);
  const [incidents, setIncidents] = useState([]);
  const [investigations, setInvestigations] = useState([]);
  const [malware, setMalware] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [accessLogs, setAccessLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals & notifications
  const [selectedReport, setSelectedReport] = useState(null);
  const [isNewReportModalOpen, setIsNewReportModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  // Form states for New Report
  const [reportForm, setReportForm] = useState({
    title: '',
    status: 'NEW',
    categoryName: 'Ransomware',
    sourceName: 'Tor Darknet Forum - Dread',
    description: '',
    indicatorType: 'IP',
    indicatorValue: '',
    recommendation: ''
  });

  // Form states for Auth
  const [authForm, setAuthForm] = useState({
    type: 'analyst',
    email: '',
    password: ''
  });

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [
        reps,
        inds,
        grps,
        lks,
        incs,
        invs,
        mals,
        auds,
        accs
      ] = await Promise.all([
        api.getReports(),
        api.getIndicators(),
        api.getHackerGroups(),
        api.getDataLeaks(),
        api.getIncidents(),
        api.getInvestigations(),
        api.getMalware(),
        api.getAuditLogs(),
        api.getAccessLogs(),
      ]);

      setReports(Array.isArray(reps) ? reps : []);
      setIndicators(Array.isArray(inds) ? inds : []);
      setGroups(Array.isArray(grps) ? grps : []);
      setLeaks(Array.isArray(lks) ? lks : []);
      setIncidents(Array.isArray(incs) ? incs : []);
      setInvestigations(Array.isArray(invs) ? invs : []);
      setMalware(Array.isArray(mals) ? mals : []);
      setAuditLogs(Array.isArray(auds) ? auds : []);
      setAccessLogs(Array.isArray(accs) ? accs : []);
    } catch (err) {
      console.error('Error loading CTI data:', err);
      showToast('Error synchronizing with threat feed', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, [simulationMode]);

  // Handle New Threat Report submission
  const handleCreateReport = async (e) => {
    e.preventDefault();
    if (!reportForm.title.trim()) {
      showToast('Report title is required', 'warning');
      return;
    }

    try {
      const indicatorsList = reportForm.indicatorValue.trim()
        ? [{
            id: `ind-${Date.now()}`,
            type: reportForm.indicatorType,
            value: reportForm.indicatorValue.trim()
          }]
        : [];

      const payload = {
        title: reportForm.title.trim(),
        status: reportForm.status,
        sourceName: reportForm.sourceName,
        categoryName: reportForm.categoryName,
        description: reportForm.description,
        indicators: indicatorsList,
        recommendation: reportForm.recommendation
      };

      const created = await api.createReport(payload);
      setReports([created, ...reports]);
      if (indicatorsList.length > 0) {
        setIndicators([...indicatorsList.map(i => ({ ...i, reportTitle: created.title })), ...indicators]);
      }

      setIsNewReportModalOpen(false);
      setReportForm({
        title: '',
        status: 'NEW',
        categoryName: 'Ransomware',
        sourceName: 'Tor Darknet Forum - Dread',
        description: '',
        indicatorType: 'IP',
        indicatorValue: '',
        recommendation: ''
      });
      showToast('Threat report successfully ingested into intelligence pool', 'success');
    } catch (err) {
      showToast(err.message || 'Failed to submit report', 'error');
    }
  };

  // Handle Incident status update
  const handleUpdateIncidentStatus = async (id, status) => {
    try {
      await api.updateIncidentStatus(id, status);
      setIncidents(incidents.map(inc => inc.id === id ? { ...inc, status } : inc));
    } catch (err) {
      showToast(err.message || 'Failed to update incident', 'error');
    }
  };

  // Handle Login submission
  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await api.login(authForm.type, authForm.email, authForm.password);
      api.setToken(result.token, result.user || result.analyst || result.admin);
      setCurrentUser(result.user || result.analyst || result.admin || { name: 'SOC Operator', email: authForm.email, role: authForm.type.toUpperCase() });
      setIsAuthModalOpen(false);
      showToast(`Authenticated as ${authForm.type.toUpperCase()}`, 'success');
    } catch (err) {
      showToast(err.message || 'Authentication failed', 'error');
    }
  };

  const handleCopy = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#030305] text-slate-100 cyber-canvas-bg relative overflow-x-hidden selection:bg-red-500/30 selection:text-red-200">
      {/* High-Fidelity Cyber Matrix Background Graphic Layer */}
      <div 
        className="fixed inset-0 pointer-events-none z-0 bg-no-repeat transition-opacity duration-700"
        style={{ 
          backgroundImage: `url(${cyberBg})`,
          backgroundSize: 'max(950px, 58vw) auto',
          backgroundPosition: 'right 0 top 0',
          opacity: 0.65,
          maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0.88) 65%, rgba(0,0,0,0.2) 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0.88) 65%, rgba(0,0,0,0.2) 100%)'
        }}
        aria-hidden="true"
      />

      {/* 3D Perspective Grid Background (Cybersecurity Landing UI effect) */}
      <div className="cyber-perspective-grid" aria-hidden="true" />
      
      {/* Ambient glowing radial spotlights matching crimson telemetry */}
      <div className="absolute top-0 right-1/4 w-[650px] h-[360px] bg-red-600/15 rounded-full blur-[140px] pointer-events-none z-0" />
      <div className="absolute top-1/3 -right-20 w-[450px] h-[450px] bg-rose-600/10 rounded-full blur-[160px] pointer-events-none z-0" />

      {/* Top Navbar */}
      <Navbar
        simulationMode={simulationMode}
        setSimulationMode={setSimulationMode}
        currentUser={currentUser}
        setCurrentUser={setCurrentUser}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onOpenNewReportModal={() => setIsNewReportModalOpen(true)}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />

      {/* Main Workspace Layout */}
      <div className="flex-1 flex overflow-hidden relative z-10">
        {/* Tactical Sidebar */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          collapsed={sidebarCollapsed}
          setCollapsed={setSidebarCollapsed}
          mobileOpen={mobileMenuOpen}
          setMobileOpen={setMobileMenuOpen}
          counts={{
            reports: reports.length,
            indicators: indicators.length,
            groups: groups.length,
            leaks: leaks.length,
            incidents: incidents.length,
            investigations: investigations.length,
            malware: malware.length
          }}
        />

        {/* Dynamic View Area */}
        <main className="flex-1 p-3.5 sm:p-6 lg:p-8 overflow-y-auto max-w-7xl mx-auto w-full min-w-0 pb-24 md:pb-8">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-96 space-y-3 font-mono text-red-300">
              <div className="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin shadow-[0_0_15px_rgba(239,68,68,0.3)]" />
              <p className="text-xs uppercase tracking-widest animate-pulse text-red-300">
                Synchronizing Dark Web Feeds...
              </p>
            </div>
          ) : (
            <>
              {activeTab === 'overview' && (
                <DashboardOverview
                  reports={reports}
                  indicators={indicators}
                  incidents={incidents}
                  groups={groups}
                  investigations={investigations}
                  onSelectReport={(rep) => setSelectedReport(rep)}
                  onNavigateTab={(tab) => setActiveTab(tab)}
                  onOpenNewReportModal={() => setIsNewReportModalOpen(true)}
                />
              )}

              {activeTab === 'reports' && (
                <ThreatReportsView
                  reports={reports}
                  onSelectReport={(rep) => setSelectedReport(rep)}
                  onOpenNewReportModal={() => setIsNewReportModalOpen(true)}
                />
              )}

              {activeTab === 'indicators' && (
                <IndicatorsView
                  indicators={indicators}
                  onSelectReportById={(id) => {
                    const found = reports.find(r => r.id === id);
                    if (found) setSelectedReport(found);
                  }}
                />
              )}

              {activeTab === 'groups' && (
                <HackerGroupsView groups={groups} />
              )}

              {activeTab === 'leaks' && (
                <DataLeaksView leaks={leaks} />
              )}

              {activeTab === 'incidents' && (
                <IncidentsView
                  incidents={incidents}
                  onUpdateIncidentStatus={handleUpdateIncidentStatus}
                  onNotify={showToast}
                />
              )}

              {activeTab === 'investigations' && (
                <InvestigationsView
                  investigations={investigations}
                  onNotify={showToast}
                />
              )}

              {activeTab === 'malware' && (
                <MalwareView malware={malware} />
              )}

              {activeTab === 'admin' && (
                <AdminAuditView
                  auditLogs={auditLogs}
                  accessLogs={accessLogs}
                />
              )}
            </>
          )}
        </main>
      </div>

      {/* MODAL 1: Detailed Threat Report Inspector */}
      {selectedReport && (
        <Modal
          isOpen={!!selectedReport}
          onClose={() => setSelectedReport(null)}
          title={`THREAT INTEL DOSSIER #${selectedReport.id}`}
          maxWidth="max-w-3xl"
        >
          <div className="space-y-5 font-mono text-xs">
            {/* Header info */}
            <div className="pb-3 border-b border-slate-800">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <StatusBadge status={selectedReport.status} />
                <span className="px-2 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-800/60">
                  {selectedReport.category?.name || 'General Threat'}
                </span>
                <span className="text-slate-500">
                  Source: <strong className="text-slate-300">{selectedReport.source?.name}</strong>
                </span>
              </div>
              <h3 className="text-base font-bold text-white font-mono">
                {selectedReport.title}
              </h3>
              <p className="text-slate-400 mt-1 text-[11px]">
                Investigated by {selectedReport.analyst?.name} ({selectedReport.analyst?.email}) • {new Date(selectedReport.createdAt).toLocaleString()}
              </p>
            </div>

            {/* Description */}
            <div>
              <span className="text-[11px] text-slate-500 uppercase block mb-1 font-bold">Executive Intelligence Summary:</span>
              <p className="text-slate-200 leading-relaxed bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                {selectedReport.description || 'No detailed narrative provided for this intelligence ingest.'}
              </p>
            </div>

            {/* Associated IOCs */}
            {selectedReport.indicators && selectedReport.indicators.length > 0 && (
              <div>
                <span className="text-[11px] text-slate-500 uppercase block mb-1.5 font-bold">
                  Extracted Indicators of Compromise (IOCs):
                </span>
                <div className="space-y-1.5">
                  {selectedReport.indicators.map((ind, i) => (
                    <div
                      key={ind.id || i}
                      className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <StatusBadge status={ind.type} type="indicator" />
                        <span className="text-white select-all">{ind.value}</span>
                      </div>
                      <button
                        onClick={() => handleCopy(ind.id || i, ind.value)}
                        className="p-1 text-slate-400 hover:text-cyan-300 transition-colors flex items-center gap-1"
                      >
                        {copiedId === (ind.id || i) ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedId === (ind.id || i) ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recommendations */}
            {selectedReport.recommendations && selectedReport.recommendations.length > 0 && (
              <div>
                <span className="text-[11px] text-slate-500 uppercase block mb-1.5 font-bold">
                  Recommended Defense Countermeasures:
                </span>
                <div className="space-y-1.5">
                  {selectedReport.recommendations.map((rec, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-lg bg-emerald-950/30 border border-emerald-800/40 text-emerald-300 text-[11px]"
                    >
                      🛡️ {rec.text}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Modal Actions */}
            <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
              <button
                onClick={() => setSelectedReport(null)}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
              >
                Close Dossier
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* MODAL 2: Ingest New Threat Report */}
      {isNewReportModalOpen && (
        <Modal
          isOpen={isNewReportModalOpen}
          onClose={() => setIsNewReportModalOpen(false)}
          title="INGEST CLASSIFIED THREAT INTELLIGENCE"
          maxWidth="max-w-2xl"
        >
          <form onSubmit={handleCreateReport} className="space-y-4 font-mono text-xs">
            <div>
              <label className="block text-slate-400 mb-1">Threat Report Title *</label>
              <input
                type="text"
                required
                placeholder="e.g. Akira Ransomware Double Extortion Targeting Defense Suppliers"
                value={reportForm.title}
                onChange={(e) => setReportForm({ ...reportForm, title: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-slate-400 mb-1">Status</label>
                <select
                  value={reportForm.status}
                  onChange={(e) => setReportForm({ ...reportForm, status: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-100 focus:outline-none focus:border-cyan-400"
                >
                  <option value="NEW">NEW</option>
                  <option value="INVESTIGATING">INVESTIGATING</option>
                  <option value="CONFIRMED">CONFIRMED</option>
                  <option value="MITIGATED">MITIGATED</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Threat Category</label>
                <input
                  type="text"
                  value={reportForm.categoryName}
                  onChange={(e) => setReportForm({ ...reportForm, categoryName: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-100 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Darknet Source</label>
                <input
                  type="text"
                  value={reportForm.sourceName}
                  onChange={(e) => setReportForm({ ...reportForm, sourceName: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-100 focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Narrative & Intelligence Analysis</label>
              <textarea
                rows={3}
                placeholder="Observed threat actor statements, exfiltrated asset counts, exploit mechanisms..."
                value={reportForm.description}
                onChange={(e) => setReportForm({ ...reportForm, description: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400"
              />
            </div>

            {/* Ingest Initial IOC */}
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
              <span className="text-slate-400 font-bold block">Attach Initial Indicator of Compromise (Optional):</span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div>
                  <select
                    value={reportForm.indicatorType}
                    onChange={(e) => setReportForm({ ...reportForm, indicatorType: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-850 border border-slate-700 text-slate-100 focus:outline-none focus:border-cyan-400"
                  >
                    <option value="IP">IP Address</option>
                    <option value="DOMAIN">Domain Name</option>
                    <option value="HASH">SHA-256 Hash</option>
                    <option value="URL">Phishing URL</option>
                    <option value="EMAIL">Compromised Email</option>
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <input
                    type="text"
                    placeholder="e.g. 195.123.44.12 or malware_hash..."
                    value={reportForm.indicatorValue}
                    onChange={(e) => setReportForm({ ...reportForm, indicatorValue: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-850 border border-slate-700 text-slate-100 focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Defense Recommendation</label>
              <input
                type="text"
                placeholder="e.g. Block inbound TCP connections on port 8080 for Edge nodes"
                value={reportForm.recommendation}
                onChange={(e) => setReportForm({ ...reportForm, recommendation: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsNewReportModalOpen(false)}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold shadow-[0_0_15px_rgba(168,85,247,0.35)] transition-all"
              >
                Ingest to Database
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* MODAL 3: SOC Authentication & Quick Switch */}
      {isAuthModalOpen && (
        <Modal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          title="AUTHENTICATE SECURITY OPERATOR"
          maxWidth="max-w-md"
        >
          <div className="space-y-4 font-mono text-xs">
            {/* Type selector */}
            <div className="flex rounded-lg bg-slate-900 p-1 border border-purple-500/30">
              <button
                type="button"
                onClick={() => setAuthForm({ ...authForm, type: 'analyst' })}
                className={`flex-1 py-1.5 rounded-md font-bold transition-all ${
                  authForm.type === 'analyst' 
                    ? 'bg-purple-600 text-white shadow-[0_0_15px_rgba(168,85,247,0.35)]' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Threat Analyst
              </button>
              <button
                type="button"
                onClick={() => setAuthForm({ ...authForm, type: 'admin' })}
                className={`flex-1 py-1.5 rounded-md font-bold transition-all ${
                  authForm.type === 'admin' 
                    ? 'bg-indigo-600 text-white shadow-[0_0_15px_rgba(99,102,241,0.35)]' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Security Admin
              </button>
            </div>


            <form onSubmit={handleAuthSubmit} className="space-y-4">
              <div>
                <label className="block text-slate-300 text-sm font-medium mb-1.5">Operator Email</label>
                <input
                  type="email"
                  required
                  placeholder="analyst@domain.com"
                  value={authForm.email}
                  onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-purple-500/30 text-slate-100 text-sm sm:text-base focus:outline-none focus:border-purple-400"
                />
              </div>
              <div>
                <label className="block text-slate-300 text-sm font-medium mb-1.5">Operator Password</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={authForm.password}
                  onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-red-500/30 text-slate-100 text-sm sm:text-base focus:outline-none focus:border-red-400"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsAuthModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-500 hover:to-rose-500 text-white font-bold text-sm shadow-[0_0_15px_rgba(239,68,68,0.35)]"
                >
                  Sign In to SOC
                </button>
              </div>
            </form>
          </div>
        </Modal>
      )}

      {/* Mobile Bottom Quick Navigation Dock */}
      <nav 
        className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-[#070204]/95 backdrop-blur-2xl border-t border-red-500/25 px-2 py-2 flex items-center justify-around shadow-[0_-8px_30px_rgba(0,0,0,0.7)]"
        aria-label="Mobile quick dock"
      >
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all touch-manipulation ${
            activeTab === 'overview'
              ? 'text-red-200 bg-red-600/20 font-bold shadow-[0_0_12px_rgba(239,68,68,0.3)]'
              : 'text-slate-400 hover:text-red-300'
          }`}
        >
          <LayoutDashboard className="w-5 h-5 mb-0.5" />
          <span className="text-xs font-mono font-medium">Overview</span>
        </button>

        <button
          onClick={() => setActiveTab('reports')}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all touch-manipulation relative ${
            activeTab === 'reports'
              ? 'text-red-200 bg-red-600/20 font-bold shadow-[0_0_12px_rgba(239,68,68,0.3)]'
              : 'text-slate-400 hover:text-red-300'
          }`}
        >
          <FileWarning className="w-5 h-5 mb-0.5" />
          <span className="text-xs font-mono font-medium">Reports</span>
          {reports.length > 0 && (
            <span className="absolute top-0.5 right-1 w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('indicators')}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all touch-manipulation ${
            activeTab === 'indicators'
              ? 'text-red-200 bg-red-600/20 font-bold shadow-[0_0_12px_rgba(239,68,68,0.3)]'
              : 'text-slate-400 hover:text-red-300'
          }`}
        >
          <Crosshair className="w-5 h-5 mb-0.5" />
          <span className="text-xs font-mono font-medium">IOCs</span>
        </button>

        <button
          onClick={() => setActiveTab('incidents')}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all touch-manipulation relative ${
            activeTab === 'incidents'
              ? 'text-rose-200 bg-rose-600/20 font-bold shadow-[0_0_12px_rgba(244,63,94,0.3)]'
              : 'text-slate-400 hover:text-rose-300'
          }`}
        >
          <AlertOctagon className="w-5 h-5 mb-0.5" />
          <span className="text-xs font-mono font-medium">Incidents</span>
          {incidents.filter(i => i.severity === 'CRITICAL').length > 0 && (
            <span className="absolute top-0.5 right-1 w-2 h-2 rounded-full bg-rose-500 animate-ping" />
          )}
        </button>

        <button
          onClick={() => setMobileMenuOpen(true)}
          className="flex flex-col items-center justify-center py-1 px-2.5 rounded-xl text-red-300 hover:text-white transition-all touch-manipulation"
        >
          <Menu className="w-5 h-5 mb-0.5" />
          <span className="text-xs font-mono font-medium">Modules</span>
        </button>
      </nav>

      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
