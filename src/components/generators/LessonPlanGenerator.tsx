import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Save, Download, RefreshCw, FileText, ChevronLeft, ChevronRight, CheckCircle, Users, Layout, AlignLeft, Layers, GraduationCap, MessageSquare } from 'lucide-react';
import { generateLessonPlan } from '../../lib/gemini';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { saveOffline } from '../../lib/indexedDB';
import { db } from '../../lib/firebase';
import { useAuth } from '../../contexts/AuthContext';
import { cn } from '../../lib/utils';
import { SafeMarkdown } from '../common/SafeMarkdown';
import 'highlight.js/styles/github.css';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { 
  subjects, 
  levels, 
  CLASSES_BY_LEVEL, 
  SUBJECT_STRANDS, 
  SUBJECT_SUB_STRANDS, 
  SUB_STRAND_STANDARDS, 
  STANDARD_INDICATORS,
  SCIENCE_B7_LESSON_FRAMES,
  SCIENCE_B8_LESSON_FRAMES,
  SCIENCE_B9_LESSON_FRAMES,
  MATH_B7_LESSON_FRAMES,
  ENGLISH_B7_LESSON_FRAMES,
  ENGLISH_B1_B6_LESSON_FRAMES,
  FRENCH_B4_B6_LESSON_FRAMES,
  GHANAIAN_LANGUAGE_B1_B3_LESSON_FRAMES,
  KG_INTEGRATED_LESSON_FRAMES,
  MATH_B1_B3_LESSON_FRAMES,
  MATH_B4_B6_LESSON_FRAMES,
  OWOP_B1_B3_LESSON_FRAMES,
  OWOP_B4_B6_LESSON_FRAMES,
  PE_LESSON_FRAMES,
  RME_LESSON_FRAMES,
  subjectsByLevel
} from '../../constants';
import { SearchableDropdown } from '../ui/SearchableDropdown';

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

