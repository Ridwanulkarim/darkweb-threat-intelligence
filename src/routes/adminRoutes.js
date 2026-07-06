const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const adminMiddleware = require('../middleware/adminMiddleware');

// All admin routes require admin middleware
router.use(adminMiddleware);

router.post('/', adminController.createAdmin);
router.get('/', adminController.getAllAdmins);
router.get('/:id', adminController.getAdminById);
router.put('/:id', adminController.updateAdmin);
router.delete('/:id', adminController.deleteAdmin);
router.get('/:id/audit-logs', adminController.getAuditLogs);

module.exports = router;
