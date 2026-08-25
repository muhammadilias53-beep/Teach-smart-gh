import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldCheck, 
  Sparkles, 
  BookOpen, 
  CheckCircle2, 
  AlertTriangle, 
  Download, 
  Check, 
  Scale, 
  Lock, 
  X, 
  Cpu
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-hot-toast';
import jsPDF from 'jspdf';

interface TermsAndConditionsModalProps {
  isOpen: boolean;
  onClose?: () => void;
  isMandatory?: boolean; // True when first-time login requires acceptance
}

export const TermsAndConditionsModal: React.FC<TermsAndConditionsModalProps> = ({
  isOpen,
  onClose,
  isMandatory = false
}) => {
  const { user, profile, acceptTermsAndConditions } = useAuth();
  const [activeTab, setActiveTab] = useState<'ai_ethics' | 'curriculum' | 'privacy' | 'general'>('ai_ethics');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreeResponsibleAi, setAgreeResponsibleAi] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const canAccept = agreeTerms && agreeResponsibleAi;

  const handleAccept = async () => {
    if (!canAccept) {
      toast.error('Please check both acknowledgment boxes to confirm your agreement.');
      return;
    }

    setIsSubmitting(true);
    try {
      await acceptTermsAndConditions('2026.1');
      toast.success('Welcome to TeachSmartGH! Your agreement has been recorded. 🇬🇭');
      if (onClose) {
        onClose();
      }
    } catch (err: any) {
      console.error('Failed to record terms acceptance:', err);
      toast.error('Could not save terms agreement. Please check your connection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownloadPDF = () => {
    try {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      // Header Brand
      doc.setFillColor(10, 25, 47); // Deep Navy
      doc.rect(0, 0, 210, 32, 'F');
      
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(16);
      doc.text('TeachSmartGH — Catalyst Creative', 14, 15);
      
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.text('Responsible AI Terms of Service & Ghanaian Educator Code of Conduct', 14, 22);
      doc.text('Official Policy Version: 2026.1 • Effective for all GES Classrooms', 14, 27);

      let yPos = 40;

      // Section 1: Responsible AI Principles
      doc.setTextColor(0, 107, 63); // Ghana Green
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.text('1. RESPONSIBLE USE OF AI-GENERATED EDUCATIONAL CONTENT', 14, yPos);
      yPos += 6;

      doc.setTextColor(40, 40, 40);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      const textSection1 = [
        '• Assistive Co-Pilot Role: TeachSmartGH utilizes advanced AI to accelerate and enhance instructional planning. AI outputs are assistive drafts and never replace professional Ghanaian teacher judgment.',
        '• Mandatory Verification: Teachers are required to review all generated lesson plans, schemes of learning, examination items, and assessment rubrics prior to classroom delivery.',
        '• NaCCA Curriculum Compliance: All generated lesson notes must strictly align with official National Council for Curriculum and Assessment (NaCCA) codes, indicators, and strands.',
        '• Ghanaian Cultural Authenticity: Content must reflect authentic Ghanaian cultural heritage, local language accuracy, and contextually realistic Teaching & Learning Resources (TLRs).'
      ];

      textSection1.forEach(line => {
        const split = doc.splitTextToSize(line, 180);
        doc.text(split, 14, yPos);
        yPos += split.length * 4.5;
      });

      yPos += 4;

      // Section 2: Privacy & Data Protection
      doc.setTextColor(0, 107, 63);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.text('2. STUDENT DATA PRIVACY & CLASSROOM PROTECTION', 14, yPos);
      yPos += 6;

      doc.setTextColor(40, 40, 40);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      const textSection2 = [
        '• Protection of Minors: Teachers must not input personally identifiable student information (e.g. student residential addresses, medical records, or sensitive disciplinary records) into AI generation prompts.',
        '• Inclusive 3-H Pedagogy: Lesson activities must uphold the Head, Heart, and Hand philosophy, fostering collaboration, critical thinking, and respectful classroom values.',
        '• Account Integrity: Teacher accounts are individualized and must not be shared or redistributed outside licensed educational contexts.'
      ];

      textSection2.forEach(line => {
        const split = doc.splitTextToSize(line, 180);
        doc.text(split, 14, yPos);
        yPos += split.length * 4.5;
      });

      yPos += 6;

      // Section 3: Educator Pledge
      doc.setTextColor(180, 83, 9); // Amber Gold
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.text('3. GHANAIAN TEACHER RESPONSIBLE AI PLEDGE', 14, yPos);
      yPos += 6;

      doc.setTextColor(50, 50, 50);
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(8.5);
      const pledge = '"As an educator in Ghana, I pledge to champion high pedagogical standards, verify all AI-generated curriculum resources against GES/NaCCA guidelines, and utilize TeachSmartGH ethically to empower my learners."';
      const splitPledge = doc.splitTextToSize(pledge, 180);
      doc.text(splitPledge, 14, yPos);
      yPos += splitPledge.length * 4.5;

      // Footer
      doc.setFontSize(8);
      doc.setTextColor(130, 130, 130);
      doc.setFont('helvetica', 'normal');
      doc.text(`Document downloaded on ${new Date().toLocaleDateString('en-GB')} by ${user?.email || 'Teacher'}. TeachSmartGH is a product of Catalyst Creative.`, 14, 285);

      doc.save('TeachSmartGH_Responsible_AI_Terms.pdf');
      toast.success('Terms & Responsible AI Policy downloaded as PDF 📄');
    } catch (e) {
      console.error(e);
      toast.error('Failed to export PDF.');
    }
  };

  return (
    <AnimatePresence>
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto"
        onClick={(e) => {
          // If mandatory, don't allow closing by clicking backdrop
          if (!isMandatory && onClose && e.target === e.currentTarget) {
            onClose();
          }
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="bg-white rounded-3xl sm:rounded-[2.5rem] shadow-2xl border border-slate-200 w-full max-w-3xl overflow-hidden flex flex-col max-h-[92vh] my-auto relative"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Top Decorative Header */}
          <div className="bg-slate-900 text-white p-5 sm:p-7 relative overflow-hidden shrink-0">
            {/* Subtle Ghana Color Accent Bar */}
            <div className="absolute top-0 left-0 right-0 h-1.5 flex">
              <div className="h-full flex-1 bg-ghana-red" />
              <div className="h-full flex-1 bg-ghana-gold" />
              <div className="h-full flex-1 bg-ghana-green" />
            </div>

            <div className="flex items-start justify-between gap-4 mt-1">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                  <ShieldCheck size={26} />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      Mandatory Policy • v2026.1
                    </span>
                    <span className="text-[10px] font-bold text-slate-400">
                      Catalyst Creative
                    </span>
                  </div>
                  <h2 className="text-lg sm:text-xl font-black tracking-tight text-white mt-1">
                    Terms of Service & Responsible AI Policy
                  </h2>
                  <p className="text-xs text-slate-300 font-medium">
                    Commitment to ethical, NaCCA-aligned, and secure teaching in Ghana 🇬🇭
                  </p>
                </div>
              </div>

              {!isMandatory && onClose && (
                <button
                  onClick={onClose}
                  className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition-colors shrink-0"
                  aria-label="Close modal"
                >
                  <X size={18} />
                </button>
              )}
            </div>

            {/* Core Priority Banner */}
            <div className="mt-4 p-3.5 rounded-2xl bg-gradient-to-r from-emerald-950/60 to-slate-900 border border-emerald-500/30 flex items-center gap-3">
              <Sparkles size={20} className="text-ghana-gold shrink-0 animate-pulse" />
              <p className="text-xs text-emerald-100 font-medium leading-relaxed">
                <strong className="text-white font-bold">Our Priority:</strong> Responsible, human-verified AI educational tools designed to elevate learning outcomes across Ghanaian basic, junior, and senior high schools.
              </p>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center gap-1.5 mt-4 pt-2 border-t border-white/10 overflow-x-auto no-scrollbar">
              {[
                { id: 'ai_ethics', label: '1. Responsible AI Code', icon: Cpu },
                { id: 'curriculum', label: '2. NaCCA Alignment', icon: BookOpen },
                { id: 'privacy', label: '3. Student Privacy', icon: Lock },
                { id: 'general', label: '4. Service License', icon: Scale },
              ].map(tab => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap shrink-0 flex items-center gap-1.5 transition-all ${
                      isActive 
                        ? 'bg-emerald-500 text-slate-950 shadow-md font-black' 
                        : 'text-slate-300 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <Icon size={14} />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Scrollable Terms Content */}
          <div 
            ref={scrollContainerRef}
            className="p-5 sm:p-7 overflow-y-auto flex-1 space-y-6 text-slate-700 bg-slate-50/50"
          >
            {activeTab === 'ai_ethics' && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4 text-xs sm:text-sm leading-relaxed"
              >
                <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl flex items-start gap-3 text-amber-900">
                  <AlertTriangle size={20} className="text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-black text-xs sm:text-sm text-amber-950 uppercase tracking-tight">
                      Educator Primacy & Non-Delegable Teacher Judgment
                    </h4>
                    <p className="mt-1 text-xs text-amber-800">
                      TeachSmartGH is an assistive co-pilot. Artificial intelligence outputs cannot replace your professional pedagogical discretion, classroom observation, or contextual understanding of your learners.
                    </p>
                  </div>
                </div>

                <div className="space-y-3 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
                  <h3 className="font-black text-slate-900 text-sm sm:text-base flex items-center gap-2">
                    <CheckCircle2 size={18} className="text-emerald-600" />
                    Key Principles for Responsible AI in the Classroom
                  </h3>

                  <ul className="space-y-2.5 text-slate-600 pl-2">
                    <li className="flex items-start gap-2">
                      <span className="font-bold text-slate-900">•</span>
                      <span><strong>Mandatory Pre-Teaching Review:</strong> You agree to examine and adapt all lesson plans, scheme indicators, exam questions, and marking schemes before using them with pupils or students.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-bold text-slate-900">•</span>
                      <span><strong>Truthfulness & Code Accuracy:</strong> You agree to verify that curriculum indicators (e.g., <code>B7.2.1.1.2</code>) match the official NaCCA syllabus for your specific subject and grade level.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-bold text-slate-900">•</span>
                      <span><strong>Fairness & Non-Bias:</strong> AI-generated questions and evaluations must remain fair, culturally inclusive, and free from stereotypes, supporting all learners regardless of gender, background, or learning speed.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-bold text-slate-900">•</span>
                      <span><strong>Local Context & Feasible TLRs:</strong> Generated Teaching & Learning Resources must be grounded in accessible, low-cost local Ghanaian materials (manila cards, bottle caps, local plants, household items).</span>
                    </li>
                  </ul>
                </div>
              </motion.div>
            )}

            {activeTab === 'curriculum' && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4 text-xs sm:text-sm leading-relaxed"
              >
                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
                  <h3 className="font-black text-slate-900 text-sm sm:text-base flex items-center gap-2">
                    <BookOpen size={18} className="text-emerald-600" />
                    National Council for Curriculum & Assessment (NaCCA) Alignment
                  </h3>
                  <p className="text-slate-600">
                    TeachSmartGH is intentionally built to uphold Ghana Education Service (GES) and NaCCA standards across Kindergarten (KG 1–2), Primary (Basic 1–6), Junior High (Basic 7–9), and Senior High School levels.
                  </p>

                  <div className="grid sm:grid-cols-2 gap-3 pt-2">
                    <div className="p-3 bg-emerald-50/70 border border-emerald-100 rounded-xl">
                      <h5 className="font-bold text-emerald-950 text-xs">Standard 3-Phase Structure</h5>
                      <p className="text-[11px] text-emerald-800 mt-1">Starter (Phase 1), Main Activity & 3-H Practice (Phase 2), Plenary & Reflection (Phase 3).</p>
                    </div>
                    <div className="p-3 bg-emerald-50/70 border border-emerald-100 rounded-xl">
                      <h5 className="font-bold text-emerald-950 text-xs">6 Core Competencies</h5>
                      <p className="text-[11px] text-emerald-800 mt-1">Critical Thinking (CP), Creativity (CI), Communication (CC), Cultural Identity (CG), Leadership (PL), Digital Literacy (DL).</p>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-500 pt-2 border-t border-slate-100">
                    In the event of official curriculum updates by NaCCA or the Ministry of Education, teachers can customize indicator codes directly or search the built-in Curriculum Database.
                  </p>
                </div>
              </motion.div>
            )}

            {activeTab === 'privacy' && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4 text-xs sm:text-sm leading-relaxed"
              >
                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
                  <h3 className="font-black text-slate-900 text-sm sm:text-base flex items-center gap-2">
                    <Lock size={18} className="text-emerald-600" />
                    Classroom Privacy & Data Safeguards
                  </h3>
                  <p className="text-slate-600">
                    We treat educator and student privacy with utmost gravity under Ghana's Data Protection Act, 2012 (Act 843).
                  </p>

                  <ul className="space-y-2 text-slate-600 pl-2">
                    <li className="flex items-start gap-2">
                      <span className="font-bold text-slate-900">•</span>
                      <span><strong>No Student PII in Prompts:</strong> Never include students' full names, phone numbers, home addresses, or confidential health records in AI generation prompts.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-bold text-slate-900">•</span>
                      <span><strong>Secure Offline Storage:</strong> Your generated documents and lesson drafts are cached locally on your device in our Offline Vault and encrypted during cloud backups.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-bold text-slate-900">•</span>
                      <span><strong>No Unauthorized Third-Party Selling:</strong> TeachSmartGH does not sell, rent, or distribute educator or school data to advertisers.</span>
                    </li>
                  </ul>
                </div>
              </motion.div>
            )}

            {activeTab === 'general' && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4 text-xs sm:text-sm leading-relaxed"
              >
                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
                  <h3 className="font-black text-slate-900 text-sm sm:text-base flex items-center gap-2">
                    <Scale size={18} className="text-emerald-600" />
                    Platform Licensing, Account Use & Fair Terms
                  </h3>

                  <ul className="space-y-2 text-slate-600 pl-2">
                    <li className="flex items-start gap-2">
                      <span className="font-bold text-slate-900">•</span>
                      <span><strong>Teacher Account Ownership:</strong> Each account is granted to an individual educator. You are responsible for safeguarding your login credentials.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-bold text-slate-900">•</span>
                      <span><strong>Content Ownership:</strong> You retain complete ownership and full pedagogical rights to all lesson plans, schemes, and exam papers generated and modified through TeachSmartGH.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-bold text-slate-900">•</span>
                      <span><strong>Fair Usage:</strong> Automated bot scraping or excessive abusive load on generation endpoints is prohibited to maintain high availability for all Ghanaian teachers.</span>
                    </li>
                  </ul>
                </div>
              </motion.div>
            )}
          </div>

          {/* Bottom Action & Mandatory Agreement Area */}
          <div className="p-5 sm:p-6 bg-white border-t border-slate-200 shrink-0 space-y-4 shadow-lg">
            {/* Acceptance Checkboxes */}
            <div className="space-y-2.5">
              <label className="flex items-start gap-3 cursor-pointer group select-none">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded text-emerald-600 border-slate-300 focus:ring-emerald-500 cursor-pointer shrink-0"
                />
                <span className="text-xs font-semibold text-slate-800 leading-snug group-hover:text-slate-950">
                  I have read and agree to the <strong>TeachSmartGH Terms of Service & Privacy Policy</strong>.
                </span>
              </label>

              <label className="flex items-start gap-3 cursor-pointer group select-none">
                <input
                  type="checkbox"
                  checked={agreeResponsibleAi}
                  onChange={(e) => setAgreeResponsibleAi(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded text-emerald-600 border-slate-300 focus:ring-emerald-500 cursor-pointer shrink-0"
                />
                <span className="text-xs font-semibold text-emerald-950 leading-snug group-hover:text-black">
                  <strong className="text-emerald-700 font-bold">Responsible AI Pledge:</strong> I commit to verifying all AI-generated content against official NaCCA curriculum standards, exercising professional teacher judgment, and protecting student privacy in the Ghanaian classroom.
                </span>
              </label>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={handleDownloadPDF}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-xs flex items-center justify-center gap-2 transition-colors shrink-0"
              >
                <Download size={14} />
                Download PDF Copy
              </button>

              <div className="flex items-center gap-2 flex-1 sm:justify-end">
                <button
                  type="button"
                  disabled={!canAccept || isSubmitting}
                  onClick={handleAccept}
                  className={`flex-1 sm:flex-initial px-6 py-3 rounded-xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md ${
                    canAccept && !isSubmitting
                      ? 'bg-[#006B3F] hover:bg-[#005230] text-white shadow-emerald-900/20 cursor-pointer scale-100 hover:scale-[1.02]'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed opacity-75'
                  }`}
                >
                  {isSubmitting ? (
                    <span>Recording Agreement...</span>
                  ) : (
                    <>
                      <Check size={16} />
                      <span>Accept & Continue to Platform</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {isMandatory && (
              <p className="text-[10px] text-center text-slate-400 font-medium">
                Mandatory one-time verification required for all newly authenticated Ghanaian teachers.
              </p>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
