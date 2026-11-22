import type { Achievement, Expedition } from "../gamification/types";
import type { Lang } from "./core";
import { catalogDe, catalogEs, catalogFr, catalogPt } from "./catalogTranslations";

/**
 * Names and descriptions of achievements and expeditions. English lives with
 * the definitions (gamification/achievements.ts, expeditions.ts); other
 * languages are here, keyed by id, with a test that every id is covered.
 */
export interface CatalogTranslation {
  achievements: Record<string, { title: string; description: string }>;
  expeditions: Record<string, { title: string; description: string }>;
}

const CATALOGS: Partial<Record<Lang, CatalogTranslation>> = { es: catalogEs, fr: catalogFr, de: catalogDe, pt: catalogPt };

export function catalogFor(lang: Lang): CatalogTranslation | undefined {
  return CATALOGS[lang];
}

export function achievementTitle(a: Achievement, lang: Lang): string {
  return CATALOGS[lang]?.achievements[a.id]?.title ?? a.title;
}

export function achievementDescription(a: Achievement, lang: Lang): string {
  return CATALOGS[lang]?.achievements[a.id]?.description ?? a.description;
}

export function expeditionTitle(e: Expedition, lang: Lang): string {
  return CATALOGS[lang]?.expeditions[e.id]?.title ?? e.title;
}

export function expeditionDescription(e: Expedition, lang: Lang): string {
  return CATALOGS[lang]?.expeditions[e.id]?.description ?? e.description;
}
