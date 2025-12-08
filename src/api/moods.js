import axios from 'axios';

const API_BASE = `${import.meta.env.VITE_API_BASE || 'http://localhost:4000'}/api/moods`;

function authHeaders() {
  const token = localStorage.getItem('token');
  return { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };
}

export async function createMood({ mood, score, note }) {
  const { data } = await axios.post(API_BASE, { mood, score, note }, { headers: authHeaders() });
  return data;
}

export async function getMoods() {
  const { data } = await axios.get(API_BASE, { headers: authHeaders() });
  return data;
}

export async function getMoodStats() {
  const { data } = await axios.get(`${API_BASE}/stats/summary`, { headers: authHeaders() });
  return data;
}
