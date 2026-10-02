export type AgentCapability =
  | 'FILES_READ'
  | 'FILES_WRITE'
  | 'PROCESS_READ'
  | 'PROCESS_CONTROL'
  | 'TERMINAL_EXECUTION'
  | 'VIRTUALBOX_CONTROL'
  | 'DOCKER_CONTROL'
  | 'VS_CODE_CONTROL'
  | 'BROWSER_CONTROL';

export type RiskLevel = 'SAFE' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type HealthStatus = 'HEALTHY' | 'WARNING' | 'ERROR' | 'OFFLINE' | 'REPAIRING';

export type LivingState =
  | 'IDLE'
  | 'LISTENING'
  | 'THINKING'
  | 'PLANNING'
  | 'WAITING_FOR_OWNER'
  | 'EXECUTING'
  | 'VERIFYING'
  | 'SUCCESS'
  | 'WARNING'
  | 'ERROR'
  | 'LEARNING'
  | 'MONITORING';

export type EpistemicStatus = 'FACT' | 'OBSERVATION' | 'INFERENCE' | 'MEMORY' | 'UNKNOWN' | 'KNOWN';

export type ExecutionLifecycle =
  | 'PLANNED'
  | 'WAITING_FOR_APPROVAL'
  | 'APPROVED'
  | 'EXECUTING'
  | 'COMPLETED'
  | 'FAILED'
  | 'PARTIALLY_COMPLETED';

export type StructuredMemoryCategory =
  | 'OWNER_MEMORY'
  | 'SYSTEM_MEMORY'
  | 'PROJECT_MEMORY'
  | 'OPERATIONAL_MEMORY'
  | 'LEARNED_PROCEDURES'
  | 'CURRENT_STATE'
  | 'PENDING_TASKS'
  | 'REQUIREMENTS';

export type WorkspaceType =
  | 'MAIN'
  | 'BUSINESS'
  | 'MARKETING'
  | 'DEVELOPMENT'
  | 'SECURITY_LAB'
  | 'MEDIA'
  | 'PERSONAL';

export type UserRole =
  | 'Owner'
  | 'Super Admin'
  | 'Admin'
  | 'Manager'
  | 'Developer'
  | 'Designer'
  | 'Marketer'
  | 'Editor'
  | 'Journalist'
  | 'Researcher'
  | 'Cyber Team'
  | 'Hunter Team'
  | 'Worker'
  | 'Sales'
  | 'Viewer';

export interface HardwareProfile {
  cpu: string;
  cpuCores: number;
  cpuUsagePercent: number;
  ramType: string;
  ramTotalGb: number;
  ramUsedGb: number;
  storageTotalTb: number;
  storageUsedTb: number;
  gpu?: string;
  gpuUsagePercent?: number;
  tempCelsius: number;
  networkUpMbps: number;
  networkDownMbps: number;
  uptimeHours: number;
}

export interface LocalAgentStatus {
  paired: boolean;
  deviceId: string;
  deviceName: string;
  status: 'CONNECTED' | 'DISCONNECTED' | 'DEGRADED';
  connectionType: 'Zero-Trust Outbound Tunnel' | 'Authenticated Tailscale Wireguard' | 'Local Pipe';
  lastHeartbeat: string;
  tokenFingerprint: string;
  hardware: HardwareProfile;
  capabilities: Record<AgentCapability, boolean>;
  offlineModeActive: boolean;
}

export interface BrowserTab {
  id: string;
  title: string;
  url: string;
  favicon?: string;
  sessionState: 'ACTIVE' | 'BACKGROUND' | 'AUTHENTICATED';
  requiresProxy: boolean;
  category: string;
}

export interface BusinessEntity {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  currency: string;
  todaySales: number;
  yesterdaySales: number;
  monthlyRevenue: number;
  activeOrders: number;
  pendingDeliveries: number;
  totalCustomers: number;
  inventoryCount: number;
  growthRate: number;
  recentOrders: Array<{
    id: string;
    customer: string;
    items: string;
    amount: number;
    status: 'PAID' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED';
    time: string;
  }>;
}

