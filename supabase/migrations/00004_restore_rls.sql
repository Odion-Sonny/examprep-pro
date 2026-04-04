-- 00004_restore_rls.sql
-- Run this in your Supabase SQL Editor to restore stringent Row-Level Security now that Authentication is implemented.

-- 1. Re-enable RLS on all tables
ALTER TABLE public.test_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.topics ENABLE ROW LEVEL SECURITY;

-- 2. Drop the anonymous demo bypass policies
DROP POLICY IF EXISTS "Allow public insert to test_results for demo" ON test_results;
DROP POLICY IF EXISTS "Allow public insert to study_plans for demo" ON study_plans;

-- 3. Ensure the original secure policies map correctly to the active auth session
-- (These usually persist even if RLS was disabled, but recreating ensures a clean state)

DROP POLICY IF EXISTS "Users can insert their own results." ON test_results;
CREATE POLICY "Users can insert their own results." ON test_results 
    FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own plans." ON study_plans;
CREATE POLICY "Users can insert their own plans." ON study_plans 
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Restricting the anon role is good practice now that logging in is required.
REVOKE ALL ON TABLE public.test_results FROM anon;
REVOKE ALL ON TABLE public.study_plans FROM anon;
