const prisma = require('../database/prisma');
const logger = require('../utils/logger');

const threatReportService = {
  // Create new threat report
  createReport: async (data) => {
    try {
      const report = await prisma.threatReport.create({
        data: {
          sourceId: data.sourceId,
          categoryId: data.categoryId,
          analystId: data.analystId,
          title: data.title,
          status: data.status || 'NEW'
        },
        include: {
          source: true,
          category: true,
          analyst: true
        }
      });
      logger.info(`Threat report created: ${report.id}`);
      return report;
    } catch (error) {
      logger.error(`Error creating threat report: ${error.message}`);
      throw error;
    }
  },

  // Get all reports with pagination and filters
  getReports: async (where = {}, skip = 0, take = 10) => {
    try {
      const [reports, total] = await Promise.all([
        prisma.threatReport.findMany({
          where: { ...where, isDeleted: false },
          skip,
          take,
          include: {
            source: true,
            category: true,
            analyst: true,
            indicators: true,
            alerts: true
          },
          orderBy: { createdAt: 'desc' }
        }),
        prisma.threatReport.count({ where: { ...where, isDeleted: false } })
      ]);
      return { reports, total, page: Math.floor(skip / take) + 1, pages: Math.ceil(total / take) };
    } catch (error) {
      logger.error(`Error fetching reports: ${error.message}`);
      throw error;
    }
  },

  // Get report by ID
  getReportById: async (id) => {
    try {
      const report = await prisma.threatReport.findUnique({
        where: { id },
        include: {
          source: true,
          category: true,
          analyst: true,
          indicators: true,
          alerts: true,
          malware: true,
          phishingAttacks: true,
          dataLeaks: true,
          hackerGroupActivities: true,
          incidents: true,
          investigations: true,
          securityRecommendations: true
        }
      });
      return report;
    } catch (error) {
      logger.error(`Error fetching report ${id}: ${error.message}`);
      throw error;
    }
  },

  // Update report
  updateReport: async (id, data) => {
    try {
      const report = await prisma.threatReport.update({
        where: { id },
        data,
        include: { source: true, category: true, analyst: true }
      });
      logger.info(`Threat report updated: ${id}`);
      return report;
    } catch (error) {
      logger.error(`Error updating report ${id}: ${error.message}`);
      throw error;
    }
  },

  // Soft delete report
  deleteReport: async (id) => {
    try {
      const report = await prisma.threatReport.update({
        where: { id },
        data: {
          isDeleted: true,
          deletedAt: new Date()
        }
      });
      logger.info(`Threat report deleted: ${id}`);
      return report;
    } catch (error) {
      logger.error(`Error deleting report ${id}: ${error.message}`);
      throw error;
    }
  }
};

module.exports = threatReportService;
