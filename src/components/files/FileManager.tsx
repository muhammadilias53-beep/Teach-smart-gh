import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Upload, FileText, CheckCircle, RefreshCw, Sparkles, Download, Info, Trash2, HelpCircle } from 'lucide-react';
import { generateWithProxy } from '../../lib/gemini';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { SafeMarkdown } from '../common/SafeMarkdown';

interface UploadedFile {
  name: string;
  size: string;
  type: string;
  content: string; // extracted text mock
}

export default function FileManager() {
  const { canGenerate } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<UploadedFile[]>([
    { 
      name: 'NaCCA_Science_B7_Handbook.pdf', 
      size: '1.2 MB', 
      type: 'pdf', 
      content: 'This document describes the Basic 7 Science Standard-Based Curriculum guidelines, focusing on diversity of matter, interactions of matter, and systems. Strands emphasize student-led scientific investigation.' 
    }
  ]);
  const [activeFile, setActiveFile] = useState<UploadedFile | null>(files[0]);
  const [aiMode, setAiMode] = useState<'summary' | 'questions'>('summary');
  const [aiResult, setAiResult] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (rawFile: File) => {
    // Determine type
    const extension = rawFile.name.split('.').pop()?.toLowerCase() || '';
    if (!['pdf', 'docx', 'pptx', 'png', 'jpg', 'jpeg'].includes(extension)) {
      toast.error('Unsupported file format! Please upload PDF, DOCX, PPTX, or Images.');
      return;
    }

    const newFile: UploadedFile = {
      name: rawFile.name,
      size: (rawFile.size / (1024 * 1024)).toFixed(1) + ' MB',
      type: extension,
      content: `Extracted content from ${rawFile.name}. This document includes official teaching schemes, syllabus, exam guidelines, and structured outlines designed for Ghanaian schools.`
    };

    setFiles([...files, newFile]);
    setActiveFile(newFile);
    toast.success('File processed and mock contents extracted successfully!');
  };

  const handleDeleteFile = (name: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const filtered = files.filter(f => f.name !== name);
    setFiles(filtered);
    if (activeFile?.name === name) {
      setActiveFile(filtered[0] || null);
    }
    toast.success('File removed from dashboard.');
  };

  const handleTriggerAI = async () => {
    if (!activeFile) {
      toast.error('Please select a file to analyze.');
      return;
    }

    if (!canGenerate()) {
      toast.error('Please upgrade your membership to use AI Document Summarizer.');
      navigate('/billing');
      return;
    }

    setLoading(true);
    setAiResult('');

    const systemInstruction = `You are an elite educational AI research analyst, expert curriculum summarizer, and pedagogy architect.
    Analyze the text content from the uploaded document file.
    Formulate a beautiful, structured Markdown summary, or generate high-quality classroom questions/lessons from the document content.
    Keep explanations clear, highly scannable, using localized Ghanaian educational paradigms.`;

    const prompt = aiMode === 'summary'
      ? `Summarize the following document content elegantly in Markdown:
         File Name: ${activeFile.name}
         Extracted Contents: ${activeFile.content}
         
         Include key terms, core takeaways, and brief bulleted explanations.`
      : `Based on the following document content, generate 5 high-quality curriculum-aligned classroom review questions with answers:
         File Name: ${activeFile.name}
         Extracted Contents: ${activeFile.content}`;

    try {
      const responseText = await generateWithProxy(prompt, systemInstruction);
      setAiResult(responseText || 'Failed to process document with AI.');
      toast.success('AI Document processing complete! 🚀');
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || 'Failed to process file.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-6">
        <div>
          <span className="px-2.5 py-1 bg-ghana-gold/20 text-emerald-950 text-[10px] font-black rounded-lg uppercase tracking-wider inline-block">
            Smart Storage
          </span>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight mt-2">AI File Manager</h1>
          <p className="text-slate-500 text-sm mt-1">Upload PDF, DOCX, PPTX, or Images. Let AI automatically summarize or generate questions from them.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Files & Upload Roster */}
        <div className="lg:col-span-5 space-y-6">
          {/* Dropzone */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-3xl p-8 text-center flex flex-col items-center justify-center cursor-pointer transition-all ${
              isDragging 
                ? 'border-emerald-500 bg-emerald-50 text-emerald-800' 
                : 'border-slate-200 hover:border-slate-400 bg-white'
            }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={fileFileSelect => handleFileSelect(fileFileSelect)}
              className="hidden"
              accept=".pdf,.docx,.pptx,.png,.jpg,.jpeg"
            />
            <Upload size={32} className={`mb-3 ${isDragging ? 'text-emerald-500 animate-bounce' : 'text-slate-400'}`} />
            <h4 className="text-sm font-black text-slate-800">Drag & drop files here</h4>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mt-1">or click to browse files</p>
            <span className="text-[9px] text-slate-400 mt-2">Supports PDF, DOCX, PPTX, or Images</span>
          </div>

          {/* Roster list */}
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">Your Documents</h3>
            
            <div className="space-y-2">
              {files.map((file) => (
                <div
                  key={file.name}
                  onClick={() => {
                    setActiveFile(file);
                    setAiResult('');
                  }}
                  className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                    activeFile?.name === file.name 
                      ? 'bg-slate-900 border-slate-900 text-white shadow' 
                      : 'bg-white border-slate-100 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <FileText size={18} className={activeFile?.name === file.name ? 'text-ghana-gold' : 'text-slate-400'} />
                    <div className="max-w-[160px] truncate">
                      <h5 className="text-xs font-black truncate">{file.name}</h5>
                      <span className="text-[9px] font-bold text-slate-400 uppercase">{file.size} • {file.type}</span>
                    </div>
                  </div>

                  <button
                    onClick={(e) => handleDeleteFile(file.name, e)}
                    className={`p-1 rounded ${activeFile?.name === file.name ? 'text-slate-400 hover:text-white' : 'text-slate-400 hover:text-red-500'}`}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* AI summary view */}
        <div className="lg:col-span-7 flex flex-col space-y-4">
          {activeFile ? (
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 flex-1 flex flex-col min-h-[450px]">
              {/* File details */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4 mb-6">
                <div>
                  <h3 className="font-black text-slate-900 text-base">{activeFile.name}</h3>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Selected Active Document</span>
                </div>

                {/* AI mode select */}
                <div className="flex bg-slate-50 p-1 rounded-xl border border-slate-100 w-fit">
                  <button
                    onClick={() => setAiMode('summary')}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${
                      aiMode === 'summary' ? 'bg-slate-900 text-white' : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    Summary
                  </button>
                  <button
                    onClick={() => setAiMode('questions')}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${
                      aiMode === 'questions' ? 'bg-slate-900 text-white' : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    Q&A Gen
                  </button>
                </div>
              </div>

              {/* AI Trigger */}
              {!aiResult && (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-6 border border-slate-100 border-dashed rounded-2xl bg-slate-50/50 mb-4">
                  <Sparkles size={24} className="text-ghana-gold animate-bounce mb-2" />
                  <h4 className="text-sm font-black text-slate-800">Ready to analyze with AI</h4>
                  <p className="text-xs text-slate-500 max-w-xs mt-1">Let TeachSmart AI automatically extract summaries or generate questions from this document.</p>
                  
                  <button
                    onClick={handleTriggerAI}
                    disabled={loading}
                    className="mt-4 px-6 py-2.5 bg-slate-900 hover:bg-black text-white font-black rounded-xl text-xs uppercase tracking-widest flex items-center gap-2 transition-all shadow active:scale-95 disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <RefreshCw className="animate-spin" size={14} />
                        Analyzing with AI...
                      </>
                    ) : (
                      <>
                        <Sparkles size={14} className="text-ghana-gold" />
                        Analyze File Content
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* AI result display */}
              {aiResult && (
                <div className="flex-1 overflow-y-auto max-h-[400px] prose prose-slate max-w-none border border-slate-100 rounded-2xl p-6 bg-slate-50/20 mb-4 markdown-body">
                  <SafeMarkdown>{aiResult}</SafeMarkdown>
                </div>
              )}

              {/* File action buttons */}
              {aiResult && (
                <div className="flex items-center justify-between border-t border-slate-100 pt-4">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">AI Document Pulse Active</span>
                  <button
                    onClick={() => setAiResult('')}
                    className="px-4 py-2 hover:bg-slate-50 text-slate-500 rounded-xl text-xs font-black uppercase tracking-wider border border-slate-200 transition-all"
                  >
                    Reset Analysis
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-12 text-center flex flex-col items-center justify-center min-h-[450px] flex-1">
              <div className="w-16 h-16 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center mb-4">
                <Upload size={28} />
              </div>
              <h3 className="text-xl font-black text-slate-900">Upload a file to start</h3>
              <p className="text-slate-500 text-sm max-w-xs mt-2">Upload any school PDF, syllabus DOCX, slide PPTX, or diagram image in the left panel to begin AI processing.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