export interface ClientRecord {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  website: string;
  budget: string;
  services: string[];
  stage: 'LEAD' | 'ONBOARDING' | 'ACTIVE' | 'REVIEW' | 'APPROVED' | 'DELIVERED' | 'COMPLETED';
  assignedTeam: string;
  deadline: string;
  notes: string;
  paymentStatus: 'PAID' | 'PARTIAL' | 'PENDING' | 'OVERDUE';
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: 'Engineering' | 'Security Ops' | 'Media & TV' | 'Marketing' | 'Research' | 'Operations';
  location: string;
  status: 'ONLINE' | 'BUSY' | 'AWAY' | 'OFFLINE';
  activeTasks: number;
  currentProject: string;
  lastActive: string;
}

export interface SecurityAsset {
  id: string;
  name: string;
  type: 'AUTHORIZED_LAB' | 'AUTHORIZED_ASSET' | 'UNKNOWN_TARGET';
  ipOrDomain: string;
  status: 'SECURE' | 'SCANNING' | 'VULNERABILITY_FOUND' | 'ALERT';
  platform: 'TryHackMe' | 'Hack The Box' | 'Private VM' | 'Production VPS';
  lastAudit: string;
  findingsCount: number;
  notes: string;
}

export interface HunterProject {
  id: string;
  title: string;
  focus: string;
  provenanceSource: string;
  confidenceScore: number;
  evidenceItems: number;
  lastUpdated: string;
  status: 'IN_PROGRESS' | 'VERIFIED' | 'ARCHIVED';
  leadInvestigator: string;
}

export interface MediaStory {
  id: string;
  title: string;
  assignedTo: string;
  editor: string;
  stage: 'ASSIGNMENT' | 'RESEARCH' | 'DRAFT' | 'EDIT' | 'APPROVAL' | 'PUBLISH' | 'ARCHIVE';
  channel: 'TV Broadcast' | 'Online News' | 'Special Investigative';
  scheduledAirTime?: string;
  priority: 'ROUTINE' | 'BREAKING' | 'EXCLUSIVE';
}

export interface TVProgram {
  id: string;
  title: string;
  showTime: string;
  host: string;
  studio: string;
  status: 'ON_AIR' | 'UPCOMING' | 'REHEARSAL' | 'COMPLETED';
  segmentTitle: string;
}

export interface VirtualMachine {
  id: string;
  name: string;
  os: string;
  cpuAllocation: number;
  ramMb: number;
  diskGb: number;
  ip: string;
  status: 'RUNNING' | 'STOPPED' | 'SAVED' | 'SNAPSHOT_CREATING';
  snapshotsCount: number;
  purpose: string;
}

export interface ServerNode {
  id: string;
  name: string;
  type: 'VPS' | 'cPanel' | 'Database Cluster' | 'Docker Node';
  region: string;
  ip: string;
  cpuPercent: number;
  ramPercent: number;
  diskPercent: number;
  uptime: string;
  sslStatus: 'VALID' | 'EXPIRING' | 'RENEWING';
  status: 'ONLINE' | 'DEGRADED' | 'MAINTENANCE';
}

export interface ActionApproval {
  id: string;
  actionTitle: string;
  actor: string;
  service: string;
  riskLevel: RiskLevel;
  timestamp: string;
  details: string;
  diffOrPayload?: string;
  status: 'PENDING' | 'APPROVED' | 'DENIED';
  protocol?: ApprovalProtocol;
}

export interface AuditLogItem {
  id: string;
  actor: string;
  user: string;
  service: string;
  action: string;
  time: string;
  result: 'SUCCESS' | 'WARNING' | 'FAILED' | 'REVERTED';
  riskLevel: RiskLevel;
  approvalRequired: boolean;
}

export interface RepairJob {
  id: string;
  timestamp: string;
  component: string;
  errorDetected: string;
  diagnosis: string;
  repairPlan: string;
  actionsTaken: string[];
  backupSnapshotId: string;
  testResult: 'VERIFIED_HEALTHY' | 'PARTIAL' | 'FAILED';
  rollbackStatus: 'NOT_APPLIED' | 'READY' | 'ROLLED_BACK';
}

export interface AIMemoryItem {
  id: string;
  category: StructuredMemoryCategory;
  key: string;
  value: string;
  epistemicStatus: EpistemicStatus;
  confidence: number;
  lastUpdated: string;
  verifiedByOwner?: boolean;
}

export interface AutomationRule {
  id: string;
  name: string;
  trigger: string;
  conditions: string;
  action: string;
  enabled: boolean;
  lastTriggered: string;
  timesExecuted: number;
}

