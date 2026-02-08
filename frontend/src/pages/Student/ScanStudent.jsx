import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Scanner } from "@yudiel/react-qr-scanner";
import { FiClock, FiCheckCircle, FiX } from "react-icons/fi";
import axios from "axios";

const QRScannerModal = ({ onClose }) => {
  const navigate = useNavigate();
  const [scanned, setScanned] = useState(false);
  const [isAlreadyPresent, setIsAlreadyPresent] = useState(false);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const checkAttendanceStatus = useCallback(async () => {
    try {
      const response = await api.get("/attendance/today-status");
      setIsAlreadyPresent(response.data.already_present);
    } catch (err) {
      console.error("Gagal cek status", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAttendanceStatus();
  }, [checkAttendanceStatus]);

  const handleScan = async (detectedCodes) => {
    const qrData = detectedCodes?.[0]?.rawValue; 
    if (scanned || !qrData || isAlreadyPresent) return;

    try {
        const response = await api.post("/attendance/scan",
          { qr_content: qrData },
        { withCredentials: true } 
      );

      if (response.status === 200) {
        setScanned(true); 
        setTimeout(() => {
          onClose?.();
          navigate("/history");
        }, 1500);
      }
    } catch (err) {
      const msg = err.response?.data?.detail || "Invalid QR Code!";
      setErrorMsg(msg);
      setTimeout(() => setErrorMsg(""), 3000);
    }
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center z-[9999] p-4 bg-black/60 backdrop-blur-sm">
      <div className="relative bg-[#E0F4F7] rounded-[2.5rem] p-8 w-full max-w-md text-center shadow-2xl border-4 border-white font-Afacad">
        <button onClick={() => { onClose?.(); navigate("/home"); }} className="absolute top-4 right-4 text-[#64C2D1]">
          <FiX size={30} />
        </button>

        {loading ? (
          <div className="py-10 animate-pulse text-[#5dbcd2] font-black">Verifying Status...</div>
        ) : isAlreadyPresent ? (
          <div className="py-6 flex flex-col items-center">
            <FiCheckCircle size={80} className="text-[#5dbcd2] mb-4" />
            <h2 className="text-2xl font-black text-[#5dbcd2]">You're Checked In!</h2>
            <p className="text-gray-500 mt-2">Your attendance has been recorded. Have a great day!</p>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-black text-[#5dbcd2] mb-1">Scan QR Code</h2>
            <p className="text-gray-500 text-sm mb-6">Please point the camera at the QR Code</p>

            <div className="relative w-full h-72 rounded-3xl overflow-hidden border-4 border-white bg-black shadow-inner">
              {!scanned ? (
                <Scanner onScan={handleScan} allowMultiple={false} />
              ) : (
                <div className="absolute inset-0 flex flex-col justify-center items-center bg-white">
                  <FiCheckCircle size={60} className="text-green-500 animate-bounce" />
                  <p className="text-green-600 font-black text-2xl">SUCCESS!</p>
                </div>
              )}
            </div>
            {errorMsg && (
              <div className="mt-4 p-2 bg-red-100 text-red-600 rounded-xl text-xs font-bold animate-shake">
                {errorMsg}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default QRScannerModal;