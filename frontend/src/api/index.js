const API_BASE = '/api';

async function handleResponse(response) {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Something went wrong');
  }
  return data;
}

export const api = {
  // Parents
  createParent: async (parent) => {
    const response = await fetch(`${API_BASE}/parents`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(parent)
    });
    return handleResponse(response);
  },

  getParent: async (id) => {
    const response = await fetch(`${API_BASE}/parents/${id}`);
    return handleResponse(response);
  },

  // Students
  createStudent: async (student) => {
    const response = await fetch(`${API_BASE}/students`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(student)
    });
    return handleResponse(response);
  },

  getStudent: async (id) => {
    const response = await fetch(`${API_BASE}/students/${id}`);
    return handleResponse(response);
  },

  getAllStudents: async () => {
    const response = await fetch(`${API_BASE}/students`);
    if (!response.ok) return [];
    return handleResponse(response);
  },

  // Classes
  createClass: async (classData) => {
    const response = await fetch(`${API_BASE}/classes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(classData)
    });
    return handleResponse(response);
  },

  getClasses: async (day) => {
    const url = day ? `${API_BASE}/classes?day=${day}` : `${API_BASE}/classes`;
    const response = await fetch(url);
    return handleResponse(response);
  },

  getClassCount: async (id) => {
    const response = await fetch(`${API_BASE}/classes/${id}/count`);
    return handleResponse(response);
  },

  // Registrations
  registerForClass: async (classId, studentId) => {
    const response = await fetch(`${API_BASE}/classes/${classId}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ student_id: studentId })
    });
    return handleResponse(response);
  },

  cancelRegistration: async (id) => {
    const response = await fetch(`${API_BASE}/registrations/${id}`, {
      method: 'DELETE'
    });
    return handleResponse(response);
  },

  getStudentRegistrations: async (studentId) => {
    const response = await fetch(`${API_BASE}/registrations/student/${studentId}`);
    return handleResponse(response);
  },

  // Subscriptions
  createSubscription: async (subscription) => {
    const response = await fetch(`${API_BASE}/subscriptions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(subscription)
    });
    return handleResponse(response);
  },

  getSubscription: async (id) => {
    const response = await fetch(`${API_BASE}/subscriptions/${id}`);
    return handleResponse(response);
  },

  useSession: async (id) => {
    const response = await fetch(`${API_BASE}/subscriptions/${id}/use`, {
      method: 'PATCH'
    });
    return handleResponse(response);
  },

  getStudentSubscriptions: async (studentId) => {
    const response = await fetch(`${API_BASE}/subscriptions/student/${studentId}`);
    return handleResponse(response);
  }
};