import styles from './SkillEvaluation.module.css';

export default function SkillEvaluation({ score }: { score: number }) {
  return (
    <div className={`glass-panel ${styles.container}`}>
      <h3 className={styles.title}>Overall Skill Evaluation</h3>
      
      <div className={styles.chartContainer}>
        {/* Simple CSS-based circular progress bar representation */}
        <div className={styles.circularProgress} style={{ background: `conic-gradient(var(--chart-blue) ${score}%, transparent 0)` }}>
          <div className={styles.innerCircle}>
            <span className={styles.scoreValue}>{score}%</span>
            <span className={styles.scoreLabel}>PROGRESS SCORE</span>
          </div>
        </div>
      </div>
      
      <div className={styles.stats}>
        <div className={styles.statRow}>
          <span className={styles.statDot} style={{ background: 'var(--chart-blue)' }}></span>
          <span className={styles.statName}>Current Level:</span>
          <span className={styles.statValue}>Advanced</span>
        </div>
        <div className={styles.statRow}>
          <span className={styles.statDot} style={{ background: 'var(--chart-green)' }}></span>
          <span className={styles.statName}>Goal:</span>
          <span className={styles.statValue}>Top 5%</span>
        </div>
        <div className={styles.statRow}>
          <span className={styles.statDot} style={{ background: 'var(--warning)' }}></span>
          <span className={styles.statName}>Score:</span>
          <span className={styles.statValue}>{score}/100</span>
        </div>
      </div>
    </div>
  );
}
