const express = require('express');
const router = express.Router();
const threatReportController = require('../controllers/threatReportController');
const authMiddleware = require('../middleware/authMiddleware');
const analystMiddleware = require('../middleware/analystMiddleware');

router.use(authMiddleware);
router.use(analystMiddleware);
router.post('/', threatReportController.createReport);
router.get('/', threatReportController.getAllReports);
router.get('/:id', threatReportController.getReportById);
router.put('/:id', threatReportController.updateReport);
router.delete('/:id', threatReportController.deleteReport);

module.exports = router;
