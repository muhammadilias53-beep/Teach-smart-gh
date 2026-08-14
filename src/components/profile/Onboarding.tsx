import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  GraduationCap, 
  MapPin, 
  BookOpen, 
  ChevronRight, 
  Sparkles,
  School,
  User as UserIcon,
  ShieldCheck,
  Zap,
  ArrowRight,
  HelpCircle,
  X
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { subjects, levels, GHANA_REGIONS } from '../../constants';
import { cn } from '../../lib/utils';
import { SearchableDropdown } from '../ui/SearchableDropdown';
import { toast } from 'react-hot-toast';
import { Level, UserProfile } from '../../types';

interface OnboardingProps {
  onDismiss?: () => void;
  isModal?: boolean;
}

export const Onboarding: React.FC<OnboardingProps> = ({ onDismiss, isModal = false }) => {
  const { user, completeOnboarding } = useAuth();
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    displayName: user?.displayName || '',
    school: '',
    region: 'Greater Accra',
    town: '',
    mainSubject: '',
    level: 'JHS' as Level,
  });

  const handleSkip = async () => {
    try {
      // Mark onboarding as acknowledged/dismissed so user is not blocked
      await completeOnboarding({
        onboardingComplete: true
      });
      toast.success("Welcome to TeachSmartGH! You can set up your profile anytime in Settings.", {
        icon: '👋',
        duration: 4000
      });
      if (onDismiss) onDismiss();
    } catch (error) {
      console.warn("Skip error:", error);
      if (onDismiss) onDismiss();
    }
  };

  const handleComplete = async () => {
    setSubmitting(true);
    try {
      // Map mainSubject to the subjectsTaught array expected by the profile
      const updateData: Partial<UserProfile> = {
        displayName: formData.displayName || user?.displayName || 'Teacher',
        school: formData.school || 'Ghana Education Service',
        region: formData.region || 'Greater Accra',
        town: formData.town || 'Accra',
        level: formData.level || 'JHS',
        subjectsTaught: formData.mainSubject ? [formData.mainSubject] : [],
        onboardingComplete: true
      };
      
      await completeOnboarding(updateData);
      toast.success("Welcome aboard! Your profile details have been saved.", {
        icon: '🚀',
        duration: 5000
      });
      if (onDismiss) onDismiss();
    } catch (error) {
      console.error("Onboarding completion error:", error);
      toast.error("Failed to complete setup. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={cn(
      "min-h-screen flex flex-col items-center justify-center p-4",
      isModal ? "min-h-0 p-0" : "bg-slate-50 dark:bg-slate-950"
    )}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-xl w-full"
      >
        {/* Header skip option */}
        <div className="flex justify-between items-center mb-6 px-2">
          {/* Progress Dots */}
          <div className="flex items-center gap-2">
            {[1, 2, 3].map(i => (
              <div 
                key={i} 
                className={cn(
                  "h-1.5 rounded-full transition-all duration-500",
                  step === i ? "w-8 bg-emerald-600" : "w-2 bg-slate-300 dark:bg-slate-700"
                )}
              />
            ))}
          </div>

          <button
            onClick={handleSkip}
            className="text-xs font-black uppercase tracking-wider text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors flex items-center gap-1 py-1 px-3 rounded-lg hover:bg-slate-200/50 dark:hover:bg-slate-800"
          >
            Skip for now
            <ArrowRight size={14} />
          </button>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl shadow-slate-200 dark:shadow-none overflow-hidden border border-slate-100 dark:border-slate-800">
          <div className="p-8 md:p-10">
            {step === 1 && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-8"
              >
                <div className="text-center space-y-3">
                  <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-600 mx-auto mb-4">
                    <UserIcon size={32} />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight">Optional Profile Setup</h2>
                  <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Customize your teaching workspace, or skip and fill in later.</p>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name (Optional)</label>
                    <input 
                      type="text"
                      value={formData.displayName}
                      onChange={(e) => setFormData({...formData, displayName: e.target.value})}
                      placeholder="e.g. Kwame Mensah"
                      className="w-full p-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all font-bold text-slate-700 dark:text-slate-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Your School (Optional)</label>
                    <div className="relative">
                      <School className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                      <input 
                        type="text"
                        value={formData.school}
                        onChange={(e) => setFormData({...formData, school: e.target.value})}
                        placeholder="e.g. Accra Academy / Basic School"
                        className="w-full p-4 pl-12 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all font-bold text-slate-700 dark:text-slate-200"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button 
                    onClick={handleSkip}
                    className="flex-1 py-4 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-[2rem] font-black uppercase tracking-widest text-xs hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
                  >
                    Skip
                  </button>
                  <button 
                    onClick={() => setStep(2)}
                    className="flex-[2] py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-[2rem] font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 transition-all shadow-xl shadow-emerald-600/20"
                  >
                    Continue
                    <ChevronRight size={18} />
                  </button>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-8"
              >
                <div className="text-center space-y-3">
                  <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-600 mx-auto mb-4">
                    <MapPin size={32} />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight">Location Details</h2>
                  <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Where is your school located?</p>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Region</label>
                    <select 
                      value={formData.region}
                      onChange={(e) => setFormData({...formData, region: e.target.value})}
                      className="w-full p-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all font-bold text-slate-700 dark:text-slate-200"
                    >
                      {GHANA_REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Town / District (Optional)</label>
                    <input 
                      type="text"
                      value={formData.town}
                      onChange={(e) => setFormData({...formData, town: e.target.value})}
                      placeholder="e.g. Kumasi / Cape Coast"
                      className="w-full p-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all font-bold text-slate-700 dark:text-slate-200"
                    />
                  </div>
                </div>

                <div className="flex gap-4">
                  <button 
                    onClick={() => setStep(1)}
                    className="flex-1 py-4 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-[2rem] font-black uppercase tracking-widest text-xs hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
                  >
                    Back
                  </button>
                  <button 
                    onClick={() => setStep(3)}
                    className="flex-[2] py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-[2rem] font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 transition-all shadow-xl shadow-emerald-600/20"
                  >
                    Next
                    <ChevronRight size={18} />
                  </button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-8"
              >
                <div className="text-center space-y-3">
                  <div className="w-16 h-16 bg-ghana-gold/10 rounded-2xl flex items-center justify-center text-ghana-gold mx-auto mb-4">
                    <GraduationCap size={32} />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight">Teaching Area</h2>
                  <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Select your grade level and main subject.</p>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Main Subject (Optional)</label>
                    <SearchableDropdown
                      value={formData.mainSubject}
                      options={subjects.slice().sort((a,b) => a.localeCompare(b))}
                      placeholder="Select Subject (e.g. Science, Mathematics)"
                      onChange={(val) => setFormData({...formData, mainSubject: val})}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {(levels as Level[]).map(l => (
                      <button 
                        key={l}
                        type="button"
                        onClick={() => setFormData({...formData, level: l})}
                        className={cn(
                          "p-3.5 rounded-2xl border-2 transition-all font-bold text-xs",
                          formData.level === l 
                            ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-600 text-emerald-700 dark:text-emerald-300" 
                            : "bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-slate-200"
                        )}
                      >
                        {l}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Step info */}
                <div className="p-5 bg-slate-900 rounded-2xl text-white relative overflow-hidden group">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center text-emerald-400 shrink-0">
                      <ShieldCheck size={22} />
                    </div>
                    <div>
                      <p className="text-[9px] font-black uppercase tracking-widest text-emerald-400">NaCCA Aligned</p>
                      <h4 className="font-bold text-sm">TeachSmartGH Workspace Ready</h4>
                      <p className="text-[11px] text-slate-400 font-medium">You can update these preferences anytime under Profile Settings.</p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button 
                    onClick={() => setStep(2)}
                    className="flex-1 py-4 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-[2rem] font-black uppercase tracking-widest text-xs hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
                  >
                    Back
                  </button>
                  <button 
                    onClick={handleComplete}
                    disabled={submitting}
                    className="flex-[2] py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-[2rem] font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 shadow-xl shadow-emerald-600/20 transition-all"
                  >
                    {submitting ? "Saving..." : "Finish & Enter Workspace"}
                    <ShieldCheck size={18} />
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </div>

        <p className="text-center mt-6 text-slate-400 dark:text-slate-500 text-xs font-bold uppercase tracking-widest">
          TeachSmartGH — Catalyst Creative
        </p>
      </motion.div>
    </div>
  );
};

