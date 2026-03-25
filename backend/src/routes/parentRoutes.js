const express = require('express');
const router = express.Router();
const parentController = require('../controllers/parentController');

router.post('/', parentController.create);
router.get('/:id', parentController.getById);

module.exports = router;