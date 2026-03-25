const express = require('express');
const router = express.Router();
const registrationController = require('../controllers/registrationController');

router.get('/student/:student_id', registrationController.getByStudent);
router.delete('/:id', registrationController.cancel);

module.exports = router;