import React, { useState, useEffect } from 'react';
import { FiArrowLeft, FiSearch } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const PresenceTeacher = () => {
  const [search, setSearch] = useState('');
  const [classes, setClasses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res = await axios.get('http://192.168.100.102:8004/teacher/classes-summary', { withCredentials: true });
        
        const dataWithStatus = res.data.map(c => ({
          ...c,
          status:
            c.missing <= 0
              ? 'Everyone has checked in'
              : `${c.missing} students are still missing`
        }));

        setClasses(dataWithStatus);
      } catch (err) {
        console.error('Failed to fetch classes', err);
      }
    };

    fetchClasses();
  }, []);

  const filteredClasses = classes.filter(item =>
    item.name.toLowerCase().includes(search.toLowerCase()) ||
    item.status.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <style>{`
        body, html { margin: 0; padding: 0; width: 100%; background-color: #f8fdff; }
        .app-container { font-family: 'Afacad', sans-serif; width: 100%; min-height: 100vh; display: flex; flex-direction: column; }
        .header-section { background-color: #5dbcd2; color: white; padding: 20px; display: flex; align-items: center; gap: 16px; position: sticky; top: 0; z-index: 100; box-shadow: 0 2px 10px rgba(0,0,0,0.05); }
        .back-button { background: transparent; border: none; color: white; cursor: pointer; display: flex; align-items: center; }
        .header-title { font-size: 1.25rem; font-weight: 700; margin: 0; }
        .content-body { padding: 25px; display: flex; flex-direction: column; align-items: center; }
        .search-group { position: relative; margin-bottom: 25px; width: 100%; max-width: 950px; display: flex; align-items: center; }
        .search-input-custom { width: 100%; background-color: white; border: 2px solid #f1f5f9; border-radius: 9999px; padding: 16px 24px 16px 56px; outline: none; transition: all 0.3s ease; font-weight: 600; color: #4b5563; font-size: 1rem; box-shadow: 0 4px 12px rgba(0,0,0,0.03); }
        .section-label { color: #899ca9; font-weight: 800; margin-bottom: 15px; font-size: 0.8rem; text-transform: uppercase; width: 100%; max-width: 950px; letter-spacing: 1.5px; }
        .class-list-container { width: 100%; display: flex; flex-direction: column; gap: 12px; align-items: center; padding-bottom: 40px; }
        .class-card { background-color: #62c3d9; border-radius: 20px; padding: 20px; display: flex; align-items: center; cursor: pointer; transition: all 0.2s ease; color: white; width: 100%; max-width: 950px; box-sizing: border-box; }
        .class-card:hover { background-color: #55b1c5; transform: translateY(-2px); }
        .avatar-box { background-color: rgba(255, 255, 255, 0.25); border-radius: 14px; min-width: 50px; height: 50px; display: flex; align-items: center; justify-content: center; margin-right: 15px; }
        .name-text { font-weight: 700; font-size: 1.1rem; margin: 0; }
        .status-line { font-size: 0.85rem; margin-top: 4px; display: flex; align-items: center; opacity: 0.95; }
        .indicator { height: 8px; width: 8px; border-radius: 50%; margin-right: 8px; }
        .bg-green { background-color: #4ade80; }
        .bg-red { background-color: #fca5a5; }
        .arrow-right { border: solid rgba(255,255,255,0.7); border-width: 0 3px 3px 0; padding: 3px; transform: rotate(-45deg); margin-left: 10px; }
      `}</style>

      <div className="app-container">
        <div className="header-section">
          <button className="back-button" onClick={() => navigate("/home_teacher")}><FiArrowLeft size={24} /></button>
          <h1 className="header-title">Presence</h1>
        </div>

        <div className="content-body">
          <div className="search-group">
            <FiSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-[#5dbcd2] text-xl z-10" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by class..."
              className="w-full bg-white border-2 border-white rounded-full py-4 !pl-14 pr-6 outline-none focus:border-[#5dbcd2] shadow-sm transition-all font-semibold text-gray-600"
            />
          </div>

          <h3 className="section-label">Active Classes</h3>

          <div className="class-list-container">
            {filteredClasses.map((item) => (
              <div key={item.name} className="class-card" onClick={() => navigate(`/class_details/${item.name}`)}>
                <div className="avatar-box">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
                  </svg>
                </div>
                <div style={{ flexGrow: 1 }}>
                  <p className="name-text">{item.name}</p>
                  <div className="status-line">
                    <span className={`indicator ${item.missing === 0 ? 'bg-green' : 'bg-red'}`}></span>
                    {item.status}
                  </div>
                </div>
                <div className="arrow-right"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default PresenceTeacher;
