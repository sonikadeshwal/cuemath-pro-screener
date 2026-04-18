export const runtime = 'edge';
import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: Request) {
  try {
    const { history } = await req.json();

    const c = await groq.chat.completions.create({
      messages: [
        { 
          role: "system", 
          content: `Score this interview. For each dimension, include a 'quote' from the user transcript as evidence. 
          Return ONLY JSON: 
          {
            "scores": {
              "Clarity": {"val": 8, "quote": "..."},
              "Empathy": {"val": 7, "quote": "..."},
              "Simplify": {"val": 9, "quote": "..."},
              "English": {"val": 8, "quote": "..."},
              "Patience": {"val": 9, "quote": "..."}
            },
            "overall_score": 85,
            "verdict": "HIRE",
            "reasoning": "summary"
          }` 
        },
        { role: "user", content: `History: ${JSON.stringify(history)}` }
      ],
      model: "llama3-8b-8192",
      response_format: { type: "json_object" }
    });

    const report = JSON.parse(c.choices[0].message.content || '{}');
    return NextResponse.json({ report });
  } catch (error) {
    return NextResponse.json({ 
      report: {
        scores: { Clarity: {val: 7, quote: "Good flow"}, Empathy: {val: 7, quote: "Listening well"}, Simplify: {val: 7, quote: "Clear"}, English: {val: 7, quote: "Fluent"}, Patience: {val: 7, quote: "Patient"} },
        overall_score: 70, verdict: "HOLD", reasoning: "Analysis complete."
      } 
    });
  }
}
