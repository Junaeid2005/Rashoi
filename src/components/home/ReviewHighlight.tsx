import React from 'react';
import { useApp } from '../../context/AppContext';
import { Star, Quote, CheckCircle } from 'lucide-react';

export const ReviewHighlight: React.FC = () => {
  const { reviews, setCurrentView } = useApp();

  const featuredReview = reviews.find((r) => r.isFeatured && r.isVisible) || reviews[0];

  if (!featuredReview) return null;

  return (
    <section className="py-20 bg-[#FAF8F4] border-b border-[#EAE4DF]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#7B202B]/10 text-[#7B202B] mb-6">
          <Quote className="w-6 h-6" />
        </div>

        <span className="text-xs font-semibold uppercase tracking-widest text-[#7B202B] block mb-3">
          Guest Testimonial
        </span>

        {/* Five star rating */}
        <div className="flex items-center justify-center gap-1.5 mb-6">
          {[...Array(featuredReview.rating || 5)].map((_, i) => (
            <Star key={i} className="w-5 h-5 fill-[#C5A15B] text-[#C5A15B]" />
          ))}
        </div>

        {/* Testimonial Quote */}
        <blockquote className="font-serif text-xl sm:text-2xl md:text-3xl text-[#252020] font-normal leading-relaxed italic mb-8">
          "{featuredReview.text}"
        </blockquote>

        {/* Attribution */}
        <div className="flex items-center justify-center gap-3">
          <div className="text-left">
            <div className="flex items-center gap-1.5 font-bold text-base text-[#7B202B]">
              <span>{featuredReview.reviewerName}</span>
              <CheckCircle className="w-4 h-4 text-[#C5A15B]" />
            </div>
            <p className="text-xs text-[#706866]">
              {featuredReview.source || 'Verified Guest Experience'} • {featuredReview.date || 'Surrey Diner'}
            </p>
          </div>
        </div>

        <div className="mt-8">
          <button
            onClick={() => {
              setCurrentView('reviews');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="text-xs font-semibold uppercase tracking-wider text-[#7B202B] hover:text-[#5D1720] underline underline-offset-4 cursor-pointer"
          >
            Read More Guest Reviews →
          </button>
        </div>
      </div>
    </section>
  );
};
