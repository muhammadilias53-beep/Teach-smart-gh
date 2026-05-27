import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PublicLayout } from './PublicLayout';
import { Search, Filter, BookOpen, Clock, Heart, Share2, Printer, X, Download, FileText, ArrowRight, Eye, Bookmark, Sparkles, AlertCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface Article {
  id: string;
  title: string;
  category: 'Preparation' | 'Activities' | 'Pedagogy' | 'GES Updates';
  readTime: string;
  summary: string;
  content: string;
  date: string;
  tags: string[];
}

export const BlogResources: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeArticle, setActiveArticle] = useState<Article | null>(null);
  const [bookmarks, setBookmarks] = useState<string[]>([]);

  // Load bookmarks on mount
  useEffect(() => {
    const saved = localStorage.getItem('ts_blog_bookmarks');
    if (saved) {
      setBookmarks(JSON.parse(saved));
    }
  }, []);

  const toggleBookmark = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    let updated;
    if (bookmarks.includes(id)) {
      updated = bookmarks.filter(item => item !== id);
      toast.success('Removed from your saved articles');
    } else {
      updated = [...bookmarks, id];
      toast.success('Bookmarked to saved articles!');
    }
    setBookmarks(updated);
    localStorage.setItem('ts_blog_bookmarks', JSON.stringify(updated));
  };

  const handleShare = (title: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(window.location.href);
    toast.success(`Copied link for "${title}" to clipboard!`);
  };

  const articles: Article[] = [
    {
      id: 'play-based-starters',
      title: 'Mastering the Play-Grade: Play-Based Starters in Primary Classrooms',
      category: 'Activities',
      readTime: '6 min read',
      date: 'May 20, 2026',
      tags: ['Kindergarten', 'Primary', 'Activities'],
      summary: 'Ditch the monotonous copying exercises. Let’s explore how to initiate mathematics and science lessons using traditional Ghanaian classroom games (Akrontô and Sansanhroma) to activate children’s natural curiosity.',
      content: `### 1. The Power of Play-Based Openers

According to NaCCA early instructional parameters, learning must start from the child's proximate environment. Traditional rote openers like *"Look at the board and keep quiet"* cause young minds to disengage immediately. 

Integrating local play models builds an emotional bridge into the academic lesson topic, promoting standard core variables including physical coordination, communication, and visual sequencing.

---

### 2. Practical Classroom Opener: Akrontô (Addition Match)

*   **Target Level:** Kindergarten to Primary 3
*   **Ideal Subjects:** Mathematics, Science, Our World Our People
*   **The Setup:** Arrange the students in a circle. Draw small simple target points on the classroom floor using colored chalk. Give children pebbles (local resources).
*   **The Game Action:** Call out a basic arithmetic challenge (e.g., *"Make 5!"*). Children must roll pebbles into designated chalk targets whose sum meets the call.
*   **Pedagogical Hook:** Instantly connects mechanical calculations to spatial perception, triggering high-spirited participation right before transiting to formal chalk-board instruction.

---

### 3. Transitioning Play to Paperwork

Don't let the play stand alone. Immediately following the starter activity, execute the transition prompt:
*"Today our pebbles helped us combine quantities under standard addition. Let's look at how we denote this with Content Indicator standard symbols on our notes."*

This allows for effective continuous feedback without exhausting teaching intervals.`
    },
    {
      id: 'nacca-indicator-codes',
      title: 'De-mystifying NaCCA Indicator Codes: A Quick Practical Guide for Teachers',
      category: 'Preparation',
      readTime: '8 min read',
      date: 'May 15, 2026',
      tags: ['Curriculum', 'Syllabus', 'GES'],
      summary: 'Don’t let the complex letter-number codes overwhelm your lesson notes. This article walks you through parsing codes like B8.2.1.1.2 step-by-step so your schemes look professional.',
      content: `### 1. Decoding standard NaCCA Aligned Keys

Every lesson note submitted to a headteacher or district supervisor requires code inclusion. Understanding the anatomy of a NaCCA key avoids stressful dictionary lookups.

Let's dissect: **B7.1.1.1.2**

*   **B7 (Class / Level):** Indicates **Basic 7 (JHS 1)**. (B1 is Primary 1, KG1 is Kindergarten 1, SHS1 was standard High School 1).
*   **1 (Strand number):** For example, *Strand 1: Number Systems* or *Strand 1: Writing and Composition*.
*   **1 (Sub-Strand number):** Represents subsections, like *Sub-strand 1: Fractions* or *Sub-strand 1: Creative Writing*.
*   **1 (Content Standard index):** The official pedagogical goal defined for the year.
*   **2 (Indicator index):** The specific lesson objective or student task.

---

### 2. Checklist for Bullet-proof Compliance
1.  Verify the level matches your designated terminal class stream exactly.
2.  Never invent custom indicators. Standard codes must translate directly back to NaCCA syllabus checklists.
3.  Cross-reference lesson activities to reinforce the specific verbs in the indicator (e.g., if the code says *"Formulate algebraic formulas"*, your activity should involve students formulating formulas, not merely copying existing ones).`
    },
    {
      id: 'struggling-learners-math',
      title: 'Inclusive Classrooms: 5 Realistic Differentiation Activities for Struggling Learners',
      category: 'Pedagogy',
      readTime: '10 min read',
      date: 'May 10, 2026',
      tags: ['Differentiation', 'Mathematics', 'Inclusion'],
      summary: 'Providing "extra exercises" isn’t true differentiation. Discover five practical methods to structure mixed-ability groups in mathematics class using local resources like coconut kernels and marketplace roleplay.',
      content: `### 1. Re-defining the Inclusive African Classroom

Ghanaian classrooms are beautiful, diverse, and vibrant—comprising fast learners, tactile learners, and students needing extra, personalized patience. 

True differentiation targets multiple pathways block-by-block. Instead of writing separate lesson plans, use a single plan featuring adjustable scaffolding tiers.

---

### 2. Five Practical Classroom Modifications

#### A. The Marketplace Roleplay (Tactile Support)
Set up a mini-market stall using standard local empty cans and cardboard packages. Tactile learners manipulate physical paper coins to grasp change and subtraction algorithms, while faster learners calculate profit percentages.

#### B. Coconut Kernel Arrays (Grid Scaffolding)
To build multiplication understanding, use physical local seeds or coconut shells placed into rectangular rows. The physical arrangement builds geometric spacing intuition.

#### C. Peer-Assisted Duet Groups
Pair stronger learners as *"Class Assistant Leaders"* with children desiring support. Keeps the learning environment cooperative, friendly, and non-threatening.

#### D. The Three-Sentence Summary Card
Allow children whose literacy levels are still building in English to illustrate mathematical processes with diagrams, or summarize standard reasoning in their native local dialogue (like Twi, Ga, or Ewe) during Phase 3 Plenary stages.

#### E. Adjusted Assessment Intervals
Permit struggling assessment students to work through 3 focused questions thoroughly, rather than rushing through 10 exercises stressfully.`
    },
    {
      id: 'terminal-exam-blueprints',
      title: 'Continuous Assessment Prep: Moving Beyond Traditional Rote Learning',
      category: 'GES Updates',
      readTime: '7 min read',
      date: 'May 02, 2026',
      tags: ['Assessments', 'Exams', 'GES'],
      summary: 'With school evaluations moving towards diagnostic continuous evaluation (SBA), learn how to balance multiple-choice recall tests with competency-based assessments that measure critical thinking and communication.',
      content: `### 1. Rethinking the Terminal Exam

Under prior GES metrics, student progress was heavily decided by single-shot rote terminal testing. Today's NaCCA framework shifts focus onto formative and continuous classroom progress.

Continuous assessment acts as a diagnostic mirror for both the child and the educator, reflecting comprehension trends in real time.

---

### 2. Incorporating Competency Assessment Into Exams
*   **Rote Question (Old):** *"Name three types of soil in Ghana."*
*   **Competency-Based Question (New):** *"Imagine a farmer in Kumasi wants to grow crops but has sandy soil. Explain what problems they will face, and suggest two organic improvements."*

By phrasing questions as practical problem setups, we prompt children to activate critical thinking, connection to local settings, and written expression.`
    }
  ];

  const categories = ['All', 'Preparation', 'Activities', 'Pedagogy', 'GES Updates'];

  const filteredArticles = articles.filter(art => {
    const matchesSearch = art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          art.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          art.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'All' || art.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const downloadTemplate = (title: string) => {
    toast.success(`Preparing your professional "${title}" download template. Aligned with NaCCA.`);
  };

  return (
    <PublicLayout>
      {/* Blog & Resources Header */}
      <section className="py-16 md:py-20 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 text-center relative">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 border border-emerald-100/50 rounded-full text-[10px] font-black uppercase tracking-wider text-emerald-800">
            <BookOpen size={12} className="text-emerald-600" />
            <span>Digital Document Hub</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.1] max-w-4xl mx-auto uppercase">
            Teacher Guides & <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-deep to-emerald-600">
              Printable Templates
            </span>
          </h1>
          <p className="text-slate-500 text-sm sm:text-base font-semibold max-w-2xl mx-auto leading-relaxed">
            Boost your professional knowledge under the national syllabus. Read standard guides written by Ghana’s pedagogical experts and download reusable templates for free.
          </p>
        </div>
      </section>

      {/* Main Hub Search and layout */}
      <section className="py-12 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          
          {/* Search, Filter Block */}
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-10 pb-6 border-b border-slate-150">
            
            {/* Search Bar */}
            <div className="relative w-full md:w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="Search resources, topics, grades..."
                className="w-full pl-12 pr-6 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-deep/20 focus:border-emerald-deep transition-all text-xs font-bold uppercase tracking-widest outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Category selection pill clusters */}
            <div className="flex flex-wrap gap-2 items-center justify-center">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-[9px] sm:text-[10px] font-black uppercase tracking-wider transition-all border ${
                    selectedCategory === cat
                      ? 'bg-emerald-deep border-emerald-deep text-white shadow-md shadow-emerald-900/15'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left/Middle Column: Filtered Article feed */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.34em]">Expert Guidebook Articles</h2>
                <span className="text-[10px] font-bold text-slate-400">{filteredArticles.length} results</span>
              </div>

              {filteredArticles.length === 0 ? (
                <div className="bg-slate-50 border border-slate-150 rounded-2xl p-12 text-center text-slate-500">
                  <AlertCircle size={32} className="mx-auto text-slate-400 mb-2 animate-pulse" />
                  <p className="text-sm font-semibold">No resource guides match your query at this moment.</p>
                  <p className="text-xs text-slate-400 mt-1">Try resetting the filters or tweaking your search terms.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {filteredArticles.map((art) => (
                    <div
                      key={art.id}
                      onClick={() => setActiveArticle(art)}
                      className="group bg-white border border-slate-150 rounded-[2rem] p-6 sm:p-8 hover:shadow-xl hover:border-slate-300 transition-all cursor-pointer relative"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                        <span className="px-2.5 py-1 bg-emerald-50 border border-emerald-100 text-[9px] font-black uppercase tracking-wider text-emerald-800 rounded-full">
                          {art.category}
                        </span>
                        <div className="flex items-center gap-3 text-slate-400 text-xs font-semibold">
                          <span className="flex items-center gap-1">
                            <Clock size={12} />
                            {art.readTime}
                          </span>
                        </div>
                      </div>

                      <h3 className="text-lg sm:text-xl font-black text-slate-900 group-hover:text-emerald-deep uppercase tracking-tight transition-colors mb-3 leading-tight">
                        {art.title}
                      </h3>
                      
                      <p className="text-slate-500 text-xs sm:text-sm leading-relaxed mb-6 font-medium">
                        {art.summary}
                      </p>

                      <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-100">
                        <div className="flex flex-wrap gap-1.5">
                          {art.tags.map(t => (
                            <span key={t} className="text-[8px] font-extrabold text-slate-400 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded">
                              #{t.toUpperCase()}
                            </span>
                          ))}
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <button
                            onClick={(e) => toggleBookmark(art.id, e)}
                            className="p-2 bg-slate-50 hover:bg-rose-50 border border-slate-200 hover:border-rose-200 rounded-xl text-slate-400 hover:text-rose-600 transition-colors"
                            title="Save Article"
                          >
                            <Bookmark size={14} className={bookmarks.includes(art.id) ? 'fill-rose-600 text-rose-600' : ''} />
                          </button>
                          <button
                            onClick={(e) => handleShare(art.title, e)}
                            className="p-2 bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-200 rounded-xl text-slate-400 hover:text-emerald-deep transition-colors"
                            title="Copy link"
                          >
                            <Share2 size={14} />
                          </button>
                          <span className="text-[10px] font-black uppercase tracking-wider text-emerald-deep flex items-center gap-1 group-hover:translate-x-0.5 transition-transform ml-2">
                            <span>Read Article</span>
                            <ArrowRight size={12} />
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right Side Column: Free Printable Document Templates */}
            <div className="space-y-6">
              <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.34em]">Ghana Classroom Materials</h2>
              
              <div className="bg-slate-50 border border-slate-150 rounded-[2rem] p-6 space-y-6">
                
                <div className="bg-white p-4 rounded-2xl border border-slate-100 flex items-start gap-3">
                  <div className="p-2 bg-emerald-50 rounded-xl text-emerald-700 flex-shrink-0">
                    <FileText size={18} />
                  </div>
                  <div className="space-y-1 flex-1">
                    <h4 className="text-xs font-black text-slate-800 uppercase tracking-tight">Free Lesson Note Blank Template</h4>
                    <p className="text-[10px] text-slate-455 font-medium leading-normal">Fully NaCCA columnized format ready for custom notes entry.</p>
                    <button
                      onClick={() => downloadTemplate('Blank Lesson Notes PDF')}
                      className="text-[9px] font-black text-emerald-deep uppercase tracking-wider flex items-center gap-1 hover:text-emerald-700 mt-2"
                    >
                      <span>Download PDF</span>
                      <Download size={10} />
                    </button>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-slate-100 flex items-start gap-3">
                  <div className="p-2 bg-amber-50 rounded-xl text-amber-700 flex-shrink-0">
                    <FileText size={18} />
                  </div>
                  <div className="space-y-1 flex-1">
                    <h4 className="text-xs font-black text-slate-800 uppercase tracking-tight">Terminal Exam Blueprint Template</h4>
                    <p className="text-[10px] text-slate-455 font-medium leading-normal">Cognitive weighting planning sheet under standardized GES syllabus rules.</p>
                    <button
                      onClick={() => downloadTemplate('Exam Blueprint Word Document')}
                      className="text-[9px] font-black text-emerald-deep uppercase tracking-wider flex items-center gap-1 hover:text-emerald-700 mt-2"
                    >
                      <span>Download DOCX</span>
                      <Download size={10} />
                    </button>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-slate-100 flex items-start gap-3">
                  <div className="p-2 bg-rose-50 rounded-xl text-rose-700 flex-shrink-0">
                    <FileText size={18} />
                  </div>
                  <div className="space-y-1 flex-1">
                    <h4 className="text-xs font-black text-slate-800 uppercase tracking-tight">Weekly Assessment Checklist</h4>
                    <p className="text-[10px] text-slate-455 font-medium leading-normal">Check syllabus indicators and tracking continuous evaluation points.</p>
                    <button
                      onClick={() => downloadTemplate('Assessment Checklist Sheet')}
                      className="text-[9px] font-black text-emerald-deep uppercase tracking-wider flex items-center gap-1 hover:text-emerald-700 mt-2"
                    >
                      <span>Download PDF</span>
                      <Download size={10} />
                    </button>
                  </div>
                </div>

              </div>
              
              {/* Ghana Education Info Banner */}
              <div className="bg-slate-900 text-white rounded-[2rem] p-6 space-y-4">
                <span className="text-[8px] font-extrabold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded uppercase tracking-widest leading-none">PEDAGOGICAL STANDARD</span>
                <p className="text-xs leading-relaxed font-semibold">
                  "The primary goal of the play-based format is targeting child-centered confidence. Encourage children to manipulate physical items, relate terms to their families, and value regional histories."
                </p>
                <div className="h-px bg-slate-800" />
                <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block">- NaCCA Primary Syllabi Manual</span>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* Immersive Modal Article Reader Drawer */}
      <AnimatePresence>
        {activeArticle && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 selection:bg-emerald-500 selection:text-white"
            onClick={() => setActiveArticle(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="bg-white rounded-[2.5rem] border border-slate-200 max-w-3xl w-full max-h-[85vh] flex flex-col justify-between overflow-hidden shadow-2xl relative"
              onClick={e => e.stopPropagation()}
            >
              {/* Header Gradient line */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-ghana-red via-ghana-gold to-ghana-green" />

              {/* Drawer Top */}
              <div className="px-8 pt-8 pb-4 border-b border-slate-100 flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-0.5 bg-emerald-50 border border-emerald-100 text-[8px] font-black uppercase tracking-wider text-emerald-800 rounded">
                      {activeArticle.category}
                    </span>
                    <span className="text-slate-400 text-[10px] font-semibold flex items-center gap-1">
                      <Clock size={10} />
                      {activeArticle.readTime}
                    </span>
                  </div>
                  <h3 className="text-md sm:text-xl font-black text-slate-900 uppercase tracking-tight leading-snug">
                    {activeArticle.title}
                  </h3>
                </div>
                <button
                  onClick={() => setActiveArticle(null)}
                  className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 border border-slate-200 rounded-full transition-colors flex-shrink-0 ml-4"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Drawer Scrollable Content */}
              <div className="px-8 py-6 overflow-y-auto flex-grow prose max-w-none text-slate-600 text-sm leading-relaxed whitespace-pre-line bg-gradient-to-b from-white to-slate-50/50">
                <div className="article-rendered-markdown">
                  {/* Since content has simple markdown headings, render gracefully */}
                  {activeArticle.content}
                </div>
              </div>

              {/* Drawer Actions Footer */}
              <div className="px-8 py-5 border-t border-slate-100 bg-white flex flex-wrap items-center justify-between gap-4">
                <span className="text-[9px] font-black uppercase text-slate-400">Written by TeachSmart Ghana Pedagogy Team</span>
                
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      window.print();
                    }}
                    className="px-4 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-slate-600 hover:text-slate-800 text-[10px] font-black uppercase tracking-widest transition-colors flex items-center gap-1.5"
                  >
                    <Printer size={12} />
                    <span>Print</span>
                  </button>
                  <button
                    onClick={() => setActiveArticle(null)}
                    className="px-5 py-2.5 bg-emerald-deep hover:bg-emerald-700 rounded-xl text-white text-[10px] font-black uppercase tracking-widest transition-all shadow-md shadow-emerald-950/10"
                  >
                    Close Reader
                  </button>
                </div>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </PublicLayout>
  );
};
