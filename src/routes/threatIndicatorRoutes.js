const express = require('express');
const router = express.Router();
const threatIndicatorController = require('../controllers/threatIndicatorController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);
router.post('/', threatIndicatorController.createIndicator);
router.get('/', threatIndicatorController.getAllIndicators);
router.get('/:id', threatIndicatorController.getIndicatorById);
router.put('/:id', threatIndicatorController.updateIndicator);
router.delete('/:id', threatIndicatorController.deleteIndicator);

module.exports = router;
