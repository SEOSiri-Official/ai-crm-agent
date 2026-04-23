"use client";
import { useState } from 'react';

export default function SeosiriGlobalEngine() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("intel");
  const [role, setRole] = useState("seller");

  const runGlobalSync = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role, userId: "admin" })
      });
      const json = await res.json();
      setData(json);
    } finally { setLoading(false); }
  };

  const executeAction = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Architect Ahmad: Intelligence copied to clipboard.");
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-[#030303] text-[#f0f0f0] font-sans selection:bg-blue-600">
      
      {/* 1. SIDEBAR NAVIGATION */}
      <aside className="w-full lg:w-80 bg-black border-r border-white/5 p-10 flex flex-col justify-between lg:fixed h-full z-50">
        <div className="space-y-12">
          <div className="flex items-center gap-4 cursor-pointer" onClick={()=>window.location.reload()}>
            <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center font-black shadow-2xl shadow-blue-600/30">S</div>
            <h1 className="text-xl font-black tracking-tighter uppercase">SEOSIRI <span className="block text-[8px] text-gray-500 tracking-[0.4em] uppercase">Core v10.0</span></h1>
          </div>
          <nav className="space-y-4 text-[10px] font-bold uppercase tracking-widest text-gray-500">
            <button onClick={()=>setActiveTab("intel")} className={`w-full text-left p-4 rounded-xl transition-all ${activeTab==='intel'?'bg-blue-600 text-white':'hover:bg-white/5'}`}>Market Intelligence</button>
            <button onClick={()=>setActiveTab("journey")} className={`w-full text-left p-4 rounded-xl transition-all ${activeTab==='journey'?'bg-blue-600 text-white':'hover:bg-white/5'}`}>Lead Journey</button>
            <button onClick={()=>setActiveTab("trust")} className={`w-full text-left p-4 rounded-xl transition-all ${activeTab==='trust'?'bg-blue-600 text-white':'hover:bg-white/5'}`}>Trust & Compliance</button>
            <button onClick={()=>alert("Voice Active: Listening for command...")} className="w-full text-left p-4 rounded-xl opacity-40 border border-white/5 flex justify-between items-center">Voice Command <span className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></span></button>
          </nav>
        </div>
        <div className="pt-8 border-t border-white/5">
           <p className="text-[9px] text-gray-600 uppercase tracking-widest leading-loose">Architect: <span className="text-white font-black italic">Momenul Ahmad</span><br/>SaaS / PaaS / IaaS Active</p>
        </div>
      </aside>

      {/* 2. COMMAND CENTER */}
      <main className="lg:ml-80 flex-1 p-8 lg:p-20 overflow-y-auto">
        <header className="flex flex-col xl:flex-row justify-between items-start gap-10 mb-20">
          <div>
            <h2 className="text-6xl font-black tracking-tighter uppercase italic leading-none mb-4">Command <span className="text-blue-600">Center</span></h2>
            <div className="flex gap-4 p-1 bg-white/5 rounded-full w-fit">
               <button onClick={()=>setRole("seller")} className={`px-6 py-2 rounded-full text-[9px] font-black uppercase transition-all ${role === 'seller' ? 'bg-white text-black' : 'text-gray-500'}`}>Seller Mode</button>
               <button onClick={()=>setRole("buyer")} className={`px-6 py-2 rounded-full text-[9px] font-black uppercase transition-all ${role === 'buyer' ? 'bg-white text-black' : 'text-gray-500'}`}>Buyer Mode</button>
            </div>
          </div>
          <button onClick={runGlobalSync} disabled={loading} className="bg-blue-600 text-white px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-[0_0_50px_rgba(37,99,235,0.3)]">
            {loading ? "Aligning Systems..." : "Initialize Global Sync"}
          </button>
        </header>

        {data ? (
          <div className="animate-in fade-in slide-in-from-bottom-5 duration-1000 space-y-16">
            {activeTab === "intel" && (
              <div className="grid grid-cols-12 gap-10">
                <section className="col-span-12 xl:col-span-8 bg-zinc-900/40 border border-white/10 p-10 rounded-[3.5rem] backdrop-blur-3xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-10 opacity-5 text-9xl font-black italic text-blue-600">AI</div>
                  <div className="flex justify-between items-center mb-10 border-b border-white/5 pb-8">
                     <h3 className="text-blue-500 font-black text-[10px] uppercase tracking-[0.5em]">Deep Intent Strategy</h3>
                     <div className="flex gap-4">
                        <button onClick={()=>window.print()} className="text-[9px] font-black text-gray-500 hover:text-white uppercase tracking-widest">Download PDF</button>
                        <button onClick={()=>executeAction(data.intelligence.report)} className="text-[9px] font-black text-gray-500 hover:text-white uppercase tracking-widest border border-white/10 px-4 py-2 rounded-lg">Copy Strategy</button>
                     </div>
                  </div>
                  <div className="text-gray-200 text-2xl font-light leading-relaxed italic whitespace-pre-wrap">{data.intelligence.report}</div>
                </section>
                <div className="col-span-12 xl:col-span-4 bg-blue-600 p-12 rounded-[4rem] text-center shadow-3xl flex flex-col justify-center">
                    <p className="text-white/60 text-[10px] font-black uppercase tracking-widest mb-4">Intent Score</p>
                    <div className="text-9xl font-black text-white">{data.intelligence.intentScore}%</div>
                    <p className="mt-8 text-[10px] font-bold uppercase border border-white/20 px-4 py-2 rounded-full inline-block mx-auto">Market Fit Verified</p>
                </div>
              </div>
            )}

            {activeTab === "journey" && (
              <div className="space-y-6">
                <h3 className="text-gray-500 font-black text-[10px] uppercase tracking-widest px-4 mb-4">Autonomous Journey Cards</h3>
                {data.intelligence.leads.map((l: any, i: number) => (
                  <div key={i} className="bg-zinc-900/40 border border-white/5 p-10 rounded-[2.5rem] flex flex-col xl:flex-row justify-between items-center gap-10 hover:border-blue-600/30 transition-all">
                    <div className="text-center xl:text-left">
                       <p className="font-black text-2xl mb-1 text-white">{l.name}</p>
                       <p className="text-[9px] text-blue-500 uppercase font-black tracking-widest">Sync: Notion Integrated</p>
                    </div>
                    <div className="flex-1 w-full h-1 bg-white/5 rounded-full overflow-hidden relative">
                        <div className="absolute h-full bg-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.5)]" style={{ width: `${60 + (i*9)}%` }}></div>
                    </div>
                    <div className="flex gap-4">
                       <button onClick={()=>window.open(`mailto:${l.email}`)} className="bg-white text-black px-8 py-3 rounded-xl font-black text-[10px] uppercase hover:bg-blue-600 hover:text-white transition-all">Execute ESP</button>
                       <button onClick={()=>executeAction(data.intelligence.report)} className="bg-zinc-800 text-white px-8 py-3 rounded-xl font-black text-[10px] uppercase hover:bg-white hover:text-black transition-all">Social Connect</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="h-[40vh] flex flex-col items-center justify-center opacity-20 text-center space-y-6">
             <div className="w-12 h-12 border-4 border-white/10 border-t-blue-600 rounded-full animate-spin"></div>
             <p className="text-[10px] font-black uppercase tracking-[1em] animate-pulse text-blue-500">Synchronizing Master Core...</p>
          </div>
        )}

        <footer className="mt-40 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8 opacity-40 text-[9px] font-black uppercase tracking-[0.5em]">
           <div className="flex gap-10"><span>SaaS READY</span><span>PaaS ACTIVE</span><span>IaaS POWERED</span></div>
           <p>© seosiri.com | Architect: Momenul Ahmad | GDPR Compliant</p>
        </footer>
      </main>
    </div>
  );
}