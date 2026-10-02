import React, { useState } from 'react';
import {
  Cpu,
  Activity,
  HardDrive,
  ShieldCheck,
  ToggleLeft,
  ToggleRight,
  RefreshCw,
  Terminal,
  Folder,
  Layers,
  Sliders,
  AlertTriangle,
  Play,
  RotateCcw,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import { LocalAgentStatus, AgentCapability } from '../../types/nexus';
import { sounds } from '../../utils/audio';

interface LocalPcViewProps {
  localAgent: LocalAgentStatus;
  onToggleCapability: (cap: AgentCapability) => void;
  onTriggerDiagnostic: () => void;
  isDiagnosing: boolean;
}

export const LocalPcView: React.FC<LocalPcViewProps> = ({
  localAgent,
  onToggleCapability,
  onTriggerDiagnostic,
  isDiagnosing,
}) => {
  const [activeTab, setActiveTab] = useState<'METRICS' | 'CAPABILITIES' | 'PROCESSES' | 'SERVICES' | 'HARDWARE_CONFIG'>('METRICS');
  const [runningServices, setRunningServices] = useState([
    { name: 'nexus-local-agent.service', status: 'ACTIVE', pid: 1042, port: 'Outbound Tunnel', cpu: '0.4%' },
    { name: 'code-server@musfiq.service', status: 'ACTIVE', pid: 2198, port: '127.0.0.1:8080', cpu: '1.2%' },
    { name: 'vboxwebsrv.service', status: 'ACTIVE', pid: 3412, port: '127.0.0.1:18083', cpu: '0.1%' },
    { name: 'docker.service', status: 'ACTIVE', pid: 4892, port: 'unix:///var/run/docker.sock', cpu: '2.4%' },
    { name: 'tailscaled.service', status: 'ACTIVE', pid: 890, port: 'WireGuard Tunnel', cpu: '0.2%' },
  ]);

  const [processes, setProcesses] = useState([
    { pid: 14892, name: 'VirtualBoxVM (Ubuntu-DevBox)', mem: '4.1 GB', cpu: '8.4%', user: 'musfiq' },
    { pid: 19821, name: 'code-server (Node.js Workspace)', mem: '920 MB', cpu: '3.1%', user: 'musfiq' },
    { pid: 24109, name: 'chrome-headless (Browser Agent)', mem: '780 MB', cpu: '1.8%', user: 'nexus-agent' },
    { pid: 31092, name: 'docker-proxy (Postgres Container)', mem: '450 MB', cpu: '0.9%', user: 'root' },
    { pid: 33412, name: 'ollama-inference-daemon', mem: '2.8 GB', cpu: '4.2%', user: 'musfiq' },
  ]);

  // Hardware Config System (dynamic hardware configuration)
  const [isEditingHardware, setIsEditingHardware] = useState(false);
  const [hwConfig, setHwConfig] = useState({
    cpuName: localAgent.hardware.cpu,
    cores: localAgent.hardware.cpuCores,
    ramType: localAgent.hardware.ramType,
    ramGb: localAgent.hardware.ramTotalGb,
    storageTb: localAgent.hardware.storageTotalTb,
  });

  const capabilitiesList: { key: AgentCapability; title: string; description: string; risk: string }[] = [
    { key: 'FILES_READ', title: 'File System (Read Only)', description: 'Allow read access to approved workspace directories', risk: 'SAFE' },
    { key: 'FILES_WRITE', title: 'File System (Write)', description: 'Allow writing code, assets, and project files', risk: 'MEDIUM' },
    { key: 'PROCESS_READ', title: 'Process Monitoring', description: 'Query running processes and resource utilization', risk: 'SAFE' },
    { key: 'PROCESS_CONTROL', title: 'Process Lifecycle', description: 'Start, stop, or restart approved background services', risk: 'HIGH' },
    { key: 'TERMINAL_EXECUTION', title: 'Approved Shell Commands', description: 'Execute bounded scripts inside designated sandbox', risk: 'HIGH' },
    { key: 'VIRTUALBOX_CONTROL', title: 'VirtualBox Hypervisor', description: 'Boot, pause, snapshot and restore virtual machines', risk: 'HIGH' },
    { key: 'DOCKER_CONTROL', title: 'Docker Daemon Control', description: 'Manage local development containers and compose files', risk: 'MEDIUM' },
    { key: 'VS_CODE_CONTROL', title: 'VS Code / code-server Bridge', description: 'Open files, launch editor workspaces, manage extensions', risk: 'SAFE' },
    { key: 'BROWSER_CONTROL', title: 'Headless Browser Automation', description: 'Control isolated browser instances for web tasks', risk: 'MEDIUM' },
  ];

  const handleServiceRestart = (serviceName: string) => {
    sounds.playExecute();
    alert(`Service "${serviceName}" gracefully restarted via authenticated NEXUS Local Agent.`);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-[#0b0e14] border border-cyan-500/30 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
            <Cpu className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-zinc-100 font-mono">
                {localAgent.deviceName}
              </h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                CONNECTED
              </span>
            </div>
            <p className="text-xs text-zinc-400 font-mono mt-0.5">
              Zero-Trust Outbound Pipe • Token Fingerprint: <span className="text-cyan-300">{localAgent.tokenFingerprint}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => { sounds.playClick(); onTriggerDiagnostic(); }}
            disabled={isDiagnosing}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-zinc-950 text-xs font-bold font-mono transition-colors shadow-lg shadow-cyan-500/20"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isDiagnosing ? 'animate-spin' : ''}`} />
            <span>{isDiagnosing ? 'Running Diagnostics...' : 'Run Diagnostics'}</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-zinc-800 pb-2 overflow-x-auto text-xs font-mono">
        {[
          { id: 'METRICS', label: 'LIVE TELEMETRY' },
          { id: 'CAPABILITIES', label: 'CAPABILITY MATRIX (9)' },
          { id: 'SERVICES', label: 'SYSTEM SERVICES' },
          { id: 'PROCESSES', label: 'PROCESS TREE' },
          { id: 'HARDWARE_CONFIG', label: 'HARDWARE PROFILE CONFIG' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => { sounds.playClick(); setActiveTab(tab.id as any); }}
            className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/40 font-semibold'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {activeTab === 'METRICS' && (
        <div className="space-y-6">
          {/* Hardware Specs Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-[#0b0e14] border border-zinc-800 space-y-3">
              <div className="flex items-center justify-between text-zinc-400 text-xs font-mono">
                <span className="flex items-center gap-1.5 text-cyan-400">
                  <Cpu className="w-4 h-4" />
                  CPU UTILIZATION
                </span>
                <span>{localAgent.hardware.cpuUsagePercent}%</span>
              </div>
              <div className="text-xl font-bold font-mono text-zinc-100">
                {localAgent.hardware.cpu}
              </div>
              <div className="w-full bg-zinc-900 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-cyan-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${localAgent.hardware.cpuUsagePercent}%` }}
                />
              </div>
              <div className="text-[11px] font-mono text-zinc-500 flex justify-between">
                <span>Temperature: {localAgent.hardware.tempCelsius}°C</span>
                <span>16 Cores / 22 Threads</span>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-[#0b0e14] border border-zinc-800 space-y-3">
              <div className="flex items-center justify-between text-zinc-400 text-xs font-mono">
                <span className="flex items-center gap-1.5 text-blue-400">
                  <Activity className="w-4 h-4" />
                  DDR5 HIGH-SPEED MEMORY
                </span>
                <span>{Math.round((localAgent.hardware.ramUsedGb / localAgent.hardware.ramTotalGb) * 100)}%</span>
              </div>
              <div className="text-xl font-bold font-mono text-zinc-100">
                {localAgent.hardware.ramUsedGb} GB / {localAgent.hardware.ramTotalGb} GB
              </div>
              <div className="w-full bg-zinc-900 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-blue-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${(localAgent.hardware.ramUsedGb / localAgent.hardware.ramTotalGb) * 100}%` }}
                />
              </div>
              <div className="text-[11px] font-mono text-zinc-500 flex justify-between">
                <span>Type: {localAgent.hardware.ramType}</span>
                <span>6.6 GB Available</span>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-[#0b0e14] border border-zinc-800 space-y-3">
              <div className="flex items-center justify-between text-zinc-400 text-xs font-mono">
                <span className="flex items-center gap-1.5 text-purple-400">
                  <HardDrive className="w-4 h-4" />
                  NVMe PRIMARY STORAGE
                </span>
                <span>{Math.round((localAgent.hardware.storageUsedTb / localAgent.hardware.storageTotalTb) * 100)}%</span>
              </div>
              <div className="text-xl font-bold font-mono text-zinc-100">
                {localAgent.hardware.storageUsedTb} TB / {localAgent.hardware.storageTotalTb} TB
              </div>
              <div className="w-full bg-zinc-900 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-purple-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${(localAgent.hardware.storageUsedTb / localAgent.hardware.storageTotalTb) * 100}%` }}
                />
              </div>
              <div className="text-[11px] font-mono text-zinc-500 flex justify-between">
                <span>NVMe PCIe 4.0 x4</span>
                <span>2.18 TB Remaining</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="p-5 rounded-2xl bg-[#0b0e14] border border-zinc-800 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-300 font-mono">
              Authorized Local Node Operations
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <button
                onClick={() => { sounds.playClick(); alert('Launched local VS Code workspace on Musfiq-PC.'); }}
                className="p-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-left text-xs font-mono space-y-1 transition-colors"
              >
                <div className="text-cyan-400 font-semibold flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5" />
                  Open VS Code
                </div>
                <div className="text-[10px] text-zinc-500">Launch code-server</div>
              </button>

              <button
                onClick={() => { sounds.playClick(); alert('VirtualBox host hypervisor console brought to foreground.'); }}
                className="p-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-left text-xs font-mono space-y-1 transition-colors"
              >
                <div className="text-emerald-400 font-semibold flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5" />
                  Open VirtualBox
                </div>
                <div className="text-[10px] text-zinc-500">VM Hypervisor</div>
              </button>

              <button
                onClick={() => { sounds.playClick(); alert('Opened project folder /home/musfiq/nexus-workspace on local computer.'); }}
                className="p-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-left text-xs font-mono space-y-1 transition-colors"
              >
                <div className="text-purple-400 font-semibold flex items-center gap-1.5">
                  <Folder className="w-3.5 h-3.5" />
                  Open Local Folder
                </div>
                <div className="text-[10px] text-zinc-500">Workspace storage</div>
              </button>

              <button
                onClick={() => { sounds.playClick(); onTriggerDiagnostic(); }}
                className="p-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-left text-xs font-mono space-y-1 transition-colors"
              >
                <div className="text-amber-400 font-semibold flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Run Self-Health
                </div>
                <div className="text-[10px] text-zinc-500">Node verification</div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Capabilities Tab */}
      {activeTab === 'CAPABILITIES' && (
        <div className="p-6 rounded-2xl bg-[#0b0e14] border border-zinc-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-zinc-100 uppercase tracking-wider font-mono">
                Capability-Based Granular Permissions
              </h3>
              <p className="text-xs text-zinc-400 mt-0.5">
                Every privileged action is gated. Disabled permissions cannot be invoked by any AI agent or remote instruction.
              </p>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
              ZERO-TRUST ARCHITECTURE
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
            {capabilitiesList.map((cap) => {
              const isEnabled = localAgent.capabilities[cap.key];
              return (
                <div
                  key={cap.key}
                  className="p-4 rounded-xl bg-zinc-950 border border-zinc-800/80 flex items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-zinc-200 font-mono">{cap.title}</span>
                      <span
                        className={`text-[9px] font-mono px-1.5 py-0.2 rounded font-bold ${
                          cap.risk === 'SAFE'
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                            : cap.risk === 'MEDIUM'
                            ? 'bg-amber-950 text-amber-400 border border-amber-800'
                            : 'bg-red-950 text-red-400 border border-red-800'
                        }`}
                      >
                        {cap.risk}
                      </span>
                    </div>
                    <div className="text-[11px] text-zinc-500">{cap.description}</div>
                    <div className="text-[10px] font-mono text-zinc-600">FLAG: {cap.key}</div>
                  </div>

                  <button
                    onClick={() => { sounds.playClick(); onToggleCapability(cap.key); }}
                    className="p-1 text-zinc-400 hover:text-white transition-colors shrink-0"
                  >
                    {isEnabled ? (
                      <ToggleRight className="w-8 h-8 text-cyan-400" />
                    ) : (
                      <ToggleLeft className="w-8 h-8 text-zinc-600" />
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Services Tab */}
      {activeTab === 'SERVICES' && (
        <div className="p-6 rounded-2xl bg-[#0b0e14] border border-zinc-800 space-y-4">
          <h3 className="text-sm font-bold text-zinc-100 uppercase tracking-wider font-mono">
            Active Background Services (Musfiq-PC)
          </h3>
          <div className="divide-y divide-zinc-900 border border-zinc-800 rounded-xl overflow-hidden bg-zinc-950">
            {runningServices.map((svc) => (
              <div key={svc.name} className="p-4 flex items-center justify-between text-xs font-mono">
                <div>
                  <div className="font-semibold text-zinc-200 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                    <span>{svc.name}</span>
                  </div>
                  <div className="text-[11px] text-zinc-500 mt-0.5">
                    PID: {svc.pid} • Binding: {svc.port} • CPU: {svc.cpu}
                  </div>
                </div>
                <button
                  onClick={() => handleServiceRestart(svc.name)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-300 text-xs"
                >
                  <RotateCcw className="w-3 h-3 text-cyan-400" />
                  <span>Restart Service</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Processes Tab */}
      {activeTab === 'PROCESSES' && (
        <div className="p-6 rounded-2xl bg-[#0b0e14] border border-zinc-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-zinc-100 uppercase tracking-wider font-mono">
              Top Running Compute Processes
            </h3>
            <span className="text-[10px] font-mono text-zinc-500">REFRESHING LIVE</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-zinc-800 text-zinc-500 text-[10px] uppercase">
                  <th className="pb-2">PID</th>
                  <th className="pb-2">Process Name</th>
                  <th className="pb-2">Memory</th>
                  <th className="pb-2">CPU</th>
                  <th className="pb-2">User</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-900">
                {processes.map((proc) => (
                  <tr key={proc.pid} className="hover:bg-zinc-900/40">
                    <td className="py-2.5 text-cyan-400">{proc.pid}</td>
                    <td className="py-2.5 text-zinc-200 font-semibold">{proc.name}</td>
                    <td className="py-2.5 text-zinc-400">{proc.mem}</td>
                    <td className="py-2.5 text-emerald-400">{proc.cpu}</td>
                    <td className="py-2.5 text-zinc-500">{proc.user}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Hardware Profile Config Tab */}
      {activeTab === 'HARDWARE_CONFIG' && (
        <div className="p-6 rounded-2xl bg-[#0b0e14] border border-zinc-800 space-y-4">
          <div>
            <h3 className="text-sm font-bold text-zinc-100 uppercase tracking-wider font-mono">
              Hardware & Compute Node Profile Config
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              The primary compute node hardware is fully configurable. Update your specs if you upgrade your CPU, memory, or storage.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
            <div className="space-y-1.5">
              <label className="text-zinc-400">CPU Description:</label>
              <input
                type="text"
                value={hwConfig.cpuName}
                onChange={(e) => setHwConfig({ ...hwConfig, cpuName: e.target.value })}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-zinc-100 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-zinc-400">CPU Physical & Logical Cores:</label>
              <input
                type="number"
                value={hwConfig.cores}
                onChange={(e) => setHwConfig({ ...hwConfig, cores: parseInt(e.target.value) || 16 })}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-zinc-100 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-zinc-400">RAM Type & Speed:</label>
              <input
                type="text"
                value={hwConfig.ramType}
                onChange={(e) => setHwConfig({ ...hwConfig, ramType: e.target.value })}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-zinc-100 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-zinc-400">Total Installed RAM (GB):</label>
              <input
                type="number"
                value={hwConfig.ramGb}
                onChange={(e) => setHwConfig({ ...hwConfig, ramGb: parseInt(e.target.value) || 16 })}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-zinc-100 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-zinc-400">Total High-Speed Storage Capacity (TB):</label>
              <input
                type="number"
                step="0.5"
                value={hwConfig.storageTb}
                onChange={(e) => setHwConfig({ ...hwConfig, storageTb: parseFloat(e.target.value) || 4.0 })}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-zinc-100 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              onClick={() => {
                sounds.playExecute();
                alert('Hardware profile configuration updated successfully.');
              }}
              className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-zinc-950 text-xs font-bold font-mono transition-colors"
            >
              Save Hardware Profile
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
