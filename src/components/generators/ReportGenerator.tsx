import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, Download, RefreshCw, Printer, User, Award, ListFilter, 
  Percent, Plus, Trash2, ShieldCheck, HelpCircle, Save, Users, 
  FileSpreadsheet, Check, Edit2, ChevronDown, BookOpen, AlertTriangle,
  ArrowUpDown, Search, FileText, CheckCircle2, UserPlus, Upload,
  Edit3, Eye
} from 'lucide-react';
import { generateWithProxy } from '../../lib/gemini';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { SafeMarkdown } from '../common/SafeMarkdown';
import { safeLocalStorage } from '../../lib/storage';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export interface StudentScore {
  id: string;
  name: string;
  gender?: 'male' | 'female';
  rollNumber?: string;
  classScore: number; // Continuous Assessment (e.g. max 30 or 50)
  examScore: number;  // End of Term Exam (e.g. max 70 or 50)
  total: number;      // Total (out of 100)
  grade: string;      // e.g. "1" or "A"
  gradeDesc: string;  // e.g. "High Distinction"
  remark: string;     // Teacher's Remark
  attendance?: string;// e.g. "58/60 days"
  conduct?: string;   // e.g. "Very Good & Disciplined"
  attitude?: string;  // e.g. "Consistent and hardworking"
}

const GES_LEVELS = [
  'Basic 1', 'Basic 2', 'Basic 3', 'Basic 4', 'Basic 5', 'Basic 6',
  'Basic 7', 'Basic 8', 'Basic 9', 'Basic 10', 'Basic 11', 'Basic 12',
  'KG 1', 'KG 2'
];

const DEFAULT_SUBJECTS = [
  'Mathematics', 'English Language', 'Integrated Science', 'Social Studies', 
  'Computing / ICT', 'Career Technology', 'Creative Arts & Design', 
  'Religious & Moral Education (RME)', 'Ghanaian Language', 'French', 'Physical Education'
];

