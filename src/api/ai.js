import axios from 'axios';

const API_BASE = `${import.meta.env.VITE_API_BASE || 'http://localhost:4000'}/api/ai`;

function authHeaders() {
  const token = localStorage.getItem('token');
  return { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };
}

export async function sendChatMessage(message) {
  const { data } = await axios.post(`${API_BASE}/chat`, { message }, { headers: authHeaders() });
  return data;
}
