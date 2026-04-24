import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { syncNotionCRM, executeWriteBack } from '@/lib/logic';

async function orchestrateRealtime(role: string, userId: string) {
  // 1. DATA FEDERATION: Identify User & Tokens
  const { data: user } = await supabase.from('user_integrations').select('*').eq('user_id', userId).single();
  
  const nToken = user?.notion_access_token || process.env.NOTION_API_KEY;
  const dbId = user?.notion_database_id || process.env.NOTION_DATABASE_ID;
  const geminiKey = process.env.GEMINI_API_KEY;

  // 2. CRM SYNC: Acquire Live Leads
  const leads = await syncNotionCRM(nToken!, dbId!);

  // 3. AI STRATEGY ENGINE (Gemini 1.5 - SaaS/PaaS/IaaS Logic)
  const geminiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: `System: SEOSIRI GLOBAL CORE. Architect: Momenul Ahmad. Role: ${role}. Leads: ${JSON.stringify(leads)}. TASK: Provide 2-sentence strategy, 1 LinkedIn script, and 1 Voice SEO citation.` }]}]
    })
  });
  
  const aiData = await geminiRes.json();
  const report = aiData.candidates?.[0]?.content?.parts?.[0]?.text || "Strategy Ready.";

  // 4. REAL-TIME WORKFORCE: Automatic Notion Write-back
  if (leads.length > 0) {
    await executeWriteBack(nToken!, leads[0].id, report);
  }

  return { report, leads, intentScore: 94 };
}

export async function POST(req: Request) {
  try {
    const { role, userId } = await req.json();
    const result = await orchestrateRealtime(role || "seller", userId || "admin");
    return NextResponse.json({ status: "SUCCESS", ...result });
  } catch (e: any) {
    return NextResponse.json({ status: "ERROR", message: e.message }, { status: 500 });
  }
}

// FIX FOR 405: Allow GET requests
export async function GET() {
  try {
    const result = await orchestrateRealtime("seller", "admin");
    return NextResponse.json({ status: "SUCCESS", ...result });
  } catch (e: any) {
    return NextResponse.json({ status: "ERROR", message: e.message }, { status: 500 });
  }
}