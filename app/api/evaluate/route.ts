export const runtime = 'edge';
import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
export async function POST(req: Request) {
  const { history } = await req.json();
  const c = await groq.chat.completions.create({
    messages: [{ role: "system", content: "Evaluate this interview. Return ONLY JSON: {\"scores\": {\"Clarity\":{\"val\":8},\"Empathy\":{\"val\":7},\"Simplifying\":{\"val\":9},\"English\":{\"val\":8},\"Patience\":{\"val\":9}},\"overall_score\":82,\"verdict\":\"HIRE\",\"reasoning\":\"...\"}" }, { role: "user", content: JSON.stringify(history) }],
    model: "llama3-8b-8192", response_format: { type: "json_object" }
  });
  return NextResponse.json({ report: JSON.parse(c.choices[0].message.content || '{}') });
}