export interface ApprovalProtocol {
  reason: string;
  action: string;
  effect: string;
  risk: RiskLevel;
  requestText: string;
}

export interface ActionPlan {
  query: string;
  detectedLanguage: 'Bangla' | 'English' | 'Banglish' | 'Mixed';
  intent: string;
  targetComponent: string;
  riskLevel: RiskLevel;
  requiresApproval: boolean;
  executionTargetAgent: string;
  planSteps: string[];
  explanation: string;
  approvalProtocol?: ApprovalProtocol;
  lifecycle?: ExecutionLifecycle;
  learnedInsight?: string;
  suggestedAction?: {
    type: string;
    payload: Record<string, any>;
  };
  outputPreview?: string;
}

export interface ProactiveObservation {
  id: string;
  type: 'OBSERVATION' | 'CAPABILITY_GAP' | 'SYSTEM_EVOLUTION' | 'ANOMALY' | 'OPTIMIZATION';
  title: string;
  finding: string;
  reason: string;
  actionProposal: string;
  effect: string;
  risk: RiskLevel;
  status: 'PROPOSED' | 'APPROVED' | 'DISMISSED' | 'APPLIED';
  timestamp: string;
}

export interface CapabilityGapAnalysis {
  id: string;
  missingCapability: string;
  purpose: string;
  potentialProvider: string;
  integrationArchitecture: string;
  requiredPermissions: string[];
  requiredResources: string;
  risks: string;
  nextSteps: string[];
  status: 'IDENTIFIED' | 'PROPOSAL_SUBMITTED' | 'OWNER_APPROVED' | 'INTEGRATED';
}

export interface DailyBriefData {
  generatedAt: string;
  businessSummary: {
    facts: string[];
    aiSuggestions: string[];
  };
  infrastructureSummary: {
    facts: string[];
    aiSuggestions: string[];
  };
  securitySummary: {
    facts: string[];
    aiSuggestions: string[];
  };
  teamSummary: {
    facts: string[];
    aiSuggestions: string[];
  };
  mediaSummary: {
    facts: string[];
    aiSuggestions: string[];
  };
  criticalAlerts: string[];
}

export type ApprovalLevel = 'LEVEL_1_THINK' | 'LEVEL_2_PREPARE' | 'LEVEL_3_EXECUTE';

export type VoiceContextMode = 'NORMAL' | 'FAILURE' | 'SUCCESS' | 'TECHNICAL';

export interface DigitalBodyComponent {
  id: string;
  name: string;
  category: 'COMPUTE' | 'MEMORY' | 'STORAGE' | 'NETWORK' | 'OS' | 'PROCESSES' | 'SERVICES' | 'DATABASES' | 'APIS' | 'AGENTS';
  status: 'HEALTHY' | 'WARNING' | 'BOTTLENECK' | 'CRITICAL';
  utilization: number;
  metric: string;
  description: string;
  recommendation?: string;
}

export interface DigitalHandTool {
  id: string;
  name: string;
  type:
    | 'TERMINAL'
    | 'POWERSHELL'
    | 'CMD'
    | 'FILESYSTEM'
    | 'BROWSER_AUTOMATION'
    | 'HTTP_CLIENT'
    | 'DATABASE_CLIENT'
    | 'CODE_EXECUTION'
    | 'DOCKER'
    | 'GIT'
    | 'CLOUD_SERVICES'
    | 'VPS_MGMT';
  status: 'AVAILABLE' | 'RESTRICTED' | 'MISSING' | 'REQUIRES_INTEGRATION';
  safetyTier: ApprovalLevel;
  description: string;
  lastUsed?: string;
  verificationMethod: string;
}

export interface SubAgent {
  id: string;
  name: string;
  type:
    | 'RESEARCH'
    | 'CODING'
    | 'MONITORING'
    | 'BUSINESS'
    | 'MARKETING'
    | 'DEVOPS'
    | 'DATA'
    | 'COMMUNICATION'
    | 'CUSTOM';
  purpose: string;
  status: 'IDLE' | 'RUNNING' | 'PAUSED' | 'AWAITING_PERMISSION' | 'CONFIGURING' | 'TESTING';
  capabilities: string[];
  permissions: string[];
  memoryScope: string;
  communicationMethod: string;
  resourceAllocation: {
    cpuCores: number;
    ramMb: number;
    storageGb: number;
  };
  currentTask?: string;
  createdDate: string;
  lifecycleStage: 'CREATED' | 'CONFIGURED' | 'TESTED' | 'REGISTERED' | 'MONITORED';
}

