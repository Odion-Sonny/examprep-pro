"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Home, BookOpen, FileText, LogOut, Settings, Trophy } from 'lucide-react';
import { signout } from '@/app/login/actions';
import SettingsModal from './SettingsModal';
import styles from './Sidebar.module.css';

export default function Sidebar() {
  const pathname = usePathname();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <>
      <aside className={styles.sidebar}>
        <div className={styles.logo}>
          EXAMPREP <span className={styles.logoPro}>PRO</span>
        </div>
        
        <nav className={styles.nav}>
          <Link href="/" className={`${styles.navItem} ${pathname === '/' ? styles.active : ''}`}>
            <Home size={20} />
            <span>Dashboard</span>
          </Link>
          <Link href="/quiz" className={`${styles.navItem} ${pathname === '/quiz' ? styles.active : ''}`}>
            <FileText size={20} />
            <span>Tests & Diagnosis</span>
          </Link>
          <Link href="/practice" className={`${styles.navItem} ${pathname === '/practice' ? styles.active : ''}`}>
            <BookOpen size={20} />
            <span>Targeted Practice</span>
          </Link>
          <Link href="/leaderboard" className={`${styles.navItem} ${pathname === '/leaderboard' ? styles.active : ''}`}>
            <Trophy size={20} />
            <span>Leaderboard</span>
          </Link>
          
          <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <button 
              className={styles.navItem} 
              onClick={() => setIsSettingsOpen(true)}
              style={{ background: 'transparent', border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer', fontFamily: 'inherit', color: 'inherit' }}
            >
              <Settings size={20} />
              <span>Settings</span>
            </button>
            
            <button 
              onClick={() => signout()} 
              className={styles.navItem} 
              style={{ background: 'transparent', border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer', fontFamily: 'inherit', color: '#ef4444' }}
            >
              <LogOut size={20} />
              <span>Sign Out</span>
            </button>
          </div>
        </nav>
      </aside>
      
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </>
  );
}
