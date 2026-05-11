import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Sidebar from '../layout/Sidebar';
import { EduPulseBanner } from '../layout/EduPulseBanner';
import { Onboarding } from '../profile/Onboarding';
import { motion } from 'motion/react';
import { differenceInDays } from 'date-fns';

const AuthGuard = () => {
  const { user, profile, loading, isTrialActive, getTrialDaysLeft } = useAuth();
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
    console.warn(`[AuthGuard] No user found, redirecting to login from ${location.pathname}. Loading state was: ${loading}`);
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

  // Force onboarding if not complete (Skip for anonymous/guest users)
  // Robust check: A profile is complete if the flag is true, OR if they have the minimum required fields
  const hasEssentials = profile.school && profile.level && (profile.subjectsTaught?.length || profile.subjects?.length);
  const isProfileComplete = profile.onboardingComplete === true || !!hasEssentials;

  if (!user.isAnonymous && !isProfileComplete) {
    return <Onboarding />;
  }

  // Trial/Subscription check using centralized logic
  const activeTrial = isTrialActive();
  const daysLeft = getTrialDaysLeft();
  const isExpired = profile?.subscriptionStatus === 'expired' || (profile?.subscriptionEndDate && new Date(profile.subscriptionEndDate) < new Date());
  
  const needsPayment = !activeTrial && isExpired && profile?.subscriptionStatus !== 'active';

  // Allowed paths even if expired
  const publicPaths = ['/billing', '/profile', '/', '/library'];
  const isPublicPath = publicPaths.includes(location.pathname);

  // We allow all navigation regardless of payment status to ensure sidebar responsiveness.
  // Individual features can implement their own restriction UI if needed.
  
  return (
    <div className="flex min-h-screen bg-gray-50">
      <EduPulseBanner />
      <Sidebar />
      <main className="flex-1 lg:ml-72 pt-24 lg:pt-10 overflow-x-hidden min-w-0">
        <div className="max-w-7xl mx-auto px-4 lg:px-12 pb-20">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Outlet />
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default AuthGuard;
