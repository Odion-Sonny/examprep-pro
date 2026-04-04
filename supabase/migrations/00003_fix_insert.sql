-- 00003_fix_insert.sql
-- Run this in your Supabase SQL Editor to forcefully bypass RLS for our Demo Prototype!

ALTER TABLE public.test_results DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_plans DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.topics DISABLE ROW LEVEL SECURITY;

-- Ensure the anon key has permissions
GRANT ALL ON TABLE public.test_results TO anon;
GRANT ALL ON TABLE public.study_plans TO anon;
GRANT ALL ON TABLE public.topics TO anon;
