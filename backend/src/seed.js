const mongoose = require('mongoose');
require('dotenv').config();

const Parent = require('./models/Parent');
const Student = require('./models/Student');
const Class = require('./models/Class');
const Subscription = require('./models/Subscription');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27200/mini-lms';

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await Parent.deleteMany({});
    await Student.deleteMany({});
    await Class.deleteMany({});
    await Subscription.deleteMany({});
    console.log('Cleared existing data');

    // Create Parents
    const parents = await Parent.create([
      { name: 'Nguyen Van A', phone: '0987654321', email: 'nguyenvana@email.com' },
      { name: 'Tran Thi B', phone: '0976543210', email: 'tranthib@email.com' }
    ]);
    console.log('Created parents:', parents.length);

    // Create Students
    const students = await Student.create([
      { name: 'Nguyen Hoang Nam', dob: '2010-05-15', gender: 'male', current_grade: '8', parent_id: parents[0]._id },
      { name: 'Tran Minh Duc', dob: '2011-08-20', gender: 'male', current_grade: '7', parent_id: parents[0]._id },
      { name: 'Pham Thu Ha', dob: '2009-03-10', gender: 'female', current_grade: '9', parent_id: parents[1]._id }
    ]);
    console.log('Created students:', students.length);

    // Create Classes
    const classes = await Class.create([
      {
        name: 'Toan 8',
        subject: 'Mathematics',
        day_of_week: 2,
        time_slot: '09:00-10:30',
        teacher_name: 'Teacher Tuan',
        max_students: 20
      },
      {
        name: 'Van 8',
        subject: 'Literature',
        day_of_week: 3,
        time_slot: '13:00-14:30',
        teacher_name: 'Teacher Mai',
        max_students: 25
      },
      {
        name: 'Anh 7',
        subject: 'English',
        day_of_week: 5,
        time_slot: '15:00-16:30',
        teacher_name: 'Teacher John',
        max_students: 15
      }
    ]);
    console.log('Created classes:', classes.length);

    // Create Subscriptions
    await Subscription.create([
      {
        student_id: students[0]._id,
        package_name: 'Monthly Package',
        start_date: new Date(),
        expiry_date: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        total_sessions: 12,
        used_sessions: 0
      },
      {
        student_id: students[1]._id,
        package_name: 'Quarterly Package',
        start_date: new Date(),
        expiry_date: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000),
        total_sessions: 36,
        used_sessions: 0
      },
      {
        student_id: students[2]._id,
        package_name: 'Monthly Package',
        start_date: new Date(),
        expiry_date: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        total_sessions: 12,
        used_sessions: 0
      }
    ]);
    console.log('Created subscriptions');

    console.log('\n=== Seed Data Summary ===');
    console.log('Parents:', parents.map(p => `${p.name} (${p._id})`));
    console.log('Students:', students.map(s => `${s.name} - Grade ${s.current_grade} (${s._id})`));
    console.log('Classes:', classes.map(c => `${c.name} (${c.subject}) - ${c.time_slot}`));

    await mongoose.disconnect();
    console.log('\nSeed completed!');
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
}

seed();