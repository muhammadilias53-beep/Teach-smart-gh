import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertCircle, ArrowRight, X, Info, Zap, BookOpen } from 'lucide-react';
import { collection, query, where, onSnapshot, orderBy, limit } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuth } from '../../contexts/AuthContext';
import { cn } from '../../lib/utils';
import { safeLocalStorage } from '../../lib/storage';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  link?: string;
  createdAt: any;
}

export const EduPulseBanner = () => {
  const { user } = useAuth();
  const [latestAlert, setLatestAlert] = useState<Notification | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [dismissedSession, setDismissedSession] = useState<string[]>([]);

  useEffect(() => {
    if (!user) return;

    // Fetch the single most recent broadcast alert
    const q = query(
      collection(db, 'notifications'),
      where('userId', 'in', [user.uid, 'all']),
      orderBy('createdAt', 'desc'),
      limit(1)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        const doc = snapshot.docs[0];
        const data = doc.data() as Notification;
        
        // Handle server timestamps that might be null briefly on creation
        const createdAt = data.createdAt;
        const alertTime = createdAt?.toMillis ? createdAt.toMillis() : Date.now();
        const isFresh = (Date.now() - alertTime) < 604800000; // 7 days (ensure visibility in dev/production)
        const isDismissed = safeLocalStorage.getItem(`dismissed_alert_${doc.id}`) || dismissedSession.includes(doc.id);
        
        if (isFresh && !isDismissed) {
          setLatestAlert({ id: doc.id, ...data });
          setIsVisible(true);
        } else {
          setIsVisible(false);
        }
      } else {
        setIsVisible(false);
      }
    });

    return () => unsubscribe();
  }, [user, dismissedSession]);

  useEffect(() => {
    if (isVisible && latestAlert) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        // Persist the auto-hide as a dismissal so it doesn't reappear until next 7 days
        safeLocalStorage.setItem(`dismissed_alert_${latestAlert.id}`, 'true');
        setDismissedSession(prev => [...prev, latestAlert.id]);
      }, 20000); // 20 seconds auto-hide
      return () => clearTimeout(timer);
    }
  }, [isVisible, latestAlert]);

  const handleDismiss = () => {
    if (latestAlert) {
      safeLocalStorage.setItem(`dismissed_alert_${latestAlert.id}`, 'true');
      setDismissedSession(prev => [...prev, latestAlert.id]);
      setIsVisible(false);
      setLatestAlert(null);
    }
  };

  const handleActionClick = () => {
    handleDismiss();
  };

  const getTheme = (type: string) => {
    switch (type) {
      case 'system': return 'bg-slate-900 text-white border-slate-800';
      case 'resource': return 'bg-ghana-gold text-emerald-deep border-ghana-gold';
      case 'event': return 'bg-indigo-600 text-white border-indigo-500';
      default: return 'bg-emerald-600 text-white border-emerald-500';
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'resource': return <BookOpen size={16} />;
      case 'system': return <Zap size={16} className="text-ghana-gold" />;
      default: return <Info size={16} />;
    }
  };

  return (
    <AnimatePresence mode="wait">
      {isVisible && latestAlert && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          className="fixed bottom-6 left-4 right-4 z-[9999] lg:bottom-auto lg:top-4 lg:left-80 lg:right-12"
        >
          <div className={cn(
            "relative overflow-hidden rounded-[1.8rem] md:rounded-[2rem] border shadow-[0_20px_50px_rgba(0,0,0,0.3)] transition-all duration-500",
            getTheme(latestAlert.type)
          )}>
            {/* Subtle Glow Effect */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-3xl -translate-y-24 translate-x-24" />
            
            <div className="flex flex-col md:flex-row items-center gap-3 md:gap-6 px-5 py-5 md:px-8 md:py-4 min-h-[70px]">
              {/* Status Indicator */}
              <div className="flex items-center gap-4 shrink-0 w-full md:w-auto border-b border-white/10 pb-3 md:border-0 md:pb-0">
                <div className="w-12 h-12 md:w-10 md:h-10 rounded-2xl bg-white/20 flex items-center justify-center shadow-inner ring-4 ring-white/5">
                  {getIcon(latestAlert.type)}
                </div>
                <div className="flex-1">
                   <div className="flex items-center gap-2">
                     <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80">Official Notice</span>
                     <div className="md:hidden w-1 h-1 rounded-full bg-white/40" />
                     <span className="md:hidden text-[10px] font-black uppercase tracking-tight truncate max-w-[120px]">{latestAlert.title}</span>
                   </div>
                   <h4 className="md:hidden text-sm font-black uppercase tracking-tight">{latestAlert.title}</h4>
                </div>
                <button 
                  onClick={handleDismiss}
                  className="md:hidden w-10 h-10 flex items-center justify-center bg-black/20 hover:bg-black/40 rounded-2xl transition-all active:scale-95"
                  aria-label="Dismiss Alert"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="hidden md:flex flex-col min-w-0 flex-1">
                 <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80">Teacher Broadcast</span>
                    <div className="w-1.5 h-1.5 rounded-full bg-ghana-gold animate-pulse" />
                    <h4 className="text-[13px] font-black uppercase tracking-tight truncate">{latestAlert.title}</h4>
                 </div>
                 <p className="text-sm font-medium opacity-90 truncate max-w-2xl leading-tight">
                   {latestAlert.message}
                 </p>
              </div>

              <p className="md:hidden text-[13px] font-medium text-left opacity-90 leading-snug px-1 line-clamp-2">
                 {latestAlert.message}
              </p>

              <div className="flex items-center gap-3 ml-auto w-full md:w-auto">
                {latestAlert.link && (
                  <a 
                    href={latestAlert.link}
                    onClick={handleActionClick}
                    className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-white text-emerald-deep hover:bg-opacity-90 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl shadow-black/10 group"
                  >
                    Take Action
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </a>
                )}
                <button 
                  onClick={handleDismiss}
                  className="hidden md:flex w-10 h-10 items-center justify-center bg-black/10 hover:bg-black/20 rounded-2xl transition-all active:scale-95 shrink-0"
                  aria-label="Dismiss Alert"
                >
                  <X size={18} />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
