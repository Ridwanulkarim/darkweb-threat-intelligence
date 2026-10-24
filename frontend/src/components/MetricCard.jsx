import React from 'react';

export default function MetricCard({ title, value, subtext, icon: Icon, trend, color = 'purple' }) {
  const colorMap = {
    purple: 'border-purple-500/40 text-purple-300 bg-purple-500/15 shadow-[0_0_15px_rgba(168,85,247,0.2)]',
    cyan: 'border-cyan-500/30 text-cyan-400 bg-cyan-500/10',
    red: 'border-rose-500/30 text-rose-400 bg-rose-500/10',
    amber: 'border-amber-500/30 text-amber-400 bg-amber-500/10',
    emerald: 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10',
  };

  const accentColor = colorMap[color] || colorMap.purple;

  return (
    <div className="cyber-card rounded-2xl p-5 relative overflow-hidden group">
      {/* Subtle top edge glow */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-purple-500/40 to-transparent" />
      
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[11px] uppercase tracking-wider text-purple-300/70 font-semibold mb-1 font-mono">
            {title}
          </p>
          <h3 className="text-2xl lg:text-3xl font-bold font-mono text-white tracking-tight drop-shadow-sm">
            {value}
          </h3>
          {subtext && (
            <p className="text-xs text-purple-200/60 mt-2 flex items-center gap-1.5 font-sans">
              {subtext}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-xl border ${accentColor} transition-all duration-300 group-hover:scale-110 group-hover:border-purple-400/60`}>
          {Icon && <Icon className="w-5 h-5" />}
        </div>
      </div>
      {trend && (
        <div className="mt-3 pt-3 border-t border-purple-500/15 flex items-center justify-between text-xs">
          <span className="text-purple-300/50 font-mono text-[11px]">24h Velocity</span>
          <span className={`font-mono text-xs font-semibold ${trend.startsWith('+') ? 'text-rose-400' : 'text-emerald-400'}`}>
            {trend}
          </span>
        </div>
      )}
    </div>
  );
}
