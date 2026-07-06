const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
router.use(authMiddleware);
const prisma = require('../database/prisma');
const { formatResponse, getPaginationParams } = require('../utils/helpers');

// Audit logs routes
router.post('/', async (req, res, next) => {
  try {
    const log = await prisma.auditLog.create({
      data: req.body,
      include: { admin: true }
    });
    res.status(201).json(formatResponse(log));
  } catch (error) {
    next(error);
  }
});

router.get('/', async (req, res, next) => {
  try {
    const { page = 1, limit = 10, adminId } = req.query;
    const { skip, take } = getPaginationParams(parseInt(page), parseInt(limit));
    const where = adminId ? { adminId } : {};

    const [logs, total] = await Promise.all([
      prisma.auditLog.findMany({
        where,
        skip,
        take,
        include: { admin: true },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.auditLog.count({ where })
    ]);

    res.json(formatResponse({ logs, total, page: parseInt(page) }));
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const log = await prisma.auditLog.findUnique({
      where: { id: req.params.id },
      include: { admin: true }
    });
    res.json(formatResponse(log));
  } catch (error) {
    next(error);
  }
});

module.exports = router;
