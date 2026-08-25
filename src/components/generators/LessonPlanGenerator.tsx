import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'react-hot-toast';
import { Sparkles, Save, Download, RefreshCw, FileText, ChevronLeft, ChevronRight, CheckCircle, Users, Layout, AlignLeft, Layers, GraduationCap, MessageSquare, Edit3, Check, RotateCcw, FileEdit, AlertCircle, Compass, Search, BookOpen, ArrowRight } from 'lucide-react';
import { CurriculumReferenceModal } from '../standards/CurriculumReferenceModal';
import { CurriculumIndicatorItem } from '../../lib/curriculumDatabase';
import { generateLessonPlan } from '../../lib/gemini';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { saveOffline } from '../../lib/indexedDB';
import { cacheGeneratedDocument } from '../../lib/offlineDocumentCache';
import { db } from '../../lib/firebase';
import { useAuth } from '../../contexts/AuthContext';
import { cn, formatPerformanceIndicator, formatMultiplePerformanceIndicators, getUpcomingFriday, getSchoolWeekDaysFromWeekEnding, calculateLessonDateFromWeekEnding, formatWeekLessonPlanTitle, SchoolWeekDays } from '../../lib/utils';
import { filterStandardsForClass } from '../../lib/curriculumDatabase';
import { SafeMarkdown } from '../common/SafeMarkdown';
import 'highlight.js/styles/github.css';
import { exportLessonPlanToPDF } from '../../lib/lessonPlanPdfExport';
import { exportLessonPlanToWord } from '../../lib/wordExport';
import { buildMultiDayLessonPhases } from '../../lib/multiDayParser';
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

const safeListItems = (val: any): string[] => {
  if (!val) return [];
  if (Array.isArray(val)) return val.map(v => typeof v === 'string' ? v.trim() : String(v)).filter(Boolean);
  if (typeof val === 'string') return val.split(',').map(s => s.trim()).filter(Boolean);
  return [String(val).trim()];
};

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

export const formatDaysString = (days: string[]): string => {
  if (!days || days.length === 0) return 'Monday';
  if (days.length === 1) return days[0];
  if (days.length === 2) return `${days[0]} & ${days[1]}`;
  return `${days.slice(0, -1).join(', ')} & ${days[days.length - 1]}`;
};

