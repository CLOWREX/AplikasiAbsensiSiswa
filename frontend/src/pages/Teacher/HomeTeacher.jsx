import React, { useState } from 'react'; 
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { FiMenu, FiGrid } from 'react-icons/fi';
import Sidebar from './SidebarTeacher'; 

const FeaturesGrid = ({ features }) => (
  <section className="px-2 pb-12">
    <div className="flex items-center gap-3 mb-8">
      <div className="p-2 bg-white rounded-lg shadow-sm">
        <FiGrid className="text-2xl text-[#5dbcd2]" />
      </div>
      <h3 className="text-2xl sm:text-3xl font-black text-[#5dbcd2]">Features</h3>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
      {features.map((f, i) => <FeatureCard key={i} {...f} />)}
    </div>
  </section>
);

const Hero = ({ fullName, onMenuOpen }) => {
  const navigate = useNavigate();

  return (
    <section className="pt-8 md:pt-12 mb-8">
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col">
          <div className="flex items-center gap-3 lg:hidden mb-2">
            <button onClick={onMenuOpen} className="p-5 min-w-[35px] min-h-[35px] flex items-center justify-center text-[#5dbcd2] bg-white rounded-xl shadow-sm border border-gray-100">
              <FiMenu size={20}/>
            </button>
            <span className="text-[#5dbcd2] font-black">Menu</span>
          </div>

          <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-[#5dbcd2] tracking-tight">
            Hi {fullName ? fullName : "…"}!
          </h2>

          <p className="text-[#899ca9] text-sm sm:text-lg font-bold mt-2">
            Good Morning, hope you have a great day.
          </p>
        </div>

        <button
          onClick={() => navigate("/generate_teacher")}
          className="group flex flex-col items-center gap-2 shrink-0"
        >
          <div className="w-14 h-14 sm:w-16 sm:h-16 bg-[#5dbcd2] rounded-[1.5rem] flex items-center justify-center text-white shadow-lg active:scale-90 transition-all">
            <img src="/qr-scan.png" className="w-1/2 h-1/2 brightness-0 invert" alt="Scan" />
          </div>
          <span className="text-[10px] sm:text-xs font-black text-[#5dbcd2] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
            Scan QR
          </span>
        </button>

      </div>
    </section>
  );
};

const WelcomeBanner = () => (
  <div className="bg-white/80 rounded-[2.5rem] p-6 sm:p-10 shadow-lg flex flex-col sm:flex-row gap-6 items-center justify-between border border-white/60 mb-12">
    <div className="flex-1 text-center sm:text-left">
      <h3 className="text-xl sm:text-3xl font-black text-[#5dbcd2] mb-3">Welcome Back!</h3>
      <p className="text-[#899ca9] text-sm sm:text-lg font-bold italic max-w-lg leading-snug">
        "Ready to learn? Let's scan your QR and start your journey today!"
      </p>
    </div>
    <div className="w-24 h-24 sm:w-32 md:w-40 bg-[#fdf5ed] rounded-[2rem] flex items-center justify-center shrink-0">
      <img src="https://img.freepik.com/free-vector/work-from-home-concept-illustration_114360-2026.jpg" className="w-full h-full object-contain p-2" alt="Art" />
    </div>
  </div>
);

const FeatureCard = ({ title, description, buttonText, image, accent, path }) => {
  const navigate = useNavigate();
  return (
    <div className={`bg-white rounded-[2.5rem] p-6 sm:p-8 shadow-md flex flex-col sm:flex-row gap-6 border border-transparent hover:border-[#5dbcd2]/20 transition-all ${accent || ""}`}>
      <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-3xl bg-[#f4f7f8] flex-shrink-0 flex items-center justify-center p-4">
        <img src={image} className="w-full h-full object-contain opacity-80" alt={title} />
      </div>
      <div className="flex-1">
        <h4 className="text-xl sm:text-3xl font-black text-[#5dbcd2] mb-1">{title}</h4>
        <p className="text-[#899ca9] text-sm sm:text-base font-bold mb-4 leading-tight">{description}</p>
        <button 
            onClick={() => navigate(path)}
            style={{ padding: '5px 15px', minWidth: 'max-content' }} 
          className="bg-[#5dbcd2] text-white rounded-full font-black text-[14px] shadow-md active:scale-95 transition-transform whitespace-nowrap">
          {buttonText}
        </button>
      </div>
    </div>
  );
};

export default function Home() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center text-[#5dbcd2] font-black">
        Loading...
      </div>
    );
  }
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const features = [
      { title: "Presence", description: "Track students who haven't checked in.", buttonText: "Check Attendance", path: "/presence_teacher", image: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png" },
      { title: "Register", description: "Create a new student account and enter their details.", buttonText: "New Register", path: "/register_teacher", image: "https://cdn-icons-png.flaticon.com/512/2693/2693507.png" },
      { title: "Manage Data", description: "View and manage student schedule records.", buttonText: "Open Data", path: "/data_teacher", image: "https://cdn-icons-png.flaticon.com/512/1048/1048953.png" },
      { title: "Profile", description: "Keep your personal information up to date.", buttonText: "View Profile", path: "/profile_teacher", image: "https://cdn-icons-png.flaticon.com/512/3135/3135768.png", accent: "bg-[#fdf2e9]/60" }
  ];

  return (
    <div className="flex min-h-screen bg-[#D6EBEE] font-['Afacad']">
      <div className="lg:hidden">
        <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      </div>

      <main className="flex-1 w-full max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 overflow-y-auto h-screen scrollbar-hide">
        <Hero 
          fullName={user?.fullName} 
          onMenuOpen={() => setIsSidebarOpen(true)} 
        />
        <WelcomeBanner />
        <FeaturesGrid features={features} />
      </main>
    </div>
  );
}

