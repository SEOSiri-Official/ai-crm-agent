"use client";
import { useState } from 'react';

export default function SeosiriSupremeEngine() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runSync = async () => {
    setLoading(true);
    setError(null);
    setData(null);
    try {
      const res = await fetch('/api/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: "seller" })
      });
      const json = await res.json();
      
      if (json.status === "SUCCESS") {
        setData(json);
      } else {
        setError(json.message || "Unknown error occurred.");
      }
    } catch (e: any) {
      setError("Failed to connect to the Global Mainframe.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020202] text-[#f0f0f0] font-sans p-6 md:p-12 selection:bg-blue-600">
      
      {/* BRANDING */}
      <nav className="flex justify-between items-center mb-16 border-b border-white/5 pb-8">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center font-black shadow-lg shadow-blue-600/30">S</div>
          <h1 className="text-xl font-black uppercase tracking-tighter">SEOSIRI <span className="font-light text-gray-500">CORE</span></h1>
        </div>
        <div className="text-right text-[10px] uppercase font-bold text-gray-500 tracking-widest">
           Architect: <span className="text-white">Momenul Ahmad</span>
        </div>
      </nav>

      {/* ACTION HUB */}
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-5xl md:text-7xl font-black tracking-tighter mb-10 italic">SYSTEM <span className="text-blue-600">COMMAND</span></h2>
        
        <div className="flex flex-col md:flex-row gap-4 justify-center mb-16">
          <button onClick={() => window.open('/api/auth/notion')} className="bg-zinc-900 border border-white/5 px-8 py-3 rounded-xl font-bold text-[10px] uppercase hover:bg-white hover:text-black transition-all">Authorize Notion</button>
          <button onClick={() => window.open('/api/auth/google')} className="bg-zinc-900 border border-white/5 px-8 py-3 rounded-xl font-bold text-[10px] uppercase hover:bg-white hover:text-black transition-all">Authorize GSC/GA4</button>
        </div>

        <button 
          onClick={runSync} 
          disabled={loading}
          className="bg-blue-600 px-12 py-6 rounded-3xl font-black text-lg shadow-[0_0_60px_rgba(37,99,235,0.3)] hover:scale-105 active:scale-95 transition-all disabled:opacity-20"
        >
          {loading ? "SYNCHRONIZING..." : "RUN GLOBAL INTELLIGENCE"}
        </button>
      </div>

      {/* OUTPUT AREA */}
      <div className="max-w-6xl mx-auto mt-20">
        {error && (
          <div className="bg-red-600/10 border border-red-600/30 p-10 rounded-[2.5rem] text-red-500 text-center animate-pulse">
            <p className="font-black uppercase text-xs mb-2">Architectural Alert</p>
            <p className="font-medium">{error}</p>
          </div>
        )}

        {data && (
          <div className="grid grid-cols-12 gap-8 animate-in fade-in slide-in-from-bottom-5 duration-1000">
             <div className="col-span-12 lg:col-span-8 bg-zinc-900/40 border border-white/10 p-12 rounded-[3rem] backdrop-blur-3xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-5 text-8xl font-black text-blue-600">AI</div>
                <h3 className="text-blue-500 font-black text-[10px] uppercase tracking-widest mb-10">Strategic Report</h3>
                <p className="text-gray-200 text-xl md:text-2xl font-light italic leading-relaxed whitespace-pre-wrap">{data.report}</p>
             </div>
             <div className="col-span-12 lg:col-span-4 bg-blue-600 p-10 rounded-[3rem] shadow-3xl">
                <h3 className="font-black uppercase text-[10px] mb-8 text-white/70">Connected CRM Leads</h3>
                {data.leads.map((l:any, i:number) => (
                  <div key={i} className="flex justify-between items-center border-b border-white/20 pb-4 mb-4">
                    <span className="font-black text-sm">{l.name}</span>
                    <span className="text-[8px] bg-white text-black px-2 py-0.5 rounded font-bold italic">LIVE</span>
                  </div>
                ))}
             </div>
          </div>
        )}
      </div>

      {/* FOOTER */}
      <footer className="mt-40 pt-10 border-t border-white/5 text-center flex flex-col md:flex-row justify-between gap-6 opacity-30 text-[9px] font-black uppercase tracking-[0.4em]">
         <div className="flex gap-10"><span>SaaS READY</span><span>PaaS ACTIVE</span><span>IaaS POWERED</span></div>
         <p>© seosiri.com | Architected by Momenul Ahmad</p>
      </footer>
    </div>
  );
}