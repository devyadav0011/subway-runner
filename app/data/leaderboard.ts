export interface ScoreEntry {
  id: string;
  name: string;
  score: number;
  distance: number;
  date: string;
}

export const MOCK_GLOBAL_SCORES: ScoreEntry[] = [
  { id: '1', name: 'NOVA_X', score: 48750, distance: 9200, date: '2024-01-15' },
  { id: '2', name: 'BLADE_R', score: 39200, distance: 7800, date: '2024-01-14' },
  { id: '3', name: 'GHOST_7', score: 32100, distance: 6400, date: '2024-01-14' },
  { id: '4', name: 'VIPER', score: 28800, distance: 5900, date: '2024-01-13' },
  { id: '5', name: 'ZEN_RUN', score: 21500, distance: 4300, date: '2024-01-13' },
];

export const HIGH_SCORE_KEY = 'velocity_dash_high_score';
export const PERSONAL_SCORES_KEY = 'velocity_dash_personal_scores';

export function getHighScore(): number {
  if (typeof window === 'undefined') return 0;
  return parseInt(localStorage.getItem(HIGH_SCORE_KEY) ?? '0', 10);
}

export function saveHighScore(score: number): boolean {
  if (typeof window === 'undefined') return false;
  const current = getHighScore();
  if (score > current) {
    localStorage.setItem(HIGH_SCORE_KEY, score.toString());
    return true;
  }
  return false;
}

export function getPersonalScores(): ScoreEntry[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(PERSONAL_SCORES_KEY) ?? '[]');
  } catch {
    return [];
  }
}

export function addPersonalScore(entry: Omit<ScoreEntry, 'id' | 'date'>): void {
  if (typeof window === 'undefined') return;
  const scores = getPersonalScores();
  const newEntry: ScoreEntry = {
    ...entry,
    id: Date.now().toString(),
    date: new Date().toISOString().split('T')[0],
  };
  const updated = [newEntry, ...scores].slice(0, 10);
  localStorage.setItem(PERSONAL_SCORES_KEY, JSON.stringify(updated));
}
