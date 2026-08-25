import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  FileText, 
  BookOpen, 
  Calendar, 
  PenTool, 
  Download, 
  Printer, 
  Copy, 
  Check, 
  Trash2, 
  WifiOff, 
  Wifi, 
  RefreshCw, 
  Search, 
  X, 
  HardDrive, 
  ArrowLeft,
  Sparkles,
  Layers,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router';
import { 
  getOfflineDocuments, 
  removeCachedDocument 
} from '../../lib/offlineDocumentCache';
import { syncPendingToFirebase, OfflineDocument } from '../../lib/indexedDB';
import { jsPDF } from 'jspdf';
import { exportLessonPlanToPDF } from '../../lib/lessonPlanPdfExport';
import { toast } from 'react-hot-toast';

export default function OfflineVaultPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [documents, setDocuments] = useState<OfflineDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [activeDoc, setActiveDoc] = useState<OfflineDocument | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [syncing, setSyncing] = useState(false);
  const [isOnline, setIsOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true);

  const loadDocuments = async () => {
    setLoading(true);
    try {
      const docs = await getOfflineDocuments(user?.uid);
      setDocuments(docs);
    } catch (err) {
      console.warn('Failed to load offline documents:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDocuments();
  }, [user]);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleDelete = async (doc: OfflineDocument) => {
    if (!window.confirm(`Are you sure you want to remove "${doc.title || 'this document'}" from your offline cache?`)) return;
    try {
      await removeCachedDocument(doc.id, doc.type);
      setDocuments(prev => prev.filter(d => d.id !== doc.id));
      if (activeDoc?.id === doc.id) {
        setActiveDoc(null);
      }
      toast.success('Document removed from offline storage.');
    } catch (err) {
      toast.error('Failed to remove document.');
    }
  };

  const handleSyncAll = async () => {
    if (!user) return;
    if (!navigator.onLine) {
      toast.error('No internet connection. Reconnect to sync pending documents.');
      return;
    }
    setSyncing(true);
    try {
      const count = await syncPendingToFirebase(user.uid);
      if (count > 0) {
        toast.success(`Successfully synchronized ${count} document(s) to the cloud! 🇬🇭`);
      } else {
        toast.success('All documents are synchronized!');
      }
      await loadDocuments();
    } catch (err) {
      toast.error('Cloud sync failed. Check connection.');
    } finally {
      setSyncing(false);
    }
  };

  const getDocReadableContent = (doc: OfflineDocument): string => {
    if (!doc) return '';
    if (doc.type === 'lessonPlan') {
      return [
        `TEACHSMART GHANA - LESSON PLAN`,
        `Title: ${doc.title || 'Lesson Plan'}`,
        `Subject: ${doc.subject || 'General'} | Class: ${doc.class || doc.level || 'Basic School'}`,
        `Strand: ${doc.strand || 'N/A'} | Sub-Strand: ${doc.subStrand || 'N/A'}`,
        `Content Standard: ${doc.contentStandard || 'N/A'}`,
        `Indicator: ${doc.indicator || 'N/A'}`,
        `\n===============================================\n`,
        `PHASE 1: STARTER / INTRODUCTION\n-----------------------------------------------\n${doc.phase1 || ''}`,
        `\nPHASE 2: MAIN TEACHING & LEARNING ACTIVITIES\n-----------------------------------------------\n${doc.phase2 || ''}`,
        `\nPHASE 3: PLENARY / CONCLUSION & REFLECTION\n-----------------------------------------------\n${doc.phase3 || ''}`
      ].join('\n\n');
    }

    if (doc.type === 'exam') {
      return [
        `TEACHSMART GHANA - EXAMINATION PAPER`,
        `Title: ${doc.title || 'Terminal Examination'}`,
        `Subject: ${doc.subject || 'General'} | Class: ${doc.level || doc.classLevel || 'Basic School'}`,
        `\n===============================================\n`,
        `SECTION A: QUESTIONS\n-----------------------------------------------\n${doc.questions || ''}`,
        `\nSECTION B: MARKING SCHEME & ANSWERS\n-----------------------------------------------\n${doc.markingScheme || ''}`
      ].join('\n\n');
    }

    if (doc.type === 'scheme') {
      const contentStr = typeof doc.content === 'string' ? doc.content : JSON.stringify(doc.content, null, 2);
      return [
        `TEACHSMART GHANA - SCHEME OF LEARNING`,
        `Title: ${doc.title || 'Scheme of Learning'}`,
        `Subject: ${doc.subject || 'General'} | Level: ${doc.level || doc.class || 'Basic School'}`,
        `\n===============================================\n`,
        contentStr
      ].join('\n\n');
    }

    if (doc.type === 'note') {
      return [
        `TEACHSMART GHANA - LESSON NOTES`,
        `Title: ${doc.title || 'Lesson Notes'}`,
        `Subject: ${doc.subject || 'General'} | Class: ${doc.class || doc.level || 'Basic School'}`,
        `\n===============================================\n`,
        `CONTENT:\n${doc.content || ''}`,
        doc.summary ? `\nKEY SUMMARY POINTS:\n${Array.isArray(doc.summary) ? doc.summary.join('\n• ') : doc.summary}` : '',
        doc.questions ? `\nREVIEW QUESTIONS:\n${Array.isArray(doc.questions) ? doc.questions.join('\n• ') : doc.questions}` : ''
      ].filter(Boolean).join('\n\n');
    }

    return typeof doc.content === 'string' ? doc.content : JSON.stringify(doc, null, 2);
  };

  const handleCopyText = (doc: OfflineDocument) => {
    const text = getDocReadableContent(doc);
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(doc.id);
      toast.success('Document text copied to clipboard! 📋');
      setTimeout(() => setCopiedId(null), 2500);
    }).catch(() => {
      toast.error('Failed to copy to clipboard.');
    });
  };

  const handleDownloadPDF = (doc: OfflineDocument) => {
    try {
      if (doc.type === 'lessonPlan' && typeof doc.content === 'object' && doc.content !== null) {
        const c = doc.content;
        const pdf = exportLessonPlanToPDF({
          title: doc.title || c.title,
          weekNumber: (c as any).weekNumber || (c as any).week || (doc as any).weekNumber || (doc as any).week,
          week: (c as any).week || (c as any).weekNumber || (doc as any).week,
          subject: doc.subject || c.subject || 'GENERAL',
          ghanaianLanguage: c.ghanaianLanguage,
          level: doc.level || c.level || 'BASIC',
          class: doc.class || c.class || 'Class',
          classSize: c.classSize || '40',
          weekEnding: c.weekEnding || '',
          day: c.day || 'Monday',
          date: c.date || c.weekEnding || '',
          period: c.period || '1 & 2',
          lesson: c.lesson || '1',
          duration: c.duration || '60 mins',
          strand: c.strand || '',
          subStrand: c.subStrand || '',
          indicatorCode: c.indicatorCode || c.indicator || '',
          contentStandardCode: c.contentStandardCode || c.contentStandard || '',
          indicator: c.indicator || '',
          contentStandard: c.contentStandard || '',
          performanceIndicator: c.performanceIndicator || c.mainObjective || '',
          coreCompetencies: c.coreCompetencies || '',
          keyWords: c.keyWords || '',
          tlrs: c.tlrs || '',
          references: c.references || '',
          phase1: c.phase1 || '',
          phase2: c.phase2 || '',
          phase3: c.phase3 || '',
          assessment: c.assessment,
          remarks: c.remarks,
          differentiation: c.differentiation,
          locality: c.locality || 'urban',
          specificLocality: c.specificLocality,
        });
        const safeFilename = `teachsmart_${(doc.subject || 'lesson').toLowerCase().replace(/[^a-z0-9]/g, '_')}_GES_LessonPlan.pdf`;
        pdf.save(safeFilename);
        toast.success('Official GES Lesson Plan PDF downloaded from vault! 🇬🇭');
        return;
      }

      const pdf = new jsPDF();
      const title = doc.title || `${doc.type || 'Document'}`;
      
      pdf.setFillColor(0, 28, 61);
      pdf.rect(0, 0, 210, 36, 'F');
      
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(20);
      pdf.setFont('helvetica', 'bold');
      pdf.text('TEACHSMART GHANA', 105, 16, { align: 'center' });
      
      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'normal');
      pdf.text('OFFICIAL NaCCA CURRICULUM COMPLIANT TEACHING DOCUMENT', 105, 24, { align: 'center' });
      
      pdf.setDrawColor(252, 209, 22);
      pdf.setLineWidth(1);
      pdf.line(30, 29, 180, 29);

      pdf.setTextColor(0, 28, 61);
      pdf.setFontSize(13);
      pdf.setFont('helvetica', 'bold');
      pdf.text(title.toUpperCase(), 105, 48, { align: 'center' });
      
      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(100, 116, 139);
      const metaLine = `CATEGORY: ${(doc.type || '').toUpperCase()} | SUBJECT: ${doc.subject || 'GENERAL'} | LEVEL: ${doc.level || doc.class || 'BASIC'}`;
      pdf.text(metaLine, 105, 55, { align: 'center' });

      pdf.setDrawColor(226, 232, 240);
      pdf.setLineWidth(0.5);
      pdf.line(15, 60, 195, 60);

      pdf.setTextColor(30, 41, 59);
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');

      const content = getDocReadableContent(doc);
      const lines = pdf.splitTextToSize(content, 180);
      let y = 68;

      for (let i = 0; i < lines.length; i++) {
        if (y > 275) {
          pdf.addPage();
          y = 20;
        }
        pdf.text(lines[i], 15, y);
        y += 5.5;
      }

      const totalPages = (typeof (pdf as any).getNumberOfPages === 'function' ? (pdf as any).getNumberOfPages() : 1) || 1;
      for (let p = 1; p <= totalPages; p++) {
        pdf.setPage(p);
        pdf.setFontSize(8);
        pdf.setTextColor(148, 163, 184);
        pdf.text(`TeachSmart Ghana • Offline Cabinet Export • Page ${p} of ${totalPages}`, 105, 290, { align: 'center' });
      }

      const safeFilename = `teachsmart_${(doc.subject || 'doc').toLowerCase().replace(/[^a-z0-9]/g, '_')}_${doc.type}.pdf`;
      pdf.save(safeFilename);
      toast.success('Offline PDF downloaded successfully! 🇬🇭');
    } catch (err) {
      console.error(err);
      toast.error('Could not generate PDF offline.');
    }
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = 
      !searchQuery || 
      (doc.title && doc.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (doc.subject && doc.subject.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (doc.level && doc.level.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (doc.class && doc.class.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (doc.strand && doc.strand.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesType = 
      selectedType === 'all' || 
      (doc.type && doc.type.toLowerCase() === selectedType.toLowerCase());

    return matchesSearch && matchesType;
  });

  const getTypeBadgeColor = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'lessonplan':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'exam':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'scheme':
        return 'bg-amber-100 text-amber-900 border-amber-200';
      case 'note':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'assignment':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'quiz':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'lessonplan':
        return 'Lesson Plan';
      case 'exam':
        return 'Exam Paper';
      case 'scheme':
        return 'Scheme of Work';
      case 'note':
        return 'Lesson Note';
      case 'assignment':
        return 'Assignment';
      case 'quiz':
        return 'Quiz';
      default:
        return type || 'Document';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-8 space-y-6">
      {/* Top Bar Header */}
      <div className="bg-white rounded-[2.5rem] p-6 sm:p-8 border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-start sm:items-center gap-4">
          <button
            onClick={() => navigate('/')}
            className="p-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl transition-colors shrink-0"
            title="Return to Dashboard"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Offline Documents Vault</h1>
              <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 border border-emerald-200 text-[10px] font-black uppercase rounded-full">
                🇬🇭 Service Worker Active
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
              Read, print, copy, and export your lesson plans, schemes, exams, and notes without internet connectivity in rural schools.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 self-end md:self-auto">
          <div className="flex items-center gap-2 px-3 py-2 bg-slate-100 rounded-xl text-xs font-bold text-slate-600">
            {isOnline ? (
              <>
                <Wifi size={14} className="text-emerald-600" />
                <span className="text-emerald-800">Online</span>
              </>
            ) : (
              <>
                <WifiOff size={14} className="text-amber-600" />
                <span className="text-amber-800">Offline</span>
              </>
            )}
          </div>

          <button
            onClick={handleSyncAll}
            disabled={syncing || !isOnline}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-sm ${
              isOnline 
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white active:scale-95' 
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            <RefreshCw size={14} className={syncing ? 'animate-spin' : ''} />
            <span>{syncing ? 'Syncing...' : 'Sync Cloud'}</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-[2.5rem] p-6 border border-slate-100 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search offline documents by title, subject, or class..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
            />
          </div>

          <div className="text-xs font-bold text-slate-500 self-end sm:self-auto">
            Showing {filteredDocuments.length} of {documents.length} cached items
          </div>
        </div>

        {/* Type Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 custom-scrollbar">
          {[
            { id: 'all', label: 'All Documents' },
            { id: 'lessonplan', label: 'Lesson Plans' },
            { id: 'scheme', label: 'Schemes' },
            { id: 'exam', label: 'Exams' },
            { id: 'note', label: 'Lesson Notes' },
            { id: 'assignment', label: 'Assignments' },
            { id: 'quiz', label: 'Quizzes' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setSelectedType(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all ${
                selectedType === tab.id
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Documents Grid */}
      {loading ? (
        <div className="py-24 text-center flex flex-col items-center justify-center bg-white rounded-[2.5rem] border border-slate-100">
          <div className="w-10 h-10 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin mb-3" />
          <p className="text-sm font-bold text-slate-500">Loading your offline documents cabinet...</p>
        </div>
      ) : filteredDocuments.length === 0 ? (
        <div className="py-20 text-center max-w-md mx-auto bg-white rounded-[2.5rem] border border-slate-100 p-8">
          <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-3xl flex items-center justify-center mx-auto mb-4">
            <FileText size={28} />
          </div>
          <h3 className="text-base font-black text-slate-800">No cached documents found</h3>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            {searchQuery 
              ? 'No cached documents match your search criteria. Try a different keyword.' 
              : 'Every time you generate or view resources, TeachSmartGH automatically caches them on your device so you can view them anytime offline.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDocuments.map((doc) => {
            const isSelected = activeDoc?.id === doc.id;
            const formattedDate = doc.createdAt 
              ? new Date(typeof doc.createdAt === 'number' ? doc.createdAt : doc.createdAt).toLocaleDateString('en-GB', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric'
                })
              : 'Cached';

            return (
              <div
                key={doc.id}
                className={`bg-white p-6 rounded-[2rem] border transition-all duration-300 flex flex-col justify-between shadow-sm hover:shadow-md ${
                  isSelected 
                    ? 'border-emerald-500 ring-2 ring-emerald-500/20' 
                    : 'border-slate-100 hover:border-slate-200'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider border ${getTypeBadgeColor(doc.type)}`}>
                      {getTypeLabel(doc.type)}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400">
                      {formattedDate}
                    </span>
                  </div>

                  <h3 className="text-sm sm:text-base font-black text-slate-900 leading-snug line-clamp-2">
                    {doc.title || `${doc.subject || 'Ghana Education'} - ${getTypeLabel(doc.type)}`}
                  </h3>

                  <p className="text-xs font-semibold text-slate-500 mt-1.5">
                    {doc.subject || 'General'} {doc.level || doc.class ? `• ${doc.level || doc.class}` : ''}
                  </p>

                  {doc.strand && (
                    <p className="text-[11px] text-slate-400 mt-1 truncate">
                      Strand: {doc.strand}
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setActiveDoc(doc)}
                      className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-colors shadow-xs"
                    >
                      View Full
                    </button>

                    <button
                      onClick={() => handleDownloadPDF(doc)}
                      className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
                      title="Download Offline PDF"
                    >
                      <Download size={16} />
                    </button>

                    <button
                      onClick={() => handleCopyText(doc)}
                      className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
                      title="Copy Full Document Text"
                    >
                      {copiedId === doc.id ? <Check size={16} className="text-emerald-600" /> : <Copy size={16} />}
                    </button>
                  </div>

                  <button
                    onClick={() => handleDelete(doc)}
                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                    title="Remove from Cache"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Document Full View Modal Overlay */}
      <AnimatePresence>
        {activeDoc && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-[2.5rem] max-w-3xl w-full max-h-[85vh] flex flex-col overflow-hidden shadow-2xl"
            >
              <div className="p-6 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
                <div>
                  <span className="px-2.5 py-0.5 bg-ghana-gold text-slate-950 text-[9px] font-black uppercase rounded-sm">
                    {getTypeLabel(activeDoc.type)}
                  </span>
                  <h3 className="text-base sm:text-lg font-black text-white mt-1 line-clamp-1">
                    {activeDoc.title || `${activeDoc.subject} - ${getTypeLabel(activeDoc.type)}`}
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  {activeDoc.type === 'lessonPlan' && (
                    <button
                      onClick={() => {
                        navigate('/notes', {
                          state: {
                            fromLessonPlan: true,
                            sourceLessonTitle: activeDoc.title || `${activeDoc.subject} (${activeDoc.class || activeDoc.level})`,
                            preloaded: {
                              level: activeDoc.level,
                              class: activeDoc.class,
                              subject: activeDoc.subject,
                              strand: activeDoc.strand,
                              subStrand: activeDoc.subStrand,
                              contentStandard: activeDoc.contentStandard,
                              indicator: activeDoc.indicator,
                              locality: activeDoc.locality,
                            }
                          }
                        });
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black uppercase rounded-xl tracking-wider"
                      title="Generate matching student lesson notes"
                    >
                      <BookOpen size={14} />
                      <span className="hidden sm:inline">Generate Notes</span>
                    </button>
                  )}
                  <button
                    onClick={() => handleDownloadPDF(activeDoc)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-black uppercase rounded-xl tracking-wider"
                  >
                    <Download size={14} />
                    <span>PDF</span>
                  </button>
                  <button
                    onClick={() => handleCopyText(activeDoc)}
                    className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl"
                    title="Copy Text"
                  >
                    {copiedId === activeDoc.id ? <Check size={18} className="text-emerald-400" /> : <Copy size={18} />}
                  </button>
                  <button
                    onClick={() => setActiveDoc(null)}
                    className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              <div className="p-6 sm:p-8 overflow-y-auto custom-scrollbar flex-1 bg-slate-50 text-slate-800 font-mono text-xs whitespace-pre-wrap leading-relaxed">
                {getDocReadableContent(activeDoc)}
              </div>

              <div className="p-4 bg-white border-t border-slate-100 flex items-center justify-between">
                <div className="text-xs font-bold text-slate-400">
                  NaCCA Aligned • 100% Offline Compatible
                </div>
                <button
                  onClick={() => setActiveDoc(null)}
                  className="px-5 py-2 bg-slate-900 text-white hover:bg-slate-800 rounded-xl text-xs font-bold"
                >
                  Close Preview
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
