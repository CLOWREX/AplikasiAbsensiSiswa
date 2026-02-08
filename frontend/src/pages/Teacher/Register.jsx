import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi"; 
import axios from "axios"; 
import "./register.css";

const Register = () => {
  const [fullname, setFullname] = useState("");
  const [username, setUsername] = useState(""); 
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!fullname || !username || !password || !phone) {
      setError("Please fill in all fields"); 
      return;
    }

    try {
      const response = await api.post("/auth/register", {
        fullName: fullname,
        username: username, 
        password: password,
        phone: phone,
        role: "teacher" 
      });

      if (response.status === 201 || response.status === 200) {
        alert("Registration Successful! Please login.");
        navigate("/login"); 
      }
    } catch (err) {
      setError(err.response?.data?.detail || "Registration failed. Try again.");
    }
  };

  return (
    <div className="register-page-wrapper">
      <div className="register-container">
        <div className="register-left">
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

        <div className="register-right">
          <div className="form-header">
            <h2 className="welcome">Create your account</h2>
            <p className="subtitle">Join the teacher dashboard</p>
          </div>

          {error && (
            <div className="error-message" style={{ color: "#ff4d4d", marginBottom: "15px", fontWeight: "600" }}>
              {error}
            </div>
          )}

          <form onSubmit={handleRegister}>
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                placeholder="Enter your full name"
                value={fullname}
                onChange={(e) => { setFullname(e.target.value); setError(""); }}
              />
            </div>

            <div className="form-group">
              <label>NIP</label>
              <input
                type="text"
                placeholder="Enter your NIP"
                value={username}
                onChange={(e) => { setUsername(e.target.value); setError(""); }}
              />
            </div>

            <div className="form-group">
              <label>Phone Number</label>
              <input
                type="text"
                placeholder="Enter your phone number"
                value={phone}
                onChange={(e) => { setPhone(e.target.value); setError(""); }}
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <div className="password-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Create your password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(""); }}
                />
                <span className="eye-icon" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </span>
              </div>
            </div>

            <button type="submit" className="register-btn">Register</button>
          </form>

          <p className="login-link">
            Already have an account? <span onClick={() => navigate("/login")} style={{cursor: 'pointer', color: '#1a73e8'}}>Login here!</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;