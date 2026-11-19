import { openDatabaseAsync, type SQLiteDatabase } from "expo-sqlite";
import type { ActivityEvent } from "../gamification/types";

// Native activity log: one SQLite row per answered question. (The web build
// uses activityLog.web.ts instead — Metro picks it automatically.)

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
        CREATE INDEX IF NOT EXISTS idx_activity_pair ON activity (countryId, category);
      `);
      return db;
    });
  }
  return dbPromise;
}

export const activityLog = {
  async log(event: Omit<ActivityEvent, "id">): Promise<void> {
    const db = await getDb();
    await db.runAsync(
      "INSERT INTO activity (date, timestamp, countryId, category, correct, xpEarned) VALUES (?, ?, ?, ?, ?, ?)",
      [event.date, event.timestamp, event.countryId, event.category, event.correct ? 1 : 0, event.xpEarned]
    );
  },

  async getAll(): Promise<ActivityEvent[]> {
    const db = await getDb();
    const rows = await db.getAllAsync<Omit<ActivityEvent, "correct"> & { correct: number }>(
      "SELECT * FROM activity ORDER BY timestamp ASC"
    );
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
