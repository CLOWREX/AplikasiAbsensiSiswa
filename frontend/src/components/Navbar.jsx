import React from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Navbar(){
  const { user, logout } = useAuth();
  const nav = useNavigate();
  return (
    <div className="navbar"> 
      <div className="brand">Absensi QR</div>
      <div className="actions">
        {user ? (
          <>
            <span style={{marginRight:12}}>{user.username} • {user.role}</span>
            <button className="logout-btn" onClick={() => { logout(); nav("/login"); }}>Logout</button>
          </>
        ) : (
          <>
            <button className="login-btn-nav" onClick={() => nav("/login")}>Login</button>
            <button className="register-btn-nav" onClick={() => nav("/register")}>Register Guru</button>
          </>
        )}
      </div>
    </div>
  );
}