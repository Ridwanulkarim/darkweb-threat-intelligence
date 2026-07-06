const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/admin/register', authController.registerAdmin);
router.post('/admin/login', authController.adminLogin);
router.post('/analyst/register', authController.registerAnalyst);
router.post('/analyst/login', authController.analystLogin);

module.exports = router;
