import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { syncNotionCRM, executeWriteBack } from '@/lib/logic';

async function processIndustrialCore(role: string, userId: string) {
  // 1. DATA FEDERATION: Identify User
  const { data: user } = await supabase.from('user_integrations').select('*').eq('user_id', userId).single();
  const nToken = user?.notion_access_token || process.env.NOTION_API_KEY;
  const dbId = user?.notion_database_id || process.env.NOTION_DATABASE_ID;
  const gToken = user?.google_tokens?.access_token;

  // 2. MARKET INTELLIGENCE (Real GSC Fetch)
  let market = "GSC Context Active.";
  if (gToken) {
    const gRes = await fetch(`https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent('https://seosiri.com')}/searchAnalytics/query`, {
      method: 'POST', headers: { 'Authorization': `Bearer ${gToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ startDate: '2024-01-01', endDate: '2024-04-20', dimensions: ['query'], rowLimit: 5 })
    });
    const gJson = await gRes.json();
    market = JSON.stringify(gJson.rows || []);
  }

  // 3. CRM SYNC
  const leads = await syncNotionCRM(nToken!, dbId!);

  // 4. AI STRATEGY (Gemini 1.5 - Uncut SaaS/PaaS/IaaS Logic)
  const geminiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: `System: SEOSIRI CORE. Architect: Momenul Ahmad. Role: ${role}. Market Data: ${market}. Leads: ${JSON.stringify(leads)}. Provide a 2-sentence strategy, a LinkedIn connection script, and a Voice SEO citation intro.` }]}]
    })
  });
  const aiData = await geminiRes.json();
  const report = aiData.candidates?.[0]?.content?.parts?.[0]?.text || "Intelligence Ready.";

  // 5. WORKFORCE AUTOMATION: Write back to Notion
  if (leads.length > 0) {
    await executeWriteBack(nToken!, leads[0].id, report);
  }

  return { report, leads, intentScore: 94 };
}

export async function POST(req: Request) {
  try {
    const { role, userId } = await req.json();
    const result = await processIndustrialCore(role || "seller", userId || "admin");
    return NextResponse.json({ status: "SUCCESS", ...result });
  } catch (e: any) {
    return NextResponse.json({ status: "ERROR", message: e.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const result = await processIndustrialCore("seller", "admin");
    return NextResponse.json({ status: "SUCCESS", ...result });
  } catch (e: any) {
    return NextResponse.json({ status: "ERROR", message: e.message }, { status: 500 });
  }
}