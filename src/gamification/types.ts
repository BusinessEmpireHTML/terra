import type { Continent } from "../types/country";
import type { QuizCategory } from "../quiz/types";

export interface ActivityEvent {
  id?: number;
  date: string; // local YYYY-MM-DD, used for streaks/heatmap grouping
  timestamp: string; // ISO instant
  countryId: string;
  category: QuizCategory;
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
  speedRoundBestScore: number | null;
}
