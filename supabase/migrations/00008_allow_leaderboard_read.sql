-- Drop the restrictive policy
DROP POLICY IF EXISTS "Users can view own stats" ON public.gamification;

-- Allow all authenticated users to read the entire table for Leaderboard ranking
CREATE POLICY "Users can view all stats for leaderboard" 
  ON public.gamification FOR SELECT 
  USING ( auth.role() = 'authenticated' );
