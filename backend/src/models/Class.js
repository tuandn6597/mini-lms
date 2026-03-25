const mongoose = require('mongoose');

const classSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  subject: {
    type: String,
    required: true,
    trim: true
  },
  day_of_week: {
    type: Number,
    required: true,
    min: 1,
    max: 7
  },
  time_slot: {
    type: String,
    required: true,
    trim: true
  },
  teacher_name: {
    type: String,
    required: true,
    trim: true
  },
  max_students: {
    type: Number,
    default: 20,
    min: 1
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Class', classSchema);