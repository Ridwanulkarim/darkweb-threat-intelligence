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
            <FileWarning className="w-5 h-5 text-red-400 shrink-0" />
            <span className="truncate">DARK WEB THREAT INTELLIGENCE REPORTS</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Classified intelligence ingested from onion forums, market auctions, and leak channels.
          </p>
        </div>

        <button
          onClick={onOpenNewReportModal}
          className="w-full sm:w-auto px-4 py-2 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-500 hover:to-rose-500 text-white text-xs font-mono font-bold flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(239,68,68,0.35)] transition-all touch-manipulation active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Ingest Threat Report</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="cyber-card rounded-2xl p-3 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-red-400/50 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Filter by title, source, category, analyst..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#0a0305] border border-red-500/20 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-red-400 font-mono"
          />
        </div>

        {/* Status Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          <span className="text-xs sm:text-sm font-mono text-slate-400 uppercase mr-1 flex items-center gap-1.5 shrink-0 font-semibold">
            <Filter className="w-3.5 h-3.5" /> Status:
          </span>
          {statuses.map((st) => (
            <button
              key={st}
              onClick={() => setSelectedStatus(st)}
              className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-mono transition-all shrink-0 touch-manipulation ${
                selectedStatus === st
                  ? 'bg-red-600/30 text-red-200 border border-red-500/50 shadow-[0_0_10px_rgba(239,68,68,0.25)] font-semibold'
                  : 'text-slate-400 hover:text-slate-200 bg-[#0e0407] border border-red-500/20'
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
      <div className="md:hidden space-y-3.5">
        {filteredReports.length === 0 ? (
          <div className="cyber-card rounded-2xl p-8 text-center text-slate-400 font-mono text-sm">
            No threat reports match the filter criteria.
          </div>
        ) : (
          filteredReports.map((rep) => (
            <div
              key={rep.id}
              onClick={() => onSelectReport(rep)}
              className="cyber-card rounded-2xl p-4.5 space-y-3 cursor-pointer group active:scale-[0.99] transition-all touch-manipulation"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  <StatusBadge status={rep.status} />
                  <span className="px-2.5 py-0.5 rounded-md bg-red-950/70 text-red-300 border border-red-800/60 text-xs font-mono font-semibold">
                    {rep.category?.name || 'General'}
                  </span>
                </div>
                <span className="text-xs text-slate-400 font-mono shrink-0">
                  {new Date(rep.createdAt).toLocaleDateString()}
                </span>
              </div>

              <div>
                <h3 className="text-base font-semibold text-white group-hover:text-red-300 transition-colors font-mono">
                  {rep.title}
                </h3>
                {rep.description && (
                  <p className="text-sm text-slate-300 mt-1.5 line-clamp-2">
                    {rep.description}
                  </p>
                )}
              </div>

              <div className="pt-2.5 border-t border-red-500/15 flex items-center justify-between text-xs sm:text-sm font-mono text-slate-400">
                <span className="truncate max-w-[150px] text-slate-300 font-medium">
                  {rep.source?.name || 'Darknet Forum'}
                </span>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-red-300 font-semibold">{rep.indicators?.length || 0} IOCs</span>
                  <ChevronRight className="w-4 h-4 text-red-400 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* 2. Desktop Table (>= md) */}
      <div className="hidden md:block cyber-card rounded-2xl overflow-hidden border border-red-500/20">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#0e0407]/90 border-b border-red-500/20 text-xs sm:text-sm font-mono uppercase text-slate-400 font-semibold">
                <th className="py-3.5 px-4">Threat Report</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Intel Source</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Indicators</th>
                <th className="py-3.5 px-4">Lead Analyst</th>
                <th className="py-3.5 px-4">Logged Date</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-red-500/15 text-sm">
              {filteredReports.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center py-10 text-slate-400 font-mono text-sm">
                    No threat reports match the filter criteria.
                  </td>
                </tr>
              ) : (
                filteredReports.map((rep) => (
                  <tr
                    key={rep.id}
                    onClick={() => onSelectReport(rep)}
                    className="hover:bg-red-950/20 transition-colors cursor-pointer group"
                  >
                    <td className="py-4 px-4 font-medium text-slate-200 group-hover:text-red-300 max-w-xs truncate">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.7)] shrink-0"></span>
                        <span className="font-semibold text-white truncate text-sm sm:text-base">{rep.title}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 font-mono">
                      <span className="px-2.5 py-0.5 rounded-md bg-red-950/80 text-red-300 border border-red-800/60 text-xs font-semibold">
                        {rep.category?.name || 'General'}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-slate-300 font-mono text-xs sm:text-sm">
                      {rep.source?.name || 'Darknet Forum'}
                    </td>
                    <td className="py-4 px-4">
                      <StatusBadge status={rep.status} />
                    </td>
                    <td className="py-4 px-4 font-mono text-red-300 font-semibold text-xs sm:text-sm">
                      {rep.indicators?.length || 0} IOCs
                    </td>
                    <td className="py-4 px-4 text-slate-300 text-sm">
                      {rep.analyst?.name || 'SOC Analyst'}
                    </td>
                    <td className="py-4 px-4 text-slate-400 font-mono text-xs sm:text-sm">
                      {new Date(rep.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-4 text-right">
                      <button className="p-1.5 rounded text-red-400/70 group-hover:text-red-200 hover:bg-red-900/30 transition-colors">
                        <ChevronRight className="w-4.5 h-4.5" />
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
