import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Save, Download, RefreshCw, ChevronRight, ChevronLeft, CheckCircle, BookOpen, MapPin, Quote } from 'lucide-react';
import { generateNote } from '../../lib/gemini';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { cn } from '../../lib/utils';
import { SafeMarkdown } from '../common/SafeMarkdown';
import 'highlight.js/styles/github.css';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { toast } from 'react-hot-toast';
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
  FRENCH_B4_B6_LESSON_FRAMES
} from '../../constants';

const COMPETENCIES = [
  { code: "CP", label: "Critical Thinking and Problem Solving" },
  { code: "CI", label: "Creativity and Innovation" },
  { code: "CC", label: "Communication and Collaboration" },
  { code: "CG", label: "Cultural Identity and Global Citizenship" },
  { code: "PL", label: "Personal Development and Leadership" },
  { code: "DL", label: "Digital Literacy" }
];

const NoteGenerator = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [selectedCompetencies, setSelectedCompetencies] = useState<string[]>(["CP", "CC"]);

  // Helpers for context-aware lookup and fallbacks
  const getSubjectStrands = (subj: string, lvl: string) => {
    if (subj === 'English' && lvl === 'JHS') {
      return ["Oral Language", "Reading", "Grammar Usage", "Writing", "Literature"];
    }
    if (subj === 'Ghanaian Language' && lvl === 'JHS') {
      return ["Customs and Institutions", "Listening and Speaking", "Reading", "Language and Usage", "Composition Writing", "Literature"];
    }
    return SUBJECT_STRANDS[subj] || [];
  };

  const getLookupStrand = (subject: string, strand: string, level?: string) => {
    const currentLevel = level || (typeof formData !== 'undefined' ? formData?.level : 'JHS');
    if (subject === 'Our World Our People') {
      if (strand === 'All Around Us') return 'All Around Us OWOP';
      if (strand === 'My Global Community') return 'My Global Community OWOP';
    }
    if (subject === 'English' && currentLevel === 'JHS') {
      return `${strand} JHS`;
    }
    if (subject === 'Ghanaian Language' && currentLevel === 'JHS') {
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
    const lookupStrand = getLookupStrand(subj, strand, lvl);
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
  
  const [formData, setFormData] = useState(() => {
    const initialLevel = 'JHS';
    const initialClass = 'Basic 7';
    const initialSubject = 'Science';
    const initialStrands = SUBJECT_STRANDS[initialSubject] || [];
    const initialStrand = initialStrands[0] || '';
    const lookupStrand = getLookupStrand(initialSubject, initialStrand, initialLevel);
    const initialSubStrands = getSubjectSubStrands(initialSubject, initialStrand, initialLevel);
    const initialSubStrand = initialSubStrands[0] || '';
    const initialStandards = (SUB_STRAND_STANDARDS[lookupStrand]?.[initialSubStrand] || SUB_STRAND_STANDARDS[initialStrand]?.[initialSubStrand]) || [];
    const initialStandard = initialStandards[0] || '';
    const initialIndicators = STANDARD_INDICATORS[initialStandard] || getFallbackIndicators(initialStandard);
    const initialIndicator = initialIndicators[0] || '';

    return {
      level: initialLevel,
      class: initialClass,
      subject: initialSubject,
      strand: initialStrand,
      subStrand: initialSubStrand,
      contentStandard: initialStandard,
      indicator: initialIndicator,
      coreCompetencies: 'Critical Thinking and Problem Solving (CP), Communication and Collaboration (CC)',
      week: 'Week 1',
      duration: '60 minutes',
      term: 'Term 1',
      academicYear: '2025/2026',
      locality: profile?.locality || 'Urban',
      specificLocality: profile?.town || '',
      differentiation: '',
      objectives: '',
    };
  });

  const [result, setResult] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  // Helper to find pre-defined lesson frames
  const getActiveFrame = () => {
    const indicatorId = formData.indicator.split(':')[0].trim();
    const standardId = formData.contentStandard.split(':')[0].trim();
    
    const allFrames: Record<string, any> = {
      ...SCIENCE_B7_LESSON_FRAMES,
      ...SCIENCE_B8_LESSON_FRAMES,
      ...SCIENCE_B9_LESSON_FRAMES,
      ...MATH_B7_LESSON_FRAMES,
      ...ENGLISH_B7_LESSON_FRAMES,
      ...FRENCH_B4_B6_LESSON_FRAMES
    };
    
    return allFrames[indicatorId] || allFrames[standardId] || null;
  };

  // Selectors
  const currentClasses = CLASSES_BY_LEVEL[formData.level] || [];
  const currentStrands = getSubjectStrands(formData.subject, formData.level);
  const lookupStrand = getLookupStrand(formData.subject, formData.strand);
  const currentSubStrands = getSubjectSubStrands(formData.subject, formData.strand, formData.level);
  const currentStandards = (SUB_STRAND_STANDARDS[lookupStrand]?.[formData.subStrand] || SUB_STRAND_STANDARDS[formData.strand]?.[formData.subStrand]) || [];
  const currentIndicators = STANDARD_INDICATORS[formData.contentStandard] || getFallbackIndicators(formData.contentStandard);

  // Cascading Dropdown Selectors
  const handleLevelChange = (newLevel: string) => {
    const matchedClasses = CLASSES_BY_LEVEL[newLevel] || [];
    const firstClass = matchedClasses[0] || '';
    
    let nextSubject = formData.subject;
    if (newLevel === 'KG') {
      nextSubject = 'Integrated Curriculum (KG)';
    } else if (formData.subject === 'Integrated Curriculum (KG)') {
      nextSubject = 'Science';
    }

    const nextStrands = getSubjectStrands(nextSubject, newLevel);
    const nextStrand = nextStrands[0] || '';
    const lookupNextStrand = getLookupStrand(nextSubject, nextStrand, newLevel);

    const nextSubStrands = getSubjectSubStrands(nextSubject, nextStrand, newLevel);
    const nextSubStrand = nextSubStrands[0] || '';

    const nextStandards = (SUB_STRAND_STANDARDS[lookupNextStrand]?.[nextSubStrand] || SUB_STRAND_STANDARDS[nextStrand]?.[nextSubStrand]) || [];
    const nextStandard = nextStandards[0] || '';

    const nextIndicators = STANDARD_INDICATORS[nextStandard] || getFallbackIndicators(nextStandard);
    const nextIndicator = nextIndicators[0] || '';

    setFormData(prev => ({
      ...prev,
      level: newLevel,
      class: firstClass,
      subject: nextSubject,
      strand: nextStrand,
      subStrand: nextSubStrand,
      contentStandard: nextStandard,
      indicator: nextIndicator,
      objectives: ''
    }));
  };

  const handleClassChange = (newClass: string) => {
    setFormData(prev => ({ ...prev, class: newClass }));
  };

  const handleSubjectChange = (newSubject: string) => {
    const nextStrands = getSubjectStrands(newSubject, formData.level);
    const nextStrand = nextStrands[0] || '';
    const lookupNextStrand = getLookupStrand(newSubject, nextStrand, formData.level);

    const nextSubStrands = getSubjectSubStrands(newSubject, nextStrand, formData.level);
    const nextSubStrand = nextSubStrands[0] || '';

    const nextStandards = (SUB_STRAND_STANDARDS[lookupNextStrand]?.[nextSubStrand] || SUB_STRAND_STANDARDS[nextStrand]?.[nextSubStrand]) || [];
    const nextStandard = nextStandards[0] || '';

    const nextIndicators = STANDARD_INDICATORS[nextStandard] || getFallbackIndicators(nextStandard);
    const nextIndicator = nextIndicators[0] || '';

    setFormData(prev => ({
      ...prev,
      subject: newSubject,
      strand: nextStrand,
      subStrand: nextSubStrand,
      contentStandard: nextStandard,
      indicator: nextIndicator,
      objectives: ''
    }));
  };

  const handleStrandChange = (newStrand: string) => {
    const lookupNewStrand = getLookupStrand(formData.subject, newStrand);
    const nextSubStrands = getSubjectSubStrands(formData.subject, newStrand, formData.level);
    const nextSubStrand = nextSubStrands[0] || '';

    const nextStandards = (SUB_STRAND_STANDARDS[lookupNewStrand]?.[nextSubStrand] || SUB_STRAND_STANDARDS[newStrand]?.[nextSubStrand]) || [];
    const nextStandard = nextStandards[0] || '';

    const nextIndicators = STANDARD_INDICATORS[nextStandard] || getFallbackIndicators(nextStandard);
    const nextIndicator = nextIndicators[0] || '';

    setFormData(prev => ({
      ...prev,
      strand: newStrand,
      subStrand: nextSubStrand,
      contentStandard: nextStandard,
      indicator: nextIndicator,
      objectives: ''
    }));
  };

  const handleSubStrandChange = (newSubStrand: string) => {
    const lookupCurrentStrand = getLookupStrand(formData.subject, formData.strand);
    const nextStandards = (SUB_STRAND_STANDARDS[lookupCurrentStrand]?.[newSubStrand] || SUB_STRAND_STANDARDS[formData.strand]?.[newSubStrand]) || [];
    const nextStandard = nextStandards[0] || '';

    const nextIndicators = STANDARD_INDICATORS[nextStandard] || getFallbackIndicators(nextStandard);
    const nextIndicator = nextIndicators[0] || '';

    setFormData(prev => ({
      ...prev,
      subStrand: newSubStrand,
      contentStandard: nextStandard,
      indicator: nextIndicator,
      objectives: ''
    }));
  };

  const handleContentStandardChange = (newStandard: string) => {
    const nextIndicators = STANDARD_INDICATORS[newStandard] || getFallbackIndicators(newStandard);
    const nextIndicator = nextIndicators[0] || '';

    setFormData(prev => ({
      ...prev,
      contentStandard: newStandard,
      indicator: nextIndicator,
      objectives: ''
    }));
  };

  const handleIndicatorChange = (newIndicator: string) => {
    setFormData(prev => ({
      ...prev,
      indicator: newIndicator,
      objectives: ''
    }));
  };

  // Auto-population effect when Curriculum selects change to use the indicator as the primary learning objective
  React.useEffect(() => {
    if (formData.indicator) {
      const parts = formData.indicator.split(':');
      const text = parts.length > 1 ? parts.slice(1).join(':').trim() : formData.indicator.trim();
      if (text) {
        const formattedText = text.charAt(0).toUpperCase() + text.slice(1);
        setFormData(prev => ({
          ...prev,
          objectives: `By the end of the lesson, the learner will be able to: ${formattedText}`
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        objectives: ''
      }));
    }
  }, [formData.indicator]);

  const handleCompetencyChange = (code: string) => {
    let next: string[];
    if (selectedCompetencies.includes(code)) {
      next = selectedCompetencies.filter(c => c !== code);
    } else {
      next = [...selectedCompetencies, code];
    }
    setSelectedCompetencies(next);
    
    const competencyStrings = next.map(c => {
      const comp = COMPETENCIES.find(comp => comp.code === c);
      return comp ? `${comp.label} (${comp.code})` : '';
    }).filter(Boolean);
    
    setFormData(prev => ({
      ...prev,
      coreCompetencies: competencyStrings.join(', ')
    }));
  };

  const handleGenerate = async () => {
    if (!formData.objectives) {
      toast.error("Please ensure Objectives are filled.");
      return;
    }

    setLoading(true);
    try {
      const data = await generateNote(
        formData,
        { 
          school: profile?.school, 
          district: profile?.district,
          region: profile?.region,
          town: formData.specificLocality || profile?.town,
          locality: formData.locality
        }
      );

      setResult(data);
      setStep(4);
      toast.success("Lesson notes generated successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to generate notes. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!result || !user) return;
    setSaving(true);
    try {
      await addDoc(collection(db, 'notes'), {
        ...result,
        authorId: user.uid,
        level: formData.level,
        class: formData.class,
        subject: formData.subject,
        createdAt: serverTimestamp(),
      });
      toast.success('Notes saved to your cloud library!');
    } catch (err) {
      console.error(err);
      toast.error('Failed to save. Please check your connection.');
    } finally {
      setSaving(false);
    }
  };

  const handleDownloadPDF = () => {
    if (!result) return;
    const doc = new jsPDF();
    
    const marginX = 20;
    let cursorY = 70;
    const pageHeight = doc.internal.pageSize.height;
    const pageWidth = doc.internal.pageSize.width;
    const maxContentY = pageHeight - 32;

    const addNewPage = () => {
      doc.addPage();
      cursorY = 25;
    };

    // Header cover banner on Page 1
    const drawPage1Header = () => {
      doc.setFillColor(0, 28, 61); // TeachSmart Deep Blue
      doc.rect(0, 0, 210, 36, 'F');
      
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(20);
      doc.setFont('helvetica', 'bold');
      doc.text('TEACHSMART GHANA', 105, 15, { align: 'center' });
      
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.text('OFFICIAL NaCCA CURRICULUM COMPLIANT LESSON NOTES', 105, 23, { align: 'center' });
      
      doc.setDrawColor(252, 209, 22); // Ghana Gold
      doc.setLineWidth(1);
      doc.line(30, 29, 180, 29);

      // Metadata Title Block
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      const docTitle = (result.title || 'LESSON NOTES').toUpperCase();
      doc.text(docTitle, 105, 45, { align: 'center' });
      
      doc.setFontSize(8);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(40, 40, 40);
      doc.text(`SUBJECT: ${formData.subject.toUpperCase()} | LEVEL: ${formData.level.toUpperCase()} | CLASS: ${formData.class.toUpperCase()}`, 105, 51, { align: 'center' });
      
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(80, 80, 80);
      const metadataLine2 = `STRAND: ${formData.strand.toUpperCase()} | SUB-STRAND: ${formData.subStrand.toUpperCase()}`;
      const splitMeta = doc.splitTextToSize(metadataLine2, 170);
      doc.text(splitMeta[0] || '', 105, 56, { align: 'center' });
      
      doc.setLineWidth(0.5);
      doc.setDrawColor(220, 220, 220);
      doc.line(20, 60, 190, 60);
    };

    drawPage1Header();
    cursorY = 66;

    const renderParagraph = (textLine: string, x: number, isList: boolean, prefixStr: string) => {
      const rawParts = textLine.split('**');
      const words: { text: string; bold: boolean }[] = [];
      
      for (let j = 0; j < rawParts.length; j++) {
        const textSegment = rawParts[j];
        if (textSegment === '' && j === 0) continue;
        const isBold = j % 2 !== 0;
        
        const segWords = textSegment.split(' ');
        segWords.forEach((word, idx) => {
          if (word === '') {
            words.push({ text: ' ', bold: isBold });
            return;
          }
          
          words.push({ text: word, bold: isBold });
          if (idx < segWords.length - 1) {
            words.push({ text: ' ', bold: isBold });
          }
        });
      }
      
      if (words.length === 0) return;
      
      // Clean up consecutive spaces
      const cleanWords: typeof words = [];
      words.forEach(w => {
        if (w.text === ' ') {
          if (cleanWords.length > 0 && cleanWords[cleanWords.length - 1].text === ' ') {
            return;
          }
        }
        cleanWords.push(w);
      });
      
      const allowedWidth = pageWidth - x - marginX;
      let currentLineWords: typeof cleanWords = [];
      let currentLineWidth = 0;
      
      if (isList && prefixStr) {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10);
        doc.setTextColor(0, 28, 61);
        doc.text(prefixStr, x - 5, cursorY);
      }
      
      const printLineOfWords = (lineW: typeof cleanWords) => {
        let currentX = x;
        if (lineW.length > 0 && lineW[0].text === ' ') {
          lineW.shift();
        }
        lineW.forEach(w => {
          doc.setFont('helvetica', w.bold ? 'bold' : 'normal');
          doc.setFontSize(10);
          doc.setTextColor(w.bold ? 0 : 50);
          doc.text(w.text, currentX, cursorY);
          currentX += doc.getTextWidth(w.text);
        });
        cursorY += 6.5;
      };
      
      for (let k = 0; k < cleanWords.length; k++) {
        const wObj = cleanWords[k];
        doc.setFont('helvetica', wObj.bold ? 'bold' : 'normal');
        doc.setFontSize(10);
        const wWidth = doc.getTextWidth(wObj.text);
        
        if (currentLineWidth + wWidth > allowedWidth) {
          if (cursorY > maxContentY) {
            addNewPage();
          }
          printLineOfWords(currentLineWords);
          if (wObj.text === ' ') {
            currentLineWords = [];
            currentLineWidth = 0;
          } else {
            currentLineWords = [wObj];
            currentLineWidth = wWidth;
          }
        } else {
          currentLineWords.push(wObj);
          currentLineWidth += wWidth;
        }
      }
      
      if (currentLineWords.length > 0) {
        if (cursorY > maxContentY) {
          addNewPage();
        }
        printLineOfWords(currentLineWords);
      }
      cursorY += 1.5;
    };

    const lines = result.content.split('\n');
    let i = 0;
    while (i < lines.length) {
      const origLine = lines[i];
      const line = origLine.trim();
      
      if (line === '') {
        cursorY += 4;
        i++;
        continue;
      }
      
      // Render Markdown Tables using autoTable
      if (line.startsWith('|')) {
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
              styles: { fontSize: 8, cellPadding: 3, valign: 'middle' },
              headStyles: { fillColor: [0, 28, 61], textColor: 255, fontStyle: 'bold', halign: 'center' },
              alternateRowStyles: { fillColor: [248, 250, 252] },
              margin: { left: marginX, right: marginX },
            });
            
            cursorY = (doc as any).lastAutoTable.finalY + 6;
          }
        }
        continue;
      }
      
      if (cursorY > maxContentY) {
        addNewPage();
      }
      
      // Headers
      if (line.startsWith('# ')) {
        const text = line.substring(2).trim();
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(13);
        doc.setTextColor(0, 28, 61);
        cursorY += 4;
        doc.text(text, marginX, cursorY);
        cursorY += 8;
        i++;
        continue;
      } else if (line.startsWith('## ')) {
        const text = line.substring(3).trim();
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(11);
        doc.setTextColor(0, 28, 61);
        cursorY += 3;
        doc.text(text, marginX, cursorY);
        cursorY += 7;
        i++;
        continue;
      } else if (line.startsWith('### ')) {
        const text = line.substring(4).trim();
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10);
        doc.setTextColor(50, 50, 50);
        cursorY += 2;
        doc.text(text, marginX, cursorY);
        cursorY += 6;
        i++;
        continue;
      }
      
      // Horizontal dividers
      if (line === '---' || line === '***' || line === '___') {
        doc.setLineWidth(0.5);
        doc.setDrawColor(220, 220, 220);
        doc.line(marginX, cursorY + 2, pageWidth - marginX, cursorY + 2);
        cursorY += 8;
        i++;
        continue;
      }
      
      // Lists (bullets or numbered)
      let isList = false;
      let prefixStr = '';
      let rawText = origLine; // Preserve hierarchy spaces if any
      
      const trimmedLeft = origLine.trimStart();
      const currentIndent = origLine.length - trimmedLeft.length;
      let xOffset = marginX + (currentIndent * 1.5);
      
      if (trimmedLeft.startsWith('* ') || trimmedLeft.startsWith('- ') || trimmedLeft.startsWith('• ')) {
        isList = true;
        prefixStr = '-';
        rawText = trimmedLeft.substring(2).trim();
        xOffset += 5;
      } else {
        const numMatch = trimmedLeft.match(/^(\d+\.)\s+/);
        if (numMatch) {
          isList = true;
          prefixStr = numMatch[1];
          rawText = trimmedLeft.substring(numMatch[0].length).trim();
          xOffset += 6;
        } else {
          rawText = trimmedLeft;
        }
      }
      
      renderParagraph(rawText, xOffset, isList, prefixStr);
      i++;
    }

    const pageCount = (doc.internal as any).getNumberOfPages();
    for(let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        
        // Footer Line
        doc.setDrawColor(200, 200, 200);
         doc.setLineWidth(0.5);
        doc.line(10, pageHeight - 20, 200, pageHeight - 20);

        // Compliance Footer
        doc.setFontSize(7);
        doc.setTextColor(100);
        doc.setFont('helvetica', 'italic');
        const complianceMsg = [
          'CA COMPLIANCE NOTE: These lesson notes are based on the Standard-Based Curriculum (SBC) framework as mandated by the National Council for Curriculum and Assessment (NaCCA) Ghana.',
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

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').replace('T', '_').slice(0, 19);
    const filename = `${formData.subject}_${formData.level}_Notes_${timestamp}`.replace(/[\s\W]+/g, '_');
    doc.save(`${filename}.pdf`);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
           <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
             <div className="w-2 h-8 bg-ghana-gold rounded-full" />
             AI Note Generator
           </h1>
           <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-2 ml-5">Comprehensive Student Lesson Notes</p>
        </div>
        <div className="flex gap-2">
           {[1, 2, 3].map((s) => (
             <div 
               key={s} 
               className={cn(
                 "w-8 h-2 rounded-full transition-all", 
                 step >= s ? "bg-ghana-green" : "bg-gray-200"
               )} 
             />
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
            <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
                    <BookOpen size={24} />
                </div>
                <div>
                    <h2 className="text-xl font-bold">Step 1: Academic & Period Data</h2>
                    <p className="text-sm text-slate-500">Pick the level, subject, and time settings for the note</p>
                </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-500 uppercase">Education Stage</label>
                <select 
                  className="input-field"
                  value={formData.level}
                  onChange={(e) => handleLevelChange(e.target.value)}
                >
                  {levels.map(l => (
                    <option key={l} value={l}>{l}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-500 uppercase">Specific Class/Form</label>
                <select 
                  className="input-field"
                  value={formData.class}
                  onChange={(e) => handleClassChange(e.target.value)}
                >
                  {currentClasses.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-500 uppercase">Subject Area</label>
                <select 
                  className="input-field"
                  value={formData.subject}
                  onChange={(e) => handleSubjectChange(e.target.value)}
                >
                  {subjects.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-500 uppercase">Term</label>
                <select 
                  className="input-field"
                  value={formData.term}
                  onChange={(e) => setFormData({...formData, term: e.target.value})}
                >
                  <option value="Term 1">Term 1</option>
                  <option value="Term 2">Term 2</option>
                  <option value="Term 3">Term 3</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-500 uppercase">Week/Period</label>
                <select 
                  className="input-field"
                  value={formData.week}
                  onChange={(e) => setFormData({...formData, week: e.target.value})}
                >
                  {Array.from({ length: 12 }, (_, i) => `Week ${i + 1}`).map(w => (
                    <option key={w} value={w}>{w}</option>
                  ))}
                  <option value="Revision Week">Revision Week</option>
                  <option value="Exams Week">Exams Week</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-500 uppercase">Academic Year</label>
                <input 
                  type="text" 
                  className="input-field"
                  placeholder="e.g. 2025/2026"
                  value={formData.academicYear}
                  onChange={(e) => setFormData({...formData, academicYear: e.target.value})}
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-bold text-gray-500 uppercase">Duration</label>
                <select 
                  className="input-field"
                  value={formData.duration}
                  onChange={(e) => setFormData({...formData, duration: e.target.value})}
                >
                  <option value="30 minutes">30 minutes</option>
                  <option value="45 minutes">45 minutes</option>
                  <option value="60 minutes">60 minutes</option>
                  <option value="90 minutes">90 minutes</option>
                  <option value="120 minutes">120 minutes</option>
                </select>
              </div>
            </div>
            
            <div className="flex gap-4 mt-8">
              <button onClick={() => setStep(2)} className="btn-primary flex-1 flex items-center justify-center gap-2 group">
                Next: Environment & Competencies
                <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100"
          >
             <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
                    <MapPin size={24} />
                </div>
                <div>
                    <h2 className="text-xl font-bold">Step 2: Environment, Competencies & Differentiation</h2>
                    <p className="text-sm text-slate-500">Tailor the environmental setting and NaCCA competency indicators</p>
                </div>
            </div>

             <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-500 uppercase">Locality Type</label>
                    <select 
                      className="input-field"
                      value={formData.locality}
                      onChange={(e) => setFormData({...formData, locality: e.target.value})}
                    >
                      <option value="Urban">Urban (City Center)</option>
                      <option value="Peri-Urban">Peri-Urban / Suburban</option>
                      <option value="Rural">Rural (Limited Resources)</option>
                    </select>
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

                <div className="space-y-3 border-t border-gray-50 pt-4">
                  <label className="text-sm font-black text-slate-700 uppercase block tracking-wider">NaCCA Core Competencies</label>
                  <p className="text-xs text-slate-400">Select the applicable competencies for this lesson indicator:</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {COMPETENCIES.map((comp) => {
                      const isChecked = selectedCompetencies.includes(comp.code);
                      return (
                        <button
                          type="button"
                          key={comp.code}
                          onClick={() => handleCompetencyChange(comp.code)}
                          className={cn(
                            "flex items-start gap-3 p-3 rounded-2xl border text-left transition-all",
                            isChecked 
                              ? "bg-emerald-50/50 border-emerald-500/30 text-emerald-950 font-medium" 
                              : "bg-white border-gray-100 text-slate-500 hover:bg-gray-50"
                          )}
                        >
                          <div className={cn(
                            "w-5 h-5 rounded-md border flex items-center justify-center text-[10px] font-black flex-shrink-0 mt-0.5",
                            isChecked ? "bg-ghana-green border-ghana-green text-white" : "border-gray-200 text-transparent bg-white"
                          )}>
                            ✓
                          </div>
                          <div>
                            <p className="text-xs font-black text-slate-800">{comp.code}</p>
                            <p className="text-[11px] text-slate-500 font-medium tracking-tight leading-3">{comp.label}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
                
                <div className="space-y-2 border-t border-gray-50 pt-4">
                    <label className="text-sm font-bold text-gray-500 uppercase">Differential Strategy Focus (Optional)</label>
                    <textarea 
                      className="input-field min-h-[80px]" 
                      placeholder="e.g. Focus on visual learners, include simplified vocabulary for some, or extension tasks for others..."
                      value={formData.differentiation}
                      onChange={(e) => setFormData({...formData, differentiation: e.target.value})}
                    />
                </div>
             </div>
             
             <div className="flex gap-4 mt-8">
                <button onClick={() => setStep(1)} className="px-6 py-3 rounded-xl border border-gray-100 font-bold hover:bg-gray-50 flex items-center gap-2">
                  <ChevronLeft size={20} />
                  Back
                </button>
                <button onClick={() => setStep(3)} className="btn-primary flex-1 flex items-center justify-center gap-2 group">
                  Next: Curriculum Details
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
             <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
                    <Sparkles size={24} />
                </div>
                <div>
                    <h2 className="text-xl font-bold">Step 3: Curriculum & Objectives</h2>
                    <p className="text-sm text-slate-500">Define what students will learn based strictly on the NaCCA Standard-Based Syllabus</p>
                </div>
            </div>

             <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-500 uppercase">Strand</label>
                    <select 
                      className="input-field"
                      value={formData.strand}
                      onChange={(e) => handleStrandChange(e.target.value)}
                    >
                      <option value="">Select Strand</option>
                      {currentStrands.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-500 uppercase">Sub-Strand</label>
                    <select 
                      className="input-field"
                      value={formData.subStrand}
                      onChange={(e) => handleSubStrandChange(e.target.value)}
                    >
                      <option value="">Select Sub-Strand</option>
                      {currentSubStrands.map(ss => <option key={ss} value={ss}>{ss}</option>)}
                    </select>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-500 uppercase">Content Standard</label>
                    <select 
                      className="input-field"
                      value={formData.contentStandard}
                      onChange={(e) => handleContentStandardChange(e.target.value)}
                    >
                      <option value="">Select Content Standard</option>
                      {currentStandards.map(cs => <option key={cs} value={cs}>{cs}</option>)}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-500 uppercase">Indicator</label>
                    <select 
                      className="input-field"
                      value={formData.indicator}
                      onChange={(e) => handleIndicatorChange(e.target.value)}
                    >
                      <option value="">Select Indicator</option>
                      {currentIndicators.map(i => <option key={i} value={i}>{i}</option>)}
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="text-sm font-bold text-gray-500 uppercase">Learning Objectives (Required)</label>
                      {getActiveFrame() && (
                        <button 
                          type="button"
                          onClick={() => {
                            const activeFrame = getActiveFrame();
                            if (activeFrame) {
                              setFormData(prev => ({
                                ...prev,
                                objectives: `By the end of the lesson, the learner will be able to:\n1. State what is meant by the key concepts: ${activeFrame.keyWords?.slice(0, 3).join(', ')}.\n2. Participate in practical activities including: ${activeFrame.activities?.[0] || 'active group class tasks'}.\n3. Answer oral review questions and write short evaluation exercises.`
                              }));
                              toast.success("Auto-populated from NaCCA resource framework!");
                            }
                          }}
                          className="text-[10px] bg-emerald-50 text-emerald-700 font-extrabold px-2 py-0.5 rounded-md hover:bg-emerald-100 uppercase tracking-wider"
                        >
                          Reset to NaCCA Standard
                        </button>
                      )}
                    </div>
                    <textarea 
                      required
                      className="input-field min-h-[100px]" 
                      placeholder="e.g. By the end of the lesson, learners will be able to define an element and identify the first 10 elements on the periodic table."
                      value={formData.objectives}
                      onChange={(e) => setFormData({...formData, objectives: e.target.value})}
                    />
                </div>

                {getActiveFrame()?.resources && (
                  <div className="bg-emerald-50/50 border border-emerald-500/10 p-4 rounded-2xl mt-2">
                    <p className="text-xs font-black text-emerald-800 uppercase tracking-wider mb-2 flex items-center gap-2">
                      🎒 Recommended TLMs (Locally Available)
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {getActiveFrame().resources.map((item: string, idx: number) => (
                        <span key={idx} className="bg-emerald-100/60 text-emerald-900 border border-emerald-200/40 text-[10px] px-2.5 py-1 rounded-full font-bold">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
             </div>
             
             <div className="flex gap-4 mt-8">
                <button onClick={() => setStep(2)} className="px-6 py-3 rounded-xl border border-gray-200 font-bold hover:bg-gray-50 flex items-center gap-2">
                  <ChevronLeft size={20} />
                  Back
                 </button>
                <button 
                  onClick={handleGenerate} 
                  disabled={loading}
                  className="btn-primary flex-1 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <RefreshCw className="animate-spin" size={20} />
                  ) : (
                    <Sparkles size={20} />
                  )}
                  {loading ? "Generating Note..." : "Generate Lesson Note"}
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
            <div className="flex gap-4 sticky top-20 lg:top-4 z-10 shadow-lg p-2 bg-white/50 backdrop-blur-md rounded-2xl border border-white/20">
              <button onClick={() => setStep(2)} className="px-4 py-2 bg-white border rounded-xl font-bold text-sm hover:bg-gray-50">Edit</button>
              <button 
                onClick={handleSave} 
                disabled={saving}
                className="flex-1 bg-slate-900 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-slate-800 transition-all"
              >
                <Save size={18} />
                {saving ? "Saving..." : "Save to My Notes"}
              </button>
              <button onClick={handleDownloadPDF} className="bg-ghana-gold text-emerald-deep px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-opacity-90">
                <Download size={18} />
                PDF
              </button>
            </div>

            <div className="bg-white p-6 lg:p-10 rounded-3xl shadow-sm border border-gray-100 space-y-6 ghana-border relative overflow-hidden">
              <div className="absolute top-0 left-0 w-2 h-full bg-ghana-gold" />
              
              <div className="border-b pb-4">
                  <h2 className="text-2xl lg:text-3xl font-black text-slate-900 mb-3">{result.title}</h2>
                  <div className="flex flex-wrap gap-2 text-[10px] font-black uppercase tracking-wider">
                    <span className="bg-slate-100 text-slate-800 px-2.5 py-1 rounded-md">LEVEL: {formData.level}</span>
                    <span className="bg-emerald-100/40 text-emerald-800 px-2.5 py-1 rounded-md">CLASS: {formData.class}</span>
                    <span className="bg-ghana-gold/10 text-slate-900 px-2.5 py-1 rounded-md">SUBJECT: {formData.subject}</span>
                    <span className="bg-indigo-50 text-indigo-800 px-2.5 py-1 rounded-md max-w-xs truncate">STRAND: {formData.strand}</span>
                    <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md max-w-sm truncate">SUB-STRAND: {formData.subStrand}</span>
                  </div>
              </div>

              <div className="markdown-body prose prose-emerald max-w-none prose-headings:text-slate-900 prose-headings:font-black prose-p:text-slate-600 prose-p:leading-relaxed prose-li:text-slate-600">
                <SafeMarkdown>
                  {result.content}
                </SafeMarkdown>
              </div>

              {result.summary && (
                <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100">
                  <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-3">
                    <Quote className="text-ghana-gold" />
                    Lesson Summary
                  </h3>
                  <ul className="space-y-4">
                    {result.summary.map((point: string, i: number) => (
                      <li key={i} className="flex gap-4">
                        <div className="w-6 h-6 rounded-full bg-ghana-green/20 text-ghana-green flex items-center justify-center flex-shrink-0 text-xs font-bold">
                          {i + 1}
                        </div>
                        <p className="text-slate-600 font-medium">{point}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {result.questions && (
                <div className="bg-emerald-deep text-white p-8 lg:p-12 rounded-3xl shadow-xl">
                  <h3 className="text-xl font-black mb-8 flex items-center gap-3">
                    <CheckCircle className="text-ghana-gold" />
                    Review Questions
                  </h3>
                  <div className="space-y-6">
                    {result.questions.map((q: string, i: number) => (
                      <div key={i} className="p-6 bg-white/10 rounded-2xl border border-white/10 hover:bg-white/15 transition-colors">
                        <p className="font-bold text-lg leading-relaxed">{q}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NoteGenerator;
