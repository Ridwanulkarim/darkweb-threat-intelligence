import React, { useState } from 'react';
import { ShieldCheck, ShieldAlert, Key, User, Clock, Terminal, Activity } from 'lucide-react';
import StatusBadge from '../components/StatusBadge';

export default function AdminAuditView({ auditLogs = [], accessLogs = [] }) {
  const [activeSubTab, setActiveSubTab] = useState('audit');

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h2 className="text-lg sm:text-xl font-bold font-mono text-white flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-purple-400 shrink-0" />
          <span className="truncate">SECURITY AUDIT & ACCESS LOGS</span>
        </h2>
        <p className="text-xs text-purple-200/60 mt-0.5">
          Immutable audit trails of administrative security actions, firewall drop updates, and user session logins.
        </p>
      </div>

      {/* Subtab navigation */}
      <div className="flex items-center gap-2 border-b border-purple-500/20 pb-2 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveSubTab('audit')}
          className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-mono font-medium transition-all shrink-0 touch-manipulation ${
            activeSubTab === 'audit'
              ? 'bg-purple-600/30 text-purple-200 border border-purple-500/50 shadow-[0_0_12px_rgba(168,85,247,0.25)] font-bold'
              : 'text-purple-300/60 hover:text-purple-200 bg-[#0e0725] border border-purple-500/20'
          }`}
        >
          Administrative Audit Logs ({auditLogs.length})
        </button>
        <button
          onClick={() => setActiveSubTab('access')}
          className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-mono font-medium transition-all shrink-0 touch-manipulation ${
            activeSubTab === 'access'
              ? 'bg-purple-600/30 text-purple-200 border border-purple-500/50 shadow-[0_0_12px_rgba(168,85,247,0.25)] font-bold'
              : 'text-purple-300/60 hover:text-purple-200 bg-[#0e0725] border border-purple-500/20'
          }`}
        >
          Session Access Logs ({accessLogs.length})
        </button>
      </div>

      {activeSubTab === 'audit' ? (
        <>
          {/* Mobile Cards (< md) */}
          <div className="md:hidden space-y-3">
            {auditLogs.map((log) => (
              <div key={log.id} className="cyber-card rounded-2xl p-4 space-y-2">
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="text-purple-400 font-bold">{log.id}</span>
                  <span className="text-purple-300/50">{new Date(log.createdAt).toLocaleTimeString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-white font-mono">{log.admin}</span>
                  <span className="px-2 py-0.5 rounded bg-purple-950/70 text-purple-300 border border-purple-800/60 font-mono text-[10px]">
                    {log.action}
                  </span>
                </div>
                <p className="text-xs font-mono text-purple-200/70 break-all bg-[#0a041c] p-2 rounded-xl border border-purple-500/15">
                  Target: {log.target}
                </p>
              </div>
            ))}
          </div>

          {/* Desktop Table (>= md) */}
          <div className="hidden md:block cyber-card rounded-2xl overflow-hidden border border-purple-500/20">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#0e0725]/90 border-b border-purple-500/20 text-[11px] font-mono uppercase text-purple-300/60">
                    <th className="py-3 px-4">Event ID</th>
                    <th className="py-3 px-4">Operator / Admin</th>
                    <th className="py-3 px-4">Action Performed</th>
                    <th className="py-3 px-4">Target Resource</th>
                    <th className="py-3 px-4 text-right">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-purple-500/15 text-xs font-mono">
                  {auditLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-purple-950/30 transition-colors">
                      <td className="py-3.5 px-4 text-purple-400/60 font-bold">{log.id}</td>
                      <td className="py-3.5 px-4 text-purple-100 font-semibold">{log.admin}</td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded bg-purple-950/80 text-purple-300 border border-purple-800/60 font-medium">
                          {log.action}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-purple-200/80 max-w-sm truncate">{log.target}</td>
                      <td className="py-3.5 px-4 text-purple-300/50 text-right">
                        {new Date(log.createdAt).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        <>
          {/* Mobile Cards (< md) */}
          <div className="md:hidden space-y-3">
            {accessLogs.map((log) => (
              <div key={log.id} className="cyber-card rounded-2xl p-4 space-y-2">
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="text-purple-400 font-bold">{log.id}</span>
                  <StatusBadge status={log.status} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-white font-mono">{log.user}</span>
                  <span className="px-2 py-0.5 rounded bg-[#0a041c] text-purple-300 border border-purple-500/20 text-[10px] font-mono">
                    {log.role}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs font-mono text-purple-200/70 pt-1 border-t border-purple-500/15">
                  <span className="text-purple-300 font-semibold">{log.ip}</span>
                  <span className="text-purple-300/50">{new Date(log.loginTime).toLocaleTimeString()}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Table (>= md) */}
          <div className="hidden md:block cyber-card rounded-2xl overflow-hidden border border-purple-500/20">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#0e0725]/90 border-b border-purple-500/20 text-[11px] font-mono uppercase text-purple-300/60">
                    <th className="py-3 px-4">Log ID</th>
                    <th className="py-3 px-4">User Account</th>
                    <th className="py-3 px-4">Assigned Role</th>
                    <th className="py-3 px-4">Source IP</th>
                    <th className="py-3 px-4">Auth Status</th>
                    <th className="py-3 px-4 text-right">Login Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-purple-500/15 text-xs font-mono">
                  {accessLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-purple-950/30 transition-colors">
                      <td className="py-3.5 px-4 text-purple-400/60">{log.id}</td>
                      <td className="py-3.5 px-4 text-white font-medium">{log.user}</td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded bg-purple-950/60 text-purple-300 border border-purple-800/50">
                          {log.role}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-purple-300 font-semibold">{log.ip}</td>
                      <td className="py-3.5 px-4">
                        <StatusBadge status={log.status} />
                      </td>
                      <td className="py-3.5 px-4 text-purple-300/50 text-right">
                        {new Date(log.loginTime).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
