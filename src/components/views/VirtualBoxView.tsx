import React, { useState } from 'react';
import {
  Server,
  Play,
  Square,
  RotateCcw,
  Camera,
  History,
  Terminal,
  Cpu,
  HardDrive,
  Activity,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { VirtualMachine } from '../../types/nexus';
import { sounds } from '../../utils/audio';

interface VirtualBoxViewProps {
  vms: VirtualMachine[];
  onToggleVmState: (id: string, action: 'START' | 'STOP' | 'RESTART' | 'SNAPSHOT') => void;
  onOpenConsole: (vm: VirtualMachine) => void;
}

export const VirtualBoxView: React.FC<VirtualBoxViewProps> = ({
  vms,
  onToggleVmState,
  onOpenConsole,
}) => {
  const [selectedVmId, setSelectedVmId] = useState<string>(vms[0]?.id || '');
  const [activeTab, setActiveTab] = useState<'VMS' | 'TERMINAL' | 'DOCKER'>('VMS');

  // Interactive Terminal state
  const [commandInput, setCommandInput] = useState('');
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    'NEXUS Private Linux Terminal [VBox Bridge Host]',
    'Type "help" for available commands or use AI orchestrator.',
    'musfiq@ubuntu-devbox:~$ uptime',
    ' 11:35:12 up 4 days,  2:14,  2 users,  load average: 0.18, 0.22, 0.19',
    'musfiq@ubuntu-devbox:~$ docker ps',
    'CONTAINER ID   IMAGE                 STATUS         PORTS                    NAMES',
    '8f910ea2b19c   postgres:16-alpine    Up 4 days      0.0.0.0:5432->5432/tcp   nexus-pg-local',
    '1e089d71c4fa   redis:7-alpine        Up 4 days      0.0.0.0:6379->6379/tcp   nexus-cache',
    'musfiq@ubuntu-devbox:~$ ',
  ]);

  const selectedVm = vms.find((v) => v.id === selectedVmId) || vms[0];

  const handleCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commandInput.trim()) return;

    sounds.playClick();
    const cmd = commandInput.trim();
    setCommandInput('');

    let output = '';
    if (cmd === 'help') {
      output = 'Available safe commands: htop, docker ps, uptime, ls -la, uname -a, clear, free -m, ip a';
    } else if (cmd === 'clear') {
      setTerminalLogs(['Terminal cleared.']);
      return;
    } else if (cmd === 'uname -a') {
      output = 'Linux ubuntu-devbox 6.8.0-45-generic #45-Ubuntu SMP PREEMPT_DYNAMIC x86_64 GNU/Linux';
    } else if (cmd === 'free -m') {
      output = '               total        used        free      shared  buff/cache   available\nMem:            3912        1840        1210          48         862        2024\nSwap:           2048           0        2048';
    } else if (cmd === 'ip a') {
      output = '1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536\n2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 inet 192.168.56.101/24 brd 192.168.56.255';
    } else if (cmd.includes('rm') || cmd.includes('reboot') || cmd.includes('dd')) {
      sounds.playAlert();
      output = `COMMAND BLOCKED BY SAFETY GATE: "${cmd}" requires elevated authorization in Approvals Center.`;
    } else {
      output = `[NEXUS EXEC] ${cmd} completed with status code 0.`;
    }

    setTerminalLogs((prev) => [...prev, `musfiq@ubuntu-devbox:~$ ${cmd}`, output]);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-[#0b0e14] border border-cyan-500/30 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
            <Server className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-zinc-100 font-mono">
                VirtualBox & Linux VM Center
              </h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                HYPERVISOR HOST
              </span>
            </div>
            <p className="text-xs text-zinc-400 font-mono mt-0.5">
              Isolated Linux environments hosted on Primary PC (Intel Core Ultra 9 Node)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <button
            onClick={() => setActiveTab('VMS')}
            className={`px-4 py-2 rounded-xl transition-all ${
              activeTab === 'VMS'
                ? 'bg-cyan-500 text-zinc-950 font-bold shadow-md shadow-cyan-500/20'
                : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200'
            }`}
          >
            VM Instances
          </button>
          <button
            onClick={() => setActiveTab('TERMINAL')}
            className={`px-4 py-2 rounded-xl transition-all ${
              activeTab === 'TERMINAL'
                ? 'bg-cyan-500 text-zinc-950 font-bold shadow-md shadow-cyan-500/20'
                : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Web Terminal
          </button>
        </div>
      </div>

      {activeTab === 'VMS' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* VM Cards List */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 font-mono">
              Virtual Machines Inventory
            </h3>
            {vms.map((vm) => {
              const isSelected = vm.id === selectedVmId;
              return (
                <div
                  key={vm.id}
                  onClick={() => { sounds.playClick(); setSelectedVmId(vm.id); }}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all space-y-3 ${
                    isSelected
                      ? 'bg-zinc-900 border-cyan-500/50 shadow-lg shadow-cyan-950/40'
                      : 'bg-[#0b0e14] border-zinc-800 hover:border-zinc-700'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-zinc-100 font-mono">{vm.name}</h4>
                      <p className="text-[11px] text-zinc-400">{vm.os}</p>
                    </div>
                    <span
                      className={`text-[9px] font-mono px-2 py-0.5 rounded font-bold ${
                        vm.status === 'RUNNING'
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                          : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
                      }`}
                    >
                      {vm.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-[10px] font-mono text-zinc-400 pt-2 border-t border-zinc-800/60">
                    <div>CPU: {vm.cpuAllocation} Cores</div>
                    <div>RAM: {vm.ramMb / 1024} GB</div>
                    <div>DISK: {vm.diskGb} GB</div>
                  </div>

                  <div className="text-[10px] font-mono text-cyan-400 flex items-center justify-between">
                    <span>IP: {vm.ip}</span>
                    <span>{vm.snapshotsCount} Snapshots</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Selected VM Inspector & Action Deck */}
          <div className="lg:col-span-2 rounded-2xl bg-[#0b0e14] border border-zinc-800 p-6 space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-zinc-100 font-mono">{selectedVm.name}</h3>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300">
                      {selectedVm.ip}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 mt-1">{selectedVm.purpose}</p>
                </div>

                <div className="flex items-center gap-2">
                  {selectedVm.status === 'RUNNING' ? (
                    <button
                      onClick={() => onToggleVmState(selectedVm.id, 'STOP')}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-950/60 hover:bg-red-900 border border-red-700/60 text-red-300 text-xs font-mono"
                    >
                      <Square className="w-3.5 h-3.5" />
                      <span>Stop VM</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => onToggleVmState(selectedVm.id, 'START')}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs font-mono"
                    >
                      <Play className="w-3.5 h-3.5" />
                      <span>Start VM</span>
                    </button>
                  )}

                  <button
                    onClick={() => onToggleVmState(selectedVm.id, 'RESTART')}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-mono"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Restart</span>
                  </button>
                </div>
              </div>

              {/* Resource Allocation Breakdown */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-1">
                  <div className="text-[10px] font-mono text-zinc-500 uppercase flex items-center justify-between">
                    <span>Assigned vCPUs</span>
                    <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                  </div>
                  <div className="text-base font-bold text-zinc-100 font-mono">
                    {selectedVm.cpuAllocation} Core Allocation
                  </div>
                  <div className="text-[10px] text-zinc-400">VT-x / AMD-V Nested Paging</div>
                </div>

                <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-1">
                  <div className="text-[10px] font-mono text-zinc-500 uppercase flex items-center justify-between">
                    <span>Base Memory</span>
                    <Activity className="w-3.5 h-3.5 text-blue-400" />
                  </div>
                  <div className="text-base font-bold text-zinc-100 font-mono">
                    {selectedVm.ramMb / 1024} GB DDR5
                  </div>
                  <div className="text-[10px] text-zinc-400">Dedicated pinned RAM</div>
                </div>

                <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-1">
                  <div className="text-[10px] font-mono text-zinc-500 uppercase flex items-center justify-between">
                    <span>Virtual Disk (VDI)</span>
                    <HardDrive className="w-3.5 h-3.5 text-purple-400" />
                  </div>
                  <div className="text-base font-bold text-zinc-100 font-mono">
                    {selectedVm.diskGb} GB Dynamic
                  </div>
                  <div className="text-[10px] text-zinc-400">NVMe High IOPS Storage</div>
                </div>
              </div>

              {/* Snapshot Controls */}
              <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-zinc-300 font-mono flex items-center gap-1.5">
                    <Camera className="w-3.5 h-3.5 text-cyan-400" />
                    DISASTER RECOVERY & SNAPSHOTS
                  </span>
                  <span className="text-[10px] font-mono text-zinc-500">{selectedVm.snapshotsCount} Snapshots Saved</span>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => onToggleVmState(selectedVm.id, 'SNAPSHOT')}
                    className="px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-xs font-mono text-zinc-300 flex items-center gap-1.5"
                  >
                    <Camera className="w-3 h-3 text-cyan-400" />
                    <span>Create Snapshot Now</span>
                  </button>

                  <button
                    onClick={() => alert(`Restored baseline snapshot for ${selectedVm.name}. State verified clean.`)}
                    className="px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-xs font-mono text-zinc-300 flex items-center gap-1.5"
                  >
                    <History className="w-3 h-3 text-emerald-400" />
                    <span>Revert to Clean Baseline</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-zinc-800/80 flex items-center justify-between text-xs font-mono text-zinc-500">
              <span>HYPERVISOR: Oracle VirtualBox 7.1 / VBoxManage API</span>
              <button
                onClick={() => onOpenConsole(selectedVm)}
                className="flex items-center gap-1.5 text-cyan-400 hover:text-cyan-300 font-bold"
              >
                <Terminal className="w-3.5 h-3.5" />
                <span>Launch Direct Console</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Embedded Terminal Tab */}
      {activeTab === 'TERMINAL' && (
        <div className="rounded-2xl bg-black border border-zinc-800 p-5 space-y-4 shadow-2xl font-mono text-xs">
          <div className="flex items-center justify-between border-b border-zinc-900 pb-2 text-zinc-400">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-emerald-400" />
              <span>NEXUS LINUX SECURE SHELL [HOST: 192.168.56.101]</span>
            </div>
            <span className="text-[10px] text-zinc-500">SANDBOX BOUNDED • RISKY OPS GATED</span>
          </div>

          <div className="min-h-[300px] max-h-[450px] overflow-y-auto space-y-1 text-zinc-300 leading-relaxed">
            {terminalLogs.map((line, i) => (
              <div key={i} className={line.startsWith('COMMAND BLOCKED') ? 'text-red-400' : line.startsWith('musfiq@') ? 'text-cyan-300 font-semibold' : 'text-zinc-300 whitespace-pre-wrap'}>
                {line}
              </div>
            ))}
          </div>

          <form onSubmit={handleCommandSubmit} className="flex items-center gap-2 pt-2 border-t border-zinc-900">
            <span className="text-emerald-400 font-semibold">musfiq@ubuntu-devbox:~$</span>
            <input
              type="text"
              value={commandInput}
              onChange={(e) => setCommandInput(e.target.value)}
              placeholder="type safe command (e.g. uptime, docker ps, uname -a)..."
              className="flex-1 bg-transparent text-zinc-100 focus:outline-none text-xs font-mono"
            />
          </form>
        </div>
      )}
    </div>
  );
};
