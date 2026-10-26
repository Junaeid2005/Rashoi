import React from 'react';
import { useApp } from '../../context/AppContext';
import { Utensils, CalendarDays, ShoppingBag, Sparkles, MapPin } from 'lucide-react';

export const HeroSection: React.FC = () => {
  const { siteSettings, setCurrentView } = useApp();

  const handleNav = (view: string) => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const heroImg = siteSettings.hero?.heroImageUrl || 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=1920&q=80';

  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-[#252020]">
      {/* Background Photography with Sophisticated Dark Burgundy Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImg}
          alt="Rashoi Indian Cuisine Specialities"
          className="w-full h-full object-cover object-center transform scale-105 transition-transform duration-1000"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#252020]/95 via-[#5D1720]/80 to-[#252020]/90 mix-blend-multiply" />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center text-white">
        {/* Heritage Tag */}
        <div className="inline-flex items-center gap-2 bg-[#5D1720]/80 border border-[#C5A15B]/40 px-4 py-1.5 rounded-full text-xs font-medium tracking-widest uppercase text-[#C5A15B] mb-6 backdrop-blur-sm animate-fade-in">
          <Sparkles className="w-3.5 h-3.5 text-[#C5A15B]" />
          <span>Windlesham, Surrey • Established 1989</span>
        </div>

        {/* Main Heading */}
        <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white mb-6 leading-tight">
          {siteSettings.hero?.heading || 'Discover the Flavours of India'}
        </h1>

        {/* Subtitle */}
        <p className="max-w-2xl mx-auto text-lg sm:text-xl text-gray-200 font-light leading-relaxed mb-10">
          {siteSettings.hero?.subtitle || 'Traditional Indian cuisine, thoughtfully prepared and served in the heart of Windlesham.'}
        </p>

        {/* Three Primary Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-2xl mx-auto">
          {/* Action 1: Explore Menu */}
          <button
            onClick={() => handleNav('menu')}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-white text-[#5D1720] hover:bg-[#FAF8F4] font-semibold text-sm tracking-wide uppercase px-7 py-4 rounded-sm transition-all shadow-lg hover:shadow-xl cursor-pointer"
          >
            <Utensils className="w-4 h-4 text-[#7B202B]" />
            Explore Our Menu
          </button>

          {/* Action 2: Book a Table */}
          <button
            onClick={() => handleNav('reservations')}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-[#7B202B] hover:bg-[#5D1720] text-white border border-[#C5A15B]/50 font-semibold text-sm tracking-wide uppercase px-7 py-4 rounded-sm transition-all shadow-lg hover:shadow-xl cursor-pointer"
          >
            <CalendarDays className="w-4 h-4 text-[#C5A15B]" />
            Book a Table
          </button>

          {/* Action 3: Order for Collection */}
          {siteSettings.collectionOrderingEnabled && (
            <button
              onClick={() => handleNav('collection')}
              className="w-full sm:w-auto relative inline-flex items-center justify-center gap-2.5 bg-[#5D1720]/90 hover:bg-[#5D1720] text-white border border-white/20 font-semibold text-sm tracking-wide uppercase px-6 py-4 rounded-sm transition-all shadow-lg cursor-pointer group"
            >
              <ShoppingBag className="w-4 h-4 text-[#C5A15B]" />
              Order for Collection
              {siteSettings.collectionDiscount?.enabled && (
                <span className="absolute -top-3 -right-2 bg-[#C5A15B] text-[#252020] text-[10px] font-black px-2 py-0.5 rounded shadow">
                  10% OFF
                </span>
              )}
            </button>
          )}
        </div>

        {/* Quick Location & Service Micro-bar */}
        <div className="mt-14 pt-8 border-t border-white/10 flex flex-wrap items-center justify-center gap-8 text-xs text-gray-300">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#C5A15B]" />
            <span>58 Updown Hill, Windlesham, GU20 6DX</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>Open 7 Days: Lunch 12:00–2:30 PM & Evening 5:30–11:00 PM</span>
          </div>
        </div>
      </div>
    </section>
  );
};
