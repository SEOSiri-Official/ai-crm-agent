"use client";
import { useState } from 'react';

export default function SeosiriSupremeMainframe() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState("intel");
  const [role, setRole] = useState("seller");
  const [error, setError] = useState<string | null>(null);

  const launchSync = async () => {
    setLoading(true); setError(null);
    try {
      const res = await fetch('/api/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role, userId: "admin" })
      });
      const json = await res.json();
      if (json.status === "ERROR") throw new Error(json.message);
      setData(json);
    } catch (e: any) { setError(e.message); }
    finally { setLoading(false); }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-[#050505] text-[#f5f5f5] font-sans selection:bg-blue-600">
      <aside className="w-full lg:w-80 bg-black border-r border-white/5 p-10 flex flex-col justify-between lg:fixed h-full z-50">
        <div className="space-y-12">
          <div className="flex items-center gap-4 cursor-pointer" onClick={()=>window.location.reload()}>
            <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center font-black shadow-2xl shadow-blue-600/30">S</div>
            <h1 className="text-xl font-black tracking-tighter uppercase italic text-white">SEOSIRI <span className="block text-[8px] text-gray-600 not-italic uppercase font-bold tracking-widest">Mainframe v15.0</span></h1>
          </div>
          <nav className="space-y-4 text-[10px] font-bold uppercase tracking-widest text-gray-500">
            <button onClick={()=>setTab("intel")} className={`w-full text-left p-4 rounded-xl transition-all ${tab==='intel'?'bg-blue-600 text-white shadow-xl':'hover:bg-white/5'}`}>Market Performance</button>
            <button onClick={()=>setTab("journey")} className={`w-full text-left p-4 rounded-xl transition-all ${tab==='journey'?'bg-blue-600 text-white shadow-xl':'hover:bg-white/5'}`}>Lead Journey</button>
          </nav>
        </div>
        <div className="pt-8 border-t border-white/5">
           <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">Architect: <span className="text-white">Momenul Ahmad</span><br/>info@seosiri.com</p>
        </div>
      </aside>

      <main className="lg:ml-80 flex-1 p-8 lg:p-20 overflow-y-auto mb-32">
        <header className="flex flex-col xl:flex-row justify-between items-start gap-10 mb-20">
          <div><h2 className="text-6xl font-black tracking-tighter uppercase italic leading-none mb-4 tracking-[-0.05em]">Command <span className="text-blue-600">Center</span></h2>
            <div className="flex gap-4 p-1 bg-white/5 rounded-full w-fit">
               <button onClick={()=>setRole("seller")} className={`px-8 py-2 rounded-full text-[9px] font-black uppercase transition-all ${role === 'seller' ? 'bg-white text-black' : 'text-gray-500'}`}>Seller Mode</button>
               <button onClick={()=>setRole("buyer")} className={`px-8 py-2 rounded-full text-[9px] font-black uppercase transition-all ${role === 'buyer' ? 'bg-white text-black' : 'text-gray-500'}`}>Buyer Mode</button>
            </div>
          </div>
          <button onClick={launchSync} disabled={loading} className="bg-blue-600 text-white px-12 py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 shadow-[0_0_50px_rgba(37,99,235,0.4)]">
             {loading ? "Aligning Intelligence..." : "Initialize Global Sync"}
          </button>
        </header>

        {error && <div className="bg-red-600/10 border border-red-600/30 p-10 rounded-[3rem] text-red-500 text-center animate-pulse mb-10">{error}</div>}

        {data ? (
          <div className="animate-in fade-in slide-in-from-bottom-5 duration-1000 space-y-16">
            {tab === "intel" && (
              <div className="grid grid-cols-12 gap-10">
                <section className="col-span-12 xl:col-span-8 bg-zinc-900/30 border border-white/10 p-12 rounded-[4rem] backdrop-blur-3xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-10 opacity-5 text-9xl font-black italic text-blue-600">AI</div>
                  <h3 className="text-blue-500 font-black text-[10px] uppercase tracking-[0.5em] mb-10 border-b border-white/5 pb-8">Deep Intent Strategy</h3>
                  <div className="text-gray-200 text-2xl font-light leading-relaxed whitespace-pre-wrap italic">{data.report}</div>
                </section>
                <div className="col-span-12 xl:col-span-4 bg-blue-600 p-12 rounded-[4rem] text-center flex flex-col justify-center shadow-3xl">
                    <p className="text-white/60 text-[10px] font-black uppercase tracking-widest mb-4 italic">GA4 Conversion Probability</p>
                    <div className="text-9xl font-black text-white">{data.intentScore}%</div>
                    <p className="mt-8 text-[10px] font-bold uppercase border border-white/20 px-4 py-2 rounded-full inline-block mx-auto italic">Market Fit Verified</p>
                </div>
              </div>
            )}
          </div>
        ) : !loading && (
          <div className="h-[40vh] flex flex-col items-center justify-center opacity-20 text-center space-y-6">
             <div className="w-12 h-12 border-4 border-white/10 border-t-blue-600 rounded-full animate-spin"></div>
             <p className="text-[10px] font-black uppercase tracking-[1em] animate-pulse text-blue-500">Establishing SEOSIRI Core Bridge...</p>
          </div>
        )}
      </main>

      <div className="fixed bottom-0 w-full bg-black/80 backdrop-blur-md border-t border-white/5 p-4 flex justify-between items-center z-50 text-[9px] font-black uppercase tracking-[0.4em] text-gray-600">
         <div className="flex gap-8"><span className="text-green-500 font-black">● GDPR COMPLIANT</span><span>CCPA READY</span><span>AEO Ready</span></div>
         <p>© seosiri.com | Architected by Momenul Ahmad</p>
      </div>
    </div>
  );
}