"use client";
import { useState } from 'react';

export default function SeosiriSupremeEngine() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("intel"); 
  const [role, setRole] = useState("seller");

  const executeGlobalSync = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/agent', {
        method: 'POST',
        body: JSON.stringify({ role, userId: "MomenulAhmad" })
      });
      const json = await res.json();
      setData(json);
    } catch (e) { console.error("Global Sync Error", e); }
    finally { setLoading(false); }
  };

  const downloadReport = () => {
    const blob = new Blob([data.intelligence.report], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SEOSIRI-Intelligence-${data.shareId}.txt`;
    a.click();
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-[#050505] text-[#f0f0f0] font-sans selection:bg-blue-600">
      
      {/* SIDEBAR NAVIGATION */}
      <aside className="w-full lg:w-80 bg-black border-r border-white/5 p-10 flex flex-col justify-between lg:fixed h-full z-50">
        <div className="space-y-12">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center font-black shadow-lg text-white">S</div>
            <h1 className="text-xl font-black tracking-tighter uppercase">SEOSIRI <span className="block text-[8px] text-gray-500 tracking-[0.4em]">Core v5.5</span></h1>
          </div>
          <nav className="space-y-4 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">
            <button onClick={()=>setActiveTab("intel")} className={`w-full text-left p-4 rounded-xl transition-all ${activeTab === "intel" ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/20' : 'hover:bg-white/5'}`}>Market Intelligence</button>
            <button onClick={()=>setActiveTab("journey")} className={`w-full text-left p-4 rounded-xl transition-all ${activeTab === "journey" ? 'bg-blue-600 text-white' : 'hover:bg-white/5'}`}>Lead Journey</button>
            <button onClick={()=>setActiveTab("trust")} className={`w-full text-left p-4 rounded-xl transition-all ${activeTab === "trust" ? 'bg-blue-600 text-white' : 'hover:bg-white/5'}`}>Trust & Compliance</button>
          </nav>
        </div>
        <div className="pt-8 border-t border-white/5 text-[9px] text-gray-600 uppercase tracking-widest leading-loose">
           Architect: <span className="text-white font-black">Momenul Ahmad</span><br/>
           Engine: SaaS / PaaS / IaaS
        </div>
      </aside>

      {/* MAIN COMMAND STAGE */}
      <main className="lg:ml-80 flex-1 p-8 lg:p-20 overflow-y-auto">
        <header className="flex flex-col xl:flex-row justify-between items-start gap-8 mb-20">
          <div>
            <h2 className="text-5xl font-black tracking-tighter uppercase mb-4 italic">Command <span className="text-blue-600">Center</span></h2>
            <div className="flex gap-4 p-1 bg-white/5 rounded-full w-fit">
               <button onClick={()=>setRole("seller")} className={`px-6 py-2 rounded-full text-[9px] font-black uppercase tracking-widest transition-all ${role === "seller" ? 'bg-white text-black' : 'text-gray-500'}`}>Seller Mode</button>
               <button onClick={()=>setRole("buyer")} className={`px-6 py-2 rounded-full text-[9px] font-black uppercase tracking-widest transition-all ${role === "buyer" ? 'bg-white text-black' : 'text-gray-500'}`}>Buyer Mode</button>
            </div>
          </div>
          <button onClick={executeGlobalSync} disabled={loading} className="w-full xl:w-auto bg-blue-600 text-white px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-2xl shadow-blue-600/40">
            {loading ? "Optimizing Global Data..." : "Run Intelligence Sync"}
          </button>
        </header>

        {data ? (
          <div className="animate-in fade-in slide-in-from-bottom-5 duration-1000 space-y-12">
            
            {activeTab === "intel" && (
              <div className="grid grid-cols-12 gap-10">
                <section className="col-span-12 xl:col-span-8 bg-zinc-900/30 border border-white/10 p-12 rounded-[3.5rem] backdrop-blur-3xl relative overflow-hidden group">
                  <div className="flex justify-between items-center mb-10">
                    <h3 className="text-blue-500 font-black text-[10px] uppercase tracking-[0.5em]">Gap & Intent Strategy</h3>
                    <div className="flex gap-4">
                       <button onClick={downloadReport} className="text-[9px] font-black uppercase text-gray-500 hover:text-white">Download PDF</button>
                       <button onClick={()=>alert(`Share ID: ${data.shareId}`)} className="text-[9px] font-black uppercase text-gray-500 hover:text-white">Share Report</button>
                    </div>
                  </div>
                  <div className="text-gray-200 text-2xl font-light leading-relaxed whitespace-pre-wrap italic">
                    {data.intelligence.report}
                  </div>
                </section>
                <div className="col-span-12 xl:col-span-4 bg-blue-600 p-12 rounded-[3.5rem] shadow-3xl text-center flex flex-col justify-center">
                    <p className="text-white/60 text-[10px] font-black uppercase tracking-widest mb-4">Intent Score</p>
                    <div className="text-8xl font-black text-white">{data.intelligence.intentScore}%</div>
                    <p className="mt-8 text-[10px] font-bold uppercase tracking-widest border border-white/20 inline-block px-6 py-2 rounded-full mx-auto">SaaS Validated</p>
                </div>
              </div>
            )}

            {activeTab === "journey" && (
              <div className="grid gap-6">
                <h3 className="text-gray-500 font-black text-[10px] uppercase tracking-widest px-4">Journey Visualization</h3>
                {data.intelligence.leads.map((l: any, i: number) => (
                  <div key={i} className="bg-zinc-900/50 border border-white/5 p-10 rounded-[2.5rem] flex flex-col xl:flex-row justify-between items-center gap-10 hover:border-blue-600/30 transition-all">
                    <div className="text-center xl:text-left">
                       <p className="font-black text-2xl mb-1">{l.name}</p>
                       <p className="text-[9px] text-blue-500 uppercase font-bold tracking-widest italic">Connected via Notion</p>
                    </div>
                    <div className="flex-1 w-full h-1 bg-white/5 rounded-full overflow-hidden relative">
                        <div className="absolute h-full bg-blue-600" style={{ width: `${65 + (i*8)}%` }}></div>
                    </div>
                    <div className="flex gap-4">
                       <button className="bg-white text-black px-8 py-3 rounded-xl font-black text-[10px] uppercase hover:bg-blue-600 hover:text-white transition-all">Execute ESP</button>
                       <button className="bg-zinc-800 text-white px-8 py-3 rounded-xl font-black text-[10px] uppercase hover:bg-white hover:text-black transition-all">Social Script</button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "trust" && (
              <div className="bg-zinc-900/30 border border-white/10 p-20 rounded-[4rem] text-center">
                 <h3 className="text-gray-500 font-black text-[10px] uppercase tracking-[0.6em] mb-12">Compliance Infrastructure</h3>
                 <div className="flex flex-wrap justify-center gap-10 opacity-40 hover:opacity-100 transition-all">
                    <span className="border border-white/10 px-6 py-3 rounded-xl text-xs font-bold">GDPR COMPLIANT</span>
                    <span className="border border-white/10 px-6 py-3 rounded-xl text-xs font-bold">CCPA READY</span>
                    <span className="border border-white/10 px-6 py-3 rounded-xl text-xs font-bold">EU PRIVACY SHIELD</span>
                 </div>
              </div>
            )}

          </div>
        ) : (
          <div className="h-[40vh] flex flex-col items-center justify-center opacity-30 text-center space-y-4">
             <div className="w-12 h-12 border-2 border-white/10 border-t-blue-600 rounded-full animate-spin"></div>
             <p className="text-xs font-bold uppercase tracking-widest animate-pulse italic">Synchronizing Architect's Cloud Mainframe...</p>
          </div>
        )}
      </main>
    </div>
  );
}