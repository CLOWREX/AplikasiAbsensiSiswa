import React from "react";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import AttendanceTable from "../components/AttendanceTable";
import QRGenerator from "../components/QRGenerator";

export default function Home(){
  const { user } = useAuth();
  return (
    <>
      <Navbar />
      <div className="container">
        {user.role === "guru" ? (
          <div className="grid-2">
            <div>
              <QRGenerator />
            </div>
            <div>
              <div className="card">
                <h3>Quick Actions</h3>
                <div style={{marginTop:12}}>
                  <button className="primary" onClick={()=>window.location.href="/dashboard-guru"}>Ke Dashboard Guru</button>
                </div>
              </div>
            </div>
            <div style={{gridColumn:"1 / -1", marginTop:16}}>
              <AttendanceTable />
            </div>
          </div>
        ) : (
          <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:20}}>
            <div className="card" style={{textAlign:"center"}}>
              <h2>Selamat datang, {user.username}</h2>
              <p className="small">Scan QR di sekolah untuk absen.</p>
              <div style={{marginTop:12}}>
                <button className="primary" onClick={()=>window.location.href="/scan"}>Scan Sekarang</button>
                <button className="ghost" style={{marginLeft:8}} onClick={()=>window.location.href="/riwayat"}>Lihat Riwayat</button>
              </div>
            </div>
            <AttendanceTable />
          </div>
        )}
      </div>
    </>
  );
}
