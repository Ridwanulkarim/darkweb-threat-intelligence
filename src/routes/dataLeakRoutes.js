const express = require('express');
const router = express.Router();
const dataLeakController = require('../controllers/dataLeakController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);
router.post('/', dataLeakController.createLeak);
router.get('/', dataLeakController.getAllLeaks);
router.get('/:id', dataLeakController.getLeakById);
router.delete('/:id', dataLeakController.deleteLeak);

module.exports = router;
