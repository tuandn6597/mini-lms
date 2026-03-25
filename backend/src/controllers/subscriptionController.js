const { Subscription, Student } = require('../models');

const subscriptionController = {
  async create(req, res) {
    try {
      const { student_id, package_name, start_date, expiry_date, total_sessions } = req.body;

      const student = await Student.findById(student_id);
      if (!student) {
        return res.status(400).json({ error: 'Student not found' });
      }

      const subscription = new Subscription({
        student_id,
        package_name,
        start_date: start_date || new Date(),
        expiry_date,
        total_sessions,
        used_sessions: 0
      });
      await subscription.save();
      res.status(201).json(subscription);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async getById(req, res) {
    try {
      const subscription = await Subscription.findById(req.params.id);
      if (!subscription) {
        return res.status(404).json({ error: 'Subscription not found' });
      }
      res.json(subscription);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async useSession(req, res) {
    try {
      const subscription = await Subscription.findById(req.params.id);
      if (!subscription) {
        return res.status(404).json({ error: 'Subscription not found' });
      }

      if (subscription.expiry_date < new Date()) {
        return res.status(400).json({ error: 'Subscription has expired' });
      }

      if (subscription.used_sessions >= subscription.total_sessions) {
        return res.status(400).json({ error: 'No remaining sessions' });
      }

      subscription.used_sessions += 1;
      await subscription.save();
      res.json(subscription);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async getByStudent(req, res) {
    try {
      const subscriptions = await Subscription.find({ student_id: req.params.student_id });
      res.json(subscriptions);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
};

module.exports = subscriptionController;