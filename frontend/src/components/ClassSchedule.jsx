import React, { useState, useEffect } from 'react';
import { api } from '../api';

const DAYS = ['', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function ClassSchedule() {
  const [classes, setClasses] = useState([]);
  const [newClass, setNewClass] = useState({
    name: '',
    subject: '',
    day_of_week: 1,
    time_slot: '',
    teacher_name: '',
    max_students: 20
  });
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    loadClasses();
  }, []);

  const loadClasses = async () => {
    try {
      const data = await api.getClasses();
      setClasses(data);
    } catch (error) {
      console.error('Error loading classes:', error);
    }
  };

  const handleCreateClass = async (e) => {
    e.preventDefault();
    try {
      await api.createClass(newClass);
      setMessage({ type: 'success', text: 'Class created successfully!' });
      setNewClass({ name: '', subject: '', day_of_week: 1, time_slot: '', teacher_name: '', max_students: 20 });
      loadClasses();
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    }
  };

  const getClassesByDay = (day) => {
    return classes.filter(c => c.day_of_week === day);
  };

  return (
    <div>
      <h1>Class Schedule</h1>

      {message.text && (
        <div className={message.type === 'error' ? 'error' : 'success'} style={{ padding: '10px', marginBottom: '20px', borderRadius: '4px', background: message.type === 'error' ? '#fdd' : '#dfd' }}>
          {message.text}
        </div>
      )}

      <div className="card" style={{ marginBottom: '30px' }}>
        <h2>Create New Class</h2>
        <form onSubmit={handleCreateClass} className="flex-row" style={{ gap: '15px' }}>
          <div className="flex-col">
            <div className="form-group">
              <label>Class Name</label>
              <input
                type="text"
                value={newClass.name}
                onChange={(e) => setNewClass({ ...newClass, name: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Subject</label>
              <input
                type="text"
                value={newClass.subject}
                onChange={(e) => setNewClass({ ...newClass, subject: e.target.value })}
                required
              />
            </div>
          </div>
          <div className="flex-col">
            <div className="form-group">
              <label>Day of Week</label>
              <select
                value={newClass.day_of_week}
                onChange={(e) => setNewClass({ ...newClass, day_of_week: parseInt(e.target.value) })}
              >
                {DAYS.slice(1).map((day, i) => (
                  <option key={i + 1} value={i + 1}>{day}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Time Slot (e.g., 09:00-10:30)</label>
              <input
                type="text"
                value={newClass.time_slot}
                onChange={(e) => setNewClass({ ...newClass, time_slot: e.target.value })}
                required
              />
            </div>
          </div>
          <div className="flex-col">
            <div className="form-group">
              <label>Teacher Name</label>
              <input
                type="text"
                value={newClass.teacher_name}
                onChange={(e) => setNewClass({ ...newClass, teacher_name: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Max Students</label>
              <input
                type="number"
                value={newClass.max_students}
                onChange={(e) => setNewClass({ ...newClass, max_students: parseInt(e.target.value) })}
                min="1"
              />
            </div>
          </div>
          <div className="flex-col" style={{ justifyContent: 'flex-end' }}>
            <button type="submit">Create Class</button>
          </div>
        </form>
      </div>

      <h2>Weekly Schedule</h2>
      <div className="week-schedule">
        {[1, 2, 3, 4, 5, 6, 7].map(day => (
          <div key={day} className="day-column">
            <h3>{DAYS[day]}</h3>
            {getClassesByDay(day).map(cls => (
              <div key={cls._id} className="class-item">
                <h4>{cls.name}</h4>
                <p><strong>Subject:</strong> {cls.subject}</p>
                <p><strong>Time:</strong> {cls.time_slot}</p>
                <p><strong>Teacher:</strong> {cls.teacher_name}</p>
                <p><strong>Max:</strong> {cls.max_students} students</p>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}