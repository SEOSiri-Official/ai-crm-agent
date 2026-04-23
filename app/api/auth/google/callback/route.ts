import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get('code');
  const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

  // Exchange code for Google Tokens
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

  // SAVE TO SUPABASE VAULT
  // In a real SaaS, we link this to the current logged-in user ID
  await supabase
    .from('user_integrations')
    .update({ 
        google_tokens: tokens,
        updated_at: new Date().toISOString() 
    })
    .eq('architect_status', 'ACTIVE'); // Temporary logic until Auth is fully linked

  return NextResponse.redirect('https://aicrm.seosiri.com/dashboard?google=connected');
}