import { NextResponse } from 'next/server';

export async function GET() {
  // Use the exact keys from your Vercel Screenshot
  const clientID = process.env.NOTION_CLIENT_ID;
  const redirectUri = encodeURIComponent("https://aicrm.seosiri.com/api/auth/notion/callback");
  
  const url = `https://api.notion.com/v1/oauth/authorize?client_id=${clientID}&response_type=code&owner=user&redirect_uri=${redirectUri}`;
  
  return NextResponse.redirect(url);
}