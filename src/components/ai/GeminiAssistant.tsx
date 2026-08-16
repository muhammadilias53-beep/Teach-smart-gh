import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, Send, X, Bot, User, Loader2, Mic, RotateCcw, Lock } from 'lucide-react';
import { generateWithProxy } from '../../lib/gemini';
import { cn } from '../../lib/utils';
import { SafeMarkdown } from '../common/SafeMarkdown';
import 'highlight.js/styles/github.css';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router';
import { safeLocalStorage, safeSessionStorage } from '../../lib/storage';

const DEFAULT_GEMINI_MSG = [
  { role: 'assistant' as const, content: "Hello! I am AI Tutor, your advanced GES teaching support assistant and NaCCA curriculum teaching coach. How can I guide you with your subject matter, teaching delivery, or lesson preparation today?" }
];

const GeminiAssistant = () => {
  const { canGenerate } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'user' | 'assistant', content: string}[]>(() => {
    try {
      const saved = safeLocalStorage.getItem('teachsmart_chat_history');
      return saved ? JSON.parse(saved) : DEFAULT_GEMINI_MSG;
    } catch {
      return DEFAULT_GEMINI_MSG;
    }
  });
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const requestSessionIdRef = React.useRef<number>(0);

  React.useEffect(() => {
    try {
      if (messages.length <= 1) {
        safeLocalStorage.removeItem('teachsmart_chat_history');
      } else {
        safeLocalStorage.setItem('teachsmart_chat_history', JSON.stringify(messages));
      }
    } catch (e) {
      console.error('Failed to save chat history', e);
    }
  }, [messages]);

  const quickPrompts = [
    { label: "Lesson Idea", prompt: "Give me a creative lesson idea for a JHS B7 Class on Science." },
    { label: "Icebreaker", prompt: "What's a quick 5-minute icebreaker for a primary school math class?" },
    { label: "NaCCA Help", prompt: "Explain the NaCCA core competencies for the new curriculum." }
  ];

  const clearChat = () => {
    if (window.confirm("Are you sure you want to perform a hard-reset of the session cache and clear all chat history?")) {
      // 1. Invalidate any active asynchronously processing requests
      requestSessionIdRef.current += 1;
      setLoading(false);
      
      // 2. Perform hard-reset of localStorage & sessionStorage keys
      safeLocalStorage.removeItem('teachsmart_chat_history');
      safeLocalStorage.removeItem('teachsmart_aitutor_history_v2');
      safeSessionStorage.clear();
      
      // 3. Reset visual inputs & states
      setInput('');
      setMessages(DEFAULT_GEMINI_MSG);
      
      toast.success("Session cache and chat history successfully hard-reset!");
    }
  };

  const handleSend = async (customText?: string) => {
    if (!canGenerate()) {
      toast.error("Upgrade to active subscription to use AI assistant");
      navigate('/billing');
      return;
    }

    const messageContent = customText || input;
    if (!messageContent.trim() || loading) return;

    const currentSessionId = ++requestSessionIdRef.current;

    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: messageContent }]);
    setLoading(true);

    try {
      const history = messages.map(m => ({ role: m.role, parts: [{ text: m.content }] }));
      
      const resText = await generateWithProxy(
        [...history, { role: 'user', parts: [{ text: messageContent }]}],
        `You are now “AI Tutor” — an advanced Ghana Education Service (GES) teaching support assistant and NaCCA curriculum teaching coach designed specifically for Ghanaian teachers.

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

The AI Tutor should provide:
1. Subject Matter Guidance
2. Teaching Method Recommendations
3. Classroom Activity Suggestions
4. Assessment Recommendations
5. Learner Engagement Ideas
6. Teaching & Learning Resource Suggestions
7. Differentiation Strategies
8. Classroom Management Tips
9. Revision Strategies
10. Examination Preparation Support

==================================================
INPUT DATA PROVIDED BY SYSTEM
=============================
The system may provide:
* Education Level
* Class/Form
* Subject/Learning Area
* Strand
* Sub-Strand
* Topic
* Content Standard
* Indicator(s)
* Lesson Objectives

==================================================
STRICT RULES
============
1. Use ONLY NaCCA-aligned educational guidance.
2. Provide practical Ghanaian classroom teaching advice.
3. Avoid robotic AI responses.
4. Avoid overly academic or theoretical explanations.
5. Use simple professional educational language.
6. Ensure recommendations are realistic for Ghanaian schools.
7. Focus on learner-centered and competency-based teaching.
8. Ensure advice matches the selected class level.
9. Keep recommendations concise, actionable, and practical.
10. Encourage interactive teaching and learner participation.

==================================================
TEACHING SUPPORT FEATURES
=========================
AI Tutor should help teachers with:
✔ How to introduce the lesson
✔ How to explain difficult concepts
✔ Best teaching methods for the topic
✔ Group work suggestions
✔ Practical classroom activities
✔ Teaching examples
✔ Teaching & Learning Materials (TLMs)
✔ Questions to ask learners
✔ Common learner misconceptions
✔ How to assess understanding
✔ Revision strategies
✔ Homework ideas
✔ Exam preparation guidance

==================================================
METHOD RECOMMENDATION RULES
===========================
Recommend appropriate teaching methods such as:
* Discussion Method
* Demonstration Method
* Activity-Based Learning
* Cooperative Learning
* Inquiry-Based Learning
* Storytelling
* Role Play
* Project-Based Learning
* Question & Answer Method
* Practical Demonstrations

Recommendations must depend on:
* subject,
* topic,
* learner age,
* and lesson objectives.

==================================================
CLASSROOM REALISM RULES
=======================
Recommendations must consider:
* large class sizes,
* limited teaching resources,
* Ghanaian classroom conditions,
* varying learner abilities,
* and practical teaching realities.

==================================================
AI TUTOR RESPONSE STYLE
=======================
Responses should feel:
* supportive,
* intelligent,
* professional,
* practical,
* and encouraging.

Use natural teacher-friendly language such as:
✔ “You can begin the lesson by…”
✔ “A simple classroom activity could be…”
✔ “Learners may struggle with…”
✔ “To improve participation, try…”

Avoid:
✘ robotic AI wording
✘ generic motivational speeches
✘ complicated educational jargon

==================================================
QUALITY CONTROL RULES
=====================
Before generating responses:
✔ ensure curriculum alignment,
✔ ensure practical usefulness,
✔ ensure class-level appropriateness,
✔ ensure teaching realism,
✔ and ensure educational accuracy.

==================================================
FINAL GOAL
==========
Transform the sidebar assistant into a powerful AI Tutor that acts as a trusted teaching companion for Ghanaian teachers by helping them:
* teach more effectively,
* understand topics better,
* improve learner engagement,
* and confidently deliver NaCCA-aligned lessons in real classrooms.`
      );

      if (currentSessionId !== requestSessionIdRef.current) {
        return;
      }

      setMessages(prev => [...prev, { role: 'assistant', content: resText || 'Sorry, I encountered an error.' }]);
    } catch (err) {
      if (currentSessionId !== requestSessionIdRef.current) {
        return;
      }
      console.error(err);
      setMessages(prev => [...prev, { role: 'assistant', content: "I'm having trouble connecting to the brain right now. Try again later!" }]);
    } finally {
      if (currentSessionId === requestSessionIdRef.current) {
        setLoading(false);
      }
    }
  };

  const [isListening, setIsListening] = useState(false);

  const toggleVoice = () => {
    // Basic simulation for voice UI
    if (!isListening) {
      setIsListening(true);
      toast("Listening... (Voice dictation simulated)", { icon: '🎙️' });
      setTimeout(() => {
        setIsListening(false);
      }, 3000);
    } else {
      setIsListening(false);
    }
  };

  return (
    <>
      <style>{`
        .markdown-body ul { list-style-type: disc !important; margin-left: 1.5rem !important; }
        .markdown-body ol { list-style-type: decimal !important; margin-left: 1.5rem !important; }
      `}</style>
      {/* Toggle Button */}
      {!isOpen && (
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-10 right-10 w-16 h-16 bg-emerald-deep text-white rounded-2xl shadow-2xl flex items-center justify-center z-50 hover:scale-110 active:scale-95 transition-all border-4 border-ghana-gold/20"
      >
        <MessageSquare size={32} />
      </button>
      )}

      {/* Sidebar Panel Chat */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            className="fixed inset-y-0 right-0 w-full max-w-sm bg-slate-900 shadow-2xl z-[100] flex flex-col overflow-hidden text-white border-l border-emerald-500/20"
          >
            {/* Header */}
            <div className="p-6 bg-emerald-deep flex items-center justify-between shadow-lg">
               <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-emerald-text animate-pulse" />
                  <div>
                     <h3 className="font-black text-sm uppercase tracking-widest text-emerald-text">AI Tutor</h3>
                     <p className="text-[10px] opacity-70">GES Instructional Coach Active</p>
                  </div>
               </div>
               <div className="flex items-center gap-2">
                  <button 
                    onClick={clearChat} 
                    title="Clear History"
                    className="p-2 hover:text-red-400 transition-colors opacity-50 hover:opacity-100"
                  >
                     <RotateCcw size={16} />
                  </button>
                  <button onClick={() => setIsOpen(false)} className="p-1 hover:text-ghana-gold transition-colors">
                     <X size={20} />
                  </button>
               </div>
            </div>

            {/* Conversation Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
               {/* Quick Prompts */}
               <div className="flex flex-wrap gap-2 mb-4">
                  {quickPrompts.map((qp, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSend(qp.prompt)}
                      className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold text-emerald-text/70 hover:bg-emerald-text hover:text-emerald-deep transition-all whitespace-nowrap"
                    >
                      {qp.label}
                    </button>
                  ))}
               </div>

               {messages.map((m, i) => (
                 <div key={i} className={cn("flex flex-col gap-2", m.role === 'user' ? "items-end" : "items-start")}>
                    <p className={cn("text-[9px] font-black uppercase tracking-widest opacity-50", m.role === 'user' ? "text-ghana-gold" : "text-emerald-text")}>
                        {m.role === 'user' ? "Teacher" : "AI Tutor"}
                    </p>
                    <div className={cn(
                        "markdown-body max-w-[90%] p-4 rounded-xl text-xs leading-relaxed",
                        m.role === 'user' ? "bg-emerald-deep/40 border border-emerald-500/20 text-white rounded-tr-none" : "bg-white/10 text-slate-200 rounded-tl-none italic"
                    )}>
                        {m.role === 'assistant' ? (
                          <SafeMarkdown>
                            {m.content}
                          </SafeMarkdown>
                        ) : (
                          m.content
                        )}
                    </div>
                 </div>
               ))}
               {!canGenerate() && messages.length > 0 && (
                  <div className="p-6 bg-ghana-red/5 border border-ghana-red/20 rounded-2xl flex flex-col items-center text-center gap-3 mt-4">
                     <div className="w-10 h-10 bg-ghana-red/10 rounded-full flex items-center justify-center text-ghana-red">
                        <Lock size={18} />
                     </div>
                     <div>
                        <p className="text-xs font-bold text-slate-900">Access Restricted</p>
                        <p className="text-[10px] text-slate-500 mt-1">Upgrade your plan to unlock unlimited AI consulting.</p>
                     </div>
                     <button 
                       onClick={() => navigate('/billing')}
                       className="w-full py-2 bg-ghana-red text-white rounded-lg text-[10px] font-black uppercase tracking-widest"
                     >
                        Upgrade Now
                     </button>
                  </div>
               )}
               {loading && (
                 <div className="flex flex-col gap-2 items-start">
                    <div className="bg-white/5 p-4 rounded-xl rounded-tl-none flex items-center gap-3 border border-white/5">
                        <Loader2 className="animate-spin text-emerald-text" size={14} />
                        <span className="text-[10px] font-bold text-emerald-text/50 uppercase tracking-widest">Consulting Matrix...</span>
                    </div>
                 </div>
               )}
            </div>

            {/* Input Area */}
            <div className="p-6 border-t border-white/5 bg-emerald-deep/20 backdrop-blur-md">
               <div className="flex items-center gap-2 bg-white/5 p-2 rounded-2xl border border-white/10 group focus-within:border-emerald-text/50 transition-colors">
                  <button 
                    onClick={toggleVoice}
                    className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center transition-all",
                      isListening ? "bg-red-500 text-white animate-pulse" : "bg-white/5 text-slate-400 hover:text-emerald-text"
                    )}
                  >
                    <Mic size={18} />
                  </button>
                  <input 
                    type="text" 
                    placeholder="Ask anything..."
                    className="flex-1 bg-transparent px-2 py-3 text-xs outline-none text-white placeholder-white/30"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  />
                  <button 
                    onClick={() => handleSend()}
                    disabled={loading}
                    className="w-10 h-10 bg-emerald-text text-emerald-deep rounded-xl flex items-center justify-center hover:scale-105 active:scale-95 disabled:opacity-50 transition-all font-black shadow-lg shadow-emerald-500/20"
                  >
                    <Send size={18} />
                  </button>
               </div>
               <p className="text-[9px] text-center mt-4 text-emerald-text/30 font-bold uppercase tracking-tighter">Powered by Gemini AI</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default GeminiAssistant;
