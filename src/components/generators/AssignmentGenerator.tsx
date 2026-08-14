import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Download, RefreshCw, Printer, FileText, LayoutList, Award, HelpCircle, Edit3, Check, Eye, CheckCircle } from 'lucide-react';
import { generateWithProxy } from '../../lib/gemini';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { SafeMarkdown } from '../common/SafeMarkdown';
import { levels, CLASSES_BY_LEVEL, subjectsByLevel } from '../../constants';
import { SearchableDropdown } from '../ui/SearchableDropdown';
import jsPDF from 'jspdf';

export default function AssignmentGenerator() {
  const { canGenerate } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [level, setLevel] = useState('JHS');
  const [selectedClass, setSelectedClass] = useState('');
  const [subject, setSubject] = useState('Science');
  const [term, setTerm] = useState('1');
  const [assignmentType, setAssignmentType] = useState('homework'); // 'classwork', 'homework', 'project', 'practical'
  const [rubricType, setRubricType] = useState('detailed'); // 'detailed', 'simple', 'none'
  const [topic, setTopic] = useState('');
  const [language, setLanguage] = useState('English');
  const [bilingualLanguage, setBilingualLanguage] = useState('Twi');

  const [generatedAssignment, setGeneratedAssignment] = useState<string>('');
  const [generatedRubric, setGeneratedRubric] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'assignment' | 'rubric'>('assignment');
  const [isEditing, setIsEditing] = useState(false);
  const [hasEdited, setHasEdited] = useState(false);

  const classes = CLASSES_BY_LEVEL[level] || [];
  const subjects = subjectsByLevel[level] || [];

  React.useEffect(() => {
    if (classes.length > 0) {
      setSelectedClass(classes[0]);
    }
  }, [level]);

  React.useEffect(() => {
    if (subjects.length > 0) {
      setSubject(subjects[0]);
    }
  }, [level]);

  const handleGenerate = async () => {
    if (!canGenerate()) {
      toast.error('Please upgrade your membership to generate premium assignments.');
      navigate('/billing');
      return;
    }

    setLoading(true);
    setGeneratedAssignment('');
    setGeneratedRubric('');

    const rubricInstruction = rubricType === 'detailed' 
      ? 'Include a highly structured grading rubric markdown table with categories: Criterion, Exceptional (4 pts), Proficient (3 pts), Developing (2 pts), and Unacceptable (1 pt).'
      : rubricType === 'simple'
        ? 'Include a simplified grading list of criteria with point values.'
        : 'Do not include a grading rubric.';

    const langInstruction = language === 'English' 
      ? 'Generate entirely in clear English.' 
      : `Generate in Bilingual Mode: first in English, and immediately followed by the exact ${bilingualLanguage} translation.`;

    const systemInstruction = `You are a highly qualified Ghana Education Service (GES) coordinator, NaCCA standard assessment expert, and 3-H (Head, Heart, and Hands) pedagogy coach.
    Create high-quality classroom assignments, homework sheets, term projects, or practical lab guides that align with the Standard-Based Curriculum guidelines.
    Return your response separated into two parts: the Assignment Sheet and the Rubric/Grading Guideline.
    Write using professional pedagogical language, utilizing localized Ghanaian names, references, items, and accessible materials.`;

    const prompt = `Generate a standard student assignment with the following parameters:
    - Subject: ${subject}
    - Level: ${level} (Class: ${selectedClass})
    - Term: Term ${term}
    - Topic: ${topic || 'General curriculum-aligned review'}
    - Assignment Type: ${assignmentType === 'classwork' ? 'Classwork Activity' : assignmentType === 'homework' ? 'Homework Sheet' : assignmentType === 'project' ? 'Term Project/Research task' : 'Practical/Hands-on Activity (aligned to BSTEM/3-H)'}
    - Rubric Selection: ${rubricType}
    - Language: ${language} ${language !== 'English' ? `(Bilingual with ${bilingualLanguage})` : ''}

    ${rubricInstruction}
    ${langInstruction}

    Please separate the output clearly into two parts using the exact markdown headings:
    ### --- ASSIGNMENT START ---
    [Include school name, assignment title, due date placeholder, clear task instruction, and sequential questions or steps. For practicals/projects, write step-by-step methods and list of accessible local resources.]

    ### --- RUBRIC START ---
    [Your grading guidance, rubric table, or scoring instructions based on the selection.]
    `;

    try {
      const responseText = await generateWithProxy(prompt, systemInstruction);
      if (!responseText) {
        throw new Error('Received empty response from the AI assistant.');
      }

      const assignmentIndex = responseText.indexOf('### --- ASSIGNMENT START ---');
      const rubricIndex = responseText.indexOf('### --- RUBRIC START ---');

      let assignText = '';
      let rubText = '';

      if (assignmentIndex !== -1 && rubricIndex !== -1) {
        assignText = responseText.substring(assignmentIndex + '### --- ASSIGNMENT START ---'.length, rubricIndex).trim();
        rubText = responseText.substring(rubricIndex + '### --- RUBRIC START ---'.length).trim();
      } else {
        assignText = responseText;
        rubText = 'Scoring guidelines are included inside the main content above.';
      }

      setGeneratedAssignment(assignText);
      setGeneratedRubric(rubText);
      setActiveTab('assignment');
      toast.success('Assignment created successfully! 🇬🇭');
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || 'Failed to generate assignment.');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    const textToPrint = activeTab === 'assignment' ? generatedAssignment : generatedRubric;
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    
    const lines = doc.splitTextToSize(textToPrint, 180);
    let y = 15;
    
    lines.forEach((line: string) => {
      if (y > 280) {
        doc.addPage();
        y = 15;
      }
      doc.text(line, 15, y);
      y += 6;
    });

    doc.save(`teachsmart_assignment_${subject.toLowerCase().replace(/\s+/g, '_')}.pdf`);
    toast.success('PDF downloaded successfully!');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-6">
        <div>
          <span className="px-2.5 py-1 bg-ghana-gold/20 text-emerald-950 text-[10px] font-black rounded-lg uppercase tracking-wider inline-block">
            SBC Pedagogy
          </span>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight mt-2">AI Assignment & Rubric Generator</h1>
          <p className="text-slate-500 text-sm mt-1">Design hands-on activities, projects, classwork, and curriculum homework complete with grading rubrics.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Controls Pane */}
        <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-6 h-fit">
          <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
            <LayoutList size={18} className="text-ghana-gold" />
            Assignment Setup
          </h2>

          <div className="space-y-4">
            {/* Level */}
            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-2">Education Level</label>
              <div className="grid grid-cols-4 gap-2">
                {levels.map((l) => (
                  <button
                    key={l}
                    onClick={() => setLevel(l)}
                    className={`py-2 px-3 text-xs font-bold rounded-xl transition-all ${
                      level === l 
                        ? 'bg-slate-900 text-white shadow-md' 
                        : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>

            {/* Class */}
            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-2">Class / Form</label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3 text-sm font-bold text-slate-800 focus:outline-none"
              >
                {classes.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Subject */}
            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-2">Subject</label>
              <SearchableDropdown
                options={subjects}
                value={subject}
                onChange={setSubject}
                placeholder="Select Subject..."
              />
            </div>

            {/* Term */}
            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-2">Term</label>
              <select
                value={term}
                onChange={(e) => setTerm(e.target.value)}
                className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3 text-sm font-bold text-slate-800 focus:outline-none"
              >
                <option value="1">Term 1</option>
                <option value="2">Term 2</option>
                <option value="3">Term 3</option>
              </select>
            </div>

            {/* Assignment Type */}
            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-2">Assignment Category</label>
              <select
                value={assignmentType}
                onChange={(e) => setAssignmentType(e.target.value)}
                className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3 text-sm font-bold text-slate-800 focus:outline-none"
              >
                <option value="homework">Homework Sheet</option>
                <option value="classwork">Classwork Worksheet</option>
                <option value="project">Term Project / Creative Task</option>
                <option value="practical">BSTEM / 3-H Practical Lab Activity</option>
              </select>
            </div>

            {/* Rubric style */}
            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-2">Evaluation Rubric</label>
              <select
                value={rubricType}
                onChange={(e) => setRubricType(e.target.value)}
                className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3 text-sm font-bold text-slate-800 focus:outline-none"
              >
                <option value="detailed">Detailed Rubric Table (SBC Compliant)</option>
                <option value="simple">Simple Criteria Points Checklist</option>
                <option value="none">No Rubric</option>
              </select>
            </div>

            {/* Custom Topic / Instructions */}
            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-2">Topic or Specific Indicator</label>
              <textarea
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. Traditional chieftaincy structures in Ghana OR Density of liquids experiment"
                className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3 text-sm font-bold text-slate-800 focus:outline-none h-20 resize-none"
              />
            </div>

            {/* Language Selection */}
            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-2">Language Mode</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3 text-sm font-bold text-slate-800 focus:outline-none mb-2"
              >
                <option value="English">English</option>
                <option value="Bilingual">Bilingual Mode</option>
              </select>

              {language === 'Bilingual' && (
                <select
                  value={bilingualLanguage}
                  onChange={(e) => setBilingualLanguage(e.target.value)}
                  className="w-full bg-emerald-50 border border-emerald-100 text-emerald-950 rounded-xl p-3 text-sm font-bold focus:outline-none"
                >
                  <option value="Twi">Akan (Twi)</option>
                  <option value="Fante">Fante</option>
                  <option value="Ewe">Ewe</option>
                  <option value="Ga">Ga</option>
                  <option value="Dagbani">Dagbani</option>
                </select>
              )}
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
                Crafting Assignment...
              </>
            ) : (
              <>
                <Sparkles size={16} className="text-ghana-gold animate-pulse" />
                Generate Assignment
              </>
            )}
          </button>
        </div>

        {/* Display Pane */}
        <div className="lg:col-span-8 flex flex-col space-y-4">
          {generatedAssignment ? (
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm flex-1 flex flex-col overflow-hidden min-h-[500px]">
              {/* Output Tab Selection */}
              <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 bg-slate-50 flex-wrap gap-3">
                <div className="flex gap-2 flex-wrap sm:flex-nowrap">
                  <button
                    onClick={() => setActiveTab('assignment')}
                    className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                      activeTab === 'assignment' 
                        ? 'bg-slate-900 text-white' 
                        : 'text-slate-500 hover:bg-slate-200'
                    }`}
                  >
                    Assignment Sheet
                  </button>
                  <button
                    onClick={() => setActiveTab('rubric')}
                    className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                      activeTab === 'rubric' 
                        ? 'bg-slate-900 text-white' 
                        : 'text-slate-500 hover:bg-slate-200'
                    }`}
                  >
                    Grading Rubric
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className={`px-3 py-2 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-sm ${
                      isEditing
                        ? 'bg-amber-500 hover:bg-amber-600 text-white'
                        : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {isEditing ? <Eye size={14} /> : <Edit3 size={14} />}
                    {isEditing ? 'Preview' : 'Edit Text'}
                  </button>
                  <button
                    onClick={handlePrint}
                    className="p-2 bg-white text-slate-700 hover:bg-slate-100 rounded-xl border border-slate-200 transition-all"
                    title="Print Assignment"
                  >
                    <Printer size={16} />
                  </button>
                  <button
                    onClick={handleDownloadPDF}
                    className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-sm"
                    title="Download as PDF"
                  >
                    <Download size={14} />
                    Download PDF
                  </button>
                </div>
              </div>

              {/* Teacher Modification Banner */}
              {hasEdited && (
                <div className="bg-emerald-50 border-b border-emerald-100 px-6 py-2.5 flex items-center justify-between text-xs text-emerald-900">
                  <div className="flex items-center gap-2">
                    <CheckCircle size={14} className="text-emerald-600" />
                    <span className="font-semibold text-[11px]">Teacher modifications active. Changes will appear in your PDF and print output.</span>
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-200/60 px-2 py-0.5 rounded-md">Edited</span>
                </div>
              )}

              {/* Document Display / Edit Mode */}
              {isEditing ? (
                <div className="p-6 flex-1 flex flex-col space-y-4 bg-slate-50/50">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-black text-slate-800 uppercase tracking-wider">
                      Editing {activeTab === 'assignment' ? 'Assignment Task & Instructions' : 'Grading Rubric'}
                    </label>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="px-4 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-bold hover:bg-slate-800 flex items-center gap-1"
                    >
                      <Check size={13} />
                      Done & Preview
                    </button>
                  </div>
                  <textarea
                    rows={16}
                    value={activeTab === 'assignment' ? generatedAssignment : generatedRubric}
                    onChange={(e) => {
                      if (activeTab === 'assignment') {
                        setGeneratedAssignment(e.target.value);
                      } else {
                        setGeneratedRubric(e.target.value);
                      }
                      setHasEdited(true);
                    }}
                    className="w-full p-4 bg-white border border-slate-200 rounded-2xl text-xs font-mono text-slate-800 focus:outline-none focus:border-emerald-500 leading-relaxed shadow-inner"
                    placeholder="Edit assignment content directly..."
                  />
                </div>
              ) : (
                <div className="p-8 flex-1 overflow-y-auto max-h-[600px] prose prose-slate max-w-none print:max-h-none print:p-0">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeTab}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="markdown-body"
                    >
                      <SafeMarkdown>
                        {activeTab === 'assignment' ? generatedAssignment : generatedRubric}
                      </SafeMarkdown>
                    </motion.div>
                  </AnimatePresence>
                </div>
              )}

              {/* Branded Footer */}
              <div className="px-6 py-3 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-[10px] text-slate-400 font-bold">
                <span>TeachSmartGH v2.0 • Catalyst Creative</span>
                <span className="uppercase text-emerald-600">3-H Pedagogy Approved</span>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-12 text-center flex flex-col items-center justify-center min-h-[500px]">
              <div className="w-16 h-16 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center mb-4">
                <Award size={28} />
              </div>
              <h3 className="text-xl font-black text-slate-900">Your AI-generated assignment will appear here</h3>
              <p className="text-slate-500 text-sm max-w-sm mt-2">Adjust details in the left panel and click generate to build fully compliant homework tasks or hands-on activities instantly.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
