import React, { useState } from 'react';
import { 
  FileText, 
  Sparkles, 
  Download, 
  Loader2, 
  CheckCircle, 
  AlertCircle,
  Copy,
  Layout,
  BookOpen,
  X,
  Award,
  ShieldCheck,
  ChevronRight,
  Activity,
  Layers,
  HelpCircle,
  Info,
  MessageSquare,
  Edit3,
  Check,
  Eye
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router';
import { generateExam } from '../../lib/gemini';
import { db } from '../../lib/firebase';
import { saveOffline } from '../../lib/indexedDB';
import { cacheGeneratedDocument } from '../../lib/offlineDocumentCache';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../lib/utils';
import { SafeMarkdown } from '../common/SafeMarkdown';
import 'highlight.js/styles/github.css';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { toast } from 'react-hot-toast';
import { exportExamToWord } from '../../lib/wordExport';
import { subjects as sharedSubjects, levels, CLASSES_BY_LEVEL, subjectsByLevel } from '../../constants';
import { SearchableDropdown } from '../ui/SearchableDropdown';

const difficulties = ["Easy", "Standard", "Challenging"];

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

export default function ExamGenerator() {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ questions: string; markingScheme: string } | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [hasEdited, setHasEdited] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showMarkingScheme, setShowMarkingScheme] = useState(false);
  const [showSaveConfirm, setShowSaveConfirm] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showSbcGuide, setShowSbcGuide] = useState(false);
  const [activeGuideTab, setActiveGuideTab] = useState<'principles' | 'domains' | 'itemAnalysis' | 'waecScheme'>('principles');
  
  const [formData, setFormData] = useState(() => {
    const defaultLevel = profile?.level || 'JHS';
    const classes = CLASSES_BY_LEVEL[defaultLevel] || [];
    return {
      subject: '',
      ghanaianLanguage: '',
      level: defaultLevel,
      classLevel: classes[0] || '',
      topics: '',
      difficulty: 'Standard',
      title: '',
      selectedTypes: ['Multiple Choice', 'Theory'] as string[],
      p1Count: 40,
      p1Difficulty: 'Standard',
      p2Count: 6,
      p2Difficulty: 'Standard',
      language: 'English',
      bilingualLanguage: 'Twi',
    };
  });

  const currentClasses = CLASSES_BY_LEVEL[formData.level] || [];
  const displaySubject = formData.subject === 'Ghanaian Language' && formData.ghanaianLanguage
    ? `Ghanaian Language (${formData.ghanaianLanguage})`
    : formData.subject;

  const questionTypes = ['Multiple Choice', 'Theory', 'Practical', 'True/False', 'Matching', 'Fill-in-the-blanks'];

  const toggleType = (type: string) => {
    setFormData(prev => ({
      ...prev,
      selectedTypes: prev.selectedTypes.includes(type)
        ? prev.selectedTypes.filter(t => t !== type)
        : [...prev.selectedTypes, type]
    }));
  };

  const handleLevelChange = (lvl: any) => {
    const classes = CLASSES_BY_LEVEL[lvl] || [];
    const levelSubjects = subjectsByLevel[lvl] || [];
    setFormData(prev => {
      const currentSubj = prev.subject;
      const newSubj = levelSubjects.includes(currentSubj) ? currentSubj : '';
      return {
        ...prev,
        level: lvl,
        classLevel: classes[0] || '',
        subject: newSubj,
        ghanaianLanguage: newSubj === 'Ghanaian Language' ? prev.ghanaianLanguage : ''
      };
    });
  };

  const cleanMarkdown = (content: string) => {
    if (!content) return "";
    
    let cleaned = content.trim();
    
    // Repair unclosed code blocks
    const backtickCount = (cleaned.match(/```/g) || []).length;
    if (backtickCount % 2 !== 0) {
      cleaned += "\n```";
    }
    
    // Repair common header issues (ensure space after #)
    cleaned = cleaned.replace(/^(#+)([A-Za-z])/gm, '$1 $2');
    
    // Ensure tables have a closing newline if they seem cut off
    if (cleaned.includes('|') && !cleaned.endsWith('\n')) {
      cleaned += '\n';
    }

    return cleaned;
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setResult(null);
    setSaved(false);

    try {
      const examData = await generateExam(
        displaySubject,
        `${formData.level} (${formData.classLevel})`,
        formData.topics,
        formData.difficulty,
        {
          school: profile?.school,
          region: profile?.region,
          district: profile?.district,
          town: profile?.town,
          isBstemSchool: profile?.isBstemSchool
        },
        formData.selectedTypes,
        { count: formData.p1Count, difficulty: formData.p1Difficulty },
        { count: formData.p2Count, difficulty: formData.p2Difficulty },
        undefined,
        undefined,
        undefined,
        undefined,
        formData.language,
        formData.bilingualLanguage
      );
      
      const questions = examData?.questions?.trim() || "";
      const markingScheme = examData?.markingScheme?.trim() || "";

      if (!questions && !markingScheme) {
        throw new Error("Unable to retrieve examination questions from AI. Please try again.");
      }

      const cleanedResult = {
        questions: cleanMarkdown(questions || "# Examination Paper\n\nQuestions available."),
        markingScheme: cleanMarkdown(markingScheme || "## Marking Scheme\n\nScoring guide available.")
      };

      setResult(cleanedResult);

      if (user) {
        cacheGeneratedDocument({
          id: `exam_${Date.now()}`,
          authorId: user.uid,
          title: formData.title || `${displaySubject} - ${formData.topics}`,
          type: 'exam',
          subject: displaySubject,
          level: `${formData.level} (${formData.classLevel})`,
          classLevel: formData.classLevel,
          questions: cleanedResult.questions,
          markingScheme: cleanedResult.markingScheme,
          createdAt: Date.now(),
          synced: false
        });
      }

      toast.success("Examination generated & cached offline! 🇬🇭");
    } catch (error: any) {
      console.error("Exam generation failed:", error);
      
      let errorMessage = error?.message || "Examination generation failed. Please try again.";
      if (typeof errorMessage === 'string') {
        if (errorMessage.includes("quota")) {
          errorMessage = "AI generation quota reached. Please wait a moment and try again.";
        } else if (errorMessage.includes("Unexpected token")) {
          errorMessage = "The AI returned malformed data. Please try clicking generate again.";
        }
      }
      
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    if (!user || !result) return;
    setShowSaveConfirm(true);
  };

  const executeSave = async () => {
    if (!user || !result) return;
    setIsSaving(true);
    try {
      const payload = {
        authorId: user.uid,
        title: formData.title || `${displaySubject} - ${formData.topics}`,
        subject: displaySubject,
        level: `${formData.level} (${formData.classLevel})`,
        classLevel: formData.classLevel,
        questions: result.questions,
        markingScheme: result.markingScheme,
        createdAt: new Date().toISOString()
      };

      const isOnline = navigator.onLine;
      let docRefId = '';

      if (isOnline) {
        try {
          const docRef = await addDoc(collection(db, 'exams'), {
            ...payload,
            createdAt: serverTimestamp()
          });
          docRefId = docRef.id;
        } catch (firebaseErr) {
          console.warn("Firebase exam write failed, using local DB fallback.", firebaseErr);
        }
      }

      await saveOffline('exams', { ...payload, id: docRefId || undefined }, !!docRefId);

      setSaved(true);
      setShowSaveConfirm(false);
      if (docRefId) {
        toast.success("Exam saved to library and cached offline! 🇬🇭");
      } else {
        toast.success("Exam saved locally to offline cabinet! TeachSmartGH will synchronize it once online. 🇬🇭");
      }
    } catch (error) {
      console.error("Failed to save exam:", error);
      try {
        const fallbackPayload = {
          authorId: user.uid,
          title: formData.title || `${displaySubject} - ${formData.topics}`,
          subject: displaySubject,
          level: `${formData.level} (${formData.classLevel})`,
          classLevel: formData.classLevel,
          questions: result.questions,
          markingScheme: result.markingScheme,
          createdAt: new Date().toISOString()
        };
        await saveOffline('exams', fallbackPayload, false);
        setSaved(true);
        setShowSaveConfirm(false);
        toast.success("Saved locally! Exam backed up in offline storage. 🇬🇭");
      } catch (offlineErr) {
        console.error("Offline save also failed", offlineErr);
        toast.error("Failed to save exam. Storage is unavailable.");
      }
    } finally {
      setIsSaving(false);
    }
  };

  const downloadPDF = (type: 'exam' | 'marking') => {
    if (!result) return;
    const doc = new jsPDF();
    const title = type === 'exam' ? formData.title || 'Examination Paper' : `Marking Scheme: ${formData.title || 'Examination'}`;
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').replace('T', '_').slice(0, 19);
    const filename = `${displaySubject}_${formData.level}_${formData.classLevel}_${type === 'exam' ? 'Exam' : 'Marking'}_${timestamp}`.replace(/[\s\W]+/g, '_');
    
    // Header Branding
    doc.setFillColor(0, 28, 61); // TeachSmart Deep Blue
    doc.rect(0, 0, 210, 40, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('TEACHSMART GHANA', 105, 18, { align: 'center' });
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('OFFICIAL NaCCA CURRICULUM COMPLIANT ASSESSMENT', 105, 26, { align: 'center' });
    
    doc.setDrawColor(252, 209, 22); // Ghana Gold
    doc.setLineWidth(1);
    doc.line(40, 32, 170, 32);

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(title.toUpperCase(), 105, 55, { align: 'center' });
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`SUBJECT: ${displaySubject.toUpperCase()} | LEVEL: ${formData.level.toUpperCase()} (${formData.classLevel.toUpperCase()}) | DIFFICULTY: ${formData.difficulty.toUpperCase()}`, 105, 62, { align: 'center' });
    
    doc.setLineWidth(0.5);
    doc.setDrawColor(230, 230, 230);
    doc.line(20, 68, 190, 68);

    const content = type === 'exam' ? result.questions : result.markingScheme;
    
    const lines = content.split('\n');
    let cursorY = 78;
    const pageHeight = doc.internal.pageSize.height;
    const maxContentY = pageHeight - 35;
    const marginX = 20;

    const addNewPage = () => {
      doc.addPage();
      cursorY = 25;
    };

    let i = 0;
    while (i < lines.length) {
      const origLine = lines[i];
      const trimmedLine = origLine.trim();

      if (trimmedLine === '') {
        cursorY += 4;
        i++;
        continue;
      }

      // Render Markdown Tables using autoTable
      if (trimmedLine.startsWith('|')) {
        const tableLines: string[] = [];
        while (i < lines.length && lines[i].trim().startsWith('|')) {
          tableLines.push(lines[i].trim());
          i++;
        }

        if (tableLines.length > 0) {
          let headers: string[] = [];
          const bodyRows: string[][] = [];

          tableLines.forEach((tLine, tIdx) => {
            const row = tLine.split('|').filter((_, colIdx, arr) => colIdx > 0 && colIdx < arr.length - 1).map(c => c.trim());
            if (row.length > 0) {
              if (tIdx === 0) {
                headers = row;
              } else if (!tLine.includes('---')) {
                bodyRows.push(row);
              }
            }
          });

          if (headers.length > 0 || bodyRows.length > 0) {
            if (cursorY + 15 > maxContentY) {
              addNewPage();
            }

            autoTable(doc, {
              head: headers.length > 0 ? [headers] : [],
              body: bodyRows,
              startY: cursorY + 2,
              theme: 'grid',
              styles: { fontSize: 8.5, cellPadding: 3.5, valign: 'middle' },
              headStyles: { fillColor: [0, 28, 61], textColor: 255, fontStyle: 'bold', halign: 'center' },
              alternateRowStyles: { fillColor: [248, 250, 252] },
              margin: { left: marginX, right: marginX },
            });

            cursorY = (doc as any).lastAutoTable.finalY + 6;
          }
        }
        continue;
      }

      // Standard text line
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10.5);
      
      const cleanLine = origLine.replace(/[#*]/g, '');
      const splitLines = doc.splitTextToSize(cleanLine, 170);
      
      splitLines.forEach((sLine: string) => {
        if (cursorY > maxContentY) {
          addNewPage();
        }
        doc.text(sLine, marginX, cursorY);
        cursorY += 6.5;
      });

      i++;
    }

    // Footer
    const pageCount = (typeof doc.getNumberOfPages === 'function' ? doc.getNumberOfPages() : 1) || 1;
    for(let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setDrawColor(200, 200, 200);
        doc.setLineWidth(0.5);
        doc.line(10, pageHeight - 20, 200, pageHeight - 20);

        doc.setFontSize(7);
        doc.setTextColor(100);
        doc.setFont('helvetica', 'italic');
        const complianceMsg = [
          'NaCCA COMPLIANCE NOTE: This assessment is structured based on the Standard-Based Curriculum (SBC) framework as mandated by the National Council for Curriculum and Assessment (NaCCA) Ghana.',
          'Teachers are encouraged to adapt the content to suit their learner\'s diverse needs while maintaining core competency targets and SBC learning indicators.',
          'Verification of specific indicators against official NaCCA curriculum handbooks is strongly recommended for classroom fidelity.'
        ];
        
        let footerY = pageHeight - 16;
        complianceMsg.forEach(msg => {
          doc.text(msg, 105, footerY, { align: 'center' });
          footerY += 3.5;
        });

        doc.setFont('helvetica', 'bold');
        doc.setTextColor(0, 107, 63); // Ghana Green
        doc.setFontSize(8);
        doc.text('TEACHSMART GHANA • AI-POWERED NaCCA COMPLIANT TOOLS', 105, pageHeight - 5, { align: 'center' });
        
        doc.setTextColor(150);
        doc.setFont('helvetica', 'normal');
        doc.text(`Page ${i} of ${pageCount}`, 200, pageHeight - 5, { align: 'right' });
    }
    
    doc.save(`${filename}.pdf`);
  };

  const [exportingWord, setExportingWord] = useState(false);

  const downloadWord = async (type: 'exam' | 'marking') => {
    if (!result) return;
    setExportingWord(true);
    try {
      const content = type === 'exam' ? result.questions : result.markingScheme;
      await exportExamToWord(content, type, {
        title: formData.title || (type === 'exam' ? 'Examination Paper' : 'Marking Scheme'),
        subject: displaySubject,
        classLevel: formData.classLevel,
        level: formData.level,
      });
    } catch (err) {
      console.error(err);
      toast.error('Failed to export to Word document.');
    } finally {
      setExportingWord(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 p-4 md:p-8">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-500/10 text-emerald-600 rounded-full text-xs font-black uppercase tracking-widest border border-emerald-500/20">
          <Sparkles size={14} />
          <span>WAEC Standard compliant</span>
        </div>
        <h1 className="text-4xl font-black text-slate-900 tracking-tight lg:text-5xl">
          Official WAEC Style Exams
        </h1>
        <p className="text-slate-500 max-w-xl mx-auto font-medium">
          Generate standardized BECE/WASSCE style papers with exact question counts, practical diagrams, and official marking schemes.
        </p>

        {/* Dynamic National Standards-Based Assessment (SBA) Training Guide */}
        <div className="max-w-3xl mx-auto text-left mt-6">
          <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-xl border border-slate-800 transition-all">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-2xl border border-emerald-500/20">
                  <Award size={24} className="text-emerald-400" />
                </div>
                <div>
                  <h3 className="font-black text-lg tracking-tight text-white flex items-center gap-2">
                    NaCCA Standard-Based Assessment (SBA) Standards
                    <span className="bg-amber-400 text-slate-950 text-[10px] uppercase font-black px-2 py-0.5 rounded-full inline-block">
                      GES / NaCCA Aligned
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400 font-medium">
                    Our exam generator strictly implements national test construction guidelines, Bloom's Taxonomy, and DOK cognitive levels.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowSbcGuide(!showSbcGuide)}
                className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl transition-all border border-slate-700 self-start md:self-auto flex items-center gap-1.5"
                id="btn-sbc-guide-toggle"
              >
                {showSbcGuide ? "Hide SBA Guide" : "Explore SBA Guidelines"}
                <ChevronRight size={14} className={cn("transition-transform duration-300", showSbcGuide ? "rotate-90" : "")} />
              </button>
            </div>

            <AnimatePresence>
              {showSbcGuide && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden mt-6 pt-6 border-t border-slate-800 space-y-6 animate-fadeIn"
                >
                  {/* Tabs for Navigation */}
                  <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-3">
                    <button
                      type="button"
                      onClick={() => setActiveGuideTab('principles')}
                      className={cn(
                        "px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all flex items-center gap-1.5",
                        activeGuideTab === 'principles' 
                          ? "bg-emerald-500 text-slate-950 shadow-lg" 
                          : "bg-slate-800 text-slate-450 hover:text-white"
                      )}
                      id="tab-sbc-principles"
                    >
                      <ShieldCheck size={14} />
                      8 Item Principles
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveGuideTab('domains')}
                      className={cn(
                        "px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all flex items-center gap-1.5",
                        activeGuideTab === 'domains' 
                          ? "bg-emerald-500 text-slate-950 shadow-lg" 
                          : "bg-slate-800 text-slate-450 hover:text-white"
                      )}
                      id="tab-sbc-domains"
                    >
                      <Layers size={14} />
                      Domains of Learning
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveGuideTab('itemAnalysis')}
                      className={cn(
                        "px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all flex items-center gap-1.5",
                        activeGuideTab === 'itemAnalysis' 
                          ? "bg-emerald-500 text-slate-950 shadow-lg" 
                          : "bg-slate-800 text-slate-450 hover:text-white"
                      )}
                      id="tab-sbc-analysis"
                    >
                      <Activity size={14} />
                      Item Analysis (p-value)
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveGuideTab('waecScheme')}
                      className={cn(
                        "px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all flex items-center gap-1.5",
                        activeGuideTab === 'waecScheme' 
                          ? "bg-emerald-500 text-slate-950 shadow-lg" 
                          : "bg-slate-800 text-slate-450 hover:text-white"
                      )}
                      id="tab-waec-scheme-overview"
                    >
                      <BookOpen size={14} />
                      WAEC 2024 Schemes
                    </button>
                  </div>

                  {/* Tab Contents */}
                  {activeGuideTab === 'principles' && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs"
                    >
                      <div className="bg-slate-850 p-4 rounded-2xl border border-slate-800 space-y-2">
                        <div className="font-bold text-emerald-400 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                          1. Clarity & Specificity
                        </div>
                        <p className="text-slate-350 leading-relaxed">
                          Items must be completely free of vague or complex wording. In MCQs, the stem should clearly and fully pose the problem, enabling students to formulate its solution before looking at the A/B/C/D alternatives.
                        </p>
                      </div>
                      <div className="bg-slate-850 p-4 rounded-2xl border border-slate-800 space-y-2">
                        <div className="font-bold text-emerald-400 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                          2. Relevance & Content Validity
                        </div>
                        <p className="text-slate-350 leading-relaxed">
                          All assessment items must map directly back to official NaCCA standards, strands, sub-strands, and learning indicators, protecting content validity metrics.
                        </p>
                      </div>
                      <div className="bg-slate-850 p-4 rounded-2xl border border-slate-800 space-y-2">
                        <div className="font-bold text-emerald-400 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                          3. Balanced Difficulty Index
                        </div>
                        <p className="text-slate-350 leading-relaxed">
                          A healthy test spreads item difficulties systematically. While few easy and hard items exist, the bulk are balanced with p-values of 0.45 to 0.75, which is ideal for grading.
                        </p>
                      </div>
                      <div className="bg-slate-850 p-4 rounded-2xl border border-slate-800 space-y-2">
                        <div className="font-bold text-emerald-400 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                          4. Plausible & Cognitive Distractors
                        </div>
                        <p className="text-slate-350 leading-relaxed">
                          MCQ incorrect choices (distractors) are modeled around proven student misconceptions and require active conceptual evaluation rather than obvious guessing.
                        </p>
                      </div>
                      <div className="bg-slate-850 p-4 rounded-2xl border border-slate-800 space-y-2">
                        <div className="font-bold text-emerald-400 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                          5. Objective Consistency & Fairness
                        </div>
                        <p className="text-slate-350 leading-relaxed">
                          Items are design-tested to be free of regional, cultural, or personal biases, ensuring equal scoring opportunities for children in all parts of Ghana.
                        </p>
                      </div>
                      <div className="bg-slate-850 p-4 rounded-2xl border border-slate-800 space-y-2">
                        <div className="font-bold text-emerald-400 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                          6. Zero Grammatical Clues
                        </div>
                        <p className="text-slate-350 leading-relaxed">
                          Prevents accidental hints (e.g., matching plural stems to plural verbs in choices). All choices are similar in length, style, complexity, and grammatical context.
                        </p>
                      </div>
                    </motion.div>
                  )}

                  {activeGuideTab === 'domains' && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="space-y-4 text-xs"
                    >
                      <div className="bg-slate-850 p-5 rounded-2xl border border-slate-800 space-y-3">
                        <h4 className="text-emerald-400 font-bold uppercase tracking-wider text-[11px] flex items-center gap-2">
                          <Layers size={14} /> Cognitive Domain (Revised Bloom's & Depth of Knowledge):
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div className="p-3 bg-slate-900/40 rounded-xl border border-slate-800 space-y-1">
                            <span className="text-amber-400 font-black">Remember/Understand</span>
                            <p className="text-slate-450 text-[11px] leading-relaxed">Recall, list, state, label terms (DOK 1). Lays the foundational literacy for basic concepts.</p>
                          </div>
                          <div className="p-3 bg-slate-900/40 rounded-xl border border-slate-800 space-y-1">
                            <span className="text-amber-400 font-black">Apply/Analyze</span>
                            <p className="text-slate-450 text-[11px] leading-relaxed">Demonstrate, categorize, compute in real Ghanaian contexts (DOK 2 & 3). Relates knowledge directly to the environment.</p>
                          </div>
                          <div className="p-3 bg-slate-900/40 rounded-xl border border-slate-800 space-y-1">
                            <span className="text-amber-400 font-black">Evaluate/Create</span>
                            <p className="text-slate-450 text-[11px] leading-relaxed">Formulate, critique, design structures or practical workflows (DOK 4). Instills critical self-reliance and innovation.</p>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-slate-850 p-4 rounded-2xl border border-slate-800 space-y-2">
                          <h4 className="text-emerald-400 font-bold uppercase tracking-wider text-[11px] flex items-center gap-2">
                            <Sparkles size={14} /> Affective Domain (Values & Actions):
                          </h4>
                          <p className="text-slate-350 leading-relaxed">
                            Formulates moral, civic, and ethno-cultural reasoning questions. Especially for RME and Social Studies, questions require students to evaluate civic behaviors, ethics, and values in real-life societal scenarios.
                          </p>
                        </div>
                        <div className="bg-slate-850 p-4 rounded-2xl border border-slate-800 space-y-2">
                          <h4 className="text-emerald-400 font-bold uppercase tracking-wider text-[11px] flex items-center gap-2">
                            <Activity size={14} /> Psychomotor Domain (Skills & Practicals):
                          </h4>
                          <p className="text-slate-350 leading-relaxed">
                            For hands-on topics (Career Tech, Science, Computing), we generate performance evaluations, freehand drawing cues, materials sorting lists, and experimental workflow validations.
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {activeGuideTab === 'itemAnalysis' && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="space-y-4 text-xs"
                    >
                      <div className="bg-slate-850 p-5 rounded-2xl border border-slate-800 space-y-4">
                        <h4 className="text-emerald-400 font-bold uppercase tracking-wider text-[11px] flex items-center gap-2">
                          <Activity size={14} /> Statistical Item Metrics & Quality Targets
                        </h4>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <span className="text-white font-bold flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full bg-emerald-400" />
                              Difficulty Index (p-value):
                            </span>
                            <p className="text-slate-350 leading-relaxed font-medium">
                              Calculates the proportion of students who answered correctly. 
                              Our engine prioritizes the <strong>optimal p-value range of 0.45 to 0.75</strong> for moderate difficulty. This target ensures examinations are neither too challenging nor trivial.
                            </p>
                          </div>
                          
                          <div className="space-y-1.5">
                            <span className="text-white font-bold flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full bg-amber-400" />
                              Discrimination Index (DI):
                            </span>
                            <p className="text-slate-350 leading-relaxed font-medium">
                              Measures how effectively an item distinguishes high-achieving from low-achieving master groups. 
                              Items are systematically checked for positive, high-discrimination outputs, filtering out misleading or double-edged items.
                            </p>
                          </div>
                        </div>

                        <div className="pt-3 border-t border-slate-800 flex items-start gap-2.5 text-[11px] text-slate-400">
                          <Info size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                          <p className="leading-relaxed">
                            <strong>Note on MCQ Distractor Analysis:</strong> All incorrect alternatives generated represent active misconceptions. If students guessed blind, distractor frequencies would balance; TeachSmart ensures distractors have high cognitive plausibility so students must demonstrate authentic mastery.
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {activeGuideTab === 'waecScheme' && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="space-y-4 text-xs font-medium"
                    >
                      <div className="bg-slate-850 p-5 rounded-2xl border border-slate-800 space-y-4">
                        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                          <h4 className="text-emerald-400 font-bold uppercase tracking-wider text-[11px] flex items-center gap-2">
                            <BookOpen size={14} /> Official WAEC 2024 Exam Structures
                          </h4>
                          <span className="text-[10px] bg-slate-900 border border-slate-800 text-slate-300 font-bold px-2 py-0.5 rounded-full">
                            Continuous Assessment 30% | External 70%
                          </span>
                        </div>

                        <div className="overflow-x-auto">
                          <table className="w-full text-left text-slate-300 text-[11px]">
                            <thead>
                              <tr className="border-b border-slate-800 text-slate-400 font-bold">
                                <th className="pb-2">Subject</th>
                                <th className="pb-2">Paper 1 (Objective)</th>
                                <th className="pb-2">Paper 2 (Essay & Practical)</th>
                                <th className="pb-2">Weight / Scaling</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr className="border-b border-slate-850">
                                <td className="py-2.5 font-bold text-white">Career Technology</td>
                                <td className="py-2.5 text-slate-400">40 MCQs / 50 min. (40 marks)</td>
                                <td className="py-2.5 text-slate-400">Section A (compulsory test of practical) & Section B (choice)</td>
                                <td className="py-2.5 text-slate-400">Paper 1 (40), Paper 2 (60) = 100 Marks</td>
                              </tr>
                              <tr className="border-b border-slate-850">
                                <td className="py-2.5 font-bold text-white">Computing</td>
                                <td className="py-2.5 text-slate-400">40 MCQs / 45 min. (40 marks)</td>
                                <td className="py-2.5 text-slate-400">Section A (compulsory flowchart/algorithm) & Section B (3 of 4)</td>
                                <td className="py-2.5 text-slate-400">Paper 1 (40), Paper 2 (60) = 100 Marks</td>
                              </tr>
                              <tr className="border-b border-slate-850">
                                <td className="py-2.5 font-bold text-white">French</td>
                                <td className="py-2.5 text-slate-400">Part I: Listening (20m), Part II: Written (10m), Part III: Vocab (10m)</td>
                                <td className="py-2.5 text-slate-400">Question 1 (thematic forms/advice - 20m), Question 2 (essay - 20m)</td>
                                <td className="py-2.5 text-slate-400">P1 scaling: 1.5x (60m). P2: (40m) = 100 Marks</td>
                              </tr>
                              <tr className="border-b border-slate-850">
                                <td className="py-2.5 font-bold text-white">Ghanaian Language</td>
                                <td className="py-2.5 text-slate-400">40 MCQs / 50 min. on Customs, Literature, grammar</td>
                                <td className="py-2.5 text-slate-400">4 parts: Composition (30m), Comprehension (10m), Translation (10m), Usage (10m)</td>
                                <td className="py-2.5 text-slate-400">Paper 1 (40), Paper 2 (60) = 100 Marks</td>
                              </tr>
                              <tr className="border-b border-slate-850">
                                <td className="py-2.5 font-bold text-white">Arabic</td>
                                <td className="py-2.5 text-slate-400">40 MCQs / 45 min lexis, grammar & structures</td>
                                <td className="py-2.5 text-slate-400">Guided essay (picture/letter writing - 30m)</td>
                                <td className="py-2.5 text-slate-400">P1 scaled by 2.25 (70m), P2 (30m) = 100 Marks</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-slate-800">
                          <div className="p-3 bg-slate-900/40 rounded-xl border border-slate-800 space-y-1">
                            <span className="text-emerald-400 font-bold">Bringing Foreign Materials</span>
                            <p className="text-slate-450 text-[11px] leading-relaxed">
                              Immediate withholding of results for any candidate bringing cribs, programmable calculators, or custom-inscribed clothing into the examination call.
                            </p>
                          </div>
                          <div className="p-3 bg-slate-900/40 rounded-xl border border-slate-800 space-y-1">
                            <span className="text-emerald-400 font-bold">Mass Cheating Guidelines</span>
                            <p className="text-slate-450 text-[11px] leading-relaxed">
                              If more than half at a center collude in any paper, the entire center is de-recognized for a minimum of 1 year, with results strictly withheld as per WAEC 2024 regulations.
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <div className="bg-white p-8 lg:p-12 rounded-[3rem] shadow-sm border border-slate-100 ghana-border relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-50 group-hover:opacity-100 transition-opacity" />
        
        <form onSubmit={handleGenerate} className="space-y-8 relative z-10">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Examination Title</label>
            <input 
              type="text" 
              placeholder="e.g., End of Term 1 Science Examination (2024)"
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all font-bold text-slate-800 placeholder:text-slate-300 shadow-sm"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
            />
          </div>

          <div className={cn("grid grid-cols-1 gap-8", formData.subject === 'Ghanaian Language' ? "md:grid-cols-4" : "md:grid-cols-3")}>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Subject Area</label>
              <SearchableDropdown
                value={formData.subject}
                options={formData.level ? (subjectsByLevel[formData.level] || []).slice().sort((a,b) => a.localeCompare(b)) : []}
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
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all font-bold text-slate-750 cursor-pointer shadow-sm"
                  value={formData.ghanaianLanguage}
                  onChange={(e) => setFormData({...formData, ghanaianLanguage: e.target.value})}
                >
                  <option value="">Select Language</option>
                  {GHANAIAN_LANGUAGES.slice().sort((a,b) => a.localeCompare(b)).map(lang => <option key={lang} value={lang}>{lang}</option>)}
                </select>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Education Stage</label>
              <select 
                required
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all font-bold text-slate-700"
                value={formData.level}
                onChange={(e) => handleLevelChange(e.target.value)}
              >
                {levels.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Specific Class/Form</label>
              <select 
                required
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all font-bold text-slate-700"
                value={formData.classLevel}
                onChange={(e) => setFormData({...formData, classLevel: e.target.value})}
              >
                {currentClasses.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          {/* Multilingual settings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 bg-slate-50 rounded-3xl border border-slate-100/50">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Instructional Language</label>
              <select 
                className="w-full p-4 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all font-bold text-slate-700"
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
                  className="w-full p-4 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all font-bold text-slate-700"
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

          {formData.level === 'JHS' && formData.subject && (
            <div className="p-4 bg-emerald-500/5 rounded-2xl border border-emerald-500/10 flex items-start gap-3">
              <div className="p-2 bg-emerald-500/10 text-emerald-600 rounded-lg">
                <Sparkles size={16} className="animate-pulse" />
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-black text-slate-800 tracking-tight uppercase flex items-center gap-1.5">
                  Official 2024 BECE Format Engaged
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping inline-block" />
                </h4>
                <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                  TeachSmartGH has auto-aligned your examination settings for <strong className="text-slate-700 font-bold">{displaySubject}</strong> with the latest 2024 WAEC / NaCCA test specifications. Paper 1 Objectives (40 questions) and Paper 2 Theories with subject-specific sections, marks allocation, and compulsory question rules are preset automatically.
                </p>
              </div>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 space-y-4">
              <h3 className="text-xs font-black text-emerald-600 uppercase tracking-widest flex items-center gap-2">
                <Layout size={14} />
                Paper 1: Objectives
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Ques. Count</label>
                  <input 
                    type="number"
                    min="5"
                    max="100"
                    className="w-full p-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all font-bold text-slate-700"
                    value={formData.p1Count}
                    onChange={(e) => setFormData({...formData, p1Count: parseInt(e.target.value) || 0})}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Difficulty</label>
                  <select 
                    className="w-full p-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all font-bold text-slate-700"
                    value={formData.p1Difficulty}
                    onChange={(e) => setFormData({...formData, p1Difficulty: e.target.value})}
                  >
                    {difficulties.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
              </div>
            </div>

            <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 space-y-4">
              <h3 className="text-xs font-black text-indigo-600 uppercase tracking-widest flex items-center gap-2">
                <FileText size={14} />
                Paper 2: Theory
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Ques. Count</label>
                  <input 
                    type="number"
                    min="2"
                    max="20"
                    className="w-full p-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all font-bold text-slate-700"
                    value={formData.p2Count}
                    onChange={(e) => setFormData({...formData, p2Count: parseInt(e.target.value) || 0})}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Difficulty</label>
                  <select 
                    className="w-full p-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all font-bold text-slate-700"
                    value={formData.p2Difficulty}
                    onChange={(e) => setFormData({...formData, p2Difficulty: e.target.value})}
                  >
                    {difficulties.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Overall Difficulty</label>
              <div className="flex gap-2">
                {difficulties.map(d => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setFormData({...formData, difficulty: d})}
                    className={cn(
                      "flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-tighter border transition-all",
                      formData.difficulty === d 
                        ? "bg-emerald-deep text-white border-emerald-deep shadow-lg shadow-emerald-900/20" 
                        : "bg-white text-slate-400 border-slate-200 hover:border-emerald-200"
                    )}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Included Question Types</label>
            <div className="flex flex-wrap gap-2">
              {questionTypes.map(type => (
                <button
                  key={type}
                  type="button"
                  onClick={() => toggleType(type)}
                  className={cn(
                    "px-4 py-2 rounded-xl text-xs font-bold border transition-all",
                    formData.selectedTypes.includes(type)
                      ? "bg-emerald-50 border-emerald-500 text-emerald-700"
                      : "bg-white border-slate-200 text-slate-500 hover:border-emerald-200"
                  )}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Specific Topics to Cover (Required)</label>
            <textarea 
              required
              rows={4}
              placeholder="e.g., Human digestive system, Balanced diet, Diseases of the circulatory system. This will guide the AI in selecting questions."
              className="w-full p-6 bg-slate-50 border border-slate-200 rounded-[2rem] focus:ring-2 focus:ring-emerald-500 outline-none transition-all font-medium resize-none shadow-sm"
              value={formData.topics}
              onChange={(e) => setFormData({...formData, topics: e.target.value})}
            />
          </div>

          <button 
            disabled={loading}
            className="w-full btn-primary py-5 text-base font-black flex items-center justify-center gap-3 shadow-xl shadow-emerald-900/20 group"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" />
                <span>Crafting Assessment...</span>
              </>
            ) : (
              <>
                <Sparkles size={20} className="group-hover:rotate-12 transition-transform" />
                <span>Generate Assessment</span>
              </>
            )}
          </button>
        </form>
      </div>

      <AnimatePresence>
        {result && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-3 p-3 sm:p-4 bg-slate-900 rounded-2xl sm:rounded-[2rem] border border-white/10 ring-4 ring-slate-900/10 sticky top-20 lg:top-4 z-30 shadow-2xl">
              <div className="flex items-center gap-3 px-2 sm:px-3 min-w-0 shrink">
                <div className="w-9 h-9 sm:w-10 sm:h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-white shrink-0 shadow-md shadow-emerald-500/20">
                  <CheckCircle size={18} />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Assessment Ready</p>
                  <h3 className="text-white font-bold text-xs sm:text-sm truncate max-w-[200px] sm:max-w-[300px] xl:max-w-[260px]" title={formData.title || "Examination Paper"}>{formData.title || "Examination Paper"}</h3>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 p-1 bg-white/5 rounded-xl sm:rounded-2xl">
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className={cn(
                    "px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-xl text-[11px] font-bold uppercase tracking-wider whitespace-nowrap shrink-0 flex items-center gap-1.5 transition-all shadow-md",
                    isEditing
                      ? "bg-amber-500 hover:bg-amber-600 text-white shadow-amber-500/20"
                      : "bg-white/10 hover:bg-white/20 text-white"
                  )}
                >
                  {isEditing ? <Eye size={14} /> : <Edit3 size={14} />}
                  {isEditing ? "Preview Format" : "Edit Assessment"}
                </button>

                <div className="flex bg-white/10 p-0.5 rounded-xl shrink-0">
                  <button 
                    onClick={() => setShowMarkingScheme(false)}
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider whitespace-nowrap transition-all",
                      !showMarkingScheme ? "bg-white text-slate-900 shadow-sm font-black" : "text-slate-400 hover:text-white"
                    )}
                  >
                    Questions
                  </button>
                  <button 
                    onClick={() => setShowMarkingScheme(true)}
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider whitespace-nowrap transition-all",
                      showMarkingScheme ? "bg-white text-slate-900 shadow-sm font-black" : "text-slate-400 hover:text-white"
                    )}
                  >
                    Marking Scheme
                  </button>
                </div>

                <button 
                  onClick={handleSave}
                  disabled={saved || isSaving}
                  className="px-3.5 py-2 sm:px-4 sm:py-2.5 bg-blue-600 text-white rounded-xl text-[11px] font-bold uppercase tracking-wider whitespace-nowrap shrink-0 flex items-center gap-1.5 hover:bg-blue-700 transition-all shadow-md shadow-blue-600/20"
                >
                  {isSaving ? <Loader2 size={14} className="animate-spin" /> : (saved ? <CheckCircle size={14} /> : <BookOpen size={14} />)}
                  {saved ? "Saved" : "Save Cloud"}
                </button>

                <button 
                  onClick={() => downloadPDF('exam')}
                  className="px-3.5 py-2 sm:px-4 sm:py-2.5 bg-white text-slate-900 rounded-xl text-[11px] font-bold uppercase tracking-wider whitespace-nowrap shrink-0 flex items-center gap-1.5 hover:bg-slate-100 transition-all shadow-md"
                >
                  <Download size={14} />
                  Exam PDF
                </button>
                <button 
                  onClick={() => downloadWord('exam')}
                  disabled={exportingWord}
                  className="px-3.5 py-2 sm:px-4 sm:py-2.5 bg-blue-700 text-white rounded-xl text-[11px] font-bold uppercase tracking-wider whitespace-nowrap shrink-0 flex items-center gap-1.5 hover:bg-blue-800 transition-all shadow-md shadow-blue-700/20"
                  title="Download Exam Question Paper in Word (.docx)"
                >
                  <FileText size={14} />
                  Exam Word
                </button>
                <button 
                  onClick={() => downloadPDF('marking')}
                  className="px-3.5 py-2 sm:px-4 sm:py-2.5 bg-emerald-500 text-white rounded-xl text-[11px] font-bold uppercase tracking-wider whitespace-nowrap shrink-0 flex items-center gap-1.5 hover:bg-emerald-400 transition-all shadow-md shadow-emerald-500/20"
                >
                  <CheckCircle size={14} />
                  Scheme PDF
                </button>
                <button 
                  onClick={() => downloadWord('marking')}
                  disabled={exportingWord}
                  className="px-3.5 py-2 sm:px-4 sm:py-2.5 bg-slate-800 text-emerald-300 border border-emerald-500/30 rounded-xl text-[11px] font-bold uppercase tracking-wider whitespace-nowrap shrink-0 flex items-center gap-1.5 hover:bg-slate-700 transition-all shadow-md"
                  title="Download Marking Scheme in Word (.docx)"
                >
                  <FileText size={14} />
                  Scheme Word
                </button>
                <a 
                  href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                    `Hi colleague! I generated a high-quality, NaCCA curriculum-aligned exam paper for *${displaySubject}* (${formData.level}) using *TeachSmartGH* by Catalyst Creative.\n\n*Resource Details:*\n- Subject: ${displaySubject}\n- Level: ${formData.level}\n- Topics: ${formData.topics || "General"}\n\nJoin me in using AI-powered tools for smarter teaching at: ${window.location.origin}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 sm:px-4 sm:py-2.5 bg-[#25D366] text-white rounded-xl text-[11px] font-bold uppercase tracking-wider whitespace-nowrap shrink-0 flex items-center gap-1.5 hover:bg-[#20ba59] transition-all shadow-md shadow-green-500/10 cursor-pointer"
                >
                  <MessageSquare size={14} />
                  WhatsApp
                </a>
              </div>
            </div>

            {/* Teacher Customization Banner */}
            {hasEdited && (
              <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-2xl flex items-center justify-between text-xs text-emerald-900">
                <div className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-emerald-600" />
                  <span className="font-bold">Custom teacher modifications active! Changes are preserved across Question Paper and Marking Scheme PDF downloads.</span>
                </div>
                <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-200/60 px-2 py-0.5 rounded-md">Edited</span>
              </div>
            )}

            {/* EDIT MODE EXAM FORM */}
            {isEditing ? (
              <div className="bg-white p-8 lg:p-12 rounded-[3rem] shadow-xl border border-amber-200/80 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4 border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                      <Edit3 size={20} />
                    </div>
                    <div>
                      <h2 className="text-xl font-black text-slate-900">
                        {showMarkingScheme ? "Edit Marking Scheme Content" : "Edit Question Paper Content"}
                      </h2>
                      <p className="text-xs text-slate-500">
                        Edit questions, options, point schemes, or model answers directly before exporting to PDF.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setShowMarkingScheme(!showMarkingScheme)}
                      className="px-4 py-2 bg-slate-100 text-slate-800 rounded-xl text-xs font-bold hover:bg-slate-200 transition-all"
                    >
                      Switch to {showMarkingScheme ? "Question Paper" : "Marking Scheme"}
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="px-5 py-2 bg-slate-900 text-white rounded-xl text-xs font-black uppercase tracking-wider hover:bg-slate-800 transition-all flex items-center gap-1.5"
                    >
                      <Check size={14} />
                      Done & Preview
                    </button>
                  </div>
                </div>

                {!showMarkingScheme ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-black text-slate-700 uppercase tracking-wider">
                        Question Paper (Section A Objectives & Section B Theories)
                      </label>
                      <span className="text-[10px] text-slate-400 font-medium">Supports Markdown headings, lists, tables</span>
                    </div>
                    <textarea
                      rows={18}
                      value={result.questions || ''}
                      onChange={(e) => {
                        setResult((prev: any) => ({ ...prev, questions: e.target.value }));
                        setHasEdited(true);
                      }}
                      className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-mono text-slate-800 focus:bg-white focus:border-amber-500 focus:outline-none leading-relaxed"
                      placeholder="Edit examination questions..."
                    />
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-black text-emerald-800 uppercase tracking-wider">
                        Marking Scheme & Model Answers
                      </label>
                      <span className="text-[10px] text-slate-400 font-medium">Objective answer keys, step marks, marking breakdown</span>
                    </div>
                    <textarea
                      rows={18}
                      value={result.markingScheme || ''}
                      onChange={(e) => {
                        setResult((prev: any) => ({ ...prev, markingScheme: e.target.value }));
                        setHasEdited(true);
                      }}
                      className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-mono text-slate-800 focus:bg-white focus:border-emerald-500 focus:outline-none leading-relaxed"
                      placeholder="Edit marking scheme and answers..."
                    />
                  </div>
                )}

                <div className="flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 pt-4">
                  <span className="text-xs text-slate-500 font-medium">
                    Modifications will be automatically compiled into your printed assessment sheets and PDFs.
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setIsEditing(false)}
                      className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all shadow-md"
                    >
                      <Check size={14} />
                      Done & View Paper
                    </button>
                    <button 
                      onClick={() => downloadPDF('exam')}
                      className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all shadow-md"
                    >
                      <Download size={14} />
                      Exam PDF
                    </button>
                    <button 
                      onClick={() => downloadPDF('marking')}
                      className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all shadow-md"
                    >
                      <CheckCircle size={14} />
                      Scheme PDF
                    </button>
                  </div>
                </div>
              </div>
            ) : null}

            {!isEditing && (
            <div className="bg-white p-8 lg:p-16 rounded-[3rem] shadow-2xl border border-slate-100 relative min-h-[600px] overflow-hidden">
              <div className="markdown-body prose prose-emerald max-w-none prose-headings:font-black prose-p:font-medium prose-li:font-medium prose-table:border prose-table:border-slate-200 prose-th:bg-slate-50 prose-th:p-4 prose-td:p-4 prose-th:border prose-td:border prose-td:border-slate-100">
                <SafeMarkdown>
                  {showMarkingScheme ? result.markingScheme : result.questions}
                </SafeMarkdown>
              </div>
            </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showSaveConfirm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !isSaving && setShowSaveConfirm(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl relative z-10 overflow-hidden border border-slate-100"
            >
              <div className="p-8 space-y-6">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
                    <BookOpen size={24} />
                  </div>
                  <button 
                    onClick={() => setShowSaveConfirm(false)}
                    disabled={isSaving}
                    className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                  >
                    <X size={20} className="text-slate-400" />
                  </button>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-xl font-black text-slate-900 tracking-tight">Confirm Save</h3>
                  <p className="text-sm text-slate-500 font-medium">
                    Do you want to save this examination to your cloud library? You'll be able to access it anytime from your dashboard.
                  </p>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
                    <span>Title</span>
                    <span className="text-slate-900">{formData.title || 'Untitled Exam'}</span>
                  </div>
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
                    <span>Subject</span>
                    <span className="text-slate-900">{displaySubject}</span>
                  </div>
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
                    <span>Level</span>
                    <span className="text-slate-900">{formData.level} ({formData.classLevel})</span>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button 
                    onClick={() => setShowSaveConfirm(false)}
                    disabled={isSaving}
                    className="flex-1 py-4 px-6 rounded-2xl text-xs font-black uppercase tracking-widest text-slate-500 hover:bg-slate-50 transition-colors border border-slate-100"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={executeSave}
                    disabled={isSaving}
                    className="flex-1 py-4 px-6 rounded-2xl text-xs font-black uppercase tracking-widest bg-emerald-600 text-white shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2"
                  >
                    {isSaving ? <Loader2 className="animate-spin" size={16} /> : <CheckCircle size={16} />}
                    {isSaving ? 'Saving...' : 'Confirm Save'}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
