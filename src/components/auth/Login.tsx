import React, { useState, useEffect } from 'react';
import { auth } from '../../lib/firebase';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signInAnonymously,
  sendPasswordResetEmail,
  updateProfile as firebaseUpdateProfile
} from 'firebase/auth';
import { motion } from 'motion/react';
import { GraduationCap, Mail, Lock, User, Chrome, Zap, Info, Eye, EyeOff, FastForward, ArrowRight, CheckCircle2, Clock, BookOpen, Sparkles, Download } from 'lucide-react';
import { doc, getDoc, setDoc, serverTimestamp, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { toast } from 'react-hot-toast';

import { Logo } from '../common/Logo';

const Login = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);

  // PWA Install State
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);

  useEffect(() => {
    // Check if already in standalone display mode
    const isStandalone = 
      window.matchMedia('(display-mode: standalone)').matches || 
      (window.navigator as any).standalone === true;
      
    if (isStandalone) {
      setIsInstalled(true);
    }

    const handleBeforePrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
      toast.success('TeachSmartGH successfully installed! Feel free to run it offline 🇬🇭');
    };

    window.addEventListener('beforeinstallprompt', handleBeforePrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforePrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      // No native prompt available; show instructions
      setShowInstructions(prev => !prev);
      return;
    }
    
    // Show the native browser install prompt
    deferredPrompt.prompt();
    
    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User response to install prompt: ${outcome}`);
    
    if (outcome === 'accepted') {
      setIsInstalled(true);
      setDeferredPrompt(null);
    }
  };

  const scrollToRegister = () => {
    setIsLogin(false);
    setError('');
    setInfo('');
    setTimeout(() => {
      const element = document.getElementById('auth-card');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
  };
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [school, setSchool] = useState('');
  const [level, setLevel] = useState<string>('JHS');
  const [subjectsTaught, setSubjectsTaught] = useState('');
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [loading, setLoading] = useState(false);
  const [showGuestEmailModal, setShowGuestEmailModal] = useState(false);
  const [guestEmail, setGuestEmail] = useState('');

  useEffect(() => {
    if (user) {
      if (location.state?.from) {
        navigate(location.state.from);
      } else {
        navigate('/');
      }
    }
  }, [user, navigate, location]);

  const getSafeDate = (d: any) => {
    if (!d) return new Date();
    if (typeof d?.toDate === 'function') return d.toDate();
    if (d && typeof d === 'object' && typeof d.seconds === 'number') {
      return new Date(d.seconds * 1000);
    }
    const date = new Date(d);
    return isNaN(date.getTime()) ? new Date() : date;
  };

  const handleGuestSignIn = async (enteredEmail: string) => {
    if (!enteredEmail || !enteredEmail.includes('@') || !enteredEmail.includes('.')) {
      toast.error('Please enter a valid email address.');
      setError('PLEASE ENTER A VALID EMAIL ADDRESS.');
      return;
    }
    const trimmedEmail = enteredEmail.trim().toLowerCase();
    setLoading(true);
    setError('');
    const toastId = toast.loading('Verifying guest trial registration...', { id: 'guest-login' });
    try {
      const docRef = doc(db, 'used_emails', trimmedEmail);
      const docSnap = await getDoc(docRef);
      let isStillWithinTrial = false;
      let existingCreatedAtStr = '';

      if (docSnap.exists()) {
        const docData = docSnap.data();
        const createdAt = docData?.createdAt ? getSafeDate(docData.createdAt) : null;
        if (createdAt) {
          const now = new Date();
          const elapsedMs = now.getTime() - createdAt.getTime();
          const msInDay = 24 * 60 * 60 * 1000;
          const elapsedDays = elapsedMs / msInDay;
          
          if (elapsedDays < 3) {
            isStillWithinTrial = true;
            existingCreatedAtStr = createdAt.toISOString();
          }
        }
        
        if (!isStillWithinTrial) {
          toast.dismiss(toastId);
          toast.error('The 3-day trial for this email address has expired. Please log in with a standard account or use a different email.', { duration: 6000 });
          setError('THIS EMAIL ADDRESS TRIAL ASSIGNED PERIOD HAS EXPIRED. PLEASE LOG IN OR REDEEM A TRIAL WITH A NEW EMAIL ADDRESS.');
          setLoading(false);
          return;
        }
      }

      toast.loading('Accessing platform as guest...', { id: 'guest-login' });
      localStorage.setItem('pending_guest_email', trimmedEmail);
      if (isStillWithinTrial && existingCreatedAtStr) {
        localStorage.setItem('pending_guest_trial_start', existingCreatedAtStr);
      } else {
        localStorage.removeItem('pending_guest_trial_start');
      }

      await signInAnonymously(auth);
      toast.success('Welcome! You are exploring as a guest.', { id: 'guest-login' });
      setShowGuestEmailModal(false);
    } catch (err: any) {
      console.error("Guest Auth error:", err);
      localStorage.removeItem('pending_guest_email');
      localStorage.removeItem('pending_guest_trial_start');
      if (err.code === 'auth/admin-restricted-operation') {
        setError('GUEST ACCESS IS CURRENTLY DISABLED. PLEASE CONTACT ADMIN OR SIGN IN WITH GOOGLE.');
        toast.error('Guest access is disabled in Firebase Console', { id: 'guest-login', duration: 6000 });
      } else {
        setError(err.message.toUpperCase());
        toast.error('Failed to enter as guest', { id: 'guest-login' });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError('');
    setInfo('');
    try {
      const provider = new GoogleAuthProvider();
      // Inform users about the popup in case it's blocked or hidden
      toast.loading('Opening Google login popup...', { id: 'google-login' });
      await signInWithPopup(auth, provider);
      toast.success('Logged in successfully!', { id: 'google-login' });
    } catch (err: any) {
      console.error("Google Auth error:", err);
      toast.dismiss('google-login');
      if (err.code === 'auth/popup-closed-by-user') {
        setError('THE LOGIN POPUP WAS CLOSED BEFORE COMPLETION.');
        toast.error('Login cancelled: Google popup was closed.', { duration: 5000 });
      } else if (err.code === 'auth/popup-blocked') {
        setError('THE POPUP WAS BLOCKED BY YOUR BROWSER. PLEASE ENABLE POPUPS FOR THIS SITE.');
        toast.error('Popup blocked! Please allow popups for this site.', { duration: 6000 });
      } else {
        setError(err.message.toUpperCase());
        toast.error(err.message || 'Google sign-in failed', { duration: 5000 });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setError('PLEASE ENTER YOUR EMAIL ADDRESS FIRST.');
      toast.error('Email address required');
      return;
    }
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      setInfo('PASSWORD RESET EMAIL SENT! PLEASE CHECK YOUR INBOX.');
      toast.success('Reset email sent');
      setError('');
    } catch (err: any) {
      setError(err.message.toUpperCase());
      toast.error('Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setInfo('');
    
    if (!isLogin) {
      if (password !== confirmPassword) {
        setError('PASSWORDS DO NOT MATCH. PLEASE TRY AGAIN.');
        setLoading(false);
        return;
      }
      if (password.length < 6) {
        setError('PASSWORD MUST BE AT LEAST 6 CHARACTERS.');
        setLoading(false);
        return;
      }
    }

    try {
      if (isLogin) {
        toast.loading('Authenticating credentials...', { id: 'auth-toast' });
        await signInWithEmailAndPassword(auth, email, password);
        toast.success('Welcome back, Teacher!', { id: 'auth-toast' });
      } else {
        toast.loading('Creating professional profile...', { id: 'auth-toast' });
        
        // Find existing trial records in used_emails to enforce unique 3-day trial limit
        const cleanedEmail = email.trim().toLowerCase();
        let originalTrialStart: any = null;
        try {
          const usedEmailRef = doc(db, 'used_emails', cleanedEmail);
          const usedEmailSnap = await getDoc(usedEmailRef);
          if (usedEmailSnap.exists()) {
            const usedData = usedEmailSnap.data();
            if (usedData && usedData.createdAt) {
              originalTrialStart = getSafeDate(usedData.createdAt).toISOString();
            }
          }
        } catch (err) {
          console.warn("Could not retrieve existing used_email records:", err);
        }

        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const { user: newUser } = userCredential;
        
        // Update Firebase Auth profile
        await firebaseUpdateProfile(newUser, {
          displayName: displayName || 'Teacher'
        });

        // Create personalized profile in Firestore with May 2026 Reset-awareness standard verification
        const TRIAL_RESET_DATE = new Date('2026-05-11T00:00:00Z');
        const baseTrialStart = originalTrialStart ? getSafeDate(originalTrialStart) : new Date();
        const finalTrialStart = baseTrialStart < TRIAL_RESET_DATE ? TRIAL_RESET_DATE : baseTrialStart;

        const newProfile: any = {
          uid: newUser.uid,
          email,
          displayName: displayName || 'Teacher',
          school: school || 'Ghana Education Service',
          level: level,
          subjectsTaught: subjectsTaught.split(',').map(s => s.trim()).filter(Boolean),
          trialStartDate: finalTrialStart.toISOString(),
          subscriptionStatus: 'trial',
          trialResetMay2026Applied: true, // Mark reset applied to avoid overwriting their brand-new signup date
          onboardingComplete: true, // Mark as complete since they filled it during registration
          createdAt: originalTrialStart ? new Date(originalTrialStart).toISOString() : serverTimestamp(),
        };
        
        await setDoc(doc(db, 'users', newUser.uid), newProfile);
        
        // Record / update used_emails record securely
        try {
          await setDoc(doc(db, 'used_emails', cleanedEmail), {
            uid: newUser.uid,
            isAnonymous: false,
            createdAt: originalTrialStart ? new Date(originalTrialStart).toISOString() : serverTimestamp()
          }, { merge: true });
        } catch (e) {
          console.error("Error setting used_emails during standard registration:", e);
        }

        toast.success('Registration successful! Welcome to TeachSmart.', { id: 'auth-toast' });
      }
    } catch (err: any) {
      console.error(err);
      toast.dismiss('auth-toast');
      if (err.code === 'auth/email-already-in-use') {
        setError('THIS EMAIL IS ALREADY REGISTERED. PLEASE LOG IN INSTEAD.');
        setIsLogin(true);
      } else if (err.code === 'auth/invalid-credential') {
        setError('INVALID EMAIL OR PASSWORD. PLEASE CHECK YOUR DETAILS.');
      } else if (err.code === 'auth/too-many-requests') {
        setError('TOO MANY UNSUCCESSFUL ATTEMPTS. PLEASE TRY AGAIN LATER.');
      } else {
        setError(err.message.toUpperCase());
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] relative overflow-y-auto overflow-x-hidden font-sans flex flex-col justify-between selection:bg-emerald-500 selection:text-white">
      {/* Background Ornaments */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-25 z-0">
        <div className="absolute top-[-5%] left-[-5%] w-[45%] h-[45%] bg-emerald-deep rounded-full blur-[130px]" />
        <div className="absolute bottom-[-5%] right-[-5%] w-[45%] h-[45%] bg-ghana-gold rounded-full blur-[130px]" />
        <div className="absolute top-[40%] left-[65%] w-[35%] h-[35%] bg-ghana-red rounded-full blur-[150px] opacity-40" />
      </div>

      {/* Top logo/navigation header bar */}
      <header className="w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pt-6 sm:pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 z-10 relative">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-deep flex items-center justify-center text-white shadow-md shadow-emerald-900/10 z-10">
            <GraduationCap size={20} />
          </div>
          <div>
            <span className="text-lg font-black tracking-tight text-slate-800 uppercase block leading-none z-10">
              TeachSmartGH
            </span>
            <span className="text-[7px] font-black uppercase text-emerald-600 tracking-[0.15em] block mt-0.5 z-10">
              CATALYST CREATIVE
            </span>
          </div>
        </div>

        {/* Public Page Navigations */}
        <div className="flex items-center gap-6 z-10">
          <Link to="/features" className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-emerald-deep transition-colors">
            Features
          </Link>
          <Link to="/about" className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-emerald-deep transition-colors">
            About Team
          </Link>
          <Link to="/blog" className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-emerald-deep transition-colors">
            Resources Hub
          </Link>
        </div>

        <button
          onClick={() => {
            setIsLogin(true);
            const element = document.getElementById('auth-card');
            if (element) {
              element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
          }}
          className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-slate-600 hover:text-emerald-deep transition-colors bg-white hover:bg-slate-50 border border-slate-200 px-4 py-2 rounded-xl shadow-sm z-10"
        >
          Sign In
        </button>
      </header>

      {/* Inner Main Content Wrapper */}
      <main className="max-w-7xl mx-auto w-full px-6 sm:px-8 lg:px-12 py-12 md:py-20 flex flex-col lg:flex-row items-center gap-12 lg:gap-16 z-10 relative flex-grow">
        
        {/* Left Column: Proper Landing Page Info */}
        <div className="flex-1 space-y-8 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-emerald-50 border border-emerald-100/50 rounded-full text-[10px] font-black uppercase tracking-wider text-emerald-800 self-center lg:self-start">
            <Sparkles size={12} className="text-emerald-600 animate-pulse" />
            <span>Empowering Ghanaian Educators</span>
            <span className="w-1.5 h-1.5 rounded-full bg-ghana-gold animate-ping" />
          </div>

          <div className="space-y-4">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.1]">
              Professional Teaching Tools <br className="hidden sm:inline"/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-deep to-emerald-600">
                Built for Ghana's Educators
              </span>
            </h1>
            <h2 className="text-lg sm:text-xl font-bold text-slate-700 tracking-tight mt-3">
              Generate NaCCA Schemes of Learning, Lesson Notes, and Practical Ghana Classroom Tools
            </h2>
            <p className="text-slate-500 text-sm sm:text-base font-medium max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Elevate your instructional impact with <strong>TeachSmartGH</strong>, a premium product by Catalyst Creative. Access professional <strong>GES lesson plan resources</strong> and advanced <strong>teaching tools for Ghana teachers</strong>. Playfully generate termly plans, secondary lesson notes, primary math worksheets, and comprehensive diagnostic assessment papers with correct curriculum standard codes. Accelerate your <strong>Ghana educator professional development</strong> today with “AI-Powered Teaching. Smarter Tomorrow.”
            </p>
          </div>

          {/* CTA & Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
            <button
              id="cta-create-account"
              onClick={scrollToRegister}
              className="w-full sm:w-auto px-8 py-4 bg-emerald-deep hover:bg-emerald-700 text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-xl shadow-emerald-950/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2.5 group animate-bounce-short"
            >
              <span>Create Free Account</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <div className="text-slate-455 font-extrabold text-[10px] uppercase tracking-wider">
              No subscription obligation
            </div>
          </div>

          <div className="h-px bg-slate-200/60 w-full" />

          {/* Benefit Bullets (Structured Cards) */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-1 gap-4">
            <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-[0_4px_24px_rgba(0,0,0,0.02)] flex items-start gap-4 text-left transition-all hover:scale-[1.01] hover:shadow-md hover:border-slate-150">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 flex-shrink-0">
                <CheckCircle2 size={18} />
              </div>
              <div className="space-y-1">
                <h3 className="font-extrabold text-sm text-slate-800 uppercase tracking-tight">100% GES & NaCCA Curriculum Compliance</h3>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">
                  Support for Kindergarten, Primary, JHS, and SHS streams. Automatically matches lesson indicators, strand levels, and child-centered differentiation strategies.
                </p>
              </div>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-[0_4px_24px_rgba(0,0,0,0.02)] flex items-start gap-4 text-left transition-all hover:scale-[1.01] hover:shadow-md hover:border-slate-150">
              <div className="w-10 h-10 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600 flex-shrink-0">
                <Clock size={18} />
              </div>
              <div className="space-y-1">
                <h3 className="font-extrabold text-sm text-slate-800 uppercase tracking-tight">10+ Hours Saved Weekly on Repetitive Paperwork</h3>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">
                  Offload complex terminal schemes, assessment notes, and play-based starter setups. Download mobile-friendly files ready for fast offline school printing.
                </p>
              </div>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-[0_4px_24px_rgba(0,0,0,0.02)] flex items-start gap-4 text-left transition-all hover:scale-[1.01] hover:shadow-md hover:border-slate-150">
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-650 flex-shrink-0">
                <BookOpen size={18} />
              </div>
              <div className="space-y-1">
                <h3 className="font-extrabold text-sm text-slate-800 uppercase tracking-tight">All-In-One Personal Resource Organizer</h3>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">
                  Keep marking schemes, custom question banks, saved lesson note variations, and tracking sheets centralized and organized by academic term.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Original Login/Register Component Card */}
        <div id="auth-card" className="w-full max-w-lg lg:max-w-xl z-10 relative flex-shrink-0">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="w-full bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.06)] overflow-hidden relative border border-slate-100"
          >
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-ghana-red via-ghana-gold to-ghana-green" />
            
            <div className="pt-12 pb-8 px-12 text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-deep rounded-3xl shadow-xl shadow-emerald-900/20 mb-6 -rotate-3 hover:rotate-0 transition-transform duration-500">
                <GraduationCap size={40} className="text-white" />
              </div>
              <h2 className="text-4xl font-black text-[#001C3D] tracking-tighter uppercase leading-none mb-2">
                TeachSmart<span className="text-[#FCD116]">GH</span>
              </h2>
              <p className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.15em] mb-4">
                A CATALYST CREATIVE BRAND
              </p>
              <div className="h-px w-12 bg-slate-100 mx-auto mb-4" />
              <p className="text-slate-500 text-sm font-semibold italic max-w-xs mx-auto leading-relaxed">
                {isLogin 
                  ? "Welcome back, educator. Access your professional teaching tools."
                  : "Join the future of Ghanaian education. Personalized for your classroom."}
              </p>
            </div>

            <div className="px-12 pb-12">
              {error && (
                <motion.div 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="mb-6 p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-3"
                >
                  <div className="flex-shrink-0 w-8 h-8 bg-rose-100 rounded-full flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-pulse" />
                  </div>
                  <p className="text-[10px] font-black text-rose-600 uppercase tracking-widest leading-normal">
                    {error}
                  </p>
                </motion.div>
              )}

              {info && (
                <motion.div 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="mb-6 p-4 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center gap-3"
                >
                  <div className="flex-shrink-0 w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600">
                    <Info size={14} />
                  </div>
                  <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest leading-normal">
                    {info}
                  </p>
                </motion.div>
              )}

              <div className="space-y-4">
                <div className="space-y-3">
                  <button 
                    onClick={handleGoogleSignIn}
                    className="w-full group flex items-center justify-center gap-4 px-8 py-4 bg-white border border-slate-200 rounded-2xl font-black text-slate-700 hover:border-emerald-500/30 hover:bg-emerald-50/5 transition-all shadow-sm text-xs uppercase tracking-widest"
                  >
                    <div className="w-6 h-6 bg-white rounded-lg flex items-center justify-center shadow-sm border border-slate-100 group-hover:scale-110 transition-transform">
                      <Chrome size={16} className="text-emerald-deep" />
                    </div>
                    Continue with Google Account
                  </button>

                  <button 
                    onClick={() => setShowGuestEmailModal(true)}
                    className="w-full group flex items-center justify-center gap-4 px-8 py-4 bg-emerald-deep text-white rounded-2xl font-black hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-900/10 text-xs uppercase tracking-widest"
                  >
                    <FastForward size={18} className="group-hover:translate-x-1 transition-transform" />
                    Explore as Guest (No Sign-in)
                  </button>
                </div>

                <div className="relative py-4 text-center">
                  <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 border-t border-slate-100" />
                  <span className="relative px-6 bg-white text-[8px] font-black text-slate-400 uppercase tracking-[0.4em]">OR</span>
                </div>

                <form onSubmit={handleEmailAuth} className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    {!isLogin && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="space-y-4"
                      >
                        <div className="relative">
                          <User className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" size={18} />
                          <input 
                            type="text" 
                            placeholder="FULL NAME" 
                            className="w-full pl-14 pr-6 py-4 bg-slate-50/50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-emerald-deep/20 focus:border-emerald-deep transition-all text-xs font-bold tracking-widest uppercase outline-none"
                            value={displayName}
                            onChange={(e) => setDisplayName(e.target.value)}
                            required={!isLogin}
                          />
                        </div>
                        <div className="relative">
                          <GraduationCap className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" size={18} />
                          <input 
                            type="text" 
                            placeholder="SCHOOL NAME" 
                            className="w-full pl-14 pr-6 py-4 bg-slate-50/50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-emerald-deep/20 focus:border-emerald-deep transition-all text-xs font-bold tracking-widest uppercase outline-none"
                            value={school}
                            onChange={(e) => setSchool(e.target.value)}
                            required={!isLogin}
                          />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <select 
                            className="w-full px-6 py-4 bg-slate-50/50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-emerald-deep/20 focus:border-emerald-deep transition-all text-xs font-bold tracking-widest uppercase outline-none h-[58px]"
                            value={level}
                            onChange={(e) => setLevel(e.target.value)}
                          >
                            <option value="KG">KINDERGARTEN</option>
                            <option value="Primary">PRIMARY SCHOOL</option>
                            <option value="JHS">JUNIOR HIGH (JHS)</option>
                            <option value="SHS">SENIOR HIGH (SHS)</option>
                          </select>
                          <div className="relative">
                            <Zap className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" size={16} />
                            <input 
                              type="text" 
                              placeholder="SUBJECTS" 
                              className="w-full pl-12 pr-6 py-4 bg-slate-50/50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-emerald-deep/20 focus:border-emerald-deep transition-all text-xs font-bold tracking-widest uppercase outline-none"
                              value={subjectsTaught}
                              onChange={(e) => setSubjectsTaught(e.target.value)}
                              required={!isLogin}
                            />
                          </div>
                        </div>
                      </motion.div>
                    )}

                    <div className="relative">
                      <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" size={18} />
                      <input 
                        type="email" 
                        placeholder="EMAIL ADDRESS" 
                        className="w-full pl-14 pr-6 py-4 bg-slate-50/50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-emerald-deep/20 focus:border-emerald-deep transition-all text-xs font-bold tracking-widest uppercase outline-none"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="relative">
                        <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" size={18} />
                        <input 
                          type={showPassword ? "text" : "password"} 
                          placeholder="PASSWORD" 
                          className="w-full pl-14 pr-12 py-4 bg-slate-50/50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-emerald-deep/20 focus:border-emerald-deep transition-all text-xs font-bold tracking-widest uppercase outline-none"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-emerald-deep transition-colors p-1"
                        >
                          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                      {!isLogin && (
                        <motion.div 
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="relative"
                        >
                          <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-emerald-deep/30 pointer-events-none" size={18} />
                          <input 
                            type={showPassword ? "text" : "password"} 
                            placeholder="CONFIRM" 
                            className="w-full pl-14 pr-12 py-4 bg-emerald-50/5 border border-emerald-100/50 rounded-2xl focus:ring-2 focus:ring-emerald-deep/20 focus:border-emerald-deep transition-all text-xs font-bold tracking-widest uppercase outline-none"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required={!isLogin}
                          />
                        </motion.div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center px-2 mb-2">
                    <button 
                      type="button"
                      onClick={() => {
                        setIsLogin(!isLogin);
                        setError('');
                        setInfo('');
                      }}
                      className="text-[9px] font-black text-emerald-600 hover:text-ghana-gold uppercase tracking-widest transition-colors"
                    >
                      {isLogin ? "CREATE NEW ACCOUNT" : "BACK TO LOGIN"}
                    </button>
                    
                    {isLogin && (
                      <button 
                        type="button"
                        onClick={handleForgotPassword}
                        className="text-[9px] font-black text-slate-400 hover:text-emerald-deep uppercase tracking-widest transition-colors"
                      >
                        Forgot Password?
                      </button>
                    )}
                  </div>

                  <button 
                    type="submit" 
                    className="btn-primary w-full py-5 rounded-[1.5rem] shadow-xl shadow-emerald-900/20 active:scale-[0.98] transition-all font-black uppercase text-[10px] tracking-[0.3em] mt-2 group"
                    disabled={loading}
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" />
                        <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce delay-75" />
                        <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce delay-150" />
                      </span>
                    ) : (
                      <>
                        {isLogin ? "Authenticate Account" : "Submit Registration"}
                      </>
                    )}
                  </button>
                </form>
              </div>

              <div className="mt-8 text-center">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  {isLogin ? "DON'T HAVE AN ACCOUNT?" : "ALREADY REGISTERED?"}
                  <button 
                    onClick={() => {
                      setIsLogin(!isLogin);
                      setError('');
                      setInfo('');
                    }}
                    className="ml-3 text-emerald-deep hover:text-ghana-gold transition-colors font-black border-b-2 border-emerald-deep/20 pb-0.5"
                  >
                    {isLogin ? "CREATE PROFILE" : "SIGN IN NOW"}
                  </button>
                </p>
              </div>
            </div>

            {/* Structured PWA Offline Installation Section */}
            <div className="mx-12 mb-8 p-5 bg-slate-50/70 border border-slate-100 rounded-2xl text-left space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 flex-shrink-0 shadow-sm">
                  <Download size={18} className="animate-pulse" />
                </div>
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-emerald-100/60 text-emerald-800 text-[8px] font-black rounded uppercase tracking-wider">
                    Official PWA App
                  </div>
                  <h3 className="font-extrabold text-xs text-slate-800 uppercase tracking-tight">
                    Install TeachSmartGH App
                  </h3>
                  <p className="text-[10px] text-slate-500 font-semibold leading-relaxed">
                    Prepare lesson notes, generate NaCCA schemes, and prepare diagnostic assessments with zero internet data. Works beautifully offline!
                  </p>
                </div>
              </div>

              {!isInstalled ? (
                <div className="space-y-3">
                  <button
                    type="button"
                    onClick={handleInstallClick}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-white border border-slate-200 hover:border-emerald-500/20 hover:bg-emerald-50/10 text-slate-700 hover:text-emerald-deep font-black text-[9px] uppercase tracking-widest rounded-xl transition-all shadow-sm active:scale-[0.98] cursor-pointer"
                  >
                    <Download size={12} />
                    <span>{deferredPrompt ? 'Install App (Offline)' : 'Offline Installation Guide'}</span>
                  </button>

                  {/* Instructive prompt collapsed details */}
                  {showInstructions && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="p-4 bg-white rounded-xl border border-slate-150 space-y-3 text-[10px] font-semibold text-slate-600 leading-relaxed"
                    >
                      <p className="font-black text-slate-800 uppercase text-[9px] tracking-wide border-b border-slate-100 pb-1 flex items-center justify-between">
                        <span>How to Install offline:</span>
                        <span className="text-emerald-600 text-[8px] bg-emerald-50 px-1 py-0.5 rounded">All Devices</span>
                      </p>
                      
                      <div className="space-y-2.5">
                        <div className="flex flex-col gap-0.5">
                          <span className="font-black text-emerald-600 uppercase text-[8px] tracking-wide">1. iOS (Safari on iPhone / iPad):</span>
                          <span>Tap the standard <span className="font-bold text-slate-800 underline">Share button</span> (square with arrow pointing up) at the bottom, then scroll down and select <span className="font-bold text-slate-800 underline">Add to Home Screen</span>.</span>
                        </div>
                        <div className="flex flex-col gap-0.5">
                          <span className="font-black text-emerald-600 uppercase text-[8px] tracking-wide">2. Android Devices (Chrome):</span>
                          <span>Tap the 3 dots in top right corner of Chrome and select <span className="font-bold text-slate-800 underline">Install App</span> or <span className="font-bold text-slate-800 underline">Add to Home Screen</span>.</span>
                        </div>
                        <div className="flex flex-col gap-0.5">
                          <span className="font-black text-emerald-600 uppercase text-[8px] tracking-wide">3. Desktop (Chrome/Edge):</span>
                          <span>Click the install prompt/icon in Chrome's URL search bar at the very top right.</span>
                        </div>
                      </div>

                      <button 
                        type="button"
                        onClick={() => setShowInstructions(false)}
                        className="text-[8px] font-black text-slate-400 hover:text-emerald-600 uppercase tracking-widest block transition-colors mt-2"
                      >
                        [ Hide Setup Instructions ]
                      </button>
                    </motion.div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2 text-emerald-700 bg-emerald-50/50 border border-emerald-100 px-4 py-3 rounded-xl text-[9px] font-black uppercase tracking-wider">
                  <CheckCircle2 size={12} className="text-emerald-500" />
                  <span>Integrated Offline PWA Installed 🇬🇭</span>
                </div>
              )}
            </div>
            
            <div className="py-5 bg-gradient-to-b from-white to-slate-50 text-center px-12 border-t border-slate-100">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] leading-relaxed">
                Personalized Professional Access System 🇬🇭
              </p>
            </div>
          </motion.div>
        </div>
      </main>

      {/* Footer bar */}
      <footer className="w-full bg-slate-900 text-slate-400 py-8 text-center text-[10px] font-bold tracking-wider uppercase z-10 relative space-y-3">
        <div className="flex justify-center items-center gap-6">
          <Link to="/features" className="hover:text-emerald-400 transition-colors">Features</Link>
          <span className="text-slate-700">|</span>
          <Link to="/about" className="hover:text-emerald-400 transition-colors">About Us</Link>
          <span className="text-slate-700">|</span>
          <Link to="/blog" className="hover:text-emerald-400 transition-colors">Resources Hub</Link>
        </div>
        <div className="h-px bg-slate-850/30 max-w-xs mx-auto" />
        <p>© {new Date().getFullYear()} TeachSmartGH (Catalyst Creative). Created for Professional Ghanaian Educators. Aligned with NaCCA Standards.</p>
      </footer>

      {showGuestEmailModal && (
        <div id="guest-email-modal" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100"
          >
            <div className="p-8 space-y-6">
              <div className="text-center space-y-2">
                <div className="mx-auto w-12 h-12 bg-emerald-100/80 rounded-full flex items-center justify-center text-emerald-600 mb-2">
                  <Mail size={22} className="text-emerald-deep" />
                </div>
                <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">
                  Claim Guest Teacher Trial
                </h3>
                <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400 leading-relaxed max-w-xs mx-auto">
                  To prevent abuse, each email address can claim exactly ONE guest trial period in accordance with NaCCA guidelines.
                </p>
              </div>

              <div className="space-y-4">
                <div className="relative">
                  <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" size={18} />
                  <input 
                    type="email" 
                    placeholder="ENTER YOUR EMAIL ADDRESS" 
                    className="w-full pl-14 pr-6 py-4 bg-slate-50/50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-emerald-deep/20 focus:border-emerald-deep transition-all text-xs font-bold tracking-widest uppercase outline-none"
                    value={guestEmail}
                    onChange={(e) => setGuestEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowGuestEmailModal(false);
                      setGuestEmail('');
                    }}
                    className="flex-1 py-4 border border-slate-200 hover:bg-slate-50 text-slate-500 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => handleGuestSignIn(guestEmail)}
                    disabled={loading || !guestEmail}
                    className="flex-1 py-4 bg-emerald-deep hover:bg-emerald-700 disabled:opacity-50 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-lg shadow-emerald-950/10 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {loading ? "Verifying..." : "Start Trial"}
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Login;
