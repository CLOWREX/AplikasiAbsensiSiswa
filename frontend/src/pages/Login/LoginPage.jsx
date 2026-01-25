import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import "./login.css";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = (e) => {
    e.preventDefault();

    if (!username || !password) {
      setError("Please fill in all fields");
      return;
    }

    if (username === "siswa" && password === "123") {
      login({ role: "siswa", username }); 
      navigate("/home");
    } 
    else if (username === "guru" && password === "123") {
      login({ role: "guru", username });
      navigate("/home_teacher");
    } 
    else {
      setError("Username or password incorrect!");
    }
  };

  const handleRegister = () => {
    navigate("/register");
  };

  return (
    <div className="login-page-wrapper">
      <div className="login-container">
        
        <div className="login-left">
          <h1 className="brand-title" style={{ fontSize: '60px', color: 'white', lineHeight: '0.8', marginBottom: '15px',fontFamily: 'Agbalumo' }}>
            QRLog
          </h1>

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
            Quickly log presence with our seamless QR-based system designed for
            modern classrooms.
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
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
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
            <span onClick={handleRegister}>
              Click here to get started!
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;