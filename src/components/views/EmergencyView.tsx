import React, { useState } from 'react';
import {
  AlertOctagon,
  ShieldAlert,
  Lock,
  Pause,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  HardDrive,
  Server,
  Zap,
} from 'lucide-react';
import { sounds } from '../../utils/audio';

export const EmergencyView: React.FC = () => {
  const [isLockdownActive, setIsLockdownActive] = useState(false);

  const emergencyActions = [
    { id: '1', title: 'Network Outbound Quarantine', desc: 'Sever non-essential outbound API connections and external webhooks', icon: Lock, color: 'text-amber-400' },
    { id: '2', title: 'Pause E-Commerce Payment Gateways', desc: 'Temporarily halt checkout processing on Neo & Fitkart BD', icon: Pause, color: 'text-red-400' },
    { id: '3', title: 'Snapshot & Isolate VirtualBox VMs', desc: 'Freeze running VMs into clean snapshot states immediately', icon: HardDrive, color: 'text-cyan-400' },
    { id: '4', title: 'Restart Ingress Edge Reverse Proxy', desc: 'Gracefully recycle Nginx and Cloudflare tunnel endpoints', icon: RotateCcw, color: 'text-emerald-400' },
  ];

  const handleAction = (title: string) => {
    sounds.playAlert();
    const confirmed = window.confirm(`CONFIRM EMERGENCY ACTION:\n"${title}"\nAre you sure you want to trigger this action?`);
    if (confirmed) {
      sounds.playExecute();
      alert(`Emergency procedure executed: ${title}`);
    }
  };

  const handleToggleLockdown = () => {
    sounds.playAlert();
    if (!isLockdownActive) {
      const ok = window.confirm('ACTIVATE EMERGENCY LOCKDOWN MODE?\nThis will restrict privileged agent commands and require dual confirmation on all outbound operations.');
      if (ok) {
        setIsLockdownActive(true);
        sounds.playExecute();
      }
    } else {
      setIsLockdownActive(false);
      sounds.playClick();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-red-950/40 via-[#0b0e14] to-zinc-950 border border-red-500/40 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/40 flex items-center justify-center text-red-400">
            <AlertOctagon className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-zinc-100 font-mono">
                NEXUS Emergency Center
              </h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-950 text-red-300 border border-red-800">
                CRITICAL RESPONSE
              </span>
            </div>
            <p className="text-xs text-zinc-400 font-mono mt-0.5">
              High-consequence isolation procedures, incident containment, and fail-safe triggers
            </p>
          </div>
        </div>

        <button
          onClick={handleToggleLockdown}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold font-mono text-xs shadow-lg transition-all ${
            isLockdownActive
              ? 'bg-amber-500 text-zinc-950 shadow-amber-500/30'
              : 'bg-red-600 hover:bg-red-500 text-white shadow-red-600/30'
          }`}
        >
          <ShieldAlert className="w-4 h-4" />
          <span>{isLockdownActive ? 'Disengage Lockdown Mode' : 'Activate Emergency Lockdown'}</span>
        </button>
      </div>

      {isLockdownActive && (
        <div className="p-4 rounded-xl bg-red-950/60 border border-red-500/60 text-xs font-mono text-red-200 flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
          <span>
            EMERGENCY LOCKDOWN ACTIVE: All outbound shell commands, automated marketing campaigns, and DNS mutations are suspended pending dual verification.
          </span>
        </div>
      )}

      {/* Emergency Actions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {emergencyActions.map((act) => {
          const Icon = act.icon;
          return (
            <div
              key={act.id}
              className="p-5 rounded-2xl bg-[#0b0e14] border border-zinc-800 hover:border-red-500/40 transition-all space-y-3 shadow-xl"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center ${act.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-zinc-100 font-mono">{act.title}</h3>
                    <p className="text-xs text-zinc-400 mt-0.5">{act.desc}</p>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-zinc-900 flex justify-end">
                <button
                  onClick={() => handleAction(act.title)}
                  className="px-4 py-1.5 rounded-lg bg-zinc-900 hover:bg-red-950 border border-zinc-800 hover:border-red-700 text-zinc-200 hover:text-red-200 text-xs font-mono transition-colors"
                >
                  Execute Procedure
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
