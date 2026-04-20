import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';
export const runtime = 'edge';
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});
export async function POST(req: Request) {
  try {
    const { history } = await req.json();
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You are a Savage Audit Evaluator at Cuemath. Your task is to perform an uncompromising, clinically blunt assessment of a tutor candidate.
          
          ### THE "SAVAGE" RULES:
          1. MATH-CONTEXT FILTER (CRITICAL): If the candidate's responses are unrelated to math/fractions/teaching (e.g., "I like you", "You're cute", "How are you?"), the overall_score MUST be 0. We are hiring math tutors, not friends.
          2. ZERO TOLERANCE FOR NONSENSE: Gibberish (asdf, ghjk) = Score 0.
          3. SCRIPTED RESPONSE PENALTY: If the candidate repeats generic phrases ("I understand", "Don't worry") without using math analogies (pizza/LEGO), max dimension score is 3.
          4. NO HALLUCINATIONS: Do not invent positive qualities. If they were bad, say they were bad.
          
          Analyze across these 5 dimensions (0-10):
          1. Communication Clarity: Explaining math without confusing the kid.
          2. Warmth & Patience: Handled Rohan's confusion professionally (not flirtatiously or weirdly).
          3. Pedagogical Correctness: Is the math context actually correct?
          4. English Fluency: Professional articulation.
          5. Relevance & Engagement: Did they actually teach fractions? (0 if they talked about other things).
          
          ### SCORING FORMULA:
          - For each dimension, give a score (0-10).
          - overall_score = (Sum of all 5 dimensions) * 2.  (Max 100).
          - IF 'Relevance & Engagement' is < 5, verdict MUST be 'NO-HIRE'.
          - IF 'Pedagogical Correctness' is < 5, verdict MUST be 'NO-HIRE'.
          Return ONLY JSON:
          {
            "scores": {
              "Communication Clarity": { "val": number, "quote": "...", "insight": "..." },
              "Warmth & Patience": { "val": number, "quote": "...", "insight": "..." },
              "Pedagogical Correctness": { "val": number, "quote": "...", "insight": "..." },
              "English Fluency": { "val": number, "quote": "...", "insight": "..." },
              "Relevance & Engagement": { "val": number, "quote": "...", "insight": "..." }
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
