import React, { useState, useEffect } from 'react';
import { FiArrowLeft, FiUser } from 'react-icons/fi';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const ClassDetailsTeacher = () => {
  const navigate = useNavigate();
  const { className } = useParams(); 

  const [data, setData] = useState({
    present: 0,
    missing: 0,
    alpha: 0,
    sick: 0,
    permission: 0,
    leave: [],
    missingStudents: []
  });

  const [alphaModal, setAlphaModal] = useState({ open: false, studentId: null, studentName: "" });

  const openAlphaModal = (id, name) => setAlphaModal({ open: true, studentId: id, studentName: name });
  const closeAlphaModal = () => setAlphaModal({ open: false, studentId: null, studentName: "" });

  const confirmAlpha = async () => {
    try {
      await axios.post(
        `http://192.168.100.102:8004/teacher/alpha/${alphaModal.studentId}`,
        {},
        { withCredentials: true }
      );

      setData(prev => ({
        ...prev,
        alpha: prev.alpha + 1,
        missing: prev.missing - 1,
        missingStudents: prev.missingStudents.filter(s => s.id !== alphaModal.studentId)
      }));

      closeAlphaModal();
    } catch(err) {
      alert(err.response?.data?.detail || "Failed to mark alpha");
    }
  };

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res = await axios.get(
          `http://192.168.100.102:8004/teacher/class-details/${className}`,
          { withCredentials: true }
        );

        const raw = res.data;
        const presentStudents = raw.present || [];
        const missingStudents = raw.missing || [];

        const sickStudents = presentStudents.filter(s => s.status?.toLowerCase() === "sick");
        const permissionStudents = presentStudents.filter(s => s.status?.toLowerCase() === "permission");
        const alphaStudents = presentStudents.filter(s => s.status?.toLowerCase() === "alpha");
        const hadirStudents = presentStudents.filter(s => s.status?.toLowerCase() === "present");

        setData({
          present: hadirStudents.length,
          sick: sickStudents.length,
          permission: permissionStudents.length,
          alpha: alphaStudents.length,
          missing: missingStudents.length,
          missingStudents: missingStudents.map(s => ({
            id: s.id,
            name: s.fullName,
            username: s.username
          })),
          leave: [...sickStudents, ...permissionStudents]
        });

      } catch (err) {
        console.error("Error fetching class details", err);
      }
    };

    fetchDetails();
  }, [className]);

  return (
    <>
      <style>{`
        body, html { margin: 0; padding: 0; width: 100%; background-color: #f8fdff; font-family: 'Afacad', sans-serif; }
        .header-section { background-color: #5dbcd2; color: white; padding: 20px 25px; display: flex; align-items: center; justify-content: space-between; position: sticky; top: 0; z-index: 100; }
        .header-left { display: flex; align-items: center; gap: 15px; }
        .back-button { background: transparent; border: none; color: white; cursor: pointer; display: flex; align-items: center; }
        .icon-avatar { width: 40px; height: 40px; border-radius: 50%; background-color: rgba(255, 255, 255, 0.2); display: flex; align-items: center; justify-content: center; color: white; border: 2px solid rgba(255,255,255,0.4); }
        .main-content { padding: 25px; display: grid; grid-template-columns: 1.8fr 1fr; gap: 30px; max-width: 1200px; margin: 0 auto; width: 100%; box-sizing: border-box; }
        @media (max-width: 900px) { .main-content { grid-template-columns: 1fr; } }
        .class-title-card { background: white; border-radius: 20px; padding: 25px; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 4px 15px rgba(0,0,0,0.02); grid-column: 1 / -1; margin-bottom: 5px; }
        .alert-badge { background: #fee2e2; color: #ef4444; padding: 8px 16px; border-radius: 12px; font-weight: 700; font-size: 0.85rem; display: flex; align-items: center; gap: 8px; }
        .section-title { color: #5dbcd2; font-size: 1.1rem; font-weight: 800; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center; }
        .student-card { background: #62c3d9; color: white; border-radius: 18px; padding: 15px 20px; display: flex; align-items: center; margin-bottom: 12px; }
        .student-details { flex-grow: 1; }
        .student-details h5 { margin: 0; font-size: 1rem; }
        .student-details p { margin: 0; font-size: 0.75rem; opacity: 0.9; }
        .stat-card { background: white; padding: 20px; border-radius: 20px; text-align: center; box-shadow: 0 4px 15px rgba(0,0,0,0.02); }
        .text-present { color: #2dd4bf; font-size: 1.8rem; font-weight: 800; }
        .text-missing { color: #fb7185; font-size: 1.8rem; font-weight: 800; }
        .leave-box { background: white; border-radius: 20px; padding: 20px; box-shadow: 0 4px 15px rgba(0,0,0,0.02); }
        .leave-item { display: flex; align-items: center; gap: 12px; padding: 12px 0; border-bottom: 1px solid #f1f5f9; }
        .leave-tag { background: #eff6ff; color: #3b82f6; font-size: 0.65rem; padding: 2px 8px; border-radius: 6px; font-weight: 700; }
        .no-missing { color: #94a3b8; font-size: 0.85rem; text-align: center; margin-top: 15px; }
      `}</style>

      <div className="app-container">
        <header className="header-section">
          <div className="header-left">
            <button className="back-button" onClick={() => navigate("/presence_teacher")}>
              <FiArrowLeft size={24} />
            </button>
            <h1 style={{margin:0, fontSize:'1.1rem'}}>Class Details</h1>
          </div>
        </header>

        <main className="main-content">
          <div className="class-title-card">
            <h2 style={{margin:0}}>{className}</h2>
            {data.missing > 0 && (
              <div className="alert-badge">⚠️ {data.missing} students are still missing</div>
            )}
          </div>

          <section>
            <div className="section-title">
              <span>Attendance List</span>
              <span style={{color:'#94a3b8', fontSize:'0.8rem'}}>
                Total: {data.missingStudents.length} people
              </span>
            </div>

            {data.missingStudents.length > 0 ? (
              data.missingStudents.map(s => (
                <div key={s.id} className="student-card">
                  <div className="icon-avatar" style={{ marginRight: 15 }}>
                    <FiUser size={22} />
                  </div>

                  <div className="student-details">
                    <h5>{s.name}</h5>
                    <p>NIS : {s.username}</p>
                    <small>Status: Missing</small>
                  </div>

                  <button
                    onClick={() => openAlphaModal(s.id, s.name)}
                    style={{
                      background: '#f56767',
                      border: 'none',
                      color: 'white',
                      padding: '8px 14px',
                      borderRadius: '10px',
                      fontSize: '0.7rem',
                      fontWeight: 800,
                      cursor: 'pointer'
                    }}
                  >
                    ALPHA
                  </button>
                </div>
              ))
            ) : (
              <p className="no-missing">No students are missing.</p>
            )}
          </section>

          <aside>
            <h3 style={{color:'#5dbcd2', fontSize:'1rem', marginBottom:'15px'}}>
              Class Stats
            </h3>

            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'15px', marginBottom:'30px'}}>
              <div className="stat-card">
                <span style={{fontSize:'0.7rem', color:'#94a3b8', fontWeight:800}}>PRESENT</span>
                <div className="text-present">{data.present}</div>
              </div>

              <div className="stat-card">
                <span style={{fontSize:'0.7rem', color:'#94a3b8', fontWeight:800}}>MISSING</span>
                <div className="text-missing">{data.missing}</div>
              </div>

              <div className="stat-card">
                <span style={{fontSize:'0.7rem', color:'#3b82f6', fontWeight:800}}>SICK</span>
                <div style={{fontSize:'1.8rem', fontWeight:800, color:'#3b82f6'}}>
                  {data.sick}
                </div>
              </div>

              <div className="stat-card">
                <span style={{fontSize:'0.7rem', color:'#6366f1', fontWeight:800}}>PERMISSION</span>
                <div style={{fontSize:'1.8rem', fontWeight:800, color:'#6366f1'}}>
                  {data.permission}
                </div>
              </div>

              <div className="stat-card" style={{ gridColumn: 'span 2' }}>
                <span style={{fontSize:'0.7rem', color:'#ef4444', fontWeight:800}}>ALPHA</span>
                <div style={{fontSize:'1.8rem', fontWeight:800, color:'#ef4444'}}>
                  {data.alpha}
                </div>
              </div>
            </div>

            <h3 style={{color:'#5dbcd2', fontSize:'1rem', marginBottom:'15px'}}>
              📁 Sick / On Leave
            </h3>

            <div className="leave-box">
              {data.leave.length > 0 ? data.leave.map(l => (
                <div key={l.id} className="leave-item">
                  <div className="icon-avatar" style={{width:'35px', height:'35px', backgroundColor:'#f1f5f9', color:'#94a3b8', border:'none'}}>
                    <FiUser size={16} />
                  </div>
                  <div style={{ flexGrow: 1 }}>
                    <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: 700, color: '#334155' }}>
                      {l.user?.fullName}
                    </p>

                    <div style={{ display: 'flex', gap: '6px', marginTop: '4px' }}>
                      <span className="leave-tag">{l.status}</span>

                      <span
                        style={{
                          fontSize: '0.65rem',
                          background: '#f1f5f9',
                          color: '#64748b',
                          padding: '2px 8px',
                          borderRadius: '6px',
                          fontWeight: 600
                        }}
                      >
                        {l.explanation && l.explanation.trim() !== "" ? l.explanation : "-"}
                      </span>
                    </div>
                  </div>
                  <div style={{fontSize:'0.7rem', color:'#cbd5e1'}}>
                    {l.time}
                  </div>
                </div>
              )) : (
                <p style={{color:'#94a3b8', fontSize:'0.85rem', textAlign:'center'}}>
                  No one is on leave.
                </p>
              )}
            </div>
          </aside>
        </main>

        {alphaModal.open && (
          <div className="modal-overlay" style={{
            position:'fixed', top:0,left:0,right:0,bottom:0,
            background:'rgba(0,0,0,0.5)', display:'flex', justifyContent:'center', alignItems:'center'
          }}>
            <div className="modal-content" style={{background:'white', padding:'20px', borderRadius:'15px', minWidth:'250px'}}>
              <p>Mark {alphaModal.studentName} as ALPHA?</p>
              <div style={{display:'flex', justifyContent:'space-between', marginTop:'15px'}}>
                <button onClick={confirmAlpha} style={{background:'#ef4444', color:'white', border:'none', padding:'5px 15px', borderRadius:'8px'}}>Yes</button>
                <button onClick={closeAlphaModal} style={{background:'#94a3b8', color:'white', border:'none', padding:'5px 15px', borderRadius:'8px'}}>Cancel</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ClassDetailsTeacher;