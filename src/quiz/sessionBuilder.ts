import { ELIGIBLE_POOLS, generateQuestion, isEligible } from "./generators";
import { progressStore } from "../services/progressStore";
import { pickRandom } from "../utils/random";
import type { ProgressRecord, Question, QuizCategory } from "./types";

export type CategoryFilter = QuizCategory | "mixed";

const ALL_CATEGORIES: QuizCategory[] = ["flag", "capital", "shape", "currency", "neighbor", "landmark", "food"];

function categoryPool(filter: CategoryFilter): QuizCategory[] {
  return filter === "mixed" ? ALL_CATEGORIES : [filter];
}

/**
 * Builds a session of `length` questions. Due-for-review (country, category)
 * pairs are prioritized first — that's the spaced-repetition payoff — and
 * the remainder is filled with fresh pairs the user hasn't tried yet.
 *
 * Two distinct modes:
 *  - Broad (no focusCountryId): no country repeats within the session, so a
 *    10-question round touches 10 different places.
 *  - Focused (focusCountryId set, e.g. "Practice this country" from the
 *    country page): the country is fixed, so instead no *category* repeats
 *    — you get flag, capital, shape, etc. for that one country, not the
 *    same question seven times.
 */
export async function buildSession(filter: CategoryFilter, length = 10, focusCountryId?: string): Promise<Question[]> {
  const categories = categoryPool(filter);
  const dueRecords = await progressStore.getDue();
  const usedCountries = new Set<string>();
  const usedCategories = new Set<QuizCategory>();
  const questions: Question[] = [];

  const dueForFilter = dueRecords
    .filter((r) => categories.includes(r.category as QuizCategory))
    .filter((r) => !focusCountryId || r.countryId === focusCountryId)
    .filter((r) => isEligible(r.category as QuizCategory, r.countryId));

  for (const record of dueForFilter) {
    if (questions.length >= length) break;
    const category = record.category as QuizCategory;
    if (focusCountryId ? usedCategories.has(category) : usedCountries.has(record.countryId)) continue;
    questions.push(generateQuestion(category, record.countryId));
    usedCountries.add(record.countryId);
    usedCategories.add(category);
  }

  // Fill the rest with fresh pairs.
  let guard = 0;
  while (questions.length < length && guard < length * 20) {
    guard++;
    const remainingCategories = focusCountryId ? categories.filter((c) => !usedCategories.has(c)) : categories;
    if (remainingCategories.length === 0) break; // focused mode: ran out of categories for this country
    const category = remainingCategories[Math.floor(Math.random() * remainingCategories.length)];

    let candidatePool = ELIGIBLE_POOLS[category];
    if (focusCountryId) {
      candidatePool = candidatePool.filter((c) => c.id === focusCountryId);
      if (candidatePool.length === 0) continue; // this country isn't eligible for this category
    } else {
      candidatePool = candidatePool.filter((c) => !usedCountries.has(c.id));
    }

    const candidate = pickRandom(candidatePool, 1)[0];
    if (!candidate) continue;

    questions.push(generateQuestion(category, candidate.id));
    usedCountries.add(candidate.id);
    usedCategories.add(category);
  }

  return questions;
}

export async function recordAnswer(record: ProgressRecord): Promise<void> {
  await progressStore.upsert(record);
}
