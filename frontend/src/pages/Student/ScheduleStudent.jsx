import React, { useState, useEffect } from 'react';
import { FiUser, FiArrowLeft, FiClock, FiMapPin } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import api from "../../api";

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
      const response = await api.get("/schedule/");
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
      <div className="bg-[#5dbcd2] p-4 md:p-5 flex items-center gap-4 text-white shadow-sm sticky top-0 z-20">
        <button 
          onClick={() => navigate("/home")} 
          className="hover:bg-white/20 p-2 rounded-full transition active:scale-90"
        >
          <FiArrowLeft size={24} />
        </button>
        <h1 className="text-lg md:text-xl font-bold tracking-wide">Schedule</h1>
      </div>

        <nav className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">        
          <div className="max-w-[1400px] mx-auto px-4 md:px-10 py-5 flex gap-4 md:gap-8 overflow-x-auto scrollbar-hide md:justify-center">
            {days.map((day) => (
            <button
              key={day}
              onClick={() => setActiveDay(day)}
              className={`!px-[15px] !py-[8px] md:w-27 md:h-11 rounded-full font-bold text-sm md:text-base transition-all flex-shrink-0 ${
                activeDay === day 
                ? "bg-[#5DBDD2] text-white shadow-md" 
                : "bg-[#E2F1F4] text-[#899CA9]"
              }`}
            >
              {day}
            </button>
          ))}
        </div>
      </nav>

      <main className="max-w-[1400px] mx-auto px-4 md:px-8 py-6 md:py-10">
        <div className="flex justify-between items-center mb-6 md:mb-8">
          <h2 className="text-2xl md:text-3xl font-black text-[#5DBDD2] tracking-tight">{activeDay}</h2>
          <span className="bg-[#D1EFF5] text-[#5DBDD2] px-4 py-1.5 md:px-5 md:py-2 rounded-full text-[10px] md:text-xs font-black uppercase tracking-widest">
            {scheduleData[activeDay]?.length || 0} Subjects
          </span>
        </div>

        <div className="space-y-4 md:space-y-6">
          {loading ? (
            <div className="text-center py-20 text-[#5dbcd2] font-bold animate-pulse text-lg">
              Loading schedule...
            </div>
          ) : scheduleData[activeDay] && scheduleData[activeDay].length > 0 ? (
            scheduleData[activeDay].map((item, index) => (
              <div 
                key={index} 
                className="group bg-[#5DBDD2] rounded-[1.5rem] md:rounded-[2.5rem] p-4 md:p-6 shadow-lg flex flex-col md:flex-row md:items-center gap-4 md:gap-8 border border-white/20"
              >
                <div className="bg-white/20 backdrop-blur-md rounded-[1.2rem] md:rounded-[2rem] p-3 md:p-6 md:min-w-[160px] flex md:flex-col items-center justify-between md:justify-center text-white border border-white/30">
                  <div className="flex items-center gap-2 md:block">
                    <FiClock className="md:hidden opacity-70" />
                    <span className="text-base md:text-xl font-black">{item.time.split(' - ')[0]}</span>
                  </div>
                  <div className="hidden md:block w-6 h-[2px] bg-white/40 my-2 rounded-full"></div>
                  <span className="text-xs md:text-sm font-bold opacity-80">{item.time.split(' - ')[1]}</span>
                </div>

                <div className="flex-1">
                  <h3 className="text-xl md:text-2xl font-black text-white mb-1 md:mb-2 tracking-tight">
                    {item.subject}
                  </h3>
                  <div className="flex items-center gap-2 text-white/90 font-bold">
                    <FiUser className="opacity-70 shrink-0" />
                    <span className="text-sm md:text-lg truncate">{item.teacher}</span>
                  </div>
                </div>

                <div className="flex items-center md:items-end justify-between md:justify-start border-t border-white/10 pt-3 md:pt-0 md:border-t-0">
                  <div className="flex items-center gap-2 md:hidden text-white/80 text-xs font-bold">
                    <FiMapPin /> Location
                  </div>
                  <span className="bg-white/30 text-white px-4 py-1.5 md:px-6 md:py-2 rounded-xl md:rounded-2xl text-[10px] md:text-xs font-black uppercase tracking-widest border border-white/20">
                    {item.room}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-16 text-gray-400 font-bold text-lg italic bg-white/50 rounded-[1.5rem] md:rounded-[2.5rem] border-2 border-dashed border-gray-200 px-6">
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