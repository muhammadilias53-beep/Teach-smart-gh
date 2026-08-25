import React, { useState, useMemo } from 'react';
import { 
  Search, X, BookOpen, Check, Bookmark, BookmarkCheck, 
  ExternalLink, Sparkles, Filter, Layers, CheckCircle2, Copy,
  GraduationCap, Lightbulb, Tag, Compass, ArrowRight
} from 'lucide-react';
import { 
  CurriculumIndicatorItem, 
  searchCurriculumStandards, 
  isIndicatorBookmarked, 
  toggleBookmarkIndicator,
  getBookmarkedIndicatorIds 
} from '../../lib/curriculumDatabase';
import { subjects, levels, CLASSES_BY_LEVEL, SUBJECT_STRANDS } from '../../constants';
import toast from 'react-hot-toast';

interface CurriculumReferenceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectIndicator?: (indicator: CurriculumIndicatorItem) => void;
  onSelectIndicators?: (indicators: CurriculumIndicatorItem[]) => void;
  initialLevel?: string;
  initialClass?: string;
  initialSubject?: string;
  initialStrand?: string;
  initialSubStrand?: string;
}

export const CurriculumReferenceModal: React.FC<CurriculumReferenceModalProps> = ({
  isOpen,
  onClose,
  onSelectIndicator,
  onSelectIndicators,
  initialLevel,
  initialClass,
  initialSubject,
  initialStrand,
  initialSubStrand
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<string>(initialLevel || 'All');
  const [selectedSubject, setSelectedSubject] = useState<string>(initialSubject || 'All');
  const [selectedClass, setSelectedClass] = useState<string>(initialClass || 'All');
  const [selectedStrand, setSelectedStrand] = useState<string>(initialStrand || 'All');
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(() => getBookmarkedIndicatorIds());
  const [activeTab, setActiveTab] = useState<'all' | 'saved'>('all');
  const [selectedDetail, setSelectedDetail] = useState<CurriculumIndicatorItem | null>(null);
  const [multiSelectedItems, setMultiSelectedItems] = useState<CurriculumIndicatorItem[]>([]);

  // Sync initial props when opened
  React.useEffect(() => {
    if (isOpen) {
      if (initialLevel) setSelectedLevel(initialLevel);
      if (initialSubject) setSelectedSubject(initialSubject);
      if (initialClass) setSelectedClass(initialClass);
      if (initialStrand) setSelectedStrand(initialStrand);
      setMultiSelectedItems([]);
    }
  }, [isOpen, initialLevel, initialSubject, initialClass, initialStrand]);

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

  const searchResults = useMemo(() => {
    return searchCurriculumStandards(
      {
        query: searchQuery,
        level: selectedLevel !== 'All' ? selectedLevel : undefined,
        subject: selectedSubject !== 'All' ? selectedSubject : undefined,
        classLevel: selectedClass !== 'All' ? selectedClass : undefined,
        strand: selectedStrand !== 'All' ? selectedStrand : undefined,
        onlyBookmarked: activeTab === 'saved'
      },
      bookmarkedIds
    );
  }, [searchQuery, selectedLevel, selectedSubject, selectedClass, selectedStrand, activeTab, bookmarkedIds]);

  const handleBookmarkToggle = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const updated = toggleBookmarkIndicator(id);
    setBookmarkedIds(updated);
    toast.success(updated.includes(id) ? 'Saved to your NaCCA bookmarks' : 'Removed from bookmarks');
  };

  const handleCopyCode = (e: React.MouseEvent, item: CurriculumIndicatorItem) => {
    e.stopPropagation();
    const textToCopy = `${item.indicatorCode}: ${item.indicatorText} (Standard: ${item.standardCode})`;
    navigator.clipboard.writeText(textToCopy);
    toast.success('Indicator code copied to clipboard!');
  };

  const handleToggleMultiSelect = (item: CurriculumIndicatorItem) => {
    setMultiSelectedItems(prev => {
      const exists = prev.some(i => i.id === item.id);
      if (exists) {
        return prev.filter(i => i.id !== item.id);
      } else {
        return [...prev, item];
      }
    });
  };

  const handleApplyMultiSelected = () => {
    if (multiSelectedItems.length === 0) return;
    if (onSelectIndicators) {
      onSelectIndicators(multiSelectedItems);
      toast.success(`Selected ${multiSelectedItems.length} indicators for lesson plan! 🇬🇭`);
      onClose();
    } else if (onSelectIndicator && multiSelectedItems.length > 0) {
      onSelectIndicator(multiSelectedItems[0]);
      toast.success(`Selected ${multiSelectedItems[0].indicatorCode} for lesson plan!`);
      onClose();
    }
  };

  const handleSelect = (item: CurriculumIndicatorItem) => {
    if (onSelectIndicators) {
      onSelectIndicators([item]);
      toast.success(`Selected ${item.indicatorCode} for lesson planning!`);
      onClose();
    } else if (onSelectIndicator) {
      onSelectIndicator(item);
      toast.success(`Selected ${item.indicatorCode} for lesson planning!`);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/60 backdrop-blur-xs">
      <div 
        className="relative w-full max-w-5xl max-h-[92vh] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden text-slate-900 animate-in fade-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 bg-slate-50 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#006B3F]/10 text-[#006B3F] flex items-center justify-center font-bold">
              <Compass size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                  NaCCA Curriculum Reference Database
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#006B3F]/10 text-[#006B3F] border border-[#006B3F]/20">
                  Official Standards
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                Quickly search learning indicators and apply them directly into your lesson plan.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
            title="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Search & Filter Controls */}
        <div className="p-4 border-b border-slate-100 bg-white space-y-3">
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by code (e.g. B7.1.1.1), topic, keyword (e.g. fractions, photosynthesis)..."
                className="w-full pl-10 pr-9 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#006B3F] focus:bg-white"
                autoFocus
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl shrink-0">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === 'all'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All ({searchResults.length})
              </button>
              <button
                onClick={() => setActiveTab('saved')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  activeTab === 'saved'
                    ? 'bg-white text-amber-600 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Bookmark size={13} className={bookmarkedIds.length > 0 ? "fill-amber-400 text-amber-500" : ""} />
                Saved ({bookmarkedIds.length})
              </button>
            </div>
          </div>

          {/* Filters Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
            <div>
              <label className="block text-[11px] font-semibold text-slate-500 mb-1">Level</label>
              <select
                value={selectedLevel}
                onChange={(e) => {
                  setSelectedLevel(e.target.value);
                  setSelectedClass('All');
                }}
                className="w-full text-xs py-1.5 px-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-medium focus:ring-2 focus:ring-[#006B3F] focus:outline-none"
              >
                <option value="All">All Levels</option>
                {levels.map(lvl => <option key={lvl} value={lvl}>{lvl}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-500 mb-1">Class / Grade</label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full text-xs py-1.5 px-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-medium focus:ring-2 focus:ring-[#006B3F] focus:outline-none"
              >
                {availableClasses.map(cls => <option key={cls} value={cls}>{cls}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-500 mb-1">Subject</label>
              <select
                value={selectedSubject}
                onChange={(e) => {
                  setSelectedSubject(e.target.value);
                  setSelectedStrand('All');
                }}
                className="w-full text-xs py-1.5 px-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-medium focus:ring-2 focus:ring-[#006B3F] focus:outline-none"
              >
                {availableSubjects.map(sub => <option key={sub} value={sub}>{sub}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-500 mb-1">Strand</label>
              <select
                value={selectedStrand}
                onChange={(e) => setSelectedStrand(e.target.value)}
                className="w-full text-xs py-1.5 px-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-medium focus:ring-2 focus:ring-[#006B3F] focus:outline-none"
              >
                {availableStrands.map(st => <option key={st} value={st}>{st}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Modal Body / Results List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3 bg-slate-50/50">
          {searchResults.length === 0 ? (
            <div className="py-12 px-4 text-center">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 mx-auto flex items-center justify-center mb-3">
                <Search size={24} />
              </div>
              <h3 className="text-sm font-bold text-slate-700">No standards or indicators found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                Try adjusting your filters or searching for broader terms like "Math", "B7", "Force", or "Fractions".
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedLevel('All');
                  setSelectedSubject('All');
                  setSelectedClass('All');
                  setSelectedStrand('All');
                }}
                className="mt-3 px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-semibold rounded-lg transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3">
              {searchResults.slice(0, 100).map((item) => {
                const isBookmarked = bookmarkedIds.includes(item.id);
                const isMultiSelected = multiSelectedItems.some(i => i.id === item.id);
                return (
                  <div
                    key={item.id}
                    onClick={() => handleToggleMultiSelect(item)}
                    className={`p-4 bg-white rounded-xl border-2 transition-all cursor-pointer group ${
                      isMultiSelected 
                        ? 'border-[#006B3F] bg-emerald-50/20 shadow-md ring-2 ring-[#006B3F]/20' 
                        : 'border-slate-200/80 hover:border-[#006B3F]/40 hover:shadow-sm'
                    }`}
                  >
                    {/* Header Info */}
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <div className={`w-5 h-5 rounded flex items-center justify-center border transition-all ${
                          isMultiSelected 
                            ? 'bg-[#006B3F] border-[#006B3F] text-white' 
                            : 'border-slate-300 bg-white group-hover:border-slate-400'
                        }`}>
                          {isMultiSelected && <Check size={12} strokeWidth={3} />}
                        </div>
                        <span className="px-2 py-0.5 rounded-md text-xs font-bold bg-[#0A192F] text-white tracking-wide">
                          {item.indicatorCode || item.standardCode}
                        </span>
                        <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-50 text-[#006B3F] border border-emerald-200/60">
                          {item.subject}
                        </span>
                        <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-slate-100 text-slate-700">
                          {item.classLevel} ({item.level})
                        </span>
                      </div>

                      <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={(e) => handleBookmarkToggle(e, item.id)}
                          className="p-1.5 text-slate-400 hover:text-amber-500 hover:bg-amber-50 rounded-lg transition-colors"
                          title={isBookmarked ? "Remove bookmark" : "Save indicator"}
                        >
                          <Bookmark size={16} className={isBookmarked ? "fill-amber-400 text-amber-500" : ""} />
                        </button>
                        <button
                          onClick={(e) => handleCopyCode(e, item)}
                          className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                          title="Copy indicator code and text"
                        >
                          <Copy size={16} />
                        </button>
                      </div>
                    </div>

                    {/* Hierarchy Breadcrumb */}
                    <div className="text-[11px] text-slate-500 font-medium flex items-center gap-1.5 mb-2">
                      <span className="text-slate-700 font-semibold">{item.strand}</span>
                      <span>›</span>
                      <span>{item.subStrand}</span>
                    </div>

                    {/* Learning Indicator Statement */}
                    <div className="mb-3">
                      <p className="text-sm font-semibold text-slate-900 leading-snug">
                        {item.indicatorText}
                      </p>
                      {item.standardText && item.standardText !== item.indicatorText && (
                        <p className="text-xs text-slate-500 mt-1">
                          <span className="font-semibold text-slate-600">Standard: </span>
                          {item.standardCode}: {item.standardText}
                        </p>
                      )}
                    </div>

                    {/* Competencies & Suggested TLRs Tags */}
                    <div className="flex flex-wrap items-center gap-1.5 mb-3 pt-2 border-t border-slate-100">
                      {item.coreCompetencies.map(comp => (
                        <span key={comp} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium bg-indigo-50 text-indigo-700 border border-indigo-100">
                          <Tag size={10} />
                          {comp}
                        </span>
                      ))}
                      {item.suggestedTLRs.slice(0, 2).map(tlr => (
                        <span key={tlr} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium bg-amber-50 text-amber-800 border border-amber-100">
                          <Lightbulb size={10} />
                          {tlr}
                        </span>
                      ))}
                    </div>

                    {/* Action Bar */}
                    {(onSelectIndicator || onSelectIndicators) && (
                      <div className="flex justify-end items-center gap-2 pt-1" onClick={(e) => e.stopPropagation()}>
                        <button
                          type="button"
                          onClick={() => handleToggleMultiSelect(item)}
                          className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                            isMultiSelected
                              ? 'bg-emerald-100 border-emerald-300 text-emerald-900'
                              : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          {isMultiSelected ? '✓ Selected' : '+ Add to Selection'}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSelect(item)}
                          className="px-3.5 py-1.5 bg-[#006B3F] hover:bg-[#005230] text-white text-xs font-bold rounded-lg flex items-center gap-1.5 shadow-xs hover:shadow transition-all"
                        >
                          <Check size={14} />
                          Select Solo
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}

              {searchResults.length > 100 && (
                <div className="p-3 text-center text-xs font-medium text-slate-500 bg-white rounded-xl border border-slate-200">
                  Showing top 100 results of {searchResults.length} matching NaCCA standards. Use the search bar or filters to narrow down.
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer with Multi-Select Action Bar */}
        <div className="p-3.5 sm:p-4 border-t border-slate-100 bg-white flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-start">
            <span>
              Showing <strong className="text-slate-800">{Math.min(searchResults.length, 100)}</strong> of <strong className="text-slate-800">{searchResults.length}</strong> indicators
            </span>
            {multiSelectedItems.length > 0 && (
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs border border-emerald-300">
                {multiSelectedItems.length} selected
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            {multiSelectedItems.length > 0 && (
              <>
                <button
                  type="button"
                  onClick={() => setMultiSelectedItems([])}
                  className="px-3 py-2 text-slate-500 hover:text-slate-800 font-medium transition-colors"
                >
                  Clear ({multiSelectedItems.length})
                </button>
                <button
                  type="button"
                  onClick={handleApplyMultiSelected}
                  className="px-4 py-2 bg-[#006B3F] hover:bg-[#005230] text-white font-bold rounded-xl flex items-center gap-2 shadow-sm transition-all animate-pulse"
                >
                  <Check size={16} />
                  Use Selected ({multiSelectedItems.length}) Indicators
                </button>
              </>
            )}
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
