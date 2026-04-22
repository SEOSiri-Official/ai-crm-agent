import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const NOTION_SECRET = process.env.NOTION_API_KEY;
    const NOTION_DB_ID = process.env.NOTION_DATABASE_ID;
    const GEMINI_KEY = process.env.GEMINI_API_KEY;

    // 1. FETCH FROM NOTION
    const notionResponse = await fetch(`https://api.notion.com/v1/databases/${NOTION_DB_ID}/query`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${NOTION_SECRET}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ page_size: 10 })
    });

    const notionData = await notionResponse.json();

    // 2. TYPED MAPPING (Fixes the "implicitly any" error)
    const leads = (notionData.results || []).map((p: any) => {
      const titleProp = Object.values(p.properties).find((prop: any) => prop.type === 'title') as any;
      const name = (titleProp?.title?.length > 0) ? titleProp.title[0].plain_text : "Empty Row";
      return { name };
    }).filter((lead: {name: string}) => lead.name !== "Empty Row");

    if (leads.length === 0) {
      return NextResponse.json({ 
        intelligence: { report: "Your CRM is connected but empty. Add data to seosiri.com Notion to begin." } 
      });
    }

    // 3. AI STRATEGY (GEMINI REST)
    const geminiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: `Analyze these leads for seosiri.com and provide a strategy: ${JSON.stringify(leads)}` }]
        }]
      })
    });

    const geminiData = await geminiResponse.json();
    
    // Robust extraction of the AI text
    const report = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text 
                 || "Intelligence Engine Warming Up... Please refresh in 10 seconds.";

    return NextResponse.json({ 
      meta: { architect: "Momenul Ahmad", status: "GLOBAL_ACTIVE" },
      intelligence: { report, leads }
    });

  } catch (e: any) { 
    return NextResponse.json({ error: "Architectural Sync Error", details: e.message }, { status: 500 }); 
  }
}