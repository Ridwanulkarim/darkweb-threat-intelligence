# Quick Start Guide

## 5-Minute Setup

### 1. Install Dependencies
```bash
cd /Users/apple/darkweb-threat-intelligence
npm install
```

### 2. Create .env File
```bash
cat > .env << EOF
DATABASE_URL=postgresql://user:password@localhost:5432/threat_db
PORT=3000
JWT_SECRET=dev-secret-key-change-in-production
DEBUG=false
NODE_ENV=development
EOF
```

### 3. Setup Database
```bash
npx prisma migrate dev
npx prisma generate
```

### 4. Start Server
```bash
npm run dev
# Server running on http://localhost:3000
```

### 5. Test Health Check
```bash
curl http://localhost:3000/health
```

---

## Testing the API

### Import Postman Collection
1. Open Postman
2. File → Import → Select `postman_collection.json`
3. Set `baseUrl` variable to `http://localhost:3000/api`

### Create Test Data

#### Step 1: Create Admin
```json
POST http://localhost:3000/api/admin
{
  "name": "Admin User",
  "email": "admin@test.com",
  "password": "test123",
  "status": "ACTIVE"
}
```

#### Step 2: Create Organization
```json
POST http://localhost:3000/api/organizations
{
  "name": "Test Corp",
  "country": "USA"
}
```

#### Step 3: Create Analyst
```json
POST http://localhost:3000/api/analyst
{
  "name": "Test Analyst",
  "email": "analyst@test.com",
  "password": "test123",
  "role": "ANALYST",
  "status": "ACTIVE"
}
```

#### Step 4: Create Threat Report
```json
POST http://localhost:3000/api/threat-reports
{
  "sourceId": "source-uuid",
  "categoryId": "category-uuid",
  "analystId": "analyst-uuid",
  "title": "Test Threat Report",
  "status": "NEW"
}
```

---

## Useful npm Scripts

```bash
npm run dev          # Start development server with auto-reload
npm start            # Start production server
npm test             # Run tests (if configured)
npm run lint         # Run linter (if configured)
```

---

## File Locations

| File | Purpose |
|------|---------|
| `src/app.js` | Main Express app |
| `src/routes/` | API route handlers |
| `src/controllers/` | Request handlers |
| `src/services/` | Business logic |
| `src/middleware/` | Auth, error handling |
| `prisma/schema.prisma` | Database schema |
| `API_DOCUMENTATION.md` | Full API docs |
| `postman_collection.json` | Postman tests |
| `functions.md` | Database model docs |

---

## Common Issues & Fixes

### Database Connection Failed
```bash
# Check PostgreSQL is running
# Update DATABASE_URL in .env
# Run: npx prisma migrate reset
```

### Port 3000 Already in Use
```bash
# Change PORT in .env to 3001
# Or kill process: lsof -ti:3000 | xargs kill -9
```

### Prisma Client Not Found
```bash
npm install @prisma/client
npx prisma generate
```

### JWT Token Errors
```bash
# Change JWT_SECRET in .env
# Make sure token is in Authorization header: Bearer {token}
```

---

## Next Steps

1. ✅ Start the server
2. ✅ Test endpoints with Postman
3. ✅ Create sample data
4. ✅ Read full docs: [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)
5. ✅ Check schema: [functions.md](./functions.md)

---

## Documentation Links

- [Full API Documentation](./API_DOCUMENTATION.md)
- [Database Models](./functions.md)
- [Backend README](./README_BACKEND.md)
- [Postman Collection](./postman_collection.json)

---

Happy Coding! 🚀
