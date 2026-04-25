import { Play, RotateCcw, LogOut } from 'lucide-react';
import styles from './pause-overlay.module.css';

interface Props {
  onResume: () => void;
  onRestart: () => void;
  onQuit: () => void;
}

export function PauseOverlay({ onResume, onRestart, onQuit }: Props) {
  return (
    <div className={styles.overlay}>
      <div className={styles.menu}>
        <h2 className={styles.title}>PAUSED</h2>
        <div className={styles.actions}>
          <button className={styles.btnPrimary} onClick={onResume}>
            <Play size={18} /> Resume
          </button>
          <button className={styles.btnSecondary} onClick={onRestart}>
            <RotateCcw size={16} /> Restart
          </button>
          <button className={styles.btnGhost} onClick={onQuit}>
            <LogOut size={16} /> Quit to Menu
          </button>
        </div>
      </div>
    </div>
  );
}
