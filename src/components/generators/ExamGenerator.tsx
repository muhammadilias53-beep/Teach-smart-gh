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
  X
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { generateExam } from '../../lib/gemini';
import { db } from '../../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../lib/utils';
import { SafeMarkdown } from '../common/SafeMarkdown';
import 'highlight.js/styles/github.css';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { toast } from 'react-hot-toast';
import { subjects as sharedSubjects, levels, CLASSES_BY_LEVEL } from '../../constants';

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
  const [saved, setSaved] = useState(false);
  const [showMarkingScheme, setShowMarkingScheme] = useState(false);
  const [showSaveConfirm, setShowSaveConfirm] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
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
    setFormData(prev => ({
      ...prev,
      level: lvl,
      classLevel: classes[0] || ''
    }));
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
          town: profile?.town
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
      
      if (!examData || !examData.questions || !examData.markingScheme) {
        throw new Error("Incomplete data received from AI");
      }

      setResult({
        questions: cleanMarkdown(examData.questions),
        markingScheme: cleanMarkdown(examData.markingScheme)
      });
      toast.success("Examination generated successfully!");
    } catch (error) {
      console.error("Exam generation failed:", error);
      
      let errorMessage = "Examination generation failed. Please try again.";
      if (error instanceof Error) {
        if (error.message.includes("quota")) {
          errorMessage = "AI generation quota exceeded. Please try again later.";
        } else if (error.message.includes("Unexpected token")) {
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
      await addDoc(collection(db, 'exams'), {
        authorId: user.uid,
        title: formData.title || `${displaySubject} - ${formData.topics}`,
        subject: displaySubject,
        level: `${formData.level} (${formData.classLevel})`,
        classLevel: formData.classLevel,
        questions: result.questions,
        markingScheme: result.markingScheme,
        createdAt: serverTimestamp()
      });
      setSaved(true);
      setShowSaveConfirm(false);
      toast.success("Exam saved to library!");
    } catch (error) {
      console.error("Failed to save exam:", error);
      toast.error("Failed to save exam. Please try again.");
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
    const pageCount = (doc.internal as any).getNumberOfPages();
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
              <select 
                required
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all font-bold text-slate-700"
                value={formData.subject}
                onChange={(e) => setFormData({...formData, subject: e.target.value, ghanaianLanguage: e.target.value === 'Ghanaian Language' ? formData.ghanaianLanguage : ''})}
              >
                <option value="">Select Subject</option>
                {sharedSubjects.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
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
                  {GHANAIAN_LANGUAGES.map(lang => <option key={lang} value={lang}>{lang}</option>)}
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
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-6 bg-slate-900 rounded-[2.5rem] shadow-2xl border border-white/10 ring-8 ring-slate-900/5 sticky top-20 lg:top-4 z-30">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
                  <CheckCircle size={24} />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400">Assessment Ready</p>
                  <h3 className="text-white font-bold text-lg leading-none">{formData.title || "Examination Paper"}</h3>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <div className="flex bg-white/10 p-1 rounded-xl">
                  <button 
                    onClick={() => setShowMarkingScheme(false)}
                    className={cn(
                      "px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all",
                      !showMarkingScheme ? "bg-white text-slate-900 shadow-sm" : "text-slate-400 hover:text-white"
                    )}
                  >
                    Question Paper
                  </button>
                  <button 
                    onClick={() => setShowMarkingScheme(true)}
                    className={cn(
                      "px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all",
                      showMarkingScheme ? "bg-white text-slate-900 shadow-sm" : "text-slate-400 hover:text-white"
                    )}
                  >
                    Marking Scheme
                  </button>
                </div>
                
                <div className="h-8 w-[1px] bg-white/10 mx-2 hidden md:block" />

                <button 
                  onClick={handleSave}
                  disabled={saved || isSaving}
                  className="px-6 py-3 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20"
                >
                  {isSaving ? <Loader2 size={14} className="animate-spin" /> : (saved ? <CheckCircle size={14} /> : <BookOpen size={14} />)}
                  {saved ? "Saved" : "Save Cloud"}
                </button>

                <div className="flex gap-2">
                  <button 
                    onClick={() => downloadPDF('exam')}
                    className="px-6 py-3 bg-white text-slate-900 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-slate-100 transition-all shadow-lg"
                  >
                    <Download size={14} />
                    Exam PDF
                  </button>
                  <button 
                    onClick={() => downloadPDF('marking')}
                    className="px-6 py-3 bg-emerald-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/20"
                  >
                    <CheckCircle size={14} />
                    Scheme PDF
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 lg:p-16 rounded-[3rem] shadow-2xl border border-slate-100 relative min-h-[600px] overflow-hidden">
              <div className="markdown-body prose prose-emerald max-w-none prose-headings:font-black prose-p:font-medium prose-li:font-medium prose-table:border prose-table:border-slate-200 prose-th:bg-slate-50 prose-th:p-4 prose-td:p-4 prose-th:border prose-td:border prose-td:border-slate-100">
                <SafeMarkdown>
                  {showMarkingScheme ? result.markingScheme : result.questions}
                </SafeMarkdown>
              </div>
            </div>
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
