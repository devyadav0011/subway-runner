import { Link } from 'react-router';
import { Zap, Trophy } from 'lucide-react';
import { getHighScore } from '~/data/leaderboard';
import styles from './hero-section.module.css';

export function HeroSection() {
  const highScore = getHighScore();

  return (
    <section className={styles.hero}>
      <div className={styles.bgGlow} />
      <div className={styles.content}>
        <div className={styles.badge}>
          <Zap size={14} fill="currentColor" />
          Endless Runner
        </div>
        <h1 className={styles.title}>
          <span className={styles.velocity}>VELOCITY</span>
          <span className={styles.dash}>DASH</span>
        </h1>
        <p className={styles.subtitle}>Dodge. Collect. Survive. How far can you go?</p>
        {highScore > 0 && (
          <div className={styles.highScore}>
            <Trophy size={14} />
            Personal Best: <strong>{highScore.toLocaleString()}</strong>
          </div>
        )}
        <Link to="/play" className={styles.playBtn}>
          <Zap size={20} fill="currentColor" />
          Play Now
        </Link>
      </div>
      <div className={styles.characterShowcase}>
        <div className={styles.track}>
          <div className={styles.trackLine} />
          <div className={styles.trackLine} />
        </div>
        <div className={styles.character}>
          <div className={styles.charHead} />
          <div className={styles.charBody} />
          <div className={styles.charLegs} />
        </div>
        <div className={styles.characterGlow} />
      </div>
    </section>
  );
}
