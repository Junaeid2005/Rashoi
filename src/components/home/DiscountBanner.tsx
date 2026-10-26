import React from 'react';
import { useApp } from '../../context/AppContext';
import { ShoppingBag, ArrowRight, Tag } from 'lucide-react';

export const DiscountBanner: React.FC = () => {
  const { siteSettings, setCurrentView } = useApp();

  if (!siteSettings.collectionDiscount?.enabled) return null;

  return (
    <section className="bg-gradient-to-r from-[#5D1720] via-[#7B202B] to-[#5D1720] text-white py-12 border-y border-[#C5A15B]/30 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#C5A15B_1px,transparent_1px)] [background-size:16px_16px]" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4 text-center md:text-left">
          <div className="w-14 h-14 rounded-full bg-[#C5A15B]/20 border border-[#C5A15B] flex items-center justify-center shrink-0 hidden sm:flex">
            <Tag className="w-7 h-7 text-[#C5A15B]" />
          </div>
          <div>
            <span className="text-[#C5A15B] text-xs uppercase tracking-widest font-semibold block mb-1">
              Direct Order Privilege
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-white">
              {siteSettings.collectionDiscount?.title || '10% DISCOUNT ON COLLECTION'}
            </h3>
            <p className="text-sm text-gray-200 mt-1 max-w-xl">
              {siteSettings.collectionDiscount?.description ||
                'Enjoy 10% off your collection orders when ordering directly with Rashoi.'}
            </p>
          </div>
        </div>

        {siteSettings.collectionOrderingEnabled && (
          <button
            onClick={() => {
              setCurrentView('collection');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="shrink-0 bg-[#C5A15B] hover:bg-[#d8b56f] text-[#252020] font-bold text-xs uppercase tracking-wider px-7 py-3.5 rounded-sm transition-all shadow-md hover:shadow-lg inline-flex items-center gap-2 cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4" />
            Order for Collection
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </section>
  );
};
