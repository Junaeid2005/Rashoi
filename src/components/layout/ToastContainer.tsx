import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none px-4">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto p-4 rounded-lg shadow-xl border flex items-start gap-3 transition-all duration-300 transform translate-y-0 ${
            toast.type === 'success'
              ? 'bg-[#5D1720] text-white border-[#C5A15B]/40'
              : toast.type === 'error'
              ? 'bg-rose-950 text-white border-rose-800'
              : 'bg-[#252020] text-white border-[#EAE4DF]/20'
          }`}
        >
          {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-[#C5A15B] shrink-0 mt-0.5" />}
          {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-rose-300 shrink-0 mt-0.5" />}
          {toast.type === 'info' && <Info className="w-5 h-5 text-[#C5A15B] shrink-0 mt-0.5" />}
          <div className="text-sm font-medium leading-relaxed">{toast.message}</div>
        </div>
      ))}
    </div>
  );
};
