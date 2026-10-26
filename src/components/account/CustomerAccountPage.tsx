import React, { useState, useEffect } from 'react';
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
  CheckCircle,
  XCircle,
  AlertCircle,
  MapPin,
} from 'lucide-react';

export const CustomerAccountPage: React.FC = () => {
  const { user, loginWithGoogle, showToast, setCurrentView } = useApp();

  const [activeTab, setActiveTab] = useState<'reservations' | 'orders'>('reservations');
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

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

  const handleCancelReservation = async (reservationId: string) => {
    if (!window.confirm('Are you sure you wish to cancel this reservation request?')) {
      return;
    }
    try {
      await updateReservationStatus(reservationId, 'cancelled', 'Cancelled by customer');
      showToast('Reservation has been cancelled.', 'info');
    } catch {
      showToast('Could not cancel reservation.', 'error');
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-[#FAF8F4] py-16 flex items-center justify-center px-4">
        <div className="bg-white rounded-lg p-8 max-w-md w-full border border-[#EAE4DF] shadow-md text-center space-y-4">
          <div className="w-14 h-14 rounded-full bg-[#7B202B]/10 text-[#7B202B] flex items-center justify-center mx-auto">
            <UserIcon className="w-7 h-7" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-[#252020]">Sign In to View Your Account</h2>
          <p className="text-xs text-[#706866] leading-relaxed">
            Please sign in with your Google account to access your reservation history and track collection orders.
          </p>
          <button
            onClick={loginWithGoogle}
            className="w-full bg-[#7B202B] hover:bg-[#5D1720] text-white text-xs font-semibold py-3 px-4 rounded cursor-pointer shadow-sm transition-colors"
          >
            Sign in with Google
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF8F4] py-12 sm:py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Card */}
        <div className="bg-white rounded-lg p-6 sm:p-8 border border-[#EAE4DF] shadow-sm mb-8 flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6">
          <div className="flex items-center gap-4 text-center sm:text-left">
            {user.photoURL ? (
              <img
                src={user.photoURL}
                alt={user.displayName || 'Profile'}
                className="w-16 h-16 rounded-full border-2 border-[#C5A15B] object-cover"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-[#7B202B] text-white flex items-center justify-center font-serif text-2xl font-bold">
                {user.displayName?.charAt(0) || 'U'}
              </div>
            )}
            <div>
              <h1 className="font-serif text-2xl font-bold text-[#252020]">
                {user.displayName || 'Guest User'}
              </h1>
              <p className="text-xs text-[#706866]">{user.email}</p>
              <span className="inline-block mt-1 text-[11px] font-semibold text-[#7B202B] bg-[#7B202B]/10 px-2 py-0.5 rounded">
                Rashoi Verified Customer
              </span>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setCurrentView('reservations')}
              className="bg-[#7B202B] hover:bg-[#5D1720] text-white text-xs font-semibold px-4 py-2 rounded cursor-pointer"
            >
              New Reservation
            </button>
            <button
              onClick={() => setCurrentView('menu')}
              className="bg-[#FAF8F4] hover:bg-[#EAE4DF] text-[#252020] border border-[#EAE4DF] text-xs font-semibold px-4 py-2 rounded cursor-pointer"
            >
              Order Takeaway
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-[#EAE4DF] mb-6">
          <button
            onClick={() => setActiveTab('reservations')}
            className={`pb-3 px-6 text-sm font-semibold tracking-wide transition-colors cursor-pointer flex items-center gap-2 ${
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
            className={`pb-3 px-6 text-sm font-semibold tracking-wide transition-colors cursor-pointer flex items-center gap-2 ${
              activeTab === 'orders'
                ? 'border-b-2 border-[#7B202B] text-[#7B202B]'
                : 'text-[#706866] hover:text-[#252020]'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            Collection Orders ({orders.length})
          </button>
        </div>

        {/* Tab 1: Reservations List */}
        {activeTab === 'reservations' && (
          <div>
            {loading ? (
              <div className="text-center py-12 text-xs text-[#706866]">Loading your reservations...</div>
            ) : reservations.length === 0 ? (
              <div className="bg-white rounded-lg p-10 text-center border border-[#EAE4DF] space-y-3">
                <CalendarDays className="w-8 h-8 text-[#706866] mx-auto opacity-40" />
                <h3 className="font-serif text-lg font-bold text-[#252020]">No Reservations Yet</h3>
                <p className="text-xs text-[#706866]">
                  You have not submitted any table reservation requests yet.
                </p>
                <button
                  onClick={() => setCurrentView('reservations')}
                  className="mt-2 inline-flex items-center gap-1.5 bg-[#7B202B] text-white text-xs font-semibold px-4 py-2 rounded"
                >
                  Book a Table
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {reservations.map((res) => {
                  const statusColors: Record<string, string> = {
                    pending: 'bg-amber-50 text-amber-800 border-amber-200',
                    confirmed: 'bg-emerald-50 text-emerald-800 border-emerald-200',
                    rejected: 'bg-rose-50 text-rose-800 border-rose-200',
                    cancelled: 'bg-gray-100 text-gray-700 border-gray-300',
                    completed: 'bg-blue-50 text-blue-800 border-blue-200',
                  };

                  return (
                    <div
                      key={res.reservationId}
                      className="bg-white rounded-lg p-6 border border-[#EAE4DF] shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-[#252020]">
                            {res.reservationDate} at {res.reservationTime}
                          </span>
                          <span
                            className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
                              statusColors[res.status] || 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {res.status}
                          </span>
                        </div>
                        <p className="text-xs text-[#706866]">
                          {res.numberOfGuests} {res.numberOfGuests === 1 ? 'Guest' : 'Guests'} • Ref: {res.reservationId}
                        </p>
                        {res.specialRequests && (
                          <p className="text-xs text-[#706866] italic">
                            Note: "{res.specialRequests}"
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                        {res.status === 'pending' && (
                          <button
                            onClick={() => handleCancelReservation(res.reservationId)}
                            className="text-xs text-rose-700 hover:text-rose-900 border border-rose-200 px-3 py-1.5 rounded cursor-pointer"
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

        {/* Tab 2: Orders List */}
        {activeTab === 'orders' && (
          <div>
            {orders.length === 0 ? (
              <div className="bg-white rounded-lg p-10 text-center border border-[#EAE4DF] space-y-3">
                <ShoppingBag className="w-8 h-8 text-[#706866] mx-auto opacity-40" />
                <h3 className="font-serif text-lg font-bold text-[#252020]">No Collection Orders Yet</h3>
                <p className="text-xs text-[#706866]">
                  Order your favourite dishes online for collection and enjoy a 10% discount!
                </p>
                <button
                  onClick={() => setCurrentView('menu')}
                  className="mt-2 inline-flex items-center gap-1.5 bg-[#7B202B] text-white text-xs font-semibold px-4 py-2 rounded"
                >
                  Browse Menu & Order
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => {
                  const statusColors: Record<string, string> = {
                    pending: 'bg-amber-50 text-amber-800 border-amber-200',
                    confirmed: 'bg-indigo-50 text-indigo-800 border-indigo-200',
                    preparing: 'bg-orange-50 text-orange-800 border-orange-200',
                    ready: 'bg-emerald-50 text-emerald-800 border-emerald-200',
                    completed: 'bg-gray-100 text-gray-700 border-gray-300',
                    cancelled: 'bg-rose-50 text-rose-800 border-rose-200',
                  };

                  return (
                    <div
                      key={order.orderId}
                      className="bg-white rounded-lg p-6 border border-[#EAE4DF] shadow-xs space-y-4"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#EAE4DF] gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-[#252020]">
                              Order #{order.orderId}
                            </span>
                            <span
                              className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
                                statusColors[order.status] || 'bg-gray-100 text-gray-800'
                              }`}
                            >
                              {order.status === 'ready' ? 'Ready for Collection!' : order.status}
                            </span>
                          </div>
                          <p className="text-xs text-[#706866] mt-0.5">
                            Pickup Date: <strong>{order.collectionDate}</strong> at <strong>{order.collectionTime}</strong>
                          </p>
                        </div>

                        <div className="text-right sm:text-right">
                          <span className="font-serif font-bold text-lg text-[#7B202B]">
                            £{order.total.toFixed(2)}
                          </span>
                          <span className="text-[11px] text-[#706866] block">Pay on collection</span>
                        </div>
                      </div>

                      {/* Items */}
                      <div className="space-y-1.5 text-xs text-[#252020]">
                        {order.items.map((item, i) => (
                          <div key={i} className="flex justify-between py-0.5">
                            <span>
                              {item.quantity}x {item.name} {item.variantName ? `(${item.variantName})` : ''}
                            </span>
                            <span className="font-medium text-[#706866]">£{item.lineTotal.toFixed(2)}</span>
                          </div>
                        ))}
                      </div>

                      <div className="pt-2 border-t border-[#EAE4DF] flex items-center justify-between text-xs text-[#706866]">
                        <span>Pickup: 58 Updown Hill, Windlesham, GU20 6DX</span>
                        <span>01276 452 197</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
