import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  Activity, 
  Radio, 
  Database, 
  Server, 
  User, 
  LogIn, 
  LogOut, 
  ChevronDown,
  Sparkles,
  RefreshCw,
  Bell
} from 'lucide-react';
import { api } from '../api/client';

export default function Navbar({ 
  simulationMode, 
  setSimulationMode, 
  currentUser, 
  setCurrentUser,
  onOpenAuthModal,
  onOpenNewReportModal
}) {
  const [backendOnline, setBackendOnline] = useState(false);
  const [checkingHealth, setCheckingHealth] = useState(false);
  const [userDropdown, setUserDropdown] = useState(false);

  const checkHealth = async () => {
    setCheckingHealth(true);
    const online = await api.checkBackendHealth();
    setBackendOnline(online);
    setCheckingHealth(false);
  };

  useEffect(() => {
    checkHealth();
    const timer = setInterval(checkHealth, 30000);
    return () => clearInterval(timer);
  }, []);

  const handleToggleMode = () => {
    const next = !simulationMode;
    api.setSimulationMode(next);
    setSimulationMode(next);
  };

  const handleLogout = () => {
    api.setToken(null, null);
    setCurrentUser(null);
    setUserDropdown(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#070b14]/90 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-6 py-2.5">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Branding & Status */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-cyber-sm">
              <ShieldAlert className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold tracking-tight text-white text-base">
                  DARK<span className="text-cyan-400">WEB</span>
                </span>
                <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-cyan-950/70 text-cyan-300 border border-cyan-800/50">
                  CTI Platform
                </span>
              </div>
              <p className="text-[10px] font-mono text-slate-500 hidden sm:block">
                DEFENSE TELEMETRY & INCIDENT OPS
              </p>
            </div>
          </div>

          {/* Real-time Ticker */}
          <div className="hidden xl:flex items-center gap-2 ml-6 px-3 py-1 rounded-full bg-slate-900/90 border border-slate-800 text-xs">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
            </span>
            <span className="text-slate-400 font-mono text-[11px]">LIVE INTEL:</span>
            <span className="text-slate-200 truncate max-w-md text-xs font-mono">
              Tor Hidden Service Dread: New breach paste reported across European logistics nodes
            </span>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2.5 sm:gap-3.5">
          {/* Quick Action: New Threat */}
          <button
            onClick={onOpenNewReportModal}
            className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 text-xs font-semibold shadow-cyber-sm transition-all active:scale-95"
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>New Intel Report</span>
          </button>

          {/* Simulation vs Live API Toggle */}
          <div className="flex items-center bg-[#0d1322] border border-slate-800 rounded-lg p-0.5 text-xs font-mono">
            <button
              onClick={handleToggleMode}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-all ${
                simulationMode 
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-cyber-sm' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Runs with rich dark web simulated intelligence datasets"
            >
              <Sparkles className="w-3 h-3 text-cyan-400" />
              <span>Simulated CTI</span>
            </button>
            <button
              onClick={handleToggleMode}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-all ${
                !simulationMode 
                  ? 'bg-blue-600/30 text-blue-300 border border-blue-500/40 shadow-cyber-sm' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Connects directly to Express backend on localhost:3000/api"
            >
              <Server className="w-3 h-3 text-blue-400" />
              <span>Live API</span>
            </button>
          </div>

          {/* Backend Connection Badge */}
          <button
            onClick={checkHealth}
            disabled={checkingHealth}
            className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-[11px] font-mono transition-colors ${
              backendOnline 
                ? 'bg-emerald-950/40 text-emerald-400 border-emerald-800/60 hover:bg-emerald-950/70' 
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:bg-slate-850'
            }`}
            title="Click to check backend status (localhost:3000/health)"
          >
            <span className={`w-1.5 h-1.5 rounded-full ${backendOnline ? 'bg-emerald-400 animate-pulse' : 'bg-slate-600'}`} />
            <span>API: {backendOnline ? '3000 ONLINE' : 'STANDALONE'}</span>
            <RefreshCw className={`w-2.5 h-2.5 ml-1 ${checkingHealth ? 'animate-spin text-cyan-400' : 'text-slate-500'}`} />
          </button>

          {/* User Profile / Auth */}
          {currentUser ? (
            <div className="relative">
              <button
                onClick={() => setUserDropdown(!userDropdown)}
                className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs font-mono text-slate-200"
              >
                <div className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-300 flex items-center justify-center font-bold text-[10px]">
                  {currentUser.name ? currentUser.name[0] : 'U'}
                </div>
                <span className="hidden md:inline max-w-[120px] truncate">{currentUser.name}</span>
                <span className="text-[10px] text-cyan-400 bg-cyan-950/60 px-1 py-0.2 rounded border border-cyan-800/40">
                  {currentUser.role || 'ANALYST'}
                </span>
                <ChevronDown className="w-3 h-3 text-slate-500" />
              </button>

              {userDropdown && (
                <div className="absolute right-0 mt-2 w-48 rounded-xl bg-[#0d1322] border border-slate-800 shadow-2xl p-1.5 z-50 text-xs font-mono">
                  <div className="px-3 py-2 border-b border-slate-800/80 mb-1">
                    <p className="font-semibold text-white truncate">{currentUser.name}</p>
                    <p className="text-[11px] text-slate-400 truncate">{currentUser.email}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-rose-400 hover:bg-rose-950/30 transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={onOpenAuthModal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-850 hover:bg-slate-800 border border-slate-700 text-xs font-mono text-cyan-300 transition-colors"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>SOC Login</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
