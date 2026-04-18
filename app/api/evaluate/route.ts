export const runtime = 'edge';
import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: Request) {
  const { history } = await req.json();
  const c = await groq.chat.completions.create({
    messages: [
      { role: "system", content: "Analyze tutor performance. Return ONLY JSON: {\"scores\":{\"Clarity\":{\"val\":8},\"Empathy\":{\"val\":7},\"Logic\":{\"val\":9},\"Patience\":{\"val\":8},\"English\":{\"val\":9}},\"overall_score\":85,\"verdict\":\"HIRE\",\"reasoning\":\"summary\"}" },
      { role: "user", content: JSON.stringify(history) }
    ],
    model: "llama3-8b-8192", // Fastest model
    response_format: { type: "json_object" },
    temperature: 0.1
  });
  return NextResponse.json({ report: JSON.parse(c.choices[0].message.content || '{}') });
}
