import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  subscribeCustomerReservations,
  subscribeCustomerOrders,
  updateReservationStatus,
} from '../../services/dbService';
import { Reservation, Order } from '../../types';
import {
  CalendarDays,
  ShoppingBag,
  Clock,
  User as UserIcon,
  CheckCircle2,
  XCircle,
  AlertCircle,
  MapPin,
  ChevronRight,
  Phone,
  RotateCcw,
  Receipt,
  Sparkles,
  ArrowRight,
  UtensilsCrossed,
  Printer,
  Calendar,
} from 'lucide-react';

export const CustomerAccountPage: React.FC = () => {
  const { user, loginWithGoogle, showToast, setCurrentView, addToCart } = useApp();

  const [activeTab, setActiveTab] = useState<'reservations' | 'orders'>('reservations');
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedOrderForReceipt, setSelectedOrderForReceipt] = useState<Order | null>(null);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    setLoading(true);
    const unsubRes = subscribeCustomerReservations(user.uid, (list) => {
      setReservations(list);
      setLoading(false);
    });

    const unsubOrd = subscribeCustomerOrders(user.uid, (list) => {
      setOrders(list);
    });

    return () => {
      unsubRes();
      unsubOrd();
    };
  }, [user]);

  // Calculations & Analytics
  const activeReservations = useMemo(() => {
    return reservations.filter((r) => r.status === 'pending' || r.status === 'confirmed');
  }, [reservations]);

  const activeOrders = useMemo(() => {
    return orders.filter(
      (o) => o.status === 'pending' || o.status === 'confirmed' || o.status === 'preparing' || o.status === 'ready'
    );
  }, [orders]);

  const totalDiscountSaved = useMemo(() => {
    return orders.reduce((sum, o) => sum + (o.discountAmount || 0), 0);
  }, [orders]);

  const handleCancelReservation = async (reservationId: string) => {
    if (!window.confirm('Are you sure you wish to cancel this reservation request?')) {
      return;
    }
    try {
      await updateReservationStatus(reservationId, 'cancelled', 'Cancelled by customer');
      showToast('Reservation request cancelled.', 'info');
    } catch {
      showToast('Could not cancel reservation.', 'error');
    }
  };

  const handleReorder = (order: Order) => {
    let count = 0;
    order.items.forEach((item) => {
      // Re-add to cart
      addToCart(
        {
          id: item.itemId,
          categoryId: 'reorder',
          name: item.name,
          basePrice: item.variantName ? null : item.unitPrice,
          isAvailable: true,
          displayOrder: 1,
        },
        item.variantName
          ? { id: item.variantId || 'var', name: item.variantName, price: item.unitPrice }
          : undefined,
        item.quantity
      );
      count += item.quantity;
    });

    showToast(`Added ${count} items back into your collection basket!`, 'success');
    setCurrentView('collection');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddToCalendar = (res: Reservation) => {
    const title = encodeURIComponent(`Dinner at Rashoi Indian Cuisine (${res.numberOfGuests} guests)`);
    const details = encodeURIComponent(
      `Table Reservation at Rashoi Windlesham.\nParty Size: ${res.numberOfGuests} Guests\nAssigned Table: ${
        res.assignedTable || 'Table allocated on arrival'
      }\nSpecial Requests: ${res.specialRequests || 'None'}\nAddress: 58 Updown Hill, Windlesham, GU20 6DX\nPhone: 01276 452 197`
    );
    const location = encodeURIComponent('Rashoi, 58 Updown Hill, Windlesham, Surrey, GU20 6DX');
    // Approximate 2-hour dining duration
    const startDate = res.reservationDate.replace(/-/g, '');
    const startHour = res.reservationTime.replace(':', '');
    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}&dates=${startDate}T${startHour}00/${startDate}T${parseInt(startHour.slice(0, 2)) + 2}${startHour.slice(2)}00`;
    window.open(googleCalendarUrl, '_blank', 'noopener,noreferrer');
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-[#FAF8F4] py-16 flex items-center justify-center px-4">
        <div className="bg-white rounded-lg p-8 sm:p-10 max-w-md w-full border border-[#EAE4DF] shadow-md text-center space-y-5">
          <div className="w-16 h-16 rounded-full bg-[#7B202B]/10 text-[#7B202B] flex items-center justify-center mx-auto border border-[#C5A15B]/30">
            <UserIcon className="w-8 h-8 text-[#7B202B]" />
          </div>
          <div className="space-y-1">
            <h2 className="font-serif text-2xl font-bold text-[#252020]">Customer Dining Dashboard</h2>
            <p className="text-xs text-[#706866] leading-relaxed">
              Sign in with your Google account to view your live table reservations, assigned tables, order details, and receipt histories.
            </p>
          </div>

          <button
            onClick={loginWithGoogle}
            className="w-full bg-[#7B202B] hover:bg-[#5D1720] text-white text-xs font-semibold uppercase tracking-wider py-3.5 px-4 rounded cursor-pointer shadow-sm transition-colors flex items-center justify-center gap-2"
          >
            <UserIcon className="w-4 h-4 text-[#C5A15B]" />
            Sign in with Google Account
          </button>

          <div className="pt-2 border-t border-[#EAE4DF]">
            <button
              onClick={() => setCurrentView('home')}
              className="text-xs text-[#7B202B] hover:underline font-medium"
            >
              ← Back to Rashoi Homepage
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF8F4] py-10 sm:py-14">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Top Header Card */}
        <div className="bg-white rounded-lg p-6 sm:p-8 border border-[#EAE4DF] shadow-xs flex flex-col md:flex-row items-center md:items-start justify-between gap-6">
          <div className="flex items-center gap-4 text-center sm:text-left">
            {user.photoURL ? (
              <img
                src={user.photoURL}
                alt={user.displayName || 'Profile'}
                className="w-16 h-16 rounded-full border-2 border-[#C5A15B] object-cover shadow-xs"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-[#7B202B] text-white flex items-center justify-center font-serif text-2xl font-bold border-2 border-[#C5A15B]">
                {user.displayName?.charAt(0) || 'U'}
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#252020]">
                  {user.displayName || 'Valued Guest'}
                </h1>
                <span className="bg-[#7B202B]/10 text-[#7B202B] text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                  Customer Dashboard
                </span>
              </div>
              <p className="text-xs text-[#706866] mt-0.5">{user.email}</p>
              <div className="flex items-center gap-3 mt-2 text-xs text-[#706866]">
                <span className="flex items-center gap-1 text-[#252020] font-medium">
                  <MapPin className="w-3.5 h-3.5 text-[#7B202B]" /> Rashoi, Windlesham, Surrey
                </span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => {
                setCurrentView('reservations');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="bg-[#7B202B] hover:bg-[#5D1720] text-white text-xs font-semibold px-4 py-2.5 rounded shadow-xs cursor-pointer flex items-center gap-1.5"
            >
              <CalendarDays className="w-4 h-4 text-[#C5A15B]" />
              Book a Table
            </button>
            <button
              onClick={() => {
                setCurrentView('menu');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="bg-[#FAF8F4] hover:bg-[#EAE4DF] text-[#252020] border border-[#EAE4DF] text-xs font-semibold px-4 py-2.5 rounded cursor-pointer flex items-center gap-1.5"
            >
              <UtensilsCrossed className="w-4 h-4 text-[#7B202B]" />
              Order Takeaway
            </button>
          </div>
        </div>

        {/* Dashboard Stat Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-lg border border-[#EAE4DF] shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#7B202B]/10 text-[#7B202B] flex items-center justify-center shrink-0">
              <CalendarDays className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-semibold text-[#706866] uppercase tracking-wider block">
                Table Bookings
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-[#252020]">{reservations.length}</span>
                {activeReservations.length > 0 && (
                  <span className="text-xs font-semibold text-[#7B202B]">
                    ({activeReservations.length} Active)
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-lg border border-[#EAE4DF] shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#5D1720]/10 text-[#5D1720] flex items-center justify-center shrink-0">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-semibold text-[#706866] uppercase tracking-wider block">
                Collection Orders
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-[#252020]">{orders.length}</span>
                {activeOrders.length > 0 && (
                  <span className="text-xs font-semibold text-emerald-700 animate-pulse">
                    ({activeOrders.length} In Progress)
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-lg border border-[#EAE4DF] shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center shrink-0">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-semibold text-[#706866] uppercase tracking-wider block">
                10% Discount Saved
              </span>
              <div className="text-2xl font-bold text-emerald-800">
                £{totalDiscountSaved.toFixed(2)}
              </div>
            </div>
          </div>
        </div>

        {/* Live Active Order / Reservation Alert Banner */}
        {activeOrders.length > 0 && (
          <div className="p-5 rounded-lg bg-emerald-50 border-2 border-emerald-300 text-emerald-950 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-ping"></span>
                <strong className="text-sm font-bold">Active Takeaway Order in Progress</strong>
              </div>
              <span className="text-xs font-semibold bg-emerald-200 text-emerald-900 px-2.5 py-0.5 rounded">
                Ref #{activeOrders[0].orderId}
              </span>
            </div>

            <p className="text-xs text-emerald-800">
              Your order for collection on <strong>{activeOrders[0].collectionDate}</strong> at{' '}
              <strong>{activeOrders[0].collectionTime}</strong> is currently{' '}
              <span className="font-bold uppercase tracking-wider underline">
                {activeOrders[0].status === 'ready'
                  ? 'READY FOR COLLECTION! Please pick up at 58 Updown Hill'
                  : activeOrders[0].status === 'preparing'
                  ? 'Being freshly prepared in our clay oven & kitchen'
                  : activeOrders[0].status}
              </span>.
            </p>

            {/* Stepper tracker */}
            <div className="pt-2 grid grid-cols-4 gap-2 text-center text-[10px] font-bold uppercase">
              <div className="p-1.5 rounded bg-emerald-700 text-white">1. Received</div>
              <div
                className={`p-1.5 rounded ${
                  activeOrders[0].status !== 'pending'
                    ? 'bg-emerald-700 text-white'
                    : 'bg-emerald-200/60 text-emerald-800'
                }`}
              >
                2. Confirmed
              </div>
              <div
                className={`p-1.5 rounded ${
                  activeOrders[0].status === 'preparing' || activeOrders[0].status === 'ready'
                    ? 'bg-emerald-700 text-white'
                    : 'bg-emerald-200/60 text-emerald-800'
                }`}
              >
                3. Kitchen Prep
              </div>
              <div
                className={`p-1.5 rounded ${
                  activeOrders[0].status === 'ready'
                    ? 'bg-emerald-600 text-white animate-bounce'
                    : 'bg-emerald-200/60 text-emerald-800'
                }`}
              >
                4. Ready to Collect!
              </div>
            </div>
          </div>
        )}

        {/* Dashboard Navigation Tabs */}
        <div className="flex border-b border-[#EAE4DF] gap-4">
          <button
            onClick={() => setActiveTab('reservations')}
            className={`pb-3 px-6 text-sm font-bold tracking-wide transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'reservations'
                ? 'border-b-2 border-[#7B202B] text-[#7B202B]'
                : 'text-[#706866] hover:text-[#252020]'
            }`}
          >
            <CalendarDays className="w-4 h-4" />
            Table Reservations ({reservations.length})
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`pb-3 px-6 text-sm font-bold tracking-wide transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'orders'
                ? 'border-b-2 border-[#7B202B] text-[#7B202B]'
                : 'text-[#706866] hover:text-[#252020]'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            Collection Orders ({orders.length})
          </button>
        </div>

        {/* Tab 1: Table Reservations */}
        {activeTab === 'reservations' && (
          <div className="space-y-6">
            {loading ? (
              <div className="text-center py-12 text-xs text-[#706866]">Loading reservations...</div>
            ) : reservations.length === 0 ? (
              <div className="bg-white rounded-lg p-12 text-center border border-[#EAE4DF] shadow-xs space-y-4 max-w-lg mx-auto">
                <div className="w-16 h-16 rounded-full bg-[#FAF8F4] flex items-center justify-center text-[#706866] mx-auto">
                  <CalendarDays className="w-8 h-8 opacity-40" />
                </div>
                <h3 className="font-serif text-xl font-bold text-[#252020]">No Reservations on File</h3>
                <p className="text-xs text-[#706866] leading-relaxed">
                  You haven't requested any table bookings yet. We would be delighted to host you for lunch or evening dinner in Windlesham.
                </p>
                <button
                  onClick={() => {
                    setCurrentView('reservations');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="inline-flex items-center gap-2 bg-[#7B202B] hover:bg-[#5D1720] text-white text-xs font-semibold px-6 py-3 rounded cursor-pointer shadow-sm"
                >
                  <CalendarDays className="w-4 h-4 text-[#C5A15B]" />
                  Book a Table Now
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {reservations.map((res) => {
                  const statusBadges: Record<string, { label: string; class: string }> = {
                    pending: { label: 'Pending Restaurant Review', class: 'bg-amber-50 text-amber-900 border-amber-200' },
                    confirmed: { label: 'Confirmed & Reserved', class: 'bg-emerald-50 text-emerald-900 border-emerald-300' },
                    rejected: { label: 'Request Declined', class: 'bg-rose-50 text-rose-900 border-rose-200' },
                    cancelled: { label: 'Cancelled', class: 'bg-gray-100 text-gray-700 border-gray-300' },
                    completed: { label: 'Visit Completed', class: 'bg-blue-50 text-blue-900 border-blue-200' },
                  };
                  const badge = statusBadges[res.status] || { label: res.status, class: 'bg-gray-100 text-gray-800 border-gray-200' };

                  return (
                    <div
                      key={res.reservationId}
                      className="bg-white rounded-lg p-6 sm:p-7 border border-[#EAE4DF] shadow-xs hover:border-[#C5A15B]/50 transition-all space-y-4"
                    >
                      {/* Top Header of Reservation Card */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#EAE4DF]">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2.5">
                            <span className="font-serif font-bold text-lg text-[#252020]">
                              {res.reservationDate} at {res.reservationTime}
                            </span>
                            <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded border ${badge.class}`}>
                              {badge.label}
                            </span>
                          </div>
                          <p className="text-xs text-[#706866]">
                            Party of <strong>{res.numberOfGuests} {res.numberOfGuests === 1 ? 'Guest' : 'Guests'}</strong> • Booking Ref: <code>{res.reservationId}</code>
                          </p>
                        </div>

                        {/* Assigned Table Display */}
                        <div className="bg-[#FAF8F4] px-4 py-2 rounded-lg border border-[#EAE4DF] text-right sm:text-right">
                          <span className="text-[10px] uppercase font-bold text-[#706866] block">
                            Table Allocation
                          </span>
                          <span className="text-sm font-bold text-[#7B202B]">
                            {res.assignedTable ? (
                              res.assignedTable
                            ) : res.status === 'confirmed' ? (
                              'Table Allocated Upon Arrival'
                            ) : (
                              'Allocated upon confirmation'
                            )}
                          </span>
                        </div>
                      </div>

                      {/* Details & Notes */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-[#706866]">
                        <div className="space-y-1">
                          <p>
                            <strong>Guest Contact:</strong> {res.customerName} ({res.customerPhone})
                          </p>
                          <p>
                            <strong>Confirmation Email:</strong> {res.customerEmail}
                          </p>
                        </div>
                        <div className="space-y-1">
                          {res.specialRequests ? (
                            <p className="bg-[#FAF8F4] p-2 rounded border border-[#EAE4DF] italic">
                              Special Request: "{res.specialRequests}"
                            </p>
                          ) : (
                            <p className="text-gray-400 italic">No special requests noted.</p>
                          )}
                        </div>
                      </div>

                      {/* Action Bar */}
                      <div className="pt-3 border-t border-[#EAE4DF] flex flex-wrap items-center justify-between gap-3 text-xs">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleAddToCalendar(res)}
                            className="text-[#7B202B] hover:text-[#5D1720] font-semibold inline-flex items-center gap-1.5 underline cursor-pointer"
                          >
                            <Calendar className="w-3.5 h-3.5" />
                            Add to Google Calendar
                          </button>
                          <span className="text-gray-300">•</span>
                          <a
                            href="tel:01276452197"
                            className="text-[#706866] hover:text-[#252020] font-medium inline-flex items-center gap-1"
                          >
                            <Phone className="w-3.5 h-3.5" />
                            Call 01276 452 197
                          </a>
                        </div>

                        {res.status === 'pending' && (
                          <button
                            onClick={() => handleCancelReservation(res.reservationId)}
                            className="text-rose-700 hover:text-rose-900 border border-rose-200 hover:bg-rose-50 px-3 py-1.5 rounded cursor-pointer font-semibold transition-colors"
                          >
                            Cancel Request
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Collection Orders */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            {orders.length === 0 ? (
              <div className="bg-white rounded-lg p-12 text-center border border-[#EAE4DF] shadow-xs space-y-4 max-w-lg mx-auto">
                <div className="w-16 h-16 rounded-full bg-[#FAF8F4] flex items-center justify-center text-[#706866] mx-auto">
                  <ShoppingBag className="w-8 h-8 opacity-40" />
                </div>
                <h3 className="font-serif text-xl font-bold text-[#252020]">No Collection Orders Yet</h3>
                <p className="text-xs text-[#706866] leading-relaxed">
                  Enjoy our authentic Indian dishes at home with an exclusive <strong>10% collection discount</strong> on all direct takeaway orders.
                </p>
                <button
                  onClick={() => {
                    setCurrentView('menu');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="inline-flex items-center gap-2 bg-[#7B202B] hover:bg-[#5D1720] text-white text-xs font-semibold px-6 py-3 rounded cursor-pointer shadow-sm"
                >
                  <ShoppingBag className="w-4 h-4 text-[#C5A15B]" />
                  Order Takeaway with 10% Off
                </button>
              </div>
            ) : (
              <div className="space-y-5">
                {orders.map((order) => {
                  const statusColors: Record<string, { label: string; class: string }> = {
                    pending: { label: 'Received - Pending Confirmation', class: 'bg-amber-50 text-amber-900 border-amber-300' },
                    confirmed: { label: 'Confirmed by Kitchen', class: 'bg-indigo-50 text-indigo-900 border-indigo-200' },
                    preparing: { label: 'Cooking in Tandoor / Kitchen', class: 'bg-orange-50 text-orange-900 border-orange-200' },
                    ready: { label: '★ READY FOR PICKUP!', class: 'bg-emerald-600 text-white font-black animate-pulse' },
                    completed: { label: 'Completed', class: 'bg-gray-100 text-gray-700 border-gray-300' },
                    cancelled: { label: 'Cancelled', class: 'bg-rose-50 text-rose-800 border-rose-200' },
                  };
                  const badge = statusColors[order.status] || { label: order.status, class: 'bg-gray-100 text-gray-800 border-gray-200' };

                  return (
                    <div
                      key={order.orderId}
                      className="bg-white rounded-lg p-6 sm:p-7 border border-[#EAE4DF] shadow-xs space-y-4 hover:border-[#C5A15B]/50 transition-all"
                    >
                      {/* Order Header */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#EAE4DF] gap-3">
                        <div>
                          <div className="flex items-center gap-2.5">
                            <span className="font-serif font-bold text-lg text-[#252020]">
                              Order #{order.orderId}
                            </span>
                            <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded border ${badge.class}`}>
                              {badge.label}
                            </span>
                          </div>
                          <p className="text-xs text-[#706866] mt-0.5">
                            Pickup Date & Time:{' '}
                            <strong className="text-[#252020]">{order.collectionDate}</strong> at{' '}
                            <strong className="text-[#252020]">{order.collectionTime}</strong>
                          </p>
                        </div>

                        <div className="text-right sm:text-right">
                          <span className="font-serif font-bold text-xl text-[#7B202B]">
                            £{order.total.toFixed(2)}
                          </span>
                          <span className="text-[11px] text-emerald-800 font-semibold block">
                            Includes 10% Collection Discount
                          </span>
                        </div>
                      </div>

                      {/* Items Snapshot Card */}
                      <div className="bg-[#FAF8F4] rounded-lg p-4 border border-[#EAE4DF] space-y-2">
                        <span className="text-[10px] uppercase font-bold text-[#706866] tracking-wider block">
                          Ordered Items:
                        </span>
                        <div className="divide-y divide-[#EAE4DF]/60 text-xs text-[#252020]">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="py-2 flex items-center justify-between">
                              <div>
                                <span className="font-semibold text-sm">
                                  {item.quantity}x {item.name}
                                </span>
                                {item.variantName && (
                                  <span className="ml-2 text-[11px] bg-[#7B202B]/10 text-[#7B202B] px-2 py-0.5 rounded font-medium">
                                    {item.variantName}
                                  </span>
                                )}
                                <span className="block text-[11px] text-[#706866]">
                                  £{item.unitPrice.toFixed(2)} each
                                </span>
                              </div>
                              <span className="font-serif font-bold text-sm text-[#252020]">
                                £{item.lineTotal.toFixed(2)}
                              </span>
                            </div>
                          ))}
                        </div>

                        {/* Breakdown summary */}
                        <div className="pt-3 border-t border-[#EAE4DF] flex justify-between text-xs text-[#706866]">
                          <span>Subtotal: £{order.subtotal.toFixed(2)}</span>
                          <span className="text-emerald-800 font-semibold">
                            10% Collection Discount: -£{order.discountAmount.toFixed(2)}
                          </span>
                          <span className="font-bold text-[#252020]">
                            Total to Pay: £{order.total.toFixed(2)}
                          </span>
                        </div>
                      </div>

                      {order.notes && (
                        <p className="text-xs text-[#706866] italic bg-white p-2.5 rounded border border-[#EAE4DF]">
                          Kitchen Note: "{order.notes}"
                        </p>
                      )}

                      {/* Card Action Controls */}
                      <div className="pt-2 flex flex-wrap items-center justify-between gap-3 text-xs">
                        <div className="flex items-center gap-2">
                          <span className="text-[#706866]">
                            <MapPin className="w-3.5 h-3.5 inline mr-1 text-[#7B202B]" />
                            58 Updown Hill, Windlesham (Pay on collection)
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setSelectedOrderForReceipt(order)}
                            className="bg-white border border-[#EAE4DF] hover:bg-gray-50 text-[#252020] px-3 py-1.5 rounded font-medium inline-flex items-center gap-1.5 cursor-pointer"
                          >
                            <Receipt className="w-3.5 h-3.5 text-[#7B202B]" />
                            View Receipt
                          </button>
                          <button
                            onClick={() => handleReorder(order)}
                            className="bg-[#7B202B] hover:bg-[#5D1720] text-white px-3 py-1.5 rounded font-semibold inline-flex items-center gap-1.5 cursor-pointer shadow-xs"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            Order Again
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Itemized Printable Receipt Modal */}
      {selectedOrderForReceipt && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-[#EAE4DF] space-y-5 animate-scale-in">
            <div className="text-center border-b border-[#EAE4DF] pb-4 space-y-1">
              <span className="font-serif text-2xl font-bold text-[#7B202B] block">RASHOI</span>
              <p className="text-xs font-semibold text-[#706866] uppercase tracking-widest">
                Indian Cuisine • Est. 1989
              </p>
              <p className="text-xs text-[#706866]">58 Updown Hill, Windlesham, Surrey, GU20 6DX</p>
              <p className="text-xs text-[#706866]">Tel: 01276 452 197 / 01276 453 388</p>
            </div>

            <div className="text-xs space-y-1 text-[#706866]">
              <div className="flex justify-between">
                <span>Order Reference:</span>
                <strong className="text-[#252020]">#{selectedOrderForReceipt.orderId}</strong>
              </div>
              <div className="flex justify-between">
                <span>Customer:</span>
                <strong className="text-[#252020]">{selectedOrderForReceipt.customerName}</strong>
              </div>
              <div className="flex justify-between">
                <span>Collection Time:</span>
                <strong className="text-[#252020]">
                  {selectedOrderForReceipt.collectionDate} at {selectedOrderForReceipt.collectionTime}
                </strong>
              </div>
              <div className="flex justify-between">
                <span>Payment Status:</span>
                <span className="font-semibold text-emerald-800">Due on Collection</span>
              </div>
            </div>

            <div className="border-t border-b border-[#EAE4DF] py-3 space-y-2 text-xs">
              <span className="font-bold text-[#252020] block">Ordered Dishes</span>
              {selectedOrderForReceipt.items.map((item, idx) => (
                <div key={idx} className="flex justify-between py-1">
                  <span>
                    {item.quantity}x {item.name} {item.variantName ? `(${item.variantName})` : ''}
                  </span>
                  <span className="font-medium text-[#252020]">£{item.lineTotal.toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="space-y-1.5 text-xs text-[#706866]">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>£{selectedOrderForReceipt.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-emerald-800 font-semibold">
                <span>10% Collection Discount:</span>
                <span>-£{selectedOrderForReceipt.discountAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-base font-bold text-[#7B202B] pt-2 border-t border-[#EAE4DF]">
                <span>Total Due:</span>
                <span className="font-serif text-lg">£{selectedOrderForReceipt.total.toFixed(2)}</span>
              </div>
            </div>

            <div className="pt-2 flex gap-3">
              <button
                onClick={() => window.print()}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-[#252020] text-xs font-semibold py-2.5 rounded cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                Print Receipt
              </button>
              <button
                onClick={() => setSelectedOrderForReceipt(null)}
                className="flex-1 bg-[#7B202B] hover:bg-[#5D1720] text-white text-xs font-semibold py-2.5 rounded cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
