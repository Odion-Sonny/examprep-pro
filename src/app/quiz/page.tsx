"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Clock, CheckCircle, BrainCircuit } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
import toast from 'react-hot-toast';
import styles from './page.module.css';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!
);

export default function DiagnosticQuiz() {
  const router = useRouter();
  
  // Quiz Setup States
  const [subject, setSubject] = useState<string | null>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Quiz Execution States
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [answers, setAnswers] = useState<{ questionId: string, selected: number }[]>([]);
  const [isFinished, setIsFinished] = useState(false);

  // 1. Fetch Questions for Subject
  const fetchQuestions = async (selectedSubj: string) => {
    setSubject(selectedSubj);
    setLoading(true);
    
    // In production, we'd limit/randomize. Here we grab all matching
    const { data } = await supabase
      .from('questions')
      .select('*')
      .eq('subject', selectedSubj);
      
    if (data && data.length > 0) {
      setQuestions(data);
    } else {
      toast.error(`No questions found for ${selectedSubj} yet. Run the /api/seed-questions route!`);
      setSubject(null);
    }
    setLoading(false);
  };

  // 2. Submit Logic Hook
  useEffect(() => {
    if (isFinished && answers.length > 0) {
      submitToAI();
    }
  }, [isFinished]);

  const handleNext = () => {
    if (selectedOption !== null) {
      const newAnswers = [...answers, { questionId: questions[currentIdx].id, selected: selectedOption }];
      setAnswers(newAnswers);
      setSelectedOption(null);
      
      if (currentIdx < questions.length - 1) {
        setCurrentIdx(currentIdx + 1);
      } else {
        setIsFinished(true);
      }
    }
  };

  const submitToAI = async () => {
    const failedTopics: string[] = [];
    answers.forEach(ans => {
      const q = questions.find(qu => qu.id === ans.questionId);
      if (q && q.correct_index !== ans.selected) {
        if (!failedTopics.includes(q.topic)) failedTopics.push(q.topic);
      }
    });

    try {
      const res = await fetch('/api/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          subject: subject,
          answers, 
          failedTopics: failedTopics.length > 0 ? failedTopics : ['General Practice'] 
        })
      });
      const data = await res.json();
      
      if (data.studyPlan) {
        localStorage.setItem('recentStudyPlan', JSON.stringify(data.studyPlan));
        localStorage.setItem('recentTopics', JSON.stringify(failedTopics));
      }
    } catch (err) {
      console.error("Error submitting to AI", err);
      toast.error("Evaluation network timeout. Dashboard stats may be slightly delayed.");
    }
    
    router.push('/');
  };

  // UI States
  if (!subject) {
    return (
      <div className={styles.container}>
        <button className={styles.backBtn} onClick={() => router.push('/')}>
          <ArrowLeft size={20} /> Exit to Dashboard
        </button>
        <div className={`glass-panel`} style={{ padding: '40px', marginTop: '40px', textAlign: 'center' }}>
          <BrainCircuit size={48} style={{ color: 'var(--primary)', marginBottom: '16px' }} />
          <h2>Select Subject</h2>
          <p style={{ color: '#9ca3af', marginBottom: '32px' }}>Choose a subject to begin your diagnostic evaluation.</p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
             {['Mathematics', 'English', 'Physics', 'Chemistry', 'Biology'].map(sub => (
               <button 
                 key={sub}
                 className={styles.primaryBtn}
                 onClick={() => fetchQuestions(sub)}
                 disabled={loading}
               >
                 {sub}
               </button>
             ))}
          </div>
        </div>
      </div>
    );
  }

  if (isFinished) {
    return (
      <div className={styles.container}>
        <div className={`glass-panel ${styles.finishCard}`}>
          <CheckCircle size={64} className={styles.successIcon} />
          <h2>Evaluation Complete!</h2>
          <p>We are analyzing your {subject} skill profile using Gemini AI...</p>
          <p style={{ fontSize: '14px', color: 'var(--primary)', marginTop: '16px'}}>Please hold on, redirecting...</p>
        </div>
      </div>
    );
  }

  if (loading || questions.length === 0) {
    return (
      <div className={styles.container}>
        <div className={`glass-panel`} style={{ padding: '40px', marginTop: '40px', textAlign: 'center' }}>
          <BrainCircuit size={48} className={styles.spinner} style={{ color: 'var(--primary)', marginBottom: '16px' }} />
          <h2>Loading Questions...</h2>
        </div>
      </div>
    );
  }

  const question = questions[currentIdx];

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <button className={styles.backBtn} onClick={() => setSubject(null)}>
          <ArrowLeft size={20} /> Back to Subjects
        </button>
        <div className={styles.timer}>
          <Clock size={18} />
          <span>25:00</span>
        </div>
      </header>

      <main className={styles.quizMain}>
        <div className={styles.progressTracker}>
          <div className={styles.progressInfo}>
            <span>Question {currentIdx + 1} of {questions.length}</span>
            <span className={styles.topicBadge}>{question.topic}</span>
          </div>
          <div className={styles.progressBar}>
            <div 
              className={styles.progressFill} 
              style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}
            ></div>
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
          <button 
            className={styles.primaryBtn} 
            disabled={selectedOption === null}
            onClick={handleNext}
          >
            {currentIdx === questions.length - 1 ? "Finish Evaluation" : "Next Question"}
          </button>
        </div>
      </main>
    </div>
  );
}
