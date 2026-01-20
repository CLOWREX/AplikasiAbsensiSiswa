import React from "react";
import { useNavigate } from "react-router-dom"; 
import { useAuth } from "../context/AuthContext"; // Pastikan path context benar
import "./home.css";

export default function DashboardGuru() {
  const { logout } = useAuth(); 
  const navigate = useNavigate();

  // Data Dummy untuk Riwayat
  const attendanceData = [
    { id: 1, name: "Ahmad Dhani", class: "Kelas XI - IPA 2", time: "07:45 WIB", status: "HADIR" },
    { id: 2, name: "Siti Nurhaliza", class: "Kelas XI - IPA 2", time: "08:05 WIB", status: "TERLAMBAT" },
    { id: 3, name: "Raffi Pratama", class: "Kelas XI - IPA 2", time: "07:50 WIB", status: "HADIR" },
    { id: 4, name: "Budi Kusuma", class: "Kelas XI - IPA 2", time: "--:--", status: "ABSEN" },
  ];

  const handleLogout = () => {
    if (window.confirm("Apakah Anda yakin ingin keluar?")) {
      logout();
      navigate("/login");
    }
  };

  return (
    <div className="dashboard-wrapper">
      {/* Header Profile */}
      <header className="header-guru">
        <div className="welcome-text">
          <p className="greeting">Selamat pagi,</p>
          <h1>Halo, Pak Aroh 👋</h1>
        </div>
        
        <div className="header-right">
          {/* Tombol Logout */}
          <button className="logout-btn-header" onClick={handleLogout} title="Logout">
            🚪
          </button>
          <div className="profile-circle">
            <img 
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" 
              alt="profile" 
            />
            <span className="online-indicator"></span>
          </div>
        </div>
      </header>

      <div className="content-container">
        {/* Banner Generate QR */}
        <div className="qr-banner" onClick={() => alert("Generate QR...")}>
          <div className="qr-icon-bg">
            <span className="icon">🔳</span>
          </div>
          <div className="banner-info">
            <h2>Generate QR Absensi</h2>
            <p>Buat token QR baru untuk sesi pelajaran hari ini.</p>
          </div>
          <div className="qr-pattern-overlay"></div>
        </div>

        {/* Menu Manajemen */}
        <div className="menu-list-card">
          <div className="menu-item">
            <div className="menu-icon">👥</div>
            <div className="menu-text">
              <h3>Manajemen Siswa</h3>
              <p>Kelola data, kelas, dan riwayat siswa.</p>
            </div>
            <div className="arrow-right">❯</div>
          </div>
        </div>

        {/* Riwayat Terbaru */}
        <section className="history-section">
          <div className="section-header">
            <h2>Riwayat Terbaru</h2>
            <button className="view-all">Lihat Semua</button>
          </div>

          <div className="attendance-list">
            {attendanceData.map((item) => (
              <div key={item.id} className="attendance-item">
                <div className="student-avatar">
                  {item.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="student-info">
                  <h4>{item.name}</h4>
                  <p>{item.class} • {item.time}</p>
                </div>
                <div className={`status-badge ${item.status.toLowerCase()}`}>
                  {item.status}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Bottom Navigation */}
      <nav className="bottom-nav">
        <div className="nav-item active">
          <span className="nav-icon">🏠</span>
          <p>Beranda</p>
        </div>
        <div className="nav-item">
          <span className="nav-icon">📅</span>
          <p>Kehadiran</p>
        </div>
        <button className="fab-button">+</button>
        <div className="nav-item">
          <span className="nav-icon">📊</span>
          <p>Data</p>
        </div>
        <div className="nav-item">
          <span className="nav-icon">👤</span>
          <p>Akun</p>
        </div>
      </nav>
    </div>
  );
}