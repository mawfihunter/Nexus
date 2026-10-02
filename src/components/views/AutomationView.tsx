import React, { useState } from 'react';
import {
  Zap,
  Play,
  Plus,
  ToggleLeft,
  ToggleRight,
  Clock,
  ArrowRight,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { AutomationRule } from '../../types/nexus';
import { sounds } from '../../utils/audio';

interface AutomationViewProps {
  automations: AutomationRule[];
  onToggleAutomation: (id: string) => void;
  onRunAutomationNow: (rule: AutomationRule) => void;
}

export const AutomationView: React.FC<AutomationViewProps> = ({
  automations,
  onToggleAutomation,
  onRunAutomationNow,
}) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-[#0b0e14] border border-cyan-500/30 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
            <Zap className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-zinc-100 font-mono">
                NEXUS Automation Engine
              </h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                EVENT-DRIVEN ORCHESTRATION
              </span>
            </div>
            <p className="text-xs text-zinc-400 font-mono mt-0.5">
              Trigger → Conditions → Privileged Actions → Verification & Audit Logging
            </p>
          </div>
        </div>

        <button
          onClick={() => alert('New automation builder modal ready.')}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-zinc-950 text-xs font-bold font-mono transition-colors shadow-lg shadow-cyan-500/20"
        >
          <Plus className="w-4 h-4" />
          <span>New Workflow Rule</span>
        </button>
      </div>

      {/* Rules list */}
      <div className="space-y-4">
        {automations.map((rule) => (
          <div
            key={rule.id}
            className="p-5 rounded-2xl bg-[#0b0e14] border border-zinc-800 hover:border-cyan-500/40 transition-all space-y-3 shadow-xl"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-cyan-400">
                  <Zap className="w-4 h-4" />
                </span>
                <div>
                  <h3 className="text-sm font-bold text-zinc-100 font-mono">{rule.name}</h3>
                  <div className="text-[11px] text-zinc-500 font-mono">
                    Last Fired: {rule.lastTriggered} • Executed {rule.timesExecuted} times
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    sounds.playExecute();
                    onRunAutomationNow(rule);
                  }}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-cyan-300 text-xs font-mono transition-colors"
                >
                  <Play className="w-3 h-3" />
                  <span>Run Now</span>
                </button>

                <button
                  onClick={() => {
                    sounds.playClick();
                    onToggleAutomation(rule.id);
                  }}
                  className="p-1 text-zinc-400 hover:text-white"
                >
                  {rule.enabled ? (
                    <ToggleRight className="w-8 h-8 text-cyan-400" />
                  ) : (
                    <ToggleLeft className="w-8 h-8 text-zinc-600" />
                  )}
                </button>
              </div>
            </div>

            {/* Pipeline Visual Flow */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 p-3 rounded-xl bg-zinc-950 border border-zinc-900 text-xs font-mono">
              <div className="space-y-0.5">
                <div className="text-[10px] text-zinc-500 uppercase">1. TRIGGER</div>
                <div className="text-zinc-200">{rule.trigger}</div>
              </div>
              <div className="space-y-0.5">
                <div className="text-[10px] text-zinc-500 uppercase">2. CONDITIONS</div>
                <div className="text-zinc-400">{rule.conditions}</div>
              </div>
              <div className="space-y-0.5">
                <div className="text-[10px] text-zinc-500 uppercase">3. ACTIONS</div>
                <div className="text-cyan-300">{rule.action}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