export default function ReportGenerator() {
  const { user, canGenerate } = useAuth();
  const navigate = useNavigate();

  // Mode: 'roster' (Student Marks & Score Sheet), 'comment' (AI Remarks Creator), 'single_card' (Individual Report Card Preview)
  const [activeTab, setActiveTab] = useState<'roster' | 'comment' | 'single_card'>('roster');
  const [loading, setLoading] = useState(false);

  // Class & Academic Term Metadata
  const [schoolName, setSchoolName] = useState(() => safeLocalStorage.getItem('teachsmart_school_name') || 'Ghana Model Basic School');
  const [selectedClass, setSelectedClass] = useState('Basic 7');
  const [selectedSubject, setSelectedSubject] = useState('Integrated Science');
  const [selectedTerm, setSelectedTerm] = useState('Term 1');
  const [academicYear, setAcademicYear] = useState('2025/2026');
  const [gradingSystem, setGradingSystem] = useState<'ges_numeric' | 'letter'>('ges_numeric'); // GES 1-9 vs A-F

  // Assessment Weights
  const [classWeight, setClassWeight] = useState<number>(30); // 30% Continuous Assessment
  const [examWeight, setExamWeight] = useState<number>(70);   // 70% End of Term Exam

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'rank' | 'total'>('rank');

  // Students list (NO AI generated or fake names by default - loaded from teacher storage)
  const storageKey = useMemo(() => {
    const userId = user?.uid || 'guest';
    const sanitizedClass = selectedClass.replace(/\s+/g, '_');
    const sanitizedSubject = selectedSubject.replace(/\s+/g, '_');
    const sanitizedTerm = selectedTerm.replace(/\s+/g, '_');
    return `teachsmart_terminal_roster_${userId}_${sanitizedClass}_${sanitizedSubject}_${sanitizedTerm}`;
  }, [user?.uid, selectedClass, selectedSubject, selectedTerm]);

  const [students, setStudents] = useState<StudentScore[]>([]);
  const [lastSavedTime, setLastSavedTime] = useState<string | null>(null);

  // Modals and Quick Inputs
  const [showBulkAddModal, setShowBulkAddModal] = useState(false);
  const [bulkNamesText, setBulkNamesText] = useState('');
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentGender, setNewStudentGender] = useState<'male' | 'female'>('male');
  const [newStudentRoll, setNewStudentRoll] = useState('');
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [selectedStudentForCard, setSelectedStudentForCard] = useState<string | null>(null);

  // Comment Generator States
  const [commentStudentName, setCommentStudentName] = useState('');
  const [commentGender, setCommentGender] = useState<'male' | 'female'>('male');
  const [commentPerformance, setCommentPerformance] = useState('Excellent');
  const [commentFocusAreas, setCommentFocusAreas] = useState<string[]>(['Behaviour', 'Academic Diligence']);
  const [generatedComment, setGeneratedComment] = useState('');
  const [isEditingComment, setIsEditingComment] = useState(false);

  // Load saved students on roster key change
  useEffect(() => {
    try {
      const saved = safeLocalStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setStudents(parsed);
          setLastSavedTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
          return;
        }
      }
      // If no saved students for this class/subject/term, start with empty list
      setStudents([]);
    } catch (e) {
      console.error('Failed to load roster:', e);
      setStudents([]);
    }
  }, [storageKey]);

  // Save to storage helper
  const saveRosterToStorage = (updatedStudents: StudentScore[]) => {
    try {
      safeLocalStorage.setItem(storageKey, JSON.stringify(updatedStudents));
      setLastSavedTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    } catch (e) {
      console.error('Failed to save roster to localStorage:', e);
    }
  };

  // Metric & GES Grade Calculation
  const calculateMetrics = (classScore: number, examScore: number, system: 'ges_numeric' | 'letter' = gradingSystem) => {
    const total = Math.round((classScore + examScore) * 10) / 10;
    
    let grade = '9';
    let gradeDesc = 'Fail';
    let remark = 'Requires urgent remedial attention.';

    if (system === 'ges_numeric') {
      // GES / NaCCA 1 - 9 Standard Grading Scale
      if (total >= 80) {
        grade = '1';
        gradeDesc = 'High Distinction';
        remark = 'Excellent mastery of concepts. Keep up the high standard!';
      } else if (total >= 70) {
        grade = '2';
        gradeDesc = 'Distinction';
        remark = 'Very commendable performance with strong effort.';
      } else if (total >= 65) {
        grade = '3';
        gradeDesc = 'High Credit';
        remark = 'Good grasp of subject matter. Capable of higher honours.';
      } else if (total >= 60) {
        grade = '4';
        gradeDesc = 'Credit';
        remark = 'Satisfactory performance. Regular practice will boost grade.';
      } else if (total >= 55) {
        grade = '5';
        gradeDesc = 'High Pass';
        remark = 'Fair performance. Encourage more homework completion.';
      } else if (total >= 50) {
        grade = '6';
        gradeDesc = 'Pass';
        remark = 'Average understanding. Needs to participate more in class.';
      } else if (total >= 45) {
        grade = '7';
        gradeDesc = 'Low Pass';
        remark = 'Weak pass. Needs guided remedial support.';
      } else if (total >= 40) {
        grade = '8';
        gradeDesc = 'Very Low Pass';
        remark = 'Barely passed. Urgent extra tuition recommended.';
      } else {
        grade = '9';
        gradeDesc = 'Fail';
        remark = 'Failed to meet minimum standard. Serious intervention needed.';
      }
    } else {
      // Letter Grade Scale (A to F)
      if (total >= 80) {
        grade = 'A';
        gradeDesc = 'Excellent';
        remark = 'Outstanding academic performance and exemplary conduct.';
      } else if (total >= 70) {
        grade = 'B';
        gradeDesc = 'Very Good';
        remark = 'Very good work. Demonstrates great potential.';
      } else if (total >= 60) {
        grade = 'C';
        gradeDesc = 'Good';
        remark = 'Good effort with room for notable improvement.';
      } else if (total >= 50) {
        grade = 'D';
        gradeDesc = 'Credit / Pass';
        remark = 'Average performance. More effort is encouraged.';
      } else if (total >= 40) {
        grade = 'E';
        gradeDesc = 'Weak Pass';
        remark = 'Low score. Needs substantial academic reinforcement.';
      } else {
        grade = 'F';
        gradeDesc = 'Fail';
        remark = 'Remedial coaching strictly required.';
      }
    }

    return { total, grade, gradeDesc, remark };
  };

  // Compute ranks for all students
  const rankedStudents = useMemo(() => {
    // Sort descending by total to assign ranks
    const sortedByTotal = [...students].sort((a, b) => b.total - a.total);
    const rankMap = new Map<string, number>();

    let currentRank = 1;
    for (let i = 0; i < sortedByTotal.length; i++) {
      if (i > 0 && sortedByTotal[i].total === sortedByTotal[i - 1].total) {
        rankMap.set(sortedByTotal[i].id, rankMap.get(sortedByTotal[i - 1].id) || currentRank);
      } else {
        currentRank = i + 1;
        rankMap.set(sortedByTotal[i].id, currentRank);
      }
    }

    // Filter by search query
    let filtered = students.filter(s => 
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.rollNumber && s.rollNumber.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    // Apply active sort
    if (sortBy === 'name') {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'total') {
      filtered.sort((a, b) => b.total - a.total);
    } else {
      // Sort by rank
      filtered.sort((a, b) => (rankMap.get(a.id) || 0) - (rankMap.get(b.id) || 0));
    }

    return filtered.map(s => ({
      ...s,
      rank: rankMap.get(s.id) || 1
    }));
  }, [students, searchQuery, sortBy]);

  // Add Single Student
  const handleAddStudent = () => {
    if (!newStudentName.trim()) {
      toast.error('Please enter a student name.');
      return;
    }

    const trimmedName = newStudentName.trim();
    // Check for duplicate in current roster
    if (students.some(s => s.name.toLowerCase() === trimmedName.toLowerCase())) {
      toast.error(`"${trimmedName}" is already on this roster.`);
      return;
    }

    const metrics = calculateMetrics(0, 0);
    const newStudent: StudentScore = {
      id: 'std_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      name: trimmedName,
      gender: newStudentGender,
      rollNumber: newStudentRoll.trim() || undefined,
      classScore: 0,
      examScore: 0,
      total: 0,
      grade: metrics.grade,
      gradeDesc: metrics.gradeDesc,
      remark: metrics.remark,
      attendance: '—',
      conduct: 'Good',
      attitude: 'Attentive'
    };

    const updated = [...students, newStudent];
    setStudents(updated);
    saveRosterToStorage(updated);
    setNewStudentName('');
    setNewStudentRoll('');
    toast.success(`Added ${trimmedName} to roster! 🇬🇭`);
  };

  // Quick Bulk Add Students (paste roster)
  const handleBulkAdd = () => {
    if (!bulkNamesText.trim()) {
      toast.error('Please paste or type names first.');
      return;
    }

    const lines = bulkNamesText
      .split(/[\n,;]+/)
      .map(n => n.replace(/^[\d.)\s-]+/, '').trim())
      .filter(n => n.length > 1);

    if (lines.length === 0) {
      toast.error('No valid names detected.');
      return;
    }

    const existingNames = new Set(students.map(s => s.name.toLowerCase()));
    const newAdded: StudentScore[] = [];

    lines.forEach((name, index) => {
      if (!existingNames.has(name.toLowerCase())) {
        existingNames.add(name.toLowerCase());
        const metrics = calculateMetrics(0, 0);
        newAdded.push({
          id: 'std_' + Date.now() + '_' + index + '_' + Math.random().toString(36).substring(2, 6),
          name,
          gender: 'male',
          classScore: 0,
          examScore: 0,
          total: 0,
          grade: metrics.grade,
          gradeDesc: metrics.gradeDesc,
          remark: metrics.remark,
          attendance: '—',
          conduct: 'Good',
          attitude: 'Attentive'
        });
      }
    });

    if (newAdded.length === 0) {
      toast.error('All names entered are already in this roster.');
      return;
    }

    const updated = [...students, ...newAdded];
    setStudents(updated);
    saveRosterToStorage(updated);
    setBulkNamesText('');
    setShowBulkAddModal(false);
    toast.success(`Successfully imported ${newAdded.length} students to ${selectedClass}!`);
  };

  // Update Score for specific student
  const handleUpdateScore = (id: string, field: 'classScore' | 'examScore', value: number) => {
    const updated = students.map(student => {
      if (student.id === id) {
        const classScore = field === 'classScore' ? Math.max(0, Math.min(classWeight, value)) : student.classScore;
        const examScore = field === 'examScore' ? Math.max(0, Math.min(examWeight, value)) : student.examScore;
        const metrics = calculateMetrics(classScore, examScore);
        return {
          ...student,
          classScore,
          examScore,
          total: metrics.total,
          grade: metrics.grade,
          gradeDesc: metrics.gradeDesc,
          remark: metrics.remark
        };
      }
      return student;
    });
    setStudents(updated);
    saveRosterToStorage(updated);
  };

  // Update Custom Remark or Metadata
  const handleUpdateStudentField = (id: string, field: keyof StudentScore, value: any) => {
    const updated = students.map(student => {
      if (student.id === id) {
        return { ...student, [field]: value };
      }
      return student;
    });
    setStudents(updated);
    saveRosterToStorage(updated);
  };

  // Delete Individual Student
  const handleRemoveStudent = (id: string, name: string) => {
    const updated = students.filter(s => s.id !== id);
    setStudents(updated);
    saveRosterToStorage(updated);
    toast.success(`Removed ${name} from roster.`);
  };

  // Clear Entire Roster
  const handleClearAll = () => {
    setStudents([]);
    saveRosterToStorage([]);
    setShowClearConfirm(false);
    toast.success('Roster cleared.');
  };

  // Manual Explicit Save Trigger
  const handleManualSave = () => {
    saveRosterToStorage(students);
    safeLocalStorage.setItem('teachsmart_school_name', schoolName);
    toast.success(`All marks & roster for ${selectedClass} (${selectedSubject}) saved successfully! 💾`);
  };

  // AI Comment Generator
  const handleGenerateComment = async () => {
    const nameToUse = commentStudentName.trim();
    if (!nameToUse) {
      toast.error('Please select or type a student name first.');
      return;
    }

    if (!canGenerate()) {
      toast.error('Please upgrade your subscription to generate custom AI report remarks.');
      navigate('/billing');
      return;
    }

    setLoading(true);
    setGeneratedComment('');

    const systemInstruction = `You are a distinguished Ghana Education Service (GES) Academic Counselor, veteran Basic School Headteacher, and NaCCA Assessment Specialist.
Your task is to write a constructive, encouraging, professional, and personalized terminal report card remark for a Ghanaian student.
Rules:
1. Focus on competency-based growth and positive reinforcement.
2. Structure: (a) Commendation on effort/attitude, (b) Subject-specific strength, (c) Actionable step for improvement next term.
3. Tone: Professional, warm, motivating, culturally grounded in the Ghanaian school setting.
4. Keep it concise (2-4 clear sentences) so it fits neatly into an official terminal report sheet.`;

    const prompt = `Write a GES terminal report comment for:
- Student Name: ${nameToUse}
- Gender: ${commentGender} (${commentGender === 'male' ? 'he/him' : 'she/her'})
- Class/Level: ${selectedClass}
- Subject: ${selectedSubject}
- Academic Performance Rank: ${commentPerformance}
- Focus Attributes: ${commentFocusAreas.join(', ')}`;

    try {
      const responseText = await generateWithProxy(prompt, systemInstruction);
      setGeneratedComment(responseText || 'Remark generated.');
      toast.success('Professional GES remark crafted! 🇬🇭');
    } catch (error: any) {
      console.error('AI Remark Error:', error);
      toast.error(error.message || 'Failed to craft remark.');
    } finally {
      setLoading(false);
    }
  };

  // Apply Generated Comment to specific student in roster
  const handleApplyCommentToRoster = (studentId: string, commentText: string) => {
    handleUpdateStudentField(studentId, 'remark', commentText);
    toast.success('Remark applied to student report card!');
  };

  // Toggle Focus Area in comment generator
  const toggleFocusArea = (area: string) => {
    if (commentFocusAreas.includes(area)) {
      setCommentFocusAreas(commentFocusAreas.filter(a => a !== area));
    } else {
      setCommentFocusAreas([...commentFocusAreas, area]);
    }
  };

  // Export Master Score Sheet PDF
  const handleExportPDF = () => {
    if (students.length === 0) {
      toast.error('No students in roster to export.');
      return;
    }

    try {
      const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
      const pageWidth = doc.internal.pageSize.getWidth();

      // Top decorative stripe (Ghana colors)
      doc.setFillColor(15, 23, 42); // Navy
      doc.rect(0, 0, pageWidth, 5, 'F');
      doc.setFillColor(0, 107, 63); // Green
      doc.rect(0, 5, pageWidth / 3, 2, 'F');
      doc.setFillColor(252, 209, 22); // Gold
      doc.rect(pageWidth / 3, 5, pageWidth / 3, 2, 'F');
      doc.setFillColor(206, 17, 38); // Red
      doc.rect((2 * pageWidth) / 3, 5, pageWidth / 3, 2, 'F');

      // School & Header Info
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(16);
      doc.setTextColor(15, 23, 42);
      doc.text(schoolName.toUpperCase(), pageWidth / 2, 18, { align: 'center' });

      doc.setFontSize(11);
      doc.setTextColor(71, 85, 105);
      doc.text(`TERMINAL CONTINUOUS ASSESSMENT & EXAMINATION BROAD SHEET`, pageWidth / 2, 25, { align: 'center' });

      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.text(`Class: ${selectedClass}  |  Subject: ${selectedSubject}  |  ${selectedTerm} (${academicYear})  |  Weights: Class (${classWeight}%) + Exam (${examWeight}%)`, pageWidth / 2, 31, { align: 'center' });

      // Table columns and rows
      const tableData = rankedStudents.map((s, idx) => [
        s.rank ? `${s.rank}${getOrdinal(s.rank)}` : `${idx + 1}`,
        s.name,
        s.gender === 'female' ? 'F' : 'M',
        s.classScore.toString(),
        s.examScore.toString(),
        s.total.toString(),
        s.grade,
        s.gradeDesc,
        s.remark
      ]);

      autoTable(doc, {
        head: [['Pos', 'Student Name', 'Sex', `Class (${classWeight})`, `Exam (${examWeight})`, 'Total (100)', 'Grade', 'Description', "Teacher's Remark"]],
        body: tableData,
        startY: 36,
        theme: 'grid',
        headStyles: {
          fillColor: [15, 23, 42],
          textColor: [255, 255, 255],
          fontStyle: 'bold',
          fontSize: 8.5,
          halign: 'center'
        },
        bodyStyles: {
          fontSize: 8,
          textColor: [30, 41, 59]
        },
        columnStyles: {
          0: { cellWidth: 14, halign: 'center' },
          1: { cellWidth: 48, fontStyle: 'bold' },
          2: { cellWidth: 12, halign: 'center' },
          3: { cellWidth: 20, halign: 'center' },
          4: { cellWidth: 20, halign: 'center' },
          5: { cellWidth: 22, halign: 'center', fontStyle: 'bold' },
          6: { cellWidth: 16, halign: 'center' },
          7: { cellWidth: 30 },
          8: { cellWidth: 'auto' }
        },
        alternateRowStyles: {
          fillColor: [248, 250, 252]
        }
      });

      // Signature block at bottom
      const finalY = (doc as any).lastAutoTable?.finalY || 160;
      const signatureY = Math.min(finalY + 18, 185);

      doc.setFontSize(8);
      doc.setTextColor(100, 116, 139);
      doc.text('Subject Teacher: _______________________      Date: ____________', 20, signatureY);
      doc.text('Headteacher: _______________________      Signature & Stamp: ____________', pageWidth - 140, signatureY);

      // Footer
      doc.setFontSize(7);
      doc.text(`Generated with TeachSmartGH • Catalyst Creative • Official NaCCA/GES Assessment Format`, pageWidth / 2, 202, { align: 'center' });

      doc.save(`${selectedClass}_${selectedSubject}_${selectedTerm}_Terminal_Report.pdf`);
      toast.success('PDF Broad Sheet generated! 📄');
    } catch (err: any) {
      console.error(err);
      toast.error('Failed to export PDF.');
    }
  };

  // Export CSV format
  const handleExportCSV = () => {
    if (students.length === 0) {
      toast.error('No students in roster to export.');
      return;
    }

    const headers = ['Position', 'Student Name', 'Gender', `Class Score (${classWeight})`, `Exam Score (${examWeight})`, 'Total (100)', 'Grade', 'Description', 'Remarks'];
    const rows = rankedStudents.map(s => [
      s.rank,
      `"${s.name.replace(/"/g, '""')}"`,
      s.gender || 'male',
      s.classScore,
      s.examScore,
      s.total,
      s.grade,
      `"${s.gradeDesc}"`,
      `"${(s.remark || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${selectedClass}_${selectedSubject}_${selectedTerm}_Scores.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('CSV score sheet downloaded! 📊');
  };

  // Helper for 1st, 2nd, 3rd
  const getOrdinal = (n: number) => {
    const s = ['th', 'st', 'nd', 'rd'];
    const v = n % 100;
    return s[(v - 20) % 10] || s[v] || s[0];
  };

  // Current student selected for individual report card
  const activeStudentCard = useMemo(() => {
    if (selectedStudentForCard) {
      return students.find(s => s.id === selectedStudentForCard) || students[0] || null;
    }
    return students[0] || null;
  }, [students, selectedStudentForCard]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 bg-ghana-green/10 text-ghana-green text-[10px] font-black rounded-lg uppercase tracking-wider border border-ghana-green/20">
              GES & NaCCA Compliant
            </span>
            <span className="px-3 py-1 bg-ghana-gold/20 text-emerald-950 text-[10px] font-black rounded-lg uppercase tracking-wider">
              Catalyst Smart Reports
            </span>
            {lastSavedTime && (
              <span className="text-[11px] text-slate-400 font-semibold flex items-center gap-1">
                <CheckCircle2 size={13} className="text-emerald-500" />
                Saved at {lastSavedTime}
              </span>
            )}
          </div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Terminal Reports & Continuous Assessment Hub
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Manage student rosters, enter Continuous Assessment & Exam marks, compute instant GES grades, and generate official terminal report cards.
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex flex-wrap gap-2 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl w-fit">
          <button
            onClick={() => setActiveTab('roster')}
            className={`px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all ${
              activeTab === 'roster'
                ? 'bg-slate-900 dark:bg-emerald-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
            }`}
          >
            <FileSpreadsheet size={15} />
            Score Sheet Roster ({students.length})
          </button>
          <button
            onClick={() => setActiveTab('single_card')}
            className={`px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all ${
              activeTab === 'single_card'
                ? 'bg-slate-900 dark:bg-emerald-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
            }`}
          >
            <Award size={15} />
            Individual Report Cards
          </button>
          <button
            onClick={() => setActiveTab('comment')}
            className={`px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all ${
              activeTab === 'comment'
                ? 'bg-slate-900 dark:bg-emerald-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
            }`}
          >
            <Sparkles size={15} className="text-ghana-gold" />
            AI Remarks Creator
          </button>
        </div>
      </div>

      {/* Class & Subject Selector Bar */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* School Name */}
        <div>
          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1.5">School Name</label>
          <input
            type="text"
            value={schoolName}
            onChange={(e) => {
              setSchoolName(e.target.value);
              safeLocalStorage.setItem('teachsmart_school_name', e.target.value);
            }}
            placeholder="e.g. Ghana Model Basic School"
            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900"
          />
        </div>

        {/* Class Selection */}
        <div>
          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1.5">Class / Level</label>
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none"
          >
            {GES_LEVELS.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Subject Selection */}
        <div>
          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1.5">Subject</label>
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none"
          >
            {DEFAULT_SUBJECTS.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        {/* Term & Year */}
        <div>
          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1.5">Term & Academic Year</label>
          <div className="flex gap-2">
            <select
              value={selectedTerm}
              onChange={(e) => setSelectedTerm(e.target.value)}
              className="w-1/2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-2 py-2 text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none"
            >
              <option value="Term 1">Term 1</option>
              <option value="Term 2">Term 2</option>
              <option value="Term 3">Term 3</option>
            </select>
            <input
              type="text"
              value={academicYear}
              onChange={(e) => setAcademicYear(e.target.value)}
              placeholder="2025/2026"
              className="w-1/2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-2 py-2 text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none"
            />
          </div>
        </div>

        {/* Grading Scale System */}
        <div>
          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1.5">Grading Scale</label>
          <select
            value={gradingSystem}
            onChange={(e) => {
              const newSys = e.target.value as 'ges_numeric' | 'letter';
              setGradingSystem(newSys);
              // Re-calculate for all existing students
              const updated = students.map(s => {
                const metrics = calculateMetrics(s.classScore, s.examScore, newSys);
                return { ...s, grade: metrics.grade, gradeDesc: metrics.gradeDesc };
              });
              setStudents(updated);
              saveRosterToStorage(updated);
            }}
            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none"
          >
            <option value="ges_numeric">GES Numeric (Grade 1 - 9)</option>
            <option value="letter">Letter Grades (A - F)</option>
          </select>
        </div>
      </div>

      {/* Main Tab Views */}
      <AnimatePresence mode="wait">
        {activeTab === 'roster' && (
          <motion.div
            key="roster_tab"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* Assessment Weights & Action Bar */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              {/* Weights Configuration */}
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 p-2.5 rounded-2xl border border-slate-200 dark:border-slate-700">
                  <Percent size={16} className="text-ghana-gold" />
                  <span className="text-[11px] font-black text-slate-500 uppercase tracking-wider">Class Assessment:</span>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={classWeight}
                    onChange={(e) => {
                      const val = Math.min(100, Math.max(0, Number(e.target.value)));
                      setClassWeight(val);
                      setExamWeight(100 - val);
                    }}
                    className="w-14 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg p-1 text-center font-black text-xs text-slate-900 dark:text-white"
                  />
                  <span className="text-xs font-bold text-slate-600 dark:text-slate-400">%</span>
                </div>

                <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 p-2.5 rounded-2xl border border-slate-200 dark:border-slate-700">
                  <Percent size={16} className="text-emerald-500" />
                  <span className="text-[11px] font-black text-slate-500 uppercase tracking-wider">End Exam:</span>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={examWeight}
                    onChange={(e) => {
                      const val = Math.min(100, Math.max(0, Number(e.target.value)));
                      setExamWeight(val);
                      setClassWeight(100 - val);
                    }}
                    className="w-14 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg p-1 text-center font-black text-xs text-slate-900 dark:text-white"
                  />
                  <span className="text-xs font-bold text-slate-600 dark:text-slate-400">%</span>
                </div>
              </div>

              {/* Roster Actions */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setShowBulkAddModal(true)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all"
                >
                  <Upload size={14} />
                  Bulk Import Names
                </button>
                <button
                  onClick={handleManualSave}
                  className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all shadow-sm"
                >
                  <Save size={14} />
                  Save Roster
                </button>
                <button
                  onClick={handleExportPDF}
                  disabled={students.length === 0}
                  className="px-4 py-2.5 bg-slate-900 hover:bg-black dark:bg-slate-100 dark:text-slate-900 text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all disabled:opacity-40"
                >
                  <Printer size={14} />
                  Print Broad Sheet (PDF)
                </button>
                <button
                  onClick={handleExportCSV}
                  disabled={students.length === 0}
                  className="px-3.5 py-2.5 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all disabled:opacity-40"
                  title="Export to CSV"
                >
                  <Download size={14} />
                  CSV
                </button>
              </div>
            </div>

            {/* Quick Add Single Student Input Bar */}
            <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-700/80 flex flex-col md:flex-row items-center gap-3">
              <div className="flex-1 flex items-center gap-2 w-full">
                <UserPlus size={18} className="text-slate-400 shrink-0 ml-2" />
                <input
                  type="text"
                  value={newStudentName}
                  onChange={(e) => setNewStudentName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleAddStudent();
                  }}
                  placeholder="Enter Student Full Name (e.g. Samuel Kofi Mensah)..."
                  className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>

              <div className="flex items-center gap-2 w-full md:w-auto">
                <select
                  value={newStudentGender}
                  onChange={(e) => setNewStudentGender(e.target.value as 'male' | 'female')}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none"
                >
                  <option value="male">Male (M)</option>
                  <option value="female">Female (F)</option>
                </select>

                <input
                  type="text"
                  value={newStudentRoll}
                  onChange={(e) => setNewStudentRoll(e.target.value)}
                  placeholder="ID / Roll (Opt)"
                  className="w-28 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none"
                />

                <button
                  onClick={handleAddStudent}
                  className="bg-slate-900 hover:bg-black text-white px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 whitespace-nowrap transition-all shrink-0"
                >
                  <Plus size={15} />
                  Add Student
                </button>
              </div>
            </div>

            {/* Score Sheet Table & Controls */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
              {/* Search and Table Tools */}
              <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <div className="relative w-full sm:w-64">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search student in roster..."
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-9 pr-3 py-1.5 text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none"
                    />
                  </div>
                  <span className="text-xs font-black text-slate-400 shrink-0">
                    {rankedStudents.length} of {students.length} Students
                  </span>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Sort by:</span>
                  <button
                    onClick={() => setSortBy('rank')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                      sortBy === 'rank' ? 'bg-slate-900 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600'
                    }`}
                  >
                    Rank (Position)
                  </button>
                  <button
                    onClick={() => setSortBy('name')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                      sortBy === 'name' ? 'bg-slate-900 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600'
                    }`}
                  >
                    Name
                  </button>
                  <button
                    onClick={() => setSortBy('total')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                      sortBy === 'total' ? 'bg-slate-900 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600'
                    }`}
                  >
                    Total Mark
                  </button>
                </div>
              </div>

              {/* Score Sheet Content */}
              {students.length === 0 ? (
                <div className="p-12 text-center flex flex-col items-center justify-center">
                  <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 text-slate-400 rounded-3xl flex items-center justify-center mb-4">
                    <Users size={28} />
                  </div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white">Roster is currently empty</h3>
                  <p className="text-slate-500 text-xs max-w-sm mt-1">
                    Add your students using the input box above, or click <strong className="text-slate-700 dark:text-slate-300">Bulk Import Names</strong> to paste your class list.
                  </p>
                  <button
                    onClick={() => setShowBulkAddModal(true)}
                    className="mt-5 px-4 py-2.5 bg-slate-900 hover:bg-black text-white text-xs font-black uppercase tracking-wider rounded-xl flex items-center gap-2 transition-all shadow-sm"
                  >
                    <Upload size={14} />
                    Import Class List
                  </button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 dark:bg-slate-800/80 text-slate-400 text-[10px] font-black uppercase tracking-wider border-b border-slate-100 dark:border-slate-800">
                        <th className="p-4 w-14 text-center">Pos</th>
                        <th className="p-4 min-w-[200px]">Student Name</th>
                        <th className="p-4 text-center w-16">Sex</th>
                        <th className="p-4 text-center w-28">Class Score ({classWeight}%)</th>
                        <th className="p-4 text-center w-28">Exam Score ({examWeight}%)</th>
                        <th className="p-4 text-center w-24">Total (100)</th>
                        <th className="p-4 text-center w-20">Grade</th>
                        <th className="p-4 min-w-[220px]">Teacher's Remark</th>
                        <th className="p-4 text-center w-28">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200">
                      {rankedStudents.map((student) => (
                        <tr 
                          key={student.id} 
                          className="hover:bg-slate-50/70 dark:hover:bg-slate-800/50 transition-colors group"
                        >
                          {/* Rank / Position */}
                          <td className="p-4 text-center font-black">
                            <span className={`inline-flex items-center justify-center w-7 h-7 rounded-lg text-xs font-black ${
                              student.rank === 1 ? 'bg-amber-100 text-amber-900 border border-amber-300' :
                              student.rank === 2 ? 'bg-slate-200 text-slate-800' :
                              student.rank === 3 ? 'bg-amber-50 text-amber-800' :
                              'text-slate-400 bg-slate-100 dark:bg-slate-800'
                            }`}>
                              {student.rank}
                            </span>
                          </td>

                          {/* Student Name */}
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <input
                                type="text"
                                value={student.name}
                                onChange={(e) => handleUpdateStudentField(student.id, 'name', e.target.value)}
                                className="bg-transparent border-b border-transparent hover:border-slate-300 focus:border-slate-900 dark:focus:border-emerald-500 font-black text-slate-900 dark:text-white px-1 py-0.5 rounded text-sm w-full focus:outline-none"
                              />
                            </div>
                            {student.rollNumber && (
                              <span className="text-[10px] text-slate-400 px-1 font-semibold">ID: {student.rollNumber}</span>
                            )}
                          </td>

                          {/* Gender */}
                          <td className="p-4 text-center">
                            <button
                              onClick={() => handleUpdateStudentField(student.id, 'gender', student.gender === 'female' ? 'male' : 'female')}
                              className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                                student.gender === 'female' ? 'bg-rose-50 text-rose-700' : 'bg-blue-50 text-blue-700'
                              }`}
                              title="Click to toggle Gender"
                            >
                              {student.gender === 'female' ? 'F' : 'M'}
                            </button>
                          </td>

                          {/* Class Score */}
                          <td className="p-4 text-center">
                            <input
                              type="number"
                              min={0}
                              max={classWeight}
                              step="any"
                              value={student.classScore === 0 ? '' : student.classScore}
                              placeholder="0"
                              onChange={(e) => handleUpdateScore(student.id, 'classScore', Number(e.target.value))}
                              className="w-18 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2 text-center font-black text-slate-900 dark:text-white focus:ring-2 focus:ring-slate-900 focus:outline-none"
                            />
                          </td>

                          {/* Exam Score */}
                          <td className="p-4 text-center">
                            <input
                              type="number"
                              min={0}
                              max={examWeight}
                              step="any"
                              value={student.examScore === 0 ? '' : student.examScore}
                              placeholder="0"
                              onChange={(e) => handleUpdateScore(student.id, 'examScore', Number(e.target.value))}
                              className="w-18 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2 text-center font-black text-slate-900 dark:text-white focus:ring-2 focus:ring-slate-900 focus:outline-none"
                            />
                          </td>

                          {/* Total Score */}
                          <td className="p-4 text-center">
                            <span className="text-sm font-black text-slate-900 dark:text-white px-2.5 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
                              {student.total}
                            </span>
                          </td>

                          {/* Grade & Description */}
                          <td className="p-4 text-center">
                            <div className="flex flex-col items-center">
                              <span className={`px-2 py-0.5 rounded text-xs font-black ${
                                ['1', '2', 'A', 'B'].includes(student.grade) ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' :
                                ['3', '4', 'C'].includes(student.grade) ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300' :
                                ['5', '6', 'D'].includes(student.grade) ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300' :
                                ['7', '8', 'E'].includes(student.grade) ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' :
                                'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                              }`}>
                                Grade {student.grade}
                              </span>
                              <span className="text-[9px] text-slate-400 font-semibold mt-0.5 max-w-[80px] truncate">
                                {student.gradeDesc}
                              </span>
                            </div>
                          </td>

                          {/* Teacher's Remarks */}
                          <td className="p-4">
                            <input
                              type="text"
                              value={student.remark || ''}
                              onChange={(e) => handleUpdateStudentField(student.id, 'remark', e.target.value)}
                              placeholder="Enter custom remarks..."
                              className="w-full bg-slate-50/50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 dark:text-slate-300 font-medium focus:bg-white dark:focus:bg-slate-900 focus:outline-none"
                            />
                          </td>

                          {/* Actions */}
                          <td className="p-4 text-center">
                            <div className="flex items-center justify-center gap-1.5">
                              <button
                                onClick={() => {
                                  setSelectedStudentForCard(student.id);
                                  setActiveTab('single_card');
                                }}
                                className="p-1.5 text-slate-500 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
                                title="View Report Card"
                              >
                                <Award size={15} />
                              </button>
                              <button
                                onClick={() => {
                                  setCommentStudentName(student.name);
                                  setCommentGender(student.gender || 'male');
                                  setCommentPerformance(
                                    student.total >= 80 ? 'Excellent' :
                                    student.total >= 70 ? 'Very Good' :
                                    student.total >= 60 ? 'Good' :
                                    student.total >= 50 ? 'Average' : 'Needs Improvement'
                                  );
                                  setActiveTab('comment');
                                }}
                                className="p-1.5 text-amber-500 hover:text-amber-700 rounded-lg hover:bg-amber-50 dark:hover:bg-amber-950/20 transition-all"
                                title="Generate AI Remark"
                              >
                                <Sparkles size={15} />
                              </button>
                              <button
                                onClick={() => handleRemoveStudent(student.id, student.name)}
                                className="p-1.5 text-rose-500 hover:text-rose-700 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-all"
                                title="Delete Student"
                              >
                                <Trash2 size={15} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Table Footer */}
              <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-black text-slate-500">
                    Total Enrolled: <strong className="text-slate-900 dark:text-white">{students.length}</strong> students
                  </span>
                  {students.length > 0 && (
                    <button
                      onClick={() => setShowClearConfirm(true)}
                      className="text-xs font-bold text-rose-600 hover:text-rose-800 flex items-center gap-1 transition-all"
                    >
                      <Trash2 size={13} />
                      Clear Roster
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleManualSave}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black uppercase tracking-wider rounded-xl flex items-center gap-1.5 transition-all shadow-sm"
                  >
                    <Save size={13} />
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Tab: Single Report Card Preview */}
        {activeTab === 'single_card' && (
          <motion.div
            key="card_preview_tab"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8"
          >
            {/* Left list of students */}
            <div className="lg:col-span-4 bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 h-fit">
              <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center justify-between">
                <span>Select Student</span>
                <span className="text-xs text-slate-400 lowercase">{students.length} records</span>
              </h3>

              <div className="space-y-1.5 max-h-[480px] overflow-y-auto pr-1">
                {students.length === 0 ? (
                  <p className="text-xs text-slate-400 italic py-4">No students enrolled yet. Go to Score Sheet to add students.</p>
                ) : (
                  students.map(s => (
                    <button
                      key={s.id}
                      onClick={() => setSelectedStudentForCard(s.id)}
                      className={`w-full text-left p-3 rounded-2xl transition-all flex items-center justify-between ${
                        (activeStudentCard?.id === s.id)
                          ? 'bg-slate-900 text-white shadow-md'
                          : 'bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
                      }`}
                    >
                      <div>
                        <div className="font-bold text-xs">{s.name}</div>
                        <div className={`text-[10px] ${activeStudentCard?.id === s.id ? 'text-slate-300' : 'text-slate-400'}`}>
                          Total: {s.total} / 100 • Grade: {s.grade}
                        </div>
                      </div>
                      <Award size={14} className={activeStudentCard?.id === s.id ? 'text-ghana-gold' : 'text-slate-400'} />
                    </button>
                  ))
                )}
              </div>
            </div>

            {/* Right: Official Ghanaian Report Card Layout */}
            <div className="lg:col-span-8 space-y-4">
              {activeStudentCard ? (
                <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-8 space-y-6">
                  {/* Report Card Header */}
                  <div className="border-b-2 border-slate-900 dark:border-slate-700 pb-5 text-center space-y-1">
                    <div className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">
                      Republic of Ghana • Ministry of Education / GES
                    </div>
                    <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                      {schoolName}
                    </h2>
                    <p className="text-xs text-slate-500 font-bold uppercase">
                      Official Terminal Academic Report Card • {selectedTerm} ({academicYear})
                    </p>
                  </div>

                  {/* Student Details Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 text-xs">
                    <div>
                      <span className="text-[10px] font-black text-slate-400 uppercase">Student Name:</span>
                      <p className="font-black text-slate-900 dark:text-white text-sm">{activeStudentCard.name}</p>
                    </div>
                    <div>
                      <span className="text-[10px] font-black text-slate-400 uppercase">Class:</span>
                      <p className="font-bold text-slate-800 dark:text-slate-200">{selectedClass}</p>
                    </div>
                    <div>
                      <span className="text-[10px] font-black text-slate-400 uppercase">Gender:</span>
                      <p className="font-bold text-slate-800 dark:text-slate-200 uppercase">{activeStudentCard.gender || 'Male'}</p>
                    </div>
                    <div>
                      <span className="text-[10px] font-black text-slate-400 uppercase">Enrolment:</span>
                      <p className="font-bold text-slate-800 dark:text-slate-200">{students.length} Pupils</p>
                    </div>
                  </div>

                  {/* Assessment Summary Table */}
                  <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-slate-900 text-white text-[10px] uppercase font-black tracking-wider">
                          <th className="p-3">Subject</th>
                          <th className="p-3 text-center">Class Score ({classWeight}%)</th>
                          <th className="p-3 text-center">Exam Score ({examWeight}%)</th>
                          <th className="p-3 text-center">Total (100)</th>
                          <th className="p-3 text-center">Grade</th>
                          <th className="p-3 text-center">Interpretation</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-bold">
                        <tr>
                          <td className="p-3.5 font-black text-slate-900 dark:text-white">{selectedSubject}</td>
                          <td className="p-3.5 text-center">{activeStudentCard.classScore}</td>
                          <td className="p-3.5 text-center">{activeStudentCard.examScore}</td>
                          <td className="p-3.5 text-center font-black text-slate-900 dark:text-white">{activeStudentCard.total}</td>
                          <td className="p-3.5 text-center">
                            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded text-xs font-black">
                              {activeStudentCard.grade}
                            </span>
                          </td>
                          <td className="p-3.5 text-center text-slate-600 dark:text-slate-400">{activeStudentCard.gradeDesc}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* Character & Conduct Traits */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800">
                      <span className="text-[10px] font-black text-slate-400 uppercase">Attendance</span>
                      <input
                        type="text"
                        value={activeStudentCard.attendance || ''}
                        onChange={(e) => handleUpdateStudentField(activeStudentCard.id, 'attendance', e.target.value)}
                        placeholder="e.g. 58 / 60 days"
                        className="w-full bg-transparent font-bold text-xs text-slate-800 dark:text-slate-200 mt-1 focus:outline-none"
                      />
                    </div>
                    <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800">
                      <span className="text-[10px] font-black text-slate-400 uppercase">Conduct</span>
                      <input
                        type="text"
                        value={activeStudentCard.conduct || ''}
                        onChange={(e) => handleUpdateStudentField(activeStudentCard.id, 'conduct', e.target.value)}
                        placeholder="e.g. Respectful & Honest"
                        className="w-full bg-transparent font-bold text-xs text-slate-800 dark:text-slate-200 mt-1 focus:outline-none"
                      />
                    </div>
                    <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800">
                      <span className="text-[10px] font-black text-slate-400 uppercase">Attitude to Work</span>
                      <input
                        type="text"
                        value={activeStudentCard.attitude || ''}
                        onChange={(e) => handleUpdateStudentField(activeStudentCard.id, 'attitude', e.target.value)}
                        placeholder="e.g. Diligent & Cooperative"
                        className="w-full bg-transparent font-bold text-xs text-slate-800 dark:text-slate-200 mt-1 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Teacher's Remarks Section */}
                  <div className="p-4 bg-amber-50/50 dark:bg-amber-950/20 rounded-2xl border border-amber-200/60 dark:border-amber-900/40 space-y-2">
                    <span className="text-[10px] font-black text-amber-800 dark:text-amber-400 uppercase tracking-wider">
                      Class Teacher's Terminal Remarks:
                    </span>
                    <textarea
                      rows={3}
                      value={activeStudentCard.remark || ''}
                      onChange={(e) => handleUpdateStudentField(activeStudentCard.id, 'remark', e.target.value)}
                      placeholder="Write comprehensive remarks for this student..."
                      className="w-full bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-900/60 rounded-xl p-3 text-xs font-medium text-slate-800 dark:text-slate-200 focus:outline-none"
                    />
                  </div>

                  {/* Signatures */}
                  <div className="pt-6 border-t border-slate-200 dark:border-slate-800 grid grid-cols-2 gap-8 text-xs">
                    <div>
                      <div className="border-b border-slate-400 w-48 mb-1"></div>
                      <span className="text-slate-500 font-bold">Class Teacher's Signature</span>
                    </div>
                    <div className="text-right">
                      <div className="border-b border-slate-400 w-48 ml-auto mb-1"></div>
                      <span className="text-slate-500 font-bold">Headteacher's Signature & Stamp</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-end gap-3 pt-4">
                    <button
                      onClick={() => window.print()}
                      className="px-5 py-2.5 bg-slate-900 hover:bg-black text-white text-xs font-black uppercase tracking-wider rounded-xl flex items-center gap-2 transition-all shadow-sm"
                    >
                      <Printer size={14} />
                      Print Student Report
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-12 text-center text-slate-400">
                  Select a student from the left to view their report card.
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Tab: AI Remarks Creator */}
        {activeTab === 'comment' && (
          <motion.div
            key="comment_tab"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8"
          >
            {/* Setup card */}
            <div className="lg:col-span-5 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 h-fit">
              <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                <User size={18} className="text-ghana-gold" />
                Student Profile Setup
              </h2>

              <div className="space-y-4">
                {/* Select from existing roster or type custom */}
                {students.length > 0 && (
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1.5">
                      Choose from {selectedClass} Roster
                    </label>
                    <select
                      onChange={(e) => {
                        const found = students.find(s => s.name === e.target.value);
                        if (found) {
                          setCommentStudentName(found.name);
                          setCommentGender(found.gender || 'male');
                          setCommentPerformance(
                            found.total >= 80 ? 'Excellent' :
                            found.total >= 70 ? 'Very Good' :
                            found.total >= 60 ? 'Good' :
                            found.total >= 50 ? 'Average' : 'Needs Improvement'
                          );
                        }
                      }}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none"
                    >
                      <option value="">-- Choose a student from saved roster --</option>
                      {students.map(s => (
                        <option key={s.id} value={s.name}>{s.name} ({s.total}/100 - Grade {s.grade})</option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Student Name */}
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1.5">
                    Student Full Name
                  </label>
                  <input
                    type="text"
                    value={commentStudentName}
                    onChange={(e) => setCommentStudentName(e.target.value)}
                    placeholder="e.g. Ama Serwaa Bonsu"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>

                {/* Gender */}
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1.5">Gender</label>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setCommentGender('male')}
                      className={`flex-1 py-2.5 rounded-xl font-bold text-xs transition-all ${
                        commentGender === 'male' 
                          ? 'bg-slate-900 dark:bg-emerald-600 text-white shadow' 
                          : 'bg-slate-50 dark:bg-slate-800 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      Male (He/Him)
                    </button>
                    <button
                      onClick={() => setCommentGender('female')}
                      className={`flex-1 py-2.5 rounded-xl font-bold text-xs transition-all ${
                        commentGender === 'female' 
                          ? 'bg-slate-900 dark:bg-emerald-600 text-white shadow' 
                          : 'bg-slate-50 dark:bg-slate-800 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      Female (She/Her)
                    </button>
                  </div>
                </div>

                {/* Performance Rank */}
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1.5">Academic Performance Standing</label>
                  <select
                    value={commentPerformance}
                    onChange={(e) => setCommentPerformance(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none"
                  >
                    <option value="Excellent">Excellent (80-100% • Outstanding Distinction)</option>
                    <option value="Very Good">Very Good (70-79% • High Merit)</option>
                    <option value="Good">Good (60-69% • Solid Competency)</option>
                    <option value="Average">Average (50-59% • Regular Pass)</option>
                    <option value="Needs Improvement">Needs Improvement (Below 50% • Remedial Roster)</option>
                  </select>
                </div>

                {/* Focus Areas */}
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1.5">Key Attributes to Highlight</label>
                  <div className="grid grid-cols-2 gap-2">
                    {['Attendance', 'Behaviour', 'Leadership', 'Creativity', 'Critical Thinking', 'Homework Diligence'].map((area) => (
                      <button
                        key={area}
                        onClick={() => toggleFocusArea(area)}
                        className={`py-2 px-3 text-[11px] font-bold rounded-xl border transition-all text-left ${
                          commentFocusAreas.includes(area)
                            ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-950 dark:text-emerald-300'
                            : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-50'
                        }`}
                      >
                        {area}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <button
                onClick={handleGenerateComment}
                disabled={loading}
                className="w-full bg-slate-900 hover:bg-black text-white font-black py-3.5 rounded-2xl flex items-center justify-center gap-2 uppercase tracking-widest text-xs transition-all active:scale-95 disabled:opacity-50 shadow-md"
              >
                {loading ? (
                  <>
                    <RefreshCw className="animate-spin" size={16} />
                    Crafting Remark...
                  </>
                ) : (
                  <>
                    <Sparkles size={16} className="text-ghana-gold" />
                    Generate GES Remark
                  </>
                )}
              </button>
            </div>

            {/* Generated View Pane */}
            <div className="lg:col-span-7 flex flex-col space-y-4">
              {generatedComment ? (
                <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-8 flex-1 flex flex-col justify-between min-h-[420px]">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <span className="px-3 py-1 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 text-[10px] font-black uppercase rounded-lg border border-emerald-200 dark:border-emerald-800">
                        Official GES Academic Remark
                      </span>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-slate-400 font-bold">
                          For: <strong className="text-slate-800 dark:text-slate-200">{commentStudentName}</strong>
                        </span>
                        <button
                          onClick={() => setIsEditingComment(!isEditingComment)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                            isEditingComment
                              ? 'bg-amber-500 text-white'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                          }`}
                        >
                          {isEditingComment ? <Eye size={13} /> : <Edit3 size={13} />}
                          {isEditingComment ? 'Preview' : 'Edit Remark'}
                        </button>
                      </div>
                    </div>

                    {isEditingComment ? (
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">
                          Edit Student Remark Directly:
                        </label>
                        <textarea
                          rows={6}
                          value={generatedComment}
                          onChange={(e) => setGeneratedComment(e.target.value)}
                          className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 text-xs font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:border-emerald-500 leading-relaxed shadow-inner"
                          placeholder="Edit terminal remarks..."
                        />
                      </div>
                    ) : (
                      <div className="prose prose-slate max-w-none text-slate-800 dark:text-slate-200 leading-relaxed text-base font-medium italic p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-800">
                        <SafeMarkdown>{generatedComment}</SafeMarkdown>
                      </div>
                    )}
                  </div>

                  <div className="border-t border-slate-100 dark:border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="text-[10px] text-slate-400 font-bold flex items-center gap-2">
                      <ShieldCheck size={14} className="text-emerald-500" />
                      Aligned with NaCCA Assessment Framework
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {/* If matching student exists in roster, allow direct save */}
                      {students.some(s => s.name.toLowerCase() === commentStudentName.toLowerCase()) && (
                        <button
                          onClick={() => {
                            const matched = students.find(s => s.name.toLowerCase() === commentStudentName.toLowerCase());
                            if (matched) {
                              handleApplyCommentToRoster(matched.id, generatedComment);
                            }
                          }}
                          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-sm"
                        >
                          <Save size={13} />
                          Save to Student's Card
                        </button>
                      )}

                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(generatedComment);
                          toast.success('Comment copied to clipboard! 📋');
                        }}
                        className="px-4 py-2 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all"
                      >
                        Copy Remark
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-12 text-center flex flex-col items-center justify-center min-h-[420px] flex-1">
                  <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 text-slate-400 rounded-3xl flex items-center justify-center mb-4">
                    <Award size={28} />
                  </div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white">AI Remarks will be generated here</h3>
                  <p className="text-slate-500 text-xs max-w-xs mt-1">
                    Select a student from your roster or type their details on the left, then click Generate to craft tailored terminal remarks.
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal: Bulk Import Names */}
      {showBulkAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 max-w-lg w-full space-y-4"
          >
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Upload size={18} className="text-ghana-gold" />
                Quick Import Student Names
              </h3>
              <button
                onClick={() => setShowBulkAddModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-500">
              Paste names from WhatsApp, Excel, Word, or an attendance sheet (one name per line or comma-separated):
            </p>

            <textarea
              rows={8}
              value={bulkNamesText}
              onChange={(e) => setBulkNamesText(e.target.value)}
              placeholder="1. Kwame Mensah&#10;2. Ama Serwaa&#10;3. Kofi Owusu&#10;4. Abena Korkor..."
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-3.5 text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900"
            />

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowBulkAddModal(false)}
                className="px-4 py-2.5 text-xs font-bold text-slate-500 hover:text-slate-700 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleBulkAdd}
                className="px-5 py-2.5 bg-slate-900 hover:bg-black text-white text-xs font-black uppercase tracking-wider rounded-xl flex items-center gap-2 transition-all shadow-md"
              >
                <Plus size={15} />
                Import Students
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Modal: Clear Roster Confirmation */}
      {showClearConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 max-w-sm w-full space-y-4 text-center"
          >
            <div className="w-12 h-12 bg-rose-50 dark:bg-rose-950/50 text-rose-500 rounded-2xl flex items-center justify-center mx-auto">
              <AlertTriangle size={24} />
            </div>

            <h3 className="text-base font-black text-slate-900 dark:text-white">
              Clear All Student Records?
            </h3>
            <p className="text-xs text-slate-500">
              This will remove all {students.length} students and their entered marks for <strong className="text-slate-700 dark:text-slate-300">{selectedClass} ({selectedSubject})</strong>.
            </p>

            <div className="flex justify-center gap-2 pt-3">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-700 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleClearAll}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-black uppercase tracking-wider rounded-xl shadow-sm"
              >
                Yes, Clear All
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
