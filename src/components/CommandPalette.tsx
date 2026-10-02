import React, { useState, useEffect, useRef } from 'react';
import { Search, Mic, Terminal, Globe, Server, Cpu, ShoppingBag, Shield, Video, Bot, ArrowRight, CornerDownLeft, Sparkles, CheckCircle2, MessageSquare, Layers, Compass } from 'lucide-react';
import { sounds } from '../utils/audio';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAction: (actionKey: string, params?: any) => void;
  onOpenVoice: () => void;
  onDirectQuery: (query: string) => void;
}

interface CommandItem {
  id: string;
  title: string;
  category: 'NAVIGATION' | 'BUSINESS' | 'INFRASTRUCTURE' | 'DEV' | 'SECURITY' | 'AI';
  description: string;
  icon: any;
  actionKey: string;
  params?: any;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onSelectAction,
  onOpenVoice,
  onDirectQuery,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const commandList: CommandItem[] = [
    { id: '1', title: 'Check Neo Daily Sales & Orders', category: 'BUSINESS', description: 'Query real-time revenue, active orders, and fulfillment', icon: ShoppingBag, actionKey: 'VIEW_BUSINESS', params: { bizId: 'biz-neo' } },
    { id: '2', title: 'Check Fitkart BD Health Nutrition Sales', category: 'BUSINESS', description: 'Review supplements sales, protein orders & inventory', icon: ShoppingBag, actionKey: 'VIEW_BUSINESS', params: { bizId: 'biz-fitkart' } },
    { id: '3', title: 'Open Telegram Web Workspace', category: 'NAVIGATION', description: 'Launch Telegram inside isolated browser container', icon: Globe, actionKey: 'OPEN_BROWSER_TAB', params: { url: 'https://web.telegram.org', title: 'Telegram Web' } },
    { id: '4', title: 'Open Discord Workspace', category: 'NAVIGATION', description: 'Access team and community Discord servers', icon: Globe, actionKey: 'OPEN_BROWSER_TAB', params: { url: 'https://discord.com/app', title: 'Discord' } },
    { id: '5', title: 'Inspect Primary PC Node (Core Ultra 9)', category: 'INFRASTRUCTURE', description: 'Review CPU 16-cores, 16GB DDR5, 4TB storage, thermals', icon: Cpu, actionKey: 'NAV_LOCAL_PC' },
    { id: '6', title: 'Check All Cloud Servers & VPS', category: 'INFRASTRUCTURE', description: 'Uptime, disk storage, memory, and SSL certificates', icon: Server, actionKey: 'NAV_SERVERS' },
    { id: '7', title: 'Launch VS Code / Code Center', category: 'DEV', description: 'Open project files, Git branch manager, code-server', icon: Terminal, actionKey: 'NAV_CODE' },
    { id: '8', title: 'Start VirtualBox Linux VMs', category: 'INFRASTRUCTURE', description: 'Manage Ubuntu 24.04 DevBox and Kali CyberLab VMs', icon: Server, actionKey: 'NAV_VMS' },
    { id: '9', title: 'Open Authorized Cyber Security Labs', category: 'SECURITY', description: 'TryHackMe, Hack The Box, and defensive vulnerability logs', icon: Shield, actionKey: 'NAV_SECURITY' },
    { id: '10', title: 'Open Media & TV Channel Center', category: 'DEV', description: 'Newsroom pipeline, story editor, and TV broadcast schedule', icon: Video, actionKey: 'NAV_MEDIA' },
    { id: '11', title: 'Generate AI Daily Brief (Facts vs Suggestions)', category: 'AI', description: 'Executive brief across all businesses and infrastructure', icon: Bot, actionKey: 'TRIGGER_DAILY_BRIEF' },
    { id: '12', title: 'Run Self-Diagnostics & Auto-Repair Engine', category: 'AI', description: 'Perform health check with backup snapshots & rollback', icon: Bot, actionKey: 'TRIGGER_DIAGNOSTICS' },
    { id: '13', title: 'Inspect Digital Body & Digital Hands', category: 'INFRASTRUCTURE', description: 'Hardware telemetry, POSIX tools verification, and VPS migration advisor', icon: Layers, actionKey: 'NAV_DIGITAL_BODY' },
    { id: '14', title: 'Digital Population: Sub-Agent Creation & Hub', category: 'AI', description: 'Manage Research, Coding, Monitoring, Business, and DevOps sub-agents', icon: Bot, actionKey: 'NAV_SUB_AGENTS' },
    { id: '15', title: 'Authorized Communication Dispatcher (Rahim / Leads)', category: 'NAVIGATION', description: '8-step verification pipeline for external messaging and delivery proof', icon: MessageSquare, actionKey: 'NAV_COMMUNICATION' },
    { id: '16', title: 'Universal Knowledge & Hunter Civilization', category: 'AI', description: '40+ disciplines, 9-step cognitive inquiry engine, Hunter-Science, Hunter-Robotics', icon: Compass, actionKey: 'NAV_UNIVERSAL_KNOWLEDGE' },
  ];

