import React, { useState, useEffect } from 'react';
import { auth } from '../../lib/firebase';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  sendPasswordResetEmail
} from 'firebase/auth';
import { motion } from 'motion/react';
import { GraduationCap, Mail, Lock, User, Chrome, Zap, Info } from 'lucide-react';

import { Logo } from '../common/Logo';

const Login = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleGoogleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (err: any) {
      setError(err.message.toUpperCase());
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setError('PLEASE ENTER YOUR EMAIL ADDRESS FIRST.');
      return;
    }
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      setInfo('PASSWORD RESET EMAIL SENT! PLEASE CHECK YOUR INBOX.');
      setError('');
    } catch (err: any) {
      setError(err.message.toUpperCase());
    } finally {
      setLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setInfo('');
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
    } catch (err: any) {
      console.error(err);
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
    <div className="min-h-screen flex items-center justify-center p-4 bg-cream relative overflow-hidden">
      {/* Background Ornaments */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-emerald-deep/5 rounded-full -translate-x-1/2 -translate-y-1/2 blur-[120px]" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-ghana-gold/10 rounded-full translate-x-1/3 translate-y-1/3 blur-[140px]" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg bg-white rounded-[3rem] shadow-2xl shadow-slate-200/50 overflow-hidden relative border border-slate-100"
      >
        <div className="p-12 text-center relative">
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-ghana-red via-ghana-gold to-ghana-green" />
          <div className="flex justify-center mb-10">
            <Logo iconOnly size="lg" className="w-24 h-24 rounded-[2rem] -rotate-3 hover:rotate-0 transition-transform duration-500 shadow-2xl shadow-emerald-900/30" />
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase leading-none">TeachSmart</h1>
          <p className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.4em] mt-3">Ghana Education System</p>
          <div className="mt-8 flex justify-center">
             <p className="text-slate-400 text-sm font-medium italic max-w-xs leading-relaxed">
               Empowering Ghanaian educators with professional AI generation tools aligned to the national curriculum.
             </p>
          </div>
        </div>

        <div className="px-12 pb-12">
          {error && (
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="mb-8 p-5 bg-rose-50 text-rose-600 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-rose-100 flex items-center gap-4"
            >
              <div className="w-2 h-2 rounded-full bg-rose-600 animate-pulse" />
              {error}
            </motion.div>
          )}

          {info && (
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="mb-8 p-5 bg-emerald-50 text-emerald-600 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-emerald-100 flex items-center gap-4"
            >
              <Info size={16} />
              {info}
            </motion.div>
          )}

          <div className="space-y-6">
            <button 
              onClick={handleGoogleSignIn}
              className="w-full flex items-center justify-center gap-4 px-8 py-5 bg-white border-2 border-slate-50 rounded-2xl font-black text-slate-700 hover:border-emerald-500/20 hover:bg-emerald-50/10 transition-all active:scale-95 shadow-sm text-xs uppercase tracking-widest"
            >
              <div className="w-6 h-6 bg-white rounded-lg flex items-center justify-center shadow-sm border border-slate-100">
                <Chrome size={16} className="text-emerald-deep" />
              </div>
              Sign in with Google Account
            </button>

            <div className="relative py-6 text-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-50" />
              </div>
              <span className="relative px-6 bg-white text-[9px] font-black text-slate-300 uppercase tracking-[0.3em]">Institutional Access</span>
            </div>

            <form onSubmit={handleEmailAuth} className="space-y-4">
              <div className="relative group">
                <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-deep transition-colors" size={18} />
                <input 
                  type="email" 
                  placeholder="EMAIL ADDRESS" 
                  className="input-field pl-16 py-5 rounded-2xl !bg-slate-50/50 text-[11px] font-black tracking-widest uppercase"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="relative group">
                <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-deep transition-colors" size={18} />
                <input 
                  type="password" 
                  placeholder="SECURITY PASSWORD" 
                  className="input-field pl-16 py-5 rounded-2xl !bg-slate-50/50 text-[11px] font-black tracking-widest uppercase"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required={isLogin}
                />
              </div>
              
              {isLogin && (
                <div className="flex justify-end">
                  <button 
                    type="button"
                    onClick={handleForgotPassword}
                    className="text-[9px] font-black text-slate-400 hover:text-emerald-deep uppercase tracking-widest transition-colors"
                  >
                    Forgot Password?
                  </button>
                </div>
              )}

              <button 
                type="submit" 
                className="btn-primary w-full py-5 rounded-2xl shadow-2xl shadow-emerald-900/20 mt-6 font-black uppercase text-[10px] tracking-[0.2em]"
                disabled={loading}
              >
                {loading ? "AUTHENTICATING..." : isLogin ? "ENTER DASHBOARD" : "REGISTER FACULTY"}
              </button>
            </form>
          </div>

          <div className="mt-12 text-center">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
              {isLogin ? "NEW TO TEACHSMART?" : "ALREADY A MEMBER?"}
              <button 
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError('');
                  setInfo('');
                }}
                className="ml-3 text-emerald-deep hover:text-ghana-gold transition-colors underline underline-offset-4"
              >
                {isLogin ? "CREATE ACCOUNT" : "LOGIN HERE"}
              </button>
            </p>
          </div>
        </div>
        
        <div className="py-6 bg-emerald-deep/5 text-center px-12">
          <p className="text-[9px] font-black text-emerald-900/40 uppercase tracking-[0.4em] leading-relaxed">
            Strictly for educational use only. Aligned with NaCCA & GES standards 🇬🇭
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
