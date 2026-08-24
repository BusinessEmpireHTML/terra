import { openDatabaseAsync, type SQLiteDatabase } from "expo-sqlite";
import type { UnlockedAchievement } from "../gamification/types";

let dbPromise: Promise<SQLiteDatabase> | null = null;

function getDb(): Promise<SQLiteDatabase> {
  if (!dbPromise) {
    dbPromise = openDatabaseAsync("terra-achievements.db").then(async (db) => {
      await db.execAsync(`
        CREATE TABLE IF NOT EXISTS unlocked (
          achievementId TEXT PRIMARY KEY NOT NULL,
          unlockedAt TEXT NOT NULL
        );
      `);
      return db;
    });
  }
  return dbPromise;
}

export const achievementStore = {
  async getUnlocked(): Promise<UnlockedAchievement[]> {
    const db = await getDb();
    return db.getAllAsync<UnlockedAchievement>("SELECT * FROM unlocked ORDER BY unlockedAt ASC");
  },

  /** Records any ids not already present, timestamped now. Returns the ones that were actually new. */
  async recordNewUnlocks(satisfiedIds: Set<string>): Promise<string[]> {
    const db = await getDb();
    const existing = await this.getUnlocked();
    const existingIds = new Set(existing.map((u) => u.achievementId));
    const newlyUnlocked = Array.from(satisfiedIds).filter((id) => !existingIds.has(id));

    const now = new Date().toISOString();
    for (const id of newlyUnlocked) {
      await db.runAsync("INSERT OR IGNORE INTO unlocked (achievementId, unlockedAt) VALUES (?, ?)", [id, now]);
    }
    return newlyUnlocked;
  },
};
