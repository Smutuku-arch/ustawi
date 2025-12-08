import axios from 'axios';

const API_BASE = `${import.meta.env.VITE_API_BASE || 'http://localhost:4000'}/api/videos`;

export async function getVideos() {
  const { data } = await axios.get(API_BASE);
  return data;
}

export async function getVideo(id) {
  const { data } = await axios.get(`${API_BASE}/${id}`);
  return data;
}
