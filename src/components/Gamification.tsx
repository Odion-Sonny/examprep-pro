import { Trophy, Flame, Target } from 'lucide-react';
import styles from './Gamification.module.css';

interface GamificationProps {
  stats: {
    points: number;
    streak_days: number;
    tests_completed: number;
  } | null;
}

export default function Gamification({ stats }: GamificationProps) {
  const points = stats?.points || 0;
  const streak = stats?.streak_days || 0;
  const tests = stats?.tests_completed || 0;

  return (
    <div className={`glass-panel ${styles.container}`}>
      <h3 className={styles.title}>Your Lifetime Stats</h3>
      
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={`${styles.iconWrapper} ${styles.iconTrophy}`}>
            <Trophy size={20} />
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statLabel}>Total Points</span>
            <span className={styles.statValue}>{points.toLocaleString()}</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={`${styles.iconWrapper} ${styles.iconFlame}`}>
            <Flame size={20} />
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statLabel}>Study Streak</span>
            <span className={styles.statValue}>{streak} Days</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={`${styles.iconWrapper} ${styles.iconTarget}`}>
            <Target size={20} />
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statLabel}>Tests Taken</span>
            <span className={styles.statValue}>{tests}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
