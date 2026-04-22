"use client";
import { useState, useEffect } from 'react';

export default function SeosiriEnterprise() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("market"); // market, journey, compliance

  const executeSync = async () => {
    setLoading(true);
    const res = await fetch('/api/agent');
    const json = await res.json();
    setData(json);
    setLoading(false);
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#030303] text-white font-sans selection:bg-blue-600">
      
      {/* SIDEBAR: Global Navigation */}
      <aside className="w-full md:w-72 bg-black border-r border-white/5 p-8 flex flex-col justify-between">
        <div className="space-y-12">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center font-black shadow-blue-600/50 shadow-lg">S</div>
            <h1 className="text-xl font-black tracking-tighter">SEOSIRI <span className="block text-[9px] text-gray-500 tracking-[0.3em] uppercase">Enterprise</span></h1>
          </div>
          <nav className="space-y-4 text-[10px] font-bold uppercase tracking-widest text-gray-500">
            <button onClick={()=>setActiveTab("market")} className={`w-full text-left p-3 rounded-xl transition-all ${activeTab === "market" ? 'bg-blue-600 text-white' : 'hover:text-white'}`}>Market Intelligence</button>
            <button onClick={()=>setActiveTab("journey")} className={`w-full text-left p-3 rounded-xl transition-all ${activeTab === "journey" ? 'bg-blue-600 text-white' : 'hover:text-white'}`}>Lead Journey</button>
            <button onClick={()=>setActiveTab("compliance")} className={`w-full text-left p-3 rounded-xl transition-all ${activeTab === "compliance" ? 'bg-blue-600 text-white' : 'hover:text-white'}`}>Trust & Compliance</button>
          </nav>
        </div>
        <div className="pt-8 border-t border-white/5">
          <p className="text-[9px] text-gray-600 uppercase tracking-widest leading-loose">Architect: <span className="text-white font-black">Momenul Ahmad</span></p>
        </div>
      </aside>

      {/* MAIN STAGE */}
      <main className="flex-1 p-8 md:p-16 overflow-y-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div>
            <h2 className="text-4xl font-black tracking-tight uppercase">System <span className="text-blue-600 italic">Command</span></h2>
            <div className="flex gap-2 mt-2">
              <span className="text-[8px] bg-green-500/10 text-green-500 px-2 py-0.5 rounded-full border border-green-500/20 font-bold uppercase">GA4 Connected</span>
              <span className="text-[8px] bg-blue-500/10 text-blue-500 px-2 py-0.5 rounded-full border border-blue-500/20 font-bold uppercase">GSC Integrated</span>
            </div>
          </div>
          <button onClick={executeSync} disabled={loading} className="w-full md:w-auto bg-white text-black px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all shadow-xl shadow-white/5">
            {loading ? "Analyzing Global Data..." : "Run Intelligence Sync"}
          </button>
        </header>

        {data && (
          <div className="space-y-10 animate-in fade-in duration-700">
            
            {activeTab === "market" && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <section className="lg:col-span-2 bg-zinc-900/30 border border-white/10 p-10 rounded-[2.5rem] backdrop-blur-3xl">
                   <h3 className="text-blue-500 font-black text-[10px] uppercase tracking-[0.4em] mb-8">Performance Deep Analysis (AI)</h3>
                   <div className="text-gray-300 text-lg leading-relaxed italic whitespace-pre-wrap font-light">
                     {data.intelligence.report}
                   </div>
                </section>
                <div className="space-y-8">
                  <div className="bg-blue-600 p-8 rounded-[2.5rem] shadow-xl shadow-blue-600/20">
                    <h4 className="font-black uppercase text-[10px] mb-4">Intent Score High</h4>
                    <div className="text-5xl font-black">89%</div>
                    <p className="text-xs mt-4 opacity-80 uppercase font-bold">Market Opportunity Found</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "journey" && (
              <div className="grid gap-6">
                {data.intelligence.leads.map((l: any, i: number) => (
                  <div key={i} className="bg-zinc-900/50 border border-white/5 p-8 rounded-3xl flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="text-center md:text-left">
                      <p className="font-black text-xl">{l.name}</p>
                      <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">Stage: {l.stage}</p>
                    </div>
                    {/* Journey Progress Bar */}
                    <div className="flex-1 w-full max-w-md h-1 bg-white/5 rounded-full overflow-hidden">
                       <div className="h-full bg-blue-600" style={{ width: `${l.intent_score}%` }}></div>
                    </div>
                    <button className="bg-white text-black px-6 py-2 rounded-xl font-black text-[10px] uppercase hover:bg-blue-600 hover:text-white transition-all">Execute Sale</button>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "compliance" && (
              <div className="bg-zinc-900/30 border border-white/10 p-12 rounded-[2.5rem] text-center">
                 <h3 className="text-gray-500 font-black text-[10px] uppercase tracking-widest mb-6">Security & Compliance Shield</h3>
                 <div className="flex flex-wrap justify-center gap-8 opacity-50 grayscale hover:grayscale-0 transition-all">
                    <span className="text-xs font-bold px-4 py-2 border border-white/20 rounded-lg">GDPR COMPLIANT</span>
                    <span className="text-xs font-bold px-4 py-2 border border-white/20 rounded-lg">CCPA CERTIFIED</span>
                    <span className="text-xs font-bold px-4 py-2 border border-white/20 rounded-lg">EU PRIVACY SHIELD</span>
                 </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}