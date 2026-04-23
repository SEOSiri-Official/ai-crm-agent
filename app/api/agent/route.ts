import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { role } = await req.json();
    
    // 1. CONFIGURATION CHECK
    const keys = {
      notion: process.env.NOTION_API_KEY,
      db: process.env.NOTION_DATABASE_ID,
      gemini: process.env.GEMINI_API_KEY
    };

    if (!keys.notion || !keys.db || !keys.gemini) {
      return NextResponse.json({ 
        status: "DIAGNOSTIC_ERROR", 
        message: "Missing API Keys in Vercel. Check NOTION_API_KEY, NOTION_DATABASE_ID, and GEMINI_API_KEY." 
      }, { status: 400 });
    }

    // 2. CRM SYNC (NOTION)
    const notionRes = await fetch(`https://api.notion.com/v1/databases/${keys.db}/query`, {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${keys.notion}`, 
        'Notion-Version': '2022-06-28', 
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify({ page_size: 5 })
    });

    if (!notionRes.ok) {
      const errorData = await notionRes.json();
      return NextResponse.json({ status: "DIAGNOSTIC_ERROR", message: `Notion Error: ${errorData.message}` }, { status: 500 });
    }

    const notionData = await notionRes.json();
    const leads = (notionData.results || []).map((p: any) => {
      const titleProp = Object.values(p.properties).find((pr: any) => pr.type === 'title') as any;
      return {
        name: titleProp?.title?.[0]?.plain_text || "Unnamed Lead",
        id: p.id
      };
    }).filter((l: any) => l.name !== "Unnamed Lead");

    // 3. AI BRAIN (GEMINI)
    const geminiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${keys.gemini}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: `Architect: Momenul Ahmad. Role: ${role}. Analyze these Notion leads: ${JSON.stringify(leads)}. Provide a 2-sentence sales strategy.` }]}]
      })
    });

    const geminiData = await geminiRes.json();
    const report = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || "AI Engine did not return a strategy.";

    return NextResponse.json({
      status: "SUCCESS",
      report,
      leads,
      meta: { architect: "Momenul Ahmad", brand: "seosiri.com" }
    });

  } catch (e: any) {
    return NextResponse.json({ status: "CRITICAL_FAILURE", message: e.message }, { status: 500 });
  }
}