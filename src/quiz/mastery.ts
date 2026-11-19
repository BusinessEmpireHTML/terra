import { COUNTRIES } from "../data/countries";
import { isEligible } from "./generators";
import { QUIZ_CATEGORIES, MASTERY_LEVELS, type CountryMastery, type ProgressRecord, type QuizCategory } from "./types";
import { MAX_BOX } from "./srs";

/** Mastery score at or above which a country counts as "mastered" (Master tier). */
export const MASTERED_THRESHOLD = 85;

/**
 * The quiz categories that actually apply to this country. Islands have no
 * land neighbors and microstates have no outline at this map scale, so a
 * fixed denominator of 7 would make 100% (Legend) unreachable for them.
 */
export function availableCategoriesFor(countryId: string): QuizCategory[] {
  return QUIZ_CATEGORIES.map((c) => c.key).filter((key) => isEligible(key, countryId));
}

function levelFor(score: number): (typeof MASTERY_LEVELS)[number] {
  let current: (typeof MASTERY_LEVELS)[number] = MASTERY_LEVELS[0];
  for (const level of MASTERY_LEVELS) {
    if (score >= level.min) current = level;
  }
  return current;
}

/**
 * Mastery = (how well you know the categories you've tried) × (how much of
 * the country you've actually explored). Getting one category to a perfect
 * box score isn't "mastery" on its own — breadth matters too, same as the
 * brief's "know every country's flag, capital, language..." framing.
 */
export function computeMastery(countryId: string, records: ProgressRecord[]): CountryMastery {
  const available = new Set(availableCategoriesFor(countryId));
  const countryRecords = records.filter(
    (r) =>
      r.countryId === countryId &&
      // Ignore records for categories that no longer apply (e.g. a dish that
      // was later marked too generic to quiz on), so coverage can't exceed 100%.
      available.has(r.category) &&
      (r.correctCount > 0 || r.incorrectCount > 0)
  );
  const categoriesAttempted = countryRecords.length;
  const categoriesAvailable = available.size;

  const avgBoxRatio =
    categoriesAttempted === 0 ? 0 : countryRecords.reduce((sum, r) => sum + r.box / MAX_BOX, 0) / categoriesAttempted;
  const coverageRatio = categoriesAvailable === 0 ? 0 : categoriesAttempted / categoriesAvailable;

  const score = Math.round(avgBoxRatio * coverageRatio * 100);
  const level = levelFor(score);

  return {
    countryId,
    score,
    level: level.key,
    levelLabel: level.label,
    categoriesAttempted,
    categoriesAvailable,
  };
}

export function computeAllMastery(records: ProgressRecord[]): Map<string, CountryMastery> {
  const byCountry = new Map<string, ProgressRecord[]>();
  for (const r of records) {
    const list = byCountry.get(r.countryId) ?? [];
    list.push(r);
    byCountry.set(r.countryId, list);
  }
  const result = new Map<string, CountryMastery>();
  for (const [countryId, countryRecords] of byCountry) {
    result.set(countryId, computeMastery(countryId, countryRecords));
  }
  return result;
}

export function overallStats(records: ProgressRecord[]) {
  const masteryByCountry = computeAllMastery(records);
  const scores = Array.from(masteryByCountry.values());
  const countriesStarted = scores.filter((m) => m.categoriesAttempted > 0).length;
  const countriesMastered = scores.filter((m) => m.score >= MASTERED_THRESHOLD).length;
  const totalCorrect = records.reduce((s, r) => s + r.correctCount, 0);
  const totalIncorrect = records.reduce((s, r) => s + r.incorrectCount, 0);
  const totalAnswered = totalCorrect + totalIncorrect;
  const accuracy = totalAnswered === 0 ? 0 : Math.round((totalCorrect / totalAnswered) * 100);

  return {
    countriesStarted,
    countriesMastered,
    totalCountries: COUNTRIES.length,
    totalAnswered,
    accuracy,
  };
}
