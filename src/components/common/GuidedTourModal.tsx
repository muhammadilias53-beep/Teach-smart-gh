import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  FileText, 
  Calendar, 
  BookOpen, 
  PenTool, 
  MessageSquare, 
  User, 
  ArrowRight, 
  ChevronRight, 
  ChevronLeft, 
  CheckCircle2, 
  Zap, 
  GraduationCap, 
  ShieldCheck, 
  ExternalLink,
  X,
  School,
  MapPin,
  HelpCircle
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Logo } from '../common/Logo';
import { cn } from '../../lib/utils';
import { toast } from 'react-hot-toast';

interface GuidedTourModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenProfileSetup?: () => void;
}

interface TourStep {
  badge: string;
  title: string;
  description: string;
  icon: any;
  color: string;
  bgColor: string;
  actionText?: string;
  actionLink?: string;
  features: { title: string; subtitle: string }[];
  tip: string;
}

export const GuidedTourModal: React.FC<GuidedTourModalProps> = ({
  isOpen,
  onClose,
  onOpenProfileSetup
}) => {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);

  const steps: TourStep[] = [
    {
      badge: "Welcome to TeachSmartGH",
      title: "AI-Powered Teaching for Ghana",
      description: "Everything you need to plan, teach, and assess in full alignment with the NaCCA Standard-Based Curriculum.",
      icon: Sparkles,
      color: "text-ghana-gold",
      bgColor: "bg-ghana-gold/10",
      features: [
        { title: "Standard-Based Curriculum", subtitle: "Official NaCCA strands, sub-strands, and indicator codes" },
        { title: "Local Context & TLRs", subtitle: "Teaching resources adapted for Ghanaian classrooms" },
        { title: "Offline IndexedDB Cache", subtitle: "Generate, review, and export lesson content anywhere" }
      ],
      tip: "You can use TeachSmartGH right away! Profile setup is completely optional and can be completed anytime."
    },
    {
      badge: "Curriculum & Planning",
      title: "Lesson Plans, Notes & Schemes",
      description: "Produce comprehensive teaching documentation in seconds instead of spending entire weekends.",
      icon: FileText,
      color: "text-emerald-500",
      bgColor: "bg-emerald-500/10",
      actionText: "Open Lesson Planner",
      actionLink: "/lessons",
      features: [
        { title: "3-Phase Lesson Plans", subtitle: "Phase 1: Starter, Phase 2: Main activities, Phase 3: Plenary/Reflection" },
        { title: "Termly Schemes of Work", subtitle: "Full 12-week distribution with core competencies & assessments" },
        { title: "Comprehensive Lesson Notes", subtitle: "Learner-centered notes with keyword glossaries & summary points" }
      ],
      tip: "Export your generated lesson plans and schemes directly to print-ready PDF or Word format."
    },
    {
      badge: "Assessment & Classroom AI",
      title: "Exams, Tests & 24/7 AI Tutor",
      description: "Create WAEC & BECE-standard tests with instant marking schemes, or consult your pedagogical assistant.",
      icon: PenTool,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
      actionText: "Try Exam Generator",
      actionLink: "/exams",
      features: [
        { title: "WAEC-Style Examination Papers", subtitle: "Multiple choice, theory, case studies & matching tables" },
        { title: "Automatic Marking Guides", subtitle: "Step-by-step point allocations and model answers" },
        { title: "NaCCA Teaching Assistant", subtitle: "Pedagogical advice, differentiated strategies, and classroom tips" }
      ],
      tip: "Use the floating AI Assistant button at the bottom-right of your screen from any page."
    },
    {
      badge: "Profile & Personalization",
      title: "Optional Profile Customization",
      description: "Add your school name, district, subject, and grade level so every document automatically includes your official headers.",
      icon: User,
      color: "text-rose-500",
      bgColor: "bg-rose-500/10",
      actionText: "Setup Profile Now",
      actionLink: "/profile",
      features: [
        { title: "Header Auto-Fill", subtitle: "Your school, district, and teacher name on all PDFs" },
        { title: "Subject Presets", subtitle: "Tailored lesson recommendations based on what you teach" },
        { title: "Do It Anytime", subtitle: "Skip for now or update in Settings whenever you're ready" }
      ],
      tip: "You're all set! Click 'Start Exploring' to jump straight into your dashboard."
    }
  ];

  if (!isOpen) return null;

  const current = steps[currentStep];
  const isLast = currentStep === steps.length - 1;

  const handleFinish = () => {
    onClose();
  };

  const handleActionClick = (link?: string) => {
    onClose();
    if (link) {
      navigate(link);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-[2.5rem] shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden my-auto"
        >
          {/* Header */}
          <div className="p-6 md:p-8 bg-slate-900 text-white relative overflow-hidden flex items-center justify-between">
            <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
              <Logo iconOnly size="lg" className="w-32 h-32" />
            </div>

            <div className="flex items-center gap-3 relative z-10">
              <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center text-ghana-gold">
                <current.icon size={22} />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-ghana-gold">
                  {current.badge}
                </span>
                <p className="text-xs text-slate-400 font-bold">
                  Step {currentStep + 1} of {steps.length}
                </p>
              </div>
            </div>

            <button
              onClick={handleFinish}
              className="relative z-10 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition-colors text-xs font-bold"
              title="Close tour"
            >
              <X size={18} />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 md:p-8 space-y-6">
            {/* Step Content */}
            <div className="space-y-3">
              <h3 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                {current.title}
              </h3>
              <p className="text-slate-600 dark:text-slate-300 text-sm md:text-base leading-relaxed">
                {current.description}
              </p>
            </div>

            {/* Feature List */}
            <div className="space-y-3 pt-2">
              {current.features.map((feat, idx) => (
                <div 
                  key={idx}
                  className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800"
                >
                  <div className="mt-0.5 p-1 rounded-lg bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 shrink-0">
                    <CheckCircle2 size={16} />
                  </div>
                  <div>
                    <h4 className="text-xs md:text-sm font-bold text-slate-800 dark:text-slate-100">
                      {feat.title}
                    </h4>
                    <p className="text-[11px] md:text-xs text-slate-500 dark:text-slate-400">
                      {feat.subtitle}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Pro Tip Callout */}
            <div className="p-4 rounded-2xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-900/40 flex items-start gap-3">
              <Zap size={18} className="text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <p className="text-xs text-amber-900 dark:text-amber-200 font-medium leading-relaxed">
                <strong className="font-bold">Tip: </strong>{current.tip}
              </p>
            </div>
          </div>

          {/* Footer Controls */}
          <div className="p-6 md:p-8 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Step Indicators */}
            <div className="flex items-center gap-1.5 order-2 sm:order-1">
              {steps.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentStep(i)}
                  className={cn(
                    "h-2 rounded-full transition-all duration-300 cursor-pointer",
                    currentStep === i ? "w-8 bg-emerald-600" : "w-2 bg-slate-300 dark:bg-slate-700 hover:bg-slate-400"
                  )}
                  aria-label={`Go to step ${i + 1}`}
                />
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 w-full sm:w-auto order-1 sm:order-2">
              {currentStep > 0 && (
                <button
                  onClick={() => setCurrentStep(prev => prev - 1)}
                  className="px-4 py-3 rounded-2xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-700 transition-all flex items-center gap-1.5"
                >
                  <ChevronLeft size={16} />
                  Back
                </button>
              )}

              {current.actionLink && !isLast && (
                <button
                  onClick={() => handleActionClick(current.actionLink)}
                  className="hidden md:flex px-4 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 text-xs font-bold transition-all items-center gap-1.5"
                >
                  {current.actionText}
                  <ExternalLink size={14} />
                </button>
              )}

              {!isLast ? (
                <button
                  onClick={() => setCurrentStep(prev => prev + 1)}
                  className="flex-1 sm:flex-initial px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black uppercase tracking-wider transition-all shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2"
                >
                  Next
                  <ChevronRight size={16} />
                </button>
              ) : (
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => {
                      onClose();
                      navigate('/profile');
                    }}
                    className="px-4 py-3 rounded-2xl bg-white dark:bg-slate-800 text-slate-800 dark:text-white border border-slate-200 dark:border-slate-700 text-xs font-black uppercase tracking-wider hover:bg-slate-100 dark:hover:bg-slate-700 transition-all flex items-center gap-1.5"
                  >
                    <User size={14} />
                    Edit Profile
                  </button>
                  <button
                    onClick={handleFinish}
                    className="flex-1 sm:flex-initial px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black uppercase tracking-wider transition-all shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2"
                  >
                    Start Exploring
                    <ArrowRight size={16} />
                  </button>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
