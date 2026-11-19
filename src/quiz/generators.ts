import { COUNTRIES } from "../data/countries";
import { COUNTRY_CONTENT } from "../data/countryContent";
import { shuffle, pickRandom } from "../utils/random";
import { normalizeName } from "../utils/text";
import type { Continent, Country } from "../types/country";
import type { Question, QuestionChoice, QuizCategory } from "./types";

const byId = new Map(COUNTRIES.map((c) => [c.id, c]));

// ---- Ambiguity guards --------------------------------------------------------
// A multiple-choice question is only fair if exactly one choice is right. The
// helpers below keep distractors from being *also* correct (a shared dish, a
// landmark on a border, a currency the country also uses) or visually
// indistinguishable from the answer (near-identical flags at emoji size).

/** Flags that are near-identical at emoji size never appear as each other's distractors. */
const FLAG_LOOKALIKE_GROUPS: string[][] = [
  ["TCD", "ROU", "AND", "MDA"], // blue–yellow–red vertical tricolors
  ["IDN", "MCO", "POL"], // red/white horizontal bicolors
  ["AUS", "NZL"], // blue ensigns with the Southern Cross
  ["IRL", "CIV"], // mirrored green–white–orange tricolors
  ["SEN", "MLI", "GIN"], // pan-African vertical tricolors
  ["NLD", "LUX"], // red–white–blue horizontal tricolors
  ["COL", "ECU", "VEN"], // yellow–blue–red horizontal tricolors
  ["SVN", "SVK", "RUS"], // white–blue–red horizontal tricolors
  ["QAT", "BHR"], // serrated white band on red/maroon
  ["HTI", "LIE"], // blue over red with an emblem
];
const flagLookalikes = new Map<string, Set<string>>();
for (const group of FLAG_LOOKALIKE_GROUPS) {
  for (const id of group) flagLookalikes.set(id, new Set(group));
}

/**
 * Entries too generic to identify a single country ("Fish", "Rice", "Fresh
 * seafood"). They're still shown on country pages, just never used as a quiz
 * prompt.
 */
const GENERIC_DISHES = new Set(
  [
    "Fish",
    "Rice",
    "Coconut",
    "Breadfruit",
    "Taro",
    "Plantains",
    "Dates",
    "Camel milk",
    "Imported foods",
    "Fresh seafood",
    "Grilled fish",
    "Grilled bushmeat",
    "Cassava leaves",
    "Cassava and plantain",
    "Breadfruit and taro",
    "Fish and coconut-based dishes",
    "Fish and reef seafood",
    "Fresh Adriatic seafood",
    "Fresh cocoa and coffee",
    "Jollof-style rice dishes",
    "Jollof-style rice & grilled fish",
  ].map(normalizeName)
);

/** normalized item name -> ids of every country listing it, so shared items can't make a distractor correct. */
function indexByName(kind: "food" | "landmarks"): Map<string, Set<string>> {
  const index = new Map<string, Set<string>>();
  for (const [countryId, content] of Object.entries(COUNTRY_CONTENT)) {
    for (const item of content[kind] ?? []) {
      const key = normalizeName(item.name);
      const owners = index.get(key) ?? new Set<string>();
      owners.add(countryId);
      index.set(key, owners);
    }
  }
  return index;
}
const dishOwners = indexByName("food");
const landmarkOwners = indexByName("landmarks");

function quizzableDishes(countryId: string) {
  return (COUNTRY_CONTENT[countryId]?.food ?? []).filter((d) => !GENERIC_DISHES.has(normalizeName(d.name)));
}

function knownNeighbors(country: Country): Country[] {
  return (country.borders ?? []).map((id) => byId.get(id)).filter((c): c is Country => Boolean(c));
}

// ---- Eligibility -------------------------------------------------------------

/** Whether a given country has the data a category needs. The session builder and mastery scoring both rely on this. */
export function isEligible(category: QuizCategory, countryId: string): boolean {
  const c = byId.get(countryId);
  if (!c) return false;
  switch (category) {
    case "flag":
      return true;
    case "capital":
      return Boolean(c.capital?.[0]);
    case "shape":
      return c.hasBorderGeometry;
    case "currency":
      return Boolean(c.currencies?.[0]?.name);
    case "neighbor":
      return knownNeighbors(c).length > 0;
    case "landmark":
      return (COUNTRY_CONTENT[c.id]?.landmarks?.length ?? 0) > 0;
    case "food":
      return quizzableDishes(c.id).length > 0;
  }
}

