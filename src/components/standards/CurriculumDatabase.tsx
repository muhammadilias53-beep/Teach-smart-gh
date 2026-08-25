import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { 
  Search, BookOpen, Bookmark, BookmarkCheck, Copy, 
  ExternalLink, Sparkles, Filter, Layers, CheckCircle2, 
  GraduationCap, Lightbulb, Tag, Compass, ArrowRight, 
  FileText, Calendar, RotateCcw, Download, Printer, 
  Info, ChevronRight, Check, Share2, Eye
} from 'lucide-react';
import { 
  CurriculumIndicatorItem, 
  getIndexedCurriculumDatabase, 
  searchCurriculumStandards, 
  getCurriculumStats, 
  isIndicatorBookmarked, 
  toggleBookmarkIndicator, 
  getBookmarkedIndicatorIds 
} from '../../lib/curriculumDatabase';
import { subjects, levels, CLASSES_BY_LEVEL, SUBJECT_STRANDS, SUBJECT_SUB_STRANDS } from '../../constants';
import { formatPerformanceIndicator } from '../../lib/utils';
import toast from 'react-hot-toast';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const CurriculumDatabase: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<string>('All');
  const [selectedSubject, setSelectedSubject] = useState<string>('All');
  const [selectedClass, setSelectedClass] = useState<string>('All');
  const [selectedStrand, setSelectedStrand] = useState<string>('All');
  const [selectedSubStrand, setSelectedSubStrand] = useState<string>('All');
  const [activeTab, setActiveTab] = useState<'explorer' | 'saved' | 'taxonomy'>('explorer');
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(() => getBookmarkedIndicatorIds());
  const [detailItem, setDetailItem] = useState<CurriculumIndicatorItem | null>(null);
  const [displayLimit, setDisplayLimit] = useState(40);

  const stats = useMemo(() => getCurriculumStats(), []);

  const availableSubjects = useMemo(() => {
    return ['All', ...subjects];
  }, []);

  const availableClasses = useMemo(() => {
    if (selectedLevel !== 'All' && CLASSES_BY_LEVEL[selectedLevel]) {
      return ['All', ...CLASSES_BY_LEVEL[selectedLevel]];
    }
    return ['All', 'KG 1', 'KG 2', 'Basic 1', 'Basic 2', 'Basic 3', 'Basic 4', 'Basic 5', 'Basic 6', 'Basic 7', 'Basic 8', 'Basic 9', 'Basic 10', 'Basic 11', 'Basic 12'];
  }, [selectedLevel]);

  const availableStrands = useMemo(() => {
    if (selectedSubject !== 'All' && SUBJECT_STRANDS[selectedSubject]) {
      return ['All', ...SUBJECT_STRANDS[selectedSubject]];
    }
    return ['All'];
  }, [selectedSubject]);

  const availableSubStrands = useMemo(() => {
    if (selectedStrand !== 'All' && SUBJECT_SUB_STRANDS[selectedStrand]) {
      return ['All', ...SUBJECT_SUB_STRANDS[selectedStrand]];
    }
    return ['All'];
  }, [selectedStrand]);

  const filteredResults = useMemo(() => {
    return searchCurriculumStandards(
      {
        query: searchQuery,
        level: selectedLevel !== 'All' ? selectedLevel : undefined,
        subject: selectedSubject !== 'All' ? selectedSubject : undefined,
        classLevel: selectedClass !== 'All' ? selectedClass : undefined,
        strand: selectedStrand !== 'All' ? selectedStrand : undefined,
        subStrand: selectedSubStrand !== 'All' ? selectedSubStrand : undefined,
        onlyBookmarked: activeTab === 'saved'
      },
      bookmarkedIds
    );
  }, [searchQuery, selectedLevel, selectedSubject, selectedClass, selectedStrand, selectedSubStrand, activeTab, bookmarkedIds]);

  const handleBookmarkToggle = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const updated = toggleBookmarkIndicator(id);
    setBookmarkedIds(updated);
    toast.success(updated.includes(id) ? 'Saved to bookmarks' : 'Removed from bookmarks');
  };

  const handleCopyCitation = (e: React.MouseEvent, item: CurriculumIndicatorItem) => {
    e.stopPropagation();
    const citation = `NaCCA Ghana Curriculum (${item.level} - ${item.classLevel})\nSubject: ${item.subject}\nStrand: ${item.strand}\nSub-Strand: ${item.subStrand}\nContent Standard: ${item.standardCode}: ${item.standardText}\nLearning Indicator: ${item.indicatorCode}: ${item.indicatorText}`;
    navigator.clipboard.writeText(citation);
    toast.success('NaCCA citation copied to clipboard!');
  };

  const handlePlanLesson = (item: CurriculumIndicatorItem) => {
    navigate('/lessons', {
      state: {
        preloaded: {
          level: item.level,
          class: item.classLevel,
          subject: item.subject,
          strand: item.strand,
          subStrand: item.subStrand,
          contentStandard: item.standardFull,
          indicator: item.indicatorFull,
          mainObjective: formatPerformanceIndicator(item.indicatorText || item.indicatorFull)
        }
      }
    });
  };

  const handleCreateNote = (item: CurriculumIndicatorItem) => {
    navigate('/notes', {
      state: {
        preloaded: {
          level: item.level,
          class: item.classLevel,
          subject: item.subject,
          strand: item.strand,
          subStrand: item.subStrand,
          contentStandard: item.standardFull,
          indicator: item.indicatorFull,
          topic: `${item.strand}: ${item.subStrand}`
        }
      }
    });
  };

  const handleCreateExam = (item: CurriculumIndicatorItem) => {
    navigate('/exams', {
      state: {
        preloaded: {
          level: item.level,
          class: item.classLevel,
          subject: item.subject,
          strand: item.strand,
          subStrand: item.subStrand,
          contentStandard: item.standardFull,
          indicator: item.indicatorFull
        }
      }
    });
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedLevel('All');
    setSelectedSubject('All');
    setSelectedClass('All');
    setSelectedStrand('All');
    setSelectedSubStrand('All');
    setDisplayLimit(40);
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    
    // Header Branding
    doc.setFillColor(0, 28, 61); // Navy Blue
    doc.rect(0, 0, 210, 36, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('TEACHSMART GHANA', 105, 16, { align: 'center' });
    
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text('OFFICIAL NaCCA CURRICULUM STANDARDS & INDICATORS DIRECTORY', 105, 24, { align: 'center' });
    
    doc.setDrawColor(252, 209, 22); // Ghana Gold
    doc.setLineWidth(0.8);
    doc.line(40, 28, 170, 28);

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(8.5);
    doc.text(`EXPORT FILTER: Level: ${selectedLevel} | Subject: ${selectedSubject} | Class: ${selectedClass} | Results: ${filteredResults.length} items`, 14, 44);

    const tableRows = filteredResults.slice(0, 150).map(item => [
      item.indicatorCode || item.standardCode,
      item.subject,
      item.classLevel,
      `${item.strand}\n> ${item.subStrand}`,
      item.indicatorText
    ]);

    autoTable(doc, {
      startY: 48,
      head: [['Code', 'Subject', 'Class', 'Strand / Sub-Strand', 'Learning Indicator Statement']],
      body: tableRows,
      theme: 'grid',
      headStyles: {
        fillColor: [0, 107, 63], // Ghana Green
        textColor: 255,
        fontStyle: 'bold',
        fontSize: 8
      },
      styles: {
        fontSize: 7.5,
        cellPadding: 2.5
      },
      columnStyles: {
        0: { cellWidth: 24, fontStyle: 'bold' },
        1: { cellWidth: 24 },
        2: { cellWidth: 16 },
        3: { cellWidth: 40 },
        4: { cellWidth: 'auto' }
      }
    });

    doc.save(`NaCCA_Standards_${selectedSubject}_${selectedClass || 'All'}.pdf`);
    toast.success('Curriculum standards PDF exported!');
  };

  const hasActiveFilters = searchQuery !== '' || selectedLevel !== 'All' || selectedSubject !== 'All' || selectedClass !== 'All' || selectedStrand !== 'All' || selectedSubStrand !== 'All';

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner Header */}
      <div className="bg-[#0A192F] text-white p-6 sm:p-8 rounded-3xl relative overflow-hidden shadow-xl border border-slate-800">
        <div className="absolute right-0 top-0 w-96 h-96 bg-[#006B3F]/20 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="relative z-10 max-w-3xl">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="px-3 py-1 bg-[#006B3F] text-white text-xs font-bold rounded-full tracking-wide inline-flex items-center gap-1.5 shadow-xs">
              <Compass size={14} />
              Official NaCCA Standards
            </span>
            <span className="px-3 py-1 bg-amber-400/20 text-amber-300 border border-amber-400/30 text-xs font-bold rounded-full">
              🇬🇭 Ghana Education Service
            </span>
            <span className="px-3 py-1 bg-white/10 text-slate-200 text-xs font-medium rounded-full">
              KG through SHS (Basic 1 - 12)
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2">
            Curriculum Standards & Indicators Database
          </h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-6">
            Instantly search, reference, bookmark, and import certified NaCCA content standards and learning indicators directly into your lesson plans, schemes of work, and assessment papers.
          </p>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-700/60">
            <div className="bg-white/5 backdrop-blur-xs p-3 rounded-2xl border border-white/10">
              <span className="text-xs text-slate-400 font-medium">Learning Indicators</span>
              <p className="text-xl font-bold text-amber-400">{stats.totalIndicators.toLocaleString()}</p>
            </div>
            <div className="bg-white/5 backdrop-blur-xs p-3 rounded-2xl border border-white/10">
              <span className="text-xs text-slate-400 font-medium">Content Standards</span>
              <p className="text-xl font-bold text-emerald-400">{stats.totalStandards.toLocaleString()}</p>
            </div>
            <div className="bg-white/5 backdrop-blur-xs p-3 rounded-2xl border border-white/10">
              <span className="text-xs text-slate-400 font-medium">Subjects Indexed</span>
              <p className="text-xl font-bold text-white">{stats.totalSubjects}</p>
            </div>
            <div className="bg-white/5 backdrop-blur-xs p-3 rounded-2xl border border-white/10">
              <span className="text-xs text-slate-400 font-medium">Curriculum Strands</span>
              <p className="text-xl font-bold text-cyan-400">{stats.totalStrands}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        {/* Navigation Tabs & Actions */}
        <div className="p-4 sm:p-6 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl w-full sm:w-auto">
            <button
              onClick={() => setActiveTab('explorer')}
              className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                activeTab === 'explorer'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Compass size={16} className="text-[#006B3F]" />
              Standards Explorer
              <span className="px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px]">
                {filteredResults.length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('saved')}
              className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                activeTab === 'saved'
                  ? 'bg-white text-amber-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Bookmark size={16} className={bookmarkedIds.length > 0 ? "fill-amber-400 text-amber-500" : ""} />
              Saved Indicators
              <span className="px-1.5 py-0.5 rounded-md bg-amber-100 text-amber-800 text-[11px]">
                {bookmarkedIds.length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('taxonomy')}
              className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                activeTab === 'taxonomy'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Layers size={16} className="text-indigo-600" />
              Strand Taxonomy
            </button>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={handleExportPDF}
              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors"
              title="Export current filtered view to PDF"
            >
              <Download size={15} />
              Export PDF
            </button>
            {hasActiveFilters && (
              <button
                onClick={handleResetFilters}
                className="px-3.5 py-2 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors"
              >
                <RotateCcw size={15} />
                Reset Filters
              </button>
            )}
          </div>
        </div>

        {activeTab !== 'taxonomy' ? (
          <>
            {/* Search Bar & Multi-filter Controls */}
            <div className="p-4 sm:p-6 bg-slate-50/70 border-b border-slate-200/80 space-y-4">
              {/* Main Search Input */}
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by code (e.g., B7.1.1.1.1, 1.1.1.CS.1) or topic (e.g., photosynthesis, linear equations, verbs, democracy)..."
                  className="w-full pl-12 pr-10 py-3.5 bg-white border border-slate-200 rounded-2xl text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#006B3F] shadow-xs"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <RotateCcw size={16} />
                  </button>
                )}
              </div>

              {/* Education Level Quick Filters */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mr-1">Level:</span>
                {['All', 'KG', 'Primary', 'JHS', 'SHS'].map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => {
                      setSelectedLevel(lvl);
                      setSelectedClass('All');
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      selectedLevel === lvl
                        ? 'bg-[#0A192F] text-white shadow-xs'
                        : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {lvl === 'All' ? 'All Levels' : lvl}
                  </button>
                ))}
              </div>

              {/* Detailed Dropdown Filters */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">Class / Grade</label>
                  <select
                    value={selectedClass}
                    onChange={(e) => setSelectedClass(e.target.value)}
                    className="w-full text-xs py-2.5 px-3 bg-white border border-slate-200 rounded-xl text-slate-800 font-semibold focus:ring-2 focus:ring-[#006B3F] focus:outline-none shadow-xs"
                  >
                    {availableClasses.map(cls => <option key={cls} value={cls}>{cls}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">Subject</label>
                  <select
                    value={selectedSubject}
                    onChange={(e) => {
                      setSelectedSubject(e.target.value);
                      setSelectedStrand('All');
                      setSelectedSubStrand('All');
                    }}
                    className="w-full text-xs py-2.5 px-3 bg-white border border-slate-200 rounded-xl text-slate-800 font-semibold focus:ring-2 focus:ring-[#006B3F] focus:outline-none shadow-xs"
                  >
                    {availableSubjects.map(sub => <option key={sub} value={sub}>{sub}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">Strand</label>
                  <select
                    value={selectedStrand}
                    onChange={(e) => {
                      setSelectedStrand(e.target.value);
                      setSelectedSubStrand('All');
                    }}
                    className="w-full text-xs py-2.5 px-3 bg-white border border-slate-200 rounded-xl text-slate-800 font-semibold focus:ring-2 focus:ring-[#006B3F] focus:outline-none shadow-xs"
                  >
                    {availableStrands.map(st => <option key={st} value={st}>{st}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">Sub-Strand</label>
                  <select
                    value={selectedSubStrand}
                    onChange={(e) => setSelectedSubStrand(e.target.value)}
                    className="w-full text-xs py-2.5 px-3 bg-white border border-slate-200 rounded-xl text-slate-800 font-semibold focus:ring-2 focus:ring-[#006B3F] focus:outline-none shadow-xs"
                  >
                    {availableSubStrands.map(sst => <option key={sst} value={sst}>{sst}</option>)}
                  </select>
                </div>
              </div>

              {/* Active Filters Pill Bar */}
              {hasActiveFilters && (
                <div className="flex flex-wrap items-center gap-1.5 pt-2">
                  <span className="text-xs font-semibold text-slate-400">Active filters:</span>
                  {selectedLevel !== 'All' && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs bg-slate-200 text-slate-800 font-semibold">
                      Level: {selectedLevel}
                      <button onClick={() => setSelectedLevel('All')} className="hover:text-red-500"><RotateCcw size={11} /></button>
                    </span>
                  )}
                  {selectedClass !== 'All' && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs bg-slate-200 text-slate-800 font-semibold">
                      Class: {selectedClass}
                      <button onClick={() => setSelectedClass('All')} className="hover:text-red-500"><RotateCcw size={11} /></button>
                    </span>
                  )}
                  {selectedSubject !== 'All' && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs bg-emerald-100 text-emerald-900 font-semibold">
                      Subject: {selectedSubject}
                      <button onClick={() => setSelectedSubject('All')} className="hover:text-red-500"><RotateCcw size={11} /></button>
                    </span>
                  )}
                  {selectedStrand !== 'All' && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs bg-indigo-100 text-indigo-900 font-semibold">
                      Strand: {selectedStrand}
                      <button onClick={() => setSelectedStrand('All')} className="hover:text-red-500"><RotateCcw size={11} /></button>
                    </span>
                  )}
                  {searchQuery && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs bg-amber-100 text-amber-900 font-semibold">
                      Query: "{searchQuery}"
                      <button onClick={() => setSearchQuery('')} className="hover:text-red-500"><RotateCcw size={11} /></button>
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Results Grid */}
            <div className="p-4 sm:p-6">
              {filteredResults.length === 0 ? (
                <div className="py-16 text-center max-w-md mx-auto">
                  <div className="w-16 h-16 rounded-3xl bg-slate-100 text-slate-400 mx-auto flex items-center justify-center mb-4">
                    <Search size={32} />
                  </div>
                  <h3 className="text-lg font-bold text-slate-800 mb-1">No matching indicators found</h3>
                  <p className="text-xs sm:text-sm text-slate-500 mb-6">
                    We couldn't find any learning indicators matching your query. Try broadening your keywords or resetting filters.
                  </p>
                  <button
                    onClick={handleResetFilters}
                    className="px-5 py-2.5 bg-[#006B3F] text-white text-xs font-bold rounded-xl hover:bg-[#005230] transition-colors inline-flex items-center gap-2"
                  >
                    <RotateCcw size={15} />
                    Reset All Filters
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                    <span>
                      Showing <strong className="text-slate-800">{Math.min(displayLimit, filteredResults.length)}</strong> of <strong className="text-slate-800">{filteredResults.length}</strong> learning indicators
                    </span>
                    <span className="text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100">
                      NaCCA Ghana Compliant
                    </span>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    {filteredResults.slice(0, displayLimit).map((item) => {
                      const isBookmarked = bookmarkedIds.includes(item.id);
                      return (
                        <div
                          key={item.id}
                          onClick={() => setDetailItem(item)}
                          className="p-5 bg-white rounded-2xl border border-slate-200/80 hover:border-[#006B3F]/50 hover:shadow-md transition-all cursor-pointer group"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-[#0A192F] text-white tracking-wide shadow-xs">
                                {item.indicatorCode || item.standardCode}
                              </span>
                              <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-50 text-[#006B3F] border border-emerald-200/70">
                                {item.subject}
                              </span>
                              <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700">
                                {item.classLevel} ({item.level})
                              </span>
                            </div>

                            <div className="flex items-center gap-1 shrink-0 self-end sm:self-auto" onClick={(e) => e.stopPropagation()}>
                              <button
                                onClick={(e) => handleBookmarkToggle(e, item.id)}
                                className="p-2 text-slate-400 hover:text-amber-500 hover:bg-amber-50 rounded-xl transition-colors"
                                title={isBookmarked ? "Remove bookmark" : "Save indicator"}
                              >
                                <Bookmark size={18} className={isBookmarked ? "fill-amber-400 text-amber-500" : ""} />
                              </button>
                              <button
                                onClick={(e) => handleCopyCitation(e, item)}
                                className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
                                title="Copy citation"
                              >
                                <Copy size={18} />
                              </button>
                            </div>
                          </div>

                          {/* Strand & Sub-strand navigation */}
                          <div className="text-xs text-slate-500 font-medium flex items-center gap-2 mb-2">
                            <span className="text-slate-800 font-semibold">{item.strand}</span>
                            <ChevronRight size={14} className="text-slate-400 shrink-0" />
                            <span>{item.subStrand}</span>
                          </div>

                          {/* Main Learning Indicator Statement */}
                          <div className="mb-3">
                            <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-snug group-hover:text-[#006B3F] transition-colors">
                              {item.indicatorText}
                            </h3>
                            {item.standardText && item.standardText !== item.indicatorText && (
                              <p className="text-xs text-slate-500 mt-1.5 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                                <span className="font-bold text-slate-700">Content Standard ({item.standardCode}): </span>
                                {item.standardText}
                              </p>
                            )}
                          </div>

                          {/* Core Competencies & Suggested TLRs */}
                          <div className="flex flex-wrap items-center gap-1.5 mb-4">
                            {item.coreCompetencies.map((comp) => (
                              <span key={comp} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
                                <Tag size={11} />
                                {comp}
                              </span>
                            ))}
                            {item.suggestedTLRs.slice(0, 2).map((tlr) => (
                              <span key={tlr} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-amber-50 text-amber-800 border border-amber-100">
                                <Lightbulb size={11} />
                                {tlr}
                              </span>
                            ))}
                          </div>

                          {/* Quick 1-Click Planning Actions */}
                          <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-100" onClick={(e) => e.stopPropagation()}>
                            <span className="text-[11px] font-medium text-slate-400 hidden sm:inline">
                              Click card to view details or plan below:
                            </span>

                            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
                              <button
                                onClick={() => handlePlanLesson(item)}
                                className="px-3 py-1.5 bg-[#006B3F] hover:bg-[#005230] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-xs transition-all"
                              >
                                <FileText size={13} />
                                Plan Lesson
                              </button>
                              <button
                                onClick={() => handleCreateNote(item)}
                                className="px-3 py-1.5 bg-[#0A192F] hover:bg-slate-800 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all"
                              >
                                <BookOpen size={13} />
                                Lesson Note
                              </button>
                              <button
                                onClick={() => handleCreateExam(item)}
                                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all"
                              >
                                <Sparkles size={13} />
                                Exam Item
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {filteredResults.length > displayLimit && (
                    <div className="text-center pt-4 pb-2">
                      <button
                        onClick={() => setDisplayLimit(prev => prev + 40)}
                        className="px-6 py-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-800 text-xs font-bold rounded-2xl shadow-xs transition-colors"
                      >
                        Load More Standards ({filteredResults.length - displayLimit} remaining)
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </>
        ) : (
          /* Strand Taxonomy Explorer View */
          <div className="p-6">
            <div className="mb-6">
              <h2 className="text-lg font-bold text-slate-900">NaCCA Curriculum Subject & Strand Taxonomy</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Overview of all accredited subjects, learning strands, and sub-strands across the Ghanaian national curriculum.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {subjects.map((subj) => {
                const strands = SUBJECT_STRANDS[subj] || [];
                return (
                  <div key={subj} className="p-5 rounded-2xl border border-slate-200 bg-white space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-base text-slate-900">{subj}</h3>
                      <span className="text-xs font-semibold px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md">
                        {strands.length} Strands
                      </span>
                    </div>

                    <div className="space-y-2">
                      {strands.map((st) => {
                        const subStrands = SUBJECT_SUB_STRANDS[st] || [];
                        return (
                          <div key={st} className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs">
                            <div className="font-bold text-slate-800 flex items-center justify-between">
                              <span>{st}</span>
                              <button
                                onClick={() => {
                                  setSelectedSubject(subj);
                                  setSelectedStrand(st);
                                  setActiveTab('explorer');
                                }}
                                className="text-[#006B3F] hover:underline font-semibold"
                              >
                                View Indicators →
                              </button>
                            </div>
                            {subStrands.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-2">
                                {subStrands.map((sst) => (
                                  <span key={sst} className="px-2 py-0.5 bg-white text-slate-600 rounded text-[10px] border border-slate-200">
                                    {sst}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Detail Slide-over Modal */}
      {detailItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 bg-[#0A192F] text-white flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-3 py-1 bg-[#006B3F] text-white text-xs font-bold rounded-lg">
                    {detailItem.indicatorCode || detailItem.standardCode}
                  </span>
                  <span className="px-2.5 py-1 bg-white/10 text-white text-xs font-medium rounded-lg">
                    {detailItem.classLevel} • {detailItem.subject}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white leading-snug">
                  {detailItem.indicatorText}
                </h3>
              </div>
              <button
                onClick={() => setDetailItem(null)}
                className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-white/10 transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-5 text-slate-800">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Curriculum Path</span>
                <p className="text-sm font-semibold text-slate-900 mt-1">
                  {detailItem.subject} › {detailItem.strand} › {detailItem.subStrand}
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Content Standard</span>
                <p className="text-sm font-semibold text-slate-900 mt-1">
                  {detailItem.standardCode}: {detailItem.standardText}
                </p>
              </div>

              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Target Core Competencies</span>
                <div className="flex flex-wrap gap-2 mt-2">
                  {detailItem.coreCompetencies.map((comp) => (
                    <span key={comp} className="px-3 py-1 bg-indigo-50 text-indigo-700 font-semibold text-xs rounded-xl border border-indigo-100">
                      {comp}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Recommended Ghanaian Teaching Resources (TLRs)</span>
                <div className="flex flex-wrap gap-2 mt-2">
                  {detailItem.suggestedTLRs.map((tlr) => (
                    <span key={tlr} className="px-3 py-1 bg-amber-50 text-amber-900 font-semibold text-xs rounded-xl border border-amber-200">
                      {tlr}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-4 sm:p-6 border-t border-slate-100 bg-slate-50 flex flex-wrap items-center justify-between gap-3">
              <button
                onClick={(e) => handleBookmarkToggle(e, detailItem.id)}
                className="px-4 py-2.5 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-xl flex items-center gap-2"
              >
                <Bookmark size={16} className={bookmarkedIds.includes(detailItem.id) ? "fill-amber-400 text-amber-500" : ""} />
                {bookmarkedIds.includes(detailItem.id) ? 'Bookmarked' : 'Save to Bookmarks'}
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    handlePlanLesson(detailItem);
                    setDetailItem(null);
                  }}
                  className="px-4 py-2.5 bg-[#006B3F] hover:bg-[#005230] text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-xs"
                >
                  <FileText size={15} />
                  Plan Lesson with Indicator
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
