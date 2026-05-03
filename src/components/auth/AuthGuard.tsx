import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Sidebar from '../layout/Sidebar';
import { motion } from 'motion/react';
import { differenceInDays } from 'date-fns';

const AuthGuard = () => {
  const { user, profile, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-emerald-deep border-t-ghana-gold rounded-full animate-spin mb-4" />
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 animate-pulse">Initializing TeachSmart...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const getStartDate = (d: any) => {
    if (!d) return new Date();
    if (typeof d?.toDate === 'function') return d.toDate();
    return new Date(d);
  };

  // Trial/Subscription check
  const trialDays = profile ? differenceInDays(new Date(), getStartDate(profile.trialStartDate)) : 0;
  const isTrialExpired = profile?.subscriptionStatus === 'trial' && trialDays > 30;
  const isExpired = profile?.subscriptionStatus === 'expired' || (profile?.subscriptionEndDate && new Date(profile.subscriptionEndDate) < new Date());
  
  const needsPayment = (isTrialExpired || isExpired) && profile?.subscriptionStatus !== 'active';

  // Allowed paths even if expired
  const publicPaths = ['/billing', '/profile', '/', '/library'];
  const isPublicPath = publicPaths.includes(location.pathname);

  // We allow all navigation regardless of payment status to ensure sidebar responsiveness.
  // Individual features can implement their own restriction UI if needed.
  
  return (
    <div className="flex min-h-screen bg-gray-50">
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
