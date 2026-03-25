const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const parentRoutes = require('./routes/parentRoutes');
const studentRoutes = require('./routes/studentRoutes');
const classRoutes = require('./routes/classRoutes');
const registrationRoutes = require('./routes/registrationRoutes');
const subscriptionRoutes = require('./routes/subscriptionRoutes');

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27200/mini-lms';

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/parents', parentRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/classes', classRoutes);
app.use('/api/registrations', registrationRoutes);
app.use('/api/subscriptions', subscriptionRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Connect to MongoDB and start server
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  });

module.exports = app;