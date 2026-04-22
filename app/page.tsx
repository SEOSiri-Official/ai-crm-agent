"use client";
import { useState } from 'react';

export default function Page() {
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function runAgent() {
    setLoading(true);
    const res = await fetch('/api/agent');
    const data = await res.json();
    setAnalysis(data.analysis || data.error);
    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-black text-white p-8">
      {/* Your existing Hero Section Code here... */}
      <div className="max-w-4xl mx-auto text-center mt-20">
        <h1 className="text-6xl font-black mb-6">THE ULTIMATE <span className="text-blue-600">AI SALES ENGINE</span></h1>
        
        {!analysis ? (
          <button 
            onClick={runAgent}
            disabled={loading}
            className="px-10 py-5 bg-white text-black rounded-xl font-bold hover:scale-105 transition-all"
          >
            {loading ? "Agent Thinking..." : "Launch AI Intelligence"}
          </button>
        ) : (
          <div className="mt-10 p-8 border border-blue-500/30 bg-blue-500/5 rounded-2xl text-left">
            <div className="flex justify-between mb-4 border-b border-white/10 pb-4">
              <span className="text-blue-500 font-bold tracking-widest uppercase text-xs">Intelligence Report</span>
              <span className="text-gray-500 text-xs">Architect: Momenul Ahmad</span>
            </div>
            <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">{analysis}</p>
            <button onClick={() => setAnalysis(null)} className="mt-6 text-xs text-gray-500 underline">Clear Report</button>
          </div>
        )}
      </div>
    </main>
  );
}