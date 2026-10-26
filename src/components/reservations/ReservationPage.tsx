import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { createReservation } from '../../services/dbService';
import {
  CalendarDays,
  Clock,
  Users,
  CheckCircle2,
  AlertTriangle,
  Phone,
  User as UserIcon,
  LogIn,
  ArrowRight,
} from 'lucide-react';

export const ReservationPage: React.FC = () => {
  const {
    user,
    siteSettings,
    reservationDates,
    reservationSlots,
    loginWithGoogle,
    showToast,
    setCurrentView,
  } = useApp();

  // Today in UK (YYYY-MM-DD)
  const todayStr = useMemo(() => {
    const now = new Date();
    return now.toISOString().split('T')[0];
  }, []);

  const [date, setDate] = useState<string>(todayStr);
  const [time, setTime] = useState<string>('18:00');
  const [guests, setGuests] = useState<number>(2);
  const [name, setName] = useState<string>(user?.displayName || '');
  const [email, setEmail] = useState<string>(user?.email || '');
  const [phone, setPhone] = useState<string>('');
  const [specialRequests, setSpecialRequests] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [submittedId, setSubmittedId] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Update name and email when user logs in
  React.useEffect(() => {
    if (user) {
      if (!name && user.displayName) setName(user.displayName);
      if (!email && user.email) setEmail(user.email);
    }
  }, [user]);

  // Standard opening time slots for lunch & evening
  const availableSlots = useMemo(() => {
    return [
      // Lunch service: 12:00 to 14:00
      { time: '12:00', label: '12:00 PM (Lunch)' },
      { time: '12:30', label: '12:30 PM (Lunch)' },
      { time: '13:00', label: '01:00 PM (Lunch)' },
      { time: '13:30', label: '01:30 PM (Lunch)' },
      { time: '14:00', label: '02:00 PM (Lunch)' },
      // Evening service: 17:30 to 22:00
      { time: '17:30', label: '05:30 PM (Evening)' },
      { time: '18:00', label: '06:00 PM (Evening)' },
      { time: '18:30', label: '06:30 PM (Evening)' },
      { time: '19:00', label: '07:00 PM (Evening)' },
      { time: '19:30', label: '07:30 PM (Evening)' },
      { time: '20:00', label: '08:00 PM (Evening)' },
      { time: '20:30', label: '08:30 PM (Evening)' },
      { time: '21:00', label: '09:00 PM (Evening)' },
      { time: '21:30', label: '09:30 PM (Evening)' },
      { time: '22:00', label: '10:00 PM (Evening)' },
    ];
  }, []);

  // Check if selected date is fully booked
  const isDateFullyBooked = useMemo(() => {
    return Boolean(reservationDates[date]?.isFullyBooked);
  }, [reservationDates, date]);

  // Check if selected time slot is specifically closed
  const isSelectedSlotClosed = useMemo(() => {
    const slotKey = `${date}_${time.replace(':', '-')}`;
    return Boolean(reservationSlots[slotKey]?.isClosed);
  }, [reservationSlots, date, time]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (!user) {
      setValidationError('Please sign in with Google to submit your reservation request.');
      return;
    }

    if (!name.trim()) {
      setValidationError('Please provide your full contact name.');
      return;
    }

    if (!email.trim() || !email.includes('@')) {
      setValidationError('Please provide a valid email address for booking confirmation.');
      return;
    }

    if (!phone.trim() || phone.replace(/\s+/g, '').length < 8) {
      setValidationError('Please provide a valid UK telephone number.');
      return;
    }

    if (date < todayStr) {
      setValidationError('Reservation date cannot be in the past.');
      return;
    }

    if (isDateFullyBooked) {
      const msg =
        date === todayStr
          ? 'Sorry, all tables are fully booked today. Please choose tomorrow or another available date.'
          : 'Sorry, all tables are fully booked on your selected date. Please choose another available date.';
      setValidationError(msg);
      return;
    }

    if (isSelectedSlotClosed) {
      setValidationError('This specific time slot is currently closed for reservations. Please choose another time.');
      return;
    }

    setSubmitting(true);
    try {
      const resId = await createReservation({
        customerUid: user.uid,
        customerName: name.trim(),
        customerEmail: email.trim(),
        customerPhone: phone.trim(),
        reservationDate: date,
        reservationTime: time,
        numberOfGuests: guests,
        specialRequests: specialRequests.trim() || undefined,
      });

      setSubmittedId(resId);
      showToast('Reservation request submitted successfully!', 'success');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Could not submit reservation request';
      setValidationError(msg);
      showToast(msg, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F4] py-12 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#7B202B]">
            Dine With Us in Windlesham
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#252020]">
            Table Reservation Request
          </h1>
          <p className="text-sm text-[#706866] leading-relaxed">
            Reserve your table for lunch or evening dining. Online requests are reviewed and confirmed promptly by the Rashoi team.
          </p>
        </div>

        {/* Successful Submission View */}
        {submittedId ? (
          <div className="bg-white rounded-lg p-8 sm:p-12 shadow-md border-2 border-[#C5A15B]/50 text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-semibold text-[#706866] uppercase tracking-wider">
                Booking Reference: <strong className="text-[#252020]">{submittedId}</strong>
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#7B202B]">
                Your Reservation Request Has Been Received
              </h2>
              <p className="text-sm text-[#706866] max-w-lg mx-auto leading-relaxed">
                The Rashoi team will review your request and confirm your booking. Please note that table reservations are subject to restaurant confirmation.
              </p>
            </div>

            <div className="bg-[#FAF8F4] p-5 rounded border border-[#EAE4DF] max-w-md mx-auto text-xs text-left space-y-2">
              <div className="flex justify-between py-1 border-b border-[#EAE4DF]">
                <span className="text-[#706866]">Date:</span>
                <span className="font-bold text-[#252020]">{date}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#EAE4DF]">
                <span className="text-[#706866]">Time:</span>
                <span className="font-bold text-[#252020]">{time}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#EAE4DF]">
                <span className="text-[#706866]">Guests:</span>
                <span className="font-bold text-[#252020]">{guests} {guests === 1 ? 'Guest' : 'Guests'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#EAE4DF]">
                <span className="text-[#706866]">Contact:</span>
                <span className="font-medium text-[#252020]">{name} ({phone})</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-[#706866]">Status:</span>
                <span className="text-amber-800 font-bold uppercase tracking-wider">Pending Review</span>
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
                <span>View in Customer Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  setSubmittedId(null);
                  setDate(todayStr);
                  setSpecialRequests('');
                }}
                className="w-full sm:w-auto bg-gray-100 hover:bg-gray-200 text-[#252020] text-xs font-semibold px-6 py-3 rounded cursor-pointer"
              >
                Request Another Date
              </button>
            </div>
          </div>
        ) : (
          /* Reservation Request Form */
          <div className="bg-white rounded-lg shadow-md border border-[#EAE4DF] p-6 sm:p-10">
            {/* Opening hours summary banner */}
            <div className="mb-8 p-4 rounded bg-[#FAF8F4] border border-[#EAE4DF] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-[#706866]">
              <div className="flex items-center gap-2 text-[#252020] font-medium">
                <Clock className="w-4 h-4 text-[#7B202B] shrink-0" />
                <span>
                  <strong>Opening Hours:</strong> Lunch 12:00–2:30 PM • Evening 5:30–11:00 PM (7 Days)
                </span>
              </div>
              <a
                href="tel:01276452197"
                className="text-[#7B202B] font-bold hover:underline shrink-0 flex items-center gap-1"
              >
                <Phone className="w-3.5 h-3.5" /> 01276 452 197
              </a>
            </div>

            {/* Fully Booked Warning Banner if date is closed */}
            {isDateFullyBooked && (
              <div className="mb-6 p-4 rounded bg-rose-50 border border-rose-200 text-rose-900 text-xs flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-sm font-semibold mb-0.5">
                    {date === todayStr
                      ? 'Fully Booked Today'
                      : 'Fully Booked for Selected Date'}
                  </strong>
                  <p>
                    {date === todayStr
                      ? 'Sorry, all tables are fully booked today. Please choose tomorrow or another available date.'
                      : 'Sorry, all tables are fully booked on your selected date. Please choose another available date.'}
                  </p>
                  <p className="mt-1 text-[11px] text-rose-800">
                    * Collection takeaway food orders remain unaffected and can still be placed online.
                  </p>
                </div>
              </div>
            )}

            {/* Validation Error Message */}
            {validationError && (
              <div className="mb-6 p-3 rounded bg-amber-50 border border-amber-300 text-amber-900 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
                <span>{validationError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Row 1: Date & Time */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div>
                  <label className="block text-xs font-semibold text-[#252020] uppercase tracking-wider mb-2">
                    Reservation Date *
                  </label>
                  <input
                    type="date"
                    min={todayStr}
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                    className="w-full bg-[#FAF8F4] border border-[#EAE4DF] rounded px-3 py-2.5 text-sm text-[#252020] focus:outline-none focus:border-[#7B202B]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#252020] uppercase tracking-wider mb-2">
                    Service Time *
                  </label>
                  <select
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    required
                    className="w-full bg-[#FAF8F4] border border-[#EAE4DF] rounded px-3 py-2.5 text-sm text-[#252020] focus:outline-none focus:border-[#7B202B]"
                  >
                    {availableSlots.map((slot) => {
                      const slotKey = `${date}_${slot.time.replace(':', '-')}`;
                      const isClosed = Boolean(reservationSlots[slotKey]?.isClosed);
                      return (
                        <option
                          key={slot.time}
                          value={slot.time}
                          disabled={isClosed}
                        >
                          {slot.label} {isClosed ? '(Closed)' : ''}
                        </option>
                      );
                    })}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#252020] uppercase tracking-wider mb-2">
                    Number of Guests *
                  </label>
                  <select
                    value={guests}
                    onChange={(e) => setGuests(Number(e.target.value))}
                    required
                    className="w-full bg-[#FAF8F4] border border-[#EAE4DF] rounded px-3 py-2.5 text-sm text-[#252020] focus:outline-none focus:border-[#7B202B]"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 14, 16, 20].map((num) => (
                      <option key={num} value={num}>
                        {num} {num === 1 ? 'Guest' : 'Guests'}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Row 2: Customer Contact Information */}
              <div className="pt-4 border-t border-[#EAE4DF]">
                <h3 className="text-xs font-semibold text-[#7B202B] uppercase tracking-widest mb-4">
                  Contact Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-xs font-semibold text-[#252020] mb-1.5">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. David Smith"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="w-full bg-[#FAF8F4] border border-[#EAE4DF] rounded px-3 py-2.5 text-sm text-[#252020] focus:outline-none focus:border-[#7B202B]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#252020] mb-1.5">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      placeholder="e.g. name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full bg-[#FAF8F4] border border-[#EAE4DF] rounded px-3 py-2.5 text-sm text-[#252020] focus:outline-none focus:border-[#7B202B]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#252020] mb-1.5">
                      UK Telephone *
                    </label>
                    <input
                      type="tel"
                      placeholder="e.g. 07123 456789"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                      className="w-full bg-[#FAF8F4] border border-[#EAE4DF] rounded px-3 py-2.5 text-sm text-[#252020] focus:outline-none focus:border-[#7B202B]"
                    />
                  </div>
                </div>
              </div>

              {/* Row 3: Special Requests & Dietary Notes */}
              <div>
                <label className="block text-xs font-semibold text-[#252020] mb-1.5">
                  Special Requests or Dietary Requirements (Optional)
                </label>
                <textarea
                  rows={3}
                  placeholder="Please let us know of highchair requests, seating preferences, or dietary requirements..."
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  className="w-full bg-[#FAF8F4] border border-[#EAE4DF] rounded p-3 text-sm text-[#252020] focus:outline-none focus:border-[#7B202B]"
                />
              </div>

              {/* Google Auth Requirement Gate */}
              {!user ? (
                <div className="bg-[#5D1720]/10 border border-[#7B202B]/30 rounded-lg p-5 text-center space-y-3">
                  <UserIcon className="w-6 h-6 text-[#7B202B] mx-auto" />
                  <div className="space-y-1">
                    <h4 className="font-serif font-bold text-[#252020] text-sm">
                      Google Sign-In Required for Table Requests
                    </h4>
                    <p className="text-xs text-[#706866] max-w-md mx-auto">
                      To keep your booking secure and allow you to view request status, please sign in with your Google account.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={loginWithGoogle}
                    className="inline-flex items-center gap-2 bg-[#7B202B] hover:bg-[#5D1720] text-white font-semibold text-xs py-2.5 px-6 rounded transition-colors cursor-pointer shadow-sm"
                  >
                    <LogIn className="w-4 h-4 text-[#C5A15B]" />
                    Continue with Google Account
                  </button>
                </div>
              ) : (
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={submitting || isDateFullyBooked || isSelectedSlotClosed}
                    className="w-full bg-[#7B202B] hover:bg-[#5D1720] disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold text-sm uppercase tracking-wider py-4 px-6 rounded transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
                  >
                    {submitting ? (
                      'Submitting Request...'
                    ) : isDateFullyBooked ? (
                      'Date Fully Booked'
                    ) : isSelectedSlotClosed ? (
                      'Selected Slot Closed'
                    ) : (
                      <>
                        <CalendarDays className="w-4 h-4 text-[#C5A15B]" />
                        Submit Table Reservation Request
                      </>
                    )}
                  </button>
                  <p className="text-center text-[11px] text-[#706866] mt-2">
                    Signed in as <strong className="text-[#252020]">{user.displayName || user.email}</strong>.
                  </p>
                </div>
              )}
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
