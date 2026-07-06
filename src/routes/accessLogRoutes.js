const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
router.use(authMiddleware);
const prisma = require('../database/prisma');
const { formatResponse, getPaginationParams } = require('../utils/helpers');

// Access logs routes
router.post('/', async (req, res, next) => {
  try {
    const log = await prisma.accessLog.create({
      data: req.body,
      include: { user: true }
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

    const logs = await prisma.accessLog.findMany({
      where,
      skip,
      take,
      include: { user: true },
      orderBy: { createdAt: 'desc' }
    });

    res.json(formatResponse(logs));
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const log = await prisma.accessLog.findUnique({
      where: { id: req.params.id },
      include: { user: true }
    });
    res.json(formatResponse(log));
  } catch (error) {
    next(error);
  }
});

module.exports = router;
