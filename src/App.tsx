import React, { useState, useEffect } from 'react';
import {
  Cpu,
  Globe,
  Server,
  ShoppingBag,
  Briefcase,
  Users,
  Shield,
  Search,
  Tv,
  TrendingUp,
  Code2,
  Zap,
  Activity,
  FileText,
  AlertOctagon,
  Mic,
  Sparkles,
  ShieldAlert,
  Volume2,
  VolumeX,
  LayoutDashboard,
  Columns,
  Terminal,
  Layers,
  ChevronRight,
  HardDrive,
  Wifi,
  Brain,
  Bot,
  MessageSquare,
  Compass,
} from 'lucide-react';

import {
  initialLocalAgentStatus,
  initialBusinesses,
  initialClients,
  initialTeamMembers,
  initialSecurityAssets,
  initialHunterProjects,
  initialMediaStories,
  initialTVPrograms,
  initialVMs,
  initialServers,
  initialApprovals,
  initialAuditLogs,
  initialRepairJobs,
  initialAIMemories,
  initialAutomations,
  initialDailyBrief,
  initialProactiveObservations,
  initialCapabilityGaps,
  initialSubAgents,
  initialDigitalBodyComponents,
  initialDigitalHandTools,
  initialCommunicationDispatches,
  initialKnowledgeEntries,
  initialHunterAgents,
  initialResourceExpansions,
} from './data/mockData';

import {
  LocalAgentStatus,
  BusinessEntity,
  ClientRecord,
  TeamMember,
  SecurityAsset,
  HunterProject,
  MediaStory,
  TVProgram,
  VirtualMachine,
  ServerNode,
  ActionApproval,
  AuditLogItem,
  RepairJob,
  AIMemoryItem,
  AutomationRule,
  DailyBriefData,
  ActionPlan,
  AgentCapability,
  LivingState,
  ProactiveObservation,
  CapabilityGapAnalysis,
  SubAgent,
  DigitalBodyComponent,
  DigitalHandTool,
  CommunicationDispatch,
  KnowledgeEntry,
  HunterAgent,
  ResourceExpansionProposal,
} from './types/nexus';

import { sounds } from './utils/audio';

// Components
import { CommandPalette } from './components/CommandPalette';
import { VoiceModal } from './components/VoiceModal';
import { DailyBriefModal } from './components/DailyBriefModal';
import { ApprovalsDrawer } from './components/ApprovalsDrawer';
import { AiAssistantSidebar } from './components/AiAssistantSidebar';

// Views
import { DashboardOverview } from './components/views/DashboardOverview';
import { AutonomousIntelligenceView } from './components/views/AutonomousIntelligenceView';
import { UniversalKnowledgeView } from './components/views/UniversalKnowledgeView';
import { DigitalBodyView } from './components/views/DigitalBodyView';
import { SubAgentsView } from './components/views/SubAgentsView';
import { CommunicationView } from './components/views/CommunicationView';
import { LocalPcView } from './components/views/LocalPcView';
import { BrowserWorkspaceView } from './components/views/BrowserWorkspaceView';
import { VirtualBoxView } from './components/views/VirtualBoxView';
import { ServersView } from './components/views/ServersView';
import { BusinessView } from './components/views/BusinessView';
import { CrmView } from './components/views/CrmView';
import { TeamView } from './components/views/TeamView';
import { SecurityView } from './components/views/SecurityView';
import { HunterView } from './components/views/HunterView';
import { MediaTvView } from './components/views/MediaTvView';
import { MarketingView } from './components/views/MarketingView';
import { CodeCenterView } from './components/views/CodeCenterView';
import { AutomationView } from './components/views/AutomationView';
import { HealthRepairView } from './components/views/HealthRepairView';
import { AuditBackupView } from './components/views/AuditBackupView';
import { EmergencyView } from './components/views/EmergencyView';

