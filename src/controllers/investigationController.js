const prisma = require('../database/prisma');
const { formatResponse, formatErrorResponse, getPaginationParams } = require('../utils/helpers');

const investigationController = {
  createInvestigation: async (req, res, next) => {
    try {
      if (!req.body || !req.body.reportId || !req.body.analystId) {
        return res.status(400).json(formatErrorResponse('Missing required fields: reportId, analystId', 400));
      }
      const { reportId, analystId, status } = req.body;
      const investigation = await prisma.investigation.create({
        data: { reportId, analystId, status: status || 'OPEN' },
        include: { analyst: true, report: true, evidences: true }
      });
      res.status(201).json(formatResponse(investigation, 'Investigation created successfully'));
    } catch (error) {
      next(error);
    }
  },

  getAllInvestigations: async (req, res, next) => {
    try {
      const { page = 1, limit = 10, status, analystId } = req.query;
      const { skip, take } = getPaginationParams(parseInt(page), parseInt(limit));
      const where = {};
      if (status) where.status = status;
      if (analystId) where.analystId = analystId;

      const [investigations, total] = await Promise.all([
        prisma.investigation.findMany({
          where,
          skip,
          take,
          include: { analyst: true, report: true, evidences: true },
          orderBy: { createdAt: 'desc' }
        }),
        prisma.investigation.count({ where })
      ]);

      res.json(formatResponse({ investigations, total, page: parseInt(page) }));
    } catch (error) {
      next(error);
    }
  },

  getInvestigationById: async (req, res, next) => {
    try {
      const investigation = await prisma.investigation.findUnique({
        where: { id: req.params.id },
        include: { analyst: true, report: true, evidences: true }
      });
      if (!investigation) return res.status(404).json(formatErrorResponse('Investigation not found', 404));
      res.json(formatResponse(investigation));
    } catch (error) {
      next(error);
    }
  },

  updateInvestigation: async (req, res, next) => {
    try {
      const investigation = await prisma.investigation.update({
        where: { id: req.params.id },
        data: req.body,
        include: { analyst: true, report: true, evidences: true }
      });
      res.json(formatResponse(investigation, 'Investigation updated successfully'));
    } catch (error) {
      next(error);
    }
  },

  deleteInvestigation: async (req, res, next) => {
    try {
      await prisma.evidence.deleteMany({ where: { investigationId: req.params.id } });
      await prisma.investigation.delete({ where: { id: req.params.id } });
      res.json(formatResponse(null, 'Investigation deleted successfully'));
    } catch (error) {
      next(error);
    }
  }
};

module.exports = investigationController;
