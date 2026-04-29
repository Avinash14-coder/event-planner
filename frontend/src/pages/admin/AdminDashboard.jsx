import React, { useEffect, useState } from 'react';
import { Users, Store, Briefcase } from 'lucide-react';
import toast from 'react-hot-toast';
import baseUrl from '../../utils/api';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch All Data
  const fetchData = async () => {
    try {
      // 1. Fetch Services (Listings)
      const vendorRes = await fetch(`${baseUrl}/api/vendors`);
      if (vendorRes.ok) {
        const vendorData = await vendorRes.json();
        setVendors(vendorData);
      }
      
      // 2. Fetch All Registered People (Users & Vendors)
      const userRes = await fetch(`${baseUrl}/api/users`);
      if (userRes.ok) {
        const userData = await userRes.json();
        setUsers(userData);
      } else {
        toast.error("Could not find users. Did you restart your backend server?");
      }
      
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // --- CALCULATE ACCURATE STATS ---
  const totalServices = vendors.length;
  const totalVendorAccounts = users.filter(u => u.role === 'vendor').length;
  const totalUserAccounts = users.filter(u => u.role === 'user').length;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#b14e79]"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold dark:text-white text-gray-800 mb-8 transition-colors">Admin Dashboard</h1>

      {/* Stats Cards (Now perfectly split into 3 categories) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        
        {/* Card 1: Total Services Listed */}
        <div className="bg-blue-500 text-white p-8 rounded-2xl shadow-lg relative overflow-hidden group hover:scale-[1.02] transition-transform duration-300">
          <div className="relative z-10 flex justify-between items-center">
            <div>
              <p className="text-blue-100 font-bold uppercase text-xs tracking-wider mb-1">Total Services</p>
              <h2 className="text-5xl font-bold">{totalServices}</h2>
            </div>
            <div className="bg-white/20 p-4 rounded-xl">
              <Store size={40} className="text-white" />
            </div>
          </div>
          <div className="absolute -bottom-6 -right-6 text-white opacity-10 group-hover:scale-110 transition-transform">
            <Store size={150} />
          </div>
        </div>

        {/* Card 2: Total Vendor Accounts */}
        <div className="bg-pink-500 text-white p-8 rounded-2xl shadow-lg relative overflow-hidden group hover:scale-[1.02] transition-transform duration-300">
          <div className="relative z-10 flex justify-between items-center">
            <div>
              <p className="text-pink-100 font-bold uppercase text-xs tracking-wider mb-1">Total Vendors</p>
              <h2 className="text-5xl font-bold">{totalVendorAccounts}</h2> 
            </div>
            <div className="bg-white/20 p-4 rounded-xl">
              <Briefcase size={40} className="text-white" />
            </div>
          </div>
          <div className="absolute -bottom-6 -right-6 text-white opacity-10 group-hover:scale-110 transition-transform">
            <Briefcase size={150} />
          </div>
        </div>
        
        {/* Card 3: Total User Accounts */}
        <div className="bg-purple-600 text-white p-8 rounded-2xl shadow-lg relative overflow-hidden group hover:scale-[1.02] transition-transform duration-300">
          <div className="relative z-10 flex justify-between items-center">
            <div>
              <p className="text-purple-100 font-bold uppercase text-xs tracking-wider mb-1">Total Users</p>
              <h2 className="text-5xl font-bold">{totalUserAccounts}</h2> 
            </div>
            <div className="bg-white/20 p-4 rounded-xl">
              <Users size={40} className="text-white" />
            </div>
          </div>
          <div className="absolute -bottom-6 -right-6 text-white opacity-10 group-hover:scale-110 transition-transform">
            <Users size={150} />
          </div>
        </div>

      </div>

    </div>
  );
};

export default AdminDashboard;