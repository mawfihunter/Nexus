import React from 'react';
import { ShieldAlert, Check, X, AlertTriangle, ArrowRight, FileCode, Clock, Server } from 'lucide-react';
import { ActionApproval } from '../types/nexus';
import { sounds } from '../utils/audio';

interface ApprovalsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  approvals: ActionApproval[];
  onResolve: (id: string, status: 'APPROVED' | 'DENIED') => void;
}

export const ApprovalsDrawer: React.FC<ApprovalsDrawerProps> = ({
  isOpen,
  onClose,
  approvals,
  onResolve,
}) => {
  if (!isOpen) return null;

  const pendingApprovals = approvals.filter((a) => a.status === 'PENDING');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#0c0f16] border-l border-zinc-800 w-full max-w-xl h-full shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-900/50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-zinc-100 uppercase tracking-wide flex items-center gap-2">
                NEXUS Human-In-The-Loop Approvals
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-950 text-amber-300 border border-amber-800">
                  {pendingApprovals.length} PENDING
                </span>
              </h2>
              <p className="text-xs text-zinc-400">
                Privileged and destructive actions must receive operator authorization
              </p>
            </div>
          </div>
          <button
            onClick={() => { sounds.playClick(); onClose(); }}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content list */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {pendingApprovals.length > 0 ? (
            pendingApprovals.map((appr) => (
              <div
                key={appr.id}
                className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 hover:border-zinc-700 transition-all space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span
                      className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded uppercase ${
                        appr.riskLevel === 'CRITICAL'
                          ? 'bg-red-950 text-red-400 border border-red-800'
                          : appr.riskLevel === 'HIGH'
                          ? 'bg-amber-950 text-amber-400 border border-amber-800'
                          : 'bg-blue-950 text-blue-400 border border-blue-800'
                      }`}
                    >
                      RISK LEVEL: {appr.riskLevel}
                    </span>
                    <h3 className="text-sm font-semibold text-zinc-100 mt-1">{appr.actionTitle}</h3>
                  </div>
                  <span className="text-[10px] font-mono text-zinc-500 flex items-center gap-1 shrink-0">
                    <Clock className="w-3 h-3" />
                    {appr.timestamp}
                  </span>
                </div>

                {appr.protocol ? (
                  <div className="p-3 rounded-lg bg-zinc-900/70 border border-amber-500/40 text-[11px] font-mono space-y-1 text-zinc-300">
                    <div><span className="text-zinc-500">REASON:</span> {appr.protocol.reason}</div>
                    <div><span className="text-zinc-500">ACTION:</span> <span className="text-cyan-300">{appr.protocol.action}</span></div>
                    <div><span className="text-zinc-500">EFFECT:</span> {appr.protocol.effect}</div>
                    <div className="text-emerald-400 font-bold pt-0.5">{appr.protocol.requestText}</div>
                  </div>
                ) : (
                  <div className="text-xs text-zinc-300 leading-relaxed font-sans bg-zinc-900/50 p-2.5 rounded-lg border border-zinc-800/80">
                    {appr.details}
                  </div>
                )}

                {appr.diffOrPayload && (
                  <div className="p-2.5 rounded-lg bg-black/60 border border-zinc-800 text-[11px] font-mono text-cyan-300 overflow-x-auto">
                    <div className="text-[9px] uppercase tracking-wider text-zinc-500 mb-1 flex items-center gap-1">
                      <FileCode className="w-3 h-3 text-cyan-400" />
                      Payload Execution Command / Diff:
                    </div>
                    <code>{appr.diffOrPayload}</code>
                  </div>
                )}

                <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400 pt-1">
                  <span>Actor: <strong className="text-zinc-200">{appr.actor}</strong></span>
                  <span>Target: <strong className="text-cyan-400">{appr.service}</strong></span>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-2 pt-2 border-t border-zinc-900">
                  <button
                    onClick={() => {
                      sounds.playClick();
                      onResolve(appr.id, 'DENIED');
                    }}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-red-950/60 text-zinc-300 hover:text-red-300 border border-zinc-800 hover:border-red-800/60 text-xs transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Deny Action</span>
                  </button>

                  <button
                    onClick={() => {
                      sounds.playExecute();
                      onResolve(appr.id, 'APPROVED');
                    }}
                    className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-md shadow-emerald-950 transition-colors"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Approve & Execute</span>
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-zinc-500 space-y-2">
              <Check className="w-10 h-10 text-emerald-400 mx-auto" />
              <div className="text-sm text-zinc-300 font-medium">All Approvals Clear</div>
              <div className="text-xs text-zinc-500">
                No high-risk actions pending operator signature.
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-zinc-800 bg-zinc-900/40 text-[11px] font-mono text-zinc-500 text-center">
          Approvals are written into immutable audit records with cryptographic timestamps.
        </div>
      </div>
    </div>
  );
};
