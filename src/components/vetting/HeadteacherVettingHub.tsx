import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldCheck, CheckCircle2, Clock, AlertTriangle, Search, Filter, 
  Plus, Download, FileText, Check, Award, School, User, BookOpen, 
  ChevronRight, RefreshCw, PenTool, Sparkles, Layers, SlidersHorizontal,
  Building2, Users, Share2, Copy, MessageCircle, QrCode, FileSpreadsheet,
  Settings, Edit3, Phone, Mail, UserPlus, Printer, AlertCircle, X
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-hot-toast';
import { 
  VettingSubmission, 
  VettingStatus, 
  HeadteacherStampConfig,
  SchoolVettingPortal,
  SchoolTeacherMember
} from '../../types/vetting';
import { 
  getVettingSubmissions, 
  getHeadteacherStampConfig, 
  saveHeadteacherStampConfig,
  isHeadteacherUser,
  getOrCreateHeadteacherPortal,
  getSchoolPortalByCode,
  updateSchoolPortal,
  getSchoolTeachersWithStats
} from '../../lib/vettingService';
import { VettingInspectorModal } from './VettingInspectorModal';
import { DigitalStamp, SignaturePad } from './DigitalStamp';
import { exportLessonPlanPDF } from '../../lib/lessonPlanPdfExport';
import { exportLessonPlanToWord } from '../../lib/wordExport';
import { Link } from 'react-router';

