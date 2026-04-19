// ❌ REMOVE THE runtime = 'edge' LINE ENTIRELY
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
          content: `You are a Cuemath Auditor. Score the candidate on ${topic}. 
          CRITICAL: If they talk about coffee, greeting, or random things, score MUST BE 0. 
          Return ONLY JSON: {"scores":{"Clarity":{"val":0-10,"quote":".."},"Empathy":{"val":0-10,"quote":".."},"Simplify":{"val":0-10,"quote":".."},"English":{"val":0-10,"quote":".."},"Patience":{"val":0-10,"quote":".."}},"overall_score":0-100,"verdict":"HIRE"|"NO-HIRE","reasoning":"..","model_answer":".."}` 
        },
        { role: "user", content: `History: ${JSON.stringify(history)}` }
      ],
      model: "llama3-8b-8192",
      response_format: { type: "json_object" },
      max_tokens: 500, // ⚡️ Keeps it fast
      temperature: 0.1
    });

    const report = JSON.parse(c.choices[0].message.content || '{}');
    return NextResponse.json({ report });
  } catch (error) {
    // 🚩 If it fails, we show an error instead of a fake 50 pts
    return NextResponse.json({ 
      report: {
        scores: { Clarity: {val: 0, quote: "N/A"}, Empathy: {val: 0, quote: "N/A"}, Simplify: {val: 0, quote: "N/A"}, English: {val: 0, quote: "N/A"}, Patience: {val: 0, quote: "N/A"} },
        overall_score: 0, verdict: "ERROR", reasoning: "The evaluation engine timed out or API Key is missing. Check Vercel logs.", model_answer: "N/A"
      } 
    });
  }
}
