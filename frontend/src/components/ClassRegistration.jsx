import React, { useState, useEffect } from 'react';
import { api } from '../api';

const DAYS = ['', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function ClassRegistration() {
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedStudent, setSelectedStudent] = useState('');
  const [registrations, setRegistrations] = useState([]);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [classesData, allStudents] = await Promise.all([
        api.getClasses(),
        fetchStudents()
      ]);
      setClasses(classesData);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const fetchStudents = async () => {
    try {
      const res = await fetch('/api/students');
      if (res.ok) {
        const data = await res.json();
        setStudents(data);
        return data;
      }
    } catch (error) {
      console.error('Error fetching students:', error);
    }
    return [];
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!selectedClass || !selectedStudent) {
      setMessage({ type: 'error', text: 'Please select both class and student' });
      return;
    }
    try {
      await api.registerForClass(selectedClass, selectedStudent);
      setMessage({ type: 'success', text: 'Student registered successfully!' });
      setSelectedClass('');
      // Refresh registrations for selected student
      await handleStudentChange(selectedStudent);
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    }
  };

  const handleCancel = async (registrationId) => {
    try {
      await api.cancelRegistration(registrationId);
      setMessage({ type: 'success', text: 'Registration cancelled successfully!' });
      // Refresh registrations for selected student
      await handleStudentChange(selectedStudent);
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    }
  };

  const handleStudentChange = async (studentId) => {
    setSelectedStudent(studentId);
    if (studentId) {
      try {
        const regs = await api.getStudentRegistrations(studentId);
        setRegistrations(regs);
      } catch (error) {
        setRegistrations([]);
      }
    } else {
      setRegistrations([]);
    }
  };

  const getClassInfo = (classItem) => {
    // classItem can be either an object (populated) or just an ID string
    if (typeof classItem === 'object' && classItem !== null) {
      return classItem;
    }
    return classes.find(c => c._id === classItem);
  };

  return (
    <div>
      <h1>Class Registration</h1>

      {message.text && (
        <div className={message.type === 'error' ? 'error' : 'success'} style={{ padding: '10px', marginBottom: '20px', borderRadius: '4px', background: message.type === 'error' ? '#fdd' : '#dfd' }}>
          {message.text}
        </div>
      )}

      <div className="card" style={{ marginBottom: '30px' }}>
        <h2>Register for Class</h2>
        <form onSubmit={handleRegister} className="flex-row" style={{ gap: '15px', alignItems: 'flex-end' }}>
          <div className="flex-col">
            <div className="form-group">
              <label>Student</label>
              <select
                value={selectedStudent}
                onChange={(e) => handleStudentChange(e.target.value)}
                required
              >
                <option value="">Select Student</option>
                {students.map(s => (
                  <option key={s._id} value={s._id}>{s.name} {s.current_grade ? `(${s.current_grade})` : ''}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex-col">
            <div className="form-group">
              <label>Class</label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                required
              >
                <option value="">Select Class</option>
                {classes.map(c => (
                  <option key={c._id} value={c._id}>
                    {c.name} - {c.subject} ({DAYS[c.day_of_week]} {c.time_slot})
                  </option>
                ))}
              </select>
            </div>
          </div>
          <button type="submit">Register</button>
        </form>
      </div>

      {selectedStudent && registrations.length > 0 && (
        <div className="card">
          <h2>Student's Current Registrations</h2>
          <table>
            <thead>
              <tr>
                <th>Class</th>
                <th>Subject</th>
                <th>Day</th>
                <th>Time</th>
                <th>Teacher</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {registrations.map(reg => {
                const cls = getClassInfo(reg.class_id);
                return cls ? (
                  <tr key={reg._id}>
                    <td>{cls.name}</td>
                    <td>{cls.subject}</td>
                    <td>{DAYS[cls.day_of_week]}</td>
                    <td>{cls.time_slot}</td>
                    <td>{cls.teacher_name}</td>
                    <td>
                      <button className="danger" onClick={() => handleCancel(reg._id)}>
                        Cancel
                      </button>
                    </td>
                  </tr>
                ) : null;
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}