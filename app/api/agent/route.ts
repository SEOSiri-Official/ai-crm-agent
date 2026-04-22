import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const NOTION_SECRET = process.env.NOTION_API_KEY;
    const NOTION_DB_ID = process.env.NOTION_DATABASE_ID;
    const GEMINI_KEY = process.env.GEMINI_API_KEY;

    // 1. DIRECT NOTION REST CALL (No Library = No "Not a Function" Error)
    const notionResponse = await fetch(`https://api.notion.com/v1/databases/${NOTION_DB_ID}/query`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${NOTION_SECRET}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ page_size: 10 })
    });

    if (!notionResponse.ok) {
        const errorText = await notionResponse.text();
        throw new Error(`Notion API Rejected Request: ${errorText}`);
    }

    const notionData = await notionResponse.json();
    const leads = notionData.results.map((p: any) => ({
      name: p.properties.Name?.title[0]?.plain_text || "Prospect",
      company: p.properties.Company?.rich_text[0]?.plain_text || "Global Org"
    }));

    // 2. DIRECT GEMINI REST CALL (Pure AI Intelligence)
    const geminiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: `System: SEOSIRI Agent. Architect: Momenul Ahmad. Analyze these leads for seosiri.com: ${JSON.stringify(leads)}` }]
        }]
      })
    });

    const geminiData = await geminiResponse.json();
    const report = geminiData.candidates[0].content.parts[0].text;

    // 3. SUCCESSFUL INTEGRATION RESPONSE
    return NextResponse.json({ 
      meta: { architect: "Momenul Ahmad", platform: "seosiri.com", status: "GLOBAL_REST_ACTIVE" },
      intelligence: { report, leads }
    });

  } catch (e: any) { 
    console.error("CRITICAL SYSTEM ERROR:", e.message);
    return NextResponse.json({ 
        error: "System Synchronization Failed", 
        details: e.message,
        solution: "Ensure Notion Database is 'Connected' to the integration"
    }, { status: 500 }); 
  }
}