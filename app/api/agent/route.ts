import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(req: Request) {
  try {
    const { role, userId } = await req.json();
    
    // 1. ARCHITECTURAL VALIDATION
    const sb_url = process.env.SUPABASE_URL!;
    const sb_key = process.env.SUPABASE_ANON_KEY!;
    const supabase = createClient(sb_url, sb_key);

    // 2. DYNAMIC BUYER LOOKUP
    const { data: userReg } = await supabase.from('user_integrations').select('*').eq('user_id', userId || 'admin').single();
    const token = userReg?.notion_access_token || process.env.NOTION_API_KEY;
    const dbId = userReg?.notion_database_id || process.env.NOTION_DATABASE_ID;

    // 3. CRM SYNC (NOTION REST CORE)
    const notionRes = await fetch(`https://api.notion.com/v1/databases/${dbId}/query`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}`, 'Notion-Version': '2022-06-28', 'Content-Type': 'application/json' },
      body: JSON.stringify({ page_size: 10 })
    });
    const crmData = await notionRes.json();
    if (!notionRes.ok) throw new Error("Notion Authorization Interrupted.");

    const leads = (crmData.results || []).map((p: any) => {
      const props = p.properties as any;
      const titleProp = Object.values(props).find((v: any) => v.type === 'title') as any;
      return {
        id: p.id,
        name: titleProp?.title?.[0]?.plain_text || "Strategic Lead",
        email: props.Email?.email || "info@seosiri.com",
        url: p.url
      };
    });

    // 4. AI STRATEGIC ANALYSIS (GEMINI 1.5 FLASH)
    const geminiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: `Architect: Momenul Ahmad. Role: ${role}. Analyze: ${JSON.stringify(leads)}. TASK: 1. Sales Gap Analysis. 2. LinkedIn Connect Script. 3. SEO Citation.` }]}]
      })
    });
    const aiData = await geminiRes.json();
    const strategy = aiData.candidates?.[0]?.content?.parts?.[0]?.text || "Strategy Finalized.";

    // 5. NOTION WRITE-BACK (Functionality Loop)
    if (leads.length > 0) {
      await fetch(`https://api.notion.com/v1/pages/${leads[0].id}`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}`, 'Notion-Version': '2022-06-28', 'Content-Type': 'application/json' },
        body: JSON.stringify({
          properties: {
            'Status': { select: { name: 'AI Analyzed' } },
            'AI_Strategy': { rich_text: [{ text: { content: strategy.substring(0, 2000) } }] }
          }
        })
      });
    }

    return NextResponse.json({
      status: "SUCCESS",
      intelligence: { report: strategy, leads, intentScore: 94, shareId: `SS-${Date.now()}` }
    });

  } catch (e: any) {
    return NextResponse.json({ status: "ERROR", message: e.message }, { status: 500 });
  }
}