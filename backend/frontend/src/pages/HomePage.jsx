import React from "react";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar"; 
import AttendanceTable from "../components/AttendanceTable";
import './home.css'; 

export default function Home(){
  const { user } = useAuth();
  
  const nav = (path) => window.location.href = path;

  if (!user || user.role !== "siswa") {
    return (
        <>
            <Navbar />
            <div className="container" style={{textAlign: 'center', paddingTop: '50px'}}>
                <h2>{user ? "Dashboard Guru" : "Silakan Login"}</h2>
                {user && user.role === "guru" && <p>Konten dashboard guru akan ditampilkan di sini.</p>}
            </div>
        </>
    );
  }

  return (
    <>
      <Navbar /> 
      
      <div className="container home-siswa">
        
        <div className="card welcome-banner primary-bg">
          <div className="profile-info">
            <div className="profile-avatar"></div> 
            <h1>Selamat datang, {user.username}</h1>
          </div>
          <div className="action-area">
            <p className="status-text">Status Hari Ini: Belum Absen</p>
            <button className="scan-btn" onClick={() => nav("/scan")}>
              Scan QR Sekarang
            </button>
          </div>
        </div>
        
        <div className="grid-dashboard">
            
            <div className="card stats-card">
                <h3>Statistik Kehadiran (Bulan Ini)</h3>
                <div className="stat-value">95%</div>
                <p className="detail-text">Absen Berhasil: 19 dari 20 Sesi</p>
                
                <div className="stats-detail-grid">
                    <div className="stat-item">
                        <p className="stat-label">Hadir Tepat</p>
                        <p className="stat-number primary-text">15</p>
                    </div>
                    <div className="stat-item">
                        <p className="stat-label">Terlambat</p>
                        <p className="stat-number warning-text">4</p>
                    </div>
                    <div className="stat-item">
                        <p className="stat-label">Izin/Sakit</p>
                        <p className="stat-number success-text">1</p>
                    </div>
                    <div className="stat-item">
                        <p className="stat-label">Alfa</p>
                        <p className="stat-number danger-text">0</p>
                    </div>
                </div>
            </div>

            <div className="card quick-links-card">
                <h3>Akses Cepat</h3>
                
                <div className="quick-nav-list">
                    <button className="nav-item" onClick={() => nav("/izin")}>Izin Kehadiran</button>
                    <button className="nav-item" onClick={() => nav("/jadwal")}>List Jadwal</button>
                    <button className="nav-item" onClick={() => nav("/profile")}>Profile</button>
                </div>
            </div>
        </div>

        <div className="card history-section">
            <h2>Riwayat Absensi Terbaru</h2>
            <AttendanceTable /> 
        </div>

      </div>
    </>
  );
}