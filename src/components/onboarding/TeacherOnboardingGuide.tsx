import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  GraduationCap, 
  MapPin, 
  BookOpen, 
  ChevronRight, 
  ChevronLeft,
  Sparkles, 
  School, 
  User as UserIcon, 
  ShieldCheck, 
  Zap, 
  X, 
  FileText, 
  Calendar, 
  PenTool, 
  Award, 
  CheckCircle2, 
  ArrowRight,
  HelpCircle,
  Laptop
} from 'lucide-react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../contexts/AuthContext';
import { subjects, levels, GHANA_REGIONS } from '../../constants';
import { cn } from '../../lib/utils';
import { SearchableDropdown } from '../ui/SearchableDropdown';
import { toast } from 'react-hot-toast';
import { Level } from '../../types';
import { Logo } from '../common/Logo';

interface TeacherOnboardingGuideProps {
  isOpen?: boolean;
  onClose?: () => void;
  forceOpen?: boolean;
}

export const TeacherOnboardingGuide = ({ isOpen: controlledIsOpen, onClose, forceOpen = false }: TeacherOnboardingGuideProps) => {
  const { user, profile, completeOnboardingTour, dismissOnboardingTour } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [savingProfile, setSavingProfile] = useState(false);
  const [internalIsOpen, setInternalIsOpen] = useState(false);

  // Check if tour should show automatically or via event
  useEffect(() => {
    const handleOpenEvent = () => {
      setStep(1);
      setInternalIsOpen(true);
    };
    window.addEventListener('open-teachsmart-tour', handleOpenEvent);

    if (forceOpen) {
      setInternalIsOpen(true);
      return () => window.removeEventListener('open-teachsmart-tour', handleOpenEvent);
    }

    if (!user) return () => window.removeEventListener('open-teachsmart-tour', handleOpenEvent);

    // Check if user already saw or dismissed the tour
    const localSeen = localStorage.getItem(`teachsmart_tour_seen_${user.uid}`) === 'true';
    const profileSeen = profile?.hasSeenOnboardingTour === true || profile?.onboardingTourDismissed === true;
    const termsAccepted = profile?.acceptedTerms === true || localStorage.getItem(`teachsmart_terms_accepted_${user.uid}`) === 'true';

    if (!termsAccepted) {
      // Must accept terms and conditions first
      return () => window.removeEventListener('open-teachsmart-tour', handleOpenEvent);
    }

    if (!localSeen && !profileSeen) {
      // Auto-launch for new accounts after a slight delay
      const timer = setTimeout(() => {
        setInternalIsOpen(true);
      }, 600);
      return () => {
        clearTimeout(timer);
        window.removeEventListener('open-teachsmart-tour', handleOpenEvent);
      };
    }

    return () => window.removeEventListener('open-teachsmart-tour', handleOpenEvent);
  }, [user, profile, forceOpen]);

  const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;

  const [formData, setFormData] = useState({
    displayName: profile?.displayName || user?.displayName || '',
    school: profile?.school || '',
    region: profile?.region || 'Greater Accra',
    town: profile?.town || '',
    mainSubject: profile?.subjectsTaught?.[0] || '',
    level: (profile?.level as Level) || 'JHS',
  });

  useEffect(() => {
    if (profile) {
      setFormData(prev => ({
        ...prev,
        displayName: profile.displayName || user?.displayName || prev.displayName,
        school: profile.school || prev.school,
        region: profile.region || prev.region,
        town: profile.town || prev.town,
        mainSubject: profile.subjectsTaught?.[0] || prev.mainSubject,
        level: (profile.level as Level) || prev.level,
      }));
    }
  }, [profile, user]);

  const handleClose = async () => {
    setInternalIsOpen(false);
    if (onClose) {
      onClose();
    }
    await dismissOnboardingTour();
  };

  const handleSaveProfileAndContinue = async () => {
    setSavingProfile(true);
    try {
      const updateData: any = {
        displayName: formData.displayName.trim() || profile?.displayName || 'Teacher',
        school: formData.school.trim(),
        region: formData.region,
        town: formData.town.trim(),
        level: formData.level,
        subjectsTaught: formData.mainSubject ? [formData.mainSubject] : [],
        profileCompleted: Boolean(formData.school.trim()),
      };

      await completeOnboardingTour(updateData);
      toast.success("Profile details saved! You can update them anytime in settings.", {
        icon: '🇬🇭',
        duration: 4000
      });
      setStep(4); // Move to completion step
    } catch (error) {
      console.error("Profile save error:", error);
      toast.error("Failed to save profile. You can still set it up later!");
      setStep(4);
    } finally {
      setSavingProfile(false);
    }
  };

  const handleSkipProfile = async () => {
    await completeOnboardingTour();
    setStep(4);
  };

  const handleFinishTour = async (destination?: string) => {
    setInternalIsOpen(false);
    if (onClose) {
      onClose();
    }
    await completeOnboardingTour();
    toast.success("Welcome to TeachSmartGH! Your lesson workspace is ready.", {
      icon: '🚀'
    });
    if (destination) {
      navigate(destination);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md overflow-y-auto">
        <motion.div 
          initial={{ opacity: 0, scale: 0.94, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 15 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl border border-slate-100 dark:border-slate-800 max-w-2xl w-full overflow-hidden relative my-6"
        >
          {/* Header Progress & Close */}
          <div className="p-6 pb-2 flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-100 dark:border-emerald-900/40">
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-700 dark:text-emerald-400">
                  Step {step} of 4
                </span>
              </div>
              <span className="text-xs font-bold text-slate-400">|</span>
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
                {step === 1 && "Welcome to TeachSmartGH"}
                {step === 2 && "Core Teaching Tools"}
                {step === 3 && "Optional Profile Setup"}
                {step === 4 && "Ready to Start"}
              </span>
            </div>

            <button 
              onClick={handleClose}
              className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all"
              title="Skip & Close Tour"
            >
              <X size={18} />
            </button>
          </div>

          {/* Step Progress Bar */}
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-1">
            <motion.div 
              className="h-full bg-emerald-deep"
              initial={{ width: '25%' }}
              animate={{ width: `${(step / 4) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>

          <div className="p-6 md:p-10 max-h-[80vh] overflow-y-auto">
            {/* STEP 1: WELCOME & VALUE PROPOSITION */}
            {step === 1 && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div className="text-center space-y-3">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-deep/10 text-emerald-deep rounded-3xl mb-2">
                    <GraduationCap size={44} className="text-emerald-deep" />
                  </div>
                  <div className="inline-block px-3 py-1 bg-ghana-gold/20 text-emerald-950 rounded-lg text-[9px] font-black uppercase tracking-widest">
                    A Catalyst Creative Brand 🇬🇭
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                    Welcome to TeachSmart<span className="text-[#FCD116]">GH</span>
                  </h2>
                  <p className="text-slate-600 dark:text-slate-300 text-sm font-medium max-w-md mx-auto leading-relaxed">
                    AI-Powered Teaching. Smarter Tomorrow. Specifically engineered for Ghanaian teachers and 100% calibrated to the GES NaCCA Standards-Based & Common Core curricula.
                  </p>
                </div>

                {/* 3 Core Highlights */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-800 text-center space-y-2">
                    <div className="w-9 h-9 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-400 rounded-xl flex items-center justify-center mx-auto">
                      <Zap size={18} />
                    </div>
                    <h4 className="font-black text-xs text-slate-900 dark:text-white">Save 10+ Hours</h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                      Automate lesson plans & schemes in seconds.
                    </p>
                  </div>

                  <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-800 text-center space-y-2">
                    <div className="w-9 h-9 bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-400 rounded-xl flex items-center justify-center mx-auto">
                      <ShieldCheck size={18} />
                    </div>
                    <h4 className="font-black text-xs text-slate-900 dark:text-white">NaCCA Aligned</h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                      Exact indicator codes and 3-phase lesson phases.
                    </p>
                  </div>

                  <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-800 text-center space-y-2">
                    <div className="w-9 h-9 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-400 rounded-xl flex items-center justify-center mx-auto">
                      <FileText size={18} />
                    </div>
                    <h4 className="font-black text-xs text-slate-900 dark:text-white">Print-Ready PDF</h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                      Export polished docs for headteachers & SIS inspection.
                    </p>
                  </div>
                </div>

                {/* Footer Navigation */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                  <button 
                    onClick={handleClose}
                    className="text-xs font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 uppercase tracking-wider px-2 py-1"
                  >
                    Skip Tour
                  </button>
                  <button 
                    onClick={() => setStep(2)}
                    className="px-6 py-3.5 bg-slate-900 hover:bg-black text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-slate-900/10 transition-all"
                  >
                    <span>Discover Tools</span>
                    <ChevronRight size={16} />
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 2: CORE TOOLS SHOWCASE */}
            {step === 2 && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div className="text-center space-y-2">
                  <span className="px-3 py-1 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 text-[10px] font-black uppercase tracking-widest rounded-lg">
                    Classroom Powerhouse
                  </span>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                    What You Can Create with TeachSmartGH
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium max-w-md mx-auto">
                    All tools are pre-loaded with approved GES indicators, BSTEM guides, and custom Ghanaian teaching prompts.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="p-4 bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 rounded-2xl flex items-start gap-3">
                    <div className="p-2.5 bg-emerald-600 text-white rounded-xl shrink-0 mt-0.5">
                      <FileText size={18} />
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-slate-900 dark:text-white">Lesson Plan Generator</h4>
                      <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-1 leading-snug">
                        Phase 1 Starter, Phase 2 Main/Exemplar, Phase 3 Reflection, TLRs, and Core Competencies.
                      </p>
                    </div>
                  </div>

                  <div className="p-4 bg-amber-50/60 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/30 rounded-2xl flex items-start gap-3">
                    <div className="p-2.5 bg-ghana-gold text-slate-950 rounded-xl shrink-0 mt-0.5">
                      <Calendar size={18} />
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-slate-900 dark:text-white">Scheme of Learning</h4>
                      <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-1 leading-snug">
                        12-week comprehensive progression matrix formatted with NaCCA standards, weeks, and references.
                      </p>
                    </div>
                  </div>

                  <div className="p-4 bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl flex items-start gap-3">
                    <div className="p-2.5 bg-slate-900 text-white rounded-xl shrink-0 mt-0.5">
                      <PenTool size={18} />
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-slate-900 dark:text-white">Exams & Assessments</h4>
                      <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-1 leading-snug">
                        BECE/WASSCE styled Section A Objectives and Section B Theory + complete step-by-step marking scheme.
                      </p>
                    </div>
                  </div>

                  <div className="p-4 bg-indigo-50/60 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/30 rounded-2xl flex items-start gap-3">
                    <div className="p-2.5 bg-indigo-600 text-white rounded-xl shrink-0 mt-0.5">
                      <Sparkles size={18} />
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-slate-900 dark:text-white">AI Tutor & Notes</h4>
                      <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-1 leading-snug">
                        Student-friendly lesson notes, differentiated tasks for slow/fast learners, and BSTEM practicals.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Footer Navigation */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                  <button 
                    onClick={() => setStep(1)}
                    className="px-4 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5"
                  >
                    <ChevronLeft size={16} />
                    Back
                  </button>
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={handleClose}
                      className="text-xs font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 uppercase tracking-wider px-2 py-1"
                    >
                      Skip Tour
                    </button>
                    <button 
                      onClick={() => setStep(3)}
                      className="px-6 py-3.5 bg-slate-900 hover:bg-black text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-slate-900/10 transition-all"
                    >
                      <span>Profile Setup (Optional)</span>
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 3: OPTIONAL PROFILE SETUP */}
            {step === 3 && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div className="text-center space-y-2">
                  <div className="inline-flex items-center justify-center w-14 h-14 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 rounded-2xl mb-1">
                    <School size={28} />
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                      Personalize Your Workspace
                    </h3>
                    <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300 text-[9px] font-black uppercase tracking-wider rounded-md">
                      Optional
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium max-w-md mx-auto leading-relaxed">
                    Setting your school and subject lets TeachSmartGH automatically brand your lesson notes, schemes, and exam papers with your school header. You can fill this now or anytime in Profile Settings!
                  </p>
                </div>

                <div className="space-y-4 bg-slate-50 dark:bg-slate-800/40 p-5 rounded-2xl border border-slate-100 dark:border-slate-800">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Teacher Full Name</label>
                      <input 
                        type="text"
                        value={formData.displayName}
                        onChange={(e) => setFormData({...formData, displayName: e.target.value})}
                        placeholder="e.g. Kwesi Mensah"
                        className="w-full p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-deep outline-none transition-all font-bold text-xs text-slate-700 dark:text-slate-200"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">School Name (Optional)</label>
                      <input 
                        type="text"
                        value={formData.school}
                        onChange={(e) => setFormData({...formData, school: e.target.value})}
                        placeholder="e.g. Presbyterian Basic School"
                        className="w-full p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-deep outline-none transition-all font-bold text-xs text-slate-700 dark:text-slate-200"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Teaching Level</label>
                      <select 
                        value={formData.level}
                        onChange={(e) => setFormData({...formData, level: e.target.value as Level})}
                        className="w-full p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-deep outline-none transition-all font-bold text-xs text-slate-700 dark:text-slate-200"
                      >
                        {levels.map(l => (
                          <option key={l} value={l}>{l}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1.5 sm:col-span-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Main Subject (Optional)</label>
                      <SearchableDropdown
                        value={formData.mainSubject}
                        options={subjects.slice().sort((a,b) => a.localeCompare(b))}
                        placeholder="Select primary subject"
                        onChange={(val) => setFormData({...formData, mainSubject: val})}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Region</label>
                      <select 
                        value={formData.region}
                        onChange={(e) => setFormData({...formData, region: e.target.value})}
                        className="w-full p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-deep outline-none transition-all font-bold text-xs text-slate-700 dark:text-slate-200"
                      >
                        {GHANA_REGIONS.map(r => (
                          <option key={r} value={r}>{r}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Town / City</label>
                      <input 
                        type="text"
                        value={formData.town}
                        onChange={(e) => setFormData({...formData, town: e.target.value})}
                        placeholder="e.g. Kumasi, Takoradi"
                        className="w-full p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-deep outline-none transition-all font-bold text-xs text-slate-700 dark:text-slate-200"
                      />
                    </div>
                  </div>
                </div>

                {/* Footer Navigation */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <button 
                    onClick={() => setStep(2)}
                    className="w-full sm:w-auto px-4 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5"
                  >
                    <ChevronLeft size={16} />
                    Back
                  </button>
                  
                  <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                    <button 
                      onClick={handleSkipProfile}
                      className="w-full sm:w-auto px-4 py-3 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 font-bold text-xs uppercase tracking-wider transition-all"
                    >
                      Skip for Now (I'll do it later)
                    </button>
                    <button 
                      onClick={handleSaveProfileAndContinue}
                      disabled={savingProfile}
                      className="w-full sm:w-auto px-6 py-3.5 bg-emerald-deep hover:bg-emerald-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/20 transition-all"
                    >
                      {savingProfile ? "Saving..." : "Save & Continue"}
                      <CheckCircle2 size={16} />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 4: CELEBRATION & FAST LAUNCH */}
            {step === 4 && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-6 text-center py-2"
              >
                <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 rounded-3xl flex items-center justify-center mx-auto shadow-inner">
                  <Sparkles size={40} className="animate-bounce" />
                </div>

                <div className="space-y-2">
                  <span className="px-3 py-1 bg-ghana-gold/20 text-emerald-950 dark:text-ghana-gold text-[10px] font-black uppercase tracking-widest rounded-lg">
                    You're All Set! 🇬🇭
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                    Your Teaching Assistant Is Ready
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium max-w-md mx-auto leading-relaxed">
                    You have active 3-day full access to generate unlimited NaCCA lesson plans, termly schemes, exam questions, and consult the AI Teaching Tutor.
                  </p>
                </div>

                {/* Quick Launch Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-left">
                  <button 
                    onClick={() => handleFinishTour('/lessons')}
                    className="p-4 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100/80 dark:hover:bg-emerald-900/50 border border-emerald-100 dark:border-emerald-800 rounded-2xl flex items-center justify-between group transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-emerald-600 text-white rounded-xl">
                        <FileText size={18} />
                      </div>
                      <div>
                        <h4 className="text-xs font-black text-slate-900 dark:text-white">Create Lesson Plan</h4>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400">Starter, Main & Reflection</p>
                      </div>
                    </div>
                    <ArrowRight size={16} className="text-emerald-600 group-hover:translate-x-1 transition-transform" />
                  </button>

                  <button 
                    onClick={() => handleFinishTour('/schemes')}
                    className="p-4 bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100/80 dark:hover:bg-amber-900/50 border border-amber-100 dark:border-amber-800 rounded-2xl flex items-center justify-between group transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-ghana-gold text-slate-900 rounded-xl">
                        <Calendar size={18} />
                      </div>
                      <div>
                        <h4 className="text-xs font-black text-slate-900 dark:text-white">Scheme of Learning</h4>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400">12-Week Term Plan</p>
                      </div>
                    </div>
                    <ArrowRight size={16} className="text-amber-600 group-hover:translate-x-1 transition-transform" />
                  </button>

                  <button 
                    onClick={() => handleFinishTour('/exams')}
                    className="p-4 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-2xl flex items-center justify-between group transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-slate-900 text-white rounded-xl">
                        <PenTool size={18} />
                      </div>
                      <div>
                        <h4 className="text-xs font-black text-slate-900 dark:text-white">Create Exam Paper</h4>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400">Section A & B + Scheme</p>
                      </div>
                    </div>
                    <ArrowRight size={16} className="text-slate-700 dark:text-slate-300 group-hover:translate-x-1 transition-transform" />
                  </button>

                  <button 
                    onClick={() => handleFinishTour('/ai')}
                    className="p-4 bg-indigo-50 dark:bg-indigo-950/40 hover:bg-indigo-100/80 dark:hover:bg-indigo-900/50 border border-indigo-100 dark:border-indigo-800 rounded-2xl flex items-center justify-between group transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-indigo-600 text-white rounded-xl">
                        <Sparkles size={18} />
                      </div>
                      <div>
                        <h4 className="text-xs font-black text-slate-900 dark:text-white">Consult AI Tutor</h4>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400">Pedagogical Advice</p>
                      </div>
                    </div>
                    <ArrowRight size={16} className="text-indigo-600 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>

                {/* Final Dashboard Entry */}
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                  <button 
                    onClick={() => handleFinishTour('/')}
                    className="w-full py-4 bg-slate-900 hover:bg-black text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl shadow-slate-900/20 transition-all"
                  >
                    <span>Enter My Dashboard</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
