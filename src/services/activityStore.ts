import { openDatabaseAsync, type SQLiteDatabase } from "expo-sqlite";
import { COUNTRIES } from "../data/countries";
import { computeAllMastery } from "../quiz/mastery";
import { progressStore } from "./progressStore";
import type { ActivityEvent, ContinentBreakdown, DayCount, StatsSnapshot } from "../gamification/types";
import type { Continent } from "../types/country";

let dbPromise: Promise<SQLiteDatabase> | null = null;

function getDb(): Promise<SQLiteDatabase> {
  if (!dbPromise) {
    dbPromise = openDatabaseAsync("terra-activity.db").then(async (db) => {
      await db.execAsync(`
        CREATE TABLE IF NOT EXISTS activity (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          date TEXT NOT NULL,
          timestamp TEXT NOT NULL,
          countryId TEXT NOT NULL,
          category TEXT NOT NULL,
          correct INTEGER NOT NULL,
          xpEarned INTEGER NOT NULL
        );
        CREATE INDEX IF NOT EXISTS idx_activity_date ON activity (date);
      `);
      return db;
    });
  }
  return dbPromise;
}

export function localDateString(d = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function daysBetween(a: string, b: string): number {
  const da = new Date(`${a}T00:00:00`);
  const db_ = new Date(`${b}T00:00:00`);
  return Math.round((db_.getTime() - da.getTime()) / (24 * 60 * 60 * 1000));
}

function addDays(date: string, delta: number): string {
  const d = new Date(`${date}T00:00:00`);
  d.setDate(d.getDate() + delta);
  return localDateString(d);
}

export const activityStore = {
  async log(event: Omit<ActivityEvent, "id">): Promise<void> {
    const db = await getDb();
    await db.runAsync(
      "INSERT INTO activity (date, timestamp, countryId, category, correct, xpEarned) VALUES (?, ?, ?, ?, ?, ?)",
      [event.date, event.timestamp, event.countryId, event.category, event.correct ? 1 : 0, event.xpEarned]
    );
  },

  async getAll(): Promise<ActivityEvent[]> {
    const db = await getDb();
    const rows = await db.getAllAsync<any>("SELECT * FROM activity ORDER BY timestamp ASC");
    return rows.map((r) => ({ ...r, correct: Boolean(r.correct) }));
  },

  /** How many events already exist for this exact country+category — used to award a small "first time" XP bonus for breadth. */
  async countFor(countryId: string, category: string): Promise<number> {
    const db = await getDb();
    const row = await db.getFirstAsync<{ n: number }>(
      "SELECT COUNT(*) as n FROM activity WHERE countryId = ? AND category = ?",
      [countryId, category]
    );
    return row?.n ?? 0;
  },
};

const HEATMAP_DAYS = 84; // 12 weeks — enough for a real calendar view without being excessive

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
  const activeDates = Array.from(byDate.keys()).sort(); // ascending
  let currentStreak = 0;
  let longestStreak = 0;
  if (activeDates.length > 0) {
    const mostRecent = activeDates[activeDates.length - 1];
    const gapFromToday = daysBetween(mostRecent, today);
    if (gapFromToday <= 1) {
      // Streak is still "alive" (today or yesterday has activity). Count backward.
      let cursor = mostRecent;
      currentStreak = 1;
      for (let i = activeDates.length - 2; i >= 0; i--) {
        if (daysBetween(activeDates[i], cursor) === 1) {
          currentStreak++;
          cursor = activeDates[i];
        } else break;
      }
    }

    let run = 1;
    longestStreak = 1;
    for (let i = 1; i < activeDates.length; i++) {
      if (daysBetween(activeDates[i - 1], activeDates[i]) === 1) {
        run++;
      } else {
        run = 1;
      }
      longestStreak = Math.max(longestStreak, run);
    }
  }

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
  const continents: ContinentBreakdown[] = Array.from(regionGroups.entries())
    .filter(([region]) => region !== "Antarctic")
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
