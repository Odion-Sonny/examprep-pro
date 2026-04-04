-- 00002_allow_anonymous.sql
-- Run this in your Supabase SQL Editor to bypass the Auth requirement during our prototyping phase

DROP POLICY IF EXISTS "Users can insert their own results." ON test_results;
CREATE POLICY "Allow public insert to test_results for demo" ON test_results FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Users can insert their own plans." ON study_plans;
CREATE POLICY "Allow public insert to study_plans for demo" ON study_plans FOR INSERT WITH CHECK (true);
