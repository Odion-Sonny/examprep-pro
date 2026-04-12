"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Trophy, Medal, Star, Flame } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
import styles from './page.module.css';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!
);

interface LeaderboardEntry {
  user_id: string;
  points: number;
  streak_days: number;
  tests_completed: number;
}

export default function Leaderboard() {
  const router = useRouter();
  const [leaders, setLeaders] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      const { data, error } = await supabase
        .from('gamification')
        .select('*')
        .order('points', { ascending: false })
        .limit(10);
      
      if (data) {
        setLeaders(data);
      }
      setLoading(false);
    };

    fetchLeaderboard();
  }, []);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <button className={styles.backBtn} onClick={() => router.push('/')}>
          <ArrowLeft size={20} /> Dashboard
        </button>
      </header>

      <main className={styles.main}>
        <div className={styles.heroSection}>
          <Trophy size={64} className={styles.goldTrophy} />
          <h1 className={styles.title}>Global Leaderboard</h1>
          <p className={styles.desc}>Compare your Total Gamification Points against top students practicing nationwide.</p>
        </div>

        <div className={`glass-panel ${styles.boardCard}`}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#9ca3af' }}>Loading Ranks...</div>
          ) : leaders.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#9ca3af' }}>No rankings available yet.</div>
          ) : (
            <div className={styles.list}>
              {leaders.map((candidate, idx) => (
                <div key={candidate.user_id} className={`${styles.listItem} ${idx < 3 ? styles.topThree : ''}`}>
                  
                  <div className={styles.rankWrapper}>
                    {idx === 0 && <Medal size={24} color="#fbbf24" />}
                    {idx === 1 && <Medal size={24} color="#9ca3af" />}
                    {idx === 2 && <Medal size={24} color="#b45309" />}
                    {idx > 2 && <span className={styles.rankNum}>{idx + 1}</span>}
                  </div>

                  <div className={styles.userProfile}>
                    <div className={styles.avatar}>
                      {idx < 3 ? '👑' : '🎓'}
                    </div>
                    <div className={styles.userInfo}>
                      <span className={styles.userName}>Student-{candidate.user_id.substring(0, 5)}</span>
                      <span className={styles.userMeta}>Completed {candidate.tests_completed} diagnostic tests</span>
                    </div>
                  </div>

                  <div className={styles.statsWrapper}>
                    <div className={styles.statPill} style={{ background: 'rgba(245, 158, 11, 0.1)', color: 'var(--warning)' }}>
                      <Flame size={16} /> {candidate.streak_days}
                    </div>
                    <div className={styles.statPill} style={{ background: 'var(--primary-gradient)', color: '#fff', border: 'none', fontWeight: 600 }}>
                      <Star size={16} color="#fbbf24" /> {candidate.points.toLocaleString()} pts
                    </div>
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
