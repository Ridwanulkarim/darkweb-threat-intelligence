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
    const recommendation = await prisma.securityRecommendation.create({
      data: req.body,
      include: { report: true }
    });
    res.status(201).json(formatResponse(recommendation));
  } catch (error) {
    next(error);
  }
});

router.get('/', async (req, res, next) => {
  try {
    const { page = 1, limit = 10, reportId } = req.query;
    const { skip, take } = getPaginationParams(parseInt(page), parseInt(limit));
    const where = reportId ? { reportId } : {};

    const [recommendations, total] = await Promise.all([
      prisma.securityRecommendation.findMany({
        where,
        skip,
        take,
        include: { report: true },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.securityRecommendation.count({ where })
    ]);

    res.json(formatResponse({ recommendations, total, page: parseInt(page) }));
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const recommendation = await prisma.securityRecommendation.findUnique({
      where: { id: req.params.id },
      include: { report: true }
    });
    res.json(formatResponse(recommendation));
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    await prisma.securityRecommendation.delete({ where: { id: req.params.id } });
    res.json(formatResponse(null));
  } catch (error) {
    next(error);
  }
});

module.exports = router;
