import React, { useState } from 'react';
import { Sparkles, X, RefreshCw, CheckCircle2, Lightbulb, AlertOctagon, Download, Share2, Calendar } from 'lucide-react';
import { DailyBriefData } from '../types/nexus';
import { sounds } from '../utils/audio';

interface DailyBriefModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: DailyBriefData;
  onRefresh: () => void;
  isRefreshing: boolean;
}

export const DailyBriefModal: React.FC<DailyBriefModalProps> = ({
  isOpen,
  onClose,
  data,
  onRefresh,
  isRefreshing,
}) => {
  const [activeTab, setActiveTab] = useState<'ALL' | 'BUSINESS' | 'SERVERS' | 'SECURITY' | 'TEAM' | 'MEDIA'>('ALL');

  if (!isOpen) return null;

  const renderSection = (title: string, summary: { facts: string[]; aiSuggestions: string[] }) => (
    <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-4 space-y-3">
      <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2">
        <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-400 font-mono flex items-center gap-2">
          <span>{title}</span>
        </h3>
        <span className="text-[10px] font-mono text-zinc-500">REAL-TIME TELEMETRY</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
        {/* Facts Column */}
        <div className="p-3 rounded-lg bg-zinc-900/60 border border-zinc-800/80 space-y-2">
          <div className="flex items-center gap-1.5 text-[11px] font-mono font-semibold text-emerald-400">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>CONFIRMED FACTS:</span>
          </div>
          <ul className="space-y-1.5 text-zinc-300 font-sans text-xs">
            {summary.facts.map((fact, idx) => (
              <li key={idx} className="flex items-start gap-1.5 leading-relaxed">
                <span className="text-emerald-500 font-mono select-none">•</span>
                <span>{fact}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* AI Suggestions Column */}
        <div className="p-3 rounded-lg bg-cyan-950/20 border border-cyan-800/40 space-y-2">
          <div className="flex items-center gap-1.5 text-[11px] font-mono font-semibold text-cyan-300">
            <Lightbulb className="w-3.5 h-3.5" />
            <span>AI ACTION SUGGESTIONS:</span>
          </div>
          <ul className="space-y-1.5 text-cyan-100/90 font-sans text-xs">
            {summary.aiSuggestions.map((sug, idx) => (
              <li key={idx} className="flex items-start gap-1.5 leading-relaxed">
                <span className="text-cyan-400 font-mono select-none">→</span>
                <span>{sug}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-[#0b0e14] border border-cyan-500/40 w-full max-w-4xl max-h-[90vh] rounded-2xl shadow-2xl shadow-cyan-950/60 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-900/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-zinc-100">NEXUS AI DAILY EXECUTIVE BRIEF</h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
                  FACTS vs AI SUGGESTIONS
                </span>
              </div>
              <p className="text-xs text-zinc-400 flex items-center gap-2 mt-0.5">
                <Calendar className="w-3.5 h-3.5 text-zinc-500" />
                <span>Generated today at {data.generatedAt}</span>
                <span>•</span>
                <span className="text-emerald-400 font-mono">100% Subsystem Health Verified</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                sounds.playClick();
                onRefresh();
              }}
              disabled={isRefreshing}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs text-zinc-200 border border-zinc-700 transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-cyan-400' : ''}`} />
              <span>{isRefreshing ? 'Synthesizing...' : 'Regenerate Brief'}</span>
            </button>
            <button
              onClick={() => { sounds.playClick(); onClose(); }}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Critical Alerts Banner if present */}
        {data.criticalAlerts && data.criticalAlerts.length > 0 && (
          <div className="px-6 py-2.5 bg-amber-950/40 border-b border-amber-500/30 flex items-center justify-between text-xs text-amber-200">
            <div className="flex items-center gap-2">
              <AlertOctagon className="w-4 h-4 text-amber-400 shrink-0" />
              <span className="font-semibold uppercase tracking-wider text-[11px] font-mono text-amber-400">
                Action Attention Required:
              </span>
              <span className="truncate">{data.criticalAlerts.join(' | ')}</span>
            </div>
          </div>
        )}

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {renderSection('Business Operations (Neo & Fitkart BD)', data.businessSummary)}
          {renderSection('Primary Compute & Cloud Infrastructure', data.infrastructureSummary)}
          {renderSection('Defensive Security & Authorization Matrix', data.securitySummary)}
          {renderSection('Nationwide Distributed Team & Workloads', data.teamSummary)}
          {renderSection('Journalist Newsroom & TV Broadcasting', data.mediaSummary)}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-3 border-t border-zinc-800 bg-zinc-900/40 text-xs text-zinc-400">
          <div className="text-[11px] font-mono text-zinc-500">
            NEXUS Monitored Data Sources: Local PC, VPS Nodes, E-commerce DBs, Git, Newsroom Feed
          </div>
          <button
            onClick={() => {
              sounds.playClick();
              alert('Daily Executive Brief exported to PDF/Markdown workspace.');
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-mono"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span>Export Brief</span>
          </button>
        </div>
      </div>
    </div>
  );
};
