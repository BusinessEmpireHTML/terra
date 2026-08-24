/**
 * Quiz categories are generated from data we already have — no new content
 * authoring required. Landmark and Food only apply to the 121 countries
 * with narrative content; the others cover all 194.
 */
export type QuizCategory =
  | "flag"
  | "capital"
  | "shape"
  | "currency"
  | "neighbor"
  | "landmark"
  | "food";

export const QUIZ_CATEGORIES: { key: QuizCategory; label: string; icon: string; requiresContent: boolean }[] = [
  { key: "flag", label: "Flags", icon: "flag-outline", requiresContent: false },
  { key: "capital", label: "Capitals", icon: "business-outline", requiresContent: false },
  { key: "shape", label: "Shapes", icon: "shapes-outline", requiresContent: false },
  { key: "currency", label: "Currencies", icon: "cash-outline", requiresContent: false },
  { key: "neighbor", label: "Neighbors", icon: "git-network-outline", requiresContent: false },
  { key: "landmark", label: "Landmarks", icon: "camera-outline", requiresContent: true },
  { key: "food", label: "Food", icon: "restaurant-outline", requiresContent: true },
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
  promptLabel: string; // e.g. "What is the capital of Chile?" — empty when the visual is self-explanatory
  promptVisual?: "flag" | "shape"; // when set, the screen renders the flag/shape instead of relying on prompt text alone
  choices: QuestionChoice[]; // exactly one has correct: true
  explanation: string;
}

export interface AnswerResult {
  question: Question;
  chosenLabel: string;
  correct: boolean;
}

/** Leitner-box spaced-repetition record for one (country, category) pair. */
export interface ProgressRecord {
  countryId: string;
  category: QuizCategory;
  box: number; // 0–5, higher = better known
  correctCount: number;
  incorrectCount: number;
  dueAt: string; // ISO timestamp
  lastReviewedAt: string | null;
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
