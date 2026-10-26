import React from 'react';
import { X, ShieldAlert, FileText, Lock } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AllergenModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  const { siteSettings } = useApp();
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-amber-300 relative space-y-4 animate-scale-in">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 text-amber-800">
          <ShieldAlert className="w-6 h-6 text-amber-600" />
          <h3 className="font-serif text-2xl font-bold text-[#252020]">Allergen Information</h3>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded p-4 text-xs text-amber-900 leading-relaxed font-medium">
          "{siteSettings.allergenNotice || 'Some of our foods contain allergens. Please speak to a member of staff for more information. Thank you.'}"
        </div>

        <div className="text-xs text-[#706866] space-y-3 leading-relaxed">
          <p>
            At Rashoi, dishes are freshly prepared using traditional Indian spices, dairy (ghee, yoghurt, cream, paneer), tree nuts (almonds, coconut in korma/peshwari/makani), shellfish (prawns, king prawns), mustard, and gluten (naan breads, rotis, pastries).
          </p>
          <p>
            Because items are prepared in a shared kitchen, we cannot guarantee 100% allergen-free environments against cross-contact. If you or any member of your party has a food allergy or intolerance, please speak directly to our duty manager before ordering:
          </p>
          <div className="p-3 bg-[#FAF8F4] rounded border border-[#EAE4DF] text-xs font-semibold text-[#7B202B]">
            Call Rashoi directly: 01276 452 197 / 01276 453 388
          </div>
        </div>

        <div className="pt-2 text-right">
          <button
            onClick={onClose}
            className="bg-[#7B202B] hover:bg-[#5D1720] text-white text-xs font-semibold px-5 py-2.5 rounded cursor-pointer"
          >
            Understood
          </button>
        </div>
      </div>
    </div>
  );
};

export const PrivacyModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-[#EAE4DF] max-h-[85vh] overflow-y-auto relative space-y-4 animate-scale-in">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 text-[#7B202B]">
          <Lock className="w-5 h-5" />
          <h3 className="font-serif text-2xl font-bold text-[#252020]">Privacy Policy</h3>
        </div>

        <div className="text-xs text-[#706866] space-y-3 leading-relaxed">
          <p className="font-medium text-[#252020]">
            Rashoi Indian Cuisine (58 Updown Hill, Windlesham, Surrey, GU20 6DX, UK) respects your privacy and complies with UK Data Protection legislation (UK GDPR / Data Protection Act 2018).
          </p>

          <h4 className="font-bold text-[#252020] text-sm pt-2">1. Data We Collect</h4>
          <p>
            We collect only the minimum necessary information to fulfill your dining requests:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Google Account profile (name, email address, profile picture) upon Google sign-in.</li>
            <li>Contact details (telephone number) when submitting table reservations or collection orders.</li>
            <li>Order snapshots, dietary preferences, and customer feedback messages.</li>
          </ul>

          <h4 className="font-bold text-[#252020] text-sm pt-2">2. How Data is Used & Stored</h4>
          <p>
            Your data is stored securely in Google Cloud / Firebase Firestore. We never sell or share your personal data with third-party advertisers. Data is used exclusively to verify bookings, prepare food orders, and communicate service updates.
          </p>

          <h4 className="font-bold text-[#252020] text-sm pt-2">3. Payment Security</h4>
          <p>
            We do not process, collect, or store payment card numbers, CVVs, or bank details on this website. Collection orders are paid upon pickup at our restaurant premises.
          </p>

          <h4 className="font-bold text-[#252020] text-sm pt-2">4. Your Rights</h4>
          <p>
            You have the right to request access to your personal data or ask for deletion of your booking history by contacting us directly at 58 Updown Hill, Windlesham, or via telephone on 01276 452 197.
          </p>
        </div>

        <div className="pt-4 border-t border-[#EAE4DF] text-right">
          <button
            onClick={onClose}
            className="bg-[#7B202B] hover:bg-[#5D1720] text-white text-xs font-semibold px-5 py-2.5 rounded cursor-pointer"
          >
            Close Privacy Policy
          </button>
        </div>
      </div>
    </div>
  );
};

export const TermsModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-[#EAE4DF] max-h-[85vh] overflow-y-auto relative space-y-4 animate-scale-in">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 text-[#7B202B]">
          <FileText className="w-5 h-5" />
          <h3 className="font-serif text-2xl font-bold text-[#252020]">Terms & Conditions</h3>
        </div>

        <div className="text-xs text-[#706866] space-y-3 leading-relaxed">
          <h4 className="font-bold text-[#252020] text-sm">1. Table Reservations</h4>
          <p>
            Online reservation submissions constitute a request and are subject to restaurant confirmation. We endeavor to accommodate your requested time slot and party size. In the event of exceptional circumstances or fully booked dates, we will notify you promptly.
          </p>

          <h4 className="font-bold text-[#252020] text-sm pt-2">2. 10% Collection Discount</h4>
          <p>
            The advertised 10% discount applies strictly to food collection takeaway orders placed directly with Rashoi. It does not apply to dine-in meals, thali set menus unless specified, or table reservations.
          </p>

          <h4 className="font-bold text-[#252020] text-sm pt-2">3. Collection Order Fulfilment</h4>
          <p>
            Collection orders are prepared hot for pickup at 58 Updown Hill, Windlesham, Surrey, GU20 6DX. Please arrive at your selected collection time to ensure optimal food temperature and quality.
          </p>

          <h4 className="font-bold text-[#252020] text-sm pt-2">4. Cancellations</h4>
          <p>
            If you need to amend or cancel your table reservation or collection order, please contact the restaurant directly by phone at 01276 452 197 as soon as possible.
          </p>
        </div>

        <div className="pt-4 border-t border-[#EAE4DF] text-right">
          <button
            onClick={onClose}
            className="bg-[#7B202B] hover:bg-[#5D1720] text-white text-xs font-semibold px-5 py-2.5 rounded cursor-pointer"
          >
            Close Terms & Conditions
          </button>
        </div>
      </div>
    </div>
  );
};
