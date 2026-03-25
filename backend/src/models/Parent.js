const mongoose = require('mongoose');

const parentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    trim: true,
    lowercase: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Parent', parentSchema);