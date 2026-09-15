import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, ShieldCheck, CheckCircle2, AlertTriangle, Clock, Send, 
  Award, Download, FileText, School, User, Check, ExternalLink 
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { LessonPlan, UserProfile } from '../../types';
import { VettingSubmission, HeadteacherStampConfig } from '../../types/vetting';
import { 
  submitPlanForVetting, 
  getHeadteacherStampConfig, 
  recordVettingDecision 
} from '../../lib/vettingService';
import { DigitalStamp } from './DigitalStamp';
import { Link } from 'react-router';

interface SubmitForVettingModalProps {
  plan: LessonPlan;
  profile: UserProfile | null;
  onClose: () => void;
  onVettingSubmitted: (submission: VettingSubmission) => void;
  onPlanUpdated?: (updatedPlan: LessonPlan) => void;
}

export const SubmitForVettingModal: React.FC<SubmitForVettingModalProps> = ({
  plan,
  profile,
  onClose,
  onVettingSubmitted,
  onPlanUpdated
}) => {
  const [submitting, setSubmitting] = useState(false);
  const [schoolName, setSchoolName] = useState(plan.locality || profile?.schoolName || profile?.school || 'Presbyterian Basic School');
  const [district, setDistrict] = useState(profile?.district || 'Accra Metro District');
  const [targetCode, setTargetCode] = useState(profile?.schoolLicenseCode || '');
  const [isSelfVetting, setIsSelfVetting] = useState(false);

  // Vetting Status from plan
  const isApproved = plan.vettingStatus === 'approved';
  const isPending = plan.vettingStatus === 'pending';
  const isRevision = plan.vettingStatus === 'needs_revision';

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const submission = await submitPlanForVetting(plan, profile, {
        schoolName,
        district,
        schoolLicenseCode: targetCode
      });

      toast.success('🎉 Lesson plan successfully submitted to Headteacher Vetting Hub!');
      onVettingSubmitted(submission);

      if (onPlanUpdated) {
        onPlanUpdated({
          ...plan,
          vettingStatus: 'pending',
          vettingSubmissionId: submission.id
        });
      }
      onClose();
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'Failed to submit for vetting.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleInstantSelfVet = async () => {
    setSubmitting(true);
    try {
      // 1. Submit
      const submission = await submitPlanForVetting(plan, profile, {
        schoolName,
        district,
        schoolLicenseCode: targetCode
      });

      // 2. Self-Approve with default stamp
      const stamp = getHeadteacherStampConfig(profile);
      const vetted = await recordVettingDecision(submission.id, 'approved', {
        headteacherRemarks: 'Lesson plan certified and aligned with official NaCCA curriculum standards. Approved for delivery.',
        rubricChecks: {
          curriculumAligned: true,
          learnerCentered: true,
          coreCompetencies: true,
          localTlrs: true,
          assessmentAndInclusion: true
        },
        rubricScore: 5,
        headteacherConfig: stamp,
        vettedByUid: profile?.uid
      });

      toast.success('✓ Lesson plan certified & endorsed with official GES digital stamp!');
      onVettingSubmitted(vetted);

      if (onPlanUpdated) {
        onPlanUpdated({
          ...plan,
          vettingStatus: 'approved',
          headteacherRemarks: vetted.headteacherRemarks,
          vettedBy: stamp.headteacherName,
          vettedDesignation: stamp.designation,
          vettedAt: vetted.vettedAt,
          vettingSubmissionId: vetted.id
        });
      }
      onClose();
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'Failed to certify plan.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto animate-fadeIn">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-lg p-6 space-y-5 my-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <ShieldCheck size={20} />
            </div>
            <div>
              <h3 className="font-black text-slate-900 text-base">Headteacher Digital Vetting</h3>
              <p className="text-[11px] text-slate-500">GES / NaCCA Weekly Instructional Sign-Off</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-800 rounded-xl"
          >
            <X size={18} />
          </button>
        </div>

        {/* Existing Status Notice if Vetted */}
        {isApproved && (
          <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl space-y-2 text-emerald-950">
            <div className="flex items-center gap-2 text-xs font-black text-emerald-800">
              <CheckCircle2 size={16} />
              <span>ALREADY VETTED & APPROVED</span>
            </div>
            <p className="text-xs text-emerald-800">
              Vetted by <strong>{plan.vettedBy || 'Headteacher'}</strong> ({plan.vettedDesignation || 'Supervisor'}).
            </p>
            {plan.headteacherRemarks && (
              <div className="text-xs italic bg-white/80 p-2 rounded-xl border border-emerald-200">
                "{plan.headteacherRemarks}"
              </div>
            )}
          </div>
        )}

        {isPending && (
          <div className="bg-blue-50 border border-blue-200 p-4 rounded-2xl flex items-center gap-3 text-blue-900 text-xs">
            <Clock size={20} className="text-blue-600 shrink-0" />
            <div>
              <strong className="block font-black">Submitted for Vetting</strong>
              <span>This plan is in your school's Headteacher Queue waiting for review and digital stamp.</span>
            </div>
          </div>
        )}

        {isRevision && (
          <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl space-y-1.5 text-amber-900 text-xs">
            <div className="flex items-center gap-2 font-black text-amber-800">
              <AlertTriangle size={16} />
              <span>REVISION REQUESTED BY HEADTEACHER</span>
            </div>
            <p>Please make the required changes in Phase 2 or Indicators and re-submit.</p>
            {plan.headteacherRemarks && (
              <div className="italic bg-white/80 p-2 rounded-xl border border-amber-200 font-medium">
                "{plan.headteacherRemarks}"
              </div>
            )}
          </div>
        )}

        {/* Plan Summary Card */}
        <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs space-y-1.5">
          <div className="font-extrabold text-slate-900 text-sm truncate">
            {plan.title || `${plan.subject} - Week ${plan.week || plan.weekNumber || '1'}`}
          </div>
          <div className="text-slate-600">
            Class: <strong className="text-slate-800">{plan.class || 'Primary'}</strong> • Subject: <strong className="text-slate-800">{plan.subject}</strong>
          </div>
          <div className="text-slate-500 font-mono text-[11px]">
            Indicator Code: {plan.indicatorCode || 'NaCCA Standard'}
          </div>
        </div>

        {/* Submission Form Fields */}
        <div className="space-y-3 text-xs">
          <div>
            <label className="font-bold text-slate-700 block mb-1">School / Institution</label>
            <input
              type="text"
              value={schoolName}
              onChange={(e) => setSchoolName(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">District / Circuit</label>
            <input
              type="text"
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">
              School License Code (Optional)
            </label>
            <input
              type="text"
              value={targetCode}
              onChange={(e) => setTargetCode(e.target.value)}
              placeholder="e.g. SCH-78291"
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-800"
            />
            <span className="text-[10px] text-slate-400 mt-0.5 block">
              Directs submission to your school's dedicated Headteacher vetting dashboard.
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting}
            className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 shadow-md shadow-emerald-700/20 disabled:opacity-50"
          >
            <Send size={15} />
            <span>{submitting ? 'Submitting...' : isRevision ? 'Re-Submit for Vetting' : 'Submit to Headteacher Queue'}</span>
          </button>

          {/* Quick Endorse / Headteacher direct mode */}
          <button
            type="button"
            onClick={handleInstantSelfVet}
            disabled={submitting}
            className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-ghana-gold font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
          >
            <Award size={15} />
            <span>Headteacher Instant Digital Stamp & Endorse</span>
          </button>

          <div className="text-center pt-1">
            <Link
              to="/vetting"
              onClick={onClose}
              className="text-[11px] text-emerald-800 font-bold hover:underline inline-flex items-center gap-1"
            >
              <span>Go to Full Headteacher Vetting Hub</span>
              <ExternalLink size={12} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
