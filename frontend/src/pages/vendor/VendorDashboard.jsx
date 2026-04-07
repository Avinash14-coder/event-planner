import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, MapPin, Trash2, Edit2, X, Camera } from 'lucide-react';
import toast from 'react-hot-toast';

// Helper for fallback images
const getFallbackImage = (category) => {
  switch (category?.toLowerCase()) {
    case 'dj': return "https://images.unsplash.com/photo-1571266028243-371695039980?auto=format&fit=crop&q=80&w=600";
    case 'catering': return "https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&q=80&w=600";
    case 'lawn': return "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=600";
    case 'photographer': return "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=600";
    default: return "https://images.unsplash.com/photo-1514525253440-b39345208668?auto=format&fit=crop&q=80&w=600";
  }
};

const VendorDashboard = () => {
  // Load User from LocalStorage
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
  
  // Local state for the Profile Image (Source of Truth)
  const [profileImage, setProfileImage] = useState(user?.profilePic || "");

  const [myServices, setMyServices] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Edit Modal State
  const [showEditModal, setShowEditModal] = useState(false);
  const [editFile, setEditFile] = useState(null); 
  const [editFormData, setEditFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || ''
  });

  // DYNAMIC URL SETUP (Ensures it talks to your local backend when testing)
  const baseUrl = window.location.hostname === "localhost" 
    ? "http://localhost:5000" 
    : "https://event-planner-1kse.onrender.com";

  // Sync state when user changes (e.g. after save)
  useEffect(() => {
    if (user) {
      setProfileImage(user.profilePic);
      setEditFormData({ name: user.name, phone: user.phone });
    }
  }, [user]);

  // Fetch Services
  useEffect(() => {
    const fetchMyServices = async () => {
      if (!user?._id) return;
      try {
        const response = await fetch(`${baseUrl}/api/vendors/my-services/${user._id}`);
        const data = await response.json();
        setMyServices(data);
      } catch (error) {
        console.error("Error", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMyServices();
  }, [user?._id, baseUrl]);

  // Handle File Selection (Live Preview)
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditFile(file);
      setProfileImage(URL.createObjectURL(file)); // Show preview immediately
    }
  };

  // Save Profile Changes
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    
    const data = new FormData();
    data.append('name', editFormData.name);
    data.append('phone', editFormData.phone);
    if (editFile) {
      data.append('profilePic', editFile);
    }

    try {
      const response = await fetch(`${baseUrl}/api/users/${user._id}`, {
        method: 'PUT',
        body: data 
      });

      if (response.ok) {
        const updatedUser = await response.json();
        
        // 1. Update Local Storage
        localStorage.setItem('user', JSON.stringify(updatedUser));
        
        // 2. Update Component State
        setUser(updatedUser); 
        
        // 3. Force Image Update (Add timestamp to bypass cache)
        if (updatedUser.profilePic) {
            setProfileImage(`${updatedUser.profilePic}?t=${Date.now()}`);
        }

        setShowEditModal(false);
        toast.success("Profile Updated Successfully!");

        // 4. Reload page to update Sidebar/Navbar
        setTimeout(() => window.location.reload(), 1000);
      } else {
        toast.error("Failed to update profile");
      }
    } catch (error) {
      toast.error("Server Error");
    }
  };

  // --- DELETE SERVICE LOGIC ---
  const handleDeleteService = async (id) => {
    if(!confirm("Are you sure you want to permanently delete this service?")) return;
    
    try {
      const response = await fetch(`${baseUrl}/api/vendors/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setMyServices(myServices.filter(s => s._id !== id));
        toast.success("Service permanently removed.");
      } else {
        // Super Debugging
        const errorText = await response.text();
        console.error("Delete Error:", errorText);
        toast.error(`Delete Failed (${response.status}). Make sure local backend is running!`);
      }
    } catch (error) {
      toast.error("Server Error while deleting. Is your backend on?");
    }
  };

  return (
    <div className="min-h-screen dark:bg-[#05070a] bg-gray-50 transition-colors duration-300">
      <div className="container mx-auto px-6 py-8">
      
      {/* --- PROFILE HEADER --- */}
      <div className="dark:bg-[#111622] bg-white rounded-3xl shadow-lg border dark:border-white/10 border-gray-300 p-8 md:p-12 mb-12 relative overflow-hidden transition-colors duration-300">
        <div className="absolute top-0 right-0 w-40 h-40 bg-[#b14e79]/5 rounded-full -mr-20 -mt-20 pointer-events-none"></div>
        
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 items-start">
          {/* Profile Picture & Camera Button */}
          <div className="flex justify-center md:col-span-1">
            <div className="relative group flex-shrink-0">
              <img 
                src={profileImage || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"} 
                alt="Vendor Profile" 
                className="w-40 h-40 rounded-full object-cover border-4 dark:border-[#231018] border-[#f7edf2] dark:bg-[#190b11] bg-white shadow-xl group-hover:shadow-2xl transition-shadow"
                onError={(e) => { e.target.onerror = null; e.target.src = "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"; }}
              />
              <button 
                 onClick={() => setShowEditModal(true)}
                 className="absolute bottom-0 right-0 bg-[#b14e79] text-white p-3 rounded-full shadow-lg hover:bg-[#8e3e61] transition border-4 border-white dark:border-[#111622]"
                 title="Change Photo"
              >
                <Camera size={18} />
              </button>
            </div>
          </div>

          {/* Info Section */}
          <div className="flex flex-col justify-start md:col-span-1">
            <div className="mb-6">
              <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                <h1 className="text-3xl md:text-4xl font-bold dark:text-white text-gray-800">
                  {user?.name}
                </h1>
                <button 
                  onClick={() => setShowEditModal(true)} 
                  className="dark:text-gray-400 text-gray-400 hover:text-[#b14e79] dark:hover:text-[#b14e79] transition p-1 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg"
                >
                  <Edit2 size={20} />
                </button>
              </div>
              <div className="space-y-1">
                <p className="dark:text-gray-400 text-gray-600 text-center md:text-left font-medium">{user?.email}</p>
                <p className="dark:text-gray-400 text-gray-600 text-center md:text-left font-medium">{user?.phone || "No phone number added"}</p>
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="flex justify-center md:justify-end md:col-span-1">
            <div className="dark:bg-[#0a0d14]/50 bg-white rounded-2xl p-6 border dark:border-white/10 border-gray-300 text-center min-w-[160px]">
              <div className="text-4xl font-bold text-[#b14e79] mb-2">{myServices.length}</div>
              <div className="text-xs dark:text-gray-400 text-gray-600 font-bold uppercase tracking-widest">Active Services</div>
            </div>
          </div>
        </div>
      </div>

      {/* --- SERVICES SECTION HEADER --- */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-3xl font-bold dark:text-white text-gray-900 mb-1">My Services</h2>
            <p className="text-sm dark:text-gray-400 text-gray-700">Manage and showcase your offerings</p>
          </div>
          <Link to="/vendor/add-service" className="bg-[#b14e79] text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-[#8e3e61] transition shadow-md hover:shadow-lg w-full md:w-auto justify-center">
            <PlusCircle size={20} /> Add Service
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-16 dark:text-gray-400 text-gray-600">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#b14e79]"></div>
          <p className="mt-4">Loading your services...</p>
        </div>
      ) : myServices.length === 0 ? (
        <div className="text-center py-16 dark:bg-[#111622] bg-white rounded-2xl border-2 border-dashed dark:border-white/10 border-gray-300">
           <div className="inline-flex items-center justify-center w-16 h-16 rounded-full dark:bg-[#0a0d14] bg-gray-200 mb-4">
             <PlusCircle size={28} className="dark:text-gray-500 text-gray-400" />
           </div>
           <p className="dark:text-gray-400 text-gray-800 mb-4 font-medium text-lg">No services listed yet</p>
           <p className="dark:text-gray-500 text-gray-700 mb-6">Start by adding your first service to get discovered by clients</p>
           <Link to="/vendor/add-service" className="text-[#b14e79] font-bold hover:underline inline-block">Add your first service →</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {myServices.map((service) => (
            <div key={service._id} className="group dark:bg-[#111622] bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 border dark:border-white/10 border-gray-300 overflow-hidden hover:border-[#b14e79]/30">
              {/* Image Container */}
              <div className="h-48 overflow-hidden relative dark:bg-[#0a0d14] bg-gray-200">
                <img 
                  src={service.images[0] || "broken"} 
                  alt={service.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                  onError={(e) => { e.target.onerror = null; e.target.src = getFallbackImage(service.type); }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute top-3 right-3 dark:bg-[#0a0d14]/95 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold dark:text-gray-200 text-gray-900 border dark:border-white/20 border-gray-400">{service.type}</div>
              </div>
              
              {/* Content */}
              <div className="p-6">
                <h3 className="font-bold text-lg dark:text-white text-gray-900 mb-2 group-hover:text-[#b14e79] transition-colors">{service.name}</h3>
                <p className="text-sm dark:text-gray-400 text-gray-700 mb-4 flex items-center gap-2"><MapPin size={16} className="flex-shrink-0 text-[#b14e79]"/> {service.location}</p>
                
                {/* Footer */}
                <div className="flex justify-between items-center pt-4 border-t dark:border-white/10 border-gray-300">
                  <span className="font-bold text-lg text-[#b14e79]">₹{service.price}</span>
                  <button 
                    onClick={() => handleDeleteService(service._id)} 
                    className="text-red-400 hover:text-red-600 p-2 dark:hover:bg-red-900/20 hover:bg-red-50 rounded-full transition duration-200"
                    title="Delete service"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* --- EDIT MODAL --- */}
      {showEditModal && (
        <div className="fixed inset-0 dark:bg-black/70 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="dark:bg-[#111622] bg-white rounded-3xl w-full max-w-md p-8 shadow-2xl border dark:border-white/10 border-gray-300">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold dark:text-white text-gray-900">Edit Profile</h3>
              <button 
                onClick={() => setShowEditModal(false)} 
                className="dark:text-gray-400 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/5 p-2 rounded-lg transition"
              >
                <X size={24} />
              </button>
            </div>
            
            {/* Form */}
            <form onSubmit={handleProfileUpdate} className="space-y-5">
              {/* Photo Section */}
              <div className="dark:bg-[#0a0d14] bg-gray-100 p-6 rounded-2xl border dark:border-white/10 border-gray-300 text-center">
                {profileImage && (
                  <img 
                    src={profileImage} 
                    className="w-24 h-24 rounded-full mx-auto mb-4 object-cover border-3 dark:border-white/10 border-gray-400 shadow-md"
                    alt="Preview"
                  />
                )}
                <label className="block text-sm font-bold text-[#b14e79] mb-3 cursor-pointer dark:bg-[#111622] bg-gray-50 py-2.5 px-3 rounded-xl border dark:border-white/10 border-gray-300 dark:hover:bg-[#1e2638] hover:bg-gray-200 transition font-medium">
                  📸 Choose New Photo
                  <input type="file" onChange={handleFileChange} accept="image/*" className="hidden" />
                </label>
                <p className="text-xs dark:text-gray-500 text-gray-600">JPG or PNG, Max 5MB</p>
              </div>

              {/* Input Fields */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold dark:text-gray-300 text-gray-900 mb-2">Business Name</label>
                  <input 
                    type="text" 
                    value={editFormData.name} 
                    onChange={(e) => setEditFormData({...editFormData, name: e.target.value})} 
                    className="w-full p-3 dark:bg-[#05070a] bg-gray-50 border dark:border-white/10 border-gray-300 dark:text-white text-gray-900 rounded-xl focus:ring-2 focus:ring-[#b14e79] focus:border-transparent outline-none transition" 
                    placeholder="Enter business name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold dark:text-gray-300 text-gray-900 mb-2">Phone Number</label>
                  <input 
                    type="text" 
                    value={editFormData.phone} 
                    onChange={(e) => setEditFormData({...editFormData, phone: e.target.value})} 
                    className="w-full p-3 dark:bg-[#05070a] bg-gray-50 border dark:border-white/10 border-gray-300 dark:text-white text-gray-900 rounded-xl focus:ring-2 focus:ring-[#b14e79] focus:border-transparent outline-none transition" 
                    placeholder="Enter phone number"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button 
                type="submit" 
                className="w-full bg-gradient-to-r from-[#b14e79] to-[#8e3e61] hover:from-[#8e3e61] hover:to-[#6a2f49] text-white font-bold py-3 rounded-xl transition shadow-lg shadow-[#b14e79]/20 mt-6"
              >
                Save Changes
              </button>
            </form>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default VendorDashboard;