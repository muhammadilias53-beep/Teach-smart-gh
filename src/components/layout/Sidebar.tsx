import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, MessageCircle, FileText, Calendar, BookOpen, PenTool, CheckCircle, Menu, X, 
  LogOut, LayoutDashboard, CreditCard, Zap, User, Package, Library, ShieldCheck, Shield, 
  Atom, Calculator, Cpu, Award, Users, Briefcase, FolderOpen, ChevronDown, ChevronRight,
  ChevronLeft, Compass, HardDrive
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useSidebar } from '../../contexts/SidebarContext';
import { Link, useLocation } from 'react-router';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

import { Logo } from '../common/Logo';
import { ComplianceModal } from '../common/ComplianceModal';
import { ConfirmationModal } from '../common/ConfirmationModal';
import { PWAInstallButton } from '../common/PWAInstallButton';
import { TermsAndConditionsModal } from '../legal/TermsAndConditionsModal';

interface MenuItem {
  icon: any;
  label: string;
  path: string;
  adminOnly?: boolean;
}

interface MenuGroup {
  id: string;
  title: string;
  icon: any;
  items: MenuItem[];
}

const menuGroups: MenuGroup[] = [
  {
    id: 'overview',
    title: 'Overview & AI',
    icon: LayoutDashboard,
    items: [
      { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
      { icon: HardDrive, label: 'Offline Vault', path: '/offline-vault' },
      { icon: MessageSquare, label: 'AI Tutor', path: '/ai' },
    ]
  },
  {
    id: 'curriculum',
    title: 'Curriculum & Planning',
    icon: BookOpen,
    items: [
      { icon: Compass, label: 'NaCCA Standards DB', path: '/standards' },
      { icon: FileText, label: 'Lesson Plans', path: '/lessons' },
      { icon: BookOpen, label: 'Lesson Notes', path: '/notes' },
      { icon: Calendar, label: 'Schemes of Work', path: '/schemes' },
    ]
  },
  {
    id: 'resources',
    title: 'Resources & BSTEM',
    icon: Atom,
    items: [
      { icon: Atom, label: 'BSTEM Lab Guide', path: '/bstem-guide' },
      { icon: Calculator, label: 'BSTEM Math Guide', path: '/bstem-math' },
      { icon: Cpu, label: 'BSTEM Tech Guide', path: '/bstem-tech' },
    ]
  },
  {
    id: 'assessment',
    title: 'Assessment & Reports',
    icon: PenTool,
    items: [
      { icon: PenTool, label: 'Exams & Tests', path: '/exams' },
      { icon: FileText, label: 'AI Assignments', path: '/assignments' },
      { icon: Award, label: 'Terminal Reports', path: '/reports' },
    ]
  },
  {
    id: 'admin',
    title: 'Management & Settings',
    icon: Briefcase,
    items: [
      { icon: CreditCard, label: 'Subscription', path: '/billing' },
      { icon: User, label: 'Profile Settings', path: '/profile' },
      { icon: Shield, label: 'Admin Command', path: '/admin', adminOnly: true },
    ]
  }
];

interface SidebarContentProps {
  onCloseMobile: () => void;
  onShowCompliance: () => void;
  onShowTerms: () => void;
  onShowLogoutConfirm: () => void;
  isMobile?: boolean;
}

const SidebarContent = ({ onCloseMobile, onShowCompliance, onShowTerms, onShowLogoutConfirm, isMobile = false }: SidebarContentProps) => {
  const { profile, isSubscriptionActive, user, daysLeft } = useAuth();
  const { isCollapsed, toggleCollapse } = useSidebar();
  const location = useLocation();
  const isAdmin = user?.email === 'muhammadilias53@gmail.com';

  const isDesktopCollapsed = !isMobile && isCollapsed;

  const whatsappNumber = (import.meta as any).env.VITE_ADMIN_WHATSAPP || "233556231544";
  const whatsappUrl = `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent("Hello TeachSmart Admin, I have a question/complaint regarding TeachSmartGH:")}`;

  const [subTimeLeft, setSubTimeLeft] = useState<string>('');
  const hasActiveSubscription = isSubscriptionActive();

  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(() => {
    const currentPath = location.pathname;
    const initial: Record<string, boolean> = {};
    menuGroups.forEach((group) => {
      initial[group.id] = group.items.some(item => item.path === currentPath) || group.id === 'overview';
    });
    return initial;
  });

  useEffect(() => {
    const currentPath = location.pathname;
    menuGroups.forEach((group) => {
      if (group.items.some(item => item.path === currentPath)) {
        setOpenGroups(prev => ({ ...prev, [group.id]: true }));
      }
    });
  }, [location.pathname]);

  const toggleGroup = (id: string) => {
    setOpenGroups(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleAllGroups = () => {
    const allOpen = Object.values(openGroups).every(Boolean);
    const next: Record<string, boolean> = {};
    menuGroups.forEach(g => { next[g.id] = !allOpen; });
    setOpenGroups(next);
  };

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
    <div className="flex flex-col h-full py-3">
      {/* Header */}
      <div className={cn(
        "py-2 mb-2 flex items-center border-b border-slate-100 dark:border-slate-800 transition-all duration-300",
        isDesktopCollapsed ? "px-2 justify-center flex-col gap-2" : "px-5 justify-between"
      )}>
        <Logo iconOnly={isDesktopCollapsed} size={isDesktopCollapsed ? "sm" : "md"} />
      </div>

      {/* Navigation Header / Title */}
      {!isDesktopCollapsed ? (
        <div className="flex items-center justify-between px-4 py-1.5">
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">
            Navigation Menu
          </span>
          <button
            type="button"
            onClick={toggleAllGroups}
            className="text-[9px] font-bold text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 uppercase tracking-wider transition-colors px-1.5 py-0.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            {Object.values(openGroups).every(Boolean) ? 'Collapse All' : 'Expand All'}
          </button>
        </div>
      ) : (
        <div className="my-1 border-b border-slate-200/60 dark:border-slate-800/80 mx-3" />
      )}

      {/* Navigation list */}
      {isDesktopCollapsed ? (
        /* ICON-ONLY COLLAPSED MODE */
        <nav className="flex-1 min-h-0 px-2 space-y-1 overflow-y-auto custom-scrollbar flex flex-col items-center">
          {menuGroups.map((group, groupIdx) => {
            const visibleItems = group.items.filter(item => !item.adminOnly || isAdmin);
            if (visibleItems.length === 0) return null;

            return (
              <div key={group.id} className="w-full flex flex-col items-center space-y-1">
                {groupIdx > 0 && (
                  <div className="w-8 h-[1px] bg-slate-200 dark:bg-slate-800 my-1" />
                )}
                {visibleItems.map((item) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={onCloseMobile}
                      className={cn(
                        "relative group/item flex items-center justify-center w-11 h-11 rounded-xl transition-all duration-200",
                        isActive
                          ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30 font-bold"
                          : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-800"
                      )}
                    >
                      <item.icon size={19} className="shrink-0" />
                      
                      {/* Floating Tooltip */}
                      <div className="absolute left-full ml-3 px-3 py-1.5 bg-slate-900 dark:bg-slate-800 text-white text-xs font-bold rounded-lg shadow-xl opacity-0 group-hover/item:opacity-100 pointer-events-none transition-all duration-200 whitespace-nowrap z-[100] flex items-center gap-2">
                        <span>{item.label}</span>
                        <span className="text-[9px] uppercase tracking-wider text-slate-400 font-normal">
                          ({group.title})
                        </span>
                      </div>

                      {isActive && (
                        <span className="absolute -right-0.5 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-ghana-gold animate-pulse" />
                      )}
                    </Link>
                  );
                })}
              </div>
            );
          })}
        </nav>
      ) : (
        /* FULL-WIDTH ACCORDION MENU */
        <nav className="flex-1 min-h-0 px-3 space-y-1.5 overflow-y-auto custom-scrollbar pr-1">
          {menuGroups.map((group) => {
            const visibleItems = group.items.filter(item => !item.adminOnly || isAdmin);
            if (visibleItems.length === 0) return null;

            const isOpen = !!openGroups[group.id];
            const hasActiveChild = visibleItems.some(item => location.pathname === item.path);

            return (
              <div key={group.id} className="space-y-1">
                <button
                  type="button"
                  onClick={() => toggleGroup(group.id)}
                  className={cn(
                    "w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-200 group/btn select-none",
                    hasActiveChild
                      ? "text-emerald-800 dark:text-emerald-400 bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800/50 shadow-2xs"
                      : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100/80 dark:hover:bg-slate-800/60"
                  )}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <group.icon size={15} className={cn("transition-colors shrink-0", hasActiveChild ? "text-emerald-600 dark:text-emerald-400" : "text-slate-400 group-hover/btn:text-slate-600")} />
                    <span className="truncate">{group.title}</span>
                    {hasActiveChild && (
                      <span className="w-1.5 h-1.5 rounded-full bg-ghana-gold shrink-0 animate-pulse" />
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0 ml-1">
                    <span className="text-[10px] font-bold text-slate-400 opacity-80 px-1.5 py-0.5 rounded-md bg-slate-200/50 dark:bg-slate-800/80">
                      {visibleItems.length}
                    </span>
                    <ChevronDown
                      size={14}
                      className={cn(
                        "transition-transform duration-300 text-slate-400",
                        isOpen ? "rotate-180 text-emerald-600 dark:text-emerald-400" : "rotate-0"
                      )}
                    />
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2, ease: "easeInOut" }}
                      className="overflow-hidden pl-2.5 space-y-1 border-l-2 border-slate-200/70 dark:border-slate-800 ml-3 my-0.5"
                    >
                      {visibleItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                          <Link
                            key={item.path}
                            to={item.path}
                            onClick={onCloseMobile}
                            className={cn(
                              "flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-all duration-200 group relative",
                              isActive
                                ? "bg-slate-900 dark:bg-emerald-900 text-white shadow-md shadow-slate-900/10 dark:shadow-emerald-950/20"
                                : "text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800 hover:text-emerald-700 dark:hover:text-emerald-400"
                            )}
                          >
                            <item.icon size={15} className={cn("transition-transform duration-200 shrink-0", !isActive && "group-hover:scale-110")} />
                            <span className="truncate">{item.label}</span>
                            {isActive && (
                              <motion.div
                                layoutId="activeTab"
                                className="absolute right-2.5 w-1.5 h-1.5 bg-ghana-gold rounded-full"
                              />
                            )}
                          </Link>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </nav>
      )}

      {/* Quick Links & Support Container */}
      {!isDesktopCollapsed ? (
        <div className="px-3 pt-2 pb-1 space-y-1.5 border-t border-slate-100 dark:border-slate-800">
          <PWAInstallButton />

          <div className="grid grid-cols-2 gap-1.5">
            <button
              onClick={onShowCompliance}
              className="flex items-center justify-center gap-1.5 w-full px-2 py-2 bg-emerald-50/80 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-300 rounded-xl text-[9px] font-black uppercase tracking-wider border border-emerald-100 dark:border-emerald-900/50 hover:bg-emerald-100/80 transition-all truncate"
              title="Curriculum Compliance"
            >
              <ShieldCheck size={12} className="text-emerald-600 shrink-0" />
              <span className="truncate">Compliance</span>
            </button>

            <button
              onClick={onShowTerms}
              className="flex items-center justify-center gap-1.5 w-full px-2 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-[9px] font-black uppercase tracking-wider hover:bg-slate-200 dark:hover:bg-slate-700 transition-all border border-slate-200/50 dark:border-slate-700 truncate"
              title="Responsible AI Policy & Terms"
            >
              <Shield size={12} className="text-emerald-600 shrink-0" />
              <span className="truncate">AI Terms</span>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-1.5">
            <motion.div
              id="sidebar-join-family-container"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <a
                id="sidebar-join-family-link"
                href="https://chat.whatsapp.com/Jwsy8Dc8C0YD4DmVyEUKhT"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 w-full px-2 py-2 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-xl text-[9px] font-black uppercase tracking-wider hover:from-emerald-700 hover:to-green-700 transition-all duration-200 shadow-xs truncate"
              >
                <MessageCircle size={12} className="text-ghana-gold shrink-0" />
                <span className="truncate">Join Family</span>
              </a>
            </motion.div>

            <motion.div
              id="sidebar-contact-admin-container"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <a
                id="sidebar-contact-admin-link"
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 w-full px-2 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-[9px] font-black uppercase tracking-wider hover:bg-slate-200 dark:hover:bg-slate-700 transition-all duration-200 border border-slate-200/50 dark:border-slate-700 truncate"
              >
                <MessageCircle size={12} className="text-green-600 dark:text-green-400 shrink-0" />
                <span className="truncate">Contact Admin</span>
              </a>
            </motion.div>
          </div>
        </div>
      ) : (
        <div className="px-2 pt-2 pb-1 flex flex-col items-center space-y-1.5 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={onShowCompliance}
            className="relative group/comp flex items-center justify-center w-11 h-11 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 rounded-xl hover:bg-emerald-100 transition-all"
            title="Curriculum Compliance"
          >
            <ShieldCheck size={18} />
            <div className="absolute left-full ml-3 px-3 py-1.5 bg-slate-900 text-white text-xs font-bold rounded-lg shadow-xl opacity-0 group-hover/comp:opacity-100 pointer-events-none transition-all duration-200 whitespace-nowrap z-[100]">
              Curriculum Compliance
            </div>
          </button>

          <button
            onClick={onShowTerms}
            className="relative group/terms flex items-center justify-center w-11 h-11 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
            title="Responsible AI Terms"
          >
            <Shield size={18} className="text-emerald-600" />
            <div className="absolute left-full ml-3 px-3 py-1.5 bg-slate-900 text-white text-xs font-bold rounded-lg shadow-xl opacity-0 group-hover/terms:opacity-100 pointer-events-none transition-all duration-200 whitespace-nowrap z-[100]">
              Responsible AI Terms
            </div>
          </button>

          <a
            href="https://chat.whatsapp.com/Jwsy8Dc8C0YD4DmVyEUKhT"
            target="_blank"
            rel="noopener noreferrer"
            className="relative group/fam flex items-center justify-center w-11 h-11 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-all shadow-xs"
            title="Join Family"
          >
            <MessageCircle size={18} className="text-ghana-gold" />
            <div className="absolute left-full ml-3 px-3 py-1.5 bg-slate-900 text-white text-xs font-bold rounded-lg shadow-xl opacity-0 group-hover/fam:opacity-100 pointer-events-none transition-all duration-200 whitespace-nowrap z-[100]">
              Join WhatsApp Family
            </div>
          </a>
        </div>
      )}

      {/* User Account Section */}
      {!isDesktopCollapsed ? (
        <div className="px-3 pt-2 border-t border-slate-100 dark:border-slate-800">
          <div className="bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-200/70 dark:border-slate-800 flex flex-col gap-2 shadow-xs">
            <div className="flex items-center gap-2.5">
              <Link to="/profile" className="relative group shrink-0">
                <div className="w-9 h-9 rounded-xl bg-ghana-gold/20 flex items-center justify-center text-emerald-deep font-black shadow-inner border border-white dark:border-slate-800 overflow-hidden group-hover:scale-105 transition-transform">
                  {profile?.photoURL && profile.photoURL !== "" ? (
                    <img src={profile.photoURL || null} alt={profile.displayName || 'User'} className="w-full h-full object-cover" />
                  ) : (
                    profile?.displayName?.[0] || 'T'
                  )}
                </div>
              </Link>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-black text-slate-900 dark:text-white truncate uppercase tracking-tighter leading-tight">
                  {profile?.displayName || (user?.isAnonymous ? 'Guest Teacher' : 'Ghana Teacher')}
                </p>
                <div className="flex items-center justify-between mt-0.5">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                    Status
                  </span>
                  <span className="text-[9px] font-black text-ghana-gold uppercase tracking-tighter">
                    {user?.isAnonymous ? 'GUEST' : (hasActiveSubscription ? 'ELITE PRO' : 'TRIAL')}
                  </span>
                </div>
                {!user?.isAnonymous && hasActiveSubscription && subTimeLeft && (
                  <div className="flex items-center justify-between mt-1 pt-0.5 border-t border-slate-100 dark:border-slate-800">
                    <span className="text-[8px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">
                      {profile.plan === 'quick_pass' ? '⚡ Pass' : 'Time'}
                    </span>
                    <span className={cn(
                      "text-[9px] font-mono font-black text-right",
                      profile.plan === 'quick_pass' ? "text-emerald-600 animate-pulse" : "text-slate-600 dark:text-slate-400"
                    )}>
                      {subTimeLeft}
                    </span>
                  </div>
                )}
                {!user?.isAnonymous && !hasActiveSubscription && (
                  <div className="flex items-center justify-between mt-1 pt-0.5 border-t border-slate-100 dark:border-slate-800">
                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">
                      Trial
                    </span>
                    <span className="text-[9px] font-mono font-black text-slate-600 dark:text-slate-400 text-right">
                      {daysLeft}d left
                    </span>
                  </div>
                )}
                {user?.isAnonymous && (
                  <Link to="/login" className="block text-[8px] font-black text-emerald-600 dark:text-emerald-400 hover:text-ghana-gold uppercase tracking-widest mt-0.5 animate-pulse">
                    Upgrade →
                  </Link>
                )}
              </div>
            </div>
            <button
              onClick={onShowLogoutConfirm}
              className="flex items-center justify-center gap-2 w-full py-1.5 bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-slate-400 rounded-xl text-[9px] font-black uppercase tracking-widest border border-slate-200/60 dark:border-slate-800 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 dark:hover:bg-rose-950/40 dark:hover:text-rose-400 transition-all"
            >
              <LogOut size={12} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="px-2 pt-2 flex flex-col items-center space-y-2 border-t border-slate-100 dark:border-slate-800">
          <Link to="/profile" className="relative group/usr shrink-0">
            <div className="w-11 h-11 rounded-xl bg-ghana-gold/20 flex items-center justify-center text-emerald-deep font-black shadow-inner border border-white dark:border-slate-800 overflow-hidden group-hover/usr:scale-105 transition-transform">
              {profile?.photoURL && profile.photoURL !== "" ? (
                <img src={profile.photoURL || null} alt={profile.displayName || 'User'} className="w-full h-full object-cover" />
              ) : (
                profile?.displayName?.[0] || 'T'
              )}
            </div>
            <div className="absolute left-full ml-3 px-3 py-1.5 bg-slate-900 text-white text-xs font-bold rounded-lg shadow-xl opacity-0 group-hover/usr:opacity-100 pointer-events-none transition-all duration-200 whitespace-nowrap z-[100]">
              {profile?.displayName || 'Ghana Teacher'} ({user?.isAnonymous ? 'GUEST' : (hasActiveSubscription ? 'ELITE PRO' : 'TRIAL')})
            </div>
          </Link>

          <button
            onClick={onShowLogoutConfirm}
            className="relative group/so flex items-center justify-center w-11 h-11 bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-all"
            title="Sign Out"
          >
            <LogOut size={18} />
            <div className="absolute left-full ml-3 px-3 py-1.5 bg-slate-900 text-white text-xs font-bold rounded-lg shadow-xl opacity-0 group-hover/so:opacity-100 pointer-events-none transition-all duration-200 whitespace-nowrap z-[100]">
              Sign Out
            </div>
          </button>
        </div>
      )}

      {/* Dedicated Toggle Button at the Bottom of Sidebar */}
      {!isMobile && (
        <div className="pt-2.5 mt-2 border-t border-slate-200/80 dark:border-slate-800 px-3">
          {!isDesktopCollapsed ? (
            <button
              type="button"
              onClick={toggleCollapse}
              className="flex items-center justify-between w-full px-3 py-2.5 bg-slate-200/60 hover:bg-slate-200 dark:bg-slate-800/60 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-200 group border border-slate-300/50 dark:border-slate-700/50 shadow-2xs"
              title="Collapse Sidebar to icon-only view"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-6 h-6 rounded-lg bg-white dark:bg-slate-900 flex items-center justify-center text-slate-600 dark:text-slate-300 shadow-2xs group-hover:-translate-x-0.5 transition-transform">
                  <ChevronLeft size={16} />
                </div>
                <span className="truncate">Collapse Sidebar</span>
              </div>
              <span className="text-[9px] font-mono font-bold text-slate-500 dark:text-slate-400 bg-white/80 dark:bg-slate-900/80 px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-700 shrink-0">
                Icon View
              </span>
            </button>
          ) : (
            <div className="flex justify-center">
              <button
                type="button"
                onClick={toggleCollapse}
                className="flex items-center justify-center w-11 h-11 bg-emerald-600 text-white hover:bg-emerald-700 rounded-xl transition-all duration-200 shadow-md shadow-emerald-600/30 group relative"
                title="Expand Sidebar to full-width view"
              >
                <ChevronRight size={20} className="group-hover:translate-x-0.5 transition-transform" />
                
                {/* Tooltip */}
                <div className="absolute left-full ml-3 px-3 py-1.5 bg-slate-900 text-white text-xs font-bold rounded-lg shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 whitespace-nowrap z-[100]">
                  Expand Sidebar
                </div>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const Sidebar = () => {
  const { profile, logout } = useAuth();
  const { isCollapsed } = useSidebar();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [showCompliance, setShowCompliance] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

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
          <button 
            onClick={() => setIsMobileOpen(true)}
            className="p-2.5 bg-slate-100 rounded-xl text-slate-900"
          >
            <Menu size={20} />
          </button>
        </div>
      </header>

      {/* Desktop Sidebar */}
      <aside className={cn(
        "hidden lg:block fixed left-0 top-0 bottom-0 bg-slate-50 dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800 z-50 transition-all duration-300",
        isCollapsed ? "w-20" : "w-72"
      )}>
        <SidebarContent 
          onCloseMobile={() => setIsMobileOpen(false)}
          onShowCompliance={() => setShowCompliance(true)}
          onShowTerms={() => setShowTermsModal(true)}
          onShowLogoutConfirm={() => setShowLogoutConfirm(true)}
          isMobile={false}
        />
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
              className="lg:hidden fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-[60]"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="lg:hidden fixed left-0 top-0 bottom-0 w-[280px] bg-white dark:bg-slate-900 z-[70] shadow-2xl transition-colors duration-300"
            >
              <SidebarContent 
                onCloseMobile={() => setIsMobileOpen(false)}
                onShowCompliance={() => setShowCompliance(true)}
                onShowTerms={() => setShowTermsModal(true)}
                onShowLogoutConfirm={() => setShowLogoutConfirm(true)}
                isMobile={true}
              />
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
      <TermsAndConditionsModal 
        isOpen={showTermsModal} 
        onClose={() => setShowTermsModal(false)} 
        isMandatory={false} 
      />
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
