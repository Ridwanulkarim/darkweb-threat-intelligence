import React, { useState } from 'react';
import { 
  DatabaseZap, 
  Search, 
  Lock, 
  Eye, 
  EyeOff, 
  FileText, 
  AlertTriangle, 
  CheckCircle2, 
  HardDrive
} from 'lucide-react';

export default function DataLeaksView({ leaks = [] }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showMasked, setShowMasked] = useState({});
  const [credSearch, setCredSearch] = useState('');
  const [credSearchResult, setCredSearchResult] = useState(null);

  const toggleMask = (id) => {
    setShowMasked(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSearchCreds = (e) => {
    e.preventDefault();
    if (!credSearch.trim()) return;

    const term = credSearch.trim().toLowerCase();
    const matches = [];

    leaks.forEach(leak => {
      leak.credentials?.forEach(cred => {
        if (cred.email.toLowerCase().includes(term)) {
          matches.push({ ...cred, leakTitle: leak.title, leakDate: leak.leakDate });
        }
      });
    });

    setCredSearchResult({
      searched: true,
      term: credSearch,
      count: matches.length,
      matches
    });
  };

  const filteredLeaks = leaks.filter(l => 
    l.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.source?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold font-mono text-white flex items-center gap-2">
          <DatabaseZap className="w-5 h-5 text-purple-400 shrink-0" />
          <span className="truncate">EXFILTRATED DATA LEAKS & COMPROMISED CREDENTIALS</span>
        </h2>
        <p className="text-sm text-purple-200/70 mt-1">
          Archived database dumps, SQL exfiltrations, and compromised credentials intercepted from darknet forums.
        </p>
      </div>

      {/* Interactive Domain / Email Credential Exposure Lookup */}
      <div className="cyber-card rounded-2xl p-4 sm:p-5 border border-purple-500/30 bg-gradient-to-r from-purple-950/20 via-[#0e0725] to-[#0e0725]">
        <div className="flex items-center gap-2 text-purple-300 font-mono text-sm font-bold mb-2.5 uppercase">
          <Lock className="w-4 h-4 text-purple-400" />
          Dark Web Credential & Domain Breach Query
        </div>
        <form onSubmit={handleSearchCreds} className="flex flex-col sm:flex-row gap-2.5">
          <input
            type="text"
            placeholder="Search domain (e.g. telecom-global.eu) or specific email address..."
            value={credSearch}
            onChange={(e) => setCredSearch(e.target.value)}
            className="flex-1 px-4 py-2.5 rounded-xl bg-[#09041a] border border-purple-500/25 text-sm font-mono text-purple-100 placeholder-purple-300/40 focus:outline-none focus:border-purple-400"
          />
          <button
            type="submit"
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-sm font-mono font-bold transition-all shadow-[0_0_15px_rgba(168,85,247,0.35)] shrink-0 touch-manipulation active:scale-95"
          >
            Query Darknet Dumps
          </button>
        </form>

        {credSearchResult && (
          <div className={`mt-3.5 p-3.5 rounded-xl border text-sm font-mono ${
            credSearchResult.count > 0 
              ? 'bg-rose-950/50 border-rose-800/80 text-rose-300' 
              : 'bg-emerald-950/50 border-emerald-800/80 text-emerald-300'
          }`}>
            <div className="flex items-center gap-2 font-bold mb-1.5">
              {credSearchResult.count > 0 ? (
                <AlertTriangle className="w-4.5 h-4.5 text-rose-400 shrink-0" />
              ) : (
                <CheckCircle2 className="w-4.5 h-4.5 text-emerald-400 shrink-0" />
              )}
              <span className="break-words">
                {credSearchResult.count > 0 
                  ? `COMPROMISED: ${credSearchResult.count} matching leaked credential(s) detected!` 
                  : `CLEAN: Zero compromised credentials found for "${credSearchResult.term}".`}
              </span>
            </div>

            {credSearchResult.matches?.length > 0 && (
              <div className="mt-2.5 space-y-2 text-slate-200">
                {credSearchResult.matches.map((m, idx) => (
                  <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between bg-[#0a041c] p-2.5 rounded-xl border border-purple-500/20 gap-1.5">
                    <span className="font-mono text-white break-all text-sm">{m.email}</span>
                    <span className="text-xs sm:text-sm text-purple-300/70">Leak: {m.leakTitle} ({m.leakDate})</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Leaks Feed */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-mono uppercase text-purple-300/70 font-semibold tracking-wider">
            Exfiltrated Database Archives ({filteredLeaks.length})
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {filteredLeaks.map((leak) => (
            <div 
              key={leak.id} 
              className="cyber-card rounded-2xl p-4 sm:p-5 border border-purple-500/20 hover:border-purple-500/40 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-xs font-mono uppercase px-2.5 py-0.5 rounded-md bg-purple-950/80 text-purple-300 border border-purple-800/60 font-semibold">
                    {leak.source || 'Breach Database'}
                  </span>
                  <span className="text-xs font-mono text-purple-400/60">
                    {leak.leakDate}
                  </span>
                </div>

                <h3 className="text-base font-bold font-mono text-white mb-2 line-clamp-2">
                  {leak.title}
                </h3>

                <div className="grid grid-cols-2 gap-2.5 my-3 p-3 rounded-xl bg-[#0a041c] border border-purple-500/15 text-sm font-mono">
                  <div>
                    <span className="text-xs text-purple-400/70 block mb-0.5">RECORDS COUNT</span>
                    <span className="text-purple-300 font-bold text-sm sm:text-base">
                      {leak.recordsCount?.toLocaleString() || 'N/A'}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs text-purple-400/70 block mb-0.5">DUMP SIZE</span>
                    <span className="text-slate-200 font-bold text-sm sm:text-base">{leak.fileSize || 'N/A'}</span>
                  </div>
                </div>

                {/* Fields exposed */}
                <div className="mb-4">
                  <span className="text-xs font-mono uppercase text-purple-300/70 block mb-1.5 font-semibold">
                    Exposed Data Fields
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {leak.fieldsExposed?.map((field, i) => (
                      <span 
                        key={i} 
                        className="text-xs font-mono px-2 py-0.5 rounded-md bg-[#150a36] text-purple-200 border border-purple-500/20 font-medium"
                      >
                        {field}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Sample credentials preview */}
                {leak.credentials && leak.credentials.length > 0 && (
                  <div>
                    <span className="text-xs font-mono uppercase text-purple-300/70 block mb-1.5 font-semibold">
                      Sample Leaked Accounts ({leak.credentials.length})
                    </span>
                    <div className="space-y-2">
                      {leak.credentials.map((cred) => (
                        <div 
                          key={cred.id} 
                          className="p-2.5 rounded-xl bg-[#0a041c] border border-purple-500/15 text-sm font-mono flex items-center justify-between gap-1.5"
                        >
                          <span className="text-slate-200 truncate max-w-[140px] sm:max-w-[170px] text-xs sm:text-sm select-all">{cred.email}</span>
                          <div className="flex items-center gap-2 shrink-0">
                            <span className="text-xs text-purple-400/60">{cred.hashType}</span>
                            <button 
                              onClick={() => toggleMask(cred.id)}
                              className="text-purple-300/70 hover:text-white p-1 touch-manipulation"
                              title="Toggle password mask"
                            >
                              {showMasked[cred.id] ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                            </button>
                            <span className="text-rose-400 text-xs font-bold font-mono">
                              {showMasked[cred.id] ? '$2b$10$9Gf...' : cred.maskedPass}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
