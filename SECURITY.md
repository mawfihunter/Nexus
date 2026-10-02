# NEXUS MONSTER — Security Architecture & Guidelines

## 1. Control Plane vs. Execution Plane Isolation

The web frontend operates strictly as an unprivileged control plane.
- The web app **never** directly executes operating system binaries or shell scripts.
- privileged commands are validated server-side, checked against an immutable capability matrix, and routed across an authenticated private tunnel to the local agent.

---

## 2. Granular Capability Scopes

Every host interaction is governed by 9 independent, togglable flags:
- `FILES_READ`: Workspace directory listing & inspection.
- `FILES_WRITE`: Sandboxed project file edits.
- `PROCESS_READ`: Telemetry and process list inspection.
- `PROCESS_CONTROL`: Lifecycle control of approved daemon services.
- `TERMINAL_EXECUTION`: Bounded shell commands with blacklist enforcement.
- `VIRTUALBOX_CONTROL`: VM hypervisor management.
- `DOCKER_CONTROL`: Container state and build commands.
- `VS_CODE_CONTROL`: code-server editor bridge.
- `BROWSER_CONTROL`: Sandboxed DOM navigation.

---

## 3. Human-in-the-Loop Risk Gating

Actions are classified into 5 strict tiers:
- **SAFE**: Read-only telemetry (sales queries, system status).
- **LOW**: Opening workspaces, creating draft notes.
- **MEDIUM**: Sending non-critical webhook notifications, saving drafts.
- **HIGH**: Server reboots, VM snapshot reversion, service reloads.
- **CRITICAL**: Credential modification, production database alteration, file deletions.

**CRITICAL & HIGH** actions automatically freeze execution and create a pending entry in the **Approvals Center**.

---

## 4. Zero Secrets in Client & AI Memory

- API keys (`GEMINI_API_KEY`) reside exclusively in server-side memory.
- AI Memory Viewer and Editor disallows storage of passwords, cookies, or tokens.
- Cryptographic hash checks and audit logging accompany every approval.
