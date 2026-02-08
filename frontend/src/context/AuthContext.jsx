import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

axios.defaults.withCredentials = true;

axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user_data");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
      try {
          const res = await axios.get('http://192.168.100.102:8004/auth/me');
          setUser(res.data);
          localStorage.setItem("user_data", JSON.stringify(res.data));
      } catch (err) {
          console.warn("Auth check failed");
      } finally {
          setLoading(false);
      }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("user_data", JSON.stringify(userData));
    localStorage.setItem("access_token", userData.access_token); 
  };

  const logout = async () => {
    try {
      await axios.post("http://192.168.100.102:8004/auth/logout");
    } finally {
      setUser(null);
      localStorage.removeItem("user_data"); 
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, checkAuth }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}