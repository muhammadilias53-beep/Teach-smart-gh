import React, { useState, useEffect } from 'react';
import { Users, Shield, Zap, Search, Filter, Mail, Calendar, CheckCircle, XCircle, AlertCircle, Loader2, ArrowRight, Download, MoreVertical, Trash2, Eye, FileText, RotateCcw, Clock } from 'lucide-react';
import { collection, query, getDocs, orderBy, updateDoc, doc, where, writeBatch, serverTimestamp, getCountFromServer, limit } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuth } from '../../contexts/AuthContext';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'react-hot-toast';
import { format } from 'date-fns';

interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  subscriptionStatus: string;
  school?: string;
  createdAt?: any;
  lastLoginAt?: any;
  docCount?: number;
}

const AdminCommandCenter = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [updating, setUpdating] = useState<string | null>(null);
  const [selectedUids, setSelectedUids] = useState<Set<string>>(new Set());

  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [isBulkProcessing, setIsBulkProcessing] = useState(false);

  const isAdmin = user?.email === 'muhammadilias53@gmail.com';

  useEffect(() => {
    if (isAdmin) {
      fetchUsers();
    }
  }, [isAdmin]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'users'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      const userList = snapshot.docs.map(doc => ({
        uid: doc.id,
        ...doc.data()
      })) as UserProfile[];
      setUsers(userList);
    } catch (err) {
      console.error("Error fetching users:", err);
      toast.error("Failed to load users list.");
    } finally {
      setLoading(false);
    }
  };

  const handleBulkActivate = async () => {
    const targetUids = Array.from(selectedUids);
    if (targetUids.length === 0) return;
    
    if (!window.confirm(`Activate PRO for ${targetUids.length} selected teachers?`)) return;

    setIsBulkProcessing(true);
    try {
      const batch = writeBatch(db);
      targetUids.forEach(uid => {
        const userRef = doc(db, 'users', uid);
        batch.update(userRef, { 
          subscriptionStatus: 'active',
          updatedAt: serverTimestamp()
        });
      });
      await batch.commit();
      toast.success(`PRO activated for ${targetUids.length} users!`);
      setSelectedUids(new Set());
      fetchUsers();
    } catch (err) {
      toast.error("Bulk activation failed.");
    } finally {
      setIsBulkProcessing(false);
    }
  };

  const toggleSelection = (uid: string) => {
    const newSelected = new Set(selectedUids);
    if (newSelected.has(uid)) {
      newSelected.delete(uid);
    } else {
      newSelected.add(uid);
    }
    setSelectedUids(newSelected);
  };

  const toggleAllSelection = () => {
    if (selectedUids.size === filteredUsers.length) {
      setSelectedUids(new Set());
    } else {
      setSelectedUids(new Set(filteredUsers.map(u => u.uid)));
    }
  };

  const toggleSubscription = async (userId: string, currentStatus: string) => {
    setUpdating(userId);
    const newStatus = currentStatus === 'active' ? 'expired' : 'active';
    try {
      await updateDoc(doc(db, 'users', userId), {
        subscriptionStatus: newStatus
      });
      setUsers(users.map(u => u.uid === userId ? { ...u, subscriptionStatus: newStatus } : u));
      toast.success(`Subscription ${newStatus === 'active' ? 'activated' : 'deactivated'} for user.`);
    } catch (err) {
      toast.error("Failed to update status.");
    } finally {
      setUpdating(null);
    }
  };

  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8">
        <Shield size={64} className="text-rose-500 mb-6 opacity-20" />
        <h1 className="text-3xl font-black text-slate-900 mb-4">RESTRICTED AREA</h1>
        <p className="text-slate-500 font-medium max-w-md uppercase tracking-widest text-xs">
          This sector is reserved for Ministry of Education Admin Personnel. 
          Unauthorized access is logged and monitored.
        </p>
      </div>
    );
  }

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.email?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          u.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          u.school?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || u.subscriptionStatus === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tightest mb-2 uppercase italic flex items-center gap-4">
            <Shield className="text-emerald-deep" size={36} />
            Command Center
          </h1>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-xs flex items-center gap-2">
            System Overseer: {user?.email} 
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          {selectedUids.size > 0 && (
            <button 
              onClick={handleBulkActivate}
              disabled={isBulkProcessing}
              className="bg-emerald-600 text-white px-6 py-3 rounded-2xl shadow-xl shadow-emerald-900/10 flex items-center gap-3 hover:bg-emerald-700 transition-all active:scale-95 animate-in fade-in slide-in-from-right-4"
            >
               {isBulkProcessing ? <Loader2 size={18} className="animate-spin" /> : <Shield size={18} />}
               <span className="text-[10px] font-black tracking-widest uppercase">Activate {selectedUids.size} Selected</span>
            </button>
          )}
          <button 
            onClick={fetchUsers}
            className="bg-slate-900 text-white px-6 py-3 rounded-2xl shadow-xl shadow-slate-900/10 flex items-center gap-3 hover:bg-black transition-all active:scale-95"
          >
             <RotateCcw size={18} className="text-ghana-gold" />
             <span className="text-[10px] font-black tracking-widest uppercase">Refresh ({filteredUsers.length})</span>
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard 
          title="Total Personnel" 
          value={users.length} 
          icon={Users} 
          color="text-slate-900" 
        />
        <StatCard 
          title="PRO Educators" 
          value={users.filter(u => u.subscriptionStatus === 'active').length} 
          icon={Shield} 
          color="text-emerald-600" 
        />
        <StatCard 
          title="Total Artifacts" 
          value={users.reduce((acc, u) => acc + (u.docCount || 0), 0)} 
          icon={FileText} 
          color="text-indigo-600" 
        />
        <StatCard 
          title="Global Status" 
          value="Online" 
          icon={Zap} 
          color="text-ghana-gold" 
        />
      </div>

      {/* Controls */}
      <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-xl shadow-slate-200/50 flex flex-col md:flex-row gap-6">
        <div className="flex-1 relative">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
          <input 
            type="text" 
            placeholder="SEARCH TEACHERS BY NAME, EMAIL OR SCHOOL..." 
            className="w-full pl-16 pr-8 py-5 bg-slate-50 border border-slate-100 rounded-[1.5rem] focus:ring-4 focus:ring-emerald-deep/10 focus:border-emerald-deep transition-all text-xs font-black tracking-[0.1em] outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-4">
          <select 
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-8 py-5 bg-slate-50 border border-slate-100 rounded-[1.5rem] focus:ring-4 focus:ring-emerald-deep/10 focus:border-emerald-deep transition-all text-xs font-black tracking-[0.1em] outline-none appearance-none cursor-pointer"
          >
            <option value="all">ALL STATUSES</option>
            <option value="active">PRO USERS</option>
            <option value="expired">BASIC USERS</option>
          </select>
          <button 
            onClick={fetchUsers}
            className="p-5 bg-white border border-slate-100 rounded-[1.5rem] hover:bg-slate-50 transition-all text-slate-400 hover:text-emerald-deep shadow-sm"
          >
            <Zap size={20} />
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl overflow-hidden">
        {loading ? (
          <div className="py-32 flex flex-col items-center justify-center space-y-4">
            <Loader2 className="animate-spin text-emerald-deep" size={48} />
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Querying Server...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-50">
                  <th className="px-8 py-6 w-10">
                    <input 
                      type="checkbox" 
                      className="w-4 h-4 rounded border-slate-300 text-emerald-deep focus:ring-emerald-deep cursor-pointer"
                      checked={selectedUids.size === filteredUsers.length && filteredUsers.length > 0}
                      onChange={toggleAllSelection}
                    />
                  </th>
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Teacher</th>
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Activity</th>
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Subscription Status</th>
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredUsers.map((u) => (
                  <motion.tr 
                    key={u.uid}
                    layout
                    className={cn(
                      "transition-colors",
                      selectedUids.has(u.uid) ? "bg-emerald-50/30" : "hover:bg-slate-50/30"
                    )}
                  >
                    <td className="px-8 py-6">
                      <input 
                        type="checkbox" 
                        className="w-4 h-4 rounded border-slate-300 text-emerald-deep focus:ring-emerald-deep cursor-pointer"
                        checked={selectedUids.has(u.uid)}
                        onChange={() => toggleSelection(u.uid)}
                      />
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-deep text-lg font-black shrink-0">
                          {u.displayName?.[0] || u.email?.[0]?.toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-black text-slate-900 truncate uppercase tracking-tight">{u.displayName || 'Unnamed User'}</p>
                            {u.subscriptionStatus === 'active' && <Shield size={12} className="text-emerald-500" />}
                          </div>
                          <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            <Mail size={10} />
                            <span className="truncate">{u.email}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-600 uppercase tracking-tighter">
                          <Clock size={10} className="text-slate-300" />
                          Login: {u.lastLoginAt?.toDate ? format(u.lastLoginAt.toDate(), 'MMM d, HH:mm') : 'N/A'}
                        </div>
                        <div className="flex items-center gap-2 text-[9px] font-bold text-slate-400 uppercase">
                          <Calendar size={10} className="text-slate-200" />
                          Joined: {u.createdAt?.toDate ? format(u.createdAt.toDate(), 'MMM d, yyyy') : 'Recently'}
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col gap-2">
                        <div className={cn(
                          "inline-flex items-center gap-2 px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest w-fit shadow-sm border",
                          u.subscriptionStatus === 'active' 
                            ? "bg-emerald-50 text-emerald-600 border-emerald-100" 
                            : "bg-slate-50 text-slate-400 border-slate-100"
                        )}>
                          {u.subscriptionStatus === 'active' ? <CheckCircle size={10} /> : <XCircle size={10} />}
                          {u.subscriptionStatus || 'TRIAL'}
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex items-center justify-end gap-3 pr-4">
                         <button 
                           onClick={() => toggleSubscription(u.uid, u.subscriptionStatus)}
                           disabled={updating === u.uid}
                           className="px-6 py-3 bg-white border border-slate-100 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all active:scale-95 shadow-sm"
                         >
                           {u.subscriptionStatus === 'active' ? 'Revoke ACCESS' : 'Grant PRO'}
                         </button>
                         <button 
                           onClick={() => setSelectedUser(u)}
                           className="p-3 bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-emerald-deep transition-all shadow-sm"
                         >
                           <Eye size={16} />
                         </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
            
            {filteredUsers.length === 0 && (
              <div className="py-20 text-center">
                 <AlertCircle className="text-slate-200 mx-auto mb-4" size={48} />
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">No matching personnel found in database</p>
              </div>
            )}
          </div>
        )}
      </div>

      <AnimatePresence>
        {selectedUser && (
          <UserOverviewModal 
            user={selectedUser} 
            onClose={() => setSelectedUser(null)} 
            onRefresh={fetchUsers}
          />
        )}
      </AnimatePresence>

      <div className="px-8 text-center text-[9px] font-black text-slate-300 uppercase tracking-[0.5em]">
        End of Ministry User Directory • NaCCA Security Protocol v4.2
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon: Icon, color }: any) => (
  <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 group overflow-hidden relative">
    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
      <Icon size={80} />
    </div>
    <div className="relative z-10">
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{title}</p>
      <div className="flex items-center gap-4">
        <h3 className={cn("text-4xl font-black", color)}>{value}</h3>
        <Icon className={cn("opacity-20", color)} size={32} />
      </div>
    </div>
  </div>
);

const UserOverviewModal = ({ user, onClose, onRefresh }: { user: UserProfile, onClose: () => void, onRefresh: () => void }) => {
  const [loadingDocs, setLoadingDocs] = useState(true);
  const [docs, setDocs] = useState<any[]>([]);

  useEffect(() => {
    const fetchUserDocs = async () => {
      try {
        const q = query(
          collection(db, 'lessonPlans'), 
          where('authorId', '==', user.uid),
          orderBy('createdAt', 'desc'),
          limit(10)
        );
        const snap = await getDocs(q);
        setDocs(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingDocs(false);
      }
    };
    fetchUserDocs();
  }, [user.uid]);

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
      <motion.div 
        initial={{ y: 20, opacity: 0, scale: 0.95 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 20, opacity: 0, scale: 0.95 }}
        className="bg-white w-full max-w-4xl rounded-[3rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        <div className="p-10 border-b border-slate-50 flex justify-between items-start">
          <div className="flex gap-6">
            <div className="w-20 h-20 bg-emerald-deep/10 rounded-[2rem] flex items-center justify-center text-emerald-deep">
              <Users size={32} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tightest mb-1">{user.displayName || 'Teacher'}</h2>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Mail size={12} /> {user.email}
              </p>
              <div className="flex gap-3 mt-4">
                <div className="px-3 py-1.5 bg-slate-100 rounded-full text-[9px] font-black uppercase tracking-widest text-slate-500">
                  ID: {user.uid.slice(0, 8)}...
                </div>
                <div className="px-3 py-1.5 bg-emerald-50 rounded-full text-[9px] font-black uppercase tracking-widest text-emerald-600">
                  {user.subscriptionStatus || 'TRIAL'}
                </div>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="p-3 bg-slate-50 hover:bg-slate-100 rounded-2xl transition-colors">
            <XCircle className="text-slate-400" size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-10 bg-slate-50/30">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-6">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] mb-4">Professional Record</h3>
                <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
                   <div className="space-y-4">
                      <div className="flex justify-between items-center pb-4 border-b border-slate-50">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Institution</span>
                        <span className="text-xs font-bold text-slate-900 uppercase tracking-tighter">{user.school || 'Unlisted School'}</span>
                      </div>
                      <div className="flex justify-between items-center pb-4 border-b border-slate-50">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Signed In</span>
                        <span className="text-xs font-bold text-slate-900 uppercase tracking-tighter">{user.lastLoginAt?.toDate ? format(user.lastLoginAt.toDate(), 'PPpp') : 'N/A'}</span>
                      </div>
                      <div className="flex justify-between items-center pb-4 border-b border-slate-50">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Enrolled</span>
                        <span className="text-xs font-bold text-slate-900 uppercase tracking-tighter">{user.createdAt?.toDate ? format(user.createdAt.toDate(), 'PPpp') : 'N/A'}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Platform Status</span>
                        <span className="text-xs font-black text-emerald-600 uppercase tracking-tighter flex items-center gap-2">
                           <CheckCircle size={14} /> ACTIVE PERSONNEL
                        </span>
                      </div>
                   </div>
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] mb-4">Recent Intellectual Artifacts</h3>
                <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
                   {loadingDocs ? (
                     <div className="py-20 flex justify-center"><Loader2 className="animate-spin text-slate-200" /></div>
                   ) : docs.length > 0 ? (
                     <div className="divide-y divide-slate-50">
                       {docs.map(d => (
                         <div key={d.id} className="p-4 flex justify-between items-center hover:bg-slate-50 transition-colors">
                           <div className="flex items-center gap-3">
                              <FileText size={16} className="text-emerald-deep" />
                              <span className="text-[10px] font-bold text-slate-900 uppercase tracking-tighter truncate max-w-[150px]">{d.title}</span>
                           </div>
                           <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">
                             {d.createdAt?.toDate ? format(d.createdAt.toDate(), 'MMM d') : 'Recent'}
                           </span>
                         </div>
                       ))}
                     </div>
                   ) : (
                     <div className="py-20 text-center text-[10px] font-black text-slate-300 uppercase tracking-widest">No artifacts generated by this official</div>
                   )}
                </div>
              </div>
           </div>
        </div>

        <div className="p-8 border-t border-slate-50 bg-slate-50/50 flex justify-end gap-4">
           <button 
             onClick={onClose}
             className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-600"
           >
             Close File
           </button>
        </div>
      </motion.div>
    </div>
  );
};

const cn = (...classes: any[]) => classes.filter(Boolean).join(' ');

export default AdminCommandCenter;
