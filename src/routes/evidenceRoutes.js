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
    const evidence = await prisma.evidence.create({
      data: req.body,
      include: { investigation: true }
    });
    res.status(201).json(formatResponse(evidence));
  } catch (error) {
    next(error);
  }
});

router.get('/', async (req, res, next) => {
  try {
    const { page = 1, limit = 10, investigationId } = req.query;
    const { skip, take } = getPaginationParams(parseInt(page), parseInt(limit));
    const where = investigationId ? { investigationId } : {};

    const [evidence, total] = await Promise.all([
      prisma.evidence.findMany({
        where,
        skip,
        take,
        include: { investigation: true },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.evidence.count({ where })
    ]);

    res.json(formatResponse({ evidence, total, page: parseInt(page) }));
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const evidence = await prisma.evidence.findUnique({
      where: { id: req.params.id },
      include: { investigation: true }
    });
    res.json(formatResponse(evidence));
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    await prisma.evidence.delete({ where: { id: req.params.id } });
    res.json(formatResponse(null));
  } catch (error) {
    next(error);
  }
});

module.exports = router;
