import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ShieldCheck, BookOpen, Lock, Globe, FileText, CheckCircle } from 'lucide-react';

interface ComplianceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ComplianceModal = ({ isOpen, onClose }: ComplianceModalProps) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white w-full max-w-3xl max-h-[85vh] rounded-[3rem] shadow-2xl overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-900 text-white shrink-0">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-ghana-gold/20 rounded-2xl flex items-center justify-center text-ghana-gold">
                <ShieldCheck size={28} />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-ghana-gold opacity-80">Platform Registry</p>
                <h2 className="text-xl font-black">Regulatory & Policy Compliance</h2>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-10 space-y-10 custom-scrollbar">
            {/* Ghana NaCCA Section */}
            <section className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                  <BookOpen size={20} />
                </div>
                <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Educational Standards (NaCCA)</h3>
              </div>
              <p className="text-slate-600 text-sm leading-relaxed">
                TeachSmart Ghana is engineered to align strictly with the <strong>Standard-Based Curriculum (SBC)</strong> framework provided by the National Council for Curriculum and Assessment (NaCCA). 
              </p>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  'B1-B10 Indicators Alignment',
                  'Core Competency Integration',
                  'Common Core Program (CCP) Support',
                  'Inclusive Education Guidelines'
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-xs font-bold text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <CheckCircle size={14} className="text-emerald-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </section>

            {/* Data Privacy Section */}
            <section className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                  <Lock size={20} />
                </div>
                <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Data Privacy & Security</h3>
              </div>
              <p className="text-slate-600 text-sm leading-relaxed">
                We adhere to the <strong>Ghana Data Protection Act (Act 843)</strong> and international safety standards (GDPR). Your professional data and learner insights are protected with industry-grade encryption.
              </p>
              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <span>Provision</span>
                    <span>Status</span>
                  </div>
                  {[
                    { label: 'Cloud Storage Encryption', status: 'AES-256 Active' },
                    { label: 'Teacher Data Ownership', status: 'User Owned' },
                    { label: 'Anonymous AI Processing', status: 'Enabled' },
                    { label: 'Ghanaian Node Latency', status: 'Optimized' }
                  ].map((row) => (
                    <div key={row.label} className="flex justify-between items-center border-b border-slate-200/50 pb-2 last:border-0 last:pb-0">
                      <span className="text-xs font-bold text-slate-700">{row.label}</span>
                      <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-black uppercase">
                        {row.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* AI Usage Policy */}
            <section className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                  < Globe size={20} />
                </div>
                <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">AI Content Accountability</h3>
              </div>
              <p className="text-slate-600 text-sm leading-relaxed italic">
                "While TeachSmart AI provides highly accurate curriculum alignment, the classroom teacher remains the final authority on instructional fidelity and local adaptation."
              </p>
              <div className="bg-amber-50 border border-amber-100 p-6 rounded-2xl">
                 <p className="text-amber-800 text-xs leading-relaxed">
                  <strong>Verification Policy:</strong> Users are advised to periodically compare AI-generated lesson plans and notes with the physical NaCCA teacher handbooks to ensure specific term-by-term changes are captured during curriculum update cycles.
                 </p>
              </div>
            </section>

            {/* Regulatory Footer */}
            <div className="pt-6 border-t border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
               <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Registry ID</p>
                  <p className="text-xs font-black text-slate-900">TSG-NA-2024-COMPLIANT</p>
               </div>
               <div className="flex items-center gap-3">
                 <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center text-white font-black text-[10px]">GH</div>
                 <p className="text-[10px] font-bold text-slate-500 max-w-[200px]">Empowering Ghanaian Teachers with Policy-Aligned Technology.</p>
               </div>
            </div>
          </div>

          <div className="p-6 bg-slate-50 border-t border-slate-100 shrink-0">
            <button
              onClick={onClose}
              className="w-full py-4 bg-slate-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-slate-800 transition-colors shadow-xl shadow-slate-900/20"
            >
              I Understand & Agree
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
