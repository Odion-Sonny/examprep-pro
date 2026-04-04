import { Trophy, Flame, Target } from 'lucide-react';
import styles from './Gamification.module.css';

export default function Gamification() {
  return (
    <div className={`glass-panel ${styles.container}`}>
      <h3 className={styles.title}>Your Stats</h3>
      
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={`${styles.iconWrapper} ${styles.iconTrophy}`}>
            <Trophy size={20} />
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statLabel}>Total Points</span>
            <span className={styles.statValue}>1,250</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={`${styles.iconWrapper} ${styles.iconFlame}`}>
            <Flame size={20} />
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statLabel}>Study Streak</span>
            <span className={styles.statValue}>3 Days</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={`${styles.iconWrapper} ${styles.iconTarget}`}>
            <Target size={20} />
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statLabel}>Tests Passed</span>
            <span className={styles.statValue}>4/5</span>
          </div>
        </div>
      </div>
    </div>
  );
}
