import React, { useState, useEffect } from 'react';
import { FiArrowLeft, FiSearch, FiCheckCircle, FiXCircle } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import api from "../../api";

const HistoryStudent = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [attendanceHistory, setAttendanceHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const formatDateTimeUI = (dateStr, timeStr) => {
    try {
      if (!dateStr || !timeStr) return "";

      let displayDate = dateStr;
      if (!/[a-zA-Z]/.test(dateStr)) {
        const dateObj = new Date(dateStr);
        displayDate = dateObj.toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        });
      }

      const [hours, minutes] = timeStr.split(':');
      const tempDate = new Date();
      tempDate.setHours(parseInt(hours), parseInt(minutes));

      const displayTime = tempDate.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      }).toLowerCase();

      return `${displayDate}, ${displayTime}`;
    } catch (e) {
      return `${dateStr}, ${timeStr}`;
    }
  };

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await api.get("/attendance/history", {
          withCredentials: true
        });
        
        const sortedData = res.data.sort((a, b) => {
          const dateTimeA = new Date(`${a.date} ${a.time}`);
          const dateTimeB = new Date(`${b.date} ${b.time}`);
          return dateTimeB - dateTimeA; 
        });

        setAttendanceHistory(sortedData);
      } catch (err) {
        console.error("Gagal mengambil data history:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const summary = {
    present: attendanceHistory.filter(item => item.status === 'Present').length,
    sick: attendanceHistory.filter(item => item.status === 'Sick').length,
    alpha: attendanceHistory.filter(item => item.status === 'Alpha').length,
    permission: attendanceHistory.filter(item => item.status === 'Permission').length,
    total: attendanceHistory.length
  };

  const filteredData = attendanceHistory.filter((item) => {
    const keyword = search.toLowerCase().trim();
    if (!keyword) return true;
    const combinedData = `${item.status} ${item.explanation || ''} ${item.date}`.toLowerCase();
    return combinedData.includes(keyword);
  });

  return (
    <div className="flex-1 flex flex-col h-screen bg-[#eaf6fb] font-['Afacad']">
      <div className="bg-[#5dbcd2] p-5 flex items-center gap-4 text-white shadow-md">
        <button onClick={() => navigate("/home")} className="hover:bg-white/20 p-2 rounded-full transition-all active:scale-90">
          <FiArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-bold tracking-tight">Attendance History</h1>
      </div>

      <div className="p-6 md:p-10 flex-1 overflow-y-auto scrollbar-hide">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-8">
          
          <div className="flex-[2] space-y-6">
            <div className="relative group">
              <FiSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-[#5dbcd2] text-xl" />
              <input 
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search status or date..." 
                className="w-full bg-white border-2 border-white rounded-full py-4 !pl-14 pr-6 outline-none focus:border-[#5dbcd2] shadow-sm transition-all font-semibold text-gray-600"
              />
            </div>

            <div className="space-y-4">
              {loading ? (
                <div className="text-center py-10 text-[#5dbcd2] font-bold">Loading...</div>
              ) : filteredData.length > 0 ? (
                filteredData.map((item, index) => (
                  <div key={index} className="bg-white/80 backdrop-blur-md rounded-[2rem] p-5 flex items-center justify-between shadow-sm border border-white hover:-translate-y-1 transition-all duration-300">
                    <div className="flex items-center gap-5">
                      <div className={`w-14 h-14 rounded-full flex items-center justify-center ${
                        item.status === 'Present' ? 'bg-[#5dd26f]' : 
                        item.status === 'Sick' ? 'bg-red-400' :
                        item.status === 'Permission' ? 'bg-yellow-400' : 'bg-red-600'
                      } text-white shadow-lg shadow-black/5`}>
                        {item.status === 'Present' ? <FiCheckCircle size={28} /> : <FiXCircle size={28} />}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-2xl font-black text-gray-700 leading-none">
                          {item.status}
                        </span>
                        
                        {item.status === 'Present' && (
                          <p className={`text-sm italic mt-1 font-bold ${
                            (() => {
                              const [hours, minutes] = item.time.split(':').map(Number);
                              return (hours > 6 || (hours === 6 && minutes > 30))
                                ? 'text-orange-500'
                                : 'text-green-500';
                            })()
                          }`}>
                            {(() => {
                              const [hours, minutes] = item.time.split(':').map(Number);
                              return (hours > 6 || (hours === 6 && minutes > 30))
                                ? 'Late'
                                : 'On time';
                            })()}
                          </p>
                        )}

                        {item.explanation && ['Sick', 'Permission'].includes(item.status) && (
                          <p className="text-sm text-gray-500 italic mt-1 font-medium">
                            {item.explanation}
                          </p>
                        )}

                        <p className="text-[11px] font-bold text-[#899ca9] lg:hidden mt-1 tracking-wide">
                          {formatDateTimeUI(item.date, item.time)}
                        </p>
                      </div>
                    </div>

                    <div className="hidden lg:block text-right">
                      <span className="text-[#899ca9] font-bold text-base tracking-wide">
                        {formatDateTimeUI(item.date, item.time)}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-20 text-gray-400 font-bold">No records found.</div>
              )}
            </div>
          </div>

          <div className="flex-1">
            <div className="sticky top-0 space-y-6">
              <h3 className="text-2xl font-black text-gray-800 ml-4 mb-2">Summary</h3>
              <div className="grid grid-cols-2 gap-4">
                <SummaryCard label="Total" value={summary.total} color="text-[#5dbcd2]" />
                <SummaryCard label="Present" value={summary.present} color="text-green-400" />
                <SummaryCard label="Sick" value={summary.sick} color="text-red-400" />
                <SummaryCard label="Permission" value={summary.permission} color="text-yellow-400" />
                <div className="col-span-2">
                  <SummaryCard label="Alpha" value={summary.alpha} color="text-red-600" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const SummaryCard = ({ label, value, color }) => (
  <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-white flex flex-col items-center hover:scale-105 transition-transform duration-300">
    <span className="text-[#899ca9] font-bold text-[10px] uppercase tracking-widest mb-1">{label}</span>
    <span className={`text-4xl font-black ${color}`}>{value}</span>
  </div>
);

export default HistoryStudent;