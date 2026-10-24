const express = require('express');
const router = express.Router();
const analystController = require('../controllers/analystController');
const authMiddleware = require('../middleware/authMiddleware');
const analystMiddleware = require('../middleware/analystMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

// All analyst routes require authentication
router.use(authMiddleware);

// Viewing analysts: accessible by Analysts and Admins
router.get('/', analystMiddleware, analystController.getAllAnalysts);
router.get('/:id', analystMiddleware, analystController.getAnalystById);

// Creating analysts: strictly requires Admin privileges
router.post('/', adminMiddleware, analystController.createAnalyst);

// Deleting analysts: strictly requires Admin privileges
router.delete('/:id', adminMiddleware, analystController.deleteAnalyst);

// Updating analyst profile: self-update or Admin (controller enforces role/status restrictions)
router.put('/:id', analystController.updateAnalyst);

module.exports = router;
