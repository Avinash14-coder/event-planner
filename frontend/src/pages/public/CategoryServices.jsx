import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Search, Star, MapPin, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";

const CategoryServices = () => {
  const { categoryName } = useParams();
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  const baseUrl = window.location.hostname === "localhost" 
    ? "http://localhost:5000" 
    : "https://event-planner-86ju.onrender.com";

  // Dynamic Content mapping based on user-provided references
  const config = {
    wedding: { color: "text-yellow-400", bg: "bg-yellow-400", hero: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3", tag: "Premium Selection" },
    birthday: { color: "text-pink-500", bg: "bg-pink-500", hero: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d", tag: "Party Special" },
    reception: { color: "text-purple-500", bg: "bg-purple-500", hero: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622", tag: "Grand Celebration" },
    anniversary: { color: "text-rose-500", bg: "bg-rose-500", hero: "https://images.unsplash.com/photo-1520857014576-2c4f4c972b57", tag: "Timeless Romance" },
    bachelor: { color: "text-indigo-500", bg: "bg-indigo-500", hero: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30", tag: "Epic Night" },
    dj: { color: "text-blue-500", bg: "bg-blue-500", hero: "https://images.unsplash.com/photo-1571266028243-371695039980", tag: "High Energy" }
  };

  const current = config[categoryName?.toLowerCase()] || config.wedding;

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch(`${baseUrl}/api/vendors`);
        const data = await response.json();
        // Filters services matching the current URL category
        const filtered = data.filter(v => v.type.toLowerCase() === categoryName?.toLowerCase());
        setServices(filtered);
      } catch (error) {
        toast.error("Failed to load premium services");
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, [categoryName, baseUrl]);

  return (
    <div className="min-h-screen bg-[#05070a] text-white">
      {/* --- 3D PARALLAX HERO --- */}
      <div className="relative h-[50vh] w-full overflow-hidden">
        <img src={current.hero} className="absolute inset-0 w-full h-full object-cover scale-110 animate-slow-zoom" alt={categoryName} />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/60 to-[#05070a]" />
        
        <button onClick={() => navigate('/')} className="absolute top-8 left-8 z-20 bg-white/10 backdrop-blur-md p-3 rounded-full hover:bg-[#b14e79] transition-all">
          <ArrowLeft size={24} />
        </button>

        <div className="absolute bottom-10 left-8 md:left-20 z-10">
          <p className={`text-xs tracking-[0.4em] font-black uppercase mb-2 ${current.color}`}>
            {current.tag}
          </p>
          <h1 className="text-5xl md:text-7xl font-black capitalize tracking-tighter">
            {categoryName} <span className="italic font-light font-serif text-gray-400 text-4xl">Services</span>
          </h1>
          <p className="text-gray-400 mt-2">{services.length} Premium Professionals Available</p>
        </div>
      </div>

      {/* --- PREMIUM FILTER & SEARCH --- */}
      <div className="px-6 md:px-20 lg:px-32 -mt-8 relative z-20">
        <div className="bg-[#111622] border border-white/5 p-4 rounded-2xl shadow-2xl flex flex-col md:flex-row gap-4 items-center">
          <div className="flex-1 flex items-center gap-3 w-full px-4">
            <Search className="text-gray-500" size={20} />
            <input placeholder={`Find ${categoryName} venues, artists, or planners...`} className="bg-transparent w-full outline-none text-sm py-2" />
          </div>
          <div className="flex gap-2 w-full md:w-auto overflow-x-auto no-scrollbar">
            {["All Services", "Luxury", "Outdoor", "Indoor"].map(f => (
              <button key={f} className="px-5 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-bold hover:bg-[#b14e79] transition-all">
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* --- SERVICES GRID --- */}
      <div className="py-16 px-6 md:px-20 lg:px-32">
        {loading ? (
          <div className="text-center py-20 animate-pulse text-[#b14e79] font-bold uppercase tracking-widest">Curating Your Experience...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {services.map((vendor) => (
              <div key={vendor._id} className="group bg-[#0a0d14] rounded-[2rem] overflow-hidden border border-white/5 hover:border-[#b14e79]/40 transition-all duration-500 shadow-2xl">
                <div className="h-72 relative overflow-hidden">
                  <img src={vendor.images[0]} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={vendor.name} />
                  <div className="absolute top-5 right-5 bg-black/60 backdrop-blur-md px-4 py-2 rounded-2xl text-[10px] font-black tracking-widest uppercase border border-white/10">
                    {vendor.type}
                  </div>
                </div>
                
                <div className="p-8">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-2xl font-bold tracking-tight">{vendor.name}</h3>
                    <div className="flex items-center gap-1 text-yellow-500 bg-yellow-500/10 px-2 py-1 rounded-lg">
                      <Star size={14} fill="currentColor" />
                      <span className="text-xs font-bold">4.9</span>
                    </div>
                  </div>
                  
                  <p className="text-gray-500 text-sm mb-6 flex items-center gap-2">
                    <MapPin size={16} className={current.color} /> {vendor.location}
                  </p>

                  <div className="flex justify-between items-center pt-6 border-t border-white/5">
                    <div>
                      <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-1">Starting From</p>
                      <span className="text-2xl font-black text-white">₹{vendor.price}</span>
                    </div>
                    <button onClick={() => navigate(`/vendors/${vendor._id}`)} className={`px-8 py-3 rounded-2xl font-bold text-sm hover:scale-105 transition-all ${current.bg} text-white shadow-xl shadow-black/20`}>
                      Explore
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryServices;