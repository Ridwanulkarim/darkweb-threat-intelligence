import React, { useState } from 'react';
import { 
  Crosshair, 
  Search, 
  Copy, 
  Check, 
  Download, 
  Filter, 
  ShieldCheck, 
  AlertOctagon,
  Sparkles
} from 'lucide-react';
import StatusBadge from '../components/StatusBadge';

export default function IndicatorsView({ indicators = [], onSelectReportById }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('ALL');
  const [copiedId, setCopiedId] = useState(null);

  // IOC quick scanner tool
  const [scanInput, setScanInput] = useState('');
  const [scanResult, setScanResult] = useState(null);

  const types = ['ALL', 'IP', 'DOMAIN', 'HASH', 'URL', 'EMAIL'];

  const filteredIndicators = indicators.filter((ind) => {
    const matchesSearch = 
      ind.value.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (ind.reportTitle && ind.reportTitle.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesType = selectedType === 'ALL' || ind.type === selectedType;

    return matchesSearch && matchesType;
  });

  const handleCopy = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleScan = (e) => {
    e.preventDefault();
    if (!scanInput.trim()) return;

    const query = scanInput.trim().toLowerCase();
    const found = indicators.filter(i => i.value.toLowerCase().includes(query));

    if (found.length > 0) {
      setScanResult({
        matched: true,
        count: found.length,
        items: found,
        message: `ALERT: Found ${found.length} matching malicious indicator(s) in database!`
      });
    } else {
      setScanResult({
        matched: false,
        count: 0,
        message: `NO THREAT MATCH: "${scanInput}" is not listed in active dark web intelligence feeds.`
      });
    }
  };

  const handleExportJson = () => {
    const blob = new Blob([JSON.stringify(filteredIndicators, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `threat-indicators-export-${Date.now()}.json`;
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h2 className="text-lg sm:text-xl font-bold font-mono text-white flex items-center gap-2">
            <Crosshair className="w-5 h-5 text-purple-400 shrink-0" />
            <span className="truncate">INDICATORS OF COMPROMISE (IOC EXPLORER)</span>
          </h2>
          <p className="text-xs text-purple-200/60 mt-0.5">
            Real-time feed of IPs, domains, hashes, and phishing URLs linked to darknet threat actors.
          </p>
        </div>

        <button
          onClick={handleExportJson}
          className="w-full sm:w-auto px-3.5 py-2 rounded-xl bg-[#120a2e] hover:bg-[#1a0f3d] text-purple-200 border border-purple-500/30 text-xs font-mono flex items-center justify-center gap-1.5 transition-colors touch-manipulation"
        >
          <Download className="w-4 h-4 text-purple-400" />
          <span>Export STIX/JSON</span>
        </button>
      </div>

      {/* Interactive IOC Quick Scanner Box */}
      <div className="cyber-card rounded-2xl p-4 sm:p-5 border border-purple-500/30 bg-gradient-to-r from-purple-950/20 via-[#0e0725] to-[#0e0725]">
        <h3 className="text-xs font-mono uppercase text-purple-300 font-bold mb-2 flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-purple-400" />
          Quick IOC Lookup & Triage Tool
        </h3>
        <form onSubmit={handleScan} className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            placeholder="Enter IP address, domain, file SHA-256 hash, or email to verify..."
            value={scanInput}
            onChange={(e) => setScanInput(e.target.value)}
            className="flex-1 px-4 py-2.5 rounded-xl bg-[#09041a] border border-purple-500/25 text-xs font-mono text-purple-100 placeholder-purple-300/40 focus:outline-none focus:border-purple-400"
          />
          <button
            type="submit"
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-mono font-bold transition-all shadow-[0_0_15px_rgba(168,85,247,0.35)] shrink-0 touch-manipulation active:scale-95"
          >
            Verify Threat
          </button>
        </form>

        {scanResult && (
          <div className={`mt-3 p-3 rounded-xl border text-xs font-mono flex items-start gap-2.5 ${
            scanResult.matched 
              ? 'bg-rose-950/50 border-rose-800/80 text-rose-300' 
              : 'bg-emerald-950/50 border-emerald-800/80 text-emerald-300'
          }`}>
            {scanResult.matched ? (
              <AlertOctagon className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            ) : (
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            )}
            <div className="min-w-0 flex-1">
              <p className="font-semibold break-words">{scanResult.message}</p>
              {scanResult.items && (
                <div className="mt-2 space-y-1">
                  {scanResult.items.map(item => (
                    <div key={item.id} className="text-[11px] text-slate-300 break-all">
                      • [{item.type}] <span className="font-bold text-white">{item.value}</span> — Linked to: {item.reportTitle}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Filter & Search */}
      <div className="cyber-card rounded-2xl p-3 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-purple-400/50 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search indicator value, report title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-[#09041a] border border-purple-500/25 text-sm text-purple-100 placeholder-purple-300/40 focus:outline-none focus:border-purple-400 font-mono"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          <span className="text-xs sm:text-sm font-mono text-purple-300/70 uppercase mr-1 flex items-center gap-1.5 shrink-0 font-semibold">
            <Filter className="w-3.5 h-3.5" /> Type:
          </span>
          {types.map((tp) => (
            <button
              key={tp}
              onClick={() => setSelectedType(tp)}
              className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-mono transition-all shrink-0 touch-manipulation ${
                selectedType === tp
                  ? 'bg-purple-600/30 text-purple-200 border border-purple-500/50 shadow-[0_0_10px_rgba(168,85,247,0.25)] font-semibold'
                  : 'text-purple-300/70 hover:text-purple-200 bg-[#0e0725] border border-purple-500/20'
              }`}
            >
              {tp}
            </button>
          ))}
        </div>
      </div>

      {/* 
        RESPONSIVE VIEW:
        1. Mobile Cards (< md)
        2. Desktop Table (>= md)
      */}

      {/* 1. Mobile Cards (< md) */}
      <div className="md:hidden space-y-3.5">
        {filteredIndicators.length === 0 ? (
          <div className="cyber-card rounded-2xl p-8 text-center text-purple-300/60 font-mono text-sm">
            No indicators match the search criteria.
          </div>
        ) : (
          filteredIndicators.map((ind) => (
            <div key={ind.id} className="cyber-card rounded-2xl p-4.5 space-y-3">
              <div className="flex items-center justify-between gap-2">
                <StatusBadge status={ind.type} type="indicator" />
                <div className="flex items-center gap-2.5">
                  <span className="text-xs font-mono text-purple-300/60 font-medium">Conf:</span>
                  <span className="text-sm font-mono font-bold text-purple-300">{ind.confidence || '95%'}</span>
                  <StatusBadge status={ind.status || 'MALICIOUS'} />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#09041a] border border-purple-500/20 font-mono text-sm text-purple-100 break-all select-all font-medium">
                {ind.value}
              </div>

              <div className="flex items-center justify-between pt-1 text-xs sm:text-sm font-mono">
                <span className="text-purple-300/70 truncate max-w-[200px]">
                  {ind.reportTitle || `Threat Report #${ind.reportId}`}
                </span>
                <button
                  onClick={() => handleCopy(ind.id, ind.value)}
                  className="px-3 py-1.5 rounded-lg bg-purple-950/50 hover:bg-purple-900/60 border border-purple-500/30 text-purple-200 inline-flex items-center gap-1.5 text-xs sm:text-sm touch-manipulation active:scale-95 font-medium"
                >
                  {copiedId === ind.id ? (
                    <Check className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Copy className="w-4 h-4 text-purple-300" />
                  )}
                  <span>{copiedId === ind.id ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* 2. Desktop Table (>= md) */}
      <div className="hidden md:block cyber-card rounded-2xl overflow-hidden border border-purple-500/20">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#0e0725]/90 border-b border-purple-500/20 text-xs sm:text-sm font-mono uppercase text-purple-300/70 font-semibold">
                <th className="py-3.5 px-4">Type</th>
                <th className="py-3.5 px-4">Indicator Value</th>
                <th className="py-3.5 px-4">Confidence</th>
                <th className="py-3.5 px-4">Classification</th>
                <th className="py-3.5 px-4">Associated Intel Report</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-purple-500/15 text-sm">
              {filteredIndicators.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-10 text-purple-300/60 font-mono text-sm">
                    No indicators match the search criteria.
                  </td>
                </tr>
              ) : (
                filteredIndicators.map((ind) => (
                  <tr key={ind.id} className="hover:bg-purple-950/30 transition-colors">
                    <td className="py-4 px-4">
                      <StatusBadge status={ind.type} type="indicator" />
                    </td>
                    <td className="py-4 px-4 font-mono font-medium text-purple-100 max-w-sm truncate select-all text-sm">
                      {ind.value}
                    </td>
                    <td className="py-4 px-4 font-mono text-purple-300 font-bold text-sm">
                      {ind.confidence || '95%'}
                    </td>
                    <td className="py-4 px-4">
                      <StatusBadge status={ind.status || 'MALICIOUS'} />
                    </td>
                    <td className="py-4 px-4 text-purple-300/80 max-w-xs truncate text-sm">
                      {ind.reportTitle || `Threat Report #${ind.reportId}`}
                    </td>
                    <td className="py-4 px-4 text-right">
                      <button
                        onClick={() => handleCopy(ind.id, ind.value)}
                        className="p-1.5 rounded-lg text-purple-300 hover:text-white hover:bg-purple-900/40 transition-colors inline-flex items-center gap-1.5 text-xs sm:text-sm font-mono touch-manipulation font-medium"
                        title="Copy indicator value"
                      >
                        {copiedId === ind.id ? (
                          <Check className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                        <span>{copiedId === ind.id ? 'Copied' : 'Copy'}</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
