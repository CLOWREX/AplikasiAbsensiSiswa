import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff, FiArrowLeft } from "react-icons/fi"; 
import { useAuth } from "../../context/AuthContext";
import "./register.css";

const Register = () => {
  const [fullname, setFullname] = useState("");
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleRegister = (e) => {
    e.preventDefault();

    if (!fullname || !username || !password || !phone) {
      setError("Please fill in all fields"); 
      return;
    }

    console.log("Mendaftarkan:", { fullname, username, phone, password });
    
    alert("Registration Successful!");
    navigate("/login"); 
  };

  return (
    <div className="register-page-wrapper">
      <div className="register-container">
        
        <div className="register-left">
          <h1 className="brand-title">QRLog</h1>
          <div className="qr-box">
            <img
              src="/src/assets/qr-scan.png" 
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
            Already have an account? <span onClick={() => navigate("/login")}>Login here!</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;