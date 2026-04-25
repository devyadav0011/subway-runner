import { useState, useCallback, useRef, useEffect } from 'react';
import type {
  Lane,
  PlayerAction,
  Obstacle,
  Collectible,
  GameState,
  GameStats,
} from '~/data/game-types';
import {
  BASE_SPEED,
  SPEED_INCREMENT,
  MAX_SPEED,
  OBSTACLE_SPAWN_RATE,
  COLLECTIBLE_SPAWN_RATE,
  COIN_SCORE,
  DISTANCE_SCORE_MULTIPLIER,
} from '~/data/game-types';
import { saveHighScore, getHighScore, addPersonalScore } from '~/data/leaderboard';

const OBSTACLE_TYPES = ['hurdle', 'barrier', 'moving'] as const;

function randomLane(): Lane {
  return (Math.floor(Math.random() * 3)) as Lane;
}

function spawnObstacle(speed: number): Obstacle {
  const type = OBSTACLE_TYPES[Math.floor(Math.random() * OBSTACLE_TYPES.length)];
  return {
    id: `obs_${Date.now()}_${Math.random()}`,
    lane: randomLane(),
    type,
    z: 0,
    speed: type === 'moving' ? speed * 1.4 : speed,
  };
}

function spawnCollectible(): Collectible {
  return {
    id: `coin_${Date.now()}_${Math.random()}`,
    lane: randomLane(),
    z: 0,
    collected: false,
  };
}

export interface GameEngineState {
  gameState: GameState;
  playerLane: Lane;
  playerAction: PlayerAction;
  obstacles: Obstacle[];
  collectibles: Collectible[];
  stats: GameStats;
  countdown: number;
  speed: number;
}

export interface GameEngineActions {
  startGame: () => void;
  pauseGame: () => void;
  resumeGame: () => void;
  quitToMenu: () => void;
  restartGame: () => void;
  moveLeft: () => void;
  moveRight: () => void;
  jump: () => void;
  slide: () => void;
}

const rafRequest = (cb: FrameRequestCallback): number =>
  typeof window !== 'undefined' ? requestAnimationFrame(cb) : (setTimeout(cb, 16) as unknown as number);

const rafCancel = (id: number): void =>
  typeof window !== 'undefined' ? cancelAnimationFrame(id) : clearTimeout(id);

