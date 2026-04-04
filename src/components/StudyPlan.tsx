"use client";

import { useRouter } from 'next/navigation';
import { BookOpen, FlaskConical, PenTool, CheckCircle, Clock, Calendar as CalendarIcon, Flame } from 'lucide-react';
import styles from './StudyPlan.module.css';

interface PlanItemProps {
  title: string;
  topic: string;
  duration: string;
  time?: string;
  priority: 'high' | 'medium' | 'low';
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  progress: number;
}

function getIconComponent(iconName: string) {
  switch (iconName) {
    case 'FlaskConical': return <FlaskConical size={20} />;
    case 'PenTool': return <PenTool size={20} />;
    case 'CheckCircle': return <CheckCircle size={20} />;
    case 'BookOpen':
    default:
      return <BookOpen size={20} />;
  }
}

function getPriorityStyles(priority: string) {
  if (priority.toLowerCase() === 'high') return { bg: 'rgba(239, 68, 68, 0.15)', color: '#ef4444' };
  if (priority.toLowerCase() === 'medium') return { bg: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b' };
  return { bg: 'rgba(16, 185, 129, 0.15)', color: '#10b981' };
}

function PlanItem({ title, topic, duration, time = "Available Now", priority, icon, iconBg, iconColor, progress }: PlanItemProps) {
  const router = useRouter();

  const handleStart = () => {
    router.push(`/practice?topic=${encodeURIComponent(topic)}`);
  };

  return (
    <div className={`glass-panel ${styles.planItem}`}>
      <div className={styles.itemHeader}>
        <div className={styles.iconWrapper} style={{ background: iconBg, color: iconColor }}>
          {icon}
        </div>
        <div className={styles.itemInfo}>
          <h4 className={styles.itemTitle}>{title}</h4>
          <p className={styles.itemTopic}>{topic}</p>
        </div>
        <div className={styles.actions}>
          {priority === 'high' && <Flame className={styles.flameIcon} size={18} />}
          <button className={styles.moreBtn}>⋮</button>
        </div>
      </div>
      
      <div className={styles.progressContainer}>
        <div className={styles.progressBar}>
          <div className={styles.progressFill} style={{ width: `${progress}%`, background: iconColor }}></div>
        </div>
      </div>
      
      <div className={styles.itemFooter}>
        <div className={styles.meta}>
          <div className={styles.metaItem}>
            <Clock size={14} />
            <span>{duration}</span>
          </div>
          <div className={styles.metaItem}>
            <CalendarIcon size={14} />
            <span>{time}</span>
          </div>
          <span className={priority === 'high' ? styles.highPriority : ''}>
            {priority.charAt(0).toUpperCase() + priority.slice(1)} Priority
          </span>
        </div>
        <button className={styles.startBtn} onClick={handleStart}>Start Now</button>
      </div>
    </div>
  );
}

export default function StudyPlan({ dynamicPlan }: { dynamicPlan?: any[] }) {
  // If we have AI generated data, map over it!
  if (dynamicPlan && dynamicPlan.length > 0) {
    return (
      <div className={styles.container}>
        <h3 className={styles.sectionTitle}>AI RECOMMENDED STUDY PLAN</h3>
        <div className={styles.grid}>
          {dynamicPlan.map((plan, idx) => {
            const styles = getPriorityStyles(plan.priority);
            return (
              <PlanItem
                key={idx}
                title={plan.title}
                topic={plan.topic}
                duration={plan.duration}
                priority={plan.priority.toLowerCase()}
                icon={getIconComponent(plan.iconName)}
                iconBg={styles.bg}
                iconColor={styles.color}
                progress={0} // new plan, 0 progress
              />
            );
          })}
        </div>
      </div>
    );
  }

  // Baseline Mock rendering
  return (
    <div className={styles.container}>
      <h3 className={styles.sectionTitle}>RECOMMENDED STUDY PLAN</h3>
      <div className={styles.grid}>
        <PlanItem 
          title="Targeted Practice"
          topic="Mathematics (Geometry)"
          duration="60 min"
          time="Today"
          priority="high"
          icon={<BookOpen size={20} />}
          iconBg="rgba(59, 130, 246, 0.15)"
          iconColor="#3b82f6"
          progress={30}
        />
        <PlanItem 
          title="Focus Session"
          topic="Mathematics (Trigonometry)"
          duration="45 min"
          time="Tomorrow"
          priority="high"
          icon={<FlaskConical size={20} />}
          iconBg="rgba(245, 158, 11, 0.15)"
          iconColor="#f59e0b"
          progress={10}
        />
        <PlanItem 
          title="Mock Exam Review"
          topic="WAEC Mathematics"
          duration="90 min"
          time="Scheduled"
          priority="medium"
          icon={<PenTool size={20} />}
          iconBg="rgba(139, 92, 246, 0.15)"
          iconColor="#8b5cf6"
          progress={0}
        />
      </div>
    </div>
  );
}
