import { openDatabaseAsync, type SQLiteDatabase } from "expo-sqlite";
import type { ProgressRecord, QuizCategory } from "../quiz/types";

// Native SRS progress (SQLite, one row per country+category). The web build
// uses progressStore.web.ts.

let dbPromise: Promise<SQLiteDatabase> | null = null;

/** Bumped when the table changes; see migrate(). */
const SCHEMA_VERSION = 2;

async function migrate(db: SQLiteDatabase): Promise<void> {
  const row = await db.getFirstAsync<{ user_version: number }>("PRAGMA user_version");
  if ((row?.user_version ?? 0) >= SCHEMA_VERSION) return;
  // v2: FSRS memory state. Existing rows keep NULLs and are seeded from their
  // Leitner box the next time they're answered (see srs.ts).
  const columns = await db.getAllAsync<{ name: string }>("PRAGMA table_info(progress)");
  const names = new Set(columns.map((c) => c.name));
  if (!names.has("stability")) await db.execAsync("ALTER TABLE progress ADD COLUMN stability REAL");
  if (!names.has("difficulty")) await db.execAsync("ALTER TABLE progress ADD COLUMN difficulty REAL");
  await db.execAsync(`PRAGMA user_version = ${SCHEMA_VERSION}`);
}

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
      await migrate(db);
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
      `INSERT INTO progress (countryId, category, box, correctCount, incorrectCount, dueAt, lastReviewedAt, stability, difficulty)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON CONFLICT(countryId, category) DO UPDATE SET
         box = excluded.box,
         correctCount = excluded.correctCount,
         incorrectCount = excluded.incorrectCount,
         dueAt = excluded.dueAt,
         lastReviewedAt = excluded.lastReviewedAt,
         stability = excluded.stability,
         difficulty = excluded.difficulty`,
      [
        record.countryId,
        record.category,
        record.box,
        record.correctCount,
        record.incorrectCount,
        record.dueAt,
        record.lastReviewedAt,
        record.stability ?? null,
        record.difficulty ?? null,
      ]
    );
  },

  async resetAll(): Promise<void> {
    const db = await getDb();
    await db.execAsync("DELETE FROM progress");
  },
};
