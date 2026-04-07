import React from 'react';
import { Facebook, Twitter, Instagram, Linkedin, Heart, Mail, Phone, MapPin } from 'lucide-react';
import logo from '../assets/eventra_logo.png';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white pt-12 pb-8 border-t border-gray-800 mt-auto">
      <div className="container mx-auto px-6">
        {/* --- MAIN CONTENT GRID --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 mb-12 text-center md:text-left">
          {/* Logo & Description */}
          <div className="col-span-1 sm:col-span-2">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center justify-center md:justify-start gap-2">
              <img src={logo} alt="Eventra" className="h-8 brightness-0 invert opacity-90" />
              Eventra
            </h2>
            <p className="text-gray-400 leading-relaxed max-w-sm mx-auto md:mx-0">
              Your one-stop destination for planning the perfect wedding, corporate event, or birthday party. We connect you
              with the best vendors in Pune.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold text-white mb-4">Quick Links</h3>
            <ul className="space-y-3 text-gray-400">
              <li>
                <a href="/" className="hover:text-[#b14e79] transition block py-1">
                  Home
                </a>
              </li>
              <li>
                <a href="/vendors" className="hover:text-[#b14e79] transition block py-1">
                  Find Vendors
                </a>
              </li>
              <li>
                <a href="/login" className="hover:text-[#b14e79] transition block py-1">
                  Vendor Login
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-bold text-white mb-4">Contact Us</h3>
            <ul className="space-y-3 text-gray-400">
              <li className="flex items-center justify-center md:justify-start gap-2">
                <MapPin size={16} /> Pune, Maharashtra
              </li>
              <li className="flex items-center justify-center md:justify-start gap-2">
                <Phone size={16} /> +91 7014015016
              </li>
              <li className="flex items-center justify-center md:justify-start gap-2">
                <Mail size={16} /> support@eventra.com
              </li>
            </ul>

            {/* Social Links */}
            <div className="flex gap-4 mt-6 justify-center md:justify-start">
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-[#b14e79] transition hover:-translate-y-1">
                <Facebook size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-[#b14e79] transition hover:-translate-y-1">
                <Instagram size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-[#b14e79] transition hover:-translate-y-1">
                <Twitter size={18} />
              </a>
            </div>
          </div>
        </div>

        {/* --- FOOTER BOTTOM --- */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-gray-500 text-sm">
          <p>&copy; 2026 Eventra. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;