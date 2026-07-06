const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const analystMiddleware = require('../middleware/analystMiddleware');
router.use(authMiddleware);
router.use(analystMiddleware);
const prisma = require('../database/prisma');
const { formatResponse, getPaginationParams } = require('../utils/helpers');

router.post('/', async (req, res, next) => {
  try {
    const activity = await prisma.hackerGroupActivity.create({
      data: req.body,
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
    res.json(formatResponse(activity));
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    await prisma.hackerGroupActivity.delete({ where: { id: req.params.id } });
    res.json(formatResponse(null));
  } catch (error) {
    next(error);
  }
});

module.exports = router;
