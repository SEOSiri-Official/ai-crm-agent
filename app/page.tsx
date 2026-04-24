"use client";
import { useState } from 'react';

export default function SeosiriGlobalMainframe() {
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

  const handleExecute = (type: string, content: string) => {
    navigator.clipboard.writeText(content);
    alert(`Architect Ahmad: ${type} Protocol copied to clipboard.`);
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-[#020202] text-[#e0e0e0] font-sans selection:bg-blue-600">
      
      {/* 1. ARCHITECT SIDEBAR */}
      <aside className="w-full lg:w-80 bg-black border-r border-white/5 p-10 flex flex-col justify-between lg:fixed h-full z-50">
        <div className="space-y-12">
          <div className="flex items-center gap-4 cursor-pointer" onClick={()=>window.location.reload()}>
            <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center font-black shadow-2xl">S</div>
            <h1 className="text-xl font-black tracking-tighter uppercase italic">SEOSIRI <span className="block text-[8px] text-gray-500 not-italic uppercase font-bold tracking-widest">Mainframe v11.0</span></h1>
          </div>
          <nav className="space-y-4 text-[10px] font-bold uppercase tracking-widest text-gray-500">
            <button onClick={()=>setTab("intel")} className={`w-full text-left p-4 rounded-xl transition-all ${tab==='intel'?'bg-blue-600 text-white shadow-xl':'hover:bg-white/5'}`}>Market Intel</button>
            <button onClick={()=>setTab("journey")} className={`w-full text-left p-4 rounded-xl transition-all ${tab==='journey'?'bg-blue-600 text-white shadow-xl':'hover:bg-white/5'}`}>Lead Journey</button>
            <button onClick={()=>setTab("trust")} className={`w-full text-left p-4 rounded-xl transition-all ${tab==='trust'?'bg-blue-600 text-white shadow-xl':'hover:bg-white/5'}`}>Security & Compliance</button>
          </nav>
        </div>
        <div className="pt-8 border-t border-white/5">
           <p className="text-[10px] text-gray-600 uppercase font-bold italic">Architect: <span className="text-white">Momenul Ahmad</span></p>
           <p className="text-[9px] text-blue-500 font-black mt-2">info@seosiri.com</p>
        </div>
      </aside>

      {/* 2. COMMAND CENTER */}
      <main className="lg:ml-80 flex-1 p-8 lg:p-20 overflow-y-auto">
        <header className="flex flex-col xl:flex-row justify-between items-start gap-10 mb-20">
          <div>
            <h2 className="text-6xl font-black tracking-tighter uppercase italic">Command <span className="text-blue-600">Center</span></h2>
            <div className="flex gap-4 mt-6">
               <button onClick={()=>setRole("seller")} className={`px-8 py-2 rounded-full text-[9px] font-black uppercase transition-all ${role === 'seller' ? 'bg-white text-black' : 'text-gray-500'}`}>Seller</button>
               <button onClick={()=>setRole("buyer")} className={`px-8 py-2 rounded-full text-[9px] font-black uppercase transition-all ${role === 'buyer' ? 'bg-white text-black' : 'text-gray-500'}`}>Buyer</button>
            </div>
          </div>
          <div className="flex gap-4">
             <button onClick={()=>window.open('/api/auth/notion')} className="bg-zinc-900 border border-white/10 px-8 py-4 rounded-2xl font-black text-[9px] uppercase hover:bg-white hover:text-black">Connect CRM</button>
             <button onClick={runSync} disabled={loading} className="bg-blue-600 text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 shadow-[0_0_50px_rgba(37,99,235,0.4)]">
                {loading ? "Aligning Logic..." : "Initialize Global Core"}
             </button>
          </div>
        </header>

        {error && <div className="bg-red-600/10 border border-red-600/30 p-10 rounded-[3rem] text-red-500 text-center animate-pulse mb-20">{error}</div>}

        {data ? (
          <div className="animate-in fade-in slide-in-from-bottom-5 space-y-16">
            {tab === "intel" && (
              <div className="grid grid-cols-12 gap-10">
                <section className="col-span-12 xl:col-span-8 bg-zinc-900/40 border border-white/10 p-12 rounded-[4rem] backdrop-blur-3xl relative">
                  <div className="flex justify-between items-center mb-10 border-b border-white/5 pb-8">
                     <h3 className="text-blue-500 font-black text-[10px] uppercase tracking-[0.5em]">Deep Strategic Report</h3>
                     <button onClick={()=>window.print()} className="text-[9px] font-black text-gray-500 hover:text-white uppercase tracking-widest">Download PDF</button>
                  </div>
                  <div className="text-gray-200 text-2xl font-light italic leading-relaxed whitespace-pre-wrap">{data.intelligence.report}</div>
                </section>
                <div className="col-span-12 xl:col-span-4 bg-blue-600 p-12 rounded-[4rem] text-center flex flex-col justify-center">
                    <p className="text-white/60 text-[10px] font-black uppercase tracking-widest mb-4">Intent Score</p>
                    <div className="text-9xl font-black text-white">{data.intelligence.intentScore}%</div>
                </div>
              </div>
            )}
            {tab === "journey" && (
              <div className="space-y-6">
                {data.intelligence.leads.map((l: any, i: number) => (
                  <div key={i} className="bg-zinc-900/40 border border-white/5 p-10 rounded-[3rem] flex flex-col xl:flex-row justify-between items-center gap-10 hover:border-blue-600/30 transition-all">
                    <div><p className="font-black text-2xl mb-1 text-white truncate w-48">{l.name}</p><p className="text-[9px] text-blue-500 uppercase font-bold tracking-widest italic">Notion Lead</p></div>
                    <div className="flex-1 w-full h-1 bg-white/5 rounded-full overflow-hidden relative"><div className="absolute h-full bg-blue-600" style={{ width: `${60 + (i*9)}%` }}></div></div>
                    <div className="flex gap-4">
                       <button onClick={()=>window.open(`mailto:${l.email}`)} className="bg-white text-black px-8 py-3 rounded-xl font-black text-[10px] uppercase hover:bg-blue-600 hover:text-white transition-all">Execute ESP</button>
                       <button onClick={()=>handleExecute("LinkedIn", data.intelligence.report)} className="bg-zinc-800 text-white px-8 py-3 rounded-xl font-black text-[10px] uppercase hover:bg-white hover:text-black transition-all">Social Connect</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : !error && (
          <div className="h-[40vh] flex flex-col items-center justify-center opacity-20 text-center animate-pulse italic text-blue-500 text-[10px] font-black uppercase tracking-[1em]">Establishing Core Connection...</div>
        )}

        <footer className="mt-40 pt-10 border-t border-white/5 flex justify-between items-center gap-8 opacity-40 text-[9px] font-black uppercase tracking-[0.4em]">
           <div className="flex gap-10"><span>GDPR Compliant</span><span>AEO Ready</span><span>GEO Optimized</span></div>
           <p>© seosiri.com | Architect: Momenul Ahmad</p>
        </footer>
      </main>
    </div>
  );
}