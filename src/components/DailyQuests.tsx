"use client";

import { Target, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import styles from './DailyQuests.module.css';

interface DailyQuestsProps {
  testsCompleted: number;
}

export default function DailyQuests({ testsCompleted }: DailyQuestsProps) {
  // A dynamic quest array rendering boolean states based on user props
  const quests = [
    {
      title: "Evaluate Yourself",
      desc: "Complete 1 Subject Diagnostic",
      finished: testsCompleted > 0,
      link: "/quiz"
    },
    {
      title: "Active Recall",
      desc: "Finish 1 Micro-Drill in Practice",
      finished: false, // For MVP mock state. Real state tracks daily sessions.
      link: "/practice"
    },
    {
      title: "Analyze Weaknesses",
      desc: "Review your detailed Gap Analysis",
      finished: true, 
      link: "/"
    }
  ];

  return (
    <div className={`glass-panel ${styles.container}`}>
      <div className={styles.header}>
        <Target size={18} color="var(--primary)" />
        <h3>Daily Study Quests</h3>
      </div>

      <div className={styles.questList}>
        {quests.map((q, idx) => (
          <Link href={q.link} key={idx} className={`${styles.questItem} ${q.finished ? styles.finished : ''}`}>
            <div className={styles.questIcon}>
              {q.finished ? <CheckCircle2 size={24} color="var(--success)" /> : <div className={styles.emptyCircle}></div>}
            </div>
            
            <div className={styles.questInfo}>
              <h4 className={styles.questTitle}>{q.title}</h4>
              <span className={styles.questDesc}>{q.desc}</span>
            </div>
            
            {!q.finished && (
              <div className={styles.actionArrow}>➔</div>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
