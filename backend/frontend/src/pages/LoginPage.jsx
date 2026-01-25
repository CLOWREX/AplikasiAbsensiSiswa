import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import './login.css'; 

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState(""); 
  const { login } = useAuth();
  const nav = useNavigate();

  const submit = (e) => {
    e.preventDefault();
    
    let role;
    if (username.toLowerCase().includes("guru") || username.toLowerCase() === "admin") {
        role = "guru";
    } else {
        role = "siswa";
    }

    if (role === "guru") {
      login("guru", username); 
      nav("/home_teacher");
    } else {
      login("siswa", username); 
      nav("/home");
    }
  };

  return (
    <div className="login-page"> 
      
      <div className="login-sidebar"> 
        
        <img 
          src="/learnify.png" 
          alt="Learnify Logo" 
          className="login-logo"
        />
        
        <h1 className="logo-text">Learnify</h1> 
      </div>
      
      <div className="login-content">
        <div className="login-box card">
          <p className="welcome-text">Welcome to Learnify</p>
          <h2>Log into your Account</h2>
          <form onSubmit={submit}>
            
            <div className="form-group">
              <label htmlFor="username-input" className="small">Username</label>
              <input 
                id="username-input"
                type="text" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
                required 
                placeholder="Masukkan Username Anda" 
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="password-input" className="small">Password</label>
              <input 
                id="password-input"
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
                placeholder="Masukkan Password Anda" 
              />
            </div>
            
            <button className="primary login-btn" type="submit">Log In</button>
          </form>
        </div>

        <div className="version-info-footer">
            © 2025 Learnify
        </div>
      </div>
    </div>
  );
}