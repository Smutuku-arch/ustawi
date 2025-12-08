import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:4000";

const AppContext = createContext();

export function useApp() {
  return useContext(AppContext);
}

export function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check auth on mount
  useEffect(() => {
    async function checkAuth() {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const { data } = await axios.get(`${API_BASE}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(data.user);
      } catch {
        localStorage.removeItem("token");
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    checkAuth();
  }, []);

  // Auth functions
  async function login({ email, password }) {
    const { data } = await axios.post(`${API_BASE}/api/auth/login`, { email, password });
    localStorage.setItem("token", data.token);
    setUser(data.user);
    return data;
  }

  async function register({ name, email, password }) {
    const { data } = await axios.post(`${API_BASE}/api/auth/register`, { name, email, password });
    localStorage.setItem("token", data.token);
    setUser(data.user);
    return data;
  }

  function logout() {
    localStorage.removeItem("token");
    setUser(null);
  }

  // Helper to get auth headers
  function authHeaders() {
    const token = localStorage.getItem("token");
    return { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };
  }

  // Generic CRUD operations
  async function addDocument(collection, data) {
    const { data: doc } = await axios.post(`${API_BASE}/api/${collection}`, data, { headers: authHeaders() });
    return doc;
  }

  async function getDocument(collection, id) {
    const { data: doc } = await axios.get(`${API_BASE}/api/${collection}/${id}`, { headers: authHeaders() });
    return doc;
  }

  async function getDocuments(collection, filters = {}) {
    const { data: docs } = await axios.get(`${API_BASE}/api/${collection}`, { headers: authHeaders(), params: filters });
    return docs;
  }

  async function updateDocument(collection, id, data) {
    const { data: doc } = await axios.patch(`${API_BASE}/api/${collection}/${id}`, data, { headers: authHeaders() });
    return doc;
  }

  async function deleteDocument(collection, id) {
    await axios.delete(`${API_BASE}/api/${collection}/${id}`, { headers: authHeaders() });
  }

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    addDocument,
    getDocument,
    getDocuments,
    updateDocument,
    deleteDocument
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export default AppProvider;