export default function App() {
  // Navigation State
  const [activeNav, setActiveNav] = useState<string>('DASHBOARD');
  const [selectedBizParam, setSelectedBizParam] = useState<string | undefined>(undefined);

  // System State Store
  const [localAgent, setLocalAgent] = useState<LocalAgentStatus>(initialLocalAgentStatus);
  const [businesses, setBusinesses] = useState<BusinessEntity[]>(initialBusinesses);
  const [clients, setClients] = useState<ClientRecord[]>(initialClients);
  const [team, setTeam] = useState<TeamMember[]>(initialTeamMembers);
  const [securityAssets, setSecurityAssets] = useState<SecurityAsset[]>(initialSecurityAssets);
  const [hunterProjects, setHunterProjects] = useState<HunterProject[]>(initialHunterProjects);
  const [mediaStories, setMediaStories] = useState<MediaStory[]>(initialMediaStories);
  const [tvPrograms, setTvPrograms] = useState<TVProgram[]>(initialTVPrograms);
  const [vms, setVms] = useState<VirtualMachine[]>(initialVMs);
  const [servers, setServers] = useState<ServerNode[]>(initialServers);
  const [approvals, setApprovals] = useState<ActionApproval[]>(initialApprovals);
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>(initialAuditLogs);
  const [repairJobs, setRepairJobs] = useState<RepairJob[]>(initialRepairJobs);
  const [aiMemories, setAiMemories] = useState<AIMemoryItem[]>(initialAIMemories);
  const [automations, setAutomations] = useState<AutomationRule[]>(initialAutomations);
  const [dailyBrief, setDailyBrief] = useState<DailyBriefData>(initialDailyBrief);
  const [livingState, setLivingState] = useState<LivingState>('MONITORING');
  const [observations, setObservations] = useState<ProactiveObservation[]>(initialProactiveObservations);
  const [capabilityGaps, setCapabilityGaps] = useState<CapabilityGapAnalysis[]>(initialCapabilityGaps);
  const [subAgents, setSubAgents] = useState<SubAgent[]>(initialSubAgents);
  const [digitalBodyComponents, setDigitalBodyComponents] = useState<DigitalBodyComponent[]>(initialDigitalBodyComponents);
  const [digitalHandTools, setDigitalHandTools] = useState<DigitalHandTool[]>(initialDigitalHandTools);
  const [communicationDispatches, setCommunicationDispatches] = useState<CommunicationDispatch[]>(initialCommunicationDispatches);
  const [knowledgeEntries, setKnowledgeEntries] = useState<KnowledgeEntry[]>(initialKnowledgeEntries);
  const [hunterAgents, setHunterAgents] = useState<HunterAgent[]>(initialHunterAgents);
  const [resourceExpansions, setResourceExpansions] = useState<ResourceExpansionProposal[]>(initialResourceExpansions);

  // UI Modals & Panels State
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [isDailyBriefOpen, setIsDailyBriefOpen] = useState(false);
  const [isApprovalsOpen, setIsApprovalsOpen] = useState(false);
  const [isAiPaneOpen, setIsAiPaneOpen] = useState(true);
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);
  const [isRefreshingBrief, setIsRefreshingBrief] = useState(false);
  const [isDiagnosing, setIsDiagnosing] = useState(false);
  const [isRepairing, setIsRepairing] = useState(false);

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        sounds.playClick();
        setIsCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleToggleSound = () => {
    const next = !isSoundEnabled;
    setIsSoundEnabled(next);
    sounds.enabled = next;
    if (next) sounds.playClick();
  };

  // Dispatch Natural Language Command to Backend API with Autonomous Living State Transitions
  const handleDispatchCommand = async (query: string): Promise<ActionPlan> => {
    setLivingState('THINKING');
    try {
      const res = await fetch('/api/orchestrator/command', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });
      const plan: ActionPlan = await res.json();

      // State transitions based on permission boundary
      if (plan.requiresApproval) {
        setLivingState('WAITING_FOR_OWNER');
      } else if (plan.lifecycle === 'APPROVED') {
        setLivingState('EXECUTING');
        setTimeout(() => setLivingState('VERIFYING'), 600);
        setTimeout(() => setLivingState('SUCCESS'), 1200);
        setTimeout(() => setLivingState('MONITORING'), 2500);
      } else {
        setLivingState('MONITORING');
      }

      // Add to audit trail
      const auditItem: AuditLogItem = {
        id: `aud-${Date.now().toString().slice(-4)}`,
        actor: `NEXUS ${plan.executionTargetAgent} AGENT`,
        user: 'Owner (Musfiq)',
        service: plan.targetComponent,
        action: plan.explanation || `Executed: ${query}`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        result: 'SUCCESS',
        riskLevel: plan.riskLevel,
        approvalRequired: plan.requiresApproval,
      };
      setAuditLogs((prev) => [auditItem, ...prev]);

      // Learn insight into structured memory
      if (plan.learnedInsight) {
        const newLearnedFact: AIMemoryItem = {
          id: `mem-${Date.now().toString().slice(-4)}`,
          category: 'OWNER_MEMORY',
          key: `Observed Command Intent (${plan.intent})`,
          value: plan.learnedInsight,
          epistemicStatus: 'KNOWN',
          confidence: 95,
          lastUpdated: new Date().toLocaleDateString(),
          verifiedByOwner: true,
        };
        setAiMemories((prev) => [newLearnedFact, ...prev]);
      }

      // Handle high risk approvals with structured protocol
      if (plan.requiresApproval) {
        const appr: ActionApproval = {
          id: `appr-${Date.now().toString().slice(-4)}`,
          actionTitle: `Privileged Command: ${plan.intent}`,
          actor: `NEXUS ${plan.executionTargetAgent} AGENT`,
          service: plan.targetComponent,
          riskLevel: plan.riskLevel,
          timestamp: 'Just now',
          details: plan.explanation,
          protocol: plan.approvalProtocol,
          status: 'PENDING',
        };
        setApprovals((prev) => [appr, ...prev]);
        sounds.playAlert();
      }

      return plan;
    } catch (err) {
      setLivingState('ERROR');
      setTimeout(() => setLivingState('MONITORING'), 2000);
      throw err;
    }
  };

  // Observation Approval Handlers
  const handleApproveObservation = (obsId: string) => {
    sounds.playExecute();
    setLivingState('EXECUTING');
    setObservations((prev) =>
      prev.map((o) => (o.id === obsId ? { ...o, status: 'APPROVED' } : o))
    );
    setTimeout(() => {
      setLivingState('VERIFYING');
      sounds.playExecute();
    }, 600);
    setTimeout(() => {
      setLivingState('SUCCESS');
      alert(`Owner authorization verified. Proposal ${obsId} executed successfully.`);
    }, 1200);
    setTimeout(() => setLivingState('MONITORING'), 2500);
  };

  const handleDismissObservation = (obsId: string) => {
    sounds.playClick();
    setObservations((prev) =>
      prev.map((o) => (o.id === obsId ? { ...o, status: 'DISMISSED' } : o))
    );
  };

  const handleAddMemory = (newMemory: AIMemoryItem) => {
    sounds.playExecute();
    setAiMemories((prev) => [newMemory, ...prev]);
  };

  const handleDiagnoseGap = async (goal: string) => {
    sounds.playClick();
    setLivingState('THINKING');
    try {
      const res = await fetch('/api/orchestrator/capability-gap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userGoal: goal }),
      });
      const gapData = await res.json();
      setCapabilityGaps((prev) => [gapData, ...prev]);
      setLivingState('PLANNING');
      sounds.playExecute();
      return gapData;
    } finally {
      setTimeout(() => setLivingState('MONITORING'), 1500);
    }
  };

  // Execute Action Plan from Voice / Command bar
  const handleExecuteActionPlan = (plan: ActionPlan) => {
    sounds.playExecute();
    if (plan.targetComponent === 'BUSINESS') {
      setActiveNav('BUSINESS');
    } else if (plan.targetComponent === 'SERVERS') {
      setActiveNav('SERVERS');
    } else if (plan.targetComponent === 'LOCAL_PC') {
      setActiveNav('LOCAL_PC');
    } else if (plan.targetComponent === 'VIRTUALBOX') {
      setActiveNav('VMS');
    } else if (plan.targetComponent === 'BROWSER') {
      setActiveNav('BROWSER');
    } else if (plan.targetComponent === 'SECURITY') {
      setActiveNav('SECURITY');
    } else if (plan.targetComponent === 'MEDIA') {
      setActiveNav('MEDIA');
    } else if (plan.targetComponent === 'CODE') {
      setActiveNav('CODE');
    } else if (plan.targetComponent === 'DIGITAL_BODY') {
      setActiveNav('DIGITAL_BODY');
    } else if (plan.targetComponent === 'SUB_AGENTS') {
      setActiveNav('SUB_AGENTS');
    } else if (plan.targetComponent === 'COMMUNICATION') {
      setActiveNav('COMMUNICATION');
    } else if (plan.targetComponent === 'KNOWLEDGE' || plan.targetComponent === 'UNIVERSAL_KNOWLEDGE') {
      setActiveNav('UNIVERSAL_KNOWLEDGE');
    }
  };

  // Palette Direct Action Resolver
  const handleSelectPaletteAction = (actionKey: string, params?: any) => {
    sounds.playClick();
    if (actionKey === 'VIEW_BUSINESS') {
      setActiveNav('BUSINESS');
      if (params?.bizId) setSelectedBizParam(params.bizId);
    } else if (actionKey === 'OPEN_BROWSER_TAB') {
      setActiveNav('BROWSER');
    } else if (actionKey === 'NAV_LOCAL_PC') {
      setActiveNav('LOCAL_PC');
    } else if (actionKey === 'NAV_UNIVERSAL_KNOWLEDGE') {
      setActiveNav('UNIVERSAL_KNOWLEDGE');
    } else if (actionKey === 'NAV_DIGITAL_BODY') {
      setActiveNav('DIGITAL_BODY');
    } else if (actionKey === 'NAV_SUB_AGENTS') {
      setActiveNav('SUB_AGENTS');
    } else if (actionKey === 'NAV_COMMUNICATION') {
      setActiveNav('COMMUNICATION');
    } else if (actionKey === 'NAV_SERVERS') {
      setActiveNav('SERVERS');
    } else if (actionKey === 'NAV_CODE') {
      setActiveNav('CODE');
    } else if (actionKey === 'NAV_VMS') {
      setActiveNav('VMS');
    } else if (actionKey === 'NAV_SECURITY') {
      setActiveNav('SECURITY');
    } else if (actionKey === 'NAV_MEDIA') {
      setActiveNav('MEDIA');
    } else if (actionKey === 'TRIGGER_DAILY_BRIEF') {
      setIsDailyBriefOpen(true);
    } else if (actionKey === 'TRIGGER_DIAGNOSTICS') {
      setActiveNav('HEALTH');
      handleTriggerDiagnostic();
    }
  };

  // Regenerate Daily Brief via Server Gemini API
  const handleRefreshDailyBrief = async () => {
    setIsRefreshingBrief(true);
    try {
      const res = await fetch('/api/daily-brief', { method: 'POST' });
      const data = await res.json();
      setDailyBrief(data);
    } catch {
      // Fallback
    } finally {
      setIsRefreshingBrief(false);
    }
  };

  // Run Self-Diagnostics
  const handleTriggerDiagnostic = () => {
    sounds.playClick();
    setIsDiagnosing(true);
    setTimeout(() => {
      setIsDiagnosing(false);
      sounds.playExecute();
      alert('Node Diagnostics Complete: Intel Core Ultra 9 verified. Zero thermal or IPC socket anomalies.');
    }, 1200);
  };

  // Auto-Repair Trigger via Server API
  const handleTriggerRepair = async (component: string, issue: string) => {
    setIsRepairing(true);
    try {
      const res = await fetch('/api/diagnostics/repair', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetComponent: component, reportedIssue: issue }),
      });
      const newJob: RepairJob = await res.json();
      setRepairJobs((prev) => [newJob, ...prev]);
      return newJob;
    } finally {
      setIsRepairing(false);
    }
  };

  // Rollback Repair
  const handleRollbackRepair = (repairId: string) => {
    sounds.playExecute();
    setRepairJobs((prev) =>
      prev.map((r) => (r.id === repairId ? { ...r, rollbackStatus: 'ROLLED_BACK' } : r))
    );
    alert(`Repair ${repairId} safely rolled back to snapshot state.`);
  };

  // Toggle Capabilities
  const handleToggleCapability = (cap: AgentCapability) => {
    sounds.playClick();
    setLocalAgent((prev) => ({
      ...prev,
      capabilities: {
        ...prev.capabilities,
        [cap]: !prev.capabilities[cap],
      },
    }));
  };

  // VM state toggle
  const handleToggleVmState = (id: string, action: 'START' | 'STOP' | 'RESTART' | 'SNAPSHOT') => {
    sounds.playExecute();
    setVms((prev) =>
      prev.map((vm) => {
        if (vm.id !== id) return vm;
        if (action === 'START') return { ...vm, status: 'RUNNING' };
        if (action === 'STOP') return { ...vm, status: 'STOPPED' };
        if (action === 'SNAPSHOT') return { ...vm, snapshotsCount: vm.snapshotsCount + 1 };
        return vm;
      })
    );
  };

  // Approvals resolve
  const handleResolveApproval = (id: string, status: 'APPROVED' | 'DENIED') => {
    sounds.playExecute();
    setApprovals((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status } : a))
    );
  };

  const pendingApprovalsCount = approvals.filter((a) => a.status === 'PENDING').length;

  // Nav Items definition
  const navigationGroups = [
    {
      title: 'COMMAND & BODY',
      items: [
        { id: 'DASHBOARD', label: 'Command Center', icon: LayoutDashboard },
        { id: 'AUTONOMOUS_AI', label: 'System Intelligence', icon: Brain },
        { id: 'UNIVERSAL_KNOWLEDGE', label: 'Universal Knowledge', icon: Compass },
        { id: 'DIGITAL_BODY', label: 'Digital Body & Hands', icon: Cpu },
        { id: 'SUB_AGENTS', label: 'Digital Population', icon: Bot },
        { id: 'COMMUNICATION', label: 'Authorized Dispatch', icon: MessageSquare },
        { id: 'LOCAL_PC', label: 'Local PC (Ultra 9)', icon: Terminal },
        { id: 'BROWSER', label: 'Browser Workspaces', icon: Globe },
        { id: 'CODE', label: 'NEXUS Code (VS Code)', icon: Code2 },
      ],
    },
    {
      title: 'INFRASTRUCTURE',
      items: [
        { id: 'VMS', label: 'VirtualBox & Linux', icon: Terminal },
        { id: 'SERVERS', label: 'Cloud VPS & Fleet', icon: Server },
        { id: 'SECURITY', label: 'Cyber Security Labs', icon: Shield },
        { id: 'HUNTER', label: 'Hunter / OSINT', icon: Search },
      ],
    },
    {
      title: 'BUSINESS & OPS',
      items: [
        { id: 'BUSINESS', label: 'Business OS (Neo/Fitkart)', icon: ShoppingBag },
        { id: 'CRM', label: 'Client CRM', icon: Briefcase },
        { id: 'TEAM', label: 'Team Command', icon: Users },
        { id: 'MEDIA', label: 'Media & TV Broadcast', icon: Tv },
        { id: 'MARKETING', label: 'Marketing & Ads', icon: TrendingUp },
      ],
    },
    {
      title: 'SYSTEM & HEALING',
      items: [
        { id: 'AUTOMATION', label: 'Automation Engine', icon: Zap },
        { id: 'HEALTH', label: 'Auto-Repair & Health', icon: Activity },
        { id: 'AUDIT', label: 'Audit & AI Memory', icon: FileText },
        { id: 'EMERGENCY', label: 'Emergency Center', icon: AlertOctagon },
      ],
    },
  ];

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#08090c] text-zinc-100 font-sans">
      {/* 1. Left Navigation Rail */}
      <aside className="w-64 bg-[#0a0d13] border-r border-zinc-800/80 flex flex-col shrink-0 overflow-y-auto selection:bg-cyan-500/20">
        {/* Brand */}
        <div className="p-4 border-b border-zinc-800/80 bg-zinc-950/60 flex items-center justify-between">
          <div
            onClick={() => { sounds.playClick(); setActiveNav('DASHBOARD'); }}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-zinc-950 font-black shadow-lg shadow-cyan-500/30 group-hover:scale-105 transition-transform">
              N
            </div>
            <div>
              <div className="text-sm font-black tracking-tight text-zinc-100 group-hover:text-cyan-300 transition-colors font-mono">
                NEXUS MONSTER
              </div>
              <div className="text-[10px] text-zinc-500 font-mono">DIGITAL COMMAND OS</div>
            </div>
          </div>
        </div>

        {/* Navigation list */}
        <div className="p-3 space-y-4 flex-1">
          {navigationGroups.map((group) => (
            <div key={group.title} className="space-y-1">
              <div className="text-[9px] font-mono font-bold tracking-widest text-zinc-500 px-3 uppercase">
                {group.title}
              </div>
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeNav === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      sounds.playClick();
                      setActiveNav(item.id);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-mono transition-all ${
                      isActive
                        ? 'bg-cyan-500/10 text-cyan-300 font-bold border border-cyan-500/30 shadow-sm'
                        : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-cyan-400' : 'text-zinc-500'}`} />
                      <span className="truncate">{item.label}</span>
                    </div>
                    {item.id === 'LOCAL_PC' && (
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        {/* Bottom Hardware Status Card */}
        <div className="p-3 border-t border-zinc-800/80 bg-zinc-950/70 text-xs font-mono">
          <div className="p-2.5 rounded-xl bg-zinc-900/60 border border-zinc-800/80 space-y-1.5">
            <div className="text-[10px] text-zinc-500 flex items-center justify-between">
              <span>NODE: ULTRA 9</span>
              <span className="text-emerald-400">ONLINE</span>
            </div>
            <div className="text-zinc-300 font-bold text-[11px] truncate">
              {localAgent.hardware.cpuUsagePercent}% CPU • {localAgent.hardware.tempCelsius}°C
            </div>
            <div className="w-full bg-zinc-800 h-1 rounded-full overflow-hidden">
              <div
                className="bg-cyan-400 h-full rounded-full"
                style={{ width: `${localAgent.hardware.cpuUsagePercent}%` }}
              />
            </div>
          </div>
        </div>
      </aside>

      {/* 2. Main Center Application Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#08090c]">
        {/* Top Universal Command Bar */}
        <header className="h-14 border-b border-zinc-800/80 bg-[#0a0d13]/90 backdrop-blur-md px-6 flex items-center justify-between gap-4 shrink-0 z-20">
          {/* Central Search Omnibox */}
          <div className="flex-1 max-w-2xl">
            <div
              onClick={() => { sounds.playClick(); setIsCommandPaletteOpen(true); }}
              className="flex items-center gap-3 px-4 py-2 rounded-xl bg-zinc-950 border border-zinc-800 hover:border-cyan-500/40 text-xs text-zinc-400 cursor-pointer shadow-inner transition-colors group"
            >
              <Search className="w-4 h-4 text-cyan-400 shrink-0" />
              <span className="flex-1 truncate font-sans text-zinc-300">
                Search or speak natural language command to NEXUS... (Ctrl+K)
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  sounds.playClick();
                  setIsVoiceModalOpen(true);
                }}
                title="Voice Input (বাংলা/English)"
                className="flex items-center gap-1 px-2 py-0.5 rounded bg-cyan-950 hover:bg-cyan-900 text-cyan-300 text-[11px] font-mono border border-cyan-800/60 shrink-0"
              >
                <Mic className="w-3.5 h-3.5 text-cyan-400" />
                <span>Voice</span>
              </button>
            </div>
          </div>

          {/* Quick Right Action Tickers */}
          <div className="flex items-center gap-2.5 shrink-0">
            {/* Autonomous Living State Indicator Pill */}
            <div
              onClick={() => { sounds.playClick(); setActiveNav('AUTONOMOUS_AI'); }}
              title="Central System Intelligence Living State (Click to view)"
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-xs font-mono cursor-pointer hover:bg-cyan-900/60 transition-all shadow-sm"
            >
              <span className={`w-2 h-2 rounded-full ${
                livingState === 'WAITING_FOR_OWNER'
                  ? 'bg-amber-400 animate-pulse'
                  : livingState === 'EXECUTING' || livingState === 'THINKING'
                  ? 'bg-cyan-400 animate-spin'
                  : 'bg-emerald-400 animate-pulse'
              }`} />
              <span className="font-bold text-[10px] tracking-wider uppercase">
                {livingState.replace('_', ' ')}
              </span>
            </div>

            {/* AI Daily Brief Button */}
            <button
              onClick={() => { sounds.playClick(); setIsDailyBriefOpen(true); }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/80 text-zinc-200 text-xs font-mono transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Daily Brief</span>
            </button>

            {/* Approvals Counter Badge */}
            <button
              onClick={() => { sounds.playClick(); setIsApprovalsOpen(true); }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono transition-colors ${
                pendingApprovalsCount > 0
                  ? 'bg-amber-950/80 border border-amber-500/50 text-amber-300 shadow-md shadow-amber-950'
                  : 'bg-zinc-900 border border-zinc-800 text-zinc-400'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
              <span>Approvals ({pendingApprovalsCount})</span>
            </button>

            {/* Split Screen AI Toggle */}
            <button
              onClick={() => { sounds.playClick(); setIsAiPaneOpen(!isAiPaneOpen); }}
              title="Toggle AI Split Pane"
              className={`p-2 rounded-xl border transition-colors ${
                isAiPaneOpen
                  ? 'bg-cyan-500/10 border-cyan-500/40 text-cyan-400'
                  : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Columns className="w-4 h-4" />
            </button>

            {/* Audio Toggle */}
            <button
              onClick={handleToggleSound}
              title={isSoundEnabled ? 'Audio cues enabled' : 'Audio muted'}
              className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors"
            >
              {isSoundEnabled ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4 text-zinc-600" />}
            </button>
          </div>
        </header>

        {/* Viewport & AI Split Screen Area */}
        <div className="flex-1 flex overflow-hidden">
          {/* Scrollable View Content */}
          <main className="flex-1 overflow-y-auto p-6 scroll-smooth">
            {activeNav === 'DASHBOARD' && (
              <DashboardOverview
                localAgent={localAgent}
                businesses={businesses}
                servers={servers}
                vms={vms}
                securityAssets={securityAssets}
                team={team}
                auditLogs={auditLogs}
                onNavigate={(view, params) => {
                  setActiveNav(view);
                  if (params?.bizId) setSelectedBizParam(params.bizId);
                }}
                onOpenVoice={() => setIsVoiceModalOpen(true)}
                onOpenDailyBrief={() => setIsDailyBriefOpen(true)}
              />
            )}

            {activeNav === 'AUTONOMOUS_AI' && (
              <AutonomousIntelligenceView
                livingState={livingState}
                memories={aiMemories}
                observations={observations}
                capabilityGaps={capabilityGaps}
                onApproveObservation={handleApproveObservation}
                onDismissObservation={handleDismissObservation}
                onAddMemory={handleAddMemory}
                onDiagnoseGap={handleDiagnoseGap}
              />
            )}

            {activeNav === 'UNIVERSAL_KNOWLEDGE' && (
              <UniversalKnowledgeView
                entries={knowledgeEntries}
                hunterAgents={hunterAgents}
                resourceProposals={resourceExpansions}
                onAddKnowledgeEntry={(e) => setKnowledgeEntries((prev) => [e, ...prev])}
                onApproveResourceProposal={(id) => {
                  setResourceExpansions((prev) =>
                    prev.map((r) => (r.id === id ? { ...r, ownerApproved: true, stage: 'PROVISIONED' } : r))
                  );
                }}
              />
            )}

            {activeNav === 'DIGITAL_BODY' && (
              <DigitalBodyView
                agentStatus={localAgent}
                components={digitalBodyComponents}
                handTools={digitalHandTools}
              />
            )}

            {activeNav === 'SUB_AGENTS' && (
              <SubAgentsView
                subAgents={subAgents}
                onUpdateSubAgents={setSubAgents}
              />
            )}

            {activeNav === 'COMMUNICATION' && (
              <CommunicationView
                dispatches={communicationDispatches}
                onDispatchUpdate={setCommunicationDispatches}
              />
            )}

            {activeNav === 'LOCAL_PC' && (
              <LocalPcView
                localAgent={localAgent}
                onToggleCapability={handleToggleCapability}
                onTriggerDiagnostic={handleTriggerDiagnostic}
                isDiagnosing={isDiagnosing}
              />
            )}

            {activeNav === 'BROWSER' && (
              <BrowserWorkspaceView
                onTriggerApprovalRequest={(title, actor, details) => {
                  setApprovals((prev) => [
                    {
                      id: `appr-${Date.now().toString().slice(-4)}`,
                      actionTitle: title,
                      actor,
                      service: 'Browser Workspace',
                      riskLevel: 'HIGH',
                      timestamp: 'Just now',
                      details,
                      status: 'PENDING',
                    },
                    ...prev,
                  ]);
                  setIsApprovalsOpen(true);
                }}
              />
            )}

            {activeNav === 'VMS' && (
              <VirtualBoxView
                vms={vms}
                onToggleVmState={handleToggleVmState}
                onOpenConsole={(vm) => alert(`Direct console session attached for ${vm.name} on ${vm.ip}:22`)}
              />
            )}

            {activeNav === 'SERVERS' && (
              <ServersView
                servers={servers}
                onTriggerReboot={(srvId) => {
                  sounds.playAlert();
                  const ok = window.confirm(`Initiate graceful reboot on server ${srvId}?`);
                  if (ok) {
                    sounds.playExecute();
                    alert(`Reboot command sent to ${srvId} via secure API tunnel.`);
                  }
                }}
              />
            )}

            {activeNav === 'BUSINESS' && (
              <BusinessView
                businesses={businesses}
                selectedBizId={selectedBizParam}
                onAddNewBusiness={(newBiz) => setBusinesses((prev) => [...prev, newBiz as BusinessEntity])}
              />
            )}

            {activeNav === 'CRM' && (
              <CrmView
                clients={clients}
                onUpdateClientStage={(cliId, newStage) => {
                  sounds.playClick();
                  setClients((prev) =>
                    prev.map((c) => (c.id === cliId ? { ...c, stage: newStage } : c))
                  );
                }}
                onAddClient={(c) => setClients((prev) => [c, ...prev])}
              />
            )}

            {activeNav === 'TEAM' && (
              <TeamView
                team={team}
                onAddMember={(m) => setTeam((prev) => [...prev, m])}
              />
            )}

            {activeNav === 'SECURITY' && (
              <SecurityView
                assets={securityAssets}
                onTriggerScan={(assetId) => {
                  sounds.playExecute();
                  alert(`Dispatched passive vulnerability sweep on ${assetId}. Report logged.`);
                }}
              />
            )}

            {activeNav === 'HUNTER' && (
              <HunterView
                projects={hunterProjects}
                onAddProject={(p) => setHunterProjects((prev) => [p, ...prev])}
              />
            )}

            {activeNav === 'MEDIA' && (
              <MediaTvView
                stories={mediaStories}
                programs={tvPrograms}
                onUpdateStoryStage={(sId, newStage) => {
                  sounds.playClick();
                  setMediaStories((prev) =>
                    prev.map((s) => (s.id === sId ? { ...s, stage: newStage } : s))
                  );
                }}
              />
            )}

            {activeNav === 'MARKETING' && <MarketingView />}

            {activeNav === 'CODE' && <CodeCenterView />}

            {activeNav === 'AUTOMATION' && (
              <AutomationView
                automations={automations}
                onToggleAutomation={(id) => {
                  sounds.playClick();
                  setAutomations((prev) =>
                    prev.map((a) => (a.id === id ? { ...a, enabled: !a.enabled } : a))
                  );
                }}
                onRunAutomationNow={(rule) => {
                  alert(`Workflow "${rule.name}" triggered manually. Execution logged.`);
                }}
              />
            )}

            {activeNav === 'HEALTH' && (
              <HealthRepairView
                repairs={repairJobs}
                onTriggerRepair={handleTriggerRepair}
                onRollbackRepair={handleRollbackRepair}
                isRepairing={isRepairing}
              />
            )}

            {activeNav === 'AUDIT' && (
              <AuditBackupView
                auditLogs={auditLogs}
                aiMemories={aiMemories}
                onDeleteMemory={(id) => {
                  sounds.playClick();
                  setAiMemories((prev) => prev.filter((m) => m.id !== id));
                }}
                onExportMemory={() => {
                  sounds.playClick();
                  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(aiMemories, null, 2));
                  const downloadAnchor = document.createElement('a');
                  downloadAnchor.setAttribute('href', dataStr);
                  downloadAnchor.setAttribute('download', 'nexus-ai-memory.json');
                  document.body.appendChild(downloadAnchor);
                  downloadAnchor.click();
                  downloadAnchor.remove();
                }}
              />
            )}

            {activeNav === 'EMERGENCY' && <EmergencyView />}
          </main>

          {/* 3. Persistent AI Assistant Split-Screen Sidebar */}
          <AiAssistantSidebar
            isOpen={isAiPaneOpen}
            onToggle={() => setIsAiPaneOpen(false)}
            onDispatchCommand={handleDispatchCommand}
            livingState={livingState}
          />
        </div>
      </div>

      {/* Global Modals */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onSelectAction={handleSelectPaletteAction}
        onOpenVoice={() => setIsVoiceModalOpen(true)}
        onDirectQuery={async (q) => {
          const plan = await handleDispatchCommand(q);
          handleExecuteActionPlan(plan);
        }}
      />

      <VoiceModal
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
        onExecutePlan={handleExecuteActionPlan}
      />

      <DailyBriefModal
        isOpen={isDailyBriefOpen}
        onClose={() => setIsDailyBriefOpen(false)}
        data={dailyBrief}
        onRefresh={handleRefreshDailyBrief}
        isRefreshing={isRefreshingBrief}
      />

      <ApprovalsDrawer
        isOpen={isApprovalsOpen}
        onClose={() => setIsApprovalsOpen(false)}
        approvals={approvals}
        onResolve={handleResolveApproval}
      />
    </div>
  );
}
