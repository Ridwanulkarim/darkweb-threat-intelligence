const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const analystMiddleware = require('../middleware/analystMiddleware');
router.use(authMiddleware);
router.use(analystMiddleware);
const prisma = require('../database/prisma');
const { formatResponse, formatErrorResponse, getPaginationParams } = require('../utils/helpers');

// Safe analyst selector omitting password
const analystSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
  status: true
};

router.post('/', async (req, res, next) => {
  try {
    const { incidentId, analystId, action, status } = req.body || {};
    if (!incidentId || !analystId || !action) {
      return res.status(400).json(formatErrorResponse('incidentId, analystId, and action are required', 400));
    }
    const response = await prisma.incidentResponse.create({
      data: { incidentId, analystId, action, status: status || 'PENDING' },
      include: { analyst: { select: analystSelect }, incident: true }
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
        include: { analyst: { select: analystSelect }, incident: true },
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
      include: { analyst: { select: analystSelect }, incident: true }
    });
    if (!response) return res.status(404).json(formatErrorResponse('Response not found', 404));
    res.json(formatResponse(response));
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    await prisma.incidentResponse.delete({ where: { id: req.params.id } });
    res.json(formatResponse(null, 'Response deleted successfully'));
  } catch (error) {
    next(error);
  }
});

module.exports = router;
