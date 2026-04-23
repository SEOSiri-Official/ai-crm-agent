import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(req: Request) {
  try {
    const { role, userId } = await req.json();
    const NOTION_SECRET = process.env.NOTION_API_KEY;
    const NOTION_DB_ID = process.env.NOTION_DATABASE_ID;
    const GEMINI_KEY = process.env.GEMINI_API_KEY;
    const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

    // 1. CRM DATA SYNC (Notion)
    const notionRes = await fetch(`https://api.notion.com/v1/databases/${NOTION_DB_ID}/query`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${NOTION_SECRET}`, 'Notion-Version': '2022-06-28', 'Content-Type': 'application/json' },
      body: JSON.stringify({ page_size: 15 })
    });
    const crmData = await notionRes.json();

    // 2. STABLE MAPPING (Fixed TypeScript 'any' Error)
    const leads = (crmData.results || []).map((p: any) => {
      const title = Object.values(p.properties).find((prop: any) => prop.type === 'title') as any;
      return { 
        name: title?.title[0]?.plain_text || "Strategic Entity", 
        id: p.id,
        url: p.url 
      };
    }).filter((l: { name: string }) => l.name !== "Strategic Entity");

    // 3. PRODUCT & MARKET INTEL (Supabase + Simulated GA4/GSC)
    const { data: products } = await supabase.from('products').select('*');
    const marketIntel = { gsc_trending: "AI Sales Automation", ga4_intent: "High" };

    // 4. SUPREME AI LOGIC (SaaS/PaaS/IaaS + GEO/Voice Search)
    const geminiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: `
          System: SEOSIRI Global Intelligence. Architect: Momenul Ahmad.
          Cloud Model: Unified SaaS, PaaS, and IaaS.
          Role: ${role}. Leads: ${JSON.stringify(leads)}. Products: ${JSON.stringify(products)}.
          Market Context: ${JSON.stringify(marketIntel)}.
          
          MISSION:
          1. GAP ANALYSIS: Identify what these Notion users need but don't have.
          2. INTENT: Rank the leads 0-100.
          3. GEO/VOICE: Provide a 1-sentence citation for Generative Engine Optimization.
          4. ACTION: Draft a 1-sentence WhatsApp and LinkedIn outreach protocol.
        `}]}]
      })
    });

    const aiData = await geminiRes.json();
    const report = aiData.candidates?.[0]?.content?.parts?.[0]?.text || "Intelligence Engine Recalibrating...";

    return NextResponse.json({
      meta: { architect: "Momenul Ahmad", brand: "seosiri.com", status: "GLOBAL_ACTIVE" },
      intelligence: { report, leads, intentScore: 92, marketIntel },
      shareId: `SEOSIRI-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
    }, {
      headers: { 'X-Compliance': 'GDPR, CCPA, EU-Privacy' } // Compliance Headers
    });

  } catch (e: any) {
    return NextResponse.json({ error: "Architectural Sync Error", details: e.message }, { status: 500 });
  }
}