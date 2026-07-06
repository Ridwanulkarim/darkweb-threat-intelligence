const prisma = require('../database/prisma');
const { formatResponse, formatErrorResponse, getPaginationParams } = require('../utils/helpers');

const analystController = {
  // Create analyst
  createAnalyst: async (req, res, next) => {
    try {
      const { name, email, password, role, status } = req.body;
      const analyst = await prisma.analyst.create({
        data: { name, email, password, role: role || 'ANALYST', status: status || 'ACTIVE' }
      });
      res.status(201).json(formatResponse(analyst, 'Analyst created successfully'));
    } catch (error) {
      next(error);
    }
  },

  // Get all analysts
  getAllAnalysts: async (req, res, next) => {
    try {
      const { page = 1, limit = 10, role, status } = req.query;
      const { skip, take } = getPaginationParams(parseInt(page), parseInt(limit));

      const where = {};
      if (role) where.role = role;
      if (status) where.status = status;

      const [analysts, total] = await Promise.all([
        prisma.analyst.findMany({ where, skip, take, orderBy: { createdAt: 'desc' } }),
        prisma.analyst.count({ where })
      ]);

      res.json(formatResponse({ analysts, total, page: parseInt(page) }));
    } catch (error) {
      next(error);
    }
  },

  // Get analyst by ID
  getAnalystById: async (req, res, next) => {
    try {
      const analyst = await prisma.analyst.findUnique({
        where: { id: req.params.id },
        include: {
          reports: { take: 5 },
          investigations: { take: 5 },
          responses: { take: 5 }
        }
      });
      if (!analyst) return res.status(404).json(formatErrorResponse('Analyst not found', 404));
      res.json(formatResponse(analyst));
    } catch (error) {
      next(error);
    }
  },

  // Update analyst
  updateAnalyst: async (req, res, next) => {
    try {
      const analyst = await prisma.analyst.update({
        where: { id: req.params.id },
        data: req.body
      });
      res.json(formatResponse(analyst, 'Analyst updated successfully'));
    } catch (error) {
      next(error);
    }
  },

  // Delete analyst
  deleteAnalyst: async (req, res, next) => {
    try {
      await prisma.analyst.delete({ where: { id: req.params.id } });
      res.json(formatResponse(null, 'Analyst deleted successfully'));
    } catch (error) {
      next(error);
    }
  }
};

module.exports = analystController;
