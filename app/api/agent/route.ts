// 1. Direct import to solve the "not a function" bug
import { Client } from '@notionhq/client';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // 2. Validate Env Variables (Architectural Best Practice)
    const notionKey = process.env.NOTION_API_KEY;
    const dbId = process.env.NOTION_DATABASE_ID;
    
    if (!notionKey || !dbId) {
        throw new Error("Missing Notion Environment Variables in Vercel");
    }

    // 3. System Initialization
    const notion = new Client({ auth: notionKey });
    const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!);
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const aiModel = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    // 4. CRM SYNC (Force Type-Cast to ensure query exists)
    const notionData = await (notion as any).databases.query({ 
      database_id: dbId 
    });
    
    const leads = notionData.results.map((p: any) => ({
      name: p.properties.Name?.title[0]?.plain_text || "Prospect",
      company: p.properties.Company?.rich_text[0]?.plain_text || "Global Entity",
      email: p.properties.Email?.email || null,
    }));

    // 5. AI STRATEGY Logic
    const result = await aiModel.generateContent(`
      Analyze these CRM leads for seosiri.com: ${JSON.stringify(leads)}.
      Architect: Momenul Ahmad. Provide a strategic report.
    `);
    
    const report = result.response.text();

    return NextResponse.json({ 
      meta: { architect: "Momenul Ahmad", brand: "seosiri.com" },
      intelligence: { report, leads }
    });

  } catch (e: any) { 
    console.error("System Error Log:", e.message);
    return NextResponse.json({ 
        error: "Synchronization Failed", 
        details: e.message 
    }, { status: 500 }); 
  }
}