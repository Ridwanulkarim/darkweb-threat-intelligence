const prisma = require('../database/prisma');
const { formatResponse, formatErrorResponse, getPaginationParams } = require('../utils/helpers');

const phishingController = {
  createAttack: async (req, res, next) => {
    try {
      if (!req.body || !req.body.reportId || !req.body.url) {
        return res.status(400).json(formatErrorResponse('Missing required fields: reportId, url', 400));
      }
      const { reportId, url } = req.body;
      const attack = await prisma.phishingAttack.create({
        data: { reportId, url },
        include: { report: true }
      });
      res.status(201).json(formatResponse(attack, 'Phishing attack created successfully'));
    } catch (error) {
      next(error);
    }
  },

  getAllAttacks: async (req, res, next) => {
    try {
      const { page = 1, limit = 10, reportId } = req.query;
      const { skip, take } = getPaginationParams(parseInt(page), parseInt(limit));
      const where = {};
      if (reportId) where.reportId = reportId;

      const [attacks, total] = await Promise.all([
        prisma.phishingAttack.findMany({
          where,
          skip,
          take,
          include: { report: true },
          orderBy: { createdAt: 'desc' }
        }),
        prisma.phishingAttack.count({ where })
      ]);

      res.json(formatResponse({ attacks, total, page: parseInt(page) }));
    } catch (error) {
      next(error);
    }
  },

  getAttackById: async (req, res, next) => {
    try {
      const attack = await prisma.phishingAttack.findUnique({
        where: { id: req.params.id },
        include: { report: true }
      });
      if (!attack) return res.status(404).json(formatErrorResponse('Phishing attack not found', 404));
      res.json(formatResponse(attack));
    } catch (error) {
      next(error);
    }
  },

  deleteAttack: async (req, res, next) => {
    try {
      await prisma.phishingAttack.delete({ where: { id: req.params.id } });
      res.json(formatResponse(null, 'Phishing attack deleted successfully'));
    } catch (error) {
      next(error);
    }
  }
};

module.exports = phishingController;
