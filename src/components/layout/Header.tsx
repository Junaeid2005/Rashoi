import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  UtensilsCrossed,
  CalendarDays,
  ShoppingBag,
  ShieldCheck,
  User as UserIcon,
  Menu as MenuIcon,
  X,
  Phone,
  LogOut,
  MapPin,
  Clock,
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    user,
    isAdmin,
    siteSettings,
    cartCount,
    currentView,
    setCurrentView,
    loginWithGoogle,
    logout,
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNav = (view: string) => {
    setCurrentView(view);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#EAE4DF] transition-all">
      {/* Top information announcement bar */}
      <div className="bg-[#5D1720] text-white text-xs py-2 px-4 border-b border-[#7B202B]">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-4 text-white/90">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#C5A15B]" />
              58 Updown Hill, Windlesham, Surrey
            </span>
            <span className="hidden md:flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#C5A15B]" />
              Open 7 Days • Lunch & Evening Service
            </span>
          </div>
          <div className="flex items-center gap-4 text-xs font-medium">
            {siteSettings.collectionDiscount?.enabled && (
              <span className="text-[#C5A15B] font-semibold tracking-wide">
                ★ 10% DISCOUNT ON COLLECTION
              </span>
            )}
            <a
              href="tel:01276452197"
              className="flex items-center gap-1 text-white hover:text-[#C5A15B] transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-[#C5A15B]" />
              <span className="font-semibold">01276 452 197</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main navigation bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo */}
          <button
            onClick={() => handleNav('home')}
            className="flex flex-col items-start text-left focus:outline-none group cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <span className="font-serif text-3xl font-bold tracking-wider text-[#7B202B] group-hover:text-[#5D1720] transition-colors">
                RASHOI
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-[#706866] font-medium">
              <span>Indian Cuisine</span>
              <span className="text-[#C5A15B]">•</span>
              <span>Est. 1989</span>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7">
            <button
              onClick={() => handleNav('home')}
              className={`text-sm font-medium tracking-wide transition-colors cursor-pointer ${
                currentView === 'home'
                  ? 'text-[#7B202B] border-b-2 border-[#7B202B] pb-1'
                  : 'text-[#252020] hover:text-[#7B202B]'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => handleNav('menu')}
              className={`text-sm font-medium tracking-wide transition-colors cursor-pointer ${
                currentView === 'menu'
                  ? 'text-[#7B202B] border-b-2 border-[#7B202B] pb-1'
                  : 'text-[#252020] hover:text-[#7B202B]'
              }`}
            >
              Menu
            </button>
            <button
              onClick={() => handleNav('reservations')}
              className={`text-sm font-medium tracking-wide transition-colors cursor-pointer ${
                currentView === 'reservations'
                  ? 'text-[#7B202B] border-b-2 border-[#7B202B] pb-1'
                  : 'text-[#252020] hover:text-[#7B202B]'
              }`}
            >
              Book a Table
            </button>
            {siteSettings.collectionOrderingEnabled && (
              <button
                onClick={() => handleNav('collection')}
                className={`text-sm font-medium tracking-wide transition-colors cursor-pointer flex items-center gap-1.5 ${
                  currentView === 'collection'
                    ? 'text-[#7B202B] border-b-2 border-[#7B202B] pb-1'
                    : 'text-[#252020] hover:text-[#7B202B]'
                }`}
              >
                Collection Orders
                <span className="bg-[#7B202B]/10 text-[#7B202B] text-[10px] font-bold px-1.5 py-0.5 rounded">
                  10% Off
                </span>
              </button>
            )}
            <button
              onClick={() => handleNav('about')}
              className={`text-sm font-medium tracking-wide transition-colors cursor-pointer ${
                currentView === 'about'
                  ? 'text-[#7B202B] border-b-2 border-[#7B202B] pb-1'
                  : 'text-[#252020] hover:text-[#7B202B]'
              }`}
            >
              About Us
            </button>
            <button
              onClick={() => handleNav('reviews')}
              className={`text-sm font-medium tracking-wide transition-colors cursor-pointer ${
                currentView === 'reviews'
                  ? 'text-[#7B202B] border-b-2 border-[#7B202B] pb-1'
                  : 'text-[#252020] hover:text-[#7B202B]'
              }`}
            >
              Reviews
            </button>
            <button
              onClick={() => handleNav('contact')}
              className={`text-sm font-medium tracking-wide transition-colors cursor-pointer ${
                currentView === 'contact'
                  ? 'text-[#7B202B] border-b-2 border-[#7B202B] pb-1'
                  : 'text-[#252020] hover:text-[#7B202B]'
              }`}
            >
              Contact
            </button>
          </nav>

          {/* Action controls */}
          <div className="flex items-center gap-3">
            {/* Collection Cart button */}
            {siteSettings.collectionOrderingEnabled && (
              <button
                onClick={() => handleNav('collection')}
                className="relative p-2.5 text-[#252020] hover:text-[#7B202B] hover:bg-[#FAF8F4] rounded-full transition-colors cursor-pointer"
                title="View Collection Basket"
                aria-label="View Collection Basket"
              >
                <ShoppingBag className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#7B202B] text-white text-[11px] font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-md animate-pulse">
                    {cartCount}
                  </span>
                )}
              </button>
            )}

            {/* Book a Table Primary CTA (Desktop) */}
            <button
              onClick={() => handleNav('reservations')}
              className="hidden sm:inline-flex items-center gap-2 bg-[#7B202B] hover:bg-[#5D1720] text-white text-xs uppercase tracking-wider font-semibold px-4 py-2.5 rounded-sm transition-all shadow-sm hover:shadow cursor-pointer"
            >
              <CalendarDays className="w-4 h-4 text-[#C5A15B]" />
              Book Table
            </button>

            {/* Admin Dashboard shortcut button if admin */}
            {isAdmin && (
              <button
                onClick={() => handleNav('admin')}
                className="hidden md:inline-flex items-center gap-1.5 bg-[#FAF8F4] border border-[#C5A15B] text-[#7B202B] hover:bg-[#5D1720] hover:text-white text-xs font-semibold px-3 py-2 rounded-sm transition-all cursor-pointer shadow-sm"
              >
                <ShieldCheck className="w-4 h-4 text-[#C5A15B]" />
                Admin
              </button>
            )}

            {/* Google Authentication Control */}
            {user ? (
              <div className="flex items-center gap-2 pl-1 border-l border-[#EAE4DF]">
                <button
                  onClick={() => handleNav('my-account')}
                  className="flex items-center gap-2 text-xs font-medium text-[#252020] hover:text-[#7B202B] cursor-pointer"
                  title="My Bookings & Orders"
                >
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={user.displayName || 'User'}
                      className="w-7 h-7 rounded-full border border-[#C5A15B] object-cover"
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-[#7B202B] text-white flex items-center justify-center text-xs font-bold">
                      {user.displayName?.charAt(0) || user.email?.charAt(0) || 'U'}
                    </div>
                  )}
                  <span className="hidden xl:inline max-w-[100px] truncate">
                    {user.displayName || 'My Account'}
                  </span>
                </button>
                <button
                  onClick={logout}
                  className="p-1.5 text-[#706866] hover:text-[#7B202B] rounded-full cursor-pointer"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={loginWithGoogle}
                className="hidden sm:inline-flex items-center gap-2 text-xs font-medium text-[#7B202B] hover:text-[#5D1720] border border-[#7B202B]/30 hover:border-[#7B202B] px-3 py-2 rounded-sm transition-colors cursor-pointer"
              >
                <UserIcon className="w-3.5 h-3.5 text-[#C5A15B]" />
                Google Sign In
              </button>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-[#252020] hover:text-[#7B202B] cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-[#EAE4DF] px-4 pt-2 pb-6 space-y-3 shadow-xl">
          <nav className="flex flex-col space-y-2">
            <button
              onClick={() => handleNav('home')}
              className={`text-left px-3 py-2 rounded text-base font-medium ${
                currentView === 'home' ? 'bg-[#FAF8F4] text-[#7B202B] font-semibold' : 'text-[#252020]'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => handleNav('menu')}
              className={`text-left px-3 py-2 rounded text-base font-medium ${
                currentView === 'menu' ? 'bg-[#FAF8F4] text-[#7B202B] font-semibold' : 'text-[#252020]'
              }`}
            >
              Digital Menu
            </button>
            <button
              onClick={() => handleNav('reservations')}
              className={`text-left px-3 py-2 rounded text-base font-medium ${
                currentView === 'reservations' ? 'bg-[#FAF8F4] text-[#7B202B] font-semibold' : 'text-[#252020]'
              }`}
            >
              Book a Table
            </button>
            {siteSettings.collectionOrderingEnabled && (
              <button
                onClick={() => handleNav('collection')}
                className={`text-left px-3 py-2 rounded text-base font-medium flex items-center justify-between ${
                  currentView === 'collection' ? 'bg-[#FAF8F4] text-[#7B202B] font-semibold' : 'text-[#252020]'
                }`}
              >
                <span>Collection Orders</span>
                <span className="bg-[#7B202B] text-white text-[10px] font-bold px-2 py-0.5 rounded">
                  10% OFF
                </span>
              </button>
            )}
            <button
              onClick={() => handleNav('about')}
              className={`text-left px-3 py-2 rounded text-base font-medium ${
                currentView === 'about' ? 'bg-[#FAF8F4] text-[#7B202B] font-semibold' : 'text-[#252020]'
              }`}
            >
              About Rashoi
            </button>
            <button
              onClick={() => handleNav('reviews')}
              className={`text-left px-3 py-2 rounded text-base font-medium ${
                currentView === 'reviews' ? 'bg-[#FAF8F4] text-[#7B202B] font-semibold' : 'text-[#252020]'
              }`}
            >
              Guest Reviews
            </button>
            <button
              onClick={() => handleNav('contact')}
              className={`text-left px-3 py-2 rounded text-base font-medium ${
                currentView === 'contact' ? 'bg-[#FAF8F4] text-[#7B202B] font-semibold' : 'text-[#252020]'
              }`}
            >
              Contact & Directions
            </button>

            {user && (
              <button
                onClick={() => handleNav('my-account')}
                className={`text-left px-3 py-2 rounded text-base font-medium border-t border-[#EAE4DF] pt-3 ${
                  currentView === 'my-account' ? 'bg-[#FAF8F4] text-[#7B202B] font-semibold' : 'text-[#252020]'
                }`}
              >
                My Reservations & Orders
              </button>
            )}

            {isAdmin && (
              <button
                onClick={() => handleNav('admin')}
                className="text-left px-3 py-2 rounded text-base font-medium bg-[#5D1720] text-white flex items-center justify-between"
              >
                <span>Administrator Dashboard</span>
                <ShieldCheck className="w-5 h-5 text-[#C5A15B]" />
              </button>
            )}
          </nav>

          <div className="pt-3 border-t border-[#EAE4DF] flex flex-col gap-2.5">
            {!user ? (
              <button
                onClick={loginWithGoogle}
                className="w-full flex items-center justify-center gap-2 bg-white border border-[#7B202B] text-[#7B202B] font-medium py-2.5 px-4 rounded text-sm shadow-sm"
              >
                <UserIcon className="w-4 h-4 text-[#C5A15B]" />
                Sign in with Google
              </button>
            ) : (
              <button
                onClick={logout}
                className="w-full flex items-center justify-center gap-2 bg-gray-100 text-[#706866] py-2 px-4 rounded text-sm"
              >
                <LogOut className="w-4 h-4" />
                Sign Out ({user.displayName || user.email})
              </button>
            )}
            <a
              href="tel:01276452197"
              className="w-full flex items-center justify-center gap-2 bg-[#7B202B] text-white py-2.5 px-4 rounded text-sm font-semibold"
            >
              <Phone className="w-4 h-4 text-[#C5A15B]" />
              Call 01276 452 197
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
