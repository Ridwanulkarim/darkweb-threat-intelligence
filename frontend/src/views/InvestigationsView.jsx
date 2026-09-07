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
  HardDrive
} from 'lucide-react';
import StatusBadge from '../components/StatusBadge';

export default function InvestigationsView({ investigations = [], onNotify }) {
  const [invList, setInvList] = useState(investigations);
  const [selectedInv, setSelectedInv] = useState(investigations[0] || null);
  const [newEvidenceFile, setNewEvidenceFile] = useState('');
  const [newEvidenceHash, setNewEvidenceHash] = useState('');

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
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold font-mono text-white flex items-center gap-2">
          <SearchCheck className="w-5 h-5 text-cyan-400" />
          DIGITAL FORENSICS & INVESTIGATION CASES
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Chain-of-custody tracking, memory dumps, network PCAPs, and evidence artifacts.
        </p>
      </div>

      {/* Grid: Cases and Evidence Vault */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cases List */}
        <div className="space-y-3 lg:col-span-1">
          {invList.map((inv) => (
            <div
              key={inv.id}
              onClick={() => setSelectedInv(inv)}
              className={`p-4 rounded-xl border transition-all cursor-pointer ${
                selectedInv?.id === inv.id
                  ? 'bg-slate-900 border-cyan-500/60 shadow-cyber-md'
                  : 'cyber-card border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono text-cyan-400 font-bold">{inv.id}</span>
                <StatusBadge status={inv.status} />
              </div>
              <h4 className="text-sm font-semibold font-mono text-white mb-2">
                {inv.title}
              </h4>
              <div className="flex items-center justify-between text-xs font-mono text-slate-400 pt-2 border-t border-slate-800/80">
                <span>Analyst: {inv.analyst}</span>
                <span className="text-cyan-400 font-semibold">{inv.evidenceList?.length || 0} Artifacts</span>
              </div>
            </div>
          ))}
        </div>

        {/* Evidence Locker Panel */}
        <div className="lg:col-span-2 cyber-card rounded-2xl p-6 border border-slate-800 space-y-6">
          {selectedInv ? (
            <>
              {/* Header Info */}
              <div className="border-b border-slate-800 pb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono text-slate-500">CASE FILE #{selectedInv.id}</span>
                  <StatusBadge status={selectedInv.status} />
                </div>
                <h3 className="text-lg font-bold font-mono text-white">
                  {selectedInv.title}
                </h3>
                <p className="text-xs text-slate-400 font-mono mt-1">
                  Lead Forensic Investigator: <span className="text-slate-200">{selectedInv.analyst}</span> • Opened: {new Date(selectedInv.createdAt).toLocaleDateString()}
                </p>
              </div>

              {/* Evidence Artifacts Table */}
              <div>
                <h4 className="text-xs font-mono uppercase text-slate-400 font-bold mb-3 flex items-center gap-2">
                  <HardDrive className="w-4 h-4 text-cyan-400" />
                  Forensic Artifacts Vault ({selectedInv.evidenceList?.length || 0})
                </h4>
                <div className="space-y-2">
                  {selectedInv.evidenceList?.map((ev) => (
                    <div
                      key={ev.id}
                      className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs font-mono"
                    >
                      <div className="flex items-center gap-2.5">
                        <FileText className="w-4 h-4 text-cyan-400 shrink-0" />
                        <div>
                          <p className="font-semibold text-white">{ev.fileName}</p>
                          <p className="text-[11px] text-slate-500 font-mono">
                            SHA256: <span className="text-slate-400 select-all">{ev.sha256}</span>
                          </p>
                        </div>
                      </div>
                      <span className="text-[10px] text-slate-500 shrink-0">
                        {new Date(ev.uploadedAt).toLocaleTimeString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Add New Evidence Form */}
              <div className="pt-4 border-t border-slate-800">
                <h4 className="text-xs font-mono uppercase text-cyan-400 font-bold mb-3 flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Catalog New Forensic Artifact
                </h4>
                <form onSubmit={handleAddEvidence} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Evidence filename (e.g. dump.raw, traffic.pcap)..."
                    value={newEvidenceFile}
                    onChange={(e) => setNewEvidenceFile(e.target.value)}
                    className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs font-mono text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                  />
                  <input
                    type="text"
                    placeholder="SHA-256 Hash Checksum..."
                    value={newEvidenceHash}
                    onChange={(e) => setNewEvidenceHash(e.target.value)}
                    className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs font-mono text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                  />
                  <div className="sm:col-span-2 flex justify-end">
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-mono font-bold transition-all shadow-cyber-sm"
                    >
                      Add to Vault
                    </button>
                  </div>
                </form>
              </div>
            </>
          ) : (
            <div className="text-slate-500 font-mono text-xs text-center py-12">
              Select an investigation case to view evidence.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
