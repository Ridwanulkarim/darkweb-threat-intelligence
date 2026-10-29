import React, { useState } from 'react';
import { 
  AlertOctagon, 
  ShieldCheck, 
  Clock, 
  User, 
  AlertTriangle, 
  CheckCircle2, 
  ChevronRight,
  Send,
  Building,
  ArrowLeft
} from 'lucide-react';
import StatusBadge from '../components/StatusBadge';

export default function IncidentsView({ incidents = [], onUpdateIncidentStatus, onNotify }) {
  const [selectedIncident, setSelectedIncident] = useState(incidents[0] || null);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [mobileView, setMobileView] = useState('list'); // 'list' | 'detail'

  const statuses = ['ALL', 'NOT_STARTED', 'IN_PROGRESS', 'CONTAINED', 'ERADICATED', 'RECOVERED', 'CLOSED'];

  const filteredIncidents = incidents.filter(inc => 
    filterStatus === 'ALL' || inc.status === filterStatus
  );

  const handleSelectIncident = (inc) => {
    setSelectedIncident(inc);
    setMobileView('detail');
  };

  const handleStatusChange = async (incId, newStatus) => {
    await onUpdateIncidentStatus(incId, newStatus);
    if (selectedIncident && selectedIncident.id === incId) {
      setSelectedIncident({ ...selectedIncident, status: newStatus });
    }
    onNotify?.(`Incident #${incId} updated to ${newStatus}`, 'success');
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h2 className="text-lg sm:text-xl font-bold font-mono text-white flex items-center gap-2">
          <AlertOctagon className="w-5 h-5 text-rose-400 shrink-0" />
          <span className="truncate">INCIDENT RESPONSE & SOC MITIGATION CENTER</span>
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Triage active security breaches, execute containment workflows, and coordinate analyst assignments.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="cyber-card rounded-2xl p-2.5 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
        {statuses.map(st => (
          <button
            key={st}
            onClick={() => setFilterStatus(st)}
            className={`px-3 py-1 rounded-xl text-xs font-mono transition-all shrink-0 touch-manipulation ${
              filterStatus === st 
                ? 'bg-rose-500/25 text-rose-200 border border-rose-500/40 shadow-[0_0_12px_rgba(244,63,94,0.3)] font-semibold' 
                : 'text-slate-400 hover:text-slate-200 bg-[#0e0407] border border-red-500/20'
            }`}
          >
            {st}
          </button>
        ))}
      </div>

      {/* Main Grid: Left Incident List, Right Detailed Incident Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Incident List */}
        <div className={`space-y-3 lg:col-span-1 ${mobileView === 'detail' ? 'hidden lg:block' : 'block'}`}>
          <div className="flex items-center justify-between pb-1 px-1">
            <span className="text-xs font-mono uppercase text-slate-400 font-semibold">
              Active Cases ({filteredIncidents.length})
            </span>
          </div>

          {filteredIncidents.length === 0 ? (
            <div className="cyber-card rounded-2xl p-6 text-center text-slate-400 font-mono text-xs">
              No incidents match the selected status.
            </div>
          ) : (
            filteredIncidents.map((inc) => (
              <div
                key={inc.id}
                onClick={() => handleSelectIncident(inc)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer touch-manipulation ${
                  selectedIncident?.id === inc.id
                    ? 'bg-[#1a070e] border-red-500/50 shadow-[0_0_20px_rgba(239,68,68,0.25)]'
                    : 'cyber-card border-red-500/20 hover:border-red-500/40'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <StatusBadge status={inc.severity} type="severity" />
                  <StatusBadge status={inc.status} />
                </div>

                <h4 className="text-base font-semibold font-mono text-white mb-1.5 line-clamp-2">
                  {inc.title}
                </h4>

                <div className="flex items-center gap-2 text-sm text-slate-300 font-mono mb-2">
                  <Building className="w-4 h-4 text-red-400 shrink-0" />
                  <span className="truncate">{inc.organization}</span>
                </div>

                <div className="pt-2.5 border-t border-red-500/15 flex items-center justify-between text-xs sm:text-sm font-mono text-slate-400">
                  <span>{inc.alerts?.length || 0} Alerts</span>
                  <div className="flex items-center gap-1 text-red-300 font-semibold">
                    <span>Inspect</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Incident Detail Pane */}
        <div className={`lg:col-span-2 cyber-card rounded-2xl p-4 sm:p-6 border border-red-500/25 flex flex-col justify-between ${
          mobileView === 'list' ? 'hidden lg:flex' : 'flex'
        }`}>
          {/* Mobile Back Button */}
          <div className="lg:hidden pb-3 mb-2 border-b border-red-500/20">
            <button
              onClick={() => setMobileView('list')}
              className="flex items-center gap-1.5 text-sm font-mono text-red-300 hover:text-white px-3.5 py-2 rounded-xl bg-red-950/40 border border-red-500/25 touch-manipulation font-semibold"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Incidents List</span>
            </button>
          </div>

          {selectedIncident ? (
            <div className="space-y-5">
              {/* Header */}
              <div className="border-b border-red-500/20 pb-4">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-sm text-slate-400 font-semibold">ID:</span>
                    <span className="font-mono text-sm text-red-300 font-bold">{selectedIncident.id}</span>
                    <StatusBadge status={selectedIncident.severity} type="severity" />
                    <StatusBadge status={selectedIncident.status} />
                  </div>
                  <span className="text-xs sm:text-sm font-mono text-slate-400">
                    Logged: {new Date(selectedIncident.createdAt).toLocaleString()}
                  </span>
                </div>

                <h3 className="text-lg sm:text-xl font-bold font-mono text-white">
                  {selectedIncident.title}
                </h3>
                <p className="text-sm text-slate-300 mt-1.5 flex items-center gap-2">
                  <Building className="w-4 h-4 text-red-400 shrink-0" />
                  Impacted Org: <span className="text-white font-semibold">{selectedIncident.organization}</span>
                </p>
              </div>

              {/* Status Action Switcher */}
              <div className="p-4 rounded-xl bg-[#0a0305] border border-red-500/20">
                <span className="text-xs sm:text-sm font-mono text-slate-300 uppercase tracking-wider block mb-2 font-semibold">
                  Update Mitigation Lifecycle Status:
                </span>
                <div className="flex flex-wrap gap-2">
                  {['NOT_STARTED', 'IN_PROGRESS', 'CONTAINED', 'ERADICATED', 'RECOVERED', 'CLOSED'].map((st) => (
                    <button
                      key={st}
                      onClick={() => handleStatusChange(selectedIncident.id, st)}
                      className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-mono transition-all touch-manipulation ${
                        selectedIncident.status === st
                          ? 'bg-rose-500 text-white font-bold shadow-[0_0_12px_rgba(244,63,94,0.4)]'
                          : 'bg-[#140508] hover:bg-[#1f080c] text-red-200 border border-red-500/20'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Real-time Alerts */}
              <div>
                <h4 className="text-sm font-mono uppercase text-slate-300 font-bold tracking-wider mb-2.5 flex items-center gap-2">
                  <AlertTriangle className="w-4.5 h-4.5 text-amber-400" />
                  Telemetry Alerts Triggered ({selectedIncident.alerts?.length || 0})
                </h4>
                <div className="space-y-2.5 max-h-56 overflow-y-auto">
                  {selectedIncident.alerts?.map((al) => (
                    <div
                      key={al.id}
                      className="p-3.5 rounded-xl bg-[#0a0305] border border-red-500/15 flex items-start gap-3 text-sm font-mono"
                    >
                      <StatusBadge status={al.level} type="level" />
                      <div className="flex-1 min-w-0">
                        <p className="text-slate-200 break-words font-medium">{al.message}</p>
                        <span className="text-xs text-slate-400 mt-1 block">
                          {al.timestamp ? new Date(al.timestamp).toLocaleTimeString() : 'Recently'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Response Team */}
              <div className="pt-3 border-t border-red-500/15 flex flex-wrap items-center justify-between text-xs sm:text-sm font-mono text-slate-400 gap-2">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-red-400" />
                  <span>Lead Responder:</span>
                  <span className="text-white font-semibold">{selectedIncident.assignedAnalyst || 'SOC Lead'}</span>
                </div>
                <div className="flex items-center gap-2 text-emerald-400 font-medium">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Playbook Active: IR-RANSOMWARE-04</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-slate-400 font-mono text-sm">
              Select an incident from the list to inspect mitigation details.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
