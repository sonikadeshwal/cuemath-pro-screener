"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, MicOff, Bot, Brain, Download, Send, ArrowRight, Loader2, Sparkles } from "lucide-react";

export default function Page() {
  const [mounted, setMounted] = useState(false);
  const [stage, setStage] = useState(0); 
  const [name, setName] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [textInput, setTextInput] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const [report, setReport] = useState<any>(null);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const start = () => {
    if (!name.trim()) return alert("Enter your name");
    setStage(1);
    const m = "Hi! I'm Rohan. My teacher says 1/2 is bigger than 1/4, but 4 is bigger than 2! Why is that?";
    setMessages([{ role: "bot", text: m }]);
  };

  const toggleMic = () => {
    const Rec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!Rec) return alert("Browser not supported");
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
    const r = await fetch("/api/chat", { method: "POST", body: JSON.stringify({ message: text, history: messages }) });
    const d = await r.json();
    setMessages([...n, { role: "bot", text: d.reply }]);
  };

  const finish = async () => {
    setStage(1.5);
    try {
      const r = await fetch("/api/evaluate", { method: "POST", body: JSON.stringify({ history: messages }) });
      const d = await r.json();
      setReport(d.report);
      setStage(2);
    } catch (e) {
      setStage(1);
      alert("Failed to evaluate. Please talk more to Rohan.");
    }
  };

  return (
    <div className="min-h-screen bg-[#050508] text-white flex flex-col items-center justify-center p-6 text-center">
      <AnimatePresence mode="wait">
        {stage === 0 && (
          <motion.div key="s0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white/5 p-12 max-w-lg w-full rounded-[40px] border border-white/10">
            <Bot size={60} className="text-orange-500 mx-auto mb-6" />
            <h1 className="text-4xl font-black mb-4">Cuemath Pro</h1>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="Entry Candidate Name" className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl mb-6 outline-none text-center" />
            <button onClick={start} className="w-full py-4 bg-orange-600 rounded-2xl font-bold uppercase hover:scale-105 active:scale-95 transition-all">Enter Stage</button>
          </motion.div>
        )}

        {stage === 1 && (
          <motion.div key="s1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl w-full flex flex-col h-[80vh]">
            <div className="flex-1 overflow-y-auto mb-6 space-y-4 pr-4 custom-scrollbar">
               {messages.map((m, i) => (
                 <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] p-4 rounded-3xl ${m.role === 'user' ? 'bg-orange-600 text-white' : 'bg-white/5 border border-white/10'}`}>
                      {m.text}
                    </div>
                 </div>
               ))}
            </div>
            
            <div className="bg-white/5 border border-white/10 p-4 rounded-[32px] flex gap-4 items-center">
              <button onClick={toggleMic} className={`w-14 h-14 shrink-0 rounded-full flex items-center justify-center transition-all ${isListening ? 'bg-red-500 animate-pulse' : 'bg-white/5 text-white hover:bg-white/10'}`}>
                {isListening ? <MicOff /> : <Mic />}
              </button>
              <input 
                value={textInput} 
                onChange={e => setTextInput(e.target.value)}
                onKeyPress={e => e.key === 'Enter' && handleMsg(textInput)}
                placeholder="Type your explanation here..." 
                className="flex-1 bg-transparent outline-none text-lg" 
              />
              <button onClick={() => handleMsg(textInput)} className="w-14 h-14 shrink-0 bg-orange-600 rounded-full flex items-center justify-center hover:scale-110 transition-all">
                <Send size={24} />
              </button>
            </div>
            <button onClick={finish} className="mt-6 text-gray-500 font-bold hover:text-white transition-all">FINISH & SCORE</button>
          </motion.div>
        )}

        {stage === 1.5 && <div className="text-center"><Loader2 className="animate-spin mx-auto mb-4 w-12 h-12 text-orange-500" /> <p className="text-2xl font-bold text-gradient">Calculating Final Score...</p></div>}

        {stage === 2 && report && (
          <motion.div key="s2" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white/5 p-12 max-w-4xl w-full text-left rounded-[40px] border border-white/10">
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-4xl font-black">{name}</h2>
              <div className="text-5xl font-black text-orange-500">{report.overall_score}<span className="text-lg text-gray-600">/100</span></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
              {Object.entries(report.scores).map(([k, v]: any) => (
                <div key={k} className="bg-white/5 p-6 rounded-3xl text-center border border-white/5">
                  <p className="text-[10px] text-gray-400 uppercase mb-2">{k}</p>
                  <p className="text-2xl font-black">{v.val || 0}/10</p>
                </div>
              ))}
            </div>
            <div className="p-8 bg-orange-500/10 rounded-[32px] border border-orange-500/20 mb-8 leading-relaxed italic text-lg text-orange-200">"{report.reasoning}"</div>
            <div className="flex gap-4">
              <button onClick={() => window.print()} className="flex-1 py-4 bg-orange-600 rounded-2xl font-bold uppercase flex items-center justify-center gap-2"><Download size={20} /> Print as PDF</button>
              <button onClick={() => window.location.reload()} className="px-8 py-4 border border-white/10 rounded-2xl font-bold">RETRY</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
