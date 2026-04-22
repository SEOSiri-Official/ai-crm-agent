"use client";
import { useState, useEffect } from 'react';

export default function SeosiriDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetch('/api/agent').then(res => res.json()).then(json => {
      setData(json);
      setLoading(false);
    });
  }, []);

  if (!mounted) return null;

  return (
    <div className="flex min-h-screen bg-[#020202] text-white">
      {/* GLOBAL SIDEBAR */}
      <aside className="w-80 bg-black border-r border-white/10 p-10 flex flex-col justify-between fixed h-full shadow-2xl">
        <div className="space-y-16">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center font-black text-xl shadow-lg shadow-blue-600/30">S</div>
            <div>
               <h2 className="text-white font-black text-2xl tracking-tighter">SEOSIRI</h2>
               <span className="text-gray-500 text-[10px] uppercase font-bold tracking-widest">Global AI Engine</span>
            </div>
          </div>
          <nav className="space-y-8 text-[11px] font-bold text-gray-500 uppercase tracking-[0.25em]">
            <div className="text-blue-500 flex items-center gap-4 cursor-pointer">
              <span className="w-2 h-2 bg-blue-500 rounded-full animate-ping"></span> 
              Intelligence Center
            </div>
            <div className="hover:text-white transition-all cursor-pointer opacity-40 hover:opacity-100">CRM: Notion Leads</div>
            <div className="hover:text-white transition-all cursor-pointer opacity-40 hover:opacity-100">ESP: Resend Mailer</div>
            <div className="hover:text-white transition-all cursor-pointer opacity-40 hover:opacity-100">Social: Agent Hub</div>
          </nav>
        </div>
        <div className="border-t border-white/5 pt-10 text-[9px] text-gray-700 leading-loose">
          SYSTEM ARCHITECT: <span className="text-gray-400 font-bold">MOMENUL AHMAD</span><br/>
          PLATFORM: seosiri.com
        </div>
      </aside>

      {/* COMMAND STAGE */}
      <main className="ml-80 flex-1 p-20">
        <header className="flex justify-between items-start mb-24">
          <div>
            <h1 className="text-6xl font-black tracking-tighter">System <span className="text-blue-600">Sync</span></h1>
            <p className="text-gray-500 text-xl font-light mt-4 italic max-w-lg leading-relaxed">
              Autonomous Sales Agent architected for high-performance lead conversion.
            </p>
          </div>
          <div className="bg-zinc-900 border border-white/10 p-8 rounded-[2rem] text-center min-w-[200px]">
             <span className="text-[10px] text-blue-500 uppercase font-black tracking-widest block mb-2">Sync Status</span>
             <span className="text-2xl font-black">{data?.status === "INTEGRATED_SYSTEM_ACTIVE" ? "LIVE" : "IDLE"}</span>
          </div>
        </header>

        {loading ? (
          <div className="flex flex-col items-center justify-center h-64 gap-6">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <div className="text-blue-600 font-black text-xs tracking-[1em] uppercase">Loading AI Systems...</div>
          </div>
        ) : (
          <div className="grid grid-cols-12 gap-12">
            <div className="col-span-12 xl:col-span-8 bg-zinc-900/20 border border-white/5 p-12 rounded-[3rem] backdrop-blur-3xl shadow-inner shadow-white/5 relative overflow-hidden">
               <h3 className="text-blue-500 font-black uppercase text-xs tracking-widest mb-10">AI Strategy Report (Gemini)</h3>
               <div className="text-gray-300 text-xl leading-relaxed whitespace-pre-wrap italic font-light">
                 {data?.intelligence?.report || "Awaiting Intelligence..."}
               </div>
            </div>

            <div className="col-span-12 xl:col-span-4 space-y-12">
              <div className="bg-blue-600 p-12 rounded-[3rem] shadow-3xl shadow-blue-600/30">
                <h3 className="text-white font-black uppercase text-xs tracking-widest mb-6">CRM Integration</h3>
                <div className="space-y-4">
                  {data?.intelligence?.leads?.map((l: any, i: number) => (
                    <div key={i} className="flex justify-between items-center border-b border-white/10 pb-4">
                      <div className="font-bold text-sm truncate w-32">{l.name}</div>
                      <div className="text-[9px] bg-white text-black px-3 py-1 rounded-full font-black">ACTIVE</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}