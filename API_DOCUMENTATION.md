# Dark Web Threat Intelligence API Documentation

## Overview
Comprehensive REST API for managing dark web threat intelligence, incidents, and security analysis.

**Base URL**: `http://localhost:3000/api`  
**API Version**: 1.0.0  
**Authentication**: JWT Bearer Token

---

## Authentication

### Login Endpoints

#### Admin Login
```
POST /admin/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "password123"
}

Response:
{
  "status": 200,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "admin": {
      "id": "uuid",
      "email": "admin@example.com"
    }
  }
}
```

#### Analyst Login
```
POST /analyst/login
Content-Type: application/json

{
  "email": "analyst@example.com",
  "password": "password123"
}

Response:
{
  "status": 200,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "analyst": {
      "id": "uuid",
      "email": "analyst@example.com",
      "role": "ANALYST"
    }
  }
}
```

### Using Authentication
Include JWT token in Authorization header:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

---

## Admin Management

### Create Admin
```
POST /api/admin
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123",
  "status": "ACTIVE"
}
```

### Get All Admins
```
GET /api/admin?page=1&limit=10
Authorization: Bearer {token}
```

### Get Admin by ID
```
GET /api/admin/{id}
Authorization: Bearer {token}
```

### Update Admin
```
PUT /api/admin/{id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Jane Doe",
  "status": "ACTIVE"
}
```

### Delete Admin
```
DELETE /api/admin/{id}
Authorization: Bearer {token}
```

### Get Audit Logs
```
GET /api/admin/{id}/audit-logs
Authorization: Bearer {token}
```

---

## Analyst Management

### Create Analyst
```
POST /api/analyst
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Security Analyst",
  "email": "analyst@example.com",
  "password": "password123",
  "role": "ANALYST",
  "status": "ACTIVE"
}
```

### Get All Analysts
```
GET /api/analyst?page=1&limit=10&role=ANALYST&status=ACTIVE
Authorization: Bearer {token}
```

### Get Analyst by ID
```
GET /api/analyst/{id}
Authorization: Bearer {token}
```

### Update Analyst
```
PUT /api/analyst/{id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Updated Name",
  "status": "ACTIVE"
}
```

### Delete Analyst
```
DELETE /api/analyst/{id}
Authorization: Bearer {token}
```

---

## Organization Management

### Create Organization
```
POST /api/organizations
Content-Type: application/json

{
  "name": "ACME Corporation",
  "country": "United States"
}
```

### Get All Organizations
```
GET /api/organizations?page=1&limit=10
```

### Get Organization by ID
```
GET /api/organizations/{id}
```

### Update Organization
```
PUT /api/organizations/{id}
Content-Type: application/json

{
  "name": "ACME Corp Updated",
  "country": "Canada"
}
```

### Delete Organization (Soft Delete)
```
DELETE /api/organizations/{id}
```

---

## User Account Management

### Create User
```
POST /api/users
Content-Type: application/json

{
  "orgId": "org-uuid",
  "email": "user@example.com",
  "password": "password123",
  "status": "ACTIVE"
}
```

### Get All Users
```
GET /api/users?page=1&limit=10&orgId=org-uuid&status=ACTIVE
```

### Get User by ID
```
GET /api/users/{id}
```

### Update User
```
PUT /api/users/{id}
Content-Type: application/json

{
  "email": "newemail@example.com",
  "status": "ACTIVE"
}
```

### Delete User
```
DELETE /api/users/{id}
```

---

## Threat Reports

### Create Threat Report
```
POST /api/threat-reports
Content-Type: application/json

{
  "sourceId": "source-uuid",
  "categoryId": "category-uuid",
  "analystId": "analyst-uuid",
  "title": "Critical Malware Detection",
  "status": "NEW"
}
```

### Get All Reports
```
GET /api/threat-reports?page=1&limit=10&status=NEW&sourceId=source-uuid&categoryId=category-uuid
```

### Get Report by ID
```
GET /api/threat-reports/{id}
```

### Update Report
```
PUT /api/threat-reports/{id}
Content-Type: application/json

{
  "status": "INVESTIGATING",
  "title": "Updated Title"
}
```

### Delete Report
```
DELETE /api/threat-reports/{id}
```

---

## Threat Indicators

### Create Indicator
```
POST /api/threat-indicators
Content-Type: application/json

{
  "reportId": "report-uuid",
  "type": "IP",
  "value": "192.168.1.1"
}
```

Types: `IP`, `DOMAIN`, `URL`, `EMAIL`, `HASH`

### Get All Indicators
```
GET /api/threat-indicators?page=1&limit=10&type=IP&reportId=report-uuid
```

### Get Indicator by ID
```
GET /api/threat-indicators/{id}
```

### Update Indicator
```
PUT /api/threat-indicators/{id}
Content-Type: application/json

{
  "value": "192.168.1.2"
}
```

### Delete Indicator
```
DELETE /api/threat-indicators/{id}
```

