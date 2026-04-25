import { useRef } from 'react';
import type { Lane, PlayerAction, Obstacle, Collectible } from '~/data/game-types';
import { useTouchControls } from '~/hooks/use-touch-controls';
import styles from './game-canvas.module.css';

const LANE_POSITIONS = ['25%', '50%', '75%'];

const BUILDINGS_LEFT = [
  { width: 38, height: 120, color: '#2a1a5e' },
  { width: 28, height: 80,  color: '#1e1245' },
  { width: 44, height: 150, color: '#301a6a' },
  { width: 22, height: 60,  color: '#1a0f40' },
  { width: 36, height: 110, color: '#261855' },
];

const BUILDINGS_RIGHT = [
  { width: 30, height: 100, color: '#281560' },
  { width: 46, height: 140, color: '#321c72' },
  { width: 26, height: 75,  color: '#1e1248' },
  { width: 40, height: 130, color: '#2c1868' },
  { width: 24, height: 65,  color: '#1c1040' },
];

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
  const scale = 0.18 + z * 0.82;
  const bottom = 8 + z * 24;
  const opacity = 0.25 + z * 0.75;
  return { scale, bottom: `${bottom}%`, opacity };
}

function getCollectibleStyle(z: number) {
  const scale = 0.12 + z * 0.88;
  const bottom = 15 + z * 20;
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

  const isFast = speed > 0.025;
  const roadDuration = `${0.7 / (speed / 0.012)}s`;

  return (
    <div className={styles.canvas} ref={canvasRef}>
      {/* Sky */}
      <div className={styles.sky}>
        <div className={styles.stars} />
        <div className={styles.skyGlow} />

        {/* City buildings */}
        <div className={styles.cityscape}>
          <div className={styles.buildingsLeft}>
            {BUILDINGS_LEFT.map((b, i) => (
              <div
                key={i}
                className={styles.bldg}
                style={{ width: b.width, height: b.height, background: b.color }}
              />
            ))}
          </div>
          <div className={styles.buildingsRight}>
            {BUILDINGS_RIGHT.map((b, i) => (
              <div
                key={i}
                className={styles.bldg}
                style={{ width: b.width, height: b.height, background: b.color }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Left sidewalk with billboard */}
      <div className={styles.sidewalkLeft}>
        <div className={styles.billboard} />
      </div>

      {/* Right sidewalk with billboard */}
      <div className={styles.sidewalkRight}>
        <div className={styles.billboard} />
      </div>

      {/* Road surface */}
      <div className={styles.road}>
        <div className={styles.horizon} />
        <div
          className={styles.roadLines}
          style={{ animationDuration: roadDuration }}
        />
        <div className={styles.laneDividers}>
          <div className={styles.dividerLeft} />
          <div className={styles.dividerRight} />
        </div>

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
            />
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
              {obs.type === 'hurdle'  && <div className={styles.hurdleShape} />}
              {obs.type === 'barrier' && <div className={styles.barrierShape} />}
              {obs.type === 'moving'  && <div className={styles.movingShape} />}
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

      {/* Speed streaks overlay */}
      <div className={`${styles.speedStreaks} ${isFast ? styles.fast : ''}`}>
        {[10, 20, 30, 45, 55, 65, 75, 85, 92].map((left, i) => (
          <div
            key={i}
            className={styles.streak}
            style={{
              left: `${left}%`,
              animationDuration: `${0.3 + i * 0.07}s`,
              animationDelay: `${i * 0.05}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
