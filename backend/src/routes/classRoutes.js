const express = require('express');
const router = express.Router();
const classController = require('../controllers/classController');
const registrationController = require('../controllers/registrationController');

router.post('/', classController.create);
router.get('/', classController.getAll);
router.get('/:id', classController.getById);
router.get('/:id/count', classController.getRegistrationCount);
router.post('/:class_id/register', registrationController.register);

module.exports = router;