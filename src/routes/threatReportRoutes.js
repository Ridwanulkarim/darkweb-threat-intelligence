const express = require('express');
const router = express.Router();
const threatReportController = require('../controllers/threatReportController');

router.post('/', threatReportController.createReport);
router.get('/', threatReportController.getAllReports);
router.get('/:id', threatReportController.getReportById);
router.put('/:id', threatReportController.updateReport);
router.delete('/:id', threatReportController.deleteReport);

module.exports = router;
