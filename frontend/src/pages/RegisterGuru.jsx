import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function RegisterGuru(){
  const [username,setUsername] = useState("");
  const nav = useNavigate();

  const submit = (e) => {
    e.preventDefault();
    alert(`Guru "${username}" berhasil didaftarkan (simulasi). Gunakan untuk login.`);
    nav("/login");
  };

  return (
    <div className="login-wrap">
      <div className="login-box card">
        <h1>Register Guru</h1>
        <form onSubmit={submit}>
          <div className="form-group">
            <label className="small">Username Guru</label>
            <input type="text" value={username} onChange={e=>setUsername(e.target.value)} required/>
          </div>
          <div className="form-group">
            <button className="primary" type="submit">Register Guru</button>
          </div>
          <div style={{marginTop:8}} className="small">(Simulasi — data tidak dikirim ke server)</div>
        </form>
      </div>
    </div>
  );
}
