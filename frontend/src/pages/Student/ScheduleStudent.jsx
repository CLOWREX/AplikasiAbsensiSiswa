import React, { useState, useEffect } from 'react';
import { FiUser, FiArrowLeft } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const SchedulePage = () => {
  const navigate = useNavigate();
  const [activeDay, setActiveDay] = useState("Monday");
  const [scheduleData, setScheduleData] = useState({});
  const [loading, setLoading] = useState(true);

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

  useEffect(() => {
    fetchSchedules();
  }, []);

  const fetchSchedules = async () => {
    try {
      const response = await axios.get("http://localhost:8001/schedule/");
      
      const grouped = response.data.reduce((acc, curr) => {
        if (!acc[curr.day]) acc[curr.day] = [];
        acc[curr.day].push(curr);
        return acc;
      }, {});

      setScheduleData(grouped);
    } catch (error) {
      console.error("Gagal mengambil jadwal:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F0F7F9] font-['Afacad'] pb-10">
      <div className="bg-[#5dbcd2] p-5 flex items-center gap-4 text-white shadow-sm">
        <button 
          onClick={() => navigate("/home")} 
          className="hover:bg-white/20 p-1 rounded-full transition active:scale-90"
        >
          <FiArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-bold tracking-wide">Schedule</h1>
      </div>

      <nav className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-[1400px] mx-auto px-8 py-5 flex gap-6 overflow-x-auto scrollbar-hide justify-center">
          {days.map((day) => (
            <button
              key={day}
              onClick={() => setActiveDay(day)}
              className={`w-27 h-11 rounded-full font-bold text-base transition-all flex-shrink-0 ${
                activeDay === day 
                ? "bg-[#5DBDD2] text-white shadow-lg" 
                : "bg-[#E2F1F4] text-[#899CA9] hover:bg-[#D5EAEF]"
              }`}>
              {day}
            </button>
          ))}
        </div>
      </nav>

      <main className="max-w-[1400px] mx-auto px-8 py-10">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-black text-[#5DBDD2] tracking-tight">{activeDay}</h2>
          <span className="bg-[#D1EFF5] text-[#5DBDD2] px-5 py-2 rounded-full text-xs font-black uppercase tracking-widest">
            {scheduleData[activeDay]?.length || 0} Subjects
          </span>
        </div>

        <div className="space-y-6">
          {loading ? (
            <div className="text-center py-20 text-[#5dbcd2] font-bold animate-pulse">
              Loading schedule...
            </div>
          ) : scheduleData[activeDay] && scheduleData[activeDay].length > 0 ? (
            scheduleData[activeDay].map((item, index) => (
              <div 
                key={index} 
                className="group bg-[#5DBDD2] rounded-[2.5rem] p-6 shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center gap-8 border border-white/20"
              >
                <div className="bg-white/20 backdrop-blur-md rounded-[2rem] p-6 min-w-[180px] text-center flex flex-col items-center justify-center text-white border border-white/30">
                  <span className="text-xl font-black">{item.time.split(' - ')[0]}</span>
                  <div className="w-6 h-[2px] bg-white/40 my-2 rounded-full"></div>
                  <span className="text-sm font-bold opacity-80">{item.time.split(' - ')[1]}</span>
                </div>

                <div className="flex-1">
                  <h3 className="text-2xl font-black text-white mb-2 tracking-tight">
                    {item.subject}
                  </h3>
                  <div className="flex items-center gap-3 text-white/90 font-bold">
                    <FiUser className="opacity-70" />
                    <span className="text-lg">{item.teacher}</span>
                  </div>
                </div>

                <div className="flex flex-col items-end">
                  <span className="bg-white/30 text-white px-6 py-2 rounded-2xl text-xs font-black uppercase tracking-widest border border-white/20 whitespace-nowrap">
                    {item.room}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-20 text-gray-400 font-bold text-xl italic bg-white/50 rounded-[2.5rem] border-2 border-dashed border-gray-200">
              No schedule available for this day.
            </div>
          )}
        </div>
      </main>

      <style dangerouslySetInnerHTML={{ __html: `
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </div>
  );
};

export default SchedulePage;