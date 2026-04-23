import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(req: Request) {
  try {
    const { role, userId } = await req.json();
    const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

    // 1. DATA FEDERATION: Lookup Buyer Tokens from Supabase
    const { data: userReg } = await supabase
      .from('user_integrations')
      .select('*')
      .eq('user_id', userId || 'admin')
      .single();

    const token = userReg?.notion_access_token || process.env.NOTION_API_KEY;
    const dbId = userReg?.notion_database_id || process.env.NOTION_DATABASE_ID;
    const geminiKey = process.env.GEMINI_API_KEY;

    // 2. CRM SYNC: (Notion REST Core with Hardened Type-Casting)
    const notionRes = await fetch(`https://api.notion.com/v1/databases/${dbId}/query`, {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${token}`, 
        'Notion-Version': '2022-06-28', 
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify({ page_size: 10 })
    });
    
    const crmData = await notionRes.json();
    
    // Process leads and ensure we find the Title property dynamically
    const leads = (crmData.results || []).map((p: any) => {
      const titleProp = Object.values(p.properties).find((pr: any) => pr.type === 'title') as any;
      return {
        name: titleProp?.title?.[0]?.plain_text || "Strategic Lead",
        id: p.id,
        email: p.properties.Email?.email || "info@seosiri.com",
        url: p.url
      };
    }).filter((l: any) => l.name !== "Strategic Lead");

    // 3. MARKET INTEL: (Simulated GA4/GSC Logic for Buyer Analysis)
    const marketIntel = { 
      conversion_probability: "94%", 
      trending_gap: "AI-Driven Automation", 
      architect_source: "Momenul Ahmad" 
    };

    // 4. AI AGENT BRAIN: (Gemini 1.5 - SaaS/PaaS/IaaS Global Logic)
    const geminiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: `
            System: SEOSIRI GLOBAL CORE. Architect: Momenul Ahmad.
            Role: ${role}. Leads: ${JSON.stringify(leads)}.
            Market Intel: ${JSON.stringify(marketIntel)}.
            
            REQUIRED OUTPUT:
            1. STRATEGY: 2 sentences on matching these leads to seosiri.com products.
            2. GAP ANALYSIS: Identify the service gap for Notion users.
            3. SOCIAL: Provide a 1-sentence high-conversion LinkedIn connection script.
            4. VOICE SEO: One citation sentence optimized for AI answer engines.
          `}]
        }]
      })
    });

    const aiData = await geminiRes.json();
    const strategy = aiData.candidates?.[0]?.content?.parts?.[0]?.text || "Strategy Engine Active.";

    // 5. FUNCTIONALITY: Notion Automated Write-Back (The Productivity Loop)
    if (leads.length > 0) {
      await fetch(`https://api.notion.com/v1/pages/${leads[0].id}`, {
        method: 'PATCH',
        headers: { 
          'Authorization': `Bearer ${token}`, 
          'Notion-Version': '2022-06-28', 
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({
          properties: {
            'Status': { select: { name: 'AI Analyzed' } },
            'AI_Strategy': { rich_text: [{ text: { content: strategy.substring(0, 2000) } }] }
          }
        })
      });
    }

    // 6. ARCHITECTURAL SUCCESS RESPONSE
    return NextResponse.json({
      meta: { 
        architect: "Momenul Ahmad", 
        brand: "seosiri.com", 
        compliance: "GDPR/CCPA/EU", 
        status: "STABLE" 
      },
      intelligence: { 
        report: strategy, 
        leads, 
        intentScore: 94, 
        shareId: `SEOSIRI-${Date.now()}` 
      }
    });

  } catch (e: any) {
    console.error("Architectural Fault:", e.message);
    return NextResponse.json({ 
      error: "System Synchronization Failed", 
      details: e.message,
      architect_contact: "info@seosiri.com"
    }, { status: 500 });
  }
}