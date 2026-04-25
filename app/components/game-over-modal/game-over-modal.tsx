import { RotateCcw, LogOut, Trophy, Star } from 'lucide-react';
import type { GameStats } from '~/data/game-types';
import { getHighScore } from '~/data/leaderboard';
import styles from './game-over-modal.module.css';

interface Props {
  stats: GameStats;
  onPlayAgain: () => void;
  onQuit: () => void;
}

export function GameOverModal({ stats, onPlayAgain, onQuit }: Props) {
  const highScore = getHighScore();

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        {stats.isNewHighScore && (
          <div className={styles.newRecord}>
            <Star size={16} fill="currentColor" />
            NEW HIGH SCORE!
            <Star size={16} fill="currentColor" />
          </div>
        )}

        <h2 className={styles.title}>GAME OVER</h2>

        <div className={styles.statsGrid}>
          <div className={styles.stat}>
            <span className={styles.statLabel}>SCORE</span>
            <span className={styles.statValue}>{stats.score.toLocaleString()}</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statLabel}>COINS</span>
            <span className={`${styles.statValue} ${styles.coinsVal}`}>{stats.coins} ⬡</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statLabel}>DISTANCE</span>
            <span className={styles.statValue}>{stats.distance}m</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statLabel}><Trophy size={12} /> BEST</span>
            <span className={`${styles.statValue} ${styles.bestVal}`}>{highScore.toLocaleString()}</span>
          </div>
        </div>

        <div className={styles.actions}>
          <button className={styles.btnPlay} onClick={onPlayAgain}>
            <RotateCcw size={18} />
            Play Again
          </button>
          <button className={styles.btnQuit} onClick={onQuit}>
            <LogOut size={16} />
            Menu
          </button>
        </div>
      </div>
    </div>
  );
}
