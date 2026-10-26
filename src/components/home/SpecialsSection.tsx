import React from 'react';
import { useApp } from '../../context/AppContext';
import { Plus, ArrowRight, Sparkles } from 'lucide-react';
import { MenuItem } from '../../types';

export const SpecialsSection: React.FC = () => {
  const { menuItems, addToCart, siteSettings, setCurrentView } = useApp();

  // Filter featured items or fallback to top curated signature dishes
  const featured = menuItems.filter((item) => item.isFeatured && item.isAvailable).slice(0, 6);
  const displayItems = featured.length > 0 ? featured : menuItems.slice(0, 6);

  const handleQuickAdd = (item: MenuItem) => {
    if (item.variants && item.variants.length > 0) {
      // Navigate to menu to select variant
      setCurrentView('menu');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      addToCart(item);
    }
  };

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#7B202B]">
            Handcrafted with Care
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#252020]">
            Explore Our Specialities
          </h2>
          <p className="text-sm sm:text-base text-[#706866]">
            A curated selection of Rashoi’s cherished signature recipes, freshly simmered and grilled to order.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayItems.map((item) => {
            const hasVariants = Boolean(item.variants && item.variants.length > 0);
            const displayPrice = item.basePrice !== null ? `£${item.basePrice.toFixed(2)}` : 'Options';

            return (
              <div
                key={item.id}
                className="bg-[#FAF8F4] rounded-lg p-6 border border-[#EAE4DF] hover:border-[#C5A15B]/60 transition-all shadow-sm hover:shadow-md flex flex-col justify-between group"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="font-serif text-xl font-bold text-[#252020] group-hover:text-[#7B202B] transition-colors">
                      {item.name}
                    </h3>
                    <span className="font-serif font-bold text-lg text-[#7B202B] shrink-0">
                      {displayPrice}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-[#706866] leading-relaxed line-clamp-3">
                    {item.description || 'Traditional Indian culinary recipe cooked with authentic aromatic spices.'}
                  </p>
                </div>

                <div className="pt-6 mt-4 border-t border-[#EAE4DF] flex items-center justify-between">
                  {hasVariants ? (
                    <button
                      onClick={() => {
                        setCurrentView('menu');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="text-xs font-semibold text-[#7B202B] hover:text-[#5D1720] flex items-center gap-1 cursor-pointer"
                    >
                      View Options <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    siteSettings.collectionOrderingEnabled && (
                      <button
                        onClick={() => handleQuickAdd(item)}
                        className="inline-flex items-center gap-1.5 bg-white hover:bg-[#7B202B] text-[#7B202B] hover:text-white border border-[#7B202B]/30 hover:border-[#7B202B] text-xs font-semibold px-3 py-1.5 rounded transition-all shadow-xs cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        Add to Collection
                      </button>
                    )
                  )}

                  <span className="text-[11px] text-[#706866] uppercase tracking-wider font-medium">
                    {item.categoryId.replace('-', ' ')}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-14 text-center">
          <button
            onClick={() => {
              setCurrentView('menu');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="inline-flex items-center gap-2 bg-[#7B202B] hover:bg-[#5D1720] text-white text-xs font-semibold uppercase tracking-wider px-8 py-3.5 rounded-sm transition-all shadow-md cursor-pointer"
          >
            Explore Complete Digital Menu ({menuItems.length} Dishes)
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};
