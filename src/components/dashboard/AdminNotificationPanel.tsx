import React, { useState } from 'react';
import { Send, AlertTriangle, Info, BookOpen, Calendar, Loader2, Zap } from 'lucide-react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-hot-toast';
import axios from 'axios';

export const AdminNotificationPanel = () => {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [type, setType] = useState<'update' | 'resource' | 'event' | 'system'>('update');
  const [targetUserId, setTargetUserId] = useState('all');
  const [link, setLink] = useState('');
  const [sending, setSending] = useState(false);
  const [fetchingNews, setFetchingNews] = useState(false);

  const isAdmin = user?.email === 'muhammadilias53@gmail.com';

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

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !message) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setSending(true);
    try {
      await addDoc(collection(db, 'notifications'), {
        userId: targetUserId,
        title,
        message,
        type,
        read: false,
        link: link || null,
        createdAt: serverTimestamp(),
      });
      toast.success("Broadcast sent successfully!");
      setTitle('');
      setMessage('');
      setLink('');
    } catch (err) {
      console.error("Error sending notification:", err);
      toast.error("Failed to send broadcast.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="bg-white rounded-[2.5rem] border-4 border-emerald-deep shadow-2xl p-8 mb-8 overflow-hidden relative">
      <div className="absolute top-0 right-0 p-4 bg-emerald-deep text-white text-[10px] font-black uppercase tracking-widest rounded-bl-3xl">
        Admin Controls
      </div>
      
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-deep">
          <Send size={24} />
        </div>
        <div>
          <h2 className="text-xl font-black text-slate-900 uppercase tracking-tighter">Broadcast Alert</h2>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Notify all teachers via NaCCA feed</p>
        </div>
        <div className="ml-auto">
           <button
             type="button"
             onClick={fetchLatestEducationNews}
             disabled={fetchingNews}
             className="flex items-center gap-2 px-4 py-2 bg-ghana-gold/10 text-emerald-deep hover:bg-ghana-gold/20 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border border-ghana-gold/20 active:scale-95 disabled:opacity-50"
           >
             {fetchingNews ? <Loader2 size={14} className="animate-spin" /> : <Zap size={14} className="fill-ghana-gold" />}
             AI News Pulse
           </button>
        </div>
      </div>

      <form onSubmit={handleSend} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block px-2">Alert Title</label>
            <input 
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-xs font-bold focus:ring-2 focus:ring-emerald-deep/20 outline-none"
              placeholder="e.g. New Science Resource Pack"
            />
          </div>
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block px-2">Alert Type</label>
            <select 
              value={type}
              onChange={e => setType(e.target.value as any)}
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-xs font-bold focus:ring-2 focus:ring-emerald-deep/20 outline-none appearance-none"
            >
              <option value="update">Curriculum Update</option>
              <option value="resource">New Resource</option>
              <option value="event">Educational Event</option>
              <option value="system">System Alert</option>
            </select>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block px-2">Detailed Message</label>
            <textarea 
              value={message}
              onChange={e => setMessage(e.target.value)}
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-xs font-bold focus:ring-2 focus:ring-emerald-deep/20 outline-none h-[120px] resize-none"
              placeholder="Describe the update or event details here..."
            />
          </div>
        </div>

        <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block px-2">Target Link (Optional)</label>
            <input 
              value={link}
              onChange={e => setLink(e.target.value)}
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-xs font-bold focus:ring-2 focus:ring-emerald-deep/20 outline-none"
              placeholder="/lessons or https://nacca.gov.gh"
            />
          </div>
          <button 
            type="submit"
            disabled={sending}
            className="w-full btn-primary h-[54px] rounded-2xl !bg-slate-900 text-xs font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 active:scale-95 transition-all shadow-xl shadow-slate-900/10"
          >
            {sending ? <Loader2 size={18} className="animate-spin" /> : <><Send size={18} /> Send Broadcast</>}
          </button>
        </div>
      </form>
    </div>
  );
};
