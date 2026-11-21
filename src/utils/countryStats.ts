import { COUNTRIES } from "../data/countries";
import { countryName, currentLanguage, translate, type Lang } from "../i18n/core";

/**
 * Plain-language context for raw numbers on country pages: "1.2M km²"
 * means little to most people, "about the size of Egypt" means a lot.
 */

const byId = new Map(COUNTRIES.map((c) => [c.id, c]));

/** Countries whose size most people have a feel for, from tiny to huge. */
const AREA_REFERENCES = [
  "SGP", "LUX", "CYP", "JAM", "BEL", "NLD", "CHE", "DNK", "PRT", "KOR", "ISL", "GRC", "GBR", "NZL",
  "ITA", "DEU", "JPN", "SWE", "ESP", "FRA", "EGY", "MEX", "IND", "ARG", "AUS", "BRA", "USA", "CAN", "CHN",
];

/** "United States" -> "the United States", so English sentences read naturally. */
function withArticle(name: string, lang: Lang): string {
  return lang === "en" && /^(United |Netherlands|Philippines|Bahamas|Gambia|Maldives)/.test(name) ? `the ${name}` : name;
}

function densityOf(id: string): number | null {
  const c = byId.get(id);
  return c?.population && c.areaKm2 ? c.population / c.areaKm2 : null;
}

/** "About the size of Belgium", "About 1.7× the size of Canada", "About half the size of Portugal". */
export function areaComparison(id: string, lang: Lang = currentLanguage()): string | null {
  const area = byId.get(id)?.areaKm2;
  if (!area) return null;
  if (area < 100) return translate(lang, "stats.tinyArea");

  let best: { name: string; ratio: number } | null = null;
  for (const refId of AREA_REFERENCES) {
    const ref = byId.get(refId);
    if (refId === id || !ref?.areaKm2) continue;
    const ratio = area / ref.areaKm2;
    if (!best || Math.abs(Math.log(ratio)) < Math.abs(Math.log(best.ratio))) best = { name: withArticle(countryName(ref, lang), lang), ratio };
  }
  if (!best) return null;
  const { name, ratio } = best;
  if (ratio >= 0.87 && ratio <= 1.15) return translate(lang, "stats.sizeSame", { name });
  if (ratio > 1.15) return translate(lang, "stats.sizeTimes", { name, ratio: ratio < 10 ? Number(ratio.toFixed(1)) : Math.round(ratio) });
  const fraction =
    ratio >= 0.7 ? "threeQuarters" : ratio >= 0.58 ? "twoThirds" : ratio >= 0.42 ? "half" : ratio >= 0.29 ? "third" : ratio >= 0.2 ? "quarter" : null;
  if (fraction) return translate(lang, "stats.sizeFraction", { name, fraction: translate(lang, `stats.fraction.${fraction}`) });
  return translate(lang, "stats.sizePercent", { name, percent: Math.max(1, Math.round(ratio * 100)) });
}

/** "More crowded than 92% of countries" / "Less crowded than 80% of countries". */
export function densityComparison(id: string, lang: Lang = currentLanguage()): string | null {
  const d = densityOf(id);
  if (d == null) return null;
  const all = COUNTRIES.map((c) => densityOf(c.id)).filter((x): x is number => x != null);
  const lessDense = all.filter((x) => x < d).length;
  const moreDense = all.filter((x) => x > d).length;
  const others = all.length - 1;
  if (moreDense === 0) return translate(lang, "stats.mostCrowded");
  if (lessDense === 0) return translate(lang, "stats.leastCrowded");
  if (lessDense >= moreDense) return translate(lang, "stats.moreCrowded", { percent: Math.round((lessDense / others) * 100) });
  return translate(lang, "stats.lessCrowded", { percent: Math.round((moreDense / others) * 100) });
}

/** 1-based rank by population among all countries (1 = most populous). */
export function populationRank(id: string): number | null {
  const pop = byId.get(id)?.population;
  if (!pop) return null;
  return COUNTRIES.filter((c) => (c.population ?? 0) > pop).length + 1;
}
