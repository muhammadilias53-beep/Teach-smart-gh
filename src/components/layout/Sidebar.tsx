import React, { useState } from 'react';
import { MessageSquare, MessageCircle, FileText, Calendar, BookOpen, PenTool, CheckCircle, Menu, X, LogOut, LayoutDashboard, CreditCard, Zap, User, Package, Library, ShieldCheck, Bell, Shield } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

import { Logo } from '../common/Logo';
import { ComplianceModal } from '../common/ComplianceModal';
import { ConfirmationModal } from '../common/ConfirmationModal';
import { NotificationCenter } from './NotificationCenter';

const Sidebar = () => {
  const { profile, logout, isTrialActive, user } = useAuth();
  const location = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [showCompliance, setShowCompliance] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const isAdmin = user?.email === 'muhammadilias53@gmail.com';

  const whatsappNumber = (import.meta as any).env.VITE_ADMIN_WHATSAPP || "233556231544";
  const whatsappUrl = `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent("Hello TeachSmart Admin, I have a question/complaint regarding TeachSmart Ghana:")}`;

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    { icon: MessageSquare, label: 'AI Tutor', path: '/ai' },
    { icon: FileText, label: 'Lesson Plans', path: '/lessons' },
    { icon: BookOpen, label: 'Lesson Notes', path: '/notes' },
    { icon: Calendar, label: 'Schemes of Work', path: '/schemes' },
    { icon: Package, label: 'Resource Packs', path: '/packs' },
    { icon: Library, label: 'Content Library', path: '/library' },
    { icon: PenTool, label: 'Exams & Tests', path: '/exams' },
    { icon: CreditCard, label: 'Subscription', path: '/billing' },
    { icon: User, label: 'Profile Settings', path: '/profile' },
    { icon: Shield, label: 'Admin Command', path: '/admin', adminOnly: true },
  ];

  const SidebarContent = () => (
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

      {/* Contact Admin / WhatsApp Link */}
      <div className="px-4 mb-4" id="sidebar-contact-admin-container">
        <a
          id="sidebar-contact-admin-link"
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 w-full px-4 py-3 bg-green-50/70 text-green-800 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-green-100 hover:bg-green-100/80 transition-all group shadow-sm"
        >
          <MessageCircle size={14} className="group-hover:rotate-12 transition-transform text-green-600" />
          <span>Contact Admin</span>
        </a>
      </div>

      <div className="px-4 mt-auto pt-8 border-t border-slate-100">
        <div className="bg-white p-5 rounded-[2.5rem] border border-slate-100 flex flex-col gap-4 shadow-sm">
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
                   {user?.isAnonymous ? 'GUEST ACCESS' : (profile?.subscriptionStatus === 'active' ? 'ELITE PRO' : 'TRIAL ACCESS')}
                </span>
              </div>
              {user?.isAnonymous && (
                <Link to="/login" className="block text-[8px] font-black text-emerald-600 hover:text-ghana-gold uppercase tracking-widest mt-1 animate-pulse">
                  Upgrade to Professional →
                </Link>
              )}
            </div>
          </div>
          <button
            onClick={() => setShowLogoutConfirm(true)}
            className="flex items-center justify-center gap-2 w-full py-3 bg-slate-50 text-slate-400 rounded-2xl text-[9px] font-black uppercase tracking-widest border border-slate-100 hover:bg-rose-50 hover:text-rose-500 hover:border-rose-100 transition-all"
          >
            <LogOut size={12} />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-md border-b border-slate-100 z-40 px-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {profile?.photoURL && profile.photoURL !== "" ? (
            <div className="w-8 h-8 rounded-lg bg-ghana-gold/20 flex items-center justify-center text-emerald-deep font-black shadow-inner border border-white overflow-hidden">
              <img src={profile.photoURL || null} alt={profile.displayName || 'User'} className="w-full h-full object-cover" />
            </div>
          ) : (
            <Logo iconOnly size="sm" />
          )}
          <span className="font-black text-slate-900 text-sm uppercase tracking-tighter">TeachSmart</span>
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
      <aside className="hidden lg:block fixed left-0 top-0 bottom-0 w-72 bg-slate-50 border-r border-slate-100 z-50">
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
              className="lg:hidden fixed left-0 top-0 bottom-0 w-[280px] bg-white z-[70] shadow-2xl"
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
