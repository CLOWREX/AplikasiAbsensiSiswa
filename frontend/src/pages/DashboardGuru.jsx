import React from "react";
import Navbar from "../components/Navbar";
import AttendanceTable from "../components/AttendanceTable";

export default function DashboardGuru(){
  return (
    <>
      <Navbar />
      <div className="container">
        <h1 style={{marginTop:0}}>Dashboard Guru</h1>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr", gap:16}}>
          <div className="card">
            <h3>Generate QR Hari ini</h3>
            <p className="small">Gunakan tombol Generate untuk membuat QR token baru.</p>
            <div style={{marginTop:12}}>
              <button className="primary" onClick={()=>alert("Gunakan halaman Home → Generate QR untuk versi simulasi")}>Generate (lihat Home)</button>
            </div>
          </div>
          <div className="card">
            <h3>Manajemen</h3>
            <div style={{marginTop:12}}>
              <button className="ghost" onClick={()=>alert("CRUD siswa (simulasi)")}>Kelola Siswa</button>
            </div>
          </div>
        </div>

        <div style={{marginTop:18}}>
          <AttendanceTable />
        </div>
      </div>
    </>
  );
}
