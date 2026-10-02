# NEXUS MONSTER

> **"One Command Center. Your Entire Digital World."**

NEXUS MONSTER is a production-grade, modular, secure, self-hosted-capable digital command center and personal digital operating system. It bridges web applications, persistent browser workspaces, local compute hardware (Intel Core Ultra 9 with 16GB DDR5 & 4TB NVMe), VirtualBox Linux VMs, cloud VPS nodes, business e-commerce (Neo, Fitkart BD), nationwide distributed teams, defensive cyber labs, OSINT research, and media newsroom operations through a central AI orchestrator.

---

## 🌟 Core Pillars

1. **Hybrid Architecture**:
   - **Cloud Control Plane**: Web application, PostgreSQL state, AI orchestrator, and approval management.
   - **Private Local Node**: Companion NEXUS Agent running on the user's primary computer over an authenticated zero-trust outbound tunnel.
2. **Control Plane vs Execution Plane**:
   - The web interface never executes raw host shell commands directly.
   - Privileged and destructive operations route through capability-gated local daemon hooks and require human confirmation.
3. **Voice & Multilingual Natural Language**:
   - Web Speech API speech-to-text with bilingual support (Bangla, English, Banglish, and mixed queries).
   - Generates structured Action Plans before execution with risk rating: `SAFE`, `LOW`, `MEDIUM`, `HIGH`, `CRITICAL`.
4. **Universal Command Palette (Ctrl+K)**:
   - Omnipresent search bar accepting text, shortcuts, and voice queries.
5. **Browser-First Workspace**:
   - Dedicated workspaces (`MAIN`, `BUSINESS`, `MARKETING`, `DEV`, `SECURITY`, `MEDIA`, `PERSONAL`) with persistent login profiles.
   - Integrated Browser Agent with DOM inspection, form filling, and approval-gated submissions.
6. **Multi-Business OS**:
   - Real-time sales, order streams, customer CRM, and inventory tracking for ventures including **Neo** and **Fitkart BD**.
7. **Discipline in Self-Repair**:
   - Continuous subsystem health monitoring with automated diagnostic trees.
   - Snapshot creation prior to repair and one-click rollback history.
   - Strict guardrails: self-repair can never disable security controls or rewrite authorization barriers.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS, Lucide Icons, Web Audio API Sound Engine
- **Backend / Control Plane**: Node.js, Express, Vite Middleware Mode
- **AI Core**: `@google/genai` TypeScript SDK (`gemini-3.8-flash`) with server-side proxy
- **Hypervisor & Compute**: VirtualBox API bridge, Docker container runner, code-server
