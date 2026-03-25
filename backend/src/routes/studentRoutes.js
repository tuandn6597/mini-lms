const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');

router.get('/', studentController.getAll);
router.post('/', studentController.create);
router.get('/:id', studentController.getById);

module.exports = router;