import { COUNTRIES } from "../data/countries";
import { hintBetween } from "./locateHints";
import { routePoints } from "../gamification/gameScoring";
import { shuffle, type Rng } from "../utils/random";

/**
 * Travel Route: get from one country to another by crossing land borders, in
 * as few moves as you can. "Par" is the shortest possible route.
 */

export const ROUTES_PER_ROUND = 5;
/** Par for each route in a round: it gets harder as you go. */
export const ROUND_PARS = [3, 4, 4, 5, 6] as const;

const byId = new Map(COUNTRIES.map((c) => [c.id, c]));

/** Land borders as an undirected graph (the source data is symmetric, but don't rely on it). */
export const BORDER_GRAPH: ReadonlyMap<string, readonly string[]> = (() => {
  const graph = new Map<string, Set<string>>();
  const link = (a: string, b: string) => {
    if (!graph.has(a)) graph.set(a, new Set());
    graph.get(a)!.add(b);
  };
  for (const c of COUNTRIES) {
    for (const b of c.borders ?? []) {
      if (!byId.has(b) || b === c.id) continue;
      link(c.id, b);
      link(b, c.id);
    }
  }
  return new Map(Array.from(graph, ([id, set]) => [id, Array.from(set).sort()]));
})();

export function neighborsOf(id: string): readonly string[] {
  return BORDER_GRAPH.get(id) ?? [];
}

/** Hops from `from` to every country reachable over land. */
export function distancesFrom(from: string): Map<string, number> {
  const dist = new Map<string, number>([[from, 0]]);
  const queue = [from];
  for (let i = 0; i < queue.length; i++) {
    const id = queue[i];
    for (const next of neighborsOf(id)) {
      if (dist.has(next)) continue;
      dist.set(next, dist.get(id)! + 1);
      queue.push(next);
    }
  }
  return dist;
}

/** One shortest route, start and end included, or null if there's no land route. */
export function shortestPath(from: string, to: string): string[] | null {
  if (from === to) return [from];
  const prev = new Map<string, string>([[from, from]]);
  const queue = [from];
  for (let i = 0; i < queue.length; i++) {
    const id = queue[i];
    for (const next of neighborsOf(id)) {
      if (prev.has(next)) continue;
      prev.set(next, id);
      if (next === to) {
        const path = [to];
        while (path[0] !== from) path.unshift(prev.get(path[0])!);
        return path;
      }
      queue.push(next);
    }
  }
  return null;
}

export interface Route {
  start: string;
  target: string;
  /** Fewest moves (border crossings) needed. */
  par: number;
}

/** A route whose par is `par` (or the closest available), avoiding countries already used this round. */
export function pickRoute(par: number, rng: Rng = Math.random, avoid: ReadonlySet<string> = new Set()): Route {
  const starts = shuffle(
    COUNTRIES.filter((c) => neighborsOf(c.id).length > 0 && !avoid.has(c.id)).map((c) => c.id),
    rng
  );
  let best: Route | null = null;
  for (const start of starts) {
    const dist = distancesFrom(start);
    const targets = shuffle(
      Array.from(dist).filter(([id]) => !avoid.has(id) && id !== start),
      rng
    );
    const exact = targets.find(([, d]) => d === par);
    if (exact) return { start, target: exact[0], par };
    for (const [id, d] of targets) {
      if (!best || Math.abs(d - par) < Math.abs(best.par - par)) best = { start, target: id, par: d };
    }
  }
  if (!best) throw new Error("No land routes in the data");
  return best;
}

/** A round of routes with rising par, no country used as a start or end twice. */
export function buildRouteRound(rng: Rng = Math.random): Route[] {
  const used = new Set<string>();
  return ROUND_PARS.map((par) => {
    const route = pickRoute(par, rng, used);
    used.add(route.start);
    used.add(route.target);
    return route;
  });
}

/** How far the target is from the country you're in (its centre to the target's nearest edge), and which way. */
export function routeHint(currentId: string, targetId: string): { km: number; bearing: number } {
  return hintBetween(currentId, targetId);
}

// ---- Round state (pure, so the screen stays thin and the rules are testable) ----

export interface RouteState {
  route: Route;
  /** Countries visited, starting with route.start. */
  path: string[];
  status: "playing" | "arrived" | "gaveUp";
  points: number;
}

export function startRoute(route: Route): RouteState {
  return { route, path: [route.start], status: "playing", points: 0 };
}

export function currentCountry(state: RouteState): string {
  return state.path[state.path.length - 1];
}

export function movesMade(state: RouteState): number {
  return state.path.length - 1;
}

/** Cross into `next`. Ignored unless it borders where you are and the route is still on. */
export function move(state: RouteState, next: string): RouteState {
  if (state.status !== "playing" || !neighborsOf(currentCountry(state)).includes(next)) return state;
  const path = [...state.path, next];
  if (next !== state.route.target) return { ...state, path };
  return { ...state, path, status: "arrived", points: routePoints(path.length - 1, state.route.par) };
}

export function giveUp(state: RouteState): RouteState {
  return state.status === "playing" ? { ...state, status: "gaveUp", points: 0 } : state;
}
