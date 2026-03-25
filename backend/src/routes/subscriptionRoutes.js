const express = require('express');
const router = express.Router();
const subscriptionController = require('../controllers/subscriptionController');

router.post('/', subscriptionController.create);
router.get('/:id', subscriptionController.getById);
router.patch('/:id/use', subscriptionController.useSession);
router.get('/student/:student_id', subscriptionController.getByStudent);

module.exports = router;