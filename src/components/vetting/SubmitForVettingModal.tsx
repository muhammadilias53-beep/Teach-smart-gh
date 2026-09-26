import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, ShieldCheck, CheckCircle2, AlertTriangle, Clock, Send, 
  Award, Download, FileText, School, User, Check, ExternalLink,
  Search, Building2, UserCheck
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { LessonPlan, UserProfile } from '../../types';
import { VettingSubmission, HeadteacherStampConfig, SchoolVettingPortal } from '../../types/vetting';
import { 
  submitPlanForVetting, 
  getHeadteacherStampConfig, 
  recordVettingDecision,
  isHeadteacherUser,
  getSchoolPortalByCode,
  joinSchoolPortal
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
  const [schoolName, setSchoolName] = useState(
    plan.locality || profile?.schoolName || profile?.school || 'Presbyterian Basic School, Adabraka'
  );
  const [district, setDistrict] = useState(profile?.district || 'Accra Metro District');
  const [targetCode, setTargetCode] = useState(() => {
    return localStorage.getItem('teachsmart_linked_school_code') || profile?.schoolLicenseCode || 'PBS-782';
  });
  const [verifiedPortal, setVerifiedPortal] = useState<SchoolVettingPortal | null>(null);
  const [verifyingCode, setVerifyingCode] = useState(false);

  const isHeadteacher = isHeadteacherUser(profile);

  // Vetting Status from plan
  const isApproved = plan.vettingStatus === 'approved';
  const isPending = plan.vettingStatus === 'pending';
  const isRevision = plan.vettingStatus === 'needs_revision';

  // Check portal on mount or targetCode change
  useEffect(() => {
    let isCurrent = true;
    if (!targetCode.trim()) {
      setVerifiedPortal(null);
      return;
    }

    const checkCode = async () => {
      setVerifyingCode(true);
      try {
        const portal = await getSchoolPortalByCode(targetCode.trim());
        if (isCurrent) {
          if (portal) {
            setVerifiedPortal(portal);
            setSchoolName(portal.schoolName);
            setDistrict(portal.district);
          } else {
            setVerifiedPortal(null);
          }
        }
      } catch (e) {
        console.warn('Error checking school code:', e);
      } finally {
        if (isCurrent) setVerifyingCode(false);
      }
    };

    const timer = setTimeout(checkCode, 350);
    return () => {
      isCurrent = false;
      clearTimeout(timer);
    };
  }, [targetCode]);

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      // 1. Link teacher to this school portal if code is valid
      if (targetCode.trim()) {
        try {
          await joinSchoolPortal(profile, targetCode.trim(), {
            classLevel: plan.class || plan.level,
            subject: plan.subject
          });
        } catch (e) {
          console.warn('Could not auto-join school portal, proceeding with submission:', e);
        }
      }

      // 2. Submit the plan with school vetting code
      const submission = await submitPlanForVetting(plan, profile, {
        schoolName: verifiedPortal?.schoolName || schoolName,
        district: verifiedPortal?.district || district,
        schoolLicenseCode: targetCode.trim(),
        schoolVettingCode: targetCode.trim()
      });

      const headName = verifiedPortal?.headteacherName ? ` (${verifiedPortal.headteacherName})` : '';
      toast.success(`🎉 Lesson plan directed to Headteacher${headName} for official vetting!`);
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
        schoolName: verifiedPortal?.schoolName || schoolName,
        district: verifiedPortal?.district || district,
        schoolLicenseCode: targetCode.trim(),
        schoolVettingCode: targetCode.trim()
      });

      // 2. Self-Approve with official stamp
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

        {/* Official GES Supervision & Compliance Requirement Notice */}
        {!isApproved && (
          <div className="bg-amber-50/80 border border-amber-300 p-3.5 rounded-2xl flex items-start gap-3 text-amber-950 text-xs">
            <div className="w-8 h-8 rounded-xl bg-amber-100 border border-amber-300 text-amber-800 flex items-center justify-center shrink-0 mt-0.5">
              <ShieldCheck size={18} />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 font-black text-amber-900 uppercase tracking-wide">
                <span>GES & NaCCA Supervision Requirement</span>
              </div>
              <p className="text-amber-800 leading-relaxed">
                Under official Ghana Education Service (GES) regulations, <strong>an unvetted lesson plan is legally invalid for classroom instruction</strong>. Teachers cannot self-approve lesson notes. Only the verified Headteacher or Academic Supervisor can inspect, rubric-score, and stamp this plan.
              </p>
              <p className="text-[11px] text-amber-700 font-medium">
                {isHeadteacher 
                  ? '👑 You are signed in with Headteacher / Admin privileges and can endorse this plan directly.' 
                  : 'Submitting directs this plan to your school Headteacher\'s queue for official verification.'}
              </p>
            </div>
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

        {/* Submission Form Fields & Directing */}
        <div className="space-y-3 text-xs">
          {/* School Vetting Code / Direct Routing */}
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <label className="font-black text-slate-800 flex items-center gap-1.5 uppercase text-[11px] tracking-wider">
                <Building2 size={14} className="text-emerald-700" />
                <span>Headteacher's School Code</span>
              </label>
              <span className="text-[10px] text-slate-500 font-bold">
                Directs to your Headteacher
              </span>
            </div>

            <div className="relative">
              <input
                type="text"
                value={targetCode}
                onChange={(e) => setTargetCode(e.target.value.toUpperCase())}
                placeholder="e.g. PBS-782"
                className="w-full py-2.5 px-3 bg-white border border-slate-300 rounded-xl font-mono font-bold text-slate-900 uppercase tracking-widest text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
              {verifyingCode && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-[10px] animate-pulse">
                  Verifying...
                </div>
              )}
            </div>

            {/* Verified Portal Feedback */}
            {verifiedPortal ? (
              <div className="bg-emerald-50/80 border border-emerald-300 p-2.5 rounded-xl flex items-start gap-2.5 text-emerald-950">
                <UserCheck size={16} className="text-emerald-700 shrink-0 mt-0.5" />
                <div className="text-[11px] leading-tight space-y-0.5">
                  <div className="font-black text-emerald-900">
                    Directing to: {verifiedPortal.headteacherName}
                  </div>
                  <div className="text-emerald-800 text-[10px]">
                    {verifiedPortal.schoolName} • {verifiedPortal.district}
                  </div>
                </div>
              </div>
            ) : targetCode.trim() ? (
              <div className="text-[10px] text-slate-500 flex items-center gap-1">
                <span>Directing submission with code</span>
                <span className="font-mono font-bold text-slate-700">{targetCode}</span>
              </div>
            ) : (
              <div className="text-[10px] text-amber-700">
                Ask your Headteacher for your school's unique 6-character vetting code (e.g. PBS-782).
              </div>
            )}
          </div>

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
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting}
            className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 shadow-md shadow-emerald-700/20 disabled:opacity-50 cursor-pointer"
          >
            <Send size={15} />
            <span>{submitting ? 'Submitting...' : isRevision ? 'Re-Submit to Headteacher for Vetting' : 'Submit to Headteacher Vetting Queue'}</span>
          </button>

          {/* Headteacher Direct Endorsement Mode (RESTRICTED TO HEADTEACHERS / SCHOOL ADMINS ONLY) */}
          {isHeadteacher ? (
            <div className="pt-1 border-t border-slate-100 space-y-1.5">
              <div className="text-[10px] font-black uppercase text-emerald-800 tracking-wider flex items-center gap-1">
                <span>Headteacher Authority</span>
              </div>
              <button
                type="button"
                onClick={handleInstantSelfVet}
                disabled={submitting}
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-ghana-gold font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-50 cursor-pointer"
              >
                <Award size={15} />
                <span>Headteacher Official Digital Stamp & Endorse</span>
              </button>
            </div>
          ) : (
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-center">
              <span className="text-[11px] text-slate-500 font-medium">
                🔒 Vetting endorsement is locked to Headteacher & Academic Supervisor accounts.
              </span>
            </div>
          )}

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
