import React from 'react';

export default function MetricCard({ title, value, subtext, icon: Icon, trend, color = 'cyan' }) {
  const colorMap = {
    cyan: 'border-cyan-500/30 text-cyan-400 bg-cyan-500/10',
    red: 'border-rose-500/30 text-rose-400 bg-rose-500/10',
    amber: 'border-amber-500/30 text-amber-400 bg-amber-500/10',
    emerald: 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10',
    purple: 'border-purple-500/30 text-purple-400 bg-purple-500/10',
  };

  const accentColor = colorMap[color] || colorMap.cyan;

  return (
    <div className="cyber-card rounded-xl p-5 relative overflow-hidden group">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-1">
            {title}
          </p>
          <h3 className="text-2xl lg:text-3xl font-bold font-mono text-white tracking-tight">
            {value}
          </h3>
          {subtext && (
            <p className="text-xs text-slate-400 mt-2 flex items-center gap-1.5">
              {subtext}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-lg border ${accentColor} transition-transform duration-300 group-hover:scale-110`}>
          {Icon && <Icon className="w-5 h-5" />}
        </div>
      </div>
      {trend && (
        <div className="mt-3 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs">
          <span className="text-slate-500">24h Velocity</span>
          <span className={`font-mono font-medium ${trend.startsWith('+') ? 'text-rose-400' : 'text-emerald-400'}`}>
            {trend}
          </span>
        </div>
      )}
    </div>
  );
}
