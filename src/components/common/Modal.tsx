import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl';
  showCloseButton?: boolean;
  zIndex?: number;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = 'lg',
  showCloseButton = true,
  zIndex = 50
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  // Close on Escape & prevent body scroll
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const maxWidthClasses = {
    sm: 'sm:max-w-sm',
    md: 'sm:max-w-md',
    lg: 'sm:max-w-lg',
    xl: 'sm:max-w-xl',
    '2xl': 'sm:max-w-2xl',
    '3xl': 'sm:max-w-3xl',
    '4xl': 'sm:max-w-4xl',
    '5xl': 'sm:max-w-5xl'
  };

  return (
    <div
      style={{ zIndex }}
      className="fixed inset-0 overflow-y-auto"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-950/45 backdrop-blur-xs transition-opacity duration-200"
        aria-hidden="true"
      />

      {/* Container */}
      <div className="relative z-10 flex min-h-full items-end sm:items-center justify-center p-0 sm:p-4 text-center pointer-events-none">
        <div
          ref={modalRef}
          role="dialog"
          aria-modal="true"
          onClick={(e) => e.stopPropagation()}
          className={`pointer-events-auto w-full ${maxWidthClasses[maxWidth]} transform overflow-hidden rounded-t-2xl sm:rounded-2xl bg-white text-left align-middle shadow-2xl transition-all border border-slate-100 flex flex-col max-h-[92vh] sm:max-h-[88vh] animate-in fade-in-0 zoom-in-95 duration-150`}
        >
          {/* Header */}
          {(title || showCloseButton) && (
            <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-slate-100 bg-slate-50/70 sticky top-0 z-10">
              <div>
                {title && <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">{title}</h3>}
                {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
              </div>
              {showCloseButton && (
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-lg p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          )}

          {/* Body */}
          <div className="px-5 sm:px-6 py-5 overflow-y-auto flex-1">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};
