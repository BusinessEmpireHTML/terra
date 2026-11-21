import { ELIGIBLE_POOLS, generateQuestion } from "./generators";
import { buildDailyQuiz } from "./daily";
import { buildChallengeQuiz } from "./challenge";
import { progressStore } from "../services/progressStore";
import { shuffle } from "../utils/random";
import { QUIZ_CATEGORIES, type ProgressRecord, type Question, type QuizCategory } from "./types";

export type CategoryFilter = QuizCategory | "mixed";

export const DEFAULT_SESSION_LENGTH = 10;
export { DAILY_QUIZ_LENGTH } from "./daily";

const ALL_CATEGORIES: QuizCategory[] = QUIZ_CATEGORIES.map((c) => c.key);

/** Narrows an untrusted value (e.g. a URL segment) to a valid filter. */
export function isCategoryFilter(value: unknown): value is CategoryFilter {
  return value === "mixed" || ALL_CATEGORIES.includes(value as QuizCategory);
}

function categoryPool(filter: CategoryFilter): QuizCategory[] {
  return filter === "mixed" ? ALL_CATEGORIES : [filter];
}

export interface SessionOptions {
  /** Number of questions to aim for (fewer if the filter doesn't have enough material). */
  length?: number;
  /** "Practice this country": every question is about this one country. */
  focusCountryId?: string;
  /** Restrict questions to these countries (e.g. an expedition's list). */
  countryIds?: string[];
  /** Build that date's Daily Quiz (YYYY-MM-DD) instead — the same questions for every player. */
  dailyDate?: string;
  /** Build a friend challenge's 10 countries from its seed instead. */
  challengeSeed?: number;
}

interface Pair {
  countryId: string;
  category: QuizCategory;
}

const pairKey = (countryId: string, category: string) => `${countryId}|${category}`;

/**
 * Orders every allowed (country, category) pair by how much it deserves a
 * slot: overdue reviews first (oldest first — the spaced-repetition payoff),
 * then never-seen pairs (shuffled), then pairs that aren't due yet (soonest
 * first) as a last resort, e.g. when practicing one country you already know.
 */
export function rankPairs(candidates: Pair[], records: ProgressRecord[], now = new Date()): Pair[] {
  const recordByKey = new Map(records.map((r) => [pairKey(r.countryId, r.category), r]));
  const due: { pair: Pair; dueAt: number }[] = [];
  const fresh: Pair[] = [];
  const notYetDue: { pair: Pair; dueAt: number }[] = [];

  for (const pair of candidates) {
    const record = recordByKey.get(pairKey(pair.countryId, pair.category));
    if (!record) {
      fresh.push(pair);
      continue;
    }
    const dueAt = new Date(record.dueAt).getTime();
    (dueAt <= now.getTime() ? due : notYetDue).push({ pair, dueAt });
  }

  const byDueAt = (a: { dueAt: number }, b: { dueAt: number }) => a.dueAt - b.dueAt;
  return [...due.sort(byDueAt).map((d) => d.pair), ...shuffle(fresh), ...notYetDue.sort(byDueAt).map((d) => d.pair)];
}

/**
 * Picks up to `length` pairs from a ranked list. No pair ever repeats. In the
 * first pass no *country* repeats either, so a 10-question round touches 10
 * different places; a second pass relaxes that only when the pool is too
 * small (a single focused country, or a 5-country expedition).
 */
export function selectPairs(ranked: Pair[], length: number): Pair[] {
  const chosen: Pair[] = [];
  const usedPairs = new Set<string>();
  const usedCountries = new Set<string>();

  for (const allowCountryRepeat of [false, true]) {
    for (const pair of ranked) {
      if (chosen.length >= length) return chosen;
      const key = pairKey(pair.countryId, pair.category);
      if (usedPairs.has(key)) continue;
      if (!allowCountryRepeat && usedCountries.has(pair.countryId)) continue;
      chosen.push(pair);
      usedPairs.add(key);
      usedCountries.add(pair.countryId);
    }
  }
  return chosen;
}

export async function buildSession(filter: CategoryFilter, options: SessionOptions = {}): Promise<Question[]> {
  const { length = DEFAULT_SESSION_LENGTH, focusCountryId, countryIds, dailyDate, challengeSeed } = options;
  if (dailyDate) return buildDailyQuiz(dailyDate);
  if (challengeSeed != null) return buildChallengeQuiz(challengeSeed);
  const allowed = focusCountryId ? new Set([focusCountryId]) : countryIds ? new Set(countryIds) : null;

  const candidates: Pair[] = [];
  for (const category of categoryPool(filter)) {
    for (const country of ELIGIBLE_POOLS[category]) {
      if (!allowed || allowed.has(country.id)) candidates.push({ countryId: country.id, category });
    }
  }

  const records = await progressStore.getAll();
  const ranked = rankPairs(candidates, records);

  // Over-select slightly so one unexpected generation failure can't shorten
  // the session, then trim.
  const questions: Question[] = [];
  for (const pair of selectPairs(ranked, length + 3)) {
    if (questions.length >= length) break;
    try {
      questions.push(generateQuestion(pair.category, pair.countryId));
    } catch (err) {
      if (__DEV__) console.warn(`Skipping ${pair.category} question for ${pair.countryId}:`, err);
    }
  }
  return questions;
}
