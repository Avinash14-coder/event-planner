import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar'; // We will create/update this next

const DashboardLayout = ({ role, user, onLogout }) => {
  return (
    <div className="flex h-screen dark:bg-[#05070a] bg-gray-50 transition-colors duration-300">
      {/* CRITICAL FIX: 
         We pass the 'onLogout' function to the Sidebar here.
         We also pass 'user' so the sidebar can show the avatar/name.
      */}
      <Sidebar role={role} user={user} onLogout={onLogout} />
      
      {/* Main Content Area */}
      <div className="flex-1 overflow-auto dark:bg-[#05070a] bg-gray-50 transition-colors duration-300">
        <div className="p-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;