const CATEGORY_KEYS: QuizCategory[] = ["flag", "capital", "shape", "currency", "neighbor", "landmark", "food"];

/** The eligible-country pools per category, exposed so the session builder can pick valid pairs without guessing and retrying. */
export const ELIGIBLE_POOLS = Object.fromEntries(
  CATEGORY_KEYS.map((category) => [category, COUNTRIES.filter((c) => isEligible(category, c.id))])
) as Record<QuizCategory, Country[]>;

// ---- Distractors -------------------------------------------------------------

/** How many of the three distractors come from the answer's own region — enough to make questions think-y, not so many that they become a regional trivia test. */
const SAME_REGION_DISTRACTORS = 2;

/**
 * Picks `count` distinct labels from `candidates`, skipping any label in
 * `exclude` (which should include the correct answer). Prefers a couple of
 * same-region candidates so "Which country is this flag?" isn't answered by
 * elimination ("it's obviously not Fiji").
 */
function pickDistractorLabels(
  candidates: Country[],
  toLabel: (c: Country) => string,
  exclude: Set<string>,
  region: Continent,
  count = 3
): string[] {
  const shuffled = shuffle(candidates);
  const near = shuffled.filter((c) => c.region === region);
  const far = shuffled.filter((c) => c.region !== region);
  const ordered = [...near.slice(0, SAME_REGION_DISTRACTORS), ...far, ...near.slice(SAME_REGION_DISTRACTORS)];

  const seen = new Set(exclude);
  const labels: string[] = [];
  for (const c of ordered) {
    if (labels.length >= count) break;
    const label = toLabel(c);
    if (seen.has(label)) continue;
    seen.add(label);
    labels.push(label);
  }
  return labels;
}

function choicesFrom(correctLabel: string, distractorLabels: string[]): QuestionChoice[] {
  const choices: QuestionChoice[] = [
    { label: correctLabel, correct: true },
    ...distractorLabels.map((label) => ({ label, correct: false })),
  ];
  return shuffle(choices);
}

function nonce(): string {
  return Math.random().toString(36).slice(2, 8);
}

const countryName = (c: Country) => c.name.common;

function listJoin(items: string[]): string {
  if (items.length <= 1) return items.join("");
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0, -1).join(", ")}, and ${items[items.length - 1]}`;
}

// ---- Generators --------------------------------------------------------------

function generateFlag(country: Country): Question {
  const lookalikes = flagLookalikes.get(country.id);
  const candidates = COUNTRIES.filter((c) => c.id !== country.id && !lookalikes?.has(c.id));
  const distractors = pickDistractorLabels(candidates, countryName, new Set([country.name.common]), country.region);
  return {
    id: `flag:${country.id}:${nonce()}`,
    category: "flag",
    countryId: country.id,
    promptLabel: "Which country does this flag belong to?",
    promptVisual: "flag",
    choices: choicesFrom(country.name.common, distractors),
    explanation: `That's the flag of ${country.name.common}.`,
  };
}

function generateCapital(country: Country): Question {
  const [capital, ...otherCapitals] = country.capital!;
  const candidates = ELIGIBLE_POOLS.capital.filter((c) => c.id !== country.id);
  const distractors = pickDistractorLabels(candidates, (c) => c.capital![0], new Set(country.capital), country.region);
  const explanation = otherCapitals.length
    ? `${capital} is the capital of ${country.name.common} (it also counts ${listJoin(otherCapitals)} as ${otherCapitals.length > 1 ? "capitals" : "a capital"}).`
    : `${capital} is the capital of ${country.name.common}.`;
  return {
    id: `capital:${country.id}:${nonce()}`,
    category: "capital",
    countryId: country.id,
    promptLabel: `What is the capital of ${country.name.common}?`,
    choices: choicesFrom(capital, distractors),
    explanation,
  };
}

