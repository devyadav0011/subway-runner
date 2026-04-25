import { useState, useEffect } from 'react';
import { Trophy, User, Globe } from 'lucide-react';
import { getPersonalScores, MOCK_GLOBAL_SCORES } from '~/data/leaderboard';
import type { ScoreEntry } from '~/data/leaderboard';
import styles from './leaderboard-section.module.css';

type Tab = 'personal' | 'global';

export function LeaderboardSection() {
  const [tab, setTab] = useState<Tab>('personal');
  const [personalScores, setPersonalScores] = useState<ScoreEntry[]>([]);

  useEffect(() => {
    setPersonalScores(getPersonalScores());
  }, []);

  const scores = tab === 'personal' ? personalScores : MOCK_GLOBAL_SCORES;

  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.header}>
          <Trophy size={24} className={styles.trophyIcon} />
          <h2 className={styles.title}>Leaderboard</h2>
        </div>

        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${tab === 'personal' ? styles.tabActive : ''}`}
            onClick={() => setTab('personal')}
          >
            <User size={14} /> My Scores
          </button>
          <button
            className={`${styles.tab} ${tab === 'global' ? styles.tabActive : ''}`}
            onClick={() => setTab('global')}
          >
            <Globe size={14} /> Global
          </button>
        </div>

        <div className={styles.list}>
          {scores.length === 0 ? (
            <div className={styles.empty}>
              <p>No runs yet. Start playing to see your scores!</p>
            </div>
          ) : (
            scores.map((entry, idx) => (
              <div key={entry.id} className={`${styles.entry} ${idx === 0 ? styles.topEntry : ''}`}>
                <div className={styles.rank}>
                  {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `#${idx + 1}`}
                </div>
                <div className={styles.name}>{entry.name}</div>
                <div className={styles.entryStats}>
                  <span className={styles.dist}>{entry.distance}m</span>
                  <span className={styles.score}>{entry.score.toLocaleString()}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
