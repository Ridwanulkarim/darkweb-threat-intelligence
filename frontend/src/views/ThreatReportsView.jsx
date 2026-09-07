import React, { useState } from 'react';
import { 
  FileWarning, 
  Search, 
  Filter, 
  Plus, 
  ExternalLink, 
  Calendar, 
  User, 
  Globe, 
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import StatusBadge from '../components/StatusBadge';

export default function ThreatReportsView({ 
  reports = [], 
  onSelectReport, 
  onOpenNewReportModal 
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('ALL');

  const filteredReports = reports.filter((rep) => {
    const matchesSearch = 
      rep.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rep.source?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rep.category?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rep.analyst?.name?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = selectedStatus === 'ALL' || rep.status === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  const statuses = ['ALL', 'NEW', 'CONFIRMED', 'INVESTIGATING', 'MITIGATED'];

  return (
    <div className="space-y-5">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold font-mono text-white flex items-center gap-2">
            <FileWarning className="w-5 h-5 text-cyan-400" />
            DARK WEB THREAT INTELLIGENCE REPORTS
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Classified intelligence ingested from onion forums, market auctions, and leak channels.
          </p>
        </div>

        <button
          onClick={onOpenNewReportModal}
          className="px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 text-xs font-mono font-bold flex items-center gap-2 shadow-cyber-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Ingest Threat Report</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="cyber-card rounded-xl p-3 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Filter by report title, source, category, analyst..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/60 font-mono"
          />
        </div>

        {/* Status Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          <span className="text-[11px] font-mono text-slate-500 uppercase mr-1 flex items-center gap-1">
            <Filter className="w-3 h-3" /> Status:
          </span>
          {statuses.map((st) => (
            <button
              key={st}
              onClick={() => setSelectedStatus(st)}
              className={`px-2.5 py-1 rounded-md text-[11px] font-mono transition-all ${
                selectedStatus === st
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-cyber-sm font-semibold'
                  : 'text-slate-400 hover:text-slate-200 bg-slate-900/80 border border-slate-800'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Reports Table / List */}
      <div className="cyber-card rounded-2xl overflow-hidden border border-slate-800">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900/90 border-b border-slate-800 text-[11px] font-mono uppercase text-slate-400">
                <th className="py-3 px-4">Threat Report</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Intel Source</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Indicators</th>
                <th className="py-3 px-4">Lead Analyst</th>
                <th className="py-3 px-4">Logged Date</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs">
              {filteredReports.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center py-10 text-slate-500 font-mono">
                    No threat reports match the filter criteria.
                  </td>
                </tr>
              ) : (
                filteredReports.map((rep) => (
                  <tr
                    key={rep.id}
                    onClick={() => onSelectReport(rep)}
                    className="hover:bg-slate-850/60 transition-colors cursor-pointer group"
                  >
                    <td className="py-3.5 px-4 font-medium text-slate-200 group-hover:text-cyan-300 max-w-xs truncate">
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0"></span>
                        <span className="font-semibold text-white">{rep.title}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-mono">
                      <span className="px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800 text-[11px]">
                        {rep.category?.name || 'General'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px]">
                      {rep.source?.name || 'Darknet Forum'}
                    </td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={rep.status} />
                    </td>
                    <td className="py-3.5 px-4 font-mono text-cyan-400 font-semibold">
                      {rep.indicators?.length || 0} IOCs
                    </td>
                    <td className="py-3.5 px-4 text-slate-400">
                      {rep.analyst?.name || 'SOC Analyst'}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 font-mono text-[11px]">
                      {new Date(rep.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button className="p-1 rounded text-slate-400 group-hover:text-cyan-300 hover:bg-slate-800 transition-colors">
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
