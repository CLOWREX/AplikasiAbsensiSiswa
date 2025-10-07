import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/LoginPage";
import RegisterGuru from "./pages/RegisterGuru";
import Home from "./pages/HomePage";
import DashboardGuru from "./pages/DashboardGuru";
import ScanSiswa from "./pages/ScanSiswa";
import RiwayatSiswa from "./pages/RiwayatSiswa";
import NotFound from "./pages/NotFound";
import { useAuth } from "./context/AuthContext";

export default function App() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<RegisterGuru />} />
      <Route
        path="/home"
        element={user ? <Home /> : <Navigate to="/login" replace />}
      />
      <Route
        path="/dashboard-guru"
        element={
          user?.role === "guru" ? <DashboardGuru /> : <Navigate to="/login" />
        }
      />
      <Route
        path="/scan"
        element={user?.role === "siswa" ? <ScanSiswa /> : <Navigate to="/login" />}
      />
      <Route
        path="/riwayat"
        element={user ? <RiwayatSiswa /> : <Navigate to="/login" replace />}
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
