import React from 'react';
import { motion } from 'motion/react';
import { PublicLayout } from './PublicLayout';
import { Calendar, BookOpen, ClipboardCheck, Sparkles, AlertCircle, CheckCircle2, FileSpreadsheet, ArrowRight, Layers, FileDown, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Features: React.FC = () => {
  const navigate = useNavigate();

  const primaryModules = [
    {
      icon: <Layers size={22} className="text-emerald-deep" />,
      title: "Termly Schemes of Learning",
      tag: "NaCCA Coordinated",
      description: "Generate 12-week educational schemes complete with content standards, indicator codes, and resource targets. Distributes curriculum units dynamically over the current term.",
      bullets: [
        "Weeks 1-10 balanced unit allocation",
        "Week 11 revision setups",
        "Week 12 diagnostic terminal testing",
        "Instant indicators code alignment (e.g. B7.1.1.1)"
      ]
    },
    {
      icon: <BookOpen size={22} className="text-amber-600" />,
      title: "Interactive Lesson Notes Creator",
      tag: "100% Learner Centered",
      description: "Quickly prepare lesson notes ready for submission to supervisors. Automatically shapes learning activities into critical thinking milestones and child-friendly starter steps.",
      bullets: [
        "Phase 1 Starters (Play & Prior Knowledge)",
        "Phase 2 Main (Differentiated Student tasks)",
        "Phase 3 Plenary (Reflective evaluation questions)",
        "Supports mixed-ability classroom modifications"
      ]
    },
    {
      icon: <ClipboardCheck size={22} className="text-indigo-600" />,
      title: "Terminal Exams & Diagnostic Banks",
      tag: "Curriculum Aligned",
      description: "Build robust examinations with perfect indicator representation. Never design out-of-scope questions. Supports multiple-choice questions, sub-structured questions, and answer keys.",
      bullets: [
        "Balanced question cognitive distribution",
        "Accompanying answers keys & rubrics",
        "Structured diagnostic pre-testing templates",
        "Easy-to-export printable layout"
      ]
    },
    {
      icon: <FileSpreadsheet size={22} className="text-rose-600" />,
      title: "Student Notes & Resource Packs",
      tag: "Instant Summarizers",
      description: "Give your classroom beautiful summary guidebooks and custom worksheets to study at home. Keeps children on track with digestible lesson cards and practice activities.",
      bullets: [
        "Concise textbook lesson summaries",
        "Playful practice problems for standard groups",
        "Includes regional history and context",
        "Great for offline homework revision packs"
      ]
    }
  ];

  return (
    <PublicLayout>
      {/* Feature Hero banner */}
      <section className="py-16 md:py-24 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 text-center relative">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 border border-amber-150 rounded-full text-[10px] font-black uppercase tracking-wider text-amber-800">
            <Sparkles size={12} className="text-amber-650 animate-pulse" />
            <span>AI Pedagogy Engine</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.1] max-w-4xl mx-auto uppercase">
            Designed Specifically For the <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-emerald-800">
              NaCCA Standards Format
            </span>
          </h1>
          <p className="text-slate-500 text-sm sm:text-lg font-medium max-w-2xl mx-auto leading-relaxed">
            Every feature is hand-crafted to meet the structured expectations of the Ghana Education Service. From early play milestones to advanced secondary streams.
          </p>
        </motion.div>
      </section>

      {/* Main Grid View */}
      <section className="py-12 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          
          <div className="text-center md:text-left mb-12">
            <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest block mb-1">CORE UTILITIES</span>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Four Pillars of Efficient Prep</h2>
            <div className="h-1 w-20 bg-emerald-deep mt-2 rounded-full mx-auto md:mx-0" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {primaryModules.map((mod, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="bg-slate-50 border border-slate-100 p-8 rounded-[2rem] flex flex-col justify-between hover:scale-[1.01] hover:shadow-lg hover:border-slate-150 transition-all"
              >
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-sm">
                      {mod.icon}
                    </div>
                    <span className="px-3 py-1 bg-white border border-slate-200 text-slate-600 text-[9px] font-black uppercase tracking-wider rounded-full">
                      {mod.tag}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight">{mod.title}</h3>
                    <p className="text-xs text-slate-500 font-medium leading-relaxed">{mod.description}</p>
                  </div>

                  {/* Bullet features */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    {mod.bullets.map((bullet, bIdx) => (
                      <div key={bIdx} className="flex items-center gap-2">
                        <CheckCircle2 size={14} className="text-emerald-600 flex-shrink-0" />
                        <span className="text-[10px] text-slate-600 font-bold uppercase tracking-tight">{bullet}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-200/50 mt-6 flex justify-between items-center">
                  <span className="text-[9px] font-black uppercase text-slate-400">Offline & Print Ready</span>
                  <button
                    onClick={() => navigate('/login')}
                    className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-emerald-deep hover:text-emerald-700 transition-colors flex items-center gap-2 group"
                  >
                    <span>Try Tool</span>
                    <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* NaCCA Code Inspector Section */}
      <section className="py-20 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="bg-slate-900 text-white rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative overflow-hidden flex flex-col lg:flex-row items-center gap-12">
          
          <div className="absolute top-0 right-0 w-96 h-96 pointer-events-none opacity-10 bg-gradient-to-b from-emerald-500 to-ghana-gold blur-[100px] rounded-full" />

          <div className="space-y-6 flex-1 text-center lg:text-left">
            <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest block">HOW THE ALIGNMENT WORKS</span>
            <h2 className="text-3xl font-black tracking-tight leading-tight uppercase">
              No More Guessing Indicator Codes or Sub-strand References
            </h2>
            <p className="text-xs text-slate-300 font-medium leading-relaxed max-w-xl">
              Our backend parsing system correlates the official NaCCA learning strands framework automatically based on your entry selection. When you prompt for <em>"JHS 1 Fractions"</em>, TeachSmart fetches correct reference standard <strong>B7.1.1.1</strong> and maps it into corresponding pedagogical steps immediately.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-3 justify-center lg:justify-start">
              <div className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl flex items-center gap-2">
                <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Class Target:</span>
                <span className="text-[10px] font-bold text-white">Kindergarten to SHS</span>
              </div>
              <div className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl flex items-center gap-2">
                <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Export Format:</span>
                <span className="text-[10px] font-bold text-white">PDF / Microsoft Word (.docx)</span>
              </div>
            </div>
          </div>

          <div className="w-full max-w-xs bg-slate-800 border border-slate-700 rounded-2xl p-6 relative shadow-inner space-y-4 text-left flex-shrink-0">
            <div className="flex items-center justify-between border-b border-slate-700 pb-3">
              <span className="text-[8px] font-black uppercase tracking-widest text-slate-400">Auto-Generated Output</span>
              <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-[8px] font-black uppercase rounded">NaCCA B8.2.1-A</span>
            </div>
            
            <div className="space-y-2">
              <div className="text-[9px] font-black text-emerald-400 uppercase tracking-widest">CONTENT STANDARD</div>
              <div className="text-[10px] text-white font-bold leading-relaxed">
                B8.2.1.1 Demonstrate an understanding of algebraic expressions, formulas, and equations.
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-[9px] font-black text-amber-400 uppercase tracking-widest">INDICATOR</div>
              <div className="text-[10px] text-slate-300 font-bold leading-relaxed">
                B8.2.1.1.2 Translate word problems into algebraic equations and formulate equations to represent numeric situations.
              </div>
            </div>
            
            <div className="h-px bg-slate-700" />

            <div className="flex items-center justify-between text-[8px] font-black uppercase text-slate-400">
              <span>Ready for download</span>
              <FileDown size={14} className="text-emerald-400" />
            </div>
          </div>

        </div>
      </section>
    </PublicLayout>
  );
};
