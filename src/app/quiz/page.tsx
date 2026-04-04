"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Clock, CheckCircle } from 'lucide-react';
import styles from './page.module.css';

// Mock Diagnostic Questions
const questions = [
  {
    id: 1,
    topic: "Algebra",
    text: "Solve for x in the equation: 3(x - 4) = 15",
    options: ["x = 5", "x = 9", "x = -1", "x = 11"],
    correct: 1 // index 1 is "x = 9"
  },
  {
    id: 2,
    topic: "Geometry",
    text: "What is the area of a circle with radius 7cm? (Take π = 22/7)",
    options: ["154 cm²", "44 cm²", "22 cm²", "144 cm²"],
    correct: 0
  },
  {
    id: 3,
    topic: "Trigonometry",
    text: "If sin θ = 3/5, what is tan θ?",
    options: ["4/3", "3/4", "3/5", "5/4"],
    correct: 1
  },
  {
    id: 4,
    topic: "Calculus",
    text: "Find the derivative of y = x³ + 2x",
    options: ["y' = 3x²", "y' = 3x² + 2x", "y' = 3x² + 2", "y' = x² + 2"],
    correct: 2
  },
  {
    id: 5,
    topic: "Statistics",
    text: "What is the median of the data set: 4, 1, 9, 7, 3?",
    options: ["4", "9", "3", "7"],
    correct: 0
  }
];

export default function DiagnosticQuiz() {
  const router = useRouter();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [answers, setAnswers] = useState<{ questionId: number, selected: number }[]>([]);
  const [isFinished, setIsFinished] = useState(false);

  const question = questions[currentIdx];

  // Inside DiagnosticQuiz...
  useEffect(() => {
    if (isFinished) {
      submitToAI();
    }
  }, [isFinished]);

  const handleNext = () => {
    if (selectedOption !== null) {
      const newAnswers = [...answers, { questionId: question.id, selected: selectedOption }];
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
    setIsFinished(true);
    // Find failed topics (correct logic check)
    const failedTopics: string[] = [];
    answers.forEach(ans => {
      const q = questions.find(qu => qu.id === ans.questionId);
      if (q && q.correct !== ans.selected) {
        if (!failedTopics.includes(q.topic)) failedTopics.push(q.topic);
      }
    });

    try {
      // POST to our Gemini AI route
      const res = await fetch('/api/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers, failedTopics: failedTopics.length > 0 ? failedTopics : ['General Practice'] })
      });
      const data = await res.json();
      
      if (data.studyPlan) {
        // For MVP, save the recommended plan in localStorage to display on Dashboard
        localStorage.setItem('recentStudyPlan', JSON.stringify(data.studyPlan));
        localStorage.setItem('recentTopics', JSON.stringify(failedTopics));
      }
    } catch (err) {
      console.error("Error submitting to AI", err);
    }
    
    router.push('/');
  };

  if (isFinished) {
    return (
      <div className={styles.container}>
        <div className={`glass-panel ${styles.finishCard}`}>
          <CheckCircle size={64} className={styles.successIcon} />
          <h2>Evaluation Complete!</h2>
          <p>We are analyzing your Mathematics skill profile using Gemini AI...</p>
          <p style={{ fontSize: '14px', color: 'var(--primary)', marginTop: '16px'}}>Please hold on, redirecting...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <button className={styles.backBtn} onClick={() => router.push('/')}>
          <ArrowLeft size={20} />
          <span>Exit to Dashboard</span>
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
            {question.options.map((opt, idx) => (
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
