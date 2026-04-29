import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, Send, X, Bot, User, Loader2, Mic, RotateCcw } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { cn } from '../../lib/utils';
import { SafeMarkdown } from '../common/SafeMarkdown';
import 'highlight.js/styles/github.css';
import { toast } from 'react-hot-toast';

const GeminiAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'user' | 'assistant', content: string}[]>(() => {
    const saved = localStorage.getItem('teachsmart_chat_history');
    return saved ? JSON.parse(saved) : [
      { role: 'assistant', content: "Hello! I'm your TeachSmart AI assistant. How can I help you with your lessons today?" }
    ];
  });
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    localStorage.setItem('teachsmart_chat_history', JSON.stringify(messages));
  }, [messages]);

  const quickPrompts = [
    { label: "Lesson Idea", prompt: "Give me a creative lesson idea for a JHS B7 Class on Science." },
    { label: "Icebreaker", prompt: "What's a quick 5-minute icebreaker for a primary school math class?" },
    { label: "NaCCA Help", prompt: "Explain the NaCCA core competencies for the new curriculum." }
  ];

  const clearChat = () => {
    const defaultMsg = [{ role: 'assistant' as const, content: "Chat cleared! How can I help you now?" }];
    setMessages(defaultMsg);
    localStorage.removeItem('teachsmart_chat_history');
  };

  const handleSend = async (customText?: string) => {
    const messageContent = customText || input;
    if (!messageContent.trim() || loading) return;

    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: messageContent }]);
    setLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY as string });
      const model = "gemini-3-flash-preview";
      const history = messages.map(m => ({ role: m.role, parts: [{ text: m.content }] }));
      
      const response = await ai.models.generateContent({
        model,
        contents: [...history, { role: 'user', parts: [{ text: messageContent }]}],
        config: {
            systemInstruction: "You are TeachSmart AI, a helpful assistant for Ghanaian teachers. You provide advice on NaCCA curriculum, lesson ideas, and teaching methods. Keep responses concise and practical. Use Ghanaian English nuances where appropriate."
        }
      });

      setMessages(prev => [...prev, { role: 'assistant', content: response.text || 'Sorry, I encountered an error.' }]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { role: 'assistant', content: "I'm having trouble connecting to the brain right now. Try again later!" }]);
    } finally {
      setLoading(false);
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
                     <h3 className="font-black text-sm uppercase tracking-widest text-emerald-text">Gemini Assistant</h3>
                     <p className="text-[10px] opacity-70">Faculty AI Active</p>
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
                        {m.role === 'user' ? "Teacher" : "TeachSmart AI"}
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
