/**
 * Quiz categories are generated from data we already have — no new content
 * authoring required. Not every category applies to every country (islands
 * have no land neighbors, microstates have no outline at this map scale);
 * `isEligible` in generators.ts is the single source of truth for that.
 */
export type QuizCategory =
  | "flag"
  | "capital"
  | "shape"
  | "locate"
  | "currency"
  | "neighbor"
  | "landmark"
  | "food";

export const QUIZ_CATEGORIES: { key: QuizCategory; label: string; icon: string }[] = [
  { key: "flag", label: "Flags", icon: "flag-outline" },
  { key: "capital", label: "Capitals", icon: "business-outline" },
  { key: "shape", label: "Shapes", icon: "shapes-outline" },
  { key: "locate", label: "Find it", icon: "locate-outline" },
  { key: "currency", label: "Currencies", icon: "cash-outline" },
  { key: "neighbor", label: "Neighbors", icon: "git-network-outline" },
  { key: "landmark", label: "Landmarks", icon: "camera-outline" },
  { key: "food", label: "Food", icon: "restaurant-outline" },
];

/** A single generated multiple-choice question. */
export interface QuestionChoice {
  label: string;
  correct: boolean;
}

export interface Question {
  id: string; // `${category}:${countryId}:${nonce}` — unique per instance, not per fact
  category: QuizCategory;
  countryId: string; // which country's progress/mastery record this question feeds
  promptLabel: string; // e.g. "What is the capital of Chile?"
  /** When set, the screen renders a flag or outline — or, for "globe", the player answers by tapping the globe. */
  promptVisual?: "flag" | "shape" | "globe";
  /** Exactly one has correct: true; labels are unique. Globe questions have just the one correct choice (the country to find). */
  choices: QuestionChoice[];
  explanation: string;
}

export interface AnswerResult {
  question: Question;
  chosenLabel: string;
  correct: boolean;
}

/** Spaced-repetition record for one (country, category) pair (FSRS; see srs.ts). */
export interface ProgressRecord {
  countryId: string;
  category: QuizCategory;
  /** Memory-strength level 0–5 derived from `stability` (higher = better known). */
  box: number;
  correctCount: number;
  incorrectCount: number;
  dueAt: string; // ISO timestamp
  lastReviewedAt: string | null;
  /** FSRS stability in days; null for records saved before FSRS (migrated on next answer). */
  stability?: number | null;
  /** FSRS difficulty, 1–10; null for records saved before FSRS. */
  difficulty?: number | null;
}

export const MASTERY_LEVELS = [
  { key: "explorer", label: "Explorer", min: 0 },
  { key: "traveler", label: "Traveler", min: 10 },
  { key: "researcher", label: "Researcher", min: 25 },
  { key: "cartographer", label: "Cartographer", min: 40 },
  { key: "diplomat", label: "Diplomat", min: 55 },
  { key: "geographer", label: "Geographer", min: 70 },
  { key: "master", label: "Master", min: 85 },
  { key: "legend", label: "Legend", min: 100 },
] as const;

export type MasteryLevelKey = (typeof MASTERY_LEVELS)[number]["key"];

export interface CountryMastery {
  countryId: string;
  score: number; // 0–100
  level: MasteryLevelKey;
  levelLabel: string;
  categoriesAttempted: number;
  categoriesAvailable: number;
}
