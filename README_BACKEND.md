# Dark Web Threat Intelligence API - Backend

A comprehensive Node.js/Express REST API for managing dark web threat intelligence, security incidents, and forensic investigations.

## Features

✅ **Complete CRUD Operations** - All 25 database models with full CRUD endpoints
✅ **Role-Based Access Control** - Admin and Analyst roles with middleware protection
✅ **Threat Intelligence Management** - Track reports, indicators, malware, phishing, and data leaks
✅ **Incident Response** - Manage security incidents with status tracking and responses
✅ **Investigation Framework** - Document investigations with evidence tracking
✅ **Hacker Group Tracking** - Monitor threat actors and their activities
✅ **Security Recommendations** - Generate and track security recommendations
✅ **JWT Authentication** - Secure token-based authentication
✅ **Comprehensive Logging** - Request/error logging with timestamps
✅ **Pagination Support** - Built-in pagination for all list endpoints
✅ **Error Handling** - Centralized error middleware with proper HTTP status codes

---

## Project Structure

```
darkweb-threat-intelligence/
├── src/
│   ├── app.js                      # Express app configuration
│   ├── controllers/                # Route handlers for all models
│   │   ├── adminController.js
│   │   ├── analystController.js
│   │   ├── organizationController.js
│   │   ├── threatReportController.js
│   │   ├── incidentController.js
│   │   ├── investigationController.js
│   │   ├── malwareController.js
│   │   ├── hackerGroupController.js
│   │   ├── alertController.js
│   │   ├── dataLeakController.js
│   │   ├── phishingController.js
│   │   ├── threatIndicatorController.js
│   │   └── vulnerabilityController.js
│   ├── routes/                     # API route definitions
│   │   ├── adminRoutes.js
│   │   ├── analystRoutes.js
│   │   ├── organizationRoutes.js
│   │   ├── userRoutes.js
│   │   ├── threatReportRoutes.js
│   │   ├── threatIndicatorRoutes.js
│   │   ├── malwareRoutes.js
│   │   ├── incidentRoutes.js
│   │   ├── investigationRoutes.js
│   │   ├── dataLeakRoutes.js
│   │   ├── hackerGroupRoutes.js
│   │   ├── phishingRoutes.js
│   │   ├── alertRoutes.js
│   │   ├── threatSourceRoutes.js
│   │   ├── threatCategoryRoutes.js
│   │   └── more routes...
│   ├── middleware/                 # Express middleware
│   │   ├── authMiddleware.js       # JWT authentication
│   │   ├── adminMiddleware.js      # Admin authorization
│   │   ├── analystMiddleware.js    # Analyst authorization
│   │   ├── errorMiddleware.js      # Error handling
│   │   └── requestLoggerMiddleware.js
│   ├── services/                   # Business logic
│   │   ├── threatReportService.js
│   │   ├── incidentService.js
│   │   ├── threatAnalysisService.js
│   │   └── authService.js
│   ├── utils/                      # Helper functions
│   │   ├── helpers.js              # Password, token, validation helpers
│   │   ├── logger.js               # File logging
│   │   └── generateUUID.js
│   └── database/
│       └── prisma.js               # Prisma client
├── prisma/
│   ├── schema.prisma               # Database schema
│   └── migrations/
├── docs/
│   └── database_schema.md
├── API_DOCUMENTATION.md            # Full API documentation
├── postman_collection.json         # Postman collection for testing
├── functions.md                    # Database models documentation
├── package.json
├── prisma.config.ts
└── .env                            # Environment variables (local only)
```

---

## Installation

### Prerequisites
- Node.js 14+
- npm or yarn
- PostgreSQL 12+

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Set Up Environment Variables
Create a `.env` file in the root directory:
```
DATABASE_URL=postgresql://username:password@localhost:5432/threat_intelligence_db
PORT=3000
JWT_SECRET=your-super-secret-jwt-key-change-in-production
DEBUG=false
NODE_ENV=development
```

### Step 3: Set Up Database
```bash
# Run Prisma migrations
npx prisma migrate dev

# Generate Prisma client
npx prisma generate

# Optional: Seed database with sample data
npx prisma db seed
```

### Step 4: Start the Server
```bash
# Development with nodemon
npm run dev

# Production
npm start

# Server will run on http://localhost:3000
```

---

## API Endpoints

### Base URL
```
http://localhost:3000/api
```

### Health Check
```
GET /health
```

### Authentication
```
POST /admin/login          # Admin login
POST /analyst/login        # Analyst login
```

