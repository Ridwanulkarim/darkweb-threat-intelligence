const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
router.use(authMiddleware);
const prisma = require('../database/prisma');
const { formatResponse, getPaginationParams } = require('../utils/helpers');

router.post('/', async (req, res, next) => {
  try {
    const source = await prisma.threatSource.create({ data: req.body });
    res.status(201).json(formatResponse(source));
  } catch (error) {
    next(error);
  }
});

router.get('/', async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const { skip, take } = getPaginationParams(parseInt(page), parseInt(limit));

    const [sources, total] = await Promise.all([
      prisma.threatSource.findMany({ skip, take, orderBy: { createdAt: 'desc' } }),
      prisma.threatSource.count()
    ]);

    res.json(formatResponse({ sources, total, page: parseInt(page) }));
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const source = await prisma.threatSource.findUnique({
      where: { id: req.params.id },
      include: { reports: { take: 10 } }
    });
    res.json(formatResponse(source));
  } catch (error) {
    next(error);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const source = await prisma.threatSource.update({
      where: { id: req.params.id },
      data: req.body
    });
    res.json(formatResponse(source));
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    await prisma.threatSource.delete({ where: { id: req.params.id } });
    res.json(formatResponse(null));
  } catch (error) {
    next(error);
  }
});

module.exports = router;
