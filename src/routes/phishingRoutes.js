const express = require('express');
const router = express.Router();
const phishingController = require('../controllers/phishingController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);
router.post('/', phishingController.createAttack);
router.get('/', phishingController.getAllAttacks);
router.get('/:id', phishingController.getAttackById);
router.delete('/:id', phishingController.deleteAttack);

module.exports = router;
