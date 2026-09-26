import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none px-4 sm:px-0">
      {toasts.map((toast) => {
        let icon = <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />;
        let borderClass = 'border-emerald-200 bg-white shadow-lg shadow-emerald-950/5';

        if (toast.type === 'error') {
          icon = <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />;
          borderClass = 'border-rose-200 bg-white shadow-lg shadow-rose-950/5';
        } else if (toast.type === 'warning') {
          icon = <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />;
          borderClass = 'border-amber-200 bg-white shadow-lg shadow-amber-950/5';
        } else if (toast.type === 'info') {
          icon = <Info className="w-5 h-5 text-blue-600 flex-shrink-0" />;
          borderClass = 'border-blue-200 bg-white shadow-lg shadow-blue-950/5';
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-xl border ${borderClass} transition-all duration-200 transform translate-y-0`}
          >
            <div className="mt-0.5">{icon}</div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold text-slate-900">{toast.title}</h4>
              {toast.message && (
                <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{toast.message}</p>
              )}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-slate-600 p-1 -mr-1 -mt-1 rounded-lg transition-colors"
              aria-label="Close notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
