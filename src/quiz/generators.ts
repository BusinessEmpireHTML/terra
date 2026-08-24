import { COUNTRIES } from "../data/countries";
import { COUNTRY_CONTENT } from "../data/countryContent";
import { shuffle, pickRandom } from "../utils/random";
import type { Country } from "../types/country";
import type { Question, QuestionChoice, QuizCategory } from "./types";

const byId = new Map(COUNTRIES.map((c) => [c.id, c]));
const withCapital = COUNTRIES.filter((c) => c.capital?.[0]);
const withCurrency = COUNTRIES.filter((c) => c.currencies?.[0]?.name);
const withBorders = COUNTRIES.filter((c) => c.borders?.length);
const withShape = COUNTRIES.filter((c) => c.hasBorderGeometry);
const withLandmarks = COUNTRIES.filter((c) => (COUNTRY_CONTENT[c.id]?.landmarks?.length ?? 0) > 0);
const withFood = COUNTRIES.filter((c) => (COUNTRY_CONTENT[c.id]?.food?.length ?? 0) > 0);

/** Whether a given country has the data a category needs. The session builder uses this to avoid picking a dead-end pair. */
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
      return Boolean(c.borders?.length);
    case "landmark":
      return (COUNTRY_CONTENT[c.id]?.landmarks?.length ?? 0) > 0;
    case "food":
      return (COUNTRY_CONTENT[c.id]?.food?.length ?? 0) > 0;
  }
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

function generateFlag(country: Country): Question {
  const distractors = pickRandom(
    COUNTRIES.filter((c) => c.id !== country.id),
    3
  ).map((c) => c.name.common);
  return {
    id: `flag:${country.id}:${nonce()}`,
    category: "flag",
    countryId: country.id,
    promptLabel: "Which country does this flag belong to?",
    promptVisual: "flag",
    choices: choicesFrom(country.name.common, distractors),
    explanation: `That's ${country.name.common}'s flag.`,
  };
}

function generateCapital(country: Country): Question {
  const capital = country.capital![0];
  const distractors = pickRandom(
    withCapital.filter((c) => c.id !== country.id && c.capital![0] !== capital),
    3
  ).map((c) => c.capital![0]);
  return {
    id: `capital:${country.id}:${nonce()}`,
    category: "capital",
    countryId: country.id,
    promptLabel: `What is the capital of ${country.name.common}?`,
    choices: choicesFrom(capital, distractors),
    explanation: `${capital} is the capital of ${country.name.common}.`,
  };
}

function generateShape(country: Country): Question {
  const distractors = pickRandom(
    withShape.filter((c) => c.id !== country.id),
    3
  ).map((c) => c.name.common);
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
  const currency = country.currencies![0].name;
  const distractors = pickRandom(
    withCurrency.filter((c) => c.id !== country.id && c.currencies![0].name !== currency),
    3
  ).map((c) => c.currencies![0].name);
  return {
    id: `currency:${country.id}:${nonce()}`,
    category: "currency",
    countryId: country.id,
    promptLabel: `What currency does ${country.name.common} use?`,
    choices: choicesFrom(currency, distractors),
    explanation: `${country.name.common} uses the ${currency}.`,
  };
}

function generateNeighbor(country: Country): Question {
  const neighborId = pickRandom(country.borders!, 1)[0];
  const neighbor = byId.get(neighborId);
  if (!neighbor) throw new Error(`Neighbor ${neighborId} missing from country list`);
  const nonNeighbors = COUNTRIES.filter((c) => c.id !== country.id && !country.borders!.includes(c.id));
  const distractors = pickRandom(nonNeighbors, 3).map((c) => c.name.common);
  return {
    id: `neighbor:${country.id}:${nonce()}`,
    category: "neighbor",
    countryId: country.id,
    promptLabel: `Which of these shares a border with ${country.name.common}?`,
    choices: choicesFrom(neighbor.name.common, distractors),
    explanation: `${neighbor.name.common} borders ${country.name.common}.`,
  };
}

function generateLandmark(country: Country): Question {
  const landmarks = COUNTRY_CONTENT[country.id]!.landmarks!;
  const landmark = pickRandom(landmarks, 1)[0];
  const distractors = pickRandom(
    withLandmarks.filter((c) => c.id !== country.id),
    3
  ).map((c) => c.name.common);
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
  const dishes = COUNTRY_CONTENT[country.id]!.food!;
  const dish = pickRandom(dishes, 1)[0];
  const distractors = pickRandom(
    withFood.filter((c) => c.id !== country.id),
    3
  ).map((c) => c.name.common);
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

/** The eligible-country pools per category, exposed so the session builder can pick valid random pairs without guessing and retrying. */
export const ELIGIBLE_POOLS: Record<QuizCategory, Country[]> = {
  flag: COUNTRIES,
  capital: withCapital,
  shape: withShape,
  currency: withCurrency,
  neighbor: withBorders,
  landmark: withLandmarks,
  food: withFood,
};

export function generateQuestion(category: QuizCategory, countryId: string): Question {
  const country = byId.get(countryId);
  if (!country) throw new Error(`Unknown country ${countryId}`);
  return GENERATORS[category](country);
}
