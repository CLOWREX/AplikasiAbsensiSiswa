import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login/LoginPage";
import RegisterGuru from "./pages/Teacher/Register";
import HomeStudent from "./pages/Student/App";
import HistoryStudent from "./pages/Student/HistoryStudent";
import ScheduleStudent from "./pages/Student/ScheduleStudent";
import ProfileStudent from "./pages/Student/ProfileStudent";
import NotifStudent from "./pages/Student/NotificationStudent";
import HomeTeacher from "./pages/Teacher/HomeTeacher";
import PresenceTeacher from "./pages/Teacher/PresenceTeacher";
import RegisterTeacher from "./pages/Teacher/RegisterTeacher";
import DataTeacher from "./pages/Teacher/DataTeacher";
import ProfileTeacher from "./pages/Teacher/ProfileTeacher";
import NotificationTeacher from "./pages/Teacher/NotificationTeacher";
import ScanSiswa from "./pages/ScanSiswa";
import RiwayatSiswa from "./pages/RiwayatSiswa";
import PresencePage from "./pages/Student/PresenceStudent";
import NotFound from "./pages/NotFound";
import SidebarStudent from "./pages/Student/SidebarStudent";
import SidebarTeacher from "./pages/Teacher/SidebarTeacher";
import { useAuth } from "./context/AuthContext";
import "./index.css";

export default function App() {
  const { user, loading } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  if (loading) return <div>Loading...</div>;

  // Layout untuk siswa
  const StudentLayout = ({ children }) => (
    <div className="flex min-h-screen bg-[#D6EBEE] font-['Afacad']">
      <SidebarStudent isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <main className="flex-1 h-screen overflow-y-auto scrollbar-hide">
        {children}
      </main>
    </div>
  );

  // Layout untuk guru
  const TeacherLayout = ({ children }) => (
    <div className="flex min-h-screen bg-[#D6EBEE] font-['Afacad']">
      <SidebarTeacher isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <main className="flex-1 h-screen overflow-y-auto scrollbar-hide">
        {children}
      </main>
    </div>
  );

  const RequireAuth = ({ roles, children }) => {
    if (!user) return <Navigate to="/login" replace />;
    if (roles && !roles.includes(user.role)) return <Navigate to="/login" replace />;
    return children;
  };

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<RegisterGuru />} />

      {/* Routes Siswa */}
      <Route
        path="/home"
        element={
          <RequireAuth roles={["student", "siswa"]}>
            <StudentLayout>
              <HomeStudent onMenuOpen={() => setIsSidebarOpen(true)} />
            </StudentLayout>
          </RequireAuth>
        }
      />
      <Route
        path="/presence"
        element={
          <RequireAuth roles={["student", "siswa"]}>
            <StudentLayout>
              <PresencePage onMenuOpen={() => setIsSidebarOpen(true)} />
            </StudentLayout>
          </RequireAuth>
        }
      />
      <Route
        path="/history"
        element={
          <RequireAuth roles={["student", "siswa"]}>
            <StudentLayout>
              <HistoryStudent onMenuOpen={() => setIsSidebarOpen(true)} />
            </StudentLayout>
          </RequireAuth>
        }
      />
      <Route
        path="/schedule"
        element={
          <RequireAuth roles={["student", "siswa"]}>
            <StudentLayout>
              <ScheduleStudent onMenuOpen={() => setIsSidebarOpen(true)} />
            </StudentLayout>
          </RequireAuth>
        }
      />
      <Route
        path="/profile"
        element={
          <RequireAuth roles={["student", "siswa"]}>
            <StudentLayout>
              <ProfileStudent onMenuOpen={() => setIsSidebarOpen(true)} />
            </StudentLayout>
          </RequireAuth>
        }
      />
      <Route
        path="/notification"
        element={
          <RequireAuth roles={["student", "siswa"]}>
            <StudentLayout>
              <NotifStudent onMenuOpen={() => setIsSidebarOpen(true)} />
            </StudentLayout>
          </RequireAuth>
        }
      />
      <Route
        path="/scan"
        element={
          <RequireAuth roles={["student", "siswa"]}>
            <StudentLayout>
              <ScanSiswa onMenuOpen={() => setIsSidebarOpen(true)} />
            </StudentLayout>
          </RequireAuth>
        }
      />

      {/* Routes Guru */}
      <Route
        path="/home_teacher"
        element={
          <RequireAuth roles={["teacher", "guru"]}>
            <TeacherLayout>
              <HomeTeacher onMenuOpen={() => setIsSidebarOpen(true)} />
            </TeacherLayout>
          </RequireAuth>
        }
      />
      <Route
        path="/presence_teacher"
        element={
          <RequireAuth roles={["teacher", "guru"]}>
            <TeacherLayout>
              <PresenceTeacher onMenuOpen={() => setIsSidebarOpen(true)} />
            </TeacherLayout>
          </RequireAuth>
        }
      />
      <Route
        path="/register_teacher"
        element={
          <RequireAuth roles={["teacher", "guru"]}>
            <TeacherLayout>
              <RegisterTeacher onMenuOpen={() => setIsSidebarOpen(true)} />
            </TeacherLayout>
          </RequireAuth>
        }
      />
      <Route
        path="/data_teacher"
        element={
          <RequireAuth roles={["teacher", "guru"]}>
            <TeacherLayout>
              <DataTeacher onMenuOpen={() => setIsSidebarOpen(true)} />
            </TeacherLayout>
          </RequireAuth>
        }
      />
      <Route
        path="/profile_teacher"
        element={
          <RequireAuth roles={["teacher", "guru"]}>
            <TeacherLayout>
              <ProfileTeacher onMenuOpen={() => setIsSidebarOpen(true)} />
            </TeacherLayout>
          </RequireAuth>
        }
      />
      <Route
        path="/notification_teacher"
        element={
          <RequireAuth roles={["teacher", "guru"]}>
            <TeacherLayout>
              <NotificationTeacher onMenuOpen={() => setIsSidebarOpen(true)} />
            </TeacherLayout>
          </RequireAuth>
        }
      />
      <Route
        path="/riwayat"
        element={
          <RequireAuth roles={["teacher", "guru"]}>
            <TeacherLayout>
              <RiwayatSiswa onMenuOpen={() => setIsSidebarOpen(true)} />
            </TeacherLayout>
          </RequireAuth>
        }
      />

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
