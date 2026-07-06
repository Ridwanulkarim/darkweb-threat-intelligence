const express = require('express');
const router = express.Router();
const prisma = require('../database/prisma');
const { formatResponse, getPaginationParams } = require('../utils/helpers');

router.post('/', async (req, res, next) => {
  try {
    const credential = await prisma.leakedCredential.create({
      data: req.body,
      include: { leak: true }
    });
    res.status(201).json(formatResponse(credential));
  } catch (error) {
    next(error);
  }
});

router.get('/', async (req, res, next) => {
  try {
    const { page = 1, limit = 10, leakId } = req.query;
    const { skip, take } = getPaginationParams(parseInt(page), parseInt(limit));
    const where = leakId ? { leakId } : {};

    const [credentials, total] = await Promise.all([
      prisma.leakedCredential.findMany({
        where,
        skip,
        take,
        include: { leak: true },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.leakedCredential.count({ where })
    ]);

    res.json(formatResponse({ credentials, total, page: parseInt(page) }));
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const credential = await prisma.leakedCredential.findUnique({
      where: { id: req.params.id },
      include: { leak: true }
    });
    res.json(formatResponse(credential));
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    await prisma.leakedCredential.delete({ where: { id: req.params.id } });
    res.json(formatResponse(null));
  } catch (error) {
    next(error);
  }
});

module.exports = router;
