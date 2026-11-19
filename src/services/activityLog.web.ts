import { jsonTable } from "./webStorage";
import type { ActivityEvent } from "../gamification/types";

// Web counterpart of activityLog.ts (same API, localStorage-backed). Events
// are ~120 bytes each, so the usual ~5 MB quota holds tens of thousands of answers.
const table = jsonTable<ActivityEvent>("terra:web:activity");

export const activityLog = {
  async log(event: Omit<ActivityEvent, "id">): Promise<void> {
    const rows = table.read();
    rows.push({ ...event, id: (rows[rows.length - 1]?.id ?? 0) + 1 });
    table.write(rows);
  },

  async getAll(): Promise<ActivityEvent[]> {
    return table.read();
  },

  async countFor(countryId: string, category: string): Promise<number> {
    return table.read().filter((e) => e.countryId === countryId && e.category === category).length;
  },
};
