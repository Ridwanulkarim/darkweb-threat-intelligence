import React, { useState } from 'react';
import { ShieldCheck, ShieldAlert, Key, User, Clock, Terminal, Activity } from 'lucide-react';
import StatusBadge from '../components/StatusBadge';

export default function AdminAuditView({ auditLogs = [], accessLogs = [] }) {
  const [activeSubTab, setActiveSubTab] = useState('audit');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold font-mono text-white flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-cyan-400" />
          SECURITY AUDIT & ACCESS LOGS
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Immutable audit trails of administrative security actions, firewall drop updates, and user session logins.
        </p>
      </div>

      {/* Subtab navigation */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveSubTab('audit')}
          className={`px-4 py-2 rounded-lg text-xs font-mono font-medium transition-all ${
            activeSubTab === 'audit'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-cyber-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Administrative Audit Logs ({auditLogs.length})
        </button>
        <button
          onClick={() => setActiveSubTab('access')}
          className={`px-4 py-2 rounded-lg text-xs font-mono font-medium transition-all ${
            activeSubTab === 'access'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-cyber-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          User Session Access Logs ({accessLogs.length})
        </button>
      </div>

      {activeSubTab === 'audit' ? (
        /* Audit Logs Table */
        <div className="cyber-card rounded-2xl overflow-hidden border border-slate-800">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-900/90 border-b border-slate-800 text-[11px] font-mono uppercase text-slate-400">
                  <th className="py-3 px-4">Event ID</th>
                  <th className="py-3 px-4">Operator / Admin</th>
                  <th className="py-3 px-4">Action Performed</th>
                  <th className="py-3 px-4">Target Resource</th>
                  <th className="py-3 px-4 text-right">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-xs font-mono">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-850/60 transition-colors">
                    <td className="py-3.5 px-4 text-slate-500 font-bold">{log.id}</td>
                    <td className="py-3.5 px-4 text-slate-200 font-semibold">{log.admin}</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-800/60 font-medium">
                        {log.action}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-300 max-w-sm truncate">{log.target}</td>
                    <td className="py-3.5 px-4 text-slate-500 text-right">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Access Logs Table */
        <div className="cyber-card rounded-2xl overflow-hidden border border-slate-800">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-900/90 border-b border-slate-800 text-[11px] font-mono uppercase text-slate-400">
                  <th className="py-3 px-4">Log ID</th>
                  <th className="py-3 px-4">User Account</th>
                  <th className="py-3 px-4">Assigned Role</th>
                  <th className="py-3 px-4">Source IP</th>
                  <th className="py-3 px-4">Auth Status</th>
                  <th className="py-3 px-4 text-right">Login Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-xs font-mono">
                {accessLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-850/60 transition-colors">
                    <td className="py-3.5 px-4 text-slate-500">{log.id}</td>
                    <td className="py-3.5 px-4 text-white font-medium">{log.user}</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800">
                        {log.role}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-cyan-400 font-semibold">{log.ip}</td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={log.status} />
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 text-right">
                      {new Date(log.loginTime).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
