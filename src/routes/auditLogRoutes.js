const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const analystMiddleware = require('../middleware/analystMiddleware');
router.use(authMiddleware);
router.use(analystMiddleware);
const prisma = require('../database/prisma');
const { formatResponse, formatErrorResponse, getPaginationParams } = require('../utils/helpers');

// Safe admin selector omitting password
const adminSelect = {
  id: true,
  name: true,
  email: true,
  status: true
};

// Audit logs routes
router.post('/', async (req, res, next) => {
  try {
    const { adminId, action, target } = req.body || {};
    if (!adminId || !action || !target) {
      return res.status(400).json(formatErrorResponse('adminId, action, and target are required', 400));
    }
    const log = await prisma.auditLog.create({
      data: { adminId, action, target },
      include: { admin: { select: adminSelect } }
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
        include: { admin: { select: adminSelect } },
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
      include: { admin: { select: adminSelect } }
    });
    if (!log) return res.status(404).json(formatErrorResponse('Audit log not found', 404));
    res.json(formatResponse(log));
  } catch (error) {
    next(error);
  }
});

module.exports = router;
