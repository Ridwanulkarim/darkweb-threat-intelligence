# API Functions Documentation

This document outlines all database models and their relationships in the Dark Web Threat Intelligence system.

## Enums

### Role
- `ADMIN` - Administrator role with full system access
- `ANALYST` - Security analyst role for threat analysis
- `MANAGER` - Manager role for oversight

### Status
- `ACTIVE` - Account or resource is active
- `INACTIVE` - Account or resource is inactive
- `SUSPENDED` - Account temporarily suspended
- `BANNED` - Account permanently banned

### ThreatStatus
- `NEW` - Newly reported threat
- `INVESTIGATING` - Threat under investigation
- `CONFIRMED` - Threat confirmed
- `FALSE_POSITIVE` - Threat determined to be false alarm
- `MITIGATED` - Threat mitigated
- `CLOSED` - Threat investigation closed

### AlertLevel
- `INFO` - Informational alert
- `WARNING` - Warning alert
- `ERROR` - Error alert
- `CRITICAL` - Critical alert requiring immediate action

### ResponseStatus
- `NOT_STARTED` - Incident response not started
- `IN_PROGRESS` - Response in progress
- `CONTAINED` - Threat contained
- `ERADICATED` - Threat eradicated
- `RECOVERED` - System recovered
- `CLOSED` - Incident closed

### InvestigationStatus
- `OPEN` - Investigation open
- `IN_PROGRESS` - Investigation in progress
- `COMPLETED` - Investigation completed
- `CLOSED` - Investigation closed

### ActivityType
- `RECONNAISSANCE` - Reconnaissance activity
- `PHISHING` - Phishing attack activity
- `MALWARE_DEPLOYMENT` - Malware deployment activity
- `DATA_THEFT` - Data theft activity

### IndicatorType
- `IP` - IP address indicator
- `DOMAIN` - Domain indicator
- `URL` - URL indicator
- `EMAIL` - Email address indicator
- `HASH` - File hash indicator

---

## Data Models (25 Total)

### Admin
Administrative user account for system management.

**Fields:**
- `id` (UUID) - Primary key
- `name` (String) - Admin name
- `email` (String, Unique) - Admin email address
- `password` (String) - Hashed password
- `status` (Status) - Account status (default: ACTIVE)
- `createdAt` (DateTime) - Creation timestamp
- `updatedAt` (DateTime) - Last update timestamp

**Relations:**
- `auditLogs` - One-to-many with AuditLog

---

### Analyst
Security analyst account for threat analysis and reporting.

**Fields:**
- `id` (UUID) - Primary key
- `name` (String) - Analyst name
- `email` (String, Unique) - Analyst email address
- `role` (Role) - Analyst role (default: ANALYST)
- `status` (Status) - Account status (default: ACTIVE)
- `createdAt` (DateTime) - Creation timestamp
- `updatedAt` (DateTime) - Last update timestamp

**Relations:**
- `responses` - One-to-many with IncidentResponse
- `investigations` - One-to-many with Investigation
- `reports` - One-to-many with ThreatReport

---

### Organization
Organization account representing customer entities.

**Fields:**
- `id` (UUID) - Primary key
- `name` (String, Unique) - Organization name
- `country` (String) - Organization country
- `isDeleted` (Boolean) - Soft delete flag (default: false)
- `deletedAt` (DateTime) - Soft delete timestamp
- `createdAt` (DateTime) - Creation timestamp
- `updatedAt` (DateTime) - Last update timestamp

**Relations:**
- `incidents` - One-to-many with Incident
- `users` - One-to-many with UserAccount

---

### UserAccount
User account associated with an organization.

**Fields:**
- `id` (UUID) - Primary key
- `orgId` (String, Foreign Key) - Organization ID
- `email` (String, Unique) - User email address
- `password` (String) - Hashed password
- `status` (Status) - Account status (default: ACTIVE)
- `createdAt` (DateTime) - Creation timestamp
- `updatedAt` (DateTime) - Last update timestamp

