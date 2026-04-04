"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { login, signup } from './actions';
import { signInWithOAuth } from './oauth';
import { BrainCircuit, Loader2 } from 'lucide-react';
import styles from './page.module.css';

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const action = isLogin ? login : signup;
    
    try {
      const result = await action(formData);
      if (result?.error) {
        setErrorMsg(result.error);
        setLoading(false);
      }
    } catch (err: any) {
      // If it redirects successfully, it might throw a redirect error in Next, which is normal
      if (err.message && err.message.includes('NEXT_REDIRECT')) {
        // Safe to ignore
      } else {
        setErrorMsg('An unexpected error occurred.');
        setLoading(false);
      }
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.brandBox}>
        <div className={styles.logo}>
          <BrainCircuit size={48} className={styles.icon} />
          <h1>ExamPrep Pro</h1>
        </div>
        <p>Your AI-Driven WAEC/JAMB Companion.</p>
      </div>

      <div className={`glass-panel ${styles.authCard}`}>
        <h2 className={styles.title}>{isLogin ? "Welcome Back" : "Create Account"}</h2>
        <p className={styles.subtitle}>
          {isLogin ? "Enter your details to access your dashboard." : "Join us to start generating study plans."}
        </p>

        {errorMsg && <div className={styles.errorBanner}>{errorMsg}</div>}

        <div className={styles.socialAuth}>
          <button 
            type="button"
            className={styles.socialBtn} 
            onClick={() => signInWithOAuth('google')}
          >
            <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>
          
          <button 
            type="button"
            className={styles.socialBtn} 
            onClick={() => signInWithOAuth('azure')}
          >
            <svg viewBox="0 0 21 21" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
              <rect x="1" y="1" width="9" height="9" fill="#f25022"/>
              <rect x="11" y="1" width="9" height="9" fill="#7fba00"/>
              <rect x="1" y="11" width="9" height="9" fill="#00a4ef"/>
              <rect x="11" y="11" width="9" height="9" fill="#ffb900"/>
            </svg>
            Continue with Microsoft
          </button>
        </div>

        <div className={styles.divider}>
          <span>or sign in with email</span>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="email">Email</label>
            <input 
              id="email" 
              name="email" 
              type="email" 
              placeholder="you@school.edu.ng" 
              required 
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="password">Password</label>
            <input 
              id="password" 
              name="password" 
              type="password" 
              placeholder="••••••••" 
              required 
            />
          </div>

          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? <Loader2 size={20} className={styles.spinner} /> : (isLogin ? "Sign In" : "Sign Up")}
          </button>
        </form>

        <div className={styles.toggleFooter}>
          <span>{isLogin ? "Don't have an account?" : "Already have an account?"}</span>
          <button className={styles.toggleBtn} onClick={() => { setIsLogin(!isLogin); setErrorMsg(""); }}>
            {isLogin ? "Sign Up" : "Sign In"}
          </button>
        </div>
      </div>
    </div>
  );
}
