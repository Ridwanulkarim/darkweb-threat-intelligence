import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Modal from './components/Modal';
import Toast from './components/Toast';
import StatusBadge from './components/StatusBadge';
import { api } from './api/client';

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
  Send
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
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
    <div className="min-h-screen flex flex-col bg-[#070b14] text-slate-100 cyber-grid-bg">
      {/* Top Navbar */}
      <Navbar
        simulationMode={simulationMode}
        setSimulationMode={setSimulationMode}
        currentUser={currentUser}
        setCurrentUser={setCurrentUser}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onOpenNewReportModal={() => setIsNewReportModalOpen(true)}
      />

      {/* Main Workspace Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Tactical Sidebar */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          collapsed={sidebarCollapsed}
          setCollapsed={setSidebarCollapsed}
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
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-7xl mx-auto w-full">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-96 space-y-3 font-mono text-cyan-400">
              <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
              <p className="text-xs uppercase tracking-widest animate-pulse">
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
                className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold shadow-cyber-sm transition-all"
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
            <div className="flex rounded-lg bg-slate-900 p-1 border border-slate-800">
              <button
                type="button"
                onClick={() => setAuthForm({ ...authForm, type: 'analyst' })}
                className={`flex-1 py-1.5 rounded-md font-bold transition-all ${
                  authForm.type === 'analyst' 
                    ? 'bg-cyan-500 text-slate-950 shadow-cyber-sm' 
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
                    ? 'bg-cyan-500 text-slate-950 shadow-cyber-sm' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Security Admin
              </button>
            </div>

            {/* Quick-fill helpers */}
            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-[11px] space-y-1.5">
              <span className="text-slate-500 uppercase block font-semibold">Quick-Fill Demo Credentials:</span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setAuthForm({ type: 'analyst', email: 'elena.rostova@cyberthreat.io', password: 'password123' })}
                  className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-750 text-cyan-300 border border-slate-700"
                >
                  Elena Rostova (Analyst)
                </button>
                <button
                  type="button"
                  onClick={() => setAuthForm({ type: 'admin', email: 'admin@cyberthreat.io', password: 'password123' })}
                  className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-750 text-rose-300 border border-slate-700"
                >
                  Root Admin
                </button>
              </div>
            </div>

            <form onSubmit={handleAuthSubmit} className="space-y-3">
              <div>
                <label className="block text-slate-400 mb-1">Operator Email</label>
                <input
                  type="email"
                  required
                  placeholder="analyst@domain.com"
                  value={authForm.email}
                  onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-100 focus:outline-none focus:border-cyan-400"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Operator Password</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={authForm.password}
                  onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-100 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAuthModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold shadow-cyber-sm"
                >
                  Sign In to SOC
                </button>
              </div>
            </form>
          </div>
        </Modal>
      )}

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
