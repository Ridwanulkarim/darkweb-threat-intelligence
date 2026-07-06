const express = require('express');
const router = express.Router();
const phishingController = require('../controllers/phishingController');

router.post('/', phishingController.createAttack);
router.get('/', phishingController.getAllAttacks);
router.get('/:id', phishingController.getAttackById);
router.delete('/:id', phishingController.deleteAttack);

module.exports = router;
