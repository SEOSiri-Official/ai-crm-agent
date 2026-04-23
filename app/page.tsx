"use client";
import { useState, useEffect } from 'react';

export default function SeosiriGlobalSaaS() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("market"); // market | journey | trust
  const [role, setRole] = useState("seller"); // seller | buyer

  const runSync = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/agent', { method: 'POST', body: JSON.stringify({ role }) });
      const json = await res.json();
      setData(json);
    } catch (e) { console.error("Sync Failed", e); }
    finally { setLoading(false); }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-[#030303] text-white font-sans">
      
      {/* 1. SUPREME SIDEBAR: Navigation Supreme */}
      <aside className="w-full lg:w-72 bg-black border-r border-white/5 p-8 flex flex-col justify-between lg:fixed h-full z-50 shadow-2xl">
        <div className="space-y-12">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center font-black shadow-lg shadow-blue-600/30">S</div>
            <h1 className="text-xl font-black tracking-tighter">SEOSIRI <span className="block text-[8px] text-gray-500 tracking-[0.3em] uppercase">Core v4.0</span></h1>
          </div>
          
          <nav className="space-y-3 text-[10px] font-bold uppercase tracking-widest text-gray-500">
            <button onClick={() => setActiveTab("market")} className={`w-full text-left p-4 rounded-xl transition-all ${activeTab === "market" ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" : "hover:bg-white/5"}`}>Market Intelligence</button>
            <button onClick={() => setActiveTab("journey")} className={`w-full text-left p-4 rounded-xl transition-all ${activeTab === "journey" ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" : "hover:bg-white/5"}`}>Lead Journey</button>
            <button onClick={() => setActiveTab("trust")} className={`w-full text-left p-4 rounded-xl transition-all ${activeTab === "trust" ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" : "hover:bg-white/5"}`}>Trust & Compliance</button>
          </nav>
        </div>

        <div className="pt-8 border-t border-white/5">
          <p className="text-[9px] text-gray-600 uppercase tracking-widest leading-loose">System Architect<br/>
            <span className="text-white font-black text-xs">Momenul Ahmad</span><br/>
            License: seosiri.com
          </p>
        </div>
      </aside>

      {/* 2. MAIN COMMAND STAGE */}
      <main className="lg:ml-72 flex-1 p-6 lg:p-16 overflow-y-auto">
        <header className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-16 gap-8">
          <div>
            <h2 className="text-5xl font-black tracking-tighter uppercase mb-4 italic">System <span className="text-blue-600">Command</span></h2>
            <div className="flex gap-4 p-1 bg-white/5 rounded-full w-fit">
               <button onClick={() => setRole("seller")} className={`px-6 py-2 rounded-full text-[9px] font-black uppercase tracking-widest transition-all ${role === "seller" ? 'bg-white text-black' : 'text-gray-500'}`}>Seller Mode</button>
               <button onClick={() => setRole("buyer")} className={`px-6 py-2 rounded-full text-[9px] font-black uppercase tracking-widest transition-all ${role === "buyer" ? 'bg-white text-black' : 'text-gray-500'}`}>Buyer Mode</button>
            </div>
          </div>
          <button onClick={runSync} disabled={loading} className="w-full xl:w-auto bg-blue-600 text-white px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-2xl shadow-blue-600/40">
            {loading ? "Analyzing Intent..." : "Run Intelligence Sync"}
          </button>
        </header>

        {data ? (
          <div className="animate-in fade-in slide-in-from-bottom-5 duration-700 space-y-12">
            
            {activeTab === "market" && (
              <div className="grid grid-cols-12 gap-10">
                <section className="col-span-12 xl:col-span-8 bg-zinc-900/30 border border-white/10 p-10 rounded-[3rem] backdrop-blur-3xl relative overflow-hidden group hover:border-blue-500/30 transition-all">
                  <div className="absolute top-0 right-0 p-10 opacity-5 text-9xl font-black italic select-none text-blue-600 group-hover:opacity-20 transition-opacity">AI</div>
                  <h3 className="text-blue-500 font-black text-[10px] uppercase tracking-[0.5em] mb-10">Gap & Intent Report</h3>
                  <div className="text-gray-200 text-xl font-light leading-relaxed whitespace-pre-wrap italic">
                    {data.intelligence.report}
                  </div>
                </section>
                <div className="col-span-12 xl:col-span-4 space-y-8 text-center">
                   <div className="bg-blue-600 p-10 rounded-[3rem] shadow-3xl">
                      <p className="text-white/60 text-[10px] font-black uppercase tracking-widest mb-4">Market Intent Score</p>
                      <div className="text-7xl font-black text-white">84%</div>
                      <p className="mt-4 text-[10px] font-bold uppercase tracking-widest border border-white/20 inline-block px-4 py-1 rounded-full">Fit Validated</p>
                   </div>
                </div>
              </div>
            )}

            {activeTab === "journey" && (
              <div className="space-y-6">
                <h3 className="text-gray-500 font-black text-[10px] uppercase tracking-widest mb-4">Notion Lead Journeys</h3>
                {data.intelligence.leads.map((l: any, i: number) => (
                  <div key={i} className="bg-zinc-900/40 border border-white/5 p-10 rounded-[2.5rem] flex flex-col xl:flex-row justify-between items-center gap-10 hover:border-blue-600/30 transition-all">
                    <div className="text-center xl:text-left">
                      <p className="font-black text-2xl mb-1">{l.name}</p>
                      <p className="text-[10px] text-blue-500 uppercase font-black tracking-widest">Role Assigned: {role}</p>
                    </div>
                    <div className="flex-1 w-full h-1 bg-white/5 rounded-full overflow-hidden relative">
                       <div className="absolute h-full bg-blue-600" style={{ width: `${70 + (i*5)}%` }}></div>
                    </div>
                    <div className="flex gap-4">
                       <button onClick={() => alert("Drafting ESP via Resend...")} className="bg-white text-black px-8 py-3 rounded-xl font-black text-[10px] uppercase hover:bg-blue-600 hover:text-white transition-all">ESP Draft</button>
                       <button onClick={() => alert("LinkedIn Script Copied")} className="bg-zinc-800 text-white px-8 py-3 rounded-xl font-black text-[10px] uppercase hover:bg-white hover:text-black transition-all">Social Script</button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "trust" && (
              <div className="bg-zinc-900/30 border border-white/10 p-20 rounded-[4rem] text-center backdrop-blur-3xl">
                 <h3 className="text-gray-500 font-black text-[10px] uppercase tracking-[0.6em] mb-16">Data Governance Shields</h3>
                 <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
                    <div className="p-8 border border-white/5 rounded-[2rem] bg-black/50 shadow-xl opacity-60 hover:opacity-100 hover:border-blue-500/20 transition-all group">
                       <p className="text-xs font-black uppercase mb-2 group-hover:text-blue-500">GDPR</p>
                       <p className="text-[8px] tracking-widest text-green-500 font-bold">COMPLIANT</p>
                    </div>
                    <div className="p-8 border border-white/5 rounded-[2rem] bg-black/50 shadow-xl opacity-60 hover:opacity-100 hover:border-blue-500/20 transition-all group">
                       <p className="text-xs font-black uppercase mb-2 group-hover:text-blue-500">CCPA</p>
                       <p className="text-[8px] tracking-widest text-green-500 font-bold">CERTIFIED</p>
                    </div>
                    <div className="p-8 border border-white/5 rounded-[2rem] bg-black/50 shadow-xl opacity-60 hover:opacity-100 hover:border-blue-500/20 transition-all group">
                       <p className="text-xs font-black uppercase mb-2 group-hover:text-blue-500">AES-256</p>
                       <p className="text-[8px] tracking-widest text-blue-500 font-bold">ENCRYPTED</p>
                    </div>
                    <div className="p-8 border border-white/5 rounded-[2rem] bg-black/50 shadow-xl opacity-60 hover:opacity-100 hover:border-blue-500/20 transition-all group">
                       <p className="text-xs font-black uppercase mb-2 group-hover:text-blue-500">OAuth</p>
                       <p className="text-[8px] tracking-widest text-blue-500 font-bold">AUTHORIZED</p>
                    </div>
                 </div>
              </div>
            )}

          </div>
        ) : (
          <div className="h-[50vh] flex flex-col items-center justify-center opacity-30 text-center space-y-4">
             <div className="w-12 h-12 border-2 border-white/20 border-t-blue-600 rounded-full animate-spin"></div>
             <p className="text-xs font-bold uppercase tracking-widest">Waiting for Global Synchronization...</p>
          </div>
        )}
      </main>
    </div>
  );
}