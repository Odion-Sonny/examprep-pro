"use client";

import { useMemo } from 'react';
import { Target } from 'lucide-react';
import styles from './PredictiveScore.module.css';

interface PredictiveScoreProps {
  points: number;
  testsCompleted: number;
}

export default function PredictiveScore({ points, testsCompleted }: PredictiveScoreProps) {
  // A simple demonstrative algorithm for Mock Predictive JAMB score out of 400.
  // Base score 180 + scaled points (up to 200) + bounds for test completions
  const predictedScore = useMemo(() => {
    let score = 180;
    const pointsBonus = Math.floor(points / 20); // 1000 points = +50 score
    const completionBonus = testsCompleted * 2;
    
    score += pointsBonus + completionBonus;
    return Math.min(score, 400); // Cap at brilliant 400/400
  }, [points, testsCompleted]);

  const percentage = (predictedScore / 400) * 100;

  return (
    <div className={`glass-panel ${styles.container}`}>
      <div className={styles.header}>
        <Target size={18} color="var(--primary)" />
        <h3>Predictive JAMB Score</h3>
      </div>

      <div className={styles.visualizer}>
        <div className={styles.gaugeContainer}>
          <svg viewBox="0 0 100 50" className={styles.gauge}>
            {/* Background Arc */}
            <path 
              d="M 10 50 A 40 40 0 0 1 90 50" 
              fill="none" 
              stroke="var(--surface-border)" 
              strokeWidth="8" 
              strokeLinecap="round" 
            />
            {/* Dynamic Progress Arc */}
            <path 
              d="M 10 50 A 40 40 0 0 1 90 50" 
              fill="none" 
              stroke="url(#gradient)" 
              strokeWidth="8" 
              strokeLinecap="round" 
              strokeDasharray="125.6" /* Semi-circle perimeter 40 * PI */
              strokeDashoffset={125.6 - (125.6 * (percentage / 100))}
              style={{ transition: 'stroke-dashoffset 1s ease-out' }}
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#8b5cf6" />
              </linearGradient>
            </defs>
          </svg>

          <div className={styles.scoreDisplay}>
            <span className={styles.scoreValue}>{predictedScore}</span>
            <span className={styles.scoreMax}>/ 400</span>
          </div>
        </div>
      </div>
      
      <p className={styles.insightsText}>
        Based on your current diagnostic evaluations and AI drill performance. 
        Keep completing quizzes to increase accuracy!
      </p>
    </div>
  );
}
