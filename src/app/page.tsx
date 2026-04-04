"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import SkillEvaluation from '@/components/SkillEvaluation';
import Gamification from '@/components/Gamification';
import GapAnalysis from '@/components/GapAnalysis';
import StudyPlan from '@/components/StudyPlan';
import { Bell, Search, Settings } from 'lucide-react';
import styles from './page.module.css';

export default function Home() {
  const router = useRouter();
  const [studyPlanData, setStudyPlanData] = useState<any>(null);

  useEffect(() => {
    // Check if we just returned from a quiz
    const recentPlan = localStorage.getItem('recentStudyPlan');
    if (recentPlan) {
      try {
        setStudyPlanData(JSON.parse(recentPlan));
      } catch (e) {}
    }
  }, []);

  return (
    <main className={styles.main}>
      <Sidebar />
      
      <div className={styles.content}>
        <header className={styles.header}>
          <div className={styles.userInfo}>
            <div className={styles.avatar}>
              <img src="https://i.pravatar.cc/150?u=a042581f4e29026704d" alt="Adebayo F." />
            </div>
            <div>
              <h2 className={styles.userName}>Adebayo F.</h2>
              <p className={styles.userRole}>JAMB/WAEC Candidate</p>
            </div>
          </div>
          
          <div className={styles.headerActions}>
            <button className={styles.iconBtn} onClick={() => router.push('/quiz')}>
               Take Diagnostic Quiz
            </button>
            <button className={styles.iconBtn}><Bell size={20} /></button>
            <button className={styles.iconBtn}><Search size={20} /></button>
            <button className={styles.iconBtn}><Settings size={20} /></button>
          </div>
        </header>

        <section className={styles.welcomeSection}>
          <h1 className={styles.welcomeTitle}>Good Morning, Adebayo!</h1>
          <p className={styles.welcomeSubtitle}>Track your progress.</p>
        </section>

        <div className={styles.topRow}>
          <div className={styles.evalColumn}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', height: '100%' }}>
              <SkillEvaluation score={82} />
              <Gamification />
            </div>
          </div>
          <div className={styles.analysisColumn}>
            <GapAnalysis />
          </div>
        </div>

        <StudyPlan dynamicPlan={studyPlanData} />
      </div>
    </main>
  );
}
