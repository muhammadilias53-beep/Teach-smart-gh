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
import { subjects as sharedSubjects, SUBJECT_STRANDS, SUBJECT_SUB_STRANDS, levels, SUB_STRAND_STANDARDS, STANDARD_INDICATORS } from '../../constants';

const difficulties = ["Easy", "Standard", "Challenging"];

export default function ExamGenerator() {
  const { user, profile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ questions: string; markingScheme: string } | null>(null);
  const [saved, setSaved] = useState(false);
  const [showMarkingScheme, setShowMarkingScheme] = useState(false);
  const [showSaveConfirm, setShowSaveConfirm] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    subject: '',
    level: profile?.level || '',
    topics: '',
    strand: '',
    subStrand: '',
    contentStandard: '',
    indicatorCode: '',
    difficulty: 'Standard',
    title: '',
    selectedTypes: ['Multiple Choice', 'Theory'] as string[],
    p1Count: 40,
    p1Difficulty: 'Standard',
    p2Count: 6,
    p2Difficulty: 'Standard'
  });

  const questionTypes = ['Multiple Choice', 'Theory', 'Practical', 'True/False', 'Matching', 'Fill-in-the-blanks'];

  const toggleType = (type: string) => {
    setFormData(prev => ({
      ...prev,
      selectedTypes: prev.selectedTypes.includes(type)
        ? prev.selectedTypes.filter(t => t !== type)
        : [...prev.selectedTypes, type]
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
        formData.subject,
        formData.level,
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
        formData.strand,
        formData.subStrand,
        formData.contentStandard,
        formData.indicatorCode
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
        title: formData.title || `${formData.subject} - ${formData.topics}`,
        subject: formData.subject,
        level: formData.level,
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
    const filename = `${formData.subject}_${formData.level}_${type === 'exam' ? 'Exam' : 'Marking'}_${new Date().toISOString().split('T')[0]}`;
    
    // Header
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text(title.toUpperCase(), 105, 20, { align: 'center' });
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Subject: ${formData.subject}`, 20, 30);
    doc.text(`Level: ${formData.level}`, 20, 35);
    doc.text(`Difficulty: ${formData.difficulty}`, 190, 30, { align: 'right' });
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 190, 35, { align: 'right' });
    
    doc.setLineWidth(0.5);
    doc.line(20, 40, 190, 40);

    const content = type === 'exam' ? result.questions : result.markingScheme;
    
    // Content with basic page wrapping
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    const splitText = doc.splitTextToSize(content, 170);
    
    let cursorY = 50;
    const pageHeight = doc.internal.pageSize.height;
    
    splitText.forEach((line: string) => {
      if (cursorY > pageHeight - 20) {
        doc.addPage();
        cursorY = 20;
      }
      doc.text(line, 20, cursorY);
      cursorY += 7;
    });

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
        doc.setTextColor(0, 107, 63); // Green
        doc.text('TEACHSMART GHANA • AI-POWERED NaCCA COMPLIANT TOOLS', 10, pageHeight - 5);
        
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

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Subject Area</label>
              <select 
                required
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all font-bold text-slate-700"
                value={formData.subject}
                onChange={(e) => setFormData({...formData, subject: e.target.value})}
              >
                <option value="">Select Subject</option>
                {sharedSubjects.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Class/Level</label>
              <select 
                required
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all font-bold text-slate-700"
                value={formData.level}
                onChange={(e) => setFormData({...formData, level: e.target.value})}
              >
                <option value="">Select Level</option>
                {levels.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
          </div>

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
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Specific Topics to Cover</label>
            <textarea 
              required
              rows={3}
              placeholder="e.g., Human digestive system, Balanced diet, Diseases"
              className="w-full p-6 bg-slate-50 border border-slate-200 rounded-[2rem] focus:ring-2 focus:ring-emerald-500 outline-none transition-all font-medium resize-none"
              value={formData.topics}
              onChange={(e) => setFormData({...formData, topics: e.target.value})}
            />
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Strand (Required)</label>
                {SUBJECT_STRANDS[formData.subject] ? (
                  <select 
                    required
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all font-bold text-slate-800 cursor-pointer"
                    value={formData.strand}
                    onChange={(e) => setFormData({...formData, strand: e.target.value, subStrand: '', contentStandard: '', indicatorCode: ''})}
                  >
                    <option value="">Select NaCCA Strand...</option>
                    {SUBJECT_STRANDS[formData.subject].map(s => <option key={s} value={s}>{s}</option>)}
                    <option value="Other">Other...</option>
                  </select>
                ) : (
                  <input 
                    type="text" 
                    required
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all font-bold text-slate-800 placeholder:text-slate-300"
                    placeholder="e.g. Interactions of Matter"
                    value={formData.strand}
                    onChange={(e) => setFormData({...formData, strand: e.target.value, subStrand: '', contentStandard: '', indicatorCode: ''})}
                  />
                )}
            </div>
            <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Sub-Strand (Required)</label>
                {SUBJECT_SUB_STRANDS[formData.strand] ? (
                  <select 
                    required
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all font-bold text-slate-800 cursor-pointer"
                    value={formData.subStrand}
                    onChange={(e) => setFormData({...formData, subStrand: e.target.value, contentStandard: '', indicatorCode: ''})}
                  >
                    <option value="">Select Sub-Strand...</option>
                    {SUBJECT_SUB_STRANDS[formData.strand].map(ss => <option key={ss} value={ss}>{ss}</option>)}
                    <option value="Other">Other...</option>
                  </select>
                ) : (
                  <input 
                    type="text" 
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all font-bold text-slate-800 placeholder:text-slate-300"
                    placeholder="e.g. Fractions"
                    value={formData.subStrand}
                    onChange={(e) => setFormData({...formData, subStrand: e.target.value})}
                  />
                )}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Content Standard (Required)</label>
                {SUB_STRAND_STANDARDS[formData.strand]?.[formData.subStrand] ? (
                  <select 
                    required
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all font-bold text-slate-800 cursor-pointer"
                    value={formData.contentStandard}
                    onChange={(e) => setFormData({...formData, contentStandard: e.target.value, indicatorCode: ''})}
                  >
                    <option value="">Select Content Standard...</option>
                    {SUB_STRAND_STANDARDS[formData.strand][formData.subStrand].map(cs => <option key={cs} value={cs}>{cs}</option>)}
                    <option value="Other">Other...</option>
                  </select>
                ) : (
                  <input 
                    type="text" 
                    required
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all font-bold text-slate-800 placeholder:text-slate-300"
                    placeholder="e.g. B7.1.1.1"
                    value={formData.contentStandard}
                    onChange={(e) => setFormData({...formData, contentStandard: e.target.value, indicatorCode: ''})}
                  />
                )}
            </div>
            <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Indicator Code (Required)</label>
                {STANDARD_INDICATORS[formData.contentStandard] ? (
                  <select 
                    required
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all font-bold text-slate-800 cursor-pointer"
                    value={formData.indicatorCode}
                    onChange={(e) => setFormData({...formData, indicatorCode: e.target.value})}
                  >
                    <option value="">Select Indicator...</option>
                    {STANDARD_INDICATORS[formData.contentStandard].map(i => <option key={i} value={i}>{i}</option>)}
                    <option value="Other">Other...</option>
                  </select>
                ) : (
                  <input 
                    type="text" 
                    required
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all font-bold text-slate-800 placeholder:text-slate-300 font-mono"
                    placeholder="e.g. B8.1.1.1.1"
                    value={formData.indicatorCode}
                    onChange={(e) => setFormData({...formData, indicatorCode: e.target.value})}
                  />
                )}
            </div>
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
                    <span className="text-slate-900">{formData.subject}</span>
                  </div>
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
                    <span>Level</span>
                    <span className="text-slate-900">{formData.level}</span>
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
