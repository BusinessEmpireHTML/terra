import { normalizeName } from "./text";
import type { Country } from "../types/country";

/**
 * Ranks countries for a free-text query, ignoring case and accents (so
 * "cote" finds Côte d'Ivoire and "bogota" finds Colombia via its capital).
 * Name prefix > word prefix in the name > anywhere in the name > official
 * name > capital; alphabetical within each tier.
 */
export function searchCountries(countries: Country[], query: string): Country[] {
  const q = normalizeName(query);
  if (!q) return countries;

  const scored: { country: Country; score: number }[] = [];
  for (const c of countries) {
    const name = normalizeName(c.name.common);
    const official = normalizeName(c.name.official);
    const capitals = (c.capital ?? []).map(normalizeName);

    let score = 0;
    if (name.startsWith(q)) score = 5;
    else if (name.split(/[\s-]+/).some((w) => w.startsWith(q))) score = 4;
    else if (name.includes(q)) score = 3;
    else if (official.includes(q)) score = 2;
    else if (capitals.some((cap) => cap.includes(q))) score = 1;
    if (score > 0) scored.push({ country: c, score });
  }
  scored.sort((a, b) => b.score - a.score || a.country.name.common.localeCompare(b.country.name.common));
  return scored.map((s) => s.country);
}
