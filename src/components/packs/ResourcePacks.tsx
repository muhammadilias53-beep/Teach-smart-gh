import React, { useState } from 'react';
import { 
  Users, 
  GraduationCap, 
  Sparkles, 
  FileText, 
  BookOpen, 
  Clock, 
  CheckCircle, 
  ChevronRight,
  Download,
  Share2,
  Bookmark,
  Printer,
  Laptop,
  Loader2,
  X,
  Copy,
  History,
  Mail
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../lib/utils';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-hot-toast';
import { db } from '../../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { generateAIPackResource } from '../../lib/gemini';
import { SafeMarkdown } from '../common/SafeMarkdown';
import 'highlight.js/styles/github.css';

type PackType = 'teacher' | 'student';

interface ResourceAction {
  title: string;
  desc: string;
  icon: any;
  color: string;
  actionLabel: string;
  prompt: string;
}

export default function ResourcePacks() {
  const [activeTab, setActiveTab] = useState<PackType>('teacher');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [currentResource, setCurrentResource] = useState<string | null>(null);
  const [customPrompt, setCustomPrompt] = useState('');
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const { user, profile } = useAuth();

  const teacherResources: ResourceAction[] = [
    {
      title: "NaCCA Assessment Rubrics",
      desc: "Standardized grading sheets and assessment criteria aligned with current NaCCA standards.",
      icon: CheckCircle,
      color: "bg-ghana-red",
      actionLabel: "Generate Lesson Plan Examples",
      prompt: "Generate 3 detailed examples of how to apply NaCCA assessment rubrics in lesson plans for various subjects. Focus on the core competencies and performance indicators as per the Ghanaian curriculum."
    },
    {
      title: "Instructional Support Manual",
      desc: "Deep-dive teaching methods and pedagogical support for complex subjects in the Ghanaian curriculum.",
      icon: BookOpen,
      color: "bg-ghana-gold",
      actionLabel: "Generate Practice Problems",
      prompt: "Generate a set of 10 challenging practice problems for subjects like Mathematics and Integrated Science, designed to prepare students for NaCCA-aligned school assessments."
    },
    {
      title: "Classroom Management Guide",
      desc: "Evidence-based strategies for managing classroom dynamics and promoting inclusive learning.",
      icon: Users,
      color: "bg-emerald-500",
      actionLabel: "Create Management Strategy",
      prompt: "Create a 5-step classroom management strategy tailored for Ghanaian public schools with large class sizes, focuses on positive reinforcement and student engagement."
    },
    {
      title: "Specialized Material Pro",
      desc: "Need something specific? Describe exactly what you want (e.g. 'Generate a differentiated worksheet on fractions for JHS 2 students').",
      icon: Sparkles,
      color: "bg-indigo-600",
      actionLabel: "Generate Material",
      prompt: "",
      isCustom: true
    }
  ] as (ResourceAction & { isCustom?: boolean })[];

  const studentResources: ResourceAction[] = [
    {
      title: "BECE Past Questions (2020 - Date)",
      desc: "Comprehensive collection of past BECE questions for all JHS subjects from 2020 to today, with detailed diagram descriptions.",
      icon: History,
      color: "bg-ghana-red",
      actionLabel: "Generate Sample Questions",
      prompt: "Generate a sample set of 20 practice questions modeled after BECE patterns since 2020. IMPORTANT: Include at least 5 practical-based questions with clear, detailed descriptions of diagrams and identification labels as per WAEC Science/Practical standards."
    },
    {
      title: "NaCCA Learner Study Guides",
      desc: "Simplified study materials with illustrative diagram descriptions aligned with new NaCCA standards.",
      icon: GraduationCap,
      color: "bg-indigo-500",
      actionLabel: "Generate Summary Notes",
      prompt: "Generate concise summary notes for the NaCCA JHS curriculum. Include illustrative diagram descriptions for complex concepts in Science and Mathematics, with clear labeling placeholders."
    },
    {
      title: "Interactive Revision Hub",
      desc: "AI-powered flashcards and rapid-fire quiz questions for effective exam preparation.",
      icon: Sparkles,
      color: "bg-amber-500",
      actionLabel: "Launch Sample Flashcards",
      prompt: "Generate a set of 15 rapid-fire revision flashcards for core BECE subjects to test memory and recall."
    }
  ];

  const cleanMarkdown = (content: string) => {
    if (!content) return "";
    
    let cleaned = content.trim();
    
    // Repair unclosed code blocks
    const backtickCount = (cleaned.match(/```/g) || []).length;
    if (backtickCount % 2 !== 0) {
      cleaned += "\n```";
    }
    
    // Repair common header issues (ensure space after #)
    cleaned = cleaned.replace(/^(#+)([A-Za-z])/gm, '$1 $2');
    
    // Ensure tables have a closing newline if they seem cut off
    if (cleaned.includes('|') && !cleaned.endsWith('\n')) {
      cleaned += '\n';
    }

    return cleaned;
  };

  const copyToClipboard = () => {
    if (generatedContent) {
      navigator.clipboard.writeText(generatedContent);
      toast.success("Content copied to clipboard!");
    }
  };

  const handleShare = async () => {
    if (!generatedContent) return;
    
    const shareData = {
      title: `TeachSmart Resource: ${currentResource}`,
      text: generatedContent,
      url: window.location.href
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          console.error('Error sharing:', err);
          toast.error("Failed to share");
        }
      }
    } else {
      // Fallback: Copy to clipboard and open email
      copyToClipboard();
      const mailtoLink = `mailto:?subject=${encodeURIComponent(`TeachSmart Resource: ${currentResource}`)}&body=${encodeURIComponent(generatedContent)}`;
      window.open(mailtoLink, '_blank');
      toast.success("Content copied! Opening email client...");
    }
  };

  const handleAction = async (resource: ResourceAction) => {
    setIsGenerating(true);
    setCurrentResource(resource.title);
    setGeneratedContent(null);
    setIsSaved(false);
    
    try {
      const content = await generateAIPackResource(activeTab, resource.title, resource.prompt);
      
      if (!content || content.length < 10) {
        throw new Error("Empty or too short content received from AI");
      }
      
      const cleanedContent = cleanMarkdown(content);
      setGeneratedContent(cleanedContent);
      setShowModal(true);
    } catch (error) {
      console.error("Failed to generate resource:", error);
      
      let errorMessage = "Failed to generate content. Please try again.";
      if (error instanceof Error) {
        if (error.message.includes("quota")) {
          errorMessage = "AI generation quota exceeded. Please try again later.";
        } else if (error.message.includes("Empty")) {
          errorMessage = "The AI returned an empty response. Please try clicking generate again.";
        }
      }
      
      toast.error(errorMessage);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveToDashboard = async () => {
    if (!user || !generatedContent) {
      toast.error("Please sign in to save resources");
      return;
    }

    setIsSaving(true);
    try {
      await addDoc(collection(db, 'saved_resources'), {
        userId: user.uid,
        title: currentResource || 'Untitled Resource',
        content: generatedContent,
        type: activeTab,
        category: 'Resource Pack',
        createdAt: serverTimestamp()
      });

      setIsSaved(true);
      toast.success("Resource saved to your dashboard!");
    } catch (error) {
      console.error("Error saving resource:", error);
      toast.error("Failed to save resource");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase mb-4">
          NaCCA Resource <span className="text-emerald-deep">Packs</span>
        </h1>
        <p className="text-slate-500 max-w-2xl font-medium leading-relaxed">
          Access specialized collections of AI-powered resources designed specifically for the Ghanaian educational landscape, aligned with NaCCA standards.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex p-1.5 bg-slate-100 rounded-2xl mb-12 w-fit">
        <button
          onClick={() => setActiveTab('teacher')}
          className={cn(
            "flex items-center gap-2 px-8 py-3.5 rounded-xl text-sm font-black uppercase tracking-widest transition-all",
            activeTab === 'teacher' 
              ? "bg-white text-ghana-red shadow-lg text-slate-900 border border-ghana-red/10" 
              : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
          )}
        >
          <Users size={18} />
          <span>Teacher Pack</span>
        </button>
        <button
          onClick={() => setActiveTab('student')}
          className={cn(
            "flex items-center gap-2 px-8 py-3.5 rounded-xl text-sm font-black uppercase tracking-widest transition-all",
            activeTab === 'student' 
              ? "bg-white text-indigo-600 shadow-lg text-slate-900 border border-indigo-600/10" 
              : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
          )}
        >
          <GraduationCap size={18} />
          <span>Students Pack</span>
        </button>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnimatePresence mode="wait">
          {(activeTab === 'teacher' ? teacherResources : studentResources as (ResourceAction & { isCustom?: boolean })[]).map((resource: ResourceAction & { isCustom?: boolean }, idx) => (
            <motion.div
              key={resource.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: idx * 0.1 }}
              className="group relative bg-white rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500 p-8 flex flex-col h-full overflow-hidden"
            >
              <div className={cn(
                "w-16 h-16 rounded-2xl flex items-center justify-center text-white mb-8 shadow-lg transform group-hover:rotate-6 transition-transform duration-500",
                resource.color
              )}>
                <resource.icon size={28} />
              </div>

              <h3 className="text-xl font-black text-slate-900 mb-4 uppercase tracking-tight group-hover:text-emerald-deep transition-colors">
                {resource.title}
              </h3>
              
              <p className="text-slate-500 text-sm font-medium leading-relaxed mb-10 flex-grow">
                {resource.desc}
              </p>

              {resource.isCustom && (
                <div className="mb-6 space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Describe what you need</label>
                  <textarea 
                    value={customPrompt}
                    onChange={(e) => setCustomPrompt(e.target.value)}
                    placeholder="e.g. Generate a science worksheet for B7..."
                    className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-medium focus:ring-2 focus:ring-indigo-500 outline-none h-24 resize-none transition-all"
                  />
                </div>
              )}

              <div className="flex items-center gap-3 pt-6 border-t border-slate-50">
                <button 
                  onClick={() => {
                    if (resource.isCustom) {
                      if (!customPrompt.trim()) {
                        toast.error("Please describe what you want the AI to generate.");
                        return;
                      }
                      handleAction({ ...resource, prompt: customPrompt });
                    } else {
                      handleAction(resource);
                    }
                  }}
                  disabled={isGenerating}
                  className="flex-1 btn-primary !bg-slate-900 !py-3 text-[10px] uppercase font-black tracking-widest flex items-center justify-center gap-2 relative overflow-hidden group/btn"
                >
                  {isGenerating && currentResource === resource.title ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      <span>Generating...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles size={14} className="text-ghana-gold group-hover/btn:rotate-12 transition-transform" />
                      <span>{resource.actionLabel}</span>
                    </>
                  )}
                </button>
                <button className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:bg-slate-100 hover:text-slate-600 transition-all">
                  <Bookmark size={16} />
                </button>
              </div>

              {/* Decorative background element */}
              <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-10 scale-50 group-hover:scale-100 transition-all duration-700 pointer-events-none">
                <resource.icon size={80} />
              </div>
              <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-slate-100 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-700 delay-150" />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Results Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-4xl max-h-[85vh] bg-white rounded-[3rem] shadow-2xl overflow-hidden flex flex-col ghana-border-red"
            >
              <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-ghana-red rounded-2xl flex items-center justify-center text-white">
                    <Sparkles size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">{currentResource}</h3>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">AI Generated Content</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={handleShare}
                    className="p-3 bg-white text-slate-600 rounded-xl hover:bg-slate-100 transition-all shadow-sm flex items-center gap-2 text-xs font-black uppercase tracking-widest border border-slate-200"
                    title="Share content"
                  >
                    <Share2 size={16} className="text-indigo-600" />
                    <span className="hidden sm:inline">Share</span>
                  </button>
                  <button 
                    onClick={copyToClipboard}
                    className="p-3 bg-white text-slate-600 rounded-xl hover:bg-slate-100 transition-all shadow-sm flex items-center gap-2 text-xs font-black uppercase tracking-widest border border-slate-200"
                  >
                    <Copy size={16} />
                    <span className="hidden sm:inline">Copy</span>
                  </button>
                  <button 
                    onClick={() => setShowModal(false)}
                    className="p-3 bg-white text-slate-400 rounded-xl hover:bg-red-50 hover:text-red-500 transition-all shadow-sm border border-slate-200"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-10 lg:p-16 bg-white">
                <div className="max-w-3xl mx-auto">
                  <div className="markdown-body prose prose-slate max-w-none prose-headings:text-slate-900 prose-p:text-slate-600 prose-p:leading-relaxed prose-strong:text-slate-900">
                    <SafeMarkdown>
                      {generatedContent || ""}
                    </SafeMarkdown>
                  </div>
                </div>
              </div>
              
              <div className="p-8 bg-slate-50 border-t border-slate-100 flex flex-wrap justify-between items-center gap-4">
                 <div className="flex gap-3">
                   <button 
                     onClick={() => window.print()}
                     className="px-6 py-3 bg-white text-slate-900 border border-slate-200 rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-slate-100 transition-all flex items-center gap-2"
                   >
                     <Printer size={16} />
                     Print PDF
                   </button>
                   <button 
                     onClick={() => {
                        if (!generatedContent) return;
                        const element = document.createElement("a");
                        const file = new Blob([generatedContent], {type: 'text/plain'});
                        element.href = URL.createObjectURL(file);
                        element.download = `${currentResource?.replace(/\s+/g, '_')}_TeachSmart.txt`;
                        document.body.appendChild(element);
                        element.click();
                        document.body.removeChild(element);
                     }}
                     className="px-6 py-3 bg-white text-slate-900 border border-slate-200 rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-slate-100 transition-all flex items-center gap-2"
                   >
                     <Download size={16} />
                     Download TXT
                   </button>
                 </div>

                 <div className="flex gap-3">
                   <button 
                     onClick={handleSaveToDashboard}
                     disabled={isSaving || isSaved}
                     className={cn(
                       "px-8 py-3 rounded-xl font-black uppercase tracking-widest text-[10px] transition-all flex items-center gap-2 shadow-lg",
                       isSaved 
                        ? "bg-emerald-100 text-emerald-600 border border-emerald-200 pointer-events-none" 
                        : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-600/20"
                     )}
                   >
                     {isSaving ? (
                        <Loader2 className="animate-spin" size={16} />
                     ) : isSaved ? (
                        <CheckCircle size={16} />
                     ) : (
                        <Bookmark size={16} />
                     )}
                     {isSaving ? "Saving..." : isSaved ? "Saved to Dashboard" : "Save to Dashboard"}
                   </button>
                   <button 
                     onClick={() => setShowModal(false)}
                     className="px-8 py-3 bg-slate-900 text-white rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-slate-800 transition-all"
                   >
                     Close
                   </button>
                 </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Feature Request Section */}
      <div className="mt-20 p-10 lg:p-20 bg-slate-900 rounded-[4rem] relative overflow-hidden">
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/20 border border-emerald-500/30 rounded-full text-emerald-400 text-[10px] font-black uppercase tracking-widest mb-6">
              <Sparkles size={12} />
              <span>Coming Soon</span>
            </div>
            <h2 className="text-3xl lg:text-5xl font-black text-white tracking-tighter uppercase mb-6 leading-tight">
              Need a <span className="text-ghana-gold">Custom Pack</span> for your school?
            </h2>
            <p className="text-slate-400 text-lg font-medium leading-relaxed mb-10">
              We are working on Collaborative Packs where school leaders can curate resources for the entire student body and teaching staff.
            </p>
            <button className="px-8 py-4 bg-white text-slate-900 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-ghana-gold transition-colors">
              Join Early Access
            </button>
          </div>
          <div className="hidden lg:grid grid-cols-2 gap-6 opacity-40">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="aspect-square bg-white/5 rounded-3xl border border-white/10" />
            ))}
          </div>
        </div>
        
        {/* Background Gradients */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/10 blur-[100px] -mr-64 -mt-64 rounded-full" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-ghana-gold/5 blur-[100px] -ml-64 -mb-64 rounded-full" />
      </div>
    </div>
  );
}
