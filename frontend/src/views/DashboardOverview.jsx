import React from 'react';
import {
  ShieldAlert,
  AlertTriangle,
  Users,
  Database,
  SearchCheck,
  Radio,
  ArrowUpRight,
  TrendingUp,
  Cpu,
  Flame,
  Globe,
  Lock
} from 'lucide-react';
import MetricCard from '../components/MetricCard';
import StatusBadge from '../components/StatusBadge';

export default function DashboardOverview({
  reports = [],
  indicators = [],
  incidents = [],
  groups = [],
  investigations = [],
  onSelectReport,
  onNavigateTab,
  onOpenNewReportModal
}) {
  const criticalIncidents = incidents.filter(i => i.severity === 'CRITICAL').length;
  const activeReports = reports.filter(r => r.status === 'CONFIRMED' || r.status === 'INVESTIGATING' || r.status === 'NEW').length;
  const totalIndicators = indicators.length;
  const activeGroups = groups.filter(g => g.status === 'ACTIVE').length;

  // IOC breakdown
  const indicatorCounts = indicators.reduce((acc, curr) => {
    acc[curr.type] = (acc[curr.type] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      {/* Top Banner / Tactical Alert */}
      <div className="cyber-card rounded-2xl p-5 border-l-4 border-l-cyan-400 bg-gradient-to-r from-cyan-950/20 via-[#0d1322] to-[#0d1322] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
            <Radio className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2 font-mono">
              SECURITY OPERATIONS COMMAND CENTER
              <span className="text-xs px-2 py-0.5 rounded bg-rose-950/80 text-rose-300 border border-rose-800/80 font-mono">
                DEFCON 2
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Dark web monitoring daemon is synchronizing Onion marketplaces, Telegram drop feeds, and forum dumps.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => onNavigateTab('incidents')}
            className="px-3.5 py-2 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 border border-rose-700/60 text-rose-300 text-xs font-mono font-medium flex items-center gap-1.5 transition-colors"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
            <span>{criticalIncidents} Critical Incidents</span>
          </button>
          <button
            onClick={onOpenNewReportModal}
            className="px-3.5 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-mono font-bold flex items-center gap-1.5 shadow-cyber-sm transition-all active:scale-95"
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Ingest Report</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Active Threat Intel"
          value={activeReports}
          subtext="Confirmed & Under Investigation"
          icon={ShieldAlert}
          trend="+18% vs last week"
          color="cyan"
        />
        <MetricCard
          title="Critical Incidents"
          value={criticalIncidents}
          subtext="Requiring immediate containment"
          icon={AlertTriangle}
          trend="+2 new today"
          color="red"
        />
        <MetricCard
          title="Tracked Indicators (IOCs)"
          value={totalIndicators}
          subtext="IPs, Domains, Hashes, Hashes"
          icon={Cpu}
          trend="+34 scanned"
          color="emerald"
        />
        <MetricCard
          title="Monitored APT Groups"
          value={activeGroups}
          subtext="State-sponsored & RaaS cartels"
          icon={Users}
          trend="LockBit & Scattered Spider active"
          color="purple"
        />
      </div>

      {/* Visual Analytics & Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Live Darkweb Threat Stream */}
        <div className="lg:col-span-2 cyber-card rounded-2xl p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-amber-400 animate-pulse" />
              <h3 className="text-sm font-bold font-mono text-white tracking-wide uppercase">
                Active Intelligence Reports Feed
              </h3>
            </div>
            <button
              onClick={() => onNavigateTab('reports')}
              className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
            >
              <span>View All Reports</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3 overflow-y-auto max-h-[380px] pr-1">
            {reports.slice(0, 4).map((rep) => (
              <div
                key={rep.id}
                onClick={() => onSelectReport(rep)}
                className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-cyan-500/40 hover:bg-slate-850/60 transition-all cursor-pointer group"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      <StatusBadge status={rep.status} />
                      <span className="text-[11px] font-mono text-cyan-400 bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-800/40">
                        {rep.category?.name || 'Threat'}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {new Date(rep.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <h4 className="text-sm font-semibold text-slate-200 group-hover:text-cyan-300 transition-colors line-clamp-1">
                      {rep.title}
                    </h4>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                      {rep.description}
                    </p>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-slate-600 group-hover:text-cyan-400 shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>

                {/* Sub info */}
                <div className="mt-3 pt-2.5 border-t border-slate-800/60 flex flex-wrap items-center justify-between text-[11px] font-mono text-slate-400 gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500">Source:</span>
                    <span className="text-slate-300">{rep.source?.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span>{rep.indicators?.length || 0} Indicators</span>
                    <span>Analyst: {rep.analyst?.name?.split(' ')[0] || 'Unassigned'}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Col: IOC Matrix & Severity Telemetry */}
        <div className="cyber-card rounded-2xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-bold font-mono text-white tracking-wide uppercase">
                  Indicator Telemetry
                </h3>
              </div>
              <button
                onClick={() => onNavigateTab('indicators')}
                className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
              >
                <span>Lookup</span>
                <ArrowUpRight className="w-3 h-3" />
              </button>
            </div>

            {/* IOC Type Bars */}
            <div className="space-y-3.5 mb-6">
              {['IP', 'DOMAIN', 'HASH', 'URL', 'EMAIL'].map((type) => {
                const count = indicatorCounts[type] || 0;
                const percent = Math.min(100, Math.round((count / Math.max(totalIndicators, 1)) * 100));
                return (
                  <div key={type} className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <div className="flex items-center gap-2">
                        <StatusBadge status={type} type="indicator" />
                        <span className="text-slate-400">{type} Addresses</span>
                      </div>
                      <span className="text-white font-bold">{count}</span>
                    </div>
                    <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden border border-slate-800">
                      <div
                        className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Threat Actions */}
          <div className="pt-4 border-t border-slate-800 space-y-2">
            <p className="text-[11px] font-mono text-slate-500 uppercase tracking-wider">
              Tactical Response Actions
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => onNavigateTab('incidents')}
                className="p-2.5 rounded-lg bg-slate-900 hover:bg-slate-850 border border-slate-800 text-left transition-colors group"
              >
                <div className="flex items-center justify-between text-rose-400 mb-1">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <ArrowUpRight className="w-3 h-3 text-slate-500 group-hover:text-rose-400" />
                </div>
                <div className="text-xs font-mono font-medium text-white">Containment</div>
                <div className="text-[10px] text-slate-500">Review Open Cases</div>
              </button>
              <button
                onClick={() => onNavigateTab('leaks')}
                className="p-2.5 rounded-lg bg-slate-900 hover:bg-slate-850 border border-slate-800 text-left transition-colors group"
              >
                <div className="flex items-center justify-between text-cyan-400 mb-1">
                  <Lock className="w-3.5 h-3.5" />
                  <ArrowUpRight className="w-3 h-3 text-slate-500 group-hover:text-cyan-400" />
                </div>
                <div className="text-xs font-mono font-medium text-white">Credential Scan</div>
                <div className="text-[10px] text-slate-500">Darknet Dumps</div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
