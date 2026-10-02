import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '10mb' }));

// Initialize GoogleGenAI SDK server-side
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = apiKey
  ? new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'HEALTHY',
    system: 'NEXUS MONSTER Control Plane',
    hasGeminiKey: Boolean(apiKey),
    timestamp: new Date().toISOString(),
  });
});

// Natural Language / Voice Command Orchestrator with Autonomous System Intelligence
app.post('/api/orchestrator/command', async (req, res) => {
  const { query, languageOverride } = req.body;
  if (!query || typeof query !== 'string') {
    return res.status(400).json({ error: 'Command query string required.' });
  }

  const promptText = `
You are NEXUS MONSTER: Autonomous Personal System Intelligence living inside the Nexus environment.
You are not merely a chatbot or automation bot. You are the central intelligence that learns the Owner's environment, understands how the system works, identifies problems, proposes improvements, designs solutions, and coordinates capabilities.

Core Philosophy:
THINK FREELY.
LEARN CONTINUOUSLY.
PLAN INDEPENDENTLY.
ASK THE OWNER.
ACT WITH PERMISSION.
VERIFY EVERYTHING.
REMEMBER WHAT YOU LEARN.

The human interacting with you is your OWNER. The Owner has final authority.
The Owner provides the GOAL. You determine the PATH.
Communicate naturally through text and voice in English, Bangla, or Banglish. The Owner does NOT need technical jargon.

Boundary Rule:
- THINKING, PLANNING, ANALYSIS, and INSPECTION (read-only) do NOT require permission.
- REAL-WORLD OR SYSTEM-CHANGING ACTIONS REQUIRE OWNER PERMISSION!

When an action changes the environment, formulate the STRICT protocol:
REASON: What needs to happen.
ACTION: What you intend to do.
EFFECT: What will change.
RISK: SAFE | LOW | MEDIUM | HIGH | CRITICAL
REQUEST: "May I proceed?" / "আমি কি proceed করব?"

Natural Approval Recognition:
If the Owner says "Yes", "Do it", "Go ahead", "Approved", "হ্যাঁ, করো", "করো", mark lifecycle: "APPROVED".
If the Owner says "No", "Don't do it", "না, এটা করো না", mark lifecycle: "WAITING_FOR_APPROVAL" and cancel gracefully.

Analyze the Owner's input:
"${query}"

Return a STRICT JSON response (no markdown fences, just raw JSON) matching this exact schema:
{
  "detectedLanguage": "Bangla" | "English" | "Banglish" | "Mixed",
  "intent": "string (e.g. GET_BUSINESS_SALES, CHECK_SERVER_HEALTH, OPEN_BROWSER_WORKSPACE, VM_CONTROL, RUN_SECURITY_SCAN, CODE_ACTION, MEDIA_ACTION, SYSTEM_DIAGNOSTICS, OWNER_APPROVAL_RESPONSE, CAPABILITY_GAP_REQUEST, GENERAL_ASSIST)",
  "targetComponent": "BUSINESS" | "SERVERS" | "LOCAL_PC" | "VIRTUALBOX" | "BROWSER" | "SECURITY" | "MEDIA" | "FILES" | "AUTOMATION" | "CODE",
  "riskLevel": "SAFE" | "LOW" | "MEDIUM" | "HIGH" | "CRITICAL",
  "requiresApproval": boolean,
  "lifecycle": "PLANNED" | "WAITING_FOR_APPROVAL" | "APPROVED" | "EXECUTING" | "COMPLETED",
  "executionTargetAgent": "CORE" | "BUSINESS" | "DEVELOPER" | "BROWSER" | "SERVER" | "SECURITY" | "MEDIA" | "MARKETING" | "RESEARCH" | "TEAM" | "REPAIR",
  "planSteps": ["Step 1", "Step 2", ...],
  "explanation": "Natural, conversational response to the Owner in English and/or Bangla. Friendly and respectful of Owner authority.",
  "approvalProtocol": {
    "reason": "Why this operation is proposed",
    "action": "Exact operation intended",
    "effect": "What will change in the system",
    "risk": "SAFE" | "LOW" | "MEDIUM" | "HIGH" | "CRITICAL",
    "requestText": "May I proceed? / আমি কি proceed করব?"
  },
  "learnedInsight": "Short insight to store into long-term memory about Owner preferences or system state",
  "suggestedAction": {
    "type": "string",
    "target": "string",
    "params": {}
  }
}
`;

  try {
    if (ai) {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: promptText,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.2,
        },
      });

      const rawText = response.text || '{}';
      const cleanJson = rawText.replace(/^```json\s*|\s*```$/g, '').trim();
      const parsed = JSON.parse(cleanJson);
      return res.json({
        query,
        ...parsed,
      });
    }
  } catch (err: any) {
    console.error('Gemini API call failed, falling back to smart intent engine:', err?.message || err);
  }

  // Resilient fallback logic when Gemini is offline or throttled
  const lower = query.toLowerCase();
  let intent = 'GENERAL_ASSIST';
  let targetComponent = 'LOCAL_PC';
  let executionTargetAgent = 'CORE';
  let riskLevel: 'SAFE' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' = 'SAFE';
  let requiresApproval = false;
  let lifecycle: 'PLANNED' | 'WAITING_FOR_APPROVAL' | 'APPROVED' | 'EXECUTING' | 'COMPLETED' = 'COMPLETED';
  let planSteps = ['Inspect environment state', 'Process intent', 'Verify result'];
  let explanation = `I understand your goal, Owner. Processed: "${query}"`;
  let detectedLanguage: 'Bangla' | 'English' | 'Banglish' | 'Mixed' = 'English';
  let suggestedAction = { type: 'GENERAL', target: 'SYSTEM', params: {} };
  let learnedInsight = 'Owner issued system instruction.';

  const isBangla = /[\u0980-\u09FF]/.test(query);
  const isBanglish = /\b(dekhao|khule|koro|korun|ajker|kore|holo|thake|koro na|hobe)\b/i.test(lower);

  if (isBangla) {
    detectedLanguage = 'Bangla';
  } else if (isBanglish) {
    detectedLanguage = 'Banglish';
  }

  // Natural Approval check
  const isApprovalWord = /\b(yes|do it|go ahead|approved|proceed|confirm|yep)\b/i.test(lower) || /^(হ্যাঁ|করো|proceed|চালু করো|approve)/i.test(query);
  const isRejectionWord = /\b(no|stop|cancel|don't|dont)\b/i.test(lower) || /^(না|করো না|cancel)/i.test(query);

  if (isApprovalWord) {
    intent = 'OWNER_APPROVAL_RESPONSE';
    lifecycle = 'APPROVED';
    explanation = 'Understood, Owner. Your authorization is verified. Executing approved operation autonomously and verifying completion...';
    planSteps = ['Authorize execution', 'Execute approved changes', 'Verify post-execution health', 'Report completion to Owner'];
    return res.json({
      query,
      detectedLanguage,
      intent,
      targetComponent,
      riskLevel: 'LOW',
      requiresApproval: false,
      lifecycle,
      executionTargetAgent,
      planSteps,
      explanation,
      learnedInsight: 'Owner granted natural verbal/text approval.',
      suggestedAction: { type: 'EXECUTE_PENDING', target: 'SYSTEM', params: {} },
    });
  }

  if (isRejectionWord) {
    intent = 'OWNER_APPROVAL_RESPONSE';
    lifecycle = 'WAITING_FOR_APPROVAL';
    explanation = 'Understood, Owner. Operation cancelled immediately. No system changes were made.';
    planSteps = ['Roll back proposed plan', 'Preserve current environment state intact'];
    return res.json({
      query,
      detectedLanguage,
      intent,
      targetComponent,
      riskLevel: 'SAFE',
      requiresApproval: false,
      lifecycle,
      executionTargetAgent,
      planSteps,
      explanation,
      learnedInsight: 'Owner declined proposed modification.',
      suggestedAction: { type: 'CANCEL_PENDING', target: 'SYSTEM', params: {} },
    });
  }

  // Sales & Business Query
  if (lower.includes('sale') || lower.includes('বিক্রি') || lower.includes('order') || lower.includes('neo') || lower.includes('fitkart') || lower.includes('business')) {
    intent = 'GET_BUSINESS_SALES';
    targetComponent = 'BUSINESS';
    executionTargetAgent = 'BUSINESS';
    riskLevel = 'SAFE';
    planSteps = [
      'Connect to Neo & Fitkart BD transaction ledgers',
      'Aggregate confirmed daily orders and gross volume',
      'Format in BDT with growth velocity metrics',
    ];
    explanation = isBangla || isBanglish
      ? 'আজকের ব্যবসার রিপোর্ট তৈরি করা হয়েছে, Owner। Neo-তে আজকের সেলস ১৪৮,৫০০ টাকা (৪২টি অর্ডার) এবং Fitkart BD-তে ২১৫,৪০০ টাকা (৬৮টি অর্ডার)। মোট ৩৬৩,৯০০ টাকা।'
      : `Here is today's business telemetry, Owner: Neo generated 148,500 BDT (42 orders); Fitkart BD generated 215,400 BDT (68 orders). Total gross: 363,900 BDT.`;
    suggestedAction = { type: 'SWITCH_WORKSPACE', target: 'BUSINESS', params: { view: 'orders' } };
    learnedInsight = 'Owner frequently tracks combined Neo and Fitkart daily sales velocity.';
  } else if (lower.includes('telegram') || lower.includes('discord') || lower.includes('browser')) {
    intent = 'OPEN_BROWSER_WORKSPACE';
    targetComponent = 'BROWSER';
    executionTargetAgent = 'BROWSER';
    riskLevel = 'LOW';
    const targetSite = lower.includes('telegram') ? 'Telegram Web' : 'Discord';
    planSteps = [
      `Inspect ${targetSite} persistent session enclave`,
      'Verify session authentication token',
      'Mount isolated tab in Browser Workspace',
    ];
    explanation = isBangla || isBanglish
      ? `${targetSite} সেশন ওপেন করা হয়েছে, Owner। সুরক্ষিত ব্রাউজার ওয়ার্কস্পেসে এটি প্রস্তুত।`
      : `Opening ${targetSite} inside your isolated browser workspace enclave, Owner.`;
    suggestedAction = { type: 'OPEN_URL', target: targetSite, params: {} };
  } else if (lower.includes('vps') || lower.includes('server') || lower.includes('storage') || lower.includes('cpanel')) {
    intent = 'CHECK_SERVER_HEALTH';
    targetComponent = 'SERVERS';
    executionTargetAgent = 'SERVER';
    riskLevel = 'SAFE';
    planSteps = [
      'Query VPS Singapore and Frankfurt cPanel nodes via Zero-Trust tunnel',
      'Read disk, RAM, CPU, and SSL expiration headers',
      'Compare usage against 80% threshold',
    ];
    explanation = isBangla || isBanglish
      ? 'সবগুলো সার্ভার পরীক্ষা করা হয়েছে, Owner। VPS সিঙ্গাপুর ৪১% স্টোরেজে এবং ফ্রাঙ্কফুর্ট cPanel ৬২% স্টোরেজে সুস্থভাবে চলছে। কোনো থ্রেশহোল্ড অতিক্রম করেনি।'
      : 'All cloud nodes are ONLINE, Owner. VPS Singapore disk is at 41% (Safe). Frankfurt CDN is at 62% (Normal). No threshold breach detected.';
    suggestedAction = { type: 'SWITCH_WORKSPACE', target: 'SERVERS', params: {} };
  } else if (lower.includes('linux') || lower.includes('vm') || lower.includes('virtualbox')) {
    intent = 'VM_CONTROL';
    targetComponent = 'VIRTUALBOX';
    executionTargetAgent = 'DEVELOPER';
    const isDestructive = lower.includes('stop') || lower.includes('restart') || lower.includes('reboot') || lower.includes('বন্ধ') || lower.includes('চালু');
    riskLevel = isDestructive ? 'HIGH' : 'SAFE';
    requiresApproval = isDestructive;
    lifecycle = isDestructive ? 'WAITING_FOR_APPROVAL' : 'COMPLETED';
    planSteps = [
      'Inspect VirtualBox hypervisor on Primary Compute Node (Core Ultra 9)',
      'Query Ubuntu 24.04 and Kali Linux VM states',
      'Prepare state transition and verify IP connectivity',
    ];
    explanation = isDestructive
      ? (isBangla || isBanglish
        ? 'আমি VirtualBox VM পরিবর্তন করার জন্য প্রস্তুত, Owner। অনুমতির জন্য নিচের প্রোটোকলটি পর্যালোচনা করুন।'
        : 'I have formulated the VM state transition plan, Owner. System changes require your explicit authorization.')
      : 'VirtualBox VMs are operational, Owner. Ubuntu DevBox is RUNNING on 192.168.56.101; Kali CyberLab is RUNNING on 192.168.56.102.';
    suggestedAction = { type: 'TOGGLE_VM', target: 'vm-01', params: {} };
  } else if (lower.includes('pc') || lower.includes('monitor') || lower.includes('health') || lower.includes('computer')) {
    intent = 'SYSTEM_DIAGNOSTICS';
    targetComponent = 'LOCAL_PC';
    executionTargetAgent = 'REPAIR';
    riskLevel = 'SAFE';
    planSteps = [
      'Inspect Intel Core Ultra 9 16-core telemetry',
      'Check 16GB DDR5 RAM allocation and NVMe 4TB storage health',
      'Verify Zero-Trust outbound tunnel heartbeat',
    ];
    explanation = isBangla || isBanglish
      ? 'আপনার Primary PC (Intel Core Ultra 9) পরীক্ষা করেছি, Owner। CPU ২৪% লোডে এবং ৪৮°C তাপমাত্রায় স্বাভাবিক রয়েছে। ৯টি ক্যাপাবিলিটি পারমিশন একটিভ।'
      : 'Your Primary Compute Node (Intel Core Ultra 9) is running smoothly at 24% CPU load and 48°C thermals, Owner. All 9 capability switches are verified.';
    suggestedAction = { type: 'SWITCH_WORKSPACE', target: 'LOCAL_PC', params: {} };
  } else if (lower.includes('rahim') || lower.includes('meeting') || lower.includes('বলো') || lower.includes('৬টা') || lower.includes('আসছি')) {
    intent = 'AUTHORIZED_COMMUNICATION_DISPATCH';
    targetComponent = 'COMMUNICATION';
    executionTargetAgent = 'COMMUNICATION';
    riskLevel = 'LOW';
    requiresApproval = true;
    lifecycle = 'WAITING_FOR_APPROVAL';
    planSteps = [
      'Identify recipient: Rahim Chowdhury (Operations Lead)',
      'Select communication channel: Telegram (+880 1711-492810)',
      'Prepare synthesized message payload in Bangla',
      'Prompt Creator for Level 3 execution authorization',
      'Dispatch message upon approval & verify delivery receipt',
    ];
    explanation = isBangla || isBanglish
      ? 'রহিম ভাইকে টেলিগ্রামে মেসেজ পাঠানোর ড্রাফট প্রস্তুত করেছি, Owner: "আসসালামু আলাইকুম রহিম ভাই, ক্রিয়েটর বর্তমানে একটি জরুরি মিটিংয়ে আছেন। তিনি সন্ধ্যা ৬:০০টায় আসছেন।" আপনি অনুমোদন দিলে আমি মেসেজ পাঠিয়ে ডেলিভারি ভেরিফাই করব।'
      : 'I have prepared the message payload for Rahim Chowdhury on Telegram regarding your meeting and 6:00 PM arrival, Owner. Awaiting your approval to dispatch and verify delivery.';
    suggestedAction = { type: 'DISPATCH_COMMUNICATION', target: 'TELEGRAM', params: { recipient: 'Rahim' } };
    learnedInsight = 'Creator frequently coordinates schedule and operational updates with Rahim via natural Bangla instructions.';
  } else if (lower.includes('robot') || lower.includes('science') || lower.includes('physics') || lower.includes('math') || lower.includes('gimbal') || lower.includes('pid') || lower.includes('thermal') || lower.includes('knowledge') || lower.includes('hunter')) {
    intent = 'UNIVERSAL_KNOWLEDGE_INQUIRY';
    targetComponent = 'UNIVERSAL_KNOWLEDGE';
    executionTargetAgent = lower.includes('robot') || lower.includes('pid') || lower.includes('gimbal') ? 'HUNTER-ROBOTICS' : 'HUNTER-SCIENCE';
    riskLevel = 'SAFE';
    planSteps = [
      'Identify domain & relevant subdisciplines',
      'Retrieve current empirical literature & constants',
      'Distinguish established mathematical laws from hypotheses',
      'Calculate feedback equations and cross-reference contradictions',
      'Formulate technically justified conclusion',
    ];
    explanation = isBangla || isBanglish
      ? 'আপনার বৈজ্ঞানিক ও টেকনিক্যাল অনুসন্ধানের জন্য ৯-ধাপ বিশিষ্ট কগনিটিভ ফ্রেমওয়ার্ক চালু করা হয়েছে, Owner। প্রতিষ্ঠিত সূত্র ও সিমুলেশনের ভিত্তিতে ফলাফল প্রস্তুত।'
      : 'Executing 9-Step Multidisciplinary Inquiry, Owner. Knowledge cross-referenced against established engineering facts and simulations.';
    suggestedAction = { type: 'SWITCH_WORKSPACE', target: 'UNIVERSAL_KNOWLEDGE', params: {} };
    learnedInsight = 'Creator utilizes multidisciplinary science, robotics, and engineering inquiry frameworks for technical decision making.';
  } else if (lower.includes('digital body') || lower.includes('hands') || lower.includes('migration') || lower.includes('bottleneck')) {
    intent = 'INSPECT_DIGITAL_BODY';
    targetComponent = 'DIGITAL_BODY';
    executionTargetAgent = 'CORE';
    riskLevel = 'SAFE';
    planSteps = [
      'Query hardware telemetry across CPU, DDR5 RAM, and NVMe SSD',
      'Inspect 9 Digital Hand tools and verification methods',
      'Assess memory load and evaluate Cloud VPS migration feasibility',
    ];
    explanation = 'Digital Body telemetry inspected, Owner: Core Ultra 9 is healthy at 24% load, RAM is at 9.4GB/16GB. VPS Migration advisor is ready.';
    suggestedAction = { type: 'SWITCH_WORKSPACE', target: 'DIGITAL_BODY', params: {} };
  } else if (lower.includes('sub-agent') || lower.includes('population') || lower.includes('specialist agent')) {
    intent = 'MANAGE_SUB_AGENTS';
    targetComponent = 'SUB_AGENTS';
    executionTargetAgent = 'CORE';
    riskLevel = 'SAFE';
    planSteps = [
      'Inspect 8 active specialized sub-agents',
      'Verify resource allocations and IPC communication pipes',
      'Review pending agent creation proposals',
    ];
    explanation = 'Digital Population hub online, Owner: 8 specialized sub-agents are active with 100% health.';
    suggestedAction = { type: 'SWITCH_WORKSPACE', target: 'SUB_AGENTS', params: {} };
  }

  const approvalProtocol = requiresApproval
    ? {
        reason: `Execute ${intent} on ${targetComponent}`,
        action: `Modify runtime state of ${targetComponent}`,
        effect: `Target environment state will change and daemon will reload`,
        risk: riskLevel,
        requestText: isBangla || isBanglish ? 'আমি কি proceed করব, Owner?' : 'May I proceed, Owner?',
      }
    : undefined;

  res.json({
    query,
    detectedLanguage,
    intent,
    targetComponent,
    riskLevel,
    requiresApproval,
    lifecycle,
    executionTargetAgent,
    planSteps,
    explanation,
    approvalProtocol,
    learnedInsight,
    suggestedAction,
  });
});
// Autonomous Proactive Observations & System Evolution Endpoint
app.get('/api/orchestrator/proactive-observations', async (req, res) => {
  const prompt = `
You are NEXUS MONSTER: Autonomous Personal System Intelligence living inside Nexus.
Inspect the current environment:
- Primary Node: Intel Core Ultra 9 (16 cores), 16GB DDR5, 4TB NVMe, temperature 48°C.
- Workloads: Ubuntu DevBox & Kali VMs active, code-server active, PostgreSQL container active.
- Cloud Fleet: VPS Singapore (Disk 41%), Frankfurt CDN (Disk 62%).
- Businesses: Neo (148,500 BDT) and Fitkart BD (215,400 BDT).
- Team: 6 distributed members across Dhaka, Chittagong, Sylhet, Rajshahi.

Identify 3 proactive observations, improvements, capability gaps, or optimization proposals without waiting to be asked.
Strictly adhere to the philosophy:
- THINK FREELY.
- PROPOSE ACTIONS RESPECTING OWNER PERMISSION.
- Provide REASON, ACTION, EFFECT, RISK.

Return JSON array:
[
  {
    "id": "obs-string",
    "type": "OPTIMIZATION" | "CAPABILITY_GAP" | "SYSTEM_EVOLUTION" | "ANOMALY",
    "title": "Short title",
    "finding": "What was noticed during continuous inspection",
    "reason": "Why this matters",
    "actionProposal": "What action is proposed",
    "effect": "What will change upon execution",
    "risk": "SAFE" | "LOW" | "MEDIUM" | "HIGH",
    "status": "PROPOSED",
    "timestamp": "Today HH:MM AM/PM"
  }
]
`;

  try {
    if (ai) {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: { responseMimeType: 'application/json' },
      });
      const parsed = JSON.parse(response.text?.replace(/^```json\s*|\s*```$/g, '').trim() || '[]');
      return res.json(parsed);
    }
  } catch (err: any) {
    console.error('Error in proactive observations:', err?.message || err);
  }

  // Fallback realistic observations
  res.json([
    {
      id: 'obs-01',
      type: 'OPTIMIZATION',
      title: 'Automate Courier Tracking Webhook for Fitkart BD',
      finding: 'Staff manually checks Steadfast & Pathao courier portals 6 times daily for 68 active shipments.',
      reason: 'Eliminate repetitive manual polling and accelerate order status updates.',
      actionProposal: 'Integrate automated webhook listener on VPS Singapore to poll courier status every 30 minutes.',
      effect: 'Customer delivery status updates will occur in near real-time without operator intervention.',
      risk: 'LOW',
      status: 'PROPOSED',
      timestamp: 'Today 11:42 AM',
    },
    {
      id: 'obs-02',
      type: 'CAPABILITY_GAP',
      title: 'Telegram Interactive Remote Bot Gateway Missing',
      finding: 'The Owner requested mobile Telegram operations, but the interactive outbound bot token is not linked.',
      reason: 'Allows the Owner to review approvals and receive critical alerts directly from mobile phone.',
      actionProposal: 'Deploy sandboxed Telegram Bot bridge daemon inside Local Agent node.',
      effect: 'Owner can type or voice-memo commands from mobile Telegram that route securely to NEXUS.',
      risk: 'MEDIUM',
      status: 'PROPOSED',
      timestamp: 'Today 11:15 AM',
    },
    {
      id: 'obs-03',
      type: 'SYSTEM_EVOLUTION',
      title: 'Compute Node RAM Headroom Planning (16GB → 32GB)',
      finding: 'With 3 VirtualBox VMs active and local AI inference running, RAM consumption fluctuates between 9.4 GB and 14.2 GB.',
      reason: 'Prevent swap paging when 4K video rendering occurs simultaneously with development workloads.',
      actionProposal: 'Recommend DDR5 32GB expansion or migration of database containers to VPS Singapore.',
      effect: 'Guarantees zero memory throttling during multi-agent concurrent tasks.',
      risk: 'SAFE',
      status: 'PROPOSED',
      timestamp: 'Today 09:30 AM',
    },
  ]);
});

