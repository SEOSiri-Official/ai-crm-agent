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
      body: JSON.stringify({ page_size: 20 })
    });

    const notionData = await notionResponse.json();
    if (!notionResponse.ok) {
        return NextResponse.json({ error: "Notion Sync Error", details: notionData.message }, { status: 500 });
    }

    // 2. HARDENED MAPPING (Prevents the '0' reading error)
    const leads = (notionData.results || []).map((p: any) => {
      // Find the property that contains the title/name
      const titleProp = Object.values(p.properties).find((prop: any) => prop.type === 'title') as any;
      
      // Safety check: only read [0] if the array is NOT empty
      const name = (titleProp?.title?.length > 0) 
        ? titleProp.title[0].plain_text 
        : "Unnamed Lead/Empty Row";

      return { name };
    }).filter(lead => lead.name !== "Unnamed Lead/Empty Row"); // Filter out the blank rows

    if (leads.length === 0) {
      return NextResponse.json({ 
        meta: { architect: "Momenul Ahmad" },
        intelligence: { report: "Your Notion CRM is empty. Add a name to your 'Business Operations' table to trigger the AI.", leads: [] }
      });
    }

    // 3. AI STRATEGY (GEMINI)
    const geminiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: `You are the SEOSIRI AI Agent designed by Momenul Ahmad. Analyze these leads for seosiri.com and provide a 3-sentence strategy: ${JSON.stringify(leads)}` }]
        }]
      })
    });

    const geminiData = await geminiResponse.json();
    
    // Safety check for Gemini response
    const report = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || "AI Brain is synchronizing. Please try again in 5 seconds.";

    return NextResponse.json({ 
      meta: { architect: "Momenul Ahmad", brand: "seosiri.com", status: "GLOBAL_ACTIVE" },
      intelligence: { report, leads }
    });

  } catch (e: any) { 
    console.error("CRITICAL ARCHITECTURAL ERROR:", e.message);
    return NextResponse.json({ 
        error: "System Synchronization Failed", 
        details: e.message 
    }, { status: 500 }); 
  }
}