**Relations:**
- `organization` - Many-to-one with Organization
- `accessLogs` - One-to-many with AccessLog

**Indexes:**
- `orgId`

---

### AccessLog
Login and access tracking for user accounts.

**Fields:**
- `id` (UUID) - Primary key
- `userId` (String, Foreign Key) - User ID
- `loginTime` (DateTime) - Login timestamp (default: now)
- `status` (Status) - Login status
- `createdAt` (DateTime) - Creation timestamp

**Relations:**
- `user` - Many-to-one with UserAccount

**Indexes:**
- `userId`

---

### AuditLog
Audit trail for admin actions.

**Fields:**
- `id` (UUID) - Primary key
- `adminId` (String, Foreign Key) - Admin ID
- `action` (String) - Action performed
- `createdAt` (DateTime) - Creation timestamp

**Relations:**
- `admin` - Many-to-one with Admin

**Indexes:**
- `adminId`

---

### ThreatSource
Source of threat intelligence.

**Fields:**
- `id` (UUID) - Primary key
- `name` (String) - Source name
- `type` (String) - Source type
- `createdAt` (DateTime) - Creation timestamp
- `updatedAt` (DateTime) - Last update timestamp

**Relations:**
- `reports` - One-to-many with ThreatReport

---

### ThreatCategory
Category classification for threats.

**Fields:**
- `id` (UUID) - Primary key
- `name` (String) - Category name
- `createdAt` (DateTime) - Creation timestamp
- `updatedAt` (DateTime) - Last update timestamp

**Relations:**
- `reports` - One-to-many with ThreatReport

---

### ThreatReport
Main threat report containing threat intelligence data.

**Fields:**
- `id` (UUID) - Primary key
- `sourceId` (String, Foreign Key) - Threat source ID
- `categoryId` (String, Foreign Key) - Threat category ID
- `analystId` (String, Foreign Key) - Analyst ID
- `title` (String) - Report title
- `status` (ThreatStatus) - Threat status (default: NEW)
- `isDeleted` (Boolean) - Soft delete flag (default: false)
- `deletedAt` (DateTime) - Soft delete timestamp
- `createdAt` (DateTime) - Creation timestamp
- `updatedAt` (DateTime) - Last update timestamp

**Relations:**
- `dataLeaks` - One-to-many with DataLeak
- `hackerGroupActivities` - One-to-many with HackerGroupActivity
- `incidents` - One-to-many with Incident
- `investigations` - One-to-many with Investigation
- `malware` - One-to-many with Malware
- `phishingAttacks` - One-to-many with PhishingAttack
- `securityRecommendations` - One-to-many with SecurityRecommendation
- `alerts` - One-to-many with ThreatAlert
- `indicators` - One-to-many with ThreatIndicator
- `analyst` - Many-to-one with Analyst
- `category` - Many-to-one with ThreatCategory
- `source` - Many-to-one with ThreatSource

**Indexes:**
- `sourceId`
- `categoryId`
- `analystId`
- `status`

---

### ThreatIndicator
IOC (Indicator of Compromise) for threats.

**Fields:**
- `id` (UUID) - Primary key
- `reportId` (String, Foreign Key) - Threat report ID
- `type` (IndicatorType) - Indicator type (IP, DOMAIN, URL, EMAIL, HASH)
- `value` (String) - Indicator value
- `createdAt` (DateTime) - Creation timestamp
- `updatedAt` (DateTime) - Last update timestamp

**Relations:**
- `report` - Many-to-one with ThreatReport

**Unique Constraint:**
- `reportId`, `type`, `value` (composite unique)

---

### Malware
Malware information associated with threat reports.

**Fields:**
- `id` (UUID) - Primary key
- `reportId` (String, Foreign Key) - Threat report ID
- `name` (String) - Malware name
- `type` (String) - Malware type
- `createdAt` (DateTime) - Creation timestamp
- `updatedAt` (DateTime) - Last update timestamp