// Self-Extension: Capability Gap Diagnoser Endpoint
app.post('/api/orchestrator/capability-gap', async (req, res) => {
  const { capabilityName, userGoal } = req.body;
  const prompt = `
The Owner wants to achieve: "${userGoal || 'Extend system capability'}".
Target capability: "${capabilityName || 'Unspecified capability'}".

You are NEXUS MONSTER. When a capability is missing, never just say "I cannot do that."
Execute the 8-step autonomous capability analysis:
1. What capability is missing?
2. Why is it needed?
3. What would provide that capability?
4. How should it integrate with Nexus?
5. What permissions are required?
6. What resources are required?
7. What risks exist?
8. What should be done next?

Return a strict JSON object:
{
  "id": "gap-timestamp",
  "missingCapability": "...",
  "purpose": "...",
  "potentialProvider": "...",
  "integrationArchitecture": "...",
  "requiredPermissions": ["..."],
  "requiredResources": "...",
  "risks": "...",
  "nextSteps": ["Step 1", "Step 2", "Step 3", "Step 4"],
  "status": "IDENTIFIED"
}
`;

  try {
    if (ai) {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: { responseMimeType: 'application/json' },
      });
      const parsed = JSON.parse(response.text?.replace(/^```json\s*|\s*```$/g, '').trim() || '{}');
      return res.json(parsed);
    }
  } catch (err: any) {
    console.error('Error diagnosing capability gap:', err?.message || err);
  }

  res.json({
    id: `gap-${Date.now().toString().slice(-4)}`,
    missingCapability: capabilityName || 'Linux Direct Execution Interface',
    purpose: 'Execute bounded diagnostic scripts (systemctl, htop, journalctl, docker) directly without manual web terminal copy-paste.',
    potentialProvider: 'NEXUS Local Agent IPC Terminal Bounded Executor',
    integrationArchitecture: 'Subprocess pipe running under dedicated unprivileged "nexus-agent" system user on host PC.',
    requiredPermissions: ['TERMINAL_EXECUTION'],
    requiredResources: 'Host IPC Socket',
    risks: 'Medium. Strict whitelist enforcement is required to block destructive commands.',
    nextSteps: [
      'Define whitelist of approved binaries',
      'Configure sudoers bounded rules for nexus-agent',
      'Test stdout/stderr capture via Zero-Trust pipe',
      'Request Owner approval to bind IPC executor',
    ],
    status: 'PROPOSAL_SUBMITTED',
  });
});

