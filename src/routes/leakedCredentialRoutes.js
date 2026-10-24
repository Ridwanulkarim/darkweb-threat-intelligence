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
    const { leakId, email, maskedPass, hashType } = req.body || {};
    if (!leakId || !email || !maskedPass) {
      return res.status(400).json(formatErrorResponse('leakId, email, and maskedPass are required', 400));
    }
    const credential = await prisma.leakedCredential.create({
      data: { leakId, email, maskedPass, hashType: hashType || 'UNKNOWN' },
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
    if (!credential) return res.status(404).json(formatErrorResponse('Credential not found', 404));
    res.json(formatResponse(credential));
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    await prisma.leakedCredential.delete({ where: { id: req.params.id } });
    res.json(formatResponse(null, 'Credential deleted successfully'));
  } catch (error) {
    next(error);
  }
});

module.exports = router;
