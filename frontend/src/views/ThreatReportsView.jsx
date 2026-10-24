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
  ShieldCheck,
  ShieldAlert,
  Radio
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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h2 className="text-lg sm:text-xl font-bold font-mono text-white flex items-center gap-2">
            <FileWarning className="w-5 h-5 text-purple-400 shrink-0" />
            <span className="truncate">DARK WEB THREAT INTELLIGENCE REPORTS</span>
          </h2>
          <p className="text-xs text-purple-200/60 mt-0.5">
            Classified intelligence ingested from onion forums, market auctions, and leak channels.
          </p>
        </div>

        <button
          onClick={onOpenNewReportModal}
          className="w-full sm:w-auto px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-violet-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-mono font-bold flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(168,85,247,0.35)] transition-all touch-manipulation active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Ingest Threat Report</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="cyber-card rounded-2xl p-3 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-purple-400/50 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Filter by title, source, category, analyst..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#0a041c] border border-purple-500/20 text-xs text-purple-100 placeholder-purple-300/40 focus:outline-none focus:border-purple-400 font-mono"
          />
        </div>

        {/* Status Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          <span className="text-[11px] font-mono text-purple-300/60 uppercase mr-1 flex items-center gap-1 shrink-0">
            <Filter className="w-3 h-3" /> Status:
          </span>
          {statuses.map((st) => (
            <button
              key={st}
              onClick={() => setSelectedStatus(st)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-mono transition-all shrink-0 touch-manipulation ${
                selectedStatus === st
                  ? 'bg-purple-600/30 text-purple-200 border border-purple-500/50 shadow-[0_0_10px_rgba(168,85,247,0.25)] font-semibold'
                  : 'text-purple-300/60 hover:text-purple-200 bg-[#0e0725] border border-purple-500/20'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* 
        RESPONSIVE VIEW:
        1. Mobile Cards (< md)
        2. Desktop Table (>= md)
      */}

      {/* 1. Mobile Cards (< md) */}
      <div className="md:hidden space-y-3">
        {filteredReports.length === 0 ? (
          <div className="cyber-card rounded-2xl p-8 text-center text-purple-300/50 font-mono text-xs">
            No threat reports match the filter criteria.
          </div>
        ) : (
          filteredReports.map((rep) => (
            <div
              key={rep.id}
              onClick={() => onSelectReport(rep)}
              className="cyber-card rounded-2xl p-4 space-y-3 cursor-pointer group active:scale-[0.99] transition-all touch-manipulation"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex flex-wrap items-center gap-1.5">
                  <StatusBadge status={rep.status} />
                  <span className="px-2 py-0.5 rounded bg-purple-950/70 text-purple-300 border border-purple-800/60 text-[10px] font-mono">
                    {rep.category?.name || 'General'}
                  </span>
                </div>
                <span className="text-[10px] text-purple-300/50 font-mono shrink-0">
                  {new Date(rep.createdAt).toLocaleDateString()}
                </span>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-white group-hover:text-purple-300 transition-colors font-mono">
                  {rep.title}
                </h3>
                {rep.description && (
                  <p className="text-xs text-purple-200/60 mt-1 line-clamp-2">
                    {rep.description}
                  </p>
                )}
              </div>

              <div className="pt-2 border-t border-purple-500/15 flex items-center justify-between text-[11px] font-mono text-purple-300/70">
                <span className="truncate max-w-[140px] text-purple-200/90">
                  {rep.source?.name || 'Darknet Forum'}
                </span>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-purple-300 font-semibold">{rep.indicators?.length || 0} IOCs</span>
                  <ChevronRight className="w-4 h-4 text-purple-400 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* 2. Desktop Table (>= md) */}
      <div className="hidden md:block cyber-card rounded-2xl overflow-hidden border border-purple-500/20">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#0e0725]/90 border-b border-purple-500/20 text-[11px] font-mono uppercase text-purple-300/60">
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
            <tbody className="divide-y divide-purple-500/15 text-xs">
              {filteredReports.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center py-10 text-purple-300/50 font-mono">
                    No threat reports match the filter criteria.
                  </td>
                </tr>
              ) : (
                filteredReports.map((rep) => (
                  <tr
                    key={rep.id}
                    onClick={() => onSelectReport(rep)}
                    className="hover:bg-purple-950/30 transition-colors cursor-pointer group"
                  >
                    <td className="py-3.5 px-4 font-medium text-slate-200 group-hover:text-purple-300 max-w-xs truncate">
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-purple-400 shrink-0"></span>
                        <span className="font-semibold text-white truncate">{rep.title}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-mono">
                      <span className="px-2 py-0.5 rounded bg-purple-950/80 text-purple-300 border border-purple-800/60 text-[11px]">
                        {rep.category?.name || 'General'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-purple-300/70 font-mono text-[11px]">
                      {rep.source?.name || 'Darknet Forum'}
                    </td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={rep.status} />
                    </td>
                    <td className="py-3.5 px-4 font-mono text-purple-300 font-semibold">
                      {rep.indicators?.length || 0} IOCs
                    </td>
                    <td className="py-3.5 px-4 text-purple-200/70">
                      {rep.analyst?.name || 'SOC Analyst'}
                    </td>
                    <td className="py-3.5 px-4 text-purple-400/50 font-mono text-[11px]">
                      {new Date(rep.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button className="p-1 rounded text-purple-400/70 group-hover:text-purple-200 hover:bg-purple-900/40 transition-colors">
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
