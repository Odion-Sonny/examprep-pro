-- 00005_questions_schema.sql
-- Run this in your Supabase SQL Editor to create the dynamic past questions engine

CREATE TABLE IF NOT EXISTS public.questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subject TEXT NOT NULL,
    topic TEXT NOT NULL,
    text TEXT NOT NULL,
    options JSONB NOT NULL,
    correct_index INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS but allow anyone (even anonymous/unauthenticated users) to READ the questions,
-- because questions are public domain testing data.
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Questions are universally readable" ON public.questions;
CREATE POLICY "Questions are universally readable" ON public.questions FOR SELECT USING (true);

-- Ensure anon / authenticated users have READ permissions explicitly
GRANT SELECT ON TABLE public.questions TO anon;
GRANT SELECT ON TABLE public.questions TO authenticated;

-- Allow public INSERT for the sake of the initial Database Seeder Route
DROP POLICY IF EXISTS "Allow public insert to questions for seed" ON public.questions;
CREATE POLICY "Allow public insert to questions for seed" ON public.questions FOR INSERT WITH CHECK (true);
GRANT INSERT ON TABLE public.questions TO anon;
GRANT INSERT ON TABLE public.questions TO authenticated;
