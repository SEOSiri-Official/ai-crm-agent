"use client";

export default function SeosiriLandingPage() {
  return (
    <div className="min-h-screen bg-black text-white font-sans flex flex-col items-center justify-center p-6 text-center">
      {/* GLOBAL IDENTITY */}
      <div className="w-20 h-20 bg-blue-600 rounded-[2.5rem] flex items-center justify-center font-black text-3xl mb-10 shadow-2xl shadow-blue-600/40">S</div>
      
      <h1 className="text-6xl md:text-8xl font-black tracking-tighter uppercase italic leading-none mb-6">
        SEOSIRI <span className="text-blue-600">CORE</span>
      </h1>
      
      <p className="max-w-xl text-gray-400 text-lg md:text-xl font-light leading-relaxed mb-12 italic">
        The Integrated AI Sales Engine for Notion. Architected by <span className="text-white font-bold">Momenul Ahmad</span> to bridge Market Intelligence with CRM automation.
      </p>

      {/* AUTHORIZATION GATEWAY */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
        <div className="bg-zinc-900/50 border border-white/5 p-10 rounded-[3rem] backdrop-blur-3xl group hover:border-blue-500/30 transition-all">
          <p className="text-blue-500 font-black text-[10px] uppercase tracking-widest mb-6">Step 1: Authorization</p>
          <button 
            onClick={() => window.location.href='/api/auth/notion'}
            className="w-full py-4 bg-white text-black rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all shadow-xl"
          >
            Connect Notion CRM
          </button>
        </div>

        <div className="bg-zinc-900/50 border border-white/5 p-10 rounded-[3rem] backdrop-blur-3xl group hover:border-blue-500/30 transition-all">
          <p className="text-blue-500 font-black text-[10px] uppercase tracking-widest mb-6">Step 2: Execution</p>
          <button 
            onClick={() => window.location.href='/dashboard'}
            className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-2xl shadow-blue-600/30"
          >
            Enter Dashboard
          </button>
        </div>
      </div>

      {/* STICKY TRUST SIGNALS */}
      <footer className="mt-24 pt-10 border-t border-white/5 w-full flex flex-col md:flex-row justify-between items-center gap-6 opacity-30 text-[9px] font-black uppercase tracking-[0.5em]">
        <div className="flex gap-10">
          <span>GDPR COMPLIANT</span>
          <span>AEO READY</span>
          <span>VOICE OPTIMIZED</span>
        </div>
        <p>© seosiri.com | Architected by Momenul Ahmad</p>
      </footer>
    </div>
  );
}