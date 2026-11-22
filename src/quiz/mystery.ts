import { COUNTRIES } from "../data/countries";
import { countryOfTheDay, dailyNumber } from "./daily";
import { hintBetween } from "./locateHints";
import { mysteryPoints } from "../gamification/gameScoring";
import { hashString, seededRng, shuffle, type Rng } from "../utils/random";
import { formatCompactNumber } from "../utils/geo";
import { areaComparison, populationRank } from "../utils/countryStats";
import { subregionName, translate, type Lang, type TranslationKey } from "../i18n/core";
import type { Country } from "../types/country";

/**
 * Mystery Country: clues arrive one at a time, from vague to specific, and
 * you guess whenever you're ready. Fewer clues, more points. Every wrong
 * guess reveals the next clue and says how far (and which way) the mystery
 * country is from the one you guessed.
 */

export type ClueKind = "continent" | "population" | "area" | "borders" | "subregion" | "currency" | "capital" | "flag";
export const CLUE_ORDER: readonly ClueKind[] = ["continent", "population", "area", "borders", "subregion", "currency", "capital", "flag"];
export const CLUE_COUNT = CLUE_ORDER.length;

export interface Clue {
  kind: ClueKind;
  label: string;
  /** Text to show; for the flag clue, the country's cca2 code. */
  value: string;
}

const byId = new Map(COUNTRIES.map((c) => [c.id, c]));

/** Countries with every fact a full set of clues needs. */
export const MYSTERY_POOL: readonly Country[] = COUNTRIES.filter(
  (c) => c.population && c.areaKm2 && c.capital?.[0] && c.currencies?.length && c.subregion
);

const LABEL: Record<ClueKind, TranslationKey> = {
  continent: "mystery.clueContinent",
  population: "mystery.cluePopulation",
  area: "mystery.clueArea",
  borders: "mystery.clueBorders",
  subregion: "mystery.clueSubregion",
  currency: "mystery.clueCurrency",
  capital: "mystery.clueCapital",
  flag: "mystery.clueFlag",
};

function clueValue(kind: ClueKind, c: Country, lang: Lang): string {
  const tr = (key: TranslationKey, params?: Record<string, string | number>) => translate(lang, key, params);
  switch (kind) {
    case "continent":
      return tr(`continent.${c.region}` as TranslationKey);
    case "population": {
      const rank = populationRank(c.id);
      const people = formatCompactNumber(c.population, lang);
      return rank ? `${people} · ${tr("detail.populationRank", { rank, total: COUNTRIES.length })}` : people;
    }
    case "area": {
      const area = tr("detail.areaValue", { value: c.areaKm2 ?? 0 });
      const comparison = areaComparison(c.id, lang);
      return comparison ? `${area} · ${comparison}` : area;
    }
    case "borders": {
      const count = (c.borders ?? []).filter((b) => byId.has(b)).length;
      if (count === 0) return tr("mystery.island");
      const key: TranslationKey = c.landlocked
        ? count === 1
          ? "mystery.landlockedOne"
          : "mystery.landlocked"
        : count === 1
          ? "mystery.bordersOne"
          : "mystery.borders";
      return tr(key, { count });
    }
    case "subregion":
      // Where the region's name would name the answer, describe it instead.
      if (c.subregion === "Australia and New Zealand") return tr("mystery.australasia");
      if (c.name.common.includes(c.subregion ?? "\u0000")) return tr("mystery.westernPacific");
      return subregionName(c.subregion ?? "", lang);
    case "currency":
      return Array.from(new Set((c.currencies ?? []).map((cur) => anonymousCurrency(cur.name)))).join(", ");
    case "capital": {
      const capital = c.capital?.[0] ?? "";
      return tr("mystery.capitalHint", { letter: capital.charAt(0).toUpperCase(), letters: capital.replace(/[^\p{L}]/gu, "").length });
    }
    case "flag":
      return c.cca2;
  }
}

const CONNECTORS = new Set(["and", "of", "the"]);

/**
 * A currency name without the words that would give the country away:
 * "Albanian lek" → "lek", "United States dollar" → "dollar",
 * "Central African CFA franc" → "CFA franc". Leading place names and
 * demonyms are capitalized words, so those (and connectors between them) go.
 */
export function anonymousCurrency(name: string): string {
  const words = name.split(/\s+/);
  let i = 0;
  while (i < words.length - 1) {
    const w = words[i];
    const titleCase = /^\p{Lu}\p{Ll}/u.test(w);
    if (!titleCase && !CONNECTORS.has(w)) break;
    i++;
  }
  return words.slice(i).join(" ");
}

