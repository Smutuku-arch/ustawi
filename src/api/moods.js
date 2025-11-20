const API_BASE = '/api/moods';

function authHeaders() {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } : { 'Content-Type': 'application/json' };
}

export async function createMood({ mood, score, note }) {
  const res = await fetch(API_BASE, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ mood, score, note })
  });
  if (!res.ok) throw new Error((await res.json()).error || 'Failed to create mood');
  return res.json();
}

export async function getMoods() {
  const res = await fetch(API_BASE, { headers: authHeaders() });
  if (!res.ok) throw new Error('Failed to fetch moods');
  return res.json();
}

export async function getMoodStats() {
  const res = await fetch(`${API_BASE}/stats/summary`, { headers: authHeaders() });
  if (!res.ok) throw new Error('Failed to fetch mood stats');
  return res.json();
}
