import React, { useState, useEffect } from 'react';
import { auth } from '../../lib/firebase';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
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
import { GraduationCap, Mail, Lock, User, Chrome, Zap, Info, Eye, EyeOff, FastForward } from 'lucide-react';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { toast } from 'react-hot-toast';

import { Logo } from '../common/Logo';

const Login = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
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

  useEffect(() => {
    if (user) {
      if (location.state?.from) {
        navigate(location.state.from);
      } else {
        navigate('/');
      }
    }
  }, [user, navigate, location]);

  const handleGuestSignIn = async () => {
    setLoading(true);
    setError('');
    toast.loading('Accessing platform as guest...', { id: 'guest-login' });
    try {
      await signInAnonymously(auth);
      toast.success('Welcome! You are exploring as a guest.', { id: 'guest-login' });
    } catch (err: any) {
      console.error("Guest Auth error:", err);
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
      } else if (err.code === 'auth/popup-blocked') {
        setError('THE POPUP WAS BLOCKED BY YOUR BROWSER. PLEASE ENABLE POPUPS FOR THIS SITE.');
      } else {
        setError(err.message.toUpperCase());
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
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const { user: newUser } = userCredential;
        
        // Update Firebase Auth profile
        await firebaseUpdateProfile(newUser, {
          displayName: displayName || 'Teacher'
        });

        // Create personalized profile in Firestore
        const newProfile: any = {
          uid: newUser.uid,
          email,
          displayName: displayName || 'Teacher',
          school: school || 'Ghana Education Service',
          level: level,
          subjectsTaught: subjectsTaught.split(',').map(s => s.trim()).filter(Boolean),
          trialStartDate: serverTimestamp(),
          subscriptionStatus: 'trial',
          trialResetMay2026Applied: true, // Mark reset applied to avoid overwriting their brand-new signup date
          onboardingComplete: true, // Mark as complete since they filled it during registration
          createdAt: serverTimestamp(),
        };
        
        await setDoc(doc(db, 'users', newUser.uid), newProfile);
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
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#F8F9FA] relative overflow-hidden font-sans">
      {/* Background Ornaments */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-deep rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-ghana-gold rounded-full blur-[140px]" />
      </div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-xl bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] overflow-hidden relative border border-slate-100/50"
      >
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-ghana-red via-ghana-gold to-ghana-green" />
        
        <div className="pt-12 pb-8 px-12 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-deep rounded-3xl shadow-xl shadow-emerald-900/20 mb-6 -rotate-3 hover:rotate-0 transition-transform duration-500">
            <GraduationCap size={40} className="text-white" />
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase leading-none mb-2">
            TeachSmart
          </h1>
          <p className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.4em] mb-4">
            Ghana Education System
          </p>
          <div className="h-px w-12 bg-slate-100 mx-auto mb-4" />
          <p className="text-slate-500 text-sm font-medium italic max-w-xs mx-auto leading-relaxed">
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
                onClick={handleGuestSignIn}
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
        
        <div className="py-5 bg-gradient-to-b from-white to-slate-50 text-center px-12 border-t border-slate-100">
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] leading-relaxed">
            Personalized Professional Access System 🇬🇭
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
