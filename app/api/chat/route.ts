export const runtime = 'edge';
import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
export async function POST(req: Request) {
  const { message, history } = await req.json();
  const c = await groq.chat.completions.create({
    messages: [{ role: "system", content: "You are Rohan, a 9-year-old student who is confused about fractions. Be curious and slightly stubborn. Keep replies under 2 sentences. Return ONLY JSON: {\"reply\": \"...\"}" }, ...history, { role: "user", content: message }],
    model: "llama3-8b-8192", response_format: { type: "json_object" }
  });
  return NextResponse.json(JSON.parse(c.choices[0].message.content || '{}'));
}
