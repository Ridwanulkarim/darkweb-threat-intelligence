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
  Bell,
  Menu,
  X,
  Plus
} from 'lucide-react';
import { api } from '../api/client';

export default function Navbar({ 
  simulationMode, 
  setSimulationMode, 
  currentUser, 
  setCurrentUser,
  onOpenAuthModal,
  onOpenNewReportModal,
  mobileMenuOpen,
  setMobileMenuOpen
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
    <header className="sticky top-0 z-40 bg-[#0a051d]/85 backdrop-blur-xl border-b border-purple-500/20 px-3 sm:px-6 py-2.5">
      <div className="flex items-center justify-between gap-2 sm:gap-4">
        {/* Left: Mobile Menu Toggle & Branding */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Mobile Drawer Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-purple-300 hover:text-white bg-purple-950/40 border border-purple-500/25 active:scale-95 transition-all touch-manipulation"
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          >
            {mobileMenuOpen ? <X className="w-5 h-5 text-purple-300" /> : <Menu className="w-5 h-5 text-purple-300" />}
          </button>

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-purple-500/15 border border-purple-500/40 flex items-center justify-center text-purple-300 shadow-[0_0_20px_rgba(168,85,247,0.3)] shrink-0">
              <ShieldAlert className="w-4 h-4 sm:w-5 sm:h-5 animate-pulse text-purple-400" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="font-bold tracking-tight text-white text-base sm:text-lg">
                  DARK<span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-violet-300 to-indigo-300">WEB</span>
                </span>
                <span className="text-xs font-mono uppercase px-1.5 py-0.5 rounded bg-purple-950/80 text-purple-300 border border-purple-800/60 shadow-[0_0_10px_rgba(147,51,234,0.2)]">
                  CTI
                </span>
              </div>
              <p className="text-xs font-mono text-purple-300/70 hidden sm:block">
                DEFENSE TELEMETRY & INCIDENT OPS
              </p>
            </div>
          </div>

          {/* Real-time Ticker (Desktop only) */}
          <div className="hidden xl:flex items-center gap-2 ml-6 px-3.5 py-1.5 rounded-full bg-[#120a2e]/80 border border-purple-500/25 text-sm shadow-inner">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
            </span>
            <span className="text-purple-300 font-mono text-xs font-semibold">LIVE INTEL:</span>
            <span className="text-slate-200 truncate max-w-md text-xs sm:text-sm font-mono">
              Tor Hidden Service Dread: New breach paste reported across European logistics nodes
            </span>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          {/* Quick Action: New Threat */}
          <button
            onClick={onOpenNewReportModal}
            className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-lg bg-gradient-to-r from-purple-600 via-indigo-600 to-violet-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs sm:text-sm font-semibold shadow-[0_0_20px_rgba(147,51,234,0.35)] transition-all active:scale-95 border border-purple-400/30 touch-manipulation"
            title="Ingest new threat report"
          >
            <Plus className="w-4 h-4 text-purple-200 shrink-0" />
            <span className="hidden sm:inline">New Intel</span>
          </button>

          {/* Simulation vs Live API Toggle */}
          <div className="flex items-center bg-[#100726]/80 border border-purple-500/25 rounded-lg p-0.5 text-xs sm:text-sm font-mono">
            <button
              onClick={handleToggleMode}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-all touch-manipulation text-xs sm:text-sm font-medium ${
                simulationMode 
                  ? 'bg-purple-600/30 text-purple-200 border border-purple-500/50 shadow-[0_0_12px_rgba(168,85,247,0.25)]' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Runs with rich dark web simulated intelligence datasets"
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-400 shrink-0" />
              <span className="hidden xs:inline">Sim</span>
              <span className="hidden sm:inline">ulated</span>
            </button>
            <button
              onClick={handleToggleMode}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-all touch-manipulation text-xs sm:text-sm font-medium ${
                !simulationMode 
                  ? 'bg-indigo-600/30 text-indigo-200 border border-indigo-500/50 shadow-[0_0_12px_rgba(99,102,241,0.25)]' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Connects directly to Express backend on localhost:3000/api"
            >
              <Server className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
              <span>Live</span>
              <span className="hidden sm:inline"> API</span>
            </button>
          </div>

          {/* Backend Connection Badge */}
          <button
            onClick={checkHealth}
            disabled={checkingHealth}
            className={`hidden lg:flex items-center gap-1.5 px-3 py-1 rounded-md border text-xs font-mono transition-colors ${
              backendOnline 
                ? 'bg-emerald-950/40 text-emerald-400 border-emerald-800/60 hover:bg-emerald-950/70' 
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:bg-slate-850'
            }`}
            title="Click to check backend status (localhost:3000/health)"
          >
            <span className={`w-2 h-2 rounded-full ${backendOnline ? 'bg-emerald-400 animate-pulse' : 'bg-slate-600'}`} />
            <span className="font-semibold">API: {backendOnline ? 'ONLINE' : 'STANDALONE'}</span>
            <RefreshCw className={`w-3 h-3 ml-1 ${checkingHealth ? 'animate-spin text-purple-400' : 'text-slate-500'}`} />
          </button>

          {/* User Profile / Auth */}
          {currentUser ? (
            <div className="relative">
              <button
                onClick={() => setUserDropdown(!userDropdown)}
                className="flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-lg bg-[#120a2e]/80 border border-purple-500/30 hover:border-purple-500/60 text-xs sm:text-sm font-mono text-purple-200 transition-colors touch-manipulation"
              >
                <div className="w-6 h-6 rounded-full bg-purple-500/25 text-purple-200 flex items-center justify-center font-bold text-xs border border-purple-400/40 shrink-0">
                  {currentUser.name ? currentUser.name[0] : 'U'}
                </div>
                <span className="hidden md:inline max-w-[120px] truncate font-medium">{currentUser.name}</span>
                <span className="text-xs text-purple-300 bg-purple-950/80 px-1.5 py-0.5 rounded border border-purple-700/50 hidden xs:inline font-semibold">
                  {currentUser.role || 'ANALYST'}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-purple-400/60" />
              </button>

              {userDropdown && (
                <div className="absolute right-0 mt-2 w-52 rounded-xl bg-[#0e0724] border border-purple-500/30 shadow-2xl p-1.5 z-50 text-xs sm:text-sm font-mono backdrop-blur-xl">
                  <div className="px-3 py-2 border-b border-purple-500/20 mb-1">
                    <p className="font-semibold text-white truncate text-sm">{currentUser.name}</p>
                    <p className="text-xs text-purple-300/70 truncate mt-0.5">{currentUser.email}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-rose-400 hover:bg-rose-950/30 transition-colors touch-manipulation text-xs sm:text-sm font-medium"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={onOpenAuthModal}
              className="flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 rounded-lg bg-[#120a2e]/80 hover:bg-[#1a0f3d] border border-purple-500/30 text-xs sm:text-sm font-mono text-purple-200 transition-colors touch-manipulation font-medium"
            >
              <LogIn className="w-4 h-4 text-purple-400" />
              <span className="hidden xs:inline">SOC Login</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
