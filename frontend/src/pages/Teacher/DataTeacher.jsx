import React, { useState, useEffect } from 'react';
import { FiUser, FiArrowLeft, FiEdit2, FiTrash2, FiPlus } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const SchedulePage = () => {
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

  const handleSubmit = async () => {
    try {
      if (editId) {
        await axios.put(`http://localhost:8001/schedule/${editId}`, form);
      } else {
        await axios.post("http://localhost:8001/schedule/", form);
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
    await axios.delete(`http://localhost:8001/schedule/${id}`);
    fetchSchedules();
  };

  return (
    <div className="min-h-screen bg-[#F0F7F9] font-['Afacad'] pb-10">
      <div className="bg-[#5dbcd2] p-5 flex items-center gap-4 text-white shadow-sm">
        <button onClick={() => navigate("/home_teacher")} className="hover:bg-white/20 p-1 rounded-full">
          <FiArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-bold tracking-wide">Manage Data</h1>
      </div>

      <nav className="bg-white border-b sticky top-0 z-10 shadow-sm">
        <div className="max-w-[1400px] mx-auto px-8 py-5 flex gap-6 justify-center">
          {days.map(day => (
            <button
              key={day}
              onClick={() => setActiveDay(day)}
              className={`w-27 h-11 rounded-full font-bold ${
                activeDay === day ? "bg-[#5DBDD2] text-white" : "bg-[#E2F1F4] text-[#899CA9]"
              }`}
            >
              {day}
            </button>
          ))}
        </div>
      </nav>

      <main className="max-w-[1400px] mx-auto px-8 py-10">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-black text-[#5DBDD2]">{activeDay}</h2>
          <button
            onClick={() => {
              setEditId(null);
              setForm({ day: activeDay, time: "", subject: "", teacher: "", room: "" });
              setShowModal(true);
            }}
            className="
              bg-[#5DBDD2]
              min-w-[80px]
              min-h-[35px]
              text-white
              px-8 py-4
              rounded-full
              flex items-center justify-center gap-3
              font-bold
            "
          >
            <FiPlus />
            <span>Add</span>
          </button>
        </div>

        <div className="space-y-6">
          {loading ? (
            <div className="text-center py-20 font-bold">Loading...</div>
          ) : scheduleData[activeDay]?.map(item => (
            <div key={item.id} className="group bg-[#5DBDD2] rounded-[2.5rem] p-6 flex gap-8 shadow-xl">
              <div className="bg-white/20 rounded-[2rem] p-6 min-w-[180px] text-center text-white">
                <span className="text-xl font-black">{item.time.split(" - ")[0]}</span>
                <div className="my-2 h-[2px] bg-white/40"></div>
                <span className="text-sm font-bold">{item.time.split(" - ")[1]}</span>
              </div>

              <div className="flex-1 text-white">
                <h3 className="text-2xl font-black">{item.subject}</h3>
                <div className="flex items-center gap-2 mt-2 font-bold">
                  <FiUser /> {item.teacher}
                </div>

                <div className="flex gap-3 mt-4">
                  <button onClick={() => handleEdit(item)} className="bg-white/30 px-4 py-2 rounded-xl min-w-[40px] min-h-[40px] flex items-center justify-center gap-3">
                    <FiEdit2 />
                  </button>
                  <button onClick={() => handleDelete(item.id)} className="bg-red-500/80 px-4 py-2 rounded-xl min-w-[40px] min-h-[40px] flex items-center justify-center gap-3">
                    <FiTrash2 />
                  </button>
                </div>
              </div>

              <div className="flex items-end">
                <span className="bg-white/30 text-white px-6 py-2 rounded-2xl text-xs font-black">
                  {item.room}
                </span>
              </div>
            </div>
          ))}
        </div>
      </main>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-8 m-[8] w-[400px] space-y-4">
            {["time", "subject", "teacher", "room"].map(f => (
              <div key={f} className="flex flex-col gap-2 mb-5">
                <label className="text-sm font-semibold text-gray-600 capitalize">
                  {f}
                </label>

                <input
                  value={form[f]}
                  onChange={e => setForm({ ...form, [f]: e.target.value })}
                  placeholder={`Enter ${f}`}
                  className="
                    w-full
                    border border-gray-300
                    !px-3 !py-2
                    !text-base
                    !leading-normal
                    rounded-lg
                    focus:outline-none
                    focus:ring-2 focus:ring-[#5DBDD2]/50
                  "
                />
              </div>
            ))}

            <div className="flex justify-end gap-3">
              <button onClick={() => setShowModal(false)}>Cancel</button>
              <button onClick={handleSubmit} className="bg-[#5DBDD2] text-white px-6 py-2 rounded-xl min-w-[60px] min-h-[30px] flex items-center justify-center gap-3">
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SchedulePage;
