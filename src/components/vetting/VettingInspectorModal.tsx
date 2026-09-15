import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, CheckCircle, AlertTriangle, XCircle, Award, FileText, 
  Download, Send, PenTool, Check, Info, ShieldCheck, ChevronDown, 
  ChevronUp, Sparkles, MessageSquare, BookOpen, Layers
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { VettingSubmission, VettingRubricChecks, HeadteacherStampConfig } from '../../types/vetting';
import { 
  GES_DEFAULT_REMARKS_PRESETS, 
  GES_RUBRIC_CRITERIA, 
  recordVettingDecision, 
  saveHeadteacherStampConfig 
} from '../../lib/vettingService';
import { DigitalStamp, SignaturePad } from './DigitalStamp';
import { exportLessonPlanPDF } from '../../lib/lessonPlanPdfExport';
import { exportLessonPlanToWord } from '../../lib/wordExport';

interface VettingInspectorModalProps {
  submission: VettingSubmission;
  headteacherConfig: HeadteacherStampConfig;
  onClose: () => void;
  onDecisionUpdated: (updated: VettingSubmission) => void;
  onUpdateStampConfig: (config: HeadteacherStampConfig) => void;
  currentUserUid?: string;
  isHeadteacherView?: boolean;
}

export const VettingInspectorModal: React.FC<VettingInspectorModalProps> = ({
  submission,
  headteacherConfig,
  onClose,
  onDecisionUpdated,
  onUpdateStampConfig,
  currentUserUid,
  isHeadteacherView = true
}) => {
  const [activeTab, setActiveTab] = useState<'plan' | 'vetting' | 'stamp'>('vetting');
  const [rubricChecks, setRubricChecks] = useState<VettingRubricChecks>(
    submission.rubricChecks || {
      curriculumAligned: true,
      learnerCentered: true,
      coreCompetencies: true,
      localTlrs: true,
      assessmentAndInclusion: true
    }
  );
  const [remarks, setRemarks] = useState(
    submission.headteacherRemarks || 
    'Lesson plan strictly aligns with official NaCCA curriculum standards. Progressive learner-centered activities in Phase 2 with appropriate local TLRs. Endorsed for instructional delivery.'
  );
  const [revisionNotes, setRevisionNotes] = useState(submission.revisionNotes || '');
  const [isSubmittingDecision, setIsSubmittingDecision] = useState(false);
  const [showSignaturePad, setShowSignaturePad] = useState(false);
  const [exportingDoc, setExportingDoc] = useState(false);

  // Calculate rubric score
  const calculateScore = (checks: VettingRubricChecks) => {
    return Object.values(checks).filter(Boolean).length;
  };
  const currentScore = calculateScore(rubricChecks);

  const toggleCheck = (key: keyof VettingRubricChecks) => {
    setRubricChecks(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleApplyPreset = (presetText: string) => {
    setRemarks(presetText);
    toast.success('Official remark preset inserted');
  };

  const handleSaveDecision = async (decision: 'approved' | 'needs_revision' | 'rejected') => {
    if (decision === 'needs_revision' && !revisionNotes.trim() && !remarks.trim()) {
      toast.error('Please provide specific revision notes so the teacher knows what to adjust.');
      return;
    }

    setIsSubmittingDecision(true);
    try {
      const updated = await recordVettingDecision(submission.id, decision, {
        headteacherRemarks: remarks,
        rubricChecks,
        rubricScore: currentScore,
        headteacherConfig,
        revisionNotes: decision === 'needs_revision' ? (revisionNotes || remarks) : '',
        vettedByUid: currentUserUid
      });

      toast.success(
        decision === 'approved' 
          ? '🎉 Lesson Plan Vetted & Endorsed with Official Digital Stamp!' 
          : decision === 'needs_revision' 
          ? 'Feedback & Revision notice sent to teacher.' 
          : 'Lesson plan rejected with notes.'
      );
      onDecisionUpdated(updated);
    } catch (err: any) {
      console.error('Error recording vetting decision:', err);
      toast.error(err.message || 'Failed to record vetting decision.');
    } finally {
      setIsSubmittingDecision(false);
    }
  };

  const handleSignatureSaved = (dataUrl: string) => {
    const updated = { ...headteacherConfig, signatureDataUrl: dataUrl, signatureType: 'drawn' as const };
    onUpdateStampConfig(updated);
    saveHeadteacherStampConfig(updated);
    setShowSignaturePad(false);
    toast.success('Digital signature updated on official stamp!');
  };

  const handleDownloadVettedPDF = async () => {
    setExportingDoc(true);
    try {
      const plan = submission.planSnapshot;
      await exportLessonPlanPDF(plan, {
        teacherName: submission.teacherName,
        schoolName: submission.schoolName,
        district: submission.district,
        classLevel: submission.classLevel,
        subject: submission.subject,
        term: submission.term,
        academicYear: submission.academicYear,
        headteacherRemarks: remarks,
        vettedBy: headteacherConfig.headteacherName,
        vettedDesignation: headteacherConfig.designation,
        vettedAt: submission.vettedAt || new Date().toISOString(),
        vettingStatus: submission.status === 'approved' ? 'approved' : undefined
      });
      toast.success('Vetted Lesson Plan PDF generated! 🇬🇭');
    } catch (e: any) {
      console.error(e);
      toast.error('Failed to export PDF: ' + e.message);
    } finally {
      setExportingDoc(false);
    }
  };

  const handleDownloadVettedWord = async () => {
    setExportingDoc(true);
    try {
      const plan = submission.planSnapshot;
      await exportLessonPlanToWord(plan, {
        teacherName: submission.teacherName,
        schoolName: submission.schoolName,
        district: submission.district,
        classLevel: submission.classLevel,
        subject: submission.subject,
        term: submission.term,
        academicYear: submission.academicYear
      });
      toast.success('Vetted Lesson Plan Word document generated! 🇬🇭');
    } catch (e: any) {
      console.error(e);
      toast.error('Failed to export Word: ' + e.message);
    } finally {
      setExportingDoc(false);
    }
  };

  const plan = submission.planSnapshot || {};

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-sm overflow-y-auto animate-fadeIn">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden my-auto">
        {/* Top Institutional Header */}
        <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white p-4 sm:p-6 border-b border-emerald-800/40 shrink-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2.5 py-0.5 bg-ghana-gold/20 text-ghana-gold border border-ghana-gold/40 text-[10px] font-black uppercase tracking-wider rounded-lg">
                  GES Digital Vetting System
                </span>
                <span className={`px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider rounded-lg ${
                  submission.status === 'approved' 
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' 
                    : submission.status === 'needs_revision'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                }`}>
                  {submission.status === 'approved' ? '✓ Endorsed & Approved' : submission.status === 'needs_revision' ? '⚠️ Revision Requested' : '⏳ Pending Vetting'}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
                {submission.title}
              </h2>
              <p className="text-xs sm:text-sm text-slate-300">
                Teacher: <strong className="text-white">{submission.teacherName}</strong> • {submission.schoolName} ({submission.classLevel} • {submission.subject})
              </p>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-center">
              <button
                onClick={handleDownloadVettedPDF}
                disabled={exportingDoc}
                className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all"
                title="Download Vetted PDF"
              >
                <Download size={14} />
                PDF
              </button>
              <button
                onClick={handleDownloadVettedWord}
                disabled={exportingDoc}
                className="px-3 py-1.5 bg-blue-600/80 hover:bg-blue-600 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all"
                title="Download Vetted Word Document"
              >
                <FileText size={14} />
                Word
              </button>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-xl text-slate-400 hover:text-white transition-colors ml-1"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-800 text-xs font-bold">
            <button
              onClick={() => setActiveTab('vetting')}
              className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 ${
                activeTab === 'vetting' 
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-700/20' 
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <ShieldCheck size={15} />
              <span>Headteacher Vetting & Rubric</span>
            </button>
            <button
              onClick={() => setActiveTab('plan')}
              className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 ${
                activeTab === 'plan' 
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-700/20' 
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <BookOpen size={15} />
              <span>Inspect Lesson Plan</span>
            </button>
            <button
              onClick={() => setActiveTab('stamp')}
              className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 ${
                activeTab === 'stamp' 
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-700/20' 
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Award size={15} />
              <span>Official Stamp & Signature</span>
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 bg-slate-50/50">
          {/* TAB 1: HEADTEACHER VETTING & RUBRIC */}
          {activeTab === 'vetting' && (
            <div className="space-y-6">
              {/* Quick Status Notice */}
              {submission.status === 'approved' && (
                <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl flex items-start gap-3 text-emerald-900">
                  <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                    <Check size={18} />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-black text-sm">Officially Vetted & Endorsed by {submission.vettedByName || headteacherConfig.headteacherName}</h4>
                    <p className="text-xs text-emerald-800">
                      Vetted on {submission.vettedAt ? new Date(submission.vettedAt).toLocaleDateString('en-GB') : 'Today'} with standard NaCCA curriculum accreditation seal.
                    </p>
                    <div className="mt-2 text-xs italic bg-white/80 p-2.5 rounded-xl border border-emerald-200">
                      "{submission.headteacherRemarks}"
                    </div>
                  </div>
                </div>
              )}

              {submission.status === 'needs_revision' && (
                <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl flex items-start gap-3 text-amber-900">
                  <AlertTriangle size={22} className="text-amber-600 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <h4 className="font-black text-sm">Revision Notice Active</h4>
                    <p className="text-xs text-amber-800">
                      Teacher has been notified to modify aspects of this lesson plan before final classroom delivery.
                    </p>
                    {submission.revisionNotes && (
                      <div className="mt-2 text-xs bg-white/80 p-2.5 rounded-xl border border-amber-200 font-medium">
                        <strong>Requested Changes:</strong> {submission.revisionNotes}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* NaCCA Quality Checklist Rubric */}
              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="font-black text-slate-900 text-base flex items-center gap-2">
                      <ShieldCheck size={18} className="text-emerald-700" />
                      NaCCA & GES 5-Point Vetting Rubric
                    </h3>
                    <p className="text-xs text-slate-500">
                      Tick each standard verified during inspection. All 5 criteria must be satisfied for full accreditation.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Score:</span>
                    <span className={`px-3 py-1 rounded-xl text-xs font-black uppercase tracking-wider ${
                      currentScore === 5 ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' :
                      currentScore >= 3 ? 'bg-amber-100 text-amber-800 border border-amber-300' :
                      'bg-rose-100 text-rose-800 border border-rose-300'
                    }`}>
                      {currentScore} / 5 ({currentScore === 5 ? 'Exemplary' : currentScore >= 3 ? 'Satisfactory' : 'Needs Review'})
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {GES_RUBRIC_CRITERIA.map(criterion => {
                    const isChecked = rubricChecks[criterion.key];
                    return (
                      <div
                        key={criterion.key}
                        onClick={() => toggleCheck(criterion.key)}
                        className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 select-none ${
                          isChecked 
                            ? 'bg-emerald-50/70 border-emerald-300 hover:border-emerald-400' 
                            : 'bg-slate-50 border-slate-200 hover:border-slate-300 opacity-70'
                        }`}
                      >
                        <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                          isChecked ? 'bg-emerald-700 text-white' : 'border-2 border-slate-300 text-transparent'
                        }`}>
                          <Check size={14} />
                        </div>
                        <div className="space-y-0.5">
                          <h4 className={`text-xs font-black ${isChecked ? 'text-emerald-950' : 'text-slate-700'}`}>
                            {criterion.label}
                          </h4>
                          <p className="text-[11px] text-slate-500 leading-relaxed">
                            {criterion.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Headteacher Remarks & GES Presets */}
              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-black text-slate-900 text-base flex items-center gap-2">
                    <MessageSquare size={18} className="text-emerald-700" />
                    Official Headteacher Remarks & Supervisory Guidance
                  </h3>
                  <span className="text-[11px] text-slate-500 italic">
                    Prints on official vetting box
                  </span>
                </div>

                {/* Quick Presets */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black uppercase tracking-wider text-slate-500">
                    Quick GES Presets:
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {GES_DEFAULT_REMARKS_PRESETS.map((p, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleApplyPreset(p.text)}
                        className={`px-2.5 py-1 text-[11px] font-bold rounded-lg border transition-all text-left ${
                          p.type === 'approved' 
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100' 
                            : 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'
                        }`}
                      >
                        {p.type === 'approved' ? '✓ ' : '↺ '}
                        {p.title}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom Remarks Area */}
                <textarea
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  rows={3}
                  placeholder="Enter official supervisor remarks and recommendations..."
                  className="w-full p-3 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 font-medium text-slate-800"
                />

                {/* If requesting revision, show revision notes input */}
                <div className="pt-2 border-t border-slate-100">
                  <label className="text-xs font-black uppercase tracking-wider text-amber-800 block mb-1">
                    Specific Revision Instructions for Teacher (Optional if already in remarks):
                  </label>
                  <input
                    type="text"
                    value={revisionNotes}
                    onChange={(e) => setRevisionNotes(e.target.value)}
                    placeholder="e.g. Include group work in Phase 2, update Indicator code..."
                    className="w-full p-2.5 text-xs bg-amber-50/50 border border-amber-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 text-slate-800"
                  />
                </div>
              </div>

              {/* Digital Stamp Live Preview */}
              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="space-y-1 text-center sm:text-left">
                  <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md">
                    Endorsement Signature Preview
                  </span>
                  <h4 className="text-sm font-black text-slate-900 mt-1">Official Digital Stamp to be Affixed</h4>
                  <p className="text-xs text-slate-500">
                    Signing as <strong>{headteacherConfig.headteacherName}</strong> ({headteacherConfig.designation})
                  </p>
                  <button
                    onClick={() => setActiveTab('stamp')}
                    className="text-xs font-bold text-emerald-700 hover:text-emerald-900 underline pt-1 block"
                  >
                    Change Stamp or Redraw Signature →
                  </button>
                </div>
                <div className="shrink-0">
                  <DigitalStamp config={headteacherConfig} isApproved={currentScore >= 4} size="sm" />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: INSPECT LESSON PLAN */}
          {activeTab === 'plan' && (
            <div className="space-y-6">
              {/* Plan Metadata Box */}
              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                <div>
                  <span className="text-slate-400 font-bold uppercase block text-[10px]">Subject</span>
                  <span className="font-black text-slate-900 text-sm">{plan.subject || submission.subject}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-bold uppercase block text-[10px]">Class / Level</span>
                  <span className="font-black text-slate-900 text-sm">{plan.class || submission.classLevel}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-bold uppercase block text-[10px]">Week & Term</span>
                  <span className="font-black text-slate-900 text-sm">Week {plan.week || submission.weekNumber || '1'} • {plan.term || submission.term}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-bold uppercase block text-[10px]">Indicator Code</span>
                  <span className="font-mono font-black text-emerald-800 text-xs bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 inline-block mt-0.5">
                    {plan.indicatorCode || 'NaCCA Standard'}
                  </span>
                </div>
              </div>

              {/* Curriculum Standards */}
              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3 text-xs sm:text-sm">
                <div className="border-b border-slate-100 pb-2">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Strand</span>
                  <p className="font-bold text-slate-900">{plan.strand || 'General Curriculum'}</p>
                </div>
                <div className="border-b border-slate-100 pb-2">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Sub-Strand</span>
                  <p className="font-bold text-slate-900">{plan.subStrand || 'N/A'}</p>
                </div>
                <div className="border-b border-slate-100 pb-2">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Content Standard</span>
                  <p className="font-semibold text-slate-800">{plan.contentStandard || 'N/A'}</p>
                </div>
                <div className="border-b border-slate-100 pb-2">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Indicator(s)</span>
                  <p className="font-semibold text-slate-800">{plan.indicator || 'N/A'}</p>
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Core Competencies & Values</span>
                  <p className="font-semibold text-emerald-900 bg-emerald-50/60 p-2 rounded-xl border border-emerald-100">
                    {plan.coreCompetencies || 'Critical Thinking and Problem Solving, Collaboration, Communication'}
                  </p>
                </div>
              </div>

              {/* Three Phases (Phased Instructional Delivery) */}
              <div className="space-y-4">
                <h3 className="font-black text-slate-900 text-sm uppercase tracking-wider">
                  Instructional Delivery Phases (NaCCA Model)
                </h3>

                {/* Phase 1 */}
                <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-800 font-black text-xs flex items-center justify-center">
                      1
                    </span>
                    <h4 className="font-black text-slate-900 text-xs sm:text-sm">
                      Phase 1: Starter / Warm-Up (Introduction)
                    </h4>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed pl-8 whitespace-pre-line">
                    {plan.phase1 || 'Learner engagement activities to activate prior knowledge.'}
                  </p>
                </div>

                {/* Phase 2 */}
                <div className="bg-white rounded-2xl p-4 sm:p-5 border border-emerald-200 bg-emerald-50/20 shadow-sm space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-emerald-600 text-white font-black text-xs flex items-center justify-center">
                      2
                    </span>
                    <h4 className="font-black text-emerald-950 text-xs sm:text-sm">
                      Phase 2: New Learning / Core Competency Activities (Heart of Lesson)
                    </h4>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-800 leading-relaxed pl-8 whitespace-pre-line font-medium">
                    {plan.phase2 || 'Learner-centered group tasks and inquiry.'}
                  </p>
                </div>

                {/* Phase 3 */}
                <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-800 font-black text-xs flex items-center justify-center">
                      3
                    </span>
                    <h4 className="font-black text-slate-900 text-xs sm:text-sm">
                      Phase 3: Reflection / Assessment / Plenary (Wrap-up)
                    </h4>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed pl-8 whitespace-pre-line">
                    {plan.phase3 || 'Evaluation, exit ticket, and reflection.'}
                  </p>
                </div>
              </div>

              {/* TLRs & Differentiation */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-1">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Teaching & Learning Resources (TLRs)</span>
                  <p className="text-xs sm:text-sm text-slate-800 font-medium">
                    {plan.tlrs || 'Local manipulatives, charts, chalkboard, pupil text.'}
                  </p>
                </div>
                <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-1">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Key Words / Vocabulary</span>
                  <p className="text-xs sm:text-sm text-slate-800 font-medium">
                    {plan.keyWords || 'Key vocabulary introduced in lesson.'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: OFFICIAL STAMP & SIGNATURE CONFIGURATION */}
          {activeTab === 'stamp' && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="font-black text-slate-900 text-base flex items-center gap-2">
                    <Award size={18} className="text-emerald-700" />
                    Configure Your Institutional Headteacher Stamp & Credentials
                  </h3>
                  <p className="text-xs text-slate-500">
                    These credentials will appear on all digitally vetted lesson plans, PDF exports, and Word booklets.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Headteacher / Supervisor Name</label>
                    <input
                      type="text"
                      value={headteacherConfig.headteacherName}
                      onChange={(e) => {
                        const updated = { ...headteacherConfig, headteacherName: e.target.value };
                        onUpdateStampConfig(updated);
                        saveHeadteacherStampConfig(updated);
                      }}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 font-semibold"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Official Designation</label>
                    <input
                      type="text"
                      value={headteacherConfig.designation}
                      onChange={(e) => {
                        const updated = { ...headteacherConfig, designation: e.target.value };
                        onUpdateStampConfig(updated);
                        saveHeadteacherStampConfig(updated);
                      }}
                      placeholder="e.g. Headteacher, Assistant Head, Curriculum Lead"
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 font-semibold"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">School / Institution Name</label>
                    <input
                      type="text"
                      value={headteacherConfig.schoolName}
                      onChange={(e) => {
                        const updated = { ...headteacherConfig, schoolName: e.target.value };
                        onUpdateStampConfig(updated);
                        saveHeadteacherStampConfig(updated);
                      }}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 font-semibold"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">District / Circuit</label>
                    <input
                      type="text"
                      value={headteacherConfig.district}
                      onChange={(e) => {
                        const updated = { ...headteacherConfig, district: e.target.value };
                        onUpdateStampConfig(updated);
                        saveHeadteacherStampConfig(updated);
                      }}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 font-semibold"
                    />
                  </div>
                </div>

                {/* Stamp Style Toggle */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700">Stamp Format:</span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        const updated = { ...headteacherConfig, stampStyle: 'rectangle' as const };
                        onUpdateStampConfig(updated);
                        saveHeadteacherStampConfig(updated);
                      }}
                      className={`px-3 py-1.5 text-xs font-bold rounded-xl border transition-all ${
                        headteacherConfig.stampStyle === 'rectangle' ? 'bg-emerald-700 text-white border-emerald-700' : 'bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                    >
                      Official Rectangular Stamp
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const updated = { ...headteacherConfig, stampStyle: 'circle' as const };
                        onUpdateStampConfig(updated);
                        saveHeadteacherStampConfig(updated);
                      }}
                      className={`px-3 py-1.5 text-xs font-bold rounded-xl border transition-all ${
                        headteacherConfig.stampStyle === 'circle' ? 'bg-emerald-700 text-white border-emerald-700' : 'bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                    >
                      Circular GES Seal
                    </button>
                  </div>
                </div>

                {/* Signature Customization */}
                <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="space-y-1">
                    <h4 className="text-xs font-black text-slate-900">Headteacher E-Signature</h4>
                    <p className="text-[11px] text-slate-500">
                      Draw your signature using touch, stylus, or mouse, or use typed font.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowSignaturePad(true)}
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm"
                  >
                    <PenTool size={14} />
                    Draw Digital Signature
                  </button>
                </div>
              </div>

              {/* Stamp Rendering Preview */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col items-center justify-center space-y-3">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Live Stamp Rendering
                </span>
                <DigitalStamp config={headteacherConfig} size="lg" />
              </div>
            </div>
          )}
        </div>

        {/* Modal Decision Action Bar (Headteacher Command) */}
        <div className="bg-white p-4 sm:p-5 border-t border-slate-200 shrink-0 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-500 flex items-center gap-1.5 self-start sm:self-center">
            <Info size={14} className="text-emerald-700 shrink-0" />
            <span>Approved plans receive the official GES verification badge and stamp in exports.</span>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
            <button
              onClick={() => handleSaveDecision('needs_revision')}
              disabled={isSubmittingDecision}
              className="px-4 py-2.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 font-bold uppercase tracking-wider text-xs rounded-xl transition-all flex items-center gap-1.5 shadow-sm"
            >
              <AlertTriangle size={15} />
              <span>Request Revision</span>
            </button>

            <button
              onClick={() => handleSaveDecision('approved')}
              disabled={isSubmittingDecision}
              className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-black uppercase tracking-wider text-xs rounded-xl transition-all flex items-center gap-1.5 shadow-md shadow-emerald-700/20"
            >
              <CheckCircle size={16} />
              <span>{isSubmittingDecision ? 'Endorsing...' : 'Approve & Endorse'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Signature Pad Overlay */}
      {showSignaturePad && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <SignaturePad
            onSave={handleSignatureSaved}
            onCancel={() => setShowSignaturePad(false)}
          />
        </div>
      )}
    </div>
  );
};
