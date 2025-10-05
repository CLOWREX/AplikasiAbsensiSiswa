import React from "react";
import Navbar from "../components/Navbar";
import QRScanner from "../components/QRScanner";
import { useAuth } from "../context/AuthContext";

export default function ScanSiswa(){
  const { user } = useAuth();
  return (
    <>
      <Navbar />
      <div className="container" style={{display:"flex",justifyContent:"center"}}>
        <QRScanner siswaUsername={user?.username} />
      </div>
    </>
  );
}
