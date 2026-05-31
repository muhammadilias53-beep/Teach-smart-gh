import React, { useEffect, useState } from 'react';
import { motion, animate, AnimatePresence } from 'motion/react';
import { 
  FileText, Calendar, PenTool, BookOpen, ArrowRight, Zap, 
  Trophy, Package, Activity, Target, Award, TrendingUp, Clock, 
  ShieldCheck, Heart, CheckCircle, MessageSquare
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { differenceInDays } from 'date-fns';
import { cn } from '../../lib/utils';
import { collection, query, where, orderBy, limit, getDocs, getCountFromServer } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { handleFirestoreError, OperationType } from '../../lib/firestore-errors';
import { Logo } from '../common/Logo';
import { SafeMarkdown } from '../common/SafeMarkdown';
import { BrandedPlaceholder } from '../common/BrandedPlaceholder';
import { toast } from 'react-hot-toast';
import { Download, X, ExternalLink, Mail, Loader2, Send } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { AdminNotificationPanel } from './AdminNotificationPanel';

const AnimatedCounter = ({ value, duration = 1.5 }: { value: number, duration?: number }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const safeValue = isNaN(value) ? 0 : value;
    const controls = animate(0, safeValue, {
      duration: duration,
      onUpdate: (latest) => setDisplayValue(Math.floor(latest)),
      ease: "easeOut"
    });
    return () => controls.stop();
  }, [value, duration]);

  return <span>{displayValue}</span>;
};

