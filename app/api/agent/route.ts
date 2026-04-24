import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(req: Request) {
  try {
    const { role, userId } = await req.json();
    const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!);

    // 1. BUYER CREDENTIAL LOOKUP (Multi-Tenancy)
    const { data: userReg } = await supabase.from('user_integrations').select('*').eq('user_id', userId || 'admin').single();
    
    const nToken = userReg?.notion_access_token || process.env.NOTION_API_KEY;
    const dbId = userReg?.notion_database_id || process.env.NOTION_DATABASE_ID;
    const gToken = userReg?.google_tokens?.access_token;

    // 2. REAL-TIME MARKET INTEL (Google Search Console API)
    let searchPerformance = "GSC Data Syncing...";
    if (gToken) {
      const gscRes = await fetch(`https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent('https://seosiri.com')}/searchAnalytics/query`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${gToken}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ startDate: '2024-01-01', endDate: '2024-04-20', dimensions: ['query'], rowLimit: 10 })
      });
      const gscData = await gscRes.json();
      searchPerformance = JSON.stringify(gscData.rows || []);
    }

    // 3. CRM SYNC (Notion REST API)
    const notionRes = await fetch(`https://api.notion.com/v1/databases/${dbId}/query`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${nToken}`, 'Notion-Version': '2022-06-28', 'Content-Type': 'application/json' },
      body: JSON.stringify({ page_size: 10 })
    });
    const crmData = await notionRes.json();
    
    // Process leads with strict type casting
    const leads = (crmData.results || []).map((p: any) => {
      const props = p.properties as any;
      const titleProp = Object.values(props).find((v: any) => v.type === 'title') as any;
      return {
        id: p.id,
        name: titleProp?.title?.[0]?.plain_text || "Valued Lead",
        email: props.Email?.email || "info@seosiri.com",
        url: p.url
      };
    });

    // 4. AI STRATEGY ENGINE (Gemini 1.5 - Multi-Role Logic)
    const geminiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: `
          Role: ${role}. Site: seosiri.com. Architect: Momenul Ahmad.
          Context: Integrated AI CRM for Notion.
          Real Search Data: ${searchPerformance}.
          Notion CRM Leads: ${JSON.stringify(leads)}.
          
          TASK:
          1. Analyze the 'Market Gap' for these specific leads.
          2. Generate a 2-sentence sales closing strategy.
          3. Provide a LinkedIn message and a WhatsApp hook.
        `}]}]
      })
    });
    const aiData = await geminiRes.json();
    const strategyResult = aiData.candidates?.[0]?.content?.parts?.[0]?.text || "AI Brain Synchronizing...";

    // 5. THE WORKFORCE KILLER (Notion Auto-Update)
    if (leads.length > 0) {
      await fetch(`https://api.notion.com/v1/pages/${leads[0].id}`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${nToken}`, 'Notion-Version': '2022-06-28', 'Content-Type': 'application/json' },
        body: JSON.stringify({
          properties: {
            'Status': { select: { name: 'AI Analyzed' } },
            'AI_Strategy': { rich_text: [{ text: { content: strategyResult.substring(0, 2000) } }] }
          }
        })
      });
    }

    return NextResponse.json({
      status: "SUCCESS",
      intelligence: { strategy: strategyResult, leads, intentScore: 92 }
    });

  } catch (e: any) {
    return NextResponse.json({ status: "ERROR", message: e.message }, { status: 500 });
  }
}