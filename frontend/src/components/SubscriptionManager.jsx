import React, { useState, useEffect } from 'react';
import { api } from '../api';

export default function SubscriptionManager() {
  const [students, setStudents] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [newSub, setNewSub] = useState({
    package_name: '',
    start_date: '',
    expiry_date: '',
    total_sessions: 10
  });
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    try {
      const res = await fetch('/api/students');
      if (res.ok) {
        const data = await res.json();
        setStudents(data);
      }
    } catch (error) {
      console.error('Error loading students:', error);
    }
  };

  const handleStudentChange = async (studentId) => {
    setSelectedStudent(studentId);
    if (studentId) {
      try {
        const subs = await api.getStudentSubscriptions(studentId);
        setSubscriptions(subs);
      } catch (error) {
        setSubscriptions([]);
      }
    } else {
      setSubscriptions([]);
    }
  };

  const handleCreateSubscription = async (e) => {
    e.preventDefault();
    if (!selectedStudent) {
      setMessage({ type: 'error', text: 'Please select a student' });
      return;
    }
    try {
      await api.createSubscription({
        ...newSub,
        student_id: selectedStudent
      });
      setMessage({ type: 'success', text: 'Subscription created successfully!' });
      setNewSub({ package_name: '', start_date: '', expiry_date: '', total_sessions: 10 });
      handleStudentChange(selectedStudent);
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    }
  };

  const handleUseSession = async (subId) => {
    try {
      await api.useSession(subId);
      setMessage({ type: 'success', text: 'Session used successfully!' });
      handleStudentChange(selectedStudent);
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString();
  };

  const getRemainingSessions = (sub) => {
    return sub.total_sessions - sub.used_sessions;
  };

  const isExpired = (expiryDate) => {
    return new Date(expiryDate) < new Date();
  };

  return (
    <div>
      <h1>Subscription Management</h1>

      {message.text && (
        <div className={message.type === 'error' ? 'error' : 'success'} style={{ padding: '10px', marginBottom: '20px', borderRadius: '4px', background: message.type === 'error' ? '#fdd' : '#dfd' }}>
          {message.text}
        </div>
      )}

      <div className="card" style={{ marginBottom: '30px' }}>
        <h2>Create Subscription</h2>
        <form onSubmit={handleCreateSubscription} className="flex-row" style={{ gap: '15px', alignItems: 'flex-end' }}>
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
                  <option key={s._id} value={s._id}>{s.name}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Package Name</label>
              <input
                type="text"
                value={newSub.package_name}
                onChange={(e) => setNewSub({ ...newSub, package_name: e.target.value })}
                placeholder="e.g., Monthly Package"
                required
              />
            </div>
          </div>
          <div className="flex-col">
            <div className="form-group">
              <label>Start Date</label>
              <input
                type="date"
                value={newSub.start_date}
                onChange={(e) => setNewSub({ ...newSub, start_date: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Expiry Date</label>
              <input
                type="date"
                value={newSub.expiry_date}
                onChange={(e) => setNewSub({ ...newSub, expiry_date: e.target.value })}
                required
              />
            </div>
          </div>
          <div className="flex-col">
            <div className="form-group">
              <label>Total Sessions</label>
              <input
                type="number"
                value={newSub.total_sessions}
                onChange={(e) => setNewSub({ ...newSub, total_sessions: parseInt(e.target.value) })}
                min="1"
              />
            </div>
            <button type="submit">Create Subscription</button>
          </div>
        </form>
      </div>

      {selectedStudent && (
        <div className="card">
          <h2>Student Subscriptions</h2>
          {subscriptions.length === 0 ? (
            <p>No subscriptions found for this student.</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Package</th>
                  <th>Start Date</th>
                  <th>Expiry Date</th>
                  <th>Total Sessions</th>
                  <th>Used</th>
                  <th>Remaining</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {subscriptions.map(sub => (
                  <tr key={sub._id}>
                    <td>{sub.package_name}</td>
                    <td>{formatDate(sub.start_date)}</td>
                    <td>{formatDate(sub.expiry_date)}</td>
                    <td>{sub.total_sessions}</td>
                    <td>{sub.used_sessions}</td>
                    <td>{getRemainingSessions(sub)}</td>
                    <td style={{ color: isExpired(sub.expiry_date) ? 'red' : 'green' }}>
                      {isExpired(sub.expiry_date) ? 'Expired' : 'Active'}
                    </td>
                    <td>
                      {!isExpired(sub.expiry_date) && getRemainingSessions(sub) > 0 && (
                        <button onClick={() => handleUseSession(sub._id)}>
                          Use Session
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}