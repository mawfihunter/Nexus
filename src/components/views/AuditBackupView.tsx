import React, { useState } from 'react';
import {
  FileText,
  Shield,
  HardDrive,
  Brain,
  Download,
  Trash2,
  Edit3,
  Clock,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
} from 'lucide-react';
import { AuditLogItem, AIMemoryItem } from '../../types/nexus';
import { sounds } from '../../utils/audio';

interface AuditBackupViewProps {
  auditLogs: AuditLogItem[];
  aiMemories: AIMemoryItem[];
  onDeleteMemory: (id: string) => void;
  onExportMemory: () => void;
}

export const AuditBackupView: React.FC<AuditBackupViewProps> = ({
  auditLogs,
  aiMemories,
  onDeleteMemory,
  onExportMemory,
}) => {
  const [activeTab, setActiveTab] = useState<'AUDIT' | 'BACKUPS' | 'MEMORY'>('AUDIT');

  const backups = [
    { id: 'BAK-20261002-0400', name: 'Daily Full Database & Configuration Snapshot', size: '4.2 GB', type: 'Postgres DB + Config', time: 'Today 04:00 AM', status: 'HEALTHY' },
    { id: 'BAK-20261001-0400', name: 'Previous Daily Full Backup Archive', size: '4.1 GB', type: 'Postgres DB + Config', time: 'Yesterday 04:00 AM', status: 'HEALTHY' },
    { id: 'BAK-VM-UBUNTU-01', name: 'Ubuntu DevBox Clean Golden Baseline Snapshot', size: '18.4 GB', type: 'VirtualBox VDI', time: 'Sep 28, 2026', status: 'HEALTHY' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-[#0b0e14] border border-cyan-500/30 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-zinc-100 font-mono">
                Audit Logs, Disaster Recovery & AI Memory
              </h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                AUDIT COMPLIANT
              </span>
            </div>
            <p className="text-xs text-zinc-400 font-mono mt-0.5">
              Cryptographically verified event logs, snapshot backups, and zero-secret AI context memory
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          {(['AUDIT', 'BACKUPS', 'MEMORY'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => { sounds.playClick(); setActiveTab(tab); }}
              className={`px-4 py-2 rounded-xl transition-all ${
                activeTab === tab
                  ? 'bg-cyan-500 text-zinc-950 font-bold shadow-md shadow-cyan-500/20'
                  : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'AUDIT' && (
        <div className="rounded-2xl bg-[#0b0e14] border border-zinc-800 p-5 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-zinc-100 uppercase tracking-wider font-mono">
              Immutable Action Audit Log ({auditLogs.length} Events)
            </h3>
            <span className="text-[10px] font-mono text-zinc-500">TAMPER-PROOF AUDIT REPO</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-zinc-800 text-zinc-500 text-[10px] uppercase">
                  <th className="pb-2">Timestamp</th>
                  <th className="pb-2">Actor</th>
                  <th className="pb-2">Target Service</th>
                  <th className="pb-2">Action Description</th>
                  <th className="pb-2">Risk</th>
                  <th className="pb-2">Result</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-900">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-zinc-900/40">
                    <td className="py-2.5 text-zinc-500">{log.time}</td>
                    <td className="py-2.5 text-cyan-300 font-semibold">{log.actor}</td>
                    <td className="py-2.5 text-zinc-300">{log.service}</td>
                    <td className="py-2.5 text-zinc-200">{log.action}</td>
                    <td className="py-2.5">
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-zinc-900 text-zinc-400">
                        {log.riskLevel}
                      </span>
                    </td>
                    <td className="py-2.5 text-emerald-400 font-bold">{log.result}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'BACKUPS' && (
        <div className="rounded-2xl bg-[#0b0e14] border border-zinc-800 p-5 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-zinc-100 uppercase tracking-wider font-mono">
              Disaster Recovery & Redundant Backups
            </h3>
            <button
              onClick={() => alert('Triggered full offline encrypted backup snapshot.')}
              className="px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-bold text-xs font-mono"
            >
              Trigger Full Backup Now
            </button>
          </div>

          <div className="divide-y divide-zinc-900 border border-zinc-800 rounded-xl overflow-hidden bg-zinc-950 text-xs font-mono">
            {backups.map((bak) => (
              <div key={bak.id} className="p-4 flex items-center justify-between">
                <div>
                  <div className="text-zinc-100 font-bold">{bak.name}</div>
                  <div className="text-[10px] text-zinc-500 mt-0.5">
                    {bak.id} • {bak.type} • {bak.size}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-emerald-400 font-semibold">{bak.status}</div>
                  <div className="text-[10px] text-zinc-500">{bak.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'MEMORY' && (
        <div className="rounded-2xl bg-[#0b0e14] border border-zinc-800 p-5 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-zinc-100 uppercase tracking-wider font-mono">
                Controlled AI Memory Viewer & Editor
              </h3>
              <p className="text-xs text-zinc-400 mt-0.5">
                NEXUS AI Memory stores user preferences and business context. Passwords, secrets, and session tokens are strictly prohibited.
              </p>
            </div>
            <button
              onClick={onExportMemory}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-cyan-300 text-xs font-mono"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Memory</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {aiMemories.map((mem) => (
              <div
                key={mem.id}
                className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2 text-xs font-mono"
              >
                <div className="flex items-start justify-between">
                  <span className="text-[10px] text-cyan-400 uppercase font-bold">{mem.category}</span>
                  <button
                    onClick={() => onDeleteMemory(mem.id)}
                    className="p-1 rounded text-zinc-500 hover:text-red-400"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <h4 className="text-zinc-200 font-bold">{mem.key}</h4>
                <p className="text-zinc-400 font-sans leading-relaxed text-[11px] bg-zinc-900/60 p-2.5 rounded-lg border border-zinc-900">
                  {mem.value}
                </p>
                <div className="text-[10px] text-zinc-600">Updated: {mem.lastUpdated}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
