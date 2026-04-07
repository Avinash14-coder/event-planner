import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import eventraLogo from '../../assets/eventra_logo.png';

const Login = ({ onLogin }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('user');
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const availableRoles = isLoginMode ? ['user', 'vendor', 'admin'] : ['user', 'vendor'];

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    const endpoint = isLoginMode ? '/api/auth/login' : '/api/auth/signup';
    
    // FIX 1: Dynamic URL checks if you are running locally or on Vercel
    const baseUrl = window.location.hostname === "localhost" 
      ? "http://localhost:5000" 
      : "https://event-planner-1kse.onrender.com";
    
    try {
      const response = await fetch(`${baseUrl}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, role: activeTab }),
      });

      const data = await response.json();

      if (response.ok) {
        if (isLoginMode) {
          toast.success(`Welcome back, ${data.user.name}!`);
          onLogin(data.user);
          if (data.user.role === 'vendor') navigate('/vendor/dashboard');
          else if (data.user.role === 'admin') navigate('/admin/dashboard');
          else navigate('/vendors');
        } else {
          toast.success("Account Created! Please Login.");
          setIsLoginMode(true);
          setFormData({ name: '', email: '', password: '' });
        }
      } else {
        setErrorMessage(data.error || "Authentication failed.");
      }
    } catch (error) {
      setErrorMessage("Server not reachable. Is your local backend running?");
    } finally {
      // FIX 2: This guarantees the button stops spinning even if it crashes
      setLoading(false);
    }
  };

  return (
    // THEME UPDATE: Unified Brand Gradient Background
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-[#f7edf2] via-white to-[#faf5f8] dark:bg-gradient-to-br dark:from-[#05070a] dark:via-[#0a0d14] dark:to-[#111622] transition-colors duration-500">
      
      {/* GLASSMORPHISM CARD */}
      <div className="dark:bg-[#0a0d14]/95 bg-white/90 backdrop-blur-xl shadow-2xl rounded-3xl w-full max-w-lg overflow-hidden border dark:border-white/10 border-white/50 relative">
        
        {/* THEME UPDATE: Decorative Top Shape */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#b14e79] to-[#8e3e61]"></div>

        <div className="p-8 md:p-12">
          
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 dark:bg-[#111622] dark:border dark:border-white/10 bg-[#b14e79]/10 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
               <img src={eventraLogo} alt="Eventra Logo" className="h-10 w-auto dark:brightness-0 dark:invert" />
            </div>
            <h2 className="text-3xl font-extrabold dark:text-white text-gray-900 mb-2">
              {isLoginMode ? "Welcome Back" : "Create Account"}
            </h2>
            <p className="dark:text-gray-400 text-gray-500">
              {isLoginMode ? "Enter your credentials to access your account." : "Join us to plan your perfect event."}
            </p>
          </div>

          {/* Role Tabs */}
          <div className="flex dark:bg-[#111622] bg-gray-100 p-1 rounded-xl mb-8 transition-colors border dark:border-white/5 border-gray-200">
            {availableRoles.map((role) => (
              <button 
                key={role} 
                onClick={() => setActiveTab(role)} 
                className={`flex-1 py-2 capitalize font-bold rounded-lg transition-all duration-300 text-sm ${
                  activeTab === role 
                    // THEME UPDATE: Active Text Color
                    ? 'dark:bg-[#05070a] dark:text-[#b14e79] bg-white text-[#b14e79] shadow-md transform scale-105' 
                    : 'dark:text-gray-400 text-gray-500 dark:hover:text-gray-300 hover:text-gray-700'
                }`}
              >
                {role}
              </button>
            ))}
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="mb-6 p-3 dark:bg-red-950/30 bg-red-50 border-l-4 dark:border-red-600 border-red-500 dark:text-red-400 text-red-600 rounded-r flex items-center gap-3 text-sm font-medium animate-pulse">
              <AlertCircle size={18} /> {errorMessage}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLoginMode && (
              <div className="relative group">
                {/* THEME UPDATE: Icon Focus Color */}
                <User className="absolute left-4 top-3.5 dark:text-gray-500 text-gray-400 group-focus-within:dark:text-[#b14e79] group-focus-within:text-[#b14e79] transition" size={20} />
                <input 
                  name="name" type="text" placeholder="Full Name" required 
                  value={formData.name} onChange={handleChange} 
                  className="w-full pl-12 p-3.5 dark:bg-[#05070a] bg-gray-50 border dark:border-white/10 border-gray-200 rounded-xl outline-none focus:ring-2 dark:focus:ring-[#b14e79] focus:ring-[#b14e79] focus:bg-white dark:focus:bg-[#111622] dark:text-white text-gray-900 dark:placeholder-gray-500 placeholder-gray-400 transition" 
                />
              </div>
            )}
            <div className="relative group">
              <Mail className="absolute left-4 top-3.5 dark:text-gray-500 text-gray-400 group-focus-within:dark:text-[#b14e79] group-focus-within:text-[#b14e79] transition" size={20} />
              <input 
                name="email" type="email" placeholder="Email Address" required 
                value={formData.email} onChange={handleChange} 
                className="w-full pl-12 p-3.5 dark:bg-[#05070a] bg-gray-50 border dark:border-white/10 border-gray-200 rounded-xl outline-none focus:ring-2 dark:focus:ring-[#b14e79] focus:ring-[#b14e79] focus:bg-white dark:focus:bg-[#111622] dark:text-white text-gray-900 dark:placeholder-gray-500 placeholder-gray-400 transition" 
              />
            </div>
            <div className="relative group">
              <Lock className="absolute left-4 top-3.5 dark:text-gray-500 text-gray-400 group-focus-within:dark:text-[#b14e79] group-focus-within:text-[#b14e79] transition" size={20} />
              <input 
                name="password" type="password" placeholder="Password" required 
                value={formData.password} onChange={handleChange} 
                className="w-full pl-12 p-3.5 dark:bg-[#05070a] bg-gray-50 border dark:border-white/10 border-gray-200 rounded-xl outline-none focus:ring-2 dark:focus:ring-[#b14e79] focus:ring-[#b14e79] focus:bg-white dark:focus:bg-[#111622] dark:text-white text-gray-900 dark:placeholder-gray-500 placeholder-gray-400 transition" 
              />
            </div>

            <button 
              type="submit" 
              disabled={loading} 
              // THEME UPDATE: Gradient Button & Shadow
              className="w-full bg-gradient-to-r from-[#b14e79] to-[#8e3e61] hover:from-[#8e3e61] hover:to-[#6b2f4a] text-white font-bold py-4 rounded-xl transition shadow-lg shadow-[#b14e79]/20 flex justify-center items-center gap-2 transform active:scale-[0.98]"
            >
              {loading ? "Processing..." : (isLoginMode ? "Login" : "Sign Up Free")} 
              {!loading && <ArrowRight size={20} />}
            </button>
          </form>

          {/* Footer Toggle */}
          <div className="text-center mt-8">
            <button 
              onClick={() => { 
                setIsLoginMode(!isLoginMode); 
                setActiveTab('user'); 
                setErrorMessage(""); 
              }} 
              // THEME UPDATE: Hover Text Color
              className="dark:text-gray-400 text-gray-500 dark:hover:text-[#b14e79] hover:text-[#b14e79] font-bold transition text-sm"
            >
              {isLoginMode ? "New here? Create an account" : "Already have an account? Login"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;