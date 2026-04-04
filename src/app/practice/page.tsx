"use client";

import { useSearchParams, useRouter } from 'next/navigation';
import { useState, Suspense } from 'react';
import { ArrowLeft, BrainCircuit, Target, CheckCircle } from 'lucide-react';
import styles from './page.module.css';

function PracticeContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const topic = searchParams.get('topic') || 'General Revision';
  
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  // Mock dynamic questions based on topic
  const questions = [
    {
      text: `Which concept is fundamental to mastering ${topic}?`,
      options: ["Memorizing historical dates", "Applying specific theorems", "Guessing randomly", "Writing essays"],
      correct: 1
    },
    {
      text: `In a standard WAEC exam, ${topic} questions usually test...`,
      options: ["Your vocabulary", "Your analytical reasoning", "Your drawing skills", "Speed reading"],
      correct: 1
    }
  ];

  const handleNext = () => {
    if (selectedOption !== null) {
      if (currentIdx < questions.length - 1) {
        setCurrentIdx(currentIdx + 1);
        setSelectedOption(null);
      } else {
        setFinished(true);
      }
    }
  };

  const handleFinish = () => {
    router.push('/');
  };

  if (finished) {
    return (
      <div className={styles.container}>
        <div className={`glass-panel ${styles.finishCard}`}>
          <CheckCircle size={64} className={styles.successIcon} />
          <h2>Practice Complete!</h2>
          <p>You have earned +50 Points and extended your study streak!</p>
          <button className={styles.primaryBtn} onClick={handleFinish}>
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
          <h1 className={styles.title}>Targeted Practice</h1>
          <h2 className={styles.topicName}>{topic}</h2>
          <p className={styles.desc}>Complete this micro-quiz to reinforce your knowledge, earn points, and decrease your knowledge gap in this specific area.</p>
          <button className={styles.primaryBtn} onClick={() => setStarted(true)}>
            Start 5-Minute Drill
          </button>
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
