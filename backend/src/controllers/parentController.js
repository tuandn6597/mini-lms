const { Parent } = require('../models');

const parentController = {
  async create(req, res) {
    try {
      const { name, phone, email } = req.body;
      const parent = new Parent({ name, phone, email });
      await parent.save();
      res.status(201).json(parent);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async getById(req, res) {
    try {
      const parent = await Parent.findById(req.params.id);
      if (!parent) {
        return res.status(404).json({ error: 'Parent not found' });
      }
      res.json(parent);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
};

module.exports = parentController;