import React, { useState } from 'react';
import { motion } from 'motion/react';
import { User, School, MapPin, Save, Shield, BadgeCheck, Loader2, Camera, Upload, BookOpen, GraduationCap, Users, Briefcase, Globe, Sun, Moon, ShieldCheck, FileText } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { cn } from '../../lib/utils';
import { updateProfile } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import { toast } from 'react-hot-toast';
import { TermsAndConditionsModal } from '../legal/TermsAndConditionsModal';

const regions = [
  "Greater Accra", "Ashanti", "Central", "Western", "Eastern", 
  "Northern", "Upper East", "Upper West", "Volta", "Bono", 
  "Bono East", "Ahafo", "Savannah", "North East", "Oti", "Western North"
];

export default function ProfileSettings() {
  const { profile, user, refreshProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  
  const [formData, setFormData] = useState({
    displayName: profile?.displayName || '',
    school: profile?.school || '',
    region: profile?.region || '',
    district: profile?.district || '',
    town: profile?.town || '',
    level: profile?.level || '',
    locality: profile?.locality || 'Urban',
    classSize: profile?.classSize || '40',
    subjectsTaught: profile?.subjectsTaught?.join(', ') || '',
    teachingExperienceYears: profile?.teachingExperienceYears || '',
    isBstemSchool: profile?.isBstemSchool || false
  });

  const resizeImageToAvatar = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_DIM = 256;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_DIM) {
              height = Math.round((height * MAX_DIM) / width);
              width = MAX_DIM;
            }
          } else {
            if (height > MAX_DIM) {
              width = Math.round((width * MAX_DIM) / height);
              height = MAX_DIM;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve(event.target?.result as string);
            return;
          }
          ctx.drawImage(img, 0, 0, width, height);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
          resolve(dataUrl);
        };
        img.onerror = () => reject(new Error("Failed to process image file"));
        img.src = event.target?.result as string;
      };
      reader.onerror = () => reject(new Error("Failed to read image file"));
      reader.readAsDataURL(file);
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    if (!file.type.startsWith('image/')) {
      toast.error("Please select a valid image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB source limit
      toast.error("Image size too large. Please upload an image smaller than 5MB.");
      return;
    }

    setUploading(true);
    try {
      const optimizedBase64 = await resizeImageToAvatar(file);
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, { 
        photoURL: optimizedBase64,
        updatedAt: new Date()
      });
      
      if (auth.currentUser) {
        try {
          // Firebase Auth profile update has strict length limits on photoURL (~2KB)
          if (optimizedBase64.length < 2000) {
            await updateProfile(auth.currentUser, { photoURL: optimizedBase64 });
          }
        } catch (authErr) {
          console.warn("Auth updateProfile photoURL skipped (using Firestore profile):", authErr);
        }
      }
      
      await refreshProfile();
      toast.success("Profile picture updated!");
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload image.");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setLoading(true);
    setSuccess(false);
    try {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        ...formData,
        subjectsTaught: formData.subjectsTaught.split(',').map(s => s.trim()).filter(Boolean),
        teachingExperienceYears: formData.teachingExperienceYears ? Number(formData.teachingExperienceYears) : null,
        onboardingComplete: Boolean(formData.school.trim()),
        profileCompleted: Boolean(formData.school.trim()),
        updatedAt: new Date()
      });
      await refreshProfile();
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error: any) {
      console.error("Error updating profile:", error);
      if (error?.code === 'permission-denied') {
        toast.error("You don't have permission to update this profile. Please ensure you are logged in correctly.");
      } else {
        toast.error("Failed to update profile. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Profile Settings</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium italic">Personalize your TeachSmart experience.</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm text-center">
            <div className="relative inline-block group mb-6">
              <div className="w-24 h-24 bg-ghana-gold rounded-3xl flex items-center justify-center font-black text-4xl text-emerald-deep mx-auto shadow-xl shadow-ghana-gold/20 overflow-hidden">
                {profile?.photoURL && profile.photoURL !== "" ? (
                  <img src={profile.photoURL || null} alt={profile.displayName || 'User'} className="w-full h-full object-cover" />
                ) : (
                  profile?.displayName?.[0] || 'T'
                )}
              </div>
              <label className="absolute -bottom-2 -right-2 w-10 h-10 bg-slate-900 border-4 border-white text-white rounded-xl flex items-center justify-center cursor-pointer hover:bg-emerald-600 transition-all shadow-lg scale-90 group-hover:scale-100">
                <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
                {uploading ? <Loader2 size={16} className="animate-spin" /> : <Camera size={16} />}
              </label>
            </div>
            
            <h2 className="text-xl font-black text-slate-900 dark:text-white">{profile?.displayName}</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-6">{profile?.email}</p>
            
            <div className="pt-6 border-t border-slate-50 dark:border-slate-800 flex flex-col gap-3">
              <div className="flex items-center gap-3 text-left p-3 bg-slate-50 dark:bg-slate-950 rounded-2xl">
                <div className="w-8 h-8 bg-white dark:bg-slate-900 rounded-xl flex items-center justify-center text-slate-400 dark:text-slate-500">
                  <Shield size={16} />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">Status</p>
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-300 capitalize">{profile?.subscriptionStatus} Member</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-left p-3 bg-emerald-50 dark:bg-emerald-950/20 rounded-2xl border border-emerald-100 dark:border-emerald-900/30">
                <div className="w-8 h-8 bg-white dark:bg-slate-900 rounded-xl flex items-center justify-center text-emerald-600">
                  <BadgeCheck size={16} />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400">Verified</p>
                  <p className="text-xs font-bold text-emerald-700 dark:text-emerald-300">NaCCA Accredited</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Update Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 p-8 md:p-10 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
                  <User size={14} /> Full Name
                </label>
                <input 
                  type="text"
                  required
                  value={formData.displayName}
                  onChange={(e) => setFormData({...formData, displayName: e.target.value})}
                  className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none font-bold text-slate-700 transition-all"
                  placeholder="e.g. Kwame Mensah"
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
                  <School size={14} /> School Name
                </label>
                <input 
                  type="text"
                  required
                  value={formData.school}
                  onChange={(e) => setFormData({...formData, school: e.target.value})}
                  className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none font-bold text-slate-700 transition-all"
                  placeholder="e.g. Accra Academy"
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
                  <MapPin size={14} /> Region
                </label>
                <select 
                  required
                  value={formData.region}
                  onChange={(e) => setFormData({...formData, region: e.target.value})}
                  className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none font-bold text-slate-700 transition-all cursor-pointer appearance-none"
                >
                  <option value="">Select Region</option>
                  {regions.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
                  <GraduationCap size={14} /> Education Level
                </label>
                <select 
                  required
                  value={formData.level}
                  onChange={(e) => setFormData({...formData, level: e.target.value})}
                  className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none font-bold text-slate-700 transition-all cursor-pointer appearance-none"
                >
                  <option value="">Select Level</option>
                  <option value="KG">KINDERGARTEN</option>
                  <option value="Primary">PRIMARY SCHOOL</option>
                  <option value="JHS">JUNIOR HIGH (JHS)</option>
                  <option value="SHS">SENIOR HIGH (SHS)</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
                  <Globe size={14} /> Locality Type
                </label>
                <select 
                  required
                  value={formData.locality}
                  onChange={(e) => setFormData({...formData, locality: e.target.value})}
                  className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none font-bold text-slate-700 transition-all cursor-pointer appearance-none"
                >
                  <option value="Urban">Urban</option>
                  <option value="Peri-Urban">Peri-Urban</option>
                  <option value="Rural">Rural</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
                  <Users size={14} /> Default Class Size
                </label>
                <input 
                  type="number"
                  value={formData.classSize}
                  onChange={(e) => setFormData({...formData, classSize: e.target.value})}
                  className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none font-bold text-slate-700 transition-all"
                  placeholder="e.g. 40"
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
                  District
                </label>
                <input 
                  type="text"
                  required
                  value={formData.district}
                  onChange={(e) => setFormData({...formData, district: e.target.value})}
                  className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none font-bold text-slate-700 transition-all"
                  placeholder="e.g. Accra Metropolitan"
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
                  Town / City
                </label>
                <input 
                  type="text"
                  required
                  value={formData.town}
                  onChange={(e) => setFormData({...formData, town: e.target.value})}
                  className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none font-bold text-slate-700 transition-all"
                  placeholder="e.g. Kokomlemle"
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
                  <BookOpen size={14} /> Subjects Taught
                </label>
                <input 
                  type="text"
                  value={formData.subjectsTaught}
                  onChange={(e) => setFormData({...formData, subjectsTaught: e.target.value})}
                  className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none font-bold text-slate-700 transition-all"
                  placeholder="e.g. Mathematics, English, Science"
                />
                <p className="text-[10px] text-slate-400 font-medium ml-1 italic leading-none">List subjects separated by commas (e.g. English, Math, Science)</p>
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
                  <Briefcase size={14} /> Years of Teaching Experience
                </label>
                <input 
                  type="number"
                  value={formData.teachingExperienceYears}
                  onChange={(e) => setFormData({...formData, teachingExperienceYears: e.target.value})}
                  className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none font-bold text-slate-700 transition-all"
                  placeholder="e.g. 5"
                />
              </div>

              <div className="md:col-span-2 space-y-3 pt-6 border-t border-slate-100 dark:border-slate-850">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 p-6 bg-emerald-50/20 dark:bg-emerald-950/10 border border-emerald-100/50 dark:border-emerald-900/20 rounded-3xl">
                  <div className="space-y-1">
                    <h4 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2 flex-wrap md:flex-nowrap">
                      <span className="px-2.5 py-1 bg-ghana-gold/20 dark:bg-ghana-gold/10 text-emerald-800 dark:text-ghana-gold text-[9px] font-black rounded-lg uppercase tracking-wider">Ghana BSTEM Option</span>
                      Basic STEM (BSTEM) Aligned
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed max-w-xl">
                      Is your school registered or operating under the Basic Science, Technology, Engineering, and Mathematics (BSTEM) initiative? Turning this on optimizes all AI generation (lesson plans, schemes of learning, exams) to integrate BSTEM methodologies, practical activity setups, and national BSTEM learning standards.
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer select-none self-end md:self-center">
                    <input 
                      type="checkbox" 
                      className="sr-only peer"
                      checked={formData.isBstemSchool}
                      onChange={(e) => setFormData({...formData, isBstemSchool: e.target.checked})}
                    />
                    <div className="w-14 h-8 bg-slate-200 dark:bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-emerald-600"></div>
                  </label>
                </div>
              </div>
            </div>

            <div className="pt-4 flex flex-col md:flex-row items-center justify-between gap-6">
              <p className="text-xs text-slate-400 font-medium max-w-xs italic">
                Your school and region information helps us header your documents and provide better local curriculum insights.
              </p>
              <button 
                type="submit"
                disabled={loading}
                className={cn(
                  "w-full md:w-auto px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 transition-all",
                  success ? "bg-green-500 text-white" : "bg-slate-900 text-white hover:bg-emerald-600 shadow-xl shadow-black/10"
                )}
              >
                {loading ? <Loader2 className="animate-spin" size={18} /> : success ? <Shield size={18} /> : <Save size={18} />}
                {loading ? 'Processing...' : success ? 'Information Saved' : 'Save Profile'}
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="bg-slate-900 rounded-[3rem] p-10 lg:p-12 text-white relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 p-12 opacity-10">
          <Shield size={120} />
        </div>
        <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center">
                <BadgeCheck size={24} />
              </div>
              <h2 className="text-xl font-black uppercase tracking-tight">Data Governance & Policy</h2>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              In accordance with the <strong>Ghana Data Protection Act</strong> and our <strong>NaCCA Compliance Charter</strong>, your data is handled with transparency and high-level security.
            </p>
            <div className="flex flex-wrap gap-3">
              <span className="px-3 py-1.5 bg-white/10 text-emerald-400 rounded-xl text-[10px] font-black uppercase tracking-widest border border-white/5">AES-256 Encrypted</span>
              <span className="px-3 py-1.5 bg-white/10 text-indigo-400 rounded-xl text-[10px] font-black uppercase tracking-widest border border-white/5">Act 843 Compliant</span>
              <button
                type="button"
                onClick={() => setShowTermsModal(true)}
                className="px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 transition-colors shadow-md cursor-pointer"
              >
                <ShieldCheck size={13} />
                Responsible AI Terms Policy
              </button>
            </div>
            {profile?.acceptedTerms && (
              <p className="text-[10px] text-slate-400 font-medium">
                ✅ Responsible AI Terms v{profile.termsVersion || '2026.1'} accepted on {profile.acceptedTermsAt ? new Date(profile.acceptedTermsAt).toLocaleDateString('en-GB') : 'First Sign-in'}.
              </p>
            )}
          </div>
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 space-y-6">
            <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
              <div className="w-2 h-2 bg-ghana-gold rounded-full" />
              Your Rights
            </h3>
            <ul className="space-y-4">
              {[
                'Right to Rectification of personal data',
                'Right to Erasure (Withdrawal of Consent)',
                'Ownership of all AI-generated outputs',
                'Curriculum Integrity Guarantee'
              ].map((right, idx) => (
                <li key={idx} className="flex items-center gap-3 text-xs font-medium text-slate-300">
                  <div className="w-1 h-1 bg-white/20 rounded-full shrink-0" />
                  {right}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <TermsAndConditionsModal
        isOpen={showTermsModal}
        onClose={() => setShowTermsModal(false)}
        isMandatory={false}
      />
    </div>
  );
}
