import React from 'react';
import { FiArrowLeft, FiMessageSquare, FiUser } from 'react-icons/fi';
import { useNavigate, useParams } from 'react-router-dom';

const ClassDetailsTeacher = () => {
  const navigate = useNavigate();
  const { className } = useParams(); 

  const classDataLookup = {
    'Class XII-RPL': {
      present: 34,
      missing: 2,
      students: [
        { id: 1, name: 'Andi Pratama', nis: '202301' },
        { id: 2, name: 'Budi Santoso', nis: '202302' },
      ],
      leave: []
    },
    'Class XII-AKL 1': {
      present: 34,
      missing: 2,
      students: [
        { id: 3, name: 'Dinda Fakhirah', nis: '202312' },
        { id: 4, name: 'Eko Wahyudi', nis: '202315' },
      ],
      leave: [
        { id: 101, name: 'Kevin Pratama', reason: 'Sick (Flu)', time: '8:15 AM' },
        { id: 102, name: 'Lutfi Hakim', reason: 'Family Permit', time: '6:10 AM' }
      ]
    },
    'Class X-MP': {
      present: 32,
      missing: 4,
      students: [
        { id: 5, name: 'Andra Kurniawan', nis: '202305' },
        { id: 6, name: 'Galih Setiawan', nis: '202319' },
        { id: 7, name: 'Nadia Kumalasari', nis: '202328' },
        { id: 8, name: 'Riskawati', nis: '202332' },
      ],
      leave: [
        { id: 103, name: 'Siti Aminah', reason: 'Sick', time: '7:00 AM' }
      ]
    },
    'Class XII-BD': { present: 36, missing: 0, students: [], leave: [] },
    'Class XI-RPL': { present: 36, missing: 0, students: [], leave: [] },
    'Class XI-AKL 2': { present: 36, missing: 0, students: [], leave: [] },
    'Class XI-ML': { present: 36, missing: 0, students: [], leave: [] },
    'Class X-BR': { present: 36, missing: 0, students: [], leave: [] },
    'Class X-ML': { present: 36, missing: 0, students: [], leave: [] },
    'Class X-BD': { present: 36, missing: 0, students: [], leave: [] },
  };

  const currentData = classDataLookup[className] || {
    present: 0,
    missing: 0,
    students: [],
    leave: []
  };

  return (
    <>
      <style>{`
        body, html { margin: 0; padding: 0; width: 100%; background-color: #f8fdff; font-family: 'Afacad', sans-serif; }
        
        .header-section {
          background-color: #5dbcd2; color: white; padding: 20px 25px;
          display: flex; align-items: center; justify-content: space-between;
          position: sticky; top: 0; z-index: 100;
        }

        .header-left { display: flex; align-items: center; gap: 15px; }
        .back-button { background: transparent; border: none; color: white; cursor: pointer; display: flex; align-items: center; }
        
        .icon-avatar {
          width: 40px; height: 40px; border-radius: 50%;
          background-color: rgba(255, 255, 255, 0.2);
          display: flex; align-items: center; justify-content: center;
          color: white; border: 2px solid rgba(255,255,255,0.4);
        }

        .main-content { padding: 25px; display: grid; grid-template-columns: 1.8fr 1fr; gap: 30px; max-width: 1200px; margin: 0 auto; width: 100%; box-sizing: border-box; }
        @media (max-width: 900px) { .main-content { grid-template-columns: 1fr; } }

        .class-title-card {
          background: white; border-radius: 20px; padding: 25px; display: flex; justify-content: space-between;
          align-items: center; box-shadow: 0 4px 15px rgba(0,0,0,0.02); grid-column: 1 / -1; margin-bottom: 5px;
        }
        .alert-badge { background: #fee2e2; color: #ef4444; padding: 8px 16px; border-radius: 12px; font-weight: 700; font-size: 0.85rem; display: flex; align-items: center; gap: 8px; }

        .section-title { color: #5dbcd2; font-size: 1.1rem; font-weight: 800; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center; }
        
        .student-card { background: #62c3d9; color: white; border-radius: 18px; padding: 15px 20px; display: flex; align-items: center; margin-bottom: 12px; }
        
        .student-details { flex-grow: 1; }
        .student-details h5 { margin: 0; font-size: 1rem; }
        .student-details p { margin: 0; font-size: 0.75rem; opacity: 0.9; }

        .icon-msg-btn { background: rgba(255,255,255,0.25); border: none; color: white; padding: 10px; border-radius: 12px; cursor: pointer; display: flex; }

        .stat-card { background: white; padding: 20px; border-radius: 20px; text-align: center; box-shadow: 0 4px 15px rgba(0,0,0,0.02); }
        .text-present { color: #2dd4bf; font-size: 1.8rem; font-weight: 800; }
        .text-missing { color: #fb7185; font-size: 1.8rem; font-weight: 800; }

        .leave-box { background: white; border-radius: 20px; padding: 20px; box-shadow: 0 4px 15px rgba(0,0,0,0.02); }
        .leave-item { display: flex; align-items: center; gap: 12px; padding: 12px 0; border-bottom: 1px solid #f1f5f9; }
        .leave-item:last-child { border: none; }
        .leave-tag { background: #eff6ff; color: #3b82f6; font-size: 0.65rem; padding: 2px 8px; border-radius: 6px; font-weight: 700; }
      `}</style>

      <div className="app-container">
        <header className="header-section">
          <div className="header-left">
            <button className="back-button" onClick={() => navigate("/presence_teacher")}>
              <FiArrowLeft size={24} />
            </button>
            <h1 style={{margin:0, fontSize:'1.1rem'}}>Class Details</h1>
          </div>
          <div className="icon-avatar">
            <FiUser size={20} />
          </div>
        </header>

        <main className="main-content">
          <div className="class-title-card">
            <h2 style={{margin:0}}>{className || "Select Class"}</h2>
            {currentData.missing > 0 && (
              <div className="alert-badge">⚠️ {currentData.missing} students are still missing</div>
            )}
          </div>

          <section>
            <div className="section-title">
              <span>Attendance List</span>
              <span style={{color:'#94a3b8', fontSize:'0.8rem'}}>Total: {currentData.students.length} people</span>
            </div>
            
            {currentData.students.map((s) => (
              <div key={s.id} className="student-card">
                <div className="icon-avatar" style={{marginRight: '15px', width: '45px', height: '45px'}}>
                  <FiUser size={22} />
                </div>
                <div className="student-details">
                  <h5>{s.name}</h5>
                  <p>NIS : {s.nis}</p>
                </div>
                <button className="icon-msg-btn">
                  <FiMessageSquare size={18} />
                </button>
              </div>
            ))}
          </section>

          <aside>
            <h3 style={{color:'#5dbcd2', fontSize:'1rem', marginBottom:'15px'}}>Class Stats</h3>
            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'15px', marginBottom:'30px'}}>
              <div className="stat-card">
                <span style={{fontSize:'0.7rem', color:'#94a3b8', fontWeight: 800}}>PRESENT</span>
                <div className="text-present">{currentData.present}</div>
              </div>
              <div className="stat-card">
                <span style={{fontSize:'0.7rem', color:'#94a3b8', fontWeight: 800}}>MISSING</span>
                <div className="text-missing">{currentData.missing}</div>
              </div>
            </div>

            <h3 style={{color:'#5dbcd2', fontSize:'1rem', marginBottom:'15px'}}>📁 Sick / On Leave</h3>
            <div className="leave-box">
              {currentData.leave.length > 0 ? (
                currentData.leave.map((l) => (
                  <div key={l.id} className="leave-item">
                    <div className="icon-avatar" style={{width:'35px', height:'35px', backgroundColor: '#f1f5f9', color: '#94a3b8', border: 'none'}}>
                      <FiUser size={16} />
                    </div>
                    <div style={{flexGrow:1}}>
                      <p style={{margin:0, fontSize:'0.9rem', fontWeight:700, color: '#334155'}}>{l.name}</p>
                      <span className="leave-tag">{l.reason}</span>
                    </div>
                    <div style={{fontSize:'0.7rem', color:'#cbd5e1'}}>{l.time}</div>
                  </div>
                ))
              ) : (
                <p style={{color: '#94a3b8', fontSize: '0.85rem', textAlign: 'center'}}>No one is on leave.</p>
              )}
            </div>
          </aside>
        </main>
      </div>
    </>
  );
};

export default ClassDetailsTeacher;