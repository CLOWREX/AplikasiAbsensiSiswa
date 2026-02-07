import React, { useState } from 'react';
import { useAuth } from "../../context/AuthContext";
import { FiHome, FiCheckSquare, FiClock, FiUser, FiLogOut, FiBell, FiGrid, FiX, FiCalendar } from 'react-icons/fi';
import { useNavigate, useLocation } from 'react-router-dom';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const menuItems = [
    { name: 'Home', icon: <FiHome />, path: '/home' },
    { name: 'Presence', icon: <FiCheckSquare />, path: '/presence' },
    { name: 'History', icon: <FiClock />, path: '/history' },
    { name: 'Schedule', icon: <FiCalendar />, path: '/schedule' },
    { name: 'Profile', icon: <FiUser />, path: '/profile' },
    { name: 'Notification', icon: <FiBell />, path: '/notifications' },
  ];

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[60] lg:hidden" 
          onClick={() => setIsOpen(false)} 
        />
      )}

      <aside className={`fixed lg:sticky top-0 left-0 h-screen bg-white border-r border-gray-100 shadow-sm z-[70] transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} w-64 flex flex-col`}>
        <div className="flex items-center justify-between px-6 py-8">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[#5dbcd2] rounded-lg flex items-center justify-center p-1.5 text-white">
               <FiGrid size={20} />
            </div>
            <span className="text-xl font-black text-[#5dbcd2]">QRLog</span>
          </div>
          <button className="lg:hidden p-1 text-[#899ca9]" onClick={() => setIsOpen(false)}>
            <FiX size={24} />
          </button>
        </div>

        <nav className="flex-1 px-3 space-y-1">
          {menuItems.map(item => {
            const isActive = location.pathname === item.path;
            return (
              <div 
                key={item.name} 
                onClick={() => { 
                  navigate(item.path); 
                  if(window.innerWidth < 1024) setIsOpen(false); 
                }}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer font-bold transition ${
                  isActive ? 'bg-[#eaf6fb] text-[#5dbcd2]' : 'text-[#899ca9] hover:bg-gray-50 hover:text-[#5dbcd2]'
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span>{item.name}</span>
              </div>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-50">
          <div 
            onClick={() => setShowLogoutConfirm(true)} 
            className="flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer font-bold text-[#899ca9] hover:bg-red-50 hover:text-red-500 transition"
          >
            <FiLogOut className="text-xl" />
            <span>Logout</span>
          </div>
        </div>
      </aside>

      {showLogoutConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 w-[90%] max-w-sm shadow-xl">
            <h2 className="text-xl font-bold text-gray-800 mb-2">
              Confirm Logout
            </h2>
            <p className="text-gray-500 mb-6">
              Are you sure you want to log out?
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="px-4 py-2 rounded-lg font-semibold text-gray-500 hover:bg-gray-100"
              >
                Cancel
              </button>

              <button
                onClick={() => {
                  logout();
                  navigate("/login");
                }}
                className="!px-[15px] !py-[4px] rounded-lg font-semibold bg-red-500 text-white hover:bg-red-600"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;