### Admin Management
```
POST   /admin              # Create admin
GET    /admin              # Get all admins (paginated)
GET    /admin/{id}         # Get admin by ID
PUT    /admin/{id}         # Update admin
DELETE /admin/{id}         # Delete admin
GET    /admin/{id}/audit-logs
```

### Analyst Management
```
POST   /analyst            # Create analyst
GET    /analyst            # Get all analysts
GET    /analyst/{id}       # Get analyst by ID
PUT    /analyst/{id}       # Update analyst
DELETE /analyst/{id}       # Delete analyst
```

### Organizations
```
POST   /organizations      # Create organization
GET    /organizations      # Get all organizations
GET    /organizations/{id} # Get organization details
PUT    /organizations/{id} # Update organization
DELETE /organizations/{id} # Delete organization (soft delete)
```

### Threat Reports
```
POST   /threat-reports     # Create report
GET    /threat-reports     # Get all reports (filtered, paginated)
GET    /threat-reports/{id} # Get report details with all relationships
PUT    /threat-reports/{id} # Update report
DELETE /threat-reports/{id} # Delete report (soft delete)
```

### Threat Indicators
```
POST   /threat-indicators  # Create indicator
GET    /threat-indicators  # Get all indicators
GET    /threat-indicators/{id}
PUT    /threat-indicators/{id}
DELETE /threat-indicators/{id}
```

### Malware
```
POST   /malware            # Create malware
GET    /malware            # Get all malware
GET    /malware/{id}
PUT    /malware/{id}
DELETE /malware/{id}
```

### Incidents
```
POST   /incidents          # Create incident
GET    /incidents          # Get all incidents
GET    /incidents/{id}     # Get incident with responses/alerts
PUT    /incidents/{id}     # Update incident status
DELETE /incidents/{id}
```

### Investigations
```
POST   /investigations     # Create investigation
GET    /investigations     # Get all investigations
GET    /investigations/{id} # Get investigation with evidence
PUT    /investigations/{id} # Update status
DELETE /investigations/{id}
```

### Data Leaks & Credentials
```
POST   /data-leaks         # Create data leak
GET    /data-leaks         # Get all leaks
GET    /data-leaks/{id}
DELETE /data-leaks/{id}

POST   /leaked-credentials # Create credential record
GET    /leaked-credentials # Get all credentials
DELETE /leaked-credentials/{id}
```

### Hacker Groups & Activities
```
POST   /hacker-groups      # Create group
GET    /hacker-groups      # Get all groups
GET    /hacker-groups/{id}
PUT    /hacker-groups/{id}
DELETE /hacker-groups/{id}

POST   /hacker-activities  # Create activity
GET    /hacker-activities  # Get all activities
DELETE /hacker-activities/{id}
```

### Phishing Attacks
```
POST   /phishing-attacks   # Create phishing record
GET    /phishing-attacks   # Get all phishing attacks
GET    /phishing-attacks/{id}
DELETE /phishing-attacks/{id}
```

### Alerts
```
POST   /threat-alerts      # Create alert
GET    /threat-alerts      # Get alerts
DELETE /threat-alerts/{id}

POST   /incident-alerts    # Create incident alert
GET    /incident-alerts    # Get incident alerts
```

### Security Recommendations
```
POST   /security-recommendations
GET    /security-recommendations
DELETE /security-recommendations/{id}
```

### Other Resources
```
/threat-sources            # Threat sources management
/threat-categories         # Threat categories management
/users                     # User accounts
/access-logs              # Access logs
/audit-logs               # Audit logs
/malware-families         # Malware families
/incident-responses       # Incident responses
/evidence                 # Investigation evidence
/vulnerabilities          # Vulnerability tracking
```

---

## Usage Examples

### 1. Create Admin Account
```bash
curl -X POST http://localhost:3000/api/admin \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "securePassword123"
  }'
```

### 2. Create Threat Report
```bash
curl -X POST http://localhost:3000/api/threat-reports \
  -H "Content-Type: application/json" \
  -d '{
    "sourceId": "source-uuid",
    "categoryId": "category-uuid",
    "analystId": "analyst-uuid",
    "title": "Critical Malware Detection",
    "status": "NEW"
  }'
```

### 3. Get All Reports (Paginated)
```bash
curl http://localhost:3000/api/threat-reports?page=1&limit=10&status=CONFIRMED
```

### 4. Create Incident
```bash
curl -X POST http://localhost:3000/api/incidents \
  -H "Content-Type: application/json" \
  -d '{
    "orgId": "org-uuid",
    "reportId": "report-uuid",
    "status": "NOT_STARTED"
  }'
```

