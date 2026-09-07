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
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold font-mono text-white flex items-center gap-2">
          <DatabaseZap className="w-5 h-5 text-cyan-400" />
          EXFILTRATED DATA LEAKS & COMPROMISED CREDENTIALS
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Archived database dumps, SQL exfiltrations, and compromised credentials intercepted from darknet forums.
        </p>
      </div>

      {/* Interactive Domain / Email Credential Exposure Lookup */}
      <div className="cyber-card rounded-2xl p-5 border border-purple-500/30 bg-gradient-to-r from-purple-950/20 via-[#0d1322] to-[#0d1322]">
        <div className="flex items-center gap-2 text-purple-400 font-mono text-xs font-bold mb-2 uppercase">
          <Lock className="w-3.5 h-3.5" />
          Dark Web Credential & Domain Breach Query
        </div>
        <form onSubmit={handleSearchCreds} className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            placeholder="Search domain (e.g. telecom-global.eu, fincorp) or specific email address..."
            value={credSearch}
            onChange={(e) => setCredSearch(e.target.value)}
            className="flex-1 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-mono text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-400"
          />
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-mono font-bold transition-all shadow-cyber-sm shrink-0"
          >
            Query Darknet Dumps
          </button>
        </form>

        {credSearchResult && (
          <div className={`mt-3 p-3 rounded-xl border text-xs font-mono ${
            credSearchResult.count > 0 
              ? 'bg-rose-950/50 border-rose-800/80 text-rose-300' 
              : 'bg-emerald-950/50 border-emerald-800/80 text-emerald-300'
          }`}>
            <div className="flex items-center gap-2 font-bold mb-1">
              {credSearchResult.count > 0 ? (
                <AlertTriangle className="w-4 h-4 text-rose-400" />
              ) : (
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              )}
              <span>
                {credSearchResult.count > 0 
                  ? `COMPROMISED: ${credSearchResult.count} matching leaked credential(s) detected!` 
                  : `CLEAN: Zero compromised credentials found for "${credSearchResult.term}".`}
              </span>
            </div>

            {credSearchResult.matches?.length > 0 && (
              <div className="mt-2 space-y-1 text-slate-200">
                {credSearchResult.matches.map((m, idx) => (
                  <div key={idx} className="flex items-center justify-between bg-slate-900/80 p-2 rounded border border-slate-800">
                    <span className="font-mono text-white">{m.email}</span>
                    <span className="text-[11px] text-slate-400">Leak: {m.leakTitle} ({m.leakDate})</span>
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
          <span className="text-xs font-mono uppercase text-slate-400 font-semibold tracking-wider">
            Exfiltrated Database Archives ({filteredLeaks.length})
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {filteredLeaks.map((leak) => (
            <div 
              key={leak.id} 
              className="cyber-card rounded-2xl p-5 border border-slate-800 hover:border-cyan-500/30 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-800/60">
                    {leak.source || 'Breach Database'}
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">
                    {leak.leakDate}
                  </span>
                </div>

                <h3 className="text-sm font-bold font-mono text-white mb-2 line-clamp-2">
                  {leak.title}
                </h3>

                <div className="grid grid-cols-2 gap-2 my-3 p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs font-mono">
                  <div>
                    <span className="text-[10px] text-slate-500 block">RECORDS COUNT</span>
                    <span className="text-cyan-400 font-bold">
                      {leak.recordsCount?.toLocaleString() || 'N/A'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">DUMP SIZE</span>
                    <span className="text-slate-300 font-bold">{leak.fileSize || 'N/A'}</span>
                  </div>
                </div>

                {/* Fields exposed */}
                <div className="mb-4">
                  <span className="text-[10px] font-mono uppercase text-slate-500 block mb-1.5">
                    Exposed Data Fields
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {leak.fieldsExposed?.map((field, i) => (
                      <span 
                        key={i} 
                        className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-850 text-slate-300 border border-slate-700/60"
                      >
                        {field}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Sample credentials preview */}
                {leak.credentials && leak.credentials.length > 0 && (
                  <div>
                    <span className="text-[10px] font-mono uppercase text-slate-500 block mb-1.5">
                      Sample Leaked Accounts ({leak.credentials.length})
                    </span>
                    <div className="space-y-1.5">
                      {leak.credentials.map((cred) => (
                        <div 
                          key={cred.id} 
                          className="p-2 rounded bg-slate-900 border border-slate-800 text-xs font-mono flex items-center justify-between"
                        >
                          <span className="text-slate-200 truncate max-w-[140px] text-[11px]">{cred.email}</span>
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] text-slate-500">{cred.hashType}</span>
                            <button 
                              onClick={() => toggleMask(cred.id)}
                              className="text-slate-400 hover:text-cyan-300 p-0.5"
                              title="Toggle password mask"
                            >
                              {showMasked[cred.id] ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                            </button>
                            <span className="text-rose-400 text-[10px] font-bold">
                              {showMasked[cred.id] ? '$2b$10$9Gf...' : cred.maskedPass}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-500">
                <span>Format: {leak.format || 'SQL'}</span>
                <span className="text-cyan-400">Verified Leak</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
