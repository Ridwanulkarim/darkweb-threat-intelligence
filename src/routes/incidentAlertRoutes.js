const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
router.use(authMiddleware);
const prisma = require('../database/prisma');
const { formatResponse, getPaginationParams } = require('../utils/helpers');

router.post('/', async (req, res, next) => {
  try {
    const alert = await prisma.incidentAlert.create({
      data: req.body,
      include: { incident: true }
    });
    res.status(201).json(formatResponse(alert));
  } catch (error) {
    next(error);
  }
});

router.get('/', async (req, res, next) => {
  try {
    const { page = 1, limit = 10, incidentId, level } = req.query;
    const { skip, take } = getPaginationParams(parseInt(page), parseInt(limit));
    const where = {};
    if (incidentId) where.incidentId = incidentId;
    if (level) where.level = level;

    const [alerts, total] = await Promise.all([
      prisma.incidentAlert.findMany({
        where,
        skip,
        take,
        include: { incident: true },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.incidentAlert.count({ where })
    ]);

    res.json(formatResponse({ alerts, total, page: parseInt(page) }));
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const alert = await prisma.incidentAlert.findUnique({
      where: { id: req.params.id },
      include: { incident: true }
    });
    res.json(formatResponse(alert));
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    await prisma.incidentAlert.delete({ where: { id: req.params.id } });
    res.json(formatResponse(null));
  } catch (error) {
    next(error);
  }
});

module.exports = router;
