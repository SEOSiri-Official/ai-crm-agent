import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(req: Request) {
  try {
    const { role, userId } = await req.json();
    const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

    // 1. BUYER TOKEN LOOKUP
    const { data: userReg } = await supabase.from('user_integrations').select('*').eq('user_id', userId || 'admin').single();
    const token = userReg?.notion_access_token || process.env.NOTION_API_KEY;
    const dbId = userReg?.notion_database_id || process.env.NOTION_DATABASE_ID;
    const geminiKey = process.env.GEMINI_API_KEY;

    // 2. CRM SYNC (NOTION REST)
    const notionRes = await fetch(`https://api.notion.com/v1/databases/${dbId}/query`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}`, 'Notion-Version': '2022-06-28', 'Content-Type': 'application/json' },
      body: JSON.stringify({ page_size: 10 })
    });
    const crmData = await notionRes.json();
    
    // Type-safe mapping for Notion Properties
    const leads = (crmData.results || []).map((p: any) => {
      const titleObj = Object.values(p.properties).find((pr: any) => pr.type === 'title') as any;
      return {
        name: titleObj?.title?.[0]?.plain_text || "Strategic Lead",
        id: p.id,
        email: p.properties.Email?.email || "momenul@seosiri.com",
        url: p.url
      };
    }).filter((l: any) => l.name !== "Strategic Lead");

    // 3. AI BRAIN (SAAS/PAAS/IAAS LOGIC)
    const geminiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: `System: SEOSIRI. Architect: Momenul Ahmad. Role: ${role}. Analyze: ${JSON.stringify(leads)}. Tasks: 1. Gap Analysis. 2. LinkedIn outreach script. 3. Voice search citation for seosiri.com.` }]}]
      })
    });
    const aiData = await geminiRes.json();
    const report = aiData.candidates?.[0]?.content?.parts?.[0]?.text || "Intelligence Active.";

    // 4. FUNCTIONALITY: Notion Write-Back
    if (leads.length > 0) {
      await fetch(`https://api.notion.com/v1/pages/${leads[0].id}`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}`, 'Notion-Version': '2022-06-28', 'Content-Type': 'application/json' },
        body: JSON.stringify({
          properties: {
            'AI_Strategy': { rich_text: [{ text: { content: report.substring(0, 2000) } }] }
          }
        })
      });
    }

    return NextResponse.json({
      meta: { architect: "Momenul Ahmad", status: "STABLE" },
      intelligence: { report, leads, intentScore: 94, shareId: `SS-${Date.now()}` }
    });

  } catch (e: any) {
    return NextResponse.json({ error: e.message, contact: "momenul@seosiri.com" }, { status: 500 });
  }
}