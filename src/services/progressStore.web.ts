import { jsonTable } from "./webStorage";
import type { ProgressRecord, QuizCategory } from "../quiz/types";

// Web counterpart of progressStore.ts (same API, localStorage-backed).
const table = jsonTable<ProgressRecord>("terra:web:progress");
const same = (r: ProgressRecord, countryId: string, category: string) => r.countryId === countryId && r.category === category;

export const progressStore = {
  async getAll(): Promise<ProgressRecord[]> {
    return table.read();
  },

  async get(countryId: string, category: QuizCategory): Promise<ProgressRecord | null> {
    return table.read().find((r) => same(r, countryId, category)) ?? null;
  },

  async upsert(record: ProgressRecord): Promise<void> {
    const rows = table.read().filter((r) => !same(r, record.countryId, record.category));
    rows.push(record);
    table.write(rows);
  },

  async resetAll(): Promise<void> {
    table.write([]);
  },
};
