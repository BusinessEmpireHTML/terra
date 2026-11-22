/**
 * Scoring for Travel Route and Mystery Country, kept dependency-free so the
 * stats code, the games and the tests can all share it.
 */

/** XP per point. The activity log stores XP, so points = XP / this. */
export const XP_PER_GAME_POINT = 5;

/** Travel Route: 3 points at par, 2 within two extra moves, 1 within five, 0 beyond (or if you give up). */
export const ROUTE_MAX_POINTS = 3;
export function routePoints(moves: number, par: number): number {
  const extra = moves - par;
  if (extra <= 0) return 3;
  if (extra <= 2) return 2;
  if (extra <= 5) return 1;
  return 0;
}

/** Mystery Country: 6 points if solved from the first clue, one fewer per extra clue, never below 1 once solved. */
export const MYSTERY_MAX_POINTS = 6;
export function mysteryPoints(cluesShown: number): number {
  return Math.max(1, MYSTERY_MAX_POINTS + 1 - Math.max(1, cluesShown));
}
