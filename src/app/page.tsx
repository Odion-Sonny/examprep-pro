"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import SkillEvaluation from '@/components/SkillEvaluation';
import Gamification from '@/components/Gamification';
import GapAnalysis from '@/components/GapAnalysis';
import StudyPlan from '@/components/StudyPlan';
import { Bell, Search, Settings, Loader2 } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
import styles from './page.module.css';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!
);

const SUBJECTS = ['Mathematics', 'English', 'Physics', 'Chemistry', 'Biology'];

export default function Home() {
  const router = useRouter();
  
  const [activeSubject, setActiveSubject] = useState('Mathematics');
  const [loading, setLoading] = useState(true);
  const [testResults, setTestResults] = useState<any[]>([]);
  const [studyPlans, setStudyPlans] = useState<any[]>([]);
  const [gamification, setGamification] = useState<any>(null);
  const [userEmail, setUserEmail] = useState('Student');

  useEffect(() => {
    async function loadDashboardData() {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.email) {
        setUserEmail(user.email.split('@')[0]);
      }

      // Fetch all user results & plans
      const { data: results } = await supabase.from('test_results').select('*');
      const { data: plans } = await supabase.from('study_plans').select('*');
      
      // Fetch user profile gamification stats
      const { data: gameStats } = await supabase.from('gamification').select('*').single();

      if (results) setTestResults(results);
      if (plans) setStudyPlans(plans);
      if (gameStats) setGamification(gameStats);

      setLoading(false);
    }
    loadDashboardData();
  }, []);

  // Filter data by active subject
  const subjectResults = testResults.filter(r => r.subject === activeSubject);
  
  // Calculate average score for the radar and dial
  let averageScore = 0;
  let aggregatedWeaknesses: string[] = [];
  
  if (subjectResults.length > 0) {
    const totalScore = subjectResults.reduce((acc, curr) => acc + curr.overall_score, 0);
    averageScore = Math.round(totalScore / subjectResults.length);
    
    // Snag unique failed topics
    subjectResults.forEach(r => {
      if (r.topic_breakdown?.failedTopics) {
        aggregatedWeaknesses.push(...r.topic_breakdown.failedTopics);
      }
    });
  }

  // Get most recent study plan for the subject
  const latestResult = subjectResults.length > 0 ? subjectResults[subjectResults.length - 1] : null;
  const activePlanRecord = latestResult ? studyPlans.find(p => p.result_id === latestResult.id) : null;
  const activePlanData = activePlanRecord ? activePlanRecord.plan_data.plans : null;

  return (
    <main className={styles.main}>
      <Sidebar />
      
      <div className={styles.content}>
        <header className={styles.header}>
          <div className={styles.userInfo}>
            <div className={styles.avatar}>
              <img src="https://i.pravatar.cc/150?u=examprep" alt="Avatar" />
            </div>
            <div>
              <h2 className={styles.userName}>{userEmail}</h2>
              <p className={styles.userRole}>JAMB/WAEC Candidate</p>
            </div>
          </div>
          
          <div className={styles.headerActions}>
            <button className={styles.iconBtn} onClick={() => router.push('/quiz')}>
               Take Diagnostic Quiz
            </button>
          </div>
        </header>

        <section className={styles.welcomeSection}>
          <h1 className={styles.welcomeTitle}>Welcome back, {userEmail}!</h1>
          <p className={styles.welcomeSubtitle}>Track your progress and AI plans below.</p>
        </section>
        
        {/* Subject Selector Tabs */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '32px', overflowX: 'auto', paddingBottom: '8px' }}>
          {SUBJECTS.map(sub => (
            <button 
              key={sub}
              onClick={() => setActiveSubject(sub)}
              style={{
                background: activeSubject === sub ? 'var(--primary-gradient)' : 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: '#fff',
                padding: '8px 20px',
                borderRadius: '20px',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '14px',
                transition: 'all 0.2s',
                whiteSpace: 'nowrap'
              }}
            >
              {sub}
            </button>
          ))}
        </div>

        {loading ? (
           <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }}>
             <Loader2 size={40} style={{ animation: 'spin 1s linear infinite', color: 'var(--primary)' }} />
           </div>
        ) : subjectResults.length === 0 ? (
          <div className={`glass-panel`} style={{ padding: '40px', textAlign: 'center' }}>
            <h2>No {activeSubject} Data Found!</h2>
            <p style={{ color: '#9ca3af', marginBottom: '24px' }}>Take a diagnostic evaluation to generate your AI study plan and populate these analytics.</p>
            <button className={styles.iconBtn} style={{ background: 'var(--primary)' }} onClick={() => router.push('/quiz')}>
               Take {activeSubject} Quiz
            </button>
            <div style={{ marginTop: '32px' }}>
               <Gamification stats={gamification} />
            </div>
          </div>
        ) : (
          <>
            <div className={styles.topRow}>
              <div className={styles.evalColumn}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', height: '100%' }}>
                  <SkillEvaluation score={averageScore} />
                  <Gamification stats={gamification} />
                </div>
              </div>
              <div className={styles.analysisColumn}>
                <GapAnalysis weaknesses={aggregatedWeaknesses} />
              </div>
            </div>

            <StudyPlan dynamicPlan={activePlanData} />
          </>
        )}
      </div>
    </main>
  );
}
