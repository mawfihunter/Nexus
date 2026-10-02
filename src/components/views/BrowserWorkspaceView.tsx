import React, { useState } from 'react';
import {
  Globe,
  Plus,
  X,
  ExternalLink,
  ShieldCheck,
  Camera,
  Search,
  Lock,
  RefreshCw,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { WorkspaceType, BrowserTab } from '../../types/nexus';
import { sounds } from '../../utils/audio';

interface BrowserWorkspaceViewProps {
  onTriggerApprovalRequest: (title: string, actor: string, details: string) => void;
}

export const BrowserWorkspaceView: React.FC<BrowserWorkspaceViewProps> = ({
  onTriggerApprovalRequest,
}) => {
  const [activeWorkspace, setActiveWorkspace] = useState<WorkspaceType>('BUSINESS');
  const [activeTabId, setActiveTabId] = useState<string>('tab-1');
  const [urlInput, setUrlInput] = useState('https://web.telegram.org');
  const [agentActionLog, setAgentActionLog] = useState<string[]>([
    'Profile session initialized: BUSINESS-SECURE-PROFILE',
    'Cookies isolated in sandboxed storage partition',
    'Browser Agent attached: ready for DOM inspection and navigation',
  ]);
  const [isAgentExecuting, setIsAgentExecuting] = useState(false);

  const initialTabs: BrowserTab[] = [
    { id: 'tab-1', title: 'Telegram Web', url: 'https://web.telegram.org', sessionState: 'AUTHENTICATED', requiresProxy: false, category: 'COMMUNICATION' },
    { id: 'tab-2', title: 'Discord Community', url: 'https://discord.com/app', sessionState: 'AUTHENTICATED', requiresProxy: false, category: 'COMMUNICATION' },
    { id: 'tab-3', title: 'Proton Mail', url: 'https://mail.proton.me', sessionState: 'AUTHENTICATED', requiresProxy: false, category: 'PRIVACY_EMAIL' },
    { id: 'tab-4', title: 'Meta Ads Manager', url: 'https://adsmanager.facebook.com', sessionState: 'AUTHENTICATED', requiresProxy: true, category: 'MARKETING' },
    { id: 'tab-5', title: 'Canva Design Studio', url: 'https://canva.com', sessionState: 'AUTHENTICATED', requiresProxy: false, category: 'DESIGN' },
    { id: 'tab-6', title: 'cPanel Host Manager', url: 'https://cpanel.nexusmonster.com:2083', sessionState: 'AUTHENTICATED', requiresProxy: true, category: 'SERVERS' },
    { id: 'tab-7', title: 'TryHackMe Lab', url: 'https://tryhackme.com', sessionState: 'AUTHENTICATED', requiresProxy: false, category: 'SECURITY' },
  ];

  const [tabs, setTabs] = useState<BrowserTab[]>(initialTabs);

  const currentTab = tabs.find((t) => t.id === activeTabId) || tabs[0];

  const handleSelectTab = (tab: BrowserTab) => {
    sounds.playClick();
    setActiveTabId(tab.id);
    setUrlInput(tab.url);
  };

  const handleCloseTab = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    sounds.playClick();
    if (tabs.length === 1) return;
    const remaining = tabs.filter((t) => t.id !== id);
    setTabs(remaining);
    if (activeTabId === id) {
      setActiveTabId(remaining[0].id);
      setUrlInput(remaining[0].url);
    }
  };

  const handleNavigate = () => {
    sounds.playClick();
    setTabs((prev) =>
      prev.map((t) => (t.id === activeTabId ? { ...t, url: urlInput, title: new URL(urlInput).hostname } : t))
    );
    setAgentActionLog((prev) => [
      `Navigated to: ${urlInput}`,
      ...prev.slice(0, 10),
    ]);
  };

  const handleAgentScreenshot = () => {
    sounds.playClick();
    setIsAgentExecuting(true);
    setTimeout(() => {
      setIsAgentExecuting(false);
      sounds.playExecute();
      setAgentActionLog((prev) => [
        `Browser Agent captured secure DOM screenshot of ${currentTab.title} [1920x1080]`,
        ...prev.slice(0, 10),
      ]);
      alert(`Screenshot of ${currentTab.title} captured and stored in NEXUS Files.`);
    }, 800);
  };

  const handleSensitiveAction = (actionDesc: string) => {
    sounds.playAlert();
    onTriggerApprovalRequest(
      `Browser Agent: ${actionDesc}`,
      'NEXUS Browser Agent',
      `Target site: ${currentTab.url}. This action requires operator confirmation to prevent unintended external state changes.`
    );
  };

  return (
    <div className="space-y-4">
      {/* Workspace Selector Bar */}
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3 flex-wrap gap-2 text-xs font-mono">
        <div className="flex items-center gap-1.5 overflow-x-auto">
          <span className="text-zinc-500 mr-2 text-[10px] uppercase">BROWSER WORKSPACE:</span>
          {(['MAIN', 'BUSINESS', 'MARKETING', 'DEVELOPMENT', 'SECURITY_LAB', 'MEDIA', 'PERSONAL'] as WorkspaceType[]).map(
            (ws) => (
              <button
                key={ws}
                onClick={() => { sounds.playClick(); setActiveWorkspace(ws); }}
                className={`px-3 py-1.5 rounded-xl transition-all ${
                  activeWorkspace === ws
                    ? 'bg-cyan-500 text-zinc-950 font-bold shadow-md shadow-cyan-500/20'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
                }`}
              >
                {ws.replace('_', ' ')}
              </button>
            )
          )}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>SESSION ENCLAVE ISOLATED</span>
          </span>
        </div>
      </div>

      {/* Browser Chrome Container */}
      <div className="rounded-2xl border border-zinc-800 bg-[#0b0e14] overflow-hidden shadow-2xl flex flex-col min-h-[600px]">
        {/* Tab strip */}
        <div className="flex items-center gap-1 px-3 pt-2 bg-zinc-950 border-b border-zinc-800/80 overflow-x-auto">
          {tabs.map((tab) => {
            const isActive = tab.id === activeTabId;
            return (
              <div
                key={tab.id}
                onClick={() => handleSelectTab(tab)}
                className={`flex items-center gap-2 px-3 py-2 rounded-t-xl text-xs font-medium cursor-pointer transition-all border-t border-x ${
                  isActive
                    ? 'bg-[#0b0e14] border-zinc-800 text-cyan-300 font-semibold'
                    : 'bg-zinc-950/60 border-transparent text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50'
                }`}
              >
                <Globe className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-400' : 'text-zinc-500'}`} />
                <span className="truncate max-w-[130px]">{tab.title}</span>
                <button
                  onClick={(e) => handleCloseTab(tab.id, e)}
                  className="p-0.5 rounded hover:bg-zinc-800 text-zinc-500 hover:text-zinc-300"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            );
          })}

          <button
            onClick={() => {
              sounds.playClick();
              const newId = `tab-${Date.now()}`;
              const newTab: BrowserTab = {
                id: newId,
                title: 'New Session',
                url: 'https://github.com',
                sessionState: 'AUTHENTICATED',
                requiresProxy: false,
                category: 'GENERAL',
              };
              setTabs([...tabs, newTab]);
              setActiveTabId(newId);
              setUrlInput('https://github.com');
            }}
            className="p-1.5 rounded-lg text-zinc-500 hover:text-cyan-400 hover:bg-zinc-900 transition-colors ml-1"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Address Bar & Browser Agent Ribbon */}
        <div className="flex items-center gap-2 px-4 py-2.5 bg-zinc-900/60 border-b border-zinc-800 text-xs">
          <div className="flex items-center gap-1.5 flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-1.5">
            <Lock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <input
              type="text"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleNavigate()}
              className="w-full bg-transparent text-xs text-zinc-200 focus:outline-none font-mono"
            />
            <span className="text-[10px] font-mono text-zinc-500 shrink-0">PROFILE: {activeWorkspace}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleAgentScreenshot}
              disabled={isAgentExecuting}
              title="Browser Agent: Inspect & Screenshot"
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-mono text-[11px] transition-colors"
            >
              <Camera className="w-3.5 h-3.5 text-cyan-400" />
              <span>Capture DOM</span>
            </button>

            <a
              href={currentTab.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-zinc-200 transition-colors"
              title="Open in native desktop browser window"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Browser Remote Enclave Viewport */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 min-h-[500px]">
          {/* Simulated Browser Enclave Screen */}
          <div className="lg:col-span-3 bg-zinc-950/80 p-6 flex flex-col justify-between relative border-r border-zinc-800/80">
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs font-mono text-zinc-400 pb-3 border-b border-zinc-900">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>ISOLATED SESSION: {currentTab.title}</span>
                </span>
                <span className="text-cyan-400">FPS: 60 • LATENCY: 2ms (LOCAL PIPE)</span>
              </div>

              {/* Realistic Enclave Display Card */}
              <div className="p-8 rounded-2xl bg-[#090b10] border border-cyan-500/20 text-center space-y-4 shadow-xl">
                <Globe className="w-16 h-16 text-cyan-400 mx-auto opacity-80" />
                <div>
                  <h3 className="text-lg font-bold text-zinc-100 font-mono">{currentTab.title}</h3>
                  <p className="text-xs text-zinc-400 max-w-md mx-auto mt-1">
                    Authenticated session active inside private profile partition. Cookies, local storage, and authentication tokens are kept isolated from frontend code.
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                  <button
                    onClick={() => handleSensitiveAction(`Publish broadcast update on ${currentTab.title}`)}
                    className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-xs font-mono text-zinc-200 flex items-center gap-1.5"
                  >
                    <span>Send Message / Post</span>
                    <ArrowRight className="w-3.5 h-3.5 text-cyan-400" />
                  </button>

                  <a
                    href={currentTab.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-bold text-xs font-mono flex items-center gap-1.5 transition-colors"
                  >
                    <span>Launch Direct Session</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>

            {/* Bottom Enclave Status Bar */}
            <div className="text-[11px] font-mono text-zinc-500 flex items-center justify-between pt-4 border-t border-zinc-900">
              <span>SECURITY LEVEL: AIR-GAPPED PROFILE</span>
              <span className="text-emerald-400">AUDIT LOGGING: ENABLED</span>
            </div>
          </div>

          {/* Browser Agent Inspector Panel */}
          <div className="p-4 bg-[#0b0e14] space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-mono font-bold text-zinc-200">
                <span className="flex items-center gap-1.5 text-cyan-400">
                  <Sliders className="w-3.5 h-3.5" />
                  BROWSER AGENT
                </span>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300">
                  ACTIVE
                </span>
              </div>

              <div className="space-y-2 text-xs font-mono">
                <button
                  onClick={() => {
                    sounds.playClick();
                    setAgentActionLog((prev) => [`Agent scanned 44 interactive DOM elements on ${currentTab.title}`, ...prev]);
                  }}
                  className="w-full text-left p-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 transition-colors"
                >
                  Inspect DOM Nodes
                </button>

                <button
                  onClick={() => {
                    sounds.playClick();
                    setAgentActionLog((prev) => [`Agent indexed unread messages and notifications`, ...prev]);
                  }}
                  className="w-full text-left p-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 transition-colors"
                >
                  Read Visible Text
                </button>

                <button
                  onClick={() => handleSensitiveAction('Submit payment or advertising campaign')}
                  className="w-full text-left p-2 rounded-lg bg-amber-950/30 hover:bg-amber-950/50 border border-amber-500/40 text-amber-300 transition-colors flex items-center justify-between"
                >
                  <span>Submit Form Action</span>
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                </button>
              </div>

              {/* Agent Audit Log */}
              <div className="pt-2 border-t border-zinc-800 space-y-1">
                <div className="text-[10px] font-mono uppercase text-zinc-500">Agent Activity Stream:</div>
                <div className="max-h-48 overflow-y-auto space-y-1 text-[10px] font-mono text-zinc-400 bg-zinc-950 p-2 rounded-lg border border-zinc-900">
                  {agentActionLog.map((log, i) => (
                    <div key={i} className="text-zinc-300">› {log}</div>
                  ))}
                </div>
              </div>
            </div>

            <div className="text-[10px] font-mono text-zinc-500">
              All browser automation requires authorization before submitting external transactions.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
