import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MessageSquare, Send, RotateCcw, Sparkles, BookOpen, Clock, 
  HelpCircle, CheckCircle, ChevronRight, User, GraduationCap, 
  Copy, Check, FileText, Compass, AlertCircle, RefreshCw, Volume2 
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { cn } from '../../lib/utils';
import { subjects, levels, CLASSES_BY_LEVEL, SUBJECT_STRANDS } from '../../constants';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { SafeMarkdown } from '../common/SafeMarkdown';
import { safeLocalStorage, safeSessionStorage } from '../../lib/storage';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const DEFAULT_AITUTOR_MSG: Message[] = [
  { 
    role: 'assistant', 
    content: `### Pioneer of Quality Learning! 🇬🇭\n\nI am your **AI Tutor**, a dedicated Ghana Education Service (GES) educational companion and NaCCA instructional planning coach.\n\nI am fully equipped with the official standard-based curriculum guidelines to assist you with:\n1. **Subject Matter Support** — break down any difficult concept.\n2. **Modern Methodology** — design learner-centered activities using realistic local resources.\n3. **Practical Lesson Delivery** — draft active lesson transitions & assessments.\n\nSelect your class details on the right pane or key in your questions below to start our coaching session!` 
  }
];

export default function AITutorPage() {
  const { canGenerate, profile } = useAuth();
  const navigate = useNavigate();
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Read profile default values
  const defaultLevel = profile?.level || 'JHS';
  const defaultSubject = profile?.subjectsTaught?.[0] || profile?.subjects?.[0] || 'Science';

  // Config States
  const [selectedLevel, setSelectedLevel] = useState<string>(defaultLevel);
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [selectedSubject, setSelectedSubject] = useState<string>(defaultSubject);
  const [selectedStrand, setSelectedStrand] = useState<string>('All Strands');
  const [topic, setTopic] = useState<string>('');

  // Loaded classes and strands based on selections
  const availableClasses = CLASSES_BY_LEVEL[selectedLevel] || [];
  const availableStrands = SUBJECT_STRANDS[selectedSubject] || [];

  // Initialize defaults on change
  useEffect(() => {
    if (availableClasses.length > 0 && !availableClasses.includes(selectedClass)) {
      setSelectedClass(availableClasses[0]);
    }
  }, [selectedLevel]);

  useEffect(() => {
    if (availableStrands.length > 0) {
      setSelectedStrand(availableStrands[0]);
    } else {
      setSelectedStrand('All Strands');
    }
  }, [selectedSubject]);

  // Chat History
  const [messages, setMessages] = useState<Message[]>(() => {
    try {
      const saved = safeLocalStorage.getItem('teachsmart_aitutor_history_v2');
      return saved ? JSON.parse(saved) : DEFAULT_AITUTOR_MSG;
    } catch {
      return DEFAULT_AITUTOR_MSG;
    }
  });

  const [inputMessage, setInputMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const requestSessionIdRef = useRef<number>(0);

  // Synchronize history
  useEffect(() => {
    try {
      if (messages.length <= 1) {
        safeLocalStorage.removeItem('teachsmart_aitutor_history_v2');
      } else {
        safeLocalStorage.setItem('teachsmart_aitutor_history_v2', JSON.stringify(messages));
      }
    } catch (e) {
      console.error('Failed to save chat history', e);
    }
  }, [messages]);

  // Scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSendMessage = async (customText?: string) => {
    if (!canGenerate()) {
      toast.error("Please upgrade to an active package to use the full AI Tutor.");
      navigate('/billing');
      return;
    }

    const textToSend = (customText || inputMessage).trim();
    if (!textToSend || loading) return;

    const currentSessionId = ++requestSessionIdRef.current;

    setInputMessage('');
    setMessages(prev => [...prev, { role: 'user', content: textToSend }]);
    setLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY as string });
      const model = "gemini-3-flash-preview";
      
      const historyPayload = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.content }]
      }));

      const sysInstruction = `You are now “AI Tutor” — an advanced Ghana Education Service (GES) teaching support assistant and NaCCA curriculum teaching coach designed specifically for Ghanaian teachers.

Your primary responsibility is to guide teachers before, during, and after lesson preparation by providing:
* subject matter support,
* teaching strategies,
* methodology recommendations,
* classroom management tips,
* learner engagement ideas,
* assessment guidance,
* and curriculum-aligned teaching support.

==================================================
PRIMARY OBJECTIVE
=================
Help teachers teach more effectively, confidently, and professionally by acting as a smart teaching companion and instructional coach.

The AI Tutor should support teachers in:
✔ understanding topics better,
✔ improving teaching delivery,
✔ selecting effective teaching methods,
✔ simplifying difficult concepts,
✔ improving learner participation,
✔ and preparing classroom-ready lessons.

==================================================
ROLE OF AI TUTOR
================
AI Tutor must act like:
* an experienced Ghanaian teacher,
* a curriculum specialist,
* an instructional coach,
* and a classroom mentor.

==================================================
STRICT RULES
============
1. Use ONLY NaCCA-aligned educational guidance.
2. Provide practical Ghanaian classroom teaching advice (local solutions).
3. Avoid robotic AI responses. Focus on high-quality Markdown, tables, dynamic bullets.
4. Avoid overly academic or theoretical explanations.
5. Use simple professional educational language.
6. Ensure recommendations are realistic for Ghanaian schools (e.g. large classes, low-cost resources).
7. Focus on learner-centered and competency-based teaching.
8. Ensure advice matches the selected class level.
9. Keep recommendations concise, actionable, and practical.
10. Encourage interactive teaching and active learner participation.

==================================================
METHOD RECOMMENDATION RULES
===========================
Recommend appropriate teaching methods: Discussion Method, Demonstration Method, Activity-Based Learning, Cooperative Learning, Inquiry-Based Learning, Storytelling, Role Play, Project-Based Learning. Recommend based on subject/class.

==================================================
RESPONSE STYLE
==============
Feel supportive, expert, encouraging and close to the Ghanaian context. Include local low-cost Teaching and Learning Materials (TLMs).`;

      const response = await ai.models.generateContent({
        model,
        contents: [...historyPayload, { role: 'user', parts: [{ text: textToSend }] }],
        config: {
          systemInstruction: sysInstruction
        }
      });

      if (currentSessionId !== requestSessionIdRef.current) {
        return;
      }

      const reply = response.text || "I was unable to complete this query. Please try again.";
      setMessages(prev => [...prev, { role: 'assistant', content: reply }]);

    } catch (err: any) {
      if (currentSessionId !== requestSessionIdRef.current) {
        return;
      }
      console.error('Gemini error:', err);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: "### Connection Incident 🚨\n\nI am currently experiencing minor connectivity delays. Please make sure your internet configuration is active and retry in a moment!" 
      }]);
      toast.error("Failed to fetch response. Please try again.");
    } finally {
      if (currentSessionId === requestSessionIdRef.current) {
        setLoading(false);
      }
    }
  };

  const clearChatHistory = () => {
    if (window.confirm("Are you sure you want to perform a hard-reset of the session cache and clear all chat history?")) {
      // 1. Invalidate any active asynchronously processing requests
      requestSessionIdRef.current += 1;
      setLoading(false);
      
      // 2. Perform hard-reset of localStorage & sessionStorage keys
      safeLocalStorage.removeItem('teachsmart_aitutor_history_v2');
      safeLocalStorage.removeItem('teachsmart_chat_history');
      safeSessionStorage.clear();
      
      // 3. Reset all visual inputs & states
      setInputMessage('');
      setTopic('');
      setMessages(DEFAULT_AITUTOR_MSG);
      
      toast.success("Session cache and chat history successfully hard-reset!");
    }
  };

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  // Pre-configured Coaches
  const invokeCoachAction = (type: 'intro' | 'simplify' | 'groups' | 'tlm' | 'questions' | 'misconceptions') => {
    const classDetail = selectedClass ? `for class **${selectedClass}**` : '';
    const subjectDetail = `in **${selectedSubject}**`;
    const strandDetail = selectedStrand && selectedStrand !== 'All Strands' ? `under Strand **${selectedStrand}**` : '';
    const topicDetail = topic ? `on the topic **${topic}**` : 'for the curriculum standards';

    let prompt = "";

    switch (type) {
      case 'intro':
        prompt = `Act as my instructional designer. Teach me how to introduce a lesson ${classDetail} ${subjectDetail} ${strandDetail} ${topicDetail}. Provide:
1. A 5-minute engaging hook/icebreaker utilizing Ghanaian classroom elements.
2. 3 trigger questions to test learners' prior knowledge starting the lesson.
3. A clear, learner-friendly way to state the learning indicators/objectives.`;
        break;
      case 'simplify':
        prompt = `Explain the concept ${topicDetail} ${classDetail} ${subjectDetail} simply so any learner can capture it.
1. Use an intuitive analogy from everyday Ghanaian local contexts (e.g. market, sports, local community).
2. Give a step-by-step simple definition of key terms.
3. Provide one concrete blackboard drawing explanation described clearly.`;
        break;
      case 'groups':
        prompt = `Design a cooperative group activity ${classDetail} ${subjectDetail} ${topicDetail} tailored for standard large classrooms (40-60 students).
1. Explain how to group and organize them efficiently under 2 minutes.
2. Outline the specific challenge or hands-on task for each group.
3. Detail how the groups will present or verify their learning to the rest of the class.`;
        break;
      case 'tlm':
        prompt = `Recommend low-cost or zero-cost Teaching and Learning Materials (TLMs) I can construct using local materials or recycled/household objects ${classDetail} ${subjectDetail} ${topicDetail}.
Provide construction instructions and how exactly they will be active in the lesson.`;
        break;
      case 'questions':
        prompt = `Generate a set of 5 competency-based, high-quality formative assessment questions of varying difficulty levels (from simple recall to critical evaluation) ${classDetail} ${subjectDetail} ${topicDetail}.
Include a short guide on how to evaluate learners' answers and standard marking instructions.`;
        break;
      case 'misconceptions':
        prompt = `Identify the 3 most common misconceptions or mistakes learners ${classDetail} make ${subjectDetail} when learning ${topicDetail}.
Explain exactly how I can preemptively address and correct them during my instruction.`;
        break;
      default:
        return;
    }

    handleSendMessage(prompt);
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50/50">
      {/* Header Panel */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-3">
            <span className="p-3 bg-gradient-to-tr from-emerald-600 to-teal-500 rounded-2xl text-white shadow-md shadow-emerald-500/10">
              <Compass size={24} />
            </span>
            <div>
              <h1 className="text-2xl font-black tracking-tight text-slate-900 flex items-center gap-2">
                AI Tutor 
                <span className="px-2.5 py-0.5 bg-amber-500/10 text-amber-700 text-[9px] font-black uppercase tracking-wider rounded-full border border-amber-500/20">
                  NaCCA Coach
                </span>
              </h1>
              <p className="text-xs text-slate-500 mt-1 font-medium">
                Your smart Ghana Education Service (GES) study buddy and instructional companion.
              </p>
            </div>
          </div>
        </div>
        <div className="mt-4 md:mt-0 flex gap-2">
          <button 
            type="button"
            onClick={clearChatHistory}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 hover:border-red-200 hover:text-red-600 text-slate-600 rounded-xl text-xs font-bold shadow-sm transition-all"
            title="Perform a hard reset to completely clear raw data and caches"
          >
            <RotateCcw size={14} />
            Clear All (Hard Reset)
          </button>
        </div>
      </div>

      {/* Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Chat Workspace (Left) */}
        <div className="lg:col-span-8 flex flex-col bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden min-h-[680px] max-h-[800px]">
          {/* Chat Banner Info */}
          <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                ACTIVE LESSON COACHING PORTAL
              </p>
            </div>
            <p className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-md">
              GES Standard SBC/CCP Ready
            </p>
          </div>

          {/* Conversation Core */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 min-h-[450px] max-h-[550px]" style={{ scrollbarWidth: 'thin' }}>
            <AnimatePresence initial={false}>
              {messages.map((msg, index) => {
                const isUser = msg.role === 'user';
                return (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className={cn(
                      "flex gap-4 w-full",
                      isUser ? "flex-row-reverse" : "flex-row"
                    )}
                  >
                    {/* Icon */}
                    <div className={cn(
                      "w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 border shadow-sm",
                      isUser 
                        ? "bg-slate-900 border-slate-900 text-white" 
                        : "bg-emerald-50 border-emerald-100 text-emerald-700"
                    )}>
                      {isUser ? <User size={18} /> : <GraduationCap size={18} />}
                    </div>

                    {/* Bubble */}
                    <div className="space-y-1.5 max-w-[85%]">
                      <div className={cn(
                        "flex items-center gap-2",
                        isUser ? "justify-end" : "justify-start"
                      )}>
                        <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                          {isUser ? "Classroom Teacher" : "AI Tutor Coach"}
                        </span>
                      </div>
                      <div className={cn(
                        "rounded-3xl p-5 shadow-sm relative group text-slate-800 leading-relaxed text-sm border",
                        isUser 
                          ? "bg-gradient-to-br from-slate-900 to-slate-800 text-white border-slate-800 rounded-tr-none" 
                          : "bg-emerald-50/10 border-slate-100 rounded-tl-none"
                      )}>
                        <div className={cn("markdown-body", isUser ? "text-white" : "text-slate-800")}>
                          <SafeMarkdown>{msg.content}</SafeMarkdown>
                        </div>

                        {/* Clipboard button */}
                        {!isUser && (
                          <button
                            type="button"
                            onClick={() => copyToClipboard(msg.content, index)}
                            className="absolute bottom-2 right-2 p-1.5 bg-white border border-slate-200 text-slate-500 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-slate-50"
                            title="Copy response content"
                          >
                            {copiedIndex === index ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}

              {loading && (
                <div className="flex gap-4 w-full">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-700 flex items-center justify-center animate-pulse shrink-0">
                    <GraduationCap size={18} />
                  </div>
                  <div className="space-y-2.5 max-w-[85%] w-full">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                        AI Tutor Coach is compiling strategy
                      </span>
                      {/* Typing Indicator Dots */}
                      <div className="flex gap-1 items-center">
                        <span className="w-1 h-1 bg-emerald-600 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                        <span className="w-1 h-1 bg-emerald-600 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                        <span className="w-1 h-1 bg-emerald-600 rounded-full animate-bounce"></span>
                      </div>
                    </div>
                    
                    {/* Skeleton Loader bubble */}
                    <div className="bg-emerald-50/10 border border-slate-100 rounded-3xl rounded-tl-none p-5 space-y-4 shadow-sm w-full">
                      {/* Simulating markdown header skeleton */}
                      <div className="h-3.5 bg-slate-200/70 rounded-md w-1/2 animate-pulse"></div>
                      
                      {/* Divider line skeleton */}
                      <div className="h-[1px] bg-slate-100 w-full"></div>
                      
                      {/* Bullet points and body text skeleton */}
                      <div className="space-y-2.5">
                        <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-emerald-200 rounded-full animate-pulse"></div>
                          <div className="h-2.5 bg-slate-100 rounded-md w-5/6 animate-pulse"></div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-emerald-100 rounded-full animate-pulse"></div>
                          <div className="h-2.5 bg-slate-100/80 rounded-md w-4/6 animate-pulse"></div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-emerald-100 rounded-full animate-pulse"></div>
                          <div className="h-2.5 bg-slate-100/60 rounded-md w-11/12 animate-pulse"></div>
                        </div>
                      </div>

                      {/* Micro instructional context banner inside the bubble */}
                      <div className="pt-2 flex items-center gap-2 text-[10px] text-slate-400 font-bold">
                        <RefreshCw size={10} className="animate-spin text-emerald-500" />
                        <span>Applying NaCCA pedagogy rules & local low-cost TLM integrations...</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </AnimatePresence>
            <div ref={chatEndRef} />
          </div>

          {/* Form Input Area */}
          <div className="p-4 bg-slate-50 border-t border-slate-100">
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex gap-3"
            >
              <input 
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Ask your coach anything (e.g., Explain density with local cup analogies)..."
                className="flex-1 p-4 bg-white border border-slate-200 rounded-2xl outline-none text-xs font-bold text-slate-700 focus:ring-2 focus:ring-emerald-500 shadow-inner"
              />
              <button 
                type="submit"
                disabled={loading || !inputMessage.trim()}
                className="px-5 bg-emerald-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-md hover:bg-emerald-800 disabled:opacity-40 disabled:hover:bg-emerald-700 transition"
              >
                <span className="hidden sm:inline">Seek Advice</span>
                <Send size={14} className="sm:hidden" />
              </button>
            </form>
          </div>
        </div>

        {/* Coach Context Builder & Trigger Tools (Right) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Active Context Card */}
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <Sparkles size={16} className="text-amber-500" />
              <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">
                My Classroom Context
              </h3>
            </div>

            {/* GES Level */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">GES School Level</label>
              <div className="grid grid-cols-4 gap-1">
                {levels.map(lvl => (
                  <button
                    type="button"
                    key={lvl}
                    onClick={() => setSelectedLevel(lvl)}
                    className={cn(
                      "py-1.5 rounded-lg text-xs font-black transition-all border text-center",
                      selectedLevel === lvl 
                        ? "bg-slate-900 border-slate-900 text-white shadow" 
                        : "bg-slate-50 border-slate-100 text-slate-400 hover:border-slate-200"
                    )}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            {/* Class selection dropdown */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Class / Form</label>
              <select 
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-black text-slate-600 outline-none"
              >
                {availableClasses.map(cls => (
                  <option key={cls} value={cls}>{cls}</option>
                ))}
              </select>
            </div>

            {/* Subject Selection */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Subject taught</label>
              <select 
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-black text-slate-600 outline-none"
              >
                {subjects.slice(0, 15).map(sub => (
                  <option key={sub} value={sub}>{sub}</option>
                ))}
              </select>
            </div>

            {/* Strand Input */}
            {availableStrands.length > 0 && (
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block font-bold">Strand (NaCCA)</label>
                <select 
                  value={selectedStrand}
                  onChange={(e) => setSelectedStrand(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-black text-slate-600 outline-none"
                >
                  {availableStrands.map(st => (
                    <option key={st} value={st}>{st}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Topic Input */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Current Topic / Concept</label>
              <input 
                type="text"
                placeholder="e.g., Simple Fractions, Evaporation"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none text-slate-700"
              />
            </div>
          </div>

          {/* Quick Coach Tools */}
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <Compass size={16} className="text-emerald-700" />
              <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">
                Coach Trigger Tools
              </h3>
            </div>
            <p className="text-[10px] text-slate-400 font-medium">
              Tap any trigger tool below to instantly compile a classroom-ready coaching response using the context specified above!
            </p>

            <div className="grid grid-cols-1 gap-2.5">
              <button
                type="button"
                onClick={() => invokeCoachAction('intro')}
                className="text-left p-3.5 bg-slate-50 hover:bg-emerald-50 hover:text-emerald-900 border border-slate-100 rounded-2xl flex items-center justify-between group transition-all"
              >
                <div>
                  <h4 className="text-xs font-black">Introduce This Lesson</h4>
                  <p className="text-[9px] text-slate-400 mt-0.5 font-bold">Icebreakers, objective triggers & hooks</p>
                </div>
                <ChevronRight size={14} className="text-slate-400 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                type="button"
                onClick={() => invokeCoachAction('simplify')}
                className="text-left p-3.5 bg-slate-50 hover:bg-emerald-50 hover:text-emerald-900 border border-slate-100 rounded-2xl flex items-center justify-between group transition-all"
              >
                <div>
                  <h4 className="text-xs font-black">Simplify Content</h4>
                  <p className="text-[9px] text-slate-400 mt-0.5 font-bold">Blackboard drawings & local analogies</p>
                </div>
                <ChevronRight size={14} className="text-slate-400 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                type="button"
                onClick={() => invokeCoachAction('groups')}
                className="text-left p-3.5 bg-slate-50 hover:bg-emerald-50 hover:text-emerald-900 border border-slate-100 rounded-2xl flex items-center justify-between group transition-all"
              >
                <div>
                  <h4 className="text-xs font-black">Large Group Work Strategy</h4>
                  <p className="text-[9px] text-slate-400 mt-0.5 font-bold">2-minute grouping & active challenges</p>
                </div>
                <ChevronRight size={14} className="text-slate-400 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                type="button"
                onClick={() => invokeCoachAction('tlm')}
                className="text-left p-3.5 bg-slate-50 hover:bg-emerald-50 hover:text-emerald-900 border border-slate-100 rounded-2xl flex items-center justify-between group transition-all"
              >
                <div>
                  <h4 className="text-xs font-black">Construct Low-Cost TLMs</h4>
                  <p className="text-[9px] text-slate-400 mt-0.5 font-bold">Local improvised tools & step guides</p>
                </div>
                <ChevronRight size={14} className="text-slate-400 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                type="button"
                onClick={() => invokeCoachAction('questions')}
                className="text-left p-3.5 bg-slate-50 hover:bg-emerald-50 hover:text-emerald-900 border border-slate-100 rounded-2xl flex items-center justify-between group transition-all"
              >
                <div>
                  <h4 className="text-xs font-black">Draft Assessment Questions</h4>
                  <p className="text-[9px] text-slate-400 mt-0.5 font-bold">SBC competency evaluation test questions</p>
                </div>
                <ChevronRight size={14} className="text-slate-400 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                type="button"
                onClick={() => invokeCoachAction('misconceptions')}
                className="text-left p-3.5 bg-slate-50 hover:bg-emerald-50 hover:text-emerald-900 border border-slate-100 rounded-2xl flex items-center justify-between group transition-all"
              >
                <div>
                  <h4 className="text-xs font-black">Preempt Common Errors</h4>
                  <p className="text-[9px] text-slate-400 mt-0.5 font-bold">Address pupil struggle points proactively</p>
                </div>
                <ChevronRight size={14} className="text-slate-400 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
