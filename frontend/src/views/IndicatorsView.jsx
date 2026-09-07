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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold font-mono text-white flex items-center gap-2">
            <Crosshair className="w-5 h-5 text-cyan-400" />
            INDICATORS OF COMPROMISE (IOC EXPLORER)
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time feed of IPs, domains, hashes, and phishing URLs linked to darknet threat actors.
          </p>
        </div>

        <button
          onClick={handleExportJson}
          className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-mono flex items-center gap-1.5 transition-colors"
        >
          <Download className="w-4 h-4 text-cyan-400" />
          <span>Export STIX/JSON</span>
        </button>
      </div>

      {/* Interactive IOC Quick Scanner Box */}
      <div className="cyber-card rounded-2xl p-5 border border-cyan-500/30 bg-gradient-to-r from-cyan-950/20 via-[#0d1322] to-[#0d1322]">
        <h3 className="text-xs font-mono uppercase text-cyan-400 font-bold mb-2 flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5" />
          Quick IOC Lookup & Triage Tool
        </h3>
        <form onSubmit={handleScan} className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            placeholder="Enter an IP address, domain, file SHA-256 hash, or email to verify..."
            value={scanInput}
            onChange={(e) => setScanInput(e.target.value)}
            className="flex-1 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-mono text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400"
          />
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-mono font-bold transition-all shadow-cyber-sm shrink-0"
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
            <div>
              <p className="font-semibold">{scanResult.message}</p>
              {scanResult.items && (
                <div className="mt-2 space-y-1">
                  {scanResult.items.map(item => (
                    <div key={item.id} className="text-[11px] text-slate-300">
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
      <div className="cyber-card rounded-xl p-3 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search indicator value, report title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/60 font-mono"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          <span className="text-[11px] font-mono text-slate-500 uppercase mr-1 flex items-center gap-1">
            <Filter className="w-3 h-3" /> Type:
          </span>
          {types.map((tp) => (
            <button
              key={tp}
              onClick={() => setSelectedType(tp)}
              className={`px-2.5 py-1 rounded-md text-[11px] font-mono transition-all ${
                selectedType === tp
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-cyber-sm font-semibold'
                  : 'text-slate-400 hover:text-slate-200 bg-slate-900/80 border border-slate-800'
              }`}
            >
              {tp}
            </button>
          ))}
        </div>
      </div>

      {/* Indicators Grid */}
      <div className="cyber-card rounded-2xl overflow-hidden border border-slate-800">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900/90 border-b border-slate-800 text-[11px] font-mono uppercase text-slate-400">
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Indicator Value</th>
                <th className="py-3 px-4">Confidence</th>
                <th className="py-3 px-4">Classification</th>
                <th className="py-3 px-4">Associated Intel Report</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs">
              {filteredIndicators.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-10 text-slate-500 font-mono">
                    No indicators match the search criteria.
                  </td>
                </tr>
              ) : (
                filteredIndicators.map((ind) => (
                  <tr key={ind.id} className="hover:bg-slate-850/60 transition-colors">
                    <td className="py-3.5 px-4">
                      <StatusBadge status={ind.type} type="indicator" />
                    </td>
                    <td className="py-3.5 px-4 font-mono font-medium text-slate-100 max-w-sm truncate select-all">
                      {ind.value}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-cyan-400 font-bold">
                      {ind.confidence || '95%'}
                    </td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={ind.status || 'MALICIOUS'} />
                    </td>
                    <td className="py-3.5 px-4 text-slate-400 max-w-xs truncate">
                      {ind.reportTitle || `Threat Report #${ind.reportId}`}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleCopy(ind.id, ind.value)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-300 hover:bg-slate-800 transition-colors inline-flex items-center gap-1 text-[11px] font-mono"
                        title="Copy indicator value"
                      >
                        {copiedId === ind.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                        <span className="hidden sm:inline">
                          {copiedId === ind.id ? 'Copied' : 'Copy'}
                        </span>
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
