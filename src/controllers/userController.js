const prisma = require('../database/prisma');
const { formatResponse, formatErrorResponse, getPaginationParams, hashPassword } = require('../utils/helpers');

// Safe user selector omitting password
const userSelect = {
  id: true,
  orgId: true,
  email: true,
  status: true,
  createdAt: true,
  updatedAt: true
};

const userController = {
  createUser: async (req, res, next) => {
    try {
      const { orgId, email, password, status } = req.body || {};

      if (!orgId || !email || !password) {
        return res.status(400).json(formatErrorResponse('Organization ID, email, and password are required', 400));
      }

      const hashedPassword = hashPassword(password);
      const user = await prisma.userAccount.create({
        data: { 
          orgId, 
          email, 
          password: hashedPassword, 
          status: status || 'ACTIVE' 
        },
        select: userSelect
      });
      res.status(201).json(formatResponse(user, 'User created successfully'));
    } catch (error) {
      next(error);
    }
  },

  getAllUsers: async (req, res, next) => {
    try {
      const { page = 1, limit = 10, orgId, status } = req.query;
      const { skip, take } = getPaginationParams(parseInt(page), parseInt(limit));
      const where = {};
      if (orgId) where.orgId = orgId;
      if (status) where.status = status;

      const [users, total] = await Promise.all([
        prisma.userAccount.findMany({
          where,
          skip,
          take,
          select: {
            ...userSelect,
            organization: true,
            accessLogs: { take: 3 }
          },
          orderBy: { createdAt: 'desc' }
        }),
        prisma.userAccount.count({ where })
      ]);

      res.json(formatResponse({ users, total, page: parseInt(page) }));
    } catch (error) {
      next(error);
    }
  },

  getUserById: async (req, res, next) => {
    try {
      const user = await prisma.userAccount.findUnique({
        where: { id: req.params.id },
        select: {
          ...userSelect,
          organization: true,
          accessLogs: true
        }
      });
      if (!user) return res.status(404).json(formatErrorResponse('User not found', 404));
      res.json(formatResponse(user));
    } catch (error) {
      next(error);
    }
  },

  updateUser: async (req, res, next) => {
    try {
      const { orgId, email, password, status } = req.body || {};

      const updateData = {};
      if (orgId !== undefined) updateData.orgId = orgId;
      if (email !== undefined) updateData.email = email;
      if (status !== undefined) updateData.status = status;
      if (password) updateData.password = hashPassword(password);

      const user = await prisma.userAccount.update({
        where: { id: req.params.id },
        data: updateData,
        select: {
          ...userSelect,
          organization: true
        }
      });
      res.json(formatResponse(user, 'User updated successfully'));
    } catch (error) {
      next(error);
    }
  },

  deleteUser: async (req, res, next) => {
    try {
      await prisma.accessLog.deleteMany({ where: { userId: req.params.id } });
      await prisma.userAccount.delete({ where: { id: req.params.id } });
      res.json(formatResponse(null, 'User deleted successfully'));
    } catch (error) {
      next(error);
    }
  }
};

module.exports = userController;
