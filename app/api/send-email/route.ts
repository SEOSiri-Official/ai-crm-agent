import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { to, content } = await req.json();
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${process.env.RESEND_API_KEY}` },
      body: JSON.stringify({
        from: 'SEOSIRI Global <info@seosiri.com>',
        to: [to],
        subject: 'SEOSIRI Strategic Intelligence Update',
        html: `<strong>Architected by Momenul Ahmad</strong><p>${content}</p>`
      }),
    });
    const data = await res.json();
    return NextResponse.json({ status: "SENT", data });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}