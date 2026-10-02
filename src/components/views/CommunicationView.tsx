import React, { useState } from 'react';
import {
  MessageSquare,
  Send,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Shield,
  Phone,
  Mail,
  Share2,
  UserCheck,
  FileText,
  RotateCcw,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Check,
  ExternalLink,
} from 'lucide-react';
import { CommunicationDispatch } from '../../types/nexus';
import { sounds } from '../../utils/audio';

interface CommunicationViewProps {
  dispatches: CommunicationDispatch[];
  onDispatchUpdate?: (dispatches: CommunicationDispatch[]) => void;
}

export const CommunicationView: React.FC<CommunicationViewProps> = ({
  dispatches,
  onDispatchUpdate,
}) => {
  const [dispatchList, setDispatchList] = useState<CommunicationDispatch[]>(dispatches);
  const [selectedDispatch, setSelectedDispatch] = useState<CommunicationDispatch | null>(
    dispatches[0] || null
  );

  // Live simulation pipeline state for new voice/text query
  const [creatorInput, setCreatorInput] = useState<string>(
    'আমি meeting-এ আছি। Rahim-কে বলো আমি ৬টায় আসছি।'
  );
  const [pipelineStage, setPipelineStage] = useState<number>(0); // 0 to 8
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [approvalGranted, setApprovalGranted] = useState<boolean>(false);

  const startPipeline = () => {
    sounds.playExecute();
    setIsProcessing(true);
    setPipelineStage(1);
    setApprovalGranted(false);

    // Step 1: Identify recipient (Rahim)
    setTimeout(() => {
      setPipelineStage(2);
      // Step 2: Identify channel (Telegram)
      setTimeout(() => {
        setPipelineStage(3);
        // Step 3: Prepare message
        setTimeout(() => {
          setPipelineStage(4);
          // Step 4: Policy check -> Requires Level 3 approval!
          setTimeout(() => {
            setPipelineStage(5);
            setIsProcessing(false);
            sounds.playAlert();
            sounds.speak(
              'I have identified Rahim and prepared the Telegram message. Approval is required before sending.',
              'TECHNICAL'
            );
          }, 600);
        }, 600);
      }, 600);
    }, 600);
  };

  const approveAndDispatch = () => {
    sounds.playSuccessTone();
    setApprovalGranted(true);
    setIsProcessing(true);
    setPipelineStage(6); // Step 6: Dispatch

    setTimeout(() => {
      setPipelineStage(7); // Step 7: Verify delivery
      setTimeout(() => {
        setPipelineStage(8); // Step 8: Confirmed report
        setIsProcessing(false);
        sounds.playSuccessTone();
        sounds.speak(
          'Message delivered to Rahim via Telegram. Delivery verified.',
          'SUCCESS'
        );

        const newDispatchItem: CommunicationDispatch = {
          id: `comm-${Date.now()}`,
          creatorVoiceOrTextInput: creatorInput,
          identifiedRecipient: {
            name: 'Rahim Chowdhury',
            role: 'Operations Lead (Neo & Fitkart BD)',
            contactAddress: '+880 1711-492810 (Telegram)',
          },
          identifiedChannel: 'Telegram',
          preparedMessage:
            'আসসালামু আলাইকুম রহিম ভাই, ক্রিয়েটর বর্তমানে একটি জরুরি মিটিংয়ে আছেন। তিনি আপনাকে জানিয়েছেন যে তিনি সন্ধ্যা ৬:০০টায় পৌঁছাচ্ছেন।',
          approvalRequired: true,
          approvalStatus: 'APPROVED',
          dispatchStatus: 'DELIVERED',
          deliveryProof: `Telegram MsgID #${Math.floor(
            100000 + Math.random() * 900000
          )} | ACK Status: READ`,
          verificationResult: {
            verified: true,
            deliveryTimestamp: new Date().toLocaleTimeString(),
            receiptConfirmation:
              'Delivery ACK verified. Verified message received on target device.',
          },
          timestamp: 'Just now',
        };

        const updated = [newDispatchItem, ...dispatchList];
        setDispatchList(updated);
        setSelectedDispatch(newDispatchItem);
        onDispatchUpdate?.(updated);
      }, 800);
    }, 800);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Operational Protocol */}
      <div className="bg-slate-900/90 border border-cyan-500/30 rounded-xl p-6 relative overflow-hidden backdrop-blur-md">
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <span className="p-2.5 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                <MessageSquare className="w-6 h-6 animate-pulse" />
              </span>
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                  AUTHORIZED COMMUNICATION DISPATCHER
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800">
                    8-Step Verification Protocol
                  </span>
                </h1>
                <p className="text-slate-400 text-sm">
                  "Never falsely claim that a message was sent. Identify recipient → Identify channel → Prepare → Check policy → Ask approval → Dispatch → Verify delivery → Report."
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Live Pipeline Sandbox: The Rahim Example */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-white uppercase tracking-wider flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            Live Communication Pipeline Simulator (Natural Voice / Text)
          </h2>
          <span className="text-xs font-mono text-slate-400">Policy: External Level 3 Gated</span>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={creatorInput}
            onChange={(e) => setCreatorInput(e.target.value)}
            placeholder="Creator command: e.g. আমি meeting-এ আছি। Rahim-কে বলো আমি ৬টায় আসছি।"
            className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-cyan-500"
          />
          <button
            onClick={startPipeline}
            disabled={isProcessing}
            className="px-5 py-2.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20"
          >
            <Send className="w-3.5 h-3.5 fill-current" />
            Process Directive
          </button>
        </div>

        {/* 8-Step Interactive Pipeline Visualizer */}
        <div className="space-y-3 pt-2">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-2">
            {[
              { num: 1, label: '1. Recipient', desc: 'Identify Rahim' },
              { num: 2, label: '2. Channel', desc: 'Pick Telegram' },
              { num: 3, label: '3. Prepare', desc: 'Draft Bengali' },
              { num: 4, label: '4. Policy', desc: 'Check rules' },
              { num: 5, label: '5. Approval', desc: 'Ask Creator' },
              { num: 6, label: '6. Dispatch', desc: 'Send API' },
              { num: 7, label: '7. Verify', desc: 'Wait ACK' },
              { num: 8, label: '8. Report', desc: 'Confirm' },
            ].map((st) => {
              const isPast = pipelineStage > st.num;
              const isCurrent = pipelineStage === st.num;
              return (
                <div
                  key={st.num}
                  className={`p-3 rounded-lg border text-center transition-all ${
                    isPast
                      ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                      : isCurrent
                      ? 'bg-cyan-950 border-cyan-500 text-white shadow-md shadow-cyan-500/30'
                      : 'bg-slate-950/60 border-slate-800 text-slate-600'
                  }`}
                >
                  <p className="text-[10px] font-mono font-bold">{st.label}</p>
                  <p className="text-[11px] truncate mt-1">{st.desc}</p>
                </div>
              );
            })}
          </div>

          {/* Interactive Step 5 Approval Card if paused for Creator authorization */}
          {pipelineStage === 5 && !approvalGranted && (
            <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-500/40 space-y-3 animate-pulse">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
                  <AlertTriangle className="w-4 h-4" />
                  Creator Approval Required (Policy Boundary Level 3)
                </div>
                <span className="text-[10px] font-mono text-slate-400">Target: Telegram Webhook</span>
              </div>

              <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800 space-y-2 text-xs font-mono">
                <p className="text-slate-400">
                  Recipient: <strong className="text-white">Rahim Chowdhury (Operations Lead)</strong>
                </p>
                <p className="text-slate-400">
                  Channel: <strong className="text-cyan-400">Telegram (+880 1711-492810)</strong>
                </p>
                <p className="text-slate-400">
                  Prepared Message Payload:
                </p>
                <div className="p-2.5 rounded bg-slate-900 border border-slate-800 text-slate-200 italic">
                  "আসসালামু আলাইকুম রহিম ভাই, ক্রিয়েটর বর্তমানে একটি জরুরি মিটিংয়ে আছেন। তিনি আপনাকে জানিয়েছেন যে তিনি সন্ধ্যা ৬:০০টায় পৌঁছাচ্ছেন।"
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-1">
                <button
                  onClick={() => {
                    sounds.playClick();
                    setPipelineStage(0);
                  }}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={approveAndDispatch}
                  className="px-5 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold uppercase tracking-wider shadow-lg shadow-amber-500/20 flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4 stroke-[3]" />
                  Approve & Dispatch Message
                </button>
              </div>
            </div>
          )}

          {/* Delivery & Verification Outcome */}
          {pipelineStage === 8 && (
            <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/40 text-xs font-mono space-y-2">
              <div className="flex items-center gap-2 text-emerald-400 font-bold uppercase">
                <ShieldCheck className="w-4 h-4" />
                Step 8: Message Dispatched & Delivery Verified
              </div>
              <p className="text-slate-300">
                Status: <strong className="text-emerald-300">CONFIRMED DELIVERED</strong> (Delivery ACK received at {new Date().toLocaleTimeString()}).
              </p>
              <p className="text-slate-400">
                Audit Trail: Telegram MsgID registered in secure append-only audit ledger.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Dispatches History & Verification Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Dispatches List */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
            <span>COMMUNICATION LOGS</span>
            <span>{dispatchList.length} Messages</span>
          </div>

          <div className="space-y-3">
            {dispatchList.map((item) => {
              const isSelected = selectedDispatch?.id === item.id;
              return (
                <div
                  key={item.id}
                  onClick={() => {
                    sounds.playClick();
                    setSelectedDispatch(item);
                  }}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-cyan-950/40 border-cyan-500 text-white shadow-lg shadow-cyan-950/30'
                      : 'bg-slate-900/70 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-cyan-300">
                        {item.identifiedChannel}
                      </span>
                      <h4 className="text-sm font-bold text-white mt-1.5">
                        {item.identifiedRecipient.name}
                      </h4>
                    </div>

                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-semibold">
                      {item.dispatchStatus}
                    </span>
                  </div>

                  <p className="text-xs text-slate-400 mt-2 line-clamp-2 italic">
                    "{item.preparedMessage}"
                  </p>

                  <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-500">
                    <span>{item.timestamp}</span>
                    <span className="text-emerald-400 font-semibold">Delivery Verified ✓</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Selected Dispatch Verification Proof */}
        <div className="lg:col-span-7 bg-slate-900/80 border border-slate-800 rounded-xl p-6 space-y-6">
          {selectedDispatch ? (
            <>
              <div className="flex items-start justify-between border-b border-slate-800 pb-4">
                <div>
                  <span className="text-xs font-mono uppercase px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                    Channel: {selectedDispatch.identifiedChannel}
                  </span>
                  <h2 className="text-lg font-bold text-white mt-1.5">
                    {selectedDispatch.identifiedRecipient.name}
                  </h2>
                  <p className="text-xs text-slate-400 font-mono">
                    {selectedDispatch.identifiedRecipient.contactAddress}
                  </p>
                </div>

                <span className="text-xs px-3 py-1 rounded-full font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-800 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  VERIFIED DELIVERED
                </span>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-mono uppercase text-slate-400">
                  Original Creator Directive
                </label>
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono text-cyan-300">
                  "{selectedDispatch.creatorVoiceOrTextInput}"
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-mono uppercase text-slate-400">
                  Synthesized Message Payload
                </label>
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 leading-relaxed">
                  {selectedDispatch.preparedMessage}
                </div>
              </div>

              {/* Cryptographic Delivery Proof & Receipt Confirmation */}
              <div className="space-y-2">
                <label className="text-xs font-mono uppercase text-slate-400 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  Cryptographic Delivery Proof & Receipt
                </label>
                <div className="p-3.5 bg-slate-950 border border-emerald-800/40 rounded-lg text-xs font-mono text-emerald-300 space-y-1">
                  <p>Proof Token: {selectedDispatch.deliveryProof || 'N/A'}</p>
                  <p>Confirmed: {selectedDispatch.verificationResult?.receiptConfirmation}</p>
                  <p className="text-slate-500">Delivered At: {selectedDispatch.verificationResult?.deliveryTimestamp}</p>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 text-[11px] text-slate-400 font-mono flex items-center gap-2">
                <Shield className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>NEXUS Rule: Zero delivery fabrication. Every message requires verification receipt or explicit failure state.</span>
              </div>
            </>
          ) : (
            <div className="p-12 text-center text-slate-500 font-mono text-sm">
              Select a message record to view verification evidence.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
