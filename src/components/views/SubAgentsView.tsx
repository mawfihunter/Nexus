import React, { useState } from 'react';
import {
  Bot,
  Plus,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Shield,
  Cpu,
  Layers,
  Activity,
  Terminal,
  Search,
  MessageSquare,
  Sparkles,
  Lock,
  ArrowRight,
  Database,
  BarChart3,
  X,
} from 'lucide-react';
import { SubAgent, SubAgentCreationProposal } from '../../types/nexus';
import { sounds } from '../../utils/audio';

interface SubAgentsViewProps {
  subAgents: SubAgent[];
  onUpdateSubAgents?: (agents: SubAgent[]) => void;
}

export const SubAgentsView: React.FC<SubAgentsViewProps> = ({ subAgents, onUpdateSubAgents }) => {
  const [agentsList, setAgentsList] = useState<SubAgent[]>(subAgents);
  const [selectedAgent, setSelectedAgent] = useState<SubAgent | null>(subAgents[0] || null);
  const [filterType, setFilterType] = useState<string>('ALL');
  const [showCreationModal, setShowCreationModal] = useState<boolean>(false);

  // 5-step proposal protocol state
  const [proposalStep, setProposalStep] = useState<number>(1);
  const [newAgentProposal, setNewAgentProposal] = useState<SubAgentCreationProposal>({
    agentName: 'Nexus Security Audit Agent',
    agentType: 'CUSTOM',
    whyNeeded: 'Need continuous automated auditing of local network attack surfaces and Docker socket exposure.',
    purpose: 'Perform scheduled passive port scans, audit open listeners, and alert when unexpected daemons start.',
    requiredResources: { cpuCores: 2, ramMb: 1024, storageGb: 10 },
    requiredPermissions: ['NETWORK_READ', 'PROCESS_INSPECT', 'ALERT_DISPATCH'],
    memoryScope: 'SECURITY_AUDIT_LOGS',
    communicationMethod: 'SECURE_IPC',
  });

  const toggleAgentStatus = (agentId: string) => {
    sounds.playClick();
    setAgentsList((prev) =>
      prev.map((a) => {
        if (a.id === agentId) {
          const nextStatus = a.status === 'RUNNING' ? 'PAUSED' : 'RUNNING';
          sounds.speak(
            `${a.name} is now ${nextStatus === 'RUNNING' ? 'running' : 'paused'}.`,
            'NORMAL'
          );
          return { ...a, status: nextStatus };
        }
        return a;
      })
    );
  };

  const handleCreateAgent = () => {
    sounds.playSuccessTone();
    sounds.speak(
      `New persistent agent ${newAgentProposal.agentName} created, registered, and monitored.`,
      'SUCCESS'
    );

    const newAgent: SubAgent = {
      id: `sub-${Date.now()}`,
      name: newAgentProposal.agentName,
      type: newAgentProposal.agentType,
      purpose: newAgentProposal.purpose,
      status: 'RUNNING',
      capabilities: ['CUSTOM_EXECUTION', 'AUTONOMOUS_MONITORING'],
      permissions: newAgentProposal.requiredPermissions,
      memoryScope: newAgentProposal.memoryScope,
      communicationMethod: newAgentProposal.communicationMethod,
      resourceAllocation: newAgentProposal.requiredResources,
      currentTask: 'Initial environment baseline discovery and socket inspection',
      createdDate: new Date().toISOString().split('T')[0],
      lifecycleStage: 'MONITORED',
    };

    const updated = [newAgent, ...agentsList];
    setAgentsList(updated);
    setSelectedAgent(newAgent);
    setShowCreationModal(false);
    setProposalStep(1);
    onUpdateSubAgents?.(updated);
  };

  const filteredAgents =
    filterType === 'ALL' ? agentsList : agentsList.filter((a) => a.type === filterType);

  return (
    <div className="space-y-6">
      {/* Top Banner & Agent Creation Directive */}
      <div className="bg-slate-900/90 border border-cyan-500/30 rounded-xl p-6 relative overflow-hidden backdrop-blur-md">
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <span className="p-2.5 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                <Bot className="w-6 h-6 animate-pulse" />
              </span>
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                  DIGITAL POPULATION & AGENT CREATION
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800">
                    {agentsList.length} Active Specialized Agents
                  </span>
                </h1>
                <p className="text-slate-400 text-sm">
                  "You may design specialized sub-agents when the system supports agent creation. Each agent must have identity, purpose, capabilities, permissions, memory scope, and status."
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              sounds.playClick();
              setShowCreationModal(true);
            }}
            className="px-4 py-2.5 rounded-lg bg-cyan-500 text-slate-950 font-bold text-xs uppercase tracking-wider hover:bg-cyan-400 transition-all flex items-center gap-2 shadow-lg shadow-cyan-500/20 self-start lg:self-auto"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            Propose Sub-Agent (5-Step Protocol)
          </button>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-2 mt-6 pt-4 border-t border-slate-800">
          {[
            'ALL',
            'RESEARCH',
            'CODING',
            'MONITORING',
            'BUSINESS',
            'MARKETING',
            'DEVOPS',
            'DATA',
            'COMMUNICATION',
          ].map((type) => (
            <button
              key={type}
              onClick={() => {
                sounds.playClick();
                setFilterType(type);
              }}
              className={`px-3 py-1 rounded-md text-xs font-mono uppercase transition-all ${
                filterType === type
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold'
                  : 'bg-slate-950/60 text-slate-400 border border-slate-800 hover:text-white'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Sub-Agents List & Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Agents List Cards */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
            <span>REGISTERED DIGITAL POPULATION</span>
            <span>{filteredAgents.length} Agents</span>
          </div>

          <div className="space-y-3">
            {filteredAgents.map((agent) => {
              const isSelected = selectedAgent?.id === agent.id;
              const isRunning = agent.status === 'RUNNING';
              return (
                <div
                  key={agent.id}
                  onClick={() => {
                    sounds.playClick();
                    setSelectedAgent(agent);
                  }}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-cyan-950/40 border-cyan-500 text-white shadow-lg shadow-cyan-950/40'
                      : 'bg-slate-900/70 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-cyan-300 font-semibold">
                          {agent.type}
                        </span>
                        <span className="text-[10px] font-mono text-slate-500">
                          Lifecycle: {agent.lifecycleStage}
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-white mt-1.5">{agent.name}</h3>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                          isRunning
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {agent.status}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleAgentStatus(agent.id);
                        }}
                        title={isRunning ? 'Pause Agent' : 'Resume Agent'}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
                      >
                        {isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                    {agent.purpose}
                  </p>

                  <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-400">
                    <span className="text-cyan-400 truncate max-w-[240px]">
                      Task: {agent.currentTask || 'Idle'}
                    </span>
                    <span>
                      {agent.resourceAllocation.cpuCores}C / {agent.resourceAllocation.ramMb}MB
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Selected Agent Deep Telemetry & Authority Scope */}
        <div className="lg:col-span-7 bg-slate-900/80 border border-slate-800 rounded-xl p-6 space-y-6">
          {selectedAgent ? (
            <>
              <div className="flex items-start justify-between border-b border-slate-800 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono uppercase px-2.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                      {selectedAgent.type} SPECIALIST
                    </span>
                    <span className="text-xs font-mono text-slate-400">
                      ID: {selectedAgent.id}
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-white mt-2">{selectedAgent.name}</h2>
                  <p className="text-xs text-slate-400 mt-1">{selectedAgent.purpose}</p>
                </div>

                <button
                  onClick={() => toggleAgentStatus(selectedAgent.id)}
                  className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
                    selectedAgent.status === 'RUNNING'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30'
                      : 'bg-emerald-500 text-slate-950 hover:bg-emerald-400'
                  }`}
                >
                  {selectedAgent.status === 'RUNNING' ? (
                    <>
                      <Pause className="w-3.5 h-3.5" /> Pause Execution
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 fill-current" /> Resume Agent
                    </>
                  )}
                </button>
              </div>

              {/* Current Task Box */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                <span className="text-[10px] font-mono uppercase text-cyan-400 tracking-wider">
                  Active Execution Stream
                </span>
                <p className="text-xs font-mono text-white flex items-center gap-2">
                  <Activity className="w-4 h-4 text-emerald-400 animate-spin" />
                  {selectedAgent.currentTask || 'Idle / Waiting for queue task'}
                </p>
              </div>

              {/* Specs and Scopes */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-3.5 rounded-lg bg-slate-950/60 border border-slate-800">
                  <span className="text-[10px] font-mono uppercase text-slate-500">
                    Resource Allocation
                  </span>
                  <p className="text-sm font-bold text-white mt-1">
                    {selectedAgent.resourceAllocation.cpuCores} Cores
                  </p>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">
                    {selectedAgent.resourceAllocation.ramMb} MB RAM |{' '}
                    {selectedAgent.resourceAllocation.storageGb} GB
                  </p>
                </div>

                <div className="p-3.5 rounded-lg bg-slate-950/60 border border-slate-800">
                  <span className="text-[10px] font-mono uppercase text-slate-500">Memory Scope</span>
                  <p className="text-sm font-bold text-cyan-300 mt-1">{selectedAgent.memoryScope}</p>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">Isolated Context Enclave</p>
                </div>

                <div className="p-3.5 rounded-lg bg-slate-950/60 border border-slate-800">
                  <span className="text-[10px] font-mono uppercase text-slate-500">
                    Communication Bus
                  </span>
                  <p className="text-sm font-bold text-white mt-1">
                    {selectedAgent.communicationMethod}
                  </p>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">NEXUS IPC Pipe</p>
                </div>
              </div>

              {/* Authority & Permissions Section */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                  <Shield className="w-4 h-4 text-cyan-400" />
                  Authorized Capabilities & Permissions
                </label>
                <div className="flex flex-wrap gap-2">
                  {selectedAgent.permissions.map((perm) => (
                    <span
                      key={perm}
                      className="px-2.5 py-1 rounded bg-slate-950 border border-slate-800 text-[11px] font-mono text-emerald-300 flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      {perm}
                    </span>
                  ))}
                </div>
              </div>

              {/* Lifecycle Stage Trail */}
              <div className="space-y-2 pt-2">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Agent Lifecycle Audit: CREATE → CONFIGURE → TEST → REGISTER → MONITOR → REPORT
                </label>
                <div className="grid grid-cols-6 gap-2 text-center text-[10px] font-mono">
                  {['CREATED', 'CONFIGURED', 'TESTED', 'REGISTERED', 'MONITORED', 'REPORTED'].map(
                    (stage, i) => (
                      <div
                        key={stage}
                        className={`p-2 rounded border ${
                          i <= 4
                            ? 'bg-cyan-950/50 border-cyan-500/50 text-cyan-300 font-bold'
                            : 'bg-slate-950 border-slate-800 text-slate-600'
                        }`}
                      >
                        {stage}
                      </div>
                    )
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="p-12 text-center text-slate-500 font-mono text-sm">
              Select an agent to inspect telemetry and permissions.
            </div>
          )}
        </div>
      </div>

      {/* 5-Step Agent Proposal Modal */}
      {showCreationModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-cyan-500/40 rounded-2xl max-w-xl w-full p-6 space-y-6 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-cyan-400" />
                <h3 className="text-lg font-bold text-white">
                  5-Step Sub-Agent Creation Protocol
                </h3>
              </div>
              <button
                onClick={() => setShowCreationModal(false)}
                className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Protocol Step Indicator */}
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 px-2">
              <span className={proposalStep >= 1 ? 'text-cyan-400 font-bold' : ''}>1. Why Needed</span>
              <span>→</span>
              <span className={proposalStep >= 2 ? 'text-cyan-400 font-bold' : ''}>2. Purpose</span>
              <span>→</span>
              <span className={proposalStep >= 3 ? 'text-cyan-400 font-bold' : ''}>3. Resources</span>
              <span>→</span>
              <span className={proposalStep >= 4 ? 'text-cyan-400 font-bold' : ''}>4. Permissions</span>
              <span>→</span>
              <span className={proposalStep >= 5 ? 'text-amber-400 font-bold' : ''}>5. Creator Approval</span>
            </div>

            {/* Step 1: Why Needed */}
            {proposalStep === 1 && (
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-mono uppercase text-slate-300">
                    Agent Name & Type
                  </label>
                  <input
                    type="text"
                    value={newAgentProposal.agentName}
                    onChange={(e) =>
                      setNewAgentProposal({ ...newAgentProposal, agentName: e.target.value })
                    }
                    className="w-full mt-1.5 bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-xs font-mono text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-mono uppercase text-slate-300">
                    Step 1: Why is this specialized agent needed?
                  </label>
                  <textarea
                    rows={3}
                    value={newAgentProposal.whyNeeded}
                    onChange={(e) =>
                      setNewAgentProposal({ ...newAgentProposal, whyNeeded: e.target.value })
                    }
                    className="w-full mt-1.5 bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>
            )}

            {/* Step 2: Purpose */}
            {proposalStep === 2 && (
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-mono uppercase text-slate-300">
                    Step 2: Operational Purpose & Objectives
                  </label>
                  <textarea
                    rows={3}
                    value={newAgentProposal.purpose}
                    onChange={(e) =>
                      setNewAgentProposal({ ...newAgentProposal, purpose: e.target.value })
                    }
                    className="w-full mt-1.5 bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-mono uppercase text-slate-300">
                    Memory Scope & Knowledge Boundary
                  </label>
                  <input
                    type="text"
                    value={newAgentProposal.memoryScope}
                    onChange={(e) =>
                      setNewAgentProposal({ ...newAgentProposal, memoryScope: e.target.value })
                    }
                    className="w-full mt-1.5 bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-xs font-mono text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>
            )}

            {/* Step 3: Required Resources */}
            {proposalStep === 3 && (
              <div className="space-y-4">
                <label className="text-xs font-mono uppercase text-slate-300">
                  Step 3: Compute & Memory Requirements
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg">
                    <span className="text-[10px] font-mono text-slate-500">CPU Cores</span>
                    <input
                      type="number"
                      value={newAgentProposal.requiredResources.cpuCores}
                      onChange={(e) =>
                        setNewAgentProposal({
                          ...newAgentProposal,
                          requiredResources: {
                            ...newAgentProposal.requiredResources,
                            cpuCores: Number(e.target.value),
                          },
                        })
                      }
                      className="w-full mt-1 bg-transparent text-white font-mono text-sm focus:outline-none"
                    />
                  </div>
                  <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg">
                    <span className="text-[10px] font-mono text-slate-500">RAM (MB)</span>
                    <input
                      type="number"
                      value={newAgentProposal.requiredResources.ramMb}
                      onChange={(e) =>
                        setNewAgentProposal({
                          ...newAgentProposal,
                          requiredResources: {
                            ...newAgentProposal.requiredResources,
                            ramMb: Number(e.target.value),
                          },
                        })
                      }
                      className="w-full mt-1 bg-transparent text-white font-mono text-sm focus:outline-none"
                    />
                  </div>
                  <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg">
                    <span className="text-[10px] font-mono text-slate-500">Storage (GB)</span>
                    <input
                      type="number"
                      value={newAgentProposal.requiredResources.storageGb}
                      onChange={(e) =>
                        setNewAgentProposal({
                          ...newAgentProposal,
                          requiredResources: {
                            ...newAgentProposal.requiredResources,
                            storageGb: Number(e.target.value),
                          },
                        })
                      }
                      className="w-full mt-1 bg-transparent text-white font-mono text-sm focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Required Permissions */}
            {proposalStep === 4 && (
              <div className="space-y-4">
                <label className="text-xs font-mono uppercase text-slate-300">
                  Step 4: Required Privileges & Boundary Permissions
                </label>
                <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-lg space-y-2">
                  {['NETWORK_READ', 'PROCESS_INSPECT', 'ALERT_DISPATCH', 'FILE_WRITE_LOGS'].map(
                    (perm) => (
                      <label key={perm} className="flex items-center gap-2 text-xs font-mono text-slate-300">
                        <input type="checkbox" defaultChecked className="accent-cyan-500" />
                        {perm}
                      </label>
                    )
                  )}
                </div>
                <p className="text-[11px] text-slate-400">
                  Sub-agents cannot self-authorize privileges outside Creator-granted boundaries.
                </p>
              </div>
            )}

            {/* Step 5: Creator Approval Gate */}
            {proposalStep === 5 && (
              <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/40 space-y-3">
                <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
                  <AlertTriangle className="w-4 h-4" />
                  Step 5: Creator Final Authorization Required
                </div>
                <div className="text-xs text-slate-300 space-y-1 font-mono">
                  <p>Agent: <strong className="text-white">{newAgentProposal.agentName}</strong></p>
                  <p>Purpose: {newAgentProposal.purpose}</p>
                  <p>Resources: {newAgentProposal.requiredResources.cpuCores} Cores | {newAgentProposal.requiredResources.ramMb} MB RAM</p>
                  <p className="text-amber-300">"Never create uncontrolled autonomous processes merely to increase presence."</p>
                </div>
              </div>
            )}

            {/* Navigation buttons */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-800">
              {proposalStep > 1 ? (
                <button
                  onClick={() => setProposalStep((prev) => prev - 1)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 text-xs font-semibold hover:text-white"
                >
                  Back
                </button>
              ) : (
                <div />
              )}

              {proposalStep < 5 ? (
                <button
                  onClick={() => setProposalStep((prev) => prev + 1)}
                  className="px-4 py-2 rounded-lg bg-cyan-500 text-slate-950 text-xs font-bold uppercase hover:bg-cyan-400"
                >
                  Next Step ({proposalStep}/5)
                </button>
              ) : (
                <button
                  onClick={handleCreateAgent}
                  className="px-5 py-2.5 rounded-lg bg-amber-500 text-slate-950 text-xs font-bold uppercase hover:bg-amber-400 shadow-lg shadow-amber-500/20 flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Grant Creator Approval & Spawn Agent
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
