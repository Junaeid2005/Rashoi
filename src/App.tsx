/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { ToastContainer } from './components/layout/ToastContainer';
import { HeroSection } from './components/home/HeroSection';
import { IntroductionSection } from './components/home/IntroductionSection';
import { SpecialsSection } from './components/home/SpecialsSection';
import { DiscountBanner } from './components/home/DiscountBanner';
import { ReviewHighlight } from './components/home/ReviewHighlight';
import { VisitSection } from './components/home/VisitSection';
import { MenuPage } from './components/menu/MenuPage';
import { ReservationPage } from './components/reservations/ReservationPage';
import { CollectionOrderPage } from './components/orders/CollectionOrderPage';
import { CustomerAccountPage } from './components/account/CustomerAccountPage';
import { AboutPage } from './components/pages/AboutPage';
import { ReviewsPage } from './components/pages/ReviewsPage';
import { ContactPage } from './components/pages/ContactPage';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { FeedbackModal } from './components/feedback/FeedbackModal';
import { AllergenModal, PrivacyModal, TermsModal } from './components/legal/LegalModals';

const AppContent: React.FC = () => {
  const { currentView } = useApp();

  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [allergenOpen, setAllergenOpen] = useState(false);
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [termsOpen, setTermsOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F4] text-[#252020] font-sans selection:bg-[#7B202B] selection:text-white">
      <Header />

      <main className="flex-1">
        {currentView === 'home' && (
          <>
            <HeroSection />
            <IntroductionSection />
            <SpecialsSection />
            <DiscountBanner />
            <ReviewHighlight />
            <VisitSection />
          </>
        )}

        {currentView === 'menu' && <MenuPage />}
        {currentView === 'reservations' && <ReservationPage />}
        {currentView === 'collection' && <CollectionOrderPage />}
        {currentView === 'about' && <AboutPage />}
        {currentView === 'reviews' && <ReviewsPage onOpenFeedback={() => setFeedbackOpen(true)} />}
        {currentView === 'contact' && <ContactPage onOpenFeedback={() => setFeedbackOpen(true)} />}
        {currentView === 'my-account' && <CustomerAccountPage />}
        {currentView === 'admin' && <AdminDashboard />}
      </main>

      <Footer
        onOpenFeedback={() => setFeedbackOpen(true)}
        onOpenAllergen={() => setAllergenOpen(true)}
        onOpenPrivacy={() => setPrivacyOpen(true)}
        onOpenTerms={() => setTermsOpen(true)}
      />

      {/* Global Modals */}
      <FeedbackModal isOpen={feedbackOpen} onClose={() => setFeedbackOpen(false)} />
      <AllergenModal isOpen={allergenOpen} onClose={() => setAllergenOpen(false)} />
      <PrivacyModal isOpen={privacyOpen} onClose={() => setPrivacyOpen(false)} />
      <TermsModal isOpen={termsOpen} onClose={() => setTermsOpen(false)} />

      {/* Real-time feedback alerts */}
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
