import React, { useState } from 'react';
import {
  Shield,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  Lock,
  Terminal,
  Activity,
  CheckCircle2,
  ExternalLink,
  Plus,
  RefreshCw,
} from 'lucide-react';
import { SecurityAsset } from '../../types/nexus';
import { sounds } from '../../utils/audio';

interface SecurityViewProps {
  assets: SecurityAsset[];
  onTriggerScan: (assetId: string) => void;
}

export const SecurityView: React.FC<SecurityViewProps> = ({ assets, onTriggerScan }) => {
  const [selectedAssetId, setSelectedAssetId] = useState<string>(assets[0]?.id || '');
  const [activeTab, setActiveTab] = useState<'ASSETS' | 'VULNERABILITIES' | 'LABS' | 'INCIDENTS'>('ASSETS');

  const selectedAsset = assets.find((a) => a.id === selectedAssetId) || assets[0];

  const vulnerabilities = [
    { id: 'VULN-2026-001', target: 'Private Kali VM Lab', severity: 'MEDIUM', title: 'Open SSH Default Port with Password Auth', status: 'MITIGATING' },
    { id: 'VULN-2026-002', target: 'Production VPS Singapore', severity: 'LOW', title: 'TLS 1.2 Cipher Suite Deprecation Advisory', status: 'PATCHED' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-[#0b0e14] border border-cyan-500/30 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-zinc-100 font-mono">
                Cyber / Defensive Security Operations
              </h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                DEFENSIVE ENCLAVE
              </span>
            </div>
            <p className="text-xs text-zinc-400 font-mono mt-0.5">
              Strict boundary enforcement between Authorized Labs, Owned Assets, and Unknown Targets
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="px-3 py-1.5 rounded-xl bg-zinc-950 border border-zinc-800 text-emerald-400 flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5" />
            <span>Outbound Probes Gated</span>
          </span>
        </div>
      </div>

      {/* Critical Authorization Banner */}
      <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 text-xs font-mono space-y-1">
        <div className="text-zinc-300 font-bold uppercase tracking-wider flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-cyan-400" />
          <span>NEXUS Strict Engagement Boundary Rule:</span>
        </div>
        <p className="text-zinc-400 font-sans leading-relaxed text-[11px]">
          Automated scans and penetration payloads are strictly blocked on UNKNOWN_TARGET endpoints. Only designated TryHackMe, Hack The Box, and private lab VMs receive diagnostic sweeps.
        </p>
      </div>

      {/* Grid: Assets & Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Assets List */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 font-mono">
            Security Target Registry
          </h3>
          {assets.map((asset) => {
            const isSelected = asset.id === selectedAssetId;
            return (
              <div
                key={asset.id}
                onClick={() => { sounds.playClick(); setSelectedAssetId(asset.id); }}
                className={`p-4 rounded-xl border cursor-pointer transition-all space-y-2 ${
                  isSelected
                    ? 'bg-zinc-900 border-cyan-500/50 shadow-md shadow-cyan-950/30'
                    : 'bg-[#0b0e14] border-zinc-800 hover:border-zinc-700'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-zinc-100 font-mono">{asset.name}</h4>
                    <p className="text-[10px] text-zinc-500 font-mono mt-0.5">{asset.ipOrDomain}</p>
                  </div>
                  <span
                    className={`text-[9px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                      asset.type === 'AUTHORIZED_LAB'
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                        : asset.type === 'AUTHORIZED_ASSET'
                        ? 'bg-blue-950 text-blue-400 border border-blue-800'
                        : 'bg-red-950 text-red-400 border border-red-800'
                    }`}
                  >
                    {asset.type.replace('_', ' ')}
                  </span>
                </div>

                <div className="text-[10px] font-mono text-zinc-400 flex items-center justify-between pt-1 border-t border-zinc-900">
                  <span>Platform: {asset.platform}</span>
                  <span className="text-zinc-500">{asset.lastAudit}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Asset Inspector */}
        <div className="lg:col-span-2 rounded-2xl bg-[#0b0e14] border border-zinc-800 p-6 space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-zinc-100 font-mono">{selectedAsset.name}</h3>
                  <span
                    className={`text-[9px] font-mono px-2 py-0.5 rounded font-bold ${
                      selectedAsset.type === 'UNKNOWN_TARGET'
                        ? 'bg-red-950 text-red-400 border border-red-800'
                        : 'bg-emerald-950 text-emerald-300'
                    }`}
                  >
                    {selectedAsset.type}
                  </span>
                </div>
                <div className="text-xs text-zinc-400 font-mono mt-0.5">
                  IP / Host: <strong className="text-cyan-300">{selectedAsset.ipOrDomain}</strong>
                </div>
              </div>

              {selectedAsset.type !== 'UNKNOWN_TARGET' && (
                <button
                  onClick={() => {
                    sounds.playClick();
                    onTriggerScan(selectedAsset.id);
                  }}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-bold text-xs font-mono transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Run Audit Scan</span>
                </button>
              )}
            </div>

            <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-300 leading-relaxed font-sans space-y-2">
              <div className="text-xs font-mono font-semibold text-zinc-400 uppercase">Audit Assessment Notes:</div>
              <p>{selectedAsset.notes}</p>
            </div>

            {/* Vulnerability items */}
            <div className="space-y-2">
              <div className="text-xs font-bold uppercase tracking-wider text-zinc-400 font-mono">
                Active Vulnerability Records:
              </div>
              <div className="divide-y divide-zinc-900 border border-zinc-800 rounded-xl overflow-hidden bg-zinc-950 text-xs font-mono">
                {vulnerabilities.map((v) => (
                  <div key={v.id} className="p-3 flex items-center justify-between">
                    <div>
                      <div className="text-zinc-200 font-semibold flex items-center gap-2">
                        <span className="text-amber-400 font-bold">[{v.severity}]</span>
                        <span>{v.title}</span>
                      </div>
                      <div className="text-[10px] text-zinc-500 mt-0.5">{v.id} • Target: {v.target}</div>
                    </div>
                    <span className="text-[9px] px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-300">
                      {v.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-zinc-800/80 text-[11px] font-mono text-zinc-500 flex items-center justify-between">
            <span>ENGAGEMENT MODE: PASSIVE AUDIT & DEFENSIVE SANDBOXING</span>
            <span className="text-emerald-400">COMPLIANCE: VERIFIED</span>
          </div>
        </div>
      </div>
    </div>
  );
};
