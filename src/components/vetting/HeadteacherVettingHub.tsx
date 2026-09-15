import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldCheck, CheckCircle2, Clock, AlertTriangle, Search, Filter, 
  Plus, Download, FileText, Check, Award, School, User, BookOpen, 
  ChevronRight, RefreshCw, PenTool, Sparkles, Layers, SlidersHorizontal
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-hot-toast';
import { VettingSubmission, VettingStatus, HeadteacherStampConfig } from '../../types/vetting';
import { 
  getVettingSubmissions, 
  getHeadteacherStampConfig, 
  saveHeadteacherStampConfig 
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
  const [roleMode, setRoleMode] = useState<'headteacher' | 'teacher'>('headteacher');

  // Headteacher stamp configuration state
  const [stampConfig, setStampConfig] = useState<HeadteacherStampConfig>(() => 
    getHeadteacherStampConfig(profile)
  );
  const [showStampSettingsModal, setShowStampSettingsModal] = useState(false);
  const [showSignaturePad, setShowSignaturePad] = useState(false);

  // Load submissions
  const loadSubmissions = async () => {
    setLoading(true);
    try {
      const data = await getVettingSubmissions({
        teacherUid: user?.uid,
        schoolLicenseCode: profile?.schoolLicenseCode,
        schoolName: profile?.schoolName || profile?.school,
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
    loadSubmissions();
  }, [roleMode, user?.uid, profile?.schoolLicenseCode]);

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
  };

  const handleUpdateStampConfig = (newConfig: HeadteacherStampConfig) => {
    setStampConfig(newConfig);
    saveHeadteacherStampConfig(newConfig);
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
              Headteacher Digital Vetting & Approval Hub
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              Paperless, authenticated lesson plan supervision for Ghanaian Headteachers, Curriculum Leads, and Circuit Supervisors. Review weekly instructional plans, verify 5-point NaCCA standards, and affix official digital endorsement stamps.
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
              className="px-4 py-2.5 bg-ghana-gold text-slate-950 hover:bg-yellow-400 rounded-2xl font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg shadow-yellow-500/10"
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
          onClick={() => setStatusFilter(statusFilter === 'pending' ? 'all' : 'pending')}
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
          onClick={() => setStatusFilter(statusFilter === 'approved' ? 'all' : 'approved')}
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
          onClick={() => setStatusFilter(statusFilter === 'needs_revision' ? 'all' : 'needs_revision')}
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
              className={`px-3 py-1.5 text-xs font-bold rounded-xl whitespace-nowrap uppercase tracking-wider transition-all ${
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
            className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
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
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl"
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
                      className="p-1.5 hover:bg-slate-100 text-slate-600 hover:text-slate-900 rounded-lg transition-colors"
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

      {/* Detailed Vetting & Inspection Modal */}
      {selectedSubmission && (
        <VettingInspectorModal
          submission={selectedSubmission}
          headteacherConfig={stampConfig}
          onClose={() => setSelectedSubmission(null)}
          onDecisionUpdated={handleDecisionUpdated}
          onUpdateStampConfig={handleUpdateStampConfig}
          currentUserUid={user?.uid}
          isHeadteacherView={roleMode === 'headteacher'}
        />
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
                className="p-2 text-slate-400 hover:text-slate-800 rounded-xl"
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
                  className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold flex items-center gap-1.5"
                >
                  <PenTool size={13} />
                  {stampConfig.signatureDataUrl ? 'Redraw Signature' : 'Draw E-Signature'}
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
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-800 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  saveHeadteacherStampConfig(stampConfig);
                  setShowStampSettingsModal(false);
                  toast.success('Official Digital Stamp settings saved!');
                }}
                className="px-5 py-2 text-xs font-black uppercase tracking-wider bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl shadow-md"
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

function X(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
    </svg>
  );
}
