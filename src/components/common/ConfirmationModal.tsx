import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertTriangle, X } from 'lucide-react';
import { cn } from '../../lib/utils';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'warning' | 'info';
}

export const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'danger'
}: ConfirmationModalProps) => {
  if (!isOpen) return null;

  const variants = {
    danger: {
      icon: <AlertTriangle className="text-rose-500" size={24} />,
      bg: 'bg-rose-50',
      border: 'border-rose-100',
      button: 'bg-rose-500 hover:bg-rose-600 text-white shadow-rose-200'
    },
    warning: {
      icon: <AlertTriangle className="text-amber-500" size={24} />,
      bg: 'bg-amber-50',
      border: 'border-amber-100',
      button: 'bg-amber-500 hover:bg-amber-600 text-white shadow-amber-200'
    },
    info: {
      icon: <AlertTriangle className="text-slate-500" size={24} />,
      bg: 'bg-slate-50',
      border: 'border-slate-100',
      button: 'bg-slate-900 hover:bg-slate-800 text-white shadow-slate-200'
    }
  };

  const style = variants[variant];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden"
        >
          <div className="p-8">
            <div className="flex justify-between items-start mb-6">
              <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center mb-4", style.bg)}>
                {style.icon}
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400"
              >
                <X size={20} />
              </button>
            </div>

            <h3 className="text-xl font-black text-slate-900 mb-2 uppercase tracking-tight leading-tight">
              {title}
            </h3>
            <p className="text-slate-500 text-sm font-medium leading-relaxed mb-8">
              {message}
            </p>

            <div className="flex gap-3 mt-8">
              <button
                onClick={onClose}
                className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 transition-all"
              >
                {cancelLabel}
              </button>
              <button
                onClick={() => {
                  onConfirm();
                  onClose();
                }}
                className={cn(
                  "flex-1 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg transition-all active:scale-95",
                  style.button
                )}
              >
                {confirmLabel}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
