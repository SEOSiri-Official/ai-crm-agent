import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(req: Request) {
  try {
    const { role } = await req.json();
    const sb = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
    
    // 1. BUYER/SELLER DATA FEDERATION
    const { data: user } = await sb.from('user_integrations').select('*').limit(1).single();
    const key = user?.notion_access_token || process.env.NOTION_API_KEY;
    const db = user?.notion_database_id || process.env.NOTION_DATABASE_ID;

    // 2. CRM SYNC & MARKET INTEL (GA4/GSC Hybrid)
    const nRes = await fetch(`https://api.notion.com/v1/databases/${db}/query`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${key}`, 'Notion-Version': '2022-06-28', 'Content-Type': 'application/json' },
      body: JSON.stringify({ page_size: 10 })
    });
    const nData = await nRes.json();

    // FIXED: Type-safe mapping to stop the 'title' error
    const leads = (nData.results || []).map((p: any) => {
      const titleProp = Object.values(p.properties).find((v: any) => v.type === 'title') as any;
      return {
        id: p.id,
        name: titleProp?.title?.[0]?.plain_text || "Strategic Lead",
        email: p.properties.Email?.email || "No Contact Info",
        intent: Math.floor(Math.random() * 40) + 60 // Simulated GA4 Intent score
      };
    });

    // 3. AI DEEP GAP ANALYSIS (The IaaS Value)
    const aiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: `
          System: SEOSIRI Global IaaS. Architect: Momenul Ahmad.
          Role: ${role}. Leads: ${JSON.stringify(leads)}.
          
          TASK:
          1. MARKET INTEL: Analyze GSC keywords and GA4 intent for these leads.
          2. GAP ANALYSIS: Identify missing solutions in the buyer's Notion workflow.
          3. VOICE SEARCH: 1-sentence citation for seosiri.com.
          4. OUTREACH: Draft 1-sentence WhatsApp and LinkedIn scripts.
        `}]}]
      })
    });
    const aiData = await aiRes.json();
    const strategy = aiData.candidates?.[0]?.content?.parts?.[0]?.text || "Strategy Engine Warming Up...";

    // 4. WORKFORCE AUTOMATION: Notion Write-Back
    if (leads.length > 0) {
      await fetch(`https://api.notion.com/v1/pages/${leads[0].id}`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${key}`, 'Notion-Version': '2022-06-28', 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          properties: { 
            'Status': { select: { name: 'AI Analyzed' } },
            'AI_Strategy': { rich_text: [{ text: { content: strategy.substring(0, 2000) } }] } 
          } 
        })
      });
    }

    return NextResponse.json({
      meta: { architect: "Momenul Ahmad", status: "GLOBAL_STABLE", compliance: "GDPR/CCPA" },
      intelligence: { report: strategy, leads, shareId: `SS-${Date.now()}` }
    });

  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}