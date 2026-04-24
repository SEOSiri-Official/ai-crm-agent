import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { syncNotion, updateNotion } from '@/lib/notion';
import { fetchMarket } from '@/lib/market';

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!);

export async function POST(req: Request) {
  try {
    const { role, userId } = await req.json();
    const { data: user } = await supabase.from('user_integrations').select('*').eq('user_id', userId || 'admin').single();

    const nToken = user?.notion_access_token || process.env.NOTION_API_KEY;
    const dbId = user?.notion_database_id || process.env.NOTION_DATABASE_ID;
    const gToken = user?.google_tokens?.access_token;

    // Parallel processing for Speed
    const [leads, market] = await Promise.all([syncNotion(nToken!, dbId!), fetchMarket(gToken)]);

    const aiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: `System: SEOSIRI. Architect: Momenul Ahmad. Role: ${role}. GSC: ${JSON.stringify(market)}. Leads: ${JSON.stringify(leads)}. Provide 2-sentence strategy and LinkedIn hook.` }]}]
      })
    });
    const aiData = await aiRes.json();
    const strategy = aiData.candidates?.[0]?.content?.parts?.[0]?.text || "Sync Success.";

    if (leads.length > 0) await updateNotion(nToken!, leads[0].id, strategy);

    return NextResponse.json({ status: "SUCCESS", report: strategy, leads, intentScore: market.intentScore });
  } catch (e: any) {
    return NextResponse.json({ status: "ERROR", message: e.message }, { status: 500 });
  }
}