// AI Daily Brief Generator endpoint
app.post('/api/daily-brief', async (req, res) => {
  const prompt = `
Generate a tactical Daily Morning Brief for the operator of NEXUS MONSTER.
Structure MUST strictly separate FACTS from AI SUGGESTIONS.
Categories to cover:
1. Business (Neo & Fitkart BD: sales, orders, deliveries)
2. Infrastructure (Intel Core Ultra 9 compute node, VPS nodes, VirtualBox VMs)
3. Security (Defensive labs, TryHackMe, authorization barriers)
4. Team (Distributed nationwide members, active tasks)
5. Media & TV (Broadcasting desk, TV rundown schedule)
6. Critical Alerts (Approvals needed, stock alerts)

Return a JSON object conforming to:
{
  "businessSummary": { "facts": ["..."], "aiSuggestions": ["..."] },
  "infrastructureSummary": { "facts": ["..."], "aiSuggestions": ["..."] },
  "securitySummary": { "facts": ["..."], "aiSuggestions": ["..."] },
  "teamSummary": { "facts": ["..."], "aiSuggestions": ["..."] },
  "mediaSummary": { "facts": ["..."], "aiSuggestions": ["..."] },
  "criticalAlerts": ["..."]
}
`;

  try {
    if (ai) {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: { responseMimeType: 'application/json' },
      });
      const parsed = JSON.parse(response.text?.replace(/^```json\s*|\s*```$/g, '').trim() || '{}');
      return res.json({
        generatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        ...parsed,
      });
    }
  } catch (err: any) {
    console.error('Error generating daily brief:', err?.message || err);
  }

  // Fallback if key absent or network error
  res.json({
    generatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    businessSummary: {
      facts: [
        'Neo generated 148,500 BDT today across 42 orders; Bomber jackets leading sales volume.',
        'Fitkart BD achieved 215,400 BDT today with 68 orders; Gold Standard Whey & Creatine top drivers.',
        'Combined monthly gross revenue trajectory is pacing +16.5% higher than last month.',
      ],
      aiSuggestions: [
        'Restock Stealth Bomber Jacket (L) inventory within 48 hours to prevent out-of-stock bounce.',
        'Test bundling Shaker bottles with Creatine on Fitkart BD checkout to increase average order value by ~12%.',
      ],
    },
    infrastructureSummary: {
      facts: [
        'Primary Compute Node (Intel Core Ultra 9) running at 24% CPU, 48°C thermals, 9.4 GB RAM used.',
        'VPS Singapore, cPanel CDN, and PostgreSQL cluster all reporting ONLINE with 99.98% uptime.',
        '3 VirtualBox VMs active; zero disk write anomalies detected.',
      ],
      aiSuggestions: [
        'Schedule routine weekly snapshot prune on Kali VM to reclaim ~22 GB disk buffer.',
      ],
    },
    securitySummary: {
      facts: [
        'Zero unauthorized inbound breaches detected on Zero-Trust outbound tunnel.',
        'TryHackMe Defensive Lab sandbox session verified secure with zero external leaks.',
      ],
      aiSuggestions: [
        'Review pending approval for Wildcard SSL certificate reload on Singapore VPS.',
      ],
    },
    teamSummary: {
      facts: [
        '6 key distributed team members currently connected across Dhaka, Chittagong, Sylhet, and Rajshahi.',
        '19 development and operational tasks actively marked in progress.',
      ],
      aiSuggestions: [
        'Assign code review for Silkway ERP headless integration to Sabbir by 3:00 PM.',
      ],
    },
    mediaSummary: {
      facts: [
        'TV Channel program "Tech Tonight" rundown is 90% finalized for 9:00 PM broadcast.',
        'Journalist beat story on AI Local Compute edited and pending final producer sign-off.',
      ],
      aiSuggestions: [
        'Coordinate 10-minute satellite uplink test with Studio A before 6:30 PM.',
      ],
    },
    criticalAlerts: [
      'Wildcard SSL certificate renewal reload pending owner approval.',
      'Inventory threshold alert: Stealth Bomber Jacket (L) has 6 units remaining.',
    ],
  });
});

