# NEXUS MONSTER — System Architecture

```
                               ┌────────────────────────┐
                               │     OPERATOR (YOU)     │
                               └───────────┬────────────┘
                                           │ Voice / Text / Click
                                           ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                               NEXUS CLOUD CONTROL PLANE                                │
│                                                                                        │
│   ┌──────────────────────────┐    ┌─────────────────────┐    ┌─────────────────────┐   │
│   │ Futuristic React 19 UI   │◄──►│ Express API Server  │◄──►│ Gemini AI Core      │   │
│   │ Tailored Command Palette │    │ Session & Auth Core │    │ Intent Orchestrator │   │
│   └─────────────┬────────────┘    └──────────┬──────────┘    └─────────────────────┘   │
│                 │                            │                                         │
│                 ▼                            ▼                                         │
│   ┌──────────────────────────┐    ┌─────────────────────┐                              │
│   │ Multi-Agent Coordinator │    │ PostgreSQL Database │                              │
│   │ Approvals & Audit Trail  │    │ State & Event Sync  │                              │
│   └──────────────────────────┘    └─────────────────────┘                              │
└──────────────────────────────────────────────┬─────────────────────────────────────────┘
                                               │ Zero-Trust Outbound Pipe
                                               │ (Encrypted WireGuard / TLS)
                                               ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                              PRIMARY PRIVATE COMPUTE NODE                              │
│                    Hardware: Intel Core Ultra 9 | 16GB DDR5 | 4TB NVMe                 │
│                                                                                        │
│                                  NEXUS LOCAL AGENT                                     │
│                     Capability-gated daemon with hardware probes                       │
│                                                                                        │
│          ┌───────────────────┬───────────────────┬───────────────────┐                 │
│          ▼                   ▼                   ▼                   ▼                 │
│   ┌──────────────┐    ┌──────────────┐    ┌──────────────┐    ┌──────────────┐         │
│   │ VirtualBox   │    │ code-server  │    │ Docker Engine│    │ Local Linux  │         │
│   │ Ubuntu/Kali  │    │ VS Code Core │    │ Containers   │    │ Host Shell   │         │
│   └──────────────┘    └──────────────┘    └──────────────┘    └──────────────┘         │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

## Subsystem Highlights:
1. **Multilingual Speech-to-Intent Pipeline**:
   Voice/Audio capture → Web Speech STT transcript → Server-side Gemini model (`gemini-3.8-flash`) → Intent & Risk classification → Action Plan preview → Operator approval.
2. **Browser-First Architecture**:
   Browser workspaces partition web sessions into isolated profiles (Telegram, Discord, Proton, Canva, Meta Ads) preventing API lock-in while maintaining security.
3. **Disciplined Auto-Repair**:
   Health monitor → Anomaly detection → Snapshot creation → Guided repair execution → Health test → Rollback if regression detected.
