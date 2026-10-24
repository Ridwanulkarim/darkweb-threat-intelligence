const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const analystMiddleware = require('../middleware/analystMiddleware');
router.use(authMiddleware);
router.use(analystMiddleware);
const prisma = require('../database/prisma');
const { formatResponse, formatErrorResponse, getPaginationParams } = require('../utils/helpers');

router.post('/', async (req, res, next) => {
  try {
    const { groupId, reportId, type, details, date } = req.body || {};
    if (!groupId || !type || !details) {
      return res.status(400).json(formatErrorResponse('groupId, type, and details are required', 400));
    }
    const activity = await prisma.hackerGroupActivity.create({
      data: { 
        groupId, 
        reportId: reportId || null, 
        type, 
        details, 
        date: date || new Date().toISOString().split('T')[0] 
      },
      include: { group: true, report: true }
    });
    res.status(201).json(formatResponse(activity));
  } catch (error) {
    next(error);
  }
});

router.get('/', async (req, res, next) => {
  try {
    const { page = 1, limit = 10, groupId, type } = req.query;
    const { skip, take } = getPaginationParams(parseInt(page), parseInt(limit));
    const where = {};
    if (groupId) where.groupId = groupId;
    if (type) where.type = type;

    const [activities, total] = await Promise.all([
      prisma.hackerGroupActivity.findMany({
        where,
        skip,
        take,
        include: { group: true, report: true },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.hackerGroupActivity.count({ where })
    ]);

    res.json(formatResponse({ activities, total, page: parseInt(page) }));
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const activity = await prisma.hackerGroupActivity.findUnique({
      where: { id: req.params.id },
      include: { group: true, report: true }
    });
    if (!activity) return res.status(404).json(formatErrorResponse('Activity not found', 404));
    res.json(formatResponse(activity));
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    await prisma.hackerGroupActivity.delete({ where: { id: req.params.id } });
    res.json(formatResponse(null, 'Activity deleted successfully'));
  } catch (error) {
    next(error);
  }
});

module.exports = router;
