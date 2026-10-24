const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');
const authRateLimiter = require('../middleware/rateLimitMiddleware');
const prisma = require('../database/prisma');

// Guard for admin registration:
// Allows registration only if 0 admins exist (initial bootstrap).
// Otherwise strictly requires authenticated Admin token.
const bootstrapAdminGuard = async (req, res, next) => {
  try {
    const adminCount = await prisma.admin.count();
    if (adminCount === 0) {
      // First admin creation bootstrap
      return next();
    }

    // Existing admins present: require authenticated Admin token
    authMiddleware(req, res, (authErr) => {
      if (authErr) return next(authErr);
      adminMiddleware(req, res, next);
    });
  } catch (error) {
    next(error);
  }
};

// Rate-limited authentication endpoints
const limiter = authRateLimiter({ windowMs: 15 * 60 * 1000, maxAttempts: 10 });

router.post('/admin/register', limiter, bootstrapAdminGuard, authController.registerAdmin);
router.post('/admin/login', limiter, authController.adminLogin);
router.post('/analyst/register', limiter, authController.registerAnalyst);
router.post('/analyst/login', limiter, authController.analystLogin);

module.exports = router;
