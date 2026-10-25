import React, { useState } from 'react';
import { 
  SearchCheck, 
  FileText, 
  Hash, 
  Clock, 
  Plus, 
  ShieldCheck, 
  User, 
  CheckCircle,
  HardDrive,
  ArrowLeft,
  ChevronRight
} from 'lucide-react';
import StatusBadge from '../components/StatusBadge';

export default function InvestigationsView({ investigations = [], onNotify }) {
  const [invList, setInvList] = useState(investigations);
  const [selectedInv, setSelectedInv] = useState(investigations[0] || null);
  const [newEvidenceFile, setNewEvidenceFile] = useState('');
  const [newEvidenceHash, setNewEvidenceHash] = useState('');
  const [mobileView, setMobileView] = useState('list'); // 'list' | 'detail'

  const handleSelectCase = (inv) => {
    setSelectedInv(inv);
    setMobileView('detail');
  };

  const handleAddEvidence = (e) => {
    e.preventDefault();
    if (!newEvidenceFile.trim() || !selectedInv) return;

    const newEvidence = {
      id: `ev-${Date.now().toString().slice(-4)}`,
      fileName: newEvidenceFile.trim(),
      sha256: newEvidenceHash.trim() || 'e3b0c44...sample',
      uploadedAt: new Date().toISOString()
    };

    const updated = invList.map(inv => {
      if (inv.id === selectedInv.id) {
        return {
          ...inv,
          evidenceList: [...(inv.evidenceList || []), newEvidence]
        };
      }
      return inv;
    });

    setInvList(updated);
    setSelectedInv({
      ...selectedInv,
      evidenceList: [...(selectedInv.evidenceList || []), newEvidence]
    });
    setNewEvidenceFile('');
    setNewEvidenceHash('');
    onNotify?.(`Forensic evidence "${newEvidence.fileName}" cataloged into vault`, 'success');
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h2 className="text-lg sm:text-xl font-bold font-mono text-white flex items-center gap-2">
          <SearchCheck className="w-5 h-5 text-purple-400 shrink-0" />
          <span className="truncate">DIGITAL FORENSICS & INVESTIGATION CASES</span>
        </h2>
        <p className="text-xs text-purple-200/60 mt-0.5">
          Chain-of-custody tracking, memory dumps, network PCAPs, and evidence artifacts.
        </p>
      </div>

      {/* Grid: Cases and Evidence Vault */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cases List */}
        <div className={`space-y-3 lg:col-span-1 ${mobileView === 'detail' ? 'hidden lg:block' : 'block'}`}>
          <div className="flex items-center justify-between pb-1 px-1">
            <span className="text-xs font-mono uppercase text-purple-300/60 font-semibold">
              Open Forensic Cases ({invList.length})
            </span>
          </div>

          {invList.map((inv) => (
            <div
              key={inv.id}
              onClick={() => handleSelectCase(inv)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer touch-manipulation ${
                selectedInv?.id === inv.id
                  ? 'bg-[#150a36] border-purple-500/50 shadow-[0_0_20px_rgba(168,85,247,0.25)]'
                  : 'cyber-card border-purple-500/20 hover:border-purple-500/40'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-mono text-purple-300 font-bold">{inv.id}</span>
                <StatusBadge status={inv.status} />
              </div>
              <h4 className="text-base font-semibold font-mono text-white mb-2 line-clamp-2">
                {inv.title}
              </h4>
              <div className="flex items-center justify-between text-xs sm:text-sm font-mono text-purple-300/70 pt-2 border-t border-purple-500/15">
                <span className="truncate max-w-[140px]">Analyst: {inv.analyst}</span>
                <div className="flex items-center gap-1.5 text-purple-300 font-semibold">
                  <span>{inv.evidenceList?.length || 0} Artifacts</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Evidence Locker Panel */}
        <div className={`lg:col-span-2 cyber-card rounded-2xl p-4 sm:p-6 border border-purple-500/25 space-y-6 ${
          mobileView === 'list' ? 'hidden lg:block' : 'block'
        }`}>
          {/* Mobile Back Button */}
          <div className="lg:hidden pb-3 border-b border-purple-500/20">
            <button
              onClick={() => setMobileView('list')}
              className="flex items-center gap-1.5 text-sm font-mono text-purple-300 hover:text-white px-3.5 py-2 rounded-xl bg-purple-950/40 border border-purple-500/25 touch-manipulation font-semibold"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Cases List</span>
            </button>
          </div>

          {selectedInv ? (
            <>
              {/* Header Info */}
              <div className="border-b border-purple-500/20 pb-4">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
                  <span className="text-sm font-mono text-purple-400/70 font-semibold">CASE FILE #{selectedInv.id}</span>
                  <StatusBadge status={selectedInv.status} />
                </div>
                <h3 className="text-lg sm:text-xl font-bold font-mono text-white">
                  {selectedInv.title}
                </h3>
                <p className="text-sm text-purple-200/80 font-mono mt-1.5">
                  Lead Forensic Investigator: <span className="text-white font-semibold">{selectedInv.analyst}</span> • Opened: {new Date(selectedInv.createdAt).toLocaleDateString()}
                </p>
              </div>

              {/* Evidence Artifacts Table */}
              <div>
                <h4 className="text-sm font-mono uppercase text-purple-300 font-bold mb-3 flex items-center gap-2">
                  <HardDrive className="w-4.5 h-4.5 text-purple-400" />
                  Forensic Artifacts Vault ({selectedInv.evidenceList?.length || 0})
                </h4>
                <div className="space-y-2.5 max-h-64 overflow-y-auto">
                  {selectedInv.evidenceList?.map((ev) => (
                    <div
                      key={ev.id}
                      className="p-3.5 rounded-xl bg-[#0a041c] border border-purple-500/15 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-3 text-sm font-mono"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <FileText className="w-4.5 h-4.5 text-purple-400 shrink-0" />
                        <div className="min-w-0">
                          <p className="font-semibold text-white truncate text-sm">{ev.fileName}</p>
                          <p className="text-xs sm:text-sm text-purple-400/60 font-mono break-all">
                            SHA256: <span className="text-purple-200/80 select-all">{ev.sha256}</span>
                          </p>
                        </div>
                      </div>
                      <span className="text-xs text-purple-400/60 shrink-0">
                        {new Date(ev.uploadedAt).toLocaleTimeString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Ingest New Evidence Form */}
              <div className="p-4 sm:p-5 rounded-xl bg-[#0a041c] border border-purple-500/20">
                <h4 className="text-sm font-mono uppercase text-purple-300 font-bold mb-3.5 flex items-center gap-2">
                  <Plus className="w-4 h-4 text-purple-400" />
                  Attach New Digital Forensic Evidence
                </h4>
                <form onSubmit={handleAddEvidence} className="space-y-3.5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-xs sm:text-sm text-purple-300/70 font-mono mb-1.5 font-medium">Evidence Artifact Filename *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. memory_dump_win11.raw or traffic.pcap"
                        value={newEvidenceFile}
                        onChange={(e) => setNewEvidenceFile(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#0e0725] border border-purple-500/25 text-sm font-mono text-purple-100 placeholder-purple-300/40 focus:outline-none focus:border-purple-400"
                      />
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm text-purple-300/70 font-mono mb-1.5 font-medium">Cryptographic SHA-256 Hash</label>
                      <input
                        type="text"
                        placeholder="e.g. 7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069"
                        value={newEvidenceHash}
                        onChange={(e) => setNewEvidenceHash(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#0e0725] border border-purple-500/25 text-sm font-mono text-purple-100 placeholder-purple-300/40 focus:outline-none focus:border-purple-400"
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="w-full sm:w-auto px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-mono font-bold shadow-[0_0_12px_rgba(168,85,247,0.3)] transition-all touch-manipulation active:scale-95"
                  >
                    Catalog Into Evidence Vault
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="text-center py-12 text-purple-300/50 font-mono text-xs">
              Select an investigation case to view evidence artifacts.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
