import React from 'react';
import {
  Cpu,
  Server,
  ShoppingBag,
  Shield,
  Video,
  Users,
  Activity,
  ArrowUpRight,
  TrendingUp,
  HardDrive,
  Wifi,
  Sparkles,
  Play,
  Terminal,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Globe,
} from 'lucide-react';
import {
  LocalAgentStatus,
  BusinessEntity,
  ServerNode,
  VirtualMachine,
  SecurityAsset,
  TeamMember,
  AuditLogItem,
} from '../../types/nexus';
import { sounds } from '../../utils/audio';

interface DashboardOverviewProps {
  localAgent: LocalAgentStatus;
  businesses: BusinessEntity[];
  servers: ServerNode[];
  vms: VirtualMachine[];
  securityAssets: SecurityAsset[];
  team: TeamMember[];
  auditLogs: AuditLogItem[];
  onNavigate: (view: string, params?: any) => void;
  onOpenVoice: () => void;
  onOpenDailyBrief: () => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  localAgent,
  businesses,
  servers,
  vms,
  securityAssets,
  team,
  auditLogs,
  onNavigate,
  onOpenVoice,
  onOpenDailyBrief,
}) => {
  const totalTodaySales = businesses.reduce((acc, b) => acc + b.todaySales, 0);
  const totalActiveOrders = businesses.reduce((acc, b) => acc + b.activeOrders, 0);
  const onlineTeamCount = team.filter((t) => t.status === 'ONLINE' || t.status === 'BUSY').length;

  return (
    <div className="space-y-6">
      {/* Top Banner / System Tagline & Quick Triggers */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-zinc-950 via-[#0d121c] to-zinc-950 border border-cyan-500/30 p-6 shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-700/60">
                PRIVATE COMMAND CENTER
              </span>
              <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                ZERO-TRUST SECURE PIPE ACTIVE
              </span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-black tracking-tight text-zinc-100 mt-2">
              NEXUS MONSTER
            </h1>
            <p className="text-xs text-zinc-400 font-mono mt-0.5">
              "One Command Center. Your Entire Digital World."
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => { sounds.playClick(); onOpenDailyBrief(); }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 text-xs font-semibold font-mono transition-all"
            >
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>Daily AI Brief</span>
            </button>

            <button
              onClick={() => { sounds.playClick(); onOpenVoice(); }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-zinc-950 font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all"
            >
              <Activity className="w-4 h-4" />
              <span>Voice Command (বাংলা/EN)</span>
            </button>
          </div>
        </div>

        {/* Primary PC Live Telemetry Strip */}
        <div className="mt-5 pt-4 border-t border-zinc-800/80 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
          <div className="bg-zinc-900/60 p-2.5 rounded-xl border border-zinc-800">
            <div className="text-zinc-500 text-[10px] uppercase flex items-center justify-between">
              <span>Primary Node</span>
              <Cpu className="w-3.5 h-3.5 text-cyan-400" />
            </div>
            <div className="text-zinc-200 font-semibold mt-1 truncate">
              {localAgent.hardware.cpuCores} Cores @ {localAgent.hardware.cpuUsagePercent}%
            </div>
            <div className="text-[10px] text-zinc-400 mt-0.5 flex items-center gap-1">
              <span>{localAgent.hardware.tempCelsius}°C</span>
              <span>•</span>
              <span className="text-emerald-400">Stable</span>
            </div>
          </div>

          <div className="bg-zinc-900/60 p-2.5 rounded-xl border border-zinc-800">
            <div className="text-zinc-500 text-[10px] uppercase flex items-center justify-between">
              <span>DDR5 Memory</span>
              <Activity className="w-3.5 h-3.5 text-blue-400" />
            </div>
            <div className="text-zinc-200 font-semibold mt-1">
              {localAgent.hardware.ramUsedGb} / {localAgent.hardware.ramTotalGb} GB
            </div>
            <div className="text-[10px] text-zinc-400 mt-0.5">
              {Math.round((localAgent.hardware.ramUsedGb / localAgent.hardware.ramTotalGb) * 100)}% Allocated
            </div>
          </div>

          <div className="bg-zinc-900/60 p-2.5 rounded-xl border border-zinc-800">
            <div className="text-zinc-500 text-[10px] uppercase flex items-center justify-between">
              <span>NVMe Storage</span>
              <HardDrive className="w-3.5 h-3.5 text-purple-400" />
            </div>
            <div className="text-zinc-200 font-semibold mt-1">
              {localAgent.hardware.storageUsedTb} / {localAgent.hardware.storageTotalTb} TB
            </div>
            <div className="text-[10px] text-zinc-400 mt-0.5">
              2.18 TB Free High-Speed
            </div>
          </div>

          <div className="bg-zinc-900/60 p-2.5 rounded-xl border border-zinc-800">
            <div className="text-zinc-500 text-[10px] uppercase flex items-center justify-between">
              <span>Tunnel Bandwidth</span>
              <Wifi className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <div className="text-zinc-200 font-semibold mt-1">
              ↓ {localAgent.hardware.networkDownMbps} / ↑ {localAgent.hardware.networkUpMbps} Mbps
            </div>
            <div className="text-[10px] text-emerald-400 mt-0.5">
              Encrypted Outbound
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Business Operations & CRM */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Business Center Card */}
        <div className="lg:col-span-2 rounded-2xl bg-[#0b0e14] border border-zinc-800 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-zinc-100 uppercase tracking-wider font-mono">
                  Business Operating System
                </h3>
                <span className="text-[11px] text-zinc-400">E-Commerce & Retail Velocity</span>
              </div>
            </div>

            <button
              onClick={() => { sounds.playClick(); onNavigate('BUSINESS'); }}
              className="flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 font-mono"
            >
              <span>Manage Businesses</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {businesses.map((biz) => (
              <div
                key={biz.id}
                onClick={() => { sounds.playClick(); onNavigate('BUSINESS', { bizId: biz.id }); }}
                className="p-4 rounded-xl bg-zinc-950 border border-zinc-800/80 hover:border-cyan-500/40 cursor-pointer transition-all space-y-3 group"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-zinc-100 group-hover:text-cyan-300 transition-colors">
                      {biz.name}
                    </h4>
                    <p className="text-[10px] text-zinc-500 truncate max-w-[200px]">{biz.tagline}</p>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                    +{biz.growthRate}%
                  </span>
                </div>

                <div className="flex items-baseline justify-between pt-2 border-t border-zinc-900">
                  <div>
                    <div className="text-[10px] text-zinc-500 font-mono">TODAY'S REVENUE</div>
                    <div className="text-base font-bold text-zinc-100 font-mono">
                      {biz.todaySales.toLocaleString()} {biz.currency}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] text-zinc-500 font-mono">ACTIVE ORDERS</div>
                    <div className="text-sm font-semibold text-cyan-400 font-mono">
                      {biz.activeOrders} Orders
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Recent Orders Ticker */}
          <div className="rounded-xl bg-zinc-950/70 border border-zinc-900 p-3 space-y-2">
            <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
              Live Order Stream (Neo & Fitkart BD)
            </div>
            <div className="space-y-1.5">
              {businesses[0].recentOrders.slice(0, 2).concat(businesses[1].recentOrders.slice(0, 2)).map((ord) => (
                <div key={ord.id} className="flex items-center justify-between text-xs py-1 border-b border-zinc-900/60 last:border-none">
                  <div className="flex items-center gap-2 truncate">
                    <span className="text-[10px] font-mono text-cyan-400">{ord.id}</span>
                    <span className="text-zinc-200 font-medium">{ord.customer}</span>
                    <span className="text-zinc-500 text-[11px] truncate">({ord.items})</span>
                  </div>
                  <div className="flex items-center gap-3 shrink-0 font-mono text-[11px]">
                    <span className="text-zinc-300 font-bold">{ord.amount} BDT</span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400">{ord.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Infrastructure & Servers Quick Card */}
        <div className="rounded-2xl bg-[#0b0e14] border border-zinc-800 p-5 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
                  <Server className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-zinc-100 uppercase tracking-wider font-mono">
                    Cloud & VMs
                  </h3>
                  <span className="text-[11px] text-zinc-400">VPS Nodes & VirtualBox</span>
                </div>
              </div>

              <button
                onClick={() => { sounds.playClick(); onNavigate('SERVERS'); }}
                className="text-xs text-cyan-400 hover:text-cyan-300 font-mono"
              >
                Inspect
              </button>
            </div>

            <div className="space-y-2">
              {servers.map((srv) => (
                <div key={srv.id} className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-zinc-200 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                      <span>{srv.name}</span>
                    </div>
                    <div className="text-[10px] text-zinc-500 font-mono">{srv.region}</div>
                  </div>
                  <div className="text-right text-[11px] font-mono">
                    <div className="text-zinc-300">CPU {srv.cpuPercent}% | RAM {srv.ramPercent}%</div>
                    <div className="text-[9px] text-emerald-400">SSL {srv.sslStatus}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-zinc-900 space-y-1.5">
              <div className="text-[10px] font-mono uppercase text-zinc-500">VirtualBox Instances:</div>
              <div className="flex items-center gap-2 flex-wrap">
                {vms.map((vm) => (
                  <span
                    key={vm.id}
                    className="text-[10px] font-mono px-2 py-1 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 flex items-center gap-1.5"
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${vm.status === 'RUNNING' ? 'bg-emerald-400' : 'bg-zinc-600'}`}></span>
                    <span>{vm.name}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={() => { sounds.playClick(); onNavigate('VMS'); }}
            className="w-full py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-mono text-cyan-300 flex items-center justify-center gap-1.5 transition-colors"
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Open VirtualBox Control</span>
          </button>
        </div>
      </div>

      {/* Grid: Defensive Cyber Security, Distributed Team & Media Rundown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Cyber Security Operations */}
        <div className="rounded-2xl bg-[#0b0e14] border border-zinc-800 p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-200 font-mono">
                Cyber Security Center
              </h3>
            </div>
            <button
              onClick={() => { sounds.playClick(); onNavigate('SECURITY'); }}
              className="text-[11px] text-cyan-400 font-mono"
            >
              Labs →
            </button>
          </div>

          <div className="p-3 rounded-xl bg-zinc-950 border border-emerald-950/60 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-emerald-300">TryHackMe SOC Sandbox</span>
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400">
                AUTHORIZED
              </span>
            </div>
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              Defensive blue-team sandbox active. Packet telemetry streaming with zero unauthorized probes.
            </p>
          </div>

          <div className="text-[10px] font-mono text-zinc-500 flex items-center justify-between">
            <span>AUDIT STATUS: VERIFIED</span>
            <span className="text-emerald-400">0 High Vulnerabilities</span>
          </div>
        </div>

        {/* Distributed Nationwide Team */}
        <div className="rounded-2xl bg-[#0b0e14] border border-zinc-800 p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-purple-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-200 font-mono">
                Team Command Center
              </h3>
            </div>
            <button
              onClick={() => { sounds.playClick(); onNavigate('TEAM'); }}
              className="text-[11px] text-cyan-400 font-mono"
            >
              Directory →
            </button>
          </div>

          <div className="space-y-2">
            {team.slice(0, 3).map((member) => (
              <div key={member.id} className="flex items-center justify-between text-xs py-1 border-b border-zinc-900 last:border-none">
                <div className="flex items-center gap-2">
                  <span className={`w-1.5 h-1.5 rounded-full ${member.status === 'ONLINE' ? 'bg-emerald-400' : 'bg-amber-400'}`}></span>
                  <span className="font-medium text-zinc-200">{member.name}</span>
                </div>
                <span className="text-[10px] font-mono text-zinc-500">{member.role}</span>
              </div>
            ))}
          </div>

          <div className="text-[10px] font-mono text-zinc-500 pt-1">
            {onlineTeamCount} of {team.length} members connected nationwide
          </div>
        </div>

        {/* Media & TV Newsroom */}
        <div className="rounded-2xl bg-[#0b0e14] border border-zinc-800 p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Video className="w-4 h-4 text-pink-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-200 font-mono">
                Media & TV Broadcast
              </h3>
            </div>
            <button
              onClick={() => { sounds.playClick(); onNavigate('MEDIA'); }}
              className="text-[11px] text-cyan-400 font-mono"
            >
              Newsroom →
            </button>
          </div>

          <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-zinc-100">Tech Tonight & Frontier</span>
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-pink-950 text-pink-300">
                21:00 AIR
              </span>
            </div>
            <div className="text-[11px] text-zinc-400">
              Host: Nayeem Chowdhury • Studio A LED Wall
            </div>
            <div className="text-[10px] font-mono text-cyan-400 mt-1">
              Rundown Segment: AI Local Compute Shift in BD
            </div>
          </div>

          <div className="text-[10px] font-mono text-zinc-500">
            Publishing Pipeline: 2 Stories in Final Editing
          </div>
        </div>
      </div>
    </div>
  );
};
