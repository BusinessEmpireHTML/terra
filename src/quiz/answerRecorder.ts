import { applyAnswer, newProgressRecord } from "./srs";
import { progressStore } from "../services/progressStore";
import { activityStore, localDateString } from "../services/activityStore";
import type { QuizCategory } from "./types";

export const XP_CORRECT = 10;
/** Rewards breadth: the first time you ever try a given (country, category) pair. */
export const XP_NEW_PAIR_BONUS = 5;

// Every answer is a read-modify-write of its SRS record plus an activity log
// insert. Running them one at a time means two quick answers can never
// clobber each other, and callers can wait for everything to land before
// computing stats or achievements.
let queue: Promise<unknown> = Promise.resolve();

async function persist(countryId: string, category: QuizCategory, correct: boolean): Promise<number> {
  const now = new Date();
  const [existing, priorAttempts] = await Promise.all([
    progressStore.get(countryId, category),
    activityStore.countFor(countryId, category),
  ]);
  const base = existing ?? newProgressRecord(countryId, category, now);
  await progressStore.upsert(applyAnswer(base, correct, now));

  const xpEarned = correct ? XP_CORRECT + (priorAttempts === 0 ? XP_NEW_PAIR_BONUS : 0) : 0;
  await activityStore.log({
    date: localDateString(now),
    timestamp: now.toISOString(),
    countryId,
    category,
    correct,
    xpEarned,
  });
  return xpEarned;
}

/** Saves one answer (SRS progress + activity/XP log). Resolves to the XP it earned. */
export function recordAnswer(question: { countryId: string; category: QuizCategory }, correct: boolean): Promise<number> {
  const task = queue.then(() => persist(question.countryId, question.category, correct));
  queue = task.catch((err) => {
    if (__DEV__) console.warn("Failed to save answer:", err);
  });
  return task;
}

/** Resolves once every answer recorded so far has been written. */
export function whenAnswersSaved(): Promise<void> {
  return queue.then(() => undefined);
}
