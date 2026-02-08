import React, { useState } from 'react';
import { FiArrowLeft, FiSend } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; 
import Swal from 'sweetalert2'; 
import api from "../../api";

const PresencePage = () => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState("");
  const [explanation, setExplanation] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selected || !explanation) {
      Swal.fire({
        icon: 'warning',
        title: 'Oops...',
        text: 'Please select a type and provide an explanation!',
        confirmButtonColor: '#5dbcd2',
        borderRadius: '2rem'
      });
      return;
    }

    setLoading(true);

    const attendanceData = {
      status: selected,
      explanation: explanation
    };

    try {
      await api.post("/attendance/submit", attendanceData);

      await Swal.fire({
        icon: 'success',
        title: 'Submitted!',
        text: 'Your presence has been recorded.',
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });

      navigate("/history");
    } catch (err) {
      console.error(err);
      
      // Notif Error
      Swal.fire({
        icon: 'error',
        title: 'Failed',
        text: err.response?.data?.detail || "Gagal mengirim absen ke database",
        confirmButtonColor: '#5dbcd2',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden bg-[#eaf6fb]">
      <div className="bg-[#5dbcd2] p-5 flex items-center gap-4 text-white shadow-sm">
        <button onClick={() => navigate("/home")} className="hover:bg-white/20 p-1 rounded-full transition">
          <FiArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-bold">Presence Submission</h1>
      </div>

      <div className="p-6 md:p-10 flex-1">        
        <div className="max-w-3xl mt-[-10px] ml-0 md:ml-22 bg-white rounded-[2.5rem] p-8 shadow-sm border border-white">          
          <h2 className="text-2xl font-black text-gray-800 mb-2">Submit Attendance</h2>
          <p className="text-[#899ca9] font-bold mb-8">Please provide details for your school absence.</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-[#5dbcd2] font-black mb-2 text-sm">Type of Absence</label>
              <select 
                required
                value={selected}
                onChange={(e) => setSelected(e.target.value)}
                className={`w-full bg-[#f8fafb] border-2 border-gray-100 rounded-2xl px-5 py-4 outline-none focus:border-[#5dbcd2] font-bold appearance-none cursor-pointer transition-colors ${
                  selected === "" ? "text-gray-400" : "text-gray-600"
                }`}>
                <option value="" disabled>Select absence type</option>
                <option value="Sick">Sick</option>
                <option value="Permission">Permission</option>
              </select>
            </div>

            <div>
              <label className="block text-[#5dbcd2] font-black mb-2 text-sm ml-1">Explanation</label>
              <textarea 
                required
                value={explanation}
                onChange={(e) => setExplanation(e.target.value)}
                placeholder="Reasons for missing school"
                rows="5"
                className="w-full h-35 bg-[#f8fafb] border-2 border-gray-100 rounded-[1rem] !pt-[20px] !pl-[20px] !pr-[20px] !pb-[20px] outline-none focus:border-[#5dbcd2] font-bold text-gray-600 resize-none placeholder:text-gray-400 shadow-inner">
              </textarea>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className={`h-13 w-full bg-[#5dbcd2] text-white py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-3 shadow-lg active:scale-[0.98] transition ${loading ? 'opacity-70' : ''}`}>
              <FiSend className="rotate-45" />
              {loading ? "Sending..." : "Send Presence"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PresencePage;