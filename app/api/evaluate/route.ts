import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';
export const runtime = 'nodejs';
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || '',
});
export async function POST(req: Request) {
  try {
    const { history } = await req.json();
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You are a Savage Audit Evaluator at Cuemath. Your task is to perform an uncompromising, clinically blunt assessment of a tutor candidate.
          
          ### SAVAGE GRADING RULES:
          1. INDEPENDENT SCORING: Each dimension must be evaluated separately. 
          2. VARIANCE MANDATE: You MUST provide unique reached-opinion scores. NEVER give the same score (e.g. all 5s) to more than two dimensions. Be extremely opinionated—pick a distinct "High" and a distinct "Low".
          3. NO "SAFE" SCORING: Avoid the number 5, 6, and 7. Use 1-3 for things they missed, and 8-10 for things they did well.
          4. MATH-CONTEXT FILTER: If they don't teach math, everything is 0.
          5. NO HALLUCinations: Penalize heavily for short or generic answers.
          
          Analyze across these 5 dimensions (0-10) using these EXACT labels:
          1. CLARITY: Zero jargon. 0-2 if confusing, 9-10 if crystal clear.
          2. EMPATHY: TONAL check. 0 if robotic or irrelevant, 9-10 if warm.
          3. SIMPLIFY: Did they use analogies (pizza/LEGO)? If no math analogies, score < 3.
          4. ENGLISH: Professional articulation and fluency.
          5. PATIENCE: Handle Rohan's stupid questions without getting frustrated.
          
          ### SCORING FORMULA:
          - For each dimension, give a score (0-10).
          - overall_score = (Sum of all 5 dimensions) * 2.  (Max 100).
          - IF 'SIMPLIFY' or 'CLARITY' is 0, the overall_score MUST be 0. (No teaching = No hire).
          Return ONLY JSON:
          {
            "scores": {
              "CLARITY": { "val": number, "quote": "...", "insight": "..." },
              "EMPATHY": { "val": number, "quote": "...", "insight": "..." },
              "SIMPLIFY": { "val": number, "quote": "...", "insight": "..." },
              "ENGLISH": { "val": number, "quote": "...", "insight": "..." },
              "PATIENCE": { "val": number, "quote": "...", "insight": "..." }
            },
            "overall_score": number, 
            "verdict": "HIRE" | "HOLD" | "NO-HIRE",
            "reasoning": "A blunt, savage summary of why they failed or succeeded.",
            "gold_moments": ["..."],
            "improvement_areas": ["..."]
          }`
        },
        {
          role: "user",
          content: `Transcript: ${JSON.stringify(history)}`
        }
      ],
      model: "llama-3-70b-8192",
      response_format: { type: "json_object" },
    });
    const report = JSON.parse(completion.choices[0].message.content || '{}');
    return NextResponse.json({ report });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to evaluate' }, { status: 500 });
  }
}
