"use client";

import { ResponsiveContainer, Radar, RadarChart, PolarGrid, PolarAngleAxis, Tooltip } from 'recharts';
import styles from './GapAnalysis.module.css';

// For MVP, we still use some dummy graph data unless deep aggregation is calculated,
// but the insights are driven cleanly by actual array inputs below.
const data = [
  { topic: 'Topic 1', current: 80, goal: 100 },
  { topic: 'Topic 2', current: 40, goal: 90 },
  { topic: 'Topic 3', current: 60, goal: 85 },
  { topic: 'Topic 4', current: 90, goal: 95 },
  { topic: 'Topic 5', current: 50, goal: 80 },
  { topic: 'Topic 6', current: 75, goal: 90 },
];

export default function GapAnalysis({ weaknesses = [] }: { weaknesses?: string[] }) {
  // Extract unique weaknesses and take top 3
  const uniqueWeaknesses = Array.from(new Set(weaknesses)).slice(0, 3);
  
  return (
    <div className={`glass-panel ${styles.container}`}>
      <div className={styles.header}>
        <h3 className={styles.title}>Knowledge Gap Analysis</h3>
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
        {uniqueWeaknesses.length > 0 ? (
          uniqueWeaknesses.map((weakness, i) => (
            <div key={i} className={styles.weaknessTag}>Weakness: {weakness}</div>
          ))
        ) : (
          <div className={styles.strengthTag}>No obvious weaknesses found!</div>
        )}
      </div>
    </div>
  );
}
