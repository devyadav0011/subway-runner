import styles from './instructions-section.module.css';

const CONTROLS = [
  {
    keys: ['←', '→'],
    label: 'Switch Lanes',
    sub: 'Arrow keys or A / D',
    icon: '↔',
  },
  {
    keys: ['↑', 'Space'],
    label: 'Jump',
    sub: 'Arrow up or Space',
    icon: '↑',
  },
  {
    keys: ['↓'],
    label: 'Slide',
    sub: 'Arrow down or S',
    icon: '↓',
  },
  {
    keys: ['Esc'],
    label: 'Pause',
    sub: 'Escape key',
    icon: '⏸',
  },
];

export function InstructionsSection() {
  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.header}>
          <h2 className={styles.title}>How to Play</h2>
          <p className={styles.desc}>Dodge obstacles, collect coins, and survive as long as possible.</p>
        </div>

        <div className={styles.grid}>
          {CONTROLS.map(control => (
            <div key={control.label} className={styles.card}>
              <div className={styles.icon}>{control.icon}</div>
              <div className={styles.info}>
                <span className={styles.action}>{control.label}</span>
                <span className={styles.keys}>{control.sub}</span>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.obstacleGuide}>
          <h3 className={styles.guideTitle}>Obstacle Guide</h3>
          <div className={styles.obstacles}>
            <div className={styles.obstacleItem}>
              <div className={styles.hurdleDemo} />
              <div>
                <strong>Hurdle</strong>
                <p>Jump to clear</p>
              </div>
            </div>
            <div className={styles.obstacleItem}>
              <div className={styles.barrierDemo} />
              <div>
                <strong>Barrier</strong>
                <p>Slide underneath</p>
              </div>
            </div>
            <div className={styles.obstacleItem}>
              <div className={styles.movingDemo} />
              <div>
                <strong>Spinner</strong>
                <p>Change lanes</p>
              </div>
            </div>
            <div className={styles.obstacleItem}>
              <div className={styles.coinDemo}>⬡</div>
              <div>
                <strong>Crystal</strong>
                <p>+50 score</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
