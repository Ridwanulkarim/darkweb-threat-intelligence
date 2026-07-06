const express = require('express');
const router = express.Router();
const analystController = require('../controllers/analystController');
const analystMiddleware = require('../middleware/analystMiddleware');

router.use(analystMiddleware);

router.post('/', analystController.createAnalyst);
router.get('/', analystController.getAllAnalysts);
router.get('/:id', analystController.getAnalystById);
router.put('/:id', analystController.updateAnalyst);
router.delete('/:id', analystController.deleteAnalyst);

module.exports = router;
