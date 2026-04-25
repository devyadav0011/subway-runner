import { Pause } from 'lucide-react';
import type { GameStats } from '~/data/game-types';
import styles from './game-hud.module.css';

interface Props {
  stats: GameStats;
  onPause: () => void;
}

export function GameHud({ stats, onPause }: Props) {
  return (
    <div className={styles.hud}>
      <div className={styles.statGroup}>
        <span className={styles.label}>SCORE</span>
        <span className={styles.value}>{stats.score.toLocaleString()}</span>
      </div>
      <div className={styles.statGroup}>
        <span className={styles.label}>COINS</span>
        <span className={`${styles.value} ${styles.coins}`}>{stats.coins} ⬡</span>
      </div>
      <div className={styles.statGroup}>
        <span className={styles.label}>DIST</span>
        <span className={styles.value}>{stats.distance}m</span>
      </div>
      <button className={styles.pauseBtn} onClick={onPause} aria-label="Pause">
        <Pause size={18} />
      </button>
    </div>
  );
}
