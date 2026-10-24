const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const analystMiddleware = require('../middleware/analystMiddleware');
router.use(authMiddleware);
router.use(analystMiddleware);
const prisma = require('../database/prisma');
const { formatResponse, formatErrorResponse, getPaginationParams } = require('../utils/helpers');

router.post('/', async (req, res, next) => {
  try {
    const { name, type, url, reliability } = req.body || {};
    if (!name || !type) {
      return res.status(400).json(formatErrorResponse('name and type are required', 400));
    }
    const source = await prisma.threatSource.create({
      data: { name, type, url, reliability }
    });
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
    if (!source) return res.status(404).json(formatErrorResponse('Source not found', 404));
    res.json(formatResponse(source));
  } catch (error) {
    next(error);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const { name, type, url, reliability } = req.body || {};
    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (type !== undefined) updateData.type = type;
    if (url !== undefined) updateData.url = url;
    if (reliability !== undefined) updateData.reliability = reliability;

    const source = await prisma.threatSource.update({
      where: { id: req.params.id },
      data: updateData
    });
    res.json(formatResponse(source, 'Source updated successfully'));
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    await prisma.threatSource.delete({ where: { id: req.params.id } });
    res.json(formatResponse(null, 'Source deleted successfully'));
  } catch (error) {
    next(error);
  }
});

module.exports = router;
