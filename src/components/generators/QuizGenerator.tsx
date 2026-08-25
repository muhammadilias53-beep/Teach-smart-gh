import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Download, RefreshCw, Printer, AlertCircle, FileText, CheckSquare, Plus, Trash2, HelpCircle, Edit3, Check, Eye, CheckCircle } from 'lucide-react';
import { generateWithProxy } from '../../lib/gemini';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router';
import { toast } from 'react-hot-toast';
import { SafeMarkdown } from '../common/SafeMarkdown';
import { levels, CLASSES_BY_LEVEL, subjectsByLevel } from '../../constants';
import { SearchableDropdown } from '../ui/SearchableDropdown';
import { cacheGeneratedDocument } from '../../lib/offlineDocumentCache';
import jsPDF from 'jspdf';
import { exportQuizToWord } from '../../lib/wordExport';

export default function QuizGenerator() {
  const { canGenerate, profile } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [level, setLevel] = useState('JHS');
  const [selectedClass, setSelectedClass] = useState('');
  const [subject, setSubject] = useState('Science');
  const [term, setTerm] = useState('1');
  const [numQuestions, setNumQuestions] = useState(10);
  const [quizType, setQuizType] = useState('mcq'); // 'mcq', 'tf', 'short', 'mix'
  const [includeMarkingScheme, setIncludeMarkingScheme] = useState(true);
  const [language, setLanguage] = useState('English');
  const [bilingualLanguage, setBilingualLanguage] = useState('Twi');

  const [generatedQuiz, setGeneratedQuiz] = useState<string>('');
  const [generatedScheme, setGeneratedScheme] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'quiz' | 'scheme'>('quiz');
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
      toast.error('Please upgrade your membership to generate premium quizzes.');
      navigate('/billing');
      return;
    }

    setLoading(true);
    setGeneratedQuiz('');
    setGeneratedScheme('');

    const langInstruction = language === 'English' 
      ? 'Generate entirely in clear English.' 
      : `Generate in Bilingual Mode: first in English, and immediately followed by the exact ${bilingualLanguage} translation.`;

    const systemInstruction = `You are an expert Ghana Education Service (GES) examination officer and NaCCA assessment specialist.
    Generate a high-quality classroom quiz that strictly conforms to the NaCCA Standard-Based Curriculum guidelines.
    Return the response in a structured format containing both the Quiz/Questions and the detailed Marking Scheme with step-by-step explanations for answers.
    Use professional educational language suited for Ghanaian students at ${level} (${selectedClass}).
    Include localized Ghanaian names, references, items, and environments where applicable.`;

    const prompt = `Generate a printable classroom quiz with the following parameters:
    - Subject: ${subject}
    - Level: ${level} (Class: ${selectedClass})
    - Term: Term ${term}
    - Number of Questions: ${numQuestions}
    - Quiz Type: ${quizType === 'mcq' ? 'Multiple Choice (MCQ)' : quizType === 'tf' ? 'True or False' : quizType === 'short' ? 'Short Answers/Fill-ins' : 'Mixed Types'}
    - Language: ${language} ${language !== 'English' ? `(Bilingual with ${bilingualLanguage})` : ''}

    ${langInstruction}

    Please separate the output clearly into two parts using the exact markdown headings:
    ### --- QUIZ START ---
    [Your beautiful exam paper layout: Include School Name Placeholder, Student Name and Date Field at the top, clear instructions, and numbered questions. If MCQ, label choices as A, B, C, D.]

    ### --- MARKING SCHEME ---
    [Your complete marking scheme/answer sheet, containing correct answers, total marks, and brief educational explanations for why each answer is correct so the teacher can guide students.]
    `;

    try {
      const responseText = await generateWithProxy(prompt, systemInstruction);
      if (!responseText) {
        throw new Error('Received empty response from the AI assistant.');
      }

      // Parse the response into quiz and marking scheme
      const quizIndex = responseText.indexOf('### --- QUIZ START ---');
      const schemeIndex = responseText.indexOf('### --- MARKING SCHEME ---');

      let quizText = '';
      let schemeText = '';

      if (quizIndex !== -1 && schemeIndex !== -1) {
        quizText = responseText.substring(quizIndex + '### --- QUIZ START ---'.length, schemeIndex).trim();
        schemeText = responseText.substring(schemeIndex + '### --- MARKING SCHEME ---'.length).trim();
      } else {
        // Fallback split
        quizText = responseText;
        schemeText = 'Complete marking details are integrated within the document above.';
      }

      setGeneratedQuiz(quizText);
      setGeneratedScheme(schemeText);
      setActiveTab('quiz');

      const userUid = (window as any)?.__teachsmart_user_id || undefined;
      cacheGeneratedDocument({
        id: `quiz_${Date.now()}`,
        authorId: userUid,
        title: `${subject} - Term ${term} Quiz (${selectedClass || level})`,
        type: 'quiz',
        subject: subject,
        level: `${level} ${selectedClass}`.trim(),
        class: selectedClass,
        content: `### QUIZ / QUESTIONS\n\n${quizText}\n\n### MARKING SCHEME\n\n${schemeText}`,
        questions: quizText,
        markingScheme: schemeText,
        createdAt: Date.now(),
        synced: false
      });

      toast.success('Quiz generated & cached offline! 🇬🇭');
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || 'Failed to generate quiz. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    const textToPrint = activeTab === 'quiz' ? generatedQuiz : generatedScheme;
    
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

    doc.save(`teachsmart_quiz_${subject.toLowerCase().replace(/\s+/g, '_')}.pdf`);
    toast.success('PDF downloaded successfully!');
  };

  const [exportingWord, setExportingWord] = useState(false);

  const handleDownloadWord = async () => {
    const textToPrint = activeTab === 'quiz' ? generatedQuiz : generatedScheme;
    if (!textToPrint) return;
    setExportingWord(true);
    try {
      await exportQuizToWord(textToPrint, {
        subject,
        classLevel: selectedClass,
        level,
        title: `${subject} - ${activeTab === 'quiz' ? 'Class Test & Quiz' : 'Quiz Answers & Marking'} (${selectedClass})`,
        documentType: activeTab === 'quiz' ? 'Class Quiz & Test' : 'Quiz Marking Scheme'
      });
    } catch (err) {
      console.error(err);
      toast.error('Failed to export to Word document.');
    } finally {
      setExportingWord(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-6">
        <div>
          <span className="px-2.5 py-1 bg-ghana-gold/20 text-emerald-950 text-[10px] font-black rounded-lg uppercase tracking-wider inline-block">
            Assessment Engine
          </span>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight mt-2">AI Quiz Generator</h1>
          <p className="text-slate-500 text-sm mt-1">Generate highly structured printable classroom quizzes with complete marking schemes.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Controls Pane */}
        <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-6 h-fit">
          <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
            <Sparkles size={18} className="text-ghana-gold" />
            Quiz Parameters
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
                className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3 text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900"
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

            {/* Questions count */}
            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-2">Number of Questions</label>
              <select
                value={numQuestions}
                onChange={(e) => setNumQuestions(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3 text-sm font-bold text-slate-800 focus:outline-none"
              >
                <option value="5">5 Questions</option>
                <option value="10">10 Questions</option>
                <option value="15">15 Questions</option>
                <option value="20">20 Questions</option>
              </select>
            </div>

            {/* Question Type */}
            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-2">Question Type</label>
              <select
                value={quizType}
                onChange={(e) => setQuizType(e.target.value)}
                className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3 text-sm font-bold text-slate-800 focus:outline-none"
              >
                <option value="mcq">Multiple Choice Questions (MCQ)</option>
                <option value="tf">True / False</option>
                <option value="short">Short Written Answers</option>
                <option value="mix">Mixed Formats</option>
              </select>
            </div>

            {/* Multilingual / Bilingual Options */}
            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-2">Language Mode</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3 text-sm font-bold text-slate-800 focus:outline-none mb-2"
              >
                <option value="English">Monolingual English</option>
                <option value="Bilingual">Bilingual (English + Ghanaian Language)</option>
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
                Crafting Quiz...
              </>
            ) : (
              <>
                <Sparkles size={16} className="text-ghana-gold animate-pulse" />
                Generate Premium Quiz
              </>
            )}
          </button>
        </div>

        {/* Display Pane */}
        <div className="lg:col-span-8 flex flex-col space-y-4">
          {generatedQuiz ? (
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm flex-1 flex flex-col overflow-hidden min-h-[500px]">
              {/* Output Tab Selection */}
              <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 bg-slate-50 flex-wrap gap-3">
                <div className="flex gap-2 flex-wrap sm:flex-nowrap">
                  <button
                    onClick={() => setActiveTab('quiz')}
                    className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                      activeTab === 'quiz' 
                        ? 'bg-slate-900 text-white' 
                        : 'text-slate-500 hover:bg-slate-200'
                    }`}
                  >
                    Quiz Sheet
                  </button>
                  <button
                    onClick={() => setActiveTab('scheme')}
                    className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                      activeTab === 'scheme' 
                        ? 'bg-slate-900 text-white' 
                        : 'text-slate-500 hover:bg-slate-200'
                    }`}
                  >
                    Marking Scheme
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
                    title="Print Quiz"
                  >
                    <Printer size={16} />
                  </button>
                  <button
                    onClick={handleDownloadPDF}
                    className="px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-sm"
                    title="Download as PDF"
                  >
                    <Download size={14} />
                    PDF
                  </button>
                  <button
                    onClick={handleDownloadWord}
                    disabled={exportingWord}
                    className="px-3 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-sm shadow-blue-700/20"
                    title="Download as Word Document (.docx)"
                  >
                    <FileText size={14} />
                    {exportingWord ? "Word..." : "Word (.docx)"}
                  </button>
                </div>
              </div>

              {/* Teacher Modification Banner */}
              {hasEdited && (
                <div className="bg-emerald-50 border-b border-emerald-100 px-6 py-2.5 flex items-center justify-between text-xs text-emerald-900">
                  <div className="flex items-center gap-2">
                    <CheckCircle size={14} className="text-emerald-600" />
                    <span className="font-semibold text-[11px]">Teacher modifications active. Changes will appear in your quiz PDF and print output.</span>
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-200/60 px-2 py-0.5 rounded-md">Edited</span>
                </div>
              )}

              {/* Document Display / Edit Mode */}
              {isEditing ? (
                <div className="p-6 flex-1 flex flex-col space-y-4 bg-slate-50/50">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-black text-slate-800 uppercase tracking-wider">
                      Editing {activeTab === 'quiz' ? 'Quiz Questions' : 'Marking Scheme & Answers'}
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
                    value={activeTab === 'quiz' ? generatedQuiz : generatedScheme}
                    onChange={(e) => {
                      if (activeTab === 'quiz') {
                        setGeneratedQuiz(e.target.value);
                      } else {
                        setGeneratedScheme(e.target.value);
                      }
                      setHasEdited(true);
                    }}
                    className="w-full p-4 bg-white border border-slate-200 rounded-2xl text-xs font-mono text-slate-800 focus:outline-none focus:border-emerald-500 leading-relaxed shadow-inner"
                    placeholder="Edit quiz text directly..."
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
                        {activeTab === 'quiz' ? generatedQuiz : generatedScheme}
                      </SafeMarkdown>
                    </motion.div>
                  </AnimatePresence>
                </div>
              )}

              {/* Branded Footer */}
              <div className="px-6 py-3 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-[10px] text-slate-400 font-bold">
                <span>TeachSmartGH v2.0 • Catalyst Creative</span>
                <span className="uppercase text-emerald-600">NaCCA Curriculum Aligned</span>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-12 text-center flex flex-col items-center justify-center min-h-[500px]">
              <div className="w-16 h-16 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center mb-4">
                <HelpCircle size={28} />
              </div>
              <h3 className="text-xl font-black text-slate-900">Your AI-generated quiz will appear here</h3>
              <p className="text-slate-500 text-sm max-w-sm mt-2">Adjust the parameters in the left panel and click generate to create customized classroom quizzes instantly.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
