import React, { useState, useEffect } from 'react';
import { 
  Send, AlertTriangle, Info, BookOpen, Calendar, Loader2, Zap, 
  Pin, Trash2, Edit2, Sparkles, GraduationCap, CreditCard, 
  Wrench, Hammer, Award, Star, Layers, Eye, PlusCircle, 
  CheckCircle, FileText, Play, ExternalLink, RefreshCw, Clock, Users, ShieldAlert, CheckSquare
} from 'lucide-react';
import { collection, addDoc, serverTimestamp, query, orderBy, onSnapshot, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { cn } from '../../lib/utils';
import { formatDistanceToNow } from 'date-fns';

export const AdminNotificationPanel = () => {
  const { user } = useAuth();
  
  // Base States
  const [allNotifications, setAllNotifications] = useState<any[]>([]);
  const [sending, setSending] = useState(false);
  const [fetchingNews, setFetchingNews] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form Field States
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [fullContent, setFullContent] = useState('');
  const [category, setCategory] = useState('Announcements');
  const [type, setType] = useState<'update' | 'resource' | 'event' | 'system'>('update');
  const [priority, setPriority] = useState<'high' | 'medium' | 'low'>('medium');
  const [pinned, setPinned] = useState(false);
  
  // Targeting
  const [audienceType, setAudienceType] = useState<'all' | 'trial' | 'premium' | 'class' | 'subject' | 'region' | 'user'>('all');
  const [audienceValue, setAudienceValue] = useState('');

  // Attachments & Actions
  const [imageUrl, setImageUrl] = useState('');
  const [pdfUrl, setPdfUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [link, setLink] = useState('');
  const [actionLabel, setActionLabel] = useState('');

  // Scheduling
  const [scheduleDate, setScheduleDate] = useState('');

  const isAdmin = user?.email === 'muhammadilias53@gmail.com';

  // Real-time broadcast sync for analytics & editing
  useEffect(() => {
    if (!isAdmin) return;

    const q = query(
      collection(db, 'notifications'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as any[];
      setAllNotifications(docs);
    }, (err) => {
       console.error("Historical notifications fetch failure:", err);
    });

    return () => unsubscribe();
  }, [isAdmin]);

  const fetchLatestEducationNews = async () => {
    setFetchingNews(true);
    try {
      const response = await axios.get('/api/admin/broadcast/auto-sync');
      if (response.data.status === 'success') {
        toast.success(`Successfully broadcasted: ${response.data.title}`);
      } else if (response.data.status === 'skipped') {
        toast.success("News is already up to date.");
      }
    } catch (err: any) {
      const errorMsg = err.response?.data?.details || err.response?.data?.error || "Failed to fetch news automatedly.";
      toast.error(errorMsg);
    } finally {
      setFetchingNews(false);
    }
  };

  if (!isAdmin) return null;

  // Apply Presets to populate fields quickly
  const handleApplyPreset = (presetType: string) => {
    switch (presetType) {
      case 'maintenance':
        setTitle('Scheduled System Maintenance: Teaching Assistant Service');
        setMessage('We will be performing a scheduled database optimization to ensure our AI note generator executes 3x faster.');
        setFullContent('Dear Catalyst Creative Teachers,\n\nWe would like to inform you that TeachSmartGH will be undergoing scheduled database and server optimization on Sunday at 2:00 AM GMT.\n\nDuring this brief 15-minute maintenance window, AI generation tools may experience intermittent timeouts. No student records or generated files will be lost.\n\nThank you for your continuous support!');
        setCategory('Maintenance Alerts');
        setType('system');
        setPriority('medium');
        setPinned(true);
        setAudienceType('all');
        setLink('/dashboard');
        setActionLabel('Check Dashboard Status');
        break;
      case 'features':
        setTitle('New AI Educational Visuals Generator Live!');
        setMessage('Generate curriculumaligned infographics, maps, and visual teaching aids for your students with one click.');
        setFullContent('Exhilarating News!\n\nWe have officially injected a state-of-the-art AI Educational Visuals tool into the TeachSmartGH suite.\n\nOur tool is pre-aligned with the NaCCA Ghana syllabus to help you generate visual models, charts, and diagrams for classroom instruction. Fully responsive for phones and PCs.\n\nHead over to Visuals to test it now!');
        setCategory('New Features');
        setType('resource');
        setPriority('high');
        setPinned(true);
        setAudienceType('all');
        setLink('/resources');
        setActionLabel('Test AI Visuals Tool');
        setImageUrl('https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=60');
        break;
      case 'curriculum':
        setTitle('Primary Mathematics Curriculum Alignments Revised');
        setMessage('Official updates from NaCCA have been fully synchronized with TeachSmartGH lesson plan algorithms.');
        setFullContent('Dear Teachers,\n\nNaCCA has introduced revised structural indicators for Primary 4-6 Mathematics strands.\n\nOur engineering team has thoroughly updated our internal models to guarantee that any newly created lesson plans or schemes perfectly match target indicators. No manual tweaking required!');
        setCategory('Curriculum Updates');
        setType('update');
        setPriority('high');
        setPinned(false);
        setAudienceType('all');
        setLink('/schemes');
        setActionLabel('Browse Schemes of work');
        setPdfUrl('https://ncca.gov.gh');
        break;
      default:
        break;
    }
    toast.success('Preset applied successfully!');
  };

  // Reset form helper
  const handleClearForm = () => {
    setEditingId(null);
    setTitle('');
    setMessage('');
    setFullContent('');
    setCategory('Announcements');
    setType('update');
    setPriority('medium');
    setPinned(false);
    setAudienceType('all');
    setAudienceValue('');
    setImageUrl('');
    setPdfUrl('');
    setVideoUrl('');
    setLink('');
    setActionLabel('');
    setScheduleDate('');
  };

  // Submit Handler: Saves / Updates notifications safely
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !message) {
      toast.error("Please fill in the title and message fields.");
      return;
    }

    setSending(true);

    // Map selected UI category to baseline type for backcompat
    let computedType: 'update' | 'resource' | 'event' | 'system' = type;
    if (category === 'Curriculum Updates') computedType = 'update';
    else if (category === 'Teaching Resources' || category === 'New Features') computedType = 'resource';
    else if (category === 'Training & Tutorials' || category === 'Success Stories') computedType = 'event';
    else if (category === 'Maintenance Alerts' || category === 'Bug Fixes') computedType = 'system';

    // Build target UID mapping for matching query criteria
    let computedUserId = 'all';
    if (audienceType === 'user' && audienceValue) {
      computedUserId = audienceValue;
    }

    // Capture date-time scheduling parameter string / null
    let formatSchedule = null;
    if (scheduleDate) {
      formatSchedule = new Date(scheduleDate).toISOString();
    }

    const payload = {
      userId: computedUserId,
      title,
      message,
      fullContent: fullContent || message,
      type: computedType,
      category,
      priority,
      pinned,
      audienceType,
      audienceValue: audienceValue || null,
      imageUrl: imageUrl || null,
      pdfUrl: pdfUrl || null,
      videoUrl: videoUrl || null,
      link: link || null,
      actionLabel: actionLabel || null,
      scheduledFor: formatSchedule,
      read: false,
      updatedAt: serverTimestamp()
    };

    try {
      if (editingId) {
        // Edit existing notification document
        await updateDoc(doc(db, 'notifications', editingId), payload);
        toast.success("Broadcast updated successfully!");
      } else {
        // Add new notification document
        const newPayload = {
          ...payload,
          opensCount: 0,
          clicksCount: 0,
          createdAt: serverTimestamp()
        };
        await addDoc(collection(db, 'notifications'), newPayload);
        toast.success(scheduleDate ? "Broadcast scheduled successfully!" : "Broadcast sent successfully!");
      }
      handleClearForm();
    } catch (err) {
      console.error("Error creating/editing notification:", err);
      toast.error("Failed to persist notification details.");
    } finally {
      setSending(false);
    }
  };

  // Pre-fill fields for editing
  const handleEditInit = (n: any) => {
    setEditingId(n.id);
    setTitle(n.title || '');
    setMessage(n.message || '');
    setFullContent(n.fullContent || '');
    setCategory(n.category || 'Announcements');
    setType(n.type || 'update');
    setPriority(n.priority || 'medium');
    setPinned(n.pinned || false);
    setAudienceType(n.audienceType || 'all');
    setAudienceValue(n.audienceValue || '');
    setImageUrl(n.imageUrl || '');
    setPdfUrl(n.pdfUrl || '');
    setVideoUrl(n.videoUrl || '');
    setLink(n.link || '');
    setActionLabel(n.actionLabel || '');
    if (n.scheduledFor) {
      try {
        const utcStr = typeof n.scheduledFor === 'string' ? n.scheduledFor : n.scheduledFor.toDate().toISOString();
        setScheduleDate(utcStr.substring(0, 16)); // Format for datetime-local input
      } catch (err) {
        setScheduleDate('');
      }
    } else {
      setScheduleDate('');
    }
    
    // Smooth scroll back to form
    window.scrollTo({ top: 0, behavior: 'smooth' });
    toast("Notification parameters loaded for editing", { icon: '📝' });
  };

  // Delete notification instantly
  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you absolutely sure you want to delete this notification from the system? This action is irreversible.")) return;

    try {
      await deleteDoc(doc(db, 'notifications', id));
      toast.success("Broadcast deleted permanently.");
      if (editingId === id) handleClearForm();
    } catch (err) {
      console.error("Error deleting notification:", err);
      toast.error("Failed to delete notification.");
    }
  };

  // Toggle Pinned on List
  const handleTogglePinOnList = async (id: string, currentVal: boolean) => {
    try {
      await updateDoc(doc(db, 'notifications', id), {
        pinned: !currentVal,
        updatedAt: serverTimestamp()
      });
      toast.success(`Broadcaster ${currentVal ? 'unpinned' : 'pinned'} successfully!`);
    } catch (err) {
      toast.error("Failed to toggle pin state");
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 md:px-0">
      
      {/* Top Admin HUD banner to confirm privilege */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl -translate-y-32 translate-x-32" />
        
        <div className="flex items-center gap-4 relative z-10">
          <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-400 border border-emerald-500/20 shadow-xl">
            <ShieldAlert size={24} />
          </div>
          <div>
            <h1 className="text-xl font-black text-white uppercase tracking-tight">TeachSmartGH Communication Desk</h1>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">
              NaCCA aligned push, target messaging, and real-time read/click telemetry
            </p>
          </div>
        </div>

        <button
          onClick={fetchLatestEducationNews}
          disabled={fetchingNews}
          className="relative z-10 flex items-center justify-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl active:scale-95 disabled:opacity-50"
        >
          {fetchingNews ? <Loader2 size={14} className="animate-spin" /> : <Zap size={14} className="fill-slate-950" />}
          Pull AI Education News
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: THE FORMS AND PRESETS */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Preset Buttons Board */}
          <div className="bg-slate-900 border border-slate-805/80 rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-amber-400" />
              <h3 className="text-xs font-black text-white uppercase tracking-widest">Rapid Presets & Templates</h3>
            </div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight leading-normal">
              Pre-fill standard structures for fast releases. Tap a preset to edit before broadcasting.
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              <button
                onClick={() => handleApplyPreset('features')}
                className="px-3.5 py-2.5 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/15 text-purple-400 rounded-xl text-[10px] font-bold uppercase transition-all tracking-wider flex items-center gap-2"
              >
                🚀 New AI Visuals Tool
              </button>
              <button
                onClick={() => handleApplyPreset('curriculum')}
                className="px-3.5 py-2.5 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/15 text-blue-400 rounded-xl text-[10px] font-bold uppercase transition-all tracking-wider flex items-center gap-2"
              >
                📚 Math Syllabus Sync
              </button>
              <button
                onClick={() => handleApplyPreset('maintenance')}
                className="px-3.5 py-2.5 bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/15 text-orange-400 rounded-xl text-[10px] font-bold uppercase transition-all tracking-wider flex items-center gap-2"
              >
                🔧 Database Maintenance
              </button>
            </div>
          </div>

          {/* Core Creation/Update Form Container */}
          <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] shadow-2xl p-6 md:p-8 relative">
            <div className="absolute top-0 right-0 p-4 bg-emerald-500/10 text-emerald-400 text-[9px] font-black uppercase tracking-widest rounded-bl-3xl border-l border-b border-emerald-500/15">
              {editingId ? "Mode: Editing Alert" : "Mode: Create Broadcast"}
            </div>

            <div className="flex items-center gap-3.5 mb-6">
              <div className="w-10 h-10 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-400 border border-emerald-500/20">
                <PlusCircle size={20} />
              </div>
              <div>
                <h2 className="text-sm font-black text-white uppercase tracking-widest">
                  {editingId ? "Update Existing Notice" : "Draft New Alert"}
                </h2>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight mt-1">Configure alerts, attachments and audience metrics</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Row 1: Title & Category selection */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-350 uppercase tracking-widest block px-1">Alert Title *</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    placeholder="e.g. Science Fair Training Registration open"
                    className="w-full bg-slate-950 border border-slate-800/85 focus:border-emerald-500 rounded-xl p-3.5 text-xs font-bold text-white outline-none transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-350 uppercase tracking-widest block px-1">Category & Icon Group</label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800/85 focus:border-emerald-500 rounded-xl p-3.5 text-xs font-bold text-white outline-none transition-all appearance-none cursor-pointer"
                  >
                    <option value="Announcements">📢 Announcements</option>
                    <option value="New Features">🚀 New Features</option>
                    <option value="Curriculum Updates">📚 Curriculum Updates</option>
                    <option value="Training & Tutorials">🎓 Training & Tutorials</option>
                    <option value="Subscription Updates">💳 Subscription Updates</option>
                    <option value="Maintenance Alerts">🔧 Maintenance Alerts</option>
                    <option value="Bug Fixes">🛠 Bug Fixes</option>
                    <option value="Teaching Resources">📖 Teaching Resources</option>
                    <option value="Success Stories">⭐ Success Stories</option>
                    <option value="General Updates">📍 General Updates</option>
                  </select>
                </div>
              </div>

              {/* Row 2: Short Preview Description */}
              <div className="space-y-2">
                <div className="flex justify-between items-center px-1">
                  <label className="text-[10px] font-black text-slate-350 uppercase tracking-widest block">Short Preview Description *</label>
                  <span className="text-[9px] font-bold text-slate-500 uppercase">max 150 chars</span>
                </div>
                <textarea
                  required
                  rows={2}
                  maxLength={160}
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  placeholder="Summarize the alert in 1-2 powerful sentences to captivate teachers' attention in push boards."
                  className="w-full bg-slate-950 border border-slate-800/85 focus:border-emerald-500 rounded-xl p-3.5 text-xs font-bold text-white outline-none transition-all resize-none"
                />
              </div>

              {/* Row 3: Extended Full Content Body */}
              <div className="space-y-2">
                <div className="flex justify-between items-center px-1">
                  <label className="text-[10px] font-black text-slate-350 uppercase tracking-widest block">Expanded Full Notice Body</label>
                  <span className="text-[9px] font-bold text-slate-500 uppercase">Supporting Full Content (Markdown ready)</span>
                </div>
                <textarea
                  rows={4}
                  value={fullContent}
                  onChange={e => setFullContent(e.target.value)}
                  placeholder="Inject rich narratives, list coordinates, guidelines, or detailed procedures. This reveals smoothly when a user clicks expand."
                  className="w-full bg-slate-950 border border-slate-800/85 focus:border-emerald-500 rounded-xl p-3.5 text-xs font-semibold text-white outline-none transition-all"
                />
              </div>

              {/* Row 4: Priority & Pin & Scheduling */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-350 uppercase tracking-widest block px-1">Priority Tier</label>
                  <select
                    value={priority}
                    onChange={e => setPriority(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800/85 focus:border-emerald-500 rounded-xl p-3.5 text-xs font-bold text-white outline-none transition-all cursor-pointer"
                  >
                    <option value="low">🟢 Low Priority</option>
                    <option value="medium">🟡 Medium Priority</option>
                    <option value="high">🔴 High Priority (Bold emphasis)</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-350 uppercase tracking-widest block px-1">Schedule Notice Date (Optional)</label>
                  <input
                    type="datetime-local"
                    value={scheduleDate}
                    onChange={e => setScheduleDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800/85 focus:border-emerald-500 rounded-xl p-3 text-xs font-bold text-white outline-none transition-all cursor-pointer"
                  />
                </div>

                <div className="space-y-2 flex flex-col justify-end">
                  <button
                    type="button"
                    onClick={() => setPinned(!pinned)}
                    className={cn(
                      "w-full p-3.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border transition-all active:scale-95",
                      pinned
                        ? "bg-amber-500/10 text-amber-400 border-amber-500/35"
                        : "bg-slate-950 text-slate-400 border-slate-805 hover:text-slate-300"
                    )}
                  >
                    <Pin size={13} className={pinned ? "fill-amber-400" : ""} />
                    {pinned ? "Pinned to top" : "Pin alert to top"}
                  </button>
                </div>
              </div>

              {/* Section Accordion: Target Audience Filters */}
              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800/80 space-y-4">
                <div className="flex items-center gap-2 text-emerald-400">
                  <Users size={14} />
                  <h4 className="text-[10px] font-black uppercase tracking-widest">Target Audience Selector</h4>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-slate-450 uppercase block">Audience Category</label>
                    <select
                      value={audienceType}
                      onChange={e => { setAudienceType(e.target.value as any); setAudienceValue(''); }}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs font-bold text-white outline-none cursor-pointer"
                    >
                      <option value="all">👥 All Registered Teachers</option>
                      <option value="trial">⏳ Trial / Guest Users</option>
                      <option value="premium">💎 Active Premium Subscribers</option>
                      <option value="class">📁 Specific Grades / Classes</option>
                      <option value="subject">📖 Specific Subject Specialists</option>
                      <option value="region">🇬🇭 Specific Regions (Ghana)</option>
                      <option value="user">👤 Individual User UUID</option>
                    </select>
                  </div>

                  {audienceType !== 'all' && audienceType !== 'trial' && audienceType !== 'premium' && (
                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-slate-450 uppercase block">Specific Alignment Target value</label>
                      <input
                        type="text"
                        required
                        value={audienceValue}
                        onChange={e => setAudienceValue(e.target.value)}
                        placeholder={
                          audienceType === 'class' ? "e.g. Basic 4, JHS 1" : 
                          audienceType === 'subject' ? "e.g. Science, Mathematics" : 
                          audienceType === 'region' ? "e.g. Greater Accra, Ashanti" : 
                          "e.g. user_auth_uid_123_abc"
                        }
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs font-bold text-white outline-none"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Section Accordion: Optional Media Attachments & Action Buttons */}
              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800/80 space-y-4">
                <div className="flex items-center gap-2 text-purple-400">
                  <Layers size={14} />
                  <h4 className="text-[10px] font-black uppercase tracking-widest">Media Attachments & Deep Link Action</h4>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-slate-450 uppercase block">Header Feature Image URL</label>
                    <input
                      type="url"
                      value={imageUrl}
                      onChange={e => setImageUrl(e.target.value)}
                      placeholder="https://images.unsplash.com/...jpg"
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs font-bold text-slate-100 outline-none placeholder:opacity-40"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-slate-450 uppercase block">Linked PDF URL</label>
                    <input
                      type="url"
                      value={pdfUrl}
                      onChange={e => setPdfUrl(e.target.value)}
                      placeholder="https://drive.google.com/..."
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs font-bold text-slate-100 outline-none placeholder:opacity-40"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-slate-450 uppercase block">Tutorial Video Link (YouTube)</label>
                    <input
                      type="url"
                      value={videoUrl}
                      onChange={e => setVideoUrl(e.target.value)}
                      placeholder="https://youtube.com/..."
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs font-bold text-slate-100 outline-none placeholder:opacity-40"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-slate-450 uppercase block">Action Transition Link</label>
                    <input
                      type="text"
                      value={link}
                      onChange={e => setLink(e.target.value)}
                      placeholder="/lessons or https://nacca.gov.gh"
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs font-bold text-slate-100 outline-none placeholder:opacity-40"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-slate-450 uppercase block">Custom Action Label text</label>
                    <input
                      type="text"
                      value={actionLabel}
                      onChange={e => setActionLabel(e.target.value)}
                      placeholder="e.g. Join Webinar, Download Syllabus"
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs font-bold text-slate-100 outline-none placeholder:opacity-40"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Buttons Row */}
              <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                <button
                  type="submit"
                  disabled={sending}
                  className="w-full sm:flex-1 h-[50px] bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2.5 rounded-xl shadow-xl transition-all active:scale-95 disabled:opacity-50"
                >
                  {sending ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <>
                      <Send size={15} />
                      {editingId ? "Update Broadcast Details" : "Dispatch Broadcast Now"}
                    </>
                  )}
                </button>

                {editingId && (
                  <button
                    type="button"
                    onClick={handleClearForm}
                    className="w-full sm:w-auto h-[50px] px-6 bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-black uppercase tracking-widest rounded-xl border border-slate-700 transition-all active:scale-95"
                  >
                    Cancel Editing
                  </button>
                )}

                {!editingId && (
                  <button
                    type="button"
                    onClick={handleClearForm}
                    className="w-full sm:w-auto h-[50px] px-6 bg-slate-950 hover:bg-slate-900 text-slate-450 text-xs font-bold uppercase tracking-wider rounded-xl transition-all"
                  >
                    Clear Form
                  </button>
                )}
              </div>

            </form>
          </div>
        </div>

        {/* RIGHT COLUMN: HISTORICAL LIST & TELEMENTRY ANALYTICS */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 bg-purple-500/10 rounded-xl flex items-center justify-center text-purple-400 border border-purple-500/15">
                  <Clock size={16} />
                </div>
                <div>
                  <h3 className="text-sm font-black text-white uppercase tracking-tight">Dispatch Log & Telemetry</h3>
                  <p className="text-[9px] font-bold text-slate-450 uppercase mt-0.5">Real-time interaction tracker</p>
                </div>
              </div>

              <span className="bg-slate-950 px-2.5 py-1 text-slate-400 border border-slate-800 rounded-lg text-[9px] font-black uppercase tracking-wider">
                Total: {allNotifications.length}
              </span>
            </div>

            {/* List scroll container */}
            <div className="space-y-4 max-h-[850px] overflow-y-auto custom-scrollbar pr-1">
              {allNotifications.length === 0 ? (
                <div className="py-20 text-center text-slate-500 uppercase text-[10px] font-black tracking-widest leading-loose">
                  No historical broadcasts found.<br/>Draft your first alert!
                </div>
              ) : (
                allNotifications.map((n) => {
                  const isScheduled = n.scheduledFor && new Date(n.scheduledFor) > new Date();
                  const totalReads = n.opensCount || 0;
                  const totalClicks = n.clicksCount || 0;
                  
                  return (
                    <div 
                      key={n.id} 
                      className={cn(
                        "p-4 rounded-2xl border bg-slate-950/60 transition-all space-y-3 relative hover:bg-slate-950",
                        n.priority === 'high' ? "border-rose-500/20" : "border-slate-850"
                      )}
                    >
                      {/* pin symbol badge */}
                      {n.pinned && (
                        <div className="absolute top-3.5 right-3.5 text-amber-500" title="Pinned to top">
                          <Pin size={11} className="fill-amber-500" />
                        </div>
                      )}

                      {/* Header indicators */}
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-2 py-0.5 bg-slate-900 text-slate-300 border border-slate-800 text-[8px] font-black uppercase rounded">
                          {n.category || "General"}
                        </span>
                        
                        <span className={cn(
                          "px-2 py-0.5 text-[8px] font-black uppercase rounded flex items-center gap-1",
                          n.priority === 'high' ? "bg-rose-500/10 text-rose-400 border border-rose-500/15" :
                          n.priority === 'medium' ? "bg-amber-500/10 text-amber-400 border border-amber-500/15" :
                          "bg-emerald-500/10 text-emerald-400 border border-emerald-500/15"
                        )}>
                          {n.priority || "medium"}
                        </span>

                        {isScheduled && (
                          <span className="px-2 py-0.5 bg-blue-500/10 text-blue-400 border border-blue-500/15 text-[8px] font-black uppercase rounded flex items-center gap-1">
                            <Clock size={8} />
                            Scheduled Future
                          </span>
                        )}
                      </div>

                      {/* Subject title & message */}
                      <div>
                        <h4 className="text-xs font-black text-white uppercase tracking-tight">{n.title}</h4>
                        <p className="text-[10px] font-medium text-slate-400 leading-normal line-clamp-2 mt-1">{n.message}</p>
                      </div>

                      {/* Audience Indicator */}
                      <div className="flex items-center gap-1.5 text-[9px] text-slate-450 font-bold border-t border-slate-900 pt-2.5 uppercase">
                        <Users size={10} className="text-emerald-400" />
                        <span>To: <strong className="text-slate-300">{n.audienceType === 'all' ? "All Teachers" : `${n.audienceType} (${n.audienceValue})`}</strong></span>
                      </div>

                      {/* Live Statistics telemetry */}
                      <div className="grid grid-cols-2 gap-2 bg-slate-900/40 p-2.5 rounded-xl border border-slate-900">
                        <div className="space-y-0.5 flex flex-col">
                          <span className="text-[8px] font-black uppercase text-slate-450 tracking-wider flex items-center gap-1">
                            <Eye size={10} className="text-blue-400" />
                            Total Opens
                          </span>
                          <span className="text-xs font-black text-white">{totalReads} views</span>
                        </div>

                        <div className="space-y-0.5 flex flex-col">
                          <span className="text-[8px] font-black uppercase text-slate-450 tracking-wider flex items-center gap-1">
                            <ExternalLink size={10} className="text-amber-400" />
                            Button Clicks
                          </span>
                          <span className="text-xs font-black text-white">{totalClicks} clicks</span>
                        </div>
                      </div>

                      {/* Actions toolbar */}
                      <div className="flex items-center justify-between text-[10px] pt-1 text-slate-400 font-bold">
                        <span className="text-[9px] text-slate-500 whitespace-nowrap">
                          {n.createdAt?.toDate ? formatDistanceToNow(n.createdAt.toDate(), { addSuffix: true }) : 'just now'}
                        </span>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleTogglePinOnList(n.id, n.pinned)}
                            title="Toggle Pin state"
                            className="p-1.5 hover:text-amber-400 hover:bg-slate-900 rounded-lg transition-all"
                          >
                            <Pin size={12} className={n.pinned ? "fill-amber-400" : ""} />
                          </button>
                          
                          <button
                            onClick={() => handleEditInit(n)}
                            title="Load for editing"
                            className="p-1.5 hover:text-emerald-400 hover:bg-slate-900 rounded-lg transition-all"
                          >
                            <Edit2 size={12} />
                          </button>

                          <button
                            onClick={() => handleDelete(n.id)}
                            title="Permanently remove"
                            className="p-1.5 hover:text-rose-500 hover:bg-slate-900 rounded-lg transition-all"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>

                    </div>
                  );
                })
              )}
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};
