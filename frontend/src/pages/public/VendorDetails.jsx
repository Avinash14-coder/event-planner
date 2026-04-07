import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Star, Phone, ArrowLeft, CheckCircle, X, CalendarDays, MessageSquare, Send } from 'lucide-react';
import toast from 'react-hot-toast';
import baseUrl from '../../utils/api';

const getFallbackImage = (category) => {
  const cat = category?.toLowerCase().trim();
  if (cat === 'dj') return "https://images.unsplash.com/photo-1571266028243-371695039980?q=80&w=1200";
  if (cat === 'catering') return "https://images.unsplash.com/photo-1555244162-803834f70033?q=80&w=1200";
  if (cat === 'lawn') return "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=1200";
  if (cat === 'photographer') return "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1200";
  return "https://images.unsplash.com/photo-1514525253440-b39345208668?q=80&w=1200";
};

const VendorDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(true);

  // Booking modal state
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [bookingForm, setBookingForm] = useState({ eventDate: '', message: '' });

  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const fetchVendor = async () => {
      try {
        const response = await fetch(`${baseUrl}/api/vendors/${id}`);
        const data = await response.json();
        setVendor(data);
      } catch (error) {
        console.error('Error', error);
      } finally {
        setLoading(false);
      }
    };
    fetchVendor();
  }, [id]);

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please login to send a booking request.');
      navigate('/login');
      return;
    }
    if (!bookingForm.eventDate) return toast.error('Please select an event date.');

    setSubmitting(true);
    try {
      const res = await fetch(`${baseUrl}/api/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user._id,
          userName: user.name,
          userEmail: user.email,
          userPhone: user.phone || '',
          vendorId: vendor._id,
          vendorName: vendor.name,
          vendorPhone: vendor.contact?.phone || vendor.phone || '',
          eventDate: bookingForm.eventDate,
          message: bookingForm.message,
        }),
      });
      if (res.ok) {
        toast.success('🎉 Booking request sent to vendor!');
        setShowModal(false);
        setBookingForm({ eventDate: '', message: '' });
      } else {
        toast.error('Failed to send request. Try again.');
      }
    } catch (err) {
      toast.error('Server error.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="min-h-screen bg-[#05070a] flex items-center justify-center text-[#b14e79] font-bold text-xl animate-pulse">Curating Details...</div>;
  if (!vendor) return <div className="min-h-screen bg-[#05070a] flex items-center justify-center text-white">Vendor not found</div>;

  const heroImage = (vendor.images && vendor.images.length > 0 && vendor.images[0]) ? vendor.images[0] : getFallbackImage(vendor.type);

  return (
    <div className="bg-[#05070a] min-h-screen text-white pb-20">
      {/* --- HERO --- */}
      <div className="h-[50vh] md:h-[65vh] w-full relative overflow-hidden">
        <img src={heroImage} className="w-full h-full object-cover scale-105 animate-slow-zoom" alt={vendor.name} />
        <div className="absolute inset-0 bg-gradient-to-t from-[#05070a] via-[#05070a]/40 to-transparent"></div>
        <div className="absolute top-8 left-8 flex gap-4 z-20">
          <button onClick={() => navigate(-1)} className="bg-black/40 backdrop-blur-md p-3 rounded-full hover:bg-[#b14e79] transition-all">
            <ArrowLeft size={24} />
          </button>
        </div>
      </div>

      {/* --- CONTENT --- */}
      <div className="max-w-6xl mx-auto px-6 -mt-24 relative z-10">
        <div className="bg-[#111622] rounded-[3rem] p-8 md:p-12 border border-white/5 shadow-2xl">
          <div className="flex flex-col lg:flex-row justify-between items-start gap-12">

            <div className="flex-1">
              <span className="bg-[#b14e79]/20 text-[#b14e79] px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-[0.2em] border border-[#b14e79]/20">
                {vendor.type}
              </span>
              <h1 className="text-4xl md:text-6xl font-black mt-6 mb-4 tracking-tighter">{vendor.name}</h1>
              <div className="flex flex-wrap gap-6 text-gray-400 mb-8 font-medium">
                <div className="flex items-center gap-2"><MapPin size={20} className="text-[#b14e79]" /> {vendor.location}</div>
                <div className="flex items-center gap-2 text-yellow-500 font-bold"><Star size={20} fill="currentColor" /> {vendor.rating || 4.5} (Verified)</div>
              </div>
              <div className="border-t border-white/5 pt-8">
                <h3 className="text-xl font-bold mb-4 uppercase tracking-tight">Experience Description</h3>
                <p className="text-gray-400 leading-relaxed text-lg">{vendor.description}</p>
              </div>
            </div>

            {/* Booking Card */}
            <div className="bg-[#0a0d14] p-8 rounded-[2.5rem] border border-white/5 w-full lg:w-96 shadow-2xl flex-shrink-0">
              <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.2em] mb-2 text-center">Starting Experience From</p>
              <h2 className="text-5xl font-black text-white text-center mb-8 tracking-tighter">₹{vendor.price}</h2>

              <button
                onClick={() => setShowModal(true)}
                className="w-full bg-[#b14e79] hover:bg-[#8e3e61] text-white py-5 rounded-2xl font-bold shadow-xl shadow-[#b14e79]/20 transition-all active:scale-95 mb-4"
              >
                Book Service
              </button>
              {/* <button
                onClick={() => setShowModal(true)}
                className="w-full bg-white/5 border border-white/10 text-white py-4 rounded-2xl font-bold hover:bg-white/10 transition-all"
              >
                Check Availability
              </button> */}

              <div className="mt-8 pt-8 border-t border-white/5 space-y-5">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#b14e79]/10 rounded-2xl flex items-center justify-center text-[#b14e79]"><Phone size={22} /></div>
                  <div>
                    <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Inquiry Line</p>
                    <p className="font-bold text-gray-200">{vendor.contact?.phone || '+91 98765 43210'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Features Grid */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {['Verified Elite', 'Best Rate', 'Concierge Support', 'Instant Confirmation'].map((f, i) => (
              <div key={i} className="flex items-center gap-4 bg-white/5 p-5 rounded-3xl border border-white/5">
                <CheckCircle className="text-[#b14e79]" size={24} />
                <span className="font-bold text-gray-300 text-sm tracking-tight">{f}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* --- BOOKING MODAL --- */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#111622] border border-white/10 rounded-[2rem] w-full max-w-lg p-8 shadow-2xl animate-fade-in">
            {/* Modal Header */}
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-2xl font-black text-white tracking-tight">Reserve a Date</h3>
                <p className="text-gray-500 text-sm mt-1">Sending request to <span className="text-[#b14e79] font-bold">{vendor.name}</span></p>
              </div>
              <button onClick={() => setShowModal(false)} className="text-gray-600 hover:text-white p-2 rounded-full hover:bg-white/10 transition-all">
                <X size={22} />
              </button>
            </div>

            <form onSubmit={handleBookingSubmit} className="space-y-5">
              {/* User info display */}
              {user && (
                <div className="bg-white/5 border border-white/5 rounded-2xl p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#b14e79]/20 flex items-center justify-center text-[#b14e79] font-black text-lg">
                    {user.name?.[0]?.toUpperCase()}
                  </div>
                  <div>
                    <p className="text-white font-bold text-sm">{user.name}</p>
                    <p className="text-gray-500 text-xs">{user.email}</p>
                  </div>
                </div>
              )}

              {/* Event Date */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-500">
                  <CalendarDays size={14} className="text-[#b14e79]" /> Event Date
                </label>
                <input
                  type="date"
                  required
                  min={new Date().toISOString().split('T')[0]}
                  value={bookingForm.eventDate}
                  onChange={(e) => setBookingForm({ ...bookingForm, eventDate: e.target.value })}
                  className="w-full bg-[#0a0d14] border border-white/10 text-white rounded-2xl p-4 outline-none focus:border-[#b14e79] focus:ring-4 focus:ring-[#b14e79]/10 transition-all font-medium"
                />
              </div>

              {/* Message */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-500">
                  <MessageSquare size={14} className="text-[#b14e79]" /> Message to Vendor (optional)
                </label>
                <textarea
                  rows={3}
                  value={bookingForm.message}
                  onChange={(e) => setBookingForm({ ...bookingForm, message: e.target.value })}
                  placeholder="Describe your event, guest count, special requirements..."
                  className="w-full bg-[#0a0d14] border border-white/10 text-white rounded-2xl p-4 outline-none focus:border-[#b14e79] focus:ring-4 focus:ring-[#b14e79]/10 transition-all font-medium resize-none"
                />
              </div>

              {/* Price summary */}
              <div className="bg-[#b14e79]/10 border border-[#b14e79]/20 rounded-2xl p-4 flex items-center justify-between">
                <span className="text-gray-400 text-sm font-medium">Starting Price</span>
                <span className="text-[#b14e79] font-black text-xl">₹{vendor.price}</span>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-[#b14e79] hover:bg-[#8e3e61] text-white font-black py-4 rounded-2xl shadow-xl shadow-[#b14e79]/20 transition-all active:scale-95 flex items-center justify-center gap-3 disabled:opacity-60"
              >
                <Send size={18} />
                {submitting ? 'Sending Request...' : 'Send Booking Request'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorDetails;