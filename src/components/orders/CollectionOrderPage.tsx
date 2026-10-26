import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { createOrder } from '../../services/dbService';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  Clock,
  MapPin,
  CheckCircle2,
  AlertCircle,
  LogIn,
  User as UserIcon,
  Tag,
  ArrowRight,
} from 'lucide-react';

export const CollectionOrderPage: React.FC = () => {
  const {
    user,
    cart,
    cartCount,
    cartSubtotal,
    cartDiscountPercent,
    cartDiscountAmount,
    cartTotal,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    siteSettings,
    loginWithGoogle,
    showToast,
    setCurrentView,
  } = useApp();

  // Today in UK
  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);

  const [collectionDate, setCollectionDate] = useState<string>(todayStr);
  const [collectionTime, setCollectionTime] = useState<string>('18:30');
  const [name, setName] = useState<string>(user?.displayName || '');
  const [email, setEmail] = useState<string>(user?.email || '');
  const [phone, setPhone] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [submittedOrderId, setSubmittedOrderId] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  React.useEffect(() => {
    if (user) {
      if (!name && user.displayName) setName(user.displayName);
      if (!email && user.email) setEmail(user.email);
    }
  }, [user]);

  // Available collection time slots within opening hours
  const collectionTimeSlots = useMemo(() => {
    return [
      // Lunch collection
      '12:15', '12:30', '12:45', '13:00', '13:15', '13:30', '13:45', '14:00', '14:15',
      // Evening collection
      '17:45', '18:00', '18:15', '18:30', '18:45', '19:00', '19:15', '19:30',
      '19:45', '20:00', '20:15', '20:30', '20:45', '21:00', '21:15', '21:30', '21:45', '22:00', '22:15'
    ];
  }, []);

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (cart.length === 0) {
      setValidationError('Your collection basket is empty. Please add menu items first.');
      return;
    }

    if (!user) {
      setValidationError('Please sign in with Google to place your collection order.');
      return;
    }

    if (!name.trim()) {
      setValidationError('Please enter your full contact name.');
      return;
    }

    if (!email.trim() || !email.includes('@')) {
      setValidationError('Please provide a valid email address for order updates.');
      return;
    }

    if (!phone.trim() || phone.replace(/\s+/g, '').length < 8) {
      setValidationError('Please provide a valid UK telephone number so we can reach you when your order is ready.');
      return;
    }

    if (collectionDate < todayStr) {
      setValidationError('Collection date cannot be in the past.');
      return;
    }

    setSubmitting(true);
    try {
      const orderId = await createOrder({
        customerUid: user.uid,
        customerName: name.trim(),
        customerEmail: email.trim(),
        customerPhone: phone.trim(),
        items: [...cart],
        subtotal: cartSubtotal,
        discountPercent: cartDiscountPercent,
        discountAmount: cartDiscountAmount,
        total: cartTotal,
        collectionDate,
        collectionTime,
        notes: notes.trim() || undefined,
      });

      setSubmittedOrderId(orderId);
      clearCart();
      showToast('Collection order submitted successfully!', 'success');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Could not submit collection order';
      setValidationError(msg);
      showToast(msg, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F4] py-12 sm:py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <div className="inline-flex items-center gap-2 bg-[#5D1720]/10 border border-[#7B202B]/20 text-[#7B202B] px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
            <Tag className="w-3.5 h-3.5 text-[#C5A15B]" />
            <span>10% Collection Discount Applied Automatically</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#252020]">
            Order for Collection
          </h1>
          <p className="text-sm text-[#706866] leading-relaxed">
            Order fresh traditional Indian dishes for collection at Rashoi, 58 Updown Hill, Windlesham. Prepared hot and packed to order.
          </p>
        </div>

        {/* Order Confirmed View */}
        {submittedOrderId ? (
          <div className="bg-white rounded-lg p-8 sm:p-12 shadow-md border-2 border-[#C5A15B]/50 text-center space-y-6 max-w-2xl mx-auto">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-semibold text-[#706866] uppercase tracking-wider">
                Order Reference: <strong className="text-[#252020]">{submittedOrderId}</strong>
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#7B202B]">
                Collection Order Received!
              </h2>
              <p className="text-sm text-[#706866] leading-relaxed">
                Thank you, {name}. Your collection order request has been received by our kitchen. You will receive live status updates in your account.
              </p>
            </div>

            <div className="bg-[#FAF8F4] p-5 rounded border border-[#EAE4DF] text-xs text-left space-y-2.5">
              <div className="flex justify-between py-1 border-b border-[#EAE4DF]">
                <span className="text-[#706866]">Collection Date & Time:</span>
                <span className="font-bold text-[#252020]">{collectionDate} at {collectionTime}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#EAE4DF]">
                <span className="text-[#706866]">Pickup Location:</span>
                <span className="font-bold text-[#252020]">58 Updown Hill, Windlesham, GU20 6DX</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#EAE4DF]">
                <span className="text-[#706866]">Payment Terms:</span>
                <span className="font-semibold text-emerald-800">Pay on Collection (Card or Cash)</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-[#706866]">Preparation Status:</span>
                <span className="font-bold uppercase tracking-wider text-amber-800">Pending Kitchen Confirmation</span>
              </div>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => {
                  setCurrentView('my-account');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="w-full sm:w-auto bg-[#7B202B] hover:bg-[#5D1720] text-white text-xs font-bold uppercase tracking-wider px-6 py-3 rounded cursor-pointer shadow-md flex items-center justify-center gap-2"
              >
                <span>Track in Customer Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => setCurrentView('menu')}
                className="w-full sm:w-auto bg-gray-100 hover:bg-gray-200 text-[#252020] text-xs font-semibold px-6 py-3 rounded cursor-pointer"
              >
                Return to Menu
              </button>
            </div>
          </div>
        ) : cart.length === 0 ? (
          /* Empty Basket View */
          <div className="bg-white rounded-lg p-12 text-center max-w-md mx-auto border border-[#EAE4DF] shadow-sm space-y-4">
            <div className="w-16 h-16 rounded-full bg-[#FAF8F4] flex items-center justify-center text-[#706866] mx-auto">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <h3 className="font-serif text-xl font-bold text-[#252020]">Your Basket is Empty</h3>
            <p className="text-xs text-[#706866] leading-relaxed">
              Explore our complete digital menu to select starters, tandoori grills, classic curries, and breads for collection.
            </p>
            <button
              onClick={() => setCurrentView('menu')}
              className="inline-flex items-center gap-2 bg-[#7B202B] hover:bg-[#5D1720] text-white text-xs font-semibold uppercase tracking-wider px-6 py-3 rounded cursor-pointer shadow-sm"
            >
              Explore Digital Menu
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          /* Checkout Grid: Left Cart Items, Right Details & Submission */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: Basket Items & Summary */}
            <div className="lg:col-span-7 bg-white rounded-lg p-6 sm:p-8 border border-[#EAE4DF] shadow-sm space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-[#EAE4DF]">
                <h2 className="font-serif text-xl font-bold text-[#252020]">
                  Your Order Items ({cartCount})
                </h2>
                <button
                  onClick={clearCart}
                  className="text-xs text-[#706866] hover:text-rose-700 underline cursor-pointer"
                >
                  Clear basket
                </button>
              </div>

              {/* Items List */}
              <div className="divide-y divide-[#EAE4DF]">
                {cart.map((item, idx) => (
                  <div key={idx} className="py-4 flex items-center justify-between gap-4">
                    <div className="space-y-1 flex-1">
                      <h4 className="font-serif font-bold text-sm text-[#252020]">
                        {item.name}
                      </h4>
                      {item.variantName && (
                        <span className="text-xs text-[#7B202B] font-medium bg-[#7B202B]/10 px-2 py-0.5 rounded">
                          {item.variantName}
                        </span>
                      )}
                      <div className="text-xs text-[#706866]">
                        £{item.unitPrice.toFixed(2)} each
                      </div>
                    </div>

                    {/* Quantity controls */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateCartQuantity(idx, item.quantity - 1)}
                        className="w-7 h-7 rounded border border-[#EAE4DF] hover:bg-gray-100 flex items-center justify-center text-xs cursor-pointer"
                        title="Decrease quantity"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-sm font-bold w-6 text-center text-[#252020]">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateCartQuantity(idx, item.quantity + 1)}
                        className="w-7 h-7 rounded border border-[#EAE4DF] hover:bg-gray-100 flex items-center justify-center text-xs cursor-pointer"
                        title="Increase quantity"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="font-serif font-bold text-sm text-[#252020] block">
                        £{item.lineTotal.toFixed(2)}
                      </span>
                      <button
                        onClick={() => removeFromCart(idx)}
                        className="text-gray-400 hover:text-rose-600 p-1 cursor-pointer"
                        title="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Price Calculation Breakdown */}
              <div className="pt-4 border-t border-[#EAE4DF] space-y-2 text-sm">
                <div className="flex justify-between text-[#706866]">
                  <span>Subtotal</span>
                  <span className="font-medium text-[#252020]">£{cartSubtotal.toFixed(2)}</span>
                </div>

                {cartDiscountPercent > 0 && (
                  <div className="flex justify-between text-emerald-800 font-medium">
                    <span className="flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5 text-emerald-600" />
                      Collection Discount ({cartDiscountPercent}%)
                    </span>
                    <span>-£{cartDiscountAmount.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between text-base font-bold text-[#7B202B] pt-2 border-t border-[#EAE4DF]">
                  <span>Total Due on Collection</span>
                  <span className="font-serif text-xl">£{cartTotal.toFixed(2)}</span>
                </div>
              </div>

              <div className="p-3 rounded bg-[#FAF8F4] border border-[#EAE4DF] text-xs text-[#706866] space-y-1">
                <div className="flex items-center gap-1.5 font-semibold text-[#252020]">
                  <MapPin className="w-3.5 h-3.5 text-[#7B202B]" />
                  <span>Collection Address: 58 Updown Hill, Windlesham, GU20 6DX</span>
                </div>
                <p>Payment is accepted upon collection via credit/debit card or cash.</p>
              </div>
            </div>

            {/* Right: Customer & Collection Time Form */}
            <div className="lg:col-span-5 bg-white rounded-lg p-6 sm:p-8 border border-[#EAE4DF] shadow-sm space-y-6">
              <h2 className="font-serif text-xl font-bold text-[#252020] pb-2 border-b border-[#EAE4DF]">
                Collection Details
              </h2>

              {validationError && (
                <div className="p-3 rounded bg-amber-50 border border-amber-300 text-amber-900 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
                  <span>{validationError}</span>
                </div>
              )}

              <form onSubmit={handleSubmitOrder} className="space-y-5">
                {/* Collection Date & Time */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#252020] mb-1">
                      Collection Date *
                    </label>
                    <input
                      type="date"
                      min={todayStr}
                      value={collectionDate}
                      onChange={(e) => setCollectionDate(e.target.value)}
                      required
                      className="w-full bg-[#FAF8F4] border border-[#EAE4DF] rounded px-3 py-2 text-xs text-[#252020] focus:outline-none focus:border-[#7B202B]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#252020] mb-1">
                      Pickup Time *
                    </label>
                    <select
                      value={collectionTime}
                      onChange={(e) => setCollectionTime(e.target.value)}
                      required
                      className="w-full bg-[#FAF8F4] border border-[#EAE4DF] rounded px-3 py-2 text-xs text-[#252020] focus:outline-none focus:border-[#7B202B]"
                    >
                      {collectionTimeSlots.map((slot) => (
                        <option key={slot} value={slot}>
                          {slot}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Contact Information */}
                <div>
                  <label className="block text-xs font-semibold text-[#252020] mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. David Smith"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full bg-[#FAF8F4] border border-[#EAE4DF] rounded px-3 py-2 text-xs text-[#252020] focus:outline-none focus:border-[#7B202B]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#252020] mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    placeholder="e.g. name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full bg-[#FAF8F4] border border-[#EAE4DF] rounded px-3 py-2 text-xs text-[#252020] focus:outline-none focus:border-[#7B202B]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#252020] mb-1">
                    UK Telephone Number *
                  </label>
                  <input
                    type="tel"
                    placeholder="e.g. 07123 456789"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    className="w-full bg-[#FAF8F4] border border-[#EAE4DF] rounded px-3 py-2 text-xs text-[#252020] focus:outline-none focus:border-[#7B202B]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#252020] mb-1">
                    Kitchen Preparation Notes (Optional)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Extra mild / cutlery required / allergies..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full bg-[#FAF8F4] border border-[#EAE4DF] rounded p-2.5 text-xs text-[#252020] focus:outline-none focus:border-[#7B202B]"
                  />
                </div>

                {/* Authentication Check */}
                {!user ? (
                  <div className="bg-[#5D1720]/10 border border-[#7B202B]/30 rounded p-4 text-center space-y-2">
                    <p className="text-xs text-[#706866]">
                      Sign in with Google to submit and track your collection order.
                    </p>
                    <button
                      type="button"
                      onClick={loginWithGoogle}
                      className="w-full inline-flex items-center justify-center gap-2 bg-[#7B202B] hover:bg-[#5D1720] text-white font-semibold text-xs py-2.5 px-4 rounded transition-colors cursor-pointer shadow-sm"
                    >
                      <UserIcon className="w-4 h-4 text-[#C5A15B]" />
                      Sign in with Google
                    </button>
                  </div>
                ) : (
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-[#7B202B] hover:bg-[#5D1720] disabled:bg-gray-300 text-white font-bold text-xs uppercase tracking-wider py-3.5 px-4 rounded transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
                  >
                    {submitting ? 'Submitting Order...' : `Submit Order (£${cartTotal.toFixed(2)})`}
                  </button>
                )}
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
