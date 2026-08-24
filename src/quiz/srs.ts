import type { ProgressRecord, QuizCategory } from "./types";

/**
 * Leitner box intervals, in days, indexed by box number (0–5). Box 0 means
 * "due again almost immediately" (same session); box 5 is effectively
 * mastered and rarely resurfaces. Simpler than full SM-2, but gives the
 * same core behavior the brief asks for: harder questions resurface sooner,
 * easy ones fade into the background.
 */
const BOX_INTERVAL_DAYS = [0, 1, 3, 7, 16, 35];
export const MAX_BOX = BOX_INTERVAL_DAYS.length - 1;

export function newProgressRecord(countryId: string, category: QuizCategory, now = new Date()): ProgressRecord {
  return {
    countryId,
    category,
    box: 0,
    correctCount: 0,
    incorrectCount: 0,
    dueAt: now.toISOString(),
    lastReviewedAt: null,
  };
}

/** Advance a record after an answer. Correct moves up a box (longer gap before it resurfaces); incorrect drops it back near the start. */
export function applyAnswer(record: ProgressRecord, correct: boolean, now = new Date()): ProgressRecord {
  const box = correct ? Math.min(MAX_BOX, record.box + 1) : Math.max(0, record.box - 2);
  const intervalDays = BOX_INTERVAL_DAYS[box];
  const dueAt = new Date(now.getTime() + intervalDays * 24 * 60 * 60 * 1000).toISOString();

  return {
    ...record,
    box,
    correctCount: record.correctCount + (correct ? 1 : 0),
    incorrectCount: record.incorrectCount + (correct ? 0 : 1),
    dueAt,
    lastReviewedAt: now.toISOString(),
  };
}

export function isDue(record: ProgressRecord, now = new Date()): boolean {
  return new Date(record.dueAt).getTime() <= now.getTime();
}