export function useGameEngine(): GameEngineState & GameEngineActions {
  const [gameState, setGameState] = useState<GameState>('menu');
  const [playerLane, setPlayerLane] = useState<Lane>(1);
  const [playerAction, setPlayerAction] = useState<PlayerAction>('run');
  const [obstacles, setObstacles] = useState<Obstacle[]>([]);
  const [collectibles, setCollectibles] = useState<Collectible[]>([]);
  const [stats, setStats] = useState<GameStats>({ score: 0, coins: 0, distance: 0, isNewHighScore: false });
  const [countdown, setCountdown] = useState(3);
  const [speed, setSpeed] = useState(BASE_SPEED);

  const frameRef = useRef(0);
  const frameCountRef = useRef(0);
  const gameStateRef = useRef<GameState>('menu');
  const playerLaneRef = useRef<Lane>(1);
  const playerActionRef = useRef<PlayerAction>('run');
  const speedRef = useRef(BASE_SPEED);
  const statsRef = useRef<GameStats>({ score: 0, coins: 0, distance: 0, isNewHighScore: false });
  const actionTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const resetState = useCallback(() => {
    setPlayerLane(1);
    setPlayerAction('run');
    setObstacles([]);
    setCollectibles([]);
    setStats({ score: 0, coins: 0, distance: 0, isNewHighScore: false });
    setSpeed(BASE_SPEED);
    playerLaneRef.current = 1;
    playerActionRef.current = 'run';
    speedRef.current = BASE_SPEED;
    statsRef.current = { score: 0, coins: 0, distance: 0, isNewHighScore: false };
    frameCountRef.current = 0;
  }, []);

  const triggerGameOver = useCallback(() => {
    rafCancel(frameRef.current);
    gameStateRef.current = 'gameover';
    setGameState('gameover');
    setPlayerAction('dead');
    playerActionRef.current = 'dead';
    const finalStats = statsRef.current;
    const isNew = saveHighScore(finalStats.score);
    addPersonalScore({ name: 'YOU', score: finalStats.score, distance: finalStats.distance });
    setStats(prev => ({ ...prev, isNewHighScore: isNew }));
  }, []);

  const gameLoop = useCallback(() => {
    if (gameStateRef.current !== 'playing') return;

    frameCountRef.current += 1;
    const fc = frameCountRef.current;
    const currentSpeed = Math.min(speedRef.current + SPEED_INCREMENT * fc * 0.001, MAX_SPEED);
    speedRef.current = currentSpeed;

    // spawn obstacles
    const spawnInterval = Math.max(50, OBSTACLE_SPAWN_RATE - Math.floor(fc / 300));
    if (fc % spawnInterval === 0) {
      setObstacles(prev => [...prev, spawnObstacle(currentSpeed)]);
    }

    // spawn collectibles
    if (fc % COLLECTIBLE_SPAWN_RATE === 0) {
      setCollectibles(prev => [...prev, spawnCollectible()]);
    }

    setSpeed(currentSpeed);

    setObstacles(prev => {
      const updated = prev
        .map(o => ({ ...o, z: o.z + o.speed }))
        .filter(o => o.z < 1.15);

      // collision detection
      const playerLaneCurrent = playerLaneRef.current;
      const playerActionCurrent = playerActionRef.current;
      for (const obs of updated) {
        if (obs.z > 0.88 && obs.z < 1.0 && obs.lane === playerLaneCurrent) {
          const dodged =
            (obs.type === 'hurdle' && playerActionCurrent === 'jump') ||
            (obs.type === 'barrier' && playerActionCurrent === 'slide');
          if (!dodged) {
            triggerGameOver();
            return [];
          }
        }
      }
      return updated;
    });

    setCollectibles(prev => {
      const playerLaneCurrent = playerLaneRef.current;
      let coinsGained = 0;
      const updated = prev
        .map(c => {
          if (!c.collected && c.z > 0.85 && c.z < 1.0 && c.lane === playerLaneCurrent) {
            coinsGained += 1;
            return { ...c, collected: true, z: c.z + currentSpeed };
          }
          return { ...c, z: c.z + currentSpeed };
        })
        .filter(c => c.z < 1.05);

      if (coinsGained > 0) {
        statsRef.current = {
          ...statsRef.current,
          coins: statsRef.current.coins + coinsGained,
          score: statsRef.current.score + coinsGained * COIN_SCORE,
        };
        setStats({ ...statsRef.current });
      }
      return updated;
    });

    // update distance & score
    statsRef.current = {
      ...statsRef.current,
      distance: statsRef.current.distance + 1,
      score: statsRef.current.score + DISTANCE_SCORE_MULTIPLIER,
    };
    if (fc % 10 === 0) setStats({ ...statsRef.current });

    frameRef.current = rafRequest(gameLoop);
  }, [triggerGameOver]);

  const startCountdown = useCallback(() => {
    gameStateRef.current = 'countdown';
    setGameState('countdown');
    setCountdown(3);
    let count = 3;
    const interval = setInterval(() => {
      count -= 1;
      setCountdown(count);
      if (count <= 0) {
        clearInterval(interval);
        gameStateRef.current = 'playing';
        setGameState('playing');
        frameRef.current = rafRequest(gameLoop);
      }
    }, 1000);
  }, [gameLoop]);

  const startGame = useCallback(() => {
    resetState();
    startCountdown();
  }, [resetState, startCountdown]);

  const pauseGame = useCallback(() => {
    if (gameStateRef.current !== 'playing') return;
    rafCancel(frameRef.current);
    gameStateRef.current = 'paused';
    setGameState('paused');
  }, []);

  const resumeGame = useCallback(() => {
    if (gameStateRef.current !== 'paused') return;
    gameStateRef.current = 'playing';
    setGameState('playing');
    frameRef.current = rafRequest(gameLoop);
  }, [gameLoop]);

  const quitToMenu = useCallback(() => {
    rafCancel(frameRef.current);
    gameStateRef.current = 'menu';
    setGameState('menu');
    resetState();
  }, [resetState]);

  const restartGame = useCallback(() => {
    rafCancel(frameRef.current);
    resetState();
    startCountdown();
  }, [resetState, startCountdown]);

  const setPlayerActionTemporary = useCallback((action: PlayerAction, duration: number) => {
    if (playerActionRef.current === 'dead') return;
    if (actionTimerRef.current) clearTimeout(actionTimerRef.current);
    playerActionRef.current = action;
    setPlayerAction(action);
    actionTimerRef.current = setTimeout(() => {
      if (playerActionRef.current !== 'dead') {
        playerActionRef.current = 'run';
        setPlayerAction('run');
      }
    }, duration);
  }, []);

  const moveLeft = useCallback(() => {
    if (gameStateRef.current !== 'playing') return;
    setPlayerLane(prev => {
      const next = Math.max(0, prev - 1) as Lane;
      playerLaneRef.current = next;
      return next;
    });
  }, []);

  const moveRight = useCallback(() => {
    if (gameStateRef.current !== 'playing') return;
    setPlayerLane(prev => {
      const next = Math.min(2, prev + 1) as Lane;
      playerLaneRef.current = next;
      return next;
    });
  }, []);

  const jump = useCallback(() => {
    if (gameStateRef.current !== 'playing') return;
    setPlayerActionTemporary('jump', 600);
  }, [setPlayerActionTemporary]);

  const slide = useCallback(() => {
    if (gameStateRef.current !== 'playing') return;
    setPlayerActionTemporary('slide', 500);
  }, [setPlayerActionTemporary]);

  // keyboard controls
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (gameStateRef.current === 'playing') {
        switch (e.key) {
          case 'ArrowLeft': case 'a': case 'A': moveLeft(); break;
          case 'ArrowRight': case 'd': case 'D': moveRight(); break;
          case 'ArrowUp': case 'w': case 'W': case ' ': e.preventDefault(); jump(); break;
          case 'ArrowDown': case 's': case 'S': slide(); break;
          case 'Escape': pauseGame(); break;
        }
      } else if (gameStateRef.current === 'paused') {
        if (e.key === 'Escape') resumeGame();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [moveLeft, moveRight, jump, slide, pauseGame, resumeGame]);

  // cleanup on unmount
  useEffect(() => {
    return () => {
      rafCancel(frameRef.current);
      if (actionTimerRef.current) clearTimeout(actionTimerRef.current);
    };
  }, []);

  return {
    gameState,
    playerLane,
    playerAction,
    obstacles,
    collectibles,
    stats,
    countdown,
    speed,
    startGame,
    pauseGame,
    resumeGame,
    quitToMenu,
    restartGame,
    moveLeft,
    moveRight,
    jump,
    slide,
  };
}
