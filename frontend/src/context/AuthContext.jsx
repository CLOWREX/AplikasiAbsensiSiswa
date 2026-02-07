import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

axios.defaults.withCredentials = true;

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
      try {
          const res = await axios.get('http://localhost:8001/auth/me', { withCredentials: true });
          setUser(res.data);
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
  };

  const logout = async () => {
    try {
      await axios.post("http://localhost:8001/auth/logout");
      setUser(null);
    } catch (err) {
      console.error("Logout failed", err);
      setUser(null);
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