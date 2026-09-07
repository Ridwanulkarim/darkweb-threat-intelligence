// Realistic Dark Web Threat Intelligence & SOC Mock Dataset

export const mockThreatReports = [
  {
    id: "rep-001",
    title: "LockBit 3.0 Ransomware Campaign Targeting Healthcare Infrastructure",
    status: "CONFIRMED",
    source: { id: "src-1", name: "Tor Darknet Forum - Dread", type: "ONION_FORUM" },
    category: { id: "cat-1", name: "Ransomware" },
    analyst: { id: "ana-1", name: "Elena Rostova", email: "elena.rostova@cyberthreat.io" },
    createdAt: "2026-09-07T14:32:00Z",
    updatedAt: "2026-09-07T18:15:00Z",
    description: "Threat actor claiming extortion over 450GB of patient medical records. Ransomware binary hashes spotted on Russian-speaking underground affiliate program.",
    indicators: [
      { id: "ind-1", type: "HASH", value: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855" },
      { id: "ind-2", type: "IP", value: "185.220.101.44" },
      { id: "ind-3", type: "DOMAIN", value: "lockbitapt-v3-c2portal.onion" }
    ],
    malware: [
      { id: "mal-1", name: "LockBit 3.0 Black Edition", type: "RANSOMWARE" }
    ],
    alerts: [
      { id: "alt-1", message: "Emergency exfiltration observed over Tor hidden services", level: "CRITICAL" }
    ],
    recommendations: [
      { id: "rec-1", text: "Isolate VLAN subnet 10.14.0.0/16 and revoke service accounts for Active Directory sync." },
      { id: "rec-2", text: "Deploy IoC firewall drops for listed C2 IPs." }
    ]
  },
  {
    id: "rep-002",
    title: "Russian Underground Paste of Telecom Executive Credentials",
    status: "INVESTIGATING",
    source: { id: "src-2", name: "Telegram Leak Channel - ExfilLeakz", type: "TELEGRAM" },
    category: { id: "cat-2", name: "Data Theft & Credential Leak" },
    analyst: { id: "ana-2", name: "Marcus Vance", email: "marcus.v@cyberthreat.io" },
    createdAt: "2026-09-07T09:12:00Z",
    updatedAt: "2026-09-07T11:45:00Z",
    description: "Infostealer RedLine logs decompressed revealing valid SSO sessions and VPN tokens for Tier-1 European Telecom operators.",
    indicators: [
      { id: "ind-4", type: "EMAIL", value: "c-suite@telecom-global.eu" },
      { id: "ind-5", type: "URL", value: "https://vpn.telecom-global.eu/dana-na/auth/url_default/welcome.cgi" },
      { id: "ind-6", type: "IP", value: "91.240.118.192" }
    ],
    malware: [
      { id: "mal-2", name: "RedLine Infostealer v24", type: "INFOSTEALER" }
    ],
    alerts: [
      { id: "alt-2", message: "Active session hijack tokens detected in open paste channel", level: "ERROR" }
    ],
    recommendations: [
      { id: "rec-3", text: "Enforce immediate SSO token invalidation and password resets for affected identities." }
    ]
  },
  {
    id: "rep-003",
    title: "Scattered Spider Voice-Phishing Campaign Against Cloud Identity Providers",
    status: "CONFIRMED",
    source: { id: "src-3", name: "BreachForums v4", type: "DARKNET_FORUM" },
    category: { id: "cat-3", name: "Social Engineering & Phishing" },
    analyst: { id: "ana-1", name: "Elena Rostova", email: "elena.rostova@cyberthreat.io" },
    createdAt: "2026-09-06T20:00:00Z",
    updatedAt: "2026-09-07T08:30:00Z",
    description: "SIM-swapping and SMS OTP interception targeting IT helpdesk employees to manipulate Okta/Entra ID MFA tokens.",
    indicators: [
      { id: "ind-7", type: "DOMAIN", value: "okta-helpdesk-security-portal.com" },
      { id: "ind-8", type: "IP", value: "194.26.29.112" }
    ],
    malware: [],
    alerts: [
      { id: "alt-3", message: "Multiple helpdesk bypass calls recorded across US tech sectors", level: "WARNING" }
    ],
    recommendations: [
      { id: "rec-4", text: "Require FIDO2 WebAuthn hardware security keys for helpdesk and IAM admins." }
    ]
  },
  {
    id: "rep-004",
    title: "Zero-Day Vulnerability Exploited in Edge Gateway Routers",
    status: "NEW",
    source: { id: "src-4", name: "Exploit.in Underground Marketplace", type: "EXPLOIT_MARKET" },
    category: { id: "cat-4", name: "Zero-Day Exploit" },
    analyst: { id: "ana-3", name: "Sarah Chen", email: "sarah.chen@cyberthreat.io" },
    createdAt: "2026-09-07T21:04:00Z",
    updatedAt: "2026-09-07T21:04:00Z",
    description: "Seller auctioning unauthenticated remote code execution (RCE) chain for Enterprise Edge Gateways for $120,000 in Monero.",
    indicators: [
      { id: "ind-9", type: "IP", value: "45.154.255.87" },
      { id: "ind-10", type: "HASH", value: "a7c81f729b139281a8b9f7126c8e9b4412f9e4215910ab32fec649129841bb23" }
    ],
    malware: [
      { id: "mal-3", name: "DarkGate Shell Loader", type: "LOADER" }
    ],
    alerts: [
      { id: "alt-4", message: "Zero-day weaponized in wild against perimeter appliances", level: "CRITICAL" }
    ],
    recommendations: [
      { id: "rec-5", text: "Disable WAN administration interface on Edge routers immediately." }
    ]
  },
  {
    id: "rep-005",
    title: "SQL Injection Data Dump of Banking Institution Customer Profiles",
    status: "MITIGATED",
    source: { id: "src-3", name: "BreachForums v4", type: "DARKNET_FORUM" },
    category: { id: "cat-2", name: "Data Theft & Credential Leak" },
    analyst: { id: "ana-2", name: "Marcus Vance", email: "marcus.v@cyberthreat.io" },
    createdAt: "2026-09-05T11:20:00Z",
    updatedAt: "2026-09-06T15:00:00Z",
    description: "Dump sample containing 120,000 encrypted customer rows. Key verification indicates database dump occurred in late 2025; vulnerability patched.",
    indicators: [
      { id: "ind-11", type: "URL", value: "https://anonfiles-mirror.net/d/b8a7f92/bank_dump_sample.sql.gz" }
    ],
    malware: [],
    alerts: [
      { id: "alt-5", message: "Historical breach verification completed. No active RCE present.", level: "INFO" }
    ],
    recommendations: [
      { id: "rec-6", text: "Notify customer accounts for password rotation; verify PCI-DSS key revocation." }
    ]
  }
];

export const mockThreatIndicators = [
  { id: "ind-1", reportId: "rep-001", reportTitle: "LockBit 3.0 Ransomware Campaign", type: "HASH", value: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855", confidence: "98%", status: "MALICIOUS", createdAt: "2026-09-07T14:32:00Z" },
  { id: "ind-2", reportId: "rep-001", reportTitle: "LockBit 3.0 Ransomware Campaign", type: "IP", value: "185.220.101.44", confidence: "95%", status: "MALICIOUS", createdAt: "2026-09-07T14:35:00Z" },
  { id: "ind-3", reportId: "rep-001", reportTitle: "LockBit 3.0 Ransomware Campaign", type: "DOMAIN", value: "lockbitapt-v3-c2portal.onion", confidence: "99%", status: "MALICIOUS", createdAt: "2026-09-07T14:40:00Z" },
  { id: "ind-4", reportId: "rep-002", reportTitle: "Russian Underground Paste Telecom", type: "EMAIL", value: "c-suite@telecom-global.eu", confidence: "90%", status: "COMPROMISED", createdAt: "2026-09-07T09:15:00Z" },
  { id: "ind-5", reportId: "rep-002", reportTitle: "Russian Underground Paste Telecom", type: "URL", value: "https://vpn.telecom-global.eu/dana-na/auth/url_default/welcome.cgi", confidence: "85%", status: "SUSPICIOUS", createdAt: "2026-09-07T09:20:00Z" },
  { id: "ind-6", reportId: "rep-002", reportTitle: "Russian Underground Paste Telecom", type: "IP", value: "91.240.118.192", confidence: "92%", status: "MALICIOUS", createdAt: "2026-09-07T09:22:00Z" },
  { id: "ind-7", reportId: "rep-003", reportTitle: "Scattered Spider Voice-Phishing", type: "DOMAIN", value: "okta-helpdesk-security-portal.com", confidence: "96%", status: "MALICIOUS", createdAt: "2026-09-06T20:10:00Z" },
  { id: "ind-8", reportId: "rep-003", reportTitle: "Scattered Spider Voice-Phishing", type: "IP", value: "194.26.29.112", confidence: "94%", status: "MALICIOUS", createdAt: "2026-09-06T20:12:00Z" },
  { id: "ind-9", reportId: "rep-004", reportTitle: "Zero-Day Vulnerability Exploited", type: "IP", value: "45.154.255.87", confidence: "89%", status: "MALICIOUS", createdAt: "2026-09-07T21:05:00Z" },
  { id: "ind-10", reportId: "rep-004", reportTitle: "Zero-Day Vulnerability Exploited", type: "HASH", value: "a7c81f729b139281a8b9f7126c8e9b4412f9e4215910ab32fec649129841bb23", confidence: "97%", status: "MALICIOUS", createdAt: "2026-09-07T21:08:00Z" },
  { id: "ind-11", reportId: "rep-005", reportTitle: "SQL Injection Data Dump", type: "URL", value: "https://anonfiles-mirror.net/d/b8a7f92/bank_dump_sample.sql.gz", confidence: "80%", status: "SUSPICIOUS", createdAt: "2026-09-05T11:22:00Z" },
  { id: "ind-12", reportId: "rep-002", reportTitle: "Russian Underground Paste Telecom", type: "EMAIL", value: "secops-lead@telecom-global.eu", confidence: "91%", status: "COMPROMISED", createdAt: "2026-09-07T09:25:00Z" },
];

export const mockHackerGroups = [
  {
    id: "grp-1",
    name: "LockBit Supporter Cartel (LockBit 3.0)",
    alias: "BitWise Spider",
    origin: "Eastern Europe / CIS",
    motivation: "Financial Extortion (RaaS)",
    status: "ACTIVE",
    targetSectors: ["Healthcare", "Manufacturing", "Critical Infrastructure"],
    activities: [
      { id: "act-1", type: "MALWARE_DEPLOYMENT", details: "Deployment of LockBit Black payloads via PsExec and Group Policy Objects", date: "2026-09-07" },
      { id: "act-2", type: "DATA_THEFT", details: "StealBit utility used to exfiltrate 450GB data via MEGA and SFTP mirrors", date: "2026-09-06" }
    ]
  },
  {
    id: "grp-2",
    name: "Scattered Spider",
    alias: "UNC3944 / Octo Tempest",
    origin: "United States / UK / Canada (Decentralized)",
    motivation: "Financial Extortion, SIM Swapping, Identity Theft",
    status: "ACTIVE",
    targetSectors: ["Technology", "Hospitality", "Identity Providers", "Telecommunications"],
    activities: [
      { id: "act-3", type: "PHISHING", details: "Social engineering IT helpdesks via vishing and fake MFA push fatigue", date: "2026-09-06" },
      { id: "act-4", type: "RECONNAISSANCE", details: "Querying Azure Active Directory and Okta tenant configurations for high-privilege service principals", date: "2026-09-05" }
    ]
  },
  {
    id: "grp-3",
    name: "BlackCat (ALPHV Network)",
    alias: "Noberus",
    origin: "Russian Federation",
    motivation: "Triple Extortion Ransomware",
    status: "REBRANDING",
    targetSectors: ["Finance", "Defense Contractors", "Aviation"],
    activities: [
      { id: "act-5", type: "MALWARE_DEPLOYMENT", details: "Rust-based ransomware executable with configurable privilege escalation routines", date: "2026-08-28" }
    ]
  },
  {
    id: "grp-4",
    name: "APT29 / Cozy Bear",
    alias: "Midnight Blizzard / Nobelium",
    origin: "Russian SVR (State-Sponsored)",
    motivation: "Geopolitical Espionage & Intelligence Gathering",
    status: "ACTIVE",
    targetSectors: ["Government", "Defense", "Think Tanks", "Cloud Providers"],
    activities: [
      { id: "act-6", type: "DATA_THEFT", details: "Exfiltration of executive mailboxes via password spray on unmonitored test accounts", date: "2026-09-01" },
      { id: "act-7", type: "RECONNAISSANCE", details: "Passive port knocking and residential proxy routing against OWA endpoints", date: "2026-08-30" }
    ]
  }
];

export const mockDataLeaks = [
  {
    id: "leak-1",
    title: "Global FinCorp 3.2M Account Record Exfiltration",
    source: "BreachForums Dump #4102",
    leakDate: "2026-09-06",
    recordsCount: 3200000,
    fileSize: "8.4 GB",
    format: "CSV / SQL Dump",
    fieldsExposed: ["Full Name", "Hashed Password (bcrypt)", "Email", "Phone", "SSN / Tax ID", "Billing Address"],
    credentials: [
      { id: "cred-1", email: "finance-director@fincorp-holding.com", maskedPass: "********", hashType: "bcrypt", leakId: "leak-1" },
      { id: "cred-2", email: "devops-admin@fincorp-cloud.io", maskedPass: "********", hashType: "SHA-256", leakId: "leak-1" },
      { id: "cred-3", email: "compliance@fincorp-legal.co.uk", maskedPass: "********", hashType: "bcrypt", leakId: "leak-1" }
    ]
  },
  {
    id: "leak-2",
    title: "EuroHealth Patient Care Diagnostic Portal Leak",
    source: "Telegram @DarkOpsIntel",
    leakDate: "2026-09-04",
    recordsCount: 890000,
    fileSize: "2.1 GB",
    format: "JSON Dump",
    fieldsExposed: ["Patient ID", "Email", "Health Insurance Number", "Prescription Records"],
    credentials: [
      { id: "cred-4", email: "chief-surgeon@eurohealth-clinic.de", maskedPass: "********", hashType: "Argon2id", leakId: "leak-2" },
      { id: "cred-5", email: "admin.records@eurohealth-systems.com", maskedPass: "********", hashType: "MD5", leakId: "leak-2" }
    ]
  },
  {
    id: "leak-3",
    title: "Apex Logistics Supply Chain OAuth API Tokens",
    source: "Darknet Paste Archive",
    leakDate: "2026-09-01",
    recordsCount: 45000,
    fileSize: "450 MB",
    format: "Environment Variables (.env)",
    fieldsExposed: ["AWS_ACCESS_KEY_ID", "STRIPE_SECRET_KEY", "DATABASE_URL", "JWT_SECRET"],
    credentials: [
      { id: "cred-6", email: "root@apex-logistics.net", maskedPass: "********", hashType: "Plaintext Token", leakId: "leak-3" }
    ]
  }
];

export const mockIncidents = [
  {
    id: "inc-101",
    title: "Suspicious Kerberoasting & Domain Controller Sync Failure",
    organization: "National Health Consortium",
    orgId: "org-1",
    reportId: "rep-001",
    status: "IN_PROGRESS",
    severity: "CRITICAL",
    createdAt: "2026-09-07T15:00:00Z",
    assignedAnalyst: "Elena Rostova",
    alerts: [
      { id: "ia-1", message: "SPN ticket requested for krbtgt account by anomalous machine WORKSTATION-941", level: "CRITICAL", timestamp: "2026-09-07T15:05:00Z" },
      { id: "ia-2", message: "Outbound beaconing initiated to 185.220.101.44 over port 443", level: "CRITICAL", timestamp: "2026-09-07T15:18:00Z" }
    ],
    responses: [
      { id: "res-1", analyst: "Elena Rostova", action: "Endpoint host isolated from network via EDR agent.", timestamp: "2026-09-07T15:30:00Z" }
    ]
  },
  {
    id: "inc-102",
    title: "Executive SSO Impersonation & Mail Forwarding Rule Creation",
    organization: "Apex Logistics Global",
    orgId: "org-2",
    reportId: "rep-002",
    status: "CONTAINED",
    severity: "ERROR",
    createdAt: "2026-09-07T10:15:00Z",
    assignedAnalyst: "Marcus Vance",
    alerts: [
      { id: "ia-3", message: "Anomalous login from residential IP in Romania matching infostealer credential drop", level: "ERROR", timestamp: "2026-09-07T10:18:00Z" },
      { id: "ia-4", message: "Inbox rule created: forward all emails with keyword 'invoice' to protonmail.com", level: "WARNING", timestamp: "2026-09-07T10:24:00Z" }
    ],
    responses: [
      { id: "res-2", analyst: "Marcus Vance", action: "Inbox forwarding rule deleted and session tokens revoked in Entra ID.", timestamp: "2026-09-07T10:45:00Z" }
    ]
  },
  {
    id: "inc-103",
    title: "Widespread Vishing Attacks on Enterprise Helpdesk Center",
    organization: "CloudScale Infrastructure Corp",
    orgId: "org-3",
    reportId: "rep-003",
    status: "NOT_STARTED",
    severity: "WARNING",
    createdAt: "2026-09-07T17:40:00Z",
    assignedAnalyst: "Sarah Chen",
    alerts: [
      { id: "ia-5", message: "14 helpdesk tickets submitted requesting emergency MFA resets from spoofed VOIP numbers", level: "WARNING", timestamp: "2026-09-07T17:45:00Z" }
    ],
    responses: []
  },
  {
    id: "inc-104",
    title: "Legacy SQL Server Port 1433 Brute Force Activity",
    organization: "Global FinCorp Bank",
    orgId: "org-4",
    reportId: "rep-005",
    status: "CLOSED",
    severity: "INFO",
    createdAt: "2026-09-05T12:00:00Z",
    assignedAnalyst: "Marcus Vance",
    alerts: [
      { id: "ia-6", message: "Port 1433 blocked by automated IPS perimeter rule", level: "INFO", timestamp: "2026-09-05T12:05:00Z" }
    ],
    responses: [
      { id: "res-3", analyst: "Marcus Vance", action: "Confirmed zero successful authentications; closed as mitigated.", timestamp: "2026-09-05T13:30:00Z" }
    ]
  }
];

export const mockInvestigations = [
  {
    id: "inv-201",
    title: "Forensic Analysis of LockBit 3.0 Dropper Payload",
    reportId: "rep-001",
    status: "IN_PROGRESS",
    analyst: "Elena Rostova",
    createdAt: "2026-09-07T16:00:00Z",
    evidenceList: [
      { id: "ev-1", fileName: "memory_dump_srv-dc01.raw (64GB)", sha256: "8fa21b9...31f", uploadedAt: "2026-09-07T16:20:00Z" },
      { id: "ev-2", fileName: "pcap_perimeter_exfil_traffic.pcapng (1.8GB)", sha256: "14c529a...09d", uploadedAt: "2026-09-07T16:45:00Z" },
      { id: "ev-3", fileName: "quarantined_payload_lockbit_ldr.exe.bin", sha256: "e3b0c44...855", uploadedAt: "2026-09-07T17:10:00Z" }
    ]
  },
  {
    id: "inv-202",
    title: "Telecom SSO Token Replay Attack Reconstruction",
    reportId: "rep-002",
    status: "COMPLETED",
    analyst: "Marcus Vance",
    createdAt: "2026-09-07T11:00:00Z",
    evidenceList: [
      { id: "ev-4", fileName: "redline_infostealer_decrypted_profile.sqlite", sha256: "77a83d...11c", uploadedAt: "2026-09-07T11:30:00Z" },
      { id: "ev-5", fileName: "entra_sign_in_audit_export.json", sha256: "44d90e...76b", uploadedAt: "2026-09-07T11:45:00Z" }
    ]
  },
  {
    id: "inv-203",
    title: "Zero-Day Edge Gateway RCE Exploit Verification",
    reportId: "rep-004",
    status: "OPEN",
    analyst: "Sarah Chen",
    createdAt: "2026-09-07T21:30:00Z",
    evidenceList: [
      { id: "ev-6", fileName: "exploit_sample_exploit_in.py", sha256: "a7c81f...b23", uploadedAt: "2026-09-07T21:40:00Z" }
    ]
  }
];

export const mockMalwareList = [
  {
    id: "mal-1",
    name: "LockBit 3.0 Black Edition",
    type: "RANSOMWARE",
    family: "LockBit Family",
    signature: "Win32/Filecoder.LockBit.V3",
    firstSeen: "2026-08-15",
    threatLevel: "CRITICAL",
    sampleCount: 142
  },
  {
    id: "mal-2",
    name: "RedLine Infostealer v24",
    type: "INFOSTEALER",
    family: "RedLine Family",
    signature: "Trojan.MSIL.RedLineStealer",
    firstSeen: "2026-07-20",
    threatLevel: "HIGH",
    sampleCount: 520
  },
  {
    id: "mal-3",
    name: "DarkGate Shell Loader",
    type: "LOADER",
    family: "DarkGate",
    signature: "Backdoor.DarkGate.Crypter",
    firstSeen: "2026-09-01",
    threatLevel: "HIGH",
    sampleCount: 38
  },
  {
    id: "mal-4",
    name: "Cobalt Strike Beacon 4.9 (Malleable C2)",
    type: "POST_EXPLOIT",
    family: "Cobalt Strike",
    signature: "HackTool.Win32.CobaltStrike",
    firstSeen: "2026-06-10",
    threatLevel: "CRITICAL",
    sampleCount: 890
  }
];

export const mockAuditLogs = [
  { id: "aud-1", admin: "System Admin (Root)", action: "EMERGENCY_ISOLATION_RULE_APPLIED", target: "Firewall Rule Drop 185.220.101.44", createdAt: "2026-09-07T15:35:00Z" },
  { id: "aud-2", admin: "Elena Rostova (Analyst)", action: "THREAT_REPORT_CREATED", target: "Report ID #rep-001 (LockBit 3.0)", createdAt: "2026-09-07T14:32:00Z" },
  { id: "aud-3", admin: "System Security Monitor", action: "CREDENTIAL_LEAK_INGESTED", target: "Breach Dump Global FinCorp (3.2M records)", createdAt: "2026-09-07T12:00:00Z" },
  { id: "aud-4", admin: "Marcus Vance (Analyst)", action: "INCIDENT_STATUS_CHANGED", target: "Incident #inc-102 moved to CONTAINED", createdAt: "2026-09-07T10:45:00Z" },
  { id: "aud-5", admin: "System Admin (Root)", action: "API_KEY_ROTATED", target: "Shodan / Darknet Crawler Daemon API Key", createdAt: "2026-09-07T08:00:00Z" },
  { id: "aud-6", admin: "Sarah Chen (Analyst)", action: "IOC_EXCLUSION_UPDATED", target: "Whitelisted internal SIEM monitoring IP 10.0.4.12", createdAt: "2026-09-06T19:22:00Z" }
];

export const mockAccessLogs = [
  { id: "acc-1", user: "elena.rostova@cyberthreat.io", role: "ANALYST", ip: "10.100.2.14", status: "ACTIVE", loginTime: "2026-09-07T08:02:14Z" },
  { id: "acc-2", user: "marcus.v@cyberthreat.io", role: "ANALYST", ip: "10.100.2.19", status: "ACTIVE", loginTime: "2026-09-07T08:15:30Z" },
  { id: "acc-3", user: "sarah.chen@cyberthreat.io", role: "ANALYST", ip: "10.100.2.22", status: "ACTIVE", loginTime: "2026-09-07T09:00:00Z" },
  { id: "acc-4", user: "root-admin@cyberthreat.io", role: "ADMIN", ip: "10.100.0.1", status: "ACTIVE", loginTime: "2026-09-07T07:45:11Z" },
  { id: "acc-5", user: "external-auditor@pci-compliance.eu", role: "AUDITOR", ip: "194.105.12.8", status: "SUSPENDED", loginTime: "2026-09-06T23:14:02Z" }
];
