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
    const response = await prisma.incidentResponse.create({
      data: req.body,
      include: { analyst: true, incident: true }
    });
    res.status(201).json(formatResponse(response));
  } catch (error) {
    next(error);
  }
});

router.get('/', async (req, res, next) => {
  try {
    const { page = 1, limit = 10, incidentId, analystId } = req.query;
    const { skip, take } = getPaginationParams(parseInt(page), parseInt(limit));
    const where = {};
    if (incidentId) where.incidentId = incidentId;
    if (analystId) where.analystId = analystId;

    const [responses, total] = await Promise.all([
      prisma.incidentResponse.findMany({
        where,
        skip,
        take,
        include: { analyst: true, incident: true },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.incidentResponse.count({ where })
    ]);

    res.json(formatResponse({ responses, total, page: parseInt(page) }));
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const response = await prisma.incidentResponse.findUnique({
      where: { id: req.params.id },
      include: { analyst: true, incident: true }
    });
    res.json(formatResponse(response));
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    await prisma.incidentResponse.delete({ where: { id: req.params.id } });
    res.json(formatResponse(null));
  } catch (error) {
    next(error);
  }
});

module.exports = router;
