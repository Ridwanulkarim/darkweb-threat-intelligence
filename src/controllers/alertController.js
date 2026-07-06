const prisma = require('../database/prisma');
const { formatResponse, formatErrorResponse, getPaginationParams } = require('../utils/helpers');

// Alert Controller
const alertController = {
  createAlert: async (req, res, next) => {
    try {
      const { reportId, message, level } = req.body;
      const alert = await prisma.threatAlert.create({
        data: { reportId, message, level },
        include: { report: true }
      });
      res.status(201).json(formatResponse(alert, 'Alert created successfully'));
    } catch (error) {
      next(error);
    }
  },

  getAllAlerts: async (req, res, next) => {
    try {
      const { page = 1, limit = 10, level, reportId } = req.query;
      const { skip, take } = getPaginationParams(parseInt(page), parseInt(limit));
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

      res.json(formatResponse({ alerts, total, page: parseInt(page) }));
    } catch (error) {
      next(error);
    }
  },

  getAlertById: async (req, res, next) => {
    try {
      const alert = await prisma.threatAlert.findUnique({
        where: { id: req.params.id },
        include: { report: true }
      });
      if (!alert) return res.status(404).json(formatErrorResponse('Alert not found', 404));
      res.json(formatResponse(alert));
    } catch (error) {
      next(error);
    }
  },

  deleteAlert: async (req, res, next) => {
    try {
      await prisma.threatAlert.delete({ where: { id: req.params.id } });
      res.json(formatResponse(null, 'Alert deleted successfully'));
    } catch (error) {
      next(error);
    }
  }
};

module.exports = alertController;
