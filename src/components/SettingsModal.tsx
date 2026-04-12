import { X, Moon, Sun } from 'lucide-react';
import { useTheme } from './ThemeProvider';
import styles from './SettingsModal.module.css';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const { theme, toggleTheme } = useTheme();

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={`glass-panel ${styles.modal}`} onClick={e => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>Settings</h2>
          <button className={styles.closeBtn} onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className={styles.section}>
          <h3>Appearance</h3>
          <div className={styles.settingRow}>
            <span>Theme Preference</span>
            <button className={styles.themeToggle} onClick={toggleTheme}>
              {theme === 'dark' ? <Moon size={18} /> : <Sun size={18} />}
              <span>{theme === 'dark' ? 'Dark Mode' : 'Light Mode'}</span>
            </button>
          </div>
        </div>

        <div className={styles.section}>
          <h3>Account Data</h3>
          <div className={styles.settingRow}>
            <span>Reset Exam Statistics</span>
            <button className={styles.dangerBtn}>Clear Data</button>
          </div>
        </div>
      </div>
    </div>
  );
}
