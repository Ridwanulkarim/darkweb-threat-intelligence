# Dark Web Threat Intelligence API

A Node.js + Express backend for managing dark web threat intelligence, security incidents, investigations, and forensic evidence.

This repository includes:

- `src/` — Express application, routes, controllers, middleware, services, and utilities
- `prisma/` — Prisma schema and database migrations
- `docs/` — Database schema documentation and DBML
- `API_DOCUMENTATION.md` — Full API documentation
- `postman_collection.json` — Postman collection for testing
- `functions.md` — Database model documentation generated from Prisma schema

## Features

- RESTful CRUD endpoints for 25 database models
- JWT authentication for Admin and Analyst roles
- Role-based route protection
- Incident and investigation management
- Threat report, indicator, malware, phishing, and data leak tracking
- Soft delete support for organizations and threat reports
- Centralized error handling and request logging
- Pagination helper support

## Quick Start

### Requirements

- Node.js 14+ or newer
- npm
- PostgreSQL

### Install

```bash
npm install
```

### Environment

Create a `.env` file in the root directory with:

```env
DATABASE_URL=postgresql://username:password@localhost:5432/threat_intelligence_db
PORT=3000
JWT_SECRET=your-super-secret-jwt-key
NODE_ENV=development
DEBUG=false
```

### Database setup

```bash
npx prisma migrate dev
npx prisma generate
```

### Start the server

```bash
npm run dev
```

Server defaults to `http://localhost:3000`.

## Available Scripts

- `npm run dev` — start server with `nodemon`
- `npm start` — start server with Node

## Documentation

- `API_DOCUMENTATION.md` — Detailed API reference and examples
- `postman_collection.json` — Postman collection for testing endpoints
- `docs/database_schema.md` — Database schema summary
- `docs/schema.dbml` — DBML schema diagram source
- `functions.md` — Generated documentation for Prisma models and enums

## Notes

- Use `JWT_SECRET` to sign tokens for protected routes.
- Ensure `DATABASE_URL` points to your PostgreSQL database before migrating.
- If you run into Prisma client initialization issues, re-run:

```bash
npm install
npx prisma generate
```

## Contact

For questions or further setup help, check the project docs or ask the maintainer.
