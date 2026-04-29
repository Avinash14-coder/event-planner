import React, { useEffect, useState } from 'react';
import { Users, Search, Trash2, Eye, ChevronRight, Briefcase, User as UserIcon, Shield, Star, MapPin, Phone, Mail, X } from 'lucide-react';
import toast from 'react-hot-toast';
import baseUrl from '../../utils/api';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all'); // all, user, vendor
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [vendorServices, setVendorServices] = useState([]);
  const [loadingServices, setLoadingServices] = useState(false);

  // Fetch all users and vendors
  const fetchUsers = async () => {
    try {
      const res = await fetch(`${baseUrl}/api/users`);
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      } else {
        toast.error("Failed to fetch users");
      }
    } catch (error) {
      console.error(error);
      toast.error("Connection error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Fetch services for a specific vendor
  const fetchVendorServices = async (vendorId) => {
    setLoadingServices(true);
    try {
      const res = await fetch(`${baseUrl}/api/vendors/my-services/${vendorId}`);
      if (res.ok) {
        const data = await res.json();
        setVendorServices(data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingServices(false);
    }
  };

  const handleViewServices = (vendor) => {
    setSelectedVendor(vendor);
    fetchVendorServices(vendor._id);
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure? This will permanently delete the user and all their listings.")) return;

    try {
      const res = await fetch(`${baseUrl}/api/users/${userId}`, {
        method: 'DELETE'
      });

      if (res.ok) {
        setUsers(users.filter(u => u._id !== userId));
        toast.success("User deleted successfully");
        if (selectedVendor?._id === userId) {
          setSelectedVendor(null);
        }
      } else {
        toast.error("Failed to delete user");
      }
    } catch (error) {
      toast.error("Network error");
    }
  };

  const handleDeleteService = async (serviceId) => {
    if (!window.confirm("Delete this service?")) return;

    try {
      const res = await fetch(`${baseUrl}/api/vendors/${serviceId}`, {
        method: 'DELETE'
      });

      if (res.ok) {
        setVendorServices(vendorServices.filter(s => s._id !== serviceId));
        toast.success("Service deleted");
      }
    } catch (error) {
      toast.error("Error deleting service");
    }
  };

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = activeTab === 'all' || u.role === activeTab;
    return matchesSearch && matchesTab;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#b14e79]"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8 relative">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-6">
        <div>
          <h1 className="text-3xl font-bold dark:text-white text-gray-800">Manage Users</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Control and oversee all platform accounts</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-4">
          {/* Tab Switcher */}
          <div className="flex p-1 dark:bg-[#111622] bg-gray-100 rounded-xl border dark:border-white/10 border-gray-200">
            {['all', 'user', 'vendor'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                  activeTab === tab 
                    ? 'bg-[#b14e79] text-white shadow-lg' 
                    : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                {tab === 'all' ? 'All Accounts' : `${tab}s`}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder="Search..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 dark:bg-[#111622] bg-white border dark:border-white/10 border-gray-200 rounded-xl outline-none focus:border-[#b14e79] dark:text-white text-sm transition-all"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {/* User List Card */}
        <div className="dark:bg-[#111622] bg-white rounded-2xl shadow-sm border dark:border-white/10 border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600 dark:text-gray-400">
              <thead className="dark:bg-white/5 bg-gray-50 uppercase text-[10px] font-bold text-gray-400 tracking-widest border-b dark:border-white/5 border-gray-100">
                <tr>
                  <th className="px-8 py-5">Profile</th>
                  <th className="px-6 py-5">Role</th>
                  <th className="px-6 py-5">Status</th>
                  <th className="px-6 py-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y dark:divide-white/5 divide-gray-100">
                {filteredUsers.map((u) => (
                  <tr 
                    key={u._id} 
                    className={`hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors group ${selectedVendor?._id === u._id ? 'dark:bg-[#b14e79]/5 bg-pink-50' : ''}`}
                  >
                    <td className="px-8 py-4">
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <img 
                            src={u.profilePic || 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png'} 
                            alt="" 
                            className="w-12 h-12 rounded-2xl object-cover border-2 dark:border-white/10 border-white shadow-sm"
                          />
                          {u.role === 'admin' && (
                            <div className="absolute -top-2 -right-2 bg-yellow-400 text-white p-1 rounded-full border-2 border-white dark:border-[#111622]">
                              <Shield size={10} />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-bold dark:text-white text-gray-800 text-base">{u.name}</p>
                          <p className="text-xs text-gray-500 font-medium">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${
                        u.role === 'vendor' 
                          ? 'bg-pink-100 text-pink-700 dark:bg-pink-500/10 dark:text-pink-400' 
                          : u.role === 'admin'
                            ? 'bg-purple-100 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400'
                            : 'bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-xs dark:text-gray-300 text-gray-600 font-bold">Active</span>
                        <span className="text-[10px] text-gray-500 uppercase">Joined {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'N/A'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        {u.role === 'vendor' && (
                          <button 
                            onClick={() => handleViewServices(u)}
                            className="flex items-center gap-2 px-3 py-1.5 bg-blue-500 text-white rounded-lg text-xs font-bold hover:bg-blue-600 shadow-md shadow-blue-500/20 transition"
                          >
                            <Eye size={14} /> Services
                          </button>
                        )}
                        {u.role !== 'admin' && (
                          <button 
                            onClick={() => handleDeleteUser(u._id)}
                            className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition"
                            title="Delete Account"
                          >
                            <Trash2 size={18} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredUsers.length === 0 && (
              <div className="p-16 text-center text-gray-400 bg-gray-50/50 dark:bg-transparent">
                <UserIcon size={64} className="mx-auto mb-4 opacity-10" />
                <p className="text-lg font-bold">No accounts found</p>
                <p className="text-sm">Try adjusting your search or filters</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Services Drawer Overlay */}
      {selectedVendor && (
        <div className="fixed inset-0 z-50 overflow-hidden flex justify-end animate-in fade-in duration-300">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setSelectedVendor(null)} />
          
          {/* Sidebar */}
          <div className="relative w-full max-w-md bg-white dark:bg-[#0a0d14] h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-500 border-l dark:border-white/10">
            {/* Header */}
            <div className="p-8 border-b dark:border-white/5 border-gray-100 bg-[#b14e79] text-white relative">
              <button 
                onClick={() => setSelectedVendor(null)}
                className="absolute top-6 right-6 p-2 hover:bg-white/20 rounded-full transition"
              >
                <X size={20} />
              </button>
              
              <div className="flex items-center gap-5">
                <img 
                  src={selectedVendor.profilePic || 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png'} 
                  alt="" 
                  className="w-16 h-16 rounded-2xl object-cover border-4 border-white/20"
                />
                <div>
                  <h2 className="text-2xl font-bold">{selectedVendor.name}</h2>
                  <p className="text-pink-100 text-sm opacity-90">{selectedVendor.email}</p>
                </div>
              </div>
            </div>

            {/* Quick Info Bar */}
            <div className="flex divide-x dark:divide-white/5 border-b dark:border-white/5">
              <div className="flex-1 p-4 flex flex-col items-center justify-center gap-1">
                <span className="text-[10px] uppercase font-bold text-gray-400">Services</span>
                <span className="text-xl font-bold dark:text-white text-gray-800">{vendorServices.length}</span>
              </div>
              <div className="flex-1 p-4 flex flex-col items-center justify-center gap-1">
                <span className="text-[10px] uppercase font-bold text-gray-400">Status</span>
                <span className="flex items-center gap-1 text-green-500 font-bold text-sm">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" /> Verified
                </span>
              </div>
            </div>

            {/* Services List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
              <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-6">Service Catalog</h3>
              
              {loadingServices ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#b14e79]"></div>
                  <p className="text-sm text-gray-500">Retrieving services...</p>
                </div>
              ) : vendorServices.length > 0 ? (
                vendorServices.map(service => (
                  <div key={service._id} className="p-5 rounded-2xl dark:bg-white/5 bg-gray-50 border dark:border-white/5 border-gray-100 group hover:border-[#b14e79]/30 transition-all duration-300">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="font-bold dark:text-white text-gray-800 text-lg mb-1">{service.name}</h4>
                        <div className="flex items-center gap-3">
                          <span className="text-[10px] bg-[#b14e79]/10 text-[#b14e79] px-2.5 py-1 rounded-full font-black uppercase tracking-tighter">
                            {service.type}
                          </span>
                          <div className="flex items-center gap-1 text-yellow-500">
                            <Star size={10} fill="currentColor" />
                            <span className="text-xs font-bold">{service.rating || '5.0'}</span>
                          </div>
                        </div>
                      </div>
                      <button 
                        onClick={() => handleDeleteService(service._id)}
                        className="p-2.5 text-red-500 bg-red-500/5 hover:bg-red-500 text-white rounded-xl transition-all"
                        title="Delete Service"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t dark:border-white/5 border-gray-200">
                      <div className="flex items-center gap-2 text-gray-500">
                        <MapPin size={14} />
                        <span className="text-xs font-medium truncate">{service.location}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-xs text-gray-400 block mb-1">Price Starts At</span>
                        <span className="text-xl font-black text-[#b14e79]">₹{service.price}</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-20 px-10">
                  <div className="w-16 h-16 bg-gray-100 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Briefcase size={24} className="text-gray-300" />
                  </div>
                  <p className="text-gray-500 font-bold mb-1">No Services Found</p>
                  <p className="text-xs text-gray-400">This vendor hasn't listed any services yet.</p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-6 bg-gray-50 dark:bg-white/[0.02] border-t dark:border-white/10 border-gray-100">
              <button 
                onClick={() => setSelectedVendor(null)}
                className="w-full py-4 bg-gray-900 dark:bg-white/10 text-white dark:text-gray-300 rounded-2xl font-bold hover:bg-black dark:hover:bg-white/20 transition-all flex items-center justify-center gap-2"
              >
                Close View <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageUsers;
