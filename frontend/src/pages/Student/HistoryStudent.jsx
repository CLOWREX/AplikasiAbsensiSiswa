import React, { useState, useEffect } from 'react';
import { FiArrowLeft, FiSearch, FiCheckCircle, FiXCircle } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const HistoryStudent = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [attendanceHistory, setAttendanceHistory] = useState([]);

  useEffect(() => {
    const savedData = JSON.parse(localStorage.getItem("attendanceHistory") || "[]");
    setAttendanceHistory(savedData);
  }, []);

  const summary = {
    present: attendanceHistory.filter(item => item.status.startsWith('Present')).length,
    sick: attendanceHistory.filter(item => item.status.startsWith('Sick')).length,
    alpha: attendanceHistory.filter(item => item.status.startsWith('Alpha')).length,
    permission: attendanceHistory.filter(item => item.status.startsWith('Permission')).length,
    total: attendanceHistory.length
  };

  const filteredData = attendanceHistory.filter((item) => {
    const keyword = search.toLowerCase().trim();
    if (!keyword) return true;
    const combinedData = `${item.status} ${item.date} ${item.time}`.toLowerCase();
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
              <FiSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-[#5dbcd2] text-xl transition-colors group-focus-within:text-[#46a1b5]" />
              <input 
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by status or date..." 
                className="w-full bg-white/90 border-2 border-white rounded-full py-4 !pl-14 pr-6 outline-none focus:border-[#5dbcd2] focus:bg-white shadow-sm transition-all font-semibold text-gray-600 placeholder:text-gray-300"
              />
            </div>

            <div className="space-y-4">
              {filteredData.length > 0 ? (
                filteredData.map((item, index) => {
                  const parts = item.status.split(" - ");
                  const mainStatus = parts[0];
                  const reason = parts[1];

                  return (
                    <div key={index} className="bg-white/70 backdrop-blur-md border border-white rounded-[2.2rem] p-5 flex items-center justify-between shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300">
                      <div className="flex items-center gap-5">
                        <div className={`w-14 h-14 rounded-full flex items-center justify-center shadow-inner ${
                          mainStatus === 'Present' ? 'bg-[#5dd26f] text-white' : 'bg-red-400 text-white'
                        }`}>
                          {mainStatus === 'Present' ? <FiCheckCircle size={28} /> : <FiXCircle size={28} />}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-2xl font-black text-gray-700 leading-none mb-1">{mainStatus}</span>
                          
                          {reason && (
                            <p className="text-sm font-medium text-gray-500 italic leading-snug">
                              {reason}
                            </p>
                          )}
                          
                          <p className="text-xs font-bold text-gray-400 lg:hidden mt-1">{item.date} • {item.time}</p>
                        </div>
                      </div>
                      <span className="hidden lg:block text-[#899ca9] font-black text-lg bg-white/50 px-5 py-2 rounded-2xl border border-white/50">
                        {item.date}, {item.time}
                      </span>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-20 bg-white/30 rounded-[3rem] border-2 border-dashed border-white">
                  <p className="text-gray-400 font-bold text-xl italic">
                    {search ? `Oops! No match for "${search}"` : "No attendance records found."}
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="flex-1">
            <div className="sticky top-0 space-y-6">
              <h3 className="text-2xl font-black text-gray-800 ml-4 mb-2">Monthly Summary</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-[2.5rem] p-7 shadow-sm border border-white flex flex-col items-center justify-center text-center transition-transform hover:scale-105">
                  <span className="text-[#899ca9] font-bold text-[10px] uppercase tracking-[0.2em] mb-2">Total</span>
                  <span className="text-5xl font-black text-[#5dbcd2]">{summary.total}</span>
                </div>
                <div className="bg-white rounded-[2.5rem] p-7 shadow-sm border border-white flex flex-col items-center justify-center text-center transition-transform hover:scale-105">
                  <span className="text-[#899ca9] font-bold text-[10px] uppercase tracking-[0.2em] mb-2">Present</span>
                  <span className="text-5xl font-black text-green-400">{summary.present}</span>
                </div>
                <div className="bg-white rounded-[2.5rem] p-7 shadow-sm border border-white flex flex-col items-center justify-center text-center transition-transform hover:scale-105">
                  <span className="text-[#899ca9] font-bold text-[10px] uppercase tracking-[0.2em] mb-2">Sick</span>
                  <span className="text-5xl font-black text-red-400">{summary.sick}</span>
                </div>
                <div className="bg-white rounded-[2.5rem] p-7 shadow-sm border border-white flex flex-col items-center justify-center text-center transition-transform hover:scale-105">
                  <span className="text-[#899ca9] font-bold text-[10px] uppercase tracking-[0.2em] mb-2">Permission</span>
                  <span className="text-5xl font-black text-yellow-400">{summary.permission}</span>
                </div>
                <div className="bg-white rounded-[2.5rem] p-7 shadow-sm border border-white flex flex-col items-center justify-center text-center col-span-2 transition-transform hover:scale-[1.02]">
                  <span className="text-[#899ca9] font-bold text-[10px] uppercase tracking-[0.2em] mb-2">Alpha</span>
                  <span className="text-5xl font-black text-red-600">{summary.alpha}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistoryStudent;