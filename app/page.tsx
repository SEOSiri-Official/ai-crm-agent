"use client";
import { useState } from 'react';

export default function SeosiriSupremeMainframe() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("intel");
  const [role, setRole] = useState("seller");
  const [error, setError] = useState<string | null>(null);

  const runSync = async () => {
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
    <div className="flex flex-col lg:flex-row min-h-screen bg-[#020202] text-[#f2f2f2] font-sans selection:bg-blue-600">
      
      {/* 1. GLOBAL NAVIGATION */}
      <aside className="w-full lg:w-80 bg-black border-r border-white/5 p-10 flex flex-col justify-between lg:fixed h-full z-50">
        <div className="space-y-12">
          <div className="flex items-center gap-4 cursor-pointer" onClick={()=>window.location.reload()}>
            <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center font-black shadow-2xl">S</div>
            <h1 className="text-xl font-black tracking-tighter uppercase italic">SEOSIRI <span className="block text-[8px] text-gray-500 not-italic uppercase font-bold">Core v10.0</span></h1>
          </div>
          <nav className="space-y-4 text-[10px] font-bold uppercase tracking-widest text-gray-500">
            <button onClick={()=>setActiveTab("intel")} className={`w-full text-left p-4 rounded-xl transition-all ${activeTab==='intel'?'bg-blue-600 text-white shadow-xl':'hover:bg-white/5'}`}>Market Intelligence</button>
            <button onClick={()=>setActiveTab("journey")} className={`w-full text-left p-4 rounded-xl transition-all ${activeTab==='journey'?'bg-blue-600 text-white shadow-xl':'hover:bg-white/5'}`}>Lead Journey</button>
            <button onClick={()=>setActiveTab("trust")} className={`w-full text-left p-4 rounded-xl transition-all ${activeTab==='trust'?'bg-blue-600 text-white shadow-xl':'hover:bg-white/5'}`}>Trust & Compliance</button>
          </nav>
        </div>
        <div className="pt-8 border-t border-white/5">
           <p className="text-[9px] text-gray-600 uppercase tracking-widest leading-loose">Architect: <span className="text-white font-black">Momenul Ahmad</span><br/>SaaS / PaaS / IaaS Active</p>
        </div>
      </aside>

      {/* 2. COMMAND CENTER */}
      <main className="lg:ml-80 flex-1 p-8 lg:p-20">
        <header className="flex flex-col xl:flex-row justify-between items-start gap-10 mb-20">
          <div>
            <h2 className="text-6xl font-black tracking-tighter uppercase italic mb-4">Command <span className="text-blue-600">Center</span></h2>
            <div className="flex gap-4 p-1 bg-white/5 rounded-full w-fit">
               <button onClick={()=>setRole("seller")} className={`px-6 py-2 rounded-full text-[9px] font-black uppercase transition-all ${role === 'seller' ? 'bg-white text-black' : 'text-gray-500'}`}>Seller Mode</button>
               <button onClick={()=>setRole("buyer")} className={`px-6 py-2 rounded-full text-[9px] font-black uppercase transition-all ${role === 'buyer' ? 'bg-white text-black' : 'text-gray-500'}`}>Buyer Mode</button>
            </div>
          </div>
          <button onClick={runSync} disabled={loading} className="bg-blue-600 text-white px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 shadow-2xl">
            {loading ? "Synchronizing..." : "Initialize Global Sync"}
          </button>
        </header>

        {error && (
          <div className="bg-red-600/10 border border-red-600/30 p-10 rounded-[3rem] text-red-500 text-center animate-pulse">
            <p className="font-black uppercase text-xs mb-2">Architectural Warning</p>
            <p className="font-medium text-sm">{error}</p>
          </div>
        )}

        {data ? (
          <div className="animate-in fade-in slide-in-from-bottom-5 duration-700 space-y-16">
            {activeTab === "intel" && (
              <div className="grid grid-cols-12 gap-10">
                <section className="col-span-12 xl:col-span-8 bg-zinc-900/40 border border-white/10 p-10 rounded-[3.5rem] backdrop-blur-3xl relative">
                  <h3 className="text-blue-500 font-black text-[10px] uppercase tracking-[0.5em] mb-10 border-b border-white/5 pb-8">Strategic Intelligence Hub</h3>
                  <div className="text-gray-200 text-2xl font-light leading-relaxed whitespace-pre-wrap italic">{data.intelligence.report}</div>
                </section>
                <div className="col-span-12 xl:col-span-4 bg-blue-600 p-12 rounded-[4rem] text-center shadow-3xl flex flex-col justify-center">
                    <p className="text-white/60 text-[10px] font-black uppercase tracking-widest mb-4 italic">GA4 Conversion probability</p>
                    <div className="text-9xl font-black text-white">{data.intelligence.intentScore}%</div>
                    <p className="mt-8 text-[10px] font-bold uppercase border border-white/20 px-4 py-2 rounded-full inline-block mx-auto italic">Market Fit Verified</p>
                </div>
              </div>
            )}
            {activeTab === "journey" && (
              <div className="space-y-6">
                <h3 className="text-gray-500 font-black text-[10px] uppercase tracking-widest px-4 mb-4">Autonomous Journey Cards</h3>
                {data.intelligence.leads.map((l: any, i: number) => (
                  <div key={i} className="bg-zinc-900/40 border border-white/5 p-10 rounded-[2.5rem] flex flex-col xl:flex-row justify-between items-center gap-10">
                    <div className="text-center xl:text-left">
                       <p className="font-black text-2xl text-white truncate w-48">{l.name}</p>
                       <p className="text-[9px] text-blue-500 uppercase font-bold tracking-widest">Connected via Notion</p>
                    </div>
                    <div className="flex-1 w-full h-1 bg-white/5 rounded-full overflow-hidden relative">
                        <div className="absolute h-full bg-blue-600" style={{ width: `${60 + (i*9)}%` }}></div>
                    </div>
                    <div className="flex gap-4">
                       <button onClick={()=>window.open(`mailto:${l.email}`)} className="bg-white text-black px-8 py-3 rounded-xl font-black text-[10px] uppercase hover:bg-blue-600 hover:text-white transition-all">Execute ESP</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : !error && (
          <div className="h-[40vh] flex flex-col items-center justify-center opacity-20 text-center space-y-6">
             <div className="w-12 h-12 border-4 border-white/10 border-t-blue-600 rounded-full animate-spin"></div>
             <p className="text-[10px] font-black uppercase tracking-[1em] animate-pulse text-blue-500">Establishing Core Bridge...</p>
          </div>
        )}

        <footer className="mt-40 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8 opacity-40 text-[9px] font-black uppercase tracking-[0.5em]">
           <div className="flex gap-10"><span>SaaS READY</span><span>PaaS ACTIVE</span><span>IaaS POWERED</span></div>
           <p>© seosiri.com | Architected by Momenul Ahmad</p>
        </footer>
      </main>
    </div>
  );
}