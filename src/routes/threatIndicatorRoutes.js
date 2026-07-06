const express = require('express');
const router = express.Router();
const threatIndicatorController = require('../controllers/threatIndicatorController');
const authMiddleware = require('../middleware/authMiddleware');
const analystMiddleware = require('../middleware/analystMiddleware');

router.use(authMiddleware);
router.use(analystMiddleware);
router.post('/', threatIndicatorController.createIndicator);
router.get('/', threatIndicatorController.getAllIndicators);
router.get('/:id', threatIndicatorController.getIndicatorById);
router.put('/:id', threatIndicatorController.updateIndicator);
router.delete('/:id', threatIndicatorController.deleteIndicator);

module.exports = router;
