"use client";
import { useState, useEffect } from 'react';

export default function SeosiriSupremeEngine() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState("seller"); // seller | buyer
  const [tab, setTab] = useState("intel"); // intel | journey | market | security

  const runSync = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/agent', {
        method: 'POST',
        body: JSON.stringify({ userId: "demo-user", role: role })
      });
      const json = await res.json();
      setData(json);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#050505] text-[#f0f0f0] font-sans selection:bg-blue-600">
      
      {/* 1. SUPREME SIDEBAR */}
      <aside className="w-full md:w-80 bg-black border-r border-white/5 p-10 flex flex-col justify-between md:fixed h-full z-50 shadow-2xl">
        <div className="space-y-12">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center font-black shadow-lg shadow-blue-600/30 text-white">S</div>
            <h1 className="text-xl font-black tracking-tighter">SEOSIRI <span className="block text-[8px] text-gray-500 tracking-[0.4em] uppercase">Core v4.0</span></h1>
          </div>
          
          <nav className="space-y-4 text-[10px] font-bold uppercase tracking-widest text-gray-500">
            <button onClick={()=>setTab("intel")} className={`w-full text-left p-4 rounded-xl transition-all ${tab === "intel" ? 'bg-blue-600 text-white' : 'hover:bg-white/5'}`}>Market Intelligence</button>
            <button onClick={()=>setTab("journey")} className={`w-full text-left p-4 rounded-xl transition-all ${tab === "journey" ? 'bg-blue-600 text-white' : 'hover:bg-white/5'}`}>Lead Journey</button>
            <button onClick={()=>setTab("security")} className={`w-full text-left p-4 rounded-xl transition-all ${tab === "security" ? 'bg-blue-600 text-white' : 'hover:bg-white/5'}`}>Trust & Compliance</button>
          </nav>
        </div>

        <div className="border-t border-white/5 pt-10">
          <p className="text-[9px] text-gray-600 uppercase tracking-[0.4em] leading-loose">System Architect<br/>
            <span className="text-white font-black text-xs">Momenul Ahmad</span><br/>
            License: seosiri.com
          </p>
        </div>
      </aside>

      {/* 2. COMMAND STAGE */}
      <main className="md:ml-80 flex-1 p-8 lg:p-20 overflow-y-auto">
        <header className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-16 gap-8">
          <div>
            <h2 className="text-5xl font-black tracking-tighter uppercase mb-4 italic">Command <span className="text-blue-600">Center</span></h2>
            <div className="flex gap-4 p-1 bg-white/5 rounded-full w-fit">
               <button onClick={()=>setRole("seller")} className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${role === "seller" ? 'bg-white text-black' : 'text-gray-500'}`}>Seller Mode</button>
               <button onClick={()=>setRole("buyer")} className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${role === "buyer" ? 'bg-white text-black' : 'text-gray-500'}`}>Buyer Mode</button>
            </div>
          </div>
          <button onClick={runSync} disabled={loading} className="w-full xl:w-auto bg-blue-600 text-white px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-2xl shadow-blue-600/40">
            {loading ? "Processing Global Intelligence..." : "Run Intelligence Sync"}
          </button>
        </header>

        {data && (
          <div className="animate-in fade-in slide-in-from-bottom-5 duration-700 space-y-12">
            
            {/* INTEL TAB */}
            {tab === "intel" && (
              <div className="grid grid-cols-12 gap-10">
                <section className="col-span-12 xl:col-span-8 bg-zinc-900/30 border border-white/10 p-12 rounded-[3.5rem] backdrop-blur-3xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-10 opacity-5 text-9xl font-black select-none italic text-blue-600">AI</div>
                  <h3 className="text-blue-500 font-black text-[10px] uppercase tracking-[0.5em] mb-10">Gap & Intent Analysis</h3>
                  <div className="text-gray-200 text-2xl font-light leading-relaxed whitespace-pre-wrap italic">
                    {data.intelligence.report}
                  </div>
                </section>
                <div className="col-span-12 xl:col-span-4 space-y-8">
                   <div className="bg-blue-600 p-10 rounded-[3rem] shadow-3xl">
                      <p className="text-white/60 text-[10px] font-black uppercase tracking-widest mb-4">Market Intent Score</p>
                      <div className="text-6xl font-black text-white">{data.intelligence.marketIntel.avg_intent_score}%</div>
                      <p className="mt-4 text-xs font-bold uppercase tracking-tighter">High Probability Fit</p>
                   </div>
                </div>
              </div>
            )}

            {/* JOURNEY TAB */}
            {tab === "journey" && (
              <div className="grid gap-6">
                <h3 className="text-gray-600 font-black text-[10px] uppercase tracking-widest mb-4">User Journey Cards</h3>
                {data.intelligence.leads.map((l: any, i: number) => (
                  <div key={i} className="bg-zinc-900/50 border border-white/5 p-10 rounded-[2.5rem] flex flex-col lg:flex-row justify-between items-center gap-10 hover:border-blue-600/50 transition-all group">
                    <div className="text-center lg:text-left">
                      <p className="font-black text-2xl mb-1">{l.name}</p>
                      <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest">Stage: {l.status}</p>
                    </div>
                    {/* Visual Journey Bar */}
                    <div className="flex-1 w-full h-1.5 bg-white/5 rounded-full overflow-hidden relative">
                       <div className="absolute h-full bg-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.5)]" style={{ width: `${60 + (i*10)}%` }}></div>
                    </div>
                    <div className="flex gap-4">
                       <button className="bg-white text-black px-8 py-3 rounded-xl font-black text-[10px] uppercase hover:scale-110 transition-all">ESP Draft</button>
                       <button className="bg-zinc-800 text-white px-8 py-3 rounded-xl font-black text-[10px] uppercase hover:bg-white hover:text-black transition-all">Social Connect</button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* SECURITY TAB */}
            {tab === "security" && (
              <div className="bg-zinc-900/30 border border-white/10 p-20 rounded-[4rem] text-center">
                 <h3 className="text-gray-500 font-black text-[10px] uppercase tracking-[0.5em] mb-12">Compliance Trust Signals</h3>
                 <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
                    <div className="p-6 border border-white/5 rounded-2xl opacity-40 hover:opacity-100 transition-all">
                       <p className="text-xs font-bold uppercase mb-2">GDPR</p>
                       <p className="text-[9px] text-green-500">COMPLIANT</p>
                    </div>
                    <div className="p-6 border border-white/5 rounded-2xl opacity-40 hover:opacity-100 transition-all">
                       <p className="text-xs font-bold uppercase mb-2">CCPA</p>
                       <p className="text-[9px] text-green-500">CERTIFIED</p>
                    </div>
                    <div className="p-6 border border-white/5 rounded-2xl opacity-40 hover:opacity-100 transition-all">
                       <p className="text-xs font-bold uppercase mb-2">Notion OAuth</p>
                       <p className="text-[9px] text-blue-500">ENCRYPTED</p>
                    </div>
                    <div className="p-6 border border-white/5 rounded-2xl opacity-40 hover:opacity-100 transition-all">
                       <p className="text-xs font-bold uppercase mb-2">GA4 / GSC</p>
                       <p className="text-[9px] text-blue-500">READ-ONLY</p>
                    </div>
                 </div>
              </div>
            )}

          </div>
        )}
      </main>
    </div>
  );
}