import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const NOTION_SECRET = process.env.NOTION_API_KEY;
    const NOTION_DB_ID = process.env.NOTION_DATABASE_ID;
    const GEMINI_KEY = process.env.GEMINI_API_KEY;

    // 1. Fetch from Notion
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

    if (!notionResponse.ok) {
      return NextResponse.json({ error: "Notion Error", details: notionData.message }, { status: 500 });
    }

    // 2. RESILIENT MAPPING: Don't crash if columns are missing
    const leads = (notionData.results || []).map((p: any) => {
      // Find the title property regardless of what it is named
      const titleKey = Object.keys(p.properties).find(key => p.properties[key].type === 'title');
      const name = titleKey ? p.properties[titleKey].title[0]?.plain_text : "Unnamed Lead";
      
      return { name };
    });

    if (leads.length === 0) {
      return NextResponse.json({ 
        meta: { architect: "Momenul Ahmad" },
        intelligence: { report: "CRM is empty. Please add a row in Notion to see the AI analysis.", leads: [] }
      });
    }

    // 3. AI Analysis
    const geminiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: `System: SEOSIRI. Architect: Momenul Ahmad. Analyze these leads: ${JSON.stringify(leads)}` }]
        }]
      })
    });

    const geminiData = await geminiResponse.json();
    const report = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || "AI logic synchronization pending.";

    return NextResponse.json({ 
      meta: { architect: "Momenul Ahmad", brand: "seosiri.com", status: "GLOBAL_ACTIVE" },
      intelligence: { report, leads }
    });

  } catch (e: any) { 
    return NextResponse.json({ error: "System Sync Failed", details: e.message }, { status: 500 }); 
  }
}