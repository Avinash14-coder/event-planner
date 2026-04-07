import React, { useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronRight, Filter } from 'lucide-react';

const CategoryHub = () => {
  const { categoryName } = useParams();
  const subCategoriesRef = useRef(null);

  const hubConfig = {
    birthday: {
      hero: "https://images.unsplash.com/photo-1530103862676-fa8c91bbe34b?q=80&w=1600",
      color: "text-pink-500",
      accent: "border-pink-500/20",
      subs: [
        { title: "Cake Shops",    img: "https://images.unsplash.com/photo-1578985543313-2070c793f779?q=80&w=600", type: "CakeShop" },
        { title: "Decorators",   img: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?q=80&w=600", type: "Decorator" },
        { title: "Venues",       img: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=600", type: "Venue" },
        { title: "Photographers",img: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=600", type: "Photographer" },
        { title: "Magicians",    img: "https://images.unsplash.com/photo-1522881451255-f59ad836fdfb?q=80&w=600", type: "Magician" },
        { title: "DJs",          img: "https://images.unsplash.com/photo-1571266028243-371695039980?q=80&w=600", type: "DJ" },
      ]
    },
    wedding: {
      hero: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1600",
      color: "text-yellow-400",
      accent: "border-yellow-400/20",
      subs: [
        { title: "Banquet Halls",    img: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=600", type: "Hall" },
        { title: "Caterers",         img: "https://images.unsplash.com/photo-1555244162-803834f70033?q=80&w=600", type: "Catering" },
        { title: "Garden Lawns",     img: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?q=80&w=600", type: "Lawn" },
        { title: "Photographers",    img: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=600", type: "Photographer" },
        { title: "Decorators",       img: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?q=80&w=600", type: "Decorator" },
        { title: "Venues",           img: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=600", type: "Venue" },
      ]
    },
    reception: {
      hero: "https://img.freepik.com/premium-photo/evening-wedding-family-dinner-forest-with-light-bulbs-candles_419896-17590.jpg",
      color: "text-amber-400",
      accent: "border-amber-400/20",
      subs: [
        { title: "Banquet Halls",  img: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=600", type: "Hall" },
        { title: "Caterers",       img: "https://images.unsplash.com/photo-1555244162-803834f70033?q=80&w=600", type: "Catering" },
        { title: "DJs",            img: "https://images.unsplash.com/photo-1571266028243-371695039980?q=80&w=600", type: "DJ" },
        { title: "Decorators",     img: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?q=80&w=600", type: "Decorator" },
        { title: "Photographers",  img: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=600", type: "Photographer" },
        { title: "Venues",         img: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=600", type: "Venue" },
      ]
    },
    anniversary: {
      hero: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR4EyYWR9CsuN1R7fKaCkbGsg1UmlXGRblHOA&s",
      color: "text-rose-400",
      accent: "border-rose-400/20",
      subs: [
        { title: "Venues",        img: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=600", type: "Venue" },
        { title: "Cake Shops",    img: "https://images.unsplash.com/photo-1578985543313-2070c793f779?q=80&w=600", type: "CakeShop" },
        { title: "Photographers", img: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=600", type: "Photographer" },
        { title: "Decorators",    img: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?q=80&w=600", type: "Decorator" },
        { title: "Caterers",      img: "https://images.unsplash.com/photo-1555244162-803834f70033?q=80&w=600", type: "Catering" },
        { title: "DJs",           img: "https://images.unsplash.com/photo-1571266028243-371695039980?q=80&w=600", type: "DJ" },
      ]
    },
    bachelor: {
      hero: "https://media.istockphoto.com/id/1174587136/photo/group-of-smiling-male-friends-having-fun-in-night-club.jpg?s=612x612&w=0&k=20&c=4fCPHPdTtTra9L_qhFuQ7BhfdZ1J_n4mvohgb_ZPiU4=",
      color: "text-blue-400",
      accent: "border-blue-400/20",
      subs: [
        { title: "DJs",           img: "https://images.unsplash.com/photo-1571266028243-371695039980?q=80&w=600", type: "DJ" },
        { title: "Venues",        img: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=600", type: "Venue" },
        { title: "Caterers",      img: "https://images.unsplash.com/photo-1555244162-803834f70033?q=80&w=600", type: "Catering" },
        { title: "Photographers", img: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=600", type: "Photographer" },
        { title: "Magicians",     img: "https://images.unsplash.com/photo-1522881451255-f59ad836fdfb?q=80&w=600", type: "Magician" },
        { title: "Decorators",    img: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?q=80&w=600", type: "Decorator" },
      ]
    },
    dj: {
      hero: "https://t3.ftcdn.net/jpg/08/52/83/82/360_F_852838243_bHrOKN6lJWajcpfRqvrskAPuZO5VheDZ.jpg",
      color: "text-blue-400",
      accent: "border-blue-400/20",
      subs: [
        { title: "DJs",           img: "https://images.unsplash.com/photo-1571266028243-371695039980?q=80&w=600", type: "DJ" },
        { title: "Venues",        img: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=600", type: "Venue" },
        { title: "Decorators",    img: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?q=80&w=600", type: "Decorator" },
        { title: "Caterers",      img: "https://images.unsplash.com/photo-1555244162-803834f70033?q=80&w=600", type: "Catering" },
      ]
    },
  };

  // Show a generic fallback grid if no config found (future-proof)
  const current = hubConfig[categoryName?.toLowerCase()] || {
    hero: "https://images.pexels.com/photos/30311728/pexels-photo-30311728.jpeg",
    color: "text-[#b14e79]",
    accent: "border-[#b14e79]/20",
    subs: [
      { title: "Venues",       img: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=600", type: "Venue" },
      { title: "Caterers",     img: "https://images.unsplash.com/photo-1555244162-803834f70033?q=80&w=600", type: "Catering" },
      { title: "DJs",          img: "https://images.unsplash.com/photo-1571266028243-371695039980?q=80&w=600", type: "DJ" },
      { title: "Photographers",img: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=600", type: "Photographer" },
      { title: "Decorators",   img: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?q=80&w=600", type: "Decorator" },
    ]
  };

  return (
    <div className="bg-[#05070a] text-white min-h-screen">
      
      {/* --- PREMIUM HERO --- */}
      <section className="relative w-full h-[60vh] md:h-[70vh] flex items-center overflow-hidden">
        <img src={current.hero} className="absolute inset-0 w-full h-full object-cover scale-105 animate-slow-zoom" alt={categoryName} />
        <div className="absolute inset-0 bg-gradient-to-t from-[#05070a] via-[#05070a]/50 to-transparent z-10" />

        <div className="relative z-20 w-full px-6 md:px-20 lg:px-32">
          <div className={`inline-block px-4 py-1.5 mb-6 rounded-full border ${current.accent} bg-white/5 backdrop-blur-md`}>
            <span className={`text-[10px] font-black uppercase tracking-[0.3em] ${current.color}`}>Explore Services</span>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-black mb-6 leading-[0.9] tracking-tighter capitalize">
            The {categoryName} <br/> 
            <span className={`italic font-serif ${current.color} drop-shadow-[0_0_15px_rgba(177,78,121,0.5)]`}>Collection</span>
          </h1>
          
          <p className="text-gray-400 text-lg max-w-xl mb-10 leading-relaxed font-medium">
            Discover verified professionals and stunning venues tailored for your {categoryName} celebration.
          </p>

          <button 
            onClick={() => subCategoriesRef.current?.scrollIntoView({ behavior: 'smooth' })}
            className="group bg-white text-black hover:bg-[#b14e79] hover:text-white px-10 py-5 rounded-full font-bold text-lg transition-all duration-500 flex items-center gap-3 active:scale-95 shadow-xl shadow-black/20"
          >
            Find Your Specialist
            <ChevronRight className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </section>

      {/* --- SUB-CATEGORIES GRID --- */}
      <section ref={subCategoriesRef} className="py-24 px-6 md:px-20 lg:px-32 bg-[#05070a]">
        <div className="flex justify-between items-end mb-16">
          <div>
            <h2 className="text-4xl font-black tracking-tight mb-3 uppercase">Specialist Categories</h2>
            <div className="h-1.5 w-24 bg-[#b14e79] rounded-full" />
          </div>
          <button className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-white border border-white/10 px-6 py-2 rounded-full hover:bg-white/5 transition-all">
            <Filter size={16}/> Filter All
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {current.subs.map((sub, i) => (
            <Link 
              key={i} 
              // STEP 2 LINKING: This navigates to the next level filtering page
              to={`/category/${categoryName}/services/${sub.type}`}
              className="group cursor-pointer block h-[350px] md:h-[450px]"
            >
              <div className="relative h-full w-full rounded-[2.5rem] overflow-hidden border border-white/5 transition-all duration-500 group-hover:border-[#b14e79]/50 shadow-2xl">
                <img 
                  src={sub.img} 
                  alt={sub.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                <h3 className="absolute bottom-8 left-8 font-bold text-3xl tracking-tight text-white group-hover:text-[#b14e79] transition-colors">{sub.title}</h3>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

export default CategoryHub;