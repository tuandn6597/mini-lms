const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
  student_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  package_name: {
    type: String,
    required: true,
    trim: true
  },
  start_date: {
    type: Date,
    default: Date.now
  },
  expiry_date: {
    type: Date,
    required: true
  },
  total_sessions: {
    type: Number,
    required: true,
    min: 1
  },
  used_sessions: {
    type: Number,
    default: 0,
    min: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Subscription', subscriptionSchema);