**Relations:**
- `report` - Many-to-one with ThreatReport
- `malwareFamilyMaps` - One-to-many with MalwareFamilyMap

**Unique Constraint:**
- `reportId`, `name`, `type` (composite unique)

---

### MalwareFamily
Classification family for malware strains.

**Fields:**
- `id` (UUID) - Primary key
- `name` (String) - Family name
- `createdAt` (DateTime) - Creation timestamp
- `updatedAt` (DateTime) - Last update timestamp

**Relations:**
- `maps` - One-to-many with MalwareFamilyMap

---

### MalwareFamilyMap
Junction table linking malware to families.

**Fields:**
- `id` (UUID) - Primary key
- `malwareId` (String, Foreign Key) - Malware ID
- `familyId` (String, Foreign Key) - Malware family ID
- `createdAt` (DateTime) - Creation timestamp

**Relations:**
- `family` - Many-to-one with MalwareFamily
- `malware` - Many-to-one with Malware

---

### PhishingAttack
Phishing attack information.

**Fields:**
- `id` (UUID) - Primary key
- `reportId` (String, Foreign Key) - Threat report ID
- `url` (String) - Phishing URL
- `createdAt` (DateTime) - Creation timestamp

**Relations:**
- `report` - Many-to-one with ThreatReport

---

### DataLeak
Data breach/leak information.

**Fields:**
- `id` (UUID) - Primary key
- `reportId` (String, Foreign Key) - Threat report ID
- `title` (String) - Leak title
- `createdAt` (DateTime) - Creation timestamp

**Relations:**
- `report` - Many-to-one with ThreatReport
- `credentials` - One-to-many with LeakedCredential

---

### LeakedCredential
Individual leaked credentials from data breaches.

**Fields:**
- `id` (UUID) - Primary key
- `leakId` (String, Foreign Key) - Data leak ID
- `email` (String) - Leaked email address
- `createdAt` (DateTime) - Creation timestamp

**Relations:**
- `leak` - Many-to-one with DataLeak

---

### HackerGroup
Threat actor group/organization.

**Fields:**
- `id` (UUID) - Primary key
- `name` (String) - Group name
- `createdAt` (DateTime) - Creation timestamp

**Relations:**
- `activities` - One-to-many with HackerGroupActivity

---

### HackerGroupActivity
Activity record for hacker groups.

**Fields:**
- `id` (UUID) - Primary key
- `groupId` (String, Foreign Key) - Hacker group ID
- `reportId` (String, Foreign Key) - Threat report ID
- `type` (ActivityType) - Activity type (RECONNAISSANCE, PHISHING, MALWARE_DEPLOYMENT, DATA_THEFT)
- `createdAt` (DateTime) - Creation timestamp

**Relations:**
- `group` - Many-to-one with HackerGroup
- `report` - Many-to-one with ThreatReport

---

### Incident
Security incident record.

**Fields:**
- `id` (UUID) - Primary key
- `orgId` (String, Foreign Key) - Organization ID
- `reportId` (String, Foreign Key) - Threat report ID
- `status` (ResponseStatus) - Incident response status
- `createdAt` (DateTime) - Creation timestamp

**Relations:**
- `organization` - Many-to-one with Organization
- `report` - Many-to-one with ThreatReport
- `alerts` - One-to-many with IncidentAlert
- `responses` - One-to-many with IncidentResponse

**Indexes:**
- `orgId`
- `reportId`
- `status`

---

### IncidentResponse
Response action to an incident.

**Fields:**
- `id` (UUID) - Primary key
- `incidentId` (String, Foreign Key) - Incident ID
- `analystId` (String, Foreign Key) - Analyst ID
- `createdAt` (DateTime) - Creation timestamp

**Relations:**
- `analyst` - Many-to-one with Analyst
- `incident` - Many-to-one with Incident

---

### IncidentAlert
Alert generated for an incident.

