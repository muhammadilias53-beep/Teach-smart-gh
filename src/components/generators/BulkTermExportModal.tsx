import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Download, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  Layers, 
  Filter, 
  X, 
  Sparkles, 
  Calendar, 
  BookOpen, 
  School, 
  User, 
  HardDrive,
  RefreshCw,
  Clock,
  Check,
  ChevronRight,
  Info,
  Lock,
  Crown,
  ArrowRight
} from 'lucide-react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuth } from '../../contexts/AuthContext';
import { getOffline } from '../../lib/indexedDB';
import { LessonPlan } from '../../types';
import { cn } from '../../lib/utils';
import { 
  mergeAndDeduplicateLessonPlans, 
  normalizeSubject, 
  normalizeClassLevel, 
  normalizeTerm, 
  normalizeAcademicYear, 
  extractWeekNumber, 
  extractLessonNumber,
  generateCurriculumKey
} from '../../lib/bulkExportHelpers';
import { exportBulkTermLessonPlansToWord } from '../../lib/bulkLessonPlanWordExport';
import { exportBulkTermLessonPlansToPDF } from '../../lib/bulkLessonPlanPdfExport';
import { toast } from 'react-hot-toast';

interface BulkTermExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialSubject?: string;
  initialClass?: string;
  initialLevel?: string;
  initialTerm?: string;
  initialAcademicYear?: string;
}

const GHANA_SUBJECTS = [
  'English',
  'Mathematics',
  'Science',
  'Social Studies',
  'Computing',
  'Religious and Moral Education',
  'Creative Arts and Design',
  'Career Technology',
  'Physical and Health Education',
  'Ghanaian Language',
  'French',
  'Our World Our People'
];

const GHANA_CLASSES = [
  'KG 1',
  'KG 2',
  'Basic 1',
  'Basic 2',
  'Basic 3',
  'Basic 4',
  'Basic 5',
  'Basic 6',
  'Basic 7',
  'Basic 8',
  'Basic 9',
  'SHS 1',
  'SHS 2',
  'SHS 3'
];

const ACADEMIC_YEARS = [
  '2025/2026',
  '2024/2025',
  '2026/2027'
];

