import React, { useState } from 'react';
import { FiArrowLeft } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const RegisterTeacher = () => {
  const navigate = useNavigate();
  
  // State untuk menampung input form
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    nis: "",
    className: "",
    phone: "",
    password: ""
  });

  const handleRegister = (e) => {
    e.preventDefault();
    
    // 1. Ambil database user dari localStorage
    const existingUsers = JSON.parse(localStorage.getItem("users") || "[]");

    // 2. Validasi: Cek apakah username sudah dipakai
    const isUserExist = existingUsers.some(user => user.username === formData.username);
    if (isUserExist) {
      alert("Username ini sudah terdaftar! Gunakan username lain.");
      return;
    }

    // 3. LOGIKA KUNCI: Paksa role menjadi 'student'
    const newUser = { 
      ...formData, 
      role: 'student', // Dikunci ke student
      createdAt: new Date().toISOString()
    };
    
    // 4. Simpan ke database lokal
    localStorage.setItem("users", JSON.stringify([...existingUsers, newUser]));

    alert(`Akun Siswa: ${formData.fullName} berhasil dibuat!`);
    
    // 5. Setelah berhasil, balik ke Home (atau list user)
    navigate("/home");
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#eaf6fb] font-['Afacad']">
      
      {/* HEADER */}
      <div className="bg-[#5dbcd2] py-5 px-5 flex items-center gap-4 text-white shadow-sm">
        <button 
          onClick={() => navigate("/home")} 
          className="hover:bg-white/20 p-1 rounded-full transition flex items-center gap-1 active:scale-90"
        >
          <FiArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-bold">Register Student</h1>
      </div>

      <div className="flex-1 flex items-center justify-center px-6">
        {/* CONTAINER FORM */}
        <div className="w-full max-w-[700px] bg-white rounded-[2.5rem] shadow-xl overflow-hidden p-4 md:p-8 mt-6 mb-6 border border-white">
            
            <div className="mb-10 text-center">
              <h2 className="text-3xl font-black text-[#5dbcd2] mb-1">Add New Student</h2>
              <p className="text-[#899ca9] font-bold">Create a dedicated account for student attendance.</p>
            </div>

            <form className="space-y-5" onSubmit={handleRegister}>
              <input 
                required
                type="text" 
                placeholder="Full Name" 
                value={formData.fullName}
                onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                className="w-full !mb-[20px] bg-white border-2 border-gray-100 rounded-2xl px-6 py-4 outline-none focus:border-[#5dbcd2] font-bold text-gray-600 placeholder:text-blue-200 shadow-sm transition-all"
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <input 
                  required
                  type="text" 
                  placeholder="Username" 
                  value={formData.username}
                  onChange={(e) => setFormData({...formData, username: e.target.value})}
                  className="w-full bg-white border-2 border-gray-100 rounded-2xl px-6 py-4 outline-none focus:border-[#5dbcd2] font-bold text-gray-600 placeholder:text-blue-200 shadow-sm transition-all"
                />
                <input 
                  required
                  type="text" 
                  placeholder="NIS" 
                  value={formData.nis}
                  onChange={(e) => setFormData({...formData, nis: e.target.value})}
                  className="w-full bg-white border-2 border-gray-100 rounded-2xl px-6 py-4 outline-none focus:border-[#5dbcd2] font-bold text-gray-600 placeholder:text-blue-200 shadow-sm transition-all"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <input 
                  required
                  type="text" 
                  placeholder="Class (e.g. XI-RPL)" 
                  value={formData.className}
                  onChange={(e) => setFormData({...formData, className: e.target.value})}
                  className="w-full bg-white border-2 border-gray-100 rounded-2xl px-6 py-4 outline-none focus:border-[#5dbcd2] font-bold text-gray-600 placeholder:text-blue-200 shadow-sm transition-all"
                />
                <input 
                  required
                  type="text" 
                  placeholder="Phone Number" 
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full bg-white border-2 border-gray-100 rounded-2xl px-6 py-4 outline-none focus:border-[#5dbcd2] font-bold text-gray-600 placeholder:text-blue-200 shadow-sm transition-all"
                />
              </div>

              <input 
                required
                type="password" 
                placeholder="Create Password" 
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className="w-full !mb-[35px] bg-white border-2 border-gray-100 rounded-2xl px-6 py-4 outline-none focus:border-[#5dbcd2] font-bold text-gray-600 placeholder:text-blue-200 shadow-sm transition-all"
              />

              {/* REGISTER BUTTON */}
              <button 
                type="submit"
                className="w-full h-[60px] bg-[#5dbcd2] text-white rounded-[1.5rem] font-black text-xl shadow-lg shadow-blue-100 hover:brightness-105 active:scale-[0.97] transition-all mt-8"
              >
                Register Student Account
              </button>
            </form>

        </div>
      </div>
    </div>
  );
};

export default RegisterTeacher;