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
  Zap
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { subjects, levels, GHANA_REGIONS } from '../../constants';
import { cn } from '../../lib/utils';
import { toast } from 'react-hot-toast';
import { Level, UserProfile } from '../../types';

export const Onboarding = () => {
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

  const handleComplete = async () => {
    if (!formData.school || !formData.mainSubject || !formData.town) {
      toast.error("Please fill in all details to complete your profile.");
      return;
    }
    
    setSubmitting(true);
    try {
      // Map mainSubject to the subjectsTaught array expected by the profile
      const updateData = {
        displayName: formData.displayName,
        school: formData.school,
        region: formData.region,
        town: formData.town,
        level: formData.level,
        subjectsTaught: [formData.mainSubject],
        onboardingComplete: true
      };
      
      await completeOnboarding(updateData);
      toast.success("Welcome aboard! Your professional workspace is ready.", {
        icon: '🚀',
        duration: 5000
      });
    } catch (error) {
      console.error("Onboarding completion error:", error);
      toast.error("Failed to complete setup. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-xl w-full"
      >
        {/* Progress Dots */}
        <div className="flex justify-center gap-2 mb-8">
          {[1, 2, 3].map(i => (
            <div 
              key={i} 
              className={cn(
                "h-1.5 rounded-full transition-all duration-500",
                step === i ? "w-8 bg-ghana-red" : "w-2 bg-slate-200"
              )}
            />
          ))}
        </div>

        <div className="bg-white rounded-[3rem] shadow-2xl shadow-slate-200 overflow-hidden border border-slate-100">
          <div className="p-10">
            {step === 1 && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-8"
              >
                <div className="text-center space-y-3">
                  <div className="w-16 h-16 bg-ghana-red/10 rounded-2xl flex items-center justify-center text-ghana-red mx-auto mb-4">
                    <UserIcon size={32} />
                  </div>
                  <h2 className="text-3xl font-black text-slate-900 tracking-tight">Personal Setup</h2>
                  <p className="text-slate-500 font-medium">Let's start with your professional identity.</p>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                    <input 
                      type="text"
                      value={formData.displayName}
                      onChange={(e) => setFormData({...formData, displayName: e.target.value})}
                      placeholder="e.g. John Doe"
                      className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-ghana-red outline-none transition-all font-bold text-slate-700"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Your School</label>
                    <div className="relative">
                      <School className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                      <input 
                        type="text"
                        value={formData.school}
                        onChange={(e) => setFormData({...formData, school: e.target.value})}
                        placeholder="e.g. Accra Academy"
                        className="w-full p-4 pl-12 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-ghana-red outline-none transition-all font-bold text-slate-700"
                      />
                    </div>
                  </div>
                </div>

                <button 
                  onClick={() => setStep(2)}
                  className="w-full py-5 bg-slate-900 text-white rounded-[2rem] font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/20"
                >
                  Continue
                  <ChevronRight size={18} />
                </button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-8"
              >
                <div className="text-center space-y-3">
                  <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-600 mx-auto mb-4">
                    <MapPin size={32} />
                  </div>
                  <h2 className="text-3xl font-black text-slate-900 tracking-tight">Location</h2>
                  <p className="text-slate-500 font-medium">Where are you currently teaching?</p>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Region</label>
                    <select 
                      value={formData.region}
                      onChange={(e) => setFormData({...formData, region: e.target.value})}
                      className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-ghana-red outline-none transition-all font-bold text-slate-700"
                    >
                      {GHANA_REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Town / City</label>
                    <input 
                      type="text"
                      value={formData.town}
                      onChange={(e) => setFormData({...formData, town: e.target.value})}
                      placeholder="e.g. Kumasi"
                      className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-ghana-red outline-none transition-all font-bold text-slate-700"
                    />
                  </div>
                </div>

                <div className="flex gap-4">
                  <button 
                    onClick={() => setStep(1)}
                    className="flex-1 py-5 bg-slate-100 text-slate-600 rounded-[2rem] font-black uppercase tracking-widest text-xs"
                  >
                    Back
                  </button>
                  <button 
                    onClick={() => setStep(3)}
                    className="flex-[2] py-5 bg-slate-900 text-white rounded-[2rem] font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3"
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
                  <h2 className="text-3xl font-black text-slate-900 tracking-tight">Your Expertise</h2>
                  <p className="text-slate-500 font-medium">Final step! Tell us what you teach.</p>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Main Subject</label>
                    <div className="relative">
                      <BookOpen className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                      <select 
                        value={formData.mainSubject}
                        onChange={(e) => setFormData({...formData, mainSubject: e.target.value})}
                        className="w-full p-4 pl-12 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-ghana-red outline-none transition-all font-bold text-slate-700 appearance-none"
                      >
                        <option value="">Select Subject</option>
                        {subjects.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {(levels as Level[]).map(l => (
                      <button 
                        key={l}
                        onClick={() => setFormData({...formData, level: l})}
                        className={cn(
                          "p-4 rounded-2xl border-2 transition-all font-bold text-sm",
                          formData.level === l 
                            ? "bg-ghana-red/5 border-ghana-red text-ghana-red" 
                            : "bg-white border-slate-100 text-slate-500 hover:border-slate-200"
                        )}
                      >
                        {l}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Step info */}
                <div className="p-6 bg-slate-900 rounded-[2rem] text-white relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                    <Sparkles size={100} />
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center text-emerald-500">
                      <ShieldCheck size={24} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Ministry Approved</p>
                      <h4 className="font-black text-lg">TeachSmart Ghana</h4>
                      <p className="text-xs text-slate-400 font-medium italic">NaCCA Calibrated Engine</p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button 
                    onClick={() => setStep(2)}
                    className="flex-1 py-5 bg-slate-100 text-slate-600 rounded-[2rem] font-black uppercase tracking-widest text-xs"
                  >
                    Back
                  </button>
                  <button 
                    onClick={handleComplete}
                    disabled={submitting}
                    className="flex-[2] py-5 bg-ghana-red text-white rounded-[2rem] font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 shadow-xl shadow-ghana-red/20 hover:bg-ghana-red/90 transition-all"
                  >
                    {submitting ? "Finishing..." : "Complete Setup"}
                    <ShieldCheck size={18} />
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </div>

        <p className="text-center mt-8 text-slate-400 text-xs font-bold uppercase tracking-widest">
          Secure teaching platform by TeachSmart Ghana
        </p>
      </motion.div>
    </div>
  );
};