export function BulkTermExportModal({
  isOpen,
  onClose,
  initialSubject = 'English',
  initialClass = 'Basic 7',
  initialLevel = 'JHS',
  initialTerm = 'Term 1',
  initialAcademicYear = '2025/2026'
}: BulkTermExportModalProps) {
  const { user, profile, canBulkExport } = useAuth();
  const navigate = useNavigate();
  const hasBulkAccess = canBulkExport();

  // Filter states
  const [academicYear, setAcademicYear] = useState(initialAcademicYear || '2025/2026');
  const [term, setTerm] = useState<'Term 1' | 'Term 2' | 'Term 3'>((initialTerm as any) || 'Term 1');
  const [selectedSubject, setSelectedSubject] = useState(initialSubject);
  const [selectedClass, setSelectedClass] = useState(initialClass);

  // Data fetching states
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [allUserLessonPlans, setAllUserLessonPlans] = useState<LessonPlan[]>([]);
  const [selectedLessonIds, setSelectedLessonIds] = useState<string[]>([]);
  const [exportingWord, setExportingWord] = useState(false);
  const [exportingPdf, setExportingPdf] = useState(false);

  // Sync initial props when opened
  useEffect(() => {
    if (isOpen) {
      if (initialSubject) setSelectedSubject(initialSubject);
      if (initialClass) setSelectedClass(initialClass);
      if (initialTerm && (initialTerm === 'Term 1' || initialTerm === 'Term 2' || initialTerm === 'Term 3')) {
        setTerm(initialTerm);
      }
      if (initialAcademicYear) setAcademicYear(initialAcademicYear);
      loadSavedPlans();
    }
  }, [isOpen, user]);

  const loadSavedPlans = async () => {
    if (!user) return;
    setLoading(true);
    try {
      // 1. Fetch from Firestore (authoritative source)
      const firestorePlans: LessonPlan[] = [];
      if (navigator.onLine) {
        try {
          const q = query(
            collection(db, 'lessonPlans'),
            where('authorId', '==', user.uid)
          );
          const snapshot = await getDocs(q);
          snapshot.forEach(docSnap => {
            const data = docSnap.data() as LessonPlan;
            const id = docSnap.id;
            firestorePlans.push({ ...data, id });
          });
        } catch (fbErr) {
          console.warn('Firestore fetch failed in bulk export, using local cache:', fbErr);
        }
      }

      // 2. Fetch from IndexedDB offline storage
      let offlinePlans: LessonPlan[] = [];
      try {
        const idbDocs = await getOffline('lessonPlans', user.uid);
        offlinePlans = idbDocs as unknown as LessonPlan[];
      } catch (idbErr) {
        console.warn('IndexedDB fetch in bulk export failed:', idbErr);
      }

      // 3. Deduplicate with strict source priority and timestamp resolution
      const combined = mergeAndDeduplicateLessonPlans(firestorePlans, offlinePlans);
      setAllUserLessonPlans(combined);
      setHasSearched(true);
    } catch (err) {
      console.error('Failed to load saved plans:', err);
      toast.error('Could not retrieve saved lesson plans.');
    } finally {
      setLoading(false);
    }
  };

  // Helper to retrieve a stable, unique identifier for selection
  const getPlanKey = (p: LessonPlan) => p.id || generateCurriculumKey(p);

  // Filter plans based on the current selection with robust normalizations
  const matchedPlans = useMemo(() => {
    if (!allUserLessonPlans.length) return [];

    const normTargetSubject = normalizeSubject(selectedSubject);
    const normTargetClass = normalizeClassLevel(selectedClass);
    const normTargetTerm = normalizeTerm(term);
    const normTargetYear = normalizeAcademicYear(academicYear);

    return allUserLessonPlans.filter(p => {
      // Subject Match (using canonical normalization)
      const pSubNorm = normalizeSubject(p.subject);
      const subjectMatch = pSubNorm === normTargetSubject || 
        (p.subject && p.subject.toLowerCase().includes(selectedSubject.toLowerCase())) ||
        (selectedSubject && selectedSubject.toLowerCase().includes((p.subject || '').toLowerCase()));

      // Class / Level Match
      const pClassNorm = normalizeClassLevel(p.class || p.level);
      const classMatch = pClassNorm === normTargetClass ||
        (p.class && p.class.toLowerCase().includes(selectedClass.toLowerCase())) ||
        (selectedClass && selectedClass.toLowerCase().includes((p.class || '').toLowerCase()));

      // Term Match (if stored on record or in title, otherwise include)
      let termMatch = true;
      if (p.term) {
        termMatch = normalizeTerm(p.term) === normTargetTerm;
      } else if (p.title && p.title.toLowerCase().includes('term')) {
        termMatch = normalizeTerm(p.title) === normTargetTerm;
      }

      // Academic Year match (if stored)
      let yearMatch = true;
      if (p.academicYear) {
        yearMatch = normalizeAcademicYear(p.academicYear) === normTargetYear;
      }

      return subjectMatch && classMatch && termMatch && yearMatch;
    });
  }, [allUserLessonPlans, selectedSubject, selectedClass, term, academicYear]);

  // Group matched plans into the 12 weeks of the standard Ghanaian school term
  const termWeeksSummary = useMemo(() => {
    const weeksMap = new Map<number, LessonPlan[]>();
    for (let w = 1; w <= 12; w++) {
      weeksMap.set(w, []);
    }

    matchedPlans.forEach(plan => {
      let wNum = extractWeekNumber(plan);
      if (isNaN(wNum) || wNum < 1) wNum = 1;
      if (wNum > 12) wNum = 12; // Cap at 12 for standard term view

      const existing = weeksMap.get(wNum) || [];
      existing.push(plan);
      weeksMap.set(wNum, existing);
    });

    return Array.from(weeksMap.entries()).map(([weekNum, plans]) => {
      // Sort plans for this week by curriculum lesson number ascending
      plans.sort((a, b) => {
        const lA = extractLessonNumber(a);
        const lB = extractLessonNumber(b);
        return lA - lB;
      });

      return {
        weekNum,
        available: plans.length > 0,
        plans,
        primaryPlan: plans[0] || null
      };
    });
  }, [matchedPlans]);

  // Count available weeks and plans
  const availableWeeksCount = termWeeksSummary.filter(w => w.available).length;
  const totalMatchedLessons = matchedPlans.length;

  // Auto-select all available lesson IDs when results change
  useEffect(() => {
    const ids = matchedPlans.map(p => getPlanKey(p)).filter(Boolean);
    setSelectedLessonIds(ids as string[]);
  }, [matchedPlans]);

  const toggleWeekSelection = (plans: LessonPlan[]) => {
    if (plans.length === 0) return;
    const planKeys = plans.map(p => getPlanKey(p));
    const allSelected = planKeys.every(k => selectedLessonIds.includes(k));

    if (allSelected) {
      // Deselect all plans in this week
      setSelectedLessonIds(prev => prev.filter(id => !planKeys.includes(id)));
    } else {
      // Select all plans in this week
      setSelectedLessonIds(prev => Array.from(new Set([...prev, ...planKeys])));
    }
  };

  const handleSelectAll = () => {
    const allIds = matchedPlans.map(p => getPlanKey(p)).filter(Boolean);
    setSelectedLessonIds(allIds as string[]);
  };

  const handleDeselectAll = () => {
    setSelectedLessonIds([]);
  };

  // Export to Word (.docx)
  const handleExportWord = async () => {
    if (!canBulkExport()) {
      toast.error('Bulk Termly Export requires the Termly Master or Professional Yearly special subscription mode. Please upgrade your subscription to export compiled term books.', {
        duration: 6000,
        icon: '👑'
      });
      return;
    }

    const lessonsToExport = matchedPlans.filter(p => 
      selectedLessonIds.includes(getPlanKey(p))
    );

    if (lessonsToExport.length === 0) {
      toast.error('Please select at least one lesson plan to export.');
      return;
    }

    setExportingWord(true);
    try {
      await exportBulkTermLessonPlansToWord({
        academicYear,
        term,
        classLevel: selectedClass,
        subject: selectedSubject,
        teacherName: profile?.displayName || user?.displayName || 'Facilitator',
        schoolName: profile?.school || 'Ghana Basic School',
        district: profile?.district || profile?.region || 'GES District Directorate',
        lessons: lessonsToExport
      });
    } catch (err) {
      console.error(err);
    } finally {
      setExportingWord(false);
    }
  };

  // Export to PDF (.pdf)
  const handleExportPdf = () => {
    if (!canBulkExport()) {
      toast.error('Bulk Termly Export requires the Termly Master or Professional Yearly special subscription mode. Please upgrade your subscription to export compiled term books.', {
        duration: 6000,
        icon: '👑'
      });
      return;
    }

    const lessonsToExport = matchedPlans.filter(p => 
      selectedLessonIds.includes(getPlanKey(p))
    );

    if (lessonsToExport.length === 0) {
      toast.error('Please select at least one lesson plan to export.');
      return;
    }

    setExportingPdf(true);
    try {
      exportBulkTermLessonPlansToPDF({
        academicYear,
        term,
        classLevel: selectedClass,
        subject: selectedSubject,
        teacherName: profile?.displayName || user?.displayName || 'Facilitator',
        schoolName: profile?.school || 'Ghana Basic School',
        district: profile?.district || profile?.region || 'GES District Directorate',
        lessons: lessonsToExport
      });
      toast.success(`Term Lesson Plan Book (.pdf) generated with ${lessonsToExport.length} lessons! 📄`);
    } catch (err) {
      console.error(err);
      toast.error('Failed to export PDF book.');
    } finally {
      setExportingPdf(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="bg-white rounded-3xl shadow-2xl border border-slate-100 w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden my-auto"
      >
        {/* Modal Header */}
        <div className="bg-slate-900 text-white px-6 py-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-ghana-gold to-amber-500 flex items-center justify-center text-slate-950 shadow-md">
              <Layers size={22} className="stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black tracking-tight">Bulk Term Lesson Plan Export</h2>
                <span className="px-2 py-0.5 bg-ghana-gold/20 text-ghana-gold text-[10px] font-black uppercase rounded-md tracking-wider border border-ghana-gold/30">
                  TeachSmartGH Print V1
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">
                Assemble all saved weekly lesson plans into an official 12-week GES NaCCA Term Book
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Special Subscription Mode Status Banner */}
          {!hasBulkAccess ? (
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-500/15 via-amber-500/10 to-transparent border-2 border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-ghana-gold to-amber-600 text-slate-950 flex items-center justify-center shrink-0 shadow-md">
                  <Crown size={20} className="stroke-[2.5]" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-amber-500/20 text-amber-900 text-[10px] font-black uppercase tracking-wider rounded border border-amber-500/30">
                      Special Subscription Mode
                    </span>
                    <span className="text-[11px] font-bold text-slate-600">Included in Termly Master &amp; Professional Yearly</span>
                  </div>
                  <h4 className="text-xs sm:text-sm font-black text-slate-900 mt-1">
                    Bulk 12-Week Term Book Compilation (.docx &amp; .pdf)
                  </h4>
                  <p className="text-[11px] text-slate-600 mt-0.5 max-w-xl">
                    Compile all your weekly lesson plans into a GES/NaCCA-aligned Term Book with cover page, headteacher vetting blocks, and table of contents.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  navigate('/billing');
                }}
                className="shrink-0 w-full sm:w-auto px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-ghana-gold border border-ghana-gold/30 rounded-xl text-xs font-black uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-2 hover:scale-[1.02] cursor-pointer"
              >
                <Sparkles size={14} className="text-ghana-gold fill-ghana-gold" />
                <span>Upgrade to Master Mode</span>
                <ArrowRight size={14} />
              </button>
            </div>
          ) : (
            <div className="px-4 py-2.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs text-emerald-900">
              <div className="flex items-center gap-2">
                <Sparkles size={16} className="text-ghana-gold fill-ghana-gold shrink-0" />
                <span className="font-bold">
                  Special Subscription Mode Active: Bulk Termly 12-Week NaCCA Compilation Unlocked
                </span>
              </div>
              <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-200/60 text-emerald-800 px-2 py-0.5 rounded-md">
                Master Mode Active
              </span>
            </div>
          )}

          {/* Filter Bar */}
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider">
                <Filter size={14} className="text-ghana-green" />
                Select Term & Subject Criteria
              </div>
              <button
                onClick={loadSavedPlans}
                disabled={loading}
                className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1.5"
              >
                <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
                Refresh Saved Plans
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {/* Academic Year */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase">Academic Year</label>
                <select
                  value={academicYear}
                  onChange={(e) => setAcademicYear(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                >
                  {ACADEMIC_YEARS.map(yr => (
                    <option key={yr} value={yr}>{yr}</option>
                  ))}
                </select>
              </div>

              {/* Term */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase">Term</label>
                <select
                  value={term}
                  onChange={(e) => setTerm(e.target.value as any)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                >
                  <option value="Term 1">Term 1</option>
                  <option value="Term 2">Term 2</option>
                  <option value="Term 3">Term 3</option>
                </select>
              </div>

              {/* Class */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase">Class / Level</label>
                <select
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                >
                  {GHANA_CLASSES.map(cls => (
                    <option key={cls} value={cls}>{cls}</option>
                  ))}
                </select>
              </div>

              {/* Subject */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase">Subject</label>
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                >
                  {GHANA_SUBJECTS.map(subj => (
                    <option key={subj} value={subj}>{subj}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Completeness Summary Banner */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-emerald-50/70 border border-emerald-200/80 rounded-2xl gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black text-sm">
                {availableWeeksCount}/12
              </div>
              <div>
                <h4 className="text-xs font-black text-emerald-950 uppercase tracking-wide">
                  Term Completeness: {availableWeeksCount} of 12 Weeks Available
                </h4>
                <p className="text-[11px] text-emerald-800 font-medium">
                  {totalMatchedLessons} saved lesson plan(s) ready for {selectedSubject} ({selectedClass}) • {term}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <button
                onClick={handleSelectAll}
                className="px-2.5 py-1 bg-white border border-emerald-200 text-emerald-900 rounded-lg font-bold hover:bg-emerald-100 transition-colors"
              >
                Select All
              </button>
              <button
                onClick={handleDeselectAll}
                className="px-2.5 py-1 bg-white border border-slate-200 text-slate-600 rounded-lg font-bold hover:bg-slate-100 transition-colors"
              >
                Deselect
              </button>
            </div>
          </div>

          {/* 12-Week Completeness Timeline Grid */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <Calendar size={14} className="text-slate-500" />
                12-Week Term Curriculum Preview
              </h3>
              <span className="text-[11px] text-slate-400 font-bold">
                {selectedLessonIds.length} lesson(s) selected for export
              </span>
            </div>

            {loading ? (
              <div className="py-12 flex flex-col items-center justify-center gap-3 text-slate-400">
                <RefreshCw size={24} className="animate-spin text-emerald-600" />
                <p className="text-xs font-bold">Retrieving saved lesson plans from storage...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                {termWeeksSummary.map(({ weekNum, available, plans, primaryPlan }) => {
                  const weekPlanKeys = plans.map(p => getPlanKey(p));
                  const isSelected = weekPlanKeys.length > 0 && weekPlanKeys.every(k => selectedLessonIds.includes(k));
                  const isPartial = !isSelected && weekPlanKeys.some(k => selectedLessonIds.includes(k));

                  return (
                    <div
                      key={weekNum}
                      onClick={() => available && toggleWeekSelection(plans)}
                      className={`p-3.5 rounded-2xl border transition-all flex items-start justify-between gap-3 ${
                        available
                          ? isSelected
                            ? 'bg-emerald-50/50 border-emerald-300 shadow-sm cursor-pointer'
                            : isPartial
                            ? 'bg-emerald-50/20 border-emerald-200 cursor-pointer'
                            : 'bg-white border-slate-200 hover:border-slate-300 cursor-pointer'
                          : 'bg-slate-50 border-slate-200/60 opacity-60'
                      }`}
                    >
                      <div className="flex items-start gap-3 min-w-0">
                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black shrink-0 ${
                            available
                              ? isSelected
                                ? 'bg-emerald-600 text-white'
                                : isPartial
                                ? 'bg-emerald-500 text-white'
                                : 'bg-emerald-100 text-emerald-800'
                              : 'bg-slate-200 text-slate-400'
                          }`}
                        >
                          {available && isSelected ? <Check size={14} className="stroke-[3]" /> : `W${weekNum}`}
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-black text-slate-900">
                              Week {weekNum}
                            </span>
                            {available ? (
                              <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-800 text-[9px] font-black uppercase rounded">
                                Available ({plans.length} plan{plans.length > 1 ? 's' : ''})
                              </span>
                            ) : (
                              <span className="px-1.5 py-0.5 bg-slate-200 text-slate-600 text-[9px] font-bold uppercase rounded">
                                Missing
                              </span>
                            )}
                          </div>

                          {available && primaryPlan ? (
                            <div className="mt-1 space-y-0.5">
                              <p className="text-[11px] font-bold text-slate-700 truncate">
                                {primaryPlan.strand} • {primaryPlan.subStrand}
                              </p>
                              <p className="text-[10px] text-slate-500 truncate">
                                {primaryPlan.indicatorCode || primaryPlan.indicator}
                              </p>
                              {plans.length > 1 && (
                                <p className="text-[9px] text-emerald-700 font-bold">
                                  Includes Lessons {plans.map(p => extractLessonNumber(p)).join(', ')}
                                </p>
                              )}
                            </div>
                          ) : (
                            <p className="text-[11px] text-slate-400 italic mt-0.5">
                              No saved plan found for this week
                            </p>
                          )}
                        </div>
                      </div>

                      {available && (
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => {}} // Handled by parent div
                          className="h-4 w-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer mt-1"
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Empty State Warning */}
          {hasSearched && totalMatchedLessons === 0 && !loading && (
            <div className="p-6 bg-amber-50 rounded-2xl border border-amber-200 text-center space-y-2">
              <AlertCircle size={24} className="mx-auto text-amber-600" />
              <h4 className="text-sm font-black text-amber-950">No Saved Lesson Plans Found</h4>
              <p className="text-xs text-amber-800 max-w-md mx-auto">
                No saved lesson plans match <strong>{selectedSubject} ({selectedClass})</strong> for <strong>{term}</strong>.
                Generate and save lesson plans in the wizard first to export them together in bulk.
              </p>
            </div>
          )}

          {/* Information & NaCCA Compliance Note */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-start gap-3">
            <Info size={16} className="text-slate-500 shrink-0 mt-0.5" />
            <div className="text-[11px] text-slate-600 space-y-1">
              <p className="font-bold text-slate-800">TeachSmartGH Print Formatting Rules:</p>
              <p>
                • Term book documents include a standard cover page, headteacher vetting blocks, full Table of Contents, and sequential week sections.
              </p>
              <p>
                • All exports preserve your exact saved lesson plan content without altering indicators or teacher notes.
              </p>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 rounded-xl text-xs font-bold transition-all"
          >
            Return to Wizard
          </button>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {/* Export PDF Button */}
            <button
              onClick={() => {
                if (!hasBulkAccess) {
                  toast.error('Bulk Termly Export requires the Termly Master or Professional Yearly special subscription mode. Please upgrade in Billing.', {
                    duration: 6000,
                    icon: '👑'
                  });
                  return;
                }
                handleExportPdf();
              }}
              disabled={selectedLessonIds.length === 0 || exportingPdf || exportingWord}
              className={cn(
                "flex-1 sm:flex-initial px-4 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all",
                hasBulkAccess 
                  ? "bg-slate-800 hover:bg-slate-900 text-white disabled:opacity-50" 
                  : "bg-slate-100 text-slate-700 border border-slate-300 hover:bg-slate-200"
              )}
            >
              {!hasBulkAccess ? (
                <Lock size={13} className="text-amber-600" />
              ) : (
                <FileText size={14} className={exportingPdf ? "animate-bounce" : ""} />
              )}
              {exportingPdf ? 'Compiling PDF...' : 'Export Term Book (.pdf)'}
            </button>

            {/* Export Word (.docx) Button (Primary) */}
            <button
              onClick={() => {
                if (!hasBulkAccess) {
                  toast.error('Bulk Termly Export requires the Termly Master or Professional Yearly special subscription mode. Please upgrade in Billing.', {
                    duration: 6000,
                    icon: '👑'
                  });
                  return;
                }
                handleExportWord();
              }}
              disabled={selectedLessonIds.length === 0 || exportingWord || exportingPdf}
              className={cn(
                "flex-1 sm:flex-initial px-5 py-2.5 rounded-xl text-xs font-black flex items-center justify-center gap-2 shadow-md transition-all",
                hasBulkAccess
                  ? "bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white shadow-emerald-600/20"
                  : "bg-slate-900 hover:bg-slate-800 text-ghana-gold border border-ghana-gold/30 shadow-slate-900/20"
              )}
            >
              {!hasBulkAccess ? (
                <Lock size={13} className="text-ghana-gold" />
              ) : (
                <Download size={14} className={exportingWord ? "animate-bounce" : ""} />
              )}
              {exportingWord 
                ? 'Building Term Book...' 
                : !hasBulkAccess 
                  ? 'Unlock Bulk Export (.docx)' 
                  : `Export ${selectedLessonIds.length} Lessons (.docx)`}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default BulkTermExportModal;
