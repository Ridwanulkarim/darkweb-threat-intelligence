const prisma = require('../database/prisma');
const logger = require('../utils/logger');

const threatAnalysisService = {
  // Analyze threat patterns
  analyzeThreatPatterns: async (reportId) => {
    try {
      const report = await prisma.threatReport.findUnique({
        where: { id: reportId },
        include: {
          indicators: true,
          malware: true,
          phishingAttacks: true,
          hackerGroupActivities: { include: { group: true } }
        }
      });

      if (!report) throw new Error('Report not found');

      const analysis = {
        reportId,
        totalIndicators: report.indicators.length,
        indicatorTypes: {},
        malwareCount: report.malware.length,
        phishingCount: report.phishingAttacks.length,
        threatActors: new Set(),
        riskLevel: calculateRiskLevel(report)
      };

      report.indicators.forEach(ind => {
        analysis.indicatorTypes[ind.type] = (analysis.indicatorTypes[ind.type] || 0) + 1;
      });

      report.hackerGroupActivities.forEach(activity => {
        analysis.threatActors.add(activity.group.name);
      });

      analysis.threatActors = Array.from(analysis.threatActors);

      logger.info(`Threat analysis completed for report ${reportId}`);
      return analysis;
    } catch (error) {
      logger.error(`Error analyzing threat patterns: ${error.message}`);
      throw error;
    }
  },

  // Get threat statistics
  getThreatStatistics: async () => {
    try {
      const [
        totalReports,
        confirmedThreats,
        activeIncidents,
        uniqueIndicators,
        malwareInstances,
        phishingAttempts
      ] = await Promise.all([
        prisma.threatReport.count({ where: { isDeleted: false } }),
        prisma.threatReport.count({ where: { status: 'CONFIRMED', isDeleted: false } }),
        prisma.incident.count({ where: { status: { not: 'CLOSED' } } }),
        prisma.threatIndicator.count(),
        prisma.malware.count(),
        prisma.phishingAttack.count()
      ]);

      return {
        totalReports,
        confirmedThreats,
        activeIncidents,
        uniqueIndicators,
        malwareInstances,
        phishingAttempts,
        timestamp: new Date()
      };
    } catch (error) {
      logger.error(`Error getting threat statistics: ${error.message}`);
      throw error;
    }
  },

  // Get related threats
  getRelatedThreats: async (reportId) => {
    try {
      const report = await prisma.threatReport.findUnique({
        where: { id: reportId },
        include: { indicators: true }
      });

      if (!report) throw new Error('Report not found');

      const relatedReports = await prisma.threatReport.findMany({
        where: {
          id: { not: reportId },
          isDeleted: false,
          indicators: {
            some: {
              value: { in: report.indicators.map(i => i.value) }
            }
          }
        },
        include: { indicators: true, analyst: true }
      });

      return relatedReports;
    } catch (error) {
      logger.error(`Error finding related threats: ${error.message}`);
      throw error;
    }
  }
};

const calculateRiskLevel = (report) => {
  let score = 0;

  if (report.status === 'CONFIRMED') score += 50;
  if (report.malware.length > 0) score += 30;
  if (report.phishingAttacks.length > 0) score += 20;
  if (report.indicators.length > 5) score += 20;

  if (score >= 80) return 'CRITICAL';
  if (score >= 60) return 'HIGH';
  if (score >= 40) return 'MEDIUM';
  return 'LOW';
};

module.exports = threatAnalysisService;
