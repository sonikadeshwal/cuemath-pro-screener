        {stage === 2 && report && (
          <motion.div key="s2" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1 }} className="glass p-12 max-w-5xl w-full text-left">
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-4xl font-black">{name}&apos;s Scorecard</h2>
              <div className="px-8 py-3 bg-white/5 border border-orange-500 text-orange-500 rounded-full font-black text-xl">{report.verdict}</div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-10">
              {Object.entries(report.scores).map(([k, v]: any) => (
                <div key={k} className="p-6 bg-white/5 border border-white/5 rounded-3xl">
                  <p className="text-[10px] text-gray-500 uppercase mb-2 font-bold">{k}</p>
                  <p className="text-2xl font-black mb-2">{v.val}/10</p>
                  <p className="text-[9px] text-blue-400 font-medium italic leading-tight">"{v.quote}"</p>
                </div>
              ))}
            </div>

            <div className="p-8 bg-white/5 rounded-[40px] mb-10 border border-white/5 relative overflow-hidden">
               <div className="absolute top-0 right-0 p-4 opacity-10"><Sparkles size={40} /></div>
               <h4 className="text-xs font-bold text-orange-500 uppercase mb-4 tracking-widest">Executive Summary</h4>
               <p className="text-lg text-gray-300 font-light leading-relaxed">{report.reasoning}</p>
            </div>

            <div className="flex justify-center gap-6">
               <button onClick={() => window.print()} className="px-12 py-5 bg-orange-600 rounded-3xl font-black text-xl flex items-center gap-3 shadow-2xl shadow-orange-600/40 hover:scale-105 transition-all"><Download /> Save Report</button>
               <button onClick={() => window.location.reload()} className="px-12 py-5 bg-white/5 border border-white/10 rounded-3xl font-black text-gray-500 hover:text-white">Restart Assessment</button>
            </div>
          </motion.div>
        )}
