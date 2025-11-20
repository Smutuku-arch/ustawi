const API_BASE = '/api/admin';

function authHeaders(isJson = true) {
  const token = localStorage.getItem('token');
  const headers = {};
  if (token) headers.Authorization = `Bearer ${token}`;
  if (isJson) headers['Content-Type'] = 'application/json';
  return headers;
}

export async function listUsers() {
  const res = await fetch(`${API_BASE}/users`, { headers: authHeaders() });
  if (!res.ok) throw new Error('Failed to fetch users');
  return res.json();
}

export async function setUserRole(userId, role) {
  const res = await fetch(`${API_BASE}/users/${userId}/role`, {
    method: 'PATCH',
    headers: authHeaders(),
    body: JSON.stringify({ role })
  });
  if (!res.ok) throw new Error((await res.json()).error || 'Failed to set role');
  return res.json();
}

export async function uploadBook(formData) {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_BASE}/books`, {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    body: formData
  });
  if (!res.ok) throw new Error((await res.json()).error || 'Failed to upload book');
  return res.json();
}

export async function listBooks() {
  const res = await fetch(`${API_BASE}/books`, { headers: authHeaders() });
  if (!res.ok) throw new Error('Failed to fetch books');
  return res.json();
}

export async function deleteBook(bookId) {
  const res = await fetch(`${API_BASE}/books/${bookId}`, {
    method: 'DELETE',
    headers: authHeaders()
  });
  if (!res.ok) throw new Error('Failed to delete book');
  return res.json();
}
