import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get('code');

    if (!code) throw new Error("No authorization code provided from Notion.");

    // 1. Exchange Code for Access Token
    const notionRes = await fetch('https://api.notion.com/v1/oauth/token', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${Buffer.from(`${process.env.NOTION_CLIENT_ID}:${process.env.NOTION_CLIENT_SECRET}`).toString('base64')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: 'https://aicrm.seosiri.com/api/auth/notion/callback',
      }),
    });

    const authData = await notionRes.json();

    if (!notionRes.ok) throw new Error(authData.message || "Failed to exchange Notion token");

    // 2. Save Token to Supabase (Architectural Vault)
    const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
    
    const { error: dbError } = await supabase
      .from('user_integrations')
      .insert([{
        notion_access_token: authData.access_token,
        notion_workspace_id: authData.workspace_id,
        notion_database_id: authData.duplicated_template_id || null, // Captures the DB if using a template
      }]);

    if (dbError) throw new Error("Supabase Storage Failed: " + dbError.message);

    // 3. Redirect to Dashboard with Success Signal
    return NextResponse.redirect('https://aicrm.seosiri.com/dashboard?auth=success');

  } catch (e: any) {
    console.error("OAuth Error:", e.message);
    return NextResponse.redirect(`https://aicrm.seosiri.com/dashboard?auth=failed&details=${encodeURIComponent(e.message)}`);
  }
}