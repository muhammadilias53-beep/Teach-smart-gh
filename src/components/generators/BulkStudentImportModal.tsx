import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Upload, FileSpreadsheet, Download, CheckCircle2, AlertTriangle, 
  Trash2, ArrowRight, RefreshCw, FileText, Check, AlertCircle,
  HelpCircle, UserCheck, X
} from 'lucide-react';
import { 
  parseStudentCSV, 
  downloadSampleCSVTemplate, 
  ParsedStudentRow, 
  CSVParseResult 
} from '../../lib/csvParser';
import { StudentScore } from './ReportGenerator';
import { toast } from 'react-hot-toast';

interface BulkStudentImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (newStudents: StudentScore[], mode: 'append' | 'replace') => void;
  currentStudentCount: number;
  classWeight: number;
  examWeight: number;
  selectedClass: string;
  selectedSubject: string;
  gradingSystem: 'ges_numeric' | 'letter';
  calculateMetrics: (classScore: number, examScore: number, system?: 'ges_numeric' | 'letter') => {
    total: number;
    grade: string;
    gradeDesc: string;
    remark: string;
  };
}

export const BulkStudentImportModal: React.FC<BulkStudentImportModalProps> = ({
  isOpen,
  onClose,
  onImport,
  currentStudentCount,
  classWeight,
  examWeight,
  selectedClass,
  selectedSubject,
  gradingSystem,
  calculateMetrics
}) => {
  const [importTab, setImportTab] = useState<'upload' | 'paste'>('upload');
  const [dragActive, setDragActive] = useState(false);
  const [rawText, setRawText] = useState('');
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileSize, setFileSize] = useState<string | null>(null);
  const [parseResult, setParseResult] = useState<CSVParseResult | null>(null);
  const [importMode, setImportMode] = useState<'append' | 'replace'>(currentStudentCount > 0 ? 'append' : 'replace');
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // Process text into CSVParseResult
  const handleProcessText = (text: string, name?: string, size?: number) => {
    if (!text.trim()) {
      setParseResult(null);
      setFileName(null);
      setFileSize(null);
      return;
    }

    const result = parseStudentCSV(text, classWeight, examWeight);
    setParseResult(result);
    setRawText(text);
    if (name) setFileName(name);
    if (size) {
      const kb = (size / 1024).toFixed(1);
      setFileSize(`${kb} KB`);
    }
  };

  // Handle File selection via input
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      handleProcessText(content, file.name, file.size);
    };
    reader.readAsText(file);
  };

  // Drag & Drop handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        handleProcessText(content, file.name, file.size);
      };
      reader.readAsText(file);
    }
  };

  // Convert parsed rows to final StudentScore objects
  const handleConfirmImport = () => {
    if (!parseResult || parseResult.validCount === 0) {
      toast.error('No valid student records found to import.');
      return;
    }

    const validRows = parseResult.rows.filter(r => r.isValid);
    const newStudents: StudentScore[] = validRows.map((row, index) => {
      const metrics = calculateMetrics(row.classScore, row.examScore, gradingSystem);
      return {
        id: 'std_' + Date.now() + '_' + index + '_' + Math.random().toString(36).substring(2, 6),
        name: row.name,
        gender: row.gender || 'male',
        rollNumber: row.rollNumber,
        classScore: row.classScore,
        examScore: row.examScore,
        total: metrics.total,
        grade: metrics.grade,
        gradeDesc: metrics.gradeDesc,
        remark: row.remark || metrics.remark,
        attendance: row.attendance || '—',
        conduct: row.conduct || 'Good',
        attitude: row.attitude || 'Attentive'
      };
    });

    onImport(newStudents, importMode);
    toast.success(
      importMode === 'replace'
        ? `Replaced roster with ${newStudents.length} students!`
        : `Successfully added ${newStudents.length} students to ${selectedClass}!`
    );
    handleReset();
    onClose();
  };

  const handleReset = () => {
    setParseResult(null);
    setRawText('');
    setFileName(null);
    setFileSize(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 10 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 10 }}
        className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden"
      >
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/30 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 rounded-2xl flex items-center justify-center border border-emerald-200 dark:border-emerald-800">
              <FileSpreadsheet size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  Bulk Import Students (CSV / Excel)
                </h3>
                <span className="px-2 py-0.5 bg-ghana-gold/20 text-emerald-950 text-[10px] font-black rounded-md uppercase">
                  NaCCA SBA
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Import learner rosters and marks for <strong className="text-slate-800 dark:text-slate-200">{selectedClass} ({selectedSubject})</strong>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 rounded-xl transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Top Actions: Template Download & Tab Select */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-700">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-600 dark:text-slate-300">Need a template?</span>
              <button
                type="button"
                onClick={() => downloadSampleCSVTemplate(selectedClass.replace(/\s+/g, '_'), classWeight, examWeight)}
                className="px-3 py-1.5 bg-white dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-700 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-all"
              >
                <Download size={13} />
                Download CSV Sample Template
              </button>
            </div>

            {/* Input Mode Toggle */}
            <div className="flex items-center bg-slate-200/80 dark:bg-slate-700 p-1 rounded-xl w-fit">
              <button
                type="button"
                onClick={() => setImportTab('upload')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  importTab === 'upload'
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                }`}
              >
                <Upload size={13} />
                Upload CSV File
              </button>
              <button
                type="button"
                onClick={() => setImportTab('paste')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  importTab === 'paste'
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                }`}
              >
                <FileText size={13} />
                Paste Text / Excel
              </button>
            </div>
          </div>

          {/* Tab 1: File Upload / Drag & Drop */}
          {importTab === 'upload' && !parseResult && (
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-3xl p-8 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-3 ${
                dragActive
                  ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20'
                  : 'border-slate-300 dark:border-slate-700 hover:border-emerald-500 bg-white dark:bg-slate-800/40'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv, .tsv, .txt"
                onChange={handleFileChange}
                className="hidden"
              />
              <div className="w-14 h-14 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 rounded-2xl flex items-center justify-center">
                <Upload size={26} />
              </div>
              <div>
                <p className="text-sm font-black text-slate-900 dark:text-white">
                  Click to select or drag and drop your CSV file here
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Supports comma-separated (.csv), tab-separated (.tsv), and plain text lists (.txt)
                </p>
              </div>
              <div className="flex flex-wrap gap-2 justify-center mt-2 text-[11px] font-bold text-slate-400">
                <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded-md">Student Name</span>
                <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded-md">Gender</span>
                <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded-md">Class Score ({classWeight}%)</span>
                <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded-md">Exam Score ({examWeight}%)</span>
                <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded-md">Remarks</span>
              </div>
            </div>
          )}

          {/* Tab 2: Paste Raw CSV / Excel Tabular Text */}
          {importTab === 'paste' && !parseResult && (
            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                Paste student records from Excel, Google Sheets, or plain text:
              </label>
              <textarea
                rows={7}
                value={rawText}
                onChange={(e) => setRawText(e.target.value)}
                placeholder="Kwame Mensah, Male, GH-001, 24, 58&#10;Ama Serwaa, Female, GH-002, 27, 65&#10;Kofi Owusu, Male, GH-003, 18, 45..."
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 text-xs font-mono text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900 leading-relaxed"
              />
              <div className="flex justify-between items-center">
                <p className="text-[11px] text-slate-400">
                  Tip: You can copy directly from an Excel sheet and paste above.
                </p>
                <button
                  type="button"
                  onClick={() => handleProcessText(rawText)}
                  disabled={!rawText.trim()}
                  className="px-4 py-2 bg-slate-900 hover:bg-black text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all disabled:opacity-40"
                >
                  <ArrowRight size={14} />
                  Preview Roster
                </button>
              </div>
            </div>
          )}

          {/* Preview & Validation State */}
          {parseResult && (
            <div className="space-y-4">
              {/* Summary Banner */}
              <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-600 text-white rounded-xl flex items-center justify-center shrink-0">
                    <UserCheck size={20} />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-emerald-950 dark:text-emerald-200">
                      {parseResult.validCount} Valid Students Detected
                    </h4>
                    <p className="text-xs text-emerald-700 dark:text-emerald-400">
                      {fileName ? `${fileName} (${fileSize})` : 'Pasted Text Data'} • {parseResult.hasScores ? 'Scores & Marks Detected' : 'Names-Only Roster'}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleReset}
                  className="px-3 py-1.5 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-rose-600 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl flex items-center gap-1.5 w-fit"
                >
                  <RefreshCw size={12} />
                  Choose Another File
                </button>
              </div>

              {/* Warnings if any */}
              {parseResult.warnings.length > 0 && (
                <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-xl flex items-start gap-2 text-xs text-amber-800 dark:text-amber-300">
                  <AlertTriangle size={15} className="shrink-0 mt-0.5 text-amber-600" />
                  <div className="space-y-0.5">
                    <p className="font-bold">Data Adjustment Notes:</p>
                    {parseResult.warnings.slice(0, 3).map((w, idx) => (
                      <p key={idx} className="text-[11px] text-amber-700 dark:text-amber-400">• {w}</p>
                    ))}
                  </div>
                </div>
              )}

              {/* Table Preview */}
              <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-2xs">
                <div className="max-h-60 overflow-y-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold sticky top-0 border-b border-slate-200 dark:border-slate-700">
                      <tr>
                        <th className="p-2.5 pl-3">#</th>
                        <th className="p-2.5">Student Name</th>
                        <th className="p-2.5">Sex</th>
                        <th className="p-2.5">Roll / ID</th>
                        <th className="p-2.5 text-center">Class ({classWeight}%)</th>
                        <th className="p-2.5 text-center">Exam ({examWeight}%)</th>
                        <th className="p-2.5 text-center">Total</th>
                        <th className="p-2.5 text-center">GES Grade</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {parseResult.rows.map((row, idx) => {
                        const metrics = calculateMetrics(row.classScore, row.examScore, gradingSystem);
                        return (
                          <tr 
                            key={idx} 
                            className={row.isValid ? 'hover:bg-slate-50 dark:hover:bg-slate-800/50' : 'bg-rose-50/50 dark:bg-rose-950/20 text-rose-600'}
                          >
                            <td className="p-2.5 pl-3 font-mono text-slate-400">{idx + 1}</td>
                            <td className="p-2.5 font-bold text-slate-900 dark:text-white">
                              {row.name || <span className="italic text-rose-500">Missing Name</span>}
                            </td>
                            <td className="p-2.5 capitalize text-slate-500">{row.gender === 'female' ? 'F' : 'M'}</td>
                            <td className="p-2.5 font-mono text-slate-500">{row.rollNumber || '—'}</td>
                            <td className="p-2.5 text-center font-bold text-slate-700 dark:text-slate-300">{row.classScore}</td>
                            <td className="p-2.5 text-center font-bold text-slate-700 dark:text-slate-300">{row.examScore}</td>
                            <td className="p-2.5 text-center font-black text-emerald-600">{metrics.total}</td>
                            <td className="p-2.5 text-center">
                              <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded font-black text-[11px]">
                                {metrics.grade}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Import Options: Append vs. Replace */}
              {currentStudentCount > 0 && (
                <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2">
                  <span className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    Existing Roster Action (Currently has {currentStudentCount} students):
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <label className={`p-3 rounded-xl border cursor-pointer flex items-start gap-3 transition-all ${
                      importMode === 'append'
                        ? 'border-emerald-500 bg-emerald-50/40 dark:bg-emerald-950/20 text-emerald-950 dark:text-emerald-200'
                        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300'
                    }`}>
                      <input
                        type="radio"
                        name="importMode"
                        checked={importMode === 'append'}
                        onChange={() => setImportMode('append')}
                        className="mt-0.5 text-emerald-600"
                      />
                      <div>
                        <p className="text-xs font-black">Append to Existing Roster</p>
                        <p className="text-[10px] text-slate-500 mt-0.5">Keep current {currentStudentCount} students and append the new list.</p>
                      </div>
                    </label>

                    <label className={`p-3 rounded-xl border cursor-pointer flex items-start gap-3 transition-all ${
                      importMode === 'replace'
                        ? 'border-rose-500 bg-rose-50/40 dark:bg-rose-950/20 text-rose-950 dark:text-rose-200'
                        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300'
                    }`}>
                      <input
                        type="radio"
                        name="importMode"
                        checked={importMode === 'replace'}
                        onChange={() => setImportMode('replace')}
                        className="mt-0.5 text-rose-600"
                      />
                      <div>
                        <p className="text-xs font-black">Replace Current Roster</p>
                        <p className="text-[10px] text-slate-500 mt-0.5">Overwrite the existing {currentStudentCount} students with this imported list.</p>
                      </div>
                    </label>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex items-center justify-between shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 text-xs font-bold text-slate-500 hover:text-slate-700 dark:text-slate-400 rounded-xl"
          >
            Cancel
          </button>

          {parseResult ? (
            <button
              type="button"
              onClick={handleConfirmImport}
              disabled={parseResult.validCount === 0}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black uppercase tracking-wider rounded-xl flex items-center gap-2 transition-all shadow-md disabled:opacity-40"
            >
              <Check size={16} />
              Confirm & Import {parseResult.validCount} Students
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                if (importTab === 'paste') {
                  handleProcessText(rawText);
                } else {
                  fileInputRef.current?.click();
                }
              }}
              className="px-5 py-2.5 bg-slate-900 hover:bg-black text-white text-xs font-black uppercase tracking-wider rounded-xl flex items-center gap-2 transition-all shadow-md"
            >
              <Upload size={14} />
              Continue to Preview
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
};
