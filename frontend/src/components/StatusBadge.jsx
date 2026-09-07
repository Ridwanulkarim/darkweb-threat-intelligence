import React from 'react';

export default function StatusBadge({ status, type = 'status', className = '' }) {
  if (!status) return null;

  const normalized = String(status).toUpperCase();

  let styles = 'bg-slate-800/80 text-slate-300 border-slate-700';

  if (type === 'level' || type === 'severity') {
    switch (normalized) {
      case 'CRITICAL':
        styles = 'bg-red-950/70 text-red-400 border-red-800/80 animate-pulse';
        break;
      case 'ERROR':
        styles = 'bg-rose-950/60 text-rose-400 border-rose-800/60';
        break;
      case 'WARNING':
        styles = 'bg-amber-950/60 text-amber-300 border-amber-800/60';
        break;
      case 'INFO':
        styles = 'bg-cyan-950/60 text-cyan-300 border-cyan-800/60';
        break;
      default:
        styles = 'bg-slate-800 text-slate-300 border-slate-700';
    }
  } else if (type === 'indicator') {
    switch (normalized) {
      case 'IP':
        styles = 'bg-blue-950/70 text-blue-300 border-blue-800/60';
        break;
      case 'DOMAIN':
        styles = 'bg-purple-950/70 text-purple-300 border-purple-800/60';
        break;
      case 'HASH':
        styles = 'bg-emerald-950/70 text-emerald-300 border-emerald-800/60';
        break;
      case 'URL':
        styles = 'bg-yellow-950/70 text-yellow-300 border-yellow-800/60';
        break;
      case 'EMAIL':
        styles = 'bg-pink-950/70 text-pink-300 border-pink-800/60';
        break;
      default:
        styles = 'bg-slate-800 text-slate-300 border-slate-700';
    }
  } else {
    // General statuses
    switch (normalized) {
      case 'CONFIRMED':
      case 'ACTIVE':
      case 'MALICIOUS':
        styles = 'bg-red-950/60 text-red-300 border-red-700/60';
        break;
      case 'INVESTIGATING':
      case 'IN_PROGRESS':
      case 'OPEN':
        styles = 'bg-amber-950/60 text-amber-300 border-amber-700/60';
        break;
      case 'MITIGATED':
      case 'CONTAINED':
      case 'COMPLETED':
      case 'CLOSED':
        styles = 'bg-emerald-950/60 text-emerald-300 border-emerald-700/60';
        break;
      case 'NEW':
        styles = 'bg-cyan-950/60 text-cyan-300 border-cyan-700/60';
        break;
      case 'SUSPICIOUS':
        styles = 'bg-orange-950/60 text-orange-300 border-orange-700/60';
        break;
      default:
        styles = 'bg-slate-800 text-slate-300 border-slate-700';
    }
  }

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-mono font-medium border ${styles} ${className}`}
    >
      {normalized}
    </span>
  );
}
