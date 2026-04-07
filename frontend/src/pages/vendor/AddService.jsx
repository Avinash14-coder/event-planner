import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Camera, MapPin, Tag, IndianRupee, FileText, Upload } from 'lucide-react';
import baseUrl from '../../utils/api';

const AddService = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);

  const [formData, setFormData] = useState({
    name: '', 
    type: '', // Starts empty to force a selection
    price: '', 
    location: '', 
    description: ''
  });

  // Count words in description
  const countWords = (text) => {
    return text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
  };

  // Fixed the function name to match your dropdown call
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Limit description to 200 words
    if (name === 'description') {
      const wordCount = countWords(value);
      if (wordCount > 200) {
        return; // Don't update if exceeds 200 words
      }
    }
    
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.type) return toast.error("Please select a service category");
    
    setLoading(true);
    const user = JSON.parse(localStorage.getItem('user'));
    
    const data = new FormData();
    data.append('name', formData.name);
    data.append('type', formData.type);
    data.append('price', formData.price);
    data.append('location', formData.location);
    data.append('description', formData.description);
    data.append('ownerId', user._id);
    if (file) data.append('image', file);

    try {
      const response = await fetch(`${baseUrl}/api/vendors`, {
        method: 'POST',
        body: data
      });

      if (response.ok) {
        toast.success("Service Published Successfully!");
        navigate('/vendor/dashboard');
      } else {
        toast.error("Failed to save service.");
      }
    } catch (error) {
      toast.error("Server error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen dark:bg-[#05070a] bg-gray-50 transition-colors duration-300 py-8 md:py-12">
      <div className="max-w-4xl mx-auto dark:bg-[#111622] bg-white p-8 md:p-12 rounded-3xl border dark:border-white/10 border-gray-300 shadow-lg transition-colors duration-300">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-black dark:text-white text-gray-900 tracking-tighter uppercase italic">
          Publish <span className="text-[#b14e79]">New Service</span>
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2 font-medium tracking-wide">Enter the details of your premium event offering.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Service Name */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest dark:text-gray-400 text-gray-700 ml-2">
            <Tag size={14} className="text-[#b14e79]"/> Service Name
          </label>
          <input 
            name="name" 
            required 
            onChange={handleChange} 
            className="w-full dark:bg-[#0a0d14] bg-gray-50 border dark:border-white/10 border-gray-300 dark:text-white text-gray-900 rounded-2xl p-5 outline-none focus:border-[#b14e79] dark:focus:border-[#b14e79] focus:ring-4 focus:ring-[#b14e79]/10 focus:bg-white dark:focus:bg-[#0a0d14] transition-all font-medium" 
            placeholder="e.g. Royal Wedding Photography Package" 
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Service Category Dropdown */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest dark:text-gray-400 text-gray-700 ml-2">
              <Camera size={14} className="text-[#b14e79]"/> Category
            </label>
            <div className="relative">
              <select
                name="type" 
                value={formData.type}
                onChange={handleChange} 
                required
                className="w-full dark:bg-[#0a0d14] bg-gray-50 border dark:border-white/10 border-gray-300 dark:text-white text-gray-900 rounded-2xl p-5 outline-none focus:border-[#b14e79] focus:ring-4 focus:ring-[#b14e79]/10 focus:bg-white dark:focus:bg-[#0a0d14] transition-all appearance-none cursor-pointer font-medium"
              >
                <option value="" disabled className="text-gray-600">-- Choose Category --</option>
                <optgroup label="Events & Venues" className="dark:bg-[#05070a] bg-white text-[#b14e79] font-bold">
                  <option value="Venue" className="dark:text-white text-gray-900">Venues / Banquet Halls</option>
                  <option value="Lawn" className="dark:text-white text-gray-900">Garden Lawns</option>
                  <option value="Catering" className="dark:text-white text-gray-900">Catering Services</option>
                </optgroup>
                <optgroup label="Specialists" className="dark:bg-[#05070a] bg-white text-[#b14e79] font-bold">
                  <option value="Photographer" className="dark:text-white text-gray-900">Photographer</option>
                  <option value="DJ" className="dark:text-white text-gray-900">DJ / Music System</option>
                  <option value="CakeShop" className="dark:text-white text-gray-900">Cake Shop</option>
                  <option value="Decorator" className="dark:text-white text-gray-900">Event Decorator</option>
                  <option value="Magician" className="dark:text-white text-gray-900">Magician / Entertainer</option>
                </optgroup>
              </select>
              <div className="absolute inset-y-0 right-5 flex items-center pointer-events-none text-[#b14e79]">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
              </div>
            </div>
          </div>

          {/* Price */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest dark:text-gray-400 text-gray-700 ml-2">
              <IndianRupee size={14} className="text-[#b14e79]"/> Price (₹)
            </label>
            <input 
              name="price" 
              required 
              type="number" 
              onChange={handleChange} 
              className="w-full dark:bg-[#0a0d14] bg-gray-50 border dark:border-white/10 border-gray-300 dark:text-white text-gray-900 rounded-2xl p-5 outline-none focus:border-[#b14e79] focus:ring-4 focus:ring-[#b14e79]/10 focus:bg-white dark:focus:bg-[#0a0d14] transition-all font-medium" 
              placeholder="0.00"
            />
          </div>
        </div>

        {/* Location */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest dark:text-gray-400 text-gray-700 ml-2">
            <MapPin size={14} className="text-[#b14e79]"/> Location
          </label>
          <input 
            name="location" 
            required 
            onChange={handleChange} 
            className="w-full dark:bg-[#0a0d14] bg-gray-50 border dark:border-white/10 border-gray-300 dark:text-white text-gray-900 rounded-2xl p-5 outline-none focus:border-[#b14e79] focus:ring-4 focus:ring-[#b14e79]/10 focus:bg-white dark:focus:bg-[#0a0d14] transition-all font-medium" 
            placeholder="e.g. Nashik, Maharashtra"
          />
        </div>

        {/* Description */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest dark:text-gray-400 text-gray-700 ml-2">
              <FileText size={14} className="text-[#b14e79]"/> Description
            </label>
            <span className={`text-xs font-bold tracking-wide ${countWords(formData.description) > 180 ? 'text-orange-500' : countWords(formData.description) > 190 ? 'text-red-500' : 'text-[#b14e79]'}`}>
              {countWords(formData.description)}/200 words
            </span>
          </div>
          <textarea 
            name="description" 
            required 
            value={formData.description}
            onChange={handleChange} 
            className="w-full dark:bg-[#0a0d14] bg-gray-50 border dark:border-white/10 border-gray-300 dark:text-white text-gray-900 rounded-2xl p-5 outline-none focus:border-[#b14e79] dark:focus:border-[#b14e79] focus:ring-4 focus:ring-[#b14e79]/10 focus:bg-white dark:focus:bg-[#0a0d14] transition-all font-medium min-h-[150px] resize-none" 
            placeholder="Describe your premium service in detail..."
          ></textarea>
          <p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium ml-2">Maximum 200 words allowed</p>
        </div>
        
        {/* File Upload Section */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest dark:text-gray-400 text-gray-700 ml-2">
            <Upload size={14} className="text-[#b14e79]"/> Service Cover Image
          </label>
          <div className="relative group">
            <input 
              type="file" 
              required 
              onChange={handleFileChange} 
              accept="image/*" 
              className="w-full dark:bg-[#0a0d14] bg-gray-50 border border-dashed dark:border-white/20 border-gray-400 text-gray-400 rounded-2xl p-10 cursor-pointer file:hidden text-center hover:border-[#b14e79] dark:hover:border-[#b14e79] focus:bg-white dark:focus:bg-[#0a0d14] transition-all" 
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <Upload className="text-[#b14e79] mb-2" size={32} />
              <p className="text-sm font-bold dark:text-gray-300 text-gray-800">
                {file ? file.name : "Drop your image here or click to browse"}
              </p>
            </div>
          </div>
        </div>

        <button 
          type="submit" 
          disabled={loading} 
          className="w-full bg-[#b14e79] hover:bg-[#8e3e61] text-white font-black py-5 rounded-2xl shadow-xl shadow-[#b14e79]/20 transition-all active:scale-95 text-lg uppercase tracking-widest"
        >
          {loading ? 'PUBLISHING EXCELLENCE...' : 'Publish Service'}
        </button>
      </form>
      </div>
    </div>
  );
};

export default AddService;