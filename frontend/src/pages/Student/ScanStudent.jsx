import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Scanner } from "@yudiel/react-qr-scanner";

const QRScannerModal = ({ onClose }) => {
  const navigate = useNavigate();
  const [scanned, setScanned] = useState(false);
  const [facingMode, setFacingMode] = useState("user");

  useEffect(() => {
    if (/Mobi|Android/i.test(navigator.userAgent)) {
      setFacingMode("environment");
    }
  }, []);

  const playBeep = () => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(800, audioCtx.currentTime);
      gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.2);
    } catch (e) {
      console.log("Audio play failed", e);
    }
  };

  const handleClose = () => {
    if (onClose) onClose(); // Jalankan fungsi tutup modal dari props
    navigate("/home");      // Paksa navigasi ke /home
  };

  const handleScan = (detectedCodes) => {
    const code = detectedCodes?.[0]?.rawValue;

    if (!scanned && code) {
      setScanned(true);
      playBeep();

      // LOGIKA SIMPAN DATA KE MEMORI BROWSER
      const now = new Date();
      const newAttendance = {
        id: Date.now(),
        status: 'Present',
        date: now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }), 
        time: now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: true }),
        type: 'success'
      };

      const existingHistory = JSON.parse(localStorage.getItem("attendanceHistory") || "[]");
      localStorage.setItem("attendanceHistory", JSON.stringify([newAttendance, ...existingHistory]));

      // Tutup modal dan pindah halaman setelah 1.5 detik
      setTimeout(() => {
        if (onClose) onClose();
        navigate("/history");
      }, 1500);
    }
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center z-[9999]">
      {/* Overlay: Klik di luar modal juga balik ke home */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={handleClose}></div>

      <div className="relative bg-[#E0F4F7] rounded-[2.5rem] p-8 w-[90%] max-w-md text-center shadow-2xl z-10 border-4 border-white">
        {/* TOMBOL CLOSE (FIXED) */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full bg-[#64C2D1] text-white text-xl font-bold shadow-md hover:bg-[#4ea8b8] active:scale-90 transition-transform"
        >
          ×
        </button>

        <h2 className="text-2xl font-black text-[#5dbcd2] mb-1">Scan QR Code</h2>
        <p className="text-gray-600 text-sm mb-6">Please point the camera at the QR Code</p>

        <div className="relative w-full h-72 rounded-3xl overflow-hidden border-4 border-white bg-black shadow-inner">
          {!scanned ? (
            <Scanner
              onScan={handleScan}
              onError={(err) => console.error(err)}
              constraints={{ facingMode }}
              allowMultiple={false}
              scanDelay={300}
            />
          ) : (
            <div className="absolute inset-0 flex flex-col justify-center items-center bg-white/95">
                <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mb-4 animate-bounce">
                    <span className="text-white text-4xl font-bold">✓</span>
                </div>
                <p className="text-green-600 font-black text-2xl">SUCCESS!</p>
                <p className="text-gray-400 text-xs mt-2">Recording your attendance...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QRScannerModal;