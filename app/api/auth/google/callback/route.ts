import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get('code');
    const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

    const res = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: 'https://aicrm.seosiri.com/api/auth/google/callback',
        grant_type: 'authorization_code',
      }),
    });

    const tokens = await res.json();
    if (!res.ok) throw new Error(tokens.error_description || "Google Auth Failed");

    await supabase.from('user_integrations').upsert({ 
      google_tokens: tokens, 
      architect_status: 'ACTIVE',
      updated_at: new Date().toISOString() 
    });

    return NextResponse.redirect('https://aicrm.seosiri.com/dashboard?google=success');
  } catch (e: any) {
    return NextResponse.redirect(`https://aicrm.seosiri.com/dashboard?google=failed&reason=${encodeURIComponent(e.message)}`);
  }
}