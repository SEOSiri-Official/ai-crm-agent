"use client";
import { useState } from 'react';

export default function SeosiriGlobalMainframe() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("intel");
  const [role, setRole] = useState("seller");

  const runSync = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/agent', { method: 'POST', body: JSON.stringify({ role }) });
      const json = await res.json();
      setData(json);
    } finally { setLoading(false); }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Architect Ahmad, Intelligence Copied to Clipboard.");
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-[#050505] text-[#f0f0f0] font-sans">
      {/* SIDEBAR */}
      <aside className="w-full lg:w-80 bg-black border-r border-white/5 p-10 flex flex-col justify-between lg:fixed h-full z-50 shadow-2xl">
        <div className="space-y-12">
          <div className="flex items-center gap-4 cursor-pointer" onClick={()=>window.location.reload()}>
            <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center font-black shadow-lg shadow-blue-600/30">S</div>
            <h1 className="text-xl font-black uppercase tracking-tighter">SEOSIRI <span className="block text-[8px] text-gray-500 font-bold tracking-[0.4em]">Core v10.0</span></h1>
          </div>
          <nav className="space-y-4 text-[10px] font-bold uppercase tracking-widest text-gray-500">
            <button onClick={()=>setActiveTab("intel")} className={`w-full text-left p-4 rounded-xl transition-all ${activeTab==='intel'?'bg-blue-600 text-white shadow-xl':'hover:bg-white/5'}`}>Market Intelligence</button>
            <button onClick={()=>setActiveTab("journey")} className={`w-full text-left p-4 rounded-xl transition-all ${activeTab==='journey'?'bg-blue-600 text-white shadow-xl':'hover:bg-white/5'}`}>Lead Journey</button>
            <button onClick={()=>setActiveTab("trust")} className={`w-full text-left p-4 rounded-xl transition-all ${activeTab==='trust'?'bg-blue-600 text-white shadow-xl':'hover:bg-white/5'}`}>Trust & Compliance</button>
            <button onClick={()=>alert("Voice Active: Listening...")} className="w-full text-left p-4 rounded-xl opacity-40 flex justify-between items-center border border-white/5">Voice Interface <span className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></span></button>
          </nav>
        </div>
        <div className="pt-8 border-t border-white/5 flex items-center gap-3">
           <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-[10px] font-black">MA</div>
           <p className="text-[9px] text-gray-600 uppercase tracking-widest leading-loose font-bold">Architect: Momenul Ahmad<br/>Global SaaS/PaaS/IaaS</p>
        </div>
      </aside>

      {/* COMMAND STAGE */}
      <main className="lg:ml-80 flex-1 p-8 lg:p-20 overflow-y-auto">
        <header className="flex flex-col xl:flex-row justify-between items-start gap-10 mb-20">
          <div>
            <h2 className="text-6xl font-black tracking-tighter uppercase italic leading-none mb-4">Command <span className="text-blue-600">Center</span></h2>
            <div className="flex gap-4 p-1 bg-white/5 rounded-full w-fit">
               <button onClick={()=>setRole("seller")} className={`px-6 py-2 rounded-full text-[9px] font-black uppercase transition-all ${role === 'seller' ? 'bg-white text-black' : 'text-gray-500'}`}>Seller</button>
               <button onClick={()=>setRole("buyer")} className={`px-6 py-2 rounded-full text-[9px] font-black uppercase transition-all ${role === 'buyer' ? 'bg-white text-black' : 'text-gray-500'}`}>Buyer</button>
            </div>
          </div>
          <button onClick={runSync} disabled={loading} className="bg-blue-600 text-white px-12 py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-[0_0_50px_rgba(37,99,235,0.3)]">
            {loading ? "Synchronizing Systems..." : "Initialize Global Intelligence"}
          </button>
        </header>

        {data ? (
          <div className="animate-in fade-in slide-in-from-bottom-5 duration-1000 space-y-16">
            {activeTab === "intel" && (
              <div className="grid grid-cols-12 gap-10">
                <section className="col-span-12 xl:col-span-8 bg-zinc-900/30 border border-white/10 p-12 rounded-[4rem] backdrop-blur-3xl relative overflow-hidden">
                  <div className="flex justify-between items-center mb-10 border-b border-white/5 pb-8 text-blue-500 font-black text-[10px] uppercase tracking-[0.5em]">
                     <span>Intelligence Report</span>
                     <button onClick={()=>handleCopy(data.intelligence.report)} className="text-gray-500 hover:text-white uppercase tracking-widest">Copy Report</button>
                  </div>
                  <div className="text-gray-200 text-2xl font-light italic leading-relaxed whitespace-pre-wrap">{data.intelligence.report}</div>
                </section>
                <div className="col-span-12 xl:col-span-4 bg-blue-600 p-12 rounded-[4rem] text-center shadow-3xl">
                    <p className="text-white/60 text-[10px] font-black uppercase tracking-widest mb-4">Intent Score</p>
                    <div className="text-9xl font-black text-white">{data.intelligence.intentScore}%</div>
                    <button onClick={()=>window.print()} className="mt-8 text-[9px] font-black uppercase border border-white/30 px-6 py-2 rounded-full hover:bg-white hover:text-black">Download PDF Audit</button>
                </div>
              </div>
            )}
            {activeTab === "journey" && (
              <div className="space-y-6">
                {data.intelligence.leads.map((l: any, i: number) => (
                  <div key={i} className="bg-zinc-900/30 border border-white/5 p-10 rounded-[3rem] flex flex-col xl:flex-row justify-between items-center gap-10 hover:border-blue-600/30 transition-all">
                    <div className="text-center xl:text-left">
                       <p className="font-black text-2xl mb-1 text-white">{l.name}</p>
                       <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Stage: Discovery</p>
                    </div>
                    <div className="flex-1 w-full h-1 bg-white/5 rounded-full overflow-hidden relative">
                        <div className="absolute h-full bg-blue-600" style={{ width: `${80 + i}%` }}></div>
                    </div>
                    <div className="flex gap-4">
                       <button onClick={()=>window.open(`mailto:${l.email}`)} className="bg-white text-black px-8 py-3 rounded-xl font-black text-[10px] uppercase hover:bg-blue-600 hover:text-white transition-all">Execute ESP</button>
                       <button onClick={()=>window.open('https://www.linkedin.com')} className="bg-zinc-800 text-white px-8 py-3 rounded-xl font-black text-[10px] uppercase hover:bg-white hover:text-black transition-all">Social Connect</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="h-[40vh] flex flex-col items-center justify-center opacity-20 text-center space-y-6">
             <div className="w-12 h-12 border-4 border-white/10 border-t-blue-600 rounded-full animate-spin"></div>
             <p className="text-[10px] font-black uppercase tracking-[1em] italic text-blue-500">Establishing Mainframe Connection...</p>
          </div>
        )}
      </main>
    </div>
  );
}