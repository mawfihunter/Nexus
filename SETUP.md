# NEXUS MONSTER — Setup & Installation Guide

This guide covers deployment of both the **NEXUS Cloud Control Plane** and the **NEXUS Local Agent** on your primary PC.

---

## 1. Prerequisites

- **Primary PC Profile**: Intel Core Ultra 9 (or multi-core modern x86_64), 16 GB DDR5 RAM, NVMe SSD storage.
- **Node.js**: v20+ or v22 LTS with `npm` or `pnpm`.
- **VirtualBox**: Version 7.0+ with `vboxwebsrv` daemon enabled for VM management.
- **Docker**: Docker Engine or Docker Desktop with Compose support.
- **Gemini API Key**: Server-side key configured in environment variables.

---

## 2. Quickstart Control Plane

```bash
# Clone the repository
git clone https://github.com/musfiqrian/nexus-monster.git
cd nexus-monster

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Run Full-Stack Development Server (Express + Vite)
npm run dev
```

Visit `http://localhost:3000` in your browser.

---

## 3. Pairing the NEXUS Local Agent

1. Launch the local companion service on your PC:
   ```bash
   nexus-agent --node-id="NEXUS-NODE-01-ULTRA9" --connect="https://nexus.yourdomain.com"
   ```
2. The agent initiates an **outbound-only** zero-trust TLS tunnel to the control plane.
3. No public inbound ports need to be exposed on your local router.
4. Verify all 9 capability switches in **Local PC Center > Capability Matrix**.
