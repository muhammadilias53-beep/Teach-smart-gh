import React, { useState, useEffect } from 'react';
import { MessageSquare, MessageCircle, FileText, Calendar, BookOpen, PenTool, CheckCircle, Menu, X, LogOut, LayoutDashboard, CreditCard, Zap, User, Package, Library, ShieldCheck, Bell, Shield, Atom, Calculator } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

import { Logo } from '../common/Logo';
import { ComplianceModal } from '../common/ComplianceModal';
import { ConfirmationModal } from '../common/ConfirmationModal';
import { NotificationCenter } from './NotificationCenter';
import { PWAInstallButton } from '../common/PWAInstallButton';

const Sidebar = () => {
  const { profile, logout, isTrialActive, isSubscriptionActive, user, daysLeft } = useAuth();
  const location = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [showCompliance, setShowCompliance] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const isAdmin = user?.email === 'muhammadilias53@gmail.com';

  const whatsappNumber = (import.meta as any).env.VITE_ADMIN_WHATSAPP || "233556231544";
  const whatsappUrl = `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent("Hello TeachSmart Admin, I have a question/complaint regarding TeachSmartGH:")}`;

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    { icon: MessageSquare, label: 'AI Tutor', path: '/ai' },
    { icon: FileText, label: 'Lesson Plans', path: '/lessons' },
    { icon: BookOpen, label: 'Lesson Notes', path: '/notes' },
    { icon: Calendar, label: 'Schemes of Work', path: '/schemes' },
    { icon: Package, label: 'Resource Packs', path: '/packs' },
    { icon: Atom, label: 'BSTEM Lab Guide', path: '/bstem-guide' },
    { icon: Calculator, label: 'BSTEM Math Guide', path: '/bstem-math' },
    { icon: Library, label: 'Content Library', path: '/library' },
    { icon: PenTool, label: 'Exams & Tests', path: '/exams' },
    { icon: CreditCard, label: 'Subscription', path: '/billing' },
    { icon: User, label: 'Profile Settings', path: '/profile' },
    { icon: Shield, label: 'Admin Command', path: '/admin', adminOnly: true },
  ];

  const SidebarContent = () => {
    const [subTimeLeft, setSubTimeLeft] = useState<string>('');
    const hasActiveSubscription = isSubscriptionActive();

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
          setSubTimeLeft(`${pad(hours)}:${pad(minutes)}:${pad(seconds)} left`);
        } else {
          const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
          setSubTimeLeft(`${days} day${days > 1 ? 's' : ''} left`);
        }
      };

      updateTime();
      const interval = setInterval(updateTime, 1000);
      return () => clearInterval(interval);
    }, [profile]);

    return (
      <div className="flex flex-col h-full py-8">
      {/* Header */}
      <div className="px-6 mb-10 flex items-center justify-between">
        <Logo />
        <div className="hidden lg:block">
          <NotificationCenter />
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-1.5 custom-scrollbar overflow-y-auto">
        {menuItems.map((item) => {
          if (item.adminOnly && !isAdmin) return null;
          
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setIsMobileOpen(false)}
              className={cn(
                "flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all duration-300 group relative",
                isActive 
                  ? "bg-slate-900 text-white shadow-xl shadow-slate-900/10" 
                  : "text-slate-500 hover:bg-white hover:text-emerald-deep"
              )}
            >
              <item.icon size={18} className={cn("transition-transform duration-300", !isActive && "group-hover:scale-110")} />
              <span>{item.label}</span>
              {isActive && (
                <motion.div 
                  layoutId="activeTab"
                  className="absolute right-3 w-1.5 h-1.5 bg-ghana-gold rounded-full"
                />
              )}
            </Link>
          );
        })}
      </nav>

      {/* PWA Install Button */}
      <div className="px-4 mb-3">
        <PWAInstallButton />
      </div>

      {/* Compliance Link */}
      <div className="px-4 mb-2">
        <button
          onClick={() => setShowCompliance(true)}
          className="flex items-center gap-3 w-full px-4 py-3 bg-emerald-50 text-emerald-700 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-emerald-100 hover:bg-emerald-100 transition-all group"
        >
          <ShieldCheck size={14} className="group-hover:rotate-12 transition-transform" />
          <span>Curriculum Compliance</span>
        </button>
      </div>

      {/* Join TeachSmart Family / WhatsApp Community Link */}
      <motion.div
        className="px-4 mb-2"
        id="sidebar-join-family-container"
        whileHover={{ scale: 1.03, y: -2 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 400, damping: 22 }}
      >
        <a
          id="sidebar-join-family-link"
          href="https://chat.whatsapp.com/Jwsy8Dc8C0YD4DmVyEUKhT"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 w-full px-4 py-3 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest border border-transparent hover:from-emerald-700 hover:to-green-700 transition-all duration-300 group shadow-lg shadow-emerald-600/10"
        >
          <motion.div
            animate={{
              scale: [1, 1.15, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="flex items-center justify-center shrink-0"
          >
            <MessageCircle size={14} className="group-hover:rotate-12 transition-transform text-ghana-gold" />
          </motion.div>
          <span>Join TeachSmart Family</span>
        </a>
      </motion.div>

      {/* Contact Admin / WhatsApp Link */}
      <motion.div
        className="px-4 mb-4"
        id="sidebar-contact-admin-container"
        whileHover={{ scale: 1.03, y: -2 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 400, damping: 22 }}
      >
        <a
          id="sidebar-contact-admin-link"
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 w-full px-4 py-3 bg-gradient-to-r from-green-50/80 to-emerald-50/80 text-green-800 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-green-100 hover:bg-gradient-to-r hover:from-green-500 hover:to-emerald-600 hover:text-white hover:border-transparent transition-all duration-300 group shadow-sm"
        >
          <motion.div
            animate={{
              scale: [1, 1.15, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="flex items-center justify-center shrink-0"
          >
            <MessageCircle size={14} className="group-hover:rotate-12 transition-transform text-green-600 group-hover:text-white" />
          </motion.div>
          <span>Contact Admin</span>
        </a>
      </motion.div>

      <div className="px-4 mt-auto pt-8 border-t border-slate-100 dark:border-slate-800">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 flex flex-col gap-4 shadow-sm">
          <div className="flex items-center gap-3">
            <Link to="/profile" className="relative group">
              <div className="w-12 h-12 rounded-2xl bg-ghana-gold/20 flex items-center justify-center text-emerald-deep font-black shadow-inner border border-white overflow-hidden group-hover:scale-105 transition-transform">
                {profile?.photoURL && profile.photoURL !== "" ? (
                  <img src={profile.photoURL || null} alt={profile.displayName || 'User'} className="w-full h-full object-cover" />
                ) : (
                  profile?.displayName?.[0] || 'T'
                )}
              </div>
            </Link>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-black text-slate-900 truncate uppercase tracking-tighter leading-none mb-1">
                {profile?.displayName || (user?.isAnonymous ? 'Guest Teacher' : 'Ghana Teacher')}
              </p>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                  Account Status
                </span>
                <span className="text-[10px] font-black text-ghana-gold uppercase tracking-tighter flex items-center gap-1">
                    {user?.isAnonymous ? 'GUEST ACCESS' : (hasActiveSubscription ? 'ELITE PRO' : 'TRIAL ACCESS')}
                </span>
              </div>
              {!user?.isAnonymous && hasActiveSubscription && subTimeLeft && (
                <div className="flex items-center justify-between mt-1 pt-1 border-t border-slate-50">
                  <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">
                    {profile.plan === 'quick_pass' ? '⚡ 5h Pass' : 'Plan Time'}
                  </span>
                  <span className={cn(
                    "text-[10px] font-mono font-black text-right",
                    profile.plan === 'quick_pass' ? "text-emerald-600 animate-pulse" : "text-slate-600"
                  )}>
                    {subTimeLeft}
                  </span>
                </div>
              )}
              {!user?.isAnonymous && !hasActiveSubscription && (
                <div className="flex items-center justify-between mt-1 pt-1 border-t border-slate-50">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                    Trial Time
                  </span>
                  <span className="text-[10px] font-mono font-black text-slate-600 text-right">
                    {daysLeft} d remaining
                  </span>
                </div>
              )}
              {user?.isAnonymous && (
                <Link to="/login" className="block text-[8px] font-black text-emerald-600 hover:text-ghana-gold uppercase tracking-widest mt-1 animate-pulse">
                  Upgrade to Professional →
                </Link>
              )}
            </div>
          </div>
          <button
            onClick={() => setShowLogoutConfirm(true)}
            className="flex items-center justify-center gap-2 w-full py-3 bg-slate-50 dark:bg-slate-950 text-slate-400 rounded-2xl text-[9px] font-black uppercase tracking-widest border border-slate-100 dark:border-slate-800 hover:bg-rose-50 hover:text-rose-500 hover:border-rose-100 transition-all"
          >
            <LogOut size={12} />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
    );
  };

  return (
    <>
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 z-40 px-4 flex items-center justify-between transition-colors duration-300">
        <div className="flex items-center gap-2">
          {profile?.photoURL && profile.photoURL !== "" ? (
            <div className="w-8 h-8 rounded-lg bg-ghana-gold/20 flex items-center justify-center text-emerald-deep font-black shadow-inner border border-white overflow-hidden">
              <img src={profile.photoURL || null} alt={profile.displayName || 'User'} className="w-full h-full object-cover" />
            </div>
          ) : (
            <Logo iconOnly size="sm" />
          )}
          <span className="font-black text-slate-900 text-sm uppercase tracking-tighter">TeachSmartGH</span>
        </div>
        <div className="flex items-center gap-2">
          <NotificationCenter />
          <button 
            onClick={() => setIsMobileOpen(true)}
            className="p-2.5 bg-slate-100 rounded-xl text-slate-900"
          >
            <Menu size={20} />
          </button>
        </div>
      </header>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:block fixed left-0 top-0 bottom-0 w-72 bg-slate-50 dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800 z-50 transition-colors duration-300">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileOpen(false)}
              className="lg:hidden fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[60]"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="lg:hidden fixed left-0 top-0 bottom-0 w-[280px] bg-white dark:bg-slate-900 z-[70] shadow-2xl transition-colors duration-300"
            >
              <SidebarContent />
              <button 
                onClick={() => setIsMobileOpen(false)}
                className="absolute top-4 right-[-50px] w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-xl text-slate-900"
              >
                <X size={20} />
              </button>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
      <ComplianceModal isOpen={showCompliance} onClose={() => setShowCompliance(false)} />
      <ConfirmationModal 
        isOpen={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        onConfirm={logout}
        title="Sign Out?"
        message="Are you sure you want to log out? You'll need to sign back in to access your teaching resources."
        confirmLabel="Sign Out"
        variant="danger"
      />
    </>
  );
};

export default Sidebar;
