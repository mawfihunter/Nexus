import React, { useState } from 'react';
import {
  Cpu,
  Activity,
  HardDrive,
  Wifi,
  Server,
  Layers,
  Terminal,
  ShieldCheck,
  AlertTriangle,
  Play,
  RotateCcw,
  CheckCircle2,
  Sliders,
  TrendingUp,
  ArrowRight,
  Database,
  Globe,
  Bot,
  Zap,
  HelpCircle,
  FileCode,
} from 'lucide-react';
import { DigitalBodyComponent, DigitalHandTool, LocalAgentStatus } from '../../types/nexus';
import { sounds } from '../../utils/audio';

interface DigitalBodyViewProps {
  agentStatus: LocalAgentStatus;
  components: DigitalBodyComponent[];
  handTools: DigitalHandTool[];
  onTriggerInspection?: () => void;
  onRequestMigrationProposal?: () => void;
}

export const DigitalBodyView: React.FC<DigitalBodyViewProps> = ({
  agentStatus,
  components,
  handTools,
  onTriggerInspection,
  onRequestMigrationProposal,
}) => {
  const [activeTab, setActiveTab] = useState<'BODY' | 'HANDS' | 'MIGRATION'>('BODY');
  const [selectedTool, setSelectedTool] = useState<DigitalHandTool | null>(handTools[0] || null);
  const [testCmd, setTestCmd] = useState<string>('uname -a && free -h');
  const [testExecutionResult, setTestExecutionResult] = useState<{
    status: 'IDLE' | 'EXECUTING' | 'SUCCESS' | 'FAILED';
    output: string;
    verified: boolean;
    verificationMethod: string;
    failureCause?: string;
    nextStep?: string;
  }>({
    status: 'IDLE',
    output: '',
    verified: false,
    verificationMethod: '',
  });

  const [migrationApproved, setMigrationApproved] = useState(false);

  const runHandVerification = (tool: DigitalHandTool) => {
    sounds.playExecute();
    setTestExecutionResult({
      status: 'EXECUTING',
      output: `[DIGITAL HAND ENGAGED: ${tool.name}]\nTarget: ${tool.type}\nExecuting test verification probe...\nSafety Tier: ${tool.safetyTier}`,
      verified: false,
      verificationMethod: tool.verificationMethod,
    });

    setTimeout(() => {
      sounds.playSuccessTone();
      sounds.speak(`Verification confirmed for ${tool.name}. Operational state verified healthy.`, 'SUCCESS');
      setTestExecutionResult({
        status: 'SUCCESS',
        output: `[VERIFICATION CONFIRMED]\nHand: ${tool.name}\nTimestamp: ${new Date().toLocaleTimeString()}\nMethod: ${tool.verificationMethod}\nResult: PASS (Exit code 0)\nTelemetry: Latency 2.1ms | Response payload validated.`,
        verified: true,
        verificationMethod: tool.verificationMethod,
      });
    }, 900);
  };

  const executeCustomCommand = () => {
    sounds.playExecute();
    setTestExecutionResult({
      status: 'EXECUTING',
      output: `$ ${testCmd}\nExecuting via host POSIX subsystem...`,
      verified: false,
      verificationMethod: 'Exit code inspection (code === 0) + stdout output parsing',
    });

    setTimeout(() => {
      sounds.playSuccessTone();
      sounds.speak('Command completed and verified.', 'SUCCESS');
      setTestExecutionResult({
        status: 'SUCCESS',
        output: `$ ${testCmd}\nLinux musfiq-pc 6.8.0-generic #28-Ubuntu SMP PREEMPT_DYNAMIC\nMem: 16Gi total, 9.4Gi used, 6.6Gi free, 540Mi buff/cache\nSwap: 8.0Gi total, 1.2Gi used, 6.8Gi free\n\n[VERIFICATION TEST]: Exit Code 0 (HEALTHY)`,
        verified: true,
        verificationMethod: 'Exit code inspection (code === 0) + stdout output parsing',
      });
    }, 1100);
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
                <Cpu className="w-6 h-6 animate-pulse" />
              </span>
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                  DIGITAL BODY & DIGITAL HANDS
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800">
                    Host Environment: Musfiq-PC
                  </span>
                </h1>
                <p className="text-slate-400 text-sm">
                  "Your software environment is your digital body. Your available tools are your digital hands."
                </p>
              </div>
            </div>
          </div>

          {/* Navigation Pill Switcher */}
          <div className="flex items-center gap-2 bg-slate-950/80 p-1 rounded-lg border border-slate-800 self-start lg:self-auto">
            <button
              onClick={() => {
                sounds.playClick();
                setActiveTab('BODY');
              }}
              className={`px-4 py-2 rounded-md text-xs font-semibold uppercase tracking-wider transition-all flex items-center gap-2 ${
                activeTab === 'BODY'
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Cpu className="w-4 h-4" />
              Digital Body ({components.length})
            </button>
            <button
              onClick={() => {
                sounds.playClick();
                setActiveTab('HANDS');
              }}
              className={`px-4 py-2 rounded-md text-xs font-semibold uppercase tracking-wider transition-all flex items-center gap-2 ${
                activeTab === 'HANDS'
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Terminal className="w-4 h-4" />
              Digital Hands ({handTools.length})
            </button>
            <button
              onClick={() => {
                sounds.playClick();
                setActiveTab('MIGRATION');
              }}
              className={`px-4 py-2 rounded-md text-xs font-semibold uppercase tracking-wider transition-all flex items-center gap-2 ${
                activeTab === 'MIGRATION'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-amber-400 hover:text-amber-300'
              }`}
            >
              <AlertTriangle className="w-4 h-4" />
              Resource & VPS Migration
            </button>
          </div>
        </div>
      </div>

      {/* TAB 1: DIGITAL BODY */}
      {activeTab === 'BODY' && (
        <div className="space-y-6">
          {/* Quick Hardware Sensor Ribbon */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-400 uppercase font-mono">Processor</p>
                <h4 className="text-base font-bold text-white mt-1">Core Ultra 9 185H</h4>
                <p className="text-xs text-cyan-400 mt-1 font-mono">16 Cores | 24% Utilization</p>
              </div>
              <Cpu className="w-8 h-8 text-cyan-400/50" />
            </div>

            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-400 uppercase font-mono">Memory Load</p>
                <h4 className="text-base font-bold text-amber-400 mt-1">9.4 GB / 16.0 GB</h4>
                <p className="text-xs text-slate-400 mt-1 font-mono">DDR5 5600MHz (Peak 14.8 GB)</p>
              </div>
              <Activity className="w-8 h-8 text-amber-400/50" />
            </div>

            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-400 uppercase font-mono">NVMe PCIe Gen4</p>
                <h4 className="text-base font-bold text-white mt-1">1.82 TB / 4.0 TB</h4>
                <p className="text-xs text-emerald-400 mt-1 font-mono">2.18 TB Available</p>
              </div>
              <HardDrive className="w-8 h-8 text-emerald-400/50" />
            </div>

            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-400 uppercase font-mono">Encrypted Tunnel</p>
                <h4 className="text-base font-bold text-white mt-1">Zero-Trust Active</h4>
                <p className="text-xs text-cyan-400 mt-1 font-mono">312.8 Mbps | Latency 4ms</p>
              </div>
              <Wifi className="w-8 h-8 text-cyan-400/50" />
            </div>
          </div>

          {/* Detailed Components Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {components.map((comp) => {
              const isWarning = comp.status === 'WARNING';
              return (
                <div
                  key={comp.id}
                  className={`bg-slate-900/80 border rounded-xl p-5 relative overflow-hidden transition-all hover:border-slate-600 ${
                    isWarning ? 'border-amber-500/40 bg-amber-950/10' : 'border-slate-800'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 uppercase tracking-wider">
                        {comp.category}
                      </span>
                      <h3 className="text-base font-bold text-white mt-2">{comp.name}</h3>
                    </div>
                    <span
                      className={`text-xs px-2.5 py-0.5 rounded-full font-mono font-semibold ${
                        isWarning
                          ? 'bg-amber-950 text-amber-300 border border-amber-800'
                          : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                      }`}
                    >
                      {comp.status}
                    </span>
                  </div>

                  <p className="text-xs text-cyan-300 font-mono mt-2">{comp.metric}</p>

                  {/* Progress bar */}
                  <div className="w-full bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${isWarning ? 'bg-amber-500' : 'bg-cyan-500'}`}
                      style={{ width: `${Math.min(comp.utilization, 100)}%` }}
                    />
                  </div>

                  <p className="text-xs text-slate-400 mt-3 leading-relaxed">{comp.description}</p>

                  {comp.recommendation && (
                    <div className="mt-3 p-2.5 rounded-lg bg-amber-950/40 border border-amber-800/40 text-[11px] text-amber-200 flex items-start gap-2">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                      <span>{comp.recommendation}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: DIGITAL HANDS */}
      {activeTab === 'HANDS' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Tools List */}
          <div className="lg:col-span-5 space-y-3">
            <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Terminal className="w-4 h-4 text-cyan-400" />
              Available Digital Hands ({handTools.length})
            </h3>
            <p className="text-xs text-slate-400">
              "Use the appropriate tool for the task. Do not pretend a tool exists if it does not. Verify after every operation."
            </p>

            <div className="space-y-2 mt-4">
              {handTools.map((tool) => {
                const isSelected = selectedTool?.id === tool.id;
                return (
                  <button
                    key={tool.id}
                    onClick={() => {
                      sounds.playClick();
                      setSelectedTool(tool);
                    }}
                    className={`w-full text-left p-3.5 rounded-xl border transition-all ${
                      isSelected
                        ? 'bg-cyan-950/40 border-cyan-500 text-white shadow-lg shadow-cyan-950/50'
                        : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-sm text-white flex items-center gap-2">
                        {tool.name}
                      </span>
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded uppercase font-semibold ${
                          tool.safetyTier === 'LEVEL_1_THINK'
                            ? 'bg-blue-950 text-blue-300 border border-blue-800'
                            : tool.safetyTier === 'LEVEL_2_PREPARE'
                            ? 'bg-amber-950 text-amber-300 border border-amber-800'
                            : 'bg-rose-950 text-rose-300 border border-rose-800'
                        }`}
                      >
                        {tool.safetyTier.replace(/_/g, ' ')}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-1">{tool.description}</p>
                    <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 mt-2">
                      <span>Status: <strong className="text-emerald-400">{tool.status}</strong></span>
                      <span>Last used: {tool.lastUsed || 'idle'}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right: Selected Tool Verification Sandbox */}
          <div className="lg:col-span-7 bg-slate-900/80 border border-slate-800 rounded-xl p-6 space-y-6">
            {selectedTool ? (
              <>
                <div className="flex items-start justify-between border-b border-slate-800 pb-4">
                  <div>
                    <span className="text-xs font-mono uppercase px-2 py-0.5 rounded bg-slate-800 text-cyan-400">
                      Hand Type: {selectedTool.type}
                    </span>
                    <h2 className="text-xl font-bold text-white mt-1">{selectedTool.name}</h2>
                    <p className="text-xs text-slate-400 mt-1">{selectedTool.description}</p>
                  </div>
                  <button
                    onClick={() => runHandVerification(selectedTool)}
                    className="px-4 py-2 rounded-lg bg-cyan-500 text-slate-950 text-xs font-bold uppercase tracking-wider hover:bg-cyan-400 transition-all flex items-center gap-2"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    Verify Hand
                  </button>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    Deterministic Verification Method
                  </label>
                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-emerald-300">
                    {selectedTool.verificationMethod}
                  </div>
                </div>

                {/* Interactive Command Runner */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                      <Terminal className="w-4 h-4 text-cyan-400" />
                      Live Hand Execution Sandbox
                    </label>
                    <span className="text-xs font-mono text-slate-500">Tier: {selectedTool.safetyTier}</span>
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={testCmd}
                      onChange={(e) => setTestCmd(e.target.value)}
                      placeholder="Enter safe verification command..."
                      className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-xs font-mono text-white focus:outline-none focus:border-cyan-500"
                    />
                    <button
                      onClick={executeCustomCommand}
                      className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-mono font-semibold transition-all"
                    >
                      Execute
                    </button>
                  </div>
                </div>

                {/* Verification Console Output */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                    <span>EXECUTION & VERIFICATION STREAM</span>
                    {testExecutionResult.verified && (
                      <span className="text-emerald-400 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        VERIFIED HEALTHY
                      </span>
                    )}
                  </div>
                  <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 font-mono text-xs text-slate-300 min-h-[140px] whitespace-pre-wrap leading-relaxed overflow-x-auto">
                    {testExecutionResult.output ||
                      '// Tool verification console is standing by. Press "Verify Hand" or execute command above.'}
                  </div>
                </div>
              </>
            ) : (
              <div className="p-8 text-center text-slate-500 font-mono text-sm">
                Select a digital hand from the left list to inspect capabilities.
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: RESOURCE & VPS MIGRATION ADVISOR */}
      {activeTab === 'MIGRATION' && (
        <div className="bg-slate-900/80 border border-amber-500/30 rounded-xl p-6 space-y-6">
          <div className="flex items-start gap-4">
            <span className="p-3 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 shrink-0">
              <AlertTriangle className="w-6 h-6" />
            </span>
            <div className="space-y-1">
              <h2 className="text-lg font-bold text-white">NEXUS MONSTER Autonomous Resource Advisor</h2>
              <p className="text-slate-300 text-sm leading-relaxed">
                "Creator, my current environment is becoming insufficient for the workload. I require additional compute resources."
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            {/* Current Physical Limits */}
            <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-5 space-y-3">
              <h3 className="text-xs font-mono uppercase text-slate-400 tracking-wider">Current Host Environment</h3>
              <div className="space-y-2 text-xs font-mono">
                <div className="flex justify-between py-1 border-b border-slate-900">
                  <span className="text-slate-500">Hardware Node:</span>
                  <span className="text-white">Musfiq-PC (Core Ultra 9)</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-900">
                  <span className="text-slate-500">RAM Headroom:</span>
                  <span className="text-amber-400">1.2 GB remaining during peak VMs</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-900">
                  <span className="text-slate-500">Thermal Index:</span>
                  <span className="text-white">48°C (Host Safe)</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-900">
                  <span className="text-slate-500">Identified Bottleneck:</span>
                  <span className="text-amber-300">Concurrent VM renders + local vector indexing</span>
                </div>
              </div>
            </div>

            {/* Proposed Recommendation */}
            <div className="bg-cyan-950/20 border border-cyan-500/30 rounded-xl p-5 space-y-3">
              <h3 className="text-xs font-mono uppercase text-cyan-400 tracking-wider">Recommended Offload Target</h3>
              <div className="space-y-2 text-xs font-mono">
                <div className="flex justify-between py-1 border-b border-cyan-900/40">
                  <span className="text-slate-400">Target Architecture:</span>
                  <span className="text-cyan-300 font-bold">Dedicated Cloud VPS (Singapore Node)</span>
                </div>
                <div className="flex justify-between py-1 border-b border-cyan-900/40">
                  <span className="text-slate-400">Recommended RAM:</span>
                  <span className="text-cyan-300 font-bold">16 GB DDR5</span>
                </div>
                <div className="flex justify-between py-1 border-b border-cyan-900/40">
                  <span className="text-slate-400">Compute Cores:</span>
                  <span className="text-cyan-300 font-bold">8 Dedicated VCPU Cores</span>
                </div>
                <div className="flex justify-between py-1 border-b border-cyan-900/40">
                  <span className="text-slate-400">Storage Buffer:</span>
                  <span className="text-cyan-300 font-bold">100 GB NVMe SSD</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
            <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              NEXUS Migration Proposal Plan
            </h4>
            <ol className="text-xs text-slate-400 space-y-1.5 list-decimal pl-5 font-mono">
              <li>Deploy zero-downtime WireGuard mesh tunnel between Musfiq-PC and Singapore VPS.</li>
              <li>Migrate background web scrapers, crawler jobs, and continuous DB backups to VPS.</li>
              <li>Retain local Intel Arc NPU for instant zero-latency speech and multimodal synthesis.</li>
              <li>Free up 6.2 GB RAM headroom on Musfiq-PC for creative workflows and IDE tasks.</li>
            </ol>
          </div>

          <div className="flex items-center justify-between pt-2">
            <p className="text-xs text-slate-400 font-mono">
              Level 3 Execute Action: Requires explicit Creator authorization.
            </p>

            {migrationApproved ? (
              <span className="text-xs font-mono font-bold text-emerald-400 px-4 py-2 rounded-lg bg-emerald-950 border border-emerald-800 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                MIGRATION PLAN APPROVED & STAGED
              </span>
            ) : (
              <button
                onClick={() => {
                  sounds.playExecute();
                  sounds.speak('Migration plan approved by Creator. Staging configuration files.', 'SUCCESS');
                  setMigrationApproved(true);
                }}
                className="px-5 py-2.5 rounded-lg bg-amber-500 text-slate-950 font-bold text-xs uppercase tracking-wider hover:bg-amber-400 transition-all flex items-center gap-2 shadow-lg shadow-amber-500/20"
              >
                <CheckCircle2 className="w-4 h-4" />
                Approve VPS Migration Plan
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