**Fields:**
- `id` (UUID) - Primary key
- `incidentId` (String, Foreign Key) - Incident ID
- `message` (String) - Alert message
- `level` (AlertLevel) - Alert severity level (INFO, WARNING, ERROR, CRITICAL)
- `createdAt` (DateTime) - Creation timestamp

**Relations:**
- `incident` - Many-to-one with Incident

---

### ThreatAlert
Alert generated for a threat report.

**Fields:**
- `id` (UUID) - Primary key
- `reportId` (String, Foreign Key) - Threat report ID
- `message` (String) - Alert message
- `level` (AlertLevel) - Alert severity level (INFO, WARNING, ERROR, CRITICAL)
- `createdAt` (DateTime) - Creation timestamp

**Relations:**
- `report` - Many-to-one with ThreatReport

---

### SecurityRecommendation
Security recommendation associated with threat reports.

**Fields:**
- `id` (UUID) - Primary key
- `reportId` (String, Foreign Key) - Threat report ID
- `text` (String) - Recommendation text
- `createdAt` (DateTime) - Creation timestamp

**Relations:**
- `report` - Many-to-one with ThreatReport

---

### Investigation
Threat investigation record.

**Fields:**
- `id` (UUID) - Primary key
- `reportId` (String, Foreign Key) - Threat report ID
- `analystId` (String, Foreign Key) - Analyst ID
- `status` (InvestigationStatus) - Investigation status (OPEN, IN_PROGRESS, COMPLETED, CLOSED)
- `createdAt` (DateTime) - Creation timestamp

**Relations:**
- `evidences` - One-to-many with Evidence
- `analyst` - Many-to-one with Analyst
- `report` - Many-to-one with ThreatReport

---

### Evidence
Evidence file associated with investigations.

**Fields:**
- `id` (UUID) - Primary key
- `investigationId` (String, Foreign Key) - Investigation ID
- `fileName` (String) - Evidence file name
- `createdAt` (DateTime) - Creation timestamp

**Relations:**
- `investigation` - Many-to-one with Investigation

---

## Relationships Summary

### One-to-Many Relationships
- Admin → AuditLog
- Analyst → IncidentResponse, Investigation, ThreatReport
- Organization → Incident, UserAccount
- UserAccount → AccessLog
- ThreatSource → ThreatReport
- ThreatCategory → ThreatReport
- ThreatReport → DataLeak, HackerGroupActivity, Incident, Investigation, Malware, PhishingAttack, SecurityRecommendation, ThreatAlert, ThreatIndicator
- Malware → MalwareFamilyMap
- MalwareFamily → MalwareFamilyMap
- HackerGroup → HackerGroupActivity
- Incident → IncidentAlert, IncidentResponse
- Investigation → Evidence
- DataLeak → LeakedCredential

### Many-to-One Relationships
- AuditLog → Admin
- UserAccount → Organization
- AccessLog → UserAccount
- ThreatReport → Analyst, ThreatCategory, ThreatSource
- ThreatIndicator → ThreatReport
- Malware → ThreatReport
- MalwareFamilyMap → Malware, MalwareFamily
- PhishingAttack → ThreatReport
- DataLeak → ThreatReport
- LeakedCredential → DataLeak
- HackerGroupActivity → HackerGroup, ThreatReport
- Incident → Organization, ThreatReport
- IncidentResponse → Analyst, Incident
- IncidentAlert → Incident
- ThreatAlert → ThreatReport
- SecurityRecommendation → ThreatReport
- Investigation → Analyst, ThreatReport
- Evidence → Investigation

---

## Key Design Patterns

1. **Soft Deletes**: ThreatReport and Organization use soft delete pattern with `isDeleted` and `deletedAt` fields
2. **Cascade Deletes**: All foreign key relationships use onDelete: Cascade
3. **Timestamps**: All models include `createdAt` and `updatedAt` for audit trail
4. **Composite Unique Constraints**: ThreatIndicator and Malware use composite unique constraints
5. **Indexing**: Critical foreign keys and filter fields are indexed for query performance
6. **UUID Primary Keys**: All models use UUID for distributed system compatibility
