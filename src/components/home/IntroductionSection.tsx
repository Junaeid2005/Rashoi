import React from 'react';
import { useApp } from '../../context/AppContext';
import { Flame, ShieldCheck, HeartHandshake, Award } from 'lucide-react';

export const IntroductionSection: React.FC = () => {
  const { siteSettings, setCurrentView } = useApp();

  return (
    <section className="py-20 bg-[#FAF8F4] border-b border-[#EAE4DF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Authentic Restaurant Story */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-2">
              <span className="text-xs uppercase tracking-widest text-[#7B202B] font-semibold">
                Windlesham Heritage Since 1989
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#252020] leading-snug">
                Welcome to Rashoi Indian Cuisine
              </h2>
            </div>

            <p className="text-base text-[#706866] leading-relaxed font-normal">
              {siteSettings.aboutText ||
                'India is a land of culture and tradition, a land of many cuisines. This is not only due to its sheer size, but also due to the impact of various phases in her history. Rashoi or The Indian Kitchen has survived the impact over the centuries, has matured over the years and imbibed the best of all cultures.'}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 border-t border-[#EAE4DF]">
              <div className="space-y-1">
                <div className="w-10 h-10 rounded-full bg-[#7B202B]/10 flex items-center justify-center text-[#7B202B] mb-2">
                  <Flame className="w-5 h-5 text-[#7B202B]" />
                </div>
                <h4 className="font-serif font-semibold text-[#252020] text-sm">Charcoal Tandoor</h4>
                <p className="text-xs text-[#706866]">All tandoori specialities grilled over live charcoal in our authentic clay oven.</p>
              </div>

              <div className="space-y-1">
                <div className="w-10 h-10 rounded-full bg-[#7B202B]/10 flex items-center justify-center text-[#7B202B] mb-2">
                  <HeartHandshake className="w-5 h-5 text-[#7B202B]" />
                </div>
                <h4 className="font-serif font-semibold text-[#252020] text-sm">Surrey Hospitality</h4>
                <p className="text-xs text-[#706866]">Warm, welcoming dining experience serving local patrons for over 35 years.</p>
              </div>

              <div className="space-y-1">
                <div className="w-10 h-10 rounded-full bg-[#7B202B]/10 flex items-center justify-center text-[#7B202B] mb-2">
                  <Award className="w-5 h-5 text-[#7B202B]" />
                </div>
                <h4 className="font-serif font-semibold text-[#252020] text-sm">Sunday 4-Course</h4>
                <p className="text-xs text-[#706866]">Our famed 4-course Sunday Special feast at only £15.95 per person.</p>
              </div>
            </div>

            <div className="pt-2 flex items-center gap-4">
              <button
                onClick={() => {
                  setCurrentView('menu');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="text-xs font-semibold uppercase tracking-wider text-[#7B202B] hover:text-[#5D1720] underline underline-offset-8 cursor-pointer"
              >
                View Full Digital Menu →
              </button>
            </div>
          </div>

          {/* Right Column: Sunday Special & Thali Spotlight Card */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-lg p-8 shadow-md border-2 border-[#C5A15B]/40 relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-[#7B202B] text-white text-[10px] uppercase font-bold tracking-widest px-4 py-1.5 rounded-bl-lg">
                Featured Special
              </div>

              <div className="space-y-4">
                <div>
                  <span className="text-xs font-semibold text-[#C5A15B] uppercase tracking-wider">
                    {siteSettings.sundaySpecial?.subtitle || '4 Course Meal'}
                  </span>
                  <h3 className="font-serif text-2xl font-bold text-[#7B202B]">
                    {siteSettings.sundaySpecial?.title || 'Rashoi Sunday Special'}
                  </h3>
                  <div className="mt-1 flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-[#252020]">
                      £{siteSettings.sundaySpecial?.price?.toFixed(2) || '15.95'}
                    </span>
                    <span className="text-xs text-[#706866]">per person</span>
                  </div>
                </div>

                <p className="text-sm text-[#706866] leading-relaxed">
                  {siteSettings.sundaySpecial?.description ||
                    'A starter, a main dish, a side dish, and rice or naan.'}
                </p>

                <div className="bg-[#FAF8F4] p-3 rounded border border-[#EAE4DF] text-xs text-[#706866]">
                  <strong className="text-[#252020]">Supplement details:</strong>{' '}
                  {siteSettings.sundaySpecial?.supplements ||
                    'King prawn starters add £1.95. King prawn main dishes add £3.95.'}
                </div>

                <div className="pt-2 flex gap-3">
                  <button
                    onClick={() => {
                      setCurrentView('reservations');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="flex-1 bg-[#7B202B] hover:bg-[#5D1720] text-white text-xs font-semibold py-3 px-4 rounded text-center transition-colors cursor-pointer"
                  >
                    Reserve Sunday Table
                  </button>
                  <button
                    onClick={() => {
                      setCurrentView('menu');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="flex-1 bg-[#FAF8F4] hover:bg-[#EAE4DF] text-[#252020] text-xs font-semibold py-3 px-4 rounded text-center transition-colors cursor-pointer"
                  >
                    Explore Menu
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
