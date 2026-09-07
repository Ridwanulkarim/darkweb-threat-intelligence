import React from 'react';
import {
  LayoutDashboard,
  FileWarning,
  Crosshair,
  Users,
  DatabaseZap,
  AlertOctagon,
  SearchCheck,
  Bug,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Flame
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, counts = {}, collapsed, setCollapsed }) {
  const menuItems = [
    {
      id: 'overview',
      label: 'Command Center',
      icon: LayoutDashboard,
      badge: null,
      desc: 'SOC Operations & KPIs'
    },
    {
      id: 'reports',
      label: 'Threat Reports',
      icon: FileWarning,
      badge: counts.reports || 5,
      desc: 'Darknet intel stream'
    },
    {
      id: 'indicators',
      label: 'IOC Explorer',
      icon: Crosshair,
      badge: counts.indicators || 12,
      desc: 'IP, Hash, Domain indicators'
    },
    {
      id: 'groups',
      label: 'APT & Threat Actors',
      icon: Users,
      badge: counts.groups || 4,
      desc: 'Ransomware & state gangs'
    },
    {
      id: 'leaks',
      label: 'Data Leaks & Breaches',
      icon: DatabaseZap,
      badge: counts.leaks || 3,
      desc: 'Credential & DB dumps'
    },
    {
      id: 'incidents',
      label: 'Incident Response',
      icon: AlertOctagon,
      badge: counts.incidents || 4,
      badgeColor: 'bg-rose-950/80 text-rose-300 border-rose-800/60',
      desc: 'Containment & mitigation'
    },
    {
      id: 'investigations',
      label: 'Digital Forensics',
      icon: SearchCheck,
      badge: counts.investigations || 3,
      desc: 'Evidence & case analysis'
    },
    {
      id: 'malware',
      label: 'Malware Vault',
      icon: Bug,
      badge: counts.malware || 4,
      desc: 'Samples & family signatures'
    },
    {
      id: 'admin',
      label: 'Security Audit Logs',
      icon: ShieldCheck,
      badge: null,
      desc: 'Access logs & admin events'
    }
  ];

  return (
    <aside
      className={`relative z-30 flex flex-col border-r border-slate-800/80 bg-[#070b14]/95 transition-all duration-300 ease-in-out select-none ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Sidebar Header toggle */}
      <div className="flex items-center justify-between px-3 py-3 border-b border-slate-800/60">
        {!collapsed && (
          <span className="text-[11px] font-mono uppercase text-slate-500 font-semibold tracking-wider">
            Security Modules
          </span>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 rounded-md text-slate-400 hover:text-cyan-300 hover:bg-slate-800/80 transition-colors mx-auto"
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 py-3 px-2 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all group ${
                isActive
                  ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 shadow-cyber-sm font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-850 border border-transparent'
              }`}
              title={collapsed ? `${item.label} - ${item.desc}` : undefined}
            >
              <Icon
                className={`w-4 h-4 shrink-0 transition-transform ${
                  isActive ? 'text-cyan-400 scale-110' : 'text-slate-400 group-hover:text-cyan-300'
                }`}
              />
              {!collapsed && (
                <div className="flex-1 min-w-0 flex items-center justify-between">
                  <span className="text-xs font-medium truncate">{item.label}</span>
                  {item.badge !== null && item.badge !== undefined && (
                    <span
                      className={`text-[10px] font-mono px-1.5 py-0.2 rounded border ${
                        item.badgeColor || 'bg-slate-900 text-slate-400 border-slate-800'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </nav>

      {/* Sidebar Footer */}
      {!collapsed && (
        <div className="p-3 m-2 rounded-xl bg-slate-900/60 border border-slate-800/80 text-[11px] font-mono text-slate-400">
          <div className="flex items-center gap-1.5 text-cyan-400 font-semibold mb-1">
            <Flame className="w-3.5 h-3.5 animate-pulse text-amber-400" />
            <span>THREAT LEVEL: HIGH</span>
          </div>
          <p className="text-[10px] text-slate-500 leading-tight">
            Elevated Darknet Market activity observed in the past 24 hours.
          </p>
        </div>
      )}
    </aside>
  );
}
