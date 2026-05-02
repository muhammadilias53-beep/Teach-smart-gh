import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Save, Download, RefreshCw, FileText, ChevronRight, CheckCircle, BookOpen, Quote, MapPin, Wand2 } from 'lucide-react';
import { generateNote, suggestIndicatorCode } from '../../lib/gemini';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuth } from '../../contexts/AuthContext';
import { cn } from '../../lib/utils';
import { SafeMarkdown } from '../common/SafeMarkdown';
import 'highlight.js/styles/github.css';
import jsPDF from 'jspdf';
import { toast } from 'react-hot-toast';
import { subjects, SUBJECT_STRANDS, SUBJECT_SUB_STRANDS, levels, SUB_STRAND_STANDARDS, STANDARD_INDICATORS } from '../../constants';

const NoteGenerator = () => {
  const { user, profile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    level: profile?.level || 'Basic 7',
    subject: 'Science',
    strand: '',
    subStrand: '',
    contentStandard: '',
    indicatorCode: '',
    duration: '60 minutes',
    locality: profile?.locality || 'Urban',
    specificLocality: profile?.town || '',
    differentiation: '',
    objectives: '',
  });
  const [result, setResult] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [isSuggestingCode, setIsSuggestingCode] = useState(false);

  const handleSuggestCode = async () => {
    if (!formData.strand || !formData.subStrand) {
      toast.error("Please select a Strand and sub-Strand first.");
      return;
    }
    setIsSuggestingCode(true);
    try {
      const code = await suggestIndicatorCode(formData.level, formData.subject, formData.strand, formData.subStrand);
      setFormData(prev => ({ ...prev, indicatorCode: code }));
    } catch (err) {
      console.error(err);
      toast.error("Failed to suggest code");
    } finally {
      setIsSuggestingCode(false);
    }
  };

  const handleGenerate = async () => {
    if (!formData.strand || !formData.subStrand || !formData.contentStandard || !formData.indicatorCode) {
      toast.error("Please ensure all curriculum fields (Strand, Sub-Strand, Content Standard, and Indicator) are filled.");
      return;
    }
    setLoading(true);
    try {
      const topicContext = `SBC Curriculum Focus - Strand: ${formData.strand}, Sub-Strand: ${formData.subStrand}, Content Standard: ${formData.contentStandard}, Indicator: ${formData.indicatorCode}`;
      const data = await generateNote(
        formData.subject,
        formData.level,
        topicContext,
        formData.objectives,
        { 
          school: profile?.school, 
          district: profile?.district,
          region: profile?.region,
          town: formData.specificLocality || profile?.town,
          locality: formData.locality
        },
        formData.differentiation
      );

      setResult(data);
      setStep(3);
      toast.success("Lesson notes generated!");
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
    
    doc.setFontSize(22);
    doc.setTextColor(0, 107, 63); // Ghana Green
    doc.text('TEACHSMART GHANA', 105, 20, { align: 'center' });
    
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text((result.title || formData.subStrand).toUpperCase(), 105, 30, { align: 'center' });
    
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Subject: ${formData.subject} | Level: ${formData.level}`, 105, 38, { align: 'center' });
    
    doc.setLineWidth(0.5);
    doc.setDrawColor(255, 204, 0); // Ghana Gold
    doc.line(20, 42, 190, 42);

    const splitText = doc.splitTextToSize(result.content.replace(/[#*]/g, ''), 170);
    doc.setFontSize(11);
    doc.setTextColor(50, 50, 50);
    doc.text(splitText, 20, 52);

    const pageCount = (doc.internal as any).getNumberOfPages();
    const pageHeight = doc.internal.pageSize.height;
    
    for(let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setDrawColor(200, 200, 200);
        doc.setLineWidth(0.5);
        doc.line(10, pageHeight - 20, 200, pageHeight - 20);

        doc.setFontSize(7);
        doc.setTextColor(100);
        doc.setFont('helvetica', 'italic');
        const complianceMsg = [
          'NaCCA COMPLIANCE NOTE: These lesson notes are based on the Standard-Based Curriculum (SBC) framework as mandated by the National Council for Curriculum and Assessment (NaCCA) Ghana.',
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

    doc.save(`${(result.title || formData.subStrand).replace(/\s+/g, '_')}_Notes.pdf`);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
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
                    <h2 className="text-xl font-bold">Step 1: Class Information</h2>
                    <p className="text-sm text-slate-500">Pick the right level and subject for students</p>
                </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-500 uppercase">Education Level</label>
                <select 
                  className="input-field"
                  value={formData.level}
                  onChange={(e) => setFormData({...formData, level: e.target.value})}
                >
                  {levels.map(l => (
                    <option key={l} value={l}>{l}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-500 uppercase">Subject</label>
                <select 
                  className="input-field"
                  value={formData.subject}
                  onChange={(e) => setFormData({...formData, subject: e.target.value})}
                >
                  {subjects.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex gap-4 mt-8">
              <button onClick={() => setStep(2)} className="btn-primary flex-1 flex items-center justify-center gap-2">
                Next: Environment
                <ChevronRight size={20} />
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
                    <h2 className="text-xl font-bold">Step 2: Environment & Differentiation</h2>
                    <p className="text-sm text-slate-500">Tailor the note for your learners</p>
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
                
                <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-500 uppercase">Differential Strategy Focus (Optional)</label>
                    <textarea 
                      className="input-field min-h-[100px]" 
                      placeholder="e.g. Focus on visual learners, include simplified vocabulary for some, or extension tasks for others..."
                      value={formData.differentiation}
                      onChange={(e) => setFormData({...formData, differentiation: e.target.value})}
                    />
                </div>
             </div>
             
             <div className="flex gap-4 mt-8">
                <button onClick={() => setStep(1)} className="px-6 py-3 rounded-xl border border-gray-200 font-bold hover:bg-gray-50">Back</button>
                <button onClick={() => setStep(3)} className="btn-primary flex-1 flex items-center justify-center gap-2">
                  Next: Curriculum Details
                  <ChevronRight size={20} />
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
                    <p className="text-sm text-slate-500">Define what students will learn</p>
                </div>
            </div>

             <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-500 uppercase">Strand (Required)</label>
                      {SUBJECT_STRANDS[formData.subject] ? (
                        <select 
                          required
                          className="input-field" 
                          value={formData.strand}
                          onChange={(e) => setFormData({...formData, strand: e.target.value})}
                        >
                          <option value="">Select NaCCA Strand...</option>
                          {SUBJECT_STRANDS[formData.subject].map(s => <option key={s} value={s}>{s}</option>)}
                          <option value="Other">Other...</option>
                        </select>
                      ) : (
                        <input 
                          type="text" 
                          required
                          className="input-field" 
                          placeholder="e.g. Interactions of Matter"
                          value={formData.strand}
                          onChange={(e) => setFormData({...formData, strand: e.target.value})}
                        />
                      )}
                  </div>
                  <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-500 uppercase">Sub-Strand (Required)</label>
                      {SUBJECT_SUB_STRANDS[formData.strand] ? (
                        <select 
                          required
                          className="input-field" 
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
                          required
                          className="input-field" 
                          placeholder="e.g. Photosynthesis"
                          value={formData.subStrand}
                          onChange={(e) => setFormData({...formData, subStrand: e.target.value, contentStandard: '', indicatorCode: ''})}
                        />
                      )}
                  </div>
                  <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-500 uppercase">Content Standard (Required)</label>
                      {SUB_STRAND_STANDARDS[formData.strand]?.[formData.subStrand] ? (
                        <select 
                          required
                          className="input-field" 
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
                          className="input-field" 
                          placeholder="e.g. B7.1.1.1"
                          value={formData.contentStandard}
                          onChange={(e) => setFormData({...formData, contentStandard: e.target.value, indicatorCode: ''})}
                        />
                      )}
                  </div>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-bold text-gray-500 uppercase">SBC/CCP Code (Required)</label>
                      <button 
                        type="button"
                        onClick={handleSuggestCode}
                        disabled={isSuggestingCode}
                        className="text-[10px] font-black uppercase tracking-widest text-emerald-600 flex items-center gap-1 hover:text-emerald-700 disabled:opacity-50"
                      >
                         {isSuggestingCode ? <RefreshCw className="animate-spin" size={12} /> : <Wand2 size={12} />}
                         Suggest Code
                      </button>
                    </div>
                    {STANDARD_INDICATORS[formData.contentStandard] ? (
                      <select 
                        required
                        className="input-field" 
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
                        className="input-field font-mono" 
                        placeholder="e.g. B8.1.1.1.1"
                        value={formData.indicatorCode}
                        onChange={(e) => setFormData({...formData, indicatorCode: e.target.value})}
                      />
                    )}
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-500 uppercase">Core Objectives (Optional)</label>
                    <textarea 
                      className="input-field min-h-[120px]" 
                      placeholder="What should students be able to do by the end? e.g. Define an ecosystem, identify biotic factors..."
                      value={formData.objectives}
                      onChange={(e) => setFormData({...formData, objectives: e.target.value})}
                    />
                    <p className="text-[10px] text-slate-400 font-medium italic">Objectives help the AI tailor the content to your specific lesson goals.</p>
                </div>
             </div>
             <div className="flex gap-4 mt-8">
                <button onClick={() => setStep(2)} className="px-6 py-3 rounded-xl border border-gray-200 font-bold hover:bg-gray-50">Back</button>
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
                  {loading ? "Crafting Student Notes..." : "Generate AI Notes"}
                </button>
             </div>
          </motion.div>
        )}

        {step === 3 && result && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6"
          >
            <div className="flex gap-4 sticky top-4 z-10 shadow-lg p-2 bg-white/50 backdrop-blur-md rounded-2xl border border-white/20">
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

            <div className="bg-white p-8 lg:p-12 rounded-[2.5rem] shadow-sm border border-gray-100 space-y-12 ghana-border relative overflow-hidden">
              <div className="absolute top-0 left-0 w-2 h-full bg-ghana-gold" />
              
              <div className="border-b pb-8">
                  <h2 className="text-4xl font-black text-slate-900 mb-4">{result.title}</h2>
                  <div className="flex flex-wrap gap-4 text-xs font-bold text-emerald-600 uppercase tracking-widest">
                    <span className="bg-emerald-50 px-3 py-1 rounded-full">{formData.level}</span>
                    <span className="bg-emerald-50 px-3 py-1 rounded-full">{formData.subject}</span>
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
