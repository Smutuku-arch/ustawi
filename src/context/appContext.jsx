import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:4000";

const AppContext = createContext();

export function useApp() {
  return useContext(AppContext);
}

export function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      fetchCurrentUser();
    }
  }, [token]);

  async function fetchCurrentUser() {
    try {
      const { data } = await axios.get(`${API_BASE}/api/auth/me`);
      setUser(data);
    } catch (err) {
      console.error("Failed to fetch user:", err);
      logout();
    }
  }

  function login(userData, authToken) {
    console.log("Logging in user:", userData);
    setToken(authToken);
    setUser(userData);
    localStorage.setItem("token", authToken);
    axios.defaults.headers.common["Authorization"] = `Bearer ${authToken}`;
  }

  function logout() {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    delete axios.defaults.headers.common["Authorization"];
  }

  const value = {
    user,
    login,
    logout
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export default AppProvider;