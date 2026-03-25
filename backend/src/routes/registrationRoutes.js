const express = require('express');
const router = express.Router();
const registrationController = require('../controllers/registrationController');

router.delete('/:id', registrationController.cancel);
router.get('/student/:student_id', registrationController.getByStudent);

module.exports = router;