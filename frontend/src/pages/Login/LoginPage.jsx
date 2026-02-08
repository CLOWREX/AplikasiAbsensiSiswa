import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import axios from "axios"; 
import "./login.css";
import api from "../../api";

const Login = () => {
  const [idNumber, setIdNumber] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  
  const navigate = useNavigate();
  const { login } = useAuth(); 

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!idNumber || !password) {
      setError("Please fill in all fields");
      return;
    }

    try {
      const payload = {
        username: idNumber,
        password: password,
      };

      const response = await api.post("/auth/login", payload);

      if (response.status === 200) {
          login(response.data);

        if (response.data.role === "teacher") {
          navigate("/home_teacher");
        } else {
          navigate("/home");
        }
      }
    } catch (err) {
      setError(err.response?.data?.detail || "Login failed. Check your NIS/NIP or password.");
    }
  };

  return (
    <div className="login-page-wrapper">
      <div className="login-container">
        <div className="login-left">
          <h1 className="brand-title" style={{ fontSize: '60px', color: 'white', lineHeight: '0.8', marginBottom: '15px', fontFamily: 'Agbalumo' }}>
            QRLog
          </h1>
          <div className="qr-box">
            <img
              src="/qr-scan.png" 
              alt="QR Icon"
              className="qr-image"
              onError={(e) => { e.target.src = "https://cdn-icons-png.flaticon.com/512/241/241528.png" }}
            />
          </div>
          <h2 className="left-title">Effortless Attendance</h2>
          <p className="left-desc">
            Quickly log presence with our seamless QR-based system designed for modern classrooms.
          </p>
        </div>

        <div className="login-right">
          <div className="form-header">
            <h2 className="welcome">Welcome back</h2>
            <p className="subtitle">Login to your account</p>
          </div>

          {error && (
            <div className="error-message" style={{ color: "#ff4d4d", marginBottom: "15px", fontWeight: "600" }}>
              {error}
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label>NIS or NIP</label>
              <input
                type="text"
                placeholder="Enter your NIS or NIP"
                value={idNumber}
                onChange={(e) => {
                  setIdNumber(e.target.value);
                  setError(""); 
                }}
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <div className="password-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError("");
                  }}
                />
                <span
                  className="eye-icon"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </span>
              </div>
            </div>

            <button type="submit" className="login-btn">
              Login
            </button>
          </form>

          <p className="teacher-link">
            Teacher?{" "}
            <span onClick={() => navigate("/register")} style={{ cursor: "pointer", color: "#1a73e8" }}>
              Click here to get started!
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;