const { Class, ClassRegistration } = require('../models');

const classController = {
  async create(req, res) {
    try {
      const { name, subject, day_of_week, time_slot, teacher_name, max_students } = req.body;
      const classData = new Class({ name, subject, day_of_week, time_slot, teacher_name, max_students });
      await classData.save();
      res.status(201).json(classData);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async getAll(req, res) {
    try {
      const { day } = req.query;
      const filter = day ? { day_of_week: parseInt(day) } : {};
      const classes = await Class.find(filter).sort({ day_of_week: 1, time_slot: 1 });
      res.json(classes);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async getById(req, res) {
    try {
      const classData = await Class.findById(req.params.id);
      if (!classData) {
        return res.status(404).json({ error: 'Class not found' });
      }
      res.json(classData);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async getRegistrationCount(req, res) {
    try {
      const count = await ClassRegistration.countDocuments({
        class_id: req.params.id,
        status: 'active'
      });
      res.json({ count });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
};

module.exports = classController;