"use client";
import { useState } from 'react';

export default function SeosiriSupremeMainframe() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState("intel");
  const [role, setRole] = useState("seller");
  const [error, setError] = useState<string | null>(null);

  const runSync = async () => {
    setLoading(true); setError(null);
    try {
      const res = await fetch('/api/agent', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role, userId: "admin" })
      });
      const json = await res.json();
      if (json.status === "ERROR") throw new Error(json.message);
      setData(json);
    } catch (e: any) { setError(e.message); }
    finally { setLoading(false); }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-[#020202] text-[#e5e5e5] font-sans">
      
      {/* 1. SIDEBAR */}
      <aside className="w-full lg:w-80 bg-black border-r border-white/5 p-10 flex flex-col justify-between lg:fixed h-full z-40 shadow-2xl">
        <div className="space-y-12">
          <div className="flex items-center gap-4 cursor-pointer" onClick={()=>window.location.reload()}>
            <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center font-black">S</div>
            <h1 className="text-xl font-black uppercase italic">SEOSIRI <span className="block text-[8px] text-gray-500 font-bold not-italic tracking-widest uppercase">Mainframe v16.0</span></h1>
          </div>
          <nav className="space-y-4 text-[10px] font-bold uppercase tracking-widest text-gray-500">
            <button onClick={()=>setTab("intel")} className={`w-full text-left p-4 rounded-xl transition-all ${tab==='intel'?'bg-blue-600 text-white shadow-xl':'hover:bg-white/5'}`}>Market Performance</button>
            <button onClick={()=>setTab("journey")} className={`w-full text-left p-4 rounded-xl transition-all ${tab==='journey'?'bg-blue-600 text-white shadow-xl':'hover:bg-white/5'}`}>Lead Journey</button>
          </nav>
        </div>
        <div className="pt-8 border-t border-white/5">
           <p className="text-[10px] text-gray-600 uppercase font-black">Architect: <span className="text-white">Momenul Ahmad</span><br/>info@seosiri.com</p>
        </div>
      </aside>

      {/* 2. MAIN COMMAND STAGE */}
      <main className="lg:ml-80 flex-1 p-8 lg:p-20 overflow-y-auto mb-32">
        <header className="flex flex-col xl:flex-row justify-between items-start gap-10 mb-20">
          <div><h2 className="text-6xl font-black tracking-tighter italic mb-4">Command <span className="text-blue-600">Center</span></h2>
            <div className="flex gap-4 p-1 bg-white/5 rounded-full w-fit">
               <button onClick={()=>setRole("seller")} className={`px-8 py-2 rounded-full text-[9px] font-black transition-all ${role==='seller'?'bg-white text-black':'text-gray-500'}`}>Seller Mode</button>
               <button onClick={()=>setRole("buyer")} className={`px-8 py-2 rounded-full text-[9px] font-black transition-all ${role==='buyer'?'bg-white text-black':'text-gray-500'}`}>Buyer Mode</button>
            </div>
          </div>
          <div className="flex gap-4">
             <button onClick={()=>window.open('/api/auth/google')} className="bg-zinc-900 border border-white/10 px-8 py-4 rounded-2xl font-black text-[9px] uppercase hover:bg-white hover:text-black">Authorize GSC</button>
             <button onClick={runSync} disabled={loading} className="bg-blue-600 text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 shadow-2xl">
                {loading ? "INITIALIZING MAINCORE..." : "Initialize Global Sync"}
             </button>
          </div>
        </header>

        {error && <div className="max-w-2xl mx-auto bg-red-600/10 border border-red-600/30 p-10 rounded-[3rem] text-red-500 text-center animate-pulse mb-10">{error}</div>}

        {data ? (
          <div className="animate-in fade-in slide-in-from-bottom-5 duration-1000 space-y-12">
            {tab === "intel" && (
              <div className="grid grid-cols-12 gap-10">
                <section className="col-span-12 xl:col-span-8 bg-zinc-900/30 border border-white/10 p-12 rounded-[4rem] backdrop-blur-3xl italic text-xl leading-relaxed text-gray-300">
                  {data.report}
                </section>
                <div className="col-span-12 xl:col-span-4 bg-blue-600 p-12 rounded-[4rem] text-center flex flex-col justify-center shadow-3xl">
                    <p className="text-white/60 text-[10px] font-black uppercase tracking-widest mb-4 italic">GA4 Conversion probability</p>
                    <div className="text-9xl font-black text-white">{data.intentScore}%</div>
                    <p className="mt-8 text-[10px] font-bold uppercase border border-white/20 px-4 py-2 rounded-full inline-block mx-auto italic">Market Fit Verified</p>
                </div>
              </div>
            )}
            {tab === "journey" && (
              <div className="grid gap-6">
                <h3 className="text-gray-500 font-black text-[10px] uppercase tracking-widest px-4 mb-4">Autonomous Journey Management</h3>
                {data.leads.map((l: any, i: number) => (
                  <div key={i} className="bg-zinc-900/40 border border-white/5 p-10 rounded-[2.5rem] flex flex-col xl:flex-row justify-between items-center gap-10 hover:border-blue-600/30 transition-all shadow-xl">
                    <div><p className="font-black text-2xl text-white truncate w-48">{l.name}</p><p className="text-[9px] text-blue-500 uppercase font-bold tracking-widest italic">Status: {l.status}</p></div>
                    <div className="flex-1 w-full h-1 bg-white/5 rounded-full overflow-hidden relative"><div className="absolute h-full bg-blue-600" style={{ width: `${60 + (i*9)}%` }}></div></div>
                    <div className="flex gap-4">
                       <button onClick={()=>window.open(`mailto:${l.email}`)} className="bg-white text-black px-8 py-3 rounded-xl font-black text-[10px] uppercase hover:bg-blue-600 hover:text-white transition-all">Execute ESP</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : !loading && (
          <div className="h-[40vh] flex flex-col items-center justify-center opacity-20 text-center animate-pulse italic text-blue-500 text-[10px] font-black uppercase tracking-[1em]">Establishing Global Core...</div>
        )}
      </main>

      {/* STICKY TRUST BANNER */}
      <div className="fixed bottom-0 w-full bg-black/80 backdrop-blur-md border-t border-white/5 p-4 flex justify-between items-center z-50 text-[9px] font-black uppercase tracking-[0.4em] text-gray-600">
         <div className="flex gap-8"><span className="text-green-500 font-black">● GDPR COMPLIANT</span><span>CCPA READY</span><span>Sitemap Ready</span></div>
         <p>© seosiri.com | Architected by Momenul Ahmad</p>
      </div>
    </div>
  );
}