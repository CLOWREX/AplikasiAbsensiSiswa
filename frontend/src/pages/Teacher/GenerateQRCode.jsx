import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios'; 
import { FiX, FiInfo } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const QRCodeGenerator = () => {
  const [qrImageUrl, setQrImageUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const fetchQRCode = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.post(
        "http://localhost:8001/qr/generate",
        {},
        { withCredentials: true }
      );

      if (response.data?.qr_image_url) {
        const ts = Date.now();
        setQrImageUrl(`http://localhost:8001${response.data.qr_image_url}?t=${ts}`);
      } else {
        setError("QR code not found.");
      }

    } catch (err) {
      console.error("QR Error:", err);

      if (err.response?.status === 401) {
        setError("Invalid session. Please log in again.");
      } else if (err.response?.status === 404) {
        setError("QR code has not been generated today.");
      } else {
        setError("Failed to retrieve QR code.");
      }

    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchQRCode();

    const interval = setInterval(fetchQRCode, 60000);
    return () => clearInterval(interval);
  }, [fetchQRCode]);

  return (
    <div className="fixed inset-0 flex justify-center items-center z-[9999] p-4 bg-black/60 backdrop-blur-sm font-['Afacad']">
      <div className="relative bg-[#5dbcd2] rounded-[3rem] p-8 w-full max-w-4xl shadow-2xl border-4 border-white flex flex-col md:flex-row items-center gap-10">
        
        <button 
          onClick={() => navigate("/home_teacher")} 
          className="absolute top-6 right-6 text-white hover:scale-125 transition-all">
          <FiX size={35} />
        </button>

        <div className="bg-white p-4 rounded-[2rem] w-72 h-72 md:w-80 md:h-80 flex items-center justify-center shadow-inner">
          {loading ? (
            <div className="animate-spin h-10 w-10 border-4 border-[#5dbcd2] border-t-transparent rounded-full" />
          ) : qrImageUrl ? (
            <img 
              src={qrImageUrl} 
              alt="QR Code Attendance" 
              className="w-full h-full object-contain"
              onError={() => setError("QR image failed to load")}
            />
          ) : (
            <div className="text-red-600 text-center font-bold px-4">
              <FiInfo size={42} className="mx-auto mb-2" />
              <p>{error}</p>
            </div>
          )}
        </div>

        <div className="text-white flex-1 text-center md:text-left">
          <h2 className="text-4xl font-black mb-3">Here’s your QR Code</h2>
          <p className="text-lg opacity-90 mb-6">
            Students must scan this QR code to mark today’s attendance.
          </p>
          <div className="bg-black/20 py-2 px-5 rounded-xl border border-white/20 font-bold inline-block">
            📅 {new Date().toLocaleDateString('id-ID', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            })}
          </div>
        </div>

      </div>
    </div>
  );
};

export default QRCodeGenerator;
