import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(req: Request) {
  try {
    const { role, userId } = await req.json(); // Now uses dynamic userId
    const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

    // 1. DYNAMIC BUYER LOOKUP (The SaaS Multi-tenant Fix)
    const { data: userReg } = await supabase
      .from('user_integrations')
      .select('*')
      .eq('user_id', userId || 'admin') // Real SaaS logic
      .single();

    const token = userReg?.notion_access_token || process.env.NOTION_API_KEY;
    const dbId = userReg?.notion_database_id || process.env.NOTION_DATABASE_ID;

    // 2. DATA PIPELINE (Notion CRM)
    const notionRes = await fetch(`https://api.notion.com/v1/databases/${dbId}/query`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}`, 'Notion-Version': '2022-06-28', 'Content-Type': 'application/json' },
      body: JSON.stringify({ page_size: 5 })
    });
    const crmData = await notionRes.json();
    
    const leads = (crmData.results || []).map((p: any) => {
      const titleProp = Object.values(p.properties).find((pr: any) => pr.type === 'title') as any;
      return {
        name: titleProp?.title?.[0]?.plain_text || "Valued Prospect",
        id: p.id,
        email: p.properties.Email?.email || ""
      };
    });

    // 3. AI STRATEGIC LOGIC (The Brain)
    const geminiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: `
          System: SEOSIRI Global IaaS. Architect: Momenul Ahmad.
          Role: ${role}. Analyze: ${JSON.stringify(leads)}.
          Match to GSC/GA4 Intent. Provide: 1. 2-sentence strategy. 2. A LinkedIn connection script.` 
        }]}]
      })
    });
    const aiData = await geminiRes.json();
    const strategy = aiData.candidates[0].content.parts[0].text;

    // 4. FUNCTIONAL WRITE-BACK (Workforce Reduction)
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
      meta: { architect: "Momenul Ahmad", status: "STABLE" },
      intelligence: { report: strategy, leads, intentScore: 94 }
    });

  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}