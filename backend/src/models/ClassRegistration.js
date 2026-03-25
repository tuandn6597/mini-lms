const mongoose = require('mongoose');

const classRegistrationSchema = new mongoose.Schema({
  class_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class',
    required: true
  },
  student_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  registeredAt: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['active', 'cancelled'],
    default: 'active'
  },
  cancelledAt: {
    type: Date
  }
});

module.exports = mongoose.model('ClassRegistration', classRegistrationSchema);