import React, { useState, useEffect, useMemo } from 'react';
import { Star, MapPin, Search, Filter, IndianRupee, DollarSign, Euro, CheckCircle, SlidersHorizontal, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import baseUrl from '../../utils/api';

const getFallbackImage = (category) => {
  const cat = category?.toLowerCase().trim();
  if (cat === 'dj') return "https://images.unsplash.com/photo-1571266028243-371695039980?auto=format&fit=crop&q=80&w=800";
  if (cat === 'catering') return "https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&q=80&w=800";
  if (cat === 'lawn' || cat === 'marriage hall') return "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=800";
  if (cat === 'photographer') return "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=800";
  return "https://images.unsplash.com/photo-1514525253440-b39345208668?auto=format&fit=crop&q=80&w=800";
};

// Currency exchange rates (mock values for demo)
const EXCHANGE_RATES = {
  INR: 1,
  USD: 0.012, // 1 INR = ~0.012 USD
  EUR: 0.011, // 1 INR = ~0.011 EUR
};

const formatPrice = (priceInINR, currency) => {
  const converted = priceInINR * EXCHANGE_RATES[currency];
  
  if (currency === 'INR') return `₹${converted.toLocaleString('en-IN')}`;
  if (currency === 'USD') return `$${converted.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  if (currency === 'EUR') return `€${converted.toLocaleString('en-IE', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  return converted;
};

const VendorList = () => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filters State
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [maxPrice, setMaxPrice] = useState(500000);
  const [currency, setCurrency] = useState('INR');

  const vendorTypes = ['Venue', 'Hall', 'Lawn', 'Catering', 'DJ', 'Photographer', 'Decorator', 'Magician', 'CakeShop', 'Planner', 'Makeup'];

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const response = await fetch(`${baseUrl}/api/vendors`);
        const data = await response.json();
        setVendors(data);
        
        // Auto-set max price slider scale based on data
        if (data.length > 0) {
          const highest = Math.max(...data.map(v => v.price || 0));
          setMaxPrice(highest > 0 ? highest : 500000);
        }
      } catch (error) {
        console.error("Error fetching vendors:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchVendors();
  }, []);

  const toggleType = (type) => {
    setSelectedTypes(prev => 
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const filteredVendors = useMemo(() => {
    return vendors.filter(v => {
      const matchesSearch = v.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            v.location?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesType = selectedTypes.length === 0 || selectedTypes.includes(v.type);
      const matchesPrice = (v.price || 0) <= maxPrice;

      return matchesSearch && matchesType && matchesPrice;
    });
  }, [vendors, searchTerm, selectedTypes, maxPrice]);

  if (loading) return (
    <div className="dark:bg-[#05070a] bg-gray-50 min-h-screen flex justify-center items-center transition-colors duration-300">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#b14e79]"></div>
    </div>
  );

  return (
    <div className="dark:bg-[#05070a] bg-gray-50 dark:text-white text-gray-900 min-h-screen pb-20 transition-colors duration-300">
      
      {/* Header Banner */}
      <div className="dark:bg-[#111622] bg-white border-b dark:border-white/5 border-gray-200 py-16 px-6 relative overflow-hidden transition-colors duration-300">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#b14e79]/10 rounded-full blur-[100px] pointer-events-none -translate-y-1/2 translate-x-1/3"></div>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8 relative z-10">
          <div>
            <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tighter dark:text-white text-gray-900">Discover <span className="text-[#b14e79] italic font-serif">Excellence</span></h1>
            <p className="dark:text-gray-400 text-gray-500 text-lg max-w-xl font-medium">Browse our curated collection of elite event professionals, venues, and services.</p>
          </div>

          {/* Search Bar - Header */}
          <div className="w-full md:w-[450px]">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-[#b14e79] to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition-opacity"></div>
              <div className="relative dark:bg-[#0a0d14] bg-white border dark:border-white/10 border-gray-200 rounded-2xl flex items-center p-2 shadow-2xl transition-colors duration-300">
                <Search className="text-gray-500 ml-3" size={20} />
                <input 
                  type="text" 
                  placeholder="Ask for 'Mumbai DJs' or 'Venues'..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-transparent border-none dark:text-white text-gray-900 px-4 py-3 outline-none placeholder-gray-500 font-medium" 
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-12 flex flex-col lg:flex-row gap-10">
        
        {/* === FILTERS SIDEBAR === */}
        <div className="w-full lg:w-72 flex-shrink-0 space-y-8">
          
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-black tracking-tight flex items-center gap-2"><SlidersHorizontal size={20} className="text-[#b14e79]" /> Filters</h3>
            {/* Currency Toggle */}
            <div className="flex dark:bg-[#111622] bg-white border dark:border-white/5 border-gray-200 rounded-lg p-1 transition-colors duration-300">
              {['INR', 'USD', 'EUR'].map(curr => (
                <button 
                  key={curr}
                  onClick={() => setCurrency(curr)}
                  className={`px-2.5 py-1 text-xs font-bold rounded-md transition-all ${currency === curr ? 'bg-[#b14e79] text-white shadow-md' : 'text-gray-500 dark:hover:text-white hover:text-gray-900'}`}
                >
                  {curr === 'INR' ? '₹' : curr === 'USD' ? '$' : '€'}
                </button>
              ))}
            </div>
          </div>

          <div className="dark:bg-[#111622] bg-white border dark:border-white/5 border-gray-200 rounded-3xl p-6 shadow-xl transition-colors duration-300">
            {/* Type Filter */}
            <div className="mb-8">
              <h4 className="text-xs font-black uppercase tracking-[0.2em] text-gray-500 mb-4">Service Type</h4>
              <div className="space-y-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                {vendorTypes.map(type => (
                  <label key={type} className="flex items-center gap-3 cursor-pointer group">
                    <input 
                      type="checkbox" 
                      checked={selectedTypes.includes(type)}
                      onChange={() => toggleType(type)}
                      className="hidden"
                      id={`type-${type}`}
                    />
                    <div className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${selectedTypes.includes(type) ? 'bg-[#b14e79] border-[#b14e79]' : 'dark:border-white/20 border-gray-300 dark:group-hover:border-white/40 group-hover:border-gray-500 dark:bg-black/20 bg-gray-50'}`}>
                      {selectedTypes.includes(type) && <CheckCircle size={14} className="text-white" />}
                    </div>
                    <span className={`text-sm font-medium transition-colors ${selectedTypes.includes(type) ? 'dark:text-white text-gray-900' : 'text-gray-500 dark:group-hover:text-gray-200 group-hover:text-gray-800'}`}>{type}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="w-full h-px dark:bg-white/5 bg-gray-200 mb-8"></div>

            {/* Price Filter */}
            <div>
              <div className="flex justify-between items-end mb-4">
                <h4 className="text-xs font-black uppercase tracking-[0.2em] text-gray-500">Max Budget</h4>
                <span className="text-sm font-bold text-[#b14e79]">{formatPrice(maxPrice, currency)}</span>
              </div>
              <input 
                type="range" 
                min={0} 
                max={500000} 
                step={5000}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-[#b14e79] bg-white/10 rounded-lg h-1.5 appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-gray-600 font-bold mt-2 uppercase tracking-wide">
                <span>{formatPrice(0, currency)}</span>
                <span>{formatPrice(500000, currency)}+</span>
              </div>
            </div>

            {(selectedTypes.length > 0 || searchTerm || maxPrice < 500000) && (
              <button 
                onClick={() => { setSelectedTypes([]); setSearchTerm(''); setMaxPrice(500000); }}
                className="w-full mt-8 py-3 rounded-xl border dark:border-white/10 border-gray-200 text-xs font-bold text-gray-500 dark:hover:text-white hover:text-gray-900 dark:hover:bg-white/5 hover:bg-gray-100 transition-all tracking-wider uppercase"
              >
                Reset All Filters
              </button>
            )}
          </div>
        </div>

        {/* === VENDORS GRID === */}
        <div className="flex-1">
          <div className="mb-6 flex justify-between items-end">
            <h2 className="text-2xl font-bold dark:text-white text-gray-900">Showing Results</h2>
            <p className="text-gray-500 font-medium dark:bg-[#111622] bg-white px-4 py-1.5 rounded-full text-sm border dark:border-white/5 border-gray-200 shadow-sm transition-colors duration-300">
              <span className="dark:text-white text-gray-900 font-bold">{filteredVendors.length}</span> professionals found
            </p>
          </div>

          {filteredVendors.length === 0 ? (
            <div className="text-center py-32 dark:bg-[#111622] bg-white rounded-[2.5rem] border dark:border-white/5 border-gray-200 shadow-xl transition-colors duration-300">
              <Filter className="mx-auto text-gray-400 mb-4" size={56} />
              <h3 className="text-2xl font-bold mb-2 dark:text-white text-gray-900">No matches found</h3>
              <p className="text-gray-500 max-w-sm mx-auto">Try adjusting your filters, price range, or search terms to find what you're looking for.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredVendors.map((vendor) => {
                const imageUrl = (vendor.images && vendor.images.length > 0 && vendor.images[0]) 
                  ? vendor.images[0] 
                  : getFallbackImage(vendor.type);

                return (
                  <Link 
                    to={`/vendors/${vendor._id}`} 
                    key={vendor._id} 
                    className="group dark:bg-[#111622] bg-white rounded-[2rem] shadow-xl dark:shadow-none hover:shadow-[#b14e79]/10 transition-all duration-500 overflow-hidden border dark:border-white/5 border-gray-100 hover:border-[#b14e79]/30 flex flex-col h-full active:scale-[0.98]"
                  >
                    {/* Image */}
                    <div className="h-56 overflow-hidden relative">
                      <div className="absolute inset-0 bg-gradient-to-t dark:from-[#111622] from-white via-transparent to-transparent z-10 opacity-80 transition-colors duration-300"></div>
                      <img 
                        src={imageUrl}
                        alt={vendor.name} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                        onError={(e) => { e.target.onerror = null; e.target.src = getFallbackImage(vendor.type); }} 
                      />
                      <div className="absolute top-4 right-4 z-20 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-lg text-[10px] font-black text-white shadow-sm uppercase tracking-widest border border-white/10">
                        {vendor.type}
                      </div>
                      
                      <div className="absolute bottom-4 left-4 z-20 flex items-center gap-1.5 text-yellow-400 font-bold text-sm bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10">
                        <Star size={14} fill="currentColor" /> {vendor.rating || 4.5}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 md:p-8 flex flex-col flex-grow relative">
                      <h3 className="text-xl font-bold dark:text-white text-gray-900 line-clamp-1 mb-2 tracking-tight group-hover:text-[#b14e79] dark:group-hover:text-[#b14e79] transition-colors">{vendor.name}</h3>
                      <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm mb-6 gap-2 font-medium">
                        <MapPin size={16} className="text-[#b14e79]" /> {vendor.location}
                      </div>
                      
                      <div className="flex justify-between items-end pt-5 border-t dark:border-white/5 border-gray-100 mt-auto">
                        <div>
                          <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1">Starting at</p>
                          <div className="font-black dark:text-white text-gray-900 text-2xl tracking-tighter">
                            {formatPrice(vendor.price, currency)}
                          </div>
                        </div>
                        <div className="w-10 h-10 rounded-full dark:bg-white/5 bg-gray-100 flex items-center justify-center dark:text-gray-400 text-gray-500 group-hover:bg-[#b14e79] dark:group-hover:bg-[#b14e79] group-hover:text-white transition-all transform group-hover:translate-x-1">
                          <ArrowRight size={18} />
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VendorList;