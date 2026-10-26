import React from 'react';
import { useApp } from '../../context/AppContext';
import { Award, Flame, HeartHandshake, History, MapPin, Sparkles } from 'lucide-react';

export const AboutPage: React.FC = () => {
  const { siteSettings, setCurrentView } = useApp();

  return (
    <div className="min-h-screen bg-[#FAF8F4] py-14 sm:py-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#7B202B]">
            Established 1989 • Windlesham, Surrey
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#252020]">
            The Heritage of Rashoi
          </h1>
          <p className="text-base text-[#706866] leading-relaxed">
            Over three decades of authentic Indian culinary tradition, warm Surrey hospitality, and passion for flavours.
          </p>
        </div>

        {/* Narrative Section */}
        <div className="bg-white rounded-lg p-8 sm:p-12 border border-[#EAE4DF] shadow-sm space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-7 space-y-4">
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#7B202B]">
                A Land of Culture, Tradition and Many Cuisines
              </h2>
              <p className="text-sm text-[#706866] leading-relaxed">
                {siteSettings.aboutText ||
                  'India is a land of culture and tradition, a land of many cuisines. This is not only due to its sheer size, but also due to the impact of various phases in her history. Rashoi or The Indian Kitchen has survived the impact over the centuries, has matured over the years and imbibed the best of all cultures.'}
              </p>
              <p className="text-sm text-[#706866] leading-relaxed">
                Since opening our doors in 1989 on Updown Hill in Windlesham, Rashoi has been dedicated to serving dishes true to their origin. From sizzling tandoori grills cooked over live charcoal in our traditional clay oven to slow-simmered aromatic curries, every recipe represents timeless culinary pride.
              </p>
            </div>

            <div className="md:col-span-5 bg-[#FAF8F4] rounded-lg p-6 border-2 border-[#C5A15B]/30 text-center space-y-3">
              <div className="w-14 h-14 rounded-full bg-[#7B202B] text-[#C5A15B] flex items-center justify-center mx-auto shadow-sm">
                <History className="w-7 h-7" />
              </div>
              <span className="font-serif text-4xl font-bold text-[#7B202B] block">1989</span>
              <h3 className="font-serif text-lg font-bold text-[#252020]">Windlesham's Local Indian Kitchen</h3>
              <p className="text-xs text-[#706866] leading-relaxed">
                Serving our local Surrey community and visitors with uncompromised quality for over 35 years.
              </p>
            </div>
          </div>

          {/* Three pillars */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-[#EAE4DF]">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-[#7B202B] font-bold text-sm">
                <Flame className="w-4 h-4 text-[#C5A15B]" />
                <span>Charcoal Clay Oven</span>
              </div>
              <p className="text-xs text-[#706866] leading-relaxed">
                All our tandoori meats, kebabs, and breads are roasted in an authentic charcoal clay tandoor for genuine smoky taste.
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-[#7B202B] font-bold text-sm">
                <Sparkles className="w-4 h-4 text-[#C5A15B]" />
                <span>Fresh Whole Spices</span>
              </div>
              <p className="text-xs text-[#706866] leading-relaxed">
                Whole coriander, cumin, cardamoms, cinnamon, and fresh herbs freshly ground in-house for rich aroma without excess oiliness.
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-[#7B202B] font-bold text-sm">
                <HeartHandshake className="w-4 h-4 text-[#C5A15B]" />
                <span>Hospitality First</span>
              </div>
              <p className="text-xs text-[#706866] leading-relaxed">
                Attentive, respectful service ensuring you feel welcomed whether joining for an intimate meal or a festive family gathering.
              </p>
            </div>
          </div>
        </div>

        {/* Call to action */}
        <div className="bg-[#5D1720] rounded-lg p-8 sm:p-12 text-center text-white space-y-6">
          <h3 className="font-serif text-2xl sm:text-3xl font-bold">
            Experience Rashoi for Yourself
          </h3>
          <p className="text-sm text-gray-200 max-w-xl mx-auto">
            Book a table for lunch or evening dining, or order online for collection and enjoy a 10% discount.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => {
                setCurrentView('reservations');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="bg-[#C5A15B] hover:bg-[#d8b56f] text-[#252020] font-bold text-xs uppercase tracking-wider px-6 py-3 rounded-sm cursor-pointer shadow-md"
            >
              Book a Table
            </button>
            <button
              onClick={() => {
                setCurrentView('menu');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="bg-white/10 hover:bg-white/20 text-white border border-white/30 text-xs font-semibold uppercase tracking-wider px-6 py-3 rounded-sm cursor-pointer"
            >
              Explore Digital Menu
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
