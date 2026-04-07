import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer'; // Assuming you have this file

const PublicLayout = ({ user, onLogout }) => {
  const location = useLocation();
  
  // Logic: Show Footer ONLY on the Home Page ('/')
  const showFooter = location.pathname === '/';

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. Header (Navbar) - Always visible */}
      <Navbar user={user} onLogout={onLogout} />
      
      {/* 2. Main Content */}
      <main className="flex-grow bg-gray-50">
        <Outlet />
      </main>
      
      {/* 3. Footer - Only visible on Home Page */}
      {showFooter && <Footer />}
    </div>
  );
};

export default PublicLayout;