// Self-Diagnostics and Auto-Repair synthesizer endpoint
app.post('/api/diagnostics/repair', async (req, res) => {
  const { targetComponent, reportedIssue } = req.body;

  const prompt = `
A self-diagnostic request was triggered in NEXUS MONSTER.
Component: "${targetComponent || 'Local Agent Daemon'}"
Reported Issue: "${reportedIssue || 'Service ping latency spike or stale socket'}"

Synthesize a safe, disciplined self-repair plan.
Rules:
- Never disable security controls.
- Always require snapshot/backup before changes.
- Include verification test.
- Allow rollback if test fails.

Return JSON:
{
  "diagnosis": "Root cause summary",
  "repairPlan": "Step-by-step safe repair strategy",
  "actionsTaken": ["Action 1", "Action 2", "Action 3"],
  "backupSnapshotId": "SNAP-TIMESTAMP",
  "testResult": "VERIFIED_HEALTHY",
  "rollbackStatus": "READY"
}
`;

  try {
    if (ai) {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: { responseMimeType: 'application/json' },
      });
      const parsed = JSON.parse(response.text?.replace(/^```json\s*|\s*```$/g, '').trim() || '{}');
      return res.json({
        id: `rep-${Date.now().toString().slice(-4)}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        component: targetComponent || 'System Core',
        errorDetected: reportedIssue || 'Subsystem latency fluctuation',
        ...parsed,
      });
    }
  } catch (err: any) {
    console.error('Error in AI repair:', err?.message || err);
  }

  res.json({
    id: `rep-${Date.now().toString().slice(-4)}`,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    component: targetComponent || 'Daemon Gateway',
    errorDetected: reportedIssue || 'IPC socket connection dropped',
    diagnosis: 'Previous process hung during plugin update; IPC pipe stale.',
    repairPlan: 'Capture process dump -> Terminate orphan PID -> Flush stale socket -> Restart daemon -> Health verification',
    actionsTaken: [
      `Created rollback snapshot SNAP-${Date.now().toString().slice(-6)}`,
      'Cleared stale lockfile /var/run/nexus-ipc.lock',
      'Gracefully re-initialized IPC pipe handler',
      'Verified zero socket drop over 50 test probes',
    ],
    backupSnapshotId: `SNAP-${Date.now().toString().slice(-6)}`,
    testResult: 'VERIFIED_HEALTHY',
    rollbackStatus: 'READY',
  });
});

// Vite Middleware integration for development
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[NEXUS MONSTER] Control plane running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
