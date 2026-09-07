import React from 'react';
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';

export default function Toast({ message, type = 'success', onClose }) {
  if (!message) return null;

  const typeConfig = {
    success: {
      icon: CheckCircle2,
      border: 'border-emerald-500/50 bg-emerald-950/90 text-emerald-200',
      iconColor: 'text-emerald-400'
    },
    warning: {
      icon: AlertTriangle,
      border: 'border-amber-500/50 bg-amber-950/90 text-amber-200',
      iconColor: 'text-amber-400'
    },
    error: {
      icon: AlertTriangle,
      border: 'border-rose-500/50 bg-rose-950/90 text-rose-200',
      iconColor: 'text-rose-400'
    },
    info: {
      icon: Info,
      border: 'border-cyan-500/50 bg-cyan-950/90 text-cyan-200',
      iconColor: 'text-cyan-400'
    }
  };

  const config = typeConfig[type] || typeConfig.info;
  const Icon = config.icon;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex items-center gap-3 px-4 py-3 rounded-xl border shadow-xl backdrop-blur-md animate-bounce-short">
      <div className={`flex items-center gap-3 px-4 py-2.5 rounded-lg border shadow-lg ${config.border}`}>
        <Icon className={`w-5 h-5 ${config.iconColor} shrink-0`} />
        <span className="text-xs sm:text-sm font-medium">{message}</span>
        {onClose && (
          <button 
            onClick={onClose} 
            className="ml-2 p-0.5 text-slate-400 hover:text-white rounded"
            aria-label="Dismiss alert"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
