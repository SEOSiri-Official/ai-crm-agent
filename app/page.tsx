"use client";
import { useState } from 'react';

export default function Page() {
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  async function runAgent() {
    setLoading(true);
    setIsError(false);
    try {
      const res = await fetch('/api/agent');
      const data = await res.json();
      
      if (data.intelligence?.report) {
        setAnalysis(data.intelligence.report);
      } else {
        // RESILIENCE: Catch the specific synchronization error detail
        setIsError(true);
        setAnalysis(`SYSTEM ALERT: ${data.details || data.error || "Unknown Sync Issue"}`);
      }
    } catch (e) {
      setIsError(true);
      setAnalysis("CRITICAL: Global Intelligence Gateway Offline.");
    }
    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-black text-white selection:bg-blue-500/30">
      {/* SUPREME NAVIGATION */}
      <nav className="p-8 flex justify-between items-center border-b border-white/5 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center font-black shadow-lg shadow-blue-600/20">S</div>
          <span className="text-2xl font-black tracking-tighter">SEOSIRI <span className="text-gray-500 font-light">CORE</span></span>
        </div>
        <div className="text-right">
          <p className="text-[10px] text-gray-500 uppercase tracking-widest leading-none">Architect</p>
          <p className="text-sm font-bold text-white tracking-tight">Momenul Ahmad</p>
        </div>
      </nav>

      {/* HERO SECTION */}
      <div className="max-w-5xl mx-auto text-center pt-32 px-6">
        <div className="inline-block px-4 py-1 mb-8 border border-blue-500/30 rounded-full bg-blue-500/5 text-blue-400 text-[10px] font-bold tracking-[0.3em] uppercase">
          Autonomous Sales Intelligence v2.5
        </div>
        
        <h1 className="text-6xl md:text-8xl font-black mb-10 leading-[0.85] tracking-tighter">
          THE ULTIMATE <br/>
          <span className="text-blue-600">AI SALES ENGINE</span>
        </h1>
        
        <p className="max-w-2xl mx-auto text-xl text-gray-400 mb-16 leading-relaxed font-light italic">
          Designed by <span className="text-white font-medium">seosiri.com</span> to transform Notion CRM data into high-performance revenue growth.
        </p>

        {/* INTERACTIVE AGENT AREA */}
        <div className="max-w-3xl mx-auto">
          {!analysis ? (
            <button 
              onClick={runAgent}
              disabled={loading}
              className="group relative px-12 py-6 bg-white text-black rounded-2xl font-black text-lg hover:scale-105 transition-all shadow-2xl shadow-white/10 disabled:opacity-50"
            >
              <span className={loading ? "opacity-0" : "opacity-100"}>LAUNCH GLOBAL INTELLIGENCE</span>
              {loading && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-6 h-6 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
            </button>
          ) : (
            <div className={`mt-4 p-10 border ${isError ? 'border-red-500/30 bg-red-500/5' : 'border-blue-500/30 bg-blue-500/5'} rounded-[2.5rem] text-left backdrop-blur-3xl animate-in fade-in slide-in-from-bottom-10 duration-1000`}>
              <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-6">
                <div>
                  <span className={`${isError ? 'text-red-500' : 'text-blue-500'} font-black tracking-[0.2em] uppercase text-xs`}>
                    {isError ? "System Diagnostics" : "Intelligence Report"}
                  </span>
                  <p className="text-gray-500 text-[10px] mt-1 uppercase">ID: {Math.random().toString(36).substr(2, 9)}</p>
                </div>
                <button 
                  onClick={() => {setAnalysis(null); setIsError(false);}} 
                  className="text-[10px] text-gray-500 hover:text-white uppercase tracking-widest font-bold"
                >
                  Reset Engine
                </button>
              </div>
              
              <div className={`prose prose-invert max-w-none ${isError ? 'text-red-200' : 'text-gray-200'} leading-relaxed text-xl font-light whitespace-pre-wrap`}>
                {analysis}
              </div>

              {!isError && (
                <div className="mt-10 pt-8 border-t border-white/10 flex gap-4">
                  <div className="px-4 py-2 bg-blue-600/20 border border-blue-500/30 rounded-lg text-[10px] font-black uppercase text-blue-400">ESP READY</div>
                  <div className="px-4 py-2 bg-zinc-900 border border-white/10 rounded-lg text-[10px] font-black uppercase text-gray-500 text-white">LinkedIn Protocol Active</div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* GLOBAL FOOTER */}
      <footer className="mt-40 py-10 border-t border-white/5 text-center text-[10px] text-gray-600 tracking-[0.5em] uppercase">
        © seosiri.com | Architected by Momenul Ahmad
      </footer>
    </main>
  );
}