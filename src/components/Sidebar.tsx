import Link from 'next/link';
import { Home, BookOpen, FileText, PieChart, Calendar, User } from 'lucide-react';
import styles from './Sidebar.module.css';

export default function Sidebar() {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>
        EXAMPREP <span className={styles.logoPro}>PRO</span>
      </div>
      
      <nav className={styles.nav}>
        <Link href="/" className={`${styles.navItem} ${styles.active}`}>
          <Home size={20} />
          <span>Dashboard</span>
        </Link>
        <Link href="#" className={styles.navItem}>
          <BookOpen size={20} />
          <span>Subjects</span>
        </Link>
        <Link href="#" className={styles.navItem}>
          <FileText size={20} />
          <span>Tests</span>
        </Link>
        <Link href="#" className={styles.navItem}>
          <PieChart size={20} />
          <span>Analysis</span>
        </Link>
        <Link href="#" className={styles.navItem}>
          <Calendar size={20} />
          <span>Plan</span>
        </Link>
        <Link href="#" className={styles.navItem}>
          <User size={20} />
          <span>Profile</span>
        </Link>
      </nav>
    </aside>
  );
}
