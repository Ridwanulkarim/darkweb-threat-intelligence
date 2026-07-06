const express = require('express');
const router = express.Router();
const hackerGroupController = require('../controllers/hackerGroupController');

router.post('/', hackerGroupController.createGroup);
router.get('/', hackerGroupController.getAllGroups);
router.get('/:id', hackerGroupController.getGroupById);
router.put('/:id', hackerGroupController.updateGroup);
router.delete('/:id', hackerGroupController.deleteGroup);

module.exports = router;
