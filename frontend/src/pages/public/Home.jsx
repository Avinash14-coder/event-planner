import React, { useRef } from "react";
import { Link } from "react-router-dom";
import { Star, ShieldCheck, Heart, ChevronRight } from "lucide-react";

const Home = () => {
  const categoriesRef = useRef(null);

  const scrollToCategories = () => {
    categoriesRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const CATEGORIES = [
    {
      title: "Wedding Day",
      img: "https://www.shaadidukaan.com/vogue/wp-content/uploads/2025/06/Post-Wedding-Rituals-11.webp",
      path: "/category/wedding", // Updated from /wedding-day
    },
    {
      title: "Birthday Party",
      img: "https://media.istockphoto.com/id/1154066614/photo/happy-birthday-to-you-concept.jpg?s=612x612&w=0&k=20&c=laWMYxECOwx3R9pB07O2Ip11IRa_y-LdsUzO99BmqSk=",
      path: "/category/birthday", // Updated from /birthday
    },
    {
      title: "Reception Party",
      img: "https://img.freepik.com/premium-photo/evening-wedding-family-dinner-forest-with-light-bulbs-candles_419896-17590.jpg",
      path: "/category/reception", // Updated from /reception
    },
    {
      title: "Anniversary",
      img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR4EyYWR9CsuN1R7fKaCkbGsg1UmlXGRblHOA&s",
      path: "/category/anniversary", // Updated from /anniversary
    },
    {
      title: "Bachelor Party",
      img: "https://media.istockphoto.com/id/1174587136/photo/group-of-smiling-male-friends-having-fun-in-night-club.jpg?s=612x612&w=0&k=20&c=4fCPHPdTtTra9L_qhFuQ7BhfdZ1J_n4mvohgb_ZPiU4=",
      path: "/category/bachelor", // Updated from /bachelorparty
    },
    {
      title: "DJ ",
      img: "https://t3.ftcdn.net/jpg/08/52/83/82/360_F_852838243_bHrOKN6lJWajcpfRqvrskAPuZO5VheDZ.jpg",
      path: "/category/dj",
    },
  ];

  return (
    <div className="dark:bg-[#05070a] bg-gray-50 dark:text-white text-gray-900 min-h-screen transition-colors duration-300">
      {/* --- RESPONSIVE HERO SECTION --- */}
      <section className="relative w-full h-[85vh] md:h-screen overflow-hidden flex items-center">
        <div className="absolute inset-0 z-0">
          <img
            className="w-full h-full object-cover scale-105 animate-slow-zoom"
            alt="Luxury gala event"
            src="https://images.pexels.com/photos/30311728/pexels-photo-30311728.jpeg"
          />
          <div className="absolute inset-0 bg-gradient-to-t dark:from-[#05070a] dark:via-[#05070a]/50 from-gray-50 via-gray-50/50 to-transparent"></div>
        </div>

        <div className="relative z-10 w-full px-6 md:px-20 lg:px-32">
          <div className="flex flex-col gap-4 md:gap-6">
            <span className="inline-block px-4 py-1.5 md:px-6 md:py-2 bg-yellow-400/10 backdrop-blur-md text-yellow-500 border border-yellow-500/20 rounded-full text-[10px] md:text-xs font-black uppercase tracking-[0.2em] w-fit">
              Premium Experience
            </span>

            <h1 className="text-4xl sm:text-6xl md:text-8xl font-black leading-tight tracking-tighter dark:text-white text-gray-900">
              Plan Your <br />
              <span className="text-[#b14e79] italic font-serif">Dream</span> Event
            </h1>

            <p className="dark:text-gray-300 text-gray-700 text-sm md:text-lg max-w-lg leading-relaxed font-medium">
              Access the world's most exclusive venues and elite planning services, tailored specifically for your vision.
            </p>

            <div className="pt-4">
              <button 
                onClick={scrollToCategories}
                className="w-full sm:w-auto bg-[#b14e79] hover:bg-[#8e3e61] text-white px-8 py-4 md:px-10 md:py-5 rounded-full font-bold text-base md:text-lg shadow-2xl transition-all flex items-center justify-center gap-3 active:scale-95"
              >
                Start Planning
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* --- CATEGORIES SECTION --- */}
      <section ref={categoriesRef} className="py-12 md:py-20 dark:bg-[#05070a] bg-gray-50 px-6 md:px-20 lg:px-32 transition-colors duration-300">
        <div className="flex items-center justify-between mb-8 md:mb-12">
          <h2 className="text-2xl md:text-4xl font-black uppercase tracking-tight">
            Curated Categories
          </h2>
          {/* <button className="hidden sm:block text-sm font-bold text-[#b14e79] hover:underline uppercase tracking-widest">
            VIEW ALL
          </button> */}
        </div>

        {/* Responsive Grid - 1 column mobile, 2 tablet, 3 desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
          {CATEGORIES.map((cat, i) => (
            <Link key={i} to={cat.path} className="group block h-[300px] md:h-[450px]">
              <div className="relative h-full w-full rounded-[1.5rem] md:rounded-[2.5rem] overflow-hidden shadow-2xl border dark:border-white/5 border-gray-200 transition-all duration-500 hover:border-[#b14e79]/50">
                <img
                  className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700"
                  alt={cat.title}
                  src={cat.img}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-70"></div>
                <h3 className="absolute bottom-6 left-6 md:bottom-8 md:left-8 font-bold text-xl md:text-2xl tracking-tight">
                  {cat.title}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* --- RESPONSIVE FEATURES --- */}
      <section className="py-16 md:py-24 dark:bg-[#0a0d14] bg-white border-t dark:border-white/5 border-gray-200 transition-colors duration-300">
        <div className="px-6 md:px-20 lg:px-32">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 text-center">
            {[
              { icon: ShieldCheck, title: "Verified Vendors", desc: "Every vendor is personally verified for luxury-grade service." },
              { icon: Star, title: "Transparent Pricing", desc: "No hidden costs. Compare rates within your budget." },
              { icon: Heart, title: "Stress-Free Planning", desc: "We make planning your big day simple and smooth." },
            ].map((feature, i) => (
              <div key={i} className="p-8 md:p-10 rounded-[2rem] md:rounded-[3rem] dark:bg-[#111622] bg-gray-50 border dark:border-white/5 border-gray-100 dark:hover:bg-[#161d2b] hover:bg-gray-100 transition-colors group">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-[#b14e79]/10 rounded-2xl flex items-center justify-center text-[#b14e79] mx-auto mb-6 md:mb-8 transition-transform group-hover:rotate-6">
                  <feature.icon size={28} />
                </div>
                <h4 className="text-lg md:text-xl font-black mb-3 md:mb-4 uppercase tracking-tight dark:text-white text-gray-900">
                  {feature.title}
                </h4>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;