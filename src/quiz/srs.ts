import { nextIntervalDays, nextMemoryState, Rating, retrievability, type MemoryState } from "./fsrs";
import type { ProgressRecord, QuizCategory } from "./types";

/**
 * Spaced-repetition scheduling for one (country, category) pair, using the
 * FSRS-6 memory model (see fsrs.ts). A right answer counts as "Good" and a
 * wrong one as "Again"; the next review is scheduled for when the predicted
 * chance of recalling the answer drops to DESIRED_RETENTION.
 */

const DAY_MS = 24 * 60 * 60 * 1000;
export const DESIRED_RETENTION = 0.9;
/** Nobody needs to wait more than a year to see a flag again. */
export const MAXIMUM_INTERVAL_DAYS = 365;
/** A missed answer comes back in the next session rather than days later. */
const RELEARN_DELAY_MS = 10 * 60 * 1000;

/**
 * Memory-strength levels 0–5, derived from FSRS stability (days). The rest of
 * the app (mastery scores, "Master 25 flags" achievements) reasons in these
 * levels; level 5 means the answer is expected to stick for over a month.
 */
const LEVEL_THRESHOLD_DAYS = [1, 3, 7, 16, 35];
export const MAX_BOX = LEVEL_THRESHOLD_DAYS.length;

export function strengthLevel(stabilityDays: number): number {
  return LEVEL_THRESHOLD_DAYS.filter((t) => stabilityDays >= t).length;
}

/**
 * Progress saved before FSRS (Leitner boxes 0–5 with 0/1/3/7/16/35-day
 * intervals) has no stability yet. Seed it from the box's interval, so
 * existing learners keep their place instead of starting over.
 */
const LEGACY_BOX_STABILITY = [0.5, 1, 3, 7, 16, 35];
const NEUTRAL_DIFFICULTY = 5;

function memoryOf(record: ProgressRecord): MemoryState | null {
  if (record.stability != null && record.difficulty != null) {
    return { stability: record.stability, difficulty: record.difficulty };
  }
  if (record.correctCount + record.incorrectCount > 0) {
    const box = Math.max(0, Math.min(LEGACY_BOX_STABILITY.length - 1, record.box));
    return { stability: LEGACY_BOX_STABILITY[box], difficulty: NEUTRAL_DIFFICULTY };
  }
  return null;
}

function elapsedWholeDays(from: string | null, now: Date): number {
  if (!from) return 0;
  return Math.max(0, Math.floor((now.getTime() - new Date(from).getTime()) / DAY_MS));
}

export function newProgressRecord(countryId: string, category: QuizCategory, now = new Date()): ProgressRecord {
  return {
    countryId,
    category,
    box: 0,
    correctCount: 0,
    incorrectCount: 0,
    dueAt: now.toISOString(),
    lastReviewedAt: null,
    stability: null,
    difficulty: null,
  };
}

/**
 * Update a record after an answer. `hard` marks a right answer that took a
 * struggle (e.g. found on a second or third try): FSRS grades it "Hard", so
 * it comes back sooner than a clean first-try answer.
 */
export function applyAnswer(record: ProgressRecord, correct: boolean, now = new Date(), hard = false): ProgressRecord {
  const grade = !correct ? Rating.Again : hard ? Rating.Hard : Rating.Good;
  const memory = nextMemoryState(memoryOf(record), elapsedWholeDays(record.lastReviewedAt, now), grade);
  const delayMs = correct ? nextIntervalDays(memory.stability, DESIRED_RETENTION, MAXIMUM_INTERVAL_DAYS) * DAY_MS : RELEARN_DELAY_MS;

  return {
    ...record,
    box: strengthLevel(memory.stability),
    stability: memory.stability,
    difficulty: memory.difficulty,
    correctCount: record.correctCount + (correct ? 1 : 0),
    incorrectCount: record.incorrectCount + (correct ? 0 : 1),
    dueAt: new Date(now.getTime() + delayMs).toISOString(),
    lastReviewedAt: now.toISOString(),
  };
}

export function isDue(record: ProgressRecord, now = new Date()): boolean {
  return new Date(record.dueAt).getTime() <= now.getTime();
}

/** Predicted chance (0–1) of answering correctly right now, or null if never answered. */
export function recallProbability(record: ProgressRecord, now = new Date()): number | null {
  const memory = memoryOf(record);
  if (!memory) return null;
  return retrievability(elapsedWholeDays(record.lastReviewedAt, now), memory.stability);
}
