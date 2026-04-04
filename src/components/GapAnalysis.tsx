"use client";

import { ResponsiveContainer, Radar, RadarChart, PolarGrid, PolarAngleAxis, Tooltip } from 'recharts';
import styles from './GapAnalysis.module.css';

const data = [
  { topic: 'Algebra', current: 80, goal: 100 },
  { topic: 'Geometry', current: 40, goal: 90 },
  { topic: 'Calculus', current: 60, goal: 85 },
  { topic: 'Statistics', current: 90, goal: 95 },
  { topic: 'Trigonometry', current: 50, goal: 80 },
  { topic: 'Probability', current: 75, goal: 90 },
];

export default function GapAnalysis() {
  return (
    <div className={`glass-panel ${styles.container}`}>
      <div className={styles.header}>
        <h3 className={styles.title}>Knowledge Gap Analysis (Maths)</h3>
        <div className={styles.legend}>
          <div className={styles.legendItem}>
            <span className={styles.legendColor} style={{ background: 'var(--chart-blue)' }}></span>
            <span>Current Skills</span>
          </div>
          <div className={styles.legendItem}>
            <span className={styles.legendColor} style={{ background: 'var(--chart-green)' }}></span>
            <span>Goal</span>
          </div>
        </div>
      </div>

      <div className={styles.chartWrapper}>
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
            <PolarGrid stroke="rgba(255,255,255,0.1)" />
            <PolarAngleAxis dataKey="topic" tick={{ fill: '#9ca3af', fontSize: 12 }} />
            <Tooltip 
              contentStyle={{ background: 'rgba(15, 17, 26, 0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
              itemStyle={{ color: '#fff' }}
            />
            <Radar name="Goal" dataKey="goal" stroke="var(--chart-green)" fill="var(--chart-green)" fillOpacity={0.1} />
            <Radar name="Current Skills" dataKey="current" stroke="var(--chart-blue)" fill="var(--chart-blue)" fillOpacity={0.3} dot={{ r: 4, fill: 'var(--chart-blue)' }} />
          </RadarChart>
        </ResponsiveContainer>
      </div>
      
      <div className={styles.insights}>
        <div className={styles.weaknessTag}>Weakness: Geometry</div>
        <div className={styles.weaknessTag}>Weakness: Trigonometry</div>
        <div className={styles.strengthTag}>Strength: Statistics</div>
      </div>
    </div>
  );
}
