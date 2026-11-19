/**
 * FSRS-6 (Free Spaced Repetition Scheduler) memory model, dependency-free.
 *
 * FSRS models each item's memory with two numbers:
 *  - stability S: days until recall probability falls to 90%
 *  - difficulty D: 1 (easy) … 10 (hard), how much S grows on each success
 * and predicts recall probability ("retrievability") from the time since the
 * last review. Reviews are then scheduled for when retrievability is expected
 * to drop to the desired retention, instead of on fixed Leitner intervals.
 *
 * Formulas and default weights follow the reference implementation
 * (open-spaced-repetition/ts-fsrs, FSRS-6 with short-term scheduling) and are
 * cross-checked against it numerically; see src/quiz/__tests__/fsrs.test.ts.
 */

/** FSRS-6 default weights (w0–w20), trained on hundreds of millions of reviews. */
export const DEFAULT_WEIGHTS: readonly number[] = Object.freeze([
  0.212, 1.2931, 2.3065, 8.2956, 6.4133, 0.8334, 3.0194, 0.001, 1.8722, 0.1666, 0.796, 1.4835, 0.0614, 0.2629, 1.6483, 0.6014,
  1.8729, 0.5425, 0.0912, 0.0658, 0.1542,
]);

export const Rating = { Again: 1, Hard: 2, Good: 3, Easy: 4 } as const;
export type Rating = (typeof Rating)[keyof typeof Rating];

export interface MemoryState {
  stability: number;
  difficulty: number;
}

const clamp = (v: number, min: number, max: number) => Math.min(Math.max(v, min), max);
const round8 = (n: number) => Math.round(n * 1e8) / 1e8;

const S_MIN = 0.001;
const S_MAX = 36500;
const w = DEFAULT_WEIGHTS;
const DECAY = -w[20];
/** Chosen so that retrievability is exactly 90% when elapsed time equals stability. */
const FACTOR = round8(Math.exp(Math.pow(DECAY, -1) * Math.log(0.9)) - 1); // = 0.9^(1/DECAY) - 1, rounded as the reference does


/** Probability of recalling an item `elapsedDays` after its last review. */
export function retrievability(elapsedDays: number, stability: number): number {
  return round8(Math.pow(1 + (FACTOR * elapsedDays) / stability, DECAY));
}

/** Days until retrievability falls to `desiredRetention` (at least 1). */
export function nextIntervalDays(stability: number, desiredRetention = 0.9, maximumDays = 36500): number {
  const interval = (stability / FACTOR) * (Math.pow(desiredRetention, 1 / DECAY) - 1);
  return clamp(Math.round(interval), 1, maximumDays);
}

function initStability(g: Rating): number {
  return clamp(w[g - 1], S_MIN, S_MAX);
}

function initDifficulty(g: Rating): number {
  return round8(w[4] - Math.exp((g - 1) * w[5]) + 1);
}

function nextDifficulty(d: number, g: Rating): number {
  const delta = -w[6] * (g - 3);
  // Linear damping: changes shrink as difficulty approaches its ceiling.
  const damped = d + round8((delta * (10 - d)) / 9);
  // Mean reversion toward the "Easy" starting difficulty, so D can't drift forever.
  const reverted = round8(w[7] * initDifficulty(Rating.Easy) + (1 - w[7]) * damped);
  return clamp(reverted, 1, 10);
}

function nextRecallStability(d: number, s: number, r: number, g: Rating): number {
  const hardPenalty = g === Rating.Hard ? w[15] : 1;
  const easyBonus = g === Rating.Easy ? w[16] : 1;
  const growth = Math.exp(w[8]) * (11 - d) * Math.pow(s, -w[9]) * (Math.exp((1 - r) * w[10]) - 1) * hardPenalty * easyBonus;
  return round8(clamp(s * (1 + growth), S_MIN, S_MAX));
}

function nextForgetStability(d: number, s: number, r: number): number {
  return round8(clamp(w[11] * Math.pow(d, -w[12]) * (Math.pow(s + 1, w[13]) - 1) * Math.exp((1 - r) * w[14]), S_MIN, S_MAX));
}

/** Same-day reviews barely move stability, so cramming can't fake long-term memory. */
function nextShortTermStability(s: number, g: Rating): number {
  const sinc = Math.pow(s, -w[19]) * Math.exp(w[17] * (g - 3 + w[18]));
  const masked = g >= Rating.Hard ? Math.max(sinc, 1) : sinc;
  return round8(clamp(s * masked, S_MIN, S_MAX));
}

/**
 * The memory state after a review graded `g`, `elapsedDays` (whole days)
 * after the previous one. Pass `null` for an item's first review.
 */
export function nextMemoryState(state: MemoryState | null, elapsedDays: number, g: Rating): MemoryState {
  if (!state) {
    return { difficulty: clamp(initDifficulty(g), 1, 10), stability: initStability(g) };
  }
  const { difficulty: d, stability: s } = state;
  let stability: number;
  if (elapsedDays === 0) {
    stability = nextShortTermStability(s, g);
  } else if (g === Rating.Again) {
    const r = retrievability(elapsedDays, s);
    const afterFail = nextForgetStability(d, s, r);
    stability = clamp(round8(s / Math.exp(w[17] * w[18])), S_MIN, afterFail);
  } else {
    stability = nextRecallStability(d, s, retrievability(elapsedDays, s), g);
  }
  return { difficulty: nextDifficulty(d, g), stability };
}
