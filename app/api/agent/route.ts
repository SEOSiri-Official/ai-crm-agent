import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET() {
  try {
    const notion = { secret: process.env.NOTION_API_KEY, db: process.env.NOTION_DATABASE_ID };
    const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!);
    const geminiKey = process.env.GEMINI_API_KEY;

    // 1. CRM SYNC: Fetch Notion Leads (Hardened against empty rows)
    const notionRes = await fetch(`https://api.notion.com/v1/databases/${notion.db}/query`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${notion.secret}`, 'Notion-Version': '2022-06-28', 'Content-Type': 'application/json' },
      body: JSON.stringify({ page_size: 15 })
    });
    const notionData = await notionRes.json();
    const leads = (notionData.results || []).map((p: any) => {
      const titleProp = Object.values(p.properties).find((prop: any) => prop.type === 'title') as any;
      return {
        id: p.id,
        url: p.url,
        name: titleProp?.title?.length > 0 ? titleProp.title[0].plain_text : "Empty Row"
      };
    }).filter((l: any) => l.name !== "Empty Row");

    // 2. PRODUCT CONTEXT: Fetch from Supabase
    const { data: products } = await supabase.from('products').select('*');

    // 3. AI BRAIN: Creative Thinking & Strategy
    const geminiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: `
            System: SEOSIRI Global Agent. Architect: Momenul Ahmad.
            Context: Sales Intelligence for Notion Users.
            Leads: ${JSON.stringify(leads)}.
            Products: ${JSON.stringify(products)}.
            
            Task:
            1. Rank leads. 2. Predict the main sales objection for the top lead.
            3. Write a 1-sentence "Growth Hack" for them.
            4. Draft a LinkedIn Connect script and a WhatsApp follow-up.
          `}]
        }]
      })
    });
    const geminiData = await geminiRes.json();
    const report = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || "Intelligence Syncing...";

    return NextResponse.json({ 
      meta: { architect: "Momenul Ahmad", brand: "seosiri.com", status: "SYNC_OK" },
      intelligence: { report, leads, products }
    });
  } catch (e: any) {
    return NextResponse.json({ error: "Architecture Error", details: e.message }, { status: 500 });
  }
}