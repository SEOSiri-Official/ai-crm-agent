import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { syncNotionCRM, writeBackToNotion } from '@/lib/notion';
import { fetchMarketIntel } from '@/lib/market';

async function orchestrate(role: string, userId: string) {
  // 1. DATA FEDERATION: Identify User & Tokens
  const { data: user } = await supabase
    .from('user_integrations')
    .select('*')
    .eq('user_id', userId)
    .single();

  const nToken = user?.notion_access_token || process.env.NOTION_API_KEY;
  const dbId = user?.notion_database_id || process.env.NOTION_DATABASE_ID;
  const gToken = user?.google_tokens?.access_token;

  // 2. INDUSTRIAL SYNC: Parallel CRM and Market Intel Acquisition
  const [leads, market] = await Promise.all([
    syncNotionCRM(nToken!, dbId!),
    fetchMarketIntel(gToken)
  ]);

  // 3. AI STRATEGY ENGINE: SaaS / PaaS / IaaS Logic
  const geminiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{
        parts: [{ text: `
          System: SEOSIRI GLOBAL AGENT. Architect: Momenul Ahmad.
          Context: High-performance sales engine for seosiri.com.
          Role: ${role}. GSC Market Context: ${JSON.stringify(market)}. Leads: ${JSON.stringify(leads)}.
          
          TASK: 
          1. GAP ANALYSIS: Identify missing sales triggers between Search Console keywords and CRM leads.
          2. STRATEGY: Provide a 2-sentence market-ready closing strategy.
          3. SOCIAL: Draft a 1-sentence high-conversion LinkedIn connection script.
          4. VOICE SEO: Provide a 1-sentence GEO citation optimized for voice answer engines.
        `}]
      }]
    })
  });
  const aiData = await geminiRes.json();
  const report = aiData.candidates?.[0]?.content?.parts?.[0]?.text || "Intelligence Strategy Ready.";

  // 4. WORKFORCE AUTOMATION: Notion Write-Back (The Productivity Loop)
  if (leads.length > 0) {
    await writeBackToNotion(nToken!, leads[0].id, report);
  }

  return { report, leads, market, intentScore: 94 };
}

export async function POST(req: Request) {
  try {
    const { role, userId } = await req.json();
    const result = await orchestrate(role || "seller", userId || "admin");
    return NextResponse.json({ status: "SUCCESS", ...result });
  } catch (e: any) {
    console.error("System Fault:", e.message);
    return NextResponse.json({ status: "ERROR", message: e.message }, { status: 500 });
  }
}

// Global Workability check
export async function GET() {
  return NextResponse.json({ status: "ALIVE", architect: "Momenul Ahmad", engine: "v12.0" });
}