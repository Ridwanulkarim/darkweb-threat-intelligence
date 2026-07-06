const prisma = require('../database/prisma');
const { formatResponse, formatErrorResponse, getPaginationParams } = require('../utils/helpers');

const dataLeakController = {
  createLeak: async (req, res, next) => {
    try {
      const { reportId, title } = req.body;
      const leak = await prisma.dataLeak.create({
        data: { reportId, title },
        include: { report: true, credentials: true }
      });
      res.status(201).json(formatResponse(leak, 'Data leak created successfully'));
    } catch (error) {
      next(error);
    }
  },

  getAllLeaks: async (req, res, next) => {
    try {
      const { page = 1, limit = 10, reportId } = req.query;
      const { skip, take } = getPaginationParams(parseInt(page), parseInt(limit));
      const where = {};
      if (reportId) where.reportId = reportId;

      const [leaks, total] = await Promise.all([
        prisma.dataLeak.findMany({
          where,
          skip,
          take,
          include: { report: true, credentials: true },
          orderBy: { createdAt: 'desc' }
        }),
        prisma.dataLeak.count({ where })
      ]);

      res.json(formatResponse({ leaks, total, page: parseInt(page) }));
    } catch (error) {
      next(error);
    }
  },

  getLeakById: async (req, res, next) => {
    try {
      const leak = await prisma.dataLeak.findUnique({
        where: { id: req.params.id },
        include: { report: true, credentials: true }
      });
      if (!leak) return res.status(404).json(formatErrorResponse('Data leak not found', 404));
      res.json(formatResponse(leak));
    } catch (error) {
      next(error);
    }
  },

  deleteLeak: async (req, res, next) => {
    try {
      await prisma.leakedCredential.deleteMany({ where: { leakId: req.params.id } });
      await prisma.dataLeak.delete({ where: { id: req.params.id } });
      res.json(formatResponse(null, 'Data leak deleted successfully'));
    } catch (error) {
      next(error);
    }
  }
};

module.exports = dataLeakController;
