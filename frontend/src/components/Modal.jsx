import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export default function Modal({ isOpen, onClose, title, children, maxWidth = 'max-w-2xl' }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Container */}
      <div 
        className={`relative w-full ${maxWidth} cyber-card bg-[#0e0407] border border-red-500/30 rounded-2xl shadow-2xl overflow-hidden z-10 my-4 sm:my-8 max-h-[90dvh] flex flex-col`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 border-b border-red-500/20 bg-[#0a0305]/90 shrink-0">
          <h3 id="modal-title" className="text-xs sm:text-sm font-semibold text-red-200 font-mono flex items-center gap-2 truncate pr-2">
            <span className="inline-block w-2 h-2 rounded-full bg-red-400 animate-pulse shrink-0"></span>
            <span className="truncate">{title}</span>
          </h3>
          <button
            onClick={onClose}
            className="text-red-300/70 hover:text-white p-1.5 rounded-lg hover:bg-red-900/40 transition-colors shrink-0 touch-manipulation"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content with dynamic scroll */}
        <div className="p-4 sm:p-6 overflow-y-auto text-xs sm:text-sm text-slate-300 space-y-4 flex-1">
          {children}
        </div>
      </div>
    </div>
  );
}
