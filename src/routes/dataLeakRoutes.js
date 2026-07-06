const express = require('express');
const router = express.Router();
const dataLeakController = require('../controllers/dataLeakController');
const authMiddleware = require('../middleware/authMiddleware');
const analystMiddleware = require('../middleware/analystMiddleware');

router.use(authMiddleware);
router.use(analystMiddleware);
router.post('/', dataLeakController.createLeak);
router.get('/', dataLeakController.getAllLeaks);
router.get('/:id', dataLeakController.getLeakById);
router.delete('/:id', dataLeakController.deleteLeak);

module.exports = router;
