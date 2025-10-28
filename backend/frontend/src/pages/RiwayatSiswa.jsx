import React from "react";
import Navbar from "../components/Navbar";
import AttendanceTable from "../components/AttendanceTable";

export default function RiwayatSiswa(){
  return (
    <>
      <Navbar />
      <div className="container">
        <h1>Riwayat Absensi</h1>
        <AttendanceTable />
      </div>
    </>
  );
}
