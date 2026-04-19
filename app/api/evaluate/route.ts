export const runtime = 'edge';
import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: Request) {
  try {
    const { history } = await req.json();
    const topic = history[0]?.topic || "math";

    const c = await groq.chat.completions.create({
      messages: [
        { 
          role: "system", 
          content: `You are a COLD, CALCULATING Auditor for Cuemath. 
          
          THE "AUTO-FAIL" RULES:
          1. If the candidate says things like "I like coffee", "Hello", "How are you" without explaining math, they get 0.
          2. If the total user messages are less than 2, they get 0.
          3. If their explanation is logically wrong for ${topic}, they get 0.
          
          You MUST return ONLY JSON: 
          {"scores":{"Clarity":{"val":0,"quote":"..."},"Empathy":{"val":0,"quote":"..."},"Simplify":{"val":0,"quote":"..."},"English":{"val":0,"quote":"..."},"Patience":{"val":0,"quote":"..."}},"overall_score":0,"verdict":"NO-HIRE","reasoning":"Briefly explain why they failed (e.g., 'Candidate talked about coffee instead of fractions')","model_answer":"The correct way to explain this is..."}` 
        },
        { role: "user", content: `Math Topic: ${topic}. Transcript to Audit: ${JSON.stringify(history)}` }
      ],
      model: "llama3-8b-8192",
      response_format: { type: "json_object" },
      temperature: 0, // 0 = Absolute consistency
    });

    const report = JSON.parse(c.choices[0].message.content || '{}');
    return NextResponse.json({ report });
  } catch (error) {
    // 🛡️ NEW SAFETY FALLBACK (0 Score)
    // If the system fails, we assume the candidate didn't provide enough data
    return NextResponse.json({ 
      report: {
        scores: { Clarity: {val: 0, quote: "N/A"}, Empathy: {val: 0, quote: "N/A"}, Simplify: {val: 0, quote: "N/A"}, English: {val: 0, quote: "N/A"}, Patience: {val: 0, quote: "N/A"} },
        overall_score: 0, verdict: "REJECT", reasoning: "System timeout or insufficient data provided by candidate.", model_answer: "Insufficient data to provide model answer."
      } 
    });
  }
}
