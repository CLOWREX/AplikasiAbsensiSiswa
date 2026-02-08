import React, { useEffect, useState } from 'react';
import { FiArrowLeft } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext'; 

const NotificationTeacher = () => {
  const { user, loading } = useAuth();  
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [dailySummary, setDailySummary] = useState({
    total_classes: 0,
    finished_classes: 0,
    in_progress_classes: 0,
    completion_rate: 0
  });

  const fetchNotifications = async () => {
    try {
      const res = await axios.get('http://192.168.100.102:8004/teacher/notifications', { withCredentials: true });
      setNotifications(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      if (err.response?.status === 401) {
        navigate("/login");
      } else {
        console.error(err);
        setNotifications([]);
      }
    }
  };

  const fetchDailySummary = async () => {
    try {
      const res = await axios.get('http://192.168.100.102:8004/teacher/daily-summary', { withCredentials: true });
      setDailySummary(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchNotifications();
    fetchDailySummary();  

    const interval = setInterval(fetchNotifications, 10000);
    return () => clearInterval(interval);
  }, []); 

  return (
    <div className="min-h-screen bg-[#F0F9FA] font-sans">
      <div className="bg-[#5dbcd2] p-5 flex items-center gap-4 text-white shadow-sm">
        <button
          onClick={() => navigate("/home_teacher")}
          className="hover:bg-white/20 p-1 rounded-full transition"
        >
          <FiArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-bold">Notifications</h1>
      </div>

      <main className="max-w-7xl mx-auto p-8 flex flex-col md:flex-row gap-8">
        <div className="flex-1">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-700">Recent Updates</h2>
          </div>

          <div className="space-y-4">
            {notifications.length === 0 && (
              <p className="text-gray-400 text-sm">No notifications today</p>
            )}

            {notifications.map((item) => (
              <div
                key={item.id}
                className="bg-white p-5 rounded-2xl shadow-sm border border-transparent hover:border-cyan-100 transition flex items-center justify-between"
              >
                <div className="flex items-center space-x-4">
                  <div className={`p-2 rounded-full ${item.unread ? 'bg-green-100' : 'bg-gray-50'}`}>
                    <svg
                      className={`w-5 h-5 ${item.unread ? 'text-green-500' : 'text-gray-400'}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <p className={`font-semibold ${item.unread ? 'text-gray-800' : 'text-gray-500'}`}>
                      {item.text}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">{item.time}</p>
                  </div>
                </div>

                {item.unread && <div className="w-2.5 h-2.5 bg-cyan-400 rounded-full animate-pulse"></div>}
              </div>
            ))}
          </div>
        </div>

        <aside className="w-full md:w-80 lg:w-96">
          <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-50">
            <h3 className="font-bold text-gray-800 text-lg mb-8">Daily Summary</h3>

            <div className="space-y-8">
              <div>
                <div className="flex justify-between items-end mb-2">
                  <span className="text-gray-400 font-semibold text-sm">Completion Rate</span>
                  <span className="text-cyan-500 font-bold text-2xl">{dailySummary.completion_rate}%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-3">
                  <div
                    className="bg-cyan-300 h-3 rounded-full transition-all duration-1000"
                    style={{ width: `${dailySummary.completion_rate}%` }}
                  />
                </div>
                <p className="text-xs text-gray-400 mt-3 font-medium">
                  {dailySummary.finished_classes} out of {dailySummary.total_classes} classes finished
                </p>
              </div>

              <div className="pt-6 border-t border-gray-100">
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-4">
                  Status Overview
                </p>

                <div className="bg-[#F2FAF5] p-4 rounded-2xl mb-4 flex items-center space-x-4 border border-green-100/50">
                  <div className="text-green-500 bg-white p-1.5 rounded-full shadow-sm">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-green-600 uppercase tracking-tight">
                      Finished Classes
                    </p>
                    <p className="text-xl font-bold text-gray-800">{dailySummary.finished_classes} Classes</p>
                  </div>
                </div>

                <div className="bg-[#FFF9F2] p-4 rounded-2xl flex items-center space-x-4 border border-orange-100/50">
                  <div className="text-orange-400 bg-white p-1.5 rounded-full shadow-sm">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h.01M12 12h.01M19 12h.01" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-orange-600 uppercase tracking-tight">
                      In Progress
                    </p>
                    <p className="text-xl font-bold text-gray-800">{dailySummary.in_progress_classes} Classes</p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </aside>
      </main>
    </div>
  );
};

export default NotificationTeacher;
