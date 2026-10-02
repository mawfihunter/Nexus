import React, { useState } from 'react';
import {
  Search,
  FileText,
  Link,
  ShieldCheck,
  Clock,
  Plus,
  ArrowRight,
  Database,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import { HunterProject } from '../../types/nexus';
import { sounds } from '../../utils/audio';

interface HunterViewProps {
  projects: HunterProject[];
  onAddProject: (project: HunterProject) => void;
}

export const HunterView: React.FC<HunterViewProps> = ({ projects, onAddProject }) => {
  const [selectedProjectId, setSelectedProjectId] = useState<string>(projects[0]?.id || '');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newFocus, setNewFocus] = useState('');
  const [newSource, setNewSource] = useState('');

  const currentProject = projects.find((p) => p.id === selectedProjectId) || projects[0];

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    sounds.playExecute();
    const item: HunterProject = {
      id: `hnt-${Date.now().toString().slice(-4)}`,
      title: newTitle,
      focus: newFocus || 'Market & supply verification',
      provenanceSource: newSource || 'Public registries & cryptographic signatures',
      confidenceScore: 92,
      evidenceItems: 4,
      lastUpdated: 'Just now',
      status: 'IN_PROGRESS',
      leadInvestigator: 'Farhan Kabir',
    };

    onAddProject(item);
    setIsModalOpen(false);
    setNewTitle('');
    setNewFocus('');
    setNewSource('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-[#0b0e14] border border-cyan-500/30 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/40 flex items-center justify-center text-amber-400">
            <Search className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-zinc-100 font-mono">
                Hunter & OSINT Research Center
              </h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800">
                SOURCE PROVENANCE VERIFIED
              </span>
            </div>
            <p className="text-xs text-zinc-400 font-mono mt-0.5">
              Lawful intelligence gathering, supply verification, and cryptographic chain-of-evidence
            </p>
          </div>
        </div>

        <button
          onClick={() => { sounds.playClick(); setIsModalOpen(true); }}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-zinc-950 text-xs font-bold font-mono transition-colors shadow-lg shadow-cyan-500/20"
        >
          <Plus className="w-4 h-4" />
          <span>New Investigation</span>
        </button>
      </div>

      {/* Grid: Projects list & Dossier */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 font-mono">
            Active Investigations
          </h3>
          {projects.map((proj) => {
            const isSelected = proj.id === selectedProjectId;
            return (
              <div
                key={proj.id}
                onClick={() => { sounds.playClick(); setSelectedProjectId(proj.id); }}
                className={`p-4 rounded-xl border cursor-pointer transition-all space-y-2 ${
                  isSelected
                    ? 'bg-zinc-900 border-cyan-500/50 shadow-md shadow-cyan-950/30'
                    : 'bg-[#0b0e14] border-zinc-800 hover:border-zinc-700'
                }`}
              >
                <div className="flex items-start justify-between">
                  <h4 className="text-xs font-bold text-zinc-100 font-mono">{proj.title}</h4>
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 font-bold">
                    {proj.confidenceScore}% CONFIDENCE
                  </span>
                </div>
                <div className="text-[11px] text-zinc-400 line-clamp-2">{proj.focus}</div>
                <div className="text-[10px] font-mono text-zinc-500 flex items-center justify-between pt-1 border-t border-zinc-900">
                  <span>Lead: {proj.leadInvestigator}</span>
                  <span>{proj.evidenceItems} Artifacts</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Project Dossier */}
        <div className="lg:col-span-2 rounded-2xl bg-[#0b0e14] border border-zinc-800 p-6 space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="border-b border-zinc-800 pb-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-zinc-100 font-mono">{currentProject.title}</h3>
                <span className="text-xs font-mono text-cyan-400">
                  Status: {currentProject.status}
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-1">{currentProject.focus}</p>
            </div>

            {/* Source Provenance Box */}
            <div className="p-4 rounded-xl bg-zinc-950 border border-amber-950/60 space-y-2">
              <div className="text-xs font-bold uppercase tracking-wider text-amber-400 font-mono flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5" />
                <span>Audited Source Provenance:</span>
              </div>
              <p className="text-xs text-zinc-300 font-sans leading-relaxed">
                {currentProject.provenanceSource}
              </p>
            </div>

            {/* Evidence items */}
            <div className="space-y-2 text-xs font-mono">
              <div className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                Verified Evidence Lockers ({currentProject.evidenceItems} Items):
              </div>
              <div className="space-y-1.5">
                <div className="p-2.5 rounded-lg bg-zinc-950 border border-zinc-800 flex items-center justify-between text-zinc-300">
                  <span>SHA256 Import Manifest Bill of Lading (Customs BD)</span>
                  <span className="text-[10px] text-emerald-400">VERIFIED HASH</span>
                </div>
                <div className="p-2.5 rounded-lg bg-zinc-950 border border-zinc-800 flex items-center justify-between text-zinc-300">
                  <span>Third-party Gas Chromatography Nitrogen Assay Report</span>
                  <span className="text-[10px] text-cyan-400">PDF ATTACHED</span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-zinc-800/80 text-[11px] font-mono text-zinc-500 flex items-center justify-between">
            <span>PROVENANCE STANDARD: ISO 27037 DIGITAL EVIDENCE</span>
            <span className="text-emerald-400">CHAIN OF CUSTODY INTACT</span>
          </div>
        </div>
      </div>

      {/* Modal: New Investigation */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="bg-[#0b0e14] border border-cyan-500/40 w-full max-w-md rounded-2xl p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-zinc-100 font-mono">
              Initiate Research Investigation
            </h3>
            <form onSubmit={handleCreate} className="space-y-3 text-xs font-mono">
              <div className="space-y-1">
                <label className="text-zinc-400">Investigation Title:</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2 text-zinc-100"
                />
              </div>

              <div className="space-y-1">
                <label className="text-zinc-400">Research Focus:</label>
                <textarea
                  rows={2}
                  value={newFocus}
                  onChange={(e) => setNewFocus(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2 text-zinc-100"
                />
              </div>

              <div className="space-y-1">
                <label className="text-zinc-400">Source Provenance:</label>
                <input
                  type="text"
                  value={newSource}
                  onChange={(e) => setNewSource(e.target.value)}
                  placeholder="e.g. Verified open data, regulatory filings"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2 text-zinc-100"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-zinc-900 text-zinc-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-bold"
                >
                  Start Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
