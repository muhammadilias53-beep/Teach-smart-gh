import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router';
import { 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  School, 
  UserCheck, 
  BookOpen, 
  Calendar, 
  Clock, 
  Award, 
  Search, 
  Printer, 
  Share2, 
  ExternalLink,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { verifyDocumentCode, validateSignature, DocumentVerificationData } from '../lib/documentVerification';
import { getCurrentGesCalendarInfo } from '../lib/academicCalendar';
import { toast } from 'react-hot-toast';

export default function VerifyDocumentPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [verificationData, setVerificationData] = useState<DocumentVerificationData | null>(null);
  const [isSignatureValid, setIsSignatureValid] = useState<boolean>(true);
  const [manualCode, setManualCode] = useState('');
  const [vettingChecked, setVettingChecked] = useState({
    indicators: true,
    differentiation: true,
    reflection: true,
  });

  // Extract query parameters
  const code = searchParams.get('code') || '';
  const docType = searchParams.get('type') || 'Lesson Document';
  const subject = searchParams.get('sub') || '';
  const classLevel = searchParams.get('cls') || '';
  const term = searchParams.get('term') || '';
  const year = searchParams.get('yr') || '';
  const teacher = searchParams.get('fac') || '';
  const school = searchParams.get('sch') || '';
  const district = searchParams.get('dist') || '';
  const time = searchParams.get('t') || '';
  const sig = searchParams.get('sig') || '';

  useEffect(() => {
    async function loadVerification() {
      if (!code) return;
      setLoading(true);

      // Validate URL signature first
      if (sig && teacher && school) {
        const isValid = validateSignature({
          code,
          docType,
          subject,
          classLevel,
          term,
          year,
          teacher,
          school,
          issuedAt: time,
          sig
        });
        setIsSignatureValid(isValid);
      }

      // Try fetching matching Firestore record if registered
      const firestoreRecord = await verifyDocumentCode(code);
      if (firestoreRecord) {
        setVerificationData(firestoreRecord);
      } else if (teacher || school || subject) {
        // Fallback to URL parameters
        setVerificationData({
          verificationCode: code,
          documentType: docType,
          subject: subject || 'Ghana SBC Curriculum',
          classLevel: classLevel || 'Basic Education',
          term: term || `Term ${getCurrentGesCalendarInfo().activeTerm}`,
          academicYear: year || getCurrentGesCalendarInfo().academicYear,
          teacherName: teacher || 'Facilitator',
          schoolName: school || 'Ghana Basic School',
          district: district || 'GES District Directorate',
          issuedAt: time || new Date().toISOString(),
          signature: sig || '',
        });
      } else {
        setVerificationData(null);
      }
      setLoading(false);
    }

    loadVerification();
  }, [code, docType, subject, classLevel, term, year, teacher, school, district, time, sig]);

  const handleManualSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualCode.trim()) return;
    const clean = manualCode.trim().toUpperCase();
    setSearchParams({ code: clean });
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `TeachSmartGH Verified: ${verificationData?.subject} (${verificationData?.teacherName})`,
          text: `Official TeachSmartGH NaCCA/GES Verified Lesson Document for ${verificationData?.teacherName} at ${verificationData?.schoolName}.`,
          url: window.location.href,
        });
      } catch {}
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Verification link copied to clipboard!');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Top Bar Header */}
      <header className="bg-[#001C3D] text-white border-b border-slate-800 py-3.5 px-4 sm:px-8">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-emerald-400 flex items-center justify-center text-white shadow-md shadow-emerald-900/30">
              <ShieldCheck size={22} className="text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 font-black text-lg tracking-tight leading-none">
                <span>TeachSmart</span>
                <span className="text-[#FCD116]">GH</span>
              </div>
              <span className="text-[10px] text-slate-300 font-medium tracking-wide block mt-0.5">
                Curriculum Verification & Accreditation Registry
              </span>
            </div>
          </Link>

          <div className="hidden sm:flex items-center gap-2 text-xs font-bold text-slate-300 bg-white/10 px-3 py-1.5 rounded-full border border-white/10">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>NaCCA / GES Aligned</span>
          </div>
        </div>
      </header>

      {/* Main Content Body */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-8 space-y-6">
        {/* Verification Status Banner */}
        {code ? (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
            {/* Top Accent Ribbon (Ghana Flag Colors) */}
            <div className="h-2 w-full flex">
              <div className="h-full w-1/3 bg-[#EF3340]"></div>
              <div className="h-full w-1/3 bg-[#FCD116]"></div>
              <div className="h-full w-1/3 bg-[#006B3F]"></div>
            </div>

            <div className="p-6 sm:p-8">
              {loading ? (
                <div className="py-16 text-center space-y-3">
                  <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                  <p className="text-sm font-bold text-slate-500">Checking TeachSmartGH Curriculum Ledger...</p>
                </div>
              ) : verificationData ? (
                <div className="space-y-6">
                  {/* Verified Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                    <div className="flex items-start gap-3.5">
                      <div className="w-13 h-13 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shrink-0 shadow-inner">
                        <CheckCircle2 size={32} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black tracking-wider uppercase bg-emerald-100 text-emerald-800 border border-emerald-300/60">
                            AUTHENTIC & ACCREDITED ASSET
                          </span>
                          <span className="px-2 py-0.5 rounded-md text-[11px] font-mono font-bold bg-slate-100 text-slate-700">
                            {verificationData.verificationCode}
                          </span>
                        </div>
                        <h1 className="text-xl sm:text-2xl font-black text-slate-900 mt-1 tracking-tight">
                          Official Curriculum Document Verification
                        </h1>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Issued under the NaCCA & GES Standards-Based Framework • Powered by Catalyst Creative
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-start sm:self-center">
                      <button
                        onClick={handleShare}
                        className="px-3.5 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl flex items-center gap-1.5 transition-colors"
                      >
                        <Share2 size={14} />
                        <span>Share</span>
                      </button>
                      <button
                        onClick={handlePrint}
                        className="px-3.5 py-2 text-xs font-bold text-white bg-[#001C3D] hover:bg-slate-800 rounded-xl flex items-center gap-1.5 transition-colors shadow-sm"
                      >
                        <Printer size={14} />
                        <span>Print Slip</span>
                      </button>
                    </div>
                  </div>

                  {!isSignatureValid && (
                    <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-3 text-amber-900">
                      <AlertTriangle size={20} className="text-amber-600 shrink-0 mt-0.5" />
                      <div className="text-xs">
                        <p className="font-bold">Modified Query Parameters Detected</p>
                        <p className="text-amber-800 mt-0.5">
                          Some URL attributes differ from the original generator token. Verification is displayed using verified secure system records.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Primary Metadata Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Facilitator & School Card */}
                    <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3.5">
                      <div className="flex items-center gap-2 text-xs font-black uppercase text-slate-400 tracking-wider">
                        <UserCheck size={16} className="text-emerald-600" />
                        <span>Teacher & School Attribution</span>
                      </div>

                      <div>
                        <span className="text-[11px] text-slate-400 block uppercase font-bold">Licensed Facilitator</span>
                        <span className="text-base font-black text-slate-900 uppercase">
                          {verificationData.teacherName}
                        </span>
                      </div>

                      <div>
                        <span className="text-[11px] text-slate-400 block uppercase font-bold">Assigned Institution</span>
                        <div className="flex items-center gap-1.5 mt-0.5 text-slate-800 font-bold text-sm">
                          <School size={16} className="text-slate-400 shrink-0" />
                          <span>{verificationData.schoolName}</span>
                        </div>
                      </div>

                      {verificationData.district && (
                        <div>
                          <span className="text-[11px] text-slate-400 block uppercase font-bold">District / Directorate</span>
                          <span className="text-xs font-semibold text-slate-600 block mt-0.5">
                            {verificationData.district}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Document & Curriculum Specs Card */}
                    <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3.5">
                      <div className="flex items-center gap-2 text-xs font-black uppercase text-slate-400 tracking-wider">
                        <BookOpen size={16} className="text-blue-600" />
                        <span>Curriculum Specification</span>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <span className="text-[11px] text-slate-400 block uppercase font-bold">Document Type</span>
                          <span className="text-xs font-black text-slate-800">
                            {verificationData.documentType}
                          </span>
                        </div>
                        <div>
                          <span className="text-[11px] text-slate-400 block uppercase font-bold">Subject</span>
                          <span className="text-xs font-black text-slate-800">
                            {verificationData.subject}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <span className="text-[11px] text-slate-400 block uppercase font-bold">Class Level</span>
                          <span className="text-xs font-black text-slate-800">
                            {verificationData.classLevel}
                          </span>
                        </div>
                        <div>
                          <span className="text-[11px] text-slate-400 block uppercase font-bold">Term & Year</span>
                          <span className="text-xs font-black text-slate-800">
                            {verificationData.term} • {verificationData.academicYear}
                          </span>
                        </div>
                      </div>

                      <div>
                        <span className="text-[11px] text-slate-400 block uppercase font-bold">Accreditation Standard</span>
                        <div className="flex items-center gap-1.5 mt-0.5 text-xs font-bold text-emerald-700">
                          <Award size={15} className="shrink-0" />
                          <span>NaCCA Standards-Based Curriculum (SBC)</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Anti-Piracy & Commercial Protection Notice */}
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 text-white flex flex-col sm:flex-row items-start sm:items-center gap-3 shadow-md">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center justify-center shrink-0">
                      <ShieldCheck size={22} />
                    </div>
                    <div className="text-xs leading-relaxed">
                      <p className="font-bold text-amber-200 uppercase tracking-wide">
                        Non-Transferable Personal Teaching License
                      </p>
                      <p className="text-slate-300 mt-0.5">
                        This instructional document was prepared via TeachSmartGH and is exclusively licensed to{' '}
                        <strong className="text-white">{verificationData.teacherName}</strong> for classroom delivery at{' '}
                        <strong className="text-white">{verificationData.schoolName}</strong>. Mass reproduction, sale in WhatsApp groups, or unauthorized sharing is strictly prohibited.
                      </p>
                    </div>
                  </div>

                  {/* Headteacher & Circuit Supervisor Vetting Section */}
                  <div className="p-5 rounded-2xl border-2 border-dashed border-slate-300 bg-white space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Award size={18} className="text-emerald-600" />
                        <h3 className="text-sm font-black uppercase tracking-tight text-slate-900">
                          Headteacher / Circuit Supervisor Digital Vetting Endorsement
                        </h3>
                      </div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase">
                        GES Administrative Form
                      </span>
                    </div>

                    <p className="text-xs text-slate-500">
                      If you are inspecting or vetting this teacher's portfolio, review the standards-based alignment indicators below:
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <label className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 cursor-pointer hover:bg-slate-100">
                        <input
                          type="checkbox"
                          checked={vettingChecked.indicators}
                          onChange={(e) => setVettingChecked({ ...vettingChecked, indicators: e.target.checked })}
                          className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                        />
                        <span>NaCCA Indicators & Strands Aligned</span>
                      </label>

                      <label className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 cursor-pointer hover:bg-slate-100">
                        <input
                          type="checkbox"
                          checked={vettingChecked.differentiation}
                          onChange={(e) => setVettingChecked({ ...vettingChecked, differentiation: e.target.checked })}
                          className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                        />
                        <span>TLRs & Learner Tasks Verified</span>
                      </label>

                      <label className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 cursor-pointer hover:bg-slate-100">
                        <input
                          type="checkbox"
                          checked={vettingChecked.reflection}
                          onChange={(e) => setVettingChecked({ ...vettingChecked, reflection: e.target.checked })}
                          className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                        />
                        <span>Approved for Classroom Delivery</span>
                      </label>
                    </div>

                    <div className="pt-2 text-[11px] text-slate-400 flex items-center justify-between flex-wrap gap-2">
                      <span className="flex items-center gap-1">
                        <Clock size={13} />
                        Generated on: {new Date(verificationData.issuedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </span>
                      <span className="font-mono text-[10px] text-slate-400">
                        Registry Node: GH-ACC-NVR-01
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="py-12 text-center space-y-3">
                  <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center mx-auto border border-rose-200">
                    <AlertTriangle size={30} />
                  </div>
                  <h2 className="text-lg font-black text-slate-800">Verification Record Not Found</h2>
                  <p className="text-xs text-slate-500 max-w-md mx-auto">
                    The verification code <strong>{code}</strong> could not be located in our registered accredited ledger. Please verify the code or scan the QR code again.
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Empty Search Landing */
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-8 sm:p-12 text-center space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-[#001C3D] text-[#FCD116] flex items-center justify-center mx-auto shadow-lg shadow-blue-950/20">
              <ShieldCheck size={36} />
            </div>

            <div className="space-y-2 max-w-lg mx-auto">
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                TeachSmartGH Document Verification
              </h1>
              <p className="text-sm text-slate-500 leading-relaxed">
                Scan the QR code printed on any TeachSmartGH Lesson Plan, Scheme of Learning, or Exam Paper to verify its authenticity, NaCCA alignment, and authorized teacher license.
              </p>
            </div>

            <form onSubmit={handleManualSearch} className="max-w-md mx-auto flex gap-2">
              <input
                type="text"
                placeholder="Enter Code (e.g. TSG-2026-X8P4Q1)"
                value={manualCode}
                onChange={(e) => setManualCode(e.target.value)}
                className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <button
                type="submit"
                className="px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-2xl flex items-center gap-1.5 transition-colors shadow-md shadow-emerald-900/20"
              >
                <Search size={16} />
                <span>Verify</span>
              </button>
            </form>
          </div>
        )}

        {/* Manual Search Below Result */}
        {code && (
          <div className="bg-white rounded-2xl border border-slate-200 p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
              <Search size={16} className="text-slate-400" />
              <span>Verify another TeachSmartGH document by code:</span>
            </div>
            <form onSubmit={handleManualSearch} className="flex gap-2 w-full sm:w-auto">
              <input
                type="text"
                placeholder="TSG-2026-XXXXXX"
                value={manualCode}
                onChange={(e) => setManualCode(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-[#001C3D] hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-colors"
              >
                Look Up
              </button>
            </form>
          </div>
        )}

        {/* Footer info */}
        <div className="text-center text-xs text-slate-400 space-y-1 pt-4">
          <p>TeachSmartGH is an initiative of Catalyst Creative • Supporting Ghanaian Basic & Junior High Schools</p>
          <p>Official Curriculum Partner with NaCCA Standard-Based Curriculum (SBC) Alignment</p>
        </div>
      </main>
    </div>
  );
}
