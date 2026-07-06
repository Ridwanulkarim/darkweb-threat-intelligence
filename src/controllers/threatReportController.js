const prisma = require('../database/prisma');
const { formatResponse, formatErrorResponse, getPaginationParams } = require('../utils/helpers');

const threatReportController = {
  createReport: async (req, res, next) => {
    try {
      const { sourceId, categoryId, analystId, title, status } = req.body;
      const report = await prisma.threatReport.create({
        data: { sourceId, categoryId, analystId, title, status: status || 'NEW' },
        include: { source: true, category: true, analyst: true }
      });
      res.status(201).json(formatResponse(report, 'Report created successfully'));
    } catch (error) {
      next(error);
    }
  },

  getAllReports: async (req, res, next) => {
    try {
      const { page = 1, limit = 10, status, sourceId, categoryId } = req.query;
      const { skip, take } = getPaginationParams(parseInt(page), parseInt(limit));
      const where = { isDeleted: false };
      if (status) where.status = status;
      if (sourceId) where.sourceId = sourceId;
      if (categoryId) where.categoryId = categoryId;

      const [reports, total] = await Promise.all([
        prisma.threatReport.findMany({
          where,
          skip,
          take,
          include: { source: true, category: true, analyst: true, indicators: true },
          orderBy: { createdAt: 'desc' }
        }),
        prisma.threatReport.count({ where })
      ]);

      res.json(formatResponse({ reports, total, page: parseInt(page) }));
    } catch (error) {
      next(error);
    }
  },

  getReportById: async (req, res, next) => {
    try {
      const report = await prisma.threatReport.findUnique({
        where: { id: req.params.id },
        include: {
          source: true,
          category: true,
          analyst: true,
          indicators: true,
          malware: true,
          phishingAttacks: true,
          dataLeaks: true,
          hackerGroupActivities: true,
          incidents: true,
          investigations: true,
          securityRecommendations: true,
          alerts: true
        }
      });
      if (!report) return res.status(404).json(formatErrorResponse('Report not found', 404));
      res.json(formatResponse(report));
    } catch (error) {
      next(error);
    }
  },

  updateReport: async (req, res, next) => {
    try {
      const report = await prisma.threatReport.update({
        where: { id: req.params.id },
        data: req.body,
        include: { source: true, category: true, analyst: true }
      });
      res.json(formatResponse(report, 'Report updated successfully'));
    } catch (error) {
      next(error);
    }
  },

  deleteReport: async (req, res, next) => {
    try {
      const report = await prisma.threatReport.update({
        where: { id: req.params.id },
        data: { isDeleted: true, deletedAt: new Date() }
      });
      res.json(formatResponse(report, 'Report deleted successfully'));
    } catch (error) {
      next(error);
    }
  }
};

module.exports = threatReportController;
