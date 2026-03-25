const { ClassRegistration, Class, Student, Subscription } = require('../models');

const registrationController = {
  async register(req, res) {
    try {
      const { class_id } = req.params;
      const { student_id } = req.body;

      const classData = await Class.findById(class_id);
      if (!classData) {
        return res.status(404).json({ error: 'Class not found' });
      }

      const student = await Student.findById(student_id);
      if (!student) {
        return res.status(404).json({ error: 'Student not found' });
      }

      // Check max students
      const currentCount = await ClassRegistration.countDocuments({
        class_id,
        status: 'active'
      });
      if (currentCount >= classData.max_students) {
        return res.status(400).json({ error: 'Class is full' });
      }

      // Check schedule conflict - student cannot register for 2 classes at same time on same day
      const existingRegistrations = await ClassRegistration.find({
        student_id,
        status: 'active'
      }).populate('class_id');

      for (const reg of existingRegistrations) {
        if (reg.class_id.day_of_week === classData.day_of_week &&
            reg.class_id.time_slot === classData.time_slot &&
            reg.class_id._id.toString() !== class_id) {
          return res.status(400).json({
            error: 'Schedule conflict: Student already has a class at this time'
          });
        }
      }

      // Check subscription validity
      const subscription = await Subscription.findOne({
        student_id,
        expiry_date: { $gte: new Date() },
        status: { $ne: 'expired' }
      }).sort({ expiry_date: -1 });

      if (!subscription) {
        return res.status(400).json({ error: 'No valid subscription found for student' });
      }

      if (subscription.used_sessions >= subscription.total_sessions) {
        return res.status(400).json({ error: 'Subscription has no remaining sessions' });
      }

      // Create registration
      const registration = new ClassRegistration({
        class_id,
        student_id,
        registeredAt: new Date(),
        status: 'active'
      });
      await registration.save();

      res.status(201).json(registration);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async cancel(req, res) {
    try {
      const registration = await ClassRegistration.findById(req.params.id);
      if (!registration) {
        return res.status(404).json({ error: 'Registration not found' });
      }

      if (registration.status === 'cancelled') {
        return res.status(400).json({ error: 'Registration already cancelled' });
      }

      registration.status = 'cancelled';
      registration.cancelledAt = new Date();
      await registration.save();

      // Refund session - decrease used_sessions
      await Subscription.findOneAndUpdate(
        { student_id: registration.student_id, status: { $ne: 'cancelled' } },
        { $inc: { used_sessions: -1 } },
        { sort: { expiry_date: -1 } }
      );

      res.json(registration);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async getByStudent(req, res) {
    try {
      const registrations = await ClassRegistration.find({
        student_id: req.params.student_id,
        status: 'active'
      }).populate('class_id');
      res.json(registrations);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
};

module.exports = registrationController;