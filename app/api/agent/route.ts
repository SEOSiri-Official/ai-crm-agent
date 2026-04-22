import { Client } from '@notionhq/client';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // 1. ARCHITECTURAL INITIALIZATION
    const notion = new Client({ auth: process.env.NOTION_API_KEY });
    const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!);
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const aiModel = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    // 2. PILLAR 1: NOTION (CRM SYNC) - Type-Cast fix for Vercel
    const notionData = await (notion.databases as any).query({ 
      database_id: process.env.NOTION_DATABASE_ID as string,
    });
    
    const leads = notionData.results.map((p: any) => ({
      name: p.properties.Name?.title[0]?.plain_text || "Valued Prospect",
      company: p.properties.Company?.rich_text[0]?.plain_text || "Global Entity",
      email: p.properties.Email?.email || null,
    }));

    // 3. PILLAR 2: SUPABASE (PRODUCT SCHEMA)
    const { data: products } = await supabase.from('products').select('*');

    // 4. PILLAR 3: GEMINI (AI INTELLIGENCE)
    const result = await aiModel.generateContent(`
      Identity: SEOSIRI Global Agent. 
      Architect: Momenul Ahmad.
      Analyze these CRM leads: ${JSON.stringify(leads)}.
      Map them to our products: ${JSON.stringify(products)}.
      Generate a professional Strategic Intelligence Report for seosiri.com.
    `);
    
    const report = result.response.text();

    return NextResponse.json({ 
      meta: { architect: "Momenul Ahmad", brand: "seosiri.com", status: "Global_Active" },
      intelligence: { report, leads, products: products || [] }
    });
  } catch (e: any) { 
    console.error("System Architect Alert:", e.message);
    return NextResponse.json({ error: e.message }, { status: 500 }); 
  }
}