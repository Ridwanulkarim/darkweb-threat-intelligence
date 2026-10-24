const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const crypto = require('crypto');
const errorMiddleware = require('./middleware/errorMiddleware');
const authMiddleware = require('./middleware/authMiddleware');

// Load environment variables
dotenv.config();

// Enforce JWT_SECRET Security: Disallow empty or hardcoded fallback secrets
if (!process.env.JWT_SECRET) {
  if (process.env.NODE_ENV === 'production' || process.env.RENDER) {
    console.error('FATAL [Security]: JWT_SECRET environment variable is missing in production. Refusing to start.');
    process.exit(1);
  } else {
    console.warn('[Security Notice]: JWT_SECRET not found in .env. Generated ephemeral 256-bit cryptographic secret for this local session.');
    process.env.JWT_SECRET = crypto.randomBytes(32).toString('hex');
  }
}

// Auto-append sslmode=require for remote cloud databases (Render, Supabase, Neon)
if (process.env.DATABASE_URL) {
  const url = process.env.DATABASE_URL;
  if (!url.includes("sslmode=") && !url.includes("localhost") && !url.includes("127.0.0.1")) {
    const sep = url.includes("?") ? "&" : "?";
    process.env.DATABASE_URL = `${url}${sep}sslmode=require`;
  }
}

const app = express();

// Secure CORS configuration
const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',').map(s => s.trim()) 
  : [
      'https://darkweb-threat-intelligence-2.onrender.com',
      'http://localhost:3000',
      'http://localhost:5173'
    ];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, same-origin SPA)
    if (!origin || allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
      return callback(null, true);
    }
    return callback(new Error(`CORS blocked for origin: ${origin}`));
  },
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/analyst', require('./routes/analystRoutes'));
app.use('/api/organizations', require('./routes/organizationRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/access-logs', require('./routes/accessLogRoutes'));
app.use('/api/audit-logs', require('./routes/auditLogRoutes'));
app.use('/api/threat-sources', require('./routes/threatSourceRoutes'));
app.use('/api/threat-categories', require('./routes/threatCategoryRoutes'));
app.use('/api/vulnerabilities', require('./routes/vulnerabilityRoutes'));
app.use('/api/threat-reports', require('./routes/threatReportRoutes'));
app.use('/api/threat-indicators', require('./routes/threatIndicatorRoutes'));
app.use('/api/malware', require('./routes/malwareRoutes'));
app.use('/api/malware-families', require('./routes/malwareFamilyRoutes'));
app.use('/api/phishing-attacks', require('./routes/phishingRoutes'));
app.use('/api/data-leaks', require('./routes/dataLeakRoutes'));
app.use('/api/leaked-credentials', require('./routes/leakedCredentialRoutes'));
app.use('/api/hacker-groups', require('./routes/hackerGroupRoutes'));
app.use('/api/hacker-activities', require('./routes/hackerActivityRoutes'));
app.use('/api/incidents', require('./routes/incidentRoutes'));
app.use('/api/incident-responses', require('./routes/incidentResponseRoutes'));
app.use('/api/incident-alerts', require('./routes/incidentAlertRoutes'));
app.use('/api/threat-alerts', require('./routes/threatAlertRoutes'));
app.use('/api/security-recommendations', require('./routes/securityRecommendationRoutes'));
app.use('/api/investigations', require('./routes/investigationRoutes'));
app.use('/api/evidence', require('./routes/evidenceRoutes'));

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// API Documentation
app.get('/api/docs', (req, res) => {
  res.status(200).json({
    name: 'Dark Web Threat Intelligence API',
    version: '1.0.0',
    description: 'Comprehensive threat intelligence and incident management system',
    baseUrl: `http://localhost:${process.env.PORT || 3000}/api`,
    documentation: '/api/docs/full'
  });
});

// Serve Frontend if built
const path = require('path');
const fs = require('fs');
const frontendDist = path.join(__dirname, '../frontend/dist');
if (fs.existsSync(frontendDist)) {
  app.use(express.static(frontendDist));
  app.use((req, res, next) => {
    if (req.method === 'GET' && !req.path.startsWith('/api') && req.path !== '/health') {
      return res.sendFile(path.join(frontendDist, 'index.html'));
    }
    next();
  });
}

// 404 Handler for API routes
app.use((req, res) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.path,
    method: req.method
  });
});

// Error Middleware (must be last)
app.use(errorMiddleware);

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
