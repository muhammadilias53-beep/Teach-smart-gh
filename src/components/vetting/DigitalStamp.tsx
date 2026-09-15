import React, { useRef, useState, useEffect } from 'react';
import { CheckCircle2, ShieldCheck, Award, PenTool, RotateCcw } from 'lucide-react';
import { HeadteacherStampConfig } from '../../types/vetting';

interface DigitalStampProps {
  config: HeadteacherStampConfig;
  vettedAt?: string;
  isApproved?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const DigitalStamp: React.FC<DigitalStampProps> = ({
  config,
  vettedAt,
  isApproved = true,
  size = 'md'
}) => {
  const formattedDate = vettedAt
    ? new Date(vettedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    : new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

  if (config.stampStyle === 'circle') {
    return (
      <div 
        className={`relative inline-flex flex-col items-center justify-center rounded-full border-4 border-emerald-800/80 bg-emerald-50/40 p-4 text-center select-none shadow-sm transition-transform hover:scale-[1.02] ${
          size === 'sm' ? 'w-36 h-36 scale-90' : size === 'lg' ? 'w-56 h-56' : 'w-48 h-48'
        }`}
        style={{
          boxShadow: 'inset 0 0 10px rgba(6, 78, 59, 0.1), 0 2px 8px rgba(0, 0, 0, 0.05)',
        }}
      >
        <div className="absolute inset-1 rounded-full border border-dashed border-emerald-700/60 pointer-events-none" />
        
        {/* Top Arc Text */}
        <span className="text-[9px] font-black uppercase tracking-widest text-emerald-900 leading-tight">
          GHANA EDUCATION SERVICE
        </span>

        {/* Center Badge */}
        <div className="my-1 flex flex-col items-center">
          <div className="flex items-center gap-1 text-emerald-800">
            <ShieldCheck size={size === 'sm' ? 14 : 18} className="text-emerald-700" />
            <span className="font-extrabold text-[11px] uppercase tracking-wider text-emerald-950">
              {isApproved ? 'VETTED & APPROVED' : 'UNDER INSPECTION'}
            </span>
          </div>
          <span className="text-[9px] font-bold text-slate-700 max-w-[140px] truncate">
            {config.schoolName}
          </span>
          <span className="text-[8px] text-slate-500 max-w-[130px] truncate">
            {config.district}
          </span>
        </div>

        {/* Signature Line */}
        <div className="mt-1 flex flex-col items-center">
          {config.signatureDataUrl ? (
            <img src={config.signatureDataUrl} alt="Signature" className="h-6 w-auto object-contain" />
          ) : (
            <span className="font-serif italic text-[11px] font-bold text-slate-800 -rotate-2">
              {config.headteacherName}
            </span>
          )}
          <span className="text-[8px] font-mono text-emerald-900 font-semibold border-t border-emerald-700/40 pt-0.5 mt-0.5">
            {formattedDate} • {config.serialCode || 'GES-VETTED'}
          </span>
        </div>
      </div>
    );
  }

  // Standard Rectangular Official Institutional Vetting Stamp (Used across Ghana Basic & SHS)
  return (
    <div
      className={`relative inline-flex flex-col justify-between rounded-xl border-2 border-emerald-800 bg-emerald-50/50 p-3 select-none shadow-sm transition-transform hover:scale-[1.01] ${
        size === 'sm' ? 'w-64 text-xs' : size === 'lg' ? 'w-96 text-sm' : 'w-80 text-xs'
      }`}
      style={{
        boxShadow: 'inset 0 0 12px rgba(6, 78, 59, 0.08), 0 2px 6px rgba(0,0,0,0.04)'
      }}
    >
      {/* Corner security accents */}
      <div className="absolute top-1 left-1 w-2 h-2 border-t-2 border-l-2 border-emerald-800" />
      <div className="absolute top-1 right-1 w-2 h-2 border-t-2 border-r-2 border-emerald-800" />
      <div className="absolute bottom-1 left-1 w-2 h-2 border-b-2 border-l-2 border-emerald-800" />
      <div className="absolute bottom-1 right-1 w-2 h-2 border-b-2 border-r-2 border-emerald-800" />

      {/* Header Banner */}
      <div className="flex items-center justify-between border-b border-emerald-800/30 pb-1.5">
        <div className="flex items-center gap-1.5">
          <div className="w-5 h-5 rounded-full bg-emerald-800 text-white flex items-center justify-center">
            <CheckCircle2 size={12} />
          </div>
          <div>
            <span className="font-black tracking-wider text-[10px] text-emerald-950 uppercase block">
              GHANA EDUCATION SERVICE
            </span>
            <span className="text-[8px] text-emerald-700 font-bold uppercase tracking-widest block">
              OFFICIAL DIGITAL VETTING STAMP
            </span>
          </div>
        </div>
        <span className="px-1.5 py-0.5 bg-emerald-800 text-white font-black text-[9px] uppercase tracking-wider rounded">
          {isApproved ? 'APPROVED' : 'REVIEWED'}
        </span>
      </div>

      {/* Body: School & District */}
      <div className="py-2 space-y-0.5">
        <div className="font-extrabold text-slate-900 uppercase tracking-tight truncate text-[11px]">
          {config.schoolName}
        </div>
        <div className="text-[9.5px] text-slate-600 truncate">
          {config.district}
        </div>
      </div>

      {/* Signature & Endorsement Footer */}
      <div className="pt-1.5 border-t border-dashed border-emerald-800/40 flex items-center justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="text-[8px] uppercase tracking-wider text-slate-500 font-bold">
            Vetted & Endorsed By:
          </div>
          {config.signatureDataUrl ? (
            <img src={config.signatureDataUrl} alt="Signature" className="h-6 w-auto object-contain my-0.5" />
          ) : (
            <div className="font-serif italic font-black text-slate-900 truncate text-[12px]">
              {config.headteacherName}
            </div>
          )}
          <div className="text-[8.5px] text-emerald-900 font-semibold truncate">
            {config.designation}
          </div>
        </div>

        <div className="text-right shrink-0">
          <div className="text-[8px] uppercase tracking-wider text-slate-500 font-bold">
            Date Endorsed:
          </div>
          <div className="font-mono text-[10px] font-bold text-slate-900">
            {formattedDate}
          </div>
          <div className="text-[7.5px] font-mono text-emerald-800 font-bold">
            {config.serialCode || 'GES-VET-SECURE'}
          </div>
        </div>
      </div>
    </div>
  );
};

interface SignaturePadProps {
  onSave: (dataUrl: string) => void;
  onCancel: () => void;
}

export const SignaturePad: React.FC<SignaturePadProps> = ({ onSave, onCancel }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasContent, setHasContent] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#064e3b'; // Deep emerald ink
  }, []);

  const getPos = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    if ('touches' in e && e.touches.length > 0) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top
      };
    } else if ('clientX' in e) {
      return {
        x: (e as React.MouseEvent).clientX - rect.left,
        y: (e as React.MouseEvent).clientY - rect.top
      };
    }
    return { x: 0, y: 0 };
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const { x, y } = getPos(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const { x, y } = getPos(e);
    ctx.lineTo(x, y);
    ctx.stroke();
    setHasContent(true);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasContent(false);
  };

  const handleApply = () => {
    const canvas = canvasRef.current;
    if (!canvas || !hasContent) return;
    const dataUrl = canvas.toDataURL('image/png');
    onSave(dataUrl);
  };

  return (
    <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xl max-w-sm w-full space-y-3">
      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
        <div className="flex items-center gap-1.5">
          <PenTool size={16} className="text-emerald-700" />
          <h4 className="font-black text-slate-900 text-sm">Draw Digital Signature</h4>
        </div>
        <button
          onClick={handleClear}
          className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1"
        >
          <RotateCcw size={12} />
          Clear
        </button>
      </div>

      <div className="relative border-2 border-dashed border-emerald-300 rounded-xl bg-slate-50 overflow-hidden touch-none">
        <canvas
          ref={canvasRef}
          width={320}
          height={120}
          className="w-full h-[120px] cursor-crosshair"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
        />
        {!hasContent && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-xs text-slate-400 font-medium">
            Sign here with your finger or mouse...
          </div>
        )}
      </div>

      <div className="flex items-center justify-end gap-2 pt-1">
        <button
          onClick={onCancel}
          className="px-3 py-1.5 text-xs font-bold text-slate-600 hover:text-slate-800 rounded-lg"
        >
          Cancel
        </button>
        <button
          onClick={handleApply}
          disabled={!hasContent}
          className="px-4 py-1.5 text-xs font-bold bg-emerald-700 text-white rounded-lg disabled:opacity-50 hover:bg-emerald-800 shadow-sm"
        >
          Save Signature
        </button>
      </div>
    </div>
  );
};
