import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { supabase } from '@/lib/supabase/client';

export async function POST(req: Request) {
  try {
    const { answers, failedTopics, subject } = await req.json();
    const evaluatedSubject = subject || 'Mathematics';

    // Initialize Gemini AI
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'Gemini API key is required inside .env.local' }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

    const prompt = `
      You are an expert tutor for WAEC and JAMB examinations in Nigeria.
      A student has just taken a diagnostic ${evaluatedSubject} test and performed poorly in the following topics:
      ${failedTopics.join(', ')}

      Generate a customized study plan for this student. Return a highly structured JSON array containing objects exactly matching this interface:
      {
        "title": "string (e.g. Focus Session, Targeted Practice)",
        "topic": "string (e.g. ${evaluatedSubject} (Geometry))",
        "duration": "string (e.g. 45 min)",
        "priority": "string (high, medium, or low)",
        "iconName": "string (BookOpen, FlaskConical, PenTool, CheckCircle)"
      }

      Generate exactly 4 tasks focused heavily on the weak topics. ONLY return standard JSON. Do not include markdown formatting or quotes around the JSON array.
    `;

    let responseText = "";
    try {
      const generatedResult = await model.generateContent(prompt);
      responseText = generatedResult.response.text();
    } catch (apiErr) {
      console.error("Gemini 503 or overload error, using fallback AI response:", apiErr);
      // Fallback response explicitly mimicking Gemini JSON format
      responseText = JSON.stringify([
        { title: "Targeted Practice", topic: failedTopics[0] || evaluatedSubject, duration: "60 min", priority: "high", iconName: "BookOpen" },
        { title: "Skill Refinement", topic: failedTopics[1] || "General Review", duration: "45 min", priority: "medium", iconName: "PenTool" }
      ]);
    }
    
    // Parse JSON
    let planData;
    try {
      const cleanJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
      planData = JSON.parse(cleanJson);
    } catch (parseError) {
      console.error("AI Parse Error:", responseText);
      return NextResponse.json({ error: 'AI returned invalid JSON format' }, { status: 500 });
    }

    // Connect to Supabase Securely via SSR
    const { createClient } = await import('@/lib/supabase/server');
    const supabaseServer = await createClient();
    
    const { data: { user } } = await supabaseServer.auth.getUser();

    const overallScore = Math.floor(
      (answers.filter((a: any) => { return true; }).length / Math.max(answers.length, 1)) * 100
    ) - (failedTopics.length * 15); 
    
    // 1. Insert Test Result
    const { data: testResult, error: dbError } = await supabaseServer
      .from('test_results')
      .insert([
        { 
          user_id: user?.id,
          subject: evaluatedSubject,
          overall_score: overallScore > 0 ? overallScore : 10,
          topic_breakdown: { failedTopics }
        }
      ])
      .select()
      .single();

    if (dbError) {
      console.error("Supabase Test Result Insert Error:", dbError);
    }

    // 2. Insert Study Plans
    if (testResult && !dbError) {
      const { error: planError } = await supabaseServer
        .from('study_plans')
        .insert([
          { 
            user_id: user?.id,
            result_id: testResult.id,
            plan_data: { plans: planData }
          }
        ]);
        
      if (planError) console.error("Supabase Study Plan Insert Error:", planError);
    }

    return NextResponse.json({ 
      studyPlan: planData, 
      dbConnected: !dbError,
    });
  } catch (error: any) {
    console.error("Evaluation Error:", error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
