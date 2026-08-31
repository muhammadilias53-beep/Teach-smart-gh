import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  ExternalLink,
  Layers,
  Sparkles,
  Award
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { 
  getOfflineDocuments, 
  removeCachedDocument 
} from '../../lib/offlineDocumentCache';
import { syncPendingToFirebase, OfflineDocument } from '../../lib/indexedDB';
import { jsPDF } from 'jspdf';
import { exportLessonPlanToPDF } from '../../lib/lessonPlanPdfExport';
import { toast } from 'react-hot-toast';

interface OfflineDocumentsVaultProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectDocument?: (doc: OfflineDocument) => void;
}

export default function OfflineDocumentsVault({
  isOpen,
  onClose,
  onSelectDocument
}: OfflineDocumentsVaultProps) {
  const { user } = useAuth();
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
    if (isOpen) {
      loadDocuments();
    }
  }, [isOpen, user]);

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
      toast.success('Document removed from local cache.');
    } catch (err) {
      toast.error('Failed to remove document from cache.');
    }
  };

  const handleSyncAll = async () => {
    if (!user) return;
    if (!navigator.onLine) {
      toast.error('No internet connection. Reconnect to synchronize pending documents.');
      return;
    }
    setSyncing(true);
    try {
      const count = await syncPendingToFirebase(user.uid);
      if (count > 0) {
        toast.success(`Successfully synchronized ${count} document(s) to the cloud! 🇬🇭`);
      } else {
        toast.success('All local documents are already synchronized!');
      }
      await loadDocuments();
    } catch (err) {
      toast.error('Cloud synchronization failed. Will retry when connection stabilizes.');
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

    if (doc.type === 'assignment') {
      return [
        `TEACHSMART GHANA - HOMEWORK / ASSIGNMENT`,
        `Subject: ${doc.subject || 'General'} | Class: ${doc.class || doc.level || 'Basic School'}`,
        `\n===============================================\n`,
        doc.content || doc.assignmentText || ''
      ].join('\n\n');
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
      
      // Official TeachSmart Ghana Header
      pdf.setFillColor(0, 28, 61); // Deep Navy Blue
      pdf.rect(0, 0, 210, 36, 'F');
      
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(20);
      pdf.setFont('helvetica', 'bold');
      pdf.text('TEACHSMART GHANA', 105, 16, { align: 'center' });
      
      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'normal');
      pdf.text('DESIGNED TO ALIGN WITH NaCCA/GES CURRICULUM REQUIREMENTS', 105, 24, { align: 'center' });
      
      pdf.setDrawColor(252, 209, 22); // Ghana Gold
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

      // Add Footer on all pages
      const totalPages = (typeof (pdf as any).getNumberOfPages === 'function' ? (pdf as any).getNumberOfPages() : 1) || 1;
      for (let p = 1; p <= totalPages; p++) {
        pdf.setPage(p);
        pdf.setFontSize(8);
        pdf.setTextColor(148, 163, 184);
        pdf.text(`TeachSmart Ghana • Offline Cabinet Export • Page ${p} of ${totalPages}`, 105, 290, { align: 'center' });
      }

      const safeFilename = `teachsmart_${(doc.subject || 'doc').toLowerCase().replace(/[^a-z0-9]/g, '_')}_${doc.type}.pdf`;
      pdf.save(safeFilename);
      toast.success('Offline PDF created and downloaded successfully! 🇬🇭');
    } catch (err) {
      console.error(err);
      toast.error('Could not generate PDF offline.');
    }
  };

  const handlePrint = (doc: OfflineDocument) => {
    setActiveDoc(doc);
    setTimeout(() => {
      window.print();
    }, 200);
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden"
      >
        {/* Header Bar */}
        <div className="px-6 py-5 bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-500/20 text-emerald-400 rounded-2xl flex items-center justify-center border border-emerald-500/30">
              <HardDrive size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black tracking-tight text-white">Offline Documents Vault</h2>
                <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 text-[9px] font-black uppercase rounded-full border border-emerald-500/30">
                  🇬🇭 Service Worker Cache Active
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Access your generated lesson plans, schemes, exams, and notes without internet in rural schools.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSyncAll}
              disabled={syncing || !isOnline}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all ${
                isOnline 
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm' 
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
              title={isOnline ? 'Sync unsaved documents to cloud' : 'Offline - connection needed to sync'}
            >
              <RefreshCw size={12} className={syncing ? 'animate-spin' : ''} />
              <span>{syncing ? 'Syncing...' : 'Sync Cloud'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
              aria-label="Close offline vault"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="p-4 sm:p-6 bg-slate-50/70 border-b border-slate-100 space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="text"
                placeholder="Search cached documents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-500 self-end sm:self-auto font-medium">
              <span className="flex items-center gap-1.5 px-2.5 py-1 bg-white rounded-lg border border-slate-200 shadow-2xs">
                {isOnline ? (
                  <>
                    <Wifi size={12} className="text-emerald-500" />
                    <span className="text-emerald-700 font-bold text-[10px]">Online</span>
                  </>
                ) : (
                  <>
                    <WifiOff size={12} className="text-amber-500" />
                    <span className="text-amber-700 font-bold text-[10px]">Offline Mode</span>
                  </>
                )}
              </span>
              <span className="px-2.5 py-1 bg-white rounded-lg border border-slate-200 shadow-2xs text-[10px] font-bold text-slate-600">
                📦 {documents.length} Cached
              </span>
            </div>
          </div>

          {/* Type Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 custom-scrollbar">
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
                className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider whitespace-nowrap transition-all ${
                  selectedType === tab.id
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200/80'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 custom-scrollbar">
          {loading ? (
            <div className="py-20 text-center flex flex-col items-center justify-center">
              <div className="w-8 h-8 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin mb-3" />
              <p className="text-xs font-bold text-slate-500">Reading cached offline vault...</p>
            </div>
          ) : filteredDocuments.length === 0 ? (
            <div className="py-16 text-center max-w-md mx-auto">
              <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-3xl flex items-center justify-center mx-auto mb-4">
                <FileText size={28} />
              </div>
              <h3 className="text-base font-black text-slate-800">No cached documents found</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                {searchQuery 
                  ? 'No documents matched your search filter. Try another keyword.' 
                  : 'Every time you generate or view a lesson plan, exam, scheme, or note, TeachSmartGH automatically caches it here so you can access it anywhere in Ghana even without data.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    className={`p-5 rounded-2xl border transition-all duration-200 flex flex-col justify-between ${
                      isSelected 
                        ? 'bg-emerald-50/50 border-emerald-400 shadow-sm ring-2 ring-emerald-400/20' 
                        : 'bg-white border-slate-100 hover:border-slate-300 shadow-xs'
                    }`}
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <span className={`px-2.5 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider border ${getTypeBadgeColor(doc.type)}`}>
                          {getTypeLabel(doc.type)}
                        </span>
                        <span className="text-[10px] font-semibold text-slate-400">
                          {formattedDate}
                        </span>
                      </div>

                      <h4 className="text-sm font-black text-slate-900 leading-snug line-clamp-2">
                        {doc.title || `${doc.subject || 'Ghana Education'} - ${getTypeLabel(doc.type)}`}
                      </h4>

                      <p className="text-xs font-medium text-slate-500 mt-1">
                        {doc.subject || 'General'} {doc.level || doc.class ? `• ${doc.level || doc.class}` : ''}
                      </p>

                      {doc.strand && (
                        <p className="text-[10px] text-slate-400 mt-1 truncate">
                          Strand: {doc.strand}
                        </p>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => {
                            if (onSelectDocument) {
                              onSelectDocument(doc);
                              onClose();
                            } else {
                              setActiveDoc(doc);
                            }
                          }}
                          className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-[10px] font-black uppercase tracking-wider transition-colors shadow-2xs"
                        >
                          View Full
                        </button>

                        <button
                          onClick={() => handleDownloadPDF(doc)}
                          className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                          title="Download Offline PDF"
                          aria-label="Download PDF"
                        >
                          <Download size={14} />
                        </button>

                        <button
                          onClick={() => handleCopyText(doc)}
                          className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                          title="Copy Full Document Text"
                          aria-label="Copy Document Text"
                        >
                          {copiedId === doc.id ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                        </button>
                      </div>

                      <button
                        onClick={() => handleDelete(doc)}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Remove from Offline Cache"
                        aria-label="Delete cached document"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Document Full View Modal Overlay if active */}
        <AnimatePresence>
          {activeDoc && (
            <div className="fixed inset-0 z-60 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-3xl max-w-3xl w-full max-h-[85vh] flex flex-col overflow-hidden shadow-2xl"
              >
                <div className="p-5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
                  <div>
                    <span className="px-2 py-0.5 bg-ghana-gold text-slate-950 text-[9px] font-black uppercase rounded-sm">
                      {getTypeLabel(activeDoc.type)}
                    </span>
                    <h3 className="text-base font-black text-white mt-1 line-clamp-1">
                      {activeDoc.title || `${activeDoc.subject} - ${getTypeLabel(activeDoc.type)}`}
                    </h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleDownloadPDF(activeDoc)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-black uppercase rounded-lg tracking-wider"
                    >
                      <Download size={12} />
                      <span>PDF</span>
                    </button>
                    <button
                      onClick={() => handleCopyText(activeDoc)}
                      className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg"
                      title="Copy Document Text"
                    >
                      {copiedId === activeDoc.id ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
                    </button>
                    <button
                      onClick={() => setActiveDoc(null)}
                      className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg"
                    >
                      <X size={18} />
                    </button>
                  </div>
                </div>

                <div className="p-6 overflow-y-auto custom-scrollbar flex-1 bg-slate-50 text-slate-800 font-mono text-xs whitespace-pre-wrap leading-relaxed">
                  {getDocReadableContent(activeDoc)}
                </div>

                <div className="p-4 bg-white border-t border-slate-100 flex items-center justify-between">
                  <div className="text-[10px] font-bold text-slate-400">
                    NaCCA Aligned • 100% Offline Compatible
                  </div>
                  <button
                    onClick={() => setActiveDoc(null)}
                    className="px-4 py-1.5 bg-slate-900 text-white hover:bg-slate-800 rounded-xl text-xs font-bold"
                  >
                    Close Preview
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Footer info */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Cached locally for zero-data rural access
            </span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-[10px] font-black uppercase tracking-wider"
          >
            Done
          </button>
        </div>
      </motion.div>
    </div>
  );
}
