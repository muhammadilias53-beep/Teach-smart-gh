import React from 'react';
import { motion } from 'motion/react';
import { cn } from '../../lib/utils';
import { CheckCircle } from 'lucide-react';

interface LogoProps {
  className?: string;
  iconOnly?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const Logo = ({ className, iconOnly = false, size = 'md' }: LogoProps) => {
  const sizes = {
    sm: 'w-10 h-10',
    md: 'w-12 h-12',
    lg: 'w-32 h-32',
  };

  const iconSizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-28 h-28',
  };

  return (
    <div className={cn("flex items-center gap-3 min-w-0 select-none", className)}>
      <motion.div 
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={cn(
          sizes[size],
          "relative flex items-center justify-center shrink-0 group"
        )}
      >
        <svg 
          viewBox="0 0 200 200" 
          className={cn(iconSizes[size], "relative z-10")}
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Circular Frame with Ghana Flag Colors */}
          <path 
            d="M40 100C40 66.8629 66.8629 40 100 40C133.137 40 160 66.8629 160 100" 
            stroke="#CE1126" 
            strokeWidth="8" 
            strokeLinecap="round" 
            className="opacity-90"
          />
          <path 
            d="M160 100C160 110 158 120 154 128" 
            stroke="#006B3F" 
            strokeWidth="8" 
            strokeLinecap="round" 
          />
          <path 
            d="M40 100C40 110 42 120 46 128" 
            stroke="#FCD116" 
            strokeWidth="8" 
            strokeLinecap="round" 
          />
          
          {/* Black Star */}
          <path 
            d="M46 95L48 99L52 99.5L49 102L50 106L46 104L42 106L43 102L40 99.5L44 99L46 95Z" 
            fill="black" 
          />

          {/* Center Emblem - Left (Brain/AI) */}
          <path 
            d="M80 60C70 60 62 68 62 78C62 85 65 91 70 95C68 100 70 110 80 120L95 120V60H80Z" 
            fill="#001C3D" 
          />
          {/* AI Circuitry lines */}
          <path d="M75 75V85L85 95V105" stroke="white" strokeWidth="2" strokeLinecap="round" />
          <circle cx="75" cy="72" r="2" fill="white" />
          <path d="M85 70V80" stroke="white" strokeWidth="2" strokeLinecap="round" />
          <circle cx="85" cy="67" r="2" fill="white" />

          {/* Center Emblem - Right (Document/Pen) */}
          <path 
            d="M105 60H130C135 60 138 63 138 68V112C138 117 135 120 130 120H105V60Z" 
            fill="#006B3F" 
          />
          {/* Document Lines */}
          <rect x="112" y="75" width="18" height="2" rx="1" fill="white" opacity="0.6" />
          <rect x="112" y="82" width="18" height="2" rx="1" fill="white" opacity="0.6" />
          <rect x="112" y="89" width="12" height="2" rx="1" fill="white" opacity="0.6" />
          
          {/* Pen */}
          <path 
            d="M125 80L145 100L140 105L120 85L125 80Z" 
            fill="#001C3D" 
            stroke="white" 
            strokeWidth="1"
          />

          {/* The Open Book Base */}
          <path 
            d="M30 145C30 145 60 130 100 130C140 130 170 145 170 145V170C170 170 140 155 100 155C60 155 30 170 30 170V145Z" 
            fill="#001C3D" 
          />
          {/* Book Pages with Colors */}
          <path d="M40 150L100 140L160 150" stroke="#CE1126" strokeWidth="3" fill="none" />
          <path d="M40 155L100 145L160 155" stroke="#FCD116" strokeWidth="3" fill="none" />
          <path d="M40 160L100 150L160 160" stroke="#006B3F" strokeWidth="3" fill="none" />
        </svg>
      </motion.div>

      {!iconOnly && (
        <div className="flex flex-col min-w-0">
          <div className="flex items-center">
            <span className="text-xl font-black text-[#001C3D] tracking-tighter uppercase leading-none truncate max-w-full">
              Teach<span className="text-[#006B3F]">Smart</span><span className="text-[#FCD116]">GH</span>
            </span>
          </div>
          <div className="flex items-center gap-1 mt-1 max-w-full overflow-hidden">
             <div className="h-[2px] w-2 bg-[#CE1126] shrink-0" />
             <span className="text-[7.5px] font-black text-[#CE1126] uppercase tracking-[0.08em] truncate">
               CATALYST CREATIVE
             </span>
             <div className="h-[2px] w-2 bg-[#006B3F] shrink-0" />
          </div>
          <div className="mt-1.5 flex items-center gap-1 bg-sky-50 border border-sky-100 px-1.5 py-0.5 rounded-md w-fit shrink-0">
            <CheckCircle size={8} className="text-sky-600 fill-current shrink-0" />
            <span className="text-[6.5px] font-black text-sky-700 uppercase tracking-widest whitespace-nowrap">GES/NaCCA CERTIFIED</span>
          </div>
          <span className="text-[7.5px] font-semibold text-slate-500 uppercase tracking-tight mt-1 leading-snug break-words">
            AI-Powered Teaching. Smarter Tomorrow.
          </span>
        </div>
      )}
    </div>
  );
};
