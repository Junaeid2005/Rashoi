import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { submitFeedback } from '../../services/dbService';
import { X, MessageSquare, CheckCircle2, AlertCircle, Phone, Mail } from 'lucide-react';
import { Feedback } from '../../types';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({ isOpen, onClose }) => {
  const { user, siteSettings, showToast } = useApp();

  const [name, setName] = useState<string>(user?.displayName || '');
  const [email, setEmail] = useState<string>(user?.email || '');
  const [phone, setPhone] = useState<string>('');
  const [category, setCategory] = useState<Feedback['category']>('general');
  const [message, setMessage] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('Please provide your name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setError('Please provide a valid email address so we can reply to you.');
      return;
    }
    if (!message.trim() || message.trim().length < 10) {
      setError('Please provide details in your message (minimum 10 characters).');
      return;
    }

    setSubmitting(true);
    try {
      await submitFeedback({
        customerUid: user?.uid,
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim() || undefined,
        category,
        message: message.trim(),
      });

      setSubmitted(true);
      showToast('Thank you! Your feedback has been sent to our management.', 'success');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Could not submit feedback';
      setError(msg);
      showToast(msg, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleResetAndClose = () => {
    setSubmitted(false);
    setMessage('');
    setError(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-[#C5A15B]/40 relative space-y-6 animate-scale-in">
        <button
          onClick={handleResetAndClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h3 className="font-serif text-2xl font-bold text-[#7B202B]">
              Message Received
            </h3>
            <p className="text-xs text-[#706866] leading-relaxed max-w-sm mx-auto">
              Thank you for reaching out to Rashoi. Your feedback or enquiry has been forwarded directly to our management team. We will review it attentively.
            </p>
            <button
              onClick={handleResetAndClose}
              className="mt-4 bg-[#7B202B] text-white text-xs font-semibold px-6 py-2.5 rounded cursor-pointer"
            >
              Close
            </button>
          </div>
        ) : (
          <>
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#7B202B]">
                <MessageSquare className="w-4 h-4 text-[#C5A15B]" />
                Customer Care
              </div>
              <h3 className="font-serif text-2xl font-bold text-[#252020] mt-1">
                Complaints & Feedback
              </h3>
              <p className="text-xs text-[#706866] mt-1 leading-relaxed">
                We value your thoughts and strive to offer an exceptional dining experience. Please share your compliments, suggestions, or concerns.
              </p>
            </div>

            {error && (
              <div className="p-3 rounded bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#252020] mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
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
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full bg-[#FAF8F4] border border-[#EAE4DF] rounded px-3 py-2 text-xs text-[#252020] focus:outline-none focus:border-[#7B202B]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#252020] mb-1">
                    Category *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as Feedback['category'])}
                    className="w-full bg-[#FAF8F4] border border-[#EAE4DF] rounded px-3 py-2 text-xs text-[#252020] focus:outline-none focus:border-[#7B202B]"
                  >
                    <option value="general">General Feedback</option>
                    <option value="complaint">Complaint</option>
                    <option value="suggestion">Suggestion</option>
                    <option value="food">Food & Menu Feedback</option>
                    <option value="other">Other Enquiry</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#252020] mb-1">
                    Telephone (Optional)
                  </label>
                  <input
                    type="tel"
                    placeholder="e.g. 01276 ..."
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-[#FAF8F4] border border-[#EAE4DF] rounded px-3 py-2 text-xs text-[#252020] focus:outline-none focus:border-[#7B202B]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#252020] mb-1">
                  Your Message *
                </label>
                <textarea
                  rows={4}
                  placeholder="Please describe your experience or feedback in detail..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  className="w-full bg-[#FAF8F4] border border-[#EAE4DF] rounded p-3 text-xs text-[#252020] focus:outline-none focus:border-[#7B202B]"
                />
              </div>

              <div className="pt-2 flex items-center justify-between gap-4">
                <a
                  href="tel:01276452197"
                  className="text-xs text-[#7B202B] hover:underline flex items-center gap-1 font-medium"
                >
                  <Phone className="w-3.5 h-3.5" /> Call Restaurant Direct
                </a>

                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-[#7B202B] hover:bg-[#5D1720] disabled:bg-gray-300 text-white font-semibold text-xs py-2.5 px-6 rounded transition-colors cursor-pointer shadow-sm"
                >
                  {submitting ? 'Submitting...' : 'Send Message'}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};
