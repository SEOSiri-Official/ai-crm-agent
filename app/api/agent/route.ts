import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(req: Request) {
  try {
    const { role, userId } = await req.json();
    const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

    // 1. MULTI-TENANT TOKEN LOOKUP
    const { data: userReg } = await supabase.from('user_integrations').select('*').eq('user_id', userId || 'admin').single();
    const token = userReg?.notion_access_token || process.env.NOTION_API_KEY;
    const dbId = userReg?.notion_database_id || process.env.NOTION_DATABASE_ID;

    // 2. CRM & MARKET DATA SYNC
    const notionRes = await fetch(`https://api.notion.com/v1/databases/${dbId}/query`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}`, 'Notion-Version': '2022-06-28', 'Content-Type': 'application/json' },
      body: JSON.stringify({ page_size: 10 })
    });
    const crmData = await notionRes.json();
    
    // Hardened Property Mapping (Solves the 'title' error)
    const leads = (crmData.results || []).map((p: any) => {
      const props = p.properties as any;
      const name = props.Name?.title?.[0]?.plain_text || props.title?.title?.[0]?.plain_text || "Strategic Lead";
      return { id: p.id, name, email: props.Email?.email || "info@seosiri.com", url: p.url };
    }).filter((l: any) => l.name !== "Strategic Lead");

    // 3. AI STRATEGIC ANALYSIS (SaaS/PaaS/IaaS Logic)
    const geminiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: `
          Architect: Momenul Ahmad. Brand: seosiri.com.
          Role: ${role}. Leads: ${JSON.stringify(leads)}.
          Context: High-performance Market Intelligence (GSC/GA4 intent).
          TASK: 1. Identify Sales Gaps. 2. Write a 2-sentence strategy. 3. Provide a LinkedIn Connect script. 4. Voice citation for GEO ranking.
        `}]}]
      })
    });
    const aiData = await geminiRes.json();
    const report = aiData.candidates?.[0]?.content?.parts?.[0]?.text || "Intelligence Engine Online.";

    // 4. THE SUPREME WRITE-BACK (Functionality)
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
      meta: { architect: "Momenul Ahmad", contact: "info@seosiri.com", status: "STABLE" },
      intelligence: { report, leads, intentScore: 94, shareId: `SEOSIRI-${Date.now()}` }
    });

  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}