const Dashboard = () => {
  const { profile, user, getTrialDaysLeft, daysLeft, isSubscriptionActive } = useAuth();
  const hasActiveSubscription = isSubscriptionActive();
  const [recentDocs, setRecentDocs] = useState<any[]>([]);
  const [loadingDocs, setLoadingDocs] = useState(true);
  const [viewingDoc, setViewingDoc] = useState<any>(null);
  const [stats, setStats] = useState({
    lessonPlans: 0,
    exams: 0,
    schemes: 0,
    notes: 0,
    packs: 0,
    total: 0
  });
  
  const getStartDate = (d: any) => {
    if (!d) return new Date();
    if (typeof d?.toDate === 'function') return d.toDate();
    return new Date(d);
  };

  const isAdmin = user?.email === 'muhammadilias53@gmail.com';

  const [subTimeLeft, setSubTimeLeft] = useState<string>('');

  useEffect(() => {
    if (!profile?.subscriptionEndDate || !isSubscriptionActive()) {
      setSubTimeLeft('');
      return;
    }

    const updateTime = () => {
      const end = new Date(profile.subscriptionEndDate).getTime();
      const now = Date.now();
      const diff = end - now;

      if (diff <= 0) {
        setSubTimeLeft('Expired');
        return;
      }

      if (profile.plan === 'quick_pass') {
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        const pad = (num: number) => String(num).padStart(2, '0');
        setSubTimeLeft(`${pad(hours)}:${pad(minutes)}:${pad(seconds)}`);
      } else {
        const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
        setSubTimeLeft(`${days} day${days > 1 ? 's' : ''}`);
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [profile]);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      try {
        const lpPath = 'lessonPlans';
        const exPath = 'exams';
        const scPath = 'schemes';
        const ntPath = 'notes';
        const pkPath = 'saved_resources';

        // Queries for recent docs
        const lpQ = query(
          collection(db, lpPath),
          where('authorId', '==', user.uid),
          orderBy('createdAt', 'desc'),
          limit(5)
        );
        const exQ = query(
          collection(db, exPath),
          where('authorId', '==', user.uid),
          orderBy('createdAt', 'desc'),
          limit(5)
        );
        const scQ = query(
          collection(db, scPath),
          where('authorId', '==', user.uid),
          orderBy('createdAt', 'desc'),
          limit(5)
        );
        const ntQ = query(
          collection(db, ntPath),
          where('authorId', '==', user.uid),
          orderBy('createdAt', 'desc'),
          limit(5)
        );
        const pkQ = query(
          collection(db, pkPath),
          where('userId', '==', user.uid),
          orderBy('createdAt', 'desc'),
          limit(5)
        );
        
        // Count queries
        const totalLpQ = query(collection(db, lpPath), where('authorId', '==', user.uid));
        const totalExQ = query(collection(db, exPath), where('authorId', '==', user.uid));
        const totalScQ = query(collection(db, scPath), where('authorId', '==', user.uid));
        const totalNtQ = query(collection(db, ntPath), where('authorId', '==', user.uid));
        const totalPkQ = query(collection(db, pkPath), where('userId', '==', user.uid));

        const results = await Promise.all([
          getDocs(lpQ).catch(err => { console.warn("LP fetch failed", err); return null; }),
          getDocs(exQ).catch(err => { console.warn("EX fetch failed", err); return null; }),
          getDocs(scQ).catch(err => { console.warn("SC fetch failed", err); return null; }),
          getDocs(ntQ).catch(err => { console.warn("NT fetch failed", err); return null; }),
          getDocs(pkQ).catch(err => { console.warn("PK fetch failed", err); return null; }),
          getCountFromServer(totalLpQ).catch(() => null),
          getCountFromServer(totalExQ).catch(() => null),
          getCountFromServer(totalScQ).catch(() => null),
          getCountFromServer(totalNtQ).catch(() => null),
          getCountFromServer(totalPkQ).catch(() => null)
        ]);

        const [lpSnap, exSnap, scSnap, ntSnap, pkSnap, countLp, countEx, countSc, countNt, countPk] = results;
        
        const docs: any[] = [];
        if (lpSnap) docs.push(...lpSnap.docs.map(doc => ({ id: doc.id, ...doc.data(), type: 'Lesson Plan' })));
        if (exSnap) docs.push(...exSnap.docs.map(doc => ({ id: doc.id, ...doc.data(), type: 'Exam' })));
        if (scSnap) docs.push(...scSnap.docs.map(doc => ({ id: doc.id, ...doc.data(), type: 'Scheme' })));
        if (ntSnap) docs.push(...ntSnap.docs.map(doc => ({ id: doc.id, ...doc.data(), type: 'Note' })));
        if (pkSnap) docs.push(...pkSnap.docs.map(doc => ({ id: doc.id, ...doc.data(), type: 'Resource Pack' })));

        if (docs.length > 0) {
          docs.sort((a, b) => {
            const tA = a.createdAt?.toMillis?.() || 0;
            const tB = b.createdAt?.toMillis?.() || 0;
            return tB - tA;
          });
          setRecentDocs(docs.slice(0, 5));
        }

        const lpCount = countLp?.data().count || 0;
        const exCount = countEx?.data().count || 0;
        const scCount = countSc?.data().count || 0;
        const ntCount = countNt?.data().count || 0;
        const pkCount = countPk?.data().count || 0;
        
        setStats({
          lessonPlans: lpCount,
          exams: exCount,
          schemes: scCount,
          notes: ntCount,
          packs: pkCount,
          total: lpCount + exCount + scCount + ntCount + pkCount
        });

      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      } finally {
        setLoadingDocs(false);
      }
    };

    fetchData();
  }, [user]);

  const getMasteryLevel = (total: number) => {
    if (total >= 50) return { title: 'Visionary Principal', color: 'text-ghana-gold', icon: Award };
    if (total >= 20) return { title: 'Senior Educator', color: 'text-indigo-500', icon: Trophy };
    if (total >= 5) return { title: 'Accredited Teacher', color: 'text-emerald-deep', icon: Target };
    return { title: 'Novice Instructor', color: 'text-slate-400', icon: Activity };
  };

  const mastery = getMasteryLevel(stats.total);

  const quickActions = [
    { icon: FileText, label: 'New Lesson Plan', path: '/lessons', color: 'bg-emerald-500', bg: 'bg-emerald-50' },
    { icon: Calendar, label: 'Scheme of Work', path: '/schemes', color: 'bg-ghana-gold', bg: 'bg-amber-50' },
    { icon: PenTool, label: 'Create Exam', path: '/exams', color: 'bg-slate-900', bg: 'bg-slate-100' },
    { icon: Package, label: 'Resource Packs', path: '/packs', color: 'bg-indigo-500', bg: 'bg-indigo-50' },
    { icon: BookOpen, label: 'Subject Library', path: '/library', color: 'bg-emerald-deep', bg: 'bg-emerald-50' },
  ];

  return (
    <div className="space-y-12">
      {/* Header Info Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between py-6 border-b border-slate-100 gap-6">
        <div className="flex flex-wrap items-center gap-3 text-[10px] font-black uppercase tracking-widest text-slate-400">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-full border border-slate-100 shadow-sm shrink-0">
            <div className="w-2 h-2 rounded-full bg-emerald-light animate-pulse" />
            <span className="text-emerald-deep">{profile?.school || "Ghana Education Staff"}</span>
          </div>
          <span className="hidden sm:block w-1.5 h-1.5 bg-slate-200 rounded-full" />
          <div className="px-3 py-1.5 bg-slate-50 rounded-full border border-slate-100 shrink-0">
            <span>{profile?.level || "All Grades"}</span>
          </div>
          {profile?.subjectsTaught && profile.subjectsTaught.length > 0 && (
            <>
              <span className="hidden sm:block w-1.5 h-1.5 bg-slate-200 rounded-full" />
              <div className="px-3 py-1.5 bg-indigo-50 text-indigo-500 rounded-full border border-indigo-100 shrink-0">
                <span className="truncate max-w-[120px] inline-block align-middle">{profile.subjectsTaught.join(', ')}</span>
              </div>
            </>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 bg-emerald-900 text-ghana-gold rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-emerald-900/10">
            <ShieldCheck size={12} className="fill-current shrink-0" />
            <span className="whitespace-nowrap">Policy Compliant</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-white text-emerald-deep rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-md border border-slate-100">
            <Zap size={12} className="text-ghana-gold shrink-0" />
            <span className="whitespace-nowrap">Live NaCCA Sync</span>
          </div>
        </div>
      </div>

      <AdminNotificationPanel />

      {/* Admin Oversight */}
      {user?.email === 'muhammadilias53@gmail.com' && (
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-emerald-deep/5 border-2 border-emerald-deep/20 rounded-[3rem] p-8 -mt-6 mb-12 flex flex-col md:flex-row items-center justify-between gap-6"
        >
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-emerald-deep text-white rounded-[1.5rem] flex items-center justify-center shadow-lg shadow-emerald-900/20">
              <ShieldCheck size={32} />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Professional Oversight</h2>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Management Access for Ministry Administrator</p>
            </div>
          </div>
          <Link 
            to="/admin" 
            className="group flex items-center gap-4 bg-slate-900 text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all active:scale-95 shadow-xl shadow-slate-900/10"
          >
            Enter Command Center
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>
      )}

      {/* Stats Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="group bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-emerald-900/5 transition-all duration-500 overflow-hidden relative"
        >
          <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">
            <TrendingUp size={80} />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-2xl group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-500">
                <Activity size={18} />
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Generated</p>
            </div>
            <div className="flex items-end justify-between gap-4">
              <h3 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tighter shrink-0">
                <AnimatedCounter value={stats.total} />
              </h3>
              <div className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full uppercase tracking-tighter whitespace-nowrap">
                Live Docs
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="group bg-slate-900 p-6 rounded-[2rem] border border-slate-800 shadow-sm hover:shadow-xl hover:shadow-indigo-900/10 transition-all duration-500 overflow-hidden relative"
        >
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <mastery.icon size={80} className="text-white" />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 bg-white/10 text-white rounded-2xl group-hover:bg-ghana-gold group-hover:text-slate-900 transition-colors duration-500">
                <ShieldCheck size={18} />
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Expertise Rank</p>
            </div>
            <div className="flex items-end justify-between gap-4">
              <div className="min-w-0">
                <h3 className={cn("text-base sm:text-lg font-black tracking-tight leading-none truncate", mastery.color)}>{mastery.title}</h3>
                <p className="text-[9px] font-bold text-slate-500 uppercase mt-1">Level {Math.floor(stats.total / 10) + 1}</p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="group bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-amber-900/5 transition-all duration-500 overflow-hidden relative"
        >
          <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">
            <Clock size={80} />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 bg-amber-50 text-ghana-gold rounded-2xl group-hover:bg-ghana-gold group-hover:text-white transition-colors duration-500">
                <Calendar size={18} />
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                {isAdmin ? 'Access Status' : (
                  hasActiveSubscription 
                    ? (profile?.plan === 'quick_pass' ? '⚡ 5-Hour Pass' : 'Elite Pro Access')
                    : 'Trial Access'
                )}
              </p>
            </div>
            <div className="flex items-end justify-between gap-4">
              <div className="shrink-0">
                <h3 className={cn(
                  "font-black text-slate-900 tracking-tighter truncate",
                  hasActiveSubscription && profile?.plan === 'quick_pass'
                    ? "text-2xl sm:text-3xl font-mono text-emerald-600"
                    : "text-3xl sm:text-4xl"
                )}>
                  {isAdmin ? '∞' : (
                    hasActiveSubscription
                      ? subTimeLeft
                      : <><AnimatedCounter value={daysLeft} /><span className="text-2xl ml-1">d</span></>
                  )}
                </h3>
                <div className={cn(
                  "text-[9px] font-bold px-2 py-1 rounded-full uppercase tracking-tighter whitespace-nowrap mt-1 inline-block",
                  isAdmin ? "text-emerald-600 bg-emerald-50" : (
                    hasActiveSubscription
                      ? "text-emerald-700 bg-emerald-50 animate-pulse font-extrabold"
                      : "text-ghana-red bg-red-50 animate-pulse"
                  )
                )}>
                  {isAdmin ? 'Lifetime Holder' : (
                    hasActiveSubscription ? 'Active Membership' : 'Days Left'
                  )}
                </div>
              </div>
              
              {!isAdmin && !hasActiveSubscription && (
                <Link 
                  to="/billing" 
                  className="px-4 py-2 bg-emerald-deep text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-900 transition-all shadow-lg shadow-emerald-900/20 active:scale-95"
                >
                  Upgrade
                </Link>
              )}
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="group bg-emerald-deep p-6 rounded-[2rem] border border-emerald-800 shadow-sm hover:shadow-xl hover:shadow-emerald-900/20 transition-all duration-500 overflow-hidden relative"
        >
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <ShieldCheck size={80} className="text-white" />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 bg-white/10 text-white rounded-2xl group-hover:bg-ghana-gold group-hover:text-slate-900 transition-colors duration-500">
                <ShieldCheck size={18} />
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest text-emerald-text/60">
                Trust & Verification
              </p>
            </div>
            <div className="flex items-end justify-between gap-4">
              <div className="shrink-0">
                <h3 className="text-3xl sm:text-4xl font-black text-white tracking-tighter">
                  Verified
                </h3>
                <div className="text-[9px] font-bold px-2 py-1 rounded-full uppercase tracking-tighter text-ghana-gold bg-white/10 mt-1">
                  NaCCA Compliant Profile
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Hero Section */}
      <header className="relative bg-emerald-deep text-white p-12 lg:p-16 rounded-[4rem] overflow-hidden shadow-2xl shadow-emerald-900/20 group">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-emerald-mid rounded-full translate-x-1/4 -translate-y-1/4 blur-[100px] opacity-40 group-hover:opacity-60 transition-opacity duration-1000" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-ghana-gold/10 rounded-full -translate-x-1/4 translate-y-1/4 blur-[120px] group-hover:opacity-30 transition-opacity duration-1000" />
        
        <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-4">
            <p className="text-ghana-gold font-black text-[10px] tracking-[0.4em] uppercase opacity-70">Professional Dashboard</p>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-black leading-tight tracking-tighter">
              Amaraaba Teacher, <span className="text-white underline decoration-ghana-gold decoration-4 underline-offset-8">{profile?.displayName?.split(' ')[0] || user?.email?.split('@')[0]}</span>.
            </h1>
            <p className="text-emerald-text/70 max-w-sm text-base lg:text-lg font-medium leading-relaxed italic">
              {profile?.school ? `Proud educator at ${profile.school}.` : "Empowering your classroom with NaCCA-aligned AI tools."}
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <Link to="/lessons" className="btn-secondary group shadow-2xl shadow-ghana-gold/30">
                Generate Lesson Plan
                <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
              </Link>
              <Link to="/ai" className="btn-ghost backdrop-blur-md">
                Consult AI Tutor
              </Link>
            </div>
          </div>

          <div className="hidden lg:flex justify-end pr-8">
             <div className="relative">
                <div className="absolute -inset-4 bg-ghana-gold/20 rounded-full blur-2xl animate-pulse" />
                <div className="w-48 h-48 rounded-[3rem] border-4 border-white/10 flex items-center justify-center bg-white/5 backdrop-blur-xl relative overflow-hidden">
                   {profile?.photoURL && profile.photoURL !== "" ? (
                     <img src={profile.photoURL || null} alt={profile.displayName || 'User'} className="w-full h-full object-cover" />
                   ) : (
                     <Logo iconOnly size="lg" className="w-24 h-24" />
                   )}
                </div>
             </div>
          </div>
        </div>
      </header>

      {/* Detailed Generation Progress */}
      <section className="bg-slate-900 rounded-[3rem] p-10 lg:p-12 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 p-12 opacity-10">
          <Activity size={120} />
        </div>
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center">
                <FileText size={20} />
              </div>
              <h3 className="font-black uppercase tracking-tight text-sm">Lesson Plans</h3>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold text-slate-400">
                <span>PROGRESS</span>
                <span><AnimatedCounter value={stats.lessonPlans} />/25</span>
              </div>
              <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(100, (stats.lessonPlans / 25) * 100)}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="h-full bg-emerald-500" 
                />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-ghana-gold rounded-xl flex items-center justify-center text-slate-900">
                <Calendar size={20} />
              </div>
              <h3 className="font-black uppercase tracking-tight text-sm">Schemes</h3>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold text-slate-400">
                <span>PROGRESS</span>
                <span><AnimatedCounter value={stats.schemes} />/10</span>
              </div>
              <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(100, (stats.schemes / 10) * 100)}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="h-full bg-ghana-gold" 
                />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-900">
                <PenTool size={20} />
              </div>
              <h3 className="font-black uppercase tracking-tight text-sm">Exams</h3>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold text-slate-400">
                <span>PROGRESS</span>
                <span><AnimatedCounter value={stats.exams} />/15</span>
              </div>
              <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(100, (stats.exams / 15) * 100)}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="h-full bg-white" 
                />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center text-white">
                <BookOpen size={20} />
              </div>
              <h3 className="font-black uppercase tracking-tight text-sm">Lesson Notes</h3>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold text-slate-400">
                <span>PROGRESS</span>
                <span><AnimatedCounter value={stats.notes} />/20</span>
              </div>
              <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(100, (stats.notes / 20) * 100)}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="h-full bg-blue-500" 
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Actions Grid */}
      <section>
        <div className="flex items-center gap-4 mb-10 pl-2">
            <h2 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400">Toolkit</h2>
            <div className="h-[1px] flex-1 bg-slate-100" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickActions.map((action, idx) => (
            <motion.div
              key={action.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <Link to={action.path} className="card-fancy group flex flex-col items-center text-center !p-10 !rounded-[2.5rem]">
                <div className={cn("w-16 h-16 rounded-3xl flex items-center justify-center mb-8 transition-all group-hover:scale-110 shadow-lg", action.bg, "group-hover:bg-slate-900")}>
                  <action.icon size={28} className={cn(action.color.replace('bg-', 'text-'), "group-hover:text-white")} />
                </div>
                <h3 className="font-black text-slate-900 text-lg group-hover:text-emerald-deep transition-colors tracking-tight leading-tight">{action.label}</h3>
                <p className="text-[10px] text-slate-400 mt-3 font-bold uppercase tracking-widest">{action.label.includes('AI') ? 'Intelligent' : 'NaCCA Standard'}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Regulatory Compliance Section */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-gradient-to-br from-indigo-900 to-slate-900 rounded-[3rem] p-10 text-white relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-ghana-gold/10 rounded-full blur-3xl -translate-y-12 translate-x-12" />
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-ghana-gold/20 rounded-xl flex items-center justify-center text-ghana-gold">
                <ShieldCheck size={24} />
              </div>
              <h2 className="text-xl font-black uppercase tracking-tight">Regulatory & Policy Alignment</h2>
            </div>
            <p className="text-emerald-text/70 mb-8 max-w-xl text-sm leading-relaxed">
              TeachSmart is fully integrated with the National Council for Curriculum and Assessment (NaCCA) standards. Our AI engine is calibrated to Ghanaian educational policies, ensuring your professional documents are always audit-ready.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
              <div className="space-y-2">
                <p className="text-[10px] font-black text-ghana-gold uppercase tracking-widest">Curriculum</p>
                <div className="flex items-center gap-2">
                  <CheckCircle size={14} className="text-emerald-400" />
                  <span className="text-xs font-bold">Standard-Based</span>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-[10px] font-black text-ghana-gold uppercase tracking-widest">Data Privacy</p>
                <div className="flex items-center gap-2">
                  <CheckCircle size={14} className="text-emerald-400" />
                  <span className="text-xs font-bold">Act 843 Compliant</span>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-[10px] font-black text-ghana-gold uppercase tracking-widest">Accessibility</p>
                <div className="flex items-center gap-2">
                  <CheckCircle size={14} className="text-emerald-400" />
                  <span className="text-xs font-bold">Inclusive Ready</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-emerald-deep rounded-[3rem] p-10 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <CheckCircle size={80} />
          </div>
          <div className="space-y-4 relative z-10">
            <h3 className="text-lg font-black text-white uppercase tracking-tight">Platform Integrity</h3>
            <p className="text-emerald-text/60 text-xs leading-relaxed">
              Automated audits verify every generation against NaCCA indicators before presenting it to you.
            </p>
          </div>
          <div className="pt-6 relative z-10">
            <div className="flex justify-between items-center mb-2">
              <span className="text-[10px] font-black text-emerald-text/40 uppercase tracking-widest">Engine Status</span>
              <span className="text-[10px] font-black text-ghana-gold uppercase">Synchronized</span>
            </div>
            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
               <div className="h-full w-[94%] bg-ghana-gold shadow-[0_0_10px_rgba(255,215,0,0.5)]" />
            </div>
          </div>
        </div>
      </section>

      {/* Help & Customer Support Section */}
      <section className="bg-emerald-50/60 rounded-[3rem] p-8 md:p-10 border border-emerald-100/50 flex flex-col md:flex-row items-center justify-between gap-6" id="dashboard-support-section">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 bg-emerald-700 text-white rounded-2xl flex items-center justify-center font-black shadow-md shadow-emerald-900/10 shrink-0">
            <MessageSquare size={24} />
          </div>
          <div>
            <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Need Help or Have a Complaint?</h3>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">Get in touch directly with the Admin Team on WhatsApp to launch any complaint or question</p>
          </div>
        </div>
        <a
          href={`https://wa.me/${((import.meta as any).env.VITE_ADMIN_WHATSAPP || "233556231544").replace(/[^0-9]/g, '')}?text=${encodeURIComponent("Hello TeachSmart Admin, I have a support request/complaint regarding the TeachSmart Ghana application:")}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 px-6 py-3.5 bg-emerald-900 text-white hover:bg-emerald-800 transition-all rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-emerald-900/15"
          id="dashboard-contact-admin-btn"
          aria-label="Contact TeachSmart Admin via WhatsApp for support and complaints"
        >
          <span>Contact Admin on WhatsApp</span>
          <ArrowRight size={14} />
        </a>
      </section>

      {/* Main Preview Work Area */}
      <div className="grid lg:grid-cols-1 gap-8">
        <div className={cn(
          "bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden flex flex-col shadow-sm transition-all duration-500",
          recentDocs.length === 0 && !loadingDocs ? "card-fancy" : ""
        )}>
            <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
              <div>
                <h2 className="text-lg font-black text-slate-900 tracking-tight">Recent Documents</h2>
                <p className="text-xs text-slate-500 font-medium italic mt-0.5">Your most recently generated educational materials</p>
              </div>
              <Link to="/library" className="text-xs font-black uppercase tracking-widest text-emerald-deep hover:text-emerald-light transition-colors">
                Library Archive
              </Link>
            </div>
            
            <div className="overflow-x-auto min-h-[400px] custom-scrollbar">
                {recentDocs.length === 0 && !loadingDocs ? (
                  <div className="p-8">
                    <BrandedPlaceholder 
                      title="No Documents Found"
                      description="You have not created any resources yet. Use our toolkit above to instantly draft Schemes of Learning, Lesson Notes, and Exam Question Papers aligned with approved NaCCA indicators."
                    />
                  </div>
                ) : (
                  <table className="w-full">
                   <thead>
                      <tr className="bg-slate-50/50">
                        <th className="px-8 py-5 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">Document Title</th>
                        <th className="px-8 py-5 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">Context</th>
                        <th className="px-8 py-5 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">Category</th>
                        <th className="px-8 py-5 text-right text-[10px] font-black uppercase tracking-widest text-slate-400">Action</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-50">
                      {loadingDocs ? (
                        <tr>
                           <td colSpan={4} className="py-20 text-center">
                              <div className="flex flex-col items-center opacity-40">
                                 <div className="w-8 h-8 border-2 border-emerald-deep border-t-transparent rounded-full animate-spin mb-3" />
                                 <p className="text-sm font-bold">Synchronizing...</p>
                              </div>
                           </td>
                        </tr>
                      ) : recentDocs.length > 0 ? (
                        recentDocs.map((doc) => (
                          <tr key={doc.id} className="hover:bg-slate-50 transition-colors">
                            <td className="px-6 py-4 font-bold text-slate-800">{doc.title}</td>
                            <td className="px-6 py-4 text-slate-500 font-medium">{doc.subject} • {doc.level}</td>
                            <td className="px-6 py-4">
                              <span className={cn(
                                "px-2 py-1 rounded-md text-[10px] font-black uppercase",
                                doc.type === 'Exam' ? "bg-purple-100 text-purple-700" : 
                                doc.type === 'Scheme' ? "bg-orange-100 text-orange-700" :
                                doc.type === 'Note' ? "bg-blue-100 text-blue-700" :
                                doc.type === 'Resource Pack' ? "bg-indigo-100 text-indigo-700" :
                                "bg-emerald-100 text-emerald-700"
                              )}>
                                {doc.type === 'Scheme' ? 'Scheme of Learning' : doc.type}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <button 
                                onClick={() => setViewingDoc(doc)}
                                className="text-emerald-deep font-bold hover:underline"
                              >
                                Open
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : null}
                    </tbody>
                 </table>
              )}
            </div>
        </div>
      </div>
      <AnimatePresence>
        {viewingDoc && <DocumentViewerModal doc={viewingDoc} onClose={() => setViewingDoc(null)} />}
      </AnimatePresence>
    </div>
  );
};

const DocumentViewerModal = ({ doc, onClose }: { doc: any, onClose: () => void }) => {
  if (!doc) return null;

  const handleDownload = () => {
    const pdf = new jsPDF();
    const title = doc.title || 'Document';
    
    // Header Branding
    pdf.setFillColor(0, 28, 61); // TeachSmart Deep Blue
    pdf.rect(0, 0, 210, 40, 'F');
    
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(22);
    pdf.setFont('helvetica', 'bold');
    pdf.text('TEACHSMART GHANA', 105, 18, { align: 'center' });
    
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.text('OFFICIAL NaCCA CURRICULUM COMPLIANT DOCUMENT', 105, 26, { align: 'center' });
    
    pdf.setDrawColor(252, 209, 22); // Ghana Gold
    pdf.setLineWidth(1);
    pdf.line(40, 32, 170, 32);

    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text(title.toUpperCase(), 105, 55, { align: 'center' });
    
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`CATEGORY: ${doc.type} | SUBJECT: ${doc.subject} | LEVEL: ${doc.level}`, 105, 62, { align: 'center' });
    
    let content = "";
    if (doc.type === 'Lesson Plan') {
      content = `PHASE 1: STARTER\n-----------------\n${doc.phase1}\n\nPHASE 2: MAIN\n-----------------\n${doc.phase2}\n\nPHASE 3: PLENARY\n-----------------\n${doc.phase3}`;
    } else if (doc.type === 'Exam') {
      content = `QUESTIONS\n-----------------\n${doc.questions}\n\nMARKING SCHEME\n-----------------\n${doc.markingScheme}`;
    } else if (doc.type === 'Note') {
      content = `TOPIC: ${doc.title}\n\nCONTENT\n-----------------\n${doc.content}\n\nSUMMARY\n-----------------\n${doc.summary?.join('\n')}\n\nQUESTIONS\n-----------------\n${doc.questions?.join('\n')}`;
    } else {
      content = doc.content || "";
    }

    const lines = content.split('\n');
    let cursorY = 75;
    const pageHeight = pdf.internal.pageSize.height;
    const maxContentY = pageHeight - 30;
    const marginX = 20;

    const addNewPage = () => {
      pdf.addPage();
      cursorY = 25;
    };

    let i = 0;
    while (i < lines.length) {
      const origLine = lines[i];
      const trimmedLine = origLine.trim();

      if (trimmedLine === '') {
        cursorY += 4;
        i++;
        continue;
      }

      // Render Markdown Tables using autoTable
      if (trimmedLine.startsWith('|')) {
        const tableLines: string[] = [];
        while (i < lines.length && lines[i].trim().startsWith('|')) {
          tableLines.push(lines[i].trim());
          i++;
        }

        if (tableLines.length > 0) {
          let headers: string[] = [];
          const bodyRows: string[][] = [];

          tableLines.forEach((tLine, tIdx) => {
            const row = tLine.split('|').filter((_, colIdx, arr) => colIdx > 0 && colIdx < arr.length - 1).map(c => c.trim());
            if (row.length > 0) {
              if (tIdx === 0) {
                headers = row;
              } else if (!tLine.includes('---')) {
                bodyRows.push(row);
              }
            }
          });

          if (headers.length > 0 || bodyRows.length > 0) {
            if (cursorY + 15 > maxContentY) {
              addNewPage();
            }

            autoTable(pdf, {
              head: headers.length > 0 ? [headers] : [],
              body: bodyRows,
              startY: cursorY + 2,
              theme: 'grid',
              styles: { fontSize: 8.5, cellPadding: 3.5, valign: 'middle' },
              headStyles: { fillColor: [0, 28, 61], textColor: 255, fontStyle: 'bold', halign: 'center' },
              alternateRowStyles: { fillColor: [248, 250, 252] },
              margin: { left: marginX, right: marginX },
            });

            cursorY = (pdf as any).lastAutoTable.finalY + 6;
          }
        }
        continue;
      }

      // Standard text line
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(10);
      
      const cleanLine = origLine.replace(/[#*]/g, '');
      const splitLines = pdf.splitTextToSize(cleanLine, 170);
      
      splitLines.forEach((sLine: string) => {
        if (cursorY > maxContentY) {
          addNewPage();
        }
        pdf.text(sLine, marginX, cursorY);
        cursorY += 6;
      });

      i++;
    }

    // Footer on all pages
    const pageCount = (pdf.internal as any).getNumberOfPages();
    for(let pageNum = 1; pageNum <= pageCount; pageNum++) {
        pdf.setPage(pageNum);
        pdf.setDrawColor(200, 200, 200);
        pdf.setLineWidth(0.5);
        pdf.line(10, pageHeight - 20, 200, pageHeight - 20);

        pdf.setFontSize(7);
        pdf.setTextColor(100);
        pdf.setFont('helvetica', 'italic');
        const complianceMsg = [
          'NaCCA COMPLIANCE NOTE: This document is aligned with the official National Council for Curriculum and Assessment (NaCCA) standard-based curriculum of Ghana.',
          'Teachers are encouraged to adapt the content to suit their learner\'s diverse needs while maintaining core competency targets and SBC learning indicators.'
        ];
        
        let footerY = pageHeight - 16;
        complianceMsg.forEach(msg => {
          pdf.text(msg, 105, footerY, { align: 'center' });
          footerY += 3.5;
        });

        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(0, 107, 63); // Ghana Green
        pdf.setFontSize(8);
        pdf.text('TEACHSMART GHANA • AI-POWERED NaCCA COMPLIANT TOOLS', 105, pageHeight - 5, { align: 'center' });
        
        pdf.setTextColor(150);
        pdf.setFont('helvetica', 'normal');
        pdf.text(`Page ${pageNum} of ${pageCount}`, 200, pageHeight - 5, { align: 'right' });
    }

    pdf.save(`${title.replace(/\s+/g, '_')}_TeachSmart.pdf`);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white w-full max-w-4xl max-h-[90vh] rounded-[3rem] shadow-2xl overflow-hidden flex flex-col"
      >
        <div className="p-6 md:p-8 border-b border-slate-100 flex justify-between items-center bg-slate-900 text-white">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/10 rounded-2xl">
              <FileText size={24} className="text-emerald-400" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-emerald-400 opacity-60">{doc.type} Viewer</p>
              <h2 className="text-xl font-black truncate max-w-[200px] md:max-w-md">{doc.title}</h2>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={handleDownload}
              className="hidden md:flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-emerald-500/20"
            >
              <Download size={16} />
              Export PDF
            </button>
            <button 
              onClick={onClose}
              className="w-12 h-12 flex items-center justify-center hover:bg-white/10 rounded-full transition-colors border border-white/10"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-8 md:p-12 space-y-8 bg-slate-50/50">
          <div className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-sm border border-slate-100">
            {doc.type === 'Lesson Plan' ? (
              <div className="space-y-10">
                <section>
                  <h3 className="text-xs font-black text-emerald-600 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 bg-emerald-600 rounded-full" />
                    Phase 1: Starter
                  </h3>
                  <div className="markdown-body prose max-w-none">
                    <SafeMarkdown>{doc.phase1}</SafeMarkdown>
                  </div>
                </section>
                <div className="h-px bg-slate-100" />
                <section>
                  <h3 className="text-xs font-black text-emerald-600 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 bg-emerald-600 rounded-full" />
                    Phase 2: Main
                  </h3>
                  <div className="markdown-body prose max-w-none">
                    <SafeMarkdown>{doc.phase2}</SafeMarkdown>
                  </div>
                </section>
                <div className="h-px bg-slate-100" />
                <section>
                  <h3 className="text-xs font-black text-emerald-600 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 bg-emerald-600 rounded-full" />
                    Phase 3: Plenary
                  </h3>
                  <div className="markdown-body prose max-w-none">
                    <SafeMarkdown>{doc.phase3}</SafeMarkdown>
                  </div>
                </section>
              </div>
            ) : doc.type === 'Exam' ? (
              <div className="space-y-10">
                <section>
                  <h3 className="text-xs font-black text-indigo-600 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 bg-indigo-600 rounded-full" />
                    Examination Questions
                  </h3>
                  <div className="markdown-body prose max-w-none">
                    <SafeMarkdown>{doc.questions}</SafeMarkdown>
                  </div>
                </section>
                <div className="h-px bg-slate-100" />
                <section>
                  <h3 className="text-xs font-black text-emerald-600 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 bg-emerald-600 rounded-full" />
                    Marking Scheme
                  </h3>
                  <div className="markdown-body prose max-w-none">
                    <SafeMarkdown>{doc.markingScheme}</SafeMarkdown>
                  </div>
                </section>
              </div>
            ) : doc.type === 'Note' ? (
              <div className="space-y-10">
                <section>
                  <h3 className="text-xs font-black text-blue-600 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 bg-blue-600 rounded-full" />
                    Lesson Content
                  </h3>
                  <div className="markdown-body prose max-w-none">
                    <SafeMarkdown>{doc.content}</SafeMarkdown>
                  </div>
                </section>
                <div className="h-px bg-slate-100" />
                {doc.summary && (
                  <section>
                    <h3 className="text-xs font-black text-ghana-gold uppercase tracking-widest mb-4 flex items-center gap-2">
                      <span className="w-2 h-2 bg-ghana-gold rounded-full" />
                      Key Summary
                    </h3>
                    <ul className="list-disc pl-5 space-y-2">
                      {doc.summary.map((point: string, i: number) => (
                        <li key={i} className="text-sm font-medium text-slate-600">{point}</li>
                      ))}
                    </ul>
                  </section>
                )}
                <div className="h-px bg-slate-100" />
                {doc.questions && (
                  <section>
                    <h3 className="text-xs font-black text-emerald-600 uppercase tracking-widest mb-4 flex items-center gap-2">
                      <span className="w-2 h-2 bg-emerald-600 rounded-full" />
                      Review Questions
                    </h3>
                    <ul className="list-decimal pl-5 space-y-3">
                      {doc.questions.map((q: string, i: number) => (
                        <li key={i} className="text-sm font-bold text-slate-700">{q}</li>
                      ))}
                    </ul>
                  </section>
                )}
              </div>
            ) : (
              <div className="markdown-body prose max-w-none">
                <SafeMarkdown>{doc.content}</SafeMarkdown>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
