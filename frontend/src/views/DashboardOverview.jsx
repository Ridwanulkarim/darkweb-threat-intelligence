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
  Lock,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Activity
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
    <div className="space-y-8 relative">
      {/* 
        HERO SECTION: Exactly matching the "Cybersecurity Landing page - UI Design"
        "Defining Security Standards for Safer Systems"
      */}
      <section className="relative pt-6 pb-8 text-center flex flex-col items-center justify-center">
        {/* Glowing Pill Tag */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-950/60 border border-purple-500/30 text-purple-200 text-xs font-mono shadow-[0_0_20px_rgba(168,85,247,0.25)] mb-5 backdrop-blur-md">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
          </span>
          <span className="text-purple-300 font-medium">Innovating Cyber Threat Intelligence</span>
          <span className="text-purple-400/50">•</span>
          <span className="text-purple-300/80">Next-Gen Defense Standards</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight max-w-4xl leading-tight md:leading-[1.15] px-2">
          Defining Security Standards <br className="hidden sm:inline" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-violet-200 to-indigo-300 drop-shadow-[0_0_25px_rgba(168,85,247,0.35)]">
            for Safer Systems
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mt-3 sm:mt-4 text-xs sm:text-base text-purple-200/70 max-w-2xl leading-relaxed font-sans px-3">
          These standards act as a foundation, guiding organizations in implementing best practices to protect sensitive data, monitor onion marketplaces, and thwart cyber threats.
        </p>

        {/* Call-to-Action Buttons */}
        <div className="mt-5 sm:mt-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 w-full max-w-xs sm:max-w-none px-4">
          <button
            onClick={onOpenNewReportModal}
            className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-gradient-to-r from-purple-600 via-indigo-600 to-violet-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-xs sm:text-sm shadow-[0_0_25px_rgba(168,85,247,0.45)] transition-all flex items-center justify-center gap-2 group active:scale-95 border border-purple-400/30 touch-manipulation"
          >
            <span>Ingest Threat Intel</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1 shrink-0" />
          </button>
          <button
            onClick={() => onNavigateTab('reports')}
            className="w-full sm:w-auto px-5 py-2.5 rounded-full bg-[#120a2e]/80 hover:bg-[#1a0f3d] border border-purple-500/30 text-purple-200 font-medium text-xs sm:text-sm backdrop-blur-md transition-all flex items-center justify-center gap-2 touch-manipulation"
          >
            <Radio className="w-4 h-4 text-purple-400 shrink-0" />
            <span>Explore Darknet Feeds</span>
          </button>
        </div>

        {/* 3 Hero Metric Highlights */}
        <div className="mt-8 sm:mt-10 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 w-full max-w-3xl">
          <div className="cyber-card rounded-2xl p-4 text-center">
            <p className="text-xs uppercase tracking-wider text-purple-300/70 font-mono">Monitored IOCs</p>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white font-mono mt-1 drop-shadow">
              {totalIndicators > 0 ? `${totalIndicators} Tracked` : '1,280+ Active'}
            </h3>
            <p className="text-[11px] text-purple-300/50 mt-1">IPs, Hashes & Domains</p>
          </div>
          <div className="cyber-card rounded-2xl p-4 text-center border-purple-500/40 shadow-[0_0_20px_rgba(168,85,247,0.2)]">
            <p className="text-xs uppercase tracking-wider text-purple-300/70 font-mono">Threat Posture</p>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white font-mono mt-1 drop-shadow text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-indigo-200">
              DEFCON 2
            </h3>
            <p className="text-[11px] text-purple-300/50 mt-1">Active Darknet Monitoring</p>
          </div>
          <div className="cyber-card rounded-2xl p-4 text-center">
            <p className="text-xs uppercase tracking-wider text-purple-300/70 font-mono">Breach Interception</p>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white font-mono mt-1 drop-shadow">
              99.98% Uptime
            </h3>
            <p className="text-[11px] text-purple-300/50 mt-1">0ms Zero-Day Latency</p>
          </div>
        </div>
      </section>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Active Threat Intel"
          value={activeReports}
          subtext="Confirmed & Under Investigation"
          icon={ShieldAlert}
          trend="+18% vs last week"
          color="purple"
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
          subtext="IPs, Domains, Hashes"
          icon={Cpu}
          trend="+34 scanned"
          color="emerald"
        />
        <MetricCard
          title="Monitored APT Groups"
          value={activeGroups}
          subtext="State-sponsored & RaaS cartels"
          icon={Users}
          trend="LockBit & BlackCat active"
          color="purple"
        />
      </div>

      {/* Visual Analytics & Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Live Darkweb Threat Stream */}
        <div className="lg:col-span-2 cyber-card rounded-2xl p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-purple-500/20">
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-amber-400 animate-pulse" />
              <h3 className="text-sm font-bold font-mono text-white tracking-wide uppercase">
                Active Intelligence Reports Feed
              </h3>
            </div>
            <button
              onClick={() => onNavigateTab('reports')}
              className="text-xs font-mono text-purple-300 hover:text-white flex items-center gap-1 transition-colors"
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
                className="p-3.5 rounded-xl bg-[#0e0725]/70 border border-purple-500/20 hover:border-purple-500/50 hover:bg-[#150a36]/80 transition-all cursor-pointer group shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      <StatusBadge status={rep.status} />
                      <span className="text-[11px] font-mono text-purple-300 bg-purple-950/60 px-2 py-0.5 rounded border border-purple-800/50">
                        {rep.category?.name || 'Threat'}
                      </span>
                      <span className="text-[10px] text-purple-400/60 font-mono">
                        {new Date(rep.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <h4 className="text-sm font-semibold text-purple-100 group-hover:text-purple-300 transition-colors line-clamp-1 font-mono">
                      {rep.title}
                    </h4>
                    <p className="text-xs text-purple-200/60 mt-1 line-clamp-2 font-sans">
                      {rep.description}
                    </p>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-purple-400/50 group-hover:text-purple-300 shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>

                {/* Sub info */}
                <div className="mt-3 pt-2.5 border-t border-purple-500/15 flex flex-wrap items-center justify-between text-[11px] font-mono text-purple-300/70 gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-purple-400/50">Source:</span>
                    <span className="text-purple-200">{rep.source?.name}</span>
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
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-purple-500/20">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-purple-400" />
                <h3 className="text-sm font-bold font-mono text-white tracking-wide uppercase">
                  Indicator Telemetry
                </h3>
              </div>
              <button
                onClick={() => onNavigateTab('indicators')}
                className="text-xs font-mono text-purple-300 hover:text-white flex items-center gap-1 transition-colors"
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
                        <span className="text-purple-200/80">{type} Addresses</span>
                      </div>
                      <span className="text-white font-bold">{count}</span>
                    </div>
                    <div className="w-full bg-[#100726] rounded-full h-1.5 overflow-hidden border border-purple-500/20">
                      <div
                        className="h-full bg-gradient-to-r from-purple-500 via-violet-400 to-indigo-400 rounded-full shadow-[0_0_8px_rgba(168,85,247,0.5)]"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Threat Actions */}
          <div className="pt-4 border-t border-purple-500/20 space-y-2">
            <p className="text-[11px] font-mono text-purple-300/60 uppercase tracking-wider">
              Tactical Response Actions
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => onNavigateTab('incidents')}
                className="p-2.5 rounded-xl bg-[#0e0725]/80 hover:bg-[#150a36] border border-purple-500/20 text-left transition-colors group"
              >
                <div className="flex items-center justify-between text-rose-400 mb-1">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <ArrowUpRight className="w-3 h-3 text-purple-400/50 group-hover:text-rose-400" />
                </div>
                <div className="text-xs font-mono font-medium text-white">Containment</div>
                <div className="text-[10px] text-purple-300/50">Review Cases</div>
              </button>
              <button
                onClick={() => onNavigateTab('leaks')}
                className="p-2.5 rounded-xl bg-[#0e0725]/80 hover:bg-[#150a36] border border-purple-500/20 text-left transition-colors group"
              >
                <div className="flex items-center justify-between text-purple-400 mb-1">
                  <Lock className="w-3.5 h-3.5" />
                  <ArrowUpRight className="w-3 h-3 text-purple-400/50 group-hover:text-purple-300" />
                </div>
                <div className="text-xs font-mono font-medium text-white">Credential Scan</div>
                <div className="text-[10px] text-purple-300/50">Darknet Dumps</div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
