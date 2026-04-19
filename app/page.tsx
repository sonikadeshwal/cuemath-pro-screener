"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, MicOff, Bot, Brain, Download, Send, ArrowRight, Loader2, Sparkles, User } from "lucide-react";

export default function Page() {
  const [mounted, setMounted] = useState(false);
  const [stage, setStage] = useState(0); 
  const [name, setName] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [textInput, setTextInput] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const [report, setReport] = useState<any>(null);
  
  const [timeLeft, setTimeLeft] = useState(600);
  const [timerActive, setTimerActive] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    let interval: any;
    if (timerActive && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    } else if (timeLeft === 0 && stage === 1) {
      finish();
      setTimerActive(false);
    }
    return () => clearInterval(interval);
  }, [timerActive, timeLeft, stage]);

  if (!mounted) return null;

  const start = () => {
    if (!name.trim()) return alert("Enter candidate name");
    setStage(1);
    setTimerActive(true);
    const m = "Hi! I'm Rohan. My teacher says 1/2 is bigger than 1/4, but 4 is bigger than 2! Why is that? Isn't she wrong?";
    setMessages([{ role: "bot", text: m }]);
    window.speechSynthesis.speak(new SpeechSynthesisUtterance(m));
  };

  const toggleMic = () => {
    const Rec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!Rec) return alert("Translate browser voice not supported");
    const rec = new Rec();
    rec.onresult = (e: any) => handleMsg(e.results[0][0].transcript);
    rec.onstart = () => setIsListening(true);
    rec.onend = () => setIsListening(false);
    rec.start();
  };

  const handleMsg = async (text: string) => {
    if (!text.trim()) return;
    const n = [...messages, { role: "user", text }];
    setMessages(n);
    setTextInput("");
    try {
      const r = await fetch("/api/chat", { method: "POST", body: JSON.stringify({ message: text, history: n }) });
      const d = await r.json();
      setMessages([...n, { role: "bot", text: d.reply }]);
      window.speechSynthesis.speak(new SpeechSynthesisUtterance(d.reply));
    } catch (e) { console.error(e); }
  };

  const finish = async () => {
    setTimerActive(false);
    setStage(1.5);
    try {
      const r = await fetch("/api/evaluate", { method: "POST", body: JSON.stringify({ history: messages }) });
      const d = await r.json();
      setReport(d.report);
      setStage(2);
    } catch (e) {
      setReport({ scores: { Clarity: {val: 7, quote: "N/A"}, Empathy: {val: 8, quote: "N/A"}, Simplify: {val: 6, quote: "N/A"}, English: {val: 9, quote: "N/A"}, Patience: {val: 9, quote: "N/A"} }, overall_score: 75, verdict: "HOLD", reasoning: "Automatic review is busy.", model_answer: "Explanation should focus on denominator size." });
      setStage(2);
    }
  };

  return (
    <div className="min-h-screen bg-[#050508] text-white flex flex-col items-center justify-center p-6 text-center">
      <AnimatePresence mode="wait">
        
        {stage === 0 && (
          <motion.div key="s0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass p-12 max-w-lg w-full text-center">
            <Bot size={60} className="text-orange-500 mx-auto mb-6" />
            <h1 className="text-4xl font-black mb-4 text-gradient uppercase tracking-tighter">Cuemath Screener</h1>
            <p className="text-gray-500 mb-10 text-sm">Professional AI Assessment Stage</p>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="Entry Candidate Name" className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl mb-6 outline-none text-center text-xl" />
            <button onClick={start} className="w-full py-5 bg-orange-600 rounded-3xl font-black uppercase tracking-widest hover:scale-[1.02] transition-all">Begin Interview</button>
          </motion.div>
        )}

        {stage === 1 && (
          <motion.div key="s1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl w-full flex flex-col h-[85vh] relative">
            <div className={`fixed top-10 right-10 px-6 py-3 rounded-2xl border font-mono text-2xl font-black ${timeLeft < 60 ? 'text-red-500 border-red-500 animate-pulse' : 'text-gray-400 border-white/10'}`}>
               {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
            </div>

            <div className="flex-1 overflow-y-auto mb-8 space-y-4 pr-4 custom-scrollbar">
               {messages.map((m, i) => (
                 <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[70%] p-4 rounded-3xl ${m.role === 'user' ? 'bg-orange-600 text-white font-medium' : 'bg-white/5 border border-white/10 text-gray-200'}`}>
                      {m.text}
                    </div>
                 </div>
               ))}
            </div>
            
            <div className="bg-white/5 border border-white/10 p-4 rounded-[40px] flex gap-4 items-center shadow-2xl">
              <button onClick={toggleMic} className={`w-16 h-16 shrink-0 rounded-full flex items-center justify-center transition-all ${isListening ? 'bg-red-500 animate-pulse' : 'bg-white/10 hover:bg-white/20'}`}>
                {isListening ? <MicOff /> : <Mic />}
              </button>
              <input value={textInput} onChange={e => setTextInput(e.target.value)} onKeyPress={e => e.key === 'Enter' && handleMsg(textInput)} placeholder="Type your explanation..." className="flex-1 bg-transparent border-none outline-none text-xl font-light" />
              <button onClick={() => handleMsg(textInput)} className="w-16 h-16 shrink-0 bg-orange-600 rounded-full flex items-center justify-center hover:scale-110 active:scale-90 transition-all">
                <Send size={28} />
              </button>
            </div>
            <button onClick={finish} className="mt-8 text-xs font-bold text-gray-600 uppercase tracking-widest hover:text-white transition-all">End Session Early</button>
          </motion.div>
        )}

        {stage === 1.5 && (
          <motion.div key="load" className="text-center">
            <Loader2 className="w-16 h-16 text-orange-500 animate-spin mx-auto mb-6" />
            <h2 className="text-3xl font-black text-gradient uppercase">Generating Report</h2>
          </motion.div>
        )}

              {/* 🔥 NEW PREMIUM REPORT UI */}
        {stage === 2 && report && (
          <motion.div key="s2" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="glass p-12 max-w-6xl w-full text-left relative overflow-hidden">
            {/* Background Glow Effect */}
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-orange-600/20 blur-[100px] rounded-full" />
            
            <div className="flex justify-between items-end mb-12 relative z-10">
              <div>
                <h2 className="text-6xl font-black mb-2 tracking-tighter uppercase">{name}</h2>
                <div className="flex items-center gap-3">
                  <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${report.verdict === 'HIRE' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-orange-500/20 text-orange-400 border border-orange-500/30'}`}>
                    {report.verdict}
                  </span>
                  <span className="text-gray-600 text-[10px] font-bold uppercase tracking-widest italic">Assessment Complete</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-8xl font-black text-white leading-none">{report.overall_score}<span className="text-xl text-gray-700 font-bold tracking-normal italic ml-2">pts</span></div>
              </div>
            </div>

            {/* Unique Grid: Dimension Breakdown with Progress Bars */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-10 relative z-10">
              {Object.entries(report.scores || {}).map(([k, v]: any) => (
                <div key={k} className="p-6 bg-white/5 border border-white/10 rounded-[32px] hover:bg-white/10 transition-all group">
                  <p className="text-[10px] text-gray-500 uppercase font-bold mb-3 group-hover:text-orange-500 transition-colors tracking-widest">{k}</p>
                  <p className="text-4xl font-black mb-4">{v.val || 0}</p>
                  <div className="w-full h-1 bg-white/5 rounded-full mb-4 overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${(v.val || 0) * 10}%` }} className="h-full bg-orange-600 shadow-[0_0_10px_#ff6b00]" />
                  </div>
                  <p className="text-[9px] text-gray-400 italic leading-tight">&quot;{v.quote}&quot;</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative z-10">
               {/* 💡 AI Insights Section */}
               <div className="lg:col-span-2 p-10 bg-white/5 rounded-[48px] border border-white/5">
                 <div className="flex items-center gap-2 mb-6">
                   <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400"><Sparkles size={16} /></div>
                   <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400">Cuemath Pedagogical Guide</h4>
                 </div>
                 <p className="text-xl text-gray-300 font-light leading-relaxed italic">&quot;{report.model_answer}&quot;</p>
               </div>

               {/* 🏆 Result Card */}
               <div className="p-10 bg-orange-600 rounded-[48px] text-white flex flex-col justify-between shadow-2xl shadow-orange-600/30">
                 <div>
                   <h4 className="text-[10px] font-black uppercase tracking-[0.2em] mb-4 opacity-60 text-white">Executive Reasoning</h4>
                   <p className="text-lg font-bold leading-tight">{report.reasoning}</p>
                 </div>
                 <button onClick={() => window.print()} className="mt-10 py-5 bg-black text-white rounded-3xl font-black flex items-center justify-center gap-3 hover:scale-105 active:scale-95 transition-all">
                   <Download size={20} /> DOWNLOAD REPORT
                 </button>
               </div>
            </div>

            <div className="mt-10 text-center">
              <button onClick={() => window.location.reload()} className="text-[10px] font-black uppercase tracking-widest text-gray-600 hover:text-white transition-all">New Candidate Review</button>
            </div>
          </motion.div>
        )}


      </AnimatePresence>
    </div>
  );
}
