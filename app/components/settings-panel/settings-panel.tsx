import { Volume2, VolumeX, Music, Music2, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import styles from './settings-panel.module.css';

const CHARACTERS = [
  { id: 'cyber', name: 'Cyber', color: '#00f5ff', accent: '#7c3aed' },
  { id: 'neon', name: 'Neon', color: '#ff006e', accent: '#ffd700' },
  { id: 'ghost', name: 'Ghost', color: '#ffffff', accent: '#7c3aed' },
];

export function SettingsPanel() {
  const [musicOn, setMusicOn] = useState(true);
  const [sfxOn, setSfxOn] = useState(true);
  const [charIdx, setCharIdx] = useState(0);

  const char = CHARACTERS[charIdx];

  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <h2 className={styles.title}>Settings</h2>

        <div className={styles.grid}>
          {/* Audio */}
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>Audio</h3>
            <div className={styles.toggleRow}>
              <span className={styles.toggleLabel}>
                {musicOn ? <Music size={16} /> : <Music2 size={16} />}
                Music
              </span>
              <button
                className={`${styles.toggle} ${musicOn ? styles.toggleOn : ''}`}
                onClick={() => setMusicOn(v => !v)}
                aria-pressed={musicOn}
              >
                <span className={styles.toggleThumb} />
              </button>
            </div>
            <div className={styles.toggleRow}>
              <span className={styles.toggleLabel}>
                {sfxOn ? <Volume2 size={16} /> : <VolumeX size={16} />}
                SFX
              </span>
              <button
                className={`${styles.toggle} ${sfxOn ? styles.toggleOn : ''}`}
                onClick={() => setSfxOn(v => !v)}
                aria-pressed={sfxOn}
              >
                <span className={styles.toggleThumb} />
              </button>
            </div>
          </div>

          {/* Character */}
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>Character</h3>
            <div className={styles.charPicker}>
              <button
                className={styles.arrowBtn}
                onClick={() => setCharIdx(i => (i - 1 + CHARACTERS.length) % CHARACTERS.length)}
                aria-label="Previous character"
              >
                <ChevronLeft size={18} />
              </button>
              <div className={styles.charPreview}>
                <div
                  className={styles.charFigure}
                  style={{ '--char-color': char.color, '--char-accent': char.accent } as React.CSSProperties}
                >
                  <div className={styles.figHead} />
                  <div className={styles.figBody} />
                  <div className={styles.figLegs} />
                </div>
                <span className={styles.charName}>{char.name}</span>
              </div>
              <button
                className={styles.arrowBtn}
                onClick={() => setCharIdx(i => (i + 1) % CHARACTERS.length)}
                aria-label="Next character"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
