# ExamPrep Pro

An AI-driven, gamified examination preparation platform custom built for Nigerian WAEC/JAMB candidates. 

## Core Features
1. **Adaptive Diagnostic Engine**: End-to-end multi-subject quiz engine testing Mathematics, English, Biology, Chemistry, and Physics.
2. **Generative AI Study Plans**: Integrates `gemini-flash-latest` to parse test results and generate granular, personalized study plans instantly.
3. **Infinite Real-Time Micro Drills**: Features a generative API utilizing Google Gemini to instantly write focused, 5-question micro-drills to target specific weaknesses in real-time.
4. **Live Gamification**: Full Postgres-backed gamification tracing user streaks, completed exams, and total points. 
5. **Secure Authentication**: Built entirely on Next.js 14 App Router seamlessly tied to Supabase SSR Route Handlers with secure local cookies and OAuth 2.0.

## Tech Stack
- Frontend: Next.js 14, React 18, Custom CSS Modules (Glassmorphism UI)
- Backend: Supabase (PostgreSQL + Auth + RLS)
- Analytics: Recharts
- AI: Google Generative AI (`gemini-flash`)

## Setup Instructions
1. Clone this repository.
2. Install dependencies via `npm install`.
3. Create a `.env.local` containing:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY`
   - `GEMINI_API_KEY`
4. Deploy the Supabase Migrations linearly from `/supabase/migrations`.
5. Execute the public seed route to load the 16 base questions.
6. Run the dev server with `npm run dev`.
