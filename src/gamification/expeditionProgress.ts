import { computeAllMastery } from "../quiz/mastery";
import type { CountryMastery, ProgressRecord } from "../quiz/types";
import type { Expedition, ExpeditionProgress } from "./types";

/** A country counts as "done" for expedition purposes at Geographer tier (70+) — real practice, not just a glance. */
export const EXPEDITION_COMPLETION_THRESHOLD = 70;

export function computeExpeditionProgress(expedition: Expedition, masteryByCountry: Map<string, CountryMastery>): ExpeditionProgress {
  const completedCountryIds = expedition.countryIds.filter(
    (id) => (masteryByCountry.get(id)?.score ?? 0) >= EXPEDITION_COMPLETION_THRESHOLD
  );
  const percentComplete = Math.round((completedCountryIds.length / expedition.countryIds.length) * 100);
  return {
    expeditionId: expedition.id,
    completedCountryIds,
    totalCountries: expedition.countryIds.length,
    percentComplete,
    isComplete: completedCountryIds.length === expedition.countryIds.length,
  };
}

export function computeAllExpeditionProgress(expeditions: Expedition[], records: ProgressRecord[]): Map<string, ExpeditionProgress> {
  const masteryByCountry = computeAllMastery(records);
  const map = new Map<string, ExpeditionProgress>();
  for (const exp of expeditions) {
    map.set(exp.id, computeExpeditionProgress(exp, masteryByCountry));
  }
  return map;
}
