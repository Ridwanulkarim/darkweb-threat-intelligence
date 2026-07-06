const express = require('express');
const router = express.Router();
const investigationController = require('../controllers/investigationController');

router.post('/', investigationController.createInvestigation);
router.get('/', investigationController.getAllInvestigations);
router.get('/:id', investigationController.getInvestigationById);
router.put('/:id', investigationController.updateInvestigation);
router.delete('/:id', investigationController.deleteInvestigation);

module.exports = router;
