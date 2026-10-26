import React from 'react';
import { useApp } from '../../context/AppContext';
import { MapPin, Phone, Clock, Mail, MessageSquare, AlertTriangle, ShieldCheck } from 'lucide-react';

interface FooterProps {
  onOpenFeedback: () => void;
  onOpenPrivacy: () => void;
  onOpenTerms: () => void;
  onOpenAllergen: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenFeedback,
  onOpenPrivacy,
  onOpenTerms,
  onOpenAllergen,
}) => {
  const { siteSettings, setCurrentView, isAdmin } = useApp();

  const handleNav = (view: string) => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#252020] text-[#FAF8F4] pt-16 pb-12 border-t-4 border-[#7B202B]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-white/10">
          {/* Column 1: Brand & Heritage */}
          <div className="space-y-4">
            <div className="space-y-1">
              <span className="font-serif text-3xl font-bold tracking-wider text-white">
                RASHOI
              </span>
              <p className="text-[#C5A15B] text-xs font-semibold tracking-widest uppercase">
                Indian Cuisine • Est. 1989
              </p>
            </div>
            <p className="text-sm text-gray-300 leading-relaxed">
              Thoughtfully prepared authentic Indian dishes celebrating culinary heritage in the heart of Windlesham, Surrey.
            </p>
            <div className="pt-2">
              <button
                onClick={onOpenAllergen}
                className="inline-flex items-center gap-1.5 text-xs text-[#C5A15B] hover:text-white underline underline-offset-4 cursor-pointer"
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                Ask About Allergens
              </button>
            </div>
          </div>

          {/* Column 2: Hours & Dining */}
          <div className="space-y-4">
            <h4 className="font-serif text-lg font-semibold text-[#C5A15B] tracking-wide">
              Opening Hours
            </h4>
            <div className="space-y-2 text-sm text-gray-300">
              <div className="flex items-center gap-2 text-white font-medium">
                <Clock className="w-4 h-4 text-[#C5A15B] shrink-0" />
                <span>Open 7 Days A Week</span>
              </div>
              <div className="pl-6 space-y-1">
                <div>
                  <span className="text-gray-400 block text-xs">Lunch Service</span>
                  <span className="font-medium text-white">{siteSettings.openingHours?.lunch || '12:00 PM – 2:30 PM'}</span>
                </div>
                <div className="pt-1">
                  <span className="text-gray-400 block text-xs">Evening Service</span>
                  <span className="font-medium text-white">{siteSettings.openingHours?.evening || '5:30 PM – 11:00 PM'}</span>
                </div>
              </div>
              {siteSettings.collectionDiscount?.enabled && (
                <div className="mt-3 p-2.5 rounded bg-[#5D1720]/60 border border-[#C5A15B]/30 text-xs text-[#C5A15B] font-semibold">
                  ★ 10% Discount applied automatically on all collection orders.
                </div>
              )}
            </div>
          </div>

          {/* Column 3: Contact & Location */}
          <div className="space-y-4">
            <h4 className="font-serif text-lg font-semibold text-[#C5A15B] tracking-wide">
              Visit & Contact
            </h4>
            <div className="space-y-3 text-sm text-gray-300">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#C5A15B] shrink-0 mt-1" />
                <div>
                  <p className="text-white font-medium">Rashoi</p>
                  <p>58 Updown Hill</p>
                  <p>Windlesham, Surrey, GU20 6DX</p>
                  <a
                    href={siteSettings.googleMapsUrl || 'https://share.google/m1l4gEswAPjn9ckfn'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block text-xs text-[#C5A15B] hover:underline mt-1"
                  >
                    Get Directions (Google Maps) →
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-2.5 pt-1">
                <Phone className="w-4 h-4 text-[#C5A15B] shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <a href="tel:01276452197" className="block text-white hover:text-[#C5A15B] font-semibold">
                    01276 452 197
                  </a>
                  <a href="tel:01276453388" className="block text-white hover:text-[#C5A15B] font-semibold">
                    01276 453 388
                  </a>
                </div>
              </div>
              {siteSettings.contactEmail ? (
                <div className="flex items-center gap-2.5 pt-1">
                  <Mail className="w-4 h-4 text-[#C5A15B] shrink-0" />
                  <a href={`mailto:${siteSettings.contactEmail}`} className="text-white hover:text-[#C5A15B]">
                    {siteSettings.contactEmail}
                  </a>
                </div>
              ) : null}
            </div>
          </div>

          {/* Column 4: Quick Links & Customer Care */}
          <div className="space-y-4">
            <h4 className="font-serif text-lg font-semibold text-[#C5A15B] tracking-wide">
              Customer Care & Links
            </h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>
                <button
                  onClick={() => handleNav('menu')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Digital Restaurant Menu
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('reservations')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Table Reservation Request
                </button>
              </li>
              {siteSettings.collectionOrderingEnabled && (
                <li>
                  <button
                    onClick={() => handleNav('collection')}
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    Order Online for Collection
                  </button>
                </li>
              )}
              <li>
                <button
                  onClick={onOpenFeedback}
                  className="hover:text-[#C5A15B] text-white flex items-center gap-1.5 font-medium transition-colors cursor-pointer"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-[#C5A15B]" />
                  Complaints & Feedback
                </button>
              </li>
              {isAdmin && (
                <li className="pt-2 border-t border-white/10">
                  <button
                    onClick={() => handleNav('admin')}
                    className="text-[#C5A15B] hover:text-white flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Admin Management Console
                  </button>
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Allergen Disclaimer & Bottom Bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-400">
          <p className="text-center md:text-left leading-relaxed">
            <strong className="text-gray-300">Allergen Notice:</strong> {siteSettings.allergenNotice || 'Some of our foods contain allergens. Please speak to a member of staff for more information. Thank you.'}
          </p>
          <div className="flex items-center gap-5 shrink-0">
            <button onClick={onOpenPrivacy} className="hover:text-white transition-colors cursor-pointer">
              Privacy Policy
            </button>
            <span>•</span>
            <button onClick={onOpenTerms} className="hover:text-white transition-colors cursor-pointer">
              Terms & Conditions
            </button>
          </div>
        </div>

        <div className="mt-6 text-center text-xs text-gray-500">
          © 1989 – {new Date().getFullYear()} Rashoi Indian Cuisine. Windlesham, Surrey, GU20 6DX. All rights reserved.
        </div>
      </div>
    </footer>
  );
};
