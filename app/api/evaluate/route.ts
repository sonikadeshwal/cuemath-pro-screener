export const runtime = 'edge';
import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: Request) {
  try {
    const { history } = await req.json();
    
    // 🧠 GET THE TOPIC FROM THE FIRST MESSAGE
    // This tells the AI if it should be checking for Fractions, Decimals, or Multiplication
    const topic = history[0]?.topic || "fractions"; 

    const c = await groq.chat.completions.create({
      messages: [
        { 
          role: "system", 
          content: `You are a STRICT Cuemath Auditor evaluating a tutor.
          
          THE TARGET TOPIC: ${topic}
          
          THE "COFFEE" RULE (STRICT):
          - If the candidate talks about things unrelated to ${topic} (like 'I like coffee', 'how are you', or random gibberish), you MUST give 0 points for every category.
          - In such cases, Verdict must be "NO-HIRE" and Reasoning must say "Candidate failed to address the student's question."
          
          EVALUATION CRITERIA:
          - Did they simplify ${topic} for a 9-year-old?
          - Did they use Cuemath-style logic?
          
          Return ONLY JSON: 
          {"scores":{"Clarity":{"val":0-10,"quote":".."},"Empathy":{"val":0-10,"quote":".."},"Simplify":{"val":0-10,"quote":".."},"English":{"val":0-10,"quote":".."},"Patience":{"val":0-10,"quote":".."}},"overall_score":0-100,"verdict":"HIRE"|"HOLD"|"NO-HIRE","reasoning":"..","model_answer":".."} ` 
        },
        { role: "user", content: `Interview Transcript: ${JSON.stringify(history)}` }
      ],
      model: "llama3-8b-8192",
      response_format: { type: "json_object" }
    });

    const report = JSON.parse(c.choices[0].message.content || '{}');
    return NextResponse.json({ report });
  } catch (error) {
    return NextResponse.json({ error: "Fail" }, { status: 500 });
  }
}
