import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Plus, 
  Link as LinkIcon, 
  FileText, 
  StickyNote, 
  ExternalLink, 
  Download,
  Trash2, 
  Filter,
  Loader2,
  FolderOpen,
  Book,
  CheckCircle,
  ShieldCheck
} from 'lucide-react';
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  onSnapshot, 
  addDoc, 
  deleteDoc, 
  doc, 
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuth } from '../../contexts/AuthContext';
import { Resource } from '../../types';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../lib/utils';
import { subjects, levels, SUBJECT_STRANDS, SUBJECT_SUB_STRANDS } from '../../constants';

// Using constants from src/constants.ts

const CURRICULUM_BOOKS: Record<string, { title: string, url: string, level: string }[]> = {
  "Mathematics": [
    { title: "KG Mathematics Curriculum", url: "https://nacca.gov.gh/wp-content/uploads/2019/04/MATHEMATICS-KG.pdf", level: "KG" },
    { title: "Mathematics Curriculum (B1-B6)", url: "https://nacca.gov.gh/wp-content/uploads/2019/04/MATHEMATICS-LOWER-PRIMARY-B1-B3.pdf", level: "Basic 1-6 (Primary)" },
    { title: "Mathematics Curriculum (B7-B9)", url: "https://nacca.gov.gh/wp-content/uploads/2020/12/Mathematics-JHS-B7-B9.pdf", level: "Basic 7-9 (JHS)" },
    { title: "Senior High Mathematics", url: "https://nacca.gov.gh/wp-content/uploads/2019/04/CORE-MATHEMATICS-SHS.pdf", level: "Basic 10-12 (SHS)" }
  ],
  "English": [
    { title: "KG English Language", url: "https://nacca.gov.gh/wp-content/uploads/2019/04/ENGLISH-KG.pdf", level: "KG" },
    { title: "English Language Curriculum (B1-B6)", url: "https://nacca.gov.gh/wp-content/uploads/2019/04/ENGLISH-LOWER-PRIMARY-B1-B3.pdf", level: "Basic 1-6 (Primary)" },
    { title: "English Language Curriculum (B7-B9)", url: "https://nacca.gov.gh/wp-content/uploads/2020/12/English-Language-JHS-B7-B9.pdf", level: "Basic 7-9 (JHS)" },
    { title: "Senior High English Language", url: "https://nacca.gov.gh/wp-content/uploads/2019/04/ENGLISH-LANGUAGE-SHS.pdf", level: "Basic 10-12 (SHS)" }
  ],
  "Science": [
    { title: "KG Science", url: "https://nacca.gov.gh/wp-content/uploads/2019/04/SCIENCE-KG.pdf", level: "KG" },
    { title: "Science Curriculum (B1-B6)", url: "https://nacca.gov.gh/wp-content/uploads/2019/04/SCIENCE-LOWER-PRIMARY-B1-B3.pdf", level: "Basic 1-6 (Primary)" },
    { title: "Science Curriculum (B7-B9)", url: "https://nacca.gov.gh/wp-content/uploads/2020/12/Science-JHS-B7-B9.pdf", level: "Basic 7-9 (JHS)" },
    { title: "Senior High Integrated Science", url: "https://nacca.gov.gh/wp-content/uploads/2019/04/INTEGRATED-SCIENCE-SHS.pdf", level: "Basic 10-12 (SHS)" }
  ],
  "Social Studies": [
    { title: "Our World Our Heritage (B1-B6)", url: "https://nacca.gov.gh/wp-content/uploads/2019/04/OWOH-LOWER-PRIMARY-B1-B3.pdf", level: "Basic 1-6 (Primary)" },
    { title: "Social Studies Curriculum (B7-B9)", url: "https://nacca.gov.gh/wp-content/uploads/2020/12/Social-Studies-JHS-B7-B9.pdf", level: "Basic 7-9 (JHS)" },
    { title: "Senior High Social Studies", url: "https://nacca.gov.gh/wp-content/uploads/2019/04/SOCIAL-STUDIES-SHS.pdf", level: "Basic 10-12 (SHS)" }
  ],
  "Computing": [
    { title: "Computing Curriculum (B1-B6)", url: "https://nacca.gov.gh/wp-content/uploads/2019/04/COMPUTING-LOWER-PRIMARY-B1-B3.pdf", level: "Basic 1-6 (Primary)" },
    { title: "Computing Curriculum (B7-B9)", url: "https://nacca.gov.gh/wp-content/uploads/2020/12/Computing-JHS-B7-B9.pdf", level: "Basic 7-9 (JHS)" }
  ],
  "Career Technology": [
    { title: "Career Technology (B7-B9)", url: "https://nacca.gov.gh/wp-content/uploads/2020/12/Career-Technology-JHS-B7-B9.pdf", level: "Basic 7-9 (JHS)" }
  ],
  "RME": [
    { title: "RME Curriculum (B1-B6)", url: "https://nacca.gov.gh/wp-content/uploads/2019/04/RME-LOWER-PRIMARY-B1-B3.pdf", level: "Basic 1-6 (Primary)" },
    { title: "RME Curriculum (B7-B9)", url: "https://nacca.gov.gh/wp-content/uploads/2020/12/RME-JHS-B7-B9.pdf", level: "Basic 7-9 (JHS)" }
  ],
  "Creative Arts": [
    { title: "Creative Arts and Design (B1-B6)", url: "https://nacca.gov.gh/wp-content/uploads/2019/04/CREATIVE-ARTS-B1-B6.pdf", level: "Basic 1-6 (Primary)" },
    { title: "Creative Arts and Design (B7-B9)", url: "https://nacca.gov.gh/wp-content/uploads/2020/12/Creative-Arts-B7-B9.pdf", level: "Basic 7-9 (JHS)" }
  ],
  "French": [
    { title: "French Curriculum (B4-B6)", url: "https://nacca.gov.gh/wp-content/uploads/2019/04/FRENCH-B4-B6.pdf", level: "Basic 1-6 (Primary)" },
    { title: "French Curriculum (B7-B9)", url: "https://nacca.gov.gh/wp-content/uploads/2020/12/French-JHS-B7-B9.pdf", level: "Basic 7-9 (JHS)" }
  ],
  "Ghanaian Language": [
    { title: "Ghanaian Language Curriculum (B1-B6)", url: "https://nacca.gov.gh/wp-content/uploads/2019/04/GHANAIAN-LANGUAGE-B1-B3.pdf", level: "Basic" },
    { title: "JHS Ghanaian Language (B7-B9)", url: "https://nacca.gov.gh/wp-content/uploads/2020/12/Ghanaian-Language-JHS-B7-B9.pdf", level: "JHS" }
  ],
  "Elective Mathematics": [
    { title: "SHS Elective Mathematics", url: "https://nacca.gov.gh/wp-content/uploads/2019/04/ELECTIVE-MATHEMATICS-SHS.pdf", level: "SHS" }
  ],
  "Physics": [
    { title: "SHS Physics", url: "https://nacca.gov.gh/wp-content/uploads/2019/04/PHYSICS-SHS.pdf", level: "SHS" }
  ],
  "Chemistry": [
    { title: "SHS Chemistry", url: "https://nacca.gov.gh/wp-content/uploads/2019/04/CHEMISTRY-SHS.pdf", level: "SHS" }
  ],
  "Biology": [
    { title: "SHS Biology", url: "https://nacca.gov.gh/wp-content/uploads/2019/04/BIOLOGY-SHS.pdf", level: "SHS" }
  ],
  "Economics": [
    { title: "SHS Economics", url: "https://nacca.gov.gh/wp-content/uploads/2019/04/ECONOMICS-SHS.pdf", level: "SHS" }
  ],
  "Geography": [
    { title: "SHS Geography", url: "https://nacca.gov.gh/wp-content/uploads/2019/04/GEOGRAPHY-SHS.pdf", level: "SHS" }
  ],
  "History": [
    { title: "SHS History", url: "https://nacca.gov.gh/wp-content/uploads/2019/04/HISTORY-SHS.pdf", level: "SHS" }
  ],
  "Government": [
    { title: "SHS Government", url: "https://nacca.gov.gh/wp-content/uploads/2019/04/GOVERNMENT-SHS.pdf", level: "SHS" }
  ],
  "Literature in English": [
    { title: "SHS Literature in English", url: "https://nacca.gov.gh/wp-content/uploads/2019/04/LITERATURE-IN-ENGLISH-SHS.pdf", level: "SHS" }
  ],
  "Financial Accounting": [
    { title: "SHS Financial Accounting", url: "https://nacca.gov.gh/wp-content/uploads/2019/04/FINANCIAL-ACCOUNTING-SHS.pdf", level: "SHS" }
  ],
  "Cost Accounting": [
    { title: "SHS Cost Accounting", url: "https://nacca.gov.gh/wp-content/uploads/2019/04/COST-ACCOUNTING-SHS.pdf", level: "SHS" }
  ],
  "Business Management": [
    { title: "SHS Business Management", url: "https://nacca.gov.gh/wp-content/uploads/2019/04/BUSINESS-MANAGEMENT-SHS.pdf", level: "SHS" }
  ],
  "Agricultural Science": [
    { title: "SHS Agricultural Science", url: "https://nacca.gov.gh/wp-content/uploads/2019/04/AGRICULTURAL-SCIENCE-SHS.pdf", level: "SHS" }
  ],
  "Elective ICT": [
    { title: "SHS Elective ICT", url: "https://nacca.gov.gh/wp-content/uploads/2019/04/ELECTIVE-ICT-SHS.pdf", level: "SHS" }
  ],
  "CRS": [
    { title: "SHS Christian Religious Studies", url: "https://nacca.gov.gh/wp-content/uploads/2019/04/CRS-SHS.pdf", level: "SHS" }
  ],
  "IRS": [
    { title: "SHS Islamic Religious Studies", url: "https://nacca.gov.gh/wp-content/uploads/2019/04/IRS-SHS.pdf", level: "SHS" }
  ]
};

