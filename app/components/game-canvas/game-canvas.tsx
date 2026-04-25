import { useRef } from 'react';
import type { Lane, PlayerAction, Obstacle, Collectible } from '~/data/game-types';
import { useTouchControls } from '~/hooks/use-touch-controls';
import styles from './game-canvas.module.css';

const LANE_POSITIONS = ['25%', '50%', '75%'];

interface Props {
  playerLane: Lane;
  playerAction: PlayerAction;
  obstacles: Obstacle[];
  collectibles: Collectible[];
  speed: number;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  onSwipeUp: () => void;
  onSwipeDown: () => void;
}

function getObstacleStyle(z: number) {
  const scale = 0.15 + z * 0.85;
  const bottom = 8 + z * 22;
  const opacity = 0.2 + z * 0.8;
  return { scale, bottom: `${bottom}%`, opacity };
}

function getCollectibleStyle(z: number) {
  const scale = 0.1 + z * 0.9;
  const bottom = 14 + z * 20;
  const opacity = 0.3 + z * 0.7;
  return { scale, bottom: `${bottom}%`, opacity };
}

export function GameCanvas({
  playerLane,
  playerAction,
  obstacles,
  collectibles,
  speed,
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
}: Props) {
  const canvasRef = useRef<HTMLDivElement>(null);

  useTouchControls(canvasRef, {
    onSwipeLeft,
    onSwipeRight,
    onSwipeUp,
    onSwipeDown,
  });

  return (
    <div className={styles.canvas} ref={canvasRef}>
      {/* Road */}
      <div className={styles.road}>
        <div className={styles.roadLines} style={{ animationDuration: `${0.8 / (speed / 0.012)}s` }} />
        <div className={styles.horizon} />

        {/* Lane dividers */}
        <div className={styles.laneDividerLeft} />
        <div className={styles.laneDividerRight} />

        {/* Lane labels */}
        <div className={styles.laneLabel} style={{ left: '25%' }}>L</div>
        <div className={styles.laneLabel} style={{ left: '50%' }}>C</div>
        <div className={styles.laneLabel} style={{ left: '75%' }}>R</div>

        {/* Collectibles */}
        {collectibles.map(coin => {
          const s = getCollectibleStyle(coin.z);
          return (
            <div
              key={coin.id}
              className={`${styles.collectible} ${coin.collected ? styles.collected : ''}`}
              style={{
                left: LANE_POSITIONS[coin.lane],
                bottom: s.bottom,
                transform: `translateX(-50%) scale(${s.scale})`,
                opacity: s.opacity,
              }}
            >
              ⬡
            </div>
          );
        })}

        {/* Obstacles */}
        {obstacles.map(obs => {
          const s = getObstacleStyle(obs.z);
          return (
            <div
              key={obs.id}
              className={`${styles.obstacle} ${styles[`obstacle_${obs.type}`]}`}
              style={{
                left: LANE_POSITIONS[obs.lane],
                bottom: s.bottom,
                transform: `translateX(-50%) scale(${s.scale})`,
                opacity: s.opacity,
              }}
            >
              {obs.type === 'hurdle' && <div className={styles.hurdleShape} />}
              {obs.type === 'barrier' && <div className={styles.barrierShape} />}
              {obs.type === 'moving' && <div className={styles.movingShape} />}
            </div>
          );
        })}

        {/* Player */}
        <div
          className={`${styles.player} ${styles[`player_${playerAction}`]}`}
          style={{ left: LANE_POSITIONS[playerLane] }}
        >
          <div className={styles.playerBody}>
            <div className={styles.playerHead} />
            <div className={styles.playerTorso} />
            <div className={styles.playerLegs} />
          </div>
          <div className={styles.playerShadow} />
        </div>
      </div>

      {/* Scenery */}
      <div className={styles.sceneryLeft} />
      <div className={styles.sceneryRight} />
    </div>
  );
}
