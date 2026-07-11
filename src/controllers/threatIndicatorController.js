const prisma = require('../database/prisma');
const { formatResponse, formatErrorResponse, getPaginationParams } = require('../utils/helpers');

const threatIndicatorController = {
  createIndicator: async (req, res, next) => {
    try {
      if (!req.body || !req.body.reportId || !req.body.type || !req.body.value) {
        return res.status(400).json(formatErrorResponse('Missing required fields: reportId, type, value', 400));
      }
      const { reportId, type, value } = req.body;
      const indicator = await prisma.threatIndicator.create({
        data: { reportId, type, value },
        include: { report: true }
      });
      res.status(201).json(formatResponse(indicator, 'Indicator created successfully'));
    } catch (error) {
      next(error);
    }
  },

  getAllIndicators: async (req, res, next) => {
    try {
      const { page = 1, limit = 10, type, reportId } = req.query;
      const { skip, take } = getPaginationParams(parseInt(page), parseInt(limit));
      const where = {};
      if (type) where.type = type;
      if (reportId) where.reportId = reportId;

      const [indicators, total] = await Promise.all([
        prisma.threatIndicator.findMany({
          where,
          skip,
          take,
          include: { report: true },
          orderBy: { createdAt: 'desc' }
        }),
        prisma.threatIndicator.count({ where })
      ]);

      res.json(formatResponse({ indicators, total, page: parseInt(page) }));
    } catch (error) {
      next(error);
    }
  },

  getIndicatorById: async (req, res, next) => {
    try {
      const indicator = await prisma.threatIndicator.findUnique({
        where: { id: req.params.id },
        include: { report: true }
      });
      if (!indicator) return res.status(404).json(formatErrorResponse('Indicator not found', 404));
      res.json(formatResponse(indicator));
    } catch (error) {
      next(error);
    }
  },

  updateIndicator: async (req, res, next) => {
    try {
      const indicator = await prisma.threatIndicator.update({
        where: { id: req.params.id },
        data: req.body,
        include: { report: true }
      });
      res.json(formatResponse(indicator, 'Indicator updated successfully'));
    } catch (error) {
      next(error);
    }
  },

  deleteIndicator: async (req, res, next) => {
    try {
      await prisma.threatIndicator.delete({ where: { id: req.params.id } });
      res.json(formatResponse(null, 'Indicator deleted successfully'));
    } catch (error) {
      next(error);
    }
  }
};

module.exports = threatIndicatorController;
