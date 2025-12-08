import axios from 'axios';

const API_BASE = `${import.meta.env.VITE_API_BASE || 'http://localhost:4000'}/api/appointments`;

function authHeaders() {
  const token = localStorage.getItem('token');
  return { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };
}

export async function getAppointments(filters = {}) {
  const { data } = await axios.get(API_BASE, { headers: authHeaders(), params: filters });
  return data;
}

export async function createAppointment(appointmentData) {
  const { data } = await axios.post(API_BASE, appointmentData, { headers: authHeaders() });
  return data;
}

export async function getAvailableSlots(resourceId, date) {
  const { data } = await axios.get(`${API_BASE}/available-slots/${resourceId}`, {
    params: { date }
  });
  return data;
}

export async function cancelAppointment(id) {
  const { data } = await axios.delete(`${API_BASE}/${id}`, { headers: authHeaders() });
  return data;
}