/** All clues for a country, in reveal order, in the given language. */
export function mysteryClues(countryId: string, lang: Lang): Clue[] {
  const c = byId.get(countryId);
  if (!c) return [];
  return CLUE_ORDER.map((kind) => ({ kind, label: translate(lang, LABEL[kind]), value: clueValue(kind, c, lang) }));
}

// ---- Which country ----------------------------------------------------------

/** A fixed shuffle of the pool, walked one step per day, so the daily mystery doesn't repeat for months. */
const DAILY_ORDER = shuffle(
  MYSTERY_POOL.map((c) => c.id),
  seededRng(hashString("terra-mystery-v1"))
);

/** Today's mystery: the same for everyone, never the (already revealed) Country of the Day. */
export function dailyMysteryId(date: string): string {
  const n = dailyNumber(date) - 1;
  const at = (k: number) => DAILY_ORDER[((k % DAILY_ORDER.length) + DAILY_ORDER.length) % DAILY_ORDER.length];
  const pick = at(n);
  return pick === countryOfTheDay(date) ? at(n + 1) : pick;
}

export function randomMysteryId(rng: Rng = Math.random, avoid: ReadonlySet<string> = new Set()): string {
  const options = MYSTERY_POOL.filter((c) => !avoid.has(c.id));
  const list = options.length ? options : MYSTERY_POOL;
  return list[Math.floor(rng() * list.length)].id;
}

// ---- Playing (pure state, so the rules are testable) -------------------------

/** What happened at each step, for the spoiler-free share line. */
export type TrailStep = "wrong" | "clue" | "solved" | "failed";

export interface MysteryState {
  countryId: string;
  cluesShown: number;
  /** Wrong guesses, in order. */
  wrong: string[];
  trail: TrailStep[];
  status: "playing" | "solved" | "failed";
  points: number;
}

export function startMystery(countryId: string): MysteryState {
  return { countryId, cluesShown: 1, wrong: [], trail: [], status: "playing", points: 0 };
}

/** Guess a country. Repeating a wrong guess costs nothing. A wrong guess after the last clue ends the round. */
export function guessMystery(state: MysteryState, guessId: string): MysteryState {
  if (state.status !== "playing" || state.wrong.includes(guessId)) return state;
  if (guessId === state.countryId) {
    return { ...state, status: "solved", points: mysteryPoints(state.cluesShown), trail: [...state.trail, "solved"] };
  }
  const wrong = [...state.wrong, guessId];
  if (state.cluesShown >= CLUE_COUNT) return { ...state, wrong, status: "failed", points: 0, trail: [...state.trail, "wrong", "failed"] };
  return { ...state, wrong, cluesShown: state.cluesShown + 1, trail: [...state.trail, "wrong"] };
}

/** Ask for the next clue (costs a point, like a wrong guess, but without the distance hint). */
export function revealClue(state: MysteryState): MysteryState {
  if (state.status !== "playing" || state.cluesShown >= CLUE_COUNT) return state;
  return { ...state, cluesShown: state.cluesShown + 1, trail: [...state.trail, "clue"] };
}

export function giveUpMystery(state: MysteryState): MysteryState {
  return state.status === "playing" ? { ...state, status: "failed", points: 0, trail: [...state.trail, "failed"] } : state;
}

/** How far the mystery country is from a wrong guess, and which way. */
export function mysteryHint(guessId: string, answerId: string): { km: number; bearing: number } {
  return hintBetween(guessId, answerId);
}

const TRAIL_EMOJI: Record<TrailStep, string> = { wrong: "🟥", clue: "⬜", solved: "🟩", failed: "⬛" };

/** "Terra Mystery #325 🕵️ / Solved with 3 clues / 🟥⬜🟩" — no spoilers. */
export function mysteryShareText(date: string, state: MysteryState, lang: Lang): string {
  return [
    translate(lang, "mystery.shareTitle", { number: dailyNumber(date) }),
    state.status === "solved"
      ? translate(lang, state.cluesShown === 1 ? "mystery.shareSolvedOne" : "mystery.shareSolved", { clues: state.cluesShown })
      : translate(lang, "mystery.shareFailed"),
    state.trail.map((s) => TRAIL_EMOJI[s]).join(""),
  ]
    .filter(Boolean)
    .join("\n");
}

export function isMysteryState(value: unknown): value is MysteryState {
  const v = value as MysteryState;
  return (
    typeof v?.countryId === "string" &&
    typeof v.cluesShown === "number" &&
    Array.isArray(v.wrong) &&
    Array.isArray(v.trail) &&
    (v.status === "playing" || v.status === "solved" || v.status === "failed") &&
    typeof v.points === "number"
  );
}
