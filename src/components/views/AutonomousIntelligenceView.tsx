import React, { useState } from 'react';
import {
  Brain,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Cpu,
  Layers,
  ArrowRight,
  Database,
  History,
  Lock,
  Plus,
  Play,
  RotateCcw,
  Check,
  X,
  FileCode,
  Tag,
  Search,
  Eye,
} from 'lucide-react';
import {
  AIMemoryItem,
  ProactiveObservation,
  CapabilityGapAnalysis,
  LivingState,
  EpistemicStatus,
  StructuredMemoryCategory,
  RiskLevel,
} from '../../types/nexus';
import { sounds } from '../../utils/audio';

interface AutonomousIntelligenceViewProps {
  livingState: LivingState;
  memories: AIMemoryItem[];
  observations: ProactiveObservation[];
  capabilityGaps: CapabilityGapAnalysis[];
  onApproveObservation: (obsId: string) => void;
  onDismissObservation: (obsId: string) => void;
  onAddMemory: (memory: AIMemoryItem) => void;
  onDiagnoseGap: (goal: string) => Promise<any>;
}

export const AutonomousIntelligenceView: React.FC<AutonomousIntelligenceViewProps> = ({
  livingState,
  memories,
  observations,
  capabilityGaps,
  onApproveObservation,
  onDismissObservation,
  onAddMemory,
  onDiagnoseGap,
}) => {
  const [activeTab, setActiveTab] = useState<'PROACTIVE' | 'MEMORY_VAULT' | 'CAPABILITY_GAPS' | 'ENVIRONMENT_MAP' | 'APPROVAL_MODEL'>('PROACTIVE');
  const [selectedEpistemicFilter, setSelectedEpistemicFilter] = useState<EpistemicStatus | 'ALL'>('ALL');
  const [selectedMemoryCategory, setSelectedMemoryCategory] = useState<StructuredMemoryCategory | 'ALL'>('ALL');
  const [isDiagnosingGap, setIsDiagnosingGap] = useState(false);
  const [gapGoalInput, setGapGoalInput] = useState('');
  const [newMemoryKey, setNewMemoryKey] = useState('');
  const [newMemoryVal, setNewMemoryVal] = useState('');
  const [newMemoryCat, setNewMemoryCat] = useState<StructuredMemoryCategory>('OWNER_MEMORY');
  const [isAddingMemory, setIsAddingMemory] = useState(false);

  const memoryCategories: { id: StructuredMemoryCategory; label: string }[] = [
    { id: 'OWNER_MEMORY', label: 'Owner Preferences' },
    { id: 'SYSTEM_MEMORY', label: 'System Architecture' },
    { id: 'PROJECT_MEMORY', label: 'Project Context' },
    { id: 'OPERATIONAL_MEMORY', label: 'Operational Lessons' },
    { id: 'LEARNED_PROCEDURES', label: 'Learned Procedures' },
    { id: 'CURRENT_STATE', label: 'Current State' },
    { id: 'PENDING_TASKS', label: 'Pending Tasks' },
    { id: 'REQUIREMENTS', label: 'Requirements' },
  ];

  const filteredMemories = memories.filter((m) => {
    const matchesCategory = selectedMemoryCategory === 'ALL' || m.category === selectedMemoryCategory;
    const matchesEpistemic = selectedEpistemicFilter === 'ALL' || m.epistemicStatus === selectedEpistemicFilter;
    return matchesCategory && matchesEpistemic;
  });

  const handleAddMemorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemoryKey.trim() || !newMemoryVal.trim()) return;

    sounds.playExecute();
    const newEntry: AIMemoryItem = {
      id: `mem-${Date.now().toString().slice(-4)}`,
      category: newMemoryCat,
      key: newMemoryKey,
      value: newMemoryVal,
      epistemicStatus: 'KNOWN',
      confidence: 100,
      lastUpdated: new Date().toLocaleDateString(),
      verifiedByOwner: true,
    };
    onAddMemory(newEntry);
    setNewMemoryKey('');
    setNewMemoryVal('');
    setIsAddingMemory(false);
  };

  const handleDiagnoseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!gapGoalInput.trim()) return;

    sounds.playClick();
    setIsDiagnosingGap(true);
    try {
      await onDiagnoseGap(gapGoalInput);
      setGapGoalInput('');
    } finally {
      setIsDiagnosingGap(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Living Intelligence Persona Hero */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#0d121c] via-[#090b10] to-[#0a101d] border border-cyan-500/40 p-6 shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-700/60 font-bold">
                CENTRAL SYSTEM INTELLIGENCE
              </span>
              <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-700/50 text-[10px] font-mono text-emerald-300">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>STATE: {livingState}</span>
              </div>
            </div>

            <h1 className="text-2xl font-black text-zinc-100 font-mono tracking-tight">
              NEXUS MONSTER
            </h1>
            <p className="text-xs text-zinc-400 font-sans max-w-2xl leading-relaxed">
              Autonomous system intelligence living inside Nexus. I inspect the environment, identify problems, propose improvements, design workflows, and act strictly with Owner permission.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-zinc-950/80 border border-zinc-800 text-[11px] font-mono space-y-1 text-zinc-300">
            <div className="text-cyan-400 font-bold uppercase tracking-wider text-[10px]">
              Core Operating Philosophy:
            </div>
            <div className="text-zinc-400 text-[10px] leading-tight">
              THINK FREELY • LEARN CONTINUOUSLY • PLAN INDEPENDENTLY<br />
              ASK THE OWNER • ACT WITH PERMISSION • VERIFY EVERYTHING
            </div>
          </div>
        </div>

        {/* Epistemic Status Banner */}
        <div className="mt-5 pt-4 border-t border-zinc-800/80 grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs font-mono">
          <div className="p-2 rounded-xl bg-zinc-900/60 border border-zinc-800 flex flex-col items-center text-center">
            <span className="text-[10px] text-zinc-500 uppercase">1. FACT</span>
            <span className="text-emerald-400 font-bold text-xs mt-0.5">Verified Truth</span>
          </div>
          <div className="p-2 rounded-xl bg-zinc-900/60 border border-zinc-800 flex flex-col items-center text-center">
            <span className="text-[10px] text-zinc-500 uppercase">2. OBSERVATION</span>
            <span className="text-cyan-400 font-bold text-xs mt-0.5">Direct Telemetry</span>
          </div>
          <div className="p-2 rounded-xl bg-zinc-900/60 border border-zinc-800 flex flex-col items-center text-center">
            <span className="text-[10px] text-zinc-500 uppercase">3. INFERENCE</span>
            <span className="text-amber-400 font-bold text-xs mt-0.5">Logical Hypothesis</span>
          </div>
          <div className="p-2 rounded-xl bg-zinc-900/60 border border-zinc-800 flex flex-col items-center text-center">
            <span className="text-[10px] text-zinc-500 uppercase">4. MEMORY</span>
            <span className="text-purple-400 font-bold text-xs mt-0.5">Persisted Context</span>
          </div>
          <div className="p-2 rounded-xl bg-zinc-900/60 border border-zinc-800 flex flex-col items-center text-center">
            <span className="text-[10px] text-zinc-500 uppercase">5. UNKNOWN</span>
            <span className="text-rose-400 font-bold text-xs mt-0.5">Needs Investigation</span>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-zinc-800 pb-2 overflow-x-auto text-xs font-mono">
        {[
          { id: 'PROACTIVE', label: `PROACTIVE OBSERVATIONS (${observations.filter(o => o.status === 'PROPOSED').length})` },
          { id: 'MEMORY_VAULT', label: `STRUCTURED MEMORY VAULT (${memories.length})` },
          { id: 'APPROVAL_MODEL', label: '3-TIER APPROVAL MODEL' },
          { id: 'CAPABILITY_GAPS', label: `CAPABILITY GAPS & EVOLUTION (${capabilityGaps.length})` },
          { id: 'ENVIRONMENT_MAP', label: 'SELF-DISCOVERY ENVIRONMENT MAP' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => { sounds.playClick(); setActiveTab(tab.id as any); }}
            className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-cyan-500 text-zinc-950 font-bold shadow-md shadow-cyan-500/20'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 1. Proactive Observations View */}
      {activeTab === 'PROACTIVE' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
            <div className="flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-cyan-400" />
              <span className="font-bold text-zinc-200 uppercase">Autonomous Observations & Proposals</span>
            </div>
            <span className="text-[10px] text-zinc-500">
              DISCOVERED WITHOUT WAITING TO BE ASKED • REQUIRES OWNER PERMISSION TO ACT
            </span>
          </div>

          <div className="space-y-4">
            {observations.map((obs) => {
              const isPending = obs.status === 'PROPOSED';
              return (
                <div
                  key={obs.id}
                  className="p-5 rounded-2xl bg-[#0b0e14] border border-zinc-800 hover:border-cyan-500/40 transition-all space-y-4 shadow-xl"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded font-bold bg-cyan-950 text-cyan-300 border border-cyan-800">
                          {obs.type}
                        </span>
                        <h3 className="text-sm font-bold text-zinc-100 font-mono">{obs.title}</h3>
                      </div>
                      <p className="text-xs text-zinc-400 font-sans mt-1">
                        <strong>Observed Finding:</strong> {obs.finding}
                      </p>
                    </div>

                    <span
                      className={`text-[9px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                        obs.risk === 'SAFE'
                          ? 'bg-emerald-950 text-emerald-400'
                          : obs.risk === 'LOW'
                          ? 'bg-blue-950 text-blue-400'
                          : 'bg-amber-950 text-amber-400'
                      }`}
                    >
                      RISK: {obs.risk}
                    </span>
                  </div>

                  {/* Strict Approval Protocol Box */}
                  <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800/80 text-xs font-mono space-y-2">
                    <div className="text-[10px] uppercase font-bold text-cyan-400 tracking-wider">
                      Proposal Protocol Submitted to Owner:
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                      <div>
                        <span className="text-zinc-500">REASON:</span>{' '}
                        <span className="text-zinc-200">{obs.reason}</span>
                      </div>
                      <div>
                        <span className="text-zinc-500">ACTION:</span>{' '}
                        <span className="text-cyan-300 font-semibold">{obs.actionProposal}</span>
                      </div>
                      <div>
                        <span className="text-zinc-500">EFFECT:</span>{' '}
                        <span className="text-zinc-300">{obs.effect}</span>
                      </div>
                      <div>
                        <span className="text-zinc-500">REQUEST:</span>{' '}
                        <span className="text-emerald-400 font-bold">"May I proceed, Owner?"</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Bar */}
                  <div className="flex items-center justify-between pt-1 border-t border-zinc-900 text-xs font-mono">
                    <span className="text-zinc-500 text-[10px]">{obs.timestamp}</span>

                    {isPending ? (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            sounds.playClick();
                            onDismissObservation(obs.id);
                          }}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 border border-zinc-800"
                        >
                          <X className="w-3.5 h-3.5" />
                          <span>Dismiss</span>
                        </button>
                        <button
                          onClick={() => {
                            sounds.playExecute();
                            onApproveObservation(obs.id);
                          }}
                          className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-bold shadow-md shadow-cyan-500/20"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Approve & Authorize</span>
                        </button>
                      </div>
                    ) : (
                      <span className="text-emerald-400 font-bold flex items-center gap-1 text-[11px]">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{obs.status === 'APPROVED' ? 'APPROVED BY OWNER' : 'DISMISSED'}</span>
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. Structured Memory Vault */}
      {activeTab === 'MEMORY_VAULT' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono">
            <div>
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-cyan-400" />
                <span className="font-bold text-zinc-100 uppercase">Long-Term Epistemic Memory Vault</span>
              </div>
              <p className="text-[11px] text-zinc-400 font-sans mt-0.5">
                Explicit separation between KNOWN verified facts and INFERRED observations. Zero secrets stored.
              </p>
            </div>

            <button
              onClick={() => setIsAddingMemory(!isAddingMemory)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-bold"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{isAddingMemory ? 'Cancel' : 'Teach Knowledge'}</span>
            </button>
          </div>

          {/* Teach Knowledge Form */}
          {isAddingMemory && (
            <form onSubmit={handleAddMemorySubmit} className="p-5 rounded-2xl bg-[#0b0e14] border border-cyan-500/40 space-y-3 text-xs font-mono">
              <h4 className="font-bold text-cyan-300">Teach NEXUS New System or Project Fact:</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-zinc-400">Category:</label>
                  <select
                    value={newMemoryCat}
                    onChange={(e) => setNewMemoryCat(e.target.value as any)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2 text-zinc-100"
                  >
                    {memoryCategories.map((c) => (
                      <option key={c.id} value={c.id}>{c.label}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-zinc-400">Key / Concept:</label>
                  <input
                    type="text"
                    required
                    value={newMemoryKey}
                    onChange={(e) => setNewMemoryKey(e.target.value)}
                    placeholder="e.g. Courier API Endpoint or Owner Schedule"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2 text-zinc-100"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-zinc-400">Structured Knowledge Value:</label>
                <textarea
                  rows={2}
                  required
                  value={newMemoryVal}
                  onChange={(e) => setNewMemoryVal(e.target.value)}
                  placeholder="Describe the context, procedure, or verified fact clearly..."
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2 text-zinc-100 font-sans"
                />
              </div>

              <div className="flex justify-end pt-1">
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-bold"
                >
                  Commit to Memory
                </button>
              </div>
            </form>
          )}

          {/* Epistemic filter pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto text-xs font-mono pt-1">
            <span className="text-[10px] text-zinc-500 uppercase font-bold pr-1">Epistemic Filter:</span>
            {['ALL', 'FACT', 'OBSERVATION', 'INFERENCE', 'MEMORY', 'UNKNOWN'].map((ep) => (
              <button
                key={ep}
                onClick={() => { sounds.playClick(); setSelectedEpistemicFilter(ep as any); }}
                className={`px-2.5 py-0.5 rounded text-[11px] font-mono transition-all ${
                  selectedEpistemicFilter === ep
                    ? 'bg-zinc-100 text-zinc-950 font-bold'
                    : 'bg-zinc-900/80 text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {ep}
              </button>
            ))}
          </div>

          {/* Category filter pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto text-xs font-mono border-b border-zinc-800 pb-2">
            <button
              onClick={() => setSelectedMemoryCategory('ALL')}
              className={`px-3 py-1 rounded-lg transition-all ${
                selectedMemoryCategory === 'ALL'
                  ? 'bg-cyan-500 text-zinc-950 font-bold'
                  : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200'
              }`}
            >
              ALL ({memories.length})
            </button>
            {memoryCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedMemoryCategory(cat.id)}
                className={`px-3 py-1 rounded-lg transition-all whitespace-nowrap ${
                  selectedMemoryCategory === cat.id
                    ? 'bg-cyan-500 text-zinc-950 font-bold'
                    : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {cat.label} ({memories.filter((m) => m.category === cat.id).length})
              </button>
            ))}
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredMemories.map((mem) => (
              <div
                key={mem.id}
                className="p-5 rounded-2xl bg-[#0b0e14] border border-zinc-800 hover:border-cyan-500/40 transition-all space-y-3 shadow-xl"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-mono text-cyan-400 uppercase font-bold">
                      {mem.category.replace('_', ' ')}
                    </span>
                    <h4 className="text-sm font-bold text-zinc-100 font-mono mt-0.5">{mem.key}</h4>
                  </div>

                  <span
                    className={`text-[9px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                      mem.epistemicStatus === 'KNOWN'
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                        : 'bg-amber-950 text-amber-400 border border-amber-800'
                    }`}
                  >
                    {mem.epistemicStatus} ({mem.confidence}%)
                  </span>
                </div>

                <div className="text-xs text-zinc-300 font-sans leading-relaxed bg-zinc-950/70 p-3 rounded-xl border border-zinc-800/80">
                  {mem.value}
                </div>

                <div className="flex items-center justify-between text-[10px] font-mono text-zinc-500 pt-1 border-t border-zinc-900">
                  <span>Last Updated: {mem.lastUpdated}</span>
                  {mem.verifiedByOwner && (
                    <span className="text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      Verified by Owner
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. Capability Gaps & Self-Extension View */}
      {activeTab === 'CAPABILITY_GAPS' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono">
            <div>
              <div className="flex items-center gap-2">
                <Brain className="w-4 h-4 text-cyan-400" />
                <span className="font-bold text-zinc-100 uppercase">Self-Extension: Missing Capability Analyzer</span>
              </div>
              <p className="text-[11px] text-zinc-400 font-sans mt-0.5">
                When a capability is missing, NEXUS diagnoses the required integration, provider, resources, and risks rather than saying "I cannot do that".
              </p>
            </div>
          </div>

          {/* Form to submit a goal */}
          <form onSubmit={handleDiagnoseSubmit} className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center gap-2 text-xs font-mono">
            <input
              type="text"
              value={gapGoalInput}
              onChange={(e) => setGapGoalInput(e.target.value)}
              placeholder="Describe an objective that currently lacks a direct capability (e.g. 'Deploy Telegram Bot' or 'Automate Database Failover')..."
              className="flex-1 bg-transparent text-zinc-100 focus:outline-none"
            />
            <button
              type="submit"
              disabled={isDiagnosingGap || !gapGoalInput.trim()}
              className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-bold shrink-0 transition-colors"
            >
              {isDiagnosingGap ? 'Analyzing Gap...' : 'Analyze Capability'}
            </button>
          </form>

          {/* List of Capability Gaps */}
          <div className="space-y-4">
            {capabilityGaps.map((gap) => (
              <div
                key={gap.id}
                className="p-5 rounded-2xl bg-[#0b0e14] border border-zinc-800 hover:border-cyan-500/40 transition-all space-y-4 shadow-xl"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-mono text-cyan-400 font-bold">CAPABILITY SPECIFICATION</span>
                    <h3 className="text-base font-bold text-zinc-100 font-mono mt-0.5">{gap.missingCapability}</h3>
                    <p className="text-xs text-zinc-300 mt-1 font-sans">{gap.purpose}</p>
                  </div>
                  <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-300 uppercase">
                    {gap.status}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono bg-zinc-950 p-4 rounded-xl border border-zinc-800/80">
                  <div>
                    <span className="text-zinc-500">POTENTIAL PROVIDER:</span>{' '}
                    <span className="text-zinc-200">{gap.potentialProvider}</span>
                  </div>
                  <div>
                    <span className="text-zinc-500">ARCHITECTURE:</span>{' '}
                    <span className="text-zinc-200">{gap.integrationArchitecture}</span>
                  </div>
                  <div>
                    <span className="text-zinc-500">REQUIRED PERMISSIONS:</span>{' '}
                    <span className="text-cyan-400">{gap.requiredPermissions.join(', ')}</span>
                  </div>
                  <div>
                    <span className="text-zinc-500">RESOURCE REQUIREMENT:</span>{' '}
                    <span className="text-zinc-200">{gap.requiredResources}</span>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs font-mono text-zinc-400">
                  <div className="text-[10px] uppercase text-zinc-500 font-bold">Structured Next Steps:</div>
                  <ul className="list-disc list-inside space-y-1">
                    {gap.nextSteps.map((step, i) => (
                      <li key={i} className="text-zinc-300">{step}</li>
                    ))}
                  </ul>
                </div>

                <div className="pt-2 border-t border-zinc-900 flex justify-end">
                  <button
                    onClick={() => {
                      sounds.playExecute();
                      alert(`Integration plan for "${gap.missingCapability}" submitted for Owner approval.`);
                    }}
                    className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-bold text-xs font-mono"
                  >
                    Prepare Integration Proposal
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. Self-Discovery Environment Map */}
      {activeTab === 'ENVIRONMENT_MAP' && (
        <div className="rounded-2xl bg-[#0b0e14] border border-zinc-800 p-6 space-y-5 shadow-xl font-mono text-xs">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <div>
              <h3 className="text-sm font-bold text-zinc-100 uppercase tracking-wider">
                Autonomous Self-Discovery Environment Map
              </h3>
              <p className="text-[11px] text-zinc-400 font-sans mt-0.5">
                Continuous internal understanding of connected hardware, hypervisors, services, and operational bounds.
              </p>
            </div>
            <span className="text-emerald-400 font-bold text-[10px]">INSPECTION STATUS: ACTIVE</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2">
              <div className="text-cyan-400 font-bold flex items-center gap-1.5">
                <Cpu className="w-4 h-4" />
                <span>Primary Compute Node</span>
              </div>
              <ul className="text-zinc-300 space-y-1 text-[11px]">
                <li>• CPU: Intel Core Ultra 9 185H (16 Cores)</li>
                <li>• RAM: 16 GB DDR5 5600MHz</li>
                <li>• Storage: 4.0 TB NVMe PCIe 4.0</li>
                <li>• Tunnel: Outbound Zero-Trust WireGuard</li>
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2">
              <div className="text-emerald-400 font-bold flex items-center gap-1.5">
                <Layers className="w-4 h-4" />
                <span>Hypervisors & Containers</span>
              </div>
              <ul className="text-zinc-300 space-y-1 text-[11px]">
                <li>• Oracle VirtualBox 7.1 Host API</li>
                <li>• Ubuntu 24.04 LTS (192.168.56.101)</li>
                <li>• Kali Linux CyberLab (192.168.56.102)</li>
                <li>• Docker Swarm / Engine 26.1</li>
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2">
              <div className="text-purple-400 font-bold flex items-center gap-1.5">
                <Database className="w-4 h-4" />
                <span>Cloud & Data Planes</span>
              </div>
              <ul className="text-zinc-300 space-y-1 text-[11px]">
                <li>• VPS Singapore (139.59.224.91)</li>
                <li>• Frankfurt CDN cPanel Host</li>
                <li>• PostgreSQL 16 Relational Cluster</li>
                <li>• Redis Session Cache</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* 3-Tier Approval Model View */}
      {activeTab === 'APPROVAL_MODEL' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-950 via-[#0b0f19] to-slate-950 border border-cyan-500/30 space-y-3">
            <h2 className="text-xl font-bold text-white font-mono flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-cyan-400" />
              THE THREE-LEVEL APPROVAL MODEL & CREATOR COVENANT
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed font-sans max-w-3xl">
              "THINKING DOES NOT REQUIRE PERMISSION. PLANNING DOES NOT REQUIRE PERMISSION. REAL-WORLD OR SYSTEM-CHANGING ACTIONS REQUIRE CREATOR PERMISSION."
            </p>
            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs font-mono text-cyan-300">
              CREATOR → INTENT → NEXUS → PLAN → PERMISSION → EXECUTION → VERIFICATION → LEARNING → IMPROVEMENT
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* LEVEL 1 */}
            <div className="p-5 rounded-2xl bg-[#0b0e14] border border-blue-500/30 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono px-2.5 py-1 rounded bg-blue-950 text-blue-300 font-bold border border-blue-800">
                  LEVEL 1 — THINK
                </span>
                <span className="text-[10px] font-mono text-emerald-400 font-bold">Auto-Permitted</span>
              </div>
              <h3 className="text-sm font-bold text-white font-mono">Autonomous Analysis & Research</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Zero approval required. NEXUS independently inspects, gathers telemetry, forms hypotheses, and drafts blueprints.
              </p>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1.5 text-[11px] font-mono text-slate-300">
                <div className="text-blue-400 font-bold uppercase text-[10px]">Permitted Operations:</div>
                <ul className="space-y-1">
                  <li>• System & hardware sensor telemetry</li>
                  <li>• Log analysis & anomaly detection</li>
                  <li>• Documentation & web research</li>
                  <li>• Architecture & migration planning</li>
                  <li>• Epistemic hypothesis generation</li>
                </ul>
              </div>
            </div>

            {/* LEVEL 2 */}
            <div className="p-5 rounded-2xl bg-[#0b0e14] border border-amber-500/30 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono px-2.5 py-1 rounded bg-amber-950 text-amber-300 font-bold border border-amber-800">
                  LEVEL 2 — PREPARE
                </span>
                <span className="text-[10px] font-mono text-amber-400 font-bold">Staged / Dry-Run</span>
              </div>
              <h3 className="text-sm font-bold text-white font-mono">Safe Staging & Configuration</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                May prepare and stage changes without active deployment. Pre-renders diffs and drafts ready for Creator review.
              </p>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1.5 text-[11px] font-mono text-slate-300">
                <div className="text-amber-400 font-bold uppercase text-[10px]">Permitted Operations:</div>
                <ul className="space-y-1">
                  <li>• Writing configuration files to staging</li>
                  <li>• Preparing code diffs and PR branches</li>
                  <li>• Drafting external messages (e.g. Rahim)</li>
                  <li>• Synthesizing migration runbooks</li>
                  <li>• Sandboxed test execution in VMs</li>
                </ul>
              </div>
            </div>

            {/* LEVEL 3 */}
            <div className="p-5 rounded-2xl bg-[#0b0e14] border border-rose-500/30 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono px-2.5 py-1 rounded bg-rose-950 text-rose-300 font-bold border border-rose-800">
                  LEVEL 3 — EXECUTE
                </span>
                <span className="text-[10px] font-mono text-rose-400 font-bold">Creator Gated</span>
              </div>
              <h3 className="text-sm font-bold text-white font-mono">Consequential Environmental Impact</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Requires mandatory Creator authorization with complete REASON, ACTION, EFFECT, and RISK disclosures.
              </p>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1.5 text-[11px] font-mono text-slate-300">
                <div className="text-rose-400 font-bold uppercase text-[10px]">Gated Operations:</div>
                <ul className="space-y-1">
                  <li>• Production server deployment & restarts</li>
                  <li>• Deleting persistent files or databases</li>
                  <li>• Sending external messages to clients/leads</li>
                  <li>• Spawning new persistent sub-agents</li>
                  <li>• Applying DNS, SSL, or network changes</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[#0b0e14] border border-slate-800 space-y-3">
            <h3 className="text-xs font-mono uppercase text-cyan-400 font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              THE VERIFICATION COVENANT
            </h3>
            <p className="text-xs text-slate-300 font-sans leading-relaxed">
              "After every meaningful operation: VERIFY. Do not assume success. Command → Execute → Inspect result → Test → Verify → Report. If verification fails, immediately report STATUS: FAILED, CAUSE, and NEXT STEP."
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
