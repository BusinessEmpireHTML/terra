import { COUNTRIES } from "../data/countries";
import { computeAllMastery } from "../quiz/mastery";
import { progressStore } from "./progressStore";
import { activityLog } from "./activityLog";
import type { ContinentBreakdown, DayCount, StatsSnapshot } from "../gamification/types";
import type { Continent } from "../types/country";
import { addDays, computeStreaks, localDateString } from "../gamification/streaks";

/** The raw answer log (platform-specific storage); stats below are derived from it. */
export const activityStore = activityLog;

// Re-exported for existing callers; the implementation lives with the other
// pure date helpers so it can be unit-tested without SQLite.
export { localDateString };

/** Fixed display order, so the continent chart doesn't reshuffle with data order. */
const CONTINENT_ORDER: Continent[] = ["Africa", "Americas", "Asia", "Europe", "Oceania"];

export const HEATMAP_DAYS = 84; // 12 weeks — enough for a real calendar view without being excessive

export async function computeStats(): Promise<StatsSnapshot> {
  const [events, progressRecords] = await Promise.all([activityStore.getAll(), progressStore.getAll()]);
  const today = localDateString();

  // --- Daily counts (for heatmap + streaks) ---
  const byDate = new Map<string, { count: number; correct: number }>();
  for (const e of events) {
    const entry = byDate.get(e.date) ?? { count: 0, correct: 0 };
    entry.count += 1;
    if (e.correct) entry.correct += 1;
    byDate.set(e.date, entry);
  }

  const heatmap: DayCount[] = [];
  for (let i = HEATMAP_DAYS - 1; i >= 0; i--) {
    const date = addDays(today, -i);
    const entry = byDate.get(date);
    heatmap.push({ date, count: entry?.count ?? 0, correct: entry?.correct ?? 0 });
  }

  // --- Streaks ---
  const { current: currentStreak, longest: longestStreak } = computeStreaks(byDate.keys(), today);

  // --- Totals ---
  const totalXp = events.reduce((s, e) => s + e.xpEarned, 0);
  const totalAnswered = events.length;
  const totalCorrect = events.filter((e) => e.correct).length;
  const accuracy = totalAnswered === 0 ? 0 : Math.round((totalCorrect / totalAnswered) * 100);
  const questionsToday = byDate.get(today)?.count ?? 0;

  // --- Continent breakdown, from mastery scores ---
  const masteryByCountry = computeAllMastery(progressRecords);
  const regionGroups = new Map<Continent, { total: number; started: number; sumScore: number }>();
  for (const country of COUNTRIES) {
    const group = regionGroups.get(country.region) ?? { total: 0, started: 0, sumScore: 0 };
    group.total += 1;
    const mastery = masteryByCountry.get(country.id);
    if (mastery && mastery.categoriesAttempted > 0) {
      group.started += 1;
      group.sumScore += mastery.score;
    }
    regionGroups.set(country.region, group);
  }
  const continents: ContinentBreakdown[] = CONTINENT_ORDER.filter((region) => regionGroups.has(region))
    .map((region) => [region, regionGroups.get(region)!] as const)
    .map(([region, g]) => ({
      region,
      avgScore: g.started === 0 ? 0 : Math.round(g.sumScore / g.started),
      countriesStarted: g.started,
      countriesTotal: g.total,
    }));

  const withData = continents.filter((c) => c.countriesStarted > 0);
  const weakest = withData.length > 0 ? withData.reduce((a, b) => (b.avgScore < a.avgScore ? b : a)) : null;
  const strongest = withData.length > 0 ? withData.reduce((a, b) => (b.avgScore > a.avgScore ? b : a)) : null;

  return {
    totalXp,
    currentStreak,
    longestStreak,
    totalAnswered,
    totalCorrect,
    accuracy,
    questionsToday,
    continents,
    weakest,
    strongest,
    heatmap,
  };
}
