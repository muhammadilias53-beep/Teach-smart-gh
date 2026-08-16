import React from 'react';
import { Navigate, Outlet, useLocation, Link } from 'react-router';
import { useAuth } from '../../contexts/AuthContext';
import { useSidebar } from '../../contexts/SidebarContext';
import { cn } from '../../lib/utils';
import Sidebar from '../layout/Sidebar';
import { TeacherOnboardingGuide } from '../onboarding/TeacherOnboardingGuide';
import { motion } from 'motion/react';
import { differenceInDays } from 'date-fns';
import { Lock, CreditCard, MessageCircle, CheckCircle2 } from 'lucide-react';

const LockedOverlay = () => {
  const whatsappNumber = "0556231544";
  const whatsappUrl = `https://wa.me/233556231544?text=${encodeURIComponent("Hello TeachSmart Admin, my trial has expired and I would like to activate/upgrade my TeachSmart account:")}`;

  return (
    <div className="bg-white rounded-[2.5rem] p-8 md:p-12 border border-slate-100 shadow-xl overflow-hidden relative">
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-50 rounded-full blur-3xl -z-10 opacity-60" />
      <div className="max-w-2xl mx-auto text-center space-y-8 py-6">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-amber-50 text-amber-600 rounded-3xl border border-amber-100 shadow-md">
          <Lock size={32} />
        </div>
        
        <div className="space-y-4">
          <span className="px-3 py-1 bg-amber-500/10 text-amber-600 font-black text-[9px] uppercase tracking-widest rounded-lg border border-amber-500/20">
            Access Suspended
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight leading-none">
            Your Free Trial Has Ended 🇬🇭
          </h2>
          <p className="text-slate-500 text-sm md:text-base font-medium max-w-lg mx-auto leading-relaxed">
            Your 3-day trial has finished, but your teaching journey doesn't have to pause. Upgrade to TeachSmart Elite to continue generating NaCCA-aligned resources daily.
          </p>
        </div>

        {/* Perks Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl mx-auto pt-4 text-left">
          {[
            "Fully aligns with standard NaCCA curriculum updates",
            "Unlimited high-speed lesson plans, schemes, & exams",
            "Saves 10+ hours per week of manual preparation",
            "Export polished resources to PDF and Word DOCX"
          ].map((perk, i) => (
            <div key={i} className="flex items-start gap-3 p-3.5 bg-slate-50 border border-slate-100/50 rounded-2xl">
              <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
              <span className="text-xs font-bold text-slate-700">{perk}</span>
            </div>
          ))}
        </div>

        {/* Plan Summary Row */}
        <div className="bg-slate-900 text-white rounded-[2rem] p-6 max-w-xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 border border-slate-800">
          <div className="text-center sm:text-left">
            <p className="text-[10px] font-black uppercase text-amber-500 tracking-wider">Most Value Pass</p>
            <h4 className="font-black text-lg">Elite Pro Teacher</h4>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-center bg-white/5 border border-white/5 px-4 py-2 rounded-xl">
              <span className="block text-[8px] font-black text-slate-400 uppercase">Termly</span>
              <span className="font-extrabold text-sm text-emerald-400">GHS 50</span>
            </div>
            <div className="text-center bg-emerald-900 border border-emerald-800 px-4 py-2 rounded-xl">
              <span className="block text-[8px] font-black text-emerald-400 uppercase">Yearly</span>
              <span className="font-extrabold text-sm text-ghana-gold">GHS 100</span>
            </div>
          </div>
        </div>

        {/* Response CTA */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link
            to="/billing"
            className="w-full sm:w-auto px-8 py-4 bg-emerald-deep hover:bg-emerald-900 text-white flex items-center justify-center gap-3 transition-all rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg shadow-emerald-950/20"
          >
            <CreditCard size={16} />
            Upgrade Account Instantly
          </Link>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-8 py-4 bg-green-500 hover:bg-green-600 text-white flex items-center justify-center gap-3 transition-all rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg shadow-green-500/10"
          >
            <MessageCircle size={16} />
            Contact Admin (0556231544)
          </a>
        </div>
        
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
          Secured Payments powered by Paystack 🇬🇭
        </p>
      </div>
    </div>
  );
};

const AuthGuard = () => {
  const { user, profile, loading, isTrialActive, isSubscriptionActive, daysLeft } = useAuth();
  const { isCollapsed } = useSidebar();
  const location = useLocation();
  const [tookTooLong, setTookTooLong] = React.useState(false);

  React.useEffect(() => {
    let timer: NodeJS.Timeout;
    if (loading) {
      timer = setTimeout(() => {
        setTookTooLong(true);
      }, 10000); // 10 seconds
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [loading]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50 p-6">
        <div className="flex flex-col items-center text-center max-w-sm">
          <div className="w-12 h-12 border-4 border-emerald-deep border-t-ghana-gold rounded-full animate-spin mb-4" />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 animate-pulse">
              Initializing TeachSmart...
            </p>
            
            {tookTooLong && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="pt-4 space-y-4"
              >
                <p className="text-xs text-slate-500 leading-relaxed font-medium">
                  This is taking longer than expected. Please check your internet connection or try reloading.
                </p>
                <button
                  onClick={() => window.location.reload()}
                  className="px-6 py-3 bg-white border border-slate-200 rounded-xl font-black text-[10px] uppercase tracking-widest text-emerald-deep hover:bg-slate-50 transition-all shadow-sm"
                >
                  Reload Application
                </button>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If user is logged in, but profile isn't loaded yet, keep loading
  if (!profile) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50 p-6">
        <div className="flex flex-col items-center text-center max-w-sm">
          <div className="w-12 h-12 border-4 border-emerald-deep border-t-ghana-gold rounded-full animate-spin mb-4" />
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
            Fetching Profile...
          </p>
        </div>
      </div>
    );
  }

  // Trial/Subscription check using centralized logic
  const isAdmin = user?.email === 'muhammadilias53@gmail.com';
  const hasActiveSubscription = isSubscriptionActive();
  const trialActive = isTrialActive();
  const isUserBlocked = !isAdmin && !trialActive && !hasActiveSubscription;

  // Allowed paths even if expired
  const publicPaths = ['/billing', '/profile'];
  const isPublicPath = publicPaths.includes(location.pathname);
  
  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-slate-950 transition-colors duration-300">
      <Sidebar />
      <TeacherOnboardingGuide />
      <main className={cn(
        "flex-1 pt-24 lg:pt-10 overflow-x-hidden min-w-0 transition-all duration-300",
        isCollapsed ? "lg:ml-20" : "lg:ml-72"
      )}>
        <div className="max-w-7xl mx-auto px-4 lg:px-12 pb-20">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {isUserBlocked && !isPublicPath ? (
              <LockedOverlay />
            ) : (
              <Outlet />
            )}
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default AuthGuard;
