import { useEffect, useState } from 'react';
import styles from './countdown.module.css';

interface Props {
  count: number;
}

export function Countdown({ count }: Props) {
  const [key, setKey] = useState(count);

  useEffect(() => {
    setKey(count);
  }, [count]);

  return (
    <div className={styles.overlay}>
      <div className={styles.countBox}>
        <div key={key} className={styles.number}>
          {count > 0 ? count : 'GO!'}
        </div>
        <p className={styles.hint}>Get ready...</p>
      </div>
    </div>
  );
}
