import { NextResponse } from 'next/server';

export async function GET() {
  const rootUrl = "https://accounts.google.com/o/oauth2/v2/auth";
  const options = {
    redirect_uri: "https://aicrm.seosiri.com/api/auth/google/callback",
    client_id: process.env.GOOGLE_CLIENT_ID!,
    access_type: "offline",
    response_type: "code",
    prompt: "consent",
    scope: [
      "https://www.googleapis.com/auth/webmasters.readonly", // GSC
      "https://www.googleapis.com/auth/analytics.readonly"   // GA4
    ].join(" "),
  };

  const qs = new URLSearchParams(options);
  return NextResponse.redirect(`${rootUrl}?${qs.toString()}`);
}