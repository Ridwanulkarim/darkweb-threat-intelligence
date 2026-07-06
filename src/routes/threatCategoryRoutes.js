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
    const category = await prisma.threatCategory.create({ data: req.body });
    res.status(201).json(formatResponse(category));
  } catch (error) {
    next(error);
  }
});

router.get('/', async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const { skip, take } = getPaginationParams(parseInt(page), parseInt(limit));

    const [categories, total] = await Promise.all([
      prisma.threatCategory.findMany({ skip, take, orderBy: { createdAt: 'desc' } }),
      prisma.threatCategory.count()
    ]);

    res.json(formatResponse({ categories, total, page: parseInt(page) }));
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const category = await prisma.threatCategory.findUnique({
      where: { id: req.params.id },
      include: { reports: { take: 10 } }
    });
    res.json(formatResponse(category));
  } catch (error) {
    next(error);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const category = await prisma.threatCategory.update({
      where: { id: req.params.id },
      data: req.body
    });
    res.json(formatResponse(category));
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    await prisma.threatCategory.delete({ where: { id: req.params.id } });
    res.json(formatResponse(null));
  } catch (error) {
    next(error);
  }
});

module.exports = router;
