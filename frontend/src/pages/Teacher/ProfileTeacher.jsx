import React from 'react';
import { FiArrowLeft, FiUser, FiHash, FiPhone, FiLock } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const ProfileTeacher = () => {
  const navigate = useNavigate();

  const profileData = [
    { label: 'Name', value: 'Nurul Asfiyah', icon: <FiUser /> },
    { label: 'NIP', value: '199508042023212017', icon: <FiHash /> },
    { label: 'Phone', value: '085772419227', icon: <FiPhone /> },
    { label: 'Password', value: '123456', icon: <FiLock /> },
  ];

  return (
    <div className="flex-1 flex flex-col h-screen bg-[#eaf6fb] font-['Afacad']">
      <div className="bg-[#5dbcd2] p-5 flex items-center gap-4 text-white shadow-sm">
        <button 
          onClick={() => navigate("/home")} 
          className="hover:bg-white/20 p-1 rounded-full transition">
          <FiArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-bold">Profile Details</h1>
      </div>

      <div className="p-6 md:p-10 flex-1 overflow-y-auto flex justify-center items-start">
        <div className="w-full max-w-2xl bg-white rounded-[3rem] shadow-xl shadow-blue-200/50 p-8 md:p-12 border border-white">
          
          <div className="flex flex-col items-center">
            <div className="relative mb-8">
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-[#f8fafb] border-4 border-[#5dbcd2]/20 shadow-inner overflow-hidden flex items-center justify-center">
                <img 
                  src="https://cdn-icons-png.flaticon.com/512/12804/12804391.png" 
                  alt="Profile" 
                  className="w-full h-full object-cover p-2"
                />
              </div>
            </div>

            <div className="text-center mb-10">
              <h2 className="text-2xl font-black text-gray-800">Teacher Profile</h2>
              <p className="text-[#899ca9] font-bold">Personal information details</p>
            </div>

            <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
              {profileData.map((item, index) => (
                <div 
                  key={index} 
                  className={`bg-[#f8fafb] border-2 border-gray-50 rounded-2xl p-4 flex items-center gap-4 transition-all hover:border-[#5dbcd2]/30 ${
                    index === 0 ? "md:col-span-2" : "" 
                  }`}>
                  <div className="text-[#5dbcd2] text-xl">
                    {item.icon}
                  </div>
                  
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase tracking-widest font-black text-[#899ca9]">
                      {item.label}
                    </span>
                    <span className="text-[#5dbcd2] font-bold text-lg leading-tight">
                      {item.value}
                    </span>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileTeacher;