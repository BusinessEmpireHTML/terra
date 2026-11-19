import { jsonTable } from "./webStorage";
import type { UnlockedAchievement } from "../gamification/types";

// Web counterpart of achievementStore.ts (same API, localStorage-backed).
const table = jsonTable<UnlockedAchievement>("terra:web:achievements");

export const achievementStore = {
  async getUnlocked(): Promise<UnlockedAchievement[]> {
    return table.read();
  },

  async recordNewUnlocks(satisfiedIds: Set<string>): Promise<string[]> {
    const rows = table.read();
    const existing = new Set(rows.map((u) => u.achievementId));
    const newlyUnlocked = Array.from(satisfiedIds).filter((id) => !existing.has(id));
    const now = new Date().toISOString();
    table.write([...rows, ...newlyUnlocked.map((achievementId) => ({ achievementId, unlockedAt: now }))]);
    return newlyUnlocked;
  },
};
