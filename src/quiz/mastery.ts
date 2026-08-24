import { COUNTRIES } from "../data/countries";
import { COUNTRY_CONTENT } from "../data/countryContent";
import { QUIZ_CATEGORIES, MASTERY_LEVELS, type CountryMastery, type ProgressRecord } from "./types";
import { MAX_BOX } from "./srs";

/** How many quiz categories actually apply to this country (Landmark/Food only exist for the 121 with content). */
export function availableCategoriesFor(countryId: string): number {
  const hasContent = Boolean(COUNTRY_CONTENT[countryId]);
  return QUIZ_CATEGORIES.filter((c) => !c.requiresContent || hasContent).length;
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
  const categoriesAvailable = availableCategoriesFor(countryId);
  const countryRecords = records.filter((r) => r.countryId === countryId && (r.correctCount > 0 || r.incorrectCount > 0));
  const categoriesAttempted = countryRecords.length;

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
  const countriesMastered = scores.filter((m) => m.score >= 85).length;
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
