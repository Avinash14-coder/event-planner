import React, { useEffect, useState } from 'react';
import { CalendarDays, User, Mail, Phone, MessageSquare, CheckCircle, XCircle, Clock, MessageCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import baseUrl from '../../utils/api';
import Chat from '../../components/Chat';

const STATUS_CONFIG = {
  pending:  { label: 'Pending',  icon: Clock,        color: 'text-yellow-400', bg: 'bg-yellow-400/10 border-yellow-400/20' },
  accepted: { label: 'Accepted', icon: CheckCircle,  color: 'text-green-400',  bg: 'bg-green-400/10 border-green-400/20'  },
  rejected: { label: 'Rejected', icon: XCircle,      color: 'text-red-400',    bg: 'bg-red-400/10 border-red-400/20'      },
};

const VendorBookings = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [activeChatBooking, setActiveChatBooking] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      if (!user?._id) return;
      try {
        // Fetch all services for this vendor first, then bookings per service
        const servicesRes = await fetch(`${baseUrl}/api/vendors/my-services/${user._id}`);
        const services = await servicesRes.json();

        // Collect all bookings for all vendor's service listings
        const allBookings = [];
        await Promise.all(services.map(async (svc) => {
          const res = await fetch(`${baseUrl}/api/bookings/vendor/${svc._id}`);
          const data = await res.json();
          if (Array.isArray(data)) allBookings.push(...data.map(b => ({ ...b, serviceName: svc.name })));
        }));

        // Sort newest first
        allBookings.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setBookings(allBookings);
      } catch (err) {
        console.error('Error fetching bookings', err);
        toast.error('Could not load bookings.');
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, [user?._id]);

  const updateStatus = async (id, status) => {
    try {
      const res = await fetch(`${baseUrl}/api/bookings/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setBookings(prev => prev.map(b => b._id === id ? { ...b, status } : b));
        toast.success(`Request ${status}!`);
      } else {
        toast.error('Failed to update status.');
      }
    } catch {
      toast.error('Server error.');
    }
  };

  const filtered = filter === 'all' ? bookings : bookings.filter(b => b.status === filter);

  const counts = {
    all: bookings.length,
    pending: bookings.filter(b => b.status === 'pending').length,
    accepted: bookings.filter(b => b.status === 'accepted').length,
    rejected: bookings.filter(b => b.status === 'rejected').length,
  };

  return (
    <div className="min-h-screen dark:bg-[#05070a] bg-gray-50 transition-colors duration-300 py-8 md:py-12">
      <div className="container mx-auto px-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-black dark:text-white text-gray-900 tracking-tight">Booking Requests</h1>
        <p className="dark:text-gray-400 text-gray-700 mt-1">Manage incoming reservation requests from customers</p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-8 flex-wrap">
        {['all', 'pending', 'accepted', 'rejected'].map(tab => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-5 py-2 rounded-xl font-bold text-sm capitalize transition-all ${
              filter === tab
                ? 'bg-[#b14e79] text-white shadow-lg shadow-[#b14e79]/20'
                : 'dark:bg-[#111622] bg-white dark:text-gray-400 text-gray-700 border dark:border-white/10 border-gray-300 dark:hover:border-[#b14e79] hover:border-[#b14e79] hover:text-[#b14e79] dark:hover:text-[#b14e79]'
            }`}
          >
            {tab} {counts[tab] > 0 && <span className={`ml-1 text-xs px-1.5 py-0.5 rounded-full ${filter === tab ? 'bg-white/20' : 'dark:bg-[#05070a] bg-gray-100'}`}>{counts[tab]}</span>}
          </button>
        ))}
      </div>

      {/* Bookings List */}
      {loading ? (
        <div className="text-center py-20 text-[#b14e79] font-bold animate-pulse">Loading requests...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 dark:bg-[#111622] bg-white rounded-2xl border-2 border-dashed dark:border-white/10 border-gray-300 transition-colors">
          <CalendarDays size={48} className="dark:text-gray-600 text-gray-400 mx-auto mb-4" />
          <p className="dark:text-gray-500 text-gray-700 font-medium">No {filter !== 'all' ? filter : ''} booking requests yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((booking) => {
            const cfg = STATUS_CONFIG[booking.status];
            const StatusIcon = cfg.icon;
            return (
              <div key={booking._id} className="dark:bg-[#111622] bg-white rounded-2xl border dark:border-white/10 border-gray-300 shadow-sm hover:shadow-md transition-all p-6">
                <div className="flex flex-col md:flex-row md:items-start gap-6">

                  {/* Left: Customer Info */}
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full dark:bg-white/5 bg-pink-100 flex items-center justify-center text-[#b14e79] font-black text-xl flex-shrink-0">
                        {booking.userName?.[0]?.toUpperCase()}
                      </div>
                      <div>
                        <h3 className="font-bold dark:text-white text-gray-900 text-lg">{booking.userName}</h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">for: <span className="text-[#b14e79]">{booking.serviceName || booking.vendorName}</span></p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm dark:text-gray-400 text-gray-700">
                      <div className="flex items-center gap-2"><Mail size={14} className="text-[#b14e79] flex-shrink-0" />{booking.userEmail}</div>
                      {booking.userPhone && <div className="flex items-center gap-2"><Phone size={14} className="text-[#b14e79] flex-shrink-0" />{booking.userPhone}</div>}
                      <div className="flex items-center gap-2"><CalendarDays size={14} className="text-[#b14e79] flex-shrink-0" /><span className="font-semibold dark:text-gray-300 text-gray-800">{new Date(booking.eventDate).toLocaleDateString('en-IN', { day:'numeric', month:'long', year:'numeric' })}</span></div>
                      <div className="flex items-center gap-2 text-xs dark:text-gray-500 text-gray-600"><Clock size={12} />Received {new Date(booking.createdAt).toLocaleDateString('en-IN')}</div>
                    </div>

                    {booking.message && (
                      <div className="flex items-start gap-2 dark:bg-[#0a0d14] bg-gray-50 p-3 rounded-xl border dark:border-white/10 border-gray-300 transition-colors">
                        <MessageSquare size={14} className="text-[#b14e79] mt-0.5 flex-shrink-0" />
                        <p className="text-sm dark:text-gray-400 text-gray-700 italic">"{booking.message}"</p>
                      </div>
                    )}
                  </div>

                  {/* Right: Status + Actions */}
                  <div className="flex flex-col items-end gap-3 flex-shrink-0">
                    {/* Status Badge */}
                    <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-black uppercase tracking-wider ${cfg.bg} ${cfg.color}`}>
                      <StatusIcon size={13} />
                      {cfg.label}
                    </div>

                    {/* Actions - only for pending */}
                    {booking.status === 'pending' && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => updateStatus(booking._id, 'accepted')}
                          className="flex items-center gap-1.5 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-xl font-bold text-sm transition-all active:scale-95"
                        >
                          <CheckCircle size={16} /> Accept
                        </button>
                        <button
                          onClick={() => updateStatus(booking._id, 'rejected')}
                          className="flex items-center gap-1.5 bg-red-50 hover:bg-red-100 text-red-500 px-4 py-2 rounded-xl font-bold text-sm border border-red-100 transition-all active:scale-95"
                        >
                          <XCircle size={16} /> Reject
                        </button>
                      </div>
                    )}

                    {/* Contact Actions - for accepted */}
                    {booking.status === 'accepted' && (
                      <div className="flex gap-2 mt-1 flex-col sm:flex-row">
                        <button
                          onClick={() => setActiveChatBooking(booking._id)}
                          className="flex items-center gap-1.5 bg-gradient-to-r from-[#b14e79] to-[#8e3e61] hover:from-[#8e3e61] hover:to-[#6b2f4a] text-white px-4 py-2 rounded-xl font-bold text-sm transition-all shadow-sm"
                        >
                          <MessageCircle size={16} /> Chat
                        </button>
                        <a href={`https://wa.me/${(booking.userPhone || '919876543210').replace(/\D/g, '')}`} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-xl font-bold text-sm transition-all shadow-sm">
                          <MessageSquare size={16} /> WhatsApp
                        </a>
                        <a href={`tel:${(booking.userPhone || '919876543210').replace(/\D/g, '')}`} className="flex items-center gap-1.5 dark:bg-white/10 dark:hover:bg-white/20 dark:text-white bg-gray-200 hover:bg-gray-300 text-gray-900 px-4 py-2 rounded-xl font-bold text-sm transition-all shadow-sm">
                          <Phone size={16} /> Call
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
      </div>

      {/* Chat Modal */}
      {activeChatBooking && (
        <div className="fixed inset-0 bg-black/50 flex items-end md:items-center justify-center p-4 z-50">
          <Chat 
            bookingId={activeChatBooking}
            userId={user._id}
            userName={user.name}
            userRole="vendor"
            vendorName="Client"
            onClose={() => setActiveChatBooking(null)}
          />
        </div>
      )}
    </div>
  );
};

export default VendorBookings;