---

## Malware Management

### Create Malware
```
POST /api/malware
Content-Type: application/json

{
  "reportId": "report-uuid",
  "name": "Trojan.Generic",
  "type": "Trojan"
}
```

### Get All Malware
```
GET /api/malware?page=1&limit=10&type=Trojan&reportId=report-uuid
```

### Get Malware by ID
```
GET /api/malware/{id}
```

### Update Malware
```
PUT /api/malware/{id}
Content-Type: application/json

{
  "name": "Trojan.Updated",
  "type": "Trojan"
}
```

### Delete Malware
```
DELETE /api/malware/{id}
```

---

## Malware Families

### Create Malware Family
```
POST /api/malware-families
Content-Type: application/json

{
  "name": "Emotet Family"
}
```

### Get All Families
```
GET /api/malware-families?page=1&limit=10
```

### Get Family by ID
```
GET /api/malware-families/{id}
```

### Update Family
```
PUT /api/malware-families/{id}
Content-Type: application/json

{
  "name": "Updated Family Name"
}
```

### Delete Family
```
DELETE /api/malware-families/{id}
```

---

## Phishing Attacks

### Create Phishing Attack
```
POST /api/phishing-attacks
Content-Type: application/json

{
  "reportId": "report-uuid",
  "url": "https://malicious-domain.com/phishing"
}
```

### Get All Phishing Attacks
```
GET /api/phishing-attacks?page=1&limit=10&reportId=report-uuid
```

### Get Attack by ID
```
GET /api/phishing-attacks/{id}
```

### Delete Attack
```
DELETE /api/phishing-attacks/{id}
```

---

## Data Leaks

### Create Data Leak
```
POST /api/data-leaks
Content-Type: application/json

{
  "reportId": "report-uuid",
  "title": "Credentials Leaked - Enterprise Database"
}
```

### Get All Leaks
```
GET /api/data-leaks?page=1&limit=10&reportId=report-uuid
```

### Get Leak by ID
```
GET /api/data-leaks/{id}
```

### Delete Leak
```
DELETE /api/data-leaks/{id}
```

---

## Leaked Credentials

### Create Leaked Credential
```
POST /api/leaked-credentials
Content-Type: application/json

{
  "leakId": "leak-uuid",
  "email": "user@example.com"
}
```

### Get All Credentials
```
GET /api/leaked-credentials?page=1&limit=10&leakId=leak-uuid
```

### Get Credential by ID
```
GET /api/leaked-credentials/{id}
```

### Delete Credential
```
DELETE /api/leaked-credentials/{id}
```

---

## Hacker Groups

### Create Hacker Group
```
POST /api/hacker-groups
Content-Type: application/json

{
  "name": "APT28"
}
```

### Get All Groups
```
GET /api/hacker-groups?page=1&limit=10
```

### Get Group by ID
```
GET /api/hacker-groups/{id}
```

### Update Group
```
PUT /api/hacker-groups/{id}
Content-Type: application/json

{
  "name": "APT28 Updated"
}
```

### Delete Group
```
DELETE /api/hacker-groups/{id}
```

---

## Hacker Group Activities

### Create Activity
```
POST /api/hacker-activities
Content-Type: application/json

{
  "groupId": "group-uuid",
  "reportId": "report-uuid",
  "type": "RECONNAISSANCE"
}
```

Types: `RECONNAISSANCE`, `PHISHING`, `MALWARE_DEPLOYMENT`, `DATA_THEFT`

### Get All Activities
```
GET /api/hacker-activities?page=1&limit=10&groupId=group-uuid&type=RECONNAISSANCE
```

### Get Activity by ID
```
GET /api/hacker-activities/{id}
```

### Delete Activity
```
DELETE /api/hacker-activities/{id}
```

---

## Incidents

### Create Incident
```
POST /api/incidents
Content-Type: application/json

{
  "orgId": "org-uuid",
  "reportId": "report-uuid",
  "status": "NOT_STARTED"
}
```

Status: `NOT_STARTED`, `IN_PROGRESS`, `CONTAINED`, `ERADICATED`, `RECOVERED`, `CLOSED`

### Get All Incidents
```
GET /api/incidents?page=1&limit=10&status=IN_PROGRESS&orgId=org-uuid
```

### Get Incident by ID
```
GET /api/incidents/{id}
```

### Update Incident
```
PUT /api/incidents/{id}
Content-Type: application/json

{
  "status": "CONTAINED"
}
```

### Delete Incident
```
DELETE /api/incidents/{id}
```

---

## Incident Responses

### Create Response
```
POST /api/incident-responses
Content-Type: application/json

{
  "incidentId": "incident-uuid",
  "analystId": "analyst-uuid"
}
```

### Get All Responses
```
GET /api/incident-responses?page=1&limit=10&incidentId=incident-uuid
```

### Get Response by ID
```
GET /api/incident-responses/{id}
```