const LessonPlanGenerator = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [isStandardsModalOpen, setIsStandardsModalOpen] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [result, setResult] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [hasEdited, setHasEdited] = useState(false);
  const [saving, setSaving] = useState(false);
  const [customIndicatorInput, setCustomIndicatorInput] = useState('');
  const initialFriday = getUpcomingFriday();
  const initialDate = calculateLessonDateFromWeekEnding(initialFriday, ['Monday']);

  const [formData, setFormData] = useState({
    level: 'JHS',
    class: 'Basic 7',
    subject: 'English',
    ghanaianLanguage: '',
    weekNumber: '1',
    day: 'Monday',
    selectedDays: ['Monday'] as string[],
    date: initialDate,
    period: '1 & 2 (60 mins)',
    lesson: '1 of 3',
    strand: '',
    subStrand: '',
    contentStandard: '',
    indicator: '',
    selectedIndicators: [] as string[],
    mainObjective: '',
    duration: '60 minutes',
    classSize: '40',
    weekEnding: initialFriday,
    locality: 'Urban',
    specificLocality: profile?.town || '',
    differentiationStrategies: '',
    customGuidance: '',
    layoutStyle: 'ges-standard' as 'ges-standard' | 'minimalist' | 'comprehensive' | 'primary-focused',
    language: 'English',
    bilingualLanguage: 'Twi',
  });

  // Handle preloaded state from NaCCA Standards Database
  useEffect(() => {
    if (location.state?.preloaded) {
      const p = location.state.preloaded;
      const initialIndicators = p.indicator ? [p.indicator] : [];
      setFormData(prev => ({
        ...prev,
        level: p.level || prev.level,
        class: p.class || prev.class,
        subject: p.subject || prev.subject,
        weekNumber: p.weekNumber || p.week || prev.weekNumber || '1',
        strand: p.strand || prev.strand,
        subStrand: p.subStrand || prev.subStrand,
        contentStandard: p.contentStandard || prev.contentStandard,
        selectedIndicators: initialIndicators,
        indicator: p.indicator || prev.indicator,
        mainObjective: p.mainObjective || prev.mainObjective,
      }));
      setStep(3); // Jump directly to Step 3 for review!
    }
  }, [location.state]);

  const handleIndicatorSelected = (item: CurriculumIndicatorItem) => {
    const indString = item.indicatorFull || `${item.indicatorCode}: ${item.indicatorText}`;
    setFormData(prev => {
      const updatedIndicators = [indString];
      return {
        ...prev,
        level: item.level || prev.level,
        class: item.classLevel || prev.class,
        subject: item.subject || prev.subject,
        strand: item.strand,
        subStrand: item.subStrand,
        contentStandard: item.standardFull,
        selectedIndicators: updatedIndicators,
        indicator: item.indicatorCode || item.indicatorFull,
        mainObjective: formatPerformanceIndicator(item.indicatorText || item.indicatorFull)
      };
    });
  };

  const handleMultipleIndicatorsSelectedFromModal = (items: CurriculumIndicatorItem[]) => {
    if (items.length === 0) return;
    const first = items[0];
    const newIndStrings = items.map(item => item.indicatorFull || `${item.indicatorCode}: ${item.indicatorText}`);
    
    setFormData(prev => {
      // Merge unique indicators
      const mergedIndicators = Array.from(new Set([...(prev.selectedIndicators || []), ...newIndStrings]));
      const codes = mergedIndicators.map(i => i.split(':')[0].trim()).join(', ');
      const newObj = formatMultiplePerformanceIndicators(mergedIndicators);
      return {
        ...prev,
        level: first.level || prev.level,
        class: first.classLevel || prev.class,
        subject: first.subject || prev.subject,
        strand: first.strand || prev.strand,
        subStrand: first.subStrand || prev.subStrand,
        contentStandard: first.standardFull || prev.contentStandard,
        selectedIndicators: mergedIndicators,
        indicator: codes,
        mainObjective: newObj || prev.mainObjective
      };
    });
  };

  const handleWeekEndingChange = (newWeekEnding: string) => {
    setFormData(prev => {
      const activeDays = prev.selectedDays && prev.selectedDays.length > 0
        ? prev.selectedDays
        : [prev.day || 'Monday'];
      const calculatedDate = calculateLessonDateFromWeekEnding(newWeekEnding, activeDays);
      return {
        ...prev,
        weekEnding: newWeekEnding,
        date: calculatedDate
      };
    });
  };

  const handleToggleDay = (dayName: string) => {
    setFormData(prev => {
      const current = prev.selectedDays || [prev.day || 'Monday'];
      let updated: string[];
      if (current.includes(dayName)) {
        if (current.length === 1) {
          updated = current; // Preserve at least one day
        } else {
          updated = current.filter(d => d !== dayName);
        }
      } else {
        const order = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
        updated = [...current, dayName].sort((a, b) => order.indexOf(a) - order.indexOf(b));
      }
      const dayStr = formatDaysString(updated);
      const calculatedDate = calculateLessonDateFromWeekEnding(prev.weekEnding, updated);
      return {
        ...prev,
        selectedDays: updated,
        day: dayStr,
        date: calculatedDate
      };
    });
  };

  const handleSetDayPreset = (days: string[]) => {
    setFormData(prev => ({
      ...prev,
      selectedDays: days,
      day: formatDaysString(days),
      date: calculateLessonDateFromWeekEnding(prev.weekEnding, days)
    }));
  };

  const handleRecalculateDate = () => {
    const activeDays = formData.selectedDays && formData.selectedDays.length > 0
      ? formData.selectedDays
      : [formData.day || 'Monday'];
    const calculatedDate = calculateLessonDateFromWeekEnding(formData.weekEnding, activeDays);
    setFormData(prev => ({
      ...prev,
      date: calculatedDate
    }));
    toast.success(`Lesson date synced: ${calculatedDate}`);
  };

  const handleToggleIndicator = (indicatorStr: string) => {
    setFormData(prev => {
      const current = prev.selectedIndicators && prev.selectedIndicators.length > 0
        ? prev.selectedIndicators
        : (prev.indicator ? [prev.indicator] : []);
      
      let updated: string[];
      if (current.includes(indicatorStr)) {
        updated = current.filter(i => i !== indicatorStr);
      } else {
        updated = [...current, indicatorStr];
      }

      const codes = updated.map(i => i.split(':')[0].trim()).join(', ');
      const newObjective = formatMultiplePerformanceIndicators(updated);

      return {
        ...prev,
        selectedIndicators: updated,
        indicator: codes,
        mainObjective: newObjective || prev.mainObjective
      };
    });
  };

  const handleSelectAllIndicators = (indicators: string[]) => {
    setFormData(prev => {
      const codes = indicators.map(i => i.split(':')[0].trim()).join(', ');
      const newObjective = formatMultiplePerformanceIndicators(indicators);
      return {
        ...prev,
        selectedIndicators: indicators,
        indicator: codes,
        mainObjective: newObjective || prev.mainObjective
      };
    });
  };

  const handleClearIndicators = () => {
    setFormData(prev => ({
      ...prev,
      selectedIndicators: [],
      indicator: '',
      mainObjective: ''
    }));
  };

  const handleAddCustomIndicator = () => {
    if (!customIndicatorInput.trim()) return;
    const cleanInd = customIndicatorInput.trim();
    setFormData(prev => {
      const current = prev.selectedIndicators || [];
      if (current.includes(cleanInd)) return prev;
      const updated = [...current, cleanInd];
      const codes = updated.map(i => i.split(':')[0].trim()).join(', ');
      const newObj = formatMultiplePerformanceIndicators(updated);
      return {
        ...prev,
        selectedIndicators: updated,
        indicator: codes,
        mainObjective: newObj || prev.mainObjective
      };
    });
    setCustomIndicatorInput('');
    toast.success('Indicator added to lesson plan!');
  };
  
  const displaySubject = formData.subject === 'Ghanaian Language' && formData.ghanaianLanguage
    ? `Ghanaian Language (${formData.ghanaianLanguage})`
    : formData.subject;

  // Automatically use the indicator as the Performance Indicator when selected
  React.useEffect(() => {
    if (formData.indicator) {
      const formatted = formatPerformanceIndicator(formData.indicator);
      if (formatted) {
        setFormData(prev => ({
          ...prev,
          mainObjective: formatted
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
      const hasIndicator = (formData.selectedIndicators && formData.selectedIndicators.length > 0) || Boolean(formData.indicator);
      if (!hasIndicator) newErrors.indicator = "Please select or enter at least one indicator";
      if (!formData.mainObjective || formData.mainObjective.length < 10) {
        newErrors.mainObjective = "Please provide performance indicator statement(s) starting with 'Learners can' (min 10 chars)";
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
  const rawStandards = (
    SUB_STRAND_STANDARDS[lookupStrand]?.[formData.subStrand] || 
    SUB_STRAND_STANDARDS[formData.strand]?.[formData.subStrand] ||
    SUB_STRAND_STANDARDS[formData.subject]?.[formData.subStrand] ||
    SUB_STRAND_STANDARDS[formData.subject]?.[formData.strand] ||
    []
  );
  const currentStandards = filterStandardsForClass(rawStandards, formData.class, formData.level);
  const currentIndicators = STANDARD_INDICATORS[formData.contentStandard] || getFallbackIndicators(formData.contentStandard);

  const handleGenerate = async () => {
    if (!validateStep(3)) return;

    setLoading(true);
    try {
      const activeIndicators = formData.selectedIndicators && formData.selectedIndicators.length > 0
        ? formData.selectedIndicators
        : (formData.indicator ? [formData.indicator] : []);

      const activeDays = formData.selectedDays && formData.selectedDays.length > 0
        ? formData.selectedDays
        : [formData.day || 'Monday'];

      const daysDescription = formatDaysString(activeDays);
      const isMultiDay = activeDays.length > 1;
      const isMultiIndicator = activeIndicators.length > 1;
      const indicatorCodesString = activeIndicators.map(i => i.split(':')[0].trim()).join(', ');

      // Find potential curriculum frames for additional guidance
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

      for (const ind of activeIndicators) {
        const indicatorId = ind.split(':')[0].trim();
        const foundFrame = (allFrames as Record<string, any>)[indicatorId];
        if (foundFrame) {
          frameDetails += `
          LESSON FRAME CONTEXT (${indicatorId} - ${foundFrame.topic}):
          - Approved Topic: ${foundFrame.topic}
          - Key Activities to Include: ${foundFrame.activities.join(', ')}
          - Mandatory Key Words: ${foundFrame.keyWords.join(', ')}
          - Suggested TLRs: ${foundFrame.resources.join(', ')}
          `;
        }
      }

      let layoutStyleInstruction = "";
      if (formData.layoutStyle === 'minimalist') {
        layoutStyleInstruction = "LAYOUT STYLE REQUIREMENT (MINIMALIST): Please make the lesson plan highly condensed, high-density, and concise. Prioritize compact descriptions and brief bullet points for rapid classroom referencing. Keep Phase 1 (Starter), Phase 2 (Main), and Phase 3 (Plenary) activities clear, brief, direct, and to-the-point.";
      } else if (formData.layoutStyle === 'primary-focused') {
        layoutStyleInstruction = "LAYOUT STYLE REQUIREMENT (PRIMARY-FOCUSED): Please tailor the lesson plan specifically for early childhood or primary learners (play-centered). Highlight tactile, concrete manipulatives, highly collaborative activities, physical learning games, and interactive group participation. Phase 2 (Main) must be active and play-centered with gamified teacher checking.";
      } else {
        layoutStyleInstruction = "LAYOUT STYLE REQUIREMENT (COMPREHENSIVE): Please write a deeply detailed, highly structured, and extensive instructional roadmap. Detail complete step-by-step teacher and learner actions. Ensure core competencies, formative checkpoint milestones, rich teaching/learning resources, and references are fully elaborated.";
      }

      const indicatorsSection = isMultiIndicator
        ? `MULTI-INDICATOR TARGETS (${activeIndicators.length} Total):\n${activeIndicators.map((ind, i) => `${i + 1}. ${ind}`).join('\n')}`
        : `Indicator: ${activeIndicators[0] || formData.indicator}`;

      const multiDayInstruction = isMultiDay
        ? `MULTI-DAY LESSON DELIVERY (${activeDays.length} DAYS - ${daysDescription}):
        This lesson is scheduled for multiple distinct days (${daysDescription}).
        1. Phase 1 (Starter): Provide a dedicated, distinct Starter activity for each day with bold headers (e.g., "**DAY 1 (${activeDays[0]}):** [Starter activity]" and "**DAY 2 (${activeDays[1] || ''}):** [Starter activity]").
        2. Phase 2 (Main New Learning): Explicitly structure the instructional steps across each day with bold headers (e.g., "**DAY 1 (${activeDays[0]}):** [Activities covering initial concept]" and "**DAY 2 (${activeDays[1] || ''}):** [Progression, deep practice, hands-on activities, and assessment]").
        3. Phase 3 (Plenary / Reflections): Provide a dedicated Plenary / Exit Ticket for each day with bold headers (e.g., "**DAY 1 (${activeDays[0]}):** [Plenary summary]" and "**DAY 2 (${activeDays[1] || ''}):** [End of lesson reflection]").`
        : `Day of Week: ${formData.day}.`;

      const multiIndicatorInstruction = isMultiIndicator
        ? `MULTI-INDICATOR CURRICULUM COVERAGE: The teacher is preparing on ${activeIndicators.length} indicators simultaneously (${indicatorCodesString}). Ensure all indicator codes are clearly referenced, performance indicators are numbered for each, and the Phase 2 learning activities systematically provide instructional coverage and mastery for every selected indicator.`
        : ``;

      const prompt = `Generate a NaCCA-compliant lesson plan for ${formData.class} (${formData.level}) ${displaySubject} strictly following the Standard-Based Curriculum (SBC). 
      Term Week: ${formData.weekNumber || '1'} (${formatWeekLessonPlanTitle(formData.weekNumber || '1')}).
      Strand: ${formData.strand}.
      Sub-Strand: ${formData.subStrand}.
      Content Standard: ${formData.contentStandard}.
      ${indicatorsSection}
      Performance Indicator(s): ${formData.mainObjective}.
      Duration: ${formData.duration}.
      Class Size: ${formData.classSize} learners.
      Week Ending: ${formData.weekEnding}.
      Scheduled Day(s): ${daysDescription}.
      Locality: ${formData.locality} (${formData.specificLocality}). 
      
      ${frameDetails}

      ${multiDayInstruction}
      ${multiIndicatorInstruction}

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

      // Auto-cache immediately for offline resilience in rural classrooms
      if (user) {
        const autoDoc = {
          id: `lp_${Date.now()}`,
          authorId: user.uid,
          title: `${displaySubject} - ${formData.subStrand || formData.strand || 'Lesson Plan'}`,
          type: 'lessonPlan' as const,
          subject: displaySubject,
          level: formData.level,
          class: formData.class,
          strand: formData.strand,
          subStrand: formData.subStrand,
          contentStandard: formData.contentStandard,
          indicator: formData.indicator,
          phase1: data.phase1,
          phase2: data.phase2,
          phase3: data.phase3,
          coreCompetencies: data.coreCompetencies,
          assessment: data.assessment,
          createdAt: Date.now(),
          synced: false
        };
        cacheGeneratedDocument(autoDoc);
      }

      toast.success("Lesson plan generated successfully & cached offline! 🇬🇭");
    } catch (err: any) {
      console.error(err);
      const errorMsg = err?.message || "Failed to generate lesson plan. Please try again.";
      toast.error(errorMsg, { duration: 6000 });
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateLessonNotes = () => {
    navigate('/notes', {
      state: {
        fromLessonPlan: true,
        sourceLessonTitle: result?.title || `${displaySubject} - ${formData.strand || 'Lesson'} (${formData.class})`,
        preloaded: {
          level: formData.level,
          class: formData.class,
          subject: formData.subject,
          ghanaianLanguage: formData.ghanaianLanguage,
          strand: formData.strand,
          subStrand: formData.subStrand,
          contentStandard: formData.contentStandard,
          indicator: formData.indicator,
          objectives: formData.mainObjective || (formData.indicator ? formatPerformanceIndicator(formData.indicator) : ''),
          duration: formData.duration || '60 minutes',
          week: 'Week 1',
          term: 'Term 1',
          academicYear: '2025/2026',
          locality: formData.locality,
          specificLocality: formData.specificLocality,
          language: formData.language,
          bilingualLanguage: formData.bilingualLanguage,
          differentiation: formData.differentiationStrategies || '',
          coreCompetencies: result?.coreCompetencies || 'Critical Thinking and Problem Solving (CP), Communication and Collaboration (CC)',
        }
      }
    });
  };

  const handleSave = async () => {
    if (!result || !user) return;
    setSaving(true);

    const weekTitle = formatWeekLessonPlanTitle(result.weekNumber || formData.weekNumber || '1');
    const payload = {
      ...result,
      authorId: user.uid,
      title: result.title || `${weekTitle} - ${displaySubject} (${formData.class})`,
      weekNumber: result.weekNumber || formData.weekNumber || '1',
      week: `Week ${result.weekNumber || formData.weekNumber || '1'}`,
      weekEnding: result.weekEnding || formData.weekEnding,
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
        toast.success('Lesson plan saved successfully to your cloud library and cached offline! 🇬🇭');
      } else {
        toast.success('Lesson plan saved locally to your offline cabinet! TeachSmartGH will synchronize it once a stable connection is restored. 🇬🇭');
      }
    } catch (err) {
      console.error("Failed to save lesson plan fully:", err);
      try {
        await saveOffline('lessonPlans', payload, false);
        toast.success('Saved locally! Your lesson plan has been stored offline because of network fluctuations. 🇬🇭');
      } catch (offlineErr) {
        console.error("Local save fallback also failed:", offlineErr);
        toast.error('Failed to save. Storage is locked or your browser lacks IndexedDB permissions.');
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDownloadPDF = () => {
    if (!result) return;
    try {
      const activeIndicators = formData.selectedIndicators && formData.selectedIndicators.length > 0
        ? formData.selectedIndicators
        : (formData.indicator ? [formData.indicator] : []);
      
      const indicatorCodes = activeIndicators.map(i => i.split(':')[0].trim()).join(', ');
      const indicatorFull = activeIndicators.join('\n');

      const doc = exportLessonPlanToPDF({
        title: formatWeekLessonPlanTitle(result.weekNumber || formData.weekNumber || '1'),
        weekNumber: result.weekNumber || formData.weekNumber || '1',
        week: `Week ${result.weekNumber || formData.weekNumber || '1'}`,
        subject: displaySubject,
        ghanaianLanguage: formData.ghanaianLanguage,
        level: formData.level,
        class: formData.class,
        classSize: result.classSize || formData.classSize,
        weekEnding: result.weekEnding || formData.weekEnding,
        day: formData.day,
        date: formData.date || formData.weekEnding,
        period: formData.period,
        lesson: formData.lesson,
        duration: formData.duration,
        strand: result.strand || formData.strand,
        subStrand: result.subStrand || formData.subStrand,
        indicatorCode: result.indicatorCode || indicatorCodes || formData.indicator,
        contentStandardCode: result.contentStandardCode || formData.contentStandard,
        indicator: indicatorFull || formData.indicator,
        contentStandard: formData.contentStandard,
        performanceIndicator: result.performanceIndicator || formData.mainObjective,
        coreCompetencies: result.coreCompetencies,
        keyWords: result.keyWords,
        tlrs: result.tlrs,
        references: result.references,
        phase1: result.phase1,
        phase2: result.phase2,
        phase3: result.phase3,
        assessment: result.assessment,
        remarks: result.remarks,
        differentiation: result.differentiation,
        locality: formData.locality,
        specificLocality: formData.specificLocality,
      });

      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').replace('T', '_').slice(0, 19);
      const filename = `${displaySubject}_${formData.strand || 'Lesson'}_${formData.subStrand || 'Plan'}_${timestamp}`.replace(/[\s\W]+/g, '_');
      doc.save(`${filename}.pdf`);
      toast.success("Official GES / NaCCA Lesson Plan downloaded! 🇬🇭");
    } catch (err) {
      console.error(err);
      toast.error("Failed to generate PDF. Please try again.");
    }
  };

  const [exportingWord, setExportingWord] = useState(false);

  const handleDownloadWord = async () => {
    if (!result) return;
    setExportingWord(true);
    try {
      const activeIndicators = formData.selectedIndicators && formData.selectedIndicators.length > 0
        ? formData.selectedIndicators
        : (formData.indicator ? [formData.indicator] : []);
      
      const indicatorCodes = activeIndicators.map(i => i.split(':')[0].trim()).join(', ');
      const indicatorFull = activeIndicators.join('\n');

      await exportLessonPlanToWord({
        title: formatWeekLessonPlanTitle(result.weekNumber || formData.weekNumber || '1'),
        weekNumber: result.weekNumber || formData.weekNumber || '1',
        week: `Week ${result.weekNumber || formData.weekNumber || '1'}`,
        subject: displaySubject,
        ghanaianLanguage: formData.ghanaianLanguage,
        level: formData.level,
        class: formData.class,
        classSize: result.classSize || formData.classSize,
        weekEnding: result.weekEnding || formData.weekEnding,
        day: formData.day,
        date: formData.date || formData.weekEnding,
        period: formData.period,
        lesson: formData.lesson,
        duration: formData.duration,
        strand: result.strand || formData.strand,
        subStrand: result.subStrand || formData.subStrand,
        indicatorCode: result.indicatorCode || indicatorCodes || formData.indicator,
        contentStandardCode: result.contentStandardCode || formData.contentStandard,
        indicator: indicatorFull || formData.indicator,
        contentStandard: formData.contentStandard,
        performanceIndicator: result.performanceIndicator || formData.mainObjective,
        coreCompetencies: result.coreCompetencies,
        keyWords: result.keyWords,
        tlrs: result.tlrs,
        references: result.references,
        phase1: result.phase1,
        phase2: result.phase2,
        phase3: result.phase3,
        assessment: result.assessment,
        remarks: result.remarks,
        differentiation: result.differentiation,
        locality: formData.locality,
        specificLocality: formData.specificLocality,
      }, {
        subject: displaySubject,
        classLevel: formData.class,
        level: formData.level,
        week: result.weekNumber || formData.weekNumber || '1',
        strand: result.strand || formData.strand,
        subStrand: result.subStrand || formData.subStrand,
        indicator: indicatorCodes || formData.indicator,
      });
    } catch (err) {
      console.error(err);
      toast.error("Failed to export Word document. Please try again.");
    } finally {
      setExportingWord(false);
    }
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
                  onChange={(e) => setFormData({
                    ...formData, 
                    class: e.target.value,
                    contentStandard: '',
                    indicator: '',
                    mainObjective: ''
                  })}
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

              {/* Term Week Number & Official Title Card */}
              <div className="space-y-3 sm:col-span-2 bg-gradient-to-br from-emerald-50/70 via-slate-50 to-white p-4.5 rounded-2xl border border-emerald-200/90 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-black text-slate-900 uppercase tracking-wider">
                      Term Week Number
                    </label>
                    <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-600 text-white px-2 py-0.5 rounded-full shadow-xs">
                      Official Header
                    </span>
                  </div>
                  
                  {/* Live formatted title badge */}
                  <div className="flex items-center gap-1.5 self-start sm:self-auto bg-slate-900 text-white px-3 py-1 rounded-xl shadow-xs">
                    <span className="text-[10px] text-emerald-400 font-mono uppercase font-bold">Header:</span>
                    <span className="text-xs font-black tracking-wide text-amber-300">
                      "{formatWeekLessonPlanTitle(formData.weekNumber)}"
                    </span>
                  </div>
                </div>

                <p className="text-[11px] text-slate-600">
                  Select or enter the instructional week number. This automatically formats the official title (e.g. <strong className="text-slate-900">"WEEK ONE (1) LESSON PLAN"</strong>) on your notebook page and PDF export.
                </p>

                {/* Quick Week Preset Buttons */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {[
                    { label: 'Week 1', val: '1' },
                    { label: 'Week 2', val: '2' },
                    { label: 'Week 3', val: '3' },
                    { label: 'Week 4', val: '4' },
                    { label: 'Week 5', val: '5' },
                    { label: 'Week 6', val: '6' },
                    { label: 'Week 7', val: '7' },
                    { label: 'Week 8', val: '8' },
                    { label: 'Week 9', val: '9' },
                    { label: 'Week 10', val: '10' },
                    { label: 'Week 11 (Rev)', val: '11' },
                    { label: 'Week 12 (Assess)', val: '12' },
                  ].map(w => {
                    const isSelected = String(formData.weekNumber).trim() === w.val || String(formData.weekNumber).trim() === w.label;
                    return (
                      <button
                        key={w.val}
                        type="button"
                        onClick={() => setFormData({ ...formData, weekNumber: w.val })}
                        className={cn(
                          "px-2.5 py-1.5 text-xs font-bold rounded-xl border transition-all shadow-2xs cursor-pointer",
                          isSelected
                            ? "bg-slate-900 text-amber-300 border-slate-900 font-extrabold ring-2 ring-emerald-500/40"
                            : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100 hover:border-slate-300"
                        )}
                      >
                        {w.label}
                      </button>
                    );
                  })}
                </div>

                {/* Custom Week Input */}
                <div className="pt-1 flex flex-col sm:flex-row sm:items-center gap-2">
                  <div className="flex-1">
                    <input 
                      type="text"
                      className="input-field text-xs font-bold py-2 bg-white"
                      value={formData.weekNumber}
                      onChange={(e) => setFormData({ ...formData, weekNumber: e.target.value })}
                      placeholder="e.g. 1, 2, Week 3, Week 11 - Revision"
                    />
                  </div>
                  <span className="text-[11px] font-medium text-slate-500">
                    Type any week number or custom title label
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-bold text-gray-500 uppercase">Week Ending Date</label>
                  <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider bg-emerald-50 px-2 py-0.5 rounded-md">
                    Friday of School Week
                  </span>
                </div>
                <input 
                  type="date"
                  className={cn("input-field font-semibold", errors.weekEnding && "border-red-400 ring-4 ring-red-50")}
                  value={formData.weekEnding}
                  onChange={(e) => handleWeekEndingChange(e.target.value)}
                />
                {errors.weekEnding && <p className="text-[10px] text-red-500 font-bold uppercase tracking-wider">{errors.weekEnding}</p>}
                <p className="text-[11px] text-slate-500">
                  Selecting a week ending automatically calculates exact dates for Monday–Friday.
                </p>
              </div>
              <div className="space-y-3 sm:col-span-2 bg-slate-50/80 p-4 rounded-2xl border border-slate-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <label className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
                      <span>Scheduled Day(s) of Lesson</span>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                        {(formData.selectedDays || [formData.day]).length} {(formData.selectedDays || [formData.day]).length === 1 ? 'Day' : 'Days'} Selected
                      </span>
                    </label>
                    <p className="text-[11px] text-slate-500">Tap days to prepare for single or multi-day lesson delivery</p>
                  </div>

                  {/* Quick Preset Buttons */}
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      { label: 'Single Day', days: ['Monday'] },
                      { label: 'Mon & Wed', days: ['Monday', 'Wednesday'] },
                      { label: 'Tue & Thu', days: ['Tuesday', 'Thursday'] },
                      { label: 'Mon, Wed & Fri', days: ['Monday', 'Wednesday', 'Friday'] },
                      { label: 'All Week (Mon-Fri)', days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] }
                    ].map(preset => (
                      <button
                        key={preset.label}
                        type="button"
                        onClick={() => handleSetDayPreset(preset.days)}
                        className="px-2.5 py-1 text-[10px] font-bold bg-white hover:bg-slate-100 text-slate-700 rounded-lg border border-slate-200 shadow-xs transition-colors"
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Day Selection Pills with Auto-Calculated Dates */}
                {(() => {
                  const weekDays = getSchoolWeekDaysFromWeekEnding(formData.weekEnding);
                  return (
                    <div className="grid grid-cols-5 gap-2 pt-1">
                      {(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] as Array<keyof SchoolWeekDays>).map(d => {
                        const isSelected = formData.selectedDays?.includes(d) || (formData.day === d && (!formData.selectedDays || formData.selectedDays.length <= 1));
                        const calculatedDayDate = weekDays[d];
                        const dateFormatted = calculatedDayDate ? calculatedDayDate.split('-').slice(1).join('/') : '';
                        return (
                          <button
                            key={d}
                            type="button"
                            onClick={() => handleToggleDay(d)}
                            className={cn(
                              "py-2 px-1 text-xs font-bold rounded-xl border transition-all flex flex-col items-center justify-center gap-0.5",
                              isSelected
                                ? "bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-600/20"
                                : "bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                            )}
                          >
                            <span className="font-extrabold">{d.slice(0, 3)}</span>
                            <span className={cn("text-[10px] font-mono", isSelected ? "text-emerald-100 font-bold" : "text-slate-500")}>
                              {dateFormatted}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  );
                })()}

                {/* Formatted Text Box */}
                <div className="pt-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap">Day Header Display:</span>
                    <input
                      type="text"
                      className="input-field text-xs font-semibold py-1.5"
                      value={formData.day}
                      onChange={(e) => {
                        const newDay = e.target.value;
                        const calculatedDate = calculateLessonDateFromWeekEnding(formData.weekEnding, newDay);
                        setFormData({ ...formData, day: newDay, date: calculatedDate });
                      }}
                      placeholder="e.g. Monday & Wednesday"
                    />
                  </div>
                </div>
              </div>

              {/* Lesson Date with Auto-Calculated Sync */}
              <div className="space-y-2 sm:col-span-2 bg-emerald-50/50 p-4 rounded-2xl border border-emerald-200/80">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-bold text-slate-900 uppercase">Lesson Date</label>
                    <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-100 border border-emerald-200 px-2 py-0.5 rounded-full">
                      <span>⚡ Auto-Calculated</span>
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleRecalculateDate}
                    className="text-[11px] font-bold text-emerald-700 hover:text-emerald-900 hover:underline flex items-center gap-1 self-start sm:self-auto"
                  >
                    <RefreshCw size={12} />
                    <span>Re-sync with Week Ending</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <input 
                      type="text"
                      className="input-field font-mono text-xs sm:text-sm font-bold bg-white text-emerald-950"
                      value={formData.date}
                      onChange={(e) => setFormData({...formData, date: e.target.value})}
                      placeholder="e.g. 2026-08-24 or 2026-08-24 & 2026-08-26"
                    />
                    <p className="text-[10px] text-slate-500 mt-1">
                      Computed automatically for {formData.day} using Week Ending ({formData.weekEnding}).
                    </p>
                  </div>

                  {/* Quick Active Days Date Badges */}
                  <div className="flex flex-wrap items-center gap-1.5 bg-white p-2.5 rounded-xl border border-emerald-100">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block w-full mb-0.5">
                      Scheduled Delivery Date(s):
                    </span>
                    {(() => {
                      const weekDays = getSchoolWeekDaysFromWeekEnding(formData.weekEnding);
                      const activeDays = formData.selectedDays && formData.selectedDays.length > 0
                        ? formData.selectedDays
                        : [formData.day || 'Monday'];
                      
                      return activeDays.map(dName => {
                        const matchKey = (['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] as Array<keyof SchoolWeekDays>).find(
                          k => k.toLowerCase() === dName.toLowerCase() || dName.toLowerCase().includes(k.toLowerCase().slice(0, 3))
                        );
                        const dayDate = matchKey ? weekDays[matchKey] : '';
                        return (
                          <span
                            key={dName}
                            className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg bg-emerald-50 text-emerald-900 text-xs font-semibold border border-emerald-200"
                          >
                            <span className="font-bold">{dName}:</span>
                            <span className="font-mono text-[11px] font-bold text-emerald-700">{dayDate || formData.date}</span>
                          </span>
                        );
                      });
                    })()}
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-500 uppercase">Period / Time</label>
                <input 
                  type="text"
                  className="input-field"
                  placeholder="e.g. 1 & 2 (60 mins)"
                  value={formData.period}
                  onChange={(e) => setFormData({...formData, period: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-500 uppercase">Lesson Number</label>
                <input 
                  type="text"
                  className="input-field"
                  placeholder="e.g. 1 of 3 or 1"
                  value={formData.lesson}
                  onChange={(e) => setFormData({...formData, lesson: e.target.value})}
                />
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
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    {
                      id: 'ges-standard',
                      name: 'Official GES / NaCCA Notebook',
                      badge: '⭐ Official GES Standard (Photo Match)',
                      badgeBg: 'bg-emerald-100 text-emerald-900 border border-emerald-300',
                      icon: Layers,
                      iconColor: 'text-emerald-700',
                      description: '100% exact replica of the official Ghana Education Service (GES) Lesson Notebook page with full metadata grid and 3-phase delivery table.'
                    },
                    {
                      id: 'comprehensive',
                      name: 'Comprehensive Blueprint',
                      badge: 'Detailed NaCCA Standard',
                      badgeBg: 'bg-blue-50 text-blue-700 border border-blue-100',
                      icon: Layers,
                      iconColor: 'text-blue-600',
                      description: 'Elaborated lesson notes with granular step-by-step actions, active strategies, clear competencies, and full references.'
                    },
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
             <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
               <div>
                 <h2 className="text-xl font-bold text-slate-900">Step 3: Curriculum Calibration</h2>
                 <p className="text-xs text-slate-500">Align your lesson strictly with NaCCA syllabus standards</p>
               </div>
               <button
                 type="button"
                 onClick={() => setIsStandardsModalOpen(true)}
                 className="px-4 py-2.5 bg-[#006B3F] hover:bg-[#005230] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 shadow-xs hover:shadow transition-all shrink-0"
               >
                 <Compass size={16} />
                 Search NaCCA Standards DB
               </button>
             </div>
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
                          onChange={(e) => {
                            const newCs = e.target.value;
                            const newIndicators = STANDARD_INDICATORS[newCs] || getFallbackIndicators(newCs);
                            const firstInd = newIndicators[0] || '';
                            const newSelected = firstInd ? [firstInd] : [];
                            setFormData({
                              ...formData, 
                              contentStandard: newCs, 
                              selectedIndicators: newSelected,
                              indicator: firstInd ? firstInd.split(':')[0].trim() : '',
                              mainObjective: firstInd ? formatPerformanceIndicator(firstInd) : formData.mainObjective
                            });
                          }}
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

                  {/* Multi-Indicator Interactive Selection Cards */}
                  <div className="space-y-3 pt-2">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <label className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
                          <span>Target Indicator(s)</span>
                          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                            {(formData.selectedIndicators || []).length} Selected
                          </span>
                        </label>
                        <p className="text-[11px] text-slate-500">Select one or multiple indicators for this lesson plan</p>
                      </div>

                      {currentIndicators.length > 0 && (
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleSelectAllIndicators(currentIndicators)}
                            className="px-2.5 py-1 text-[10px] font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors"
                          >
                            Select All ({currentIndicators.length})
                          </button>
                          {(formData.selectedIndicators || []).length > 0 && (
                            <button
                              type="button"
                              onClick={handleClearIndicators}
                              className="px-2.5 py-1 text-[10px] font-bold bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
                            >
                              Clear
                            </button>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Checkbox Card List for Current Standard */}
                    {currentIndicators.length > 0 ? (
                      <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                        {currentIndicators.map((ind) => {
                          const isSelected = (formData.selectedIndicators || []).includes(ind) || formData.indicator === ind;
                          const code = ind.includes(':') ? ind.split(':')[0].trim() : ind.slice(0, 10);
                          const text = ind.includes(':') ? ind.slice(ind.indexOf(':') + 1).trim() : ind;

                          return (
                            <div
                              key={ind}
                              onClick={() => handleToggleIndicator(ind)}
                              className={cn(
                                "p-3 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 select-none",
                                isSelected
                                  ? "bg-emerald-50/70 border-emerald-500 ring-2 ring-emerald-500/20"
                                  : "bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/50"
                              )}
                            >
                              <div className={cn(
                                "w-5 h-5 rounded-lg border flex items-center justify-center shrink-0 mt-0.5 transition-all",
                                isSelected
                                  ? "bg-emerald-600 border-emerald-600 text-white shadow-xs"
                                  : "border-slate-300 bg-white"
                              )}>
                                {isSelected && <Check size={12} strokeWidth={3} />}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-0.5">
                                  <span className="font-mono text-[11px] font-black px-2 py-0.5 rounded bg-slate-900 text-emerald-300 tracking-wider">
                                    {code}
                                  </span>
                                  {isSelected && (
                                    <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest bg-emerald-100 px-1.5 py-0.2 rounded">
                                      Active
                                    </span>
                                  )}
                                </div>
                                <p className="text-xs text-slate-700 font-medium leading-relaxed">
                                  {text}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <input 
                          type="text" 
                          placeholder="e.g. B7.1.1.1.1: Use place value to count"
                          className={cn("input-field", errors.indicator && "border-red-400 ring-4 ring-red-50")}
                          value={formData.indicator}
                          onChange={(e) => {
                            const newInd = e.target.value;
                            setFormData({
                              ...formData, 
                              indicator: newInd,
                              selectedIndicators: newInd ? [newInd] : [],
                              mainObjective: newInd ? formatPerformanceIndicator(newInd) : formData.mainObjective
                            });
                          }}
                        />
                      </div>
                    )}
                    {errors.indicator && <p className="text-[10px] text-red-500 font-bold uppercase tracking-wider">{errors.indicator}</p>}

                    {/* Active Selected Indicators Summary Badges */}
                    {(formData.selectedIndicators || []).length > 0 && (
                      <div className="bg-slate-900 text-white p-3.5 rounded-2xl space-y-2 shadow-sm">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                            Included in Lesson ({(formData.selectedIndicators || []).length}):
                          </span>
                          <span className="text-[10px] font-bold text-emerald-400">
                            Coherent Multi-Indicator Plan
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {(formData.selectedIndicators || []).map((item) => {
                            const code = item.split(':')[0].trim();
                            return (
                              <span
                                key={item}
                                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white/10 text-xs font-mono font-bold text-emerald-300 border border-white/10"
                              >
                                <span>{code}</span>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleToggleIndicator(item);
                                  }}
                                  className="text-slate-400 hover:text-white rounded-full w-4 h-4 flex items-center justify-center hover:bg-white/20 transition-colors"
                                  title="Remove indicator"
                                >
                                  ×
                                </button>
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Add Custom / Other Indicator Section */}
                    <div className="flex items-center gap-2 pt-1">
                      <input
                        type="text"
                        placeholder="Add custom indicator (e.g. B7.1.1.1.3: Compare whole numbers)"
                        className="input-field text-xs py-2 flex-1"
                        value={customIndicatorInput}
                        onChange={(e) => setCustomIndicatorInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddCustomIndicator();
                          }
                        }}
                      />
                      <button
                        type="button"
                        onClick={handleAddCustomIndicator}
                        disabled={!customIndicatorInput.trim()}
                        className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-white text-xs font-bold rounded-xl transition-all whitespace-nowrap shrink-0"
                      >
                        + Add
                      </button>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 pt-4 border-t border-slate-50">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-bold text-gray-500 uppercase tracking-tighter">Performance Indicator(s)</label>
                      <span className="text-[10px] text-slate-400 italic">Auto-formatted with 'Learners can...'</span>
                    </div>
                    <textarea 
                      className={cn("input-field min-h-[110px] text-xs sm:text-sm font-medium leading-relaxed", errors.mainObjective && "border-red-400 ring-4 ring-red-50")}
                      placeholder="e.g. 1. Learners can count, read, and write whole numbers up to 10,000 using place value.&#10;2. Learners can compare and order whole numbers up to 10,000 using comparison symbols."
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
            <div className="flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-3 p-3 sm:p-4 bg-slate-900 rounded-2xl sm:rounded-[2rem] border border-white/10 ring-4 ring-slate-900/10 sticky top-20 lg:top-4 z-20 shadow-2xl">
              <div className="flex items-center gap-3 px-2 sm:px-3 min-w-0 shrink">
                <div className="w-9 h-9 sm:w-10 sm:h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-white shrink-0 shadow-md shadow-emerald-500/20">
                  <CheckCircle size={18} />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Lesson Generated</p>
                  <p className="text-white font-bold text-xs sm:text-sm truncate max-w-[200px] sm:max-w-[300px] xl:max-w-[260px]" title={result.title}>{result.title}</p>
                </div>
              </div>
              
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 p-1 bg-white/5 rounded-xl sm:rounded-2xl">
                <button 
                  onClick={() => setIsEditing(!isEditing)} 
                  className={cn(
                    "px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-xl font-bold uppercase tracking-wider text-[11px] whitespace-nowrap shrink-0 transition-all flex items-center gap-1.5 shadow-md",
                    isEditing 
                      ? "bg-amber-500 hover:bg-amber-600 text-white shadow-amber-500/20" 
                      : "bg-white/10 hover:bg-white/20 text-white"
                  )}
                >
                  {isEditing ? <Check size={14} /> : <Edit3 size={14} />}
                  {isEditing ? "Preview Format" : "Edit Plan"}
                </button>
                <button 
                  onClick={() => setStep(3)} 
                  className="px-3.5 py-2 sm:px-4 sm:py-2.5 bg-white/10 text-white rounded-xl font-bold uppercase tracking-wider text-[11px] whitespace-nowrap shrink-0 hover:bg-white/20 transition-all flex items-center gap-1.5"
                >
                  <RefreshCw size={14} />
                  Re-generate
                </button>
                <button 
                  onClick={handleGenerateLessonNotes}
                  className="px-3.5 py-2 sm:px-4 sm:py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold uppercase tracking-wider text-[11px] whitespace-nowrap shrink-0 rounded-xl transition-all flex items-center gap-1.5 shadow-md shadow-emerald-600/20"
                  title="Generate student lesson notes for this plan"
                >
                  <BookOpen size={14} />
                  <span>Generate Notes</span>
                </button>
                <button 
                  onClick={handleSave} 
                  disabled={saving}
                  className="px-3.5 py-2 sm:px-4 sm:py-2.5 bg-blue-600 text-white rounded-xl font-bold uppercase tracking-wider text-[11px] whitespace-nowrap shrink-0 hover:bg-blue-700 transition-all flex items-center gap-1.5 shadow-md shadow-blue-600/20"
                >
                  <Save size={14} />
                  {saving ? "Saving..." : "Save Cloud"}
                </button>
                <button 
                  onClick={handleDownloadPDF} 
                  className="px-3.5 py-2 sm:px-4 sm:py-2.5 bg-emerald-600 text-white rounded-xl font-bold uppercase tracking-wider text-[11px] whitespace-nowrap shrink-0 hover:bg-emerald-700 transition-all border-none flex items-center gap-1.5 shadow-md shadow-emerald-600/20"
                >
                  <Download size={14} />
                  PDF
                </button>
                <button 
                  onClick={handleDownloadWord} 
                  disabled={exportingWord}
                  className="px-3.5 py-2 sm:px-4 sm:py-2.5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl font-bold uppercase tracking-wider text-[11px] whitespace-nowrap shrink-0 transition-all border-none flex items-center gap-1.5 shadow-md shadow-blue-700/20"
                  title="Download NaCCA-compliant Word Document (.docx)"
                >
                  <FileText size={14} />
                  {exportingWord ? "Word..." : "Word (.docx)"}
                </button>
                <a 
                  href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                    `Hi colleague! I generated a high-quality, NaCCA curriculum-aligned lesson plan for *${displaySubject}* (${formData.class}) using *TeachSmartGH* by Catalyst Creative.\n\n*Lesson Plan Details:*\n- Subject: ${displaySubject}\n- Class: ${formData.class}\n- Strand: ${formData.strand || "N/A"}\n- Sub-Strand: ${formData.subStrand || "N/A"}\n- Indicator: ${formData.indicator || "N/A"}\n\nJoin me in using AI-powered tools for smarter teaching at: ${window.location.origin}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 sm:px-4 sm:py-2.5 bg-[#25D366] text-white rounded-xl font-bold uppercase tracking-wider text-[11px] whitespace-nowrap shrink-0 hover:bg-[#20ba59] transition-all flex items-center gap-1.5 shadow-md shadow-green-500/10 cursor-pointer"
                >
                  <MessageSquare size={14} />
                  WhatsApp
                </a>
              </div>
            </div>

            {/* Teacher Modification Banner */}
            {hasEdited && (
              <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-2xl flex items-center justify-between text-xs text-emerald-900">
                <div className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-emerald-600" />
                  <span className="font-bold">Custom teacher modifications active! Changes will be included in your PDF and Cloud save.</span>
                </div>
                <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-200/60 px-2 py-0.5 rounded-md">Edited</span>
              </div>
            )}

            {/* TEACHER WORKFLOW BANNER: NEXT STEP LESSON NOTES */}
            <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 border border-emerald-500/30 rounded-2xl sm:rounded-3xl p-4 sm:p-5 text-white shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
                  <BookOpen size={20} />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-400/20 text-emerald-300 border border-emerald-400/30 px-2 py-0.5 rounded-full">
                      Workflow Progression
                    </span>
                    <span className="text-xs text-slate-400 font-medium">Step 2: Lesson Notes</span>
                  </div>
                  <h4 className="text-sm sm:text-base font-bold text-white">Generate Pupil Lesson Notes for this Lesson Plan</h4>
                  <p className="text-xs text-slate-300 max-w-2xl mt-0.5 leading-relaxed">
                    Instantly transfer this lesson's NaCCA indicators, Ghanaian context, and TLMs into pupil-ready lesson notes with structured summaries and chalkboard exercises.
                  </p>
                </div>
              </div>
              <button
                onClick={handleGenerateLessonNotes}
                className="w-full sm:w-auto px-4 py-2.5 sm:px-5 sm:py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl sm:rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 transition-all shrink-0 hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>Generate Notes Now</span>
                <ArrowRight size={15} />
              </button>
            </div>

            {/* EDIT MODE FORM */}
            {isEditing ? (
              <div className="bg-white p-6 lg:p-8 rounded-3xl shadow-xl border border-amber-200/80 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4 border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                      <Edit3 size={18} />
                    </div>
                    <div>
                      <h2 className="text-lg font-black text-slate-900">Edit Lesson Plan Content</h2>
                      <p className="text-xs text-slate-500">Fine-tune pedagogical details, activities, or local examples before saving or downloading PDF.</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-all flex items-center gap-1.5 self-start sm:self-auto"
                  >
                    <Check size={14} />
                    Done Editing & Preview
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-3">
                  <div>
                    <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">
                      Week No.
                    </label>
                    <input
                      type="text"
                      value={formData.weekNumber}
                      onChange={(e) => {
                        const newW = e.target.value;
                        setFormData((prev) => ({ ...prev, weekNumber: newW }));
                        setResult((prev: any) => ({ ...prev, weekNumber: newW }));
                        setHasEdited(true);
                      }}
                      placeholder="e.g. 1, 2"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:bg-white focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">
                      Day(s)
                    </label>
                    <input
                      type="text"
                      value={formData.day}
                      onChange={(e) => {
                        const newDay = e.target.value;
                        const calculatedDate = calculateLessonDateFromWeekEnding(formData.weekEnding, newDay);
                        setFormData((prev) => ({ ...prev, day: newDay, date: calculatedDate }));
                        setHasEdited(true);
                      }}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">
                      Week Ending
                    </label>
                    <input
                      type="date"
                      value={result.weekEnding || formData.weekEnding}
                      onChange={(e) => {
                        const newWE = e.target.value;
                        const calculatedDate = calculateLessonDateFromWeekEnding(newWE, formData.selectedDays || [formData.day]);
                        setResult((prev: any) => ({ ...prev, weekEnding: newWE }));
                        setFormData((prev) => ({ ...prev, weekEnding: newWE, date: calculatedDate }));
                        setHasEdited(true);
                      }}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">
                      Date(s)
                    </label>
                    <input
                      type="text"
                      value={formData.date}
                      onChange={(e) => {
                        setFormData((prev) => ({ ...prev, date: e.target.value }));
                        setHasEdited(true);
                      }}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:border-emerald-500 focus:outline-none font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">
                      Period / Duration
                    </label>
                    <input
                      type="text"
                      value={formData.period}
                      onChange={(e) => {
                        setFormData((prev) => ({ ...prev, period: e.target.value }));
                        setHasEdited(true);
                      }}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">
                      Lesson No.
                    </label>
                    <input
                      type="text"
                      value={formData.lesson}
                      onChange={(e) => {
                        setFormData((prev) => ({ ...prev, lesson: e.target.value }));
                        setHasEdited(true);
                      }}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">
                      Strand
                    </label>
                    <input
                      type="text"
                      value={result.strand || formData.strand || ''}
                      onChange={(e) => {
                        setResult((prev: any) => ({ ...prev, strand: e.target.value }));
                        setFormData((prev) => ({ ...prev, strand: e.target.value }));
                        setHasEdited(true);
                      }}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:bg-white focus:border-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">
                      Sub-Strand
                    </label>
                    <input
                      type="text"
                      value={result.subStrand || formData.subStrand || ''}
                      onChange={(e) => {
                        setResult((prev: any) => ({ ...prev, subStrand: e.target.value }));
                        setFormData((prev) => ({ ...prev, subStrand: e.target.value }));
                        setHasEdited(true);
                      }}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:bg-white focus:border-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">
                      Indicator Code / Reference
                    </label>
                    <input
                      type="text"
                      value={result.indicatorCode || formData.indicator || ''}
                      onChange={(e) => {
                        setResult((prev: any) => ({ ...prev, indicatorCode: e.target.value }));
                        setHasEdited(true);
                      }}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:bg-white focus:border-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">
                      Content Standard Code
                    </label>
                    <input
                      type="text"
                      value={result.contentStandardCode || formData.contentStandard || ''}
                      onChange={(e) => {
                        setResult((prev: any) => ({ ...prev, contentStandardCode: e.target.value }));
                        setHasEdited(true);
                      }}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:bg-white focus:border-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">
                      Core Competencies
                    </label>
                    <input
                      type="text"
                      value={result.coreCompetencies || ''}
                      onChange={(e) => {
                        setResult((prev: any) => ({ ...prev, coreCompetencies: e.target.value }));
                        setHasEdited(true);
                      }}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:bg-white focus:border-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">
                      Performance Indicator
                    </label>
                    <textarea
                      rows={2}
                      value={result.performanceIndicator || formData.mainObjective || ''}
                      onChange={(e) => {
                        setResult((prev: any) => ({ ...prev, performanceIndicator: e.target.value }));
                        setHasEdited(true);
                      }}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:bg-white focus:border-emerald-500 focus:outline-none leading-relaxed"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">
                      Teaching & Learning Resources (TLRs)
                    </label>
                    <textarea
                      rows={2}
                      value={result.tlrs || ''}
                      onChange={(e) => {
                        setResult((prev: any) => ({ ...prev, tlrs: e.target.value }));
                        setHasEdited(true);
                      }}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:bg-white focus:border-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">
                      Key Vocabulary / Key Words
                    </label>
                    <textarea
                      rows={2}
                      value={result.keyWords || ''}
                      onChange={(e) => {
                        setResult((prev: any) => ({ ...prev, keyWords: e.target.value }));
                        setHasEdited(true);
                      }}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:bg-white focus:border-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">
                      Curriculum References
                    </label>
                    <input
                      type="text"
                      value={result.references || ''}
                      onChange={(e) => {
                        setResult((prev: any) => ({ ...prev, references: e.target.value }));
                        setHasEdited(true);
                      }}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:bg-white focus:border-emerald-500 focus:outline-none"
                    />
                  </div>

                  {/* 3 Phases */}
                  <div className="md:col-span-2 space-y-4 pt-2">
                    <div className="border-t border-slate-100 pt-4">
                      <label className="block text-xs font-black text-amber-700 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                        <span>Phase 1: Starter / Introduction (10 mins)</span>
                        <span className="text-[10px] text-slate-400 font-normal">Supports Markdown</span>
                      </label>
                      <textarea
                        rows={4}
                        value={result.phase1 || ''}
                        onChange={(e) => {
                          setResult((prev: any) => ({ ...prev, phase1: e.target.value }));
                          setHasEdited(true);
                        }}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono text-slate-800 focus:bg-white focus:border-amber-500 focus:outline-none leading-relaxed"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-black text-blue-700 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                        <span>Phase 2: Main Teaching & Learning Activities (40 mins)</span>
                        <span className="text-[10px] text-slate-400 font-normal">Supports Markdown</span>
                      </label>
                      <textarea
                        rows={8}
                        value={result.phase2 || ''}
                        onChange={(e) => {
                          setResult((prev: any) => ({ ...prev, phase2: e.target.value }));
                          setHasEdited(true);
                        }}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono text-slate-800 focus:bg-white focus:border-blue-500 focus:outline-none leading-relaxed"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-black text-emerald-700 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                        <span>Phase 3: Plenary / Reflection / Assessment (10 mins)</span>
                        <span className="text-[10px] text-slate-400 font-normal">Supports Markdown</span>
                      </label>
                      <textarea
                        rows={4}
                        value={result.phase3 || ''}
                        onChange={(e) => {
                          setResult((prev: any) => ({ ...prev, phase3: e.target.value }));
                          setHasEdited(true);
                        }}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono text-slate-800 focus:bg-white focus:border-emerald-500 focus:outline-none leading-relaxed"
                      />
                    </div>
                  </div>

                  {/* Differentiation */}
                  <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-slate-100 pt-4">
                    <div>
                      <label className="block text-xs font-black text-red-700 uppercase tracking-wider mb-1.5">
                        Differentiation (Struggling Learners)
                      </label>
                      <textarea
                        rows={3}
                        value={result.differentiation?.strugglingLearners?.activities || ''}
                        onChange={(e) => {
                          setResult((prev: any) => ({
                            ...prev,
                            differentiation: {
                              ...prev.differentiation,
                              strugglingLearners: {
                                ...prev.differentiation?.strugglingLearners,
                                activities: e.target.value
                              }
                            }
                          }));
                          setHasEdited(true);
                        }}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:border-red-400 focus:outline-none leading-relaxed"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-black text-indigo-700 uppercase tracking-wider mb-1.5">
                        Differentiation (Advanced / Gifted Learners)
                      </label>
                      <textarea
                        rows={3}
                        value={result.differentiation?.advancedLearners?.activities || ''}
                        onChange={(e) => {
                          setResult((prev: any) => ({
                            ...prev,
                            differentiation: {
                              ...prev.differentiation,
                              advancedLearners: {
                                ...prev.differentiation?.advancedLearners,
                                activities: e.target.value
                              }
                            }
                          }));
                          setHasEdited(true);
                        }}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:border-indigo-400 focus:outline-none leading-relaxed"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 pt-4">
                  <span className="text-xs text-slate-500 font-medium">
                    Changes are automatically applied to the active lesson plan.
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setIsEditing(false)}
                      className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all shadow-md"
                    >
                      <Check size={14} />
                      Done & View Layout
                    </button>
                    <button
                      onClick={handleDownloadPDF}
                      className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all shadow-md"
                    >
                      <Download size={14} />
                      PDF
                    </button>
                    <button
                      onClick={handleDownloadWord}
                      disabled={exportingWord}
                      className="px-5 py-2.5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all shadow-md"
                      title="Download NaCCA-compliant Word Document (.docx)"
                    >
                      <FileText size={14} />
                      {exportingWord ? "Word..." : "Word (.docx)"}
                    </button>
                  </div>
                </div>
              </div>
            ) : null}

            {/* Quick Layout Preview Switcher */}
            {!isEditing && (
            <>
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-sm">
              <div className="flex items-center gap-2 pl-2">
                <Layout size={16} className="text-emerald-750 font-bold" />
                <span className="text-xs font-bold text-slate-700">Preview Layout Theme Style:</span>
              </div>
              <div className="flex flex-wrap bg-white p-1 rounded-xl border border-slate-150 gap-1 self-start md:self-auto">
                {[
                  { id: 'ges-standard', name: '⭐ Official GES Notebook', icon: Layers },
                  { id: 'comprehensive', name: 'Comprehensive', icon: Layers },
                  { id: 'minimalist', name: 'Minimalist Format', icon: AlignLeft },
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

            {/* OFFICIAL GES / NACCA NOTEBOOK PREVIEW (EXACT 1:1 PHOTO MATCH) */}
            {formData.layoutStyle === 'ges-standard' && (
              <div className="bg-white p-4 sm:p-6 lg:p-8 rounded-2xl shadow-md border-2 border-slate-800 space-y-6 text-slate-900 font-sans">
                {/* TeachSmartGH Top Branding Banner */}
                <div className="bg-[#001C3D] text-white p-3 sm:p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-sm border-b-2 border-[#FCD116]">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-base tracking-tight text-white">
                        TeachSmart<span className="text-[#FCD116]">GH</span>
                      </span>
                      <span className="text-[10px] text-slate-300 border-l border-slate-700 pl-2 hidden md:inline">
                        AI-Powered Teaching. Smarter Tomorrow.
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400 font-medium mt-0.5">
                      Parent Brand: Catalyst Creative • Official Lesson Preparation Suite
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#006B3F]/30 border border-[#006B3F] text-[#FCD116] text-[11px] font-bold">
                      <span>🇬🇭</span> NaCCA / GES Curriculum Aligned
                    </span>
                  </div>
                </div>

                {/* Official GES Header Block */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b pb-4 border-slate-300">
                  <div className="flex-1">
                    <div className="flex items-baseline gap-2">
                      <span className="text-xs font-black uppercase tracking-wider text-slate-900">SUBJECT:</span>
                      <span className="text-sm font-bold uppercase underline decoration-slate-400 underline-offset-4 text-slate-900">
                        {displaySubject}
                      </span>
                    </div>
                  </div>
                  
                  <div className="text-center flex-1">
                    <h2 className="text-xl sm:text-2xl font-black uppercase tracking-wider text-slate-900">
                      {formatWeekLessonPlanTitle(result.weekNumber || formData.weekNumber || result.week || '1')}
                    </h2>
                  </div>

                  <div className="flex flex-col items-start md:items-end flex-1 gap-1 text-xs font-bold">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-900 font-black uppercase">CLASS:</span>
                      <span className="underline decoration-slate-400 underline-offset-4 uppercase">{formData.class}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-900 font-black uppercase">CLASS SIZE:</span>
                      <span className="underline decoration-slate-400 underline-offset-4">{result.classSize || formData.classSize}</span>
                    </div>
                  </div>
                </div>

                {/* Table 1: Metadata & Curriculum Structure Grid */}
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border-2 border-slate-900 text-xs">
                    <tbody>
                      {/* Row 1: Day | WEEK ENDING: | Date | Period | Lesson */}
                      <tr className="border-b-2 border-slate-900 divide-x-2 divide-slate-900">
                        <td className="p-2.5 font-bold bg-slate-50 w-24 text-center">
                          <div className="text-[10px] font-black text-slate-900 uppercase tracking-wider">Day</div>
                          <div className="text-sm font-extrabold text-slate-900">{formData.day}</div>
                        </td>
                        <td className="p-2.5 font-bold">
                          <div className="text-[10px] font-black text-slate-900 uppercase tracking-wider">WEEK ENDING:</div>
                          <div className="text-sm font-extrabold text-slate-900">{result.weekEnding || formData.weekEnding}</div>
                        </td>
                        <td className="p-2.5 font-bold bg-slate-50 w-32 text-center">
                          <div className="text-[10px] font-black text-slate-900 uppercase tracking-wider">Date</div>
                          <div className="text-sm font-extrabold text-slate-900">{formData.date || formData.weekEnding}</div>
                        </td>
                        <td className="p-2.5 font-bold bg-slate-50 w-28 text-center">
                          <div className="text-[10px] font-black text-slate-900 uppercase tracking-wider">Period</div>
                          <div className="text-sm font-extrabold text-slate-900">{formData.period || formData.duration}</div>
                        </td>
                        <td className="p-2.5 font-bold bg-slate-50 w-28 text-center">
                          <div className="text-[10px] font-black text-slate-900 uppercase tracking-wider">Lesson</div>
                          <div className="text-sm font-extrabold text-slate-900">{formData.lesson || '1'}</div>
                        </td>
                      </tr>

                      {/* Row 2: Strand | Sub-strand */}
                      <tr className="border-b-2 border-slate-900 divide-x-2 divide-slate-900">
                        <td colSpan={2} className="p-3 align-top">
                          <div className="text-[10px] font-black uppercase text-slate-900 tracking-wider">Strand</div>
                          <div className="text-sm font-bold text-slate-900 mt-0.5">{result.strand || formData.strand || 'N/A'}</div>
                        </td>
                        <td colSpan={3} className="p-3 align-top">
                          <div className="text-[10px] font-black uppercase text-slate-900 tracking-wider">Sub-strand</div>
                          <div className="text-sm font-bold text-slate-900 mt-0.5">{result.subStrand || formData.subStrand || 'N/A'}</div>
                        </td>
                      </tr>

                      {/* Row 3: Indicator (code) | Content standard (code) */}
                      <tr className="border-b-2 border-slate-900 divide-x-2 divide-slate-900">
                        <td colSpan={2} className="p-3 align-top">
                          <div className="text-[10px] font-black uppercase text-slate-900 tracking-wider">Indicator (code)</div>
                          <div className="text-sm font-bold text-slate-900 font-mono mt-0.5">{result.indicatorCode || formData.indicator || 'N/A'}</div>
                        </td>
                        <td colSpan={3} className="p-3 align-top">
                          <div className="text-[10px] font-black uppercase text-slate-900 tracking-wider">Content standard (code)</div>
                          <div className="text-sm font-bold text-slate-900 font-mono mt-0.5">{result.contentStandardCode || formData.contentStandard || 'N/A'}</div>
                        </td>
                      </tr>

                      {/* Row 4: Performance indicator (Full Width) */}
                      <tr className="border-b-2 border-slate-900">
                        <td colSpan={5} className="p-3 align-top">
                          <div className="text-[10px] font-black uppercase text-slate-900 tracking-wider">Performance indicator</div>
                          <div className="text-sm text-slate-900 font-medium mt-0.5 leading-relaxed">
                            {result.performanceIndicator || formData.mainObjective || 'Learners can demonstrate mastery of stated indicators.'}
                          </div>
                        </td>
                      </tr>

                      {/* Row 5: Core competencies | Key words */}
                      <tr className="border-b-2 border-slate-900 divide-x-2 divide-slate-900">
                        <td colSpan={3} className="p-3 align-top">
                          <div className="text-[10px] font-black uppercase text-slate-900 tracking-wider">Core competencies</div>
                          <div className="text-xs text-slate-800 font-medium mt-0.5 leading-relaxed">
                            {result.coreCompetencies || 'Critical Thinking and Problem Solving (CP), Communication and Collaboration (CC)'}
                          </div>
                        </td>
                        <td colSpan={2} className="p-3 align-top">
                          <div className="text-[10px] font-black uppercase text-slate-900 tracking-wider">Key words</div>
                          <div className="text-xs text-slate-800 font-medium mt-0.5 leading-relaxed">
                            {result.keyWords || 'N/A'}
                          </div>
                        </td>
                      </tr>

                      {/* Row 6: T.L.R.(s): | Ref: */}
                      <tr className="divide-x-2 border-b-2 border-slate-900">
                        <td colSpan={3} className="p-3 align-top">
                          <div className="text-[10px] font-black uppercase text-slate-900 tracking-wider">T.L.R.(s):</div>
                          <div className="text-xs text-slate-800 font-medium mt-0.5 leading-relaxed">
                            {result.tlrs || 'Curriculum Handbooks, Realia, Chalkboard illustrations'}
                          </div>
                        </td>
                        <td colSpan={2} className="p-3 align-top">
                          <div className="text-[10px] font-black uppercase text-slate-900 tracking-wider">Ref:</div>
                          <div className="text-xs text-slate-800 font-medium mt-0.5 leading-relaxed">
                            {result.references || 'NaCCA Standard-Based Curriculum Guidelines'}
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Table 2: 3-Phase Delivery Table */}
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border-2 border-slate-900 text-xs">
                    <thead>
                      <tr className="border-b-2 border-slate-900 bg-slate-100 divide-x-2 divide-slate-900">
                        <th className="p-2.5 text-center font-black uppercase w-24 text-slate-900 tracking-wider">DAY</th>
                        <th className="p-2.5 text-left font-black uppercase text-slate-900 w-1/4">
                          <div className="font-black text-xs text-slate-900 uppercase tracking-wide">Phase 1: Starter</div>
                          <span className="font-bold text-[10px] text-slate-600 block mt-0.5">(preparing the brain for learning):</span>
                        </th>
                        <th className="p-2.5 text-left font-black uppercase text-slate-900 w-5/12">
                          <div className="font-black text-xs text-slate-900 uppercase tracking-wide">Phase 2: Main</div>
                          <span className="font-bold text-[10px] text-slate-600 block mt-0.5">(new learning including assessment):</span>
                        </th>
                        <th className="p-2.5 text-left font-black uppercase text-slate-900 w-1/4">
                          <div className="font-black text-xs text-slate-900 uppercase tracking-wide">Phase 3: Plenary</div>
                          <span className="font-bold text-[10px] text-slate-600 block mt-0.5">(Plenary / Reflections):</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {(() => {
                        const dayPhases = buildMultiDayLessonPhases({
                          day: formData.day,
                          weekEnding: result.weekEnding || formData.weekEnding,
                          duration: formData.duration,
                          phase1: result.phase1,
                          phase2: result.phase2,
                          phase3: result.phase3,
                          differentiation: result.differentiation
                        });

                        return dayPhases.map((phase, pIdx) => (
                          <tr key={pIdx} className="divide-x-2 border-b-2 border-slate-900 align-top">
                            <td className="p-3 text-center bg-slate-50 font-bold w-24">
                              <div className="text-sm text-slate-900 font-extrabold">{phase.dayName}</div>
                              {phase.dayDate && (
                                <div className="text-[10px] text-slate-500 font-semibold mt-0.5">{phase.dayDate}</div>
                              )}
                              <div className="text-[11px] text-slate-600 font-bold mt-1">({phase.duration || formData.duration || '60 mins'})</div>
                            </td>
                            <td className="p-3 text-slate-800 leading-relaxed prose prose-xs max-w-none">
                              <SafeMarkdown>{phase.starter}</SafeMarkdown>
                            </td>
                            <td className="p-3 text-slate-800 leading-relaxed prose prose-xs max-w-none space-y-3">
                              <SafeMarkdown>{phase.main}</SafeMarkdown>
                              
                              {/* Differentiation inside Main Phase if available */}
                              {phase.differentiation && (
                                <div className="mt-4 pt-3 border-t border-slate-200 text-[11px] not-prose space-y-1.5 bg-slate-50 p-2.5 rounded-lg">
                                  <span className="font-black uppercase text-[10px] text-emerald-900 block tracking-wider">Inclusive Differentiation:</span>
                                  {phase.differentiation.strugglingLearners?.activities && (
                                    <p><strong className="text-red-700 font-black">Remedial / Struggling:</strong> {phase.differentiation.strugglingLearners.activities}</p>
                                  )}
                                  {phase.differentiation.averageLearners?.activities && (
                                    <p><strong className="text-emerald-700 font-black">Core Class:</strong> {phase.differentiation.averageLearners.activities}</p>
                                  )}
                                  {phase.differentiation.advancedLearners?.activities && (
                                    <p><strong className="text-blue-700 font-black">Advanced / Extension:</strong> {phase.differentiation.advancedLearners.activities}</p>
                                  )}
                                </div>
                              )}
                            </td>
                            <td className="p-3 text-slate-800 leading-relaxed prose prose-xs max-w-none">
                              <SafeMarkdown>{phase.plenary}</SafeMarkdown>
                            </td>
                          </tr>
                        ));
                      })()}
                    </tbody>
                  </table>
                </div>

                {/* OFFICIAL GES TEACHER & HEADTEACHER SIGNATURE / ENDORSEMENT SECTION */}
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border-2 border-slate-900 text-xs">
                    <thead>
                      <tr className="border-b-2 border-slate-900 bg-slate-100 divide-x-2 divide-slate-900">
                        <th className="p-2.5 text-left font-black uppercase text-slate-900 w-1/2 tracking-wider">
                          TEACHER DECLARATION / SUBMISSION
                        </th>
                        <th className="p-2.5 text-left font-black uppercase text-slate-900 w-1/2 tracking-wider">
                          HEADTEACHER / SUPERVISOR VETTING & ENDORSEMENT
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="divide-x-2 border-slate-900 align-top">
                        <td className="p-3.5 text-slate-800 space-y-2 bg-white">
                          <div>
                            <span className="text-[10px] font-black uppercase text-slate-900 block tracking-wider">Teacher's Name</span>
                            <div className="border-b border-dashed border-slate-400 h-5 mt-0.5" />
                          </div>
                          <div className="grid grid-cols-2 gap-3 pt-1">
                            <div>
                              <span className="text-[10px] font-black uppercase text-slate-900 block tracking-wider">Signature</span>
                              <div className="border-b border-dashed border-slate-400 h-5 mt-0.5" />
                            </div>
                            <div>
                              <span className="text-[10px] font-black uppercase text-slate-900 block tracking-wider">Date</span>
                              <div className="border-b border-dashed border-slate-400 h-5 mt-0.5" />
                            </div>
                          </div>
                          <div className="text-[10px] text-slate-600 font-bold pt-1 flex items-center gap-4">
                            <label className="flex items-center gap-1.5 cursor-pointer">
                              <input type="checkbox" className="rounded text-emerald-600 focus:ring-emerald-500" />
                              <span>Submitted on Time</span>
                            </label>
                            <label className="flex items-center gap-1.5 cursor-pointer">
                              <input type="checkbox" className="rounded text-amber-600 focus:ring-amber-500" />
                              <span>Revision Required</span>
                            </label>
                          </div>
                        </td>
                        <td className="p-3.5 text-slate-800 space-y-2 bg-white">
                          <div>
                            <span className="text-[10px] font-black uppercase text-slate-900 block tracking-wider">Headteacher / Supervisor Name</span>
                            <div className="border-b border-dashed border-slate-400 h-5 mt-0.5" />
                          </div>
                          <div className="grid grid-cols-2 gap-3 pt-1">
                            <div>
                              <span className="text-[10px] font-black uppercase text-slate-900 block tracking-wider">Signature / Stamp</span>
                              <div className="border-b border-dashed border-slate-400 h-5 mt-0.5" />
                            </div>
                            <div>
                              <span className="text-[10px] font-black uppercase text-slate-900 block tracking-wider">Date</span>
                              <div className="border-b border-dashed border-slate-400 h-5 mt-0.5" />
                            </div>
                          </div>
                          <div className="text-[10px] text-slate-500 pt-1 flex items-center gap-4">
                            <label className="flex items-center gap-1.5 cursor-pointer">
                              <input type="checkbox" className="rounded text-emerald-600 focus:ring-emerald-500" />
                              <span>Approved for Delivery</span>
                            </label>
                            <label className="flex items-center gap-1.5 cursor-pointer">
                              <input type="checkbox" className="rounded text-blue-600 focus:ring-blue-500" />
                              <span>Inspected & Monitored</span>
                            </label>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* TEACHING WORKFLOW ACTIONS HUB */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-white shadow-xl space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                        <Sparkles size={20} />
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-white">Next Step in Lesson Preparation</h3>
                        <p className="text-xs text-slate-400">Continue your teaching workflow with matched curriculum materials</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        onClick={handleDownloadPDF}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
                      >
                        <Download size={14} />
                        Download Official GES PDF
                      </button>
                      <button
                        onClick={handleDownloadWord}
                        disabled={exportingWord}
                        className="px-4 py-2 bg-blue-700 hover:bg-blue-600 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
                        title="Download NaCCA-compliant Word Document (.docx)"
                      >
                        <FileText size={14} />
                        {exportingWord ? "Exporting Word..." : "Word (.docx)"}
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    <div 
                      onClick={handleGenerateLessonNotes}
                      className="bg-slate-800/90 hover:bg-slate-800 border border-emerald-500/40 hover:border-emerald-500 p-4.5 rounded-2xl cursor-pointer transition-all flex items-start gap-3.5 group shadow-sm hover:shadow-md"
                    >
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                        <BookOpen size={20} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">Generate Student Lesson Notes</h4>
                          <ArrowRight size={15} className="text-emerald-400 group-hover:translate-x-1 transition-transform" />
                        </div>
                        <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                          Create pupil notes, chalkboard summaries, key definitions, and practice exercises for this lesson.
                        </p>
                      </div>
                    </div>

                    <div 
                      onClick={() => navigate('/assignments', {
                        state: {
                          preloaded: {
                            level: formData.level,
                            class: formData.class,
                            subject: formData.subject,
                            topic: formData.strand ? `${formData.strand} - ${formData.subStrand || ''}` : '',
                            indicator: formData.indicator
                          }
                        }
                      })}
                      className="bg-slate-800/90 hover:bg-slate-800 border border-slate-700/60 hover:border-slate-600 p-4.5 rounded-2xl cursor-pointer transition-all flex items-start gap-3.5 group shadow-sm hover:shadow-md"
                    >
                      <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                        <FileText size={20} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-bold text-white group-hover:text-blue-300 transition-colors">Create Homework / Assignment</h4>
                          <ArrowRight size={15} className="text-blue-400 group-hover:translate-x-1 transition-transform" />
                        </div>
                        <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                          Generate an assessment rubric and take-home assignment matching this lesson's indicator.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

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
                    <span className="font-bold text-slate-400 block uppercase text-[9px] tracking-wider">Performance Indicator</span>
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
                          {safeListItems(result.keyWords).map((word: string, i: number) => (
                            <span key={i} className="px-2 py-1 bg-white border border-slate-200 rounded text-[10px] font-medium text-slate-600">
                              {word}
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
                          {safeListItems(result.tlrs).map((item: string, idx: number) => (
                            <span key={idx} className="bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded text-xs font-bold border border-indigo-100">
                              🧮 {item}
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

                  {/* NEXT ACTIONS IN TEACHING WORKFLOW */}
                  <section className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-white shadow-2xl space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                          <Sparkles size={20} />
                        </div>
                        <div>
                          <h3 className="text-base font-bold text-white">Next Step in Lesson Preparation</h3>
                          <p className="text-xs text-slate-400">Continue your teaching workflow with matched curriculum materials</p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                      <div 
                        onClick={handleGenerateLessonNotes}
                        className="bg-slate-800/90 hover:bg-slate-800 border border-emerald-500/40 hover:border-emerald-500 p-4.5 rounded-2xl cursor-pointer transition-all flex items-start gap-3.5 group shadow-sm hover:shadow-md"
                      >
                        <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                          <BookOpen size={20} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h4 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">Generate Student Lesson Notes</h4>
                            <ArrowRight size={15} className="text-emerald-400 group-hover:translate-x-1 transition-transform" />
                          </div>
                          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                            Create pupil notes, chalkboard summaries, key definitions, and practice exercises for this lesson.
                          </p>
                        </div>
                      </div>

                      <div 
                        onClick={() => navigate('/assignments', {
                          state: {
                            preloaded: {
                              level: formData.level,
                              class: formData.class,
                              subject: formData.subject,
                              topic: formData.strand ? `${formData.strand} - ${formData.subStrand || ''}` : '',
                              indicator: formData.indicator
                            }
                          }
                        })}
                        className="bg-slate-800/90 hover:bg-slate-800 border border-slate-700/60 hover:border-slate-600 p-4.5 rounded-2xl cursor-pointer transition-all flex items-start gap-3.5 group shadow-sm hover:shadow-md"
                      >
                        <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                          <FileText size={20} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h4 className="text-sm font-bold text-white group-hover:text-blue-300 transition-colors">Create Homework / Assignment</h4>
                            <ArrowRight size={15} className="text-blue-400 group-hover:translate-x-1 transition-transform" />
                          </div>
                          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                            Generate an assessment rubric and take-home assignment matching this lesson's indicator.
                          </p>
                        </div>
                      </div>
                    </div>
                  </section>
                </div>
              </div>
            )}
            </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <CurriculumReferenceModal
        isOpen={isStandardsModalOpen}
        onClose={() => setIsStandardsModalOpen(false)}
        onSelectIndicator={handleIndicatorSelected}
        onSelectIndicators={handleMultipleIndicatorsSelectedFromModal}
        initialLevel={formData.level}
        initialClass={formData.class}
        initialSubject={formData.subject}
        initialStrand={formData.strand}
        initialSubStrand={formData.subStrand}
      />
    </div>
  );
};

export default LessonPlanGenerator;
