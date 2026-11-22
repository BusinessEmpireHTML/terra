import { kv } from "../services/kv";
import { progressStore } from "../services/progressStore";
import { EXPEDITIONS, EXPEDITIONS_BY_ID } from "./expeditions";
import { computeAllExpeditionProgress } from "./expeditionProgress";
import type { Expedition } from "./types";

/**
 * Passport stamps: one per completed expedition, kept for good once earned
 * (mastery can fade between reviews; a stamp shouldn't).
 */
export interface Stamp {
  expeditionId: string;
  /** ISO date the expedition was first completed. */
  earnedAt: string;
}

const KEY = "terra:passport";

export function parseStamps(raw: string | null): Stamp[] {
  if (!raw) return [];
  try {
    const value: unknown = JSON.parse(raw);
    if (!Array.isArray(value)) return [];
    return value.filter(
      (s): s is Stamp => typeof s?.expeditionId === "string" && typeof s?.earnedAt === "string" && EXPEDITIONS_BY_ID.has(s.expeditionId)
    );
  } catch {
    return [];
  }
}

export async function loadStamps(): Promise<Stamp[]> {
  return parseStamps(await kv.getItemAsync(KEY));
}

/** Stamps any newly completed expeditions and returns them (empty if none). Safe to call often. */
export async function checkForNewStamps(): Promise<Expedition[]> {
  const [stamps, records] = await Promise.all([loadStamps(), progressStore.getAll()]);
  const have = new Set(stamps.map((s) => s.expeditionId));
  const progress = computeAllExpeditionProgress(EXPEDITIONS, records);
  const fresh = EXPEDITIONS.filter((e) => !have.has(e.id) && progress.get(e.id)?.isComplete);
  if (fresh.length === 0) return [];
  const now = new Date().toISOString();
  await kv.setItemAsync(KEY, JSON.stringify([...stamps, ...fresh.map((e) => ({ expeditionId: e.id, earnedAt: now }))]));
  return fresh;
}
