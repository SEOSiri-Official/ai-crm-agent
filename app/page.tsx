"use client";
import { useState } from 'react';

export default function SeosiriGlobalSaaS() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const startSync = async () => {
    setLoading(true);
    const res = await fetch('/api/agent');
    const json = await res.json();
    setData(json);
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen bg-[#0a0a0a] text-[#f5f5f5] font-sans selection:bg-blue-600/40">
      {/* SIDEBAR: NAVIGATION SUPREMACY */}
      <aside className="w-72 bg-black border-r border-white/5 p-8 flex flex-col justify-between fixed h-full shadow-2xl z-50">
        <div className="space-y-12">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center font-black text-xl shadow-lg shadow-blue-600/20">S</div>
            <h2 className="text-xl font-black tracking-tighter">SEOSIRI <span className="text-gray-500 font-light text-xs block tracking-widest">CORE ENGINE</span></h2>
          </div>
          <nav className="space-y-8 text-[11px] font-bold text-gray-500 uppercase tracking-[0.2em]">
            <div className="text-blue-500 flex items-center gap-3"><span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span> Intelligence Hub</div>
            <div className="hover:text-white transition-all cursor-pointer opacity-50">Notion Database</div>
            <div className="hover:text-white transition-all cursor-pointer opacity-50">ESP: Resend Logic</div>
            <div className="hover:text-white transition-all cursor-pointer opacity-50">Social Messaging</div>
          </nav>
        </div>
        <div className="border-t border-white/5 pt-8">
          <p className="text-[9px] text-gray-600 uppercase tracking-widest leading-loose">
            System Architect<br/>
            <span className="text-gray-300 font-black text-sm uppercase">Momenul Ahmad</span><br/>
            License: seosiri.com
          </p>
        </div>
      </aside>

      {/* MAIN COMMAND STAGE */}
      <main className="ml-72 flex-1 p-16 lg:p-24 overflow-y-auto">
        <header className="flex justify-between items-start mb-20">
          <div>
            <h1 className="text-6xl font-black tracking-tighter mb-4">Command <span className="text-blue-600 italic">Center</span></h1>
            <p className="text-gray-500 text-xl font-light max-w-lg">Universal AI Agent for Notion Workspaces.</p>
          </div>
          <button onClick={startSync} disabled={loading} className="bg-white text-black px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-2xl shadow-white/5">
            {loading ? "Syncing Workspace..." : "Initialize Global Intelligence"}
          </button>
        </header>

        {data && (
          <div className="grid grid-cols-12 gap-12 animate-in fade-in slide-in-from-bottom-5 duration-1000">
            {/* AI STRATEGY */}
            <div className="col-span-12 xl:col-span-8 bg-zinc-900/30 border border-white/10 p-12 rounded-[3rem] backdrop-blur-3xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-10 opacity-5 text-9xl font-black italic">AI</div>
              <h3 className="text-blue-500 font-black uppercase text-xs tracking-widest mb-10">Strategic Intelligence Report</h3>
              <div className="text-gray-200 text-xl leading-relaxed whitespace-pre-wrap font-light italic">
                {data.intelligence?.report || "Data format pending..."}
              </div>
            </div>

            {/* NOTION CRM LEADS */}
            <div className="col-span-12 xl:col-span-4 bg-zinc-950 border border-white/5 p-10 rounded-[3rem]">
              <h3 className="text-gray-600 font-black uppercase text-xs tracking-widest mb-10 text-center">Notion CRM Feed</h3>
              <div className="space-y-4">
                {data.intelligence?.leads?.map((l: any, i: number) => (
                  <div key={i} className="flex justify-between items-center bg-zinc-900/40 p-5 rounded-2xl border border-white/5 group hover:border-blue-600/40 transition-all">
                    <span className="font-bold text-sm truncate w-32">{l.name}</span>
                    <a href={l.url} target="_blank" className="p-2 bg-zinc-800 rounded-lg hover:bg-blue-600 transition-colors">
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}