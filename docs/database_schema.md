# Database Schema Summary

This document summarizes enums, models, key fields, and relations extracted from `prisma/schema.prisma`.

Enums
- Role: ADMIN, ANALYST, MANAGER
- Status: ACTIVE, INACTIVE, SUSPENDED, BANNED
- ThreatStatus: NEW, INVESTIGATING, CONFIRMED, FALSE_POSITIVE, MITIGATED, CLOSED
- AlertLevel: INFO, WARNING, ERROR, CRITICAL
- ResponseStatus: NOT_STARTED, IN_PROGRESS, CONTAINED, ERADICATED, RECOVERED, CLOSED
- InvestigationStatus: OPEN, IN_PROGRESS, COMPLETED, CLOSED
- ActivityType: RECONNAISSANCE, PHISHING, MALWARE_DEPLOYMENT, DATA_THEFT
- IndicatorType: IP, DOMAIN, URL, EMAIL, HASH

Models (25 total) — concise view
- Admin: `id (PK)`, `name`, `email (unique)`, `password`, `status`, timestamps; relations: `auditLogs`.
- Analyst: `id (PK)`, `name`, `email (unique)`, `role`, `status`, timestamps; relations: `responses`, `investigations`, `reports`.
- Organization: `id (PK)`, `name (unique)`, `country`, soft-delete fields, timestamps; relations: `incidents`, `users`.
- UserAccount: `id (PK)`, `orgId (FK) -> Organization.id`, `email (unique)`, `password`, `status`, timestamps; relations: `accessLogs`.
- AccessLog: `id (PK)`, `userId (FK) -> UserAccount.id`, `loginTime`, `status`, timestamp.
- AuditLog: `id (PK)`, `adminId (FK) -> Admin.id`, `action`, timestamp.
- ThreatSource: `id (PK)`, `name`, `type`, timestamps; relations: `reports`.
- ThreatCategory: `id (PK)`, `name`, timestamps; relations: `reports`.
- ThreatReport: `id (PK)`, `sourceId (FK)`, `categoryId (FK)`, `analystId (FK)`, `title`, `status`, soft-delete fields, timestamps; relations: `dataLeaks`, `hackerGroupActivities`, `incidents`, `investigations`, `malware`, `phishingAttacks`, `securityRecommendations`, `alerts`, `indicators`.
- ThreatIndicator: `id (PK)`, `reportId (FK) -> ThreatReport.id`, `type`, `value`, timestamps; unique constraint: (reportId, type, value).
- Malware: `id (PK)`, `reportId (FK)`, `name`, `type`, timestamps; unique constraint: (reportId, name, type); relations: `malwareFamilyMaps`.
- MalwareFamily: `id (PK)`, `name`, timestamps; relations: `maps`.
- MalwareFamilyMap: `id (PK)`, `malwareId (FK) -> Malware.id`, `familyId (FK) -> MalwareFamily.id`, timestamp.
- PhishingAttack: `id (PK)`, `reportId (FK)`, `url`, timestamp.
- DataLeak: `id (PK)`, `reportId (FK)`, `title`, timestamp; relations: `credentials`.
- LeakedCredential: `id (PK)`, `leakId (FK) -> DataLeak.id`, `email`, timestamp.
- HackerGroup: `id (PK)`, `name`, timestamp; relations: `activities`.
- HackerGroupActivity: `id (PK)`, `groupId (FK) -> HackerGroup.id`, `reportId (FK) -> ThreatReport.id`, `type`, timestamp.
- Incident: `id (PK)`, `orgId (FK) -> Organization.id`, `reportId (FK) -> ThreatReport.id`, `status`, timestamp; relations: `alerts`, `responses`.
- IncidentResponse: `id (PK)`, `incidentId (FK) -> Incident.id`, `analystId (FK) -> Analyst.id`, timestamp.
- IncidentAlert: `id (PK)`, `incidentId (FK) -> Incident.id`, `message`, `level`, timestamp.
- ThreatAlert: `id (PK)`, `reportId (FK) -> ThreatReport.id`, `message`, `level`, timestamp.
- SecurityRecommendation: `id (PK)`, `reportId (FK) -> ThreatReport.id`, `text`, timestamp.
- Investigation: `id (PK)`, `reportId (FK) -> ThreatReport.id`, `analystId (FK) -> Analyst.id`, `status`, timestamp; relations: `evidences`.
- Evidence: `id (PK)`, `investigationId (FK) -> Investigation.id`, `fileName`, timestamp.

Indexes and constraints of note
- Several indexes on foreign keys (orgId, userId, adminId, sourceId, categoryId, analystId, reportId, status fields).
- Composite uniques: `ThreatIndicator(reportId,type,value)`, `Malware(reportId,name,type)`.

Usage notes
- Primary keys use UUID defaults. Many relations use `onDelete: Cascade` semantics in the Prisma schema.
- Soft-deletes are used on `Organization` and `ThreatReport` (`isDeleted`, `deletedAt`).

If you'd like, I can also generate a visual DBML diagram (SVG/PNG) or export this summary to `docs/schema_diagram.md` with an embedded image (requires an external renderer).

