import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login(){
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("siswa");
  const { login } = useAuth();
  const nav = useNavigate();

  const submit = (e) => {
    e.preventDefault();
    if(role === "guru"){
      login("guru", username || "guru");
      nav("/dashboard-guru");
    } else {
      login("siswa", username || "siswaname");
      nav("/home");
    }
  };

  return (
    <div className="login-wrap">
      <div className="login-box card">
        <h1>Absensi QR</h1>
        <form onSubmit={submit}>
          <div className="form-group">
            <label className="small">Username</label>
            <input type="text" value={username} onChange={e=>setUsername(e.target.value)} placeholder="mis: ahmad"/>
          </div>
          <div className="form-group">
            <label className="small">Role</label>
            <select value={role} onChange={e=>setRole(e.target.value)}>
              <option value="siswa">Siswa</option>
              <option value="guru">Guru</option>
            </select>
          </div>
          <div className="form-group">
            <button className="primary" type="submit">Masuk</button>
          </div>
        </form>
        <div style={{marginTop:8,textAlign:"center"}} className="small">
          Jika kamu guru dan belum terdaftar → klik Register Guru pada navbar.
        </div>
      </div>
    </div>
  );
}
