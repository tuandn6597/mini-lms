const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  dob: {
    type: Date
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other']
  },
  current_grade: {
    type: String
  },
  parent_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Parent',
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Student', studentSchema);