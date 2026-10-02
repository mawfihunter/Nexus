import React, { useState } from 'react';
import {
  Server,
  HardDrive,
  Cpu,
  Activity,
  ShieldCheck,
  RotateCcw,
  Globe,
  Lock,
  Plus,
  ArrowUpRight,
} from 'lucide-react';
import { ServerNode } from '../../types/nexus';
import { sounds } from '../../utils/audio';

interface ServersViewProps {
  servers: ServerNode[];
  onTriggerReboot: (serverId: string) => void;
}

export const ServersView: React.FC<ServersViewProps> = ({ servers, onTriggerReboot }) => {
  const [selectedServerId, setSelectedServerId] = useState<string>(servers[0]?.id || '');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-[#0b0e14] border border-cyan-500/30 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/40 flex items-center justify-center text-blue-400">
            <Server className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-zinc-100 font-mono">
                Server & Cloud Infrastructure Center
              </h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800">
                MULTI-REGION FLEET
              </span>
            </div>
            <p className="text-xs text-zinc-400 font-mono mt-0.5">
              Production VPS, Frankfurt cPanel CDN, and high-availability database clusters
            </p>
          </div>
        </div>

        <button
          onClick={() => alert('Provisioning wizard: Connected to Linode, DigitalOcean & AWS APIs.')}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-zinc-950 text-xs font-bold font-mono transition-colors shadow-lg shadow-cyan-500/20"
        >
          <Plus className="w-4 h-4" />
          <span>Add Server Node</span>
        </button>
      </div>

      {/* Servers Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {servers.map((srv) => (
          <div
            key={srv.id}
            className="p-5 rounded-2xl bg-[#0b0e14] border border-zinc-800 hover:border-blue-500/40 transition-all space-y-4 shadow-xl"
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-zinc-100 font-mono">{srv.name}</h3>
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                </div>
                <div className="text-[11px] text-zinc-500 font-mono mt-0.5">{srv.region}</div>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-cyan-400">
                {srv.type}
              </span>
            </div>

            <div className="space-y-2 text-xs font-mono text-zinc-400">
              <div className="flex justify-between text-[11px]">
                <span>IP Address:</span>
                <span className="text-zinc-200">{srv.ip}</span>
              </div>
              <div className="flex justify-between text-[11px]">
                <span>CPU Load:</span>
                <span className="text-emerald-400 font-bold">{srv.cpuPercent}%</span>
              </div>
              <div className="flex justify-between text-[11px]">
                <span>RAM Usage:</span>
                <span className="text-blue-400">{srv.ramPercent}%</span>
              </div>
              <div className="flex justify-between text-[11px]">
                <span>Storage Disk:</span>
                <span className="text-purple-400">{srv.diskPercent}% Allocated</span>
              </div>
            </div>

            <div className="pt-2 border-t border-zinc-900 flex items-center justify-between text-xs font-mono">
              <div className="text-[10px] text-emerald-400 flex items-center gap-1">
                <Lock className="w-3 h-3" />
                <span>SSL: {srv.sslStatus}</span>
              </div>
              <button
                onClick={() => onTriggerReboot(srv.id)}
                className="flex items-center gap-1 text-xs text-amber-400 hover:text-amber-300"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reboot</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
