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
          content: `You are a STRICT Cuemath Evaluator. 
          GOLDEN ANSWER: To explain 1/2 vs 1/4, the tutor must explain that the denominator (bottom number) represents how many pieces a whole is divided into. More pieces = Smaller size.
          
          CRITICAL RULES:
          1. If the candidate's explanation is mathmatically wrong or unrelated, give 0-3 for 'Clarity' and 'Simplify'.
          2. Do NOT be nice. If they didn't explain the concept, they fail.
          3. Generate a 'model_answer' showing how a Pro Cuemath Tutor would have explained it.
          
          Return ONLY JSON: 
          {
            "scores": {
              "Clarity": {"val": 0-10, "quote": "..."},
              "Empathy": {"val": 0-10, "quote": "..."},
              "Simplify": {"val": 0-10, "quote": "..."},
              "English": {"val": 0-10, "quote": "..."},
              "Patience": {"val": 0-10, "quote": "..."}
            },
            "overall_score": 0-100,
            "verdict": "HIRE" | "HOLD" | "NO-HIRE",
            "reasoning": "Be critical of failures.",
            "model_answer": "Complete perfect explanation starting with: 'A great tutor would have said...'"
          }` 
        },
        { role: "user", content: `Interview Transcript: ${JSON.stringify(history)}` }
      ],
      model: "llama3-8b-8192",
      response_format: { type: "json_object" }
    });

    const report = JSON.parse(c.choices[0].message.content || '{}');
    return NextResponse.json({ report });
  } catch (error) {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
