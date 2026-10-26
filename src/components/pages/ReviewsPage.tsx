import React from 'react';
import { useApp } from '../../context/AppContext';
import { Star, Quote, CheckCircle2, MessageSquare, ExternalLink } from 'lucide-react';

interface ReviewsPageProps {
  onOpenFeedback: () => void;
}

export const ReviewsPage: React.FC<ReviewsPageProps> = ({ onOpenFeedback }) => {
  const { reviews, siteSettings } = useApp();

  const visibleReviews = reviews.filter((r) => r.isVisible);

  return (
    <div className="min-h-screen bg-[#FAF8F4] py-14 sm:py-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#7B202B]">
            Guest Impressions
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#252020]">
            Reviews & Testimonials
          </h1>
          <p className="text-sm text-[#706866] leading-relaxed">
            Read what local diners and guests have experienced when dining at Rashoi in Windlesham.
          </p>
        </div>

        {/* Featured Review Spotlight */}
        <div className="space-y-6">
          {visibleReviews.map((review) => (
            <div
              key={review.reviewId}
              className="bg-white rounded-lg p-8 sm:p-10 border border-[#EAE4DF] shadow-md relative overflow-hidden"
            >
              <div className="flex items-center justify-between gap-4 mb-4">
                <div className="flex items-center gap-1.5">
                  {[...Array(review.rating || 5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-[#C5A15B] text-[#C5A15B]" />
                  ))}
                </div>
                <span className="text-[11px] font-semibold text-[#706866] uppercase tracking-wider">
                  {review.source || 'Customer Testimonial'}
                </span>
              </div>

              <blockquote className="font-serif text-lg sm:text-xl text-[#252020] leading-relaxed italic mb-6">
                "{review.text}"
              </blockquote>

              <div className="flex items-center justify-between pt-4 border-t border-[#EAE4DF] text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[#7B202B] text-sm">{review.reviewerName}</span>
                  <CheckCircle2 className="w-4 h-4 text-[#C5A15B]" />
                </div>
                <span className="text-[#706866]">{review.date || 'Surrey Diner'}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Community & Feedback Prompt Card */}
        <div className="bg-white rounded-lg p-8 border border-[#EAE4DF] text-center space-y-4">
          <h3 className="font-serif text-2xl font-bold text-[#252020]">
            Dined with Us Recently?
          </h3>
          <p className="text-xs text-[#706866] max-w-md mx-auto leading-relaxed">
            We value your honest feedback. Send your comments directly to our team or review us online.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={onOpenFeedback}
              className="bg-[#7B202B] hover:bg-[#5D1720] text-white text-xs font-semibold px-6 py-3 rounded cursor-pointer inline-flex items-center gap-2 shadow-sm"
            >
              <MessageSquare className="w-4 h-4 text-[#C5A15B]" />
              Send Us Feedback
            </button>
            <a
              href={siteSettings.googleMapsUrl || 'https://share.google/m1l4gEswAPjn9ckfn'}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#FAF8F4] hover:bg-[#EAE4DF] text-[#252020] border border-[#EAE4DF] text-xs font-semibold px-6 py-3 rounded cursor-pointer inline-flex items-center gap-2"
            >
              Google Business Profile <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
