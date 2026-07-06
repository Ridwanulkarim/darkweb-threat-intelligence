const prisma = require('../database/prisma');
const { formatResponse, formatErrorResponse, getPaginationParams } = require('../utils/helpers');

const hackerGroupController = {
  createGroup: async (req, res, next) => {
    try {
      const { name } = req.body;
      const group = await prisma.hackerGroup.create({
        data: { name },
        include: { activities: true }
      });
      res.status(201).json(formatResponse(group, 'Hacker group created successfully'));
    } catch (error) {
      next(error);
    }
  },

  getAllGroups: async (req, res, next) => {
    try {
      const { page = 1, limit = 10 } = req.query;
      const { skip, take } = getPaginationParams(parseInt(page), parseInt(limit));

      const [groups, total] = await Promise.all([
        prisma.hackerGroup.findMany({
          skip,
          take,
          include: { activities: { take: 5 } },
          orderBy: { createdAt: 'desc' }
        }),
        prisma.hackerGroup.count()
      ]);

      res.json(formatResponse({ groups, total, page: parseInt(page) }));
    } catch (error) {
      next(error);
    }
  },

  getGroupById: async (req, res, next) => {
    try {
      const group = await prisma.hackerGroup.findUnique({
        where: { id: req.params.id },
        include: { activities: { include: { report: true } } }
      });
      if (!group) return res.status(404).json(formatErrorResponse('Hacker group not found', 404));
      res.json(formatResponse(group));
    } catch (error) {
      next(error);
    }
  },

  updateGroup: async (req, res, next) => {
    try {
      const group = await prisma.hackerGroup.update({
        where: { id: req.params.id },
        data: req.body,
        include: { activities: true }
      });
      res.json(formatResponse(group, 'Hacker group updated successfully'));
    } catch (error) {
      next(error);
    }
  },

  deleteGroup: async (req, res, next) => {
    try {
      await prisma.hackerGroupActivity.deleteMany({ where: { groupId: req.params.id } });
      await prisma.hackerGroup.delete({ where: { id: req.params.id } });
      res.json(formatResponse(null, 'Hacker group deleted successfully'));
    } catch (error) {
      next(error);
    }
  }
};

module.exports = hackerGroupController;
