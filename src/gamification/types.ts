import type { Continent } from "../types/country";
import type { QuizCategory } from "../quiz/types";
import type { DailyAnswer } from "../quiz/daily";

/** Games that log activity (XP, streaks) without a spaced-repetition record. */
export type GameKind = "route" | "mystery";

export interface ActivityEvent {
  id?: number;
  date: string; // local YYYY-MM-DD, used for streaks/heatmap grouping
  timestamp: string; // ISO instant
  countryId: string;
  category: QuizCategory | GameKind;
  correct: boolean;
  xpEarned: number;
}

export interface DayCount {
  date: string; // YYYY-MM-DD
  count: number;
  correct: number;
}

export interface ContinentBreakdown {
  region: Continent;
  avgScore: number;
  countriesStarted: number;
  countriesTotal: number;
}

export interface StatsSnapshot {
  totalXp: number;
  currentStreak: number;
  longestStreak: number;
  totalAnswered: number;
  totalCorrect: number;
  accuracy: number;
  questionsToday: number;
  continents: ContinentBreakdown[];
  weakest: ContinentBreakdown | null;
  strongest: ContinentBreakdown | null;
  heatmap: DayCount[]; // last N days, oldest first
  games: GameStats;
}

/** Travel Route and Mystery Country totals (from the activity log). */
export interface GameStats {
  routesFinished: number;
  routesAtPar: number;
  mysteriesSolved: number;
  mysteriesWithOneClue: number;
}

export type AchievementTier = "bronze" | "silver" | "gold";

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string; // Ionicons name
  tier: AchievementTier;
}

export interface UnlockedAchievement {
  achievementId: string;
  unlockedAt: string;
}

export interface Expedition {
  id: string;
  title: string;
  description: string;
  icon: string;
  countryIds: string[];
}

export interface ExpeditionProgress {
  expeditionId: string;
  completedCountryIds: string[];
  totalCountries: number;
  percentComplete: number;
  isComplete: boolean;
}

/** Local-date-keyed completion flags for today's set of daily activities. */
export interface DailyState {
  date: string;
  countryOfTheDayId: string;
  dailyQuizDone: boolean;
  /** Today's Daily Quiz answers, in order (null until played). */
  dailyQuizAnswers: DailyAnswer[] | null;
  speedRoundBestScore: number | null;
}
