import React, { useEffect, useState } from 'react';
import { Users, Store, Trash2, Search, Briefcase } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [vendors, setVendors] = useState([]); // This stores the actual services/listings
  const [loading, setLoading] = useState(true);

  // Dynamic URL setup
  const baseUrl = window.location.hostname === "localhost" 
    ? "http://localhost:5000" 
    : "https://event-planner-86ju.onrender.com";

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

  // --- DELETE SERVICE LOGIC ---
  const handleDeleteVendor = async (id) => {
    if (!window.confirm("Are you sure you want to permanently delete this service?")) return;

    try {
      const response = await fetch(`${baseUrl}/api/vendors/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        // Remove from UI only after database confirms deletion
        setVendors(vendors.filter(v => v._id !== id));
        toast.success("Service permanently deleted!");
      } else {
        // SUPER DEBUGGING: Tells us exactly why it failed
        const errorText = await response.text();
        console.error("Delete Error:", errorText);
        toast.error(`Delete Failed (Error ${response.status}). Backend might need a restart!`);
      }
    } catch (error) {
      toast.error("Network crash. Is your local backend running?");
    }
  };

  // --- CALCULATE ACCURATE STATS ---
  const totalServices = vendors.length;
  const totalVendorAccounts = users.filter(u => u.role === 'vendor').length;
  const totalUserAccounts = users.filter(u => u.role === 'user').length;

  return (
    <div className="container mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Admin Dashboard</h1>

      {/* Stats Cards (Now perfectly split into 3 categories) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        
        {/* Card 1: Total Services Listed */}
        <div className="bg-blue-500 text-white p-6 rounded-xl shadow-lg relative overflow-hidden">
          <div className="relative z-10 flex justify-between items-center">
            <div>
              <p className="text-blue-100 font-bold uppercase text-xs">Total Services</p>
              <h2 className="text-4xl font-bold">{totalServices}</h2>
            </div>
            <Store size={40} className="opacity-80" />
          </div>
          <div className="absolute -bottom-4 -right-4 text-blue-600 opacity-20"><Store size={100} /></div>
        </div>

        {/* Card 2: Total Vendor Accounts */}
        <div className="bg-pink-500 text-white p-6 rounded-xl shadow-lg relative overflow-hidden">
          <div className="relative z-10 flex justify-between items-center">
            <div>
              <p className="text-pink-100 font-bold uppercase text-xs">Total Vendors</p>
              <h2 className="text-4xl font-bold">{totalVendorAccounts}</h2> 
            </div>
            <Briefcase size={40} className="opacity-80" />
          </div>
          <div className="absolute -bottom-4 -right-4 text-pink-600 opacity-20"><Briefcase size={100} /></div>
        </div>
        
        {/* Card 3: Total User Accounts */}
        <div className="bg-purple-600 text-white p-6 rounded-xl shadow-lg relative overflow-hidden">
          <div className="relative z-10 flex justify-between items-center">
            <div>
              <p className="text-purple-100 font-bold uppercase text-xs">Total Users</p>
              <h2 className="text-4xl font-bold">{totalUserAccounts}</h2> 
            </div>
            <Users size={40} className="opacity-80" />
          </div>
          <div className="absolute -bottom-4 -right-4 text-purple-700 opacity-20"><Users size={100} /></div>
        </div>

      </div>

      {/* Vendor Management Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">Manage Services</h2>
          <div className="relative">
            <Search className="absolute left-3 top-3 text-gray-400" size={18} />
            <input type="text" placeholder="Search..." className="pl-10 pr-4 py-2 border rounded-lg text-sm outline-none focus:border-purple-500" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 uppercase text-xs font-bold text-gray-500">
              <tr>
                <th className="px-6 py-4">Service Name</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Location</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {vendors.map((vendor) => (
                <tr key={vendor._id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 font-bold text-gray-800">{vendor.name}</td>
                  <td className="px-6 py-4">
                    <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs font-bold">{vendor.type}</span>
                  </td>
                  <td className="px-6 py-4">₹{vendor.price}</td>
                  <td className="px-6 py-4">{vendor.location}</td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => handleDeleteVendor(vendor._id)}
                      className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition"
                      title="Delete Service"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {vendors.length === 0 && <div className="p-8 text-center text-gray-400">No services found.</div>}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;