### 5. Update Incident Status
```bash
curl -X PUT http://localhost:3000/api/incidents/incident-uuid \
  -H "Content-Type: application/json" \
  -d '{
    "status": "CONTAINED"
  }'
```

---

## Testing with Postman

### Import Collection
1. Open Postman
2. Click "Import" → "Import from File"
3. Select `postman_collection.json`
4. Postman will load all endpoints organized by resource

### Set Variables
1. In Postman, click "Environments" or the environment dropdown
2. Set the following variables:
   - `baseUrl` = http://localhost:3000/api
   - `token` = Your JWT token (obtained from login)
   - `adminId`, `orgId`, `reportId`, etc. = IDs from your test data

### Run Requests
- Click any endpoint in the collection
- Adjust parameters as needed
- Click "Send"
- View response in the Response panel

---

## Authentication

### JWT Token Flow

1. **Login**
   ```
   POST /admin/login or /analyst/login
   ```
   Returns JWT token

2. **Use Token**
   ```
   Authorization: Bearer YOUR_JWT_TOKEN
   ```

3. **Token Expiration**
   - Default: 24 hours
   - Configure in `JWT_SECRET` and token generation

### Protected Routes
Routes requiring admin/analyst middleware:
- `/admin/*` - Requires ADMIN role
- `/analyst/*` - Requires ANALYST or ADMIN role

---

## Database Schema

### Key Models
1. **Admin** - System administrators
2. **Analyst** - Security analysts
3. **Organization** - Customer organizations
4. **UserAccount** - Organization users
5. **ThreatReport** - Core threat intelligence reports
6. **ThreatIndicator** - IOCs (IP, Domain, URL, Email, Hash)
7. **Malware** - Malware information
8. **Incident** - Security incidents
9. **Investigation** - Formal investigations with evidence
10. **DataLeak** - Data breach records
11. **HackerGroup** - Threat actor groups
12. **PhishingAttack** - Phishing attack records
13. And 12 more supporting models...

See [functions.md](./functions.md) for complete schema documentation.

---

## Error Handling

### Error Response Format
```json
{
  "status": 500,
  "code": "INTERNAL_ERROR",
  "message": "Error description",
  "timestamp": "2026-07-06T10:30:00Z"
}
```

### HTTP Status Codes
- `200` - OK
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized (missing/invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Internal Server Error

---

## Logging

Logs are stored in `src/logs/`:
- `app.log` - General application logs
- `error.log` - Error logs

Enable debug logging:
```bash
DEBUG=true npm run dev
```

---

## Security Best Practices

1. **Change JWT Secret** - Update `JWT_SECRET` in production
2. **Use HTTPS** - Always use HTTPS in production
3. **Environment Variables** - Never commit `.env` file
4. **Password Hashing** - Passwords are hashed with SHA256
5. **CORS** - Configured for cross-origin requests
6. **Rate Limiting** - Consider adding rate limiting middleware
7. **Input Validation** - Validate all inputs in production

---

## Performance Tips

1. **Pagination** - Always use pagination for large datasets
   ```
   ?page=1&limit=50
   ```

2. **Filtering** - Use query parameters to filter
   ```
   ?status=CONFIRMED&sourceId=uuid
   ```

3. **Indexes** - Database indexes are configured on:
   - Foreign keys
   - Status fields
   - Commonly filtered fields

4. **Database Connection Pool** - Configured via Prisma

---

## Development

### Running Tests
```bash
npm test
```

### Code Style
```bash
npm run lint
```

### Build for Production
```bash
npm run build
```

---

## Troubleshooting

### Database Connection Issues
```bash
# Check database URL
echo $DATABASE_URL

# Reset database
npx prisma migrate reset
```

### Prisma Issues
```bash
# Regenerate Prisma client
npx prisma generate

# View database studio
npx prisma studio
```

### Port Already in Use
```bash
# Change port in .env
PORT=3001
```

---

## API Documentation

Full API documentation available at:
- [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)
- Postman Collection: [postman_collection.json](./postman_collection.json)
- Database Schema: [functions.md](./functions.md)

---

## Support & Issues

For issues or questions:
1. Check the API documentation
2. Review error logs in `src/logs/`
3. Check database schema in [functions.md](./functions.md)

---

## License

This project is part of the Dark Web Threat Intelligence system.

---

## Version History

- **v1.0.0** (2026-07-06) - Initial release with full CRUD operations for all 25 models
