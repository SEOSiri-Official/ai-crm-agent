"use client";
import { useState } from 'react';

export default function SeosiriFinalMainframe() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState("intel");
  const [role, setRole] = useState("seller");

  const runGlobalSync = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role, userId: "admin" })
      });
      const json = await res.json();
      if (json.status === "ERROR") throw new Error(json.message);
      setData(json);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-[#020202] text-[#e0e0e0] font-sans">
      
      {/* 1. SIDEBAR: THE ARCHITECT'S VISION */}
      <aside className="w-full lg:w-80 bg-black border-r border-white/5 p-10 flex flex-col justify-between lg:fixed h-full z-50 shadow-2xl">
        <div className="space-y-12">
          <div className="flex items-center gap-4 cursor-pointer" onClick={()=>window.location.reload()}>
            <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center font-black shadow-2xl">S</div>
            <h1 className="text-xl font-black tracking-tighter uppercase italic">SEOSIRI <span className="block text-[8px] text-gray-600 not-italic uppercase tracking-widest font-bold">Core v10.0</span></h1>
          </div>
          <nav className="space-y-4 text-[10px] font-bold uppercase tracking-widest text-gray-500">
            <button onClick={()=>setTab("intel")} className={`w-full text-left p-4 rounded-xl transition-all ${tab==='intel'?'bg-blue-600 text-white shadow-xl':'hover:bg-white/5'}`}>Market Intelligence</button>
            <button onClick={()=>setTab("journey")} className={`w-full text-left p-4 rounded-xl transition-all ${tab==='journey'?'bg-blue-600 text-white shadow-xl':'hover:bg-white/5'}`}>Lead Journey</button>
            <button onClick={()=>setTab("inventory")} className={`w-full text-left p-4 rounded-xl transition-all ${tab==='inventory'?'bg-blue-600 text-white shadow-xl':'hover:bg-white/5'}`}>Feature Inventory</button>
            <button onClick={()=>setTab("trust")} className={`w-full text-left p-4 rounded-xl transition-all ${tab==='trust'?'bg-blue-600 text-white shadow-xl':'hover:bg-white/5'}`}>Trust & Compliance</button>
          </nav>
        </div>
        <div className="pt-8 border-t border-white/5">
           <p className="text-[9px] text-gray-600 uppercase tracking-widest leading-loose font-bold italic">Architect: <span className="text-white">Momenul Ahmad</span></p>
           <p className="text-[8px] text-blue-500 mt-1 uppercase font-black tracking-tighter">SaaS / PaaS / IaaS Active</p>
        </div>
      </aside>

      {/* 2. COMMAND STAGE */}
      <main className="lg:ml-80 flex-1 p-8 lg:p-20 overflow-y-auto">
        <header className="flex flex-col xl:flex-row justify-between items-start gap-10 mb-20">
          <div>
            <h2 className="text-6xl font-black tracking-tighter uppercase italic leading-none mb-4 tracking-[-0.05em]">Command <span className="text-blue-600">Center</span></h2>
            <div className="flex gap-4 p-1 bg-white/5 rounded-full w-fit">
               <button onClick={()=>setRole("seller")} className={`px-6 py-2 rounded-full text-[9px] font-black uppercase transition-all ${role === 'seller' ? 'bg-white text-black' : 'text-gray-500'}`}>Seller Mode</button>
               <button onClick={()=>setRole("buyer")} className={`px-6 py-2 rounded-full text-[9px] font-black uppercase transition-all ${role === 'buyer' ? 'bg-white text-black' : 'text-gray-500'}`}>Buyer Mode</button>
            </div>
          </div>
          <button onClick={runGlobalSync} disabled={loading} className="bg-blue-600 text-white px-12 py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-[0_0_40px_rgba(37,99,235,0.4)]">
            {loading ? "INITIALIZING MAINCORE..." : "Initialize Global Sync"}
          </button>
        </header>

        {error && (
          <div className="bg-red-600/10 border border-red-600/30 p-10 rounded-[3rem] text-red-500 text-center animate-pulse max-w-2xl mx-auto">
            <p className="font-black uppercase text-xs mb-2 tracking-widest">Architectural Alarm</p>
            <p className="font-medium text-sm">{error}</p>
          </div>
        )}

        {data ? (
          <div className="animate-in fade-in slide-in-from-bottom-5 duration-700 space-y-16">
            
            {tab === "intel" && (
              <div className="grid grid-cols-12 gap-10">
                <section className="col-span-12 xl:col-span-8 bg-zinc-900/30 border border-white/10 p-12 rounded-[4rem] backdrop-blur-3xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-10 opacity-5 text-9xl font-black italic text-blue-600">AI</div>
                  <h3 className="text-blue-500 font-black text-[10px] uppercase tracking-[0.6em] mb-12 border-b border-white/5 pb-8">Strategic Intelligence Hub</h3>
                  <div className="text-gray-200 text-2xl font-light leading-relaxed whitespace-pre-wrap italic">
                    {data.intelligence.report}
                  </div>
                  <div className="mt-12 flex gap-4 pt-10 border-t border-white/5">
                     <button onClick={()=>window.print()} className="bg-white text-black px-8 py-3 rounded-xl font-black text-[9px] uppercase tracking-widest">Download PDF Report</button>
                     <button className="bg-zinc-800 text-white px-8 py-3 rounded-xl font-black text-[9px] uppercase tracking-widest">Share ID: {data.intelligence.shareId.substring(0,8)}</button>
                  </div>
                </section>
                <div className="col-span-12 xl:col-span-4 bg-blue-600 p-12 rounded-[4rem] text-center flex flex-col justify-center shadow-3xl">
                    <p className="text-white/60 text-[10px] font-black uppercase tracking-widest mb-4 italic">GA4 Conversion Probability</p>
                    <div className="text-9xl font-black text-white">{data.intelligence.intentScore}%</div>
                    <p className="mt-8 text-[10px] font-bold uppercase tracking-widest border border-white/20 inline-block px-6 py-2 rounded-full mx-auto italic">Market Fit Verified</p>
                </div>
              </div>
            )}

            {tab === "inventory" && (
              <div className="bg-zinc-900/40 border border-white/10 p-16 rounded-[4rem]">
                 <h3 className="text-gray-500 font-black text-[10px] uppercase tracking-[0.8em] mb-12 text-center">System Feature Matrix</h3>
                 <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {["Notion Write-back", "GSC Analysis", "GA4 Intent Sync", "ESP Execute", "LinkedIn Protocol", "Voice Search Schema", "Gap Analysis", "Multi-tenant Vault", "GEO Visibility"].map((f, i) => (
                      <div key={i} className="flex items-center gap-4 bg-black/40 p-5 rounded-2xl border border-white/5">
                         <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                         <p className="text-xs font-bold uppercase tracking-widest">{f}</p>
                      </div>
                    ))}
                 </div>
              </div>
            )}

          </div>
        ) : !error && (
          <div className="h-[40vh] flex flex-col items-center justify-center opacity-20 text-center space-y-6">
             <div className="w-12 h-12 border-4 border-white/10 border-t-blue-600 rounded-full animate-spin"></div>
             <p className="text-[10px] font-black uppercase tracking-[1em] animate-pulse italic text-blue-500">Establishing SEOSIRI Mainframe Connection...</p>
          </div>
        )}
      </main>
    </div>
  );
}