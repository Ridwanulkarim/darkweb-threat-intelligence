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
  Building
} from 'lucide-react';
import StatusBadge from '../components/StatusBadge';

export default function IncidentsView({ incidents = [], onUpdateIncidentStatus, onNotify }) {
  const [selectedIncident, setSelectedIncident] = useState(incidents[0] || null);
  const [filterStatus, setFilterStatus] = useState('ALL');

  const statuses = ['ALL', 'NOT_STARTED', 'IN_PROGRESS', 'CONTAINED', 'ERADICATED', 'RECOVERED', 'CLOSED'];

  const filteredIncidents = incidents.filter(inc => 
    filterStatus === 'ALL' || inc.status === filterStatus
  );

  const handleStatusChange = async (incId, newStatus) => {
    await onUpdateIncidentStatus(incId, newStatus);
    if (selectedIncident && selectedIncident.id === incId) {
      setSelectedIncident({ ...selectedIncident, status: newStatus });
    }
    onNotify?.(`Incident #${incId} updated to ${newStatus}`, 'success');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold font-mono text-white flex items-center gap-2">
          <AlertOctagon className="w-5 h-5 text-rose-400" />
          INCIDENT RESPONSE & SOC MITIGATION CENTER
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Triage active security breaches, execute containment workflows, and coordinate analyst assignments.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="cyber-card rounded-xl p-2.5 flex items-center gap-1.5 overflow-x-auto">
        {statuses.map(st => (
          <button
            key={st}
            onClick={() => setFilterStatus(st)}
            className={`px-3 py-1 rounded-lg text-xs font-mono transition-all shrink-0 ${
              filterStatus === st 
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-cyber-danger font-semibold' 
                : 'text-slate-400 hover:text-slate-200 bg-slate-900/60 border border-slate-800'
            }`}
          >
            {st}
          </button>
        ))}
      </div>

      {/* Main Grid: Left Incident List, Right Detailed Incident Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Incident List */}
        <div className="space-y-3 lg:col-span-1">
          {filteredIncidents.map((inc) => (
            <div
              key={inc.id}
              onClick={() => setSelectedIncident(inc)}
              className={`p-4 rounded-xl border transition-all cursor-pointer ${
                selectedIncident?.id === inc.id
                  ? 'bg-slate-900 border-rose-500/60 shadow-cyber-danger'
                  : 'cyber-card border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <StatusBadge status={inc.severity} type="severity" />
                <StatusBadge status={inc.status} />
              </div>

              <h4 className="text-sm font-semibold font-mono text-white mb-1.5 line-clamp-2">
                {inc.title}
              </h4>

              <div className="flex items-center gap-2 text-xs text-slate-400 font-mono mb-2">
                <Building className="w-3.5 h-3.5 text-cyan-400" />
                <span className="truncate">{inc.organization}</span>
              </div>

              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-500">
                <span>{inc.alerts?.length || 0} Alerts</span>
                <span>Analyst: {inc.assignedAnalyst?.split(' ')[0] || 'Unassigned'}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Incident Detail Pane */}
        <div className="lg:col-span-2 cyber-card rounded-2xl p-6 border border-slate-800 flex flex-col justify-between">
          {selectedIncident ? (
            <div className="space-y-5">
              {/* Header */}
              <div className="border-b border-slate-800 pb-4">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-slate-500">INCIDENT ID:</span>
                    <span className="font-mono text-xs text-cyan-400 font-bold">{selectedIncident.id}</span>
                    <StatusBadge status={selectedIncident.severity} type="severity" />
                    <StatusBadge status={selectedIncident.status} />
                  </div>
                  <span className="text-xs font-mono text-slate-500">
                    Logged: {new Date(selectedIncident.createdAt).toLocaleString()}
                  </span>
                </div>

                <h3 className="text-lg font-bold font-mono text-white">
                  {selectedIncident.title}
                </h3>
                <p className="text-xs text-slate-400 mt-1 flex items-center gap-2">
                  <Building className="w-4 h-4 text-cyan-400" />
                  Impacted Organization: <span className="text-slate-200 font-semibold">{selectedIncident.organization}</span>
                </p>
              </div>

              {/* Status Action Switcher */}
              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block mb-2 font-semibold">
                  Update Mitigation Lifecycle Status:
                </span>
                <div className="flex flex-wrap gap-2">
                  {['NOT_STARTED', 'IN_PROGRESS', 'CONTAINED', 'ERADICATED', 'RECOVERED', 'CLOSED'].map((st) => (
                    <button
                      key={st}
                      onClick={() => handleStatusChange(selectedIncident.id, st)}
                      className={`px-2.5 py-1 rounded text-xs font-mono transition-all ${
                        selectedIncident.status === st
                          ? 'bg-rose-500 text-slate-950 font-bold shadow-cyber-danger'
                          : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Real-time Alerts */}
              <div>
                <h4 className="text-xs font-mono uppercase text-slate-400 font-bold tracking-wider mb-2 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  Telemetry Alerts Triggered ({selectedIncident.alerts?.length || 0})
                </h4>
                <div className="space-y-2">
                  {selectedIncident.alerts?.map((al) => (
                    <div
                      key={al.id}
                      className="p-3 rounded-lg bg-slate-900 border border-slate-800/80 flex items-start gap-3 text-xs font-mono"
                    >
                      <StatusBadge status={al.level} type="level" />
                      <div className="flex-1">
                        <p className="text-slate-200">{al.message}</p>
                        <span className="text-[10px] text-slate-500 mt-1 block">
                          {al.timestamp ? new Date(al.timestamp).toLocaleTimeString() : 'Recently'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Analyst Response Log */}
              <div>
                <h4 className="text-xs font-mono uppercase text-slate-400 font-bold tracking-wider mb-2 flex items-center gap-2">
                  <User className="w-4 h-4 text-cyan-400" />
                  Assigned Analyst Response Actions
                </h4>
                <div className="space-y-2">
                  {selectedIncident.responses && selectedIncident.responses.length > 0 ? (
                    selectedIncident.responses.map((res) => (
                      <div
                        key={res.id}
                        className="p-3 rounded-lg bg-slate-900 border border-emerald-800/40 text-xs font-mono text-emerald-300"
                      >
                        <div className="flex items-center justify-between mb-1 text-slate-400 text-[11px]">
                          <span className="font-semibold text-white">Analyst: {res.analyst}</span>
                          <span>{res.timestamp ? new Date(res.timestamp).toLocaleTimeString() : 'Recently'}</span>
                        </div>
                        <p>{res.action}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs font-mono text-slate-500 italic">
                      No response actions logged yet. Incident requires analyst triage.
                    </p>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-64 text-slate-500 font-mono text-xs">
              Select an incident to view containment details.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
