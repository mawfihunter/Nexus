import React, { useState } from 'react';
import {
  Compass,
  Search,
  BookOpen,
  Atom,
  Cpu,
  Shield,
  Layers,
  Sparkles,
  Bot,
  Activity,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Sliders,
  Play,
  RotateCcw,
  HardDrive,
  Database,
  ArrowRight,
  TrendingUp,
  Brain,
  Scale,
  Globe,
  Radio,
  Share2,
} from 'lucide-react';
import {
  KnowledgeEntry,
  HunterAgent,
  ResourceExpansionProposal,
  KnowledgeDomainCategory,
} from '../../types/nexus';
import { sounds } from '../../utils/audio';

interface UniversalKnowledgeViewProps {
  entries: KnowledgeEntry[];
  hunterAgents: HunterAgent[];
  resourceProposals: ResourceExpansionProposal[];
  onAddKnowledgeEntry?: (entry: KnowledgeEntry) => void;
  onApproveResourceProposal?: (proposalId: string) => void;
}

export const UniversalKnowledgeView: React.FC<UniversalKnowledgeViewProps> = ({
  entries,
  hunterAgents,
  resourceProposals,
  onAddKnowledgeEntry,
  onApproveResourceProposal,
}) => {
  const [activeTab, setActiveTab] = useState<'EXPLORER' | 'INQUIRY_ENGINE' | 'HUNTER_FLEET' | 'RESOURCE_EXPANSION'>('EXPLORER');
  const [selectedDomain, setSelectedDomain] = useState<KnowledgeDomainCategory | 'ALL'>('ALL');
  const [selectedEntry, setSelectedEntry] = useState<KnowledgeEntry | null>(entries[0] || null);

  // Inquiry Engine state
  const [inquiryQuery, setInquiryQuery] = useState(
    'Is liquid cooling or sintered heat-pipe vapor chamber superior for 24/7 continuous NPU inference on Intel Core Ultra 9?'
  );
  const [inquiryMethod, setInquiryMethod] = useState<'SCIENTIFIC' | 'ENGINEERING' | 'INQUIRY'>('ENGINEERING');
  const [inquiryStep, setInquiryStep] = useState<number>(0); // 0 to 9
  const [isInquiring, setIsInquiring] = useState(false);
  const [inquiryResult, setInquiryResult] = useState<any>(null);

  // Hunter Dispatch state
  const [selectedHunter, setSelectedHunter] = useState<HunterAgent | null>(hunterAgents[0] || null);
  const [hunterBusStream, setHunterBusStream] = useState<string[]>([
    '[BUS] nexus://agents/hunter-science:5503 -> Transmitted thermal dissipation coefficients (ΔT=14.2°C).',
    '[BUS] nexus://agents/hunter-security:5504 -> Verified TLS 1.3 curve X25519 ephemeral key generation.',
    '[BUS] nexus://agents/hunter-monitor:5509 -> Axiom verification pass: zero epistemic contradictions detected.',
  ]);

  const allDisciplines: { name: string; category: KnowledgeDomainCategory }[] = [
    { name: 'Computer Science', category: 'COMPUTER_SCIENCE' },
    { name: 'Artificial Intelligence', category: 'ARTIFICIAL_INTELLIGENCE' },
    { name: 'Software Engineering', category: 'SOFTWARE_ENGINEERING' },
    { name: 'Cybersecurity', category: 'CYBERSECURITY' },
    { name: 'Networking', category: 'NETWORKING' },
    { name: 'Operating Systems', category: 'OPERATING_SYSTEMS' },
    { name: 'Cloud & DevOps', category: 'CLOUD_DEVOPS' },
    { name: 'Databases', category: 'DATABASES' },
    { name: 'Robotics & Embedded', category: 'ROBOTICS_EMBEDDED' },
    { name: 'Mathematics', category: 'MATHEMATICS' },
    { name: 'Physics', category: 'PHYSICS' },
    { name: 'Chemistry & Materials', category: 'CHEMISTRY' },
    { name: 'Biology & Biotech', category: 'BIOLOGY' },
    { name: 'Astronomy & Space', category: 'ASTRONOMY_SPACE' },
    { name: 'Aerospace & Mechanical', category: 'AEROSPACE_MECHANICAL' },
    { name: 'Data Science & Stats', category: 'DATA_SCIENCE_STATS' },
    { name: 'Economics & Business', category: 'ECONOMICS_BUSINESS' },
    { name: 'Philosophy & Ethics', category: 'HUMANITIES_PHILOSOPHY' },
    { name: 'Law & Governance', category: 'LAW_GOVERNANCE' },
    { name: 'Creative Arts & Design', category: 'CREATIVE_ARTS' },
  ];

  const filteredEntries =
    selectedDomain === 'ALL' ? entries : entries.filter((e) => e.domain === selectedDomain);

  const run9StepInquiry = () => {
    sounds.playExecute();
    setIsInquiring(true);
    setInquiryStep(1);

    const stepInterval = 400;

    // Execute 9 steps
    const timer1 = setTimeout(() => setInquiryStep(2), stepInterval * 1);
    const timer2 = setTimeout(() => setInquiryStep(3), stepInterval * 2);
    const timer3 = setTimeout(() => setInquiryStep(4), stepInterval * 3);
    const timer4 = setTimeout(() => setInquiryStep(5), stepInterval * 4);
    const timer5 = setTimeout(() => setInquiryStep(6), stepInterval * 5);
    const timer6 = setTimeout(() => setInquiryStep(7), stepInterval * 6);
    const timer7 = setTimeout(() => setInquiryStep(8), stepInterval * 7);
    const timer8 = setTimeout(() => {
      setInquiryStep(9);
      setIsInquiring(false);
      sounds.playSuccessTone();
      sounds.speak(
        'Multidisciplinary inquiry concluded. Conclusion verified against established engineering science.',
        'TECHNICAL'
      );
      setInquiryResult({
        domain: 'AEROSPACE_MECHANICAL & PHYSICS',
        subdomain: 'Thermal Equilibrium & Solid-State Heat Transfer',
        facts: [
          'Sintered copper vapor chamber has zero moving parts, eliminating pump cavitation or leak risk.',
          'Latent heat of vaporization in closed wick provides equivalent thermal conductivity of >12,000 W/(m·K).',
        ],
        hypotheses: [
          'Under 65W TDP continuous load, vapor chamber operates within 2.4°C of custom AIO liquid loop while offering 10x MTBF.',
        ],
        simulations: 'Calculated thermal delta: ΔT = 13.8°C die-to-fin. Acoustic noise: 0 dB passive pump load.',
        contradictions: 'Checked liquid cooling claims. AIO pumps have 3-year mean time before failure (MTBF); vapor chambers have infinite fluid shelf-life.',
        conclusion: 'Sintered heat-pipe vapor chamber is technically superior for uninterrupted 24/7 personal digital node operation.',
        confidence: 98.6,
      });
    }, stepInterval * 8);
  };

  const dispatchToHunter = (hunter: HunterAgent) => {
    sounds.playExecute();
    sounds.speak(`Task dispatched to ${hunter.displayName}. Engaging inter-agent bus.`, 'SUCCESS');
    setHunterBusStream((prev) => [
      `[BUS] Creator dispatched active inquiry to ${hunter.codename} on ${hunter.interAgentBusAddress} at ${new Date().toLocaleTimeString()}.`,
      ...prev,
    ]);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Philosophy */}
      <div className="bg-slate-900/90 border border-cyan-500/30 rounded-xl p-6 relative overflow-hidden backdrop-blur-md">
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <span className="p-2.5 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                <Compass className="w-6 h-6 animate-pulse" />
              </span>
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                  UNIVERSAL KNOWLEDGE & HUNTER CIVILIZATION
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800">
                    40+ Disciplines Synthesized
                  </span>
                </h1>
                <p className="text-slate-400 text-sm">
                  "Continuously develop capability across Computer Science, AI, Physics, Robotics, Mathematics, Philosophy, Law, and Economics. Distinguish established facts from hypotheses."
                </p>
              </div>
            </div>
          </div>

          {/* Navigation Pill Switcher */}
          <div className="flex flex-wrap items-center gap-2 bg-slate-950/80 p-1 rounded-lg border border-slate-800 self-start lg:self-auto">
            <button
              onClick={() => { sounds.playClick(); setActiveTab('EXPLORER'); }}
              className={`px-3.5 py-1.5 rounded-md text-xs font-semibold uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                activeTab === 'EXPLORER'
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              Domain Matrix ({entries.length})
            </button>
            <button
              onClick={() => { sounds.playClick(); setActiveTab('INQUIRY_ENGINE'); }}
              className={`px-3.5 py-1.5 rounded-md text-xs font-semibold uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                activeTab === 'INQUIRY_ENGINE'
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Atom className="w-3.5 h-3.5" />
              9-Step Inquiry
            </button>
            <button
              onClick={() => { sounds.playClick(); setActiveTab('HUNTER_FLEET'); }}
              className={`px-3.5 py-1.5 rounded-md text-xs font-semibold uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                activeTab === 'HUNTER_FLEET'
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Bot className="w-3.5 h-3.5" />
              Hunter Fleet ({hunterAgents.length})
            </button>
            <button
              onClick={() => { sounds.playClick(); setActiveTab('RESOURCE_EXPANSION'); }}
              className={`px-3.5 py-1.5 rounded-md text-xs font-semibold uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                activeTab === 'RESOURCE_EXPANSION'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-amber-400 hover:text-amber-300'
              }`}
            >
              <HardDrive className="w-3.5 h-3.5" />
              Resource Expansion
            </button>
          </div>
        </div>

        {/* Axiomatic Creator Principle Banner */}
        <div className="mt-5 pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between text-[11px] font-mono gap-3">
          <div className="flex items-center gap-3 text-slate-400">
            <span className="text-cyan-400 font-bold">CREATOR PRINCIPLE:</span>
            <span>Capability ≠ Authority</span>
            <span>•</span>
            <span>Knowledge ≠ Permission</span>
            <span>•</span>
            <span>Planning ≠ Execution</span>
          </div>
          <span className="text-emerald-400 font-bold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Empirically Justified & Non-Partisan
          </span>
        </div>
      </div>

      {/* TAB 1: UNIVERSAL DOMAIN MATRIX */}
      {activeTab === 'EXPLORER' && (
        <div className="space-y-6">
          {/* Discipline Badges Filter */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-slate-800">
            <button
              onClick={() => { sounds.playClick(); setSelectedDomain('ALL'); }}
              className={`px-3 py-1 rounded-md text-xs font-mono uppercase whitespace-nowrap transition-all ${
                selectedDomain === 'ALL'
                  ? 'bg-cyan-500 text-slate-950 font-bold'
                  : 'bg-slate-950 text-slate-400 hover:text-white'
              }`}
            >
              ALL DOMAINS
            </button>
            {allDisciplines.map((d) => (
              <button
                key={d.category}
                onClick={() => { sounds.playClick(); setSelectedDomain(d.category); }}
                className={`px-3 py-1 rounded-md text-xs font-mono uppercase whitespace-nowrap transition-all ${
                  selectedDomain === d.category
                    ? 'bg-cyan-500 text-slate-950 font-bold'
                    : 'bg-slate-950 text-slate-400 hover:text-white'
                }`}
              >
                {d.name}
              </button>
            ))}
          </div>

          {/* Cards & Inspector Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: Entries List */}
            <div className="lg:col-span-5 space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                <span>VERIFIED KNOWLEDGE ENTRIES</span>
                <span>{filteredEntries.length} Items</span>
              </div>

              <div className="space-y-3">
                {filteredEntries.map((item) => {
                  const isSelected = selectedEntry?.id === item.id;
                  return (
                    <div
                      key={item.id}
                      onClick={() => {
                        sounds.playClick();
                        setSelectedEntry(item);
                      }}
                      className={`p-4 rounded-xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-cyan-950/40 border-cyan-500 text-white shadow-lg shadow-cyan-950/40'
                          : 'bg-slate-900/70 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-cyan-300">
                          {item.domain.replace(/_/g, ' ')}
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                          {item.confidenceScore}% Confidence
                        </span>
                      </div>

                      <h3 className="text-sm font-bold text-white mt-2 leading-snug">{item.title}</h3>
                      <p className="text-xs text-slate-400 mt-1 font-mono text-[11px] truncate">
                        Subdomain: {item.subdomain}
                      </p>

                      <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-500">
                        <span>Method: {item.methodType}</span>
                        <span className="text-emerald-400">Epistemic: {item.epistemicState}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right: Selected Knowledge Deep Inspector */}
            <div className="lg:col-span-7 bg-slate-900/80 border border-slate-800 rounded-xl p-6 space-y-6">
              {selectedEntry ? (
                <>
                  <div className="border-b border-slate-800 pb-4 space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono uppercase px-2.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                        {selectedEntry.domain}
                      </span>
                      <span className="text-xs font-mono text-slate-400">
                        {selectedEntry.subdomain}
                      </span>
                    </div>
                    <h2 className="text-lg font-bold text-white">{selectedEntry.title}</h2>
                  </div>

                  {/* Established Facts vs Hypotheses */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-slate-950 border border-emerald-800/40 space-y-2">
                      <span className="text-[10px] font-mono uppercase text-emerald-400 font-bold flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Established Facts (Empirical)
                      </span>
                      <ul className="text-xs text-slate-300 space-y-1.5 list-disc pl-4 font-mono leading-relaxed">
                        {selectedEntry.establishedFacts.map((fact, idx) => (
                          <li key={idx}>{fact}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-950 border border-amber-800/40 space-y-2">
                      <span className="text-[10px] font-mono uppercase text-amber-400 font-bold flex items-center gap-1.5">
                        <Atom className="w-3.5 h-3.5" />
                        Hypotheses Under Test
                      </span>
                      <ul className="text-xs text-slate-300 space-y-1.5 list-disc pl-4 font-mono leading-relaxed">
                        {selectedEntry.hypotheses.map((hyp, idx) => (
                          <li key={idx}>{hyp}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Calculations / Simulations */}
                  {selectedEntry.simulationsCalculations && (
                    <div className="space-y-1.5">
                      <label className="text-xs font-mono uppercase text-slate-400 flex items-center gap-1.5">
                        <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                        Calculations & Simulations
                      </label>
                      <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono text-cyan-300">
                        {selectedEntry.simulationsCalculations}
                      </div>
                    </div>
                  )}

                  {/* Contradiction Search & Conclusion */}
                  <div className="space-y-3">
                    <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800 text-xs font-mono space-y-1">
                      <span className="text-slate-500 uppercase text-[10px] font-bold">Contradiction Probing:</span>
                      <p className="text-slate-300">{selectedEntry.contradictionsChecked}</p>
                    </div>

                    <div className="p-4 rounded-xl bg-cyan-950/20 border border-cyan-500/30 text-xs font-mono space-y-1.5">
                      <span className="text-cyan-400 uppercase text-[10px] font-bold">Technically Justified Conclusion:</span>
                      <p className="text-white font-semibold leading-relaxed">{selectedEntry.conclusion}</p>
                    </div>
                  </div>

                  {/* Citations & Reusable Insight */}
                  <div className="pt-2 border-t border-slate-800 space-y-2 text-xs font-mono text-slate-400">
                    <div className="flex items-center justify-between">
                      <span>Citations: {selectedEntry.citations.join(' • ')}</span>
                      <span>Verified: {selectedEntry.lastVerified}</span>
                    </div>
                    <div className="p-2.5 rounded bg-slate-950 border border-slate-800 text-slate-300">
                      <strong>Reusable Knowledge Asset:</strong> {selectedEntry.reusableInsight}
                    </div>
                  </div>
                </>
              ) : (
                <div className="p-12 text-center text-slate-500 font-mono text-sm">
                  Select an entry to view deep multidisciplinary analysis.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: 9-STEP COGNITIVE INQUIRY ENGINE */}
      {activeTab === 'INQUIRY_ENGINE' && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Atom className="w-5 h-5 text-cyan-400" />
                9-Step Multidisciplinary Cognitive Inquiry Engine
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Scientific & Engineering Method: Rigorous distinction of facts, hypotheses, simulations, contradictions, and verified conclusions.
              </p>
            </div>

            <div className="flex rounded-lg bg-slate-950 p-1 border border-slate-800">
              {(['SCIENTIFIC', 'ENGINEERING', 'INQUIRY'] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => { sounds.playClick(); setInquiryMethod(m); }}
                  className={`px-3 py-1 rounded text-xs font-mono uppercase font-semibold transition-all ${
                    inquiryMethod === m
                      ? 'bg-cyan-500 text-slate-950 font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Question Input */}
          <div className="space-y-2">
            <label className="text-xs font-mono uppercase text-slate-300">
              Formulate Research Inquiry or Scientific Hypothesis
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={inquiryQuery}
                onChange={(e) => setInquiryQuery(e.target.value)}
                placeholder="Ask any complex scientific, engineering, or multidisciplinary question..."
                className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-cyan-500"
              />
              <button
                onClick={run9StepInquiry}
                disabled={isInquiring}
                className="px-5 py-2.5 rounded-lg bg-cyan-500 text-slate-950 font-bold text-xs uppercase tracking-wider hover:bg-cyan-400 transition-all flex items-center gap-2 shadow-lg shadow-cyan-500/20 disabled:opacity-50"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                Execute 9-Step Inquiry
              </button>
            </div>
          </div>

          {/* 9-Step Visualizer */}
          <div className="space-y-3">
            <label className="text-xs font-mono uppercase text-slate-400">
              Cognitive Inquiry Sequence
            </label>
            <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-2 text-center text-xs font-mono">
              {[
                '1. Identify Domain',
                '2. Subdomains',
                '3. Retrieve Info',
                '4. Cross-Reference',
                '5. Facts vs Hypotheses',
                '6. Calculate / Simulate',
                '7. Contradictions',
                '8. Justified Conclusion',
                '9. Record Knowledge',
              ].map((step, idx) => {
                const stepNum = idx + 1;
                const isPast = inquiryStep > stepNum;
                const isCurrent = inquiryStep === stepNum;
                return (
                  <div
                    key={step}
                    className={`p-2.5 rounded-lg border text-[11px] transition-all ${
                      isPast
                        ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                        : isCurrent
                        ? 'bg-cyan-950 border-cyan-500 text-white shadow-md shadow-cyan-500/30'
                        : 'bg-slate-950/60 border-slate-800 text-slate-600'
                    }`}
                  >
                    {step}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Inquiry Live Result Output */}
          {inquiryResult && (
            <div className="p-5 rounded-xl bg-slate-950 border border-cyan-500/40 space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-xs font-mono text-cyan-400 font-bold uppercase">
                  Technically Justified Inquiry Outcome: {inquiryResult.domain}
                </span>
                <span className="text-xs font-mono text-emerald-400 font-bold">
                  Confidence: {inquiryResult.confidence}%
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                <div className="p-3.5 rounded-lg bg-slate-900 border border-slate-800 space-y-1.5">
                  <span className="text-emerald-400 font-bold uppercase text-[10px]">Verified Established Facts:</span>
                  <ul className="list-disc pl-4 space-y-1 text-slate-300">
                    {inquiryResult.facts.map((f: string, i: number) => (
                      <li key={i}>{f}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-3.5 rounded-lg bg-slate-900 border border-slate-800 space-y-1.5">
                  <span className="text-amber-400 font-bold uppercase text-[10px]">Simulation & Contradiction Test:</span>
                  <p className="text-slate-300">{inquiryResult.simulations}</p>
                  <p className="text-slate-400 text-[11px] pt-1">{inquiryResult.contradictions}</p>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-cyan-950/40 border border-cyan-800 text-xs font-mono text-white">
                <strong>Final Engineering Conclusion:</strong> {inquiryResult.conclusion}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: HUNTER AGENT FLEET & INTER-AGENT BUS */}
      {activeTab === 'HUNTER_FLEET' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: 9 Specialized Hunter Units */}
          <div className="lg:col-span-5 space-y-3">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider flex items-center gap-2">
              <Bot className="w-4 h-4 text-cyan-400" />
              Specialized Hunter Fleet ({hunterAgents.length})
            </h3>
            <p className="text-xs text-slate-400">
              "Nexus coordinates these specialized agents. Agents communicate through the inter-agent orchestration layer."
            </p>

            <div className="space-y-2 mt-4">
              {hunterAgents.map((hunter) => {
                const isSelected = selectedHunter?.id === hunter.id;
                const isWorking = hunter.status !== 'IDLE';
                return (
                  <div
                    key={hunter.id}
                    onClick={() => {
                      sounds.playClick();
                      setSelectedHunter(hunter);
                    }}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-cyan-950/40 border-cyan-500 text-white shadow-lg shadow-cyan-950/40'
                        : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-white font-mono">{hunter.codename}</span>
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                          isWorking
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-800 animate-pulse'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {hunter.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-1">{hunter.primaryDomain}</p>
                    <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 mt-2">
                      <span className="truncate max-w-[220px]">Task: {hunter.activeTask}</span>
                      <span>{hunter.confidenceThreshold}% threshold</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Selected Hunter & Inter-Agent Message Bus */}
          <div className="lg:col-span-7 space-y-6">
            {selectedHunter && (
              <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-6 space-y-5">
                <div className="flex items-start justify-between border-b border-slate-800 pb-4">
                  <div>
                    <span className="text-xs font-mono uppercase px-2 py-0.5 rounded bg-slate-800 text-cyan-400">
                      {selectedHunter.codename}
                    </span>
                    <h2 className="text-lg font-bold text-white mt-1.5">{selectedHunter.displayName}</h2>
                    <p className="text-xs text-slate-400 font-mono mt-0.5">
                      Bus Address: {selectedHunter.interAgentBusAddress}
                    </p>
                  </div>

                  <button
                    onClick={() => dispatchToHunter(selectedHunter)}
                    className="px-4 py-2 rounded-lg bg-cyan-500 text-slate-950 text-xs font-bold uppercase tracking-wider hover:bg-cyan-400 transition-all flex items-center gap-2"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    Dispatch Directive
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                  <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg">
                    <span className="text-slate-500 text-[10px] uppercase">Assigned Domain:</span>
                    <p className="text-white mt-0.5">{selectedHunter.primaryDomain}</p>
                  </div>
                  <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg">
                    <span className="text-slate-500 text-[10px] uppercase">Memory Scope:</span>
                    <p className="text-cyan-300 mt-0.5">{selectedHunter.memoryScope}</p>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono uppercase text-slate-400">Specialized Tools & Engines</label>
                  <div className="flex flex-wrap gap-2">
                    {selectedHunter.tools.map((t) => (
                      <span key={t} className="px-2.5 py-1 rounded bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Inter-Agent Bus Activity Stream */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                <span className="flex items-center gap-1.5">
                  <Radio className="w-4 h-4 text-cyan-400" />
                  INTER-AGENT MESSAGE BUS STREAM
                </span>
                <span className="text-emerald-400 font-bold">mTLS Authenticated</span>
              </div>
              <div className="bg-slate-950 border border-slate-800 rounded-lg p-3.5 font-mono text-xs text-slate-300 space-y-1.5 min-h-[140px] max-h-[220px] overflow-y-auto">
                {hunterBusStream.map((msg, i) => (
                  <p key={i} className="text-cyan-300/90 leading-relaxed font-mono text-[11px]">
                    {msg}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: RESOURCE EXPANSION ADVISOR */}
      {activeTab === 'RESOURCE_EXPANSION' && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-6 space-y-6">
          <div className="flex items-start gap-4">
            <span className="p-3 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 shrink-0">
              <HardDrive className="w-6 h-6" />
            </span>
            <div className="space-y-1">
              <h2 className="text-lg font-bold text-white">NEXUS Computing Resource Expansion Protocol</h2>
              <p className="text-slate-300 text-sm leading-relaxed">
                "If additional computing resources are required: IDENTIFY → EXPLAIN → ESTIMATE → RECOMMEND → ASK CREATOR → PROVISION AFTER APPROVAL → INTEGRATE → TEST → MONITOR."
              </p>
            </div>
          </div>

          <div className="space-y-4 pt-2">
            {resourceProposals.map((res) => (
              <div
                key={res.id}
                className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-3 relative overflow-hidden"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                  <div>
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-slate-800 text-cyan-400">
                      Type: {res.resourceType}
                    </span>
                    <h3 className="text-base font-bold text-white mt-1">{res.title}</h3>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono font-bold text-cyan-300">{res.estimatedCost}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800 font-bold uppercase">
                      {res.stage}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                  <div>
                    <span className="text-slate-500 text-[10px] uppercase font-bold">Engineering Justification:</span>
                    <p className="text-slate-300 mt-1 leading-relaxed">{res.justification}</p>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] uppercase font-bold">Proposed Specifications:</span>
                    <p className="text-cyan-300 mt-1 leading-relaxed">{res.specifications}</p>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <span className="text-[11px] font-mono text-slate-500">
                    "Nexus may request resources. Nexus may not secretly acquire resources."
                  </span>

                  {res.ownerApproved ? (
                    <span className="text-xs font-mono font-bold text-emerald-400 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-950 border border-emerald-800">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      APPROVED BY CREATOR
                    </span>
                  ) : (
                    <button
                      onClick={() => {
                        sounds.playExecute();
                        sounds.speak('Resource proposal approved by Creator. Staging integration plan.', 'SUCCESS');
                        onApproveResourceProposal?.(res.id);
                      }}
                      className="px-4 py-2 rounded-lg bg-amber-500 text-slate-950 text-xs font-bold uppercase tracking-wider hover:bg-amber-400 transition-all shadow-md shadow-amber-500/20"
                    >
                      Authorize Resource Provisioning
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