### Delete Response
```
DELETE /api/incident-responses/{id}
```

---

## Incident Alerts

### Create Alert
```
POST /api/incident-alerts
Content-Type: application/json

{
  "incidentId": "incident-uuid",
  "message": "Critical compromise detected",
  "level": "CRITICAL"
}
```

Levels: `INFO`, `WARNING`, `ERROR`, `CRITICAL`

### Get All Alerts
```
GET /api/incident-alerts?page=1&limit=10&incidentId=incident-uuid&level=CRITICAL
```

### Get Alert by ID
```
GET /api/incident-alerts/{id}
```

### Delete Alert
```
DELETE /api/incident-alerts/{id}
```

---

## Threat Alerts

### Create Threat Alert
```
POST /api/threat-alerts
Content-Type: application/json

{
  "reportId": "report-uuid",
  "message": "High-risk threat detected",
  "level": "CRITICAL"
}
```

### Get All Threat Alerts
```
GET /api/threat-alerts?page=1&limit=10&reportId=report-uuid&level=CRITICAL
```

### Get Alert by ID
```
GET /api/threat-alerts/{id}
```

### Delete Alert
```
DELETE /api/threat-alerts/{id}
```

---

## Security Recommendations

### Create Recommendation
```
POST /api/security-recommendations
Content-Type: application/json

{
  "reportId": "report-uuid",
  "text": "Implement multi-factor authentication"
}
```

### Get All Recommendations
```
GET /api/security-recommendations?page=1&limit=10&reportId=report-uuid
```

### Get Recommendation by ID
```
GET /api/security-recommendations/{id}
```

### Delete Recommendation
```
DELETE /api/security-recommendations/{id}
```

---

## Investigations

### Create Investigation
```
POST /api/investigations
Content-Type: application/json

{
  "reportId": "report-uuid",
  "analystId": "analyst-uuid",
  "status": "OPEN"
}
```

Status: `OPEN`, `IN_PROGRESS`, `COMPLETED`, `CLOSED`

### Get All Investigations
```
GET /api/investigations?page=1&limit=10&status=IN_PROGRESS&analystId=analyst-uuid
```

### Get Investigation by ID
```
GET /api/investigations/{id}
```

### Update Investigation
```
PUT /api/investigations/{id}
Content-Type: application/json

{
  "status": "COMPLETED"
}
```

### Delete Investigation
```
DELETE /api/investigations/{id}
```

---

## Evidence

### Create Evidence
```
POST /api/evidence
Content-Type: application/json

{
  "investigationId": "investigation-uuid",
  "fileName": "malware_sample.exe"
}
```

### Get All Evidence
```
GET /api/evidence?page=1&limit=10&investigationId=investigation-uuid
```

### Get Evidence by ID
```
GET /api/evidence/{id}
```

### Delete Evidence
```
DELETE /api/evidence/{id}
```

---

## Threat Sources

### Create Source
```
POST /api/threat-sources
Content-Type: application/json

{
  "name": "Dark Web Forum",
  "type": "Forum"
}
```

### Get All Sources
```
GET /api/threat-sources?page=1&limit=10
```

### Get Source by ID
```
GET /api/threat-sources/{id}
```

### Update Source
```
PUT /api/threat-sources/{id}
Content-Type: application/json

{
  "name": "Updated Source Name"
}
```

### Delete Source
```
DELETE /api/threat-sources/{id}
```

---

## Threat Categories

### Create Category
```
POST /api/threat-categories
Content-Type: application/json

{
  "name": "Malware"
}
```

### Get All Categories
```
GET /api/threat-categories?page=1&limit=10
```

### Get Category by ID
```
GET /api/threat-categories/{id}
```

### Update Category
```
PUT /api/threat-categories/{id}
Content-Type: application/json

{
  "name": "Advanced Malware"
}
```

### Delete Category
```
DELETE /api/threat-categories/{id}
```

---

## Health Check

```
GET /health

Response:
{
  "status": "OK",
  "timestamp": "2026-07-06T10:30:00Z"
}
```

---

## Response Format

### Success Response
```json
{
  "status": 200,
  "message": "Success message",
  "data": {}
}
```

### Error Response
```json
{
  "status": 500,
  "code": "ERROR",
  "message": "Error message",
  "timestamp": "2026-07-06T10:30:00Z"
}
```

---

## HTTP Status Codes
- `200 OK` - Successful request
- `201 Created` - Resource created successfully
- `400 Bad Request` - Invalid request
- `401 Unauthorized` - Missing or invalid token
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error

---

## Pagination
Use `page` and `limit` query parameters:
- `?page=1&limit=10` (page 1, 10 items per page)
- `?page=2&limit=20` (page 2, 20 items per page)

---

## Environment Variables
Create `.env` file:
```
DATABASE_URL=postgresql://user:password@localhost:5432/threatdb
PORT=3000
JWT_SECRET=your-secret-key
DEBUG=false
```
