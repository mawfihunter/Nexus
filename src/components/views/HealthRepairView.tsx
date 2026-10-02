import React, { useState } from 'react';
import {
  Activity,
  ShieldCheck,
  AlertTriangle,
  RotateCcw,
  RefreshCw,
  CheckCircle2,
  HardDrive,
  Cpu,
  Layers,
  Sparkles,
  History,
  FileCode,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import { RepairJob, HealthStatus } from '../../types/nexus';
import { sounds } from '../../utils/audio';

interface HealthRepairViewProps {
  repairs: RepairJob[];
  onTriggerRepair: (component: string, issue: string) => Promise<any>;
  onRollbackRepair: (repairId: string) => void;
  isRepairing: boolean;
}

export const HealthRepairView: React.FC<HealthRepairViewProps> = ({
  repairs,
  onTriggerRepair,
  onRollbackRepair,
  isRepairing,
}) => {
  const [selectedComponent, setSelectedComponent] = useState('Local Agent Daemon');
  const [reportedIssue, setReportedIssue] = useState('Socket latency fluctuation on IPC pipe');

  const componentsHealth: { name: string; status: HealthStatus; uptime: string; latency: string }[] = [
    { name: 'Core Control Plane (Express + React)', status: 'HEALTHY', uptime: '99.99%', latency: '1ms' },
    { name: 'Local Agent Node (Core Ultra 9)', status: 'HEALTHY', uptime: '99.95%', latency: '2ms' },
    { name: 'PostgreSQL Relational DB', status: 'HEALTHY', uptime: '99.98%', latency: '3ms' },
    { name: 'VirtualBox Hypervisor Bridge', status: 'HEALTHY', uptime: '99.90%', latency: '8ms' },
    { name: 'Zero-Trust Outbound Tunnel', status: 'HEALTHY', uptime: '100.0%', latency: '12ms' },
    { name: 'Browser Automation Enclave', status: 'HEALTHY', uptime: '99.92%', latency: '5ms' },
    { name: 'VPS Singapore Production Host', status: 'HEALTHY', uptime: '99.98%', latency: '28ms' },
    { name: 'Gemini AI Orchestrator Link', status: 'HEALTHY', uptime: '99.94%', latency: '180ms' },
  ];

  const handleStartAutoRepair = async (e: React.FormEvent) => {
    e.preventDefault();
    sounds.playClick();
    await onTriggerRepair(selectedComponent, reportedIssue);
    sounds.playExecute();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-[#0b0e14] border border-cyan-500/30 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-zinc-100 font-mono">
                NEXUS Auto-Repair & Self-Diagnostics
              </h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                DISCIPLINED SELF-HEALING
              </span>
            </div>
            <p className="text-xs text-zinc-400 font-mono mt-0.5">
              Continuous monitoring, automated error capture, snapshot backups, and one-click rollback
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
          <span className="text-emerald-400 font-bold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>8/8 Subsystems Verified</span>
          </span>
        </div>
      </div>

      {/* Safety Discipline Box */}
      <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 text-xs font-mono space-y-1">
        <div className="text-zinc-300 font-bold uppercase tracking-wider flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-cyan-400" />
          <span>NEXUS Strict Self-Healing Guardrails:</span>
        </div>
        <p className="text-zinc-400 font-sans leading-relaxed text-[11px]">
          Self-repair operations cannot rewrite core security controls, cannot disable authorization boundaries, and will never delete snapshots. High-risk infrastructure modifications always demand operator approval.
        </p>
      </div>

      {/* Health Matrix Grid */}
      <div className="rounded-2xl bg-[#0b0e14] border border-zinc-800 p-5 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-zinc-100 uppercase tracking-wider font-mono">
            System Subsystems Health Matrix
          </h3>
          <span className="text-[10px] font-mono text-zinc-500">POLLING FREQUENCY: 5000MS</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs font-mono">
          {componentsHealth.map((item) => (
            <div key={item.name} className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800/80 space-y-2">
              <div className="flex items-start justify-between">
                <span className="font-semibold text-zinc-200 line-clamp-1">{item.name}</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0 mt-1"></span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-zinc-500">
                <span>Uptime: {item.uptime}</span>
                <span className="text-cyan-400">{item.latency}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Manual Diagnostic Trigger & Versioned Repair Log */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Trigger form */}
        <div className="p-5 rounded-2xl bg-[#0b0e14] border border-zinc-800 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-200 font-mono">
            Trigger Diagnostic & Repair Plan
          </h3>

          <form onSubmit={handleStartAutoRepair} className="space-y-3 text-xs font-mono">
            <div className="space-y-1">
              <label className="text-zinc-400">Target Component:</label>
              <select
                value={selectedComponent}
                onChange={(e) => setSelectedComponent(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-zinc-100"
              >
                <option value="Local Agent Daemon">Local Agent Daemon</option>
                <option value="code-server IPC Pipe">code-server IPC Pipe</option>
                <option value="Redis Session Cache">Redis Session Cache</option>
                <option value="Nginx Ingress SSL Hook">Nginx Ingress SSL Hook</option>
                <option value="VirtualBox Hypervisor Socket">VirtualBox Hypervisor Socket</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-zinc-400">Reported Anomaly / Issue:</label>
              <input
                type="text"
                value={reportedIssue}
                onChange={(e) => setReportedIssue(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-zinc-100"
              />
            </div>

            <button
              type="submit"
              disabled={isRepairing}
              className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-bold text-xs transition-colors flex items-center justify-center gap-2 mt-2"
            >
              <Sparkles className={`w-4 h-4 ${isRepairing ? 'animate-spin' : ''}`} />
              <span>{isRepairing ? 'Diagnosing & Synthesizing...' : 'Synthesize Safe Repair'}</span>
            </button>
          </form>
        </div>

        {/* Versioned Repair History */}
        <div className="lg:col-span-2 rounded-2xl bg-[#0b0e14] border border-zinc-800 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-200 font-mono">
              Versioned Repair & Snapshot History ({repairs.length})
            </h3>
            <span className="text-[10px] font-mono text-zinc-500">ROLLBACK READY</span>
          </div>

          <div className="space-y-3 max-h-[450px] overflow-y-auto">
            {repairs.map((rep) => (
              <div
                key={rep.id}
                className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 text-xs font-mono space-y-2.5"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-bold text-zinc-100 flex items-center gap-2">
                      <span className="text-cyan-400">{rep.id}</span>
                      <span>•</span>
                      <span>{rep.component}</span>
                    </div>
                    <div className="text-[10px] text-zinc-500 mt-0.5">{rep.timestamp} • Snapshot: {rep.backupSnapshotId}</div>
                  </div>

                  <span
                    className={`text-[9px] px-2 py-0.5 rounded font-bold ${
                      rep.rollbackStatus === 'ROLLED_BACK'
                        ? 'bg-amber-950 text-amber-300'
                        : 'bg-emerald-950 text-emerald-300'
                    }`}
                  >
                    {rep.rollbackStatus}
                  </span>
                </div>

                <div className="p-2.5 rounded-lg bg-zinc-900/60 border border-zinc-800/80 text-[11px] text-zinc-300 font-sans space-y-1">
                  <div><strong>Diagnosis:</strong> {rep.diagnosis}</div>
                  <div><strong>Plan:</strong> {rep.repairPlan}</div>
                </div>

                {/* Actions taken */}
                <div className="space-y-1 text-[10px] text-zinc-400">
                  <div className="text-zinc-500 uppercase font-semibold">Actions Applied:</div>
                  <ul className="list-disc list-inside">
                    {rep.actionsTaken.map((act, i) => (
                      <li key={i} className="text-cyan-300/80">{act}</li>
                    ))}
                  </ul>
                </div>

                {/* Rollback button */}
                <div className="pt-2 border-t border-zinc-900 flex justify-end">
                  {rep.rollbackStatus !== 'ROLLED_BACK' && (
                    <button
                      onClick={() => onRollbackRepair(rep.id)}
                      className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-zinc-900 hover:bg-red-950 border border-zinc-800 hover:border-red-800 text-zinc-300 hover:text-red-300 text-[11px] transition-colors"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Rollback Repair to Snapshot</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
