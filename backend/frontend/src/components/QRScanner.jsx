import React, { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { loadAbsensi, saveAbsensi, STUDENTS } from "../data/dummyData";

export default function QRScanner({ siswaUsername }) {
  const elId = "html5qr-reader";
  const ref = useRef(null);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    let scanner;
    const start = async () => {
      scanner = new Html5Qrcode(elId);
      try {
        await scanner.start(
          { facingMode: "environment" },
          { fps: 10, qrbox: 250 },
          (decodedText) => {
            setMsg("QR detected");
            try {
              const data = JSON.parse(decodedText);
              const list = loadAbsensi();
              const s = STUDENTS.find(s => s.nama.toLowerCase() === (siswaUsername || "").toLowerCase()) || STUDENTS[0];
              const status = "Hadir";
              const entry = { id: Date.now(), siswa_id: s.id, nama: s.nama, kelas: data.kelas || s.kelas, waktu: new Date().toISOString(), status, token: data.token };
              list.unshift(entry);
              saveAbsensi(list);
              alert("Absensi berhasil: " + s.nama + " — " + status);
            } catch(e){
              alert("QR tidak valid");
            }
            scanner.stop().catch(()=>{});
          },
          (error) => {
          }
        );
      } catch (e) {
        console.error("Camera error", e);
        setMsg("Gagal akses kamera");
      }
    };

    start();

    return () => {
      scanner && scanner.stop().catch(()=>{});
    };
  }, [siswaUsername]);

  return (
    <div className="card scan-wrap">
      <h3 style={{margin:0}}>Scan QR untuk Absensi</h3>
      <div id={elId} className="scan-frame" ref={ref}>
        {msg ? <div style={{padding:12}}>{msg}</div> : <div style={{color:"#bbb"}}>Kamera menunggu...</div>}
      </div>
      <div className="small">Pastikan izinkan akses kamera, arahkan QR pada frame.</div>
    </div>
  );
}
