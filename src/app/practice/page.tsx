"use client";

import { useSearchParams, useRouter } from 'next/navigation';
import { useState, Suspense } from 'react';
import { ArrowLeft, BrainCircuit, Target, CheckCircle, Loader2 } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
import toast from 'react-hot-toast';
import styles from './page.module.css';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!
);

function PracticeContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const topic = searchParams.get('topic') || 'General Revision';
  
  const [started, setStarted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [finished, setFinished] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [questions, setQuestions] = useState<any[]>([]);

  const startDrillWorker = async () => {
    setStarted(true);
    setLoading(true);
    try {
      const res = await fetch(`/api/drill?topic=${encodeURIComponent(topic)}`);
      const data = await res.json();
      if (data.success && data.questions) {
        setQuestions(data.questions);
        toast.success("AI Micro-Drill generated successfully!");
      } else {
        toast.error("Failed to generate AI drill. Returning to dashboard.");
        router.push('/');
      }
    } catch (err) {
      console.error(err);
      toast.error("Network error hitting Gemini.");
      router.push('/');
    }
    setLoading(false);
  };

  const handleNext = () => {
    if (selectedOption !== null) {
      if (currentIdx < questions.length - 1) {
        setCurrentIdx(currentIdx + 1);
        setSelectedOption(null);
      } else {
        finishDrill();
      }
    }
  };

  const finishDrill = async () => {
    setFinished(true);
    
    // Increment Gamification points locally via Supabase RLS
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: currentStats } = await supabase.from('gamification').select('*').eq('user_id', user.id).single();
      if (currentStats) {
        await supabase.from('gamification').update({
          points: currentStats.points + 50
        }).eq('user_id', user.id);
      } else {
        await supabase.from('gamification').insert([{
           user_id: user.id,
           points: 50,
           streak_days: 1,
           tests_completed: 0
        }]);
      }
    }
  };

  if (finished) {
    return (
      <div className={styles.container}>
        <div className={`glass-panel ${styles.finishCard}`}>
          <CheckCircle size={64} className={styles.successIcon} />
          <h2>Drill Complete!</h2>
          <p>You have earned <strong>+50 Points</strong> for completing an AI Targeted Practice session!</p>
          <button className={styles.primaryBtn} onClick={() => router.push('/')} style={{ marginTop: '24px' }}>
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (!started) {
    return (
      <div className={styles.container}>
        <button className={styles.backBtn} onClick={() => router.push('/')}>
          <ArrowLeft size={20} /> Dashboard
        </button>
        
        <div className={`glass-panel ${styles.introCard}`}>
          <div className={styles.iconWrapper}><Target size={40} /></div>
          <h1 className={styles.title}>AI Targeted Practice</h1>
          <h2 className={styles.topicName}>{topic}</h2>
          <p className={styles.desc}>Complete this micro-quiz securely generated in real-time by Google Gemini to master this strict topic.</p>
          <button className={styles.primaryBtn} onClick={startDrillWorker}>
            Generate Micro-Drill
          </button>
        </div>
      </div>
    );
  }
  
  if (loading || questions.length === 0) {
     return (
      <div className={styles.container}>
        <div className={`glass-panel`} style={{ padding: '40px', marginTop: '40px', textAlign: 'center' }}>
          <Loader2 size={48} style={{ animation: 'spin 1s linear infinite', color: 'var(--primary)', marginBottom: '16px' }} />
          <h2>Gemini is writing your questions...</h2>
        </div>
      </div>
    );
  }

  const question = questions[currentIdx];

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <button className={styles.backBtn} onClick={() => router.push('/')}>
          <ArrowLeft size={20} /> Quit
        </button>
        <div className={styles.topicBadge}>
          <BrainCircuit size={18} /> {topic}
        </div>
      </header>

      <main className={styles.quizMain}>
        <div className={styles.progressTracker}>
          <div className={styles.progressInfo}>
            <span>Drill {currentIdx + 1} of {questions.length}</span>
          </div>
          <div className={styles.progressBar}>
            <div className={styles.progressFill} style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}></div>
          </div>
        </div>

        <div className={`glass-panel ${styles.questionCard}`}>
          <h2 className={styles.questionText}>{question.text}</h2>
          <div className={styles.optionsList}>
            {question.options.map((opt: string, idx: number) => (
              <button 
                key={idx} 
                className={`${styles.optionBtn} ${selectedOption === idx ? styles.selected : ''}`}
                onClick={() => setSelectedOption(idx)}
              >
                <div className={styles.radioCircle}>
                  {selectedOption === idx && <div className={styles.radioInner}></div>}
                </div>
                <span>{opt}</span>
              </button>
            ))}
          </div>
        </div>

        <div className={styles.footer}>
          <button className={styles.primaryBtn} disabled={selectedOption === null} onClick={handleNext}>
            {currentIdx === questions.length - 1 ? "Finish Drill" : "Next"}
          </button>
        </div>
      </main>
    </div>
  );
}

export default function PracticePage() {
  return (
    <Suspense fallback={<div className={styles.container}><p>Preparing Drill...</p></div>}>
      <PracticeContent />
    </Suspense>
  );
}
