import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { User, Mail, Calendar, Heart, Settings, Camera, MapPin, Phone, Loader2, Edit2, Save, X, Search, Key, Trash2, Clock, CheckCircle, XCircle, MessageSquare, MessageCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import Chat from '../../components/Chat';

const UserProfile = ({ user }) => {
  const [activeTab, setActiveTab] = useState('profile');
  const [activeChatBooking, setActiveChatBooking] = useState(null);
  
  // Image Upload State
  const [isUploading, setIsUploading] = useState(false);
  const [profilePic, setProfilePic] = useState(user?.profilePic || null);
  const fileInputRef = useRef(null);

  // Edit Profile State
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    phone: user?.phone || '',
    address: user?.address || '' 
  });

  // Bookings State
  const [bookings, setBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(false);

  if (!user) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-gray-500 bg-gray-50">
        <User size={64} className="mb-4 text-[#e0b8c9]" />
        <h2 className="text-2xl font-bold text-gray-700">Session Expired</h2>
        <Link to="/login" className="mt-4 bg-[#b14e79] text-white px-6 py-2 rounded-lg font-bold">Go to Login</Link>
      </div>
    );
  }

  const baseUrl = window.location.hostname === "localhost" 
    ? "http://localhost:5000" 
    : "https://event-planner-86ju.onrender.com";

  // --- FETCH BOOKINGS ---
  useEffect(() => {
    if (activeTab === 'bookings' && user?._id) {
      const fetchBookings = async () => {
        setLoadingBookings(true);
        try {
          const res = await fetch(`${baseUrl}/api/bookings/user/${user._id}`);
          if (res.ok) {
            const data = await res.json();
            // Sort to show newest first
            data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            setBookings(data);
          }
        } catch (error) {
          console.error("Failed to fetch bookings:", error);
        } finally {
          setLoadingBookings(false);
        }
      };
      fetchBookings();
    }
  }, [activeTab, user?._id, baseUrl]);

  // --- HANDLE IMAGE UPLOAD ---
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    const uploadData = new FormData();
    uploadData.append('profilePic', file);

    try {
      const response = await fetch(`${baseUrl}/api/users/${user._id}`, {
        method: 'PUT',
        body: uploadData,
      });
      const updatedData = await response.json();

      if (response.ok) {
        setProfilePic(updatedData.profilePic);
        
        // Sync to LocalStorage so it survives page refresh
        user.profilePic = updatedData.profilePic;
        localStorage.setItem('user', JSON.stringify(user));

        toast.success("Profile picture updated!");
      } else {
        toast.error(updatedData.error || "Failed to update picture");
      }
    } catch (error) {
      toast.error("Server error. Could not upload image.");
    } finally {
      setIsUploading(false);
    }
  };

  // --- HANDLE PROFILE TEXT UPDATE ---
  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      const response = await fetch(`${baseUrl}/api/users/${user._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      if (response.ok) {
        toast.success("Profile details saved!");
        setIsEditing(false);
        
        // Update local user object AND sync to LocalStorage
        user.phone = formData.phone;
        user.address = formData.address; 
        localStorage.setItem('user', JSON.stringify(user));
        
      } else {
        toast.error("Failed to save details.");
      }
    } catch (error) {
      toast.error("Server error. Try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="dark:bg-[#0a0d14] bg-white min-h-[calc(100vh-80px)] flex flex-col transition-colors duration-300">
      
      {/* TOP SECTION: Avatar & Basic Info */}
      <div className="w-full border-b dark:border-white/5 border-gray-100 px-6 md:px-12 lg:px-20 py-8 flex flex-col md:flex-row items-center md:items-center gap-8 relative dark:bg-[#05070a] bg-white transition-colors duration-300">
        
        <div className="relative group flex-shrink-0">
          <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 dark:border-[#231018] border-[#f7edf2] shadow-sm dark:bg-[#190b11] bg-[#f7edf2] flex items-center justify-center overflow-hidden">
            {profilePic ? (
              <img src={profilePic} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              <User size={64} className="text-[#d095af]" />
            )}
          </div>
          
          <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageUpload} className="hidden" />
          <button 
            onClick={() => fileInputRef.current.click()}
            disabled={isUploading}
            className="absolute bottom-2 right-2 bg-[#b14e79] hover:bg-[#8e3e61] text-white p-2.5 rounded-full shadow-md transition transform group-hover:scale-110 border-2 border-white"
          >
            {isUploading ? <Loader2 size={18} className="animate-spin" /> : <Camera size={18} />}
          </button>
        </div>

        {/* User Name (Removed the logo/role badge from here) */}
        <div className="flex-grow text-center md:text-left">
          <h1 className="text-3xl md:text-4xl font-extrabold dark:text-white text-gray-900">{user.name}</h1>
        </div>

        <div className="mt-4 md:mt-0">
          {!isEditing ? (
            <button onClick={() => setIsEditing(true)} className="dark:bg-white/5 bg-gray-50 dark:hover:bg-white/10 hover:bg-gray-100 dark:text-gray-300 text-gray-700 font-bold py-3 px-6 rounded-xl transition shadow-sm border dark:border-white/10 border-gray-200 flex items-center gap-2">
              <Edit2 size={18} /> Edit Profile
            </button>
          ) : (
            <div className="flex gap-2">
              <button onClick={() => setIsEditing(false)} className="bg-gray-50 hover:bg-gray-100 text-gray-600 font-bold py-3 px-4 rounded-xl transition border border-gray-200">
                <X size={20} />
              </button>
              <button onClick={handleSaveProfile} disabled={isSaving} className="bg-[#b14e79] hover:bg-[#8e3e61] text-white font-bold py-3 px-6 rounded-xl transition shadow-sm flex items-center gap-2">
                {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />} Save
              </button>
            </div>
          )}
        </div>
      </div>

      {/* MIDDLE SECTION: Tabs & Content */}
      <div className="flex flex-col md:flex-row flex-grow w-full">
        
        {/* Sidebar Tabs */}
        <div className="w-full md:w-72 dark:bg-[#111622] bg-gray-50 border-r dark:border-white/5 border-gray-100 p-6 space-y-2 flex-shrink-0 transition-colors duration-300">
          <button onClick={() => setActiveTab('profile')} className={`w-full flex items-center gap-3 px-5 py-3.5 rounded-xl font-bold transition ${activeTab === 'profile' ? 'bg-[#b14e79] text-white shadow-md' : 'text-gray-600 dark:text-gray-400 dark:hover:bg-white/5 hover:bg-[#f7edf2] dark:hover:text-white hover:text-[#8e3e61]'}`}>
            <User size={20} /> My Details
          </button>
          <button onClick={() => setActiveTab('bookings')} className={`w-full flex items-center gap-3 px-5 py-3.5 rounded-xl font-bold transition ${activeTab === 'bookings' ? 'bg-[#b14e79] text-white shadow-md' : 'text-gray-600 dark:text-gray-400 dark:hover:bg-white/5 hover:bg-[#f7edf2] dark:hover:text-white hover:text-[#8e3e61]'}`}>
            <Calendar size={20} /> My Bookings
          </button>
          <button onClick={() => setActiveTab('favorites')} className={`w-full flex items-center gap-3 px-5 py-3.5 rounded-xl font-bold transition ${activeTab === 'favorites' ? 'bg-[#b14e79] text-white shadow-md' : 'text-gray-600 dark:text-gray-400 dark:hover:bg-white/5 hover:bg-[#f7edf2] dark:hover:text-white hover:text-[#8e3e61]'}`}>
            <Heart size={20} /> Saved Vendors
          </button>
          
          {/* SETTINGS TAB BUTTON */}
          <div className="pt-4 mt-4 border-t dark:border-white/10 border-gray-200">
            <button onClick={() => setActiveTab('settings')} className={`w-full flex items-center gap-3 px-5 py-3.5 rounded-xl font-bold transition ${activeTab === 'settings' ? 'bg-gray-800 text-white shadow-md' : 'text-gray-600 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-white hover:bg-gray-200 hover:text-gray-900'}`}>
              <Settings size={20} /> Settings
            </button>
          </div>
        </div>

        {/* Tab Content Area */}
        <div className="flex-grow p-6 md:p-12 lg:p-16 dark:bg-[#0a0d14] bg-white transition-colors duration-300">
          
          {/* === PROFILE TAB === */}
          {activeTab === 'profile' && (
            <div className="animate-fade-in max-w-4xl">
              <h2 className="text-2xl font-bold dark:text-white text-gray-800 mb-8 border-b dark:border-white/10 border-gray-100 pb-4">Personal Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="dark:bg-[#111622] bg-gray-50 p-5 rounded-2xl border dark:border-white/5 border-gray-100 transition-colors duration-300">
                  <p className="text-sm dark:text-gray-400 text-gray-500 mb-2 flex items-center gap-2"><Mail size={16} className="text-[#b14e79]" /> Email Address</p>
                  <p className="font-bold dark:text-white text-gray-800 text-lg">{user.email}</p>
                </div>

                <div className="dark:bg-[#111622] bg-gray-50 p-5 rounded-2xl border dark:border-white/5 border-gray-100 transition-colors duration-300">
                  <p className="text-sm dark:text-gray-400 text-gray-500 mb-2 flex items-center gap-2"><Phone size={16} className="text-[#b14e79]" /> Phone Number</p>
                  {isEditing ? (
                    <input type="text" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} placeholder="Enter phone number" className="w-full dark:bg-[#05070a] bg-white border dark:border-white/10 border-gray-300 rounded-lg p-2.5 dark:text-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#b14e79]" />
                  ) : (
                    <p className="font-bold dark:text-white text-gray-800 text-lg">{user.phone || <span className="text-gray-400 italic font-normal">Not added yet</span>}</p>
                  )}
                </div>

                <div className="dark:bg-[#111622] bg-gray-50 p-5 rounded-2xl border dark:border-white/5 border-gray-100 md:col-span-2 transition-colors duration-300">
                  <p className="text-sm dark:text-gray-400 text-gray-500 mb-2 flex items-center gap-2"><MapPin size={16} className="text-[#b14e79]" /> Location / City</p>
                  {isEditing ? (
                    <input type="text" value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} placeholder="e.g. Nashik, Maharashtra" className="w-full dark:bg-[#05070a] bg-white border dark:border-white/10 border-gray-300 rounded-lg p-2.5 dark:text-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#b14e79]" />
                  ) : (
                    <p className="font-bold dark:text-white text-gray-800 text-lg">{user.address || <span className="text-gray-400 italic font-normal">Not added yet</span>}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* === BOOKINGS TAB === */}
          {activeTab === 'bookings' && (
            <div className="animate-fade-in max-w-4xl">
              <h2 className="text-2xl font-bold dark:text-white text-gray-800 mb-8 border-b dark:border-white/5 border-gray-100 pb-4">My Bookings</h2>
              
              {loadingBookings ? (
                <div className="flex justify-center items-center py-20">
                  <Loader2 size={40} className="animate-spin text-[#d095af]" />
                </div>
              ) : bookings.length === 0 ? (
                <div className="flex flex-col items-center justify-center text-center py-20">
                  <div className="w-28 h-28 bg-[#f7edf2] dark:bg-[#231018] rounded-full flex items-center justify-center mb-6">
                    <Calendar size={56} className="text-[#d095af]" />
                  </div>
                  <h3 className="text-3xl font-bold dark:text-white text-gray-800">No Bookings Yet</h3>
                  <p className="text-gray-500 mt-4 mb-10 max-w-lg text-lg">You haven't booked any vendors yet. Start exploring to plan your perfect event!</p>
                  <Link to="/vendors" className="bg-[#b14e79] text-white px-8 py-4 rounded-full font-bold shadow-lg hover:bg-[#8e3e61] transition flex items-center gap-2 text-lg">
                    <Search size={24} /> Find Vendors
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {bookings.map((booking) => {
                    const statusConfig = {
                      pending:  { icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-50 border-yellow-200' },
                      accepted: { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50 border-green-200' },
                      rejected: { icon: XCircle, color: 'text-red-600', bg: 'bg-red-50 border-red-200' },
                    };
                    const StatusIcon = statusConfig[booking.status]?.icon || Clock;
                    const config = statusConfig[booking.status] || statusConfig.pending;

                    return (
                      <div key={booking._id} className="dark:bg-[#111622] bg-gray-50 rounded-2xl border dark:border-white/5 border-gray-100 p-6 flex flex-col md:flex-row gap-6 md:items-center justify-between hover:shadow-md transition">
                        <div>
                          <Link to={`/vendors/${booking.vendorId}`} className="text-xl font-bold dark:text-white text-gray-900 hover:text-[#b14e79] dark:hover:text-[#b14e79] hover:underline transition">
                            {booking.vendorName}
                          </Link>
                          <div className="flex items-center gap-4 mt-3 text-sm text-gray-600 dark:text-gray-400">
                            <span className="flex items-center gap-1.5"><Calendar size={16} className="text-[#d095af]" /> Event: <span className="font-bold dark:text-white text-gray-800">{new Date(booking.eventDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span></span>
                            <span className="text-gray-300 dark:text-gray-600">|</span>
                            <span className="flex items-center gap-1.5"><Clock size={16} className="text-gray-400" /> Requested: {new Date(booking.createdAt).toLocaleDateString()}</span>
                          </div>
                          {booking.message && (
                            <p className="mt-3 text-sm text-gray-500 dark:text-gray-400 italic dark:bg-[#0a0d14] bg-white p-3 rounded-xl border dark:border-white/5 border-gray-100">"{booking.message}"</p>
                          )}
                        </div>
                        
                        <div className="flex flex-col gap-3 items-end">
                          <div className={`px-4 py-2 flex items-center gap-2 rounded-xl border font-bold text-sm tracking-wide uppercase ${config.bg} ${config.color}`}>
                            <StatusIcon size={18} />
                            {booking.status}
                          </div>
                          
                          {booking.status === 'accepted' && (
                            <div className="flex gap-2 flex-col sm:flex-row mt-1">
                              <button
                                onClick={() => setActiveChatBooking(booking._id)}
                                className="flex items-center gap-1.5 bg-gradient-to-r from-[#b14e79] to-[#8e3e61] hover:from-[#8e3e61] hover:to-[#6b2f4a] text-white px-3 py-2 rounded-lg text-xs font-bold transition shadow-sm"
                              >
                                <MessageCircle size={14} /> Chat
                              </button>
                              <a href={`https://wa.me/${(booking.vendorPhone || '919876543210').replace(/\D/g, '')}`} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-lg text-xs font-bold transition shadow-sm">
                                <MessageSquare size={14} /> WhatsApp
                              </a>
                              <a href={`tel:${(booking.vendorPhone || '919876543210').replace(/\D/g, '')}`} className="flex items-center gap-1.5 dark:bg-white/10 dark:hover:bg-white/20 dark:text-white bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-2 rounded-lg text-xs font-bold transition shadow-sm">
                                <Phone size={14} /> Call
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* === FAVORITES TAB === */}
          {activeTab === 'favorites' && (
            <div className="animate-fade-in flex flex-col items-center justify-center text-center py-20">
              <div className="w-28 h-28 dark:bg-[#231018] bg-[#f7edf2] rounded-full flex items-center justify-center mb-6">
                <Heart size={56} className="text-[#d095af]" />
              </div>
              <h3 className="text-3xl font-bold dark:text-white text-gray-800">Your Wishlist is Empty</h3>
              <p className="text-gray-500 mt-4 mb-10 max-w-lg text-lg">Keep track of your favorite vendors by clicking the heart icon on their profile.</p>
              <Link to="/vendors" className="dark:bg-white dark:text-gray-900 bg-gray-900 text-white px-8 py-4 rounded-full font-bold shadow-lg hover:bg-gray-800 transition flex items-center gap-2 text-lg">
                Explore Services
              </Link>
            </div>
          )}

          {/* === SETTINGS TAB CONTENT === */}
          {activeTab === 'settings' && (
            <div className="animate-fade-in max-w-4xl">
              <h2 className="text-2xl font-bold dark:text-white text-gray-800 mb-8 border-b dark:border-white/5 border-gray-100 pb-4">Account Settings</h2>
              
              {/* Security Section */}
              <div className="dark:bg-[#111622] bg-gray-50 p-6 md:p-8 rounded-2xl border dark:border-white/5 border-gray-100 mb-8">
                <h3 className="text-xl font-bold dark:text-white text-gray-800 mb-2 flex items-center gap-2">
                  <Key size={22} className="text-[#b14e79]" /> Security & Password
                </h3>
                <p className="text-gray-500 mb-6">Keep your account secure by regularly updating your password.</p>
                <button 
                  onClick={() => toast("Password reset link sent to your email!", { icon: '📧' })} 
                  className="dark:bg-[#0a0d14] bg-white border border-[#e0b8c9] text-[#b14e79] dark:hover:bg-white/5 hover:bg-[#f7edf2] px-6 py-3 rounded-xl font-bold transition shadow-sm"
                >
                  Change Password
                </button>
              </div>

              {/* Danger Zone Section */}
              <div className="bg-red-50 p-6 md:p-8 rounded-2xl border border-red-100">
                <h3 className="text-xl font-bold text-red-700 mb-2 flex items-center gap-2">
                  <Trash2 size={22} /> Danger Zone
                </h3>
                <p className="text-red-600/80 mb-6">Once you delete your account, there is no going back. Please be certain.</p>
                <button 
                  onClick={() => toast.error("Account deletion requires admin approval currently.")} 
                  className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-bold transition shadow-sm"
                >
                  Delete Account
                </button>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Chat Modal */}
      {activeChatBooking && (
        <div className="fixed inset-0 bg-black/50 flex items-end md:items-center justify-center p-4 z-50">
          <Chat 
            bookingId={activeChatBooking}
            userId={user._id}
            userName={user.name}
            userRole="user"
            vendorName="Vendor"
            onClose={() => setActiveChatBooking(null)}
          />
        </div>
      )}
    </div>
  );
};

export default UserProfile;