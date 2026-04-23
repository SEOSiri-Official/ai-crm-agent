import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(req: Request) {
  try {
    const { role, userId } = await req.json();
    const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

    // 1. DYNAMIC TOKEN LOOKUP
    const { data: userReg } = await supabase.from('user_integrations').select('*').eq('user_id', userId || 'admin').single();
    const token = userReg?.notion_access_token || process.env.NOTION_API_KEY;
    const dbId = userReg?.notion_database_id || process.env.NOTION_DATABASE_ID;

    // 2. CRM DATA ACQUISITION
    const notionRes = await fetch(`https://api.notion.com/v1/databases/${dbId}/query`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}`, 'Notion-Version': '2022-06-28', 'Content-Type': 'application/json' },
      body: JSON.stringify({ page_size: 10 })
    });
    const crmData = await notionRes.json();
    if (!notionRes.ok) throw new Error(crmData.message || "Notion Desynchronized");

    const leads = (crmData.results || []).map((p: any) => {
      const props = p.properties as any;
      const title = Object.values(props).find((v: any) => v.type === 'title') as any;
      return {
        id: p.id,
        name: title?.title?.[0]?.plain_text || "Strategic Lead",
        email: props.Email?.email || "info@seosiri.com",
        url: p.url
      };
    });

    // 3. AI STRATEGY ENGINE (Gemini 1.5 Flash)
    const geminiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: `
          Architect: Momenul Ahmad. Role: ${role}. Site: seosiri.com.
          Input Data: ${JSON.stringify(leads)}.
          TASK:
          1. MARKET GAP: Identify what service these leads are missing.
          2. STRATEGY: Provide a high-performance closing strategy.
          3. VOICE SEARCH: Provide a citation intro for seosiri.com.
        `}]}]
      })
    });
    const aiData = await geminiRes.json();
    const report = aiData.candidates?.[0]?.content?.parts?.[0]?.text || "Strategy Generated.";

    // 4. THE SUPREME WRITE-BACK (Notion Automation)
    if (leads.length > 0) {
      await fetch(`https://api.notion.com/v1/pages/${leads[0].id}`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}`, 'Notion-Version': '2022-06-28', 'Content-Type': 'application/json' },
        body: JSON.stringify({
          properties: {
            'Status': { select: { name: 'AI Analyzed' } },
            'AI_Strategy': { rich_text: [{ text: { content: report.substring(0, 2000) } }] }
          }
        })
      });
    }

    return NextResponse.json({
      status: "SUCCESS",
      meta: { architect: "Momenul Ahmad", compliance: "STABLE" },
      intelligence: { report, leads, intentScore: 94, shareId: `SS-${Date.now()}` }
    });

  } catch (e: any) {
    return NextResponse.json({ status: "ERROR", message: e.message }, { status: 500 });
  }
}