"use client";
import { useState } from 'react';

export default function SeosiriMainframe() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState("seller");
  const [tab, setTab] = useState("intel");

  const runSync = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/agent', { method: 'POST', body: JSON.stringify({ role, userId: "admin" }) });
      const json = await res.json();
      setData(json);
    } finally { setLoading(false); }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-[#050505] text-[#f2f2f2] font-sans">
      
      {/* SIDEBAR */}
      <aside className="w-full lg:w-72 bg-black border-r border-white/5 p-8 flex flex-col justify-between lg:fixed h-full z-40 shadow-2xl">
        <div className="space-y-12">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center font-black">S</div>
            <h1 className="text-lg font-black tracking-tighter uppercase">SEOSIRI <span className="block text-[8px] text-gray-500 font-bold tracking-widest">Mainframe</span></h1>
          </div>
          <nav className="space-y-4 text-[10px] font-bold uppercase tracking-widest text-gray-500">
            <button onClick={()=>setTab("intel")} className={`w-full text-left p-3 rounded-xl ${tab==='intel'?'bg-blue-600 text-white shadow-xl':'hover:bg-white/5'}`}>Intelligence Hub</button>
            <button onClick={()=>setTab("journey")} className={`w-full text-left p-3 rounded-xl ${tab==='journey'?'bg-blue-600 text-white shadow-xl':'hover:bg-white/5'}`}>Lead Journey</button>
          </nav>
        </div>
        <div className="pt-8 border-t border-white/5 text-[9px] text-gray-600 uppercase font-black leading-loose">
           Architect: Momenul Ahmad<br/>info@seosiri.com
        </div>
      </aside>

      {/* COMMAND CENTER */}
      <main className="lg:ml-72 flex-1 p-8 lg:p-20 overflow-y-auto mb-20">
        <header className="flex flex-col xl:flex-row justify-between items-start gap-10 mb-20">
          <div><h2 className="text-6xl font-black tracking-tighter uppercase italic leading-none mb-4">Command <span className="text-blue-600">Center</span></h2>
            <div className="flex gap-4 p-1 bg-white/5 rounded-full w-fit">
               <button onClick={()=>setRole("seller")} className={`px-8 py-2 rounded-full text-[9px] font-black transition-all ${role==='seller'?'bg-white text-black':'text-gray-500'}`}>Seller Mode</button>
               <button onClick={()=>setRole("buyer")} className={`px-8 py-2 rounded-full text-[9px] font-black transition-all ${role==='buyer'?'bg-white text-black':'text-gray-500'}`}>Buyer Mode</button>
            </div>
          </div>
          <div className="flex gap-4">
             <button onClick={()=>window.open('/api/auth/notion')} className="bg-zinc-900 border border-white/10 px-8 py-4 rounded-2xl font-black text-[9px] uppercase hover:bg-white hover:text-black">Link CRM</button>
             <button onClick={runSync} disabled={loading} className="bg-blue-600 text-white px-10 py-4 rounded-2xl font-black text-xs uppercase hover:scale-105 shadow-2xl">
                {loading ? "Aligning Systems..." : "Initialize Global Core"}
             </button>
          </div>
        </header>

        {data && (
          <div className="animate-in fade-in slide-in-from-bottom-5 space-y-16">
            {tab === "intel" && (
              <div className="grid grid-cols-12 gap-10">
                <section className="col-span-12 xl:col-span-8 bg-zinc-900/30 border border-white/10 p-10 rounded-[4rem] backdrop-blur-3xl italic text-xl leading-relaxed text-gray-300">
                  {data.report}
                </section>
                <div className="col-span-12 xl:col-span-4 bg-blue-600 p-12 rounded-[4rem] text-center shadow-3xl flex flex-col justify-center">
                    <p className="text-white/60 text-[10px] font-black uppercase tracking-widest mb-4">Intent Score</p>
                    <div className="text-9xl font-black text-white">{data.intentScore}%</div>
                </div>
              </div>
            )}
            {tab === "journey" && (
              <div className="grid gap-6">
                {data.leads.map((l: any, i: number) => (
                  <div key={i} className="bg-zinc-900/30 border border-white/5 p-10 rounded-[3rem] flex justify-between items-center gap-10">
                    <div><p className="font-black text-2xl text-white">{l.name}</p><p className="text-[9px] text-blue-500 uppercase font-bold tracking-widest">Notion Active</p></div>
                    <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden relative"><div className="absolute h-full bg-blue-600" style={{ width: `${75 + i}%` }}></div></div>
                    <button onClick={()=>window.open(`mailto:${l.email}`)} className="bg-white text-black px-6 py-2 rounded-xl font-black text-[9px] uppercase hover:bg-blue-600 hover:text-white transition-all">Execute ESP</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* STICKY TRUST BANNER (International Standard) */}
      <div className="fixed bottom-0 w-full bg-black/80 backdrop-blur-md border-t border-white/5 p-4 flex flex-col md:flex-row justify-between items-center z-50 text-[9px] font-bold uppercase tracking-widest text-gray-600">
         <div className="flex gap-8">
            <span className="text-green-500">● GDPR COMPLIANT</span>
            <span>CCPA READY</span>
            <span>COOKIE POLICY ACTIVE</span>
         </div>
         <div className="mt-4 md:mt-0 flex gap-6">
            <a href="/sitemap.xml" className="hover:text-white">Sitemap</a>
            <p>© seosiri.com | Architected by Momenul Ahmad</p>
         </div>
      </div>
    </div>
  );
}