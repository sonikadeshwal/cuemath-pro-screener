"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, MicOff, Bot, Brain, Download, ArrowRight, Loader2, Sparkles } from "lucide-react";

export default function Page() {
  const [mounted, setMounted] = useState(false);
  const [stage, setStage] = useState(0); 
  const [name, setName] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [spoken, setSpoken] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const [report, setReport] = useState<any>(null);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const start = () => {
    if (!name) return alert("Enter name");
    setStage(1);
    const m = "Hi! I'm Rohan. My teacher says 1/2 is bigger than 1/4, but 4 is a bigger number than 2! Isn't she wrong?";
    setMessages([{ role: "bot", text: m }]);
    window.speechSynthesis.speak(new SpeechSynthesisUtterance(m));
  };

  const toggleMic = () => {
    const Rec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const rec = new Rec();
    rec.onresult = (e: any) => {
      const text = e.results[0][0].transcript;
      setSpoken(text);
      handleMsg(text);
    };
    rec.onstart = () => setIsListening(true);
    rec.onend = () => setIsListening(false);
    rec.start();
  };

  const handleMsg = async (text: string) => {
    const n = [...messages, { role: "user", text }];
    setMessages(n);
    const r = await fetch("/api/chat", { method: "POST", body: JSON.stringify({ message: text, history: messages }) });
    const d = await r.json();
    setMessages([...n, { role: "bot", text: d.reply }]);
    window.speechSynthesis.speak(new SpeechSynthesisUtterance(d.reply));
  };

  const finish = async () => {
    setStage(1.5);
    const r = await fetch("/api/evaluate", { method: "POST", body: JSON.stringify({ history: messages }) });
    const d = await r.json();
    setReport(d.report);
    setStage(2);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
      <AnimatePresence mode="wait">
        {stage === 0 && (
          <motion.div key="s0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass p-12 max-w-lg w-full">
            <Bot size={60} className="text-orange-500 mx-auto mb-6" />
            <h1 className="text-4xl font-black mb-4 text-gradient">Cuemath Screener</h1>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="Your Name" className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl mb-6 outline-none text-center" />
            <button onClick={start} className="w-full py-4 bg-orange-600 rounded-2xl font-bold uppercase tracking-widest hover:scale-105 transition-all">Start Interview</button>
          </motion.div>
        )}

        {stage === 1 && (
          <motion.div key="s1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl w-full">
            <div className="mb-12">
               <div className={`w-32 h-32 rounded-full border-4 mx-auto flex items-center justify-center mb-6 ${isListening ? 'border-orange-500 animate-pulse' : 'border-white/10'}`}>
                  <Bot size={60} className={isListening ? 'text-orange-500' : 'text-white/20'} />
               </div>
               <p className="text-2xl font-light leading-relaxed">{messages[messages.length-1]?.text}</p>
               {spoken && <p className="text-orange-400 mt-4 italic">"{spoken}"</p>}
            </div>
            <div className="flex gap-4 justify-center">
              <button onClick={toggleMic} className={`w-20 h-20 rounded-full flex items-center justify-center ${isListening ? 'bg-red-500' : 'bg-white text-black'}`}>{isListening ? <MicOff /> : <Mic />}</button>
              <button onClick={finish} className="px-10 py-4 glass font-bold hover:bg-white hover:text-black">FINISH</button>
            </div>
          </motion.div>
        )}

        {stage === 1.5 && <div className="text-center"><Loader2 className="animate-spin mx-auto mb-4 w-12 h-12 text-orange-500" /> <p className="text-2xl font-bold">Evaluating...</p></div>}

        {stage === 2 && report && (
          <motion.div key="s2" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1 }} className="glass p-12 max-w-4xl w-full text-left">
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-3xl font-black">{name}'s Result</h2>
              <div className="px-6 py-2 bg-orange-500/10 border border-orange-500 text-orange-500 rounded-full font-bold">{report.verdict}</div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
              {Object.entries(report.scores).map(([k, v]: any) => (
                <div key={k} className="bg-white/5 p-4 rounded-2xl text-center"><p className="text-[10px] text-gray-500 uppercase mb-1">{k}</p><p className="text-xl font-bold">{v.val}/10</p></div>
              ))}
            </div>
            <div className="p-6 bg-white/5 rounded-2xl mb-8 leading-relaxed border border-white/5"><Sparkles className="text-orange-500 mb-2" size={20} /> {report.reasoning}</div>
            <button onClick={async () => {
                const { jsPDF } = await import("jspdf");
                const doc = new jsPDF();
                doc.text(`${name}'s Cuemath Report`, 20, 20);
                doc.text(`Score: ${report.overall_score}/100`, 20, 30);
                doc.text(`Verdict: ${report.verdict}`, 20, 40);
                doc.save("Report.pdf");
            }} className="w-full py-4 bg-orange-600 rounded-2xl font-bold flex items-center justify-center gap-2"><Download size={20} /> Download PDF</button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
