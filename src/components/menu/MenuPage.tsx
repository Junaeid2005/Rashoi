import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { MenuItem, MenuCategory, MenuVariant } from '../../types';
import {
  Search,
  Plus,
  Info,
  AlertCircle,
  ShoppingBag,
  Sparkles,
  Phone,
  Check,
} from 'lucide-react';

export const MenuPage: React.FC = () => {
  const { categories, menuItems, addToCart, siteSettings, setCurrentView } = useApp();

  const [activeCategoryId, setActiveCategoryId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedItemForVariant, setSelectedItemForVariant] = useState<MenuItem | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<MenuVariant | null>(null);

  // Active categories
  const activeCategories = useMemo(() => {
    return categories
      .filter((c) => c.isActive)
      .sort((a, b) => a.displayOrder - b.displayOrder);
  }, [categories]);

  // Filtered menu items
  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      if (!item.isAvailable) return false;

      // Category filter
      if (activeCategoryId !== 'all' && item.categoryId !== activeCategoryId) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(q);
        const matchesDesc = (item.description || '').toLowerCase().includes(q);
        const matchesCategory = item.categoryId.toLowerCase().includes(q);
        return matchesName || matchesDesc || matchesCategory;
      }

      return true;
    });
  }, [menuItems, activeCategoryId, searchQuery]);

  // Group items by category for "all" view
  const itemsByCategory = useMemo(() => {
    const grouped: Record<string, MenuItem[]> = {};
    activeCategories.forEach((cat) => {
      const catItems = filteredItems.filter((i) => i.categoryId === cat.id);
      if (catItems.length > 0) {
        grouped[cat.id] = catItems.sort((a, b) => a.displayOrder - b.displayOrder);
      }
    });
    return grouped;
  }, [activeCategories, filteredItems]);

  const handleItemAction = (item: MenuItem) => {
    if (item.variants && item.variants.length > 0) {
      setSelectedItemForVariant(item);
      setSelectedVariant(item.variants[0]);
    } else {
      addToCart(item);
    }
  };

  const handleAddVariantToCart = () => {
    if (!selectedItemForVariant || !selectedVariant) return;

    if (selectedVariant.price === null || selectedVariant.price === undefined) {
      return;
    }

    addToCart(selectedItemForVariant, selectedVariant, 1);
    setSelectedItemForVariant(null);
    setSelectedVariant(null);
  };

  return (
    <div className="min-h-screen bg-[#FAF8F4] py-10 sm:py-14">
      {/* Menu Header Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-10">
        <span className="text-xs uppercase tracking-widest text-[#7B202B] font-semibold">
          Authentic Indian Recipes • Windlesham
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#252020] mt-2 mb-3">
          Our Digital Restaurant Menu
        </h1>
        <p className="max-w-2xl mx-auto text-sm sm:text-base text-[#706866] leading-relaxed">
          Prepared to order with traditional Indian spices and charcoal grilled in our clay oven. Prices shown in Pounds Sterling (GBP).
        </p>

        {/* 10% Discount Announcement in Menu */}
        {siteSettings.collectionDiscount?.enabled && siteSettings.collectionOrderingEnabled && (
          <div className="mt-4 inline-flex items-center gap-2 bg-[#5D1720] text-[#C5A15B] text-xs font-semibold px-4 py-2 rounded-full shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>10% Discount applied automatically on all collection orders!</span>
          </div>
        )}

        {/* Allergen Notice Banner */}
        <div className="mt-4 bg-amber-50 border border-amber-200/80 rounded-md p-3 max-w-2xl mx-auto text-xs text-amber-900 flex items-center justify-center gap-2">
          <Info className="w-4 h-4 text-amber-700 shrink-0" />
          <span>
            {siteSettings.allergenNotice ||
              'Some of our foods contain allergens. Please speak to a member of staff for more information.'}
          </span>
        </div>
      </div>

      {/* Sticky Category Navigator & Search Bar */}
      <div className="sticky top-20 z-30 bg-[#FAF8F4]/95 backdrop-blur-md border-y border-[#EAE4DF] py-3 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Category pill shortcuts */}
          <div className="flex items-center gap-2 overflow-x-auto w-full pb-2 md:pb-0 scrollbar-none text-xs">
            <button
              onClick={() => setActiveCategoryId('all')}
              className={`px-3.5 py-2 rounded-full whitespace-nowrap font-medium transition-all cursor-pointer ${
                activeCategoryId === 'all'
                  ? 'bg-[#7B202B] text-white shadow-sm'
                  : 'bg-white text-[#252020] hover:bg-gray-100 border border-[#EAE4DF]'
              }`}
            >
              All Categories
            </button>
            {activeCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategoryId(cat.id)}
                className={`px-3.5 py-2 rounded-full whitespace-nowrap font-medium transition-all cursor-pointer ${
                  activeCategoryId === cat.id
                    ? 'bg-[#7B202B] text-white shadow-sm'
                    : 'bg-white text-[#252020] hover:bg-gray-100 border border-[#EAE4DF]'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-72 shrink-0">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-[#706866]" />
            <input
              type="text"
              placeholder="Search dish or ingredient..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-[#EAE4DF] rounded-full pl-9 pr-4 py-2 text-xs text-[#252020] placeholder-[#706866] focus:outline-none focus:border-[#7B202B]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2 text-xs text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Menu Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {filteredItems.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg border border-[#EAE4DF] p-8 max-w-md mx-auto">
            <p className="text-sm font-semibold text-[#252020]">No menu items found</p>
            <p className="text-xs text-[#706866] mt-1">
              Try adjusting your search query or select another category.
            </p>
            <button
              onClick={() => {
                setActiveCategoryId('all');
                setSearchQuery('');
              }}
              className="mt-4 text-xs font-semibold text-[#7B202B] underline"
            >
              View all dishes
            </button>
          </div>
        ) : (
          <div className="space-y-16">
            {activeCategories.map((cat) => {
              const catItems = itemsByCategory[cat.id];
              if (!catItems || catItems.length === 0) return null;

              return (
                <div key={cat.id} id={cat.id} className="scroll-mt-36">
                  {/* Category Title & Description */}
                  <div className="border-b-2 border-[#7B202B]/20 pb-3 mb-6">
                    <div className="flex items-center justify-between">
                      <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#7B202B]">
                        {cat.name}
                      </h2>
                      <span className="text-xs font-semibold text-[#706866]">
                        {catItems.length} {catItems.length === 1 ? 'Dish' : 'Dishes'}
                      </span>
                    </div>
                    {cat.description && (
                      <p className="text-xs sm:text-sm text-[#706866] mt-1 italic">
                        "{cat.description}"
                      </p>
                    )}
                  </div>

                  {/* Classic Dishes Structured Matrix View */}
                  {cat.id === 'classic-dishes' ? (
                    <div className="space-y-4">
                      <div className="bg-white rounded-lg border border-[#EAE4DF] p-4 text-xs text-[#706866] flex items-center justify-between">
                        <span>
                          <strong>Classic Curry Styles:</strong> Select your preferred curry style and choice of protein filling below.
                        </span>
                        <span className="hidden sm:inline text-[#C5A15B] font-semibold">
                          Choice of Chicken, Lamb, Prawn, King Prawn, or Vegetable
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {catItems.map((dish) => (
                          <div
                            key={dish.id}
                            className="bg-white rounded-lg p-5 border border-[#EAE4DF] hover:border-[#C5A15B]/50 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                          >
                            <div>
                              <div className="flex items-start justify-between gap-2">
                                <h3 className="font-serif text-xl font-bold text-[#252020]">
                                  {dish.name}
                                </h3>
                                <span className="text-xs font-semibold text-[#7B202B] bg-[#7B202B]/10 px-2 py-0.5 rounded">
                                  from £8.95
                                </span>
                              </div>
                              <p className="text-xs text-[#706866] mt-1.5 leading-relaxed">
                                {dish.description}
                              </p>

                              {/* Protein Options Grid */}
                              <div className="mt-4 pt-3 border-t border-[#EAE4DF] space-y-2">
                                <span className="text-[11px] font-semibold text-[#252020] uppercase tracking-wider block">
                                  Available Fillings & Prices:
                                </span>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                  {dish.variants?.map((v) => {
                                    const isPriceMissing = v.price === null || v.price === undefined;
                                    return (
                                      <div
                                        key={v.id}
                                        className={`p-2 rounded border text-left text-xs flex flex-col justify-between ${
                                          isPriceMissing
                                            ? 'bg-amber-50/70 border-amber-200 text-amber-900'
                                            : 'bg-[#FAF8F4] border-[#EAE4DF] text-[#252020]'
                                        }`}
                                      >
                                        <span className="font-medium truncate">{v.name}</span>
                                        <div className="mt-1 flex items-center justify-between">
                                          {isPriceMissing ? (
                                            <span className="text-[10px] text-amber-800 font-semibold" title="Price not supplied in restaurant printed menu">
                                              Ask Restaurant
                                            </span>
                                          ) : (
                                            <span className="font-bold text-[#7B202B]">
                                              £{v.price!.toFixed(2)}
                                            </span>
                                          )}

                                          {siteSettings.collectionOrderingEnabled && !isPriceMissing && (
                                            <button
                                              onClick={() => addToCart(dish, v, 1)}
                                              className="p-1 text-[#7B202B] hover:bg-[#7B202B] hover:text-white rounded transition-colors cursor-pointer"
                                              title={`Add ${dish.name} (${v.name}) to collection basket`}
                                            >
                                              <Plus className="w-3.5 h-3.5" />
                                            </button>
                                          )}
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            </div>

                            {/* Missing price note if applicable */}
                            {dish.variants?.some((v) => v.price === null) && (
                              <div className="mt-3 text-[11px] text-amber-800 bg-amber-50 p-2 rounded flex items-center gap-1.5">
                                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                                <span>Please contact the restaurant for unlisted variant prices.</span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    /* Regular Category Dishes Grid */
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {catItems.map((item) => {
                        const hasVariants = Boolean(item.variants && item.variants.length > 0);
                        const isSinglePrice = item.basePrice !== null && item.basePrice !== undefined;

                        return (
                          <div
                            key={item.id}
                            className="bg-white rounded-lg p-5 border border-[#EAE4DF] hover:border-[#C5A15B]/50 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
                          >
                            <div className="space-y-2">
                              <div className="flex items-start justify-between gap-3">
                                <h3 className="font-serif text-lg font-bold text-[#252020] group-hover:text-[#7B202B] transition-colors">
                                  {item.name}
                                </h3>
                                <span className="font-serif font-bold text-base text-[#7B202B] shrink-0">
                                  {isSinglePrice
                                    ? `£${item.basePrice!.toFixed(2)}`
                                    : hasVariants
                                    ? `from £${Math.min(
                                        ...item.variants!
                                          .filter((v) => v.price !== null)
                                          .map((v) => v.price as number)
                                      ).toFixed(2)}`
                                    : 'Enquire'}
                                </span>
                              </div>

                              {item.description && (
                                <p className="text-xs text-[#706866] leading-relaxed">
                                  {item.description}
                                </p>
                              )}

                              {/* If variants exist, list them compact */}
                              {hasVariants && (
                                <div className="pt-2 flex flex-wrap gap-1.5">
                                  {item.variants!.map((v) => (
                                    <span
                                      key={v.id}
                                      className="text-[11px] bg-[#FAF8F4] border border-[#EAE4DF] px-2 py-0.5 rounded text-[#252020]"
                                    >
                                      {v.name}:{' '}
                                      <strong className="text-[#7B202B]">
                                        {v.price !== null ? `£${v.price.toFixed(2)}` : 'Ask'}
                                      </strong>
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>

                            {/* Action Row */}
                            <div className="pt-4 mt-3 border-t border-[#EAE4DF] flex items-center justify-between">
                              {siteSettings.collectionOrderingEnabled && (
                                <button
                                  onClick={() => handleItemAction(item)}
                                  className="inline-flex items-center gap-1.5 bg-[#FAF8F4] hover:bg-[#7B202B] text-[#7B202B] hover:text-white border border-[#7B202B]/30 text-xs font-semibold px-3 py-1.5 rounded transition-all cursor-pointer"
                                >
                                  <Plus className="w-3.5 h-3.5" />
                                  {hasVariants ? 'Choose Variant' : 'Add to Collection'}
                                </button>
                              )}

                              {item.isFeatured && (
                                <span className="text-[10px] uppercase font-bold tracking-wider text-[#C5A15B] bg-[#C5A15B]/10 px-2 py-0.5 rounded">
                                  Speciality
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Variant Selection Modal for dishes with choices */}
      {selectedItemForVariant && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-2xl border border-[#C5A15B]/40 space-y-5 animate-scale-in">
            <div className="border-b border-[#EAE4DF] pb-3">
              <span className="text-xs uppercase tracking-wider text-[#7B202B] font-semibold">
                Select Option
              </span>
              <h3 className="font-serif text-2xl font-bold text-[#252020] mt-1">
                {selectedItemForVariant.name}
              </h3>
              {selectedItemForVariant.description && (
                <p className="text-xs text-[#706866] mt-1">
                  {selectedItemForVariant.description}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-[#252020] uppercase tracking-wider block">
                Choose Filling / Variant:
              </label>
              <div className="space-y-2">
                {selectedItemForVariant.variants?.map((v) => {
                  const isMissing = v.price === null || v.price === undefined;
                  const isSelected = selectedVariant?.id === v.id;

                  return (
                    <button
                      key={v.id}
                      type="button"
                      disabled={isMissing}
                      onClick={() => !isMissing && setSelectedVariant(v)}
                      className={`w-full p-3 rounded-md border text-left flex items-center justify-between text-xs transition-all cursor-pointer ${
                        isSelected
                          ? 'border-[#7B202B] bg-[#FAF8F4] text-[#7B202B] ring-1 ring-[#7B202B]'
                          : isMissing
                          ? 'opacity-60 bg-gray-50 border-gray-200 cursor-not-allowed'
                          : 'border-[#EAE4DF] hover:border-gray-300 text-[#252020]'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                            isSelected ? 'border-[#7B202B] bg-[#7B202B]' : 'border-gray-300'
                          }`}
                        >
                          {isSelected && <Check className="w-3 h-3 text-white" />}
                        </div>
                        <span className="font-medium text-sm">{v.name}</span>
                      </div>

                      {isMissing ? (
                        <span className="text-amber-800 text-[11px] font-semibold">
                          Price not supplied
                        </span>
                      ) : (
                        <span className="font-bold text-sm text-[#7B202B]">
                          £{v.price!.toFixed(2)}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {selectedVariant && selectedVariant.price === null && (
              <p className="text-xs text-amber-800 bg-amber-50 p-2.5 rounded border border-amber-200">
                This item variant price is not confirmed in the menu. Please contact Rashoi at 01276 452 197 to order.
              </p>
            )}

            <div className="flex gap-3 pt-3 border-t border-[#EAE4DF]">
              <button
                type="button"
                onClick={() => {
                  setSelectedItemForVariant(null);
                  setSelectedVariant(null);
                }}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-[#252020] text-xs font-semibold py-2.5 rounded cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={!selectedVariant || selectedVariant.price === null}
                onClick={handleAddVariantToCart}
                className="flex-1 bg-[#7B202B] hover:bg-[#5D1720] disabled:bg-gray-300 text-white text-xs font-semibold py-2.5 rounded cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
              >
                <Plus className="w-4 h-4" />
                Add to Collection Basket
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
