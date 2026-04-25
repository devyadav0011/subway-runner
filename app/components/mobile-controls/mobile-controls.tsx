import { ChevronLeft, ChevronRight, ChevronUp, ChevronDown } from 'lucide-react';
import styles from './mobile-controls.module.css';

interface Props {
  onLeft: () => void;
  onRight: () => void;
  onJump: () => void;
  onSlide: () => void;
}

export function MobileControls({ onLeft, onRight, onJump, onSlide }: Props) {
  return (
    <div className={styles.controls}>
      <button className={styles.btn} onPointerDown={onJump} aria-label="Jump">
        <ChevronUp size={22} />
      </button>
      <div className={styles.horizontal}>
        <button className={styles.btn} onPointerDown={onLeft} aria-label="Move Left">
          <ChevronLeft size={22} />
        </button>
        <button className={styles.btn} onPointerDown={onSlide} aria-label="Slide">
          <ChevronDown size={22} />
        </button>
        <button className={styles.btn} onPointerDown={onRight} aria-label="Move Right">
          <ChevronRight size={22} />
        </button>
      </div>
    </div>
  );
}