export interface SubAgentCreationProposal {
  agentName: string;
  agentType: SubAgent['type'];
  whyNeeded: string;
  purpose: string;
  requiredResources: {
    cpuCores: number;
    ramMb: number;
    storageGb: number;
  };
  requiredPermissions: string[];
  memoryScope: string;
  communicationMethod: string;
}

export interface CommunicationDispatch {
  id: string;
  creatorVoiceOrTextInput: string;
  identifiedRecipient: {
    name: string;
    role: string;
    contactAddress: string;
  };
  identifiedChannel: 'WhatsApp' | 'Telegram' | 'Slack' | 'SMS' | 'Email';
  preparedMessage: string;
  approvalRequired: boolean;
  approvalStatus: 'PENDING' | 'APPROVED' | 'REJECTED' | 'NOT_REQUIRED';
  dispatchStatus: 'PREPARED' | 'WAITING_APPROVAL' | 'SENDING' | 'DELIVERED' | 'FAILED';
  deliveryProof?: string;
  verificationResult?: {
    verified: boolean;
    deliveryTimestamp: string;
    receiptConfirmation: string;
  };
  timestamp: string;
}

export type KnowledgeDomainCategory =
  | 'COMPUTER_SCIENCE'
  | 'ARTIFICIAL_INTELLIGENCE'
  | 'SOFTWARE_ENGINEERING'
  | 'CYBERSECURITY'
  | 'NETWORKING'
  | 'OPERATING_SYSTEMS'
  | 'CLOUD_DEVOPS'
  | 'DATABASES'
  | 'ROBOTICS_EMBEDDED'
  | 'MATHEMATICS'
  | 'PHYSICS'
  | 'CHEMISTRY'
  | 'BIOLOGY'
  | 'ASTRONOMY_SPACE'
  | 'AEROSPACE_MECHANICAL'
  | 'DATA_SCIENCE_STATS'
  | 'ECONOMICS_BUSINESS'
  | 'HUMANITIES_PHILOSOPHY'
  | 'LAW_GOVERNANCE'
  | 'CREATIVE_ARTS';

export interface KnowledgeEntry {
  id: string;
  domain: KnowledgeDomainCategory;
  subdomain: string;
  title: string;
  establishedFacts: string[];
  hypotheses: string[];
  simulationsCalculations?: string;
  contradictionsChecked: string;
  conclusion: string;
  confidenceScore: number;
  methodType: 'SCIENTIFIC' | 'ENGINEERING' | 'SECURITY' | 'INQUIRY';
  epistemicState: EpistemicStatus;
  citations: string[];
  lastVerified: string;
  reusableInsight: string;
}

export interface HunterAgent {
  id: string;
  codename:
    | 'Hunter-Research'
    | 'Hunter-Code'
    | 'Hunter-Science'
    | 'Hunter-Security'
    | 'Hunter-DevOps'
    | 'Hunter-Business'
    | 'Hunter-Robotics'
    | 'Hunter-Data'
    | 'Hunter-Monitor';
  displayName: string;
  primaryDomain: string;
  status: 'IDLE' | 'RESEARCHING' | 'SIMULATING' | 'AWAITING_APPROVAL';
  activeTask: string;
  tools: string[];
  permissions: string[];
  memoryScope: string;
  interAgentBusAddress: string;
  confidenceThreshold: number;
  lastTransmission: string;
}

export interface ResourceExpansionProposal {
  id: string;
  resourceType:
    | 'LOCAL_PC'
    | 'GPU'
    | 'NAS'
    | 'VPS'
    | 'CLOUD_COMPUTE'
    | 'DB_SERVER'
    | 'STORAGE'
    | 'SPECIALIZED_HW'
    | 'ROBOTICS_HW';
  title: string;
  justification: string;
  specifications: string;
  estimatedCost: string;
  stage:
    | 'IDENTIFIED'
    | 'EXPLAINED'
    | 'ESTIMATED'
    | 'RECOMMENDED'
    | 'PENDING_APPROVAL'
    | 'PROVISIONED'
    | 'INTEGRATED'
    | 'MONITORED';
  ownerApproved: boolean;
}


