import React from 'react';
import { useApp } from '../../context/AppContext';
import { MapPin, Phone, Clock, ExternalLink, CalendarDays } from 'lucide-react';

export const VisitSection: React.FC = () => {
  const { siteSettings, setCurrentView } = useApp();

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Visit Information */}
          <div className="lg:col-span-6 space-y-8">
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-[#7B202B]">
                Surrey Dining Location
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#252020] mt-1">
                Visit Rashoi in Windlesham
              </h2>
              <p className="text-sm text-[#706866] mt-2 leading-relaxed">
                Conveniently located on Updown Hill in the picturesque village of Windlesham, Surrey. We look forward to welcoming you for dine-in or collection.
              </p>
            </div>

            <div className="space-y-6">
              {/* Address */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-[#7B202B]/10 flex items-center justify-center text-[#7B202B] shrink-0 mt-1">
                  <MapPin className="w-5 h-5 text-[#7B202B]" />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-[#252020] text-base">Address</h4>
                  <p className="text-sm text-[#706866]">58 Updown Hill</p>
                  <p className="text-sm text-[#706866]">Windlesham, Surrey, GU20 6DX</p>
                  <p className="text-sm text-[#706866]">United Kingdom</p>
                  <a
                    href={siteSettings.googleMapsUrl || 'https://share.google/m1l4gEswAPjn9ckfn'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#7B202B] hover:text-[#5D1720] mt-2 underline"
                  >
                    Open in Google Maps <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* Telephone */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-[#7B202B]/10 flex items-center justify-center text-[#7B202B] shrink-0 mt-1">
                  <Phone className="w-5 h-5 text-[#7B202B]" />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-[#252020] text-base">Telephone Orders & Enquiries</h4>
                  <div className="flex flex-wrap gap-4 mt-1">
                    <a
                      href="tel:01276452197"
                      className="text-base font-semibold text-[#7B202B] hover:underline"
                    >
                      01276 452 197
                    </a>
                    <span className="text-[#EAE4DF] font-bold">•</span>
                    <a
                      href="tel:01276453388"
                      className="text-base font-semibold text-[#7B202B] hover:underline"
                    >
                      01276 453 388
                    </a>
                  </div>
                </div>
              </div>

              {/* Hours */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-[#7B202B]/10 flex items-center justify-center text-[#7B202B] shrink-0 mt-1">
                  <Clock className="w-5 h-5 text-[#7B202B]" />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-[#252020] text-base">Service Periods</h4>
                  <p className="text-sm text-[#252020] font-medium">Open Seven Days a Week</p>
                  <p className="text-xs text-[#706866] mt-0.5">
                    Lunch: {siteSettings.openingHours?.lunch || '12:00 PM – 2:30 PM'}
                  </p>
                  <p className="text-xs text-[#706866]">
                    Evening: {siteSettings.openingHours?.evening || '5:30 PM – 11:00 PM'}
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap gap-4">
              <button
                onClick={() => {
                  setCurrentView('reservations');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="bg-[#7B202B] hover:bg-[#5D1720] text-white text-xs font-semibold uppercase tracking-wider px-6 py-3.5 rounded-sm transition-all shadow-sm cursor-pointer inline-flex items-center gap-2"
              >
                <CalendarDays className="w-4 h-4 text-[#C5A15B]" />
                Book a Table Now
              </button>
              <a
                href={siteSettings.googleMapsUrl || 'https://share.google/m1l4gEswAPjn9ckfn'}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#FAF8F4] hover:bg-[#EAE4DF] text-[#252020] border border-[#EAE4DF] text-xs font-semibold uppercase tracking-wider px-6 py-3.5 rounded-sm transition-all cursor-pointer inline-flex items-center gap-2"
              >
                <MapPin className="w-4 h-4 text-[#7B202B]" />
                Get Driving Directions
              </a>
            </div>
          </div>

          {/* Right Column: Visual Restaurant Card & Exterior Reference */}
          <div className="lg:col-span-6">
            <div className="relative rounded-lg overflow-hidden border border-[#EAE4DF] shadow-lg bg-[#FAF8F4]">
              <img
                src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80"
                alt="Rashoi Indian Cuisine Dining Atmosphere"
                className="w-full h-80 object-cover"
              />
              <div className="p-6 bg-white space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-serif font-bold text-lg text-[#7B202B]">
                    Windlesham Village Setting
                  </span>
                  <span className="bg-emerald-50 text-emerald-800 text-[11px] font-semibold px-2.5 py-1 rounded-full border border-emerald-200">
                    Tables Available Tonight
                  </span>
                </div>
                <p className="text-xs text-[#706866] leading-relaxed">
                  Relax in our tranquil dining room, thoughtfully arranged for quiet dinners, celebratory family banquets, and friendly gatherings.
                </p>
                <div className="pt-2 text-xs font-medium text-[#706866] flex items-center justify-between border-t border-[#EAE4DF]">
                  <span>Free village parking available nearby</span>
                  <span className="text-[#C5A15B] font-bold">GU20 6DX</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
