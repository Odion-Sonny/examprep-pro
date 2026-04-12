-- 00007_gamification.sql
-- Gamification Engine Data store

CREATE TABLE IF NOT EXISTS public.gamification (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    points INTEGER DEFAULT 0,
    streak_days INTEGER DEFAULT 0,
    tests_completed INTEGER DEFAULT 0,
    last_active DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.gamification ENABLE ROW LEVEL SECURITY;

-- Allow users to view their own gamification stats
DROP POLICY IF EXISTS "Users can view their gamification" ON public.gamification;
CREATE POLICY "Users can view their gamification" ON public.gamification
  FOR SELECT USING (auth.uid() = user_id);

-- Wait, the backend server client (SSR/API) will update points using service role or user JWT. 
-- Let's allow users to update their own stats for the MVP when completing drills.
DROP POLICY IF EXISTS "Users can update their gamification" ON public.gamification;
CREATE POLICY "Users can update their gamification" ON public.gamification
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- We need to ensure that every new user gets a Gamification record. 
-- In Supabase, we can use an Insert Trigger on auth.users, or an Upsert in the application.
-- For reliability without messing with auth schema triggers, we will handle "upserts" at the API layer.
