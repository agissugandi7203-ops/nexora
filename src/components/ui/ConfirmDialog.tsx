import React, { useEffect } from 'react';
import { AlertTriangle, AlertCircle, LogOut, Trash2, X, Check } from 'lucide-react';

export type DialogVariant = 'danger' | 'warning' | 'primary' | 'success';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmLabel?: string;
  confirmText?: string;
  cancelLabel?: string;
  cancelText?: string;
  variant?: DialogVariant;
  icon?: 'trash' | 'logout' | 'alert' | 'warning' | 'check';
  isLoading?: boolean;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = 'Ya, Lanjutkan',
  confirmText,
  cancelLabel = 'Batal',
  cancelText,
  variant = 'danger',
  icon = 'trash',
  isLoading = false,
}) => {
  const finalConfirmLabel = confirmText || confirmLabel;
  const finalCancelLabel = cancelText || cancelLabel;
  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && !isLoading) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, isLoading]);

  if (!isOpen) return null;

  // Icon configuration
  const renderIcon = () => {
    switch (icon) {
      case 'logout':
        return <LogOut className="w-6 h-6 text-rose-600" />;
      case 'warning':
        return <AlertTriangle className="w-6 h-6 text-amber-600" />;
      case 'check':
        return <Check className="w-6 h-6 text-emerald-600" />;
      case 'alert':
        return <AlertCircle className="w-6 h-6 text-blue-600" />;
      case 'trash':
      default:
        return <Trash2 className="w-6 h-6 text-rose-600" />;
    }
  };

  const getIconWrapperBg = () => {
    switch (variant) {
      case 'primary':
        return 'bg-blue-50 border-blue-200 text-blue-600';
      case 'warning':
        return 'bg-amber-50 border-amber-200 text-amber-600';
      case 'success':
        return 'bg-emerald-50 border-emerald-200 text-emerald-600';
      case 'danger':
      default:
        return 'bg-rose-50 border-rose-200 text-rose-600';
    }
  };

  const getConfirmButtonClasses = () => {
    switch (variant) {
      case 'primary':
        return 'bg-[#3b5bf5] hover:bg-blue-600 text-white shadow-lg shadow-blue-500/25';
      case 'warning':
        return 'bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold shadow-lg shadow-amber-500/20';
      case 'success':
        return 'bg-[#1cd485] hover:bg-emerald-500 text-slate-950 font-bold shadow-lg shadow-emerald-500/20';
      case 'danger':
      default:
        return 'bg-rose-600 hover:bg-rose-700 text-white shadow-lg shadow-rose-600/25';
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
    >
      {/* Backdrop with blur */}
      <div
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
        onClick={() => !isLoading && onClose()}
        aria-hidden="true"
      />

      {/* Modal Dialog Card */}
      <div className="relative w-full max-w-md bg-white rounded-3xl p-6 md:p-7 shadow-2xl border border-slate-200/90 z-10 transform transition-all animate-in zoom-in-95 duration-200">
        {/* Close Button Top Right */}
        <button
          type="button"
          onClick={onClose}
          disabled={isLoading}
          className="absolute top-5 right-5 p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          aria-label="Tutup Dialog"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-start gap-4 mb-4">
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border ${getIconWrapperBg()}`}
          >
            {renderIcon()}
          </div>

          <div className="pt-1">
            <h3
              id="confirm-dialog-title"
              className="text-lg font-bold text-slate-900 leading-snug"
            >
              {title}
            </h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              {description}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 mt-6">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
          >
            {finalCancelLabel}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${getConfirmButtonClasses()}`}
          >
            {isLoading && (
              <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            )}
            <span>{finalConfirmLabel}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
