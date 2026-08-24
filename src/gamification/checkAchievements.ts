import { computeAllMastery } from "../quiz/mastery";
import { progressStore } from "../services/progressStore";
import { computeStats } from "../services/activityStore";
import { achievementStore } from "../services/achievementStore";
import { evaluateAchievements, ACHIEVEMENTS_BY_ID } from "./achievements";
import { storage } from "../services/storage";
import type { Achievement } from "./types";

/**
 * Recomputes everything achievements depend on, diffs against what's
 * already unlocked, and persists any new ones. Called after a quiz session
 * completes — cumulative and idempotent by design, so it's safe to call
 * this liberally rather than trying to track eligibility incrementally.
 */
export async function checkForNewAchievements(): Promise<Achievement[]> {
  const [progressRecords, stats, favorites] = await Promise.all([
    progressStore.getAll(),
    computeStats(),
    storage.loadFavorites(),
  ]);
  const masteryByCountry = computeAllMastery(progressRecords);

  const satisfied = evaluateAchievements({
    stats,
    progressRecords,
    masteryByCountry,
    favoritesCount: favorites.length,
  });

  const newlyUnlockedIds = await achievementStore.recordNewUnlocks(satisfied);
  return newlyUnlockedIds.map((id) => ACHIEVEMENTS_BY_ID.get(id)).filter((a): a is Achievement => Boolean(a));
}
