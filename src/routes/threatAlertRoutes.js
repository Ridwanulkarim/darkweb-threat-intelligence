const express = require('express');
const router = express.Router();
const alertController = require('../controllers/alertController');
const authMiddleware = require('../middleware/authMiddleware');
const analystMiddleware = require('../middleware/analystMiddleware');

router.use(authMiddleware);
router.use(analystMiddleware);
router.post('/', alertController.createAlert);
router.get('/', alertController.getAllAlerts);
router.get('/:id', alertController.getAlertById);
router.delete('/:id', alertController.deleteAlert);

module.exports = router;
