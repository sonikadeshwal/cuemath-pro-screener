import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';
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
          content: `You are a Strict Audit Evaluator at Cuemath. Your task is to perform an uncompromising assessment of a tutor candidate.
          
          ### CRITICAL RULES:
          1. ZERO TOLERANCE FOR NONSENSE: If the candidate's responses are gibberish (e.g., "asdf", "ghjk"), repetitive symbols, or completely unrelated to teaching math/fractions, you MUST give a 0 for ALL dimensions.
          2. QUALITY OVER QUANTITY: Short, unhelpful responses that don't explain anything properly should receive scores below 3.
          3. SCRIPTED RESPONSE CHECK: Detect if the candidate is just repeating a generic script (e.g., "I understand your confusion") without actually addressing the student's specific pizza/LEGO analogy. Generic, robotic responses should not exceed a 4.
          4. HALLUCINATION CHECK: Do NOT invent positive traits. If the transcript shows poor performance, the scores MUST reflect that.
          
          Analyze the transcript across these 5 dimensions:
          1. Communication Clarity (0-10): Ability to explain concepts without jargon.
          2. Warmth & Patience (0-10): Tone and handling of student's confusion.
          3. Pedagogical Correctness (0-10): Is the math explanation actually correct and helpful?
          4. English Fluency (0-10): Correct grammar and professional articulation.
          5. Relevance & Engagement (0-10): Did they actually answer the student's questions? (0 if they ignored questions or wrote nonsense).
          
          For EVERY dimension, provide:
          - A score (0-10)
          - One direct quote as evidence (use "N/A - Irrelevant Input" if nonsense)
          - A one-line clinical insight
          
          SCORING SCALE:
          - 0: Nonsense, irrelevant, or hostile.
          - 1-3: Extremely poor, confusing, or dismissive.
          - 4-6: Mediocre, lacks engagement, or has minor errors.
          - 7-8: Good, professional, and clear.
          - 9-10: Exceptional, uses creative analogies (like pizza/LEGO), and shows high empathy.
          ### CRITICAL SCORING LOGIC:
          - IF 'Relevance & Engagement' is 0, the 'overall_score' MUST be 0 and the verdict 'NO-HIRE'.
          - IF 'Pedagogical Correctness' is below 4, the verdict MUST be 'NO-HIRE'.
          Return ONLY JSON:
          {
            "scores": {
              "Communication Clarity": { "val": number, "quote": "...", "insight": "..." },
              "Warmth & Patience": { "val": number, "quote": "...", "insight": "..." },
              "Pedagogical Correctness": { "val": number, "quote": "...", "insight": "..." },
              "English Fluency": { "val": number, "quote": "...", "insight": "..." },
              "Relevance & Engagement": { "val": number, "quote": "...", "insight": "..." }
            },
            "overall_score": number, (Total score 0-100)
            "verdict": "HIRE" | "HOLD" | "NO-HIRE",
            "reasoning": "A blunt, honest assessment of the candidate's performance.",
            "gold_moments": ["Specific helpful quote"],
            "improvement_areas": ["What exactly they failed at"]
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
