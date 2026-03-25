const { Student, Parent } = require('../models');

const studentController = {
  async getAll(req, res) {
    try {
      const students = await Student.find().populate('parent_id');
      res.json(students);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async create(req, res) {
    try {
      const { name, dob, gender, current_grade, parent_id } = req.body;

      const parent = await Parent.findById(parent_id);
      if (!parent) {
        return res.status(400).json({ error: 'Parent not found' });
      }

      const student = new Student({ name, dob, gender, current_grade, parent_id });
      await student.save();
      res.status(201).json(student);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async getById(req, res) {
    try {
      const student = await Student.findById(req.params.id).populate('parent_id');
      if (!student) {
        return res.status(404).json({ error: 'Student not found' });
      }
      res.json(student);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
};

module.exports = studentController;