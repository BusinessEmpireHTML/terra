import { openDatabaseAsync, type SQLiteDatabase } from "expo-sqlite";
import type { ProgressRecord, QuizCategory } from "../quiz/types";

let dbPromise: Promise<SQLiteDatabase> | null = null;

function getDb(): Promise<SQLiteDatabase> {
  if (!dbPromise) {
    dbPromise = openDatabaseAsync("terra-progress.db").then(async (db) => {
      await db.execAsync(`
        CREATE TABLE IF NOT EXISTS progress (
          countryId TEXT NOT NULL,
          category TEXT NOT NULL,
          box INTEGER NOT NULL,
          correctCount INTEGER NOT NULL,
          incorrectCount INTEGER NOT NULL,
          dueAt TEXT NOT NULL,
          lastReviewedAt TEXT,
          PRIMARY KEY (countryId, category)
        );
        CREATE INDEX IF NOT EXISTS idx_progress_due ON progress (dueAt);
      `);
      return db;
    });
  }
  return dbPromise;
}

export const progressStore = {
  async getAll(): Promise<ProgressRecord[]> {
    const db = await getDb();
    return db.getAllAsync<ProgressRecord>("SELECT * FROM progress");
  },

  async get(countryId: string, category: QuizCategory): Promise<ProgressRecord | null> {
    const db = await getDb();
    return db.getFirstAsync<ProgressRecord>(
      "SELECT * FROM progress WHERE countryId = ? AND category = ?",
      [countryId, category]
    );
  },

  async upsert(record: ProgressRecord): Promise<void> {
    const db = await getDb();
    await db.runAsync(
      `INSERT INTO progress (countryId, category, box, correctCount, incorrectCount, dueAt, lastReviewedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?)
       ON CONFLICT(countryId, category) DO UPDATE SET
         box = excluded.box,
         correctCount = excluded.correctCount,
         incorrectCount = excluded.incorrectCount,
         dueAt = excluded.dueAt,
         lastReviewedAt = excluded.lastReviewedAt`,
      [record.countryId, record.category, record.box, record.correctCount, record.incorrectCount, record.dueAt, record.lastReviewedAt]
    );
  },

  /** Records due for review right now, oldest-due first — the backbone of the "smart" quiz queue. */
  async getDue(now = new Date(), limit = 100): Promise<ProgressRecord[]> {
    const db = await getDb();
    return db.getAllAsync<ProgressRecord>(
      "SELECT * FROM progress WHERE dueAt <= ? ORDER BY dueAt ASC LIMIT ?",
      [now.toISOString(), limit]
    );
  },

  async resetAll(): Promise<void> {
    const db = await getDb();
    await db.execAsync("DELETE FROM progress");
  },
};
