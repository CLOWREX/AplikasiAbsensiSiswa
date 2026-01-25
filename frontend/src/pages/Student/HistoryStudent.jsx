import React from 'react';
import { FiArrowLeft, FiSearch, FiCheckCircle, FiXCircle } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const HistoryStudent = () => {
  const navigate = useNavigate();
  const [search, setSearch] = React.useState("");

  const attendanceData = [
    { status: 'Present', date: '18 Oct 2025, 09.25 PM', type: 'success' },
    { status: 'Present', date: '17 Oct 2025, 10.30 PM', type: 'success' },
    { status: 'Sick', date: '16 Oct 2025, 07.30 PM', type: 'danger' },
    { status: 'Present', date: '15 Oct 2025, 06.10 PM', type: 'success' },
    { status: 'Alpha', date: '14 Oct 2025, 08.45 AM', type: 'danger' },
  ];

  const filteredData = attendanceData.filter((item) => {
  const keyword = search.toLowerCase().trim();

  if (!keyword) return true;

  const combined = `${item.status} ${item.date}`.toLowerCase();

  return combined.includes(keyword);
});

  return (
    <div className="flex-1 flex flex-col h-screen bg-[#eaf6fb] font-['Afacad']">
      <div className="bg-[#5dbcd2] p-5 flex items-center gap-4 text-white shadow-sm">
        <button onClick={() => navigate("/home")} className="hover:bg-white/20 p-1 rounded-full transition">
          <FiArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-bold">History</h1>
      </div>

      <div className="p-6 md:p-10 flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-8">
          
          {/* Kolom Kiri: Search & List */}
          <div className="flex-[2] space-y-6">
            {/* Search Bar */}
            <div className="relative group">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-[#5dbcd2] text-xl" />
              <input 
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by status or date..." 
                className="w-full bg-white/80 border-2 border-white rounded-full py-4 !pl-[50px] pr-6 outline-none focus:border-[#5dbcd2] shadow-sm transition-all font-semibold text-gray-600"
              />
            </div>

            {/* Attendance List */}
            <div className="space-y-4">
              {filteredData.map((item, index) => (
                <div key={index} className="bg-white/60 backdrop-blur-sm border border-white rounded-[2rem] p-4 flex items-center justify-between shadow-sm hover:shadow-md transition-all">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${item.type === 'success' ? 'bg-[#5dbcd2] text-white' : 'bg-[#ff7e7e] text-white'}`}>
                      {item.type === 'success' ? <FiCheckCircle size={24} /> : <FiXCircle size={24} />}
                    </div>
                    <span className="text-xl font-black text-gray-700">{item.status}</span>
                  </div>
                  <span className="text-[#899ca9] font-bold text-sm md:text-base">{item.date}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Monthly Summary */}
          <div className="flex-1">
            <div className="sticky top-0 space-y-6">
              <h3 className="text-2xl font-black text-gray-800 ml-2">Monthly Summary</h3>
              
              <div className="grid grid-cols-2 gap-4">
                {/* Card Total Days */}
                <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-white flex flex-col items-center justify-center text-center">
                  <span className="text-[#899ca9] font-bold text-sm mb-1">Total Days</span>
                  <span className="text-4xl font-black text-[#5dbcd2]">22</span>
                </div>

                {/* Card Present */}
                <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-white flex flex-col items-center justify-center text-center">
                  <span className="text-[#899ca9] font-bold text-sm mb-1">Present</span>
                  <span className="text-4xl font-black text-[#4ade80]">13</span>
                </div>

                {/* Card Sick */}
                <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-white flex flex-col items-center justify-center text-center">
                  <span className="text-[#899ca9] font-bold text-sm mb-1">Sick</span>
                  <span className="text-4xl font-black text-[#f87171]">5</span>
                </div>

                {/* Card Permission */}
                <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-white flex flex-col items-center justify-center text-center">
                  <span className="text-[#899ca9] font-bold text-sm mb-1">Permission</span>
                  <span className="text-4xl font-black text-[#fbbf24]">3</span>
                </div>

                {/* Card Alpha */}
                <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-white flex flex-col items-center justify-center text-center">
                  <span className="text-[#899ca9] font-bold text-sm mb-1">Alpha</span>
                  <span className="text-4xl font-black text-[#fbbf24]">1</span>
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