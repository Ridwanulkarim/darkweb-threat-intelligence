const prisma = require('../database/prisma');
const logger = require('../utils/logger');

const alertService = {
  // Create a new alert
  createAlert: async (data) => {
    try {
      if (!data || !data.reportId || !data.message || !data.level) {
        throw new Error('Missing required fields: reportId, message, level');
      }
      const alert = await prisma.threatAlert.create({
        data: {
          reportId: data.reportId,
          message: data.message,
          level: data.level
        },
        include: { report: true }
      });
      logger.info(`Alert created: ${alert.id}`);
      return alert;
    } catch (error) {
      logger.error(`Error creating alert: ${error.message}`);
      throw error;
    }
  },

  // Get all alerts with filters and pagination
  getAllAlerts: async (filters = {}) => {
    try {
      const { skip = 0, take = 10, level, reportId } = filters;
      const where = {};
      
      if (level) where.level = level;
      if (reportId) where.reportId = reportId;

      const [alerts, total] = await Promise.all([
        prisma.threatAlert.findMany({
          where,
          skip,
          take,
          include: { report: true },
          orderBy: { createdAt: 'desc' }
        }),
        prisma.threatAlert.count({ where })
      ]);

      logger.info(`Retrieved ${alerts.length} alerts`);
      return { alerts, total };
    } catch (error) {
      logger.error(`Error retrieving alerts: ${error.message}`);
      throw error;
    }
  },

  // Get alert by ID
  getAlertById: async (id) => {
    try {
      const alert = await prisma.threatAlert.findUnique({
        where: { id },
        include: { report: true }
      });
      
      if (!alert) {
        logger.warn(`Alert not found: ${id}`);
        throw new Error('Alert not found');
      }
      
      return alert;
    } catch (error) {
      logger.error(`Error retrieving alert: ${error.message}`);
      throw error;
    }
  },

  // Delete alert
  deleteAlert: async (id) => {
    try {
      const alert = await prisma.threatAlert.delete({
        where: { id }
      });
      logger.info(`Alert deleted: ${id}`);
      return alert;
    } catch (error) {
      logger.error(`Error deleting alert: ${error.message}`);
      throw error;
    }
  },

  // Update alert
  updateAlert: async (id, data) => {
    try {
      const alert = await prisma.threatAlert.update({
        where: { id },
        data: {
          message: data.message,
          level: data.level
        },
        include: { report: true }
      });
      logger.info(`Alert updated: ${id}`);
      return alert;
    } catch (error) {
      logger.error(`Error updating alert: ${error.message}`);
      throw error;
    }
  }
};

module.exports = alertService;
