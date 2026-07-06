const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const errorMiddleware = require('./middleware/errorMiddleware');
const authMiddleware = require('./middleware/authMiddleware');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/analyst', require('./routes/analystRoutes'));
app.use('/api/organizations', require('./routes/organizationRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/access-logs', require('./routes/accessLogRoutes'));
app.use('/api/audit-logs', require('./routes/auditLogRoutes'));
app.use('/api/threat-sources', require('./routes/threatSourceRoutes'));
app.use('/api/threat-categories', require('./routes/threatCategoryRoutes'));
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

// 404 Handler
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
