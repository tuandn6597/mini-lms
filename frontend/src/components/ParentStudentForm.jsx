import React, { useState } from 'react';
import { api } from '../api';

export default function ParentStudentForm() {
  const [parent, setParent] = useState({ name: '', phone: '', email: '' });
  const [student, setStudent] = useState({ name: '', dob: '', gender: '', current_grade: '', parent_id: '' });
  const [message, setMessage] = useState({ type: '', text: '' });
  const [createdParent, setCreatedParent] = useState(null);
  const [createdStudent, setCreatedStudent] = useState(null);

  const handleParentSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await api.createParent(parent);
      setCreatedParent(result);
      setStudent({ ...student, parent_id: result._id });
      setMessage({ type: 'success', text: 'Parent created successfully!' });
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    }
  };

  const handleStudentSubmit = async (e) => {
    e.preventDefault();
    if (!createdParent) {
      setMessage({ type: 'error', text: 'Please create a parent first' });
      return;
    }
    try {
      const studentData = { ...student, parent_id: createdParent._id };
      const result = await api.createStudent(studentData);
      setCreatedStudent(result);
      setMessage({ type: 'success', text: 'Student created successfully!' });
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    }
  };

  return (
    <div>
      <h1>Parent & Student Management</h1>

      {message.text && (
        <div className={message.type === 'error' ? 'error' : 'success'} style={{ padding: '10px', marginBottom: '20px', borderRadius: '4px', background: message.type === 'error' ? '#fdd' : '#dfd' }}>
          {message.text}
        </div>
      )}

      <div className="flex-row">
        <div className="card flex-col">
          <h2>Create Parent</h2>
          <form onSubmit={handleParentSubmit}>
            <div className="form-group">
              <label>Name *</label>
              <input
                type="text"
                value={parent.name}
                onChange={(e) => setParent({ ...parent, name: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Phone *</label>
              <input
                type="text"
                value={parent.phone}
                onChange={(e) => setParent({ ...parent, phone: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={parent.email}
                onChange={(e) => setParent({ ...parent, email: e.target.value })}
              />
            </div>
            <button type="submit">Create Parent</button>
          </form>

          {createdParent && (
            <div style={{ marginTop: '20px', padding: '15px', background: '#f8f9fa', borderRadius: '4px' }}>
              <h3>Created Parent</h3>
              <p><strong>ID:</strong> {createdParent._id}</p>
              <p><strong>Name:</strong> {createdParent.name}</p>
              <p><strong>Phone:</strong> {createdParent.phone}</p>
            </div>
          )}
        </div>

        <div className="card flex-col">
          <h2>Create Student</h2>
          <form onSubmit={handleStudentSubmit}>
            <div className="form-group">
              <label>Name *</label>
              <input
                type="text"
                value={student.name}
                onChange={(e) => setStudent({ ...student, name: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Date of Birth</label>
              <input
                type="date"
                value={student.dob}
                onChange={(e) => setStudent({ ...student, dob: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Gender</label>
              <select
                value={student.gender}
                onChange={(e) => setStudent({ ...student, gender: e.target.value })}
              >
                <option value="">Select</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="form-group">
              <label>Current Grade</label>
              <input
                type="text"
                value={student.current_grade}
                onChange={(e) => setStudent({ ...student, current_grade: e.target.value })}
              />
            </div>
            <button type="submit" disabled={!createdParent}>
              {createdParent ? 'Create Student' : 'Create Parent First'}
            </button>
          </form>

          {createdStudent && (
            <div style={{ marginTop: '20px', padding: '15px', background: '#f8f9fa', borderRadius: '4px' }}>
              <h3>Created Student</h3>
              <p><strong>ID:</strong> {createdStudent._id}</p>
              <p><strong>Name:</strong> {createdStudent.name}</p>
              <p><strong>Grade:</strong> {createdStudent.current_grade}</p>
              <p><strong>Parent:</strong> {createdStudent.parent_id?.name || createdParent.name}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}