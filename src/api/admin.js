import axios from 'axios';

const API_BASE = `${import.meta.env.VITE_API_BASE || 'http://localhost:4000'}/api/admin`;

function authHeaders() {
  const token = localStorage.getItem('token');
  return { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };
}

export async function listUsers() {
  const { data } = await axios.get(`${API_BASE}/users`, { headers: authHeaders() });
  return data;
}

export async function setUserRole(userId, role) {
  const { data } = await axios.patch(`${API_BASE}/users/${userId}/role`, { role }, { headers: authHeaders() });
  return data;
}

export async function uploadBook(formData) {
  const token = localStorage.getItem('token');
  const { data } = await axios.post(`${API_BASE}/books`, formData, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return data;
}

export async function listBooks() {
  const { data } = await axios.get(`${API_BASE}/books`, { headers: authHeaders() });
  return data;
}

export async function deleteBook(bookId) {
  const { data } = await axios.delete(`${API_BASE}/books/${bookId}`, { headers: authHeaders() });
  return data;
}

// Article management functions
export async function createArticle(articleData) {
  const { data } = await axios.post(`${API_BASE}/articles`, articleData, { headers: authHeaders() });
  return data;
}

export async function listArticles() {
  const { data } = await axios.get(`${API_BASE}/articles`, { headers: authHeaders() });
  return data;
}

export async function deleteArticle(articleId) {
  const { data } = await axios.delete(`${API_BASE}/articles/${articleId}`, { headers: authHeaders() });
  return data;
}

export async function updateArticle(articleId, articleData) {
  const { data } = await axios.put(`${API_BASE}/articles/${articleId}`, articleData, { headers: authHeaders() });
  return data;
}

// Video management functions
export async function uploadVideo(formData) {
  const token = localStorage.getItem('token');
  const { data } = await axios.post(`${API_BASE}/videos`, formData, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined
  });
  return data;
}

export async function listVideos() {
  const { data } = await axios.get(`${API_BASE}/videos`, { headers: authHeaders() });
  return data;
}

export async function deleteVideo(videoId) {
  const { data } = await axios.delete(`${API_BASE}/videos/${videoId}`, { headers: authHeaders() });
  return data;
}
