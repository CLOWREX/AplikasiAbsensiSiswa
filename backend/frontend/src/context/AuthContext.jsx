import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("app_user")) || null;
    } catch { return null; }
  });

  useEffect(() => {
    localStorage.setItem("app_user", JSON.stringify(user));
  }, [user]);

  const login = (role, username) => {
    const userObj = { role, username };
    setUser(userObj);
    return userObj;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("app_user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(){ return useContext(AuthContext); }
