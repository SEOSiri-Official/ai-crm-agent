import { Client } from '@notionhq/client';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // INITIALIZATION OF ALL PILLARS
    const notion = new Client({ auth: process.env.NOTION_API_KEY });
    const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!);
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const aiModel = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    // PILLAR 1: NOTION (CRM SYNC)
    const notionData = await notion.databases.query({ 
      database_id: process.env.NOTION_DATABASE_ID! 
    });
    const leads = notionData.results.map((p: any) => ({
      name: p.properties.Name?.title[0]?.plain_text || "Prospect",
      email: p.properties.Email?.email || null,
      company: p.properties.Company?.rich_text[0]?.plain_text || "Global Entity"
    }));

    // PILLAR 2: SUPABASE (B2B SCHEMA & PRODUCTS)
    const { data: products } = await supabase.from('products').select('*');

    // PILLAR 3: GEMINI (AI AGENT ANALYSIS)
    const aiResponse = await aiModel.generateContent(`
      Role: SEOSIRI Sales Agent. Architect: Momenul Ahmad.
      Analyze these CRM Leads: ${JSON.stringify(leads)}.
      Cross-reference with these Products: ${JSON.stringify(products)}.
      1. Choose the top lead. 2. Draft a personalized email subject and body for them.
    `);
    
    // PILLAR 4: RESEND (ESP PREPARATION)
    // We prepare the ESP meta-data so the user can click 'Send' from the UI
    const esp_payload = {
      from: "Momenul Ahmad <agent@seosiri.com>",
      to: leads.find(l => l.email)?.email || "no-email-found",
      subject: "Strategic AI Sales Proposal"
    };

    return NextResponse.json({ 
      architect: "Momenul Ahmad",
      brand: "seosiri.com",
      status: "INTEGRATED_SYSTEM_ACTIVE",
      intelligence: {
        report: aiResponse.response.text(),
        leads: leads,
        products: products || [],
        esp_draft: esp_payload
      }
    });
  } catch (e: any) { 
    return NextResponse.json({ error: e.message, status: "Sync_Failed" }, { status: 500 }); 
  }
}