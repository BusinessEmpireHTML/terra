import { COUNTRIES } from "../data/countries";
import { ELIGIBLE_POOLS, generateQuestion, isEligible } from "./generators";
import { daysBetween } from "../gamification/streaks";
import { hashString, seededRng, shuffle } from "../utils/random";
import { QUIZ_CATEGORIES, type Question, type QuizCategory } from "./types";

/**
 * The Daily Quiz is identical for every player on a given calendar date (in
 * their own time zone, like Wordle): every choice — countries, categories,
 * distractors, answer order — comes from a PRNG seeded with the date, so
 * results are comparable and worth sharing.
 */
export const DAILY_QUIZ_LENGTH = 5;
/** Daily #1 was played on this date. */
const DAILY_EPOCH = "2026-01-01";

/** Deterministic pick — the same country all day for every player, changing daily without needing a server. */
export function countryOfTheDay(date: string): string {
  let hash = 0;
  for (let i = 0; i < date.length; i++) {
    hash = (hash * 31 + date.charCodeAt(i)) >>> 0;
  }
  return COUNTRIES[hash % COUNTRIES.length].id;
}

export function dailyNumber(date: string): number {
  return daysBetween(DAILY_EPOCH, date) + 1;
}

/**
 * Today's five questions: the first is always about the Country of the Day,
 * then four more countries, each in a different category.
 */
export function buildDailyQuiz(date: string): Question[] {
  const rng = seededRng(hashString(`terra-daily:${date}`));
  const categories = shuffle(
    QUIZ_CATEGORIES.map((c) => c.key),
    rng
  );
  const featured = countryOfTheDay(date);
  const firstCategory = categories.find((c) => isEligible(c, featured)) ?? "flag";

  const picks: { category: QuizCategory; countryId: string }[] = [{ category: firstCategory, countryId: featured }];
  const used = new Set([featured]);
  for (const category of categories) {
    if (picks.length >= DAILY_QUIZ_LENGTH) break;
    if (category === firstCategory) continue;
    const pool = ELIGIBLE_POOLS[category].filter((c) => !used.has(c.id));
    const country = pool[Math.floor(rng() * pool.length)];
    picks.push({ category, countryId: country.id });
    used.add(country.id);
  }

  return picks.map((p, i) => ({ ...generateQuestion(p.category, p.countryId, rng), id: `daily:${date}:${i}` }));
}

const CATEGORY_EMOJI: Record<QuizCategory, string> = {
  flag: "🚩",
  capital: "🏛️",
  shape: "🔷",
  locate: "📍",
  currency: "💱",
  neighbor: "🤝",
  landmark: "🗿",
  food: "🍲",
};

export interface DailyAnswer {
  category: QuizCategory;
  correct: boolean;
}

/** Spoiler-free result to share: score, a row of ✓/✗ squares, and which kind of question each was. */
export function dailyShareText(date: string, answers: DailyAnswer[]): string {
  const score = answers.filter((a) => a.correct).length;
  return [
    `Terra Daily #${dailyNumber(date)} 🌍 ${score}/${answers.length}`,
    answers.map((a) => (a.correct ? "🟩" : "🟥")).join(""),
    answers.map((a) => CATEGORY_EMOJI[a.category]).join(""),
  ].join("\n");
}
