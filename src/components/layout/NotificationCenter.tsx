import React, { useState, useEffect } from 'react';
import { Bell, Info, BookOpen, Calendar, Star, X, CheckSquare, ExternalLink } from 'lucide-react';
import { collection, query, where, onSnapshot, orderBy, updateDoc, doc, limit } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuth } from '../../contexts/AuthContext';
import { motion, AnimatePresence } from 'motion/react';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '../../lib/utils';
import { useNavigate } from 'react-router-dom';

interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'update' | 'resource' | 'event' | 'system';
  read: boolean;
  link?: string;
  createdAt: any;
}

export const NotificationCenter = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;

    // Query for user-specific and broadcast notifications
    const q = query(
      collection(db, 'notifications'),
      where('userId', 'in', [user.uid, 'all']),
      orderBy('createdAt', 'desc'),
      limit(20)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Notification[];
      
      setNotifications(docs);
      setUnreadCount(docs.filter(n => !n.read).length);
    }, (error) => {
      console.error("Notifications listener error:", error);
    });

    return () => unsubscribe();
  }, [user]);

  const markAsRead = async (id: string) => {
    try {
      await updateDoc(doc(db, 'notifications', id), { read: true });
    } catch (err) {
      console.error("Error marking notification as read:", err);
    }
  };

  const markAllAsRead = async () => {
    const unread = notifications.filter(n => !n.read);
    for (const n of unread) {
      await markAsRead(n.id);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'update': return <Info size={16} className="text-emerald-500" />;
      case 'resource': return <BookOpen size={16} className="text-ghana-gold" />;
      case 'event': return <Calendar size={16} className="text-blue-500" />;
      default: return <Star size={16} className="text-slate-400" />;
    }
  };

  const handleNotificationClick = (n: Notification) => {
    markAsRead(n.id);
    if (n.link) {
      if (n.link.startsWith('http')) {
        window.open(n.link, '_blank');
      } else {
        navigate(n.link);
      }
    }
    setIsOpen(false);
  };

  return (
    <div className="relative">
      {/* Bell Icon */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2.5 bg-white lg:bg-slate-100 rounded-xl text-slate-600 hover:text-emerald-deep hover:bg-emerald-50 transition-all duration-300"
        id="notification-bell"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-rose-500 border-2 border-white rounded-full animate-pulse shadow-sm" />
        )}
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-[60] bg-slate-900/10 backdrop-blur-sm lg:hidden"
            />
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute right-0 mt-4 w-[calc(100vw-2rem)] lg:w-96 bg-white rounded-[2rem] shadow-2xl border border-slate-100 z-[70] overflow-hidden"
              style={{ maxHeight: 'calc(100vh - 120px)' }}
            >
              {/* Header */}
              <div className="px-6 py-5 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
                <div>
                  <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Teacher Alerts</h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Stay updated with NaCCA & TeachSmart</p>
                </div>
                <div className="flex items-center gap-2">
                   {unreadCount > 0 && (
                     <button 
                       onClick={markAllAsRead}
                       className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors group"
                       title="Mark all as read"
                     >
                       <CheckSquare size={16} className="group-hover:scale-110 transition-transform" />
                     </button>
                   )}
                   <button 
                     onClick={() => setIsOpen(false)}
                     className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-white rounded-lg transition-colors"
                   >
                     <X size={16} />
                   </button>
                </div>
              </div>

              {/* Content */}
              <div className="overflow-y-auto max-h-[400px] custom-scrollbar">
                {notifications.length === 0 ? (
                  <div className="px-8 py-16 text-center">
                    <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Bell size={24} className="text-slate-200" />
                    </div>
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest leading-loose">No alerts at the moment<br/>Check back later!</p>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-50">
                    {notifications.map((n, idx) => (
                      <motion.div
                        key={n.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        onClick={() => handleNotificationClick(n)}
                        className={cn(
                          "px-6 py-5 cursor-pointer transition-all hover:bg-slate-50 relative group",
                          !n.read ? "bg-emerald-50/20" : "bg-white opacity-80"
                        )}
                      >
                        {!n.read && (
                          <div className="absolute left-1.5 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                        )}
                        
                        <div className="flex gap-4">
                          <div className={cn(
                            "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm transition-transform group-hover:scale-105",
                            !n.read ? "bg-white" : "bg-slate-50"
                          )}>
                            {getIcon(n.type)}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start mb-1">
                              <h4 className="text-[12px] font-black text-slate-900 uppercase tracking-tight truncate pr-2">
                                {n.title}
                              </h4>
                              <span className="text-[9px] font-bold text-slate-400 uppercase shrink-0">
                                {n.createdAt?.toDate ? formatDistanceToNow(n.createdAt.toDate(), { addSuffix: true }) : 'just now'}
                              </span>
                            </div>
                            <p className="text-[11px] font-medium text-slate-600 leading-relaxed mb-3 line-clamp-2">
                              {n.message}
                            </p>
                            
                            {n.link && (
                              <div className="flex items-center gap-1 text-[9px] font-black text-emerald-600 uppercase tracking-widest group-hover:gap-2 transition-all">
                                <span>Learn More</span>
                                <ExternalLink size={10} />
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Footer */}
              <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 text-center">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                  Official Educational Alerts for Ghana
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
