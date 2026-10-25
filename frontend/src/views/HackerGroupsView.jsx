import React from 'react';
import { 
  Users, 
  Globe, 
  Target, 
  Flame, 
  Activity, 
  Clock, 
  ShieldAlert,
  ChevronRight
} from 'lucide-react';
import StatusBadge from '../components/StatusBadge';

export default function HackerGroupsView({ groups = [] }) {
  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h2 className="text-lg sm:text-xl font-bold font-mono text-white flex items-center gap-2">
          <Users className="w-5 h-5 text-purple-400 shrink-0" />
          <span className="truncate">APT GROUPS & ADVERSARY INTELLIGENCE</span>
        </h2>
        <p className="text-sm text-purple-200/70 mt-1">
          Tracking state-sponsored advanced persistent threats (APTs), Ransomware-as-a-Service cartels, and initial access brokers.
        </p>
      </div>

      {/* Adversary Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
        {groups.map((group) => (
          <div 
            key={group.id} 
            className="cyber-card rounded-2xl p-4 sm:p-5 border border-purple-500/20 hover:border-purple-500/40 transition-all flex flex-col justify-between space-y-4"
          >
            <div>
              {/* Card Header */}
              <div className="flex items-start justify-between gap-3 mb-2">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-xs font-mono uppercase px-2 py-0.5 rounded-md bg-rose-950/70 text-rose-300 border border-rose-800/60 font-semibold">
                      THREAT ACTOR
                    </span>
                    <StatusBadge status={group.status || 'ACTIVE'} />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-white font-mono flex items-center gap-2">
                    {group.name}
                  </h3>
                  {group.alias && (
                    <p className="text-sm font-mono text-purple-300 font-medium mt-0.5">
                      AKA: {group.alias}
                    </p>
                  )}
                </div>
                <div className="w-11 h-11 rounded-xl bg-purple-950/40 border border-purple-500/25 flex items-center justify-center text-rose-400 shrink-0">
                  <Flame className="w-5 h-5" />
                </div>
              </div>

              {/* Profile Meta */}
              <div className="grid grid-cols-2 gap-2 text-sm font-mono py-2.5 border-y border-purple-500/15 my-3">
                <div>
                  <span className="text-purple-400/70 block text-xs uppercase font-semibold mb-0.5">Country / Origin</span>
                  <span className="text-slate-100 font-medium">{group.origin || 'Unknown'}</span>
                </div>
                <div>
                  <span className="text-purple-400/70 block text-xs uppercase font-semibold mb-0.5">Primary Motivation</span>
                  <span className="text-slate-100 font-medium">{group.motivation || 'Financial / Extortion'}</span>
                </div>
              </div>

              {/* Targeted Sectors */}
              <div className="mb-4">
                <span className="text-xs sm:text-sm font-mono text-purple-300/80 uppercase tracking-wider block mb-1.5 flex items-center gap-1.5 font-semibold">
                  <Target className="w-3.5 h-3.5 text-purple-400" /> Target Sectors:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {group.targetSectors?.map((sec, idx) => (
                    <span 
                      key={idx}
                      className="px-2.5 py-1 rounded-lg bg-[#0a041c] text-purple-200 border border-purple-500/20 text-xs font-mono font-medium"
                    >
                      {sec}
                    </span>
                  ))}
                </div>
              </div>

              {/* Known Recent Activities & TTPs */}
              <div>
                <span className="text-xs sm:text-sm font-mono text-purple-300/80 uppercase tracking-wider block mb-2 flex items-center gap-1.5 font-semibold">
                  <Activity className="w-3.5 h-3.5 text-amber-400" /> Recent Tactics & Activities (TTPs):
                </span>
                <div className="space-y-2.5">
                  {group.activities?.map((act) => (
                    <div 
                      key={act.id} 
                      className="p-3 rounded-xl bg-[#0a041c] border border-purple-500/15 text-sm font-mono"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="px-2 py-0.5 rounded-md bg-purple-950/80 text-purple-300 border border-purple-800/60 text-xs font-semibold">
                          {act.type}
                        </span>
                        <span className="text-xs text-purple-400/60 flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {act.date}
                        </span>
                      </div>
                      <p className="text-slate-200 text-xs sm:text-sm break-words mt-1">
                        {act.details}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="pt-2.5 border-t border-purple-500/15 flex items-center justify-between text-xs sm:text-sm font-mono text-purple-300/80">
              <span className="text-emerald-400 font-semibold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                Live Monitoring Active
              </span>
              <span className="text-purple-400/60">ID: {group.id}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
