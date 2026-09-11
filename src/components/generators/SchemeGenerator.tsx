import React, { useState, useMemo } from 'react';
import { 
  Calendar, 
  Sparkles, 
  Download, 
  Loader2, 
  CheckCircle, 
  FileText,
  BookOpen,
  ArrowRight,
  Target,
  Copy,
  AlertCircle,
  MessageSquare,
  Edit3,
  Check,
  Eye,
  ChevronDown,
  ChevronUp,
  Sliders,
  Layers,
  Clock,
  AlertTriangle,
  CheckCircle2,
  ShieldAlert
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { TrialQuotaBanner } from '../common/TrialQuotaBanner';
import { showGenerationBlockedToast } from '../../lib/generationBlockedNotice';
import { useNavigate } from 'react-router';
import { generateSchemeOfWork } from '../../lib/gemini';
import { db } from '../../lib/firebase';
import { saveOffline } from '../../lib/indexedDB';
import { cacheGeneratedDocument } from '../../lib/offlineDocumentCache';
import { collection, addDoc, serverTimestamp, query, where, getDocs, limit, orderBy } from 'firebase/firestore';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../lib/utils';
import { SafeMarkdown, renderSafeLineBreaks } from '../common/SafeMarkdown';
import 'highlight.js/styles/github.css';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { toast } from 'react-hot-toast';
import { exportSchemeToWord } from '../../lib/wordExport';
import { registerUnicodeFonts } from '../../lib/fonts/unicodeFonts';
import { subjects as sharedSubjects, levels, CLASSES_BY_LEVEL, SUBJECT_STRANDS, SUBJECT_SUB_STRANDS, getSubjectsForClass } from '../../constants';
import { SearchableDropdown } from '../ui/SearchableDropdown';
import { 
  buildSchemeCurriculumFrame, 
  buildSchemeCoveragePlan,
  getSchemeTermCurriculumFrame,
  buildTermWeeklyDistributionPlan,
  buildYearWeeklyDistributionPlan,
  validateYearCoveragePlan,
  validateSchemeAgainstFrame,
  isSubjectClassVerified,
  CurriculumVerificationError,
  TermWeeklyDistributionPlan,
  YearWeeklyDistributionPlan
} from '../../lib/schemeGrounding';

const types = [
  { id: 'termly', label: 'Termly', icon: Calendar, desc: '12-week breakdown' },
  { id: 'yearly', label: 'Yearly', icon: Sparkles, desc: 'Full academic year' }
];

const GHANAIAN_LANGUAGES = [
  "Dagaare",
  "Dagbani",
  "Dangme",
  "Ewe",
  "Fante",
  "Ga",
  "Gonja",
  "Kasem",
  "Nzema",
  "Twi (Akuapem)",
  "Twi (Asante)"
];

const MULTILINGUAL_LANGUAGES = [
  "English",
  "Twi",
  "Fante",
  "Ewe",
  "Ga",
  "Dagbani",
  "Dagaare",
  "Gonja",
  "Kasem",
  "Nzema",
  "Bilingual (English + Selected Ghanaian Language)"
];

const GHANAIAN_LANGUAGES_FOR_BILINGUAL = [
  "Twi",
  "Fante",
  "Ewe",
  "Ga",
  "Dagbani",
  "Dagaare",
  "Gonja",
  "Kasem",
  "Nzema"
];

export default function SchemeGenerator() {
  const { user, profile, canGenerate, consumeCredit, aiCredits, getGenerationBlockReason } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [result, setResult] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [hasEdited, setHasEdited] = useState(false);
  const [saved, setSaved] = useState(false);
  
  const [formData, setFormData] = useState({
    subject: '',
    ghanaianLanguage: '',
    level: 'JHS',
    class: 'Basic 7',
    type: 'termly',
    term: '1',
    academicYear: '2025/2026',
    totalWeeks: 12,
    revisionWeeks: 1,
    assessmentWeeks: 1,
    title: '',
    includeLearningOutcomes: true,
    language: 'English',
    bilingualLanguage: 'Twi',
  });

  const [showWeeklyPreview, setShowWeeklyPreview] = useState(false);

  // Safe table cell renderer for Scheme preview: converts <br>, <br/>, <br><br> into genuine React breaks safely
  const schemeTableComponents = useMemo(() => ({
    td: ({ node, children, className, ...props }: any) => (
      <td {...props} className={cn(className, "align-top")}>
        {renderSafeLineBreaks(children)}
      </td>
    ),
    th: ({ node, children, className, ...props }: any) => (
      <th {...props} className={cn(className, "align-top")}>
        {renderSafeLineBreaks(children)}
      </th>
    )
  }), []);

  const displaySubject = formData.subject === 'Ghanaian Language' && formData.ghanaianLanguage
    ? `Ghanaian Language (${formData.ghanaianLanguage})`
    : formData.subject;

  const instructionalWeeks = Math.max(1, formData.totalWeeks - formData.revisionWeeks - formData.assessmentWeeks);

  // Memoized deterministic full-year curriculum coverage plan
  const coveragePlan = useMemo(() => {
    if (!formData.subject) return null;
    try {
      return buildSchemeCoveragePlan(
        displaySubject,
        formData.level,
        formData.class
      );
    } catch (e) {
      console.warn("Failed to compute coverage plan:", e);
      return null;
    }
  }, [displaySubject, formData.level, formData.class]);

  const selectedTerm = (formData.type === 'termly' && ['1', '2', '3'].includes(formData.term))
    ? (parseInt(formData.term, 10) as 1 | 2 | 3)
    : 1;

  // Memoized weekly distribution plan for termly scheme
  const weeklyDistributionPlan = useMemo(() => {
    if (!coveragePlan) return null;
    try {
      return buildTermWeeklyDistributionPlan(coveragePlan, selectedTerm, {
        academicYear: formData.academicYear,
        totalWeeks: formData.totalWeeks,
        revisionWeeks: formData.revisionWeeks,
        assessmentWeeks: formData.assessmentWeeks
      });
    } catch (e) {
      console.warn("Failed to compute weekly distribution plan:", e);
      return null;
    }
  }, [coveragePlan, selectedTerm, formData.academicYear, formData.totalWeeks, formData.revisionWeeks, formData.assessmentWeeks]);

  // Memoized yearly weekly distribution plan
  const yearlyWeeklyDistributionPlan = useMemo(() => {
    if (!coveragePlan || formData.type !== 'yearly') return null;
    try {
      return buildYearWeeklyDistributionPlan(coveragePlan, {
        academicYear: formData.academicYear,
        totalWeeks: formData.totalWeeks,
        revisionWeeks: formData.revisionWeeks,
        assessmentWeeks: formData.assessmentWeeks
      });
    } catch (e) {
      console.warn("Failed to compute yearly weekly distribution plan:", e);
      return null;
    }
  }, [coveragePlan, formData.type, formData.academicYear, formData.totalWeeks, formData.revisionWeeks, formData.assessmentWeeks]);

  const loadingSteps = [
    "Analyzing NaCCA syllabus requirements...",
    "Staging weekly breakdown structure...",
    "Generating curriculum content...",
    "Finalizing scheme format..."
  ];

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!canGenerate()) {
      showGenerationBlockedToast(getGenerationBlockReason(), 'schemes');
      return;
    }
    
    // Client-side validation
    if (!formData.subject) {
      toast.error("Please select a Subject Area.");
      return;
    }
    if (formData.subject === 'Ghanaian Language' && !formData.ghanaianLanguage) {
      toast.error("Please select a specific Ghanaian Language.");
      return;
    }
    if (!formData.level) {
      toast.error("Please select a Class/Level.");
      return;
    }
    if (formData.type === 'termly' && !['1', '2', '3'].includes(formData.term)) {
      toast.error("Please select a valid Academic Term (1, 2, or 3).");
      return;
    }

    setLoading(true);
    setLoadingStep(0);
    setResult(null);
    setSaved(false);

    // Strict Curriculum Authority Check (Phase 1: Basic 4 English Audited Pilot)
    const isVerified = isSubjectClassVerified(displaySubject, formData.class);
    if (!isVerified) {
      setLoading(false);
      toast.error(
        `Curriculum Authority Notice: Strict Verified Mode is active. Basic 4 English has been 100% audited and verified against the official NaCCA curriculum. Full syllabus authority verification for ${formData.class} ${displaySubject} is currently in progress. Generation is blocked to prevent synthetic indicators.`,
        { duration: 8000 }
      );
      return;
    }

    // Build deterministic full-year curriculum coverage plan for selected class and subject
    let activeCoveragePlan;
    try {
      activeCoveragePlan = coveragePlan || buildSchemeCoveragePlan(
        displaySubject,
        formData.level,
        formData.class,
        undefined,
        true
      );
    } catch (err: any) {
      setLoading(false);
      const errMsg = err?.userMessage || err?.message || 'Curriculum verification error.';
      toast.error(errMsg, { duration: 8000 });
      return;
    }

    // Validate mathematical invariants of the coverage plan
    const coverageValidation = validateYearCoveragePlan(activeCoveragePlan);
    if (!coverageValidation.valid) {
      console.warn("[SchemeGenerator] Year coverage plan validation notice:", coverageValidation.errors);
    }

    // Determine target term (default to Term 1 if not specified)
    const activeSelectedTerm = (formData.type === 'termly' && ['1', '2', '3'].includes(formData.term))
      ? (parseInt(formData.term, 10) as 1 | 2 | 3)
      : 1;

    // For termly: extract the target term frame; for yearly: full year frame
    const targetFrame = formData.type === 'termly'
      ? getSchemeTermCurriculumFrame(activeCoveragePlan, activeSelectedTerm)
      : buildSchemeCurriculumFrame(displaySubject, formData.level, formData.class);

    const activeWeeklyPlan = formData.type === 'termly'
      ? (weeklyDistributionPlan || buildTermWeeklyDistributionPlan(activeCoveragePlan, activeSelectedTerm, {
          academicYear: formData.academicYear,
          totalWeeks: formData.totalWeeks,
          revisionWeeks: formData.revisionWeeks,
          assessmentWeeks: formData.assessmentWeeks
        }))
      : undefined;

    const activeYearlyWeeklyPlan = formData.type === 'yearly'
      ? (yearlyWeeklyDistributionPlan || buildYearWeeklyDistributionPlan(activeCoveragePlan, {
          academicYear: formData.academicYear,
          totalWeeks: formData.totalWeeks,
          revisionWeeks: formData.revisionWeeks,
          assessmentWeeks: formData.assessmentWeeks
        }))
      : undefined;

    // Simulated progress steps
    const stepInterval = setInterval(() => {
      setLoadingStep(s => (s < loadingSteps.length - 1 ? s + 1 : s));
    }, 3000);

    try {
      const content = await generateSchemeOfWork(
        displaySubject,
        formData.class,
        formData.type,
        formData.term,
        { 
          includeLearningOutcomes: formData.includeLearningOutcomes,
          language: formData.language,
          bilingualLanguage: formData.bilingualLanguage,
          isBstemSchool: profile?.isBstemSchool,
          educationalLevel: formData.level,
          curriculumFrame: targetFrame,
          coveragePlan: activeCoveragePlan,
          weeklyConfig: {
            academicYear: formData.academicYear,
            totalWeeks: formData.totalWeeks,
            revisionWeeks: formData.revisionWeeks,
            assessmentWeeks: formData.assessmentWeeks
          },
          weeklyDistributionPlan: activeWeeklyPlan,
          yearlyWeeklyDistributionPlan: activeYearlyWeeklyPlan
        }
      );

      // Perform validation check to verify class isolation and zero cross-term contamination
      const validation = validateSchemeAgainstFrame(
        content, 
        targetFrame,
        activeCoveragePlan,
        formData.type === 'termly' ? activeSelectedTerm : undefined
      );
      if (!validation.valid) {
        if (validation.classMismatches.length > 0) {
          console.warn("[SchemeGenerator] Class isolation validation warning:", validation.classMismatches);
        }
        if (validation.termCrossContamination.length > 0) {
          console.warn("[SchemeGenerator] Cross-term contamination warning:", validation.termCrossContamination);
        }
      }

      setResult(content);
      
      if (user) {
        cacheGeneratedDocument({
          id: `scheme_${Date.now()}`,
          authorId: user.uid,
          title: formData.title || `${displaySubject} - ${formData.type === 'yearly' ? 'Yearly' : 'Termly'} Scheme of Learning`,
          type: 'scheme',
          subject: displaySubject,
          level: formData.level,
          class: formData.class,
          term: formData.term,
          academicYear: formData.academicYear,
          totalWeeks: formData.totalWeeks,
          instructionalWeeks,
          revisionWeeks: formData.revisionWeeks,
          assessmentWeeks: formData.assessmentWeeks,
          coverageVersion: 'teachsmart-v2-coverage',
          weeklyDistributionVersion: 'teachsmart-v2-weekly',
          content: content,
          includeLearningOutcomes: formData.includeLearningOutcomes,
          createdAt: Date.now(),
          synced: false
        });
      }

      await consumeCredit();
      toast.success("Scheme generated & cached offline! 🇬🇭");
    } catch (error) {
      console.error("Scheme generation failed:", error);
      toast.error("Generation failed. Please try again.");
    } finally {
      clearInterval(stepInterval);
      setLoading(false);
      setLoadingStep(0);
    }
  };

  const handleSave = async () => {
    if (!user || !result) return;
    try {
      const payload = {
        authorId: user.uid,
        title: formData.title || `${displaySubject} - ${formData.type === 'yearly' ? 'Yearly' : 'Termly'} Scheme of Learning`,
        subject: displaySubject,
        level: formData.level,
        class: formData.class,
        type: formData.type,
        term: formData.term,
        academicYear: formData.academicYear,
        totalWeeks: formData.totalWeeks,
        instructionalWeeks,
        revisionWeeks: formData.revisionWeeks,
        assessmentWeeks: formData.assessmentWeeks,
        coverageVersion: 'teachsmart-v2-coverage',
        weeklyDistributionVersion: 'teachsmart-v2-weekly',
        content: result,
        includeLearningOutcomes: formData.includeLearningOutcomes,
        createdAt: new Date().toISOString()
      };

      const isOnline = navigator.onLine;
      let docRefId = '';

      if (isOnline) {
        try {
          const docRef = await addDoc(collection(db, 'schemes'), {
            ...payload,
            createdAt: serverTimestamp()
          });
          docRefId = docRef.id;
        } catch (firebaseErr) {
          console.warn("Firebase scheme write failed, using local DB fallback.", firebaseErr);
        }
      }

      await saveOffline('schemes', { ...payload, id: docRefId || undefined }, !!docRefId);
      
      setSaved(true);
      if (docRefId) {
        toast.success("Scheme saved to cloud and cached offline! 🇬🇭");
      } else {
        toast.success("Scheme saved locally to offline cabinet! TeachSmartGH will synchronize it once online. 🇬🇭");
      }
    } catch (error) {
      console.error("Failed to save scheme:", error);
      try {
        const fallbackPayload = {
          authorId: user.uid,
          title: formData.title || `${displaySubject} - ${formData.type === 'yearly' ? 'Yearly' : 'Termly'} Scheme of Learning`,
          subject: displaySubject,
          level: formData.level,
          class: formData.class,
          type: formData.type,
          term: formData.term,
          academicYear: formData.academicYear,
          totalWeeks: formData.totalWeeks,
          instructionalWeeks,
          revisionWeeks: formData.revisionWeeks,
          assessmentWeeks: formData.assessmentWeeks,
          coverageVersion: 'teachsmart-v2-coverage',
          weeklyDistributionVersion: 'teachsmart-v2-weekly',
          content: result,
          includeLearningOutcomes: formData.includeLearningOutcomes,
          createdAt: new Date().toISOString()
        };
        await saveOffline('schemes', fallbackPayload, false);
        setSaved(true);
        toast.success("Saved locally! Scheme backed up in offline storage. 🇬🇭");
      } catch (offlineErr) {
        console.error("Offline save fallback also failed", offlineErr);
        toast.error("Failed to save. Storage is unavailable.");
      }
    }
  };

  const downloadPDF = () => {
    if (!result) return;
    const doc = new jsPDF('l', 'mm', 'a4'); // Landscape for tables
    const fontName = registerUnicodeFonts(doc);
    const mainTitle = formData.type === 'yearly' ? 'YEARLY SCHEME OF LEARNING' : 'TERMLY SCHEME OF LEARNING';
    
    // Custom Header Branding
    doc.setFillColor(0, 28, 61); // TeachSmart Deep Blue
    doc.rect(0, 0, 297, 30, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFont(fontName, "bold");
    doc.setFontSize(22);
    doc.text(mainTitle, 148.5, 15, { align: 'center' });
    
    doc.setFontSize(10);
    doc.setFont(fontName, "normal");
    doc.text('DESIGNED TO ALIGN WITH NaCCA/GES CURRICULUM REQUIREMENTS', 148.5, 22, { align: 'center' });
    
    doc.setDrawColor(252, 209, 22); // Ghana Gold
    doc.setLineWidth(0.8);
    doc.line(60, 26, 237, 26);

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(11);
    doc.setFont(fontName, "normal");
    const termInfo = formData.type === 'termly' ? ` | Term: ${formData.term}` : '';
    const metaText = `Subject: ${displaySubject.toUpperCase()} | Class: ${formData.class.toUpperCase()} (${formData.level.toUpperCase()})${termInfo} | Academic Year: ${formData.academicYear}`;
    doc.text(metaText, 148.5, 40, { align: 'center' });

    // Parse markdown table to array for autoTable
    const lines = result.split('\n');
    const tableData: string[][] = [];
    let headers: string[] = [];
    let processingTable = false;

    const cleanCellForPdf = (cellStr: string): string => {
      if (!cellStr) return '';
      return cellStr
        .replace(/<br\s*\/?>/gi, '\n')
        .replace(/\\n/g, '\n')
        .split('\n')
        .map(part => part.trim())
        .join('\n')
        .trim();
    };

    lines.forEach(line => {
      const trimmedLine = line.trim();
      if (trimmedLine.startsWith('|')) {
        const row = trimmedLine.split('|').filter((_, i, arr) => i > 0 && i < arr.length - 1).map(c => c.trim());
        if (row.length > 0) {
          if (!processingTable && !trimmedLine.includes('---')) {
            headers = row.map(cleanCellForPdf);
            processingTable = true;
          } else if (processingTable && !trimmedLine.includes('---')) {
            tableData.push(row.map(cleanCellForPdf));
          }
        }
      }
    });

    if (tableData.length > 0) {
      autoTable(doc, {
        head: [headers],
        body: tableData,
        startY: 48,
        theme: 'grid',
        rowPageBreak: 'avoid',
        showHead: 'everyPage',
        styles: { 
          font: fontName, 
          fontSize: 7.8, 
          cellPadding: 2.5, 
          valign: 'top', 
          overflow: 'linebreak',
          lineColor: [203, 213, 225],
          lineWidth: 0.2
        },
        headStyles: { 
          font: fontName, 
          fillColor: [0, 28, 61], 
          textColor: 255, 
          fontStyle: 'bold', 
          halign: 'center', 
          valign: 'middle' 
        },
        alternateRowStyles: { fillColor: [248, 250, 252] },
        columnStyles: headers.length === 6 ? {
          0: { cellWidth: 22, halign: 'center' },
          1: { cellWidth: 38 },
          2: { cellWidth: 38 },
          3: { cellWidth: 78 },
          4: { cellWidth: 78 },
          5: { cellWidth: 23 }
        } : undefined,
        margin: { top: 25, left: 10, right: 10, bottom: 20 },
        didDrawPage: (data) => {
          const pageHeight = doc.internal.pageSize.height;

          // Running header on page 2 and beyond
          if (data.pageNumber > 1) {
            doc.setFont(fontName, 'bold');
            doc.setFontSize(8.5);
            doc.setTextColor(0, 28, 61);
            doc.text(mainTitle, 10, 12);
            
            doc.setFont(fontName, 'normal');
            doc.setFontSize(7.5);
            doc.setTextColor(100, 116, 139);
            doc.text(metaText, 10, 17);
            
            doc.setDrawColor(226, 232, 240);
            doc.setLineWidth(0.4);
            doc.line(10, 19.5, 287, 19.5);
          }

          // Bottom footer on all pages
          doc.setDrawColor(220, 220, 220);
          doc.setLineWidth(0.5);
          doc.line(10, pageHeight - 12, 287, pageHeight - 12);

          if (data.pageNumber === 1) {
            doc.setFontSize(6.5);
            doc.setTextColor(120);
            doc.setFont(fontName, 'normal');
            doc.text('Curriculum content verified. Term/week distribution is system-generated and should be reviewed and adapted by the teacher/school.', 148.5, pageHeight - 7.5, { align: 'center' });
          }

          doc.setFont(fontName, 'bold');
          doc.setTextColor(0, 107, 63); // Green
          doc.setFontSize(7.5);
          doc.text('TEACHSMART GHANA • DESIGNED TO ALIGN WITH NaCCA/GES CURRICULUM REQUIREMENTS', 10, pageHeight - 4);
          
          doc.setTextColor(140);
          doc.setFont(fontName, 'normal');
          doc.setFontSize(7.5);
          doc.text(`Page ${data.pageNumber}`, 287, pageHeight - 4, { align: 'right' });
        }
      });
    }

    // Add Vetted by / Signature / Date endorsement footer
    const pageHeight = doc.internal.pageSize.height;
    let lastY = (doc as any).lastAutoTable?.finalY || 40;
    
    if (lastY + 24 > pageHeight - 20) {
      doc.addPage();
      const newPageHeight = doc.internal.pageSize.height;
      doc.setDrawColor(220, 220, 220);
      doc.setLineWidth(0.5);
      doc.line(10, newPageHeight - 12, 287, newPageHeight - 12);

      doc.setFont(fontName, 'bold');
      doc.setTextColor(0, 107, 63);
      doc.setFontSize(7.5);
      doc.text('TEACHSMART GHANA • DESIGNED TO ALIGN WITH NaCCA/GES CURRICULUM REQUIREMENTS', 10, newPageHeight - 4);

      lastY = 25;
    } else {
      lastY += 8;
    }
    
    doc.setFont(fontName, "bold");
    doc.setFontSize(9);
    doc.setTextColor(30, 41, 59);
    doc.text('Vetted by: ______________________', 15, lastY);
    doc.text('Signature: ______________________', 15, lastY + 7);
    doc.text('Date: ___________________________', 15, lastY + 14);
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').replace('T', '_').slice(0, 19);
    const filename = `${displaySubject}_${formData.level}_Scheme_${formData.type}_${timestamp}`.replace(/[\s\W]+/g, '_');
    doc.save(`${filename}.pdf`);
  };

  const [exportingWord, setExportingWord] = useState(false);

  const downloadWord = async () => {
    if (!result) return;
    setExportingWord(true);
    try {
      await exportSchemeToWord(result, {
        subject: displaySubject,
        classLevel: formData.class,
        level: formData.level,
        term: formData.term,
        academicYear: formData.academicYear,
        documentType: `${formData.type === 'termly' ? 'Termly' : 'Yearly'} Scheme of Learning`,
        orientation: 'landscape'
      });
    } catch (err) {
      console.error(err);
      toast.error('Failed to export Scheme of Learning to Word.');
    } finally {
      setExportingWord(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10 p-4 md:p-8">
      <TrialQuotaBanner />
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-ghana-red/10 text-ghana-red rounded-full text-xs font-black uppercase tracking-widest border border-ghana-red/20 text-center">
          <Calendar size={14} />
          <span>Academic Planner</span>
        </div>
        <h1 className="text-4xl font-black text-slate-900 tracking-tight lg:text-5xl">
          Scheme of Learning Generator
        </h1>
        <p className="text-slate-500 max-w-xl mx-auto font-medium">
          Create comprehensive, NaCCA-aligned official schemes for every level.
        </p>
      </div>

      <div className="bg-white p-8 lg:p-12 rounded-[3.5rem] shadow-sm border border-slate-100 ghana-border-red relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-ghana-red/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-50 group-hover:opacity-100 transition-opacity" />
        
        <form onSubmit={handleGenerate} className="space-y-10 relative z-10">
          <div className={cn("grid gap-8", formData.subject === 'Ghanaian Language' ? "md:grid-cols-4" : "md:grid-cols-3")}>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Subject Area</label>
              <SearchableDropdown
                value={formData.subject}
                options={formData.level ? getSubjectsForClass(formData.level, formData.class).slice().sort((a, b) => a.localeCompare(b)) : []}
                placeholder="Select Subject"
                onChange={(val) => setFormData({
                  ...formData,
                  subject: val,
                  ghanaianLanguage: val === 'Ghanaian Language' ? formData.ghanaianLanguage : ''
                })}
              />
            </div>

            {formData.subject === 'Ghanaian Language' && (
              <div className="space-y-2 animate-fadeIn">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Ghanaian Language</label>
                <select 
                  required
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-ghana-red outline-none transition-all font-bold text-slate-700"
                  value={formData.ghanaianLanguage}
                  onChange={(e) => setFormData({...formData, ghanaianLanguage: e.target.value})}
                >
                  <option value="">Select Language</option>
                  {GHANAIAN_LANGUAGES.slice().sort((a,b) => a.localeCompare(b)).map(lang => (
                    <option key={lang} value={lang}>{lang}</option>
                  ))}
                </select>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Educational Stage</label>
              <select 
                required
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-ghana-red outline-none transition-all font-bold text-slate-700"
                value={formData.level}
                onChange={(e) => {
                  const newLvl = e.target.value;
                  const newClasses = CLASSES_BY_LEVEL[newLvl] || [];
                  const newClass = newClasses[0] || '';
                  const levelSubjects = getSubjectsForClass(newLvl, newClass);
                  const currentSubj = formData.subject;
                  const newSubj = levelSubjects.includes(currentSubj) ? currentSubj : '';
                  setFormData({
                    ...formData,
                    level: newLvl,
                    class: newClass,
                    subject: newSubj,
                    ghanaianLanguage: newSubj === 'Ghanaian Language' ? formData.ghanaianLanguage : ''
                  });
                }}
              >
                {levels.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Specific Class</label>
              <select 
                required
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-ghana-red outline-none transition-all font-bold text-slate-700"
                value={formData.class}
                onChange={(e) => {
                  const newClass = e.target.value;
                  const validSubjects = getSubjectsForClass(formData.level, newClass);
                  const isSubjValid = validSubjects.includes(formData.subject);
                  setFormData({
                    ...formData,
                    class: newClass,
                    subject: isSubjValid ? formData.subject : '',
                    ghanaianLanguage: isSubjValid && formData.subject === 'Ghanaian Language' ? formData.ghanaianLanguage : ''
                  });
                }}
              >
                {(CLASSES_BY_LEVEL[formData.level] || []).map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          {/* Curriculum Authority & Verification Status Banner */}
          {formData.subject && formData.class && (
            <div className="animate-fadeIn">
              {isSubjectClassVerified(displaySubject, formData.class) ? (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div className="text-xs space-y-1">
                    <p className="font-bold text-emerald-900">
                      Verified Curriculum Content
                    </p>
                    <p className="text-emerald-700">
                      Basic 4 English uses verified curriculum content: <strong>52 Content Standards</strong> and <strong>59 Explicit Indicators</strong>. Term and weekly placement is currently a system-generated suggested distribution and should be reviewed by the teacher or school before use.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-3">
                  <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div className="text-xs space-y-1">
                    <p className="font-bold text-amber-900">
                      Curriculum Authority Notice — Strict Verified Mode
                    </p>
                    <p className="text-amber-700">
                      Strict Mode requires explicit, audited NaCCA standards and indicators. <strong>Basic 4 English</strong> is currently 100% verified. Full syllabus authority verification for <strong>{formData.class} {displaySubject}</strong> is currently in progress. Generation is blocked to guarantee curriculum authority.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Multilingual settings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 bg-slate-50 rounded-3xl border border-slate-100/50">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Instructional Language</label>
              <select 
                className="w-full p-4 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-ghana-red outline-none transition-all font-bold text-slate-700"
                value={formData.language}
                onChange={(e) => setFormData({...formData, language: e.target.value})}
              >
                {MULTILINGUAL_LANGUAGES.map(lang => (
                  <option key={lang} value={lang}>{lang}</option>
                ))}
              </select>
            </div>

            {formData.language.toLowerCase().includes('bilingual') && (
              <div className="space-y-2 animate-fadeIn">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Bilingual translation language</label>
                <select 
                  className="w-full p-4 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-ghana-red outline-none transition-all font-bold text-slate-700"
                  value={formData.bilingualLanguage}
                  onChange={(e) => setFormData({...formData, bilingualLanguage: e.target.value})}
                >
                  {GHANAIAN_LANGUAGES_FOR_BILINGUAL.map(lang => (
                    <option key={lang} value={lang}>{lang}</option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 text-center block">Planning Horizon</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {types.map(t => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setFormData({...formData, type: t.id})}
                  className={cn(
                    "p-6 rounded-[2rem] border text-left transition-all group",
                    formData.type === t.id 
                      ? "bg-slate-900 border-slate-900 text-white shadow-xl shadow-slate-200" 
                      : "bg-white border-slate-200 text-slate-500 hover:border-ghana-red/40"
                  )}
                >
                  <t.icon size={24} className={cn("mb-4", formData.type === t.id ? "text-ghana-gold" : "text-slate-300")} />
                  <h3 className="font-black uppercase tracking-tighter text-lg">{t.label}</h3>
                  <p className={cn("text-xs mt-1 font-medium", formData.type === t.id ? "text-slate-400" : "text-slate-400")}>
                    {t.desc}
                  </p>
                </button>
              ))}
            </div>
          </div>

          <AnimatePresence>
            {formData.type === 'termly' && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-6 overflow-hidden"
              >
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 text-center block">Select Academic Term</label>
                  <div className="flex justify-center gap-4">
                    {['1', '2', '3'].map((term) => (
                      <button
                        key={term}
                        type="button"
                        onClick={() => setFormData({...formData, term})}
                        className={cn(
                          "w-16 h-16 rounded-full border-2 font-black transition-all flex items-center justify-center",
                          formData.term === term
                            ? "bg-ghana-red border-ghana-red text-white shadow-lg"
                            : "bg-white border-slate-100 text-slate-400 hover:border-ghana-red/50"
                        )}
                      >
                        T{term}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2 justify-center text-slate-400 text-center px-4 bg-slate-50 p-4 rounded-2xl">
                  <AlertCircle size={12} className="shrink-0 text-ghana-red" />
                  <p className="text-[10px] font-bold uppercase tracking-widest leading-relaxed">
                    Note: The roadmap will be generated based on the official NaCCA curriculum standards.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Academic Year & Term Instructional Structure */}
          <div className="space-y-6 p-6 bg-slate-50 rounded-3xl border border-slate-200/80">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/80 pb-4">
              <div className="flex items-center gap-2 text-slate-800">
                <Clock size={18} className="text-ghana-red" />
                <h3 className="font-black uppercase tracking-tight text-sm">Term Structure & Instructional Distribution</h3>
              </div>
              <span className="text-[11px] font-bold text-slate-600 bg-white px-3 py-1 rounded-full border border-slate-200 shadow-xs w-fit">
                {instructionalWeeks} Teaching + {formData.revisionWeeks} Revision + {formData.assessmentWeeks} Assessment = {formData.totalWeeks} Wks
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Academic Year */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Academic Year</label>
                <select
                  value={formData.academicYear}
                  onChange={(e) => setFormData({ ...formData, academicYear: e.target.value })}
                  className="w-full p-3.5 bg-white border border-slate-200 rounded-2xl font-bold text-slate-700 text-sm focus:ring-2 focus:ring-ghana-red outline-none transition-all"
                >
                  <option value="2025/2026">2025/2026</option>
                  <option value="2024/2025">2024/2025</option>
                  <option value="2026/2027">2026/2027</option>
                </select>
              </div>

              {/* Total Term Weeks */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Total Term Weeks</label>
                <select
                  value={formData.totalWeeks}
                  onChange={(e) => {
                    const total = parseInt(e.target.value, 10);
                    setFormData({ ...formData, totalWeeks: total });
                  }}
                  className="w-full p-3.5 bg-white border border-slate-200 rounded-2xl font-bold text-slate-700 text-sm focus:ring-2 focus:ring-ghana-red outline-none transition-all"
                >
                  {[10, 11, 12, 13, 14].map(w => (
                    <option key={w} value={w}>{w} Weeks {w === 12 ? '(Default)' : ''}</option>
                  ))}
                </select>
              </div>

              {/* Revision Weeks */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Revision Weeks</label>
                <select
                  value={formData.revisionWeeks}
                  onChange={(e) => setFormData({ ...formData, revisionWeeks: parseInt(e.target.value, 10) })}
                  className="w-full p-3.5 bg-white border border-slate-200 rounded-2xl font-bold text-slate-700 text-sm focus:ring-2 focus:ring-ghana-red outline-none transition-all"
                >
                  {[0, 1, 2, 3].map(rw => (
                    <option key={rw} value={rw}>{rw} Week{rw === 1 ? '' : 's'} {rw === 1 ? '(Default)' : ''}</option>
                  ))}
                </select>
              </div>

              {/* Assessment Weeks */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Assessment Weeks</label>
                <select
                  value={formData.assessmentWeeks}
                  onChange={(e) => setFormData({ ...formData, assessmentWeeks: parseInt(e.target.value, 10) })}
                  className="w-full p-3.5 bg-white border border-slate-200 rounded-2xl font-bold text-slate-700 text-sm focus:ring-2 focus:ring-ghana-red outline-none transition-all"
                >
                  {[0, 1, 2].map(aw => (
                    <option key={aw} value={aw}>{aw} Week{aw === 1 ? '' : 's'} {aw === 1 ? '(Default)' : ''}</option>
                  ))}
                </select>
              </div>
            </div>

            <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
              TeachSmartGH default term structure distributes curriculum across <strong>{instructionalWeeks} instructional weeks</strong>, with designated revision and assessment periods. Adjust according to your school calendar.
            </p>

            {/* High Density Warning Banner */}
            {weeklyDistributionPlan?.densityWarning && (
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-3">
                <AlertTriangle className="text-amber-600 shrink-0 mt-0.5" size={18} />
                <div className="text-xs text-amber-800 space-y-1">
                  <p className="font-bold">High Curriculum Density Notice</p>
                  <p className="font-medium text-amber-700 leading-relaxed">
                    {weeklyDistributionPlan.densityWarning}
                  </p>
                </div>
              </div>
            )}

            {/* Weekly Allocation Preview Accordion */}
            {formData.subject && weeklyDistributionPlan && (
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setShowWeeklyPreview(!showWeeklyPreview)}
                  className="w-full py-3 px-4 bg-white hover:bg-slate-100/80 border border-slate-200 rounded-2xl flex items-center justify-between transition-colors group"
                >
                  <div className="flex items-center gap-2.5 text-left">
                    <Layers size={16} className="text-ghana-green" />
                    <span className="font-bold text-xs text-slate-800">
                      Preview Planned Weekly Distribution ({formData.type === 'termly' ? `Term ${formData.term}` : 'Full Year'} • {weeklyDistributionPlan.weeks.length} Weeks)
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-400 group-hover:text-slate-600">
                    <span className="text-[11px] font-semibold">
                      {showWeeklyPreview ? 'Hide Schedule' : 'Inspect Roadmap'}
                    </span>
                    {showWeeklyPreview ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </div>
                </button>

                <AnimatePresence>
                  {showWeeklyPreview && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden mt-3"
                    >
                      <div className="p-4 bg-white border border-slate-200 rounded-2xl space-y-3 max-h-96 overflow-y-auto">
                        <div className="flex items-center justify-between pb-2 border-b border-slate-100 text-xs">
                          <span className="font-bold text-slate-700">
                            {displaySubject} ({formData.class}) — Term {formData.term} Allocation
                          </span>
                          <span className="text-[11px] text-slate-500 font-medium">
                            Avg {weeklyDistributionPlan.averageDensity} indicators/wk
                          </span>
                        </div>

                        <div className="space-y-2">
                          {weeklyDistributionPlan.weeks.map(alloc => (
                            <div
                              key={alloc.weekNumber}
                              className={cn(
                                "p-3 rounded-xl border text-xs transition-colors",
                                alloc.type === 'assessment'
                                  ? "bg-purple-50/60 border-purple-200/80"
                                  : alloc.type === 'revision'
                                  ? "bg-blue-50/60 border-blue-200/80"
                                  : "bg-slate-50/70 border-slate-200/70"
                              )}
                            >
                              <div className="flex items-start justify-between gap-2">
                                <div className="space-y-0.5">
                                  <div className="flex items-center gap-2">
                                    <span className="font-black text-slate-900 bg-white px-2 py-0.5 rounded-md border border-slate-200 text-[11px]">
                                      Week {alloc.weekNumber}
                                    </span>
                                    <span className="font-bold text-slate-700 text-xs">
                                      {alloc.strandSummary || 'Curriculum Consolidation'}
                                    </span>
                                  </div>
                                  {alloc.subStrandSummary && alloc.subStrandSummary !== alloc.strandSummary && (
                                    <p className="text-[11px] text-slate-500 font-medium pl-1">
                                      Sub-Strand: {alloc.subStrandSummary}
                                    </p>
                                  )}
                                </div>
                                <span className={cn(
                                  "text-[10px] font-black uppercase px-2 py-0.5 rounded-full shrink-0",
                                  alloc.type === 'assessment'
                                    ? "bg-purple-200 text-purple-800"
                                    : alloc.type === 'revision'
                                    ? "bg-blue-200 text-blue-800"
                                    : "bg-emerald-100 text-emerald-800"
                                )}>
                                  {alloc.type === 'assessment'
                                    ? 'Assessment'
                                    : alloc.type === 'revision'
                                    ? 'Revision'
                                    : `${alloc.totalIndicators} Ind.`}
                                </span>
                              </div>

                              {alloc.standards.length > 0 ? (
                                <div className="mt-2 pl-1 space-y-1.5 border-t border-slate-200/50 pt-2">
                                  {alloc.standards.map((st, idx) => (
                                    <div key={idx} className="space-y-0.5">
                                      <p className="text-[11px] font-bold text-slate-800">
                                        {st.contentStandardCode}: <span className="font-normal text-slate-600">{st.contentStandardText}</span>
                                      </p>
                                      {st.indicators.length > 0 && (
                                        <ul className="list-disc list-inside pl-1 text-[10px] text-slate-500 space-y-0.5">
                                          {st.indicators.map(ind => (
                                            <li key={ind.code}>
                                              <span className="font-semibold text-slate-700">{ind.code}</span>: {ind.text}
                                            </li>
                                          ))}
                                        </ul>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <p className="mt-1.5 pl-1 text-[11px] text-slate-500 italic">
                                  {alloc.notes || 'Consolidation, revision, and structured review activities.'}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>

          <button 
            disabled={loading}
            className="w-full btn-primary !bg-ghana-red py-5 text-base font-black flex items-center justify-center gap-3 shadow-xl shadow-red-900/10 group relative overflow-hidden"
          >
            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div 
                  key="loading"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex flex-col items-center gap-2"
                >
                  <div className="flex items-center gap-3">
                    <Loader2 className="animate-spin" />
                    <span>Processing {formData.type} Plan...</span>
                  </div>
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-[10px] text-white/70 italic font-medium absolute -bottom-1 z-10"
                  >
                    {loadingSteps[loadingStep]}
                  </motion.p>
                  {/* Progress Bar Background */}
                  <div className="absolute bottom-0 left-0 h-1 bg-white/20 w-full">
                    <motion.div 
                      initial={{ width: "0%" }}
                      animate={{ width: `${((loadingStep + 1) / loadingSteps.length) * 100}%` }}
                      className="h-full bg-ghana-gold"
                    />
                  </div>
                </motion.div>
              ) : (
                <motion.div 
                  key="ready"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center gap-3"
                >
                  <Sparkles size={20} className="group-hover:rotate-12 transition-transform text-ghana-gold" />
                  <span>Generate Scheme of Learning</span>
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        </form>
      </div>

      <AnimatePresence>
        {result && (
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-4 bg-white p-4 rounded-2xl sm:rounded-[2rem] border border-slate-200 shadow-sm">
              <div className="flex items-center gap-3 min-w-0 shrink">
                <div className="w-10 h-10 bg-ghana-red/10 rounded-xl flex items-center justify-center shrink-0">
                  <FileText className="text-ghana-red" size={20} />
                </div>
                <div className="min-w-0">
                   <h3 className="font-black text-slate-900 uppercase tracking-tight text-sm">Roadmap Preview</h3>
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider truncate">
                     {displaySubject} • {formData.class} ({formData.level}) • {formData.type === 'termly' ? `Term ${formData.term}` : 'Yearly'} • {formData.academicYear} • {formData.totalWeeks} Wks
                   </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className={cn(
                    "py-2 px-3.5 sm:px-4 sm:py-2.5 rounded-xl font-bold text-xs whitespace-nowrap shrink-0 flex items-center justify-center gap-1.5 transition-all shadow-sm",
                    isEditing
                      ? "bg-amber-500 hover:bg-amber-600 text-white"
                      : "bg-slate-100 hover:bg-slate-200 text-slate-800"
                  )}
                >
                  {isEditing ? <Eye size={15} /> : <Edit3 size={15} />}
                  {isEditing ? "Preview Table" : "Edit Scheme"}
                </button>
                <button 
                  onClick={() => {
                    if (result) {
                      navigator.clipboard.writeText(result);
                      toast.success("Markdown copied to clipboard!");
                    }
                  }}
                  className="py-2 px-3 sm:px-3.5 sm:py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs whitespace-nowrap shrink-0 flex items-center justify-center gap-1.5 transition-colors"
                  title="Copy raw markdown"
                >
                  <Copy size={15} />
                  Copy
                </button>
                <button 
                  onClick={handleSave}
                  disabled={saved}
                  className="py-2 px-3.5 sm:px-4 sm:py-2.5 rounded-xl border border-slate-200 font-bold text-xs whitespace-nowrap shrink-0 flex items-center justify-center gap-1.5 hover:bg-slate-50 transition-colors"
                >
                  {saved ? <CheckCircle size={15} className="text-emerald-500" /> : <BookOpen size={15} />}
                  {saved ? "Saved" : "Save Cloud"}
                </button>
                <button 
                  onClick={downloadPDF}
                  className="btn-primary !bg-slate-900 py-2 px-4 sm:px-5 sm:py-2.5 text-xs font-bold whitespace-nowrap shrink-0 flex items-center justify-center gap-1.5"
                >
                  <Download size={15} />
                  PDF
                </button>
                <button 
                  onClick={downloadWord}
                  disabled={exportingWord}
                  className="py-2 px-4 sm:px-5 sm:py-2.5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl font-bold text-xs whitespace-nowrap shrink-0 flex items-center justify-center gap-1.5 transition-all shadow-md shadow-blue-700/20"
                  title="Download Termly Scheme of Learning Word Document (.docx)"
                >
                  <FileText size={15} />
                  {exportingWord ? "Word..." : "Word (.docx)"}
                </button>
                <a 
                  href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                    `Hi colleague! I generated a highly detailed, NaCCA-aligned Scheme of Learning for *${displaySubject}* (${formData.class}) using *TeachSmartGH* by Catalyst Creative.\n\n*Scheme of Work Details:*\n- Subject: ${displaySubject}\n- Class: ${formData.class}\n- Term: Term ${formData.term}\n\nJoin me in using AI-powered tools for smarter teaching at: ${window.location.origin}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#25D366] text-white py-2 px-3.5 sm:px-4 sm:py-2.5 rounded-xl font-bold text-xs whitespace-nowrap shrink-0 flex items-center justify-center gap-1.5 hover:bg-[#20ba59] transition-all cursor-pointer shadow-sm text-center"
                >
                  <MessageSquare size={15} />
                  WhatsApp
                </a>
              </div>
            </div>

            {/* Teacher Customization Banner */}
            {hasEdited && (
              <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-2xl flex items-center justify-between text-xs text-emerald-900">
                <div className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-emerald-600" />
                  <span className="font-bold">Custom teacher edits active! All table row modifications will be reflected in your downloaded PDF and Cloud scheme.</span>
                </div>
                <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-200/60 px-2 py-0.5 rounded-md">Edited</span>
              </div>
            )}

            {/* EDIT MODE SCHEME FORM */}
            {isEditing ? (
              <div className="bg-white p-8 lg:p-12 rounded-[3rem] shadow-xl border border-amber-200/80 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4 border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                      <Edit3 size={20} />
                    </div>
                    <div>
                      <h2 className="text-xl font-black text-slate-900">Edit Scheme of Learning</h2>
                      <p className="text-xs text-slate-500">Edit weekly breakdowns, indicators, learning activities, or resources directly.</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-black uppercase tracking-wider hover:bg-slate-800 transition-all flex items-center gap-1.5 self-start sm:self-auto"
                  >
                    <Check size={14} />
                    Done Editing & View Table
                  </button>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-xs font-black text-slate-700 uppercase tracking-wider">
                      Scheme Markdown Table Content
                    </label>
                    <span className="text-[10px] text-slate-400 font-medium">Keep markdown table structure (using | and ---) for clean PDF export</span>
                  </div>
                  <textarea
                    rows={18}
                    value={result || ''}
                    onChange={(e) => {
                      setResult(e.target.value);
                      setHasEdited(true);
                    }}
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-mono text-slate-800 focus:bg-white focus:border-amber-500 focus:outline-none leading-relaxed"
                    placeholder="Enter or edit markdown table rows..."
                  />
                </div>

                <div className="flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 pt-4">
                  <span className="text-xs text-slate-500 font-medium">
                    Changes are parsed dynamically into both the live preview table and the generated PDF.
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setIsEditing(false)}
                      className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all shadow-md"
                    >
                      <Check size={14} />
                      Done & View Table
                    </button>
                    <button
                      onClick={downloadPDF}
                      className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all shadow-md"
                    >
                      <Download size={14} />
                      PDF
                    </button>
                  </div>
                </div>
              </div>
            ) : null}

            {!isEditing && (
            <div className="bg-white p-10 lg:p-16 rounded-[4rem] shadow-2xl border border-slate-100 relative min-h-[600px] ghana-border-red overflow-x-auto">
               <div className="markdown-body prose prose-slate max-w-none prose-headings:font-black prose-headings:uppercase prose-headings:tracking-tighter prose-headings:mt-10 first:prose-headings:mt-0 prose-p:font-medium prose-li:font-medium prose-table:border prose-table:border-slate-100 prose-th:bg-slate-50 prose-th:p-4 prose-td:p-4">
                <SafeMarkdown components={schemeTableComponents}>
                  {result || ""}
                </SafeMarkdown>
              </div>
              <div className="mt-8 pt-4 border-t border-slate-100 text-xs text-slate-500 text-center font-medium">
                Curriculum content verified. Term/week distribution is system-generated and should be reviewed and adapted by the teacher/school.
              </div>
            </div>
            )}

            <div className="flex justify-center pt-10 pb-20">
              <button 
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="flex items-center gap-2 text-slate-400 font-black uppercase tracking-widest text-[10px] hover:text-ghana-red transition-colors"
              >
                Back to top
                <ArrowRight className="-rotate-90" size={14} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
