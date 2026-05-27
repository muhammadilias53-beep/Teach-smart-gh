import React from 'react';
import { motion } from 'motion/react';
import { PublicLayout } from './PublicLayout';
import { ShieldCheck, Heart, Award, Users, ArrowRight, BookOpen, MapPin, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const About: React.FC = () => {
  const navigate = useNavigate();

  return (
    <PublicLayout>
      {/* Hero Section */}
      <section className="py-16 md:py-24 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 text-center relative">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 border border-emerald-100/50 rounded-full text-[10px] font-black uppercase tracking-wider text-emerald-800">
            <Sparkles size={12} className="text-emerald-600" />
            <span>Our Pedagogical Vision</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.1] max-w-4xl mx-auto">
            Supporting the Noble Mission of <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-deep to-emerald-600">
              Ghanaian Educators
            </span>
          </h1>
          <p className="text-slate-500 text-sm sm:text-lg font-medium max-w-2xl mx-auto leading-relaxed">
            TeachSmart Ghana is an advanced pedagogical system co-designed alongside experienced regional teachers, supervisors, and lesson planning mentors.
          </p>
        </motion.div>
      </section>

      {/* Origin Story Grid */}
      <section className="py-12 bg-white border-y border-slate-100 relative">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Story Text */}
            <div className="space-y-6">
              <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest block">HOW WE STARTED</span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight uppercase">
                Bridging the Gap Between Curricula Rules & High Paperwork Workloads
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed">
                When the National Council for Curriculum and Assessment (<strong>NaCCA</strong>) introduced the standard learner-centered curriculum, it brought an incredibly positive shift to student participation and competency development across Ghana.
              </p>
              <p className="text-slate-600 text-sm leading-relaxed">
                However, listing indicators, strand codes, and detailed differentiation levels created hours of weekly template coordination for teachers, taking away valuable time from actual interactive classroom lessons.
              </p>
              <p className="text-slate-600 text-sm leading-relaxed font-semibold italic text-emerald-800">
                "Our single objective is to take the strenuous template compliance off the educator's shoulders, while ensuring their output remains 100% compliant with GES and NaCCA requirements."
              </p>
              
              <div className="flex gap-4 pt-2">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-ghana-red animate-pulse" />
                  <span className="text-[9px] font-black uppercase text-slate-500 tracking-wider">Accra</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-ghana-gold animate-pulse" />
                  <span className="text-[9px] font-black uppercase text-slate-500 tracking-wider">Kumasi</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[9px] font-black uppercase text-slate-500 tracking-wider">Tamale</span>
                </div>
              </div>
            </div>

            {/* Core Values Bento Layout */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 flex flex-col gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-100/60 flex items-center justify-center text-emerald-700">
                  <ShieldCheck size={20} />
                </div>
                <h3 className="font-extrabold text-sm text-slate-800 uppercase tracking-tight">100% Trust & Compliance</h3>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">
                  Every scheme generated aligns with standardized quarterly week divisions, correct content strand structures, and performance assessment codes.
                </p>
              </div>

              <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 flex flex-col gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-100/60 flex items-center justify-center text-amber-700">
                  <Heart size={20} />
                </div>
                <h3 className="font-extrabold text-sm text-slate-800 uppercase tracking-tight">Teacher-First Interface</h3>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">
                  Engineered to work on standard mobile devices, low bandwidth, and supports offline formats ready to print right from your device.
                </p>
              </div>

              <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 flex flex-col gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-100/60 flex items-center justify-center text-indigo-700">
                  <Users size={20} />
                </div>
                <h3 className="font-extrabold text-sm text-slate-800 uppercase tracking-tight">Inclusive Learning</h3>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">
                  Supports differentiation options for fast-paced and struggling learners alike, focusing on child-friendly classroom setups.
                </p>
              </div>

              <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 flex flex-col gap-3">
                <div className="w-10 h-10 rounded-2xl bg-rose-100/60 flex items-center justify-center text-rose-700">
                  <Award size={20} />
                </div>
                <h3 className="font-extrabold text-sm text-slate-800 uppercase tracking-tight">Competency Driven</h3>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">
                  Integrates core competencies like critical thinking, digital literacy, and cultural identity directly into visual lesson layouts.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Regional Focus Highlights */}
      <section className="py-16 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 text-center">
        <div className="max-w-3xl mx-auto space-y-6">
          <MapPin size={36} className="text-emerald-deep mx-auto animate-bounce" />
          <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase">
            Built For All Ghanaian School Streams
          </h2>
          <p className="text-sm text-slate-500 font-semibold leading-relaxed">
            Whether preparing terminal questions for senior schools in Cape Coast, early play-based plans for primary schools in Tamale, or math worksheets for JHS streams in central Accra, TeachSmart Ghana is fine-tuned to your specific academic environment.
          </p>
          
          <button
            onClick={() => navigate('/login')}
            className="inline-flex items-center gap-2.5 px-6 py-3.5 bg-slate-900 text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-md hover:bg-emerald-deep shadow-slate-950/10 transition-all group"
          >
            <span>Launch Free Teacher Profile</span>
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </section>
    </PublicLayout>
  );
};