  const filteredCommands = commandList.filter(
    (c) =>
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    if (isOpen) {
      setSearchTerm('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % (filteredCommands.length || 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + filteredCommands.length) % (filteredCommands.length || 1));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredCommands.length > 0 && selectedIndex < filteredCommands.length) {
          const selected = filteredCommands[selectedIndex];
          sounds.playClick();
          onSelectAction(selected.actionKey, selected.params);
          onClose();
        } else if (searchTerm.trim()) {
          sounds.playClick();
          onDirectQuery(searchTerm);
          onClose();
        }
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredCommands, selectedIndex, searchTerm, onSelectAction, onClose, onDirectQuery]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-150">
      <div className="bg-[#0b0e14] border border-cyan-500/30 w-full max-w-2xl rounded-2xl shadow-2xl shadow-cyan-950/70 overflow-hidden flex flex-col">
        {/* Search Bar */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-zinc-800 bg-zinc-900/50">
          <Search className="w-5 h-5 text-cyan-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Type a command or natural language request (English, বাংলা, Banglish)..."
            className="w-full bg-transparent text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none font-sans"
          />
          <button
            onClick={() => {
              sounds.playClick();
              onClose();
              onOpenVoice();
            }}
            title="Switch to Voice Input"
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-700/60 text-cyan-300 text-xs font-mono shrink-0 transition-colors"
          >
            <Mic className="w-3.5 h-3.5" />
            <span>Voice</span>
          </button>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700 shrink-0">
            ESC
          </span>
        </div>

        {/* Results List */}
        <div className="max-h-[380px] overflow-y-auto p-2 space-y-1 divide-y divide-zinc-900">
          {filteredCommands.length > 0 ? (
            filteredCommands.map((cmd, idx) => {
              const IconComponent = cmd.icon;
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={cmd.id}
                  onClick={() => {
                    sounds.playClick();
                    onSelectAction(cmd.actionKey, cmd.params);
                    onClose();
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-cyan-950/50 border border-cyan-500/40 text-cyan-100 shadow-sm'
                      : 'hover:bg-zinc-900/60 text-zinc-300 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                        isSelected ? 'bg-cyan-500 text-black' : 'bg-zinc-800 text-zinc-400'
                      }`}
                    >
                      <IconComponent className="w-4 h-4" />
                    </div>
                    <div className="truncate">
                      <div className="text-xs font-semibold text-zinc-200 flex items-center gap-2">
                        <span>{cmd.title}</span>
                        <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-400">
                          {cmd.category}
                        </span>
                      </div>
                      <div className="text-[11px] text-zinc-500 truncate mt-0.5">{cmd.description}</div>
                    </div>
                  </div>
                  <div className="shrink-0 flex items-center text-xs text-zinc-500">
                    {isSelected && (
                      <span className="flex items-center gap-1 font-mono text-[10px] text-cyan-400">
                        <CornerDownLeft className="w-3 h-3" />
                        Execute
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div
              onClick={() => {
                if (searchTerm.trim()) {
                  sounds.playClick();
                  onDirectQuery(searchTerm);
                  onClose();
                }
              }}
              className="p-6 text-center text-zinc-400 space-y-2 cursor-pointer hover:bg-zinc-900/40 rounded-xl"
            >
              <Sparkles className="w-8 h-8 text-cyan-400 mx-auto animate-pulse" />
              <div className="text-xs font-medium text-zinc-200">
                Submit Natural Language Query to NEXUS AI:
              </div>
              <div className="text-xs font-mono text-cyan-300 bg-zinc-950 p-2 rounded-lg border border-zinc-800 inline-block max-w-full truncate px-3">
                "{searchTerm}"
              </div>
              <div className="text-[11px] text-zinc-500">
                Press <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300 font-mono">Enter</kbd> to interpret and generate structured action plan.
              </div>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-zinc-800/80 bg-zinc-900/30 text-[11px] font-mono text-zinc-500">
          <div className="flex items-center gap-3">
            <span><kbd className="px-1 py-0.5 rounded bg-zinc-800 text-zinc-300">↑↓</kbd> Navigate</span>
            <span><kbd className="px-1 py-0.5 rounded bg-zinc-800 text-zinc-300">↵</kbd> Select</span>
            <span><kbd className="px-1 py-0.5 rounded bg-zinc-800 text-zinc-300">CTRL+K</kbd> Global</span>
          </div>
          <span className="text-cyan-400/80">NEXUS HYBRID CONTROL PLANE</span>
        </div>
      </div>
    </div>
  );
};
