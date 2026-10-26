import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  subscribeAllReservations,
  subscribeAllOrders,
  subscribeFeedback,
  updateReservationStatus,
  updateOrderStatus,
  updateFeedbackStatus,
  deleteFeedback,
  setDateFullyBooked,
  setSlotClosed,
  updateSiteSettings,
  saveCategory,
  deleteCategory,
  saveMenuItem,
  deleteMenuItem,
  saveReview,
  deleteReview,
  seedInitialDatabaseIfEmpty,
} from '../../services/dbService';
import {
  Reservation,
  Order,
  Feedback,
  MenuCategory,
  MenuItem,
  MenuVariant,
  Review,
  SiteSettings,
} from '../../types';
import {
  ShieldCheck,
  CalendarDays,
  ShoppingBag,
  MessageSquare,
  UtensilsCrossed,
  Settings,
  Clock,
  Star,
  Plus,
  Trash2,
  Edit2,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Info,
  ChevronRight,
  Filter,
  Search,
  Tag,
  Lock,
  Globe,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const {
    user,
    isAdmin,
    authLoading,
    siteSettings,
    categories,
    menuItems,
    reservationDates,
    reservationSlots,
    reviews,
    showToast,
    loginWithGoogle,
    setCurrentView,
  } = useApp();

  const [activeSection, setActiveSection] = useState<string>('overview');

  // Real-time admin subscriptions
  const [allReservations, setAllReservations] = useState<Reservation[]>([]);
  const [allOrders, setAllOrders] = useState<Order[]>([]);
  const [allFeedback, setAllFeedback] = useState<Feedback[]>([]);

  // Subscriptions when admin is authenticated
  useEffect(() => {
    if (!isAdmin) return;

    const unsubRes = subscribeAllReservations(setAllReservations);
    const unsubOrd = subscribeAllOrders(setAllOrders);
    const unsubFb = subscribeFeedback(setAllFeedback);

    return () => {
      unsubRes();
      unsubOrd();
    };
  }, [isAdmin]);

  // Selected date for Fully Booked controls
  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);
  const [selectedDate, setSelectedDate] = useState<string>(todayStr);

  // Filter states
  const [resStatusFilter, setResStatusFilter] = useState<string>('all');
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');
  const [feedbackFilter, setFeedbackFilter] = useState<string>('all');

  // Category & Menu Item editing states
  const [editingCategory, setEditingCategory] = useState<MenuCategory | null>(null);
  const [isNewCategory, setIsNewCategory] = useState<boolean>(false);

  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [isNewItem, setIsNewItem] = useState<boolean>(false);

  // Site Settings Form state
  const [settingsForm, setSettingsForm] = useState<SiteSettings>(siteSettings);
  useEffect(() => {
    setSettingsForm(siteSettings);
  }, [siteSettings]);

  // If loading or unauthorized
  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#FAF8F4] flex items-center justify-center p-8">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-[#7B202B] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-semibold text-[#706866]">Verifying Administrator Authorization...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#FAF8F4] py-20 px-4">
        <div className="max-w-lg mx-auto bg-white rounded-lg p-8 sm:p-10 border border-[#EAE4DF] shadow-md text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-700 flex items-center justify-center mx-auto border border-rose-200">
            <Lock className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h2 className="font-serif text-2xl font-bold text-[#252020]">
              Administrator Access Protected
            </h2>
            <p className="text-xs text-[#706866] leading-relaxed">
              This area is restricted to authorized Rashoi management. Google Sign-in alone does not grant administrative privileges without verified allowlist matching.
            </p>
          </div>

          {!user ? (
            <div className="space-y-3">
              <p className="text-xs font-medium text-[#252020]">
                Are you an authorized administrator? Please sign in with your approved Google account:
              </p>
              <button
                onClick={loginWithGoogle}
                className="w-full bg-[#7B202B] hover:bg-[#5D1720] text-white text-xs font-semibold py-3 px-4 rounded transition-colors cursor-pointer shadow-sm"
              >
                Sign In with Google
              </button>
            </div>
          ) : (
            <div className="p-4 rounded bg-amber-50 border border-amber-200 text-xs text-amber-900 text-left space-y-2">
              <div className="flex items-center gap-2 font-bold text-amber-950">
                <AlertTriangle className="w-4 h-4 text-amber-700" />
                <span>Account Not in Administrator Allowlist</span>
              </div>
              <p>
                Signed in as: <strong>{user.email}</strong>.
              </p>
              <p>
                To grant admin privileges to this account, ensure your email is added to the administrator allowlist or added into the <code>admins</code> collection in Firestore.
              </p>
            </div>
          )}

          <div className="pt-2 border-t border-[#EAE4DF]">
            <button
              onClick={() => setCurrentView('home')}
              className="text-xs text-[#7B202B] hover:underline font-semibold"
            >
              ← Return to Public Homepage
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Real summary counts from database
  const pendingReservations = allReservations.filter((r) => r.status === 'pending');
  const todayReservations = allReservations.filter((r) => r.reservationDate === todayStr);
  const pendingOrders = allOrders.filter((o) => o.status === 'pending');
  const todayOrders = allOrders.filter((o) => o.collectionDate === todayStr);
  const unreadFeedback = allFeedback.filter((f) => f.status === 'unread');

  // Handle Date Fully Booked Toggle
  const isSelectedDateFullyBooked = Boolean(reservationDates[selectedDate]?.isFullyBooked);
  const handleToggleFullyBooked = async () => {
    try {
      const nextState = !isSelectedDateFullyBooked;
      await setDateFullyBooked(selectedDate, nextState, nextState ? 'Fully booked by restaurant' : '');
      showToast(
        `Date ${selectedDate} is now marked ${nextState ? 'FULLY BOOKED' : 'OPEN for bookings'}.`,
        'success'
      );
    } catch {
      showToast('Error updating date availability.', 'error');
    }
  };

  // Handle Slot Closed Toggle
  const standardSlots = [
    '12:00', '12:30', '13:00', '13:30', '14:00',
    '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00'
  ];

  const handleToggleSlot = async (time: string) => {
    const slotKey = `${selectedDate}_${time.replace(':', '-')}`;
    const isCurrentlyClosed = Boolean(reservationSlots[slotKey]?.isClosed);
    try {
      await setSlotClosed(slotKey, selectedDate, time, !isCurrentlyClosed);
      showToast(`Slot ${time} on ${selectedDate} is now ${!isCurrentlyClosed ? 'CLOSED' : 'OPEN'}.`, 'info');
    } catch {
      showToast('Error updating slot availability.', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F4] flex flex-col">
      {/* Top Admin Navigation Header */}
      <div className="bg-[#5D1720] text-white py-3 px-4 sm:px-8 border-b border-[#7B202B] flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-[#C5A15B]/20 border border-[#C5A15B] flex items-center justify-center text-[#C5A15B]">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-serif text-lg font-bold tracking-wide">Rashoi Management Console</h1>
            <span className="text-[11px] text-[#C5A15B] font-medium">
              Logged in as {user?.email} • Live Firestore Connected
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentView('home')}
            className="text-xs bg-white/10 hover:bg-white/20 text-white font-medium px-3.5 py-1.5 rounded transition-colors cursor-pointer"
          >
            ← View Public Site
          </button>
        </div>
      </div>

      {/* Main Admin Content Layout */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row gap-8">
        {/* Left Sidebar Menu */}
        <aside className="w-full md:w-64 shrink-0 bg-white rounded-lg border border-[#EAE4DF] p-3 shadow-xs space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#706866] px-3 py-2 block">
            Navigation
          </span>
          {[
            { id: 'overview', label: 'Overview', icon: ShieldCheck, badge: null },
            {
              id: 'availability',
              label: 'Fully Booked & Dates',
              icon: Clock,
              badge: isSelectedDateFullyBooked ? 'CLOSED' : null,
            },
            {
              id: 'reservations',
              label: 'Table Reservations',
              icon: CalendarDays,
              badge: pendingReservations.length > 0 ? pendingReservations.length : null,
            },
            {
              id: 'orders',
              label: 'Collection Orders',
              icon: ShoppingBag,
              badge: pendingOrders.length > 0 ? pendingOrders.length : null,
            },
            { id: 'menu', label: 'Menu Items', icon: UtensilsCrossed, badge: menuItems.length },
            { id: 'categories', label: 'Menu Categories', icon: Tag, badge: categories.length },
            {
              id: 'feedback',
              label: 'Feedback & Complaints',
              icon: MessageSquare,
              badge: unreadFeedback.length > 0 ? unreadFeedback.length : null,
            },
            { id: 'reviews', label: 'Guest Reviews', icon: Star, badge: reviews.length },
            { id: 'settings', label: 'Restaurant & Content', icon: Settings, badge: null },
            { id: 'setup', label: 'Setup & Domain Info', icon: Globe, badge: null },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#7B202B] text-white shadow-xs'
                    : 'text-[#252020] hover:bg-[#FAF8F4] hover:text-[#7B202B]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#C5A15B]' : 'text-[#706866]'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== null && (
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                      isActive
                        ? 'bg-white text-[#7B202B]'
                        : 'bg-[#FAF8F4] text-[#706866] border border-[#EAE4DF]'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </aside>

        {/* Right Content View */}
        <main className="flex-1 bg-white rounded-lg border border-[#EAE4DF] p-6 sm:p-8 shadow-xs">
          {/* 1. OVERVIEW */}
          {activeSection === 'overview' && (
            <div className="space-y-8">
              <div>
                <h2 className="font-serif text-2xl font-bold text-[#252020]">Overview Dashboard</h2>
                <p className="text-xs text-[#706866] mt-1">
                  Live counts and activity for Rashoi Windlesham.
                </p>
              </div>

              {/* Metric Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-[#FAF8F4] p-4 rounded border border-[#EAE4DF] space-y-1">
                  <span className="text-[11px] font-semibold text-[#706866] uppercase">Today's Bookings</span>
                  <div className="text-2xl font-bold text-[#7B202B]">{todayReservations.length}</div>
                </div>

                <div className="bg-[#FAF8F4] p-4 rounded border border-[#EAE4DF] space-y-1">
                  <span className="text-[11px] font-semibold text-[#706866] uppercase">Pending Bookings</span>
                  <div className="text-2xl font-bold text-amber-800">{pendingReservations.length}</div>
                </div>

                <div className="bg-[#FAF8F4] p-4 rounded border border-[#EAE4DF] space-y-1">
                  <span className="text-[11px] font-semibold text-[#706866] uppercase">Today's Orders</span>
                  <div className="text-2xl font-bold text-[#7B202B]">{todayOrders.length}</div>
                </div>

                <div className="bg-[#FAF8F4] p-4 rounded border border-[#EAE4DF] space-y-1">
                  <span className="text-[11px] font-semibold text-[#706866] uppercase">Unread Feedback</span>
                  <div className="text-2xl font-bold text-indigo-800">{unreadFeedback.length}</div>
                </div>
              </div>

              {/* Quick Status Banners */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                <div className="p-5 rounded-lg border border-[#EAE4DF] bg-[#FAF8F4] space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-serif font-bold text-base text-[#252020]">
                      Today's Booking Availability
                    </h3>
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded ${
                        Boolean(reservationDates[todayStr]?.isFullyBooked)
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {Boolean(reservationDates[todayStr]?.isFullyBooked) ? 'FULLY BOOKED' : 'OPEN'}
                    </span>
                  </div>
                  <p className="text-xs text-[#706866]">
                    You can switch fully booked status on or off for today or any upcoming date in the availability tab.
                  </p>
                  <button
                    onClick={() => {
                      setSelectedDate(todayStr);
                      setActiveSection('availability');
                    }}
                    className="text-xs font-semibold text-[#7B202B] hover:underline"
                  >
                    Manage Date Availability →
                  </button>
                </div>

                <div className="p-5 rounded-lg border border-[#EAE4DF] bg-[#FAF8F4] space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-serif font-bold text-base text-[#252020]">
                      Collection Discount Status
                    </h3>
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                      {siteSettings.collectionDiscount?.enabled ? 'ACTIVE (10%)' : 'DISABLED'}
                    </span>
                  </div>
                  <p className="text-xs text-[#706866]">
                    Advertised 10% discount is currently applied to all direct collection orders.
                  </p>
                  <button
                    onClick={() => setActiveSection('settings')}
                    className="text-xs font-semibold text-[#7B202B] hover:underline"
                  >
                    Edit Promotional Settings →
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 2. AVAILABILITY & FULLY BOOKED CONTROLS */}
          {activeSection === 'availability' && (
            <div className="space-y-6">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#7B202B]">
                  Capacity & Reservation Control
                </span>
                <h2 className="font-serif text-2xl font-bold text-[#252020]">
                  Date-Specific Fully Booked & Time Slots
                </h2>
                <p className="text-xs text-[#706866] mt-1">
                  Select a specific date to turn Fully Booked ON or OFF, or close individual time slots.
                </p>
              </div>

              {/* Date Selector Card */}
              <div className="p-5 rounded-lg bg-[#FAF8F4] border border-[#EAE4DF] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#252020] uppercase tracking-wider block">
                    Choose Date:
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="bg-white border border-[#EAE4DF] rounded px-3 py-2 text-sm text-[#252020] font-semibold focus:outline-none focus:border-[#7B202B]"
                  />
                  {selectedDate === todayStr && (
                    <span className="text-[11px] text-[#7B202B] font-bold ml-2">Today</span>
                  )}
                </div>

                {/* Fully Booked Main Switch */}
                <div className="flex items-center gap-3 bg-white p-3 rounded-lg border border-[#EAE4DF] shadow-xs">
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-[#252020] block">
                      Fully Booked Status:
                    </span>
                    <span
                      className={`text-xs font-bold ${
                        isSelectedDateFullyBooked ? 'text-rose-700' : 'text-emerald-700'
                      }`}
                    >
                      {isSelectedDateFullyBooked ? '● FULLY BOOKED (Locked)' : '○ OPEN for Bookings'}
                    </span>
                  </div>

                  <button
                    onClick={handleToggleFullyBooked}
                    className={`text-xs font-bold px-4 py-2 rounded transition-all cursor-pointer ${
                      isSelectedDateFullyBooked
                        ? 'bg-emerald-700 hover:bg-emerald-800 text-white'
                        : 'bg-rose-700 hover:bg-rose-800 text-white'
                    }`}
                  >
                    {isSelectedDateFullyBooked ? 'Reopen This Date' : 'Mark Fully Booked'}
                  </button>
                </div>
              </div>

              {isSelectedDateFullyBooked && (
                <div className="p-4 rounded bg-rose-50 border border-rose-200 text-rose-900 text-xs flex items-start gap-2.5">
                  <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-sm font-semibold mb-0.5">
                      Date {selectedDate} is locked for table reservations
                    </strong>
                    <p>
                      Customers attempting to book table requests on this date will see the message:
                      <em>
                        "{selectedDate === todayStr
                          ? 'Sorry, all tables are fully booked today. Please choose tomorrow or another available date.'
                          : 'Sorry, all tables are fully booked on your selected date. Please choose another available date.'}"
                      </em>
                    </p>
                    <p className="mt-1 font-semibold text-rose-950">
                      Note: Collection food ordering remains completely unaffected and active!
                    </p>
                  </div>
                </div>
              )}

              {/* Individual Time Slots Grid */}
              <div className="pt-4 border-t border-[#EAE4DF] space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif font-bold text-base text-[#252020]">
                    Individual Time Slot Overrides for {selectedDate}
                  </h3>
                  <span className="text-xs text-[#706866]">
                    Click any slot to close or reopen it individually.
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                  {standardSlots.map((time) => {
                    const slotKey = `${selectedDate}_${time.replace(':', '-')}`;
                    const isClosed = Boolean(reservationSlots[slotKey]?.isClosed);

                    return (
                      <button
                        key={time}
                        onClick={() => handleToggleSlot(time)}
                        className={`p-3 rounded border text-xs font-semibold flex flex-col justify-between gap-1 transition-all cursor-pointer ${
                          isClosed
                            ? 'bg-rose-50 border-rose-300 text-rose-900'
                            : 'bg-white border-[#EAE4DF] hover:border-[#7B202B] text-[#252020]'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-bold">{time}</span>
                          <span
                            className={`w-2 h-2 rounded-full ${
                              isClosed ? 'bg-rose-600' : 'bg-emerald-500'
                            }`}
                          />
                        </div>
                        <span className="text-[10px] text-left">
                          {isClosed ? 'CLOSED (Click to open)' : 'AVAILABLE (Click to close)'}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* 3. TABLE RESERVATIONS MANAGEMENT */}
          {activeSection === 'reservations' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="font-serif text-2xl font-bold text-[#252020]">Table Reservations</h2>
                  <p className="text-xs text-[#706866]">
                    Manage table booking requests submitted by authenticated guests.
                  </p>
                </div>

                {/* Filter */}
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-[#706866]" />
                  <select
                    value={resStatusFilter}
                    onChange={(e) => setResStatusFilter(e.target.value)}
                    className="bg-[#FAF8F4] border border-[#EAE4DF] rounded px-3 py-1.5 text-xs text-[#252020]"
                  >
                    <option value="all">All Statuses ({allReservations.length})</option>
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="completed">Completed</option>
                    <option value="rejected">Rejected</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              {allReservations.length === 0 ? (
                <div className="text-center py-12 text-xs text-[#706866] bg-[#FAF8F4] rounded border border-[#EAE4DF]">
                  No reservation requests received yet.
                </div>
              ) : (
                <div className="space-y-4">
                  {allReservations
                    .filter((r) => resStatusFilter === 'all' || r.status === resStatusFilter)
                    .map((res) => (
                      <div
                        key={res.reservationId}
                        className="p-5 rounded-lg border border-[#EAE4DF] bg-white shadow-xs space-y-3"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-[#EAE4DF]">
                          <div>
                            <span className="font-bold text-sm text-[#252020]">
                              {res.customerName}
                            </span>
                            <span className="text-xs text-[#706866] ml-2">({res.customerPhone})</span>
                            <span className="text-xs text-[#706866] block sm:inline sm:ml-2">
                              {res.customerEmail}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-[#7B202B]">
                              {res.reservationDate} at {res.reservationTime}
                            </span>
                            <span className="bg-[#FAF8F4] text-[#252020] text-xs font-bold px-2 py-0.5 rounded border border-[#EAE4DF]">
                              {res.numberOfGuests} Guests
                            </span>
                          </div>
                        </div>

                        {res.specialRequests && (
                          <div className="text-xs text-[#706866] italic bg-[#FAF8F4] p-2.5 rounded">
                            Special Request: "{res.specialRequests}"
                          </div>
                        )}

                        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs">
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1.5">
                              <span className="font-semibold text-[#706866]">Status:</span>
                              <span
                                className={`font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                                  res.status === 'confirmed'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : res.status === 'pending'
                                    ? 'bg-amber-100 text-amber-800'
                                    : 'bg-gray-100 text-gray-800'
                                }`}
                              >
                                {res.status}
                              </span>
                            </div>

                            <div className="flex items-center gap-1.5 bg-[#FAF8F4] px-2 py-1 rounded border border-[#EAE4DF]">
                              <span className="text-[11px] font-bold text-[#706866]">Table:</span>
                              <input
                                type="text"
                                placeholder="e.g. Table 4"
                                defaultValue={res.assignedTable || ''}
                                onBlur={(e) => {
                                  const val = e.target.value.trim();
                                  if (val !== (res.assignedTable || '')) {
                                    updateReservationStatus(res.reservationId, res.status, res.internalNotes, val);
                                    showToast(`Assigned ${val || 'unassigned'} to ${res.customerName}`, 'success');
                                  }
                                }}
                                className="bg-white border border-[#EAE4DF] rounded px-2 py-0.5 text-xs w-28 font-medium focus:outline-none focus:border-[#7B202B]"
                              />
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            {res.status === 'pending' && (
                              <>
                                <button
                                  onClick={() =>
                                    updateReservationStatus(res.reservationId, 'confirmed', 'Confirmed by admin')
                                  }
                                  className="bg-emerald-700 hover:bg-emerald-800 text-white font-semibold px-3 py-1.5 rounded cursor-pointer"
                                >
                                  Confirm
                                </button>
                                <button
                                  onClick={() =>
                                    updateReservationStatus(res.reservationId, 'rejected', 'Declined by restaurant')
                                  }
                                  className="bg-rose-700 hover:bg-rose-800 text-white font-semibold px-3 py-1.5 rounded cursor-pointer"
                                >
                                  Reject
                                </button>
                              </>
                            )}

                            {res.status === 'confirmed' && (
                              <button
                                onClick={() =>
                                  updateReservationStatus(res.reservationId, 'completed', 'Completed')
                                }
                                className="bg-[#7B202B] hover:bg-[#5D1720] text-white font-semibold px-3 py-1.5 rounded cursor-pointer"
                              >
                                Mark Completed
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          )}

          {/* 4. COLLECTION ORDERS MANAGEMENT */}
          {activeSection === 'orders' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="font-serif text-2xl font-bold text-[#252020]">Collection Takeaway Orders</h2>
                  <p className="text-xs text-[#706866]">
                    Track takeaway collection requests and update kitchen status.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-[#706866]" />
                  <select
                    value={orderStatusFilter}
                    onChange={(e) => setOrderStatusFilter(e.target.value)}
                    className="bg-[#FAF8F4] border border-[#EAE4DF] rounded px-3 py-1.5 text-xs text-[#252020]"
                  >
                    <option value="all">All Orders ({allOrders.length})</option>
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="preparing">Preparing</option>
                    <option value="ready">Ready for Collection</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              {allOrders.length === 0 ? (
                <div className="text-center py-12 text-xs text-[#706866] bg-[#FAF8F4] rounded border border-[#EAE4DF]">
                  No collection orders placed yet.
                </div>
              ) : (
                <div className="space-y-4">
                  {allOrders
                    .filter((o) => orderStatusFilter === 'all' || o.status === orderStatusFilter)
                    .map((order) => (
                      <div
                        key={order.orderId}
                        className="p-5 rounded-lg border border-[#EAE4DF] bg-white shadow-xs space-y-3"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#EAE4DF] gap-2">
                          <div>
                            <span className="font-bold text-sm text-[#252020]">
                              Order #{order.orderId}
                            </span>
                            <span className="text-xs text-[#706866] ml-2">
                              {order.customerName} ({order.customerPhone})
                            </span>
                            <p className="text-xs text-[#706866]">
                              Collection Time: <strong>{order.collectionDate}</strong> at{' '}
                              <strong>{order.collectionTime}</strong>
                            </p>
                          </div>

                          <div className="text-right">
                            <span className="font-serif font-bold text-base text-[#7B202B]">
                              £{order.total.toFixed(2)}
                            </span>
                            <span className="text-[10px] text-[#706866] block">
                              Subtotal: £{order.subtotal.toFixed(2)} • Disc: £{order.discountAmount.toFixed(2)}
                            </span>
                          </div>
                        </div>

                        {/* Items Snapshot */}
                        <div className="space-y-1 text-xs text-[#252020] bg-[#FAF8F4] p-3 rounded">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="flex justify-between">
                              <span>
                                {item.quantity}x {item.name} {item.variantName ? `(${item.variantName})` : ''}
                              </span>
                              <span className="font-medium text-[#706866]">£{item.lineTotal.toFixed(2)}</span>
                            </div>
                          ))}
                        </div>

                        {order.notes && (
                          <p className="text-xs text-[#706866] italic">Notes: "{order.notes}"</p>
                        )}

                        {/* Status update actions */}
                        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs">
                          <span className="font-bold uppercase tracking-wider text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                            {order.status}
                          </span>

                          <div className="flex items-center gap-2">
                            {order.status === 'pending' && (
                              <button
                                onClick={() => updateOrderStatus(order.orderId, 'confirmed')}
                                className="bg-indigo-700 hover:bg-indigo-800 text-white font-semibold px-3 py-1.5 rounded cursor-pointer"
                              >
                                Accept & Confirm
                              </button>
                            )}
                            {(order.status === 'confirmed' || order.status === 'pending') && (
                              <button
                                onClick={() => updateOrderStatus(order.orderId, 'preparing')}
                                className="bg-orange-600 hover:bg-orange-700 text-white font-semibold px-3 py-1.5 rounded cursor-pointer"
                              >
                                Mark Preparing
                              </button>
                            )}
                            {order.status === 'preparing' && (
                              <button
                                onClick={() => updateOrderStatus(order.orderId, 'ready')}
                                className="bg-emerald-700 hover:bg-emerald-800 text-white font-semibold px-3 py-1.5 rounded cursor-pointer"
                              >
                                Mark Ready for Collection!
                              </button>
                            )}
                            {order.status === 'ready' && (
                              <button
                                onClick={() => updateOrderStatus(order.orderId, 'completed')}
                                className="bg-[#7B202B] hover:bg-[#5D1720] text-white font-semibold px-3 py-1.5 rounded cursor-pointer"
                              >
                                Complete Order
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          )}

          {/* 5. MENU MANAGEMENT */}
          {activeSection === 'menu' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-serif text-2xl font-bold text-[#252020]">Menu Management</h2>
                  <p className="text-xs text-[#706866]">
                    Add, edit prices, update descriptions, and manage protein variants.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setEditingItem({
                      id: 'item_' + Date.now().toString(36),
                      categoryId: categories[0]?.id || 'appetisers',
                      name: '',
                      description: '',
                      basePrice: 9.95,
                      variants: [],
                      isAvailable: true,
                      displayOrder: menuItems.length + 1,
                    });
                    setIsNewItem(true);
                  }}
                  className="bg-[#7B202B] hover:bg-[#5D1720] text-white text-xs font-semibold px-4 py-2 rounded flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> Add Food Item
                </button>
              </div>

              {/* Items List */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border border-[#EAE4DF]">
                  <thead className="bg-[#FAF8F4] text-[#706866] uppercase text-[10px] tracking-wider border-b border-[#EAE4DF]">
                    <tr>
                      <th className="p-3">Dish Name</th>
                      <th className="p-3">Category</th>
                      <th className="p-3">Price / Variants</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EAE4DF]">
                    {menuItems.map((item) => (
                      <tr key={item.id} className="hover:bg-[#FAF8F4]/50">
                        <td className="p-3">
                          <strong className="text-[#252020] block">{item.name}</strong>
                          <span className="text-[#706866] text-[11px] line-clamp-1">
                            {item.description || 'No description'}
                          </span>
                        </td>
                        <td className="p-3 capitalize">{item.categoryId.replace('-', ' ')}</td>
                        <td className="p-3">
                          {item.basePrice !== null ? (
                            <span className="font-bold text-[#7B202B]">£{item.basePrice.toFixed(2)}</span>
                          ) : item.variants && item.variants.length > 0 ? (
                            <div className="space-y-0.5">
                              {item.variants.map((v) => (
                                <span key={v.id} className="inline-block mr-2 text-[10px]">
                                  {v.name}:{' '}
                                  <strong className={v.price === null ? 'text-amber-800' : 'text-[#7B202B]'}>
                                    {v.price !== null ? `£${v.price.toFixed(2)}` : 'Unconfirmed'}
                                  </strong>
                                </span>
                              ))}
                            </div>
                          ) : (
                            <span className="text-amber-800 font-semibold">Unconfirmed</span>
                          )}
                        </td>
                        <td className="p-3">
                          <button
                            onClick={() => saveMenuItem({ ...item, isAvailable: !item.isAvailable })}
                            className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer ${
                              item.isAvailable
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-gray-200 text-gray-700'
                            }`}
                          >
                            {item.isAvailable ? 'Available' : 'Unavailable'}
                          </button>
                        </td>
                        <td className="p-3 text-right space-x-2">
                          <button
                            onClick={() => {
                              setEditingItem({ ...item });
                              setIsNewItem(false);
                            }}
                            className="text-[#7B202B] hover:underline font-semibold cursor-pointer"
                          >
                            Edit
                          </button>
                          <button
                            onClick={async () => {
                              if (window.confirm(`Delete ${item.name}?`)) {
                                await deleteMenuItem(item.id);
                                showToast('Item deleted.', 'info');
                              }
                            }}
                            className="text-rose-600 hover:underline font-semibold cursor-pointer"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Edit Item Modal */}
              {editingItem && (
                <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
                  <div className="bg-white rounded-lg max-w-lg w-full p-6 shadow-2xl border border-[#EAE4DF] space-y-4 max-h-[90vh] overflow-y-auto">
                    <h3 className="font-serif text-xl font-bold text-[#252020]">
                      {isNewItem ? 'Add Food Item' : `Edit: ${editingItem.name}`}
                    </h3>

                    <div className="space-y-3 text-xs">
                      <div>
                        <label className="font-semibold block mb-1">Dish Name *</label>
                        <input
                          type="text"
                          value={editingItem.name}
                          onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                          className="w-full bg-[#FAF8F4] border border-[#EAE4DF] rounded p-2"
                        />
                      </div>

                      <div>
                        <label className="font-semibold block mb-1">Category *</label>
                        <select
                          value={editingItem.categoryId}
                          onChange={(e) => setEditingItem({ ...editingItem, categoryId: e.target.value })}
                          className="w-full bg-[#FAF8F4] border border-[#EAE4DF] rounded p-2"
                        >
                          {categories.map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="font-semibold block mb-1">Description</label>
                        <textarea
                          rows={2}
                          value={editingItem.description || ''}
                          onChange={(e) =>
                            setEditingItem({ ...editingItem, description: e.target.value })
                          }
                          className="w-full bg-[#FAF8F4] border border-[#EAE4DF] rounded p-2"
                        />
                      </div>

                      <div>
                        <label className="font-semibold block mb-1">
                          Base Price (£) (Leave empty if using protein variants below)
                        </label>
                        <input
                          type="number"
                          step="0.05"
                          value={editingItem.basePrice !== null ? editingItem.basePrice : ''}
                          onChange={(e) =>
                            setEditingItem({
                              ...editingItem,
                              basePrice: e.target.value === '' ? null : parseFloat(e.target.value),
                            })
                          }
                          className="w-full bg-[#FAF8F4] border border-[#EAE4DF] rounded p-2"
                        />
                      </div>

                      {/* Variants editor */}
                      <div className="pt-2 border-t border-[#EAE4DF] space-y-2">
                        <div className="flex items-center justify-between">
                          <label className="font-semibold">Protein Variants & Prices</label>
                          <button
                            type="button"
                            onClick={() => {
                              const updatedVariants = [
                                ...(editingItem.variants || []),
                                { id: 'var_' + Date.now().toString(36), name: 'Option', price: 9.95 },
                              ];
                              setEditingItem({ ...editingItem, variants: updatedVariants });
                            }}
                            className="text-[11px] text-[#7B202B] font-semibold underline"
                          >
                            + Add Variant
                          </button>
                        </div>

                        {editingItem.variants?.map((v, i) => (
                          <div key={v.id || i} className="flex items-center gap-2">
                            <input
                              type="text"
                              value={v.name}
                              placeholder="e.g. Chicken"
                              onChange={(e) => {
                                const copy = [...editingItem.variants!];
                                copy[i] = { ...copy[i], name: e.target.value };
                                setEditingItem({ ...editingItem, variants: copy });
                              }}
                              className="w-1/2 bg-[#FAF8F4] border border-[#EAE4DF] rounded p-1.5 text-xs"
                            />
                            <input
                              type="number"
                              step="0.05"
                              placeholder="Price (empty = unconfirmed)"
                              value={v.price !== null ? v.price : ''}
                              onChange={(e) => {
                                const copy = [...editingItem.variants!];
                                copy[i] = {
                                  ...copy[i],
                                  price: e.target.value === '' ? null : parseFloat(e.target.value),
                                };
                                setEditingItem({ ...editingItem, variants: copy });
                              }}
                              className="w-1/3 bg-[#FAF8F4] border border-[#EAE4DF] rounded p-1.5 text-xs"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const copy = editingItem.variants!.filter((_, idx) => idx !== i);
                                setEditingItem({ ...editingItem, variants: copy });
                              }}
                              className="text-rose-600 hover:text-rose-800 p-1"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>

                      <div className="flex items-center gap-4 pt-2">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={editingItem.isAvailable}
                            onChange={(e) =>
                              setEditingItem({ ...editingItem, isAvailable: e.target.checked })
                            }
                          />
                          <span>Available to Order</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={Boolean(editingItem.isFeatured)}
                            onChange={(e) =>
                              setEditingItem({ ...editingItem, isFeatured: e.target.checked })
                            }
                          />
                          <span>Feature on Homepage</span>
                        </label>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-[#EAE4DF] flex gap-3">
                      <button
                        onClick={() => setEditingItem(null)}
                        className="flex-1 bg-gray-100 hover:bg-gray-200 text-[#252020] text-xs font-semibold py-2.5 rounded cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={async () => {
                          if (!editingItem.name.trim()) {
                            showToast('Item name is required.', 'error');
                            return;
                          }
                          await saveMenuItem(editingItem);
                          showToast('Item saved to Firestore successfully!', 'success');
                          setEditingItem(null);
                        }}
                        className="flex-1 bg-[#7B202B] hover:bg-[#5D1720] text-white text-xs font-semibold py-2.5 rounded cursor-pointer"
                      >
                        Save Dish
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 6. CATEGORIES MANAGEMENT */}
          {activeSection === 'categories' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-serif text-2xl font-bold text-[#252020]">Categories Management</h2>
                  <p className="text-xs text-[#706866]">
                    Organize menu sections, edit descriptions, and reorder display.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setEditingCategory({
                      id: 'cat_' + Date.now().toString(36),
                      name: '',
                      description: '',
                      displayOrder: categories.length + 1,
                      isActive: true,
                    });
                    setIsNewCategory(true);
                  }}
                  className="bg-[#7B202B] hover:bg-[#5D1720] text-white text-xs font-semibold px-4 py-2 rounded flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> Add Category
                </button>
              </div>

              <div className="space-y-3">
                {categories.map((cat) => {
                  const itemCount = menuItems.filter((i) => i.categoryId === cat.id).length;
                  return (
                    <div
                      key={cat.id}
                      className="p-4 rounded-lg border border-[#EAE4DF] bg-white flex items-center justify-between gap-4"
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-[#252020]">{cat.name}</span>
                          <span className="text-[11px] text-[#706866]">({itemCount} items)</span>
                          <span
                            className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                              cat.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-700'
                            }`}
                          >
                            {cat.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                        {cat.description && (
                          <p className="text-xs text-[#706866] italic">{cat.description}</p>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setEditingCategory({ ...cat });
                            setIsNewCategory(false);
                          }}
                          className="text-xs text-[#7B202B] font-semibold hover:underline px-2 py-1"
                        >
                          Edit
                        </button>
                        <button
                          onClick={async () => {
                            if (itemCount > 0) {
                              alert(`Warning: This category has ${itemCount} dishes assigned to it. Move or delete them first.`);
                              return;
                            }
                            if (window.confirm(`Delete category ${cat.name}?`)) {
                              await deleteCategory(cat.id);
                              showToast('Category deleted.', 'info');
                            }
                          }}
                          className="text-xs text-rose-600 font-semibold hover:underline px-2 py-1"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Edit Category Modal */}
              {editingCategory && (
                <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
                  <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-2xl border border-[#EAE4DF] space-y-4">
                    <h3 className="font-serif text-xl font-bold text-[#252020]">
                      {isNewCategory ? 'Create Category' : `Edit Category: ${editingCategory.name}`}
                    </h3>

                    <div className="space-y-3 text-xs">
                      <div>
                        <label className="font-semibold block mb-1">Category Name *</label>
                        <input
                          type="text"
                          value={editingCategory.name}
                          onChange={(e) =>
                            setEditingCategory({ ...editingCategory, name: e.target.value })
                          }
                          className="w-full bg-[#FAF8F4] border border-[#EAE4DF] rounded p-2"
                        />
                      </div>

                      <div>
                        <label className="font-semibold block mb-1">Subtitle / Description</label>
                        <textarea
                          rows={2}
                          value={editingCategory.description || ''}
                          onChange={(e) =>
                            setEditingCategory({ ...editingCategory, description: e.target.value })
                          }
                          className="w-full bg-[#FAF8F4] border border-[#EAE4DF] rounded p-2"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="font-semibold block mb-1">Display Order</label>
                          <input
                            type="number"
                            value={editingCategory.displayOrder}
                            onChange={(e) =>
                              setEditingCategory({
                                ...editingCategory,
                                displayOrder: parseInt(e.target.value) || 1,
                              })
                            }
                            className="w-full bg-[#FAF8F4] border border-[#EAE4DF] rounded p-2"
                          />
                        </div>

                        <div className="flex items-center pt-5">
                          <label className="flex items-center gap-2 cursor-pointer font-semibold">
                            <input
                              type="checkbox"
                              checked={editingCategory.isActive}
                              onChange={(e) =>
                                setEditingCategory({
                                  ...editingCategory,
                                  isActive: e.target.checked,
                                })
                              }
                            />
                            <span>Active & Visible</span>
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-[#EAE4DF] flex gap-3">
                      <button
                        onClick={() => setEditingCategory(null)}
                        className="flex-1 bg-gray-100 hover:bg-gray-200 text-[#252020] text-xs font-semibold py-2.5 rounded cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={async () => {
                          if (!editingCategory.name.trim()) return;
                          await saveCategory(editingCategory);
                          showToast('Category saved successfully!', 'success');
                          setEditingCategory(null);
                        }}
                        className="flex-1 bg-[#7B202B] hover:bg-[#5D1720] text-white text-xs font-semibold py-2.5 rounded cursor-pointer"
                      >
                        Save Category
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 7. CUSTOMER FEEDBACK & COMPLAINTS */}
          {activeSection === 'feedback' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="font-serif text-2xl font-bold text-[#252020]">Feedback & Complaints</h2>
                  <p className="text-xs text-[#706866]">
                    Submissions from the public Complaints & Feedback contact form.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-[#706866]" />
                  <select
                    value={feedbackFilter}
                    onChange={(e) => setFeedbackFilter(e.target.value)}
                    className="bg-[#FAF8F4] border border-[#EAE4DF] rounded px-3 py-1.5 text-xs text-[#252020]"
                  >
                    <option value="all">All Feedback ({allFeedback.length})</option>
                    <option value="unread">Unread</option>
                    <option value="read">Read</option>
                    <option value="resolved">Resolved</option>
                  </select>
                </div>
              </div>

              {allFeedback.length === 0 ? (
                <div className="text-center py-12 text-xs text-[#706866] bg-[#FAF8F4] rounded border border-[#EAE4DF]">
                  No customer feedback submissions yet.
                </div>
              ) : (
                <div className="space-y-4">
                  {allFeedback
                    .filter((f) => feedbackFilter === 'all' || f.status === feedbackFilter)
                    .map((item) => (
                      <div
                        key={item.feedbackId}
                        className="p-5 rounded-lg border border-[#EAE4DF] bg-white shadow-xs space-y-3"
                      >
                        <div className="flex items-center justify-between pb-2 border-b border-[#EAE4DF]">
                          <div>
                            <span className="font-bold text-sm text-[#252020]">{item.name}</span>
                            <span className="text-xs text-[#706866] ml-2">&lt;{item.email}&gt;</span>
                            {item.phone && (
                              <span className="text-xs text-[#706866] ml-2">• Tel: {item.phone}</span>
                            )}
                          </div>
                          <span className="bg-[#FAF8F4] text-[#7B202B] text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border border-[#EAE4DF]">
                            {item.category}
                          </span>
                        </div>

                        <p className="text-xs text-[#252020] leading-relaxed bg-[#FAF8F4] p-3 rounded">
                          "{item.message}"
                        </p>

                        <div className="flex items-center justify-between pt-1 text-xs">
                          <span
                            className={`font-bold uppercase text-[10px] px-2 py-0.5 rounded ${
                              item.status === 'unread'
                                ? 'bg-amber-100 text-amber-800'
                                : item.status === 'resolved'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-gray-100 text-gray-700'
                            }`}
                          >
                            {item.status}
                          </span>

                          <div className="flex items-center gap-2">
                            {item.status === 'unread' && (
                              <button
                                onClick={() => updateFeedbackStatus(item.feedbackId, 'read')}
                                className="text-[#7B202B] hover:underline font-semibold"
                              >
                                Mark Read
                              </button>
                            )}
                            {item.status !== 'resolved' && (
                              <button
                                onClick={() => updateFeedbackStatus(item.feedbackId, 'resolved')}
                                className="text-emerald-700 hover:underline font-semibold"
                              >
                                Mark Resolved
                              </button>
                            )}
                            <button
                              onClick={async () => {
                                if (window.confirm('Delete this feedback?')) {
                                  await deleteFeedback(item.feedbackId);
                                  showToast('Feedback deleted.', 'info');
                                }
                              }}
                              className="text-rose-600 hover:underline ml-2"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          )}

          {/* 8. GUEST REVIEWS */}
          {activeSection === 'reviews' && (
            <div className="space-y-6">
              <div>
                <h2 className="font-serif text-2xl font-bold text-[#252020]">Customer Reviews & Testimonials</h2>
                <p className="text-xs text-[#706866]">
                  Manage published testimonials including the verified Martina Loebenberg review.
                </p>
              </div>

              <div className="space-y-4">
                {reviews.map((rev) => (
                  <div
                    key={rev.reviewId}
                    className="p-5 rounded-lg border border-[#EAE4DF] bg-white shadow-xs space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-[#252020]">{rev.reviewerName}</span>
                        <div className="flex gap-0.5">
                          {[...Array(rev.rating)].map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-[#C5A15B] text-[#C5A15B]" />
                          ))}
                        </div>
                      </div>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          rev.isVisible ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {rev.isVisible ? 'Published' : 'Hidden'}
                      </span>
                    </div>

                    <blockquote className="text-xs text-[#706866] italic">
                      "{rev.text}"
                    </blockquote>

                    <div className="flex items-center justify-between pt-2 border-t border-[#EAE4DF] text-xs">
                      <button
                        onClick={() => saveReview({ ...rev, isVisible: !rev.isVisible })}
                        className="text-[#7B202B] font-semibold hover:underline"
                      >
                        {rev.isVisible ? 'Hide from Website' : 'Show on Website'}
                      </button>
                      <button
                        onClick={() => saveReview({ ...rev, isFeatured: !rev.isFeatured })}
                        className="text-[#C5A15B] font-semibold hover:underline"
                      >
                        {rev.isFeatured ? '★ Featured on Homepage' : '☆ Set as Featured'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 9. RESTAURANT SETTINGS & CONTENT */}
          {activeSection === 'settings' && (
            <div className="space-y-8">
              <div>
                <h2 className="font-serif text-2xl font-bold text-[#252020]">
                  Restaurant Information & Content
                </h2>
                <p className="text-xs text-[#706866]">
                  All edits save directly to Firestore and update the live website immediately.
                </p>
              </div>

              <div className="space-y-6 text-xs">
                {/* General Info */}
                <div className="space-y-3 p-4 bg-[#FAF8F4] rounded border border-[#EAE4DF]">
                  <h3 className="font-serif font-bold text-sm text-[#7B202B]">General Details</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="font-semibold block mb-1">Restaurant Name</label>
                      <input
                        type="text"
                        value={settingsForm.restaurantName}
                        onChange={(e) =>
                          setSettingsForm({ ...settingsForm, restaurantName: e.target.value })
                        }
                        className="w-full bg-white border border-[#EAE4DF] rounded p-2 text-xs"
                      />
                    </div>
                    <div>
                      <label className="font-semibold block mb-1">Brand Subtitle</label>
                      <input
                        type="text"
                        value={settingsForm.brandSubtitle}
                        onChange={(e) =>
                          setSettingsForm({ ...settingsForm, brandSubtitle: e.target.value })
                        }
                        className="w-full bg-white border border-[#EAE4DF] rounded p-2 text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="font-semibold block mb-1">Telephone 1</label>
                      <input
                        type="text"
                        value={settingsForm.phoneNumbers[0] || ''}
                        onChange={(e) => {
                          const copy = [...settingsForm.phoneNumbers];
                          copy[0] = e.target.value;
                          setSettingsForm({ ...settingsForm, phoneNumbers: copy });
                        }}
                        className="w-full bg-white border border-[#EAE4DF] rounded p-2 text-xs"
                      />
                    </div>
                    <div>
                      <label className="font-semibold block mb-1">Telephone 2</label>
                      <input
                        type="text"
                        value={settingsForm.phoneNumbers[1] || ''}
                        onChange={(e) => {
                          const copy = [...settingsForm.phoneNumbers];
                          copy[1] = e.target.value;
                          setSettingsForm({ ...settingsForm, phoneNumbers: copy });
                        }}
                        className="w-full bg-white border border-[#EAE4DF] rounded p-2 text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="font-semibold block mb-1">Contact Email Address (Setup)</label>
                      <input
                        type="email"
                        placeholder="e.g. info@rashoi.co.uk"
                        value={settingsForm.contactEmail || ''}
                        onChange={(e) =>
                          setSettingsForm({ ...settingsForm, contactEmail: e.target.value })
                        }
                        className="w-full bg-white border border-[#EAE4DF] rounded p-2 text-xs"
                      />
                    </div>
                    <div>
                      <label className="font-semibold block mb-1">WhatsApp Business Number (Setup)</label>
                      <input
                        type="text"
                        placeholder="e.g. +44 1276 ..."
                        value={settingsForm.whatsappNumber || ''}
                        onChange={(e) =>
                          setSettingsForm({ ...settingsForm, whatsappNumber: e.target.value })
                        }
                        className="w-full bg-white border border-[#EAE4DF] rounded p-2 text-xs"
                      />
                    </div>
                  </div>
                </div>

                {/* Opening hours & Promotions */}
                <div className="space-y-3 p-4 bg-[#FAF8F4] rounded border border-[#EAE4DF]">
                  <h3 className="font-serif font-bold text-sm text-[#7B202B]">
                    Hours & 10% Collection Discount
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="font-semibold block mb-1">Lunch Hours</label>
                      <input
                        type="text"
                        value={settingsForm.openingHours.lunch}
                        onChange={(e) =>
                          setSettingsForm({
                            ...settingsForm,
                            openingHours: { ...settingsForm.openingHours, lunch: e.target.value },
                          })
                        }
                        className="w-full bg-white border border-[#EAE4DF] rounded p-2 text-xs"
                      />
                    </div>
                    <div>
                      <label className="font-semibold block mb-1">Evening Hours</label>
                      <input
                        type="text"
                        value={settingsForm.openingHours.evening}
                        onChange={(e) =>
                          setSettingsForm({
                            ...settingsForm,
                            openingHours: { ...settingsForm.openingHours, evening: e.target.value },
                          })
                        }
                        className="w-full bg-white border border-[#EAE4DF] rounded p-2 text-xs"
                      />
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[#EAE4DF] space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer font-bold">
                      <input
                        type="checkbox"
                        checked={settingsForm.collectionDiscount?.enabled}
                        onChange={(e) =>
                          setSettingsForm({
                            ...settingsForm,
                            collectionDiscount: {
                              ...settingsForm.collectionDiscount,
                              enabled: e.target.checked,
                            },
                          })
                        }
                      />
                      <span>Enable 10% Collection Discount Promotion</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer font-bold">
                      <input
                        type="checkbox"
                        checked={settingsForm.collectionOrderingEnabled}
                        onChange={(e) =>
                          setSettingsForm({
                            ...settingsForm,
                            collectionOrderingEnabled: e.target.checked,
                          })
                        }
                      />
                      <span>Enable Online Collection Ordering on Website</span>
                    </label>
                  </div>
                </div>

                {/* Content Texts */}
                <div className="space-y-3 p-4 bg-[#FAF8F4] rounded border border-[#EAE4DF]">
                  <h3 className="font-serif font-bold text-sm text-[#7B202B]">Content & Notices</h3>

                  <div>
                    <label className="font-semibold block mb-1">Homepage Hero Heading</label>
                    <input
                      type="text"
                      value={settingsForm.hero.heading}
                      onChange={(e) =>
                        setSettingsForm({
                          ...settingsForm,
                          hero: { ...settingsForm.hero, heading: e.target.value },
                        })
                      }
                      className="w-full bg-white border border-[#EAE4DF] rounded p-2 text-xs"
                    />
                  </div>

                  <div>
                    <label className="font-semibold block mb-1">Allergen Notice</label>
                    <textarea
                      rows={2}
                      value={settingsForm.allergenNotice}
                      onChange={(e) =>
                        setSettingsForm({ ...settingsForm, allergenNotice: e.target.value })
                      }
                      className="w-full bg-white border border-[#EAE4DF] rounded p-2 text-xs"
                    />
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    onClick={async () => {
                      await updateSiteSettings(settingsForm);
                      showToast('Website settings saved to Firestore!', 'success');
                    }}
                    className="w-full sm:w-auto bg-[#7B202B] hover:bg-[#5D1720] text-white font-bold text-xs uppercase tracking-wider py-3.5 px-8 rounded cursor-pointer shadow-md"
                  >
                    Save All Site Settings
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 10. ADMINISTRATOR ACCESS & SETUP INFORMATION */}
          {activeSection === 'setup' && (
            <div className="space-y-6">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#7B202B]">
                  Production Verification
                </span>
                <h2 className="font-serif text-2xl font-bold text-[#252020]">
                  Setup Requirements & Deployment Checklist
                </h2>
                <p className="text-xs text-[#706866] mt-1">
                  Reference guide for the restaurant owner before announcing live public launch.
                </p>
              </div>

              <div className="space-y-4 text-xs">
                <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-950 space-y-1">
                  <div className="flex items-center gap-2 font-bold">
                    <CheckCircle className="w-4 h-4 text-emerald-700" />
                    <span>Firebase Firestore & Auth Active</span>
                  </div>
                  <p>
                    Connected to Firebase project <code>festive-edition-2c70r</code> with database ID{' '}
                    <code>ai-studio-c9beec49-c207-4a3e-8452-9a997187ba5e</code>.
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-950 space-y-1">
                  <div className="flex items-center gap-2 font-bold">
                    <CheckCircle className="w-4 h-4 text-emerald-700" />
                    <span>Security Rules Deployed</span>
                  </div>
                  <p>
                    Firestore security rules have been deployed with zero-trust RBAC protecting customer PII, reservations, and allowing admin writes only to verified administrators.
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-white border border-[#EAE4DF] space-y-3">
                  <h3 className="font-serif font-bold text-sm text-[#252020]">Remaining Owner Inputs:</h3>
                  <ul className="list-disc pl-5 space-y-1.5 text-[#706866]">
                    <li>
                      <strong>Confirm 2 Missing Menu Prices:</strong> King Prawn Tikka Masala and Prawn Tikka Danshak currently show "Please contact restaurant for price". You can set their exact prices anytime in <em>Menu Items</em> tab.
                    </li>
                    <li>
                      <strong>Official Restaurant Email & WhatsApp:</strong> Configure your official contact email and WhatsApp business number in the <em>Restaurant & Content</em> tab.
                    </li>
                    <li>
                      <strong>Custom Domain:</strong> Point <code>www.rashoi.co.uk</code> DNS records to this application's Cloud Run service URL.
                    </li>
                    <li>
                      <strong>Google Business Profile & Search Console:</strong> Verify <code>https://www.rashoi.co.uk</code> in Google Search Console and submit <code>/sitemap.xml</code>.
                    </li>
                  </ul>

                  <div className="pt-3 border-t border-[#EAE4DF]">
                    <button
                      onClick={async () => {
                        const seeded = await seedInitialDatabaseIfEmpty();
                        if (seeded) {
                          showToast('Initial menu categories and dishes synced into Firestore!', 'success');
                        } else {
                          showToast('Menu data is already present in Firestore.', 'info');
                        }
                      }}
                      className="bg-[#7B202B] hover:bg-[#5D1720] text-white text-xs font-semibold px-4 py-2 rounded cursor-pointer"
                    >
                      Sync / Refresh Initial Menu into Firestore
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
