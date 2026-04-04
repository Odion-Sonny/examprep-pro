-- 00001_initial_schema.sql
-- Run this in your Supabase SQL Editor

-- 1. Create a table for exam topics/syllabus
CREATE TABLE IF NOT EXISTS topics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subject VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create a table for student test results mapping to specific topics
CREATE TABLE IF NOT EXISTS test_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    subject VARCHAR(255) NOT NULL,
    overall_score INTEGER NOT NULL,
    topic_breakdown JSONB NOT NULL, -- e.g. { "Algebra": 80, "Geometry": 40 }
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Create a table for AI-generated study plans
CREATE TABLE IF NOT EXISTS study_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    result_id UUID REFERENCES test_results(id) ON DELETE CASCADE,
    plan_data JSONB NOT NULL, -- { "title": "Focus Session", "topic": "Geometry", "priority": "high", ... }
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_plans ENABLE ROW LEVEL SECURITY;

-- Basic Policies (Update these for production)
CREATE POLICY "Public profiles are viewable by everyone." ON topics FOR SELECT USING (true);
CREATE POLICY "Users can insert their own results." ON test_results FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can view their own results." ON test_results FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own plans." ON study_plans FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can view their own plans." ON study_plans FOR SELECT USING (auth.uid() = user_id);
