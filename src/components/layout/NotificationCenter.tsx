import React, { useState, useEffect, useMemo } from 'react';
import { 
  Bell, Search, Archive, Trash2, CheckCircle, Filter, Pin, 
  ChevronDown, ChevronUp, AlertCircle, Sparkles, BookOpen, 
  GraduationCap, CreditCard, Wrench, Hammer, Award, Star, 
  Info, ExternalLink, X, FileText, Play, Layers, CheckCheck,
  Eye, RefreshCw, Send, Check
} from 'lucide-react';
import { collection, query, where, onSnapshot, orderBy, updateDoc, doc, limit, increment } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuth } from '../../contexts/AuthContext';
import { motion, AnimatePresence } from 'motion/react';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '../../lib/utils';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'update' | 'resource' | 'event' | 'system';
  read: boolean;
  link?: string;
  category?: string;
  priority?: 'high' | 'medium' | 'low';
  pinned?: boolean;
  fullContent?: string;
  imageUrl?: string;
  pdfUrl?: string;
  videoUrl?: string;
  actionLabel?: string;
  opensCount?: number;
  clicksCount?: number;
  scheduledFor?: any;
  createdAt: any;
}

export const NotificationCenter = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [viewTab, setViewTab] = useState<'inbox' | 'archived'>('inbox');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const navigate = useNavigate();

  // Load user overrides for read/archive/delete records
  const [readOverrides, setReadOverrides] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('teachsmart_read_ids');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [archivedIds, setArchivedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('teachsmart_archived_ids');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Safe save utilities
  const saveReadOverrides = (newOverrides: Record<string, boolean>) => {
    setReadOverrides(newOverrides);
    localStorage.setItem('teachsmart_read_ids', JSON.stringify(newOverrides));
  };

  const saveArchivedIds = (newIds: string[]) => {
    setArchivedIds(newIds);
    localStorage.setItem('teachsmart_archived_ids', JSON.stringify(newIds));
  };

  // Push Notifications Setup Request
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default' && user) {
      setTimeout(() => {
        Notification.requestPermission().then(permission => {
          if (permission === 'granted') {
            console.log('Push notification permission granted!');
          }
        });
      }, 5000);
    }
  }, [user]);

  // Real-time Database sync
  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'notifications'),
      where('userId', 'in', [user.uid, 'all']),
      orderBy('createdAt', 'desc'),
      limit(50)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Notification[];
      setNotifications(docs);
    }, (error) => {
      console.error("Notifications subscription failure:", error);
    });

    return () => unsubscribe();
  }, [user]);

  // Helper properties derived dynamically
  const categoriesList = useMemo(() => {
    const list = [
      { name: 'All', icon: <Layers size={14} /> },
      { name: 'Announcements', icon: <Info size={14} /> },
      { name: 'New Features', icon: <Sparkles size={14} /> },
      { name: 'Curriculum Updates', icon: <BookOpen size={14} /> },
      { name: 'Training & Tutorials', icon: <GraduationCap size={14} /> },
      { name: 'Subscription Updates', icon: <CreditCard size={14} /> },
      { name: 'Maintenance Alerts', icon: <Wrench size={14} /> },
      { name: 'Bug Fixes', icon: <Hammer size={14} /> },
      { name: 'Teaching Resources', icon: <FileText size={14} /> },
      { name: 'Success Stories', icon: <Star size={14} /> },
      { name: 'General Updates', icon: <Layers size={14} /> }
    ];
    return list;
  }, []);

  // Filter & Search Logic
  const filteredNotifications = useMemo(() => {
    return notifications
      .map(n => {
        // Overlay local overrides
        const isRead = readOverrides[n.id] || n.read;
        return { ...n, read: isRead };
      })
      .filter(n => {
        // Tab check
        const isArchived = archivedIds.includes(n.id);
        if (viewTab === 'inbox' && isArchived) return false;
        if (viewTab === 'archived' && !isArchived) return false;

        // Schedule check: Filter out future scheduled alerts from appearing in teachers' tabs
        if (n.scheduledFor) {
          try {
            const schedDate = n.scheduledFor.toDate ? n.scheduledFor.toDate() : new Date(n.scheduledFor);
            if (schedDate > new Date()) return false;
          } catch (e) {
            console.error("Error parsing scheduled Date: ", e);
          }
        }

        // Category filter
        if (activeCategory !== 'All') {
          const categoryMatch = n.category === activeCategory;
          // Sub-types matching fallback
          const legacyMatchMap: Record<string, string> = {
            'Curriculum Updates': 'update',
            'Teaching Resources': 'resource',
            'Training & Tutorials': 'event',
            'Maintenance Alerts': 'system'
          };
          const matchesLegacy = legacyMatchMap[activeCategory] === n.type;
          if (!categoryMatch && !matchesLegacy) return false;
        }

        // Search query
        if (searchQuery.trim()) {
          const queryLower = searchQuery.toLowerCase();
          const matchesTitle = n.title?.toLowerCase().includes(queryLower);
          const matchesMsg = n.message?.toLowerCase().includes(queryLower);
          const matchesCategory = n.category?.toLowerCase().includes(queryLower);
          if (!matchesTitle && !matchesMsg && !matchesCategory) return false;
        }

        return true;
      })
      .sort((a, b) => {
        // Pin priority: Pinned items stand high
        if (a.pinned && !b.pinned) return -1;
        if (!a.pinned && b.pinned) return 1;
        return 0; // fallback to loaded order
      });
  }, [notifications, readOverrides, archivedIds, viewTab, activeCategory, searchQuery]);

  // Unread badge counts on items inside inbox
  const unreadCount = useMemo(() => {
    return notifications
      .filter(n => !archivedIds.includes(n.id))
      .filter(n => !readOverrides[n.id] && !n.read)
      .length;
  }, [notifications, archivedIds, readOverrides]);

  // Operations
  const handleToggleExpand = async (n: Notification) => {
    const isExpanding = expandedId !== n.id;
    setExpandedId(isExpanding ? n.id : null);

    if (isExpanding) {
      // Mark as read locally
      if (!n.read) {
        saveReadOverrides({ ...readOverrides, [n.id]: true });
        
        // Mark read in Firestore if user-specific
        if (n.userId !== 'all') {
          try {
            await updateDoc(doc(db, 'notifications', n.id), { read: true });
          } catch (err) {
            console.error("Cloud mark as read skipped/failed:", err);
          }
        }
      }

      // Track Opens Analytics
      try {
        await updateDoc(doc(db, 'notifications', n.id), {
          opensCount: increment(1)
        });
      } catch (err) {
        // Silently capture since write permissions could block broadcast logs
      }
    }
  };

  const handleMarkAsRead = async (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    saveReadOverrides({ ...readOverrides, [id]: true });

    const original = notifications.find(n => n.id === id);
    if (original && original.userId !== 'all') {
      try {
        await updateDoc(doc(db, 'notifications', id), { read: true });
      } catch (err) {
        console.error("Cloud mark as read failure:", err);
      }
    }
    toast.success("Alert marked as read");
  };

  const handleMarkAllAsRead = async () => {
    const unread = filteredNotifications.filter(n => !n.read);
    if (unread.length === 0) return;

    const newOverrides = { ...readOverrides };
    for (const n of unread) {
      newOverrides[n.id] = true;
      if (n.userId !== 'all') {
        try {
          updateDoc(doc(db, 'notifications', n.id), { read: true });
        } catch {}
      }
    }
    saveReadOverrides(newOverrides);
    toast.success("All alerts marked as read!");
  };

  const handleArchiveToggle = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (archivedIds.includes(id)) {
      // Restore
      saveArchivedIds(archivedIds.filter(i => i !== id));
      toast.success("Alert restored to inbox");
    } else {
      // Archive
      saveArchivedIds([...archivedIds, id]);
      toast.success("Alert moved to archive");
    }
  };

  const handleDeleteNotification = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    // Permanently remove from visible state locally by archiving
    saveArchivedIds([...archivedIds, id]);
    toast.success("Alert hidden successfully");
  };

  const handleActionClick = async (n: Notification, e: React.MouseEvent) => {
    e.stopPropagation();
    // Track Clicks analytics
    try {
      await updateDoc(doc(db, 'notifications', n.id), {
        clicksCount: increment(1)
      });
    } catch {}

    if (n.link) {
      if (n.link.startsWith('http')) {
        window.open(n.link, '_blank');
      } else {
        navigate(n.link);
      }
    }
    setIsOpen(false);
  };

  // Maps categories to premium custom visual descriptors
  const getCategoryDetails = (category?: string, type?: string) => {
    const cat = category || type || 'General';
    switch (cat) {
      case 'Announcements':
        return { icon: <Info size={14} />, badgeBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/10' };
      case 'New Features':
        return { icon: <Sparkles size={14} />, badgeBg: 'bg-purple-500/10 text-purple-400 border-purple-500/10' };
      case 'Curriculum Updates':
        return { icon: <BookOpen size={14} />, badgeBg: 'bg-blue-500/10 text-blue-400 border-blue-500/10' };
      case 'Training & Tutorials':
        return { icon: <GraduationCap size={14} />, badgeBg: 'bg-amber-500/10 text-amber-400 border-amber-500/10' };
      case 'Subscription Updates':
        return { icon: <CreditCard size={14} />, badgeBg: 'bg-green-500/10 text-green-400 border-green-500/10' };
      case 'Maintenance Alerts':
        return { icon: <Wrench size={14} />, badgeBg: 'bg-orange-500/10 text-orange-400 border-orange-500/10' };
      case 'Bug Fixes':
        return { icon: <Hammer size={14} />, badgeBg: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/10' };
      case 'Teaching Resources':
        return { icon: <FileText size={14} />, badgeBg: 'bg-teal-500/10 text-teal-400 border-teal-500/10' };
      case 'Success Stories':
        return { icon: <Award size={14} />, badgeBg: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' };
      default:
        return { icon: <Layers size={14} />, badgeBg: 'bg-slate-500/10 text-slate-350 border-slate-500/10' };
    }
  };

  return (
    <div className="relative">
      {/* Bell Trigger with Unread Count Badge */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-300 hover:text-emerald-400 hover:bg-slate-850 transition-all duration-300 active:scale-95 shadow-lg flex items-center justify-center"
        id="notification-bell"
        title="TeachSmartGH Notification Center"
      >
        <Bell size={18} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-rose-500 text-white text-[9px] font-black uppercase tracking-tighter flex items-center justify-center rounded-full border-2 border-slate-950 px-1 animate-pulse shadow-xl shadow-rose-950/20">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Slide-over Drawer / Interactive Notification Center Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-[100] bg-slate-950/60 backdrop-blur-md"
            />

            {/* Sidebar drawer content */}
            <motion.div
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="fixed top-0 right-0 h-screen w-full md:w-[480px] bg-slate-950 border-l border-slate-800/80 shadow-[0_0_80px_rgba(0,0,0,0.8)] z-[101] flex flex-col overflow-hidden"
            >
              {/* Drawer Header */}
              <div className="px-6 py-6 border-b border-sidebar-divider bg-slate-900/40 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-400 border border-emerald-500/10 shadow-lg">
                      <Bell size={16} />
                    </div>
                    <div>
                      <h2 className="text-sm font-black text-white uppercase tracking-widest leading-none">News & Alert Hub</h2>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight mt-1">Official NaCCA & Support Feed</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1.5">
                    {unreadCount > 0 && viewTab === 'inbox' && (
                      <button
                        onClick={handleMarkAllAsRead}
                        className="px-2.5 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 rounded-lg text-[9px] font-black uppercase tracking-widest flex items-center gap-1 transition-all active:scale-95 border border-emerald-500/10"
                        title="Mark all as read"
                      >
                        <CheckCheck size={12} />
                        Read All
                      </button>
                    )}
                    <button
                      onClick={() => setIsOpen(false)}
                      className="p-1.5 text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-800 rounded-lg border border-slate-800/80 transition-all active:scale-95"
                    >
                      <X size={14} />
                    </button>
                  </div>
                </div>

                {/* Sub Tab selection (Inbox vs Archive) */}
                <div className="grid grid-cols-2 p-1 bg-slate-900/90 rounded-xl border border-slate-800/80">
                  <button
                    onClick={() => { setViewTab('inbox'); setExpandedId(null); }}
                    className={cn(
                      "py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all",
                      viewTab === 'inbox' 
                        ? "bg-emerald-500 text-slate-950 shadow-md"
                        : "text-slate-400 hover:text-white"
                    )}
                  >
                    Active Feed ({notifications.filter(n => !archivedIds.includes(n.id)).length})
                  </button>
                  <button
                    onClick={() => { setViewTab('archived'); setExpandedId(null); }}
                    className={cn(
                      "py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all",
                      viewTab === 'archived' 
                        ? "bg-slate-800 text-white border border-slate-700" 
                        : "text-slate-400 hover:text-white"
                    )}
                  >
                    Archive ({archivedIds.length})
                  </button>
                </div>

                {/* Search Bar */}
                <div className="relative">
                  <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-450" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Search notifications, announcements..."
                    className="w-full bg-slate-900/90 border border-slate-800/80 rounded-xl py-3 pl-11 pr-4 text-xs font-bold text-white outline-none focus:border-emerald-500 transition-all font-sans"
                  />
                  {searchQuery && (
                    <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white">
                      <X size={12} />
                    </button>
                  )}
                </div>
              </div>

              {/* Scrolling Horizontal Category Pills */}
              <div className="px-6 py-3 bg-slate-900/10 border-b border-slate-800/80 shrink-0 select-none overflow-x-auto flex items-center gap-1.5 custom-scrollbar">
                {categoriesList.map(cat => (
                  <button
                    key={cat.name}
                    onClick={() => setActiveCategory(cat.name)}
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider flex items-center gap-1.5 transition-all shrink-0 active:scale-95 border",
                      activeCategory === cat.name
                        ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/20 shadow-md shadow-emerald-950/10"
                        : "bg-slate-900/40 text-slate-400 border-slate-800/80 hover:text-white hover:bg-slate-850"
                    )}
                  >
                    {cat.icon}
                    {cat.name}
                  </button>
                ))}
              </div>

              {/* Central Notification Listing */}
              <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3 custom-scrollbar">
                {filteredNotifications.length === 0 ? (
                  <div className="py-20 text-center space-y-4">
                    <div className="w-16 h-16 bg-slate-900 border border-slate-800 rounded-3xl flex items-center justify-center mx-auto shadow-2xl">
                      <Bell size={24} className="text-slate-700 animate-bounce" />
                    </div>
                    <div>
                      <h3 className="text-xs font-black text-white uppercase tracking-widest">
                        {searchQuery ? "No matches found" : viewTab === 'inbox' ? "all caught up!" : "No archived alerts"}
                      </h3>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight mt-1 leading-normal max-w-xs mx-auto">
                        {searchQuery 
                          ? "Try checking your spelling or selecting 'All' in filtering pills." 
                          : viewTab === 'inbox' 
                            ? "Splendid! You have resolved all notifications. Take a breather!" 
                            : "Starred notifications are archived here for long-term reference."}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3.5">
                    {filteredNotifications.map((n) => {
                      const catDetails = getCategoryDetails(n.category, n.type);
                      const isExpanded = expandedId === n.id;
                      const isHighPriority = n.priority === 'high';
                      
                      return (
                        <div
                          key={n.id}
                          className={cn(
                            "group rounded-2xl border transition-all duration-300 overflow-hidden relative",
                            !n.read 
                              ? "bg-slate-900/80 border-slate-800" 
                              : "bg-slate-950/40 border-slate-900 opacity-80",
                            isHighPriority && !n.read && "border-rose-500/30 bg-rose-950/5"
                          )}
                        >
                          {/* Left indicator accent bars */}
                          {!n.read && (
                            <div className={cn(
                              "absolute left-0 top-0 bottom-0 w-1",
                              isHighPriority ? "bg-rose-500" : "bg-emerald-500"
                            )} />
                          )}

                          {/* Cards visible block */}
                          <div 
                            onClick={() => handleToggleExpand(n)}
                            className="p-4 cursor-pointer select-none space-y-3 relative"
                          >
                            {/* Priority Highlight Badge if high */}
                            {isHighPriority && (
                              <div className="flex items-center gap-1.5 bg-rose-500/10 text-rose-400 border border-rose-500/20 text-[8px] font-black uppercase tracking-[0.15em] py-0.5 px-2 rounded-full w-fit">
                                <AlertCircle size={10} />
                                High Priority Notice
                              </div>
                            )}

                            {/* Top row metadata */}
                            <div className="flex items-center justify-between gap-2.5">
                              <span className={cn(
                                "flex items-center gap-1 text-[8px] font-black uppercase tracking-[0.12em] px-2 py-0.5 rounded-md border",
                                catDetails.badgeBg
                              )}>
                                {catDetails.icon}
                                {n.category || n.type || "UPDATE"}
                              </span>

                              <div className="flex items-center gap-1.5">
                                {/* Pinned block */}
                                {n.pinned && (
                                  <span className="p-1 bg-amber-500/10 text-amber-500 rounded border border-amber-500/20" title="Pinned Alert">
                                    <Pin size={10} className="fill-amber-500" />
                                  </span>
                                )}

                                {/* Date/Time string */}
                                <span className="text-[9px] font-bold text-slate-450 uppercase whitespace-nowrap">
                                  {n.createdAt?.toDate 
                                    ? formatDistanceToNow(n.createdAt.toDate(), { addSuffix: true }) 
                                    : 'just now'}
                                </span>
                              </div>
                            </div>

                            {/* Title & Preview description */}
                            <div className="space-y-1">
                              <h4 className={cn(
                                "text-xs font-black uppercase tracking-tight leading-tight",
                                !n.read ? "text-white" : "text-slate-300"
                              )}>
                                {n.title}
                              </h4>
                              <p className="text-[11px] font-medium text-slate-400 leading-relaxed line-clamp-2">
                                {n.message}
                              </p>
                            </div>

                            {/* Actions bar */}
                            <div className="flex items-center justify-between pt-2.5 border-t border-slate-900/60 text-[10px] text-slate-400 font-bold">
                              <span className="flex items-center gap-1 text-emerald-400 text-[10px] uppercase font-black tracking-widest">
                                {isExpanded ? "Collapse Content" : "Tap to expand"}
                                {isExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                              </span>

                              {/* Hover action triggers */}
                              <div className="flex items-center gap-2">
                                {!n.read && (
                                  <button
                                    onClick={(e) => handleMarkAsRead(n.id, e)}
                                    className="p-1 hover:text-emerald-400 hover:bg-slate-900 rounded transition-all"
                                    title="Mark as read"
                                  >
                                    <CheckCircle size={13} />
                                  </button>
                                )}
                                <button
                                  onClick={(e) => handleArchiveToggle(n.id, e)}
                                  className={cn(
                                    "p-1 rounded transition-all",
                                    archivedIds.includes(n.id) ? "text-amber-400" : "hover:text-amber-400 hover:bg-slate-900"
                                  )}
                                  title={archivedIds.includes(n.id) ? "Restore to inbox" : "Archive"}
                                >
                                  <Archive size={13} />
                                </button>
                                <button
                                  onClick={(e) => handleDeleteNotification(n.id, e)}
                                  className="p-1 hover:text-rose-500 hover:bg-slate-900 rounded transition-all"
                                  title="Hide Alert"
                                >
                                  <Trash2 size={13} />
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* Smooth expanding drawer view */}
                          <AnimatePresence>
                            {isExpanded && (
                              <motion.div
                                initial={{ height: 0 }}
                                animate={{ height: 'auto' }}
                                exit={{ height: 0 }}
                                className="border-t border-slate-900"
                              >
                                <div className="p-4 bg-slate-900/40 space-y-4 font-sans text-xs text-slate-300 leading-relaxed border-l-2 border-emerald-500/40">
                                  {/* Full Content */}
                                  <p className="whitespace-pre-line text-[11px]">
                                    {n.fullContent || n.message}
                                  </p>

                                  {/* Attached media banner */}
                                  {n.imageUrl && (
                                    <div className="rounded-xl overflow-hidden border border-slate-800 bg-slate-950/80">
                                      <img 
                                        src={n.imageUrl} 
                                        alt={n.title} 
                                        referrerPolicy="no-referrer"
                                        className="w-full h-auto object-cover max-h-48" 
                                      />
                                    </div>
                                  )}

                                  {/* Attachment Action elements */}
                                  <div className="flex flex-col gap-2 pt-2 border-t border-slate-900">
                                    {n.link && (
                                      <button
                                        onClick={(e) => handleActionClick(n, e)}
                                        className="w-full py-2.5 px-3 bg-white text-slate-950 rounded-xl font-black uppercase tracking-widest text-[9px] flex items-center justify-center gap-1.5 hover:bg-slate-100 transition-all active:scale-95"
                                      >
                                        <ExternalLink size={12} />
                                        {n.actionLabel || "View Action Details"}
                                      </button>
                                    )}

                                    {n.pdfUrl && (
                                      <a
                                        href={n.pdfUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-full py-2.5 px-3 bg-slate-900 hover:bg-slate-850 hover:text-white border border-slate-800 rounded-xl text-slate-300 font-black uppercase tracking-widest text-[9px] flex items-center justify-center gap-1.5 transition-all active:scale-95"
                                      >
                                        <FileText size={12} className="text-rose-500" />
                                        Download Associated PDF
                                      </a>
                                    )}

                                    {n.videoUrl && (
                                      <a
                                        href={n.videoUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-full py-2.5 px-3 bg-slate-900 hover:bg-slate-850 hover:text-white border border-slate-800 rounded-xl text-slate-300 font-black uppercase tracking-widest text-[9px] flex items-center justify-center gap-1.5 transition-all active:scale-95"
                                      >
                                        <Play size={12} className="text-emerald-500 fill-emerald-500/20" />
                                        Watch Tutorial Video
                                      </a>
                                    )}
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Drawer Footer */}
              <div className="px-6 py-4 bg-slate-900/40 border-t border-slate-800/80 text-center">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                  NaCCA Aligned System Alerts
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
