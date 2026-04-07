import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, PlusCircle, LogOut, User, Inbox } from 'lucide-react';

const Sidebar = ({ role, user, onLogout }) => {
  const location = useLocation();

  // Navigation links based on role
  const vendorLinks = [
    { name: 'Dashboard', path: '/vendor/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Booking Requests', path: '/vendor/bookings', icon: <Inbox size={20} /> },
    { name: 'Add Service', path: '/vendor/add-service', icon: <PlusCircle size={20} /> },
  ];

  const adminLinks = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Manage Users', path: '/admin/users', icon: <User size={20} /> },
  ];

  const links = role === 'vendor' ? vendorLinks : adminLinks;

  return (
    <div className="w-64 dark:bg-[#111622] bg-white border-r dark:border-white/10 border-gray-300 flex flex-col h-full shadow-sm transition-colors duration-300">
      {/* --- HEADER --- */}
      <div className="p-6 border-b dark:border-white/10 border-gray-300 flex items-center gap-2 transition-colors duration-300">
        <div className="w-8 h-8 bg-[#b14e79] rounded-lg flex items-center justify-center text-white font-bold">
          {role === 'vendor' ? 'V' : 'A'}
        </div>
        <span className="text-xl font-bold dark:text-white text-gray-900">
          {role === 'vendor' ? 'Vendor Panel' : 'Admin Panel'}
        </span>
      </div>

      {/* --- USER PROFILE INFO --- */}
      <div className="p-6 pb-2">
        <div className="flex items-center gap-3 mb-6 dark:bg-[#0a0d14] bg-gray-50 p-3 rounded-xl border dark:border-white/10 border-gray-300 transition-colors duration-300">
          <img
            src={user?.profilePic || 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png'}
            alt="Profile"
            className="w-10 h-10 rounded-full object-cover border dark:border-white/10 border-gray-300"
          />
          <div className="overflow-hidden">
            <h4 className="text-sm font-bold dark:text-white text-gray-900 truncate">{user?.name}</h4>
            <p className="text-xs dark:text-gray-500 text-gray-600 capitalize">{user?.role}</p>
          </div>
        </div>
      </div>

      {/* --- NAVIGATION LINKS --- */}
      <nav className="flex-1 px-4 space-y-1">
        {links.map((link) => {
          const isActive = location.pathname === link.path;
          return (
            <Link
              key={link.path}
              to={link.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition font-medium ${
                isActive
                  ? 'dark:bg-[#b14e79]/10 bg-[#b14e79]/10 dark:text-[#b14e79] text-[#b14e79] dark:border dark:border-[#b14e79]/20 border border-[#b14e79]/20'
                  : 'dark:text-gray-400 text-gray-700 dark:hover:bg-white/5 hover:bg-gray-100 dark:hover:text-gray-300 hover:text-gray-900'
              }`}
            >
              {link.icon}
              {link.name}
            </Link>
          );
        })}
      </nav>

      {/* --- LOGOUT BUTTON --- */}
      <div className="p-4 border-t dark:border-white/10 border-gray-300 transition-colors duration-300">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-red-500 dark:hover:bg-red-500/10 hover:bg-red-50 rounded-lg transition font-medium dark:text-red-400"
        >
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;