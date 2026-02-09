import React, { useState, useEffect } from 'react';
import { FiUser, FiArrowLeft, FiEdit2, FiTrash2, FiPlus, FiClock, FiMapPin } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import api from "../../api";

const ManageData = () => {
  const navigate = useNavigate();
  const [activeDay, setActiveDay] = useState("Monday");
  const [scheduleData, setScheduleData] = useState({});
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({
    day: "Monday",
    time: "",
    subject: "",
    teacher: "",
    room: ""
  });

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

  const handleSubmit = async () => {
    try {
      if (editId) {
        await api.put(`/schedule/${editId}`, form);
      } else {
        await api.post("/schedule/", form);
      }
      setShowModal(false);
      setEditId(null);
      setForm({ day: activeDay, time: "", subject: "", teacher: "", room: "" });
      fetchSchedules();
    } catch (err) {
      console.error("CRUD error:", err);
    }
  };

  const handleEdit = (item) => {
    setEditId(item.id);
    setForm(item);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Hapus jadwal ini?")) return;
    try {
      await api.delete(`/schedule/${id}`);
      fetchSchedules();
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  return (
    <div className="min-h-screen bg-[#F0F7F9] font-['Afacad'] pb-10">
      <div className="bg-[#5dbcd2] p-4 md:p-5 flex items-center gap-4 text-white shadow-sm sticky top-0 z-20">
        <button onClick={() => navigate("/home_teacher")} className="hover:bg-white/20 p-2 rounded-full transition-all">
          <FiArrowLeft size={24} />
        </button>
        <h1 className="text-lg md:text-xl font-bold tracking-wide">Manage Data</h1>
      </div>

      <nav className="bg-white border-b sticky top-[60px] md:top-[68px] z-10 shadow-sm">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-4 md:py-5 flex gap-3 md:gap-6 overflow-x-auto scrollbar-hide md:justify-center">
          {days.map(day => (
            <button
              key={day}
              onClick={() => setActiveDay(day)}
              className={`!px-[15px] !md:px-[15px] h-11 rounded-full font-bold transition-all flex-shrink-0 whitespace-nowrap ${
                activeDay === day ? "bg-[#5DBDD2] text-white shadow-md" : "bg-[#E2F1F4] text-[#899CA9]"
              }`}
            >
              {day}
            </button>
          ))}
        </div>
      </nav>

      <main className="max-w-[1400px] mx-auto px-4 md:px-8 py-6 md:py-10">
        <div className="flex justify-between items-center mb-6 md:mb-8">
          <h2 className="text-2xl md:text-3xl font-black text-[#5DBDD2]">{activeDay}</h2>
          <button
            onClick={() => {
              setEditId(null);
              setForm({ day: activeDay, time: "", subject: "", teacher: "", room: "" });
              setShowModal(true);
            }}
            className="bg-[#5DBDD2] text-white !px-[18px] !md:px-18px] !py-[8px] !md:py-[8px] rounded-full flex items-center gap-2 font-bold shadow-lg hover:scale-105 transition-transform"
          >
            <FiPlus size={20} />
            <span className="text-sm md:text-base">Add</span>
          </button>
        </div>

        <div className="space-y-4 md:space-y-6">
          {loading ? (
            <div className="text-center py-20 font-bold text-[#5DBDD2] animate-pulse">Loading...</div>
          ) : scheduleData[activeDay]?.map(item => (
            <div key={item.id} className="group bg-[#5DBDD2] rounded-[1.5rem] md:rounded-[2.5rem] p-4 md:p-6 flex flex-col md:flex-row gap-4 md:gap-8 shadow-xl border border-white/20">
              
              <div className="bg-white/20 backdrop-blur-sm rounded-[1rem] md:rounded-[2rem] p-4 md:min-w-[180px] text-center text-white flex md:flex-col items-center justify-between md:justify-center">
                <div className="flex items-center gap-2 md:block">
                  <FiClock className="md:hidden opacity-70" />
                  <span className="text-lg md:text-xl font-black">{item.time.split(" - ")[0]}</span>
                </div>
                <div className="hidden md:block my-2 h-[2px] bg-white/40 w-8 mx-auto"></div>
                <span className="text-xs md:text-sm font-bold opacity-80">{item.time.split(" - ")[1]}</span>
              </div>

              <div className="flex-1 text-white">
                <h3 className="text-xl md:text-2xl font-black tracking-tight">{item.subject}</h3>
                <div className="flex items-center gap-2 mt-1 md:mt-2 font-bold opacity-90">
                  <FiUser className="shrink-0" /> <span className="text-sm md:text-base">{item.teacher}</span>
                </div>

                <div className="flex gap-3 mt-4">
                  <button onClick={() => handleEdit(item)} className="bg-white/30 hover:bg-white/50 rounded-xl transition-colors !px-[10px] !py-[10px]">
                    <FiEdit2 size={18} />
                  </button>
                  <button onClick={() => handleDelete(item.id)} className="bg-red-500/80 hover:bg-red-600 rounded-xl transition-colors !px-[10px] !py-[10px]">
                    <FiTrash2 size={18} />
                  </button>
                </div>
              </div>

              <div className="flex items-center md:items-end justify-between md:justify-start border-t border-white/10 pt-3 md:pt-0 md:border-t-0">
                 <div className="md:hidden flex items-center gap-2 text-white/70 text-xs font-bold uppercase">
                    <FiMapPin /> Room
                 </div>
                <span className="bg-white/30 text-white px-5 py-1.5 md:px-6 md:py-2 rounded-xl text-[10px] md:text-xs font-black uppercase tracking-widest border border-white/20">
                  {item.room}
                </span>
              </div>
            </div>
          ))}
        </div>
      </main>

      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[2rem] p-6 md:p-8 w-full max-w-[450px] shadow-2xl animate-in fade-in zoom-in duration-200">
            <h2 className="text-2xl font-black text-[#5DBDD2] mb-6">{editId ? 'Edit Schedule' : 'New Schedule'}</h2>
            
            <div className="space-y-4">
              {["time", "subject", "teacher", "room"].map(f => (
                <div key={f} className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">
                    {f}
                  </label>
                  <input
                    value={form[f]}
                    onChange={e => setForm({ ...form, [f]: e.target.value })}
                    placeholder={`Enter ${f}...`}
                    className="w-full bg-gray-50 border border-gray-200 !px-[10px] !py-[3px] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5DBDD2]/50 focus:bg-white transition-all text-gray-700"
                  />
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-3 mt-8">
              <button 
                onClick={() => setShowModal(false)}
                className="px-6 py-3 font-bold text-gray-400 hover:text-gray-600"
              >
                Cancel
              </button>
              <button 
                onClick={handleSubmit} 
                className="bg-[#5DBDD2] text-white !px-[15px] !py-[3px] rounded-xl font-bold shadow-lg shadow-[#5DBDD2]/30 active:scale-95 transition-all"
              >
                Save Data
              </button>
            </div>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </div>
  );
};

export default ManageData;