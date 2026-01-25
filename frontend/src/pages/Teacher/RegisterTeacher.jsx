import React from 'react';
import { FiArrowLeft } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const RegisterTeacher = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen bg-[#eaf6fb] font-['Afacad']">
      
        <div className="bg-[#5dbcd2] py-6 px-5 flex items-center gap-4 text-white shadow-sm">
        <button 
          onClick={() => navigate("/home")} 
          className="hover:bg-white/20 p-1 rounded-full transition flex items-center gap-1">
          <FiArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-bold">Register</h1>
      </div>

      <div className="flex-1 flex items-center justify-center px-6">
        <div className="w-[700px] bg-white rounded-3xl shadow-xl overflow-hidden p-6 md:p-10 mt-13 mb-13">
            
            <div className="mb-10 text-center">
            <h2 className="text-3xl font-black text-[#5dbcd2] mb-1">Add new student account</h2>
            <p className="text-[#899ca9] font-bold">Fill in the details to create a student attendance account.</p>
            </div>

            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            <input 
                type="text" 
                placeholder="Full Name" 
                className="w-full !mb-[20px] bg-white border-2 border-gray-100 rounded-2xl px-6 py-4 outline-none focus:border-[#5dbcd2] font-bold text-gray-600 placeholder:text-blue-200 shadow-sm"
            />
            
            <input 
                type="text" 
                placeholder="Username" 
                className="w-full !mb-[20px] bg-white border-2 border-gray-100 rounded-2xl px-6 py-4 outline-none focus:border-[#5dbcd2] font-bold text-gray-600 placeholder:text-blue-200 shadow-sm"
            />

            <input 
                type="text" 
                placeholder="NIS" 
                className="w-full !mb-[20px] bg-white border-2 border-gray-100 rounded-2xl px-6 py-4 outline-none focus:border-[#5dbcd2] font-bold text-gray-600 placeholder:text-blue-200 shadow-sm"
            />

            <input 
                type="text" 
                placeholder="Class" 
                className="w-full !mb-[20px] bg-white border-2 border-gray-100 rounded-2xl px-6 py-4 outline-none focus:border-[#5dbcd2] font-bold text-gray-600 placeholder:text-blue-200 shadow-sm"
            />

            <input 
                type="text" 
                placeholder="Phone Number" 
                className="w-full !mb-[20px] bg-white border-2 border-gray-100 rounded-2xl px-6 py-4 outline-none focus:border-[#5dbcd2] font-bold text-gray-600 placeholder:text-blue-200 shadow-sm"
            />

            <input 
                type="text" 
                placeholder="Password" 
                className="w-full !mb-[65px] bg-white border-2 border-gray-100 rounded-2xl px-6 py-4 outline-none focus:border-[#5dbcd2] font-bold text-gray-600 placeholder:text-blue-200 shadow-sm"
            />

            <button className="w-full h-[50px] bg-[#5dbcd2] text-white rounded-2xl font-black text-lg shadow-lg shadow-blue-200 hover:scale-[1.01] active:scale-95 transition-all mt-6">
                Register
            </button>
            </form>

        </div>
        </div>
    </div>
  );
};

export default RegisterTeacher;
