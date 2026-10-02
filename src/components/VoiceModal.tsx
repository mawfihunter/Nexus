import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Play, Edit3, X, AlertTriangle, ShieldCheck, Cpu, ArrowRight, Loader2, Sparkles, Volume2 } from 'lucide-react';
import { ActionPlan } from '../types/nexus';
import { sounds } from '../utils/audio';

interface VoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExecutePlan: (plan: ActionPlan) => void;
}

export const VoiceModal: React.FC<VoiceModalProps> = ({ isOpen, onClose, onExecutePlan }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<'bn-BD' | 'en-US'>('bn-BD');
  const [isProcessing, setIsProcessing] = useState(false);
  const [actionPlan, setActionPlan] = useState<ActionPlan | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [recognitionSupported, setRecognitionSupported] = useState(true);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = selectedLanguage;

        recognition.onresult = (event: any) => {
          let current = '';
          for (let i = 0; i < event.results.length; i++) {
            current += event.results[i][0].transcript;
          }
          setTranscript(current);
        };

        recognition.onerror = () => {
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      } else {
        setRecognitionSupported(false);
      }
    }
  }, [selectedLanguage]);

  const toggleListening = () => {
    sounds.playClick();
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      setTranscript('');
      setActionPlan(null);
      try {
        recognitionRef.current?.start();
        setIsListening(true);
      } catch {
        setIsListening(false);
      }
    }
  };

  const handleProcessCommand = async (textToProcess?: string) => {
    const query = textToProcess || transcript;
    if (!query.trim()) return;

    sounds.playClick();
    setIsProcessing(true);
    try {
      const res = await fetch('/api/orchestrator/command', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });
      const data = await res.json();
      setActionPlan(data);
      if (data.explanation) {
        const mode = data.riskLevel === 'HIGH' || data.riskLevel === 'CRITICAL' ? 'TECHNICAL' : 'NORMAL';
        sounds.speak(data.explanation, mode);
      }
    } catch (err) {
      console.error('Failed to parse voice command:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleExecute = () => {
    if (!actionPlan) return;
    sounds.playExecute();
    sounds.speak('Executing approved directive and verifying operational results.', 'SUCCESS');
    onExecutePlan(actionPlan);
    onClose();
  };

  const sampleVoiceCommands = [
    { label: 'Telegram এখানে কাজ করছে না। ঠিক করো।', desc: 'Natural objective in Bangla (Owner command)' },
    { label: 'আমার Linux configure করতে হবে।', desc: 'Infrastructure goal without technical jargon' },
    { label: 'Neo এর আজকের sales দেখাও', desc: 'Bangla sales telemetry query' },
    { label: 'VPS check করে storage বেশি হলে জানাও', desc: 'Banglish server audit threshold' },
    { label: 'Check PC health and CPU thermals', desc: 'English hardware diagnostics' },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-[#0e1117] border border-cyan-500/30 w-full max-w-2xl rounded-2xl shadow-2xl shadow-cyan-950/50 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800/80 bg-zinc-900/40">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Mic className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-zinc-100 flex items-center gap-2">
                NEXUS Voice & Multilingual Command
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-950/60 border border-cyan-700/50 text-cyan-300 font-mono">
                  BN / EN / BANGLISH
                </span>
              </h2>
              <p className="text-xs text-zinc-400">
                Speech-to-Text Pipeline with AI Intent Understanding & Human Confirmation
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

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Language selector & mic trigger */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-[#090b10] border border-zinc-800">
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-zinc-400">INPUT LOCALE:</span>
              <div className="flex rounded-lg bg-zinc-900 p-0.5 border border-zinc-700/60">
                <button
                  onClick={() => setSelectedLanguage('bn-BD')}
                  className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
                    selectedLanguage === 'bn-BD'
                      ? 'bg-cyan-500 text-black font-semibold shadow-sm'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  বাংলা (Bangla)
                </button>
                <button
                  onClick={() => setSelectedLanguage('en-US')}
                  className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
                    selectedLanguage === 'en-US'
                      ? 'bg-cyan-500 text-black font-semibold shadow-sm'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  English (US)
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={toggleListening}
                className={`flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold transition-all ${
                  isListening
                    ? 'bg-red-500 text-white animate-pulse shadow-lg shadow-red-500/30'
                    : 'bg-cyan-500 hover:bg-cyan-400 text-zinc-950 shadow-md shadow-cyan-500/20'
                }`}
              >
                {isListening ? (
                  <>
                    <MicOff className="w-4 h-4" />
                    <span>Listening... (Click to stop)</span>
                  </>
                ) : (
                  <>
                    <Mic className="w-4 h-4" />
                    <span>Start Speaking</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Transcript input / display */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-zinc-400 font-mono">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                RECOGNIZED TRANSCRIPT
              </span>
              {transcript && (
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300"
                >
                  <Edit3 className="w-3 h-3" />
                  <span>{isEditing ? 'Done Editing' : 'Edit Query'}</span>
                </button>
              )}
            </div>

            {isEditing ? (
              <textarea
                value={transcript}
                onChange={(e) => setTranscript(e.target.value)}
                placeholder="Type or edit query in Bangla, English or Banglish..."
                rows={3}
                className="w-full rounded-xl bg-zinc-900 border border-cyan-500/40 p-3 text-sm text-zinc-100 focus:outline-none focus:ring-1 focus:ring-cyan-400 font-sans"
              />
            ) : (
              <div className="min-h-[72px] p-4 rounded-xl bg-zinc-950/70 border border-zinc-800 text-sm text-zinc-200 flex items-center justify-between">
                {transcript ? (
                  <span className="font-sans text-base text-cyan-200 font-medium">{transcript}</span>
                ) : (
                  <span className="text-zinc-500 italic">
                    {isListening
                      ? 'Listening to microphone... speak in Bangla or English...'
                      : 'Speak into your microphone or select one of the quick commands below...'}
                  </span>
                )}
                {transcript && !actionPlan && (
                  <button
                    disabled={isProcessing}
                    onClick={() => handleProcessCommand()}
                    className="ml-3 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs text-cyan-400 border border-zinc-700 flex items-center gap-1.5 shrink-0"
                  >
                    {isProcessing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ArrowRight className="w-3.5 h-3.5" />}
                    <span>Interpret</span>
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Quick presets */}
          {!transcript && (
            <div className="space-y-2">
              <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-500">Quick Voice Test Prompts:</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {sampleVoiceCommands.map((sample, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setTranscript(sample.label);
                      handleProcessCommand(sample.label);
                    }}
                    className="text-left p-2.5 rounded-xl bg-zinc-900/60 hover:bg-zinc-800/80 border border-zinc-800/80 hover:border-cyan-500/40 transition-all text-xs group"
                  >
                    <div className="text-zinc-200 font-medium group-hover:text-cyan-300 flex items-center justify-between">
                      <span>"{sample.label}"</span>
                      <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 text-cyan-400 transition-opacity" />
                    </div>
                    <div className="text-[10px] text-zinc-500 font-mono mt-0.5">{sample.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Interpreted Action Plan Card */}
          {actionPlan && (
            <div className="p-4 rounded-xl bg-zinc-900/70 border border-cyan-500/30 space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                    INTENT: {actionPlan.intent}
                  </span>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">
                    AGENT: {actionPlan.executionTargetAgent}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                      actionPlan.riskLevel === 'SAFE'
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                        : actionPlan.riskLevel === 'LOW'
                        ? 'bg-blue-950 text-blue-400 border border-blue-800'
                        : actionPlan.riskLevel === 'MEDIUM'
                        ? 'bg-amber-950 text-amber-400 border border-amber-800'
                        : 'bg-red-950 text-red-400 border border-red-800'
                    }`}
                  >
                    RISK: {actionPlan.riskLevel}
                  </span>
                </div>
              </div>

              <div className="text-xs text-zinc-300 font-sans leading-relaxed bg-zinc-950/60 p-3 rounded-lg border border-zinc-800">
                <p className="font-medium text-cyan-300 mb-1 flex items-center gap-1.5">
                  <Volume2 className="w-3.5 h-3.5" />
                  Synthesized Action Plan:
                </p>
                {actionPlan.explanation}
              </div>

              {/* Steps */}
              {actionPlan.planSteps && actionPlan.planSteps.length > 0 && (
                <div className="space-y-1.5 text-xs text-zinc-400">
                  <span className="text-[10px] font-mono uppercase text-zinc-500">Pipeline Execution Steps:</span>
                  <ul className="space-y-1 list-disc list-inside font-mono text-[11px]">
                    {actionPlan.planSteps.map((step, i) => (
                      <li key={i} className="text-zinc-300">{step}</li>
                    ))}
                  </ul>
                </div>
              )}

              {actionPlan.approvalProtocol && (
                <div className="p-3.5 rounded-xl bg-zinc-950 border border-amber-500/40 text-xs font-mono space-y-2 text-zinc-300">
                  <div className="text-[10px] uppercase font-bold text-amber-400 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400" />
                    <span>OWNER AUTHORIZATION PROTOCOL</span>
                  </div>
                  <div className="space-y-1 text-[11px]">
                    <div><span className="text-zinc-500">REASON:</span> {actionPlan.approvalProtocol.reason}</div>
                    <div><span className="text-zinc-500">ACTION:</span> <span className="text-cyan-300 font-semibold">{actionPlan.approvalProtocol.action}</span></div>
                    <div><span className="text-zinc-500">EFFECT:</span> {actionPlan.approvalProtocol.effect}</div>
                    <div><span className="text-zinc-500">RISK:</span> <span className="text-amber-400 font-bold">{actionPlan.approvalProtocol.risk}</span></div>
                  </div>
                  <div className="pt-1.5 border-t border-zinc-900 text-emerald-400 font-bold text-xs">
                    {actionPlan.approvalProtocol.requestText}
                  </div>
                </div>
              )}

              {actionPlan.requiresApproval && !actionPlan.approvalProtocol && (
                <div className="flex items-center gap-2 p-2.5 rounded-lg bg-amber-950/40 border border-amber-500/40 text-amber-300 text-xs">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400" />
                  <span>Elevated Risk: This privileged action requires explicit operator approval before execution.</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-zinc-800/80 bg-zinc-900/40">
          <div className="text-[11px] font-mono text-zinc-500 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Never maps voice directly to shell. All actions verified.</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => { sounds.playClick(); onClose(); }}
              className="px-4 py-2 rounded-xl text-xs font-medium text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors"
            >
              Cancel
            </button>
            <button
              disabled={!actionPlan}
              onClick={handleExecute}
              className={`flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-semibold transition-all ${
                actionPlan
                  ? 'bg-cyan-500 hover:bg-cyan-400 text-zinc-950 shadow-md shadow-cyan-500/20'
                  : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
              }`}
            >
              <Play className="w-3.5 h-3.5" />
              <span>Execute Action</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