export default function HeadteacherVettingHub() {
  const { user, profile } = useAuth();
  const [submissions, setSubmissions] = useState<VettingSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState<VettingSubmission | null>(null);
  const [statusFilter, setStatusFilter] = useState<'all' | VettingStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('all');
  
  // School Portal State
  const [portal, setPortal] = useState<SchoolVettingPortal | null>(null);
  const [teacherStats, setTeacherStats] = useState<Array<SchoolTeacherMember & {
    totalPlans: number;
    pendingPlans: number;
    approvedPlans: number;
    needsRevisionPlans: number;
  }>>([]);
  const [loadingTeachers, setLoadingTeachers] = useState(false);
  const [activeTab, setActiveTab] = useState<'queue' | 'teachers' | 'stamp' | 'inspection_log'>('queue');
  const [showPortalEditModal, setShowPortalEditModal] = useState(false);
  const [showAddTeacherModal, setShowAddTeacherModal] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  // New Teacher Form
  const [newTeacherName, setNewTeacherName] = useState('');
  const [newTeacherEmail, setNewTeacherEmail] = useState('');
  const [newTeacherPhone, setNewTeacherPhone] = useState('');
  const [newTeacherClass, setNewTeacherClass] = useState('Basic 4');
  const [newTeacherSubject, setNewTeacherSubject] = useState('General');

  // Portal Edit Form
  const [editSchoolName, setEditSchoolName] = useState('');
  const [editDistrict, setEditDistrict] = useState('');
  const [editHeadName, setEditHeadName] = useState('');
  const [editDesignation, setEditDesignation] = useState('');
  const [editCode, setEditCode] = useState('');

  const isHeadteacher = isHeadteacherUser(profile);
  const [roleMode, setRoleMode] = useState<'headteacher' | 'teacher'>(() => 
    isHeadteacherUser(profile) ? 'headteacher' : 'teacher'
  );

  // Headteacher stamp configuration state
  const [stampConfig, setStampConfig] = useState<HeadteacherStampConfig>(() => 
    getHeadteacherStampConfig(profile)
  );
  const [showStampSettingsModal, setShowStampSettingsModal] = useState(false);
  const [showSignaturePad, setShowSignaturePad] = useState(false);

  // Load School Portal
  const loadPortalData = async () => {
    try {
      const p = await getOrCreateHeadteacherPortal(profile);
      setPortal(p);
      setEditSchoolName(p.schoolName);
      setEditDistrict(p.district);
      setEditHeadName(p.headteacherName);
      setEditDesignation(p.headteacherDesignation || 'Headteacher');
      setEditCode(p.code);

      // Load teacher roster with stats
      setLoadingTeachers(true);
      const stats = await getSchoolTeachersWithStats(p.code);
      setTeacherStats(stats);
    } catch (e) {
      console.warn('Error loading school portal:', e);
    } finally {
      setLoadingTeachers(false);
    }
  };

  // Load submissions
  const loadSubmissions = async () => {
    setLoading(true);
    try {
      const data = await getVettingSubmissions({
        teacherUid: user?.uid,
        schoolLicenseCode: portal?.code || profile?.schoolLicenseCode,
        schoolVettingCode: portal?.code || profile?.schoolLicenseCode,
        schoolName: portal?.schoolName || profile?.schoolName || profile?.school,
        isHeadteacherView: roleMode === 'headteacher'
      });
      setSubmissions(data);
    } catch (err: any) {
      console.error('Error loading submissions:', err);
      toast.error('Failed to load vetting submissions.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPortalData();
  }, [profile?.uid, profile?.schoolLicenseCode]);

  useEffect(() => {
    loadSubmissions();
  }, [roleMode, user?.uid, portal?.code, profile?.schoolLicenseCode]);

  // Recalculate stats
  const totalCount = submissions.length;
  const pendingCount = submissions.filter(s => s.status === 'pending').length;
  const approvedCount = submissions.filter(s => s.status === 'approved').length;
  const revisionCount = submissions.filter(s => s.status === 'needs_revision').length;

  // Filtered submissions
  const filteredSubmissions = submissions.filter(s => {
    if (statusFilter !== 'all' && s.status !== statusFilter) return false;
    if (subjectFilter !== 'all' && s.subject.toLowerCase() !== subjectFilter.toLowerCase()) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = s.title.toLowerCase().includes(q);
      const matchTeacher = s.teacherName.toLowerCase().includes(q);
      const matchSubject = s.subject.toLowerCase().includes(q);
      const matchClass = s.classLevel.toLowerCase().includes(q);
      const matchCode = s.planSnapshot?.indicatorCode?.toLowerCase().includes(q);
      if (!matchTitle && !matchTeacher && !matchSubject && !matchClass && !matchCode) return false;
    }
    return true;
  });

  const handleDecisionUpdated = (updated: VettingSubmission) => {
    setSubmissions(prev => prev.map(s => s.id === updated.id ? updated : s));
    setSelectedSubmission(updated);
    // Refresh teacher stats
    if (portal?.code) {
      getSchoolTeachersWithStats(portal.code).then(setTeacherStats);
    }
  };

  const handleUpdateStampConfig = (newConfig: HeadteacherStampConfig) => {
    setStampConfig(newConfig);
    saveHeadteacherStampConfig(newConfig);
  };

  const handleCopySchoolCode = () => {
    if (!portal?.code) return;
    navigator.clipboard.writeText(portal.code);
    setCopiedCode(true);
    toast.success(`School Vetting Code "${portal.code}" copied to clipboard!`);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  const handleShareWhatsApp = () => {
    if (!portal?.code) return;
    const message = `Hello Teachers of ${portal.schoolName},\n\nKindly submit your weekly NaCCA lesson notes for official Headteacher vetting on TeachSmartGH using our School Vetting Code: *${portal.code}*.\n\nOnce submitted with this code, your plans route directly to my Headteacher queue for NaCCA rubric inspection and official GES digital stamp endorsement.\n\nThank you.\n${portal.headteacherName} (${portal.headteacherDesignation || 'Headteacher'})`;
    const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const handleSavePortalEdit = async () => {
    if (!portal) return;
    try {
      const updated: SchoolVettingPortal = {
        ...portal,
        schoolName: editSchoolName.trim() || portal.schoolName,
        district: editDistrict.trim() || portal.district,
        headteacherName: editHeadName.trim() || portal.headteacherName,
        headteacherDesignation: editDesignation.trim() || portal.headteacherDesignation,
        code: editCode.trim().toUpperCase() || portal.code,
        id: editCode.trim().toUpperCase() || portal.code
      };
      await updateSchoolPortal(updated);
      setPortal(updated);
      setShowPortalEditModal(false);
      toast.success('School Vetting Portal details updated!');
      loadSubmissions();
    } catch (e: any) {
      toast.error('Failed to update portal: ' + e.message);
    }
  };

  const handleAddTeacherToRoster = async () => {
    if (!portal) return;
    if (!newTeacherName.trim()) {
      toast.error('Please enter the teacher\'s full name.');
      return;
    }

    try {
      const newMember: SchoolTeacherMember = {
        uid: `manual_teacher_${Date.now()}`,
        name: newTeacherName.trim(),
        email: newTeacherEmail.trim() || undefined,
        phone: newTeacherPhone.trim() || undefined,
        classLevel: newTeacherClass,
        subject: newTeacherSubject,
        joinedAt: new Date().toISOString(),
        status: 'active'
      };

      const updatedTeachers = [...portal.teachers, newMember];
      const updatedPortal = { ...portal, teachers: updatedTeachers };
      await updateSchoolPortal(updatedPortal);
      setPortal(updatedPortal);

      // Refresh teacher stats
      const stats = await getSchoolTeachersWithStats(portal.code);
      setTeacherStats(stats);

      setShowAddTeacherModal(false);
      setNewTeacherName('');
      setNewTeacherEmail('');
      setNewTeacherPhone('');
      toast.success(`Teacher "${newMember.name}" successfully added to school roster!`);
    } catch (e: any) {
      toast.error('Failed to add teacher: ' + e.message);
    }
  };

  const handleQuickDownloadPDF = async (s: VettingSubmission, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await exportLessonPlanPDF(s.planSnapshot, {
        teacherName: s.teacherName,
        schoolName: s.schoolName,
        district: s.district,
        classLevel: s.classLevel,
        subject: s.subject,
        term: s.term,
        academicYear: s.academicYear,
        headteacherRemarks: s.headteacherRemarks,
        vettedBy: s.vettedByName || stampConfig.headteacherName,
        vettedDesignation: s.vettedByDesignation || stampConfig.designation,
        vettedAt: s.vettedAt,
        vettingStatus: s.status === 'approved' ? 'approved' : undefined
      });
      toast.success('Vetted Lesson Plan PDF downloaded!');
    } catch (err: any) {
      toast.error('Failed to export PDF: ' + err.message);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white p-6 sm:p-8 shadow-xl border border-emerald-800/30">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-1 bg-ghana-gold/20 text-ghana-gold border border-ghana-gold/30 rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck size={13} />
                NaCCA & GES Compliance Suite
              </span>
              <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-xl text-[10px] font-black uppercase tracking-wider">
                Ghana Education Service Verified
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white">
              Headteacher Digital Vetting & Approval Dashboard
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              Supervise instructional planning across your school. Direct teacher lesson notes to your centralized queue, verify 5-point NaCCA standards, and affix official digital endorsement stamps.
            </p>
          </div>

          {/* Action Hub & Role Switcher */}
          <div className="flex flex-col sm:flex-row lg:flex-col items-stretch sm:items-center gap-3 shrink-0">
            {/* View Mode Toggle */}
            <div className="bg-white/10 p-1 rounded-2xl flex items-center border border-white/10 text-xs font-bold">
              <button
                onClick={() => setRoleMode('headteacher')}
                className={`flex-1 sm:flex-initial px-3.5 py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                  roleMode === 'headteacher' 
                    ? 'bg-emerald-600 text-white shadow-md' 
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <School size={14} />
                <span>Headteacher Queue</span>
              </button>
              <button
                onClick={() => setRoleMode('teacher')}
                className={`flex-1 sm:flex-initial px-3.5 py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                  roleMode === 'teacher' 
                    ? 'bg-emerald-600 text-white shadow-md' 
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <User size={14} />
                <span>My Submissions</span>
              </button>
            </div>

            {/* Stamp Configuration Button */}
            <button
              onClick={() => setShowStampSettingsModal(true)}
              className="px-4 py-2.5 bg-ghana-gold text-slate-950 hover:bg-yellow-400 rounded-2xl font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg shadow-yellow-500/10 cursor-pointer"
            >
              <Award size={16} />
              <span>Configure Digital Stamp</span>
            </button>
          </div>
        </div>

        {/* Decorative Watermark */}
        <div className="absolute right-4 -bottom-10 opacity-5 pointer-events-none">
          <ShieldCheck size={280} />
        </div>
      </div>

      {/* School Vetting Code & Direct Routing Hub Card */}
      {roleMode === 'headteacher' && portal && (
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center shrink-0 border border-emerald-200">
                <Building2 size={24} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base sm:text-lg font-black text-slate-900">{portal.schoolName}</h2>
                  <button 
                    onClick={() => setShowPortalEditModal(true)}
                    className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
                    title="Edit School Portal Details"
                  >
                    <Edit3 size={14} />
                  </button>
                </div>
                <p className="text-xs text-slate-500 font-medium">
                  {portal.district} • {portal.headteacherName} ({portal.headteacherDesignation || 'Headteacher'})
                </p>
              </div>
            </div>

            {/* School Code Badge & Action Bar */}
            <div className="flex items-center gap-2.5 flex-wrap">
              <div className="bg-slate-900 text-white px-3.5 py-2 rounded-2xl flex items-center gap-2 shadow-inner">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">School Code:</span>
                <span className="font-mono text-sm sm:text-base font-black text-ghana-gold tracking-widest">{portal.code}</span>
                <button
                  onClick={handleCopySchoolCode}
                  className="p-1 hover:bg-slate-800 text-slate-300 hover:text-white rounded-lg transition-colors cursor-pointer"
                  title="Copy School Vetting Code"
                >
                  {copiedCode ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                </button>
              </div>

              <button
                onClick={handleShareWhatsApp}
                className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-2xl flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
                title="Send Code to Staff via WhatsApp"
              >
                <MessageCircle size={15} />
                <span>Share Code on WhatsApp</span>
              </button>
            </div>
          </div>

          {/* Quick Explainer for Teachers Directing */}
          <div className="bg-emerald-50/60 border border-emerald-200 p-3.5 rounded-2xl flex items-start gap-3 text-emerald-950 text-xs">
            <Sparkles size={16} className="text-emerald-700 shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <strong>How your teachers direct lesson notes to your queue:</strong> Share code <span className="font-mono font-bold text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded">{portal.code}</span> with your teachers. When they click "Submit for Vetting", they enter this code once. All subsequent weekly lesson notes automatically appear in your Vetting Queue below for official 5-point NaCCA inspection.
            </div>
          </div>
        </div>
      )}

      {/* Metrics & Statistical Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Plans */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
            <Layers size={22} />
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-black text-slate-900">{totalCount}</div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Plans in Queue</div>
          </div>
        </div>

        {/* Pending Review */}
        <div 
          onClick={() => { setActiveTab('queue'); setStatusFilter(statusFilter === 'pending' ? 'all' : 'pending'); }}
          className={`bg-white p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer shadow-sm flex items-center gap-3.5 ${
            statusFilter === 'pending' ? 'border-amber-400 ring-2 ring-amber-400/20 bg-amber-50/20' : 'border-slate-200 hover:border-amber-300'
          }`}
        >
          <div className="w-11 h-11 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Clock size={22} />
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-black text-amber-600">{pendingCount}</div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pending Vetting</div>
          </div>
        </div>

        {/* Approved & Endorsed */}
        <div 
          onClick={() => { setActiveTab('queue'); setStatusFilter(statusFilter === 'approved' ? 'all' : 'approved'); }}
          className={`bg-white p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer shadow-sm flex items-center gap-3.5 ${
            statusFilter === 'approved' ? 'border-emerald-500 ring-2 ring-emerald-500/20 bg-emerald-50/20' : 'border-slate-200 hover:border-emerald-300'
          }`}
        >
          <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
            <CheckCircle2 size={22} />
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-black text-emerald-700">{approvedCount}</div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Vetted & Endorsed</div>
          </div>
        </div>

        {/* Revisions Requested */}
        <div 
          onClick={() => { setActiveTab('queue'); setStatusFilter(statusFilter === 'needs_revision' ? 'all' : 'needs_revision'); }}
          className={`bg-white p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer shadow-sm flex items-center gap-3.5 ${
            statusFilter === 'needs_revision' ? 'border-orange-400 ring-2 ring-orange-400/20 bg-orange-50/20' : 'border-slate-200 hover:border-orange-300'
          }`}
        >
          <div className="w-11 h-11 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">
            <AlertTriangle size={22} />
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-black text-orange-600">{revisionCount}</div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Needs Revision</div>
          </div>
        </div>
      </div>

      {/* Primary Dashboard Navigation Tabs */}
      {roleMode === 'headteacher' && (
        <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto pb-1">
          <button
            onClick={() => setActiveTab('queue')}
            className={`px-4 py-2.5 rounded-2xl font-black text-xs uppercase tracking-wider transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'queue'
                ? 'bg-slate-900 text-white shadow-md'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Layers size={15} />
            <span>Vetting Review Queue</span>
            {pendingCount > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black text-[10px]">
                {pendingCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('teachers')}
            className={`px-4 py-2.5 rounded-2xl font-black text-xs uppercase tracking-wider transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'teachers'
                ? 'bg-slate-900 text-white shadow-md'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Users size={15} />
            <span>My Teachers & Staff Roster</span>
            <span className="px-1.5 py-0.5 rounded-full bg-slate-200 text-slate-700 font-bold text-[10px]">
              {teacherStats.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('stamp')}
            className={`px-4 py-2.5 rounded-2xl font-black text-xs uppercase tracking-wider transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'stamp'
                ? 'bg-slate-900 text-white shadow-md'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Award size={15} />
            <span>Digital Stamp Studio</span>
          </button>

          <button
            onClick={() => setActiveTab('inspection_log')}
            className={`px-4 py-2.5 rounded-2xl font-black text-xs uppercase tracking-wider transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'inspection_log'
                ? 'bg-slate-900 text-white shadow-md'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <FileSpreadsheet size={15} />
            <span>SISO & Inspection Ledger</span>
          </button>
        </div>
      )}

      {/* TAB 1: VETTING QUEUE */}
      {(roleMode === 'teacher' || activeTab === 'queue') && (
        <div className="space-y-4">
          {/* Filter and Search Toolbar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3">
            {/* Search */}
            <div className="relative w-full md:w-80">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by teacher, subject, code..."
                className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 font-medium text-slate-800"
              />
            </div>

            {/* Status Filter Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
              {(['all', 'pending', 'approved', 'needs_revision'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setStatusFilter(tab)}
                  className={`px-3 py-1.5 text-xs font-bold rounded-xl whitespace-nowrap uppercase tracking-wider transition-all cursor-pointer ${
                    statusFilter === tab
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {tab === 'all' ? 'All Plans' : tab === 'pending' ? 'Pending' : tab === 'approved' ? 'Approved' : 'Revision'}
                </button>
              ))}
            </div>

            {/* Refresh button & Generator link */}
            <div className="flex items-center gap-2 w-full md:w-auto justify-end">
              <button
                onClick={loadSubmissions}
                className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                title="Refresh submissions queue"
              >
                <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
              </button>
              <Link
                to="/lessons"
                className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-sm"
              >
                <Plus size={14} />
                <span>Create Plan</span>
              </Link>
            </div>
          </div>

          {/* Submissions List / Grid */}
          {loading ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-3">
              <RefreshCw size={32} className="animate-spin text-emerald-700 mx-auto" />
              <h3 className="font-black text-slate-800 text-base">Loading Vetting Queue...</h3>
              <p className="text-xs text-slate-500">Checking NaCCA accreditation records and submissions...</p>
            </div>
          ) : filteredSubmissions.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-4">
              <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <BookOpen size={28} />
              </div>
              <div className="space-y-1">
                <h3 className="font-black text-slate-900 text-lg">No Lesson Plans Match Filter</h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  {statusFilter !== 'all' 
                    ? `No submissions currently marked as "${statusFilter}".` 
                    : 'No submissions found matching your search term.'}
                </p>
              </div>
              <button
                onClick={() => { setStatusFilter('all'); setSearchQuery(''); }}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl cursor-pointer"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {filteredSubmissions.map(submission => {
                const isApproved = submission.status === 'approved';
                const isRevision = submission.status === 'needs_revision';
                const isPending = submission.status === 'pending';
                const plan = submission.planSnapshot || {};

                return (
                  <div
                    key={submission.id}
                    onClick={() => setSelectedSubmission(submission)}
                    className={`bg-white rounded-2xl p-5 border transition-all cursor-pointer flex flex-col justify-between space-y-4 shadow-sm hover:shadow-md hover:scale-[1.008] group ${
                      isApproved 
                        ? 'border-emerald-200 hover:border-emerald-400' 
                        : isRevision 
                        ? 'border-amber-200 hover:border-amber-400' 
                        : 'border-slate-200 hover:border-blue-300'
                    }`}
                  >
                    <div className="space-y-3">
                      {/* Top Bar: Subject & Status */}
                      <div className="flex items-center justify-between gap-2">
                        <span className="px-2.5 py-1 bg-slate-100 text-slate-800 font-extrabold text-[11px] rounded-lg uppercase tracking-wider truncate">
                          {submission.subject}
                        </span>
                        <span className={`px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider rounded-lg flex items-center gap-1 ${
                          isApproved 
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                            : isRevision 
                            ? 'bg-amber-50 text-amber-700 border border-amber-200' 
                            : 'bg-blue-50 text-blue-700 border border-blue-200'
                        }`}>
                          {isApproved && <Check size={11} />}
                          {isRevision && <AlertTriangle size={11} />}
                          {isPending && <Clock size={11} />}
                          {isApproved ? 'Approved' : isRevision ? 'Revision' : 'Pending'}
                        </span>
                      </div>

                      {/* Title & Metadata */}
                      <div className="space-y-1">
                        <h3 className="font-black text-slate-900 text-sm sm:text-base group-hover:text-emerald-800 transition-colors line-clamp-2">
                          {submission.title}
                        </h3>
                        <p className="text-xs text-slate-500 font-medium">
                          {submission.classLevel} • Week {submission.weekNumber || '1'} ({submission.term || 'Term 1'})
                        </p>
                      </div>

                      {/* NaCCA Indicator Code & Strand */}
                      <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 space-y-1 text-xs">
                        <div className="flex items-center justify-between text-[10px]">
                          <span className="text-slate-400 font-bold uppercase">Strand:</span>
                          <span className="font-semibold text-slate-700 truncate max-w-[150px]">
                            {plan.strand || 'General'}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-[10px]">
                          <span className="text-slate-400 font-bold uppercase">Indicator:</span>
                          <span className="font-mono font-bold text-emerald-800 bg-emerald-100/60 px-1.5 py-0.2 rounded">
                            {plan.indicatorCode || 'NaCCA Standard'}
                          </span>
                        </div>
                      </div>

                      {/* Teacher Information */}
                      <div className="flex items-center gap-2 pt-1 text-xs text-slate-600">
                        <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-[10px]">
                          {submission.teacherName.charAt(0)}
                        </div>
                        <div className="truncate">
                          <strong className="text-slate-800">{submission.teacherName}</strong>
                          <div className="text-[10px] text-slate-400 truncate">{submission.schoolName}</div>
                        </div>
                      </div>

                      {/* Headteacher Remarks Snapshot if available */}
                      {submission.headteacherRemarks && (
                        <div className="text-[11px] italic bg-emerald-50/60 p-2.5 rounded-xl border border-emerald-100 text-emerald-950 line-clamp-2">
                          "{submission.headteacherRemarks}"
                        </div>
                      )}
                    </div>

                    {/* Footer Controls */}
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                      <div className="text-[10px] text-slate-400 font-medium">
                        {new Date(submission.submittedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={(e) => handleQuickDownloadPDF(submission, e)}
                          className="p-1.5 hover:bg-slate-100 text-slate-600 hover:text-slate-900 rounded-lg transition-colors cursor-pointer"
                          title="Quick Download PDF"
                        >
                          <Download size={14} />
                        </button>
                        <span className="text-xs font-black text-emerald-800 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                          <span>Inspect</span>
                          <ChevronRight size={14} />
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: TEACHER ROSTER & SUBMISSION STATS */}
      {roleMode === 'headteacher' && activeTab === 'teachers' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div>
              <h3 className="font-black text-slate-900 text-lg">School Teaching Staff Roster</h3>
              <p className="text-xs text-slate-500">
                Teachers registered with school code <span className="font-mono font-bold text-slate-800">{portal?.code}</span> and their lesson plan submission tracking.
              </p>
            </div>
            <button
              onClick={() => setShowAddTeacherModal(true)}
              className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-2xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
            >
              <UserPlus size={15} />
              <span>Add Teacher</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-black uppercase tracking-wider text-slate-600">
                  <th className="py-3 px-4">Teacher Name</th>
                  <th className="py-3 px-4">Class & Subject</th>
                  <th className="py-3 px-4">Contact</th>
                  <th className="py-3 px-4 text-center">Total Plans</th>
                  <th className="py-3 px-4 text-center">Pending</th>
                  <th className="py-3 px-4 text-center">Approved</th>
                  <th className="py-3 px-4 text-center">Revision</th>
                  <th className="py-3 px-4 text-right">Compliance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {teacherStats.map(teacher => {
                  const complianceRate = teacher.totalPlans > 0 
                    ? Math.round((teacher.approvedPlans / teacher.totalPlans) * 100) 
                    : 0;

                  return (
                    <tr key={teacher.uid} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-slate-900">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs shrink-0">
                            {teacher.name.charAt(0)}
                          </div>
                          <div>
                            <div className="font-black text-slate-900">{teacher.name}</div>
                            <div className="text-[10px] text-slate-400 font-normal">Active Member</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-700">
                        <div>{teacher.classLevel || 'Primary'}</div>
                        <div className="text-[10px] text-slate-500 font-medium">{teacher.subject || 'General'}</div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600">
                        {teacher.phone && <div className="font-mono text-[11px]">{teacher.phone}</div>}
                        {teacher.email && <div className="text-[10px] text-slate-400">{teacher.email}</div>}
                      </td>
                      <td className="py-3.5 px-4 text-center font-bold text-slate-900">{teacher.totalPlans}</td>
                      <td className="py-3.5 px-4 text-center">
                        <span className={`px-2 py-0.5 rounded-lg font-black text-[10px] ${teacher.pendingPlans > 0 ? 'bg-amber-100 text-amber-800' : 'text-slate-400'}`}>
                          {teacher.pendingPlans}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span className={`px-2 py-0.5 rounded-lg font-black text-[10px] ${teacher.approvedPlans > 0 ? 'bg-emerald-100 text-emerald-800' : 'text-slate-400'}`}>
                          {teacher.approvedPlans}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span className={`px-2 py-0.5 rounded-lg font-black text-[10px] ${teacher.needsRevisionPlans > 0 ? 'bg-orange-100 text-orange-800' : 'text-slate-400'}`}>
                          {teacher.needsRevisionPlans}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <span className={`px-2.5 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider ${
                          teacher.totalPlans === 0
                            ? 'bg-slate-100 text-slate-500'
                            : complianceRate >= 80 
                            ? 'bg-emerald-100 text-emerald-800' 
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {teacher.totalPlans === 0 ? 'Awaiting Plan' : `${complianceRate}% Vetted`}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: DIGITAL STAMP STUDIO */}
      {roleMode === 'headteacher' && activeTab === 'stamp' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <h3 className="font-black text-slate-900 text-lg">Official GES Digital Endorsement Stamp</h3>
              <p className="text-xs text-slate-500">
                Customize your official school seal, supervisory designation, and digital signature affixed to vetted lesson plans.
              </p>
            </div>
            <button
              onClick={() => {
                saveHeadteacherStampConfig(stampConfig);
                toast.success('Official Digital Stamp settings saved!');
              }}
              className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-2xl font-black text-xs uppercase tracking-wider transition-all shadow-md cursor-pointer"
            >
              Save Stamp Preferences
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* Stamp Configuration Form */}
            <div className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Headteacher / Supervisor Full Name</label>
                <input
                  type="text"
                  value={stampConfig.headteacherName}
                  onChange={(e) => setStampConfig(prev => ({ ...prev, headteacherName: e.target.value }))}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Official Supervisory Designation</label>
                <input
                  type="text"
                  value={stampConfig.designation}
                  onChange={(e) => setStampConfig(prev => ({ ...prev, designation: e.target.value }))}
                  placeholder="Headteacher, Assistant Head (Academics), Circuit Supervisor"
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">School / Institution Name</label>
                <input
                  type="text"
                  value={stampConfig.schoolName}
                  onChange={(e) => setStampConfig(prev => ({ ...prev, schoolName: e.target.value }))}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">District / Circuit Directorate</label>
                <input
                  type="text"
                  value={stampConfig.district}
                  onChange={(e) => setStampConfig(prev => ({ ...prev, district: e.target.value }))}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800"
                />
              </div>

              {/* Signature section */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-800 block">Digital E-Signature</span>
                  <span className="text-[11px] text-slate-500">Drawn on canvas or typed cursive sign-off</span>
                </div>
                <button
                  onClick={() => setShowSignaturePad(true)}
                  className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <PenTool size={13} />
                  <span>{stampConfig.signatureDataUrl ? 'Redraw Signature' : 'Draw E-Signature'}</span>
                </button>
              </div>
            </div>

            {/* Live Interactive Stamp Preview */}
            <div className="bg-slate-50 rounded-3xl p-6 border border-slate-200 flex flex-col items-center justify-center space-y-4 text-center">
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
                Authenticated Lesson Plan Seal
              </span>
              <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm w-full max-w-sm flex justify-center">
                <DigitalStamp config={stampConfig} size="md" />
              </div>
              <p className="text-[11px] text-slate-500 max-w-xs leading-relaxed">
                This official seal is automatically embedded onto exported PDFs and public verification ledgers when you approve a teacher's lesson plan.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: SISO & INSPECTION LEDGER */}
      {roleMode === 'headteacher' && activeTab === 'inspection_log' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <h3 className="font-black text-slate-900 text-lg">Ghana Education Service Supervisory Inspection Ledger</h3>
              <p className="text-xs text-slate-500">
                Official verification log of vetted instructional notes for Circuit Supervisor (SISO) and District Director inspection.
              </p>
            </div>
            <button
              onClick={() => window.print()}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
            >
              <Printer size={15} />
              <span>Print Inspection Ledger</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-black uppercase tracking-wider text-slate-600">
                  <th className="py-3 px-4">Serial / QR Code</th>
                  <th className="py-3 px-4">Teacher Name</th>
                  <th className="py-3 px-4">Subject & Level</th>
                  <th className="py-3 px-4">Week & Term</th>
                  <th className="py-3 px-4">Vetted Date</th>
                  <th className="py-3 px-4 text-center">NaCCA Rubric</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {submissions.filter(s => s.status === 'approved').map(s => (
                  <tr key={s.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-emerald-800">
                      {s.verificationCode || s.digitalStamp?.serialCode || 'GES-VET-2026'}
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-900">{s.teacherName}</td>
                    <td className="py-3 px-4 text-slate-700">{s.subject} ({s.classLevel})</td>
                    <td className="py-3 px-4 text-slate-600">Week {s.weekNumber || '1'} • {s.term || 'Term 1'}</td>
                    <td className="py-3 px-4 text-slate-500">
                      {s.vettedAt ? new Date(s.vettedAt).toLocaleDateString('en-GB') : '-'}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-lg font-black text-[10px]">
                        {s.rubricScore || 5} / 5 NaCCA
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg font-black text-[10px] uppercase">
                        Vetted & Endorsed
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Detailed Vetting & Inspection Modal */}
      {selectedSubmission && (
        <VettingInspectorModal
          submission={selectedSubmission}
          headteacherConfig={stampConfig}
          onClose={() => setSelectedSubmission(null)}
          onDecisionUpdated={handleDecisionUpdated}
          onUpdateStampConfig={handleUpdateStampConfig}
          currentUserUid={user?.uid}
          isHeadteacherView={roleMode === 'headteacher' && isHeadteacher}
        />
      )}

      {/* Portal Edit Modal */}
      {showPortalEditModal && portal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto animate-fadeIn">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-lg p-6 space-y-5 my-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Building2 size={20} className="text-emerald-700" />
                <h3 className="font-black text-slate-900 text-lg">Edit School Vetting Portal</h3>
              </div>
              <button
                onClick={() => setShowPortalEditModal(false)}
                className="p-2 text-slate-400 hover:text-slate-800 rounded-xl"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">School Name</label>
                <input
                  type="text"
                  value={editSchoolName}
                  onChange={(e) => setEditSchoolName(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">District / Circuit Directorate</label>
                <input
                  type="text"
                  value={editDistrict}
                  onChange={(e) => setEditDistrict(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Headteacher Name</label>
                <input
                  type="text"
                  value={editHeadName}
                  onChange={(e) => setEditHeadName(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Designation</label>
                <input
                  type="text"
                  value={editDesignation}
                  onChange={(e) => setEditDesignation(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">School Vetting Code (Shared with Teachers)</label>
                <input
                  type="text"
                  value={editCode}
                  onChange={(e) => setEditCode(e.target.value.toUpperCase())}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-emerald-800"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => setShowPortalEditModal(false)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-800 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleSavePortalEdit}
                className="px-5 py-2 text-xs font-black uppercase tracking-wider bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl shadow-md"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Teacher to Roster Modal */}
      {showAddTeacherModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto animate-fadeIn">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-lg p-6 space-y-5 my-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <UserPlus size={20} className="text-emerald-700" />
                <h3 className="font-black text-slate-900 text-lg">Add Teacher to Staff Roster</h3>
              </div>
              <button
                onClick={() => setShowAddTeacherModal(false)}
                className="p-2 text-slate-400 hover:text-slate-800 rounded-xl"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Teacher Full Name *</label>
                <input
                  type="text"
                  value={newTeacherName}
                  onChange={(e) => setNewTeacherName(e.target.value)}
                  placeholder="e.g. Yaw Ofori Mensah"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Class / Grade Level</label>
                <input
                  type="text"
                  value={newTeacherClass}
                  onChange={(e) => setNewTeacherClass(e.target.value)}
                  placeholder="e.g. Basic 4, JHS 1"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Subject</label>
                <input
                  type="text"
                  value={newTeacherSubject}
                  onChange={(e) => setNewTeacherSubject(e.target.value)}
                  placeholder="e.g. Science, Mathematics, English"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Phone Number (Optional)</label>
                <input
                  type="text"
                  value={newTeacherPhone}
                  onChange={(e) => setNewTeacherPhone(e.target.value)}
                  placeholder="e.g. 024 123 4567"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Email Address (Optional)</label>
                <input
                  type="email"
                  value={newTeacherEmail}
                  onChange={(e) => setNewTeacherEmail(e.target.value)}
                  placeholder="e.g. teacher@ges.gov.gh"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => setShowAddTeacherModal(false)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-800 rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleAddTeacherToRoster}
                className="px-5 py-2 text-xs font-black uppercase tracking-wider bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl shadow-md cursor-pointer"
              >
                Add to School Roster
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Headteacher Stamp Configuration Modal */}
      {showStampSettingsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto animate-fadeIn">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-lg p-6 space-y-5 my-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Award size={20} className="text-emerald-700" />
                <h3 className="font-black text-slate-900 text-lg">Official Vetting Stamp Setup</h3>
              </div>
              <button
                onClick={() => setShowStampSettingsModal(false)}
                className="p-2 text-slate-400 hover:text-slate-800 rounded-xl cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Supervisor / Headteacher Name</label>
                <input
                  type="text"
                  value={stampConfig.headteacherName}
                  onChange={(e) => setStampConfig(prev => ({ ...prev, headteacherName: e.target.value }))}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Official Designation</label>
                <input
                  type="text"
                  value={stampConfig.designation}
                  onChange={(e) => setStampConfig(prev => ({ ...prev, designation: e.target.value }))}
                  placeholder="Headteacher, Assistant Head (Academic), Circuit Supervisor"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">School Name</label>
                <input
                  type="text"
                  value={stampConfig.schoolName}
                  onChange={(e) => setStampConfig(prev => ({ ...prev, schoolName: e.target.value }))}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">District / Circuit</label>
                <input
                  type="text"
                  value={stampConfig.district}
                  onChange={(e) => setStampConfig(prev => ({ ...prev, district: e.target.value }))}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold"
                />
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <span className="font-bold text-slate-700">Digital Signature:</span>
                <button
                  onClick={() => setShowSignaturePad(true)}
                  className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <PenTool size={13} />
                  <span>{stampConfig.signatureDataUrl ? 'Redraw Signature' : 'Draw E-Signature'}</span>
                </button>
              </div>

              {/* Live Preview of Stamp */}
              <div className="pt-3 border-t border-slate-100 flex flex-col items-center">
                <span className="text-[10px] font-black uppercase text-slate-400 mb-2">Live Stamp Output</span>
                <DigitalStamp config={stampConfig} size="sm" />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => setShowStampSettingsModal(false)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-800 rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  saveHeadteacherStampConfig(stampConfig);
                  setShowStampSettingsModal(false);
                  toast.success('Official Digital Stamp settings saved!');
                }}
                className="px-5 py-2 text-xs font-black uppercase tracking-wider bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl shadow-md cursor-pointer"
              >
                Save Stamp
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Signature Pad in Stamp Settings */}
      {showSignaturePad && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <SignaturePad
            onSave={(dataUrl) => {
              setStampConfig(prev => ({ ...prev, signatureDataUrl: dataUrl, signatureType: 'drawn' }));
              setShowSignaturePad(false);
              toast.success('Signature recorded for digital stamp!');
            }}
            onCancel={() => setShowSignaturePad(false)}
          />
        </div>
      )}
    </div>
  );
}
