const prisma = require('../database/prisma');
const { formatResponse, formatErrorResponse, getPaginationParams } = require('../utils/helpers');
const logger = require('../utils/logger');

const adminController = {
  // Create admin
  createAdmin: async (req, res, next) => {
    try {
      const { name, email, password, status } = req.body;
      const admin = await prisma.admin.create({
        data: { name, email, password, status: status || 'ACTIVE' }
      });
      res.status(201).json(formatResponse(admin, 'Admin created successfully'));
    } catch (error) {
      next(error);
    }
  },

  // Get all admins
  getAllAdmins: async (req, res, next) => {
    try {
      const { page = 1, limit = 10 } = req.query;
      const { skip, take } = getPaginationParams(parseInt(page), parseInt(limit));

      const [admins, total] = await Promise.all([
        prisma.admin.findMany({ skip, take, orderBy: { createdAt: 'desc' } }),
        prisma.admin.count()
      ]);

      res.json(formatResponse({ admins, total, page: parseInt(page) }));
    } catch (error) {
      next(error);
    }
  },

  // Get admin by ID
  getAdminById: async (req, res, next) => {
    try {
      const admin = await prisma.admin.findUnique({
        where: { id: req.params.id },
        include: { auditLogs: { take: 10 } }
      });
      if (!admin) return res.status(404).json(formatErrorResponse('Admin not found', 404));
      res.json(formatResponse(admin));
    } catch (error) {
      next(error);
    }
  },

  // Update admin
  updateAdmin: async (req, res, next) => {
    try {
      const admin = await prisma.admin.update({
        where: { id: req.params.id },
        data: req.body
      });
      res.json(formatResponse(admin, 'Admin updated successfully'));
    } catch (error) {
      next(error);
    }
  },

  // Delete admin
  deleteAdmin: async (req, res, next) => {
    try {
      await prisma.admin.delete({ where: { id: req.params.id } });
      res.json(formatResponse(null, 'Admin deleted successfully'));
    } catch (error) {
      next(error);
    }
  },

  // Get audit logs
  getAuditLogs: async (req, res, next) => {
    try {
      const { adminId, page = 1, limit = 10 } = req.query;
      const { skip, take } = getPaginationParams(parseInt(page), parseInt(limit));

      const logs = await prisma.auditLog.findMany({
        where: adminId ? { adminId } : {},
        skip,
        take,
        include: { admin: true },
        orderBy: { createdAt: 'desc' }
      });

      res.json(formatResponse(logs));
    } catch (error) {
      next(error);
    }
  }
};

module.exports = adminController;
