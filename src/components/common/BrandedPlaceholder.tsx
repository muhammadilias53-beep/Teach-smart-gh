import React from 'react';
import { motion } from 'motion/react';
import { Logo } from './Logo';
import { FolderOpen } from 'lucide-react';

interface BrandedPlaceholderProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export const BrandedPlaceholder: React.FC<BrandedPlaceholderProps> = ({
  title = "No Resources Found",
  description = "Start by generating a new lesson note, scheme of learning, or classroom exam using the AI templates.",
  actionLabel,
  onAction,
  className
}) => {
  return (
    <div className={`flex flex-col items-center justify-center py-12 px-6 text-center rounded-[1.5rem] bg-slate-50/50 border border-dashed border-slate-200 relative overflow-hidden group ${className || ''}`}>
      {/* Decorative Brand Accent Corner Flairs */}
      <div className="absolute top-0 left-0 w-2.5 h-2.5 bg-brand-red opacity-80 rounded-br-md" />
      <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-ghana-gold opacity-80 rounded-bl-md" />
      <div className="absolute bottom-0 left-0 w-2.5 h-2.5 bg-brand-green opacity-80 rounded-tr-md" />

      {/* Floating Animated App Logo Centerpiece */}
      <motion.div
        initial={{ y: 0 }}
        animate={{ y: [0, -6, 0] }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="mb-6 relative"
      >
        <div className="absolute -inset-4 bg-[#001C3D]/5 rounded-full blur-xl group-hover:bg-[#001C3D]/10 transition-colors duration-500" />
        <Logo iconOnly size="sm" className="relative z-10 mx-auto" />
      </motion.div>

      {/* Title */}
      <h3 className="text-lg font-black text-[#001C3D] tracking-tight mb-2 uppercase flex items-center gap-2 justify-center">
        <FolderOpen size={18} className="text-brand-green" />
        {title}
      </h3>

      {/* Description */}
      <p className="text-slate-500 text-xs font-semibold max-w-sm leading-relaxed mb-6">
        {description}
      </p>

      {/* Sub-Brand Indicator Footer */}
      <span className="text-[8px] font-black text-slate-400 tracking-[0.2em] uppercase block mb-1">
        TeachSmart<span className="text-[#006B3F]">GH</span> • Catalyst Creative
      </span>

      {/* Action Button (Optional) */}
      {actionLabel && onAction && (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onAction}
          className="mt-4 px-5 py-2.5 rounded-xl bg-[#001C3D] text-white text-[11px] font-black tracking-wider uppercase shadow-md shadow-[#001C3D]/20 hover:bg-[#0b2545] transition-all"
        >
          {actionLabel}
        </motion.button>
      )}
    </div>
  );
};
