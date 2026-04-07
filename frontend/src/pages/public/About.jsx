import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Users, Heart, Target, Globe } from 'lucide-react';
import hrishikeshImg from '../../assets/hrishikesh.jpg';
import avinashImg from '../../assets/avinash.jpg';
import sanikaImg from '../../assets/sanika.jpg';
import eventraLogo from '../../assets/eventra_logo.png';

const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border dark:border-white/5 border-gray-200 rounded-2xl dark:bg-[#111622] bg-gray-50 overflow-hidden transition-all duration-300 hover:shadow-md">
      <button 
        className="w-full flex justify-between items-center p-6 text-left focus:outline-none dark:focus:bg-white/5 focus:bg-gray-100 dark:hover:bg-white/5 hover:bg-gray-100 transition"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="font-bold text-lg dark:text-white text-gray-900">{question}</span>
        <div className="w-8 h-8 rounded-full dark:bg-white/5 bg-[#b14e79]/10 flex items-center justify-center text-[#b14e79]">
          {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </div>
      </button>
      <div 
        className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 pb-6 opacity-100' : 'max-h-0 opacity-0'}`}
      >
        <p className="dark:text-gray-400 text-gray-600 font-medium leading-relaxed">{answer}</p>
      </div>
    </div>
  );
};

const About = () => {
  const team = [
    {
      name: "Hrishikesh Bhande",
      role: "Lead Full-Stack Developer",
      img: hrishikeshImg,
      desc: "Architecting scalable systems and leading technical strategy.",
      icon: <Globe size={18} className="text-[#b14e79]" />
    },
    {
      name: "Avinash Pawar",
      role: "Backend Architect",
      img: avinashImg,
      desc: "Specializes in secure databases and robust API infrastructure.",
      icon: <Target size={18} className="text-[#b14e79]" />
    },
    {
      name: "Sanika Yewale",
      role: "UI/UX Designer & Frontend",
      img: sanikaImg,
      desc: "Crafting beautiful, intuitive interfaces for unforgettable user experiences.",
      icon: <Heart size={18} className="text-[#b14e79]" />
    }
  ];

  const faqs = [
    {
      question: "What exactly is Eventra?",
      answer: "Eventra is a premium event planning platform connecting you directly with elite, verified vendors, top-tier venues, and professional services to curate your perfect celebration."
    },
    {
      question: "How do I book a vendor?",
      answer: "Simply browse our collections, find a vendor you love, and click 'Reserve Date' on their profile. The vendor will receive your request instantly and get back to you to finalize details."
    },
    {
      question: "Are the vendors verified?",
      answer: "Yes! Every single vendor on our platform goes through a rigorous vetting process to ensure they meet our highest standards of service, reliability, and professionalism."
    },
    {
      question: "Is there a fee to use Eventra?",
      answer: "For users planning events, the platform is completely free to use. You only pay the vendors directly for the services you hire."
    }
  ];

  return (
    <div className="dark:bg-[#05070a] bg-white dark:text-white text-gray-900 min-h-screen pb-24 transition-colors duration-300">
      
      {/* --- HERO SECTION --- */}
      <section className="relative w-full py-24 md:py-32 overflow-hidden flex flex-col items-center justify-center text-center px-6">
        <div className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-[#b14e79]/10 to-transparent pointer-events-none"></div>
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#b14e79]/20 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute top-48 -left-24 w-72 h-72 bg-purple-600/10 rounded-full blur-[100px] pointer-events-none"></div>
        
        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="inline-flex items-center justify-center p-3 mb-6 rounded-2xl dark:bg-white/5 bg-[#b14e79]/10 border dark:border-white/10 border-[#b14e79]/20 backdrop-blur-md shadow-2xl">
            <img src={eventraLogo} alt="Eventra" className="h-8 w-auto" />
          </div>
          <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter leading-tight">
            Curating Unforgettable <span className="italic font-serif text-[#b14e79]">Experiences</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-400 font-medium max-w-3xl mx-auto leading-relaxed">
            We built Eventra because we believe every celebration deserves to be flawless. Our platform brings the industry's best talent directly to your fingertips.
          </p>
        </div>
      </section>

      {/* --- MEET THE CREATORS --- */}
      <section className="max-w-7xl mx-auto px-6 py-12 md:py-20 relative z-10">
        <div className="flex flex-col items-center mb-16 text-center">
          <h2 className="text-sm font-black uppercase tracking-[0.3em] text-[#b14e79] mb-4 flex items-center gap-2"><Users size={16}/> Meet the Team</h2>
          <h3 className="text-4xl md:text-5xl font-bold tracking-tight dark:text-white text-gray-900">The Minds Behind It All</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {team.map((member, i) => (
            <div key={i} className="group dark:bg-[#111622] bg-gray-50 rounded-[2.5rem] p-8 border dark:border-white/5 border-gray-200 dark:hover:border-[#b14e79]/30 hover:border-[#b14e79]/30 transition-all duration-500 shadow-xl flex flex-col items-center text-center relative overflow-hidden">
              {/* Background Glow */}
              <div className="absolute inset-0 bg-gradient-to-b from-[#b14e79]/0 to-[#b14e79]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
              
              <div className="w-40 h-40 rounded-full mb-8 relative">
                <div className="absolute inset-0 rounded-full border-4 border-dashed dark:border-white/10 border-gray-300 group-hover:border-[#b14e79]/40 group-hover:rotate-180 transition-all duration-1000"></div>
                <div className="absolute inset-2 rounded-full overflow-hidden dark:bg-white/5 bg-white border dark:border-white/10 border-gray-200 group-hover:scale-105 transition-transform duration-500">
                  <img src={member.img} alt={member.name} className="w-full h-full object-cover" />
                </div>
              </div>

              <div className="dark:bg-white/5 bg-gray-100 px-4 py-1.5 rounded-full mb-6 border dark:border-white/5 border-gray-200 flex flex-row items-center gap-2 dark:group-hover:bg-[#b14e79]/10 group-hover:bg-[#b14e79]/10 transition-colors">
                {member.icon}
                <span className="text-xs font-bold uppercase tracking-widest dark:text-gray-300 text-gray-500 dark:group-hover:text-white group-hover:text-gray-900 transition-colors">{member.role}</span>
              </div>
              
              <h4 className="text-3xl font-bold mb-4 tracking-tight dark:group-hover:text-[#b14e79] group-hover:text-[#b14e79] transition-colors">{member.name}</h4>
              <p className="dark:text-gray-400 text-gray-600 font-medium leading-relaxed">{member.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* --- FAQ SECTION --- */}
      <section className="max-w-4xl mx-auto px-6 py-20 mt-12 dark:bg-[#0a0d14]/50 bg-gray-50/80 rounded-[3rem] border dark:border-white/5 border-gray-200 relative z-10 transition-colors duration-300">
        <div className="text-center mb-12">
          <h2 className="text-sm font-black uppercase tracking-[0.3em] text-[#b14e79] mb-4">Support</h2>
          <h3 className="text-4xl font-bold tracking-tight dark:text-white text-gray-900">Frequently Asked Questions</h3>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <FAQItem key={index} question={faq.question} answer={faq.answer} />
          ))}
        </div>
      </section>
      
    </div>
  );
};

export default About;
