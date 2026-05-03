import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Save, Download, RefreshCw, FileText, ChevronLeft, ChevronRight, CheckCircle, Users } from 'lucide-react';
import { generateLessonPlan } from '../../lib/gemini';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuth } from '../../contexts/AuthContext';
import { cn } from '../../lib/utils';
import { SafeMarkdown } from '../common/SafeMarkdown';
import 'highlight.js/styles/github.css';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { subjects, levels, CLASSES_BY_LEVEL, SUBJECT_STRANDS, SUBJECT_SUB_STRANDS, SUB_STRAND_STANDARDS, STANDARD_INDICATORS } from '../../constants';

const LessonPlanGenerator = () => {
  const { user, profile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    level: 'JHS',
    class: 'Basic 7',
    subject: 'English',
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
  });
  const [result, setResult] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  // Helper selectors from constants
  const currentStrands = SUBJECT_STRANDS[formData.subject] || [];
  const currentSubStrands = SUBJECT_SUB_STRANDS[formData.strand] || [];
  const currentStandards = SUB_STRAND_STANDARDS[formData.strand]?.[formData.subStrand] || [];
  const currentIndicators = STANDARD_INDICATORS[formData.contentStandard] || [];

  const handleGenerate = async () => {
    if (!formData.strand || !formData.subStrand || !formData.contentStandard || !formData.indicator || !formData.mainObjective) {
      alert("Please provide all required fields: Strand, Sub-Strand, Content Standard, Indicator, and Main Objective.");
      return;
    }
    setLoading(true);
    try {
      const prompt = `Generate a NaCCA-compliant lesson plan for ${formData.class} (${formData.level}) ${formData.subject} strictly following the Standard-Based Curriculum (SBC). 
      Strand: ${formData.strand}.
      Sub-Strand: ${formData.subStrand}.
      Content Standard: ${formData.contentStandard}.
      Indicator: ${formData.indicator}.
      Main Objective: ${formData.mainObjective}.
      Duration: ${formData.duration}.
      Class Size: ${formData.classSize} learners.
      Week Ending: ${formData.weekEnding}.
      Locality: ${formData.locality} (${formData.specificLocality}). 
      
      TAILORING INSTRUCTION: Consider the resources typically available in a ${formData.locality} setting in Ghana. If ${formData.locality} is Rural, suggest low-cost, locally available teaching and learning materials.
      
      DIFFERENTIATION INSTRUCTION: ${formData.differentiationStrategies || 'Plan for diverse learning needs including struggling and advanced learners.'}
      
      ${formData.customGuidance ? `Additional Guidance: ${formData.customGuidance}` : ''}`;
      
      const data = await generateLessonPlan(prompt, { 
        school: profile?.school, 
        district: profile?.district,
        town: formData.specificLocality || profile?.town,
        region: profile?.region
      });
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
    try {
      await addDoc(collection(db, 'lessonPlans'), {
        ...result,
        authorId: user.uid,
        level: formData.level,
        class: formData.class,
        subject: formData.subject,
        locality: formData.locality,
        strand: formData.strand,
        subStrand: formData.subStrand,
        contentStandard: formData.contentStandard,
        indicator: formData.indicator,
        createdAt: serverTimestamp(),
      });
      alert('Lesson plan saved successfully!');
    } catch (err) {
      console.error(err);
      alert('Failed to save. Permissions might be restricted.');
    } finally {
      setSaving(false);
    }
  };

  const handleDownloadPDF = () => {
    if (!result) return;
    const doc = new jsPDF();
    
    // Custom Header Branding
    doc.setFillColor(0, 28, 61); // TeachSmart Deep Blue
    doc.rect(0, 0, 210, 40, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('TEACHSMART GHANA', 105, 18, { align: 'center' });
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('OFFICIAL NaCCA CURRICULUM COMPLIANT LESSON PLAN', 105, 26, { align: 'center' });
    
    doc.setDrawColor(252, 209, 22); // Ghana Gold
    doc.setLineWidth(1);
    doc.line(40, 32, 170, 32);

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(9);
    doc.text(`CLASS: ${formData.class.toUpperCase()} (${formData.level}) | SUBJECT: ${formData.subject.toUpperCase()} | LOCALITY: ${formData.locality.toUpperCase()}`, 105, 48, { align: 'center' });
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
        fillColor: [0, 107, 63], // Ghana Green
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
    const filename = `${formData.subject}_${formData.strand}_${formData.subStrand}_LessonPlan_${timestamp}`.replace(/[\s\W]+/g, '_');
    doc.save(`${filename}.pdf`);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
           <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
             <div className="w-2 h-8 bg-ghana-gold rounded-full" />
             Lesson Plan Generator
           </h1>
           <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-2 ml-5">NaCCA Curriculum Assistant</p>
        </div>
        <div className="flex gap-2">
           {[1, 2, 3, 4].map((s) => (
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
            <h2 className="text-xl font-bold mb-6">Step 1: Academic Data</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-500 uppercase">Educational Stage</label>
                <select 
                  className="input-field"
                  value={formData.level}
                  onChange={(e) => setFormData({...formData, level: e.target.value, class: CLASSES_BY_LEVEL[e.target.value][0]})}
                >
                  {levels.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-500 uppercase">Specific Class (Basic/KG)</label>
                <select 
                  className="input-field"
                  value={formData.class}
                  onChange={(e) => setFormData({...formData, class: e.target.value})}
                >
                  {(CLASSES_BY_LEVEL[formData.level] || []).map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-500 uppercase">Subject</label>
                <select 
                  className="input-field"
                  value={formData.subject}
                  onChange={(e) => setFormData({...formData, subject: e.target.value, strand: '', subStrand: '', contentStandard: '', indicator: ''})}
                >
                  {subjects.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-500 uppercase">Class Size</label>
                <input 
                  type="number"
                  className="input-field"
                  placeholder="Number of learners"
                  value={formData.classSize}
                  onChange={(e) => setFormData({...formData, classSize: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-500 uppercase">Week Ending</label>
                <input 
                  type="date"
                  className="input-field"
                  value={formData.weekEnding}
                  onChange={(e) => setFormData({...formData, weekEnding: e.target.value})}
                />
              </div>
            </div>
            <button onClick={() => setStep(2)} className="btn-primary mt-8 flex items-center gap-2">
              Next Step
              <ChevronRight size={20} />
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
                    className="input-field"
                    value={formData.locality}
                    onChange={(e) => setFormData({...formData, locality: e.target.value})}
                  >
                    <option value="Urban">Urban (City Center)</option>
                    <option value="Per-Urban">Peri-Urban / Suburban</option>
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
                <label className="text-sm font-bold text-gray-500 uppercase">Duration</label>
                <input 
                  type="text" 
                  className="input-field" 
                  placeholder="e.g. 60 minutes"
                  value={formData.duration}
                  onChange={(e) => setFormData({...formData, duration: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-500 uppercase">Differential Strategies</label>
                <textarea 
                  className="input-field min-h-[80px]" 
                  placeholder="How should we support different learners? (e.g. Group work, visual aids for some, extra challenges for others...)"
                  value={formData.differentiationStrategies}
                  onChange={(e) => setFormData({...formData, differentiationStrategies: e.target.value})}
                />
              </div>
            </div>
            <div className="flex gap-4 mt-8">
              <button onClick={() => setStep(1)} className="px-6 py-3 rounded-xl border border-gray-200 font-bold hover:bg-gray-50">Back</button>
              <button onClick={() => setStep(3)} className="btn-primary flex-1 flex items-center justify-center gap-2">
                Continue to Lesson Details
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
             <h2 className="text-xl font-bold mb-6">Step 3: Curriculum Calibration</h2>
             <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="space-y-2">
                       <label className="text-sm font-bold text-gray-500 uppercase">NaCCA Strand (Required)</label>
                       {currentStrands.length > 0 ? (
                         <select 
                           required
                           className="input-field"
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
                           className="input-field"
                           value={formData.strand}
                           onChange={(e) => setFormData({...formData, strand: e.target.value})}
                         />
                       )}
                   </div>
                   <div className="space-y-2">
                       <label className="text-sm font-bold text-gray-500 uppercase">Sub-Strand (Required)</label>
                       {currentSubStrands.length > 0 ? (
                         <select 
                           required
                           className="input-field"
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
                           className="input-field"
                           value={formData.subStrand}
                           onChange={(e) => setFormData({...formData, subStrand: e.target.value})}
                         />
                       )}
                   </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-slate-50">
                  <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-500 uppercase">Content Standard (Required)</label>
                      {currentStandards.length > 0 ? (
                        <select 
                          required
                          className="input-field"
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
                          className="input-field"
                          value={formData.contentStandard}
                          onChange={(e) => setFormData({...formData, contentStandard: e.target.value})}
                        />
                      )}
                  </div>

                  <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-500 uppercase">Indicator (Required)</label>
                      {currentIndicators.length > 0 ? (
                        <select 
                          required
                          className="input-field"
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
                          className="input-field"
                          value={formData.indicator}
                          onChange={(e) => setFormData({...formData, indicator: e.target.value})}
                        />
                      )}
                  </div>
                </div>

                <div className="space-y-2 pt-4 border-t border-slate-50">
                    <label className="text-sm font-bold text-gray-500 uppercase tracking-tighter">Main Learning Objective (What should they learn?)</label>
                    <textarea 
                      required
                      className="input-field min-h-[100px]" 
                      placeholder="e.g. By the end of the lesson, learners will be able to add two proper fractions with same denominators manually."
                      value={formData.mainObjective}
                      onChange={(e) => setFormData({...formData, mainObjective: e.target.value})}
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-400 uppercase text-[10px]">AI Customization Tool (Optional)</label>
                    <textarea 
                      className="input-field min-h-[60px] text-sm" 
                      placeholder="Special instructions? e.g. Focus on local market examples, include a 5-minute quiz."
                      value={formData.customGuidance}
                      onChange={(e) => setFormData({...formData, customGuidance: e.target.value})}
                    />
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
                  {loading ? "Generating..." : "Generate Lesson Plan"}
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
              
              <div className="flex gap-2 p-1 bg-white/5 rounded-2xl">
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
              </div>
            </div>

            <div className="bg-white p-8 lg:p-12 rounded-[2rem] shadow-sm border border-gray-100 space-y-10 ghana-border">
              <div className="text-center border-b pb-8">
                  <h2 className="text-3xl font-black text-emerald-deep mb-2">{result.title}</h2>
                  <div className="flex flex-wrap justify-center gap-4 text-xs font-bold text-slate-400 uppercase tracking-widest mt-4">
                    <span>{formData.class} ({formData.level})</span>
                    <span className="w-1 h-1 bg-slate-300 rounded-full my-auto" />
                    <span>{formData.subject}</span>
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
                    <SafeMarkdown>
                      {result.phase1}
                    </SafeMarkdown>
                  </div>
                </section>

                <section className="bg-slate-900 text-slate-200 p-8 rounded-3xl group shadow-xl">
                  <h3 className="text-lg font-bold flex items-center gap-3 mb-6 text-white">
                    <div className="w-1.5 h-6 bg-emerald-text rounded-full" />
                    Phase 2: Main
                    <span className="text-[10px] font-medium text-emerald- text-emerald-text/50 ml-2 uppercase">(New learning including assessment)</span>
                  </h3>
                  <div className="markdown-body prose prose-invert prose-emerald max-w-none prose-p:leading-relaxed prose-li:leading-relaxed text-slate-300 pb-6">
                    <SafeMarkdown>
                      {result.phase2}
                    </SafeMarkdown>
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
                     <SafeMarkdown>
                       {result.phase3}
                     </SafeMarkdown>
                   </div>
                </section>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LessonPlanGenerator;
