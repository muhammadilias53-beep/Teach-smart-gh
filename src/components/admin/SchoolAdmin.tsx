import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Download, RefreshCw, Printer, FileText, ChevronRight, CheckSquare, Plus, HelpCircle, Briefcase } from 'lucide-react';
import { generateWithProxy } from '../../lib/gemini';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router';
import { toast } from 'react-hot-toast';
import { SafeMarkdown } from '../common/SafeMarkdown';
import jsPDF from 'jspdf';

export default function SchoolAdmin() {
  const { canGenerate } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [docType, setDocType] = useState('circular'); // 'letter', 'minutes', 'circular', 'pta', 'staff', 'inspect'
  const [targetAudience, setTargetAudience] = useState('Parents');
  const [topic, setTopic] = useState('');
  const [schoolName, setSchoolName] = useState('');
  const [generatedDoc, setGeneratedDoc] = useState('');

  const handleGenerate = async () => {
    if (!canGenerate()) {
      toast.error('Please upgrade your membership to generate school administrative documents.');
      navigate('/billing');
      return;
    }

    setLoading(true);
    setGeneratedDoc('');

    const systemInstruction = `You are an elite educational administrator, veteran registrar, and official executive secretary for the Ghana Education Service (GES).
    Write extremely formal, professional, clear, and structured school administration documents.
    Adhere strictly to standard institutional memo styles, executive circular patterns, and legal-educational formalisms used by Ghana schools.
    Ensure references, regional designations, district directories, and curriculum codes are highly realistic and localized.`;

    const prompt = `Generate an official school administrative document with the following parameters:
    - Document Category: ${
      docType === 'circular' ? 'Official Parent Circular Memo' :
      docType === 'letter' ? 'Formal External Leave/Request Letter' :
      docType === 'minutes' ? 'Staff/PTA Meeting Minutes Draft' :
      docType === 'pta' ? 'PTA Committee Report' :
      docType === 'staff' ? 'Internal Staff Notice board memo' :
      'Academic Inspection Readiness Checklist'
    }
    - Institution: ${schoolName || 'TeachSmart Standard Model School, Ghana'}
    - Key Theme/Topic: ${topic || 'General administrative updates'}
    - Primary Target Audience: ${targetAudience}

    Please produce a beautifully structured, highly elegant formal memo or document in Markdown. Include clear placeholder spaces for dates, reference numbers, and signatures.`;

    try {
      const responseText = await generateWithProxy(prompt, systemInstruction);
      setGeneratedDoc(responseText || 'Failed to craft administrative draft.');
      toast.success('Official draft prepared! 🇬🇭');
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || 'Failed to generate administrative draft.');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    
    const lines = doc.splitTextToSize(generatedDoc, 180);
    let y = 15;
    
    lines.forEach((line: string) => {
      if (y > 280) {
        doc.addPage();
        y = 15;
      }
      doc.text(line, 15, y);
      y += 6;
    });

    doc.save(`school_admin_doc_${docType}.pdf`);
    toast.success('PDF downloaded successfully!');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-6">
        <div>
          <span className="px-2.5 py-1 bg-ghana-gold/20 text-emerald-950 text-[10px] font-black rounded-lg uppercase tracking-wider inline-block">
            Institutional Support
          </span>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight mt-2">School Administration</h1>
          <p className="text-slate-500 text-sm mt-1">Draft highly professional official letters, meeting minutes, staff notices, circulars, and PTA reports.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Controls Pane */}
        <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-6 h-fit">
          <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
            <Briefcase size={18} className="text-ghana-gold" />
            Document Builder
          </h2>

          <div className="space-y-4">
            {/* School Name */}
            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-2">School/Institution Name</label>
              <input
                type="text"
                value={schoolName}
                onChange={(e) => setSchoolName(e.target.value)}
                placeholder="e.g. Accra Metropolitan Academy"
                className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3 text-sm font-bold text-slate-800 focus:outline-none"
              />
            </div>

            {/* Document Type */}
            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-2">Document Category</label>
              <select
                value={docType}
                onChange={(e) => setDocType(e.target.value)}
                className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3 text-sm font-bold text-slate-800 focus:outline-none"
              >
                <option value="circular">Parent Circular Memo</option>
                <option value="letter">Official Request Letter</option>
                <option value="minutes">Staff/Committee Minutes</option>
                <option value="pta">PTA Meeting Summary</option>
                <option value="staff">Internal Staff Notice</option>
                <option value="inspect">School Readiness Checklists</option>
              </select>
            </div>

            {/* Target Audience */}
            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-2">Target Audience</label>
              <input
                type="text"
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                placeholder="e.g. Parents & Guardians, PTA Committee"
                className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3 text-sm font-bold text-slate-800 focus:outline-none"
              />
            </div>

            {/* Specific details / prompt instructions */}
            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-2">Key Topic / Instructions</label>
              <textarea
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. Announcing PTA dues review, rescheduling term dates, or request for leave of absence..."
                className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3 text-sm font-bold text-slate-800 focus:outline-none h-28 resize-none"
              />
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full bg-slate-900 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 uppercase tracking-widest text-xs hover:bg-black transition-all active:scale-95 disabled:opacity-50"
          >
            {loading ? (
              <>
                <RefreshCw className="animate-spin" size={16} />
                Drafting Document...
              </>
            ) : (
              <>
                <Sparkles size={16} className="text-ghana-gold" />
                Generate Document
              </>
            )}
          </button>
        </div>

        {/* Display Pane */}
        <div className="lg:col-span-8 flex flex-col space-y-4">
          {generatedDoc ? (
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm flex-1 flex flex-col overflow-hidden min-h-[500px]">
              {/* Output Tab Selection */}
              <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 bg-slate-50">
                <span className="text-xs font-black text-slate-800 uppercase tracking-wider">Generated Official Draft</span>

                <div className="flex gap-2">
                  <button
                    onClick={handlePrint}
                    className="p-2 bg-white text-slate-700 hover:bg-slate-100 rounded-xl border border-slate-200 transition-all"
                    title="Print Document"
                  >
                    <Printer size={16} />
                  </button>
                  <button
                    onClick={handleDownloadPDF}
                    className="p-2 bg-white text-slate-700 hover:bg-slate-100 rounded-xl border border-slate-200 transition-all"
                    title="Download as PDF"
                  >
                    <Download size={16} />
                  </button>
                </div>
              </div>

              {/* Document Display */}
              <div className="p-10 flex-1 overflow-y-auto max-h-[600px] prose prose-slate max-w-none print:max-h-none print:p-0">
                <div className="markdown-body">
                  <SafeMarkdown>{generatedDoc}</SafeMarkdown>
                </div>
              </div>

              {/* Branded Footer */}
              <div className="px-6 py-3 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-[10px] text-slate-400 font-bold">
                <span>TeachSmartGH Admin Console • Catalyst Creative</span>
                <span className="uppercase text-emerald-600">GES Compliant Draft</span>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-12 text-center flex flex-col items-center justify-center min-h-[500px]">
              <div className="w-16 h-16 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center mb-4">
                <FileText size={28} />
              </div>
              <h3 className="text-xl font-black text-slate-900">Your administrative draft will appear here</h3>
              <p className="text-slate-500 text-sm max-w-sm mt-2">Adjust details in the left setup panel and click generate to instantly draft highly formal institutional letters or memos.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
