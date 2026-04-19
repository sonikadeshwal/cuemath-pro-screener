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
          content: `You are a Fair but Strict Cuemath Interviewer. 
          
          THE EVALUATION STEP:
          1. RELEVANCE CHECK: Does the candidate explain ${topic}? If they talk about coffee, random objects, or say 'I don't know', they must get 0.
          2. PEDAGOGY CHECK: Did they use a good analogy? (e.g., for fractions, did they talk about pizza slices or the size of parts?).
          
          SCORING:
          If they explained the math concept, even in one message, score them fairly (1-10). 
          Only give 0 if they are completely off-topic or silent.
          
          Return ONLY JSON: 
          {"scores":{"Clarity":{"val":0-10,"quote":".."},"Empathy":{"val":0-10,"quote":".."},"Simplify":{"val":0-10,"quote":".."},"English":{"val":0-10,"quote":".."},"Patience":{"val":0-10,"quote":".."}},"overall_score":0-100,"verdict":"HIRE"|"HOLD"|"NO-HIRE","reasoning":"..","model_answer":".."}` 
        },
        { role: "user", content: `Math Topic: ${topic}. Full transcript: ${JSON.stringify(history)}` }
      ],
      model: "llama3-8b-8192",
      response_format: { type: "json_object" },
      temperature: 0.2, // Small amount of flexibility
    });

    const report = JSON.parse(c.choices[0].message.content || '{}');
    return NextResponse.json({ report });
  } catch (error) {
    // Return a neutral "System Busy" report instead of zero
    return NextResponse.json({ 
      report: {
        scores: { Clarity: {val: 5, quote: "N/A"}, Empathy: {val: 5, quote: "N/A"}, Simplify: {val: 5, quote: "N/A"}, English: {val: 5, quote: "N/A"}, Patience: {val: 5, quote: "N/A"} },
        overall_score: 50, verdict: "HOLD", reasoning: "Analysis engine is busy. Please review transcript manually.", model_answer: "Explanation should focus on visualization."
      } 
    });
  }
}