function generateShape(country: Country): Question {
  const candidates = ELIGIBLE_POOLS.shape.filter((c) => c.id !== country.id);
  const distractors = pickDistractorLabels(candidates, countryName, new Set([country.name.common]), country.region);
  return {
    id: `shape:${country.id}:${nonce()}`,
    category: "shape",
    countryId: country.id,
    promptLabel: "Which country has this outline?",
    promptVisual: "shape",
    choices: choicesFrom(country.name.common, distractors),
    explanation: `That's the outline of ${country.name.common}.`,
  };
}

function generateCurrency(country: Country): Question {
  const [primary, ...others] = country.currencies!.map((c) => c.name);
  // Exclude *every* currency the country uses, so e.g. Panama's question
  // can't offer the US dollar as a "wrong" answer.
  const candidates = ELIGIBLE_POOLS.currency.filter((c) => c.id !== country.id);
  const distractors = pickDistractorLabels(candidates, (c) => c.currencies![0].name, new Set([primary, ...others]), country.region);
  const explanation = others.length
    ? `${country.name.common} uses the ${primary}, alongside the ${listJoin(others)}.`
    : `${country.name.common} uses the ${primary}.`;
  return {
    id: `currency:${country.id}:${nonce()}`,
    category: "currency",
    countryId: country.id,
    promptLabel: `What currency does ${country.name.common} use?`,
    choices: choicesFrom(primary, distractors),
    explanation,
  };
}

function generateNeighbor(country: Country): Question {
  const neighbors = knownNeighbors(country);
  const neighbor = pickRandom(neighbors, 1)[0];
  const neighborIds = new Set(neighbors.map((n) => n.id));
  const candidates = COUNTRIES.filter((c) => c.id !== country.id && !neighborIds.has(c.id));
  const distractors = pickDistractorLabels(candidates, countryName, new Set([neighbor.name.common]), country.region);
  return {
    id: `neighbor:${country.id}:${nonce()}`,
    category: "neighbor",
    countryId: country.id,
    promptLabel: `Which of these shares a land border with ${country.name.common}?`,
    choices: choicesFrom(neighbor.name.common, distractors),
    explanation: `${neighbor.name.common} borders ${country.name.common}.`,
  };
}

function generateLandmark(country: Country): Question {
  const landmark = pickRandom(COUNTRY_CONTENT[country.id]!.landmarks!, 1)[0];
  const owners = landmarkOwners.get(normalizeName(landmark.name)) ?? new Set([country.id]);
  const candidates = COUNTRIES.filter((c) => !owners.has(c.id));
  const distractors = pickDistractorLabels(candidates, countryName, new Set([country.name.common]), country.region);
  return {
    id: `landmark:${country.id}:${nonce()}`,
    category: "landmark",
    countryId: country.id,
    promptLabel: `Which country is home to ${landmark.name}?`,
    choices: choicesFrom(country.name.common, distractors),
    explanation: `${landmark.name} is in ${country.name.common}. ${landmark.note}`,
  };
}

function generateFood(country: Country): Question {
  const dish = pickRandom(quizzableDishes(country.id), 1)[0];
  const owners = dishOwners.get(normalizeName(dish.name)) ?? new Set([country.id]);
  const candidates = COUNTRIES.filter((c) => !owners.has(c.id));
  const distractors = pickDistractorLabels(candidates, countryName, new Set([country.name.common]), country.region);
  return {
    id: `food:${country.id}:${nonce()}`,
    category: "food",
    countryId: country.id,
    promptLabel: `${dish.name} is a dish from which country?`,
    choices: choicesFrom(country.name.common, distractors),
    explanation: `${dish.name} is from ${country.name.common}. ${dish.note}`,
  };
}

const GENERATORS: Record<QuizCategory, (c: Country) => Question> = {
  flag: generateFlag,
  capital: generateCapital,
  shape: generateShape,
  currency: generateCurrency,
  neighbor: generateNeighbor,
  landmark: generateLandmark,
  food: generateFood,
};

export function generateQuestion(category: QuizCategory, countryId: string): Question {
  const country = byId.get(countryId);
  if (!country) throw new Error(`Unknown country ${countryId}`);
  if (!isEligible(category, countryId)) throw new Error(`${countryId} has no data for the ${category} quiz`);
  return GENERATORS[category](country);
}
