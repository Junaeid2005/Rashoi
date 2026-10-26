import React from 'react';
import { useApp } from '../../context/AppContext';
import { MapPin, Phone, Clock, Mail, MessageSquare, ExternalLink, CalendarDays } from 'lucide-react';

interface ContactPageProps {
  onOpenFeedback: () => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ onOpenFeedback }) => {
  const { siteSettings, setCurrentView } = useApp();

  return (
    <div className="min-h-screen bg-[#FAF8F4] py-14 sm:py-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#7B202B]">
            Find & Contact Us
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#252020]">
            Contact Rashoi Windlesham
          </h1>
          <p className="text-sm text-[#706866] leading-relaxed">
            We are here to assist with dining reservations, collection takeaway orders, and catering enquiries.
          </p>
        </div>

        {/* Contact Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Address */}
          <div className="bg-white rounded-lg p-6 sm:p-8 border border-[#EAE4DF] shadow-xs flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-full bg-[#7B202B]/10 text-[#7B202B] flex items-center justify-center">
                <MapPin className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl font-bold text-[#252020]">Our Address</h3>
              <div className="text-xs text-[#706866] space-y-1">
                <p className="font-semibold text-[#252020]">Rashoi Indian Cuisine</p>
                <p>58 Updown Hill</p>
                <p>Windlesham, Surrey</p>
                <p>GU20 6DX, United Kingdom</p>
              </div>
            </div>
            <a
              href={siteSettings.googleMapsUrl || 'https://share.google/m1l4gEswAPjn9ckfn'}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#7B202B] hover:underline"
            >
              Get Directions →
            </a>
          </div>

          {/* Card 2: Phone */}
          <div className="bg-white rounded-lg p-6 sm:p-8 border border-[#EAE4DF] shadow-xs flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-full bg-[#7B202B]/10 text-[#7B202B] flex items-center justify-center">
                <Phone className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl font-bold text-[#252020]">Telephone</h3>
              <p className="text-xs text-[#706866]">
                Call our team for reservations, takeaways, or dietary queries:
              </p>
              <div className="space-y-1 text-sm font-bold text-[#7B202B]">
                <a href="tel:01276452197" className="block hover:underline">
                  01276 452 197
                </a>
                <a href="tel:01276453388" className="block hover:underline">
                  01276 453 388
                </a>
              </div>
            </div>
            <span className="text-[11px] text-[#706866]">Available 7 days during service</span>
          </div>

          {/* Card 3: Hours */}
          <div className="bg-white rounded-lg p-6 sm:p-8 border border-[#EAE4DF] shadow-xs flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-full bg-[#7B202B]/10 text-[#7B202B] flex items-center justify-center">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl font-bold text-[#252020]">Service Hours</h3>
              <p className="text-xs font-semibold text-[#252020]">Open 7 Days A Week</p>
              <div className="space-y-1 text-xs text-[#706866]">
                <div>
                  <span className="block font-medium text-[#252020]">Lunch:</span>
                  <span>{siteSettings.openingHours?.lunch || '12:00 PM – 2:30 PM'}</span>
                </div>
                <div>
                  <span className="block font-medium text-[#252020]">Evening:</span>
                  <span>{siteSettings.openingHours?.evening || '5:30 PM – 11:00 PM'}</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setCurrentView('reservations')}
              className="text-xs font-bold text-[#7B202B] hover:underline text-left cursor-pointer"
            >
              Reserve a Table →
            </button>
          </div>
        </div>

        {/* Complaints & Feedback Section */}
        <div className="bg-white rounded-lg p-8 sm:p-12 border border-[#EAE4DF] shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center sm:text-left">
            <h3 className="font-serif text-2xl font-bold text-[#252020]">
              Customer Feedback & Enquiries
            </h3>
            <p className="text-xs sm:text-sm text-[#706866] max-w-lg leading-relaxed">
              Have comments on your meal or experience? Send us a direct message through our feedback system, reviewed by management.
            </p>
          </div>
          <button
            onClick={onOpenFeedback}
            className="shrink-0 bg-[#7B202B] hover:bg-[#5D1720] text-white text-xs font-semibold px-6 py-3.5 rounded cursor-pointer inline-flex items-center gap-2 shadow-sm"
          >
            <MessageSquare className="w-4 h-4 text-[#C5A15B]" />
            Submit Feedback or Complaint
          </button>
        </div>
      </div>
    </div>
  );
};
