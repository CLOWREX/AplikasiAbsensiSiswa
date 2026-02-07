import React, { useEffect, useState } from 'react';
import { FiArrowLeft } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const NotificationStudent = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [summary, setSummary] = useState({ on_time: 0, late: 0, alpha: 0 });

  const getTypeStyles = (type) => {
    switch (type) {
      case 'alpha': return { bg: 'bg-red-50', text: 'text-red-500', border: 'border-l-4 border-red-500', dot: 'bg-red-500' };
      case 'late': return { bg: 'bg-orange-50', text: 'text-orange-500', border: '', dot: 'bg-orange-500' };
      default: return { bg: 'bg-green-50', text: 'text-green-500', border: '', dot: 'bg-green-500' };
    }
  };

  const fetchData = async () => {
    try {
      const resNotif = await axios.get('http://localhost:8001/student/notifications', { withCredentials: true });
      console.log("Data Notif:", resNotif.data);
      setNotifications(resNotif.data);

      const resSum = await axios.get('http://localhost:8001/student/monthly-summary', { withCredentials: true });
      console.log("Data Summary:", resSum.data);
      setSummary(resSum.data);
    } catch (err) {
      console.error("Gagal ambil data:", err.response);
    }
  };

  useEffect(() => { fetchData(); }, []);

  return (
    <div className="min-h-screen bg-[#F0F9FA] font-sans">
      <div className="bg-[#5dbcd2] p-5 flex items-center gap-4 text-white shadow-md">
        <button onClick={() => navigate("/home")} className="hover:bg-white/20 p-1 rounded-full"><FiArrowLeft size={24} /></button>
        <h1 className="text-xl font-bold">Notifications</h1>
      </div>

      <main className="max-w-6xl mx-auto p-8 flex flex-col md:flex-row gap-8 items-start">
        {/* NOTIFICATIONS LIST */}
        <div className="flex-1 w-full">
          <h2 className="text-lg font-bold text-gray-700 mb-6">Recent Updates</h2>
          <div className="space-y-4">
            {notifications.map((item) => {
              const styles = getTypeStyles(item.type);
              return (
                <div key={item.id} className={`bg-white p-5 rounded-2xl shadow-sm flex items-center justify-between border border-gray-50 ${styles.border}`}>
                  <div className="flex items-center space-x-4">
                    <div className={`${styles.bg} p-2.5 rounded-full`}>
                      <svg className={`w-5 h-5 ${styles.text}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {item.type === 'alpha' ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        : item.type === 'late' ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />}
                      </svg>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">{item.text}</p>
                      <p className={`text-xs mt-1 font-medium ${styles.text}`}>{item.time}</p>
                    </div>
                  </div>
                  {item.unread && <div className={`w-2 h-2 rounded-full ${styles.dot}`} />}
                </div>
              );
            })}
          </div>
        </div>

        {/* ATTENDANCE SUMMARY SIDEBAR */}
        <aside className="w-full md:w-80 md:sticky md:top-8">
          <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-gray-700 mb-6">Monthly Attendance</h2>
            <div className="space-y-4">
              <SummaryCard label="On Time" count={summary.on_time} color="#10B981" bg="#EFFFF6" darkColor="#065F46" />
              <SummaryCard label="Late" count={summary.late} color="#F97316" bg="#FFF7ED" darkColor="#9A3412" />
              <SummaryCard label="Alpha" count={summary.alpha} color="#EF4444" bg="#FFF1F2" darkColor="#9F1239" isAlpha />
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
};

const SummaryCard = ({ label, count, color, bg, darkColor, isAlpha }) => (
  <div style={{ backgroundColor: bg }} className="p-5 rounded-[1.8rem] flex items-center space-x-4">
    <div style={{ borderColor: color, color: color }} className="flex items-center justify-center w-10 h-10 rounded-full border-2 bg-transparent">
      {isAlpha ? <span className="text-xl font-bold">!</span> : 
       label === "Late" ? <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" strokeWidth="2.5" /></svg> :
       <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" strokeWidth="3" /></svg>}
    </div>
    <div>
      <p style={{ color: color }} className="text-xs font-bold uppercase tracking-wide opacity-80">{label}</p>
      <p style={{ color: darkColor }} className="text-xl font-bold">{count} {count > 1 ? 'Times' : 'Time'}</p>
    </div>
  </div>
);

export default NotificationStudent;