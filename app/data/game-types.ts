export type Lane = 0 | 1 | 2;

export type PlayerAction = 'run' | 'jump' | 'slide' | 'dead';

export type ObstacleType = 'hurdle' | 'barrier' | 'moving';

export interface Obstacle {
  id: string;
  lane: Lane;
  type: ObstacleType;
  z: number; // depth position 0 (far) → 1 (near)
  speed: number;
}

export interface Collectible {
  id: string;
  lane: Lane;
  z: number;
  collected: boolean;
}

export type GameState = 'menu' | 'countdown' | 'playing' | 'paused' | 'gameover';

export interface GameStats {
  score: number;
  coins: number;
  distance: number;
  isNewHighScore: boolean;
}

export const LANE_COUNT = 3;
export const BASE_SPEED = 0.012;
export const SPEED_INCREMENT = 0.0002;
export const MAX_SPEED = 0.045;
export const OBSTACLE_SPAWN_RATE = 120; // frames
export const COLLECTIBLE_SPAWN_RATE = 80; // frames
export const COIN_SCORE = 50;
export const DISTANCE_SCORE_MULTIPLIER = 1;
