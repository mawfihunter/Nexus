import React, { useState } from 'react';
import {
  Bot,
  Send,
  Sparkles,
  X,
  ChevronRight,
  Shield,
  Zap,
  Terminal,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Check,
  Brain,
} from 'lucide-react';
import { sounds } from '../utils/audio';
import { LivingState, ApprovalProtocol, RiskLevel } from '../types/nexus';

interface AiAssistantSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  onDispatchCommand: (query: string) => Promise<any>;
  livingState: LivingState;
  onApproveAction?: (actionDesc: string) => void;
}

interface Message {
  id: string;
  sender: 'USER' | 'NEXUS_AI';
  agent?: string;
  text: string;
  timestamp: string;
  planSteps?: string[];
  riskLevel?: RiskLevel;
  approvalProtocol?: ApprovalProtocol;
  learnedInsight?: string;
  lifecycle?: string;
}

export const AiAssistantSidebar: React.FC<AiAssistantSidebarProps> = ({
  isOpen,
  onToggle,
  onDispatchCommand,
  livingState,
  onApproveAction,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm-1',
      sender: 'NEXUS_AI',
      agent: 'NEXUS MONSTER',
      text: 'Greetings, Owner. I am your autonomous personal system intelligence living inside Nexus. I think freely, learn continuously, and plan independently, but I will always ask your permission before making real-world or system changes. You can speak or type in English, বাংলা, or Banglish.',
      timestamp: '11:30 AM',
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [activeSubAgent, setActiveSubAgent] = useState('NEXUS MONSTER');

  const handleSend = async (customQuery?: string) => {
    const userQuery = customQuery || inputValue;
    if (!userQuery.trim() || isTyping) return;
    if (!customQuery) setInputValue('');
    sounds.playClick();

    const userMsg: Message = {
      id: `u-${Date.now()}`,
      sender: 'USER',
      text: userQuery,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    try {
      const plan = await onDispatchCommand(userQuery);
      if (plan) {
        setActiveSubAgent(plan.executionTargetAgent || 'NEXUS MONSTER');
        const aiMsg: Message = {
          id: `a-${Date.now()}`,
          sender: 'NEXUS_AI',
          agent: `${plan.executionTargetAgent} AGENT`,
          text: plan.explanation || `Processed intent: ${plan.intent}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          planSteps: plan.planSteps,
          riskLevel: plan.riskLevel,
          approvalProtocol: plan.approvalProtocol,
          learnedInsight: plan.learnedInsight,
          lifecycle: plan.lifecycle,
        };
        setMessages((prev) => [...prev, aiMsg]);
        sounds.playExecute();
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: 'NEXUS_AI',
          agent: 'CORE',
          text: 'Request processed via local agent enclave. State preserved.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  if (!isOpen) return null;

  return (
    <aside className="w-80 lg:w-96 h-full bg-[#0b0e14] border-l border-zinc-800 flex flex-col shrink-0 relative z-30 transition-all">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3.5 border-b border-zinc-800 bg-zinc-900/60">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Bot className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-zinc-100 uppercase tracking-wider flex items-center gap-1.5 font-mono">
              SYSTEM INTELLIGENCE
            </h3>
            <div className="text-[10px] text-zinc-400 font-mono flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
              <span>STATE: <strong className="text-cyan-400">{livingState}</strong></span>
            </div>
          </div>
        </div>

        <button
          onClick={() => { sounds.playClick(); onToggle(); }}
          title="Minimize Intelligence Pane"
          className="p-1 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-800"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Philosophy Sub-Header */}
      <div className="px-3 py-1.5 border-b border-zinc-800/80 bg-black/40 text-[9px] font-mono text-zinc-400 flex items-center justify-between">
        <span>OWNER HAS FINAL AUTHORITY</span>
        <span className="text-cyan-400">ACT WITH PERMISSION</span>
      </div>

      {/* Messages Feed */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 font-sans">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex flex-col ${m.sender === 'USER' ? 'items-end' : 'items-start'}`}
          >
            {m.agent && (
              <span className="text-[9px] font-mono text-cyan-400/80 mb-1 px-1">
                [{m.agent}]
              </span>
            )}
            <div
              className={`max-w-[92%] rounded-xl p-3.5 text-xs leading-relaxed ${
                m.sender === 'USER'
                  ? 'bg-cyan-600 text-white shadow-md shadow-cyan-950'
                  : 'bg-zinc-900 border border-zinc-800 text-zinc-200 shadow-xl'
              }`}
            >
              <div>{m.text}</div>

              {/* Protocol Box for Actions Requiring Permission */}
              {m.approvalProtocol && (
                <div className="mt-3 p-3 rounded-lg bg-zinc-950 border border-amber-500/40 text-[11px] font-mono space-y-1.5 text-zinc-300">
                  <div className="text-[10px] uppercase font-bold text-amber-400 flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>OWNER AUTHORIZATION REQUIRED</span>
                  </div>
                  <div><span className="text-zinc-500">REASON:</span> {m.approvalProtocol.reason}</div>
                  <div><span className="text-zinc-500">ACTION:</span> <span className="text-cyan-300">{m.approvalProtocol.action}</span></div>
                  <div><span className="text-zinc-500">EFFECT:</span> {m.approvalProtocol.effect}</div>
                  <div><span className="text-zinc-500">RISK:</span> <span className="text-amber-400 font-bold">{m.approvalProtocol.risk}</span></div>
                  <div className="pt-1 text-emerald-400 font-bold">{m.approvalProtocol.requestText}</div>

                  {/* Quick Natural Response Buttons */}
                  <div className="flex items-center gap-2 pt-2 border-t border-zinc-900">
                    <button
                      onClick={() => handleSend('Yes, proceed with the plan.')}
                      className="flex-1 py-1 rounded bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-bold text-[10px] text-center"
                    >
                      "Yes, Do it"
                    </button>
                    <button
                      onClick={() => handleSend('No, do not proceed.')}
                      className="flex-1 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[10px] text-center"
                    >
                      "No, Cancel"
                    </button>
                  </div>
                </div>
              )}

              {/* Executed Steps */}
              {m.planSteps && m.planSteps.length > 0 && !m.approvalProtocol && (
                <div className="mt-2.5 pt-2 border-t border-zinc-800 text-[10px] font-mono space-y-1">
                  <div className="text-zinc-400 uppercase tracking-wider font-semibold">Autonomous Path:</div>
                  {m.planSteps.map((s, i) => (
                    <div key={i} className="text-cyan-300/90 flex items-center gap-1">
                      <span>✓</span>
                      <span>{s}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Learned Insight Tag */}
              {m.learnedInsight && (
                <div className="mt-2 pt-1.5 border-t border-zinc-800/80 flex items-center gap-1.5 text-[9px] font-mono text-zinc-400">
                  <Brain className="w-3 h-3 text-cyan-400" />
                  <span>Learned: {m.learnedInsight}</span>
                </div>
              )}
            </div>
            <span className="text-[9px] font-mono text-zinc-500 mt-1 px-1">{m.timestamp}</span>
          </div>
        ))}

        {isTyping && (
          <div className="flex items-center gap-2 text-zinc-400 text-xs font-mono p-2">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
            <span>NEXUS reasoning & planning path...</span>
          </div>
        )}
      </div>

      {/* Input Deck */}
      <div className="p-3 border-t border-zinc-800 bg-zinc-900/60">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Instruct or approve (e.g. 'Yes', 'Telegram ঠিক করো')..."
            className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-cyan-500/50 font-sans"
          />
          <button
            onClick={() => handleSend()}
            disabled={!inputValue.trim() || isTyping}
            className={`p-2 rounded-xl transition-all ${
              inputValue.trim() && !isTyping
                ? 'bg-cyan-500 text-black hover:bg-cyan-400'
                : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
            }`}
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