export default function ContentLibrary() {
  const { user } = useAuth();
  const [resources, setResources] = useState<Resource[]>([]);
  const [activeTab, setActiveTab] = useState<'library' | 'curriculum'>('library');
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('All');
  const [selectedLevel, setSelectedLevel] = useState('All');
  const [selectedStrand, setSelectedStrand] = useState('All');
  const [selectedSubStrand, setSelectedSubStrand] = useState('All');
  const [selectedContentCode, setSelectedContentCode] = useState('All');
  const [showFilters, setShowFilters] = useState(false);
  const [filterSubjectSearch, setFilterSubjectSearch] = useState('');
  const [filterStrandSearch, setFilterStrandSearch] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'official' | 'user'>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [viewingResource, setViewingResource] = useState<Resource | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [currLevelFilter, setCurrLevelFilter] = useState('All');

  // Form state
  const [newResource, setNewResource] = useState<{
    title: string;
    description: string;
    subject: string;
    level: string;
    strand: string;
    subStrand: string;
    contentCode: string;
    type: 'link' | 'note' | 'file' | 'book';
    content: string;
  }>({
    title: '',
    description: '',
    subject: subjects[0],
    level: levels[0],
    strand: '',
    subStrand: '',
    contentCode: '',
    type: 'link',
    content: ''
  });

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'resources'),
      where('authorId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const userData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Resource[];

      // Generate all official books
      const allOfficialBooks: Resource[] = [];
      subjects.forEach(subj => {
        if (CURRICULUM_BOOKS[subj]) {
          CURRICULUM_BOOKS[subj].forEach(book => {
            allOfficialBooks.push({
              id: `official-${subj}-${book.title}`,
              authorId: 'system',
              title: book.title,
              description: `Official NaCCA Curriculum document for ${subj} (${book.level}).`,
              subject: subj,
              level: book.level,
              type: 'book',
              content: book.url,
              createdAt: { toDate: () => new Date() }
            });
          });
        }
      });

      setResources([...allOfficialBooks, ...userData]);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSubmitting(true);

    try {
      await addDoc(collection(db, 'resources'), {
        ...newResource,
        authorId: user.uid,
        createdAt: serverTimestamp()
      });
      setShowAddModal(false);
      setNewResource({
        title: '',
        description: '',
        subject: subjects[0],
        level: levels[0],
        strand: '',
        subStrand: '',
        contentCode: '',
        type: 'link',
        content: ''
      });
    } catch (error) {
      console.error("Error adding resource:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (id.startsWith('official-')) {
      alert("Official resources cannot be deleted.");
      return;
    }
    if (!confirm("Are you sure you want to delete this resource?")) return;
    try {
      await deleteDoc(doc(db, 'resources', id));
    } catch (error) {
      console.error("Error deleting resource:", error);
    }
  };

  const subStrandStats = resources
    .filter(r => (selectedSubject === 'All' || r.subject === selectedSubject))
    .reduce((acc, r) => {
      if (r.subStrand) {
        acc[r.subStrand] = (acc[r.subStrand] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

  const availableSubStrands = Object.entries(subStrandStats)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => a.name.localeCompare(b.name));

  const codeStats = resources
    .filter(r => (selectedSubject === 'All' || r.subject === selectedSubject) && (selectedLevel === 'All' || r.level.includes(selectedLevel)))
    .reduce((acc, r) => {
      if (r.contentCode) {
        acc[r.contentCode] = (acc[r.contentCode] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

  const availableCodes = Object.entries(codeStats)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => a.name.localeCompare(b.name));

  const subjectStats = resources.reduce((acc, r) => {
    acc[r.subject] = (acc[r.subject] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const levelStats = resources.reduce((acc, r) => {
    levels.forEach(l => {
      if (r.level.includes(l)) {
        acc[l] = (acc[l] || 0) + 1;
      }
    });
    return acc;
  }, {} as Record<string, number>);

  const filteredResources = resources.filter(res => {
    const searchLower = search.toLowerCase();
    const titleMatch = res.title?.toLowerCase().includes(searchLower);
    const descMatch = res.description?.toLowerCase().includes(searchLower);
    const matchesSearch = !search || titleMatch || descMatch;
    
    const matchesSubject = selectedSubject === 'All' || res.subject === selectedSubject;
    const matchesLevel = selectedLevel === 'All' || (res.level && res.level.includes(selectedLevel));
    const matchesStrand = selectedStrand === 'All' || res.strand === selectedStrand;
    const matchesSubStrand = selectedSubStrand === 'All' || res.subStrand === selectedSubStrand;
    
    const matchesType = 
      filterType === 'all' ? true :
      filterType === 'official' ? res.authorId === 'system' :
      res.authorId !== 'system';

    return matchesSearch && matchesSubject && matchesLevel && matchesType && matchesStrand && matchesSubStrand;
  });

  const getIcon = (type: string, size = 18) => {
    switch (type) {
      case 'link': return <LinkIcon size={size} className="text-blue-500" />;
      case 'file': return <FileText size={size} className="text-emerald-500" />;
      case 'note': return <StickyNote size={size} className="text-amber-500" />;
      case 'book': return <Book size={size} className="text-purple-600" />;
      default: return <FolderOpen size={size} className="text-slate-400" />;
    }
  };

  const isPdf = (url: string) => {
    if (!url) return false;
    return url.toLowerCase().endsWith('.pdf') || url.toLowerCase().includes('.pdf?') || url.includes('nacca.gov.gh/wp-content/uploads');
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 p-4 md:p-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Resource Center</h1>
            <p className="text-slate-500 font-medium">Manage your personal materials and access official NaCCA documents.</p>
          </div>
          <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-100 px-5 py-3 rounded-2xl w-fit group cursor-help relative">
            <div className="w-8 h-8 bg-emerald-600 text-white rounded-xl flex items-center justify-center shadow-lg shadow-emerald-600/20">
              <ShieldCheck size={18} />
            </div>
            <div>
              <p className="text-[9px] font-black uppercase tracking-widest text-emerald-800">GES/NaCCA Compliance</p>
              <p className="text-[9px] font-bold text-emerald-600 uppercase">SBC & CCP Standards V2.0 Active</p>
            </div>
            {/* Tooltip */}
            <div className="absolute top-full mt-2 left-0 w-64 bg-slate-900 text-white p-4 rounded-2xl shadow-2xl opacity-0 group-hover:opacity-100 transition-opacity z-[60] pointer-events-none border border-slate-700">
              <p className="text-[10px] font-bold text-ghana-gold uppercase mb-2">Compliance Certificate</p>
              <p className="text-[10px] leading-relaxed text-slate-300">
                This platform is synchronized with the National Council for Curriculum and Assessment (NaCCA) standards. 
                All generated content follows the Standard-Based Curriculum (B1-B6) and Common Core Programme (B7-B10).
              </p>
            </div>
          </div>
        </div>
        <div className="flex bg-slate-100 p-1.5 rounded-[2rem] self-start md:self-center">
          <button 
            onClick={() => setActiveTab('library')}
            className={cn(
              "px-6 py-3 rounded-full text-xs font-black uppercase tracking-widest transition-all",
              activeTab === 'library' ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
            )}
          >
            My Library
          </button>
          <button 
            onClick={() => setActiveTab('curriculum')}
            className={cn(
              "px-6 py-3 rounded-full text-xs font-black uppercase tracking-widest transition-all",
              activeTab === 'curriculum' ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
            )}
          >
            Official NaCCA
          </button>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="btn-primary flex items-center justify-center gap-2 py-3 px-6"
        >
          <Plus size={20} />
          <span>Add Resource</span>
        </button>
      </div>

      {activeTab === 'library' ? (
        <>
          {/* Search and Filters */}
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1 group">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" size={20} />
              <input 
                type="text" 
                placeholder="Search resources, topics, or NaCCA codes..." 
                className="w-full pl-16 pr-8 py-5 bg-white border border-slate-100 rounded-[2rem] shadow-sm focus:shadow-xl focus:border-emerald-500 outline-none transition-all font-medium text-slate-600"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="flex gap-4">
              <div className="relative">
                <button 
                  onClick={() => setShowFilters(!showFilters)}
                  className={cn(
                    "h-full px-8 py-5 rounded-[2rem] border transition-all flex items-center gap-3 font-black uppercase tracking-widest text-[10px]",
                    showFilters || selectedSubject !== 'All' || selectedLevel !== 'All' || selectedSubStrand !== 'All' || selectedContentCode !== 'All' || filterType !== 'all'
                      ? "bg-slate-900 border-slate-900 text-white shadow-lg"
                      : "bg-white border-slate-100 text-slate-500 hover:border-slate-200"
                  )}
                >
                  <Filter size={18} />
                  Filters
                  {(selectedSubject !== 'All' || selectedLevel !== 'All' || filterType !== 'all') && (
                    <div className="flex items-center gap-1 bg-emerald-500 px-2 py-0.5 rounded-full scale-90">
                      <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                    </div>
                  )}
                </button>

                <AnimatePresence>
                  {showFilters && (
                    <motion.div 
                      initial={{ opacity: 0, y: 20, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 20, scale: 0.98 }}
                      className="absolute right-0 top-full mt-4 w-[320px] md:w-[700px] bg-white rounded-[2.5rem] border border-slate-100 shadow-[0_40px_80px_-16px_rgba(0,0,0,0.12)] z-50 overflow-hidden"
                    >
                      {/* Modal Header */}
                      <div className="p-5 border-b border-slate-50 bg-slate-50/50 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-slate-900 text-white rounded-xl flex items-center justify-center shadow-lg">
                            <Filter size={16} />
                          </div>
                          <div>
                            <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest">Filter Studio</h3>
                            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Refine your library view</p>
                          </div>
                        </div>
                        <button 
                          onClick={() => {
                            setSelectedSubject('All');
                            setSelectedLevel('All');
                            setSelectedSubStrand('All');
                            setSelectedContentCode('All');
                            setFilterType('all');
                            setFilterSubjectSearch('');
                            setFilterStrandSearch('');
                          }}
                          className="px-3 py-1.5 bg-white border border-slate-100 rounded-lg text-[9px] font-black uppercase tracking-widest text-slate-400 hover:text-red-500 hover:border-red-100 transition-all shadow-sm"
                        >
                          Clear All
                        </button>
                      </div>

                      <div className="p-6 space-y-6">
                        {/* Primary Filters Row */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                          {/* Subject Section */}
                          <div className="space-y-3">
                            <div className="flex items-center gap-2">
                              <Book size={14} className="text-emerald-500" />
                              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Subject Area</h4>
                            </div>
                            <div className="relative">
                              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={10} />
                              <input 
                                type="text"
                                placeholder="Search subjects..."
                                className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-100 rounded-xl text-[10px] outline-none focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-bold"
                                value={filterSubjectSearch}
                                onChange={(e) => setFilterSubjectSearch(e.target.value)}
                              />
                            </div>
                            <div className="flex flex-wrap gap-1.5 max-h-[120px] overflow-y-auto pr-1 custom-scrollbar">
                              {['All', ...subjects.filter(s => s.toLowerCase().includes(filterSubjectSearch.toLowerCase()))].map(s => (
                                <button
                                  key={s}
                                  onClick={() => {
                                    setSelectedSubject(s);
                                    setSelectedStrand('All');
                                    setSelectedSubStrand('All');
                                  }}
                                  className={cn(
                                    "px-3 py-1.5 rounded-lg text-[9px] font-black transition-all border flex items-center gap-2",
                                    selectedSubject === s 
                                      ? "bg-emerald-500 border-emerald-500 text-white shadow-md shadow-emerald-500/20" 
                                      : "bg-white border-slate-100 text-slate-500 hover:border-emerald-200 shadow-sm"
                                  )}
                                >
                                  {s.toUpperCase()}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Strand Section */}
                          <div className="space-y-3">
                            <div className="flex items-center gap-2">
                              <Filter size={14} className="text-amber-500" />
                              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">NaCCA Strand</h4>
                            </div>
                            {selectedSubject !== 'All' && SUBJECT_STRANDS[selectedSubject] ? (
                              <div className="flex flex-wrap gap-1.5 max-h-[160px] overflow-y-auto pr-1 custom-scrollbar">
                                {['All', ...SUBJECT_STRANDS[selectedSubject]].map(strand => (
                                  <button
                                    key={strand}
                                    onClick={() => {
                                      setSelectedStrand(strand);
                                      setSelectedSubStrand('All');
                                    }}
                                    className={cn(
                                      "px-3 py-1.5 rounded-lg text-[9px] font-black transition-all border",
                                      selectedStrand === strand 
                                        ? "bg-amber-500 border-amber-500 text-white shadow-md" 
                                        : "bg-white border-slate-100 text-slate-500 hover:border-amber-200 shadow-sm"
                                    )}
                                  >
                                    {strand.toUpperCase()}
                                  </button>
                                ))}
                              </div>
                            ) : (
                              <div className="p-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-center">
                                <p className="text-[9px] font-bold text-slate-400 uppercase leading-relaxed">
                                  {selectedSubject === 'All' ? "SELECT A SUBJECT FIRST" : "NO STRANDS DEFINED"}
                                </p>
                              </div>
                            )}
                          </div>

                          {/* Sub-Strand Section */}
                          <div className="space-y-3">
                            <div className="flex items-center gap-2">
                              <CheckCircle size={14} className="text-blue-500" />
                              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sub-Strand</h4>
                            </div>
                            {selectedStrand !== 'All' && SUBJECT_SUB_STRANDS[selectedStrand] ? (
                              <div className="flex flex-wrap gap-1.5 max-h-[160px] overflow-y-auto pr-1 custom-scrollbar">
                                {['All', ...SUBJECT_SUB_STRANDS[selectedStrand]].map(ss => (
                                  <button
                                    key={ss}
                                    onClick={() => setSelectedSubStrand(ss)}
                                    className={cn(
                                      "px-3 py-1.5 rounded-lg text-[9px] font-black transition-all border",
                                      selectedSubStrand === ss 
                                        ? "bg-blue-500 border-blue-500 text-white shadow-md" 
                                        : "bg-white border-slate-100 text-slate-500 hover:border-blue-200 shadow-sm"
                                    )}
                                  >
                                    {ss.toUpperCase()}
                                  </button>
                                ))}
                              </div>
                            ) : (
                              <div className="p-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-center">
                                <p className="text-[9px] font-bold text-slate-400 uppercase leading-relaxed">
                                  {selectedStrand === 'All' ? "SELECT A STRAND FIRST" : "NO SUB-STRANDS"}
                                </p>
                              </div>
                            )}
                          </div>

                          <div className="space-y-6">
                            {/* Level Section */}
                            <div className="space-y-3">
                              <div className="flex items-center gap-2">
                                <Plus size={14} className="text-slate-500" />
                                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">GES Level</h4>
                              </div>
                              <div className="flex flex-wrap gap-1.5">
                                {['All', ...levels].map(l => (
                                  <button
                                    key={l}
                                    onClick={() => setSelectedLevel(l)}
                                    className={cn(
                                      "px-3 py-1.5 rounded-lg text-[9px] font-black transition-all border",
                                      selectedLevel === l 
                                        ? "bg-slate-900 border-slate-900 text-white shadow-md" 
                                        : "bg-white border-slate-100 text-slate-500 hover:border-slate-300 shadow-sm"
                                    )}
                                  >
                                    {l.toUpperCase()}
                                  </button>
                                ))}
                              </div>
                            </div>

                            <div className="space-y-3 pt-4 border-t border-slate-100">
                               <div className="flex items-center gap-2 mb-2">
                                 <ShieldCheck size={14} className="text-purple-500" />
                                 <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Source</h4>
                               </div>
                               <div className="grid grid-cols-2 gap-2">
                                  {(['official', 'user'] as const).map(type => (
                                    <button
                                      key={type}
                                      onClick={() => setFilterType(filterType === type ? 'all' : type)}
                                      className={cn(
                                        "py-2 rounded-lg text-[8px] font-black uppercase tracking-widest border transition-all",
                                        filterType === type 
                                          ? "bg-slate-900 border-slate-900 text-white shadow-sm" 
                                          : "bg-white border-slate-200 text-slate-400 hover:border-slate-300"
                                      )}
                                    >
                                      {type}
                                    </button>
                                  ))}
                               </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Modal Footer */}
                      <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
                        <button 
                          onClick={() => setShowFilters(false)}
                          className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20 active:scale-95 flex items-center gap-2"
                        >
                          <CheckCircle size={14} />
                          Apply Selection
                        </button>
                      </div>
                    </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="animate-spin text-emerald-600" size={40} />
          <p className="text-slate-400 animate-pulse font-bold">Curating your library...</p>
        </div>
      ) : filteredResources.length === 0 ? (
        <div className="text-center py-20 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
            <FolderOpen size={40} className="text-slate-300" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Your library is empty</h2>
          <p className="text-slate-500 max-w-sm mx-auto mb-8">
            Start adding links, notes, and references to build your teaching repository.
          </p>
          <button 
            onClick={() => setShowAddModal(true)}
            className="btn-secondary py-3 px-8"
          >
            Add Your First Resource
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredResources.map((resource) => (
              <motion.div 
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                key={resource.id}
                className={cn(
                  "p-6 rounded-[2rem] border shadow-sm hover:shadow-xl transition-all group flex flex-col relative overflow-hidden",
                  resource.authorId === 'system' ? "bg-purple-50 border-purple-100" : "bg-white border-slate-100"
                )}
              >
                {resource.authorId === 'system' && (
                  <div className="absolute top-0 right-0 px-4 py-1 bg-purple-600 text-white text-[8px] font-black uppercase tracking-widest rounded-bl-xl">
                    Official Book
                  </div>
                )}
                <div className="flex justify-between items-start mb-4">
                  <div className={cn(
                    "p-3 rounded-2xl transition-colors",
                    resource.authorId === 'system' ? "bg-purple-100" : "bg-slate-50 group-hover:bg-emerald-50"
                  )}>
                    {getIcon(resource.type)}
                  </div>
                  {resource.authorId !== 'system' && (
                    <button 
                      onClick={() => resource.id && handleDelete(resource.id)}
                      className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={cn(
                      "px-2 py-0.5 text-[10px] font-black uppercase tracking-widest rounded",
                      resource.authorId === 'system' ? "bg-purple-200 text-purple-700" : "bg-emerald-100 text-emerald-700"
                    )}>
                      {resource.subject}
                    </span>
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-black uppercase tracking-widest rounded">
                      {resource.level}
                    </span>
                    {resource.strand && (
                      <span className="px-2 py-0.5 bg-amber-50 text-amber-700 text-[9px] font-black uppercase tracking-widest rounded border border-amber-100">
                        {resource.strand}
                      </span>
                    )}
                    {resource.subStrand && (
                      <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-[9px] font-black uppercase tracking-widest rounded border border-blue-100">
                        {resource.subStrand}
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2 leading-tight">
                    {resource.title}
                  </h3>
                  <p className="text-slate-500 text-sm line-clamp-3 mb-6">
                    {resource.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  {(resource.type === 'link' || resource.type === 'book') && !isPdf(resource.content) ? (
                    <a 
                      href={resource.content} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className={cn(
                        "text-sm font-bold flex items-center gap-2 hover:underline",
                        resource.type === 'book' ? "text-purple-700" : "text-emerald-600"
                      )}
                    >
                      {resource.type === 'book' ? 'Open Book' : 'Visit Link'}
                      <ExternalLink size={14} />
                    </a>
                  ) : isPdf(resource.content) ? (
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => setViewingResource(resource)}
                        className="text-emerald-600 text-sm font-bold hover:underline flex items-center gap-2"
                      >
                        Open Viewer
                        <FileText size={14} />
                      </button>
                      <div className="w-1 h-1 bg-slate-200 rounded-full" />
                      <a 
                        href={resource.content}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-amber-600 text-sm font-bold hover:underline flex items-center gap-2"
                      >
                        Download
                        <Download size={14} />
                      </a>
                    </div>
                  ) : (
                    <button 
                      onClick={() => setViewingResource(resource)}
                      className="text-emerald-600 text-sm font-bold hover:underline flex items-center gap-2"
                    >
                      View Details
                    </button>
                  )}
                  <span className="text-[10px] text-slate-400 font-medium">
                    {resource.id?.startsWith('official-') ? 'System Resource' : new Date(resource.createdAt?.toDate()).toLocaleDateString()}
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </>
  ) : (
        <div className="space-y-12">
          {/* Curriculum Search */}
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={24} />
            <input 
              type="text" 
              placeholder="Search curriculum documents..." 
              className="w-full pl-16 pr-8 py-6 bg-white border border-slate-100 rounded-[2.5rem] shadow-xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all font-bold text-lg"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Level Filter for Curriculum */}
          <div className="flex flex-wrap gap-2 pb-4 border-b border-slate-100 justify-center">
            {['All', ...levels].map(level => (
              <button
                key={level}
                onClick={() => setCurrLevelFilter(level)}
                className={cn(
                  "px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border",
                  currLevelFilter === level 
                    ? "bg-slate-900 border-slate-900 text-white shadow-lg" 
                    : "bg-white border-slate-200 text-slate-500 hover:border-emerald-500 hover:text-emerald-600"
                )}
              >
                {level === 'All' ? 'All NaCCA Documents' : `${level} Level`}
              </button>
            ))}
          </div>

          {Object.entries(CURRICULUM_BOOKS).map(([subject, books]) => {
            const searchLower = search.toLowerCase();
            const filteredBooks = books.filter(b => {
              const matchesLevel = currLevelFilter === 'All' || b.level === currLevelFilter;
              const matchesSearch = !search || 
                b.title.toLowerCase().includes(searchLower) || 
                subject.toLowerCase().includes(searchLower);
              return matchesLevel && matchesSearch;
            });

            if (filteredBooks.length === 0) return null;

            return (
              <section key={subject} className="space-y-8">
                <div className="flex items-center gap-4">
                  <div className="h-[2px] flex-1 bg-slate-100" />
                  <h2 className="text-xl font-black text-slate-900 uppercase tracking-tighter flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                      <Book size={18} />
                    </div>
                    {subject} Curriculum
                  </h2>
                  <div className="h-[2px] flex-1 bg-slate-100" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Sub-grouping by Level within Subject could be here, but for now a filtered list is cleaner */}
                  {filteredBooks.map((book, idx) => (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      key={book.title}
                      className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl transition-all group relative overflow-hidden"
                    >
                      {/* Subject Background Accent */}
                      <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50/50 rounded-full blur-3xl -translate-y-12 translate-x-12 group-hover:bg-emerald-100/50 transition-colors" />

                      <div className="flex flex-col md:flex-row justify-between items-start gap-6 relative z-10">
                        <div className="flex-1 space-y-4">
                          <div className="flex items-center gap-3">
                            <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase tracking-widest rounded-lg">
                              {book.level}
                            </span>
                            <div className="w-1 h-1 bg-slate-300 rounded-full" />
                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                              NaCCA Approved
                            </span>
                          </div>
                          
                          <div>
                            <h3 className="text-xl font-black text-slate-900 group-hover:text-emerald-600 transition-colors leading-tight">
                              {book.title}
                            </h3>
                            <p className="text-slate-500 text-sm mt-2 font-medium">
                              Official government curriculum framework for {subject} {book.level === 'Basic' ? 'Primary' : book.level} education.
                            </p>
                          </div>

                          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 group-hover:bg-emerald-50/30 group-hover:border-emerald-100 transition-all">
                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Direct Access Link</label>
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-400">
                                <LinkIcon size={14} />
                              </div>
                              <code className="text-[10px] text-slate-600 break-all font-mono line-clamp-1 flex-1">
                                {book.url}
                              </code>
                              <button 
                                onClick={() => {
                                  navigator.clipboard.writeText(book.url);
                                  // Could add a toast here if available, but for now simple feedback
                                }}
                                className="p-2 hover:bg-white rounded-lg text-slate-400 hover:text-emerald-600 transition-colors"
                                title="Copy Link"
                              >
                                <ExternalLink size={14} />
                              </button>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col gap-3 w-full md:w-auto">
                          <button 
                            onClick={() => setViewingResource({
                              id: `official-${subject}-${book.title}`,
                              authorId: 'system',
                              title: book.title,
                              description: `Official NaCCA Curriculum document for ${subject} (${book.level}).`,
                              subject: subject,
                              level: book.level,
                              type: 'book',
                              content: book.url,
                              createdAt: { toDate: () => new Date() }
                            })}
                            className="w-full md:w-44 py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-slate-900/10"
                          >
                            <ExternalLink size={14} />
                            View Online
                          </button>
                          <a 
                            href={book.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full md:w-44 py-4 bg-emerald-50 text-emerald-700 border-2 border-emerald-100 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-100 hover:border-emerald-200 transition-all flex items-center justify-center gap-2 shadow-sm"
                          >
                            <Download size={14} />
                            Download
                          </a>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      )}

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white w-full max-w-lg rounded-[3rem] shadow-2xl overflow-hidden"
          >
            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-emerald-deep text-white">
              <h2 className="text-2xl font-black">Add New Resource</h2>
              <button 
                onClick={() => setShowAddModal(false)}
                className="w-10 h-10 flex items-center justify-center hover:bg-white/10 rounded-full transition-colors"
              >
                <Plus className="rotate-45" size={28} />
              </button>
            </div>

            <form onSubmit={handleAdd} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Resource Type</label>
                <div className="flex gap-4">
                  {(['link', 'note', 'file', 'book'] as const).map(t => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setNewResource({...newResource, type: t})}
                      className={cn(
                        "flex-1 py-4 rounded-3xl flex flex-col items-center gap-2 border-2 transition-all",
                        newResource.type === t 
                          ? t === 'link' ? "bg-blue-50 border-blue-200 text-blue-700 shadow-lg shadow-blue-900/5 ring-2 ring-blue-500/20" :
                            t === 'note' ? "bg-amber-50 border-amber-200 text-amber-700 shadow-lg shadow-amber-900/5 ring-2 ring-amber-500/20" :
                            t === 'book' ? "bg-purple-50 border-purple-200 text-purple-700 shadow-lg shadow-purple-900/5 ring-2 ring-purple-500/20" :
                            "bg-emerald-50 border-emerald-200 text-emerald-700 shadow-lg shadow-emerald-900/5 ring-2 ring-emerald-500/20"
                          : "bg-white border-slate-100 text-slate-500 hover:border-slate-200"
                      )}
                    >
                      <div className={cn(
                        "p-3 rounded-2xl transition-colors",
                        newResource.type === t
                          ? t === 'link' ? "bg-blue-100" : t === 'note' ? "bg-amber-100" : t === 'book' ? "bg-purple-100" : "bg-emerald-100"
                          : "bg-slate-50"
                      )}>
                        {getIcon(t, 24)}
                      </div>
                      <span className="capitalize text-xs font-black tracking-widest">{t}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest">Subject</label>
                  <select 
                    required
                    value={newResource.subject}
                    onChange={(e) => setNewResource({...newResource, subject: e.target.value, strand: '', subStrand: '', contentCode: ''})}
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none font-bold"
                  >
                    <option value="">Select...</option>
                    {subjects.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest">Level</label>
                  <select 
                    required
                    value={newResource.level}
                    onChange={(e) => setNewResource({...newResource, level: e.target.value})}
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none font-bold"
                  >
                    <option value="">Select...</option>
                    {levels.map(l => <option key={l} value={l}>{l}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest">NaCCA Strand (Optional)</label>
                  {SUBJECT_STRANDS[newResource.subject] ? (
                    <select 
                      value={newResource.strand}
                      onChange={(e) => setNewResource({...newResource, strand: e.target.value, subStrand: '', contentCode: ''})}
                      className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none font-bold"
                    >
                      <option value="">Select Strand...</option>
                      {SUBJECT_STRANDS[newResource.subject].map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  ) : (
                    <input 
                      type="text" 
                      placeholder="e.g., Geometry"
                      value={newResource.strand}
                      onChange={(e) => setNewResource({...newResource, strand: e.target.value})}
                      className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none font-bold"
                    />
                  )}
                </div>
                <div className="space-y-2">
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest">Sub-Strand (Optional)</label>
                  {SUBJECT_SUB_STRANDS[newResource.strand] ? (
                    <select 
                      value={newResource.subStrand}
                      onChange={(e) => setNewResource({...newResource, subStrand: e.target.value, contentCode: ''})}
                      className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none font-bold"
                    >
                      <option value="">Select Sub-Strand...</option>
                      {SUBJECT_SUB_STRANDS[newResource.strand].map(ss => <option key={ss} value={ss}>{ss}</option>)}
                    </select>
                  ) : (
                    <input 
                      type="text" 
                      placeholder="e.g., Fractions"
                      value={newResource.subStrand}
                      onChange={(e) => setNewResource({...newResource, subStrand: e.target.value})}
                      className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none font-bold"
                    />
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest">Resource Title</label>
                <input 
                  required
                  type="text" 
                  placeholder="e.g., Photosynthesis Video"
                  value={newResource.title}
                  onChange={(e) => setNewResource({...newResource, title: e.target.value})}
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest">Description (Optional)</label>
                <textarea 
                  placeholder="What is this resource about?"
                  value={newResource.description}
                  onChange={(e) => setNewResource({...newResource, description: e.target.value})}
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none h-24"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest">
                  {newResource.type === 'link' || newResource.type === 'book' ? 'URL Link' : newResource.type === 'file' ? 'File URL' : 'Notes'}
                </label>
                <textarea 
                  required
                  placeholder={newResource.type === 'link' || newResource.type === 'book' ? "https://..." : "Type your notes here..."}
                  value={newResource.content}
                  onChange={(e) => setNewResource({...newResource, content: e.target.value})}
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none h-32"
                />
              </div>

              <button 
                disabled={submitting}
                className="w-full btn-primary py-4 font-black uppercase tracking-widest text-sm disabled:opacity-50"
              >
                {submitting ? <Loader2 className="animate-spin mx-auto" /> : "Save Resource"}
              </button>
            </form>
          </motion.div>
        </div>
      )}

      {/* View Modal */}
      {viewingResource && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={cn(
              "bg-white w-full rounded-[3rem] shadow-2xl overflow-hidden transition-all duration-500 flex flex-col",
              isPdf(viewingResource.content) ? "max-w-6xl h-[90vh]" : "max-w-2xl h-auto max-h-[80vh]"
            )}
          >
            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-900 text-white shrink-0">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
                  {getIcon(viewingResource.type, 24)}
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400">
                    {viewingResource.authorId === 'system' ? 'Official NaCCA Document' : 'Resource Viewer'}
                  </span>
                  <h2 className="text-xl font-black truncate max-w-[200px] md:max-w-md">{viewingResource.title}</h2>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {isPdf(viewingResource.content) && (
                  <a 
                    href={viewingResource.content}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hidden md:flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-emerald-500/20"
                  >
                    <Download size={16} />
                    Download File
                  </a>
                )}
                <button 
                  onClick={() => setViewingResource(null)}
                  className="w-12 h-12 flex items-center justify-center hover:bg-white/10 rounded-full transition-colors border border-white/10"
                >
                  <Plus className="rotate-45" size={28} />
                </button>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto no-scrollbar">
              <div className="p-8 space-y-8">
                {isPdf(viewingResource.content) && (
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-4">
                    <div className="lg:col-span-2 space-y-6">
                      <div className="flex items-center gap-4">
                        <div className="px-3 py-1 bg-emerald-100 text-emerald-700 font-bold rounded-lg text-[10px] uppercase tracking-widest">
                          {viewingResource.subject}
                        </div>
                        <div className="px-3 py-1 bg-slate-100 text-slate-600 font-bold rounded-lg text-[10px] uppercase tracking-widest">
                          {viewingResource.level}
                        </div>
                        <span className="flex items-center gap-1.5 text-[10px] font-black text-amber-600 uppercase tracking-widest bg-amber-50 px-2 py-1 rounded">
                          <FileText size={12} />
                          Official PDF Archive
                        </span>
                      </div>
                      
                      <div className="p-1 bg-slate-100 rounded-[2.5rem] border border-slate-200 shadow-inner overflow-hidden">
                        <div className="bg-white p-4 border-b border-slate-200 flex items-center justify-between rounded-t-[2.4rem]">
                          <div className="flex items-center gap-2">
                             <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                             <span className="ml-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Interactive Document Preview</span>
                          </div>
                        </div>
                        <div className="bg-slate-200 h-[600px] relative">
                          <iframe 
                            src={`${viewingResource.content}#view=FitH&toolbar=0`}
                            className="w-full h-full border-none"
                            title={viewingResource.title}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <motion.div 
                        initial={{ x: 20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden"
                      >
                        <div className="absolute top-0 right-0 p-8 opacity-10 rotate-12">
                          <Download size={100} />
                        </div>
                        
                        <div className="relative z-10 space-y-6">
                          <div>
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400 mb-2">Dedicated Download Portal</p>
                            <h3 className="text-xl font-black leading-tight border-l-4 border-emerald-500 pl-4">Ready for Export</h3>
                          </div>
                          
                          <p className="text-slate-400 text-xs font-medium leading-relaxed">
                            This document is provided by TeachSmart Ghana's central repository. It has been verified against current NaCCA guidelines.
                          </p>

                          <div className="space-y-3">
                            <a 
                              href={viewingResource.content}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-full flex items-center justify-center gap-3 py-5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl shadow-emerald-500/30 group"
                            >
                              <Download size={20} className="group-hover:translate-y-1 transition-transform" />
                              Download Document Now
                            </a>
                            <p className="text-[9px] text-center text-slate-500 font-bold uppercase tracking-wider">Estimated File Size: ~2.4 MB</p>
                          </div>
                        </div>
                      </motion.div>

                      <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                          <ShieldCheck size={14} className="text-emerald-500" />
                          Security & Compliance
                        </h4>
                        
                        <div className="space-y-4">
                          {[
                            { label: 'NaCCA Alignment', value: 'Verified' },
                            { label: 'Cloud Scan', value: 'Complete' },
                            { label: 'Data Registry', value: 'Public' },
                            { label: 'Access Level', value: 'Teacher' }
                          ].map(stat => (
                            <div key={stat.label} className="flex justify-between items-center pb-3 border-b border-slate-50 last:border-0 last:pb-0">
                              <span className="text-[10px] font-bold text-slate-400 uppercase">{stat.label}</span>
                              <span className="text-[10px] font-black text-slate-900 uppercase">{stat.value}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="bg-amber-50 p-6 rounded-2xl border border-amber-100 text-[10px] text-amber-800 font-medium leading-relaxed italic">
                        Tip: Open the file on your computer using dedicated software like Adobe Reader for full annotation capabilities.
                      </div>
                    </div>
                  </div>
                )}

                {!isPdf(viewingResource.content) && (
                  <div className="space-y-8">
                     <div className="flex items-center gap-4">
                      <div className="px-3 py-1 bg-emerald-100 text-emerald-700 font-bold rounded-lg text-[10px] uppercase tracking-widest">
                        {viewingResource.subject}
                      </div>
                      <div className="px-3 py-1 bg-slate-100 text-slate-600 font-bold rounded-lg text-[10px] uppercase tracking-widest">
                        {viewingResource.level}
                      </div>
                    </div>

                    <div className="bg-white p-12 rounded-[3rem] border border-slate-100 shadow-sm relative overflow-hidden">
                       <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-full blur-3xl -translate-y-12 translate-x-12" />
                       <div className="relative z-10 prose prose-sm max-w-none text-slate-800 whitespace-pre-wrap leading-loose font-medium">
                        {viewingResource.content}
                      </div>
                    </div>
                  </div>
                )}

                <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100">
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <StickyNote size={14} />
                    Teacher's Reference Notes
                  </h3>
                  <p className="text-slate-600 leading-relaxed font-medium">
                    {viewingResource.description || "Official source documentation from the National Council for Curriculum and Assessment (NaCCA) Ghana."}
                  </p>
                </div>

                <div className="flex justify-center md:justify-end pb-8">
                  <button 
                    onClick={() => setViewingResource(null)}
                    className="w-full md:w-auto px-12 py-4 bg-slate-100 text-slate-500 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 transition-colors"
                  >
                    Done Reading
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
