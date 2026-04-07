import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Search, Star, MapPin, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import baseUrl from '../../utils/api';

const SubCategoryListing = () => {
  const { categoryName, serviceType } = useParams();
  const navigate = useNavigate();
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const listConfig = {
    cakeshop:    { color: 'text-pink-400',   bg: 'bg-pink-400',   title: 'Premium Cake Shops' },
    venue:       { color: 'text-yellow-400', bg: 'bg-yellow-400', title: 'Luxury Venues' },
    dj:          { color: 'text-blue-400',   bg: 'bg-blue-400',   title: 'Elite DJs' },
    hall:        { color: 'text-amber-400',  bg: 'bg-amber-400',  title: 'Grand Banquet Halls' },
    catering:    { color: 'text-orange-400', bg: 'bg-orange-400', title: 'Premium Caterers' },
    photographer:{ color: 'text-teal-400',   bg: 'bg-teal-400',   title: 'Expert Photographers' },
    decorator:   { color: 'text-purple-400', bg: 'bg-purple-400', title: 'Event Decorators' },
  };

  const currentConfig = listConfig[serviceType?.toLowerCase()] || { color: 'text-[#b14e79]', bg: 'bg-[#b14e79]', title: `Elite ${serviceType}s` };

  useEffect(() => {
    const fetchVendorsBySubCategory = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${baseUrl}/api/vendors`);
        const data = await res.json();
        const filtered = data.filter(v =>
          v.type.toLowerCase().trim() === serviceType.toLowerCase().trim()
        );
        setVendors(filtered);
      } catch (err) {
        console.error('Fetch error:', err);
        toast.error(`Could not connect to service: ${serviceType}`);
      } finally {
        setLoading(false);
      }
    };
    fetchVendorsBySubCategory();
  }, [serviceType]);

  // Client-side search filter
  const displayedVendors = vendors.filter(v =>
    v.name.toLowerCase().includes(search.toLowerCase()) ||
    v.location.toLowerCase().includes(search.toLowerCase())
  );


  return (
    <div className="bg-[#05070a] text-white min-h-screen">
      
      {/* --- MINIMALIST HEADER --- */}
      <section className="border-b border-white/5 bg-[#0a0d14]">
        <div className="px-6 md:px-20 lg:px-32 py-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div className="flex items-center gap-6">
            <button 
              onClick={() => navigate(`/category/${categoryName}`)} 
              className="bg-white/5 border border-white/10 p-3 rounded-full hover:bg-[#b14e79]/20 transition-all text-gray-500 hover:text-[#b14e79]"
            >
              <ArrowLeft size={22} />
            </button>
            <div>
              <p className="text-xs font-black uppercase tracking-[0.3em] text-gray-500 capitalize mb-1">{categoryName} Collection</p>
              <h1 className="text-4xl md:text-5xl font-black tracking-tighter capitalize italic font-serif text-[#b14e79]">{currentConfig.title}</h1>
              <p className="text-gray-500 mt-2">{displayedVendors.length} of {vendors.length} Verified Professionals Available</p>
            </div>
          </div>
          
          <div className="bg-[#111622] border border-white/5 p-4 rounded-2xl shadow-xl flex flex-1 max-w-md items-center gap-3 w-full">
            <Search className="text-gray-600" size={20} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={`Search by name or location...`}
              className="bg-transparent w-full outline-none text-sm py-2 text-white"
            />
          </div>
        </div>
      </section>

      {/* --- SERVICES GRID --- */}
      <section className="py-20 px-6 md:px-20 lg:px-32">
        {loading ? (
          <div className="text-center py-20 animate-pulse text-[#b14e79] font-black tracking-tighter text-2xl uppercase">Curating Excellence...</div>
        ) : vendors.length === 0 ? (
          <div className="text-center py-32 border border-dashed border-white/5 rounded-[3rem]">
            <p className="text-gray-600 font-medium italic">No premium vendors listed in this sub-category yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {displayedVendors.map((vendor) => (
              <div key={vendor._id} className="group bg-[#111622] rounded-[2.5rem] overflow-hidden border border-white/5 hover:border-[#b14e79]/30 transition-all duration-500">
                <div className="h-64 relative overflow-hidden">
                  <img src={vendor.images[0]} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt={vendor.name} />
                  <div className={`absolute top-5 right-5 bg-black/60 backdrop-blur-md px-4 py-1.5 rounded-2xl text-[10px] font-black tracking-[0.2em] uppercase border border-white/10 ${currentConfig.color}`}>
                    {vendor.type}
                  </div>
                </div>
                
                <div className="p-8">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-2xl font-black mb-2 tracking-tight text-white">{vendor.name}</h3>
                    <div className="flex items-center gap-1.5 text-yellow-500 bg-yellow-500/10 px-3 py-1.5 rounded-lg border border-yellow-500/20">
                      <Star size={14} fill="currentColor" />
                      <span className="text-xs font-bold">4.9</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 text-gray-500 text-sm mb-6">
                    <MapPin size={16} className={`${currentConfig.color}`} /> {vendor.location}
                  </div>

                  <div className="flex justify-between items-center pt-6 border-t border-white/5">
                    <div>
                      <p className="text-[10px] text-gray-600 uppercase font-black tracking-widest mb-1">Starting From</p>
                      <span className="text-2xl font-black text-white">₹{vendor.price}</span>
                    </div>
                    <button onClick={() => navigate(`/vendors/${vendor._id}`)} className={`px-8 py-3 rounded-2xl font-bold text-sm text-white hover:scale-105 transition-all shadow-xl shadow-black/20 ${currentConfig.bg} hover:brightness-110`}>
                      Explore
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default SubCategoryListing;