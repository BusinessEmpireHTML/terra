import { COUNTRIES } from "../data/countries";

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

/** "United States" -> "the United States", so sentences read naturally. */
function withArticle(name: string): string {
  return /^(United |Netherlands|Philippines|Bahamas|Gambia|Maldives)/.test(name) ? `the ${name}` : name;
}

function densityOf(id: string): number | null {
  const c = byId.get(id);
  return c?.population && c.areaKm2 ? c.population / c.areaKm2 : null;
}

/** "About the size of Belgium", "About 1.7× the size of Canada", "About half the size of Portugal". */
export function areaComparison(id: string): string | null {
  const area = byId.get(id)?.areaKm2;
  if (!area) return null;
  if (area < 100) return "Smaller than many cities";

  let best: { name: string; ratio: number } | null = null;
  for (const refId of AREA_REFERENCES) {
    const ref = byId.get(refId);
    if (refId === id || !ref?.areaKm2) continue;
    const ratio = area / ref.areaKm2;
    if (!best || Math.abs(Math.log(ratio)) < Math.abs(Math.log(best.ratio))) best = { name: withArticle(ref.name.common), ratio };
  }
  if (!best) return null;
  const { name, ratio } = best;
  if (ratio >= 0.87 && ratio <= 1.15) return `About the size of ${name}`;
  if (ratio > 1.15) return `About ${ratio < 10 ? Number(ratio.toFixed(1)) : Math.round(ratio)}× the size of ${name}`;
  const fraction =
    ratio >= 0.7 ? "three-quarters" : ratio >= 0.58 ? "two-thirds" : ratio >= 0.42 ? "half" : ratio >= 0.29 ? "a third" : ratio >= 0.2 ? "a quarter" : null;
  if (fraction) return `About ${fraction} the size of ${name}`;
  return `About ${Math.max(1, Math.round(ratio * 100))}% of the size of ${name}`;
}

/** "More crowded than 92% of countries" / "Less crowded than 80% of countries". */
export function densityComparison(id: string): string | null {
  const d = densityOf(id);
  if (d == null) return null;
  const all = COUNTRIES.map((c) => densityOf(c.id)).filter((x): x is number => x != null);
  const lessDense = all.filter((x) => x < d).length;
  const moreDense = all.filter((x) => x > d).length;
  const others = all.length - 1;
  if (moreDense === 0) return "The most crowded country on Earth";
  if (lessDense === 0) return "The least crowded country on Earth";
  if (lessDense >= moreDense) return `More crowded than ${Math.round((lessDense / others) * 100)}% of countries`;
  return `Less crowded than ${Math.round((moreDense / others) * 100)}% of countries`;
}

/** 1-based rank by population among all countries (1 = most populous). */
export function populationRank(id: string): number | null {
  const pop = byId.get(id)?.population;
  if (!pop) return null;
  return COUNTRIES.filter((c) => (c.population ?? 0) > pop).length + 1;
}
