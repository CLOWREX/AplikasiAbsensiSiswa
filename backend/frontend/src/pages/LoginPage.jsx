import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./login.css";
import awal from "../assets/awal.png"; 

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const nav = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username.toLowerCase().includes("guru")) {
      login("guru", username);
      nav("/dashboard-guru");
    } else {
      login("siswa", username);
      nav("/home");
    }
  };

  return (
    <div className="login-viewport">
      <div className="login-container">
        
        {/* PANEL KIRI: Branding & Modern Illustration */}
        <div className="left-brand-panel">
          <div className="blob blob-1"></div>
          <div className="blob blob-2"></div>
          <div className="content-wrapper">
            <div className="illustration-container">
              <img src={awal} alt="QRLog Illustration" className="brand-img" />
              <div className="floating-card stat-card">
                <span className="card-icon">✅</span>
                <div className="card-info">
                  <span>Sistem Aktif</span>
                  <p>Presensi Real-time</p>
                </div>
              </div>
            </div>
            <div className="brand-text">
              <h2 className="highlight">QRLog</h2>
              <p>Manajemen kehadiran digital dengan enkripsi QR-Code yang aman dan instan.</p>
            </div>
          </div>
        </div>

        {/* PANEL KANAN: Clean & Elegant Login Form */}
        <div className="right-form-panel">
          <div className="form-wrapper">
            <header className="form-header">
              <span className="welcome-badge">Presensi Digital v2.0</span>
              <h1>Selamat Datang</h1>
              <p>Kelola dan pantau kehadiranmu dengan mudah di platform <strong>QRLog</strong></p>
            </header>

            <form onSubmit={handleSubmit} className="auth-form">
              <div className="input-group">
                <label>USERNAME</label>
                <div className="input-box">
                  <input
                    type="text"
                    placeholder="Masukkan username Anda"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="input-group">
                <label>PASSWORD</label>
                <div className="input-box">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Masukkan kata sandi"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button 
                    type="button" 
                    className="toggle-pass" 
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? "Sembunyikan" : "Lihat"}
                  </button>
                </div>
              </div>

              <button type="submit" className="btn-submit">Masuk ke Dashboard</button>
              
              <footer className="form-footer">
                <p>&copy; 2026 QRLog Team. All rights reserved.</p>
              </footer>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
}