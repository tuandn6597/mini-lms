import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import ParentStudentForm from './components/ParentStudentForm';
import ClassSchedule from './components/ClassSchedule';
import ClassRegistration from './components/ClassRegistration';
import SubscriptionManager from './components/SubscriptionManager';

function App() {
  return (
    <Router>
      <nav>
        <div className="container">
          <ul>
            <li><Link to="/">Parent & Student</Link></li>
            <li><Link to="/classes">Class Schedule</Link></li>
            <li><Link to="/register">Register for Class</Link></li>
            <li><Link to="/subscriptions">Subscriptions</Link></li>
          </ul>
        </div>
      </nav>
      <div className="container">
        <Routes>
          <Route path="/" element={<ParentStudentForm />} />
          <Route path="/classes" element={<ClassSchedule />} />
          <Route path="/register" element={<ClassRegistration />} />
          <Route path="/subscriptions" element={<SubscriptionManager />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;