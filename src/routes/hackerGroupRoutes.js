const express = require('express');
const router = express.Router();
const hackerGroupController = require('../controllers/hackerGroupController');
const authMiddleware = require('../middleware/authMiddleware');
const analystMiddleware = require('../middleware/analystMiddleware');

router.use(authMiddleware);
router.use(analystMiddleware);
router.post('/', hackerGroupController.createGroup);
router.get('/', hackerGroupController.getAllGroups);
router.get('/:id', hackerGroupController.getGroupById);
router.put('/:id', hackerGroupController.updateGroup);
router.delete('/:id', hackerGroupController.deleteGroup);

module.exports = router;