const LessonPlanGenerator = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [result, setResult] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    level: 'JHS',
    class: 'Basic 7',
    subject: 'English',
    ghanaianLanguage: '',
    strand: '',
    subStrand: '',
    contentStandard: '',
    indicator: '',
    mainObjective: '',
    duration: '60 minutes',
    classSize: '40',
    weekEnding: new Date().toISOString().split('T')[0],
    locality: 'Urban',
    specificLocality: profile?.town || '',
    differentiationStrategies: '',
    customGuidance: '',
    layoutStyle: 'comprehensive' as 'minimalist' | 'comprehensive' | 'primary-focused',
    language: 'English',
    bilingualLanguage: 'Twi',
  });
  
  const displaySubject = formData.subject === 'Ghanaian Language' && formData.ghanaianLanguage
    ? `Ghanaian Language (${formData.ghanaianLanguage})`
    : formData.subject;

  // Automatically use the indicator as the main learning objective when selected
  React.useEffect(() => {
    if (formData.indicator) {
      const parts = formData.indicator.split(':');
      const text = parts.length > 1 ? parts.slice(1).join(':').trim() : formData.indicator.trim();
      if (text) {
        const formattedText = text.charAt(0).toUpperCase() + text.slice(1);
        setFormData(prev => ({
          ...prev,
          mainObjective: `By the end of the lesson, the learner will be able to: ${formattedText}`
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        mainObjective: ''
      }));
    }
  }, [formData.indicator]);

  const validateStep = (currentStep: number) => {
    const newErrors: Record<string, string> = {};

    if (currentStep === 1) {
      if (!formData.level) newErrors.level = "Required";
      if (!formData.class) newErrors.class = "Required";
      if (!formData.subject) newErrors.subject = "Required";
      if (formData.subject === 'Ghanaian Language' && !formData.ghanaianLanguage) {
        newErrors.ghanaianLanguage = "Select a language";
      }
      if (!formData.classSize || parseInt(formData.classSize) <= 0) newErrors.classSize = "Invalid size";
      if (!formData.weekEnding) newErrors.weekEnding = "Required";
    }

    if (currentStep === 2) {
      if (!formData.locality) newErrors.locality = "Required";
      if (!formData.duration) newErrors.duration = "Required";
    }

    if (currentStep === 3) {
      if (!formData.strand) newErrors.strand = "Required";
      if (!formData.subStrand) newErrors.subStrand = "Required";
      if (!formData.contentStandard) newErrors.contentStandard = "Required";
      if (!formData.indicator) newErrors.indicator = "Required";
      if (!formData.mainObjective || formData.mainObjective.length < 10) {
        newErrors.mainObjective = "Please provide a detailed objective (min 10 chars)";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(step)) {
      setStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    setStep(prev => prev - 1);
  };

  // Helpers for context-aware lookup and fallbacks
  const getSubjectStrands = (subj: string, lvl: string) => {
    if (subj === 'English' && lvl === 'JHS') {
      return ["Oral Language", "Reading", "Grammar Usage", "Writing", "Literature"];
    }
    if (subj === 'Ghanaian Language' && lvl === 'JHS') {
      return ["Customs and Institutions", "Listening and Speaking", "Reading", "Language and Usage", "Composition Writing", "Literature"];
    }
    if (subj === 'History' && lvl === 'SHS') {
      return ["Historical Inquiry and Writing", "States and Societies in Pre-Colonial Times", "Age of Encounter and Exchanges Up to the 20th Century", "Independence and Post-Colonial Developments"];
    }
    if (subj === 'Mathematics' && lvl === 'SHS') {
      return ["Numbers for everyday life", "Algebraic Thinking", "Geometry around us", "Making sense of and using data"];
    }
    if (subj === 'Physical Education' && lvl === 'SHS') {
      return ["Physical Activity and Health"];
    }
    return SUBJECT_STRANDS[subj] || [];
  };

  const getLookupStrand = (subject: string, strand: string) => {
    if (subject === 'Our World Our People') {
      if (strand === 'All Around Us') return 'All Around Us OWOP';
      if (strand === 'My Global Community') return 'My Global Community OWOP';
    }
    if (subject === 'English' && formData.level === 'JHS') {
      return `${strand} JHS`;
    }
    if (subject === 'Ghanaian Language' && formData.level === 'JHS') {
      if (strand === 'Listening and Speaking') return "Oral Language (GL)";
      if (strand === 'Reading') return "Reading (GL)";
      if (strand === 'Language and Usage') return "Language and Usage";
      if (strand === 'Literature') return "Literature (GL)";
    }
    return strand;
  };

  const getSubjectSubStrands = (subj: string, strand: string, lvl: string) => {
    if (subj === 'Ghanaian Language' && lvl === 'JHS') {
      if (strand === 'Listening and Speaking') {
        return ["Conversation/Everyday discourse", "Listening Comprehension"];
      }
      if (strand === 'Reading') {
        return ["Reading", "Translation"];
      }
      if (strand === 'Language and Usage') {
        return ["Integrating grammar (nouns, pronouns, adjectives)", "Integrating grammar (verbs, adverbs, conjunctions, postpositions/prepositions)"];
      }
      if (strand === 'Composition Writing') {
        return ["Structure and organise ideas in composition writing"];
      }
      if (strand === 'Literature') {
        return ["Oral and written literature"];
      }
      if (strand === 'Customs and Institutions') {
        return ["Rites of Passage", "Naming Systems", "The Clan System", "Chieftaincy"];
      }
    }
    if (subj === 'Mathematics' && lvl === 'SHS') {
      if (strand === 'Numbers for everyday life') {
        return ["Real number and numeration system", "Proportional reasoning"];
      }
      if (strand === 'Algebraic Thinking' || strand === 'Algebraic Reasoning') {
        return ["Applications of expressions, equations and inequalities", "Patterns and relationships"];
      }
      if (strand === 'Geometry around us') {
        return ["Spatial sense", "Measurement"];
      }
      if (strand === 'Making sense of and using data') {
        return ["Statistical reasoning and its application in real life", "Chance"];
      }
    }
    const lookupStrand = getLookupStrand(subj, strand);
    return SUBJECT_SUB_STRANDS[lookupStrand] || [];
  };

  const getFallbackIndicators = (standard: string): string[] => {
    if (!standard) return [];
    const parts = standard.split(':');
    if (parts.length > 1) {
      const code = parts[0].trim();
      const text = parts.slice(1).join(':').trim();
      return [`${code}.1: Demonstrate and apply dynamic knowledge of: ${text}`];
    }
    return [`${standard}.1: Practice and discuss this core content standard.`];
  };

  // Helper selectors from constants
  const currentStrands = getSubjectStrands(formData.subject, formData.level);
  const lookupStrand = getLookupStrand(formData.subject, formData.strand);
  const currentSubStrands = getSubjectSubStrands(formData.subject, formData.strand, formData.level);
  const currentStandards = (
    SUB_STRAND_STANDARDS[lookupStrand]?.[formData.subStrand] || 
    SUB_STRAND_STANDARDS[formData.strand]?.[formData.subStrand] ||
    SUB_STRAND_STANDARDS[formData.subject]?.[formData.subStrand] ||
    SUB_STRAND_STANDARDS[formData.subject]?.[formData.strand] ||
    []
  );
  const currentIndicators = STANDARD_INDICATORS[formData.contentStandard] || getFallbackIndicators(formData.contentStandard);

  const handleGenerate = async () => {
    if (!validateStep(3)) return;

    setLoading(true);
    try {
      // Find potential curriculum frame for additional guidance
      const indicatorId = formData.indicator.split(':')[0].trim();
      let frameDetails = "";
      
      const allFrames = {
        ...SCIENCE_B7_LESSON_FRAMES,
        ...SCIENCE_B8_LESSON_FRAMES,
        ...SCIENCE_B9_LESSON_FRAMES,
        ...MATH_B7_LESSON_FRAMES,
        ...ENGLISH_B7_LESSON_FRAMES,
        ...ENGLISH_B1_B6_LESSON_FRAMES,
        ...FRENCH_B4_B6_LESSON_FRAMES,
        ...GHANAIAN_LANGUAGE_B1_B3_LESSON_FRAMES,
        ...KG_INTEGRATED_LESSON_FRAMES,
        ...MATH_B1_B3_LESSON_FRAMES,
        ...MATH_B4_B6_LESSON_FRAMES,
        ...OWOP_B1_B3_LESSON_FRAMES,
        ...OWOP_B4_B6_LESSON_FRAMES,
        ...PE_LESSON_FRAMES,
        ...RME_LESSON_FRAMES
      };

      const foundFrame = allFrames[indicatorId];
      if (foundFrame) {
        frameDetails = `
        LESSON FRAME CONTEXT (From Official Document):
        - Approved Topic: ${foundFrame.topic}
        - Key Activities to Include: ${foundFrame.activities.join(', ')}
        - Mandatory Key Words: ${foundFrame.keyWords.join(', ')}
        - Suggested TLRs: ${foundFrame.resources.join(', ')}
        `;
      }

      let layoutStyleInstruction = "";
      if (formData.layoutStyle === 'minimalist') {
        layoutStyleInstruction = "LAYOUT STYLE REQUIREMENT (MINIMALIST): Please make the lesson plan highly condensed, high-density, and concise. Prioritize compact descriptions and brief bullet points for rapid classroom referencing. Keep Phase 1 (Starter), Phase 2 (Main), and Phase 3 (Plenary) activities clear, brief, direct, and to-the-point.";
      } else if (formData.layoutStyle === 'primary-focused') {
        layoutStyleInstruction = "LAYOUT STYLE REQUIREMENT (PRIMARY-FOCUSED): Please tailor the lesson plan specifically for early childhood or primary learners (play-centered). Highlight tactile, concrete manipulatives, highly collaborative activities, physical learning games, and interactive group participation. Phase 2 (Main) must be active and play-centered with gamified teacher checking.";
      } else {
        layoutStyleInstruction = "LAYOUT STYLE REQUIREMENT (COMPREHENSIVE): Please write a deeply detailed, highly structured, and extensive instructional roadmap. Detail complete step-by-step teacher and learner actions. Ensure core competencies, formative checkpoint milestones, rich teaching/learning resources, and references are fully elaborated.";
      }

      const prompt = `Generate a NaCCA-compliant lesson plan for ${formData.class} (${formData.level}) ${displaySubject} strictly following the Standard-Based Curriculum (SBC). 
      Strand: ${formData.strand}.
      Sub-Strand: ${formData.subStrand}.
      Content Standard: ${formData.contentStandard}.
      Indicator: ${formData.indicator}.
      Main Objective: ${formData.mainObjective}.
      Duration: ${formData.duration}.
      Class Size: ${formData.classSize} learners.
      Week Ending: ${formData.weekEnding}.
      Locality: ${formData.locality} (${formData.specificLocality}). 
      
      ${frameDetails}

      LAYOUT GUIDELINE: ${layoutStyleInstruction}

      TAILORING INSTRUCTION: Consider the resources typically available in a ${formData.locality} setting in Ghana. If ${formData.locality} is Rural, suggest low-cost, locally available teaching and learning materials.
      
      DIFFERENTIATION INSTRUCTION: ${formData.differentiationStrategies || 'Plan for diverse learning needs including struggling and advanced learners.'}
      
      ${formData.customGuidance ? `Custom Guidance for AI: ${formData.customGuidance}` : ''}`;
      
      const data = await generateLessonPlan(prompt, { 
        school: profile?.school, 
        district: profile?.district,
        town: formData.specificLocality || profile?.town,
        region: profile?.region,
        isBstemSchool: profile?.isBstemSchool
      }, formData.language, formData.bilingualLanguage);
      
      setResult(data);
      setStep(4);
    } catch (err) {
      console.error(err);
      alert("Failed to generate lesson plan. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!result || !user) return;
    setSaving(true);

    const payload = {
      ...result,
      authorId: user.uid,
      level: formData.level,
      class: formData.class,
      subject: displaySubject,
      locality: formData.locality,
      strand: formData.strand,
      subStrand: formData.subStrand,
      contentStandard: formData.contentStandard,
      indicator: formData.indicator,
      createdAt: new Date().toISOString()
    };

    try {
      const isOnline = navigator.onLine;
      let docRefId = '';
      
      if (isOnline) {
        try {
          const docRef = await addDoc(collection(db, 'lessonPlans'), {
            ...payload,
            createdAt: serverTimestamp()
          });
          docRefId = docRef.id;
        } catch (firebaseErr) {
          console.warn("Firebase save failed, falling back to local DB only.", firebaseErr);
        }
      }

      await saveOffline('lessonPlans', { ...payload, id: docRefId || undefined }, !!docRefId);

      if (docRefId) {
        alert('Lesson plan saved successfully to your cloud library and cached offline! 🇬🇭');
      } else {
        alert('Lesson plan saved locally to your offline cabinet! TeachSmartGH will synchronize it once a stable connection is restored. 🇬🇭');
      }
    } catch (err) {
      console.error("Failed to save lesson plan fully:", err);
      try {
        await saveOffline('lessonPlans', payload, false);
        alert('Saved locally! Your lesson plan has been stored offline because of network fluctuations. 🇬🇭');
      } catch (offlineErr) {
        console.error("Local save fallback also failed:", offlineErr);
        alert('Failed to save. Storage is locked or your browser lacks IndexedDB permissions.');
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDownloadPDF = () => {
    if (!result) return;
    const doc = new jsPDF();
    
    // Choose theme colors based on layoutStyle
    let primaryColor = [0, 28, 61];     // Deep Blue
    let accentColor = [252, 209, 22];   // Ghana Gold
    let tableHeadColor = [0, 107, 63];   // Ghana Green
    let labelText = 'OFFICIAL NaCCA CURRICULUM COMPLIANT LESSON PLAN';
    
    if (formData.layoutStyle === 'minimalist') {
      primaryColor = [71, 85, 105];       // Slate 600
      accentColor = [203, 213, 225];      // Slate 300
      tableHeadColor = [100, 116, 139];   // Slate 500
      labelText = 'MINIMALIST SCHEME - CONCISE LESSON PLAN REFERENCE';
    } else if (formData.layoutStyle === 'primary-focused') {
      primaryColor = [217, 119, 6];       // Amber 600
      accentColor = [252, 211, 77];       // Amber 300
      tableHeadColor = [245, 158, 11];    // Amber 500
      labelText = '🎈 PRIMARY-GRADE PLAY-BASED LESSON PLAN (KG-B6) 🎒';
    }
    
    // Custom Header Branding
    doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.rect(0, 0, 210, 40, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('TEACHSMART GHANA', 105, 18, { align: 'center' });
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(labelText, 105, 26, { align: 'center' });
    
    doc.setDrawColor(accentColor[0], accentColor[1], accentColor[2]);
    doc.setLineWidth(1);
    doc.line(40, 32, 170, 32);

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(9);
    doc.text(`CLASS: ${formData.class.toUpperCase()} (${formData.level}) | SUBJECT: ${displaySubject.toUpperCase()} | LOCALITY: ${formData.locality.toUpperCase()} | TEMPLATE: ${formData.layoutStyle.toUpperCase()}`, 105, 48, { align: 'center' });
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(`${formData.strand} - ${formData.subStrand}`.toUpperCase(), 105, 56, { align: 'center' });

    const tableData = [
      ['Week Ending', result.weekEnding || formData.weekEnding],
      ['Class Size', result.classSize || formData.classSize],
      ['Locality', formData.locality + (formData.specificLocality ? ` (${formData.specificLocality})` : '')],
      ['Strand', formData.strand],
      ['Sub-Strand', formData.subStrand],
      ['Content Standard', formData.contentStandard],
      ['Indicator', formData.indicator],
      ['Primary Objective', formData.mainObjective || result.performanceIndicator],
      ['Core Competencies', result.coreCompetencies],
      ['Key Words', result.keyWords],
      ['Teaching & Learning Resources (TLRs)', result.tlrs],
      ['References', result.references],
      ['Phase 1: Starter', result.phase1],
      ['Phase 2: Main', result.phase2],
      ['Phase 3: Plenary / Reflections', result.phase3],
      ['Differentiation (Struggling)', result.differentiation?.strugglingLearners?.activities],
      ['Differentiation (Advanced)', result.differentiation?.advancedLearners?.activities],
    ];

    autoTable(doc, {
      startY: 65,
      head: [['Curriculum Component', 'Details & Activities']],
      body: tableData,
      theme: 'grid',
      headStyles: { 
        fillColor: tableHeadColor as any,
        textColor: [255, 255, 255],
        fontSize: 10,
        fontStyle: 'bold'
      },
      columnStyles: {
        0: { cellWidth: 50, fontStyle: 'bold', fillColor: [245, 245, 245] },
        1: { cellWidth: 'auto' }
      },
      styles: {
        fontSize: 9,
        lineColor: [200, 200, 200],
        lineWidth: 0.1,
      },
      didDrawPage: (data) => {
        const pageCount = doc.getNumberOfPages();
        const pageSize = doc.internal.pageSize;
        const pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight();
        
        // Footer Line
        doc.setDrawColor(200, 200, 200);
        doc.setLineWidth(0.5);
        doc.line(10, pageHeight - 20, 200, pageHeight - 20);

        // Compliance Footer
        doc.setFontSize(7);
        doc.setTextColor(100);
        doc.setFont('helvetica', 'italic');
        const complianceMsg = [
          'NaCCA COMPLIANCE NOTE: This lesson plan is structured based on the Standard-Based Curriculum (SBC) framework as mandated by the National Council for Curriculum and Assessment (NaCCA) Ghana.',
          'Teachers are encouraged to adapt the content to suit their learner\'s diverse needs while maintaining core competency targets and SBC learning indicators.',
          'Verification of specific indicators against official NaCCA curriculum handbooks is strongly recommended for classroom fidelity.'
        ];
        
        let footerY = pageHeight - 16;
        complianceMsg.forEach(msg => {
          doc.text(msg, 105, footerY, { align: 'center' });
          footerY += 3.5;
        });
        
        // Brand Mark
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(0, 107, 63); // Green
        doc.text('TEACHSMART GHANA • AI-POWERED NaCCA COMPLIANT TOOLS', 10, pageHeight - 5);
        
        // Page Numbering
        doc.setTextColor(150);
        doc.setFont('helvetica', 'normal');
        doc.text(`Page ${pageCount}`, 200, pageHeight - 5, { align: 'right' });
      }
    });

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').replace('T', '_').slice(0, 19);
    const filename = `${displaySubject}_${formData.strand}_${formData.subStrand}_LessonPlan_${timestamp}`.replace(/[\s\W]+/g, '_');
    doc.save(`${filename}.pdf`);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div>
           <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
             <div className="w-2 h-8 bg-ghana-gold rounded-full" />
             Lesson Plan Wizard
           </h1>
           <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-2 ml-5">Standard-Based Curriculum assistant</p>
        </div>
        
        {/* Progress Tracker */}
        <div className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
           {[
             { step: 1, label: 'Data', icon: FileText },
             { step: 2, label: 'Context', icon: Users },
             { step: 3, label: 'Curriculum', icon: Sparkles },
             { step: 4, label: 'Review', icon: CheckCircle },
           ].map((s, idx) => (
             <React.Fragment key={s.step}>
               <div className="flex flex-col items-center gap-1 group">
                 <div className={cn(
                   "w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300",
                   step === s.step ? "bg-ghana-red text-white shadow-lg shadow-ghana-red/20 scale-110" : 
                   step > s.step ? "bg-emerald-500 text-white" : "bg-slate-50 text-slate-300"
                 )}>
                   {step > s.step ? <CheckCircle size={18} /> : <s.icon size={18} />}
                 </div>
                 <span className={cn(
                   "text-[9px] font-black uppercase tracking-tighter",
                   step === s.step ? "text-ghana-red" : "text-slate-400"
                 )}>{s.label}</span>
               </div>
               {idx < 3 && (
                 <div className={cn(
                   "w-8 h-0.5 rounded-full",
                   step > s.step ? "bg-emerald-500" : "bg-slate-100"
                 )} />
               )}
             </React.Fragment>
           ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100"
          >
            <h2 className="text-xl font-bold mb-6">Step 1: Academic Data</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-500 uppercase">Educational Stage</label>
                <select 
                  className={cn("input-field", errors.level && "border-red-400 ring-4 ring-red-50")}
                  value={formData.level}
                  onChange={(e) => {
                    const newLvl = e.target.value;
                    const newClasses = CLASSES_BY_LEVEL[newLvl] || [];
                    const levelSubjects = subjectsByLevel[newLvl] || [];
                    const currentSubj = formData.subject;
                    const newSubj = levelSubjects.includes(currentSubj) ? currentSubj : '';
                    setFormData({
                      ...formData,
                      level: newLvl,
                      class: newClasses[0] || '',
                      subject: newSubj,
                      ghanaianLanguage: newSubj === 'Ghanaian Language' ? formData.ghanaianLanguage : '',
                      strand: '',
                      subStrand: '',
                      contentStandard: '',
                      indicator: ''
                    });
                  }}
                >
                  {levels.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
                {errors.level && <p className="text-[10px] text-red-500 font-bold uppercase tracking-wider">{errors.level}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-500 uppercase">Specific Class (Basic/KG)</label>
                <select 
                  className={cn("input-field", errors.class && "border-red-400 ring-4 ring-red-50")}
                  value={formData.class}
                  onChange={(e) => setFormData({...formData, class: e.target.value})}
                >
                  {(CLASSES_BY_LEVEL[formData.level] || []).map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                {errors.class && <p className="text-[10px] text-red-500 font-bold uppercase tracking-wider">{errors.class}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-500 uppercase">Subject Area</label>
                <SearchableDropdown
                  value={formData.subject}
                  options={formData.level ? (subjectsByLevel[formData.level] || []).slice().sort((a,b) => a.localeCompare(b)) : []}
                  placeholder="Select Subject"
                  error={errors.subject}
                  onChange={(val) => setFormData({
                    ...formData, 
                    subject: val, 
                    ghanaianLanguage: val === 'Ghanaian Language' ? formData.ghanaianLanguage : '', 
                    strand: '', 
                    subStrand: '', 
                    contentStandard: '', 
                    indicator: ''
                  })}
                />
                {errors.subject && <p className="text-[10px] text-red-500 font-bold uppercase tracking-wider">{errors.subject}</p>}
              </div>
              {formData.subject === 'Ghanaian Language' && (
                <div className="space-y-2 animate-fadeIn">
                  <label className="text-sm font-bold text-gray-500 uppercase">Ghanaian Language</label>
                  <select 
                    className={cn("input-field", errors.ghanaianLanguage && "border-red-400 ring-4 ring-red-50")}
                    value={formData.ghanaianLanguage}
                    onChange={(e) => setFormData({...formData, ghanaianLanguage: e.target.value})}
                  >
                    <option value="">Select Language</option>
                    {GHANAIAN_LANGUAGES.slice().sort((a,b) => a.localeCompare(b)).map(lang => (
                      <option key={lang} value={lang}>{lang}</option>
                    ))}
                  </select>
                  {errors.ghanaianLanguage && <p className="text-[10px] text-red-500 font-bold uppercase tracking-wider">{errors.ghanaianLanguage}</p>}
                </div>
              )}
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-500 uppercase">Instructional Language</label>
                <select 
                  className="input-field"
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
                  <label className="text-sm font-bold text-gray-500 uppercase">Bilingual Ghanaian Language</label>
                  <select 
                    className="input-field"
                    value={formData.bilingualLanguage}
                    onChange={(e) => setFormData({...formData, bilingualLanguage: e.target.value})}
                  >
                    {GHANAIAN_LANGUAGES_FOR_BILINGUAL.map(lang => (
                      <option key={lang} value={lang}>{lang}</option>
                    ))}
                  </select>
                </div>
              )}
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-500 uppercase">Class Size</label>
                <input 
                  type="number"
                  className={cn("input-field", errors.classSize && "border-red-400 ring-4 ring-red-50")}
                  placeholder="Number of learners"
                  value={formData.classSize}
                  onChange={(e) => setFormData({...formData, classSize: e.target.value})}
                />
                {errors.classSize && <p className="text-[10px] text-red-500 font-bold uppercase tracking-wider">{errors.classSize}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-500 uppercase">Week Ending Date</label>
                <input 
                  type="date"
                  className={cn("input-field", errors.weekEnding && "border-red-400 ring-4 ring-red-50")}
                  value={formData.weekEnding}
                  onChange={(e) => setFormData({...formData, weekEnding: e.target.value})}
                />
                {errors.weekEnding && <p className="text-[10px] text-red-500 font-bold uppercase tracking-wider">{errors.weekEnding}</p>}
              </div>
            </div>
            <button onClick={nextStep} className="btn-primary mt-8 flex items-center gap-2 group">
              Continue to Step 2
              <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100"
          >
            <h2 className="text-xl font-bold mb-6">Step 2: Environmental Context</h2>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-500 uppercase">Locality Type</label>
                  <select 
                    className={cn("input-field", errors.locality && "border-red-400 ring-4 ring-red-50")}
                    value={formData.locality}
                    onChange={(e) => setFormData({...formData, locality: e.target.value})}
                  >
                    <option value="Urban">Urban (City Center)</option>
                    <option value="Peri-Urban">Peri-Urban / Suburban</option>
                    <option value="Rural">Rural (Limited Resources)</option>
                  </select>
                  {errors.locality && <p className="text-[10px] text-red-500 font-bold uppercase tracking-wider">{errors.locality}</p>}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-500 uppercase">Specific Town/Locality</label>
                  <input 
                    type="text"
                    className="input-field"
                    placeholder="e.g. Madina, Aburi, or Tepa"
                    value={formData.specificLocality}
                    onChange={(e) => setFormData({...formData, specificLocality: e.target.value})}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-500 uppercase">Lesson Duration</label>
                <input 
                  type="text" 
                  className={cn("input-field", errors.duration && "border-red-400 ring-4 ring-red-50")}
                  placeholder="e.g. 60 minutes"
                  value={formData.duration}
                  onChange={(e) => setFormData({...formData, duration: e.target.value})}
                />
                {errors.duration && <p className="text-[10px] text-red-500 font-bold uppercase tracking-wider">{errors.duration}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-500 uppercase tracking-tighter italic text-slate-400">Additional Differentiation Context (Optional)</label>
                <textarea 
                  className="input-field min-h-[80px]" 
                  placeholder="e.g. Include tasks for visually impaired learners, or specific grouping needs..."
                  value={formData.differentiationStrategies}
                  onChange={(e) => setFormData({...formData, differentiationStrategies: e.target.value})}
                />
              </div>

              {/* Template Gallery Selector */}
              <div className="space-y-4 pt-6 border-t border-slate-100">
                <div>
                  <label className="text-sm font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
                    <Layout size={16} className="text-ghana-gold" />
                    NaCCA-Compliant Template Gallery
                  </label>
                  <p className="text-xs text-slate-400 mt-0.5 font-medium">Select a structural layout style suitable for your classroom target.</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    {
                      id: 'minimalist',
                      name: 'Minimalist Theme',
                      badge: 'Compact & Clean',
                      badgeBg: 'bg-slate-100 text-slate-700',
                      icon: AlignLeft,
                      iconColor: 'text-slate-500',
                      description: 'High-density format focusing on objective codes and brief phase descriptions. Perfect for quick referencing by experienced teachers.'
                    },
                    {
                      id: 'comprehensive',
                      name: 'Comprehensive Blueprint',
                      badge: 'Full NaCCA Standard',
                      badgeBg: 'bg-emerald-50 text-emerald-700 border border-emerald-100',
                      icon: Layers,
                      iconColor: 'text-emerald-600',
                      description: 'Elaborated lesson notes with granular step-by-step actions, active strategies, clear competencies, and full references.'
                    },
                    {
                      id: 'primary-focused',
                      name: 'Primary / Play-Based',
                      badge: 'KG to Basic 6 Focus',
                      badgeBg: 'bg-amber-50 text-amber-700 border border-amber-100',
                      icon: GraduationCap,
                      iconColor: 'text-amber-600',
                      description: 'Activity-rich template emphasizing concrete manipulatives, child-centered games, and play-based group activities.'
                    }
                  ].map((tpl) => {
                    const IconComponent = tpl.icon;
                    const isSelected = formData.layoutStyle === tpl.id;
                    return (
                      <div 
                        key={tpl.id}
                        onClick={() => setFormData(prev => ({ ...prev, layoutStyle: tpl.id as any }))}
                        className={cn(
                          "relative cursor-pointer rounded-2xl p-5 border-2 transition-all duration-300 flex flex-col justify-between h-full bg-white select-none hover:shadow-md",
                          isSelected 
                            ? "border-emerald-500 bg-emerald-50/10 shadow-sm shadow-emerald-500/5 scale-[1.02] ring-4 ring-emerald-500/10" 
                            : "border-slate-150 hover:border-slate-300"
                        )}
                      >
                        <div className="space-y-3">
                          <div className="flex items-start justify-between">
                            <div className={cn(
                              "w-10 h-10 rounded-xl flex items-center justify-center bg-slate-50",
                              isSelected && "bg-emerald-50 text-emerald-600"
                            )}>
                              <IconComponent className={cn("w-5 h-5", tpl.iconColor)} />
                            </div>
                            <span className={cn("text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full", tpl.badgeBg)}>
                              {tpl.badge}
                            </span>
                          </div>
                          
                          <div className="space-y-1">
                            <h3 className="font-bold text-sm text-slate-800 flex items-center gap-1.5">
                              {tpl.name}
                              {isSelected && (
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                              )}
                            </h3>
                            <p className="text-[11px] leading-relaxed text-slate-500 font-medium">
                              {tpl.description}
                            </p>
                          </div>
                        </div>
                        
                        <div className="mt-4 pt-3 border-t border-slate-50 flex items-center justify-between">
                          <span className="text-[10px] font-bold text-slate-400">Layout Format</span>
                          <span className={cn(
                            "text-[10px] font-black uppercase tracking-wider",
                            isSelected ? "text-emerald-600" : "text-slate-400"
                          )}>
                            {isSelected ? '✓ Selected' : 'Choose'}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            <div className="flex gap-4 mt-8">
              <button onClick={prevStep} className="px-6 py-3 rounded-xl border border-gray-200 font-bold hover:bg-gray-50 text-slate-500 flex items-center gap-2">
                <ChevronLeft size={20} />
                Back
              </button>
              <button onClick={nextStep} className="btn-primary flex-1 flex items-center justify-center gap-2 group">
                Continue to Curriculum Tuning
                <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100"
          >
             <h2 className="text-xl font-bold mb-6">Step 3: Curriculum Calibration</h2>
             <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="space-y-2">
                       <label className="text-sm font-bold text-gray-500 uppercase">NaCCA Strand</label>
                       {currentStrands.length > 0 ? (
                         <select 
                           className={cn("input-field", errors.strand && "border-red-400 ring-4 ring-red-50")}
                           value={formData.strand}
                           onChange={(e) => setFormData({...formData, strand: e.target.value, subStrand: '', contentStandard: '', indicator: ''})}
                         >
                           <option value="">Select Strand...</option>
                           {currentStrands.map(s => <option key={s} value={s}>{s}</option>)}
                         </select>
                       ) : (
                         <input 
                           type="text" 
                           placeholder="Enter Strand (e.g. Geometry)"
                           className={cn("input-field", errors.strand && "border-red-400 ring-4 ring-red-50")}
                           value={formData.strand}
                           onChange={(e) => setFormData({...formData, strand: e.target.value})}
                         />
                       )}
                       {errors.strand && <p className="text-[10px] text-red-500 font-bold uppercase tracking-wider">{errors.strand}</p>}
                   </div>
                   <div className="space-y-2">
                       <label className="text-sm font-bold text-gray-500 uppercase">Sub-Strand</label>
                       {currentSubStrands.length > 0 ? (
                         <select 
                           className={cn("input-field", errors.subStrand && "border-red-400 ring-4 ring-red-50")}
                           value={formData.subStrand}
                           onChange={(e) => setFormData({...formData, subStrand: e.target.value, contentStandard: '', indicator: ''})}
                         >
                           <option value="">Select Sub-Strand...</option>
                           {currentSubStrands.map(ss => <option key={ss} value={ss}>{ss}</option>)}
                         </select>
                       ) : (
                         <input 
                           type="text" 
                           placeholder="Enter Sub-Strand (e.g. Fractions)"
                           className={cn("input-field", errors.subStrand && "border-red-400 ring-4 ring-red-50")}
                           value={formData.subStrand}
                           onChange={(e) => setFormData({...formData, subStrand: e.target.value})}
                         />
                       )}
                       {errors.subStrand && <p className="text-[10px] text-red-500 font-bold uppercase tracking-wider">{errors.subStrand}</p>}
                   </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-slate-50">
                  <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-500 uppercase">Content Standard</label>
                      {currentStandards.length > 0 ? (
                        <select 
                          className={cn("input-field", errors.contentStandard && "border-red-400 ring-4 ring-red-50")}
                          value={formData.contentStandard}
                          onChange={(e) => setFormData({...formData, contentStandard: e.target.value, indicator: ''})}
                        >
                          <option value="">Select Content Standard...</option>
                          {currentStandards.map(cs => <option key={cs} value={cs}>{cs}</option>)}
                        </select>
                      ) : (
                        <input 
                          type="text" 
                          placeholder="e.g. B7.1.1.1: Count, read, and write..."
                          className={cn("input-field", errors.contentStandard && "border-red-400 ring-4 ring-red-50")}
                          value={formData.contentStandard}
                          onChange={(e) => setFormData({...formData, contentStandard: e.target.value})}
                        />
                      )}
                      {errors.contentStandard && <p className="text-[10px] text-red-500 font-bold uppercase tracking-wider">{errors.contentStandard}</p>}
                  </div>

                  <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-500 uppercase">Indicator</label>
                      {currentIndicators.length > 0 ? (
                        <select 
                          className={cn("input-field", errors.indicator && "border-red-400 ring-4 ring-red-50")}
                          value={formData.indicator}
                          onChange={(e) => setFormData({...formData, indicator: e.target.value})}
                        >
                          <option value="">Select Indicator...</option>
                          {currentIndicators.map(ind => <option key={ind} value={ind}>{ind}</option>)}
                        </select>
                      ) : (
                        <input 
                          type="text" 
                          placeholder="e.g. B7.1.1.1.1: Use place value to count"
                          className={cn("input-field", errors.indicator && "border-red-400 ring-4 ring-red-50")}
                          value={formData.indicator}
                          onChange={(e) => setFormData({...formData, indicator: e.target.value})}
                        />
                      )}
                      {errors.indicator && <p className="text-[10px] text-red-500 font-bold uppercase tracking-wider">{errors.indicator}</p>}
                  </div>
                </div>

                <div className="space-y-2 pt-4 border-t border-slate-50">
                    <label className="text-sm font-bold text-gray-500 uppercase tracking-tighter">Main Learning Objective</label>
                    <textarea 
                      className={cn("input-field min-h-[100px]", errors.mainObjective && "border-red-400 ring-4 ring-red-50")}
                      placeholder="e.g. By the end of the lesson, learners will be able to add two proper fractions with same denominators manually."
                      value={formData.mainObjective}
                      onChange={(e) => setFormData({...formData, mainObjective: e.target.value})}
                    />
                    {errors.mainObjective && <p className="text-[10px] text-red-500 font-bold uppercase tracking-wider">{errors.mainObjective}</p>}
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-400 uppercase text-[10px]">Custom Guidance (Optional)</label>
                    <textarea 
                      className="input-field min-h-[80px] text-sm" 
                      placeholder="e.g., Focus on inclusive learning for special needs students, or prioritize hands-on experiments from the local environment."
                      value={formData.customGuidance}
                      onChange={(e) => setFormData({...formData, customGuidance: e.target.value})}
                    />
                </div>
             </div>
             <div className="flex gap-4 mt-8">
                <button onClick={prevStep} className="px-6 py-3 rounded-xl border border-gray-200 font-bold hover:bg-gray-50 text-slate-500 flex items-center gap-2">
                  <ChevronLeft size={20} />
                  Back
                </button>
                <button 
                  onClick={handleGenerate} 
                  disabled={loading}
                  className="btn-primary flex-1 flex items-center justify-center gap-2 shadow-lg shadow-ghana-red/20 active:scale-95 transition-all"
                >
                  {loading ? (
                    <RefreshCw className="animate-spin" size={20} />
                  ) : (
                    <Sparkles size={20} />
                  )}
                  {loading ? "Crafting Lesson Plan..." : "Generate Final Plan"}
                </button>
             </div>
          </motion.div>
        )}

        {step === 4 && result && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6"
          >
            <div className="flex flex-col md:flex-row gap-4 sticky top-20 lg:top-4 z-20 shadow-2xl p-4 bg-slate-900 rounded-[2rem] border border-white/10 ring-4 ring-slate-900/10">
              <div className="flex-1 flex items-center gap-3 px-4">
                <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-white">
                  <CheckCircle size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Lesson Generated</p>
                  <p className="text-white font-bold text-sm truncate max-w-[200px]">{result.title}</p>
                </div>
              </div>
              
              <div className="flex gap-2 p-1 bg-white/5 rounded-2xl flex-wrap sm:flex-nowrap">
                <button 
                  onClick={() => setStep(3)} 
                  className="px-6 py-3 bg-white/10 text-white rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-white/20 transition-all flex items-center gap-2"
                >
                  <RefreshCw size={14} />
                  Re-generate
                </button>
                <button 
                  onClick={handleSave} 
                  disabled={saving}
                  className="px-6 py-3 bg-blue-600 text-white rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-blue-700 transition-all flex items-center gap-2 shadow-lg shadow-blue-600/20"
                >
                  <Save size={14} />
                  {saving ? "Saving..." : "Save Cloud"}
                </button>
                <button 
                  onClick={handleDownloadPDF} 
                  className="px-8 py-3 bg-emerald-500 text-white rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-emerald-600 transition-all border-none flex items-center gap-2 shadow-lg shadow-emerald-500/20"
                >
                  <Download size={14} />
                  Download PDF Now
                </button>
                <a 
                  href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                    `Hi colleague! I generated a high-quality, NaCCA curriculum-aligned lesson plan for *${displaySubject}* (${formData.class}) using *TeachSmartGH* by Catalyst Creative.\n\n*Lesson Plan Details:*\n- Subject: ${displaySubject}\n- Class: ${formData.class}\n- Strand: ${formData.strand || "N/A"}\n- Sub-Strand: ${formData.subStrand || "N/A"}\n- Indicator: ${formData.indicator || "N/A"}\n\nJoin me in using AI-powered tools for smarter teaching at: ${window.location.origin}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 bg-[#25D366] text-white rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-[#20ba59] transition-all flex items-center gap-2 shadow-lg shadow-green-500/10 cursor-pointer"
                >
                  <MessageSquare size={14} />
                  WhatsApp
                </a>
              </div>
            </div>

            {/* Quick Layout Preview Switcher */}
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-sm">
              <div className="flex items-center gap-2 pl-2">
                <Layout size={16} className="text-emerald-750 font-bold" />
                <span className="text-xs font-bold text-slate-700">Preview Layout Theme Style:</span>
              </div>
              <div className="flex bg-white p-1 rounded-xl border border-slate-150 gap-1 self-start md:self-auto">
                {[
                  { id: 'minimalist', name: 'Minimalist Format', icon: AlignLeft },
                  { id: 'comprehensive', name: 'Comprehensive Blueprint', icon: Layers },
                  { id: 'primary-focused', name: 'Primary/Play-grade', icon: GraduationCap }
                ].map(opt => {
                  const Icon = opt.icon;
                  const isActive = formData.layoutStyle === opt.id;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => setFormData(p => ({ ...p, layoutStyle: opt.id as any }))}
                      className={cn(
                        "px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all",
                        isActive 
                          ? "bg-slate-900 text-white shadow-sm" 
                          : "text-slate-500 hover:text-slate-800 hover:bg-slate-100"
                      )}
                    >
                      <Icon size={14} />
                      {opt.name}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* MINIMALIST THEME PREVIEW */}
            {formData.layoutStyle === 'minimalist' && (
              <div className="bg-white p-6 lg:p-8 rounded-2xl shadow-sm border border-slate-200 space-y-6">
                {/* Header */}
                <div className="border-b pb-4 border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-[10px] font-black tracking-widest uppercase text-slate-400">NaCCA Minimalist Layout</span>
                    <h2 className="text-xl font-black text-slate-800 tracking-tight mt-0.5">{result.title}</h2>
                  </div>
                  <div className="flex flex-wrap gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    <span className="bg-slate-50 px-2 py-1 rounded">{formData.class}</span>
                    <span className="bg-slate-50 px-2 py-1 rounded">{displaySubject}</span>
                    <span className="bg-slate-50 px-2 py-1 rounded">Week {result.weekEnding || formData.weekEnding}</span>
                  </div>
                </div>

                {/* Metadata Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-lg text-xs leading-relaxed">
                  <div>
                    <span className="font-bold text-slate-400 block uppercase text-[9px] tracking-wider">Strand</span>
                    <span className="text-slate-700 font-medium">{result.strand || formData.strand}</span>
                  </div>
                  <div>
                    <span className="font-bold text-slate-400 block uppercase text-[9px] tracking-wider">Sub-Strand</span>
                    <span className="text-slate-700 font-medium">{result.subStrand || formData.subStrand}</span>
                  </div>
                  <div>
                    <span className="font-bold text-slate-400 block uppercase text-[9px] tracking-wider">Indicator Code</span>
                    <span className="text-slate-700 font-medium font-mono">{result.indicatorCode || formData.indicator.split(':')[0]}</span>
                  </div>
                  <div>
                    <span className="font-bold text-slate-400 block uppercase text-[9px] tracking-wider">Primary Objective</span>
                    <span className="text-slate-700 font-medium line-clamp-2">{formData.mainObjective || result.performanceIndicator}</span>
                  </div>
                </div>

                {/* Core Notes & References inline */}
                <div className="grid md:grid-cols-3 gap-4 text-xs">
                  <div className="border border-slate-100 p-3 rounded">
                    <span className="font-bold text-slate-400 block uppercase text-[9px] mb-1">Competencies</span>
                    <p className="text-slate-600 line-clamp-3">{result.coreCompetencies}</p>
                  </div>
                  <div className="border border-slate-100 p-3 rounded">
                    <span className="font-bold text-slate-400 block uppercase text-[9px] mb-1">Keywords</span>
                    <p className="text-slate-600 line-clamp-3">{result.keyWords}</p>
                  </div>
                  <div className="border border-slate-100 p-3 rounded text-slate-600">
                    <span className="font-bold text-slate-400 block uppercase text-[9px] mb-1">Resources & Refs</span>
                    <p className="line-clamp-2"><strong>TLR:</strong> {result.tlrs}</p>
                    <p className="line-clamp-1"><strong>Refs:</strong> {result.references}</p>
                  </div>
                </div>

                {/* Phases */}
                <div className="space-y-4 pt-4 border-t border-slate-150">
                  <section className="text-xs">
                    <span className="font-black text-slate-700 uppercase tracking-widest block mb-1 border-l-2 border-slate-500 pl-2">Phase 1: Starter (10 min)</span>
                    <div className="prose prose-xs max-w-none text-slate-600 pl-2 text-xs">
                      <SafeMarkdown>{result.phase1}</SafeMarkdown>
                    </div>
                  </section>
                  <section className="text-xs pt-3 border-t border-slate-100">
                    <span className="font-black text-slate-700 uppercase tracking-widest block mb-1 border-l-2 border-slate-500 pl-2">Phase 2: Main (40 min)</span>
                    <div className="prose prose-xs max-w-none text-slate-600 pl-2 text-xs">
                      <SafeMarkdown>{result.phase2}</SafeMarkdown>
                    </div>
                  </section>
                  <section className="text-xs pt-3 border-t border-slate-100">
                    <span className="font-black text-slate-700 uppercase tracking-widest block mb-1 border-l-2 border-slate-500 pl-2">Phase 3: Plenary & Reflections (10 min)</span>
                    <div className="prose prose-xs max-w-none text-slate-600 pl-2 text-xs">
                      <SafeMarkdown>{result.phase3}</SafeMarkdown>
                    </div>
                  </section>
                </div>

                {/* Differentiation Badges */}
                {result.differentiation && (
                  <div className="pt-4 border-t border-slate-150 text-xs">
                    <span className="font-bold text-slate-400 block uppercase text-[9px] tracking-wider mb-2">Differentiation Quick Cards</span>
                    <div className="grid md:grid-cols-3 gap-3">
                      <div className="bg-slate-50 p-2.5 rounded">
                        <span className="font-bold text-red-650 uppercase text-[9px] block">Struggling Learners:</span>
                        <p className="text-slate-600 text-[11px] mt-0.5 font-medium">{result.differentiation.strugglingLearners?.activities}</p>
                      </div>
                      <div className="bg-slate-50 p-2.5 rounded">
                        <span className="font-bold text-emerald-650 uppercase text-[9px] block">Average Learners:</span>
                        <p className="text-slate-600 text-[11px] mt-0.5 font-medium">{result.differentiation.averageLearners?.activities}</p>
                      </div>
                      <div className="bg-slate-50 p-2.5 rounded">
                        <span className="font-bold text-blue-650 uppercase text-[9px] block">Advanced Enrichment:</span>
                        <p className="text-slate-600 text-[11px] mt-0.5 font-medium">{result.differentiation.advancedLearners?.activities}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* COMPREHENSIVE THEME PREVIEW */}
            {formData.layoutStyle === 'comprehensive' && (
              <div className="bg-white p-8 lg:p-12 rounded-[2rem] shadow-sm border border-gray-100 space-y-10 ghana-border">
                <div className="text-center border-b pb-8">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-800 text-[10px] border border-emerald-150 rounded-full font-black uppercase tracking-widest mb-4">
                      👑 Standard Comprehensive Layout
                    </div>
                    <h2 className="text-3xl font-black text-emerald-deep mb-2">{result.title}</h2>
                    <div className="flex flex-wrap justify-center gap-4 text-xs font-bold text-slate-400 uppercase tracking-widest mt-4">
                      <span>{formData.class} ({formData.level})</span>
                      <span className="w-1 h-1 bg-slate-300 rounded-full my-auto" />
                      <span>{displaySubject}</span>
                      <span className="w-1 h-1 bg-slate-300 rounded-full my-auto" />
                      <span>Strand: {formData.strand}</span>
                      <span className="w-1 h-1 bg-slate-300 rounded-full my-auto" />
                      <span>Sub-Strand: {formData.subStrand}</span>
                      <span className="w-1 h-1 bg-slate-300 rounded-full my-auto" />
                      <span>Week Ending: {result.weekEnding || formData.weekEnding}</span>
                      <span className="w-1 h-1 bg-slate-300 rounded-full my-auto" />
                      <span>Class Size: {result.classSize || formData.classSize}</span>
                      <span className="w-1 h-1 bg-slate-300 rounded-full my-auto" />
                      <span>Locality: {formData.locality}</span>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                   <div className="space-y-6">
                      {result.strand && (
                        <section>
                          <h3 className="text-[10px] font-black text-ghana-red uppercase tracking-widest mb-2">Strand</h3>
                          <p className="text-slate-700 leading-relaxed font-semibold">{result.strand}</p>
                        </section>
                      )}
                      {result.subStrand && (
                        <section>
                          <h3 className="text-[10px] font-black text-ghana-red uppercase tracking-widest mb-2">Sub-Strand</h3>
                          <p className="text-slate-700 leading-relaxed font-medium">{result.subStrand}</p>
                        </section>
                      )}
                      <section>
                        <h3 className="text-[10px] font-black text-emerald-deep uppercase tracking-widest mb-2">Indicator (Selected)</h3>
                        <p className="text-slate-700 text-sm leading-relaxed font-medium">{formData.indicator}</p>
                      </section>
                      <section>
                        <h3 className="text-[10px] font-black text-emerald-deep uppercase tracking-widest mb-2">Content Standard (Selected)</h3>
                        <p className="text-slate-700 text-sm leading-relaxed font-medium">{formData.contentStandard}</p>
                      </section>
                   </div>
                   <div className="bg-slate-50 p-6 rounded-3xl space-y-6">
                      <section>
                        <h3 className="text-[10px] font-black text-emerald-deep uppercase tracking-widest mb-2">Performance Indicator</h3>
                        <p className="text-slate-700 text-sm leading-relaxed">{result.performanceIndicator}</p>
                      </section>
                      <section>
                        <h3 className="text-[10px] font-black text-emerald-deep uppercase tracking-widest mb-2">Core Competencies</h3>
                        <p className="text-slate-700 text-sm leading-relaxed">{result.coreCompetencies}</p>
                      </section>
                      <section>
                        <h3 className="text-[10px] font-black text-emerald-deep uppercase tracking-widest mb-2">Key Words</h3>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {result.keyWords?.split(',').map((word: string, i: number) => (
                            <span key={i} className="px-2 py-1 bg-white border border-slate-200 rounded text-[10px] font-medium text-slate-600">
                              {word.trim()}
                            </span>
                          ))}
                        </div>
                      </section>
                   </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8 pt-6 border-t border-slate-100">
                   <section>
                      <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">T.L.R.(s)</h3>
                      <p className="text-slate-600 text-sm italic">{result.tlrs}</p>
                   </section>
                   <section>
                      <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">References</h3>
                      <p className="text-slate-600 text-sm italic">{result.references}</p>
                   </section>
                </div>

                <div className="space-y-8">
                  <section className="bg-emerald-50/30 p-8 rounded-3xl border border-emerald-100 group transition-all hover:bg-emerald-50/50">
                    <h3 className="text-lg font-bold flex items-center gap-3 mb-6 text-emerald-deep">
                      <div className="w-1.5 h-6 bg-ghana-gold rounded-full" />
                      Phase 1: Starter
                      <span className="text-[10px] font-medium text-emerald-600 opacity-60 ml-2 uppercase">(Preparing the brain for learning)</span>
                    </h3>
                    <div className="markdown-body prose prose-emerald max-w-none prose-p:leading-relaxed prose-li:leading-relaxed text-slate-700">
                      <SafeMarkdown>{result.phase1}</SafeMarkdown>
                    </div>
                  </section>

                  <section className="bg-slate-900 text-slate-200 p-8 rounded-3xl group shadow-xl">
                    <h3 className="text-lg font-bold flex items-center gap-3 mb-6 text-white">
                      <div className="w-1.5 h-6 bg-emerald-text rounded-full" />
                      Phase 2: Main
                      <span className="text-[10px] font-medium text-emerald-text/50 ml-2 uppercase">(New learning including assessment)</span>
                    </h3>
                    <div className="markdown-body prose prose-invert prose-emerald max-w-none prose-p:leading-relaxed prose-li:leading-relaxed text-slate-300 pb-6">
                      <SafeMarkdown>{result.phase2}</SafeMarkdown>
                    </div>
                  </section>

                  {result.differentiation && (
                    <section className="bg-ghana-gold/5 p-8 rounded-[2.5rem] border border-ghana-gold/20 shadow-sm relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-8 opacity-5">
                         <Users size={120} />
                      </div>
                      <h3 className="text-xl font-black flex items-center gap-3 mb-8 text-slate-900 uppercase tracking-tighter">
                        <Sparkles className="text-ghana-gold" size={24} />
                        NaCCA Differentiation Strategies
                      </h3>
                      
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Struggling Learners */}
                        <div className="bg-white p-6 rounded-3xl border border-ghana-gold/20 flex flex-col h-full hover:shadow-md transition-shadow">
                          <div className="flex items-center gap-2 mb-4">
                            <div className="w-2 h-2 rounded-full bg-red-500" />
                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Struggling Learners</h4>
                          </div>
                          <div className="space-y-4 flex-grow">
                            <div>
                              <p className="text-[9px] font-bold text-ghana-red uppercase mb-1">Activities</p>
                              <p className="text-xs text-slate-600 leading-relaxed font-medium">{result.differentiation.strugglingLearners?.activities}</p>
                            </div>
                            <div>
                              <p className="text-[9px] font-bold text-ghana-red uppercase mb-1">Resources</p>
                              <p className="text-xs text-slate-600 leading-relaxed font-medium">{result.differentiation.strugglingLearners?.resources}</p>
                            </div>
                            <div>
                              <p className="text-[9px] font-bold text-ghana-red uppercase mb-1">Assessment Tips</p>
                              <p className="text-xs text-slate-600 leading-relaxed font-medium">{result.differentiation.strugglingLearners?.assessments}</p>
                            </div>
                          </div>
                        </div>

                        {/* Average Learners */}
                        <div className="bg-white p-6 rounded-3xl border border-ghana-gold/20 flex flex-col h-full hover:shadow-md transition-shadow">
                          <div className="flex items-center gap-2 mb-4">
                            <div className="w-2 h-2 rounded-full bg-emerald-500" />
                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Average Learners</h4>
                          </div>
                          <div className="space-y-4 flex-grow">
                            <div>
                              <p className="text-[9px] font-bold text-emerald-600 uppercase mb-1">Activities</p>
                              <p className="text-xs text-slate-600 leading-relaxed font-medium">{result.differentiation.averageLearners?.activities}</p>
                            </div>
                            <div>
                              <p className="text-[9px] font-bold text-emerald-600 uppercase mb-1">Resources</p>
                              <p className="text-xs text-slate-600 leading-relaxed font-medium">{result.differentiation.averageLearners?.resources}</p>
                            </div>
                            <div>
                              <p className="text-[9px] font-bold text-emerald-600 uppercase mb-1">Assessment Tips</p>
                              <p className="text-xs text-slate-600 leading-relaxed font-medium">{result.differentiation.averageLearners?.assessments}</p>
                            </div>
                          </div>
                        </div>

                        {/* Advanced Learners */}
                        <div className="bg-white p-6 rounded-3xl border border-ghana-gold/20 flex flex-col h-full hover:shadow-md transition-shadow">
                          <div className="flex items-center gap-2 mb-4">
                            <div className="w-2 h-2 rounded-full bg-indigo-500" />
                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Advanced Learners</h4>
                          </div>
                          <div className="space-y-4 flex-grow">
                            <div>
                              <p className="text-[9px] font-bold text-indigo-600 uppercase mb-1">Enrichment Activities</p>
                              <p className="text-xs text-slate-600 leading-relaxed font-medium">{result.differentiation.advancedLearners?.activities}</p>
                            </div>
                            <div>
                              <p className="text-[9px] font-bold text-indigo-600 uppercase mb-1">Advanced Resources</p>
                              <p className="text-xs text-slate-600 leading-relaxed font-medium">{result.differentiation.advancedLearners?.resources}</p>
                            </div>
                            <div>
                              <p className="text-[9px] font-bold text-indigo-600 uppercase mb-1">Challenge Assessments</p>
                              <p className="text-xs text-slate-600 leading-relaxed font-medium">{result.differentiation.advancedLearners?.assessments}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </section>
                  )}

                  <section className="bg-slate-50 p-8 rounded-3xl border border-slate-200">
                     <h3 className="text-lg font-bold flex items-center gap-3 mb-6 text-slate-800">
                        <CheckCircle className="text-emerald-deep" size={24} />
                        Phase 3: Plenary / Reflections
                     </h3>
                     <div className="markdown-body prose prose-sm prose-emerald max-w-none text-slate-600 leading-relaxed italic border-l-4 border-slate-200 pl-6">
                       <SafeMarkdown>{result.phase3}</SafeMarkdown>
                     </div>
                  </section>
                </div>
              </div>
            )}

            {/* PRIMARY-FOCUSED THEME PREVIEW */}
            {formData.layoutStyle === 'primary-focused' && (
              <div className="bg-white p-8 lg:p-12 rounded-[2.5rem] shadow-sm border-2 border-dashed border-amber-300 space-y-10 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-amber-200/20 rounded-bl-full pointer-events-none" />
                
                {/* Header */}
                <div className="text-center border-b pb-8 border-amber-100 bg-amber-50/20 p-6 rounded-3xl border border-dashed border-amber-200">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-[10px] font-black uppercase tracking-widest mb-3">
                    🎈 PRIMARY-GRADE STUDY LAYOUT (KG-B6)
                  </div>
                  <h2 className="text-3xl font-extrabold text-amber-900 mb-2 font-sans tracking-tight">🎒 {result.title} 🎨</h2>
                  <div className="flex flex-wrap justify-center gap-2 mt-4">
                    <span className="px-3 py-1 bg-amber-100/50 rounded-full text-xs font-black text-amber-800">{formData.class}</span>
                    <span className="px-3 py-1 bg-amber-100/50 rounded-full text-xs font-black text-amber-800">{displaySubject}</span>
                    <span className="px-3 py-1 bg-amber-100/50 rounded-full text-xs font-black text-amber-800">🧸 Week {result.weekEnding || formData.weekEnding}</span>
                    <span className="px-3 py-1 bg-amber-100/50 rounded-full text-xs font-black text-amber-800">👥 Size: {result.classSize || formData.classSize}</span>
                  </div>
                </div>

                {/* Tactile Highlights (Curriculum / TLR cards) */}
                <div className="grid md:grid-cols-2 gap-6 pb-6 border-b border-amber-100">
                  <div className="bg-amber-50/30 p-6 rounded-3xl border border-amber-100/50 space-y-4">
                    <h3 className="text-xs font-black text-amber-700 uppercase tracking-wider flex items-center gap-1.5">
                      <span>🎯</span> Learning Track Overview
                    </h3>
                    <div className="space-y-3 text-sm">
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Strand</span>
                        <p className="text-slate-700 font-bold">{formData.strand}</p>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Sub-Strand</span>
                        <p className="text-slate-700 font-bold">{formData.subStrand}</p>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Selected Indicator</span>
                        <p className="text-slate-700 font-medium text-xs font-sans mt-0.5">{formData.indicator}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-indigo-50/10 p-6 rounded-3xl border border-indigo-100/50 space-y-4">
                    <h3 className="text-xs font-black text-indigo-700 uppercase tracking-wider flex items-center gap-1.5">
                      <span>🧸</span> Concrete Play Materials
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">TLRs / Learning Aids</span>
                        <div className="flex flex-wrap gap-1.5 mt-1.5">
                          {result.tlrs?.split(',').map((item: string, idx: number) => (
                            <span key={idx} className="bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded text-xs font-bold border border-indigo-100">
                              🧮 {item.trim()}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Primary References</span>
                        <p className="text-slate-600 text-xs italic mt-0.5">{result.references}</p>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Focus Competency</span>
                        <p className="text-indigo-800 font-semibold text-xs mt-0.5">{result.coreCompetencies}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Playful Phases */}
                <div className="space-y-8">
                  <section className="bg-amber-50/40 p-6 lg:p-8 rounded-[2rem] border-2 border-dashed border-amber-200">
                    <h3 className="text-lg font-black text-amber-900 flex items-center gap-2 mb-4">
                      <span>🎬</span> Phase 1: Brain Stimulator & Starter!
                      <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full uppercase">10 mins</span>
                    </h3>
                    <div className="prose prose-amber max-w-none text-slate-700 text-sm">
                      <SafeMarkdown>{result.phase1}</SafeMarkdown>
                    </div>
                  </section>

                  <section className="bg-orange-50/40 p-6 lg:p-8 rounded-[2rem] border-2 border-dashed border-orange-200">
                    <h3 className="text-lg font-black text-orange-900 flex items-center gap-2 mb-4">
                      <span>🧩</span> Phase 2: Interactive Main Action!
                      <span className="text-[10px] bg-orange-100 text-amber-850 px-2 py-0.5 rounded-full uppercase">40 mins</span>
                    </h3>
                    <div className="prose prose-orange max-w-none text-slate-700 text-sm">
                      <SafeMarkdown>{result.phase2}</SafeMarkdown>
                    </div>
                  </section>

                  {/* Level-by-level Inclusive Bento Section */}
                  {result.differentiation && (
                    <section className="bg-sky-50/40 p-8 rounded-[2rem] border-2 border-dashed border-sky-200">
                      <h3 className="text-lg font-black text-sky-900 flex items-center gap-2 mb-6">
                        <span>🌈</span> Inclusive Levels & Child-Centered Differentiation
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white p-5 rounded-2xl border border-sky-100 flex flex-col h-full hover:shadow-sm">
                          <span className="text-[10px] font-black tracking-wider uppercase text-red-500 bg-red-50 border border-red-100 px-2 py-0.5 rounded-full self-start mb-2">Needs Help 🧩</span>
                          <span className="text-[10px] font-bold text-slate-400 block mb-1">Tailored Game:</span>
                          <p className="text-xs text-slate-600 leading-relaxed font-semibold mb-3">{result.differentiation.strugglingLearners?.activities}</p>
                          <span className="text-[10px] font-bold text-slate-400 block mb-1">Familiar Object Needed:</span>
                          <p className="text-[11px] text-slate-500 italic font-medium">{result.differentiation.strugglingLearners?.resources}</p>
                        </div>
                        <div className="bg-white p-5 rounded-2xl border border-sky-100 flex flex-col h-full hover:shadow-sm">
                          <span className="text-[10px] font-black tracking-wider uppercase text-emerald-500 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full self-start mb-2">Steady Learning 🎒</span>
                          <span className="text-[10px] font-bold text-slate-400 block mb-1">General Activity:</span>
                          <p className="text-xs text-slate-600 leading-relaxed font-semibold mb-3">{result.differentiation.averageLearners?.activities}</p>
                          <span className="text-[10px] font-bold text-slate-400 block mb-1">In-Class Check:</span>
                          <p className="text-[11px] text-slate-500 italic font-medium">{result.differentiation.averageLearners?.assessments}</p>
                        </div>
                        <div className="bg-white p-5 rounded-2xl border border-sky-100 flex flex-col h-full hover:shadow-sm">
                          <span className="text-[10px] font-black tracking-wider uppercase text-indigo-500 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-full self-start mb-2">Extra Challenges 🚀</span>
                          <span className="text-[10px] font-bold text-slate-400 block mb-1">Enrichment Task:</span>
                          <p className="text-xs text-slate-600 leading-relaxed font-semibold mb-3">{result.differentiation.advancedLearners?.activities}</p>
                          <span className="text-[10px] font-bold text-slate-400 block mb-1">Fun Extension:</span>
                          <p className="text-[11px] text-slate-500 italic font-medium">{result.differentiation.advancedLearners?.assessments}</p>
                        </div>
                      </div>
                    </section>
                  )}

                  <section className="bg-teal-50/40 p-6 lg:p-8 rounded-[2rem] border-2 border-dashed border-teal-200">
                    <h3 className="text-lg font-black text-teal-900 flex items-center gap-2 mb-4">
                      <span>🎯</span> Phase 3: Playful Check-in & Wrap-up!
                      <span className="text-[10px] bg-teal-150 text-teal-850 px-2 py-0.5 rounded-full uppercase">10 mins</span>
                    </h3>
                    <div className="markdown-body prose prose-teal max-w-none text-slate-700 text-sm leading-relaxed italic border-l-4 border-teal-200 pl-4">
                      <SafeMarkdown>{result.phase3}</SafeMarkdown>
                    </div>
                  </section>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LessonPlanGenerator;
