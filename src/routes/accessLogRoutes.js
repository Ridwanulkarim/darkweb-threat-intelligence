const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const analystMiddleware = require('../middleware/analystMiddleware');
router.use(authMiddleware);
router.use(analystMiddleware);
const prisma = require('../database/prisma');
const { formatResponse, formatErrorResponse, getPaginationParams } = require('../utils/helpers');

// Safe user selector omitting password
const userSelect = {
  id: true,
  orgId: true,
  email: true,
  status: true
};

// Access logs routes
router.post('/', async (req, res, next) => {
  try {
    const { userId, ip, status } = req.body || {};
    if (!userId || !ip) {
      return res.status(400).json(formatErrorResponse('userId and ip are required', 400));
    }
    const log = await prisma.accessLog.create({
      data: { userId, ip, status: status || 'SUCCESS' },
      include: { user: { select: userSelect } }
    });
    res.status(201).json(formatResponse(log));
  } catch (error) {
    next(error);
  }
});

router.get('/', async (req, res, next) => {
  try {
    const { page = 1, limit = 10, userId } = req.query;
    const { skip, take } = getPaginationParams(parseInt(page), parseInt(limit));
    const where = userId ? { userId } : {};

    const [logs, total] = await Promise.all([
      prisma.accessLog.findMany({
        where,
        skip,
        take,
        include: { user: { select: userSelect } },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.accessLog.count({ where })
    ]);

    res.json(formatResponse({ logs, total, page: parseInt(page) }));
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const log = await prisma.accessLog.findUnique({
      where: { id: req.params.id },
      include: { user: { select: userSelect } }
    });
    if (!log) return res.status(404).json(formatErrorResponse('Access log not found', 404));
    res.json(formatResponse(log));
  } catch (error) {
    next(error);
  }
});

module.exports = router;
