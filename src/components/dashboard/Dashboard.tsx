import React, { useEffect, useState } from 'react';
import { motion, animate, AnimatePresence } from 'motion/react';
import { 
  FileText, Calendar, PenTool, BookOpen, ArrowRight, Zap, 
  Trophy, Package, Activity, Target, Award, TrendingUp, Clock, 
  ShieldCheck, Heart, CheckCircle
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
import { Download, X, ExternalLink } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const AnimatedCounter = ({ value, duration = 1.5 }: { value: number, duration?: number }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const controls = animate(0, value, {
      duration: duration,
      onUpdate: (latest) => setDisplayValue(Math.floor(latest)),
      ease: "easeOut"
    });
    return () => controls.stop();
  }, [value, duration]);

  return <span>{displayValue}</span>;
};

const Dashboard = () => {
  const { profile, user } = useAuth();
  const [recentDocs, setRecentDocs] = useState<any[]>([]);
  const [loadingDocs, setLoadingDocs] = useState(true);
  const [viewingDoc, setViewingDoc] = useState<any>(null);
  const [stats, setStats] = useState({
    lessonPlans: 0,
    exams: 0,
    schemes: 0,
    total: 0
  });
  
  const getStartDate = (d: any) => {
    if (!d) return new Date();
    if (typeof d?.toDate === 'function') return d.toDate();
    return new Date(d);
  };

  const trialDays = profile ? differenceInDays(new Date(), getStartDate(profile.trialStartDate)) : 0;
  const daysLeft = Math.max(0, 3 - trialDays);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      try {
        const lpPath = 'lessonPlans';
        const exPath = 'exams';
        const scPath = 'schemes';

        // Queries for recent docs
        const lpQ = query(
          collection(db, lpPath),
          where('authorId', '==', user.uid),
          orderBy('createdAt', 'desc'),
          limit(3)
        );
        const exQ = query(
          collection(db, exPath),
          where('authorId', '==', user.uid),
          orderBy('createdAt', 'desc'),
          limit(3)
        );
        const scQ = query(
          collection(db, scPath),
          where('authorId', '==', user.uid),
          orderBy('createdAt', 'desc'),
          limit(3)
        );
        
        // Count queries
        const totalLpQ = query(collection(db, lpPath), where('authorId', '==', user.uid));
        const totalExQ = query(collection(db, exPath), where('authorId', '==', user.uid));
        const totalScQ = query(collection(db, scPath), where('authorId', '==', user.uid));

        const [lpSnap, exSnap, scSnap, countLp, countEx, countSc] = await Promise.all([
          getDocs(lpQ).catch(err => handleFirestoreError(err, OperationType.LIST, lpPath)),
          getDocs(exQ).catch(err => handleFirestoreError(err, OperationType.LIST, exPath)),
          getDocs(scQ).catch(err => handleFirestoreError(err, OperationType.LIST, scPath)),
          getCountFromServer(totalLpQ),
          getCountFromServer(totalExQ),
          getCountFromServer(totalScQ)
        ]);
        
        if (lpSnap && exSnap && scSnap) {
          const docs = [
            ...lpSnap.docs.map(doc => ({ id: doc.id, ...doc.data(), type: 'Lesson Plan' })),
            ...exSnap.docs.map(doc => ({ id: doc.id, ...doc.data(), type: 'Exam' })),
            ...scSnap.docs.map(doc => ({ id: doc.id, ...doc.data(), type: 'Scheme' }))
          ].sort((a: any, b: any) => {
            const tA = a.createdAt?.toMillis?.() || 0;
            const tB = b.createdAt?.toMillis?.() || 0;
            return tB - tA;
          }).slice(0, 5);

          setRecentDocs(docs);
        }

        if (countLp && countEx && countSc) {
          const lpCount = countLp.data().count;
          const exCount = countEx.data().count;
          const scCount = countSc.data().count;
          setStats({
            lessonPlans: lpCount,
            exams: exCount,
            schemes: scCount,
            total: lpCount + exCount + scCount
          });
        }

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
    <div className="space-y-12 pb-20">
      {/* Header Info Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between py-6 border-b border-slate-100 gap-4">
        <div className="flex items-center gap-4 text-xs font-black uppercase tracking-widest text-slate-400">
          <div className="flex items-center gap-2 px-3 py-1 bg-white rounded-full border border-slate-100 shadow-sm">
            <div className="w-2 h-2 rounded-full bg-emerald-light animate-pulse" />
            <span className="text-emerald-deep">{profile?.school || "Ghana Education Staff"}</span>
          </div>
          <span className="w-1 h-1 bg-slate-300 rounded-full" />
          <span>{profile?.level || "All Grades"}</span>
        </div>
        <div className="flex items-center gap-2 px-4 py-1.5 bg-emerald-900 text-ghana-gold rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-emerald-900/10">
          <ShieldCheck size={12} className="fill-current" />
          <span>Policy Compliant Platform</span>
        </div>
        <div className="flex items-center gap-2 px-4 py-1.5 bg-white text-emerald-deep rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-md border border-slate-100">
          <Zap size={12} className="fill-current text-ghana-gold underline" />
          <span>Live NaCCA Sync Engine</span>
        </div>
      </div>

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
            <div className="flex items-end justify-between">
              <h3 className="text-4xl font-black text-slate-900 tracking-tighter">
                <AnimatedCounter value={stats.total} />
              </h3>
              <div className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full uppercase tracking-tighter">
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
            <div className="flex items-end justify-between">
              <div>
                <h3 className={cn("text-lg font-black tracking-tight leading-none", mastery.color)}>{mastery.title}</h3>
                <p className="text-[10px] font-bold text-slate-500 uppercase mt-1">Level {Math.floor(stats.total / 10) + 1}</p>
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
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Trial Access</p>
            </div>
            <div className="flex items-end justify-between">
              <h3 className="text-4xl font-black text-slate-900 tracking-tighter">
                <AnimatedCounter value={daysLeft} />
                <span className="text-2xl ml-1">d</span>
              </h3>
              <div className="text-[10px] font-bold text-ghana-red bg-red-50 px-2 py-1 rounded-full uppercase tracking-tighter animate-pulse">
                Days Left
              </div>
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
            <Zap size={80} className="text-white" />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 bg-white/10 text-white rounded-2xl group-hover:bg-white group-hover:text-emerald-deep transition-colors duration-500">
                <Heart size={18} />
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest text-emerald-text/60">Resource Power</p>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-baseline">
                 <h3 className="text-2xl font-black text-white tracking-tight">
                   <AnimatedCounter value={Math.min(100, Math.round((stats.total / 50) * 100))} />
                   <span className="text-sm opacity-60 ml-0.5">%</span>
                 </h3>
                 <span className="text-[9px] font-black text-ghana-gold uppercase tracking-widest">Efficiency</span>
              </div>
              <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                 <motion.div 
                   initial={{ width: 0 }}
                   animate={{ width: `${Math.min(100, (stats.total / 50) * 100)}%` }}
                   transition={{ duration: 1.5, ease: "easeOut" }}
                   className="h-full bg-ghana-gold" 
                 />
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
          <div className="space-y-6">
            <h1 className="text-4xl lg:text-6xl font-black leading-[1.1] tracking-tighter">
              Hello, <span className="text-ghana-gold">Teacher {profile?.displayName?.split(' ')[0] || user?.email?.split('@')[0]}</span>.
            </h1>
            <p className="text-emerald-text/70 max-w-sm text-lg font-medium leading-relaxed italic">
              Your professional AI suite for NaCCA-aligned lesson plans, schemes, and official WAEC-standard exams.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <Link to="/lessons" className="btn-secondary group shadow-2xl shadow-ghana-gold/30">
                Generate Lesson Plan
                <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
              </Link>
              <Link to="/ai" className="btn-ghost backdrop-blur-md">
                Chat with Assistant
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
        <div className="relative z-10 grid md:grid-cols-3 gap-12">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center">
                <FileText size={20} />
              </div>
              <h3 className="font-black uppercase tracking-tight">Lesson Plans</h3>
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
              <h3 className="font-black uppercase tracking-tight">Schemes</h3>
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
              <h3 className="font-black uppercase tracking-tight">Exams</h3>
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

      {/* Main Preview Work Area */}
      <div className="grid lg:grid-cols-1 gap-8">
        <div className="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden flex flex-col shadow-sm">
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
                      ) : (
                        <tr>
                          <td colSpan={4} className="py-20 text-center">
                             <div className="flex flex-col items-center opacity-40">
                                <FileText size={48} className="text-slate-300 mb-3" />
                                <p className="text-sm font-bold italic">No records found yet</p>
                                <p className="text-xs mt-1">Generated outputs will appear here automatically</p>
                             </div>
                          </td>
                        </tr>
                      )}
                   </tbody>
                </table>
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
    
    pdf.setFontSize(20);
    pdf.text(title.toUpperCase(), 105, 20, { align: 'center' });
    
    pdf.setFontSize(10);
    pdf.text(`Type: ${doc.type} | Subject: ${doc.subject} | Level: ${doc.level}`, 105, 30, { align: 'center' });
    
    let content = "";
    if (doc.type === 'Lesson Plan') {
      content = `PHASE 1: STARTER\n${doc.phase1}\n\nPHASE 2: MAIN\n${doc.phase2}\n\nPHASE 3: PLENARY\n${doc.phase3}`;
    } else if (doc.type === 'Exam') {
      content = `QUESTIONS\n${doc.questions}\n\nMARKING SCHEME\n${doc.markingScheme}`;
    } else {
      content = doc.content || "";
    }

    const splitText = pdf.splitTextToSize(content, 170);
    let cursorY = 40;
    const pageHeight = pdf.internal.pageSize.height;

    splitText.forEach((line: string) => {
      if (cursorY > pageHeight - 20) {
        pdf.addPage();
        cursorY = 20;
      }
      pdf.text(line, 20, cursorY);
      cursorY += 7;
    });

    pdf.save(`${title.replace(/\s+/g, '_')}.pdf`);
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
