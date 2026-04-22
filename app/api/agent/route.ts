import { Client } from '@notionhq/client';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // 1. SYSTEM INITIALIZATION
    const notion = new Client({ auth: process.env.NOTION_API_KEY });
    const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!);
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const aiModel = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    // 2. PILLAR 1: CRM SYNC (NOTION)
    const notionData = await (notion.databases as any).query({ 
      database_id: process.env.NOTION_DATABASE_ID as string,
    });
    
    const leads = notionData.results.map((p: any) => ({
      name: p.properties.Name?.title[0]?.plain_text || "Valued Prospect",
      company: p.properties.Company?.rich_text[0]?.plain_text || "Global Entity",
      email: p.properties.Email?.email || null,
    }));

    // 3. PILLAR 2: PRODUCT SCHEMA (SUPABASE)
    const { data: products } = await supabase.from('products').select('*');
    const productList = products?.map(p => `${p.product_name} ($${p.price})`).join(", ") || "SEOSIRI Custom Solutions";

    // 4. PILLAR 3: STRATEGIC INTELLIGENCE (GEMINI + SOCIAL PROTOCOL)
    const systemPrompt = `
      Identity: SEOSIRI Global Agent. 
      Architect: Momenul Ahmad.
      Site: seosiri.com.
      
      Leads: ${JSON.stringify(leads)}.
      Product Catalog: ${productList}.
      
      MISSION:
      Analyze these leads and provide a Strategic Intelligence Report including:
      1. PRIORITY: Identify the 'Hottest' lead.
      2. ESP DRAFT: A 2-sentence professional cold email intro for seosiri.com.
      3. SOCIAL PROTOCOL: 
         - A high-conversion LinkedIn Connection Request (under 150 chars).
         - A short, direct WhatsApp follow-up message.
      
      Maintain the tone of an elite Global Sales Architect.
    `;
    
    const result = await aiModel.generateContent(systemPrompt);
    const report = result.response.text();

    // 5. GLOBAL STANDARDIZED RESPONSE
    return NextResponse.json({ 
      meta: { 
        architect: "Momenul Ahmad", 
        brand: "seosiri.com", 
        status: "GLOBAL_ACTIVE",
        timestamp: new Date().toISOString()
      },
      intelligence: { 
        report: report, 
        leads, 
        products: products || [] 
      },
      protocols: {
        messaging_integrated: true,
        esp_ready: true
      }
    });
  } catch (e: any) { 
    console.error("Architectural System Error:", e.message);
    return NextResponse.json({ 
        error: "System Synchronization Failed", 
        details: e.message,
        contact: "info@seosiri.com"
    }, { status: 500 }); 
  }
}