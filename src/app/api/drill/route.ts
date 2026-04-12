import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const topic = searchParams.get('topic') || 'General Science';

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'Missing Gemini API Key' }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

    const prompt = `
      You are an expert examiner for high-school students.
      Generate exactly 5 multiple choice practice questions focused specifically on the topic: "${topic}".
      Provide the correct answer index (0-3).

      Return ONLY a pure JSON array matching this interface perfectly:
      [
        {
          "text": "Question text here...",
          "options": ["Option A", "Option B", "Option C", "Option D"],
          "correct_index": 0,
          "explanation": "A concise, 2-sentence explanation of why the correct option is right, helping the student learn instantly from their mistake."
        }
      ]
      
      Do not include markdown or markdown block wrapping. Pure JSON only.
    `;

    const result = await model.generateContent(prompt);
    let jsonData = result.response.text();
    
    // Clean up any rogue markdown formatting returned by AI
    jsonData = jsonData.replace(/```json/g, '').replace(/```/g, '').trim();
    
    const questions = JSON.parse(jsonData);

    return NextResponse.json({ success: true, questions });
  } catch (error: any) {
    console.error("Generative Drill Error:", error);
    return NextResponse.json({ success: false, error: 'Failed to generate drill.' }, { status: 500 });
  }
}
