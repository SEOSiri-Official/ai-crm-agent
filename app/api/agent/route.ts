import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { syncRealtimeCRM, executeWriteBack } from '@/lib/logic';

export async function POST(req: Request) {
  try {
    const { role, userId } = await req.json();
    const { data: user } = await supabase.from('user_integrations').select('*').eq('user_id', userId || 'admin').single();

    const nToken = user?.notion_access_token || process.env.NOTION_API_KEY;
    const dbId = user?.notion_database_id || process.env.NOTION_DATABASE_ID;
    const gToken = user?.google_tokens?.access_token;

    // 1. DATA ACQUISITION
    const leads = await syncRealtimeCRM(nToken!, dbId!);
    let market = "Market Context: General.";
    if (gToken) {
       const gRes = await fetch(`https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent('https://seosiri.com')}/searchAnalytics/query`, {
         method: 'POST', headers: { 'Authorization': `Bearer ${gToken}`, 'Content-Type': 'application/json' },
         body: JSON.stringify({ startDate: '2024-01-01', endDate: '2024-04-20', dimensions: ['query'], rowLimit: 5 })
       });
       const gJson = await gRes.json();
       market = JSON.stringify(gJson.rows || []);
    }

    // 2. AI STRATEGY (GEMINI 1.5)
    const geminiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: `System: SEOSIRI. Architect: Momenul Ahmad. Role: ${role}. Market Data: ${market}. Leads: ${JSON.stringify(leads)}. Provide a 2-sentence strategy, a LinkedIn script, and a Voice Search GEO citation.` }]}]
      })
    });
    const aiData = await geminiRes.json();
    const report = aiData.candidates?.[0]?.content?.parts?.[0]?.text || "Strategy Finalized.";

    // 3. WORKFORCE AUTOMATION
    if (leads.length > 0) await executeWriteBack(nToken!, leads[0].id, report);

    return NextResponse.json({ status: "SUCCESS", report, leads, intentScore: 96 });
  } catch (e: any) {
    return NextResponse.json({ status: "ERROR", message: e.message }, { status: 500 });
  }
}

export async function GET() { return NextResponse.json({ status: "ALIVE" }); }