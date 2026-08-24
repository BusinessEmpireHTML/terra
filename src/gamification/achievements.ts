import { COUNTRIES } from "../data/countries";
import { MAX_BOX } from "../quiz/srs";
import type { CountryMastery, ProgressRecord, QuizCategory } from "../quiz/types";
import type { Achievement, ContinentBreakdown, StatsSnapshot } from "./types";
import type { Continent } from "../types/country";

export const ACHIEVEMENTS: Achievement[] = [
  // Milestones
  { id: "first_flag", title: "First Flag", description: "Answer your first question correctly", icon: "flag", tier: "bronze" },
  { id: "ten_correct", title: "Getting Started", description: "10 correct answers", icon: "checkmark-circle", tier: "bronze" },
  { id: "fifty_correct", title: "Building Momentum", description: "50 correct answers", icon: "checkmark-circle", tier: "bronze" },
  { id: "hundred_correct", title: "100 Correct Answers", description: "100 correct answers", icon: "ribbon", tier: "silver" },
  { id: "five_hundred_correct", title: "500 Correct Answers", description: "500 correct answers", icon: "ribbon", tier: "gold" },
  { id: "thousand_correct", title: "1,000 Correct Answers", description: "1,000 correct answers", icon: "trophy", tier: "gold" },

  // Category mastery — box 5 (fully learned) on N countries in one category
  { id: "flag_spotter_25", title: "Flag Spotter", description: "Master 25 flags", icon: "flag", tier: "bronze" },
  { id: "flag_master_100", title: "Flag Master", description: "Master 100 flags", icon: "flag", tier: "gold" },
  { id: "capital_novice_10", title: "Capital Novice", description: "Master 10 capitals", icon: "business", tier: "bronze" },
  { id: "capital_master_50", title: "Capital Master", description: "Master 50 capitals", icon: "business", tier: "silver" },
  { id: "shape_shifter_25", title: "Shape Shifter", description: "Master 25 country shapes", icon: "shapes", tier: "silver" },
  { id: "currency_collector_25", title: "Currency Collector", description: "Master 25 currencies", icon: "cash", tier: "silver" },
  { id: "good_neighbor_25", title: "Good Neighbor", description: "Master 25 neighbor questions", icon: "git-network", tier: "silver" },
  { id: "landmark_hunter_25", title: "Landmark Hunter", description: "Master 25 landmarks", icon: "camera", tier: "silver" },
  { id: "world_foodie_25", title: "World Foodie", description: "Master 25 food questions", icon: "restaurant", tier: "silver" },

  // Regional
  { id: "africa_expert", title: "African Explorer", description: "Strong average mastery across Africa", icon: "earth", tier: "gold" },
  { id: "asia_expert", title: "Asia Expert", description: "Strong average mastery across Asia", icon: "earth", tier: "gold" },
  { id: "europe_expert", title: "European Scholar", description: "Strong average mastery across Europe", icon: "earth", tier: "gold" },
  { id: "americas_expert", title: "Americas Adventurer", description: "Strong average mastery across the Americas", icon: "earth", tier: "gold" },
  { id: "island_hunter", title: "Island Hunter", description: "Strong average mastery across Oceania", icon: "earth", tier: "gold" },

  // Streaks
  { id: "streak_3", title: "Three in a Row", description: "3-day streak", icon: "flame", tier: "bronze" },
  { id: "streak_7", title: "Week Warrior", description: "7-day streak", icon: "flame", tier: "silver" },
  { id: "streak_30", title: "Monthly Devotion", description: "30-day streak", icon: "flame", tier: "gold" },
  { id: "streak_100", title: "Centurion", description: "100-day streak", icon: "flame", tier: "gold" },

  // Exploration & breadth
  { id: "bearings_10", title: "Getting Your Bearings", description: "Start learning about 10 countries", icon: "compass", tier: "bronze" },
  { id: "world_traveler_50", title: "World Traveler", description: "Start learning about 50 countries", icon: "compass", tier: "silver" },
  { id: "globe_trotter_100", title: "Globe Trotter", description: "Start learning about 100 countries", icon: "compass", tier: "gold" },
  { id: "every_corner", title: "Every Corner", description: "Start learning about all 194 countries", icon: "planet", tier: "gold" },
  { id: "favorites_5", title: "Building a List", description: "Favorite 5 countries", icon: "heart", tier: "bronze" },
  { id: "favorites_20", title: "Bucket List", description: "Favorite 20 countries", icon: "heart", tier: "silver" },

  // Mastery tier
  { id: "legend_1", title: "First Legend", description: "Reach Legend status on a country", icon: "star", tier: "silver" },
  { id: "legend_10", title: "Legendary Explorer", description: "Reach Legend status on 10 countries", icon: "star", tier: "gold" },
  { id: "master_25", title: "Master Cartographer", description: "Reach Master status on 25 countries", icon: "medal", tier: "gold" },

  // Accuracy & completion
  { id: "sharp_shooter", title: "Sharp Shooter", description: "90%+ accuracy over 50+ answers", icon: "locate", tier: "silver" },
  { id: "flag_completionist", title: "Every Flag", description: "Attempt the flag quiz for all 194 countries", icon: "flag", tier: "gold" },
  { id: "capital_completionist", title: "Every Capital", description: "Attempt the capital quiz for every eligible country", icon: "business", tier: "gold" },

  // XP
  { id: "xp_1000", title: "1,000 XP", description: "Earn 1,000 total XP", icon: "sparkles", tier: "bronze" },
  { id: "xp_10000", title: "10,000 XP", description: "Earn 10,000 total XP", icon: "sparkles", tier: "gold" },

  // Capstone
  { id: "geography_legend", title: "Geography Legend", description: "Strong average mastery across every continent", icon: "globe", tier: "gold" },
];

export const ACHIEVEMENTS_BY_ID = new Map(ACHIEVEMENTS.map((a) => [a.id, a]));

interface AchievementContext {
  stats: StatsSnapshot;
  progressRecords: ProgressRecord[];
  masteryByCountry: Map<string, CountryMastery>;
  favoritesCount: number;
}

function boxMasteredCount(records: ProgressRecord[], category: QuizCategory): number {
  return records.filter((r) => r.category === category && r.box >= MAX_BOX).length;
}

function regionMeetsBar(breakdown: ContinentBreakdown | undefined): boolean {
  if (!breakdown) return false;
  const minBreadth = Math.max(5, Math.round(breakdown.countriesTotal * 0.3));
  return breakdown.avgScore >= 70 && breakdown.countriesStarted >= minBreadth;
}

const REGION_ACHIEVEMENT: Record<string, Continent> = {
  africa_expert: "Africa",
  asia_expert: "Asia",
  europe_expert: "Europe",
  americas_expert: "Americas",
  island_hunter: "Oceania",
};

const COUNTRIES_WITH_CAPITAL = COUNTRIES.filter((c) => c.capital?.[0]).length;

/** Pure function: given current data, which achievement IDs are satisfied right now. */
export function evaluateAchievements(ctx: AchievementContext): Set<string> {
  const { stats, progressRecords, masteryByCountry, favoritesCount } = ctx;
  const unlocked = new Set<string>();

  if (stats.totalCorrect >= 1) unlocked.add("first_flag");
  if (stats.totalCorrect >= 10) unlocked.add("ten_correct");
  if (stats.totalCorrect >= 50) unlocked.add("fifty_correct");
  if (stats.totalCorrect >= 100) unlocked.add("hundred_correct");
  if (stats.totalCorrect >= 500) unlocked.add("five_hundred_correct");
  if (stats.totalCorrect >= 1000) unlocked.add("thousand_correct");

  if (boxMasteredCount(progressRecords, "flag") >= 25) unlocked.add("flag_spotter_25");
  if (boxMasteredCount(progressRecords, "flag") >= 100) unlocked.add("flag_master_100");
  if (boxMasteredCount(progressRecords, "capital") >= 10) unlocked.add("capital_novice_10");
  if (boxMasteredCount(progressRecords, "capital") >= 50) unlocked.add("capital_master_50");
  if (boxMasteredCount(progressRecords, "shape") >= 25) unlocked.add("shape_shifter_25");
  if (boxMasteredCount(progressRecords, "currency") >= 25) unlocked.add("currency_collector_25");
  if (boxMasteredCount(progressRecords, "neighbor") >= 25) unlocked.add("good_neighbor_25");
  if (boxMasteredCount(progressRecords, "landmark") >= 25) unlocked.add("landmark_hunter_25");
  if (boxMasteredCount(progressRecords, "food") >= 25) unlocked.add("world_foodie_25");

  for (const [achievementId, region] of Object.entries(REGION_ACHIEVEMENT)) {
    const breakdown = stats.continents.find((c) => c.region === region);
    if (regionMeetsBar(breakdown)) unlocked.add(achievementId);
  }
  if (Object.values(REGION_ACHIEVEMENT).every((region) => regionMeetsBar(stats.continents.find((c) => c.region === region)))) {
    unlocked.add("geography_legend");
  }

  if (stats.currentStreak >= 3 || stats.longestStreak >= 3) unlocked.add("streak_3");
  if (stats.currentStreak >= 7 || stats.longestStreak >= 7) unlocked.add("streak_7");
  if (stats.currentStreak >= 30 || stats.longestStreak >= 30) unlocked.add("streak_30");
  if (stats.currentStreak >= 100 || stats.longestStreak >= 100) unlocked.add("streak_100");

  const countriesStarted = Array.from(masteryByCountry.values()).filter((m) => m.categoriesAttempted > 0).length;
  if (countriesStarted >= 10) unlocked.add("bearings_10");
  if (countriesStarted >= 50) unlocked.add("world_traveler_50");
  if (countriesStarted >= 100) unlocked.add("globe_trotter_100");
  if (countriesStarted >= COUNTRIES.length) unlocked.add("every_corner");

  if (favoritesCount >= 5) unlocked.add("favorites_5");
  if (favoritesCount >= 20) unlocked.add("favorites_20");

  const legendCount = Array.from(masteryByCountry.values()).filter((m) => m.score >= 100).length;
  const masterCount = Array.from(masteryByCountry.values()).filter((m) => m.score >= 85).length;
  if (legendCount >= 1) unlocked.add("legend_1");
  if (legendCount >= 10) unlocked.add("legend_10");
  if (masterCount >= 25) unlocked.add("master_25");

  if (stats.totalAnswered >= 50 && stats.accuracy >= 90) unlocked.add("sharp_shooter");

  const flagAttempted = new Set(progressRecords.filter((r) => r.category === "flag").map((r) => r.countryId)).size;
  if (flagAttempted >= COUNTRIES.length) unlocked.add("flag_completionist");
  const capitalAttempted = new Set(progressRecords.filter((r) => r.category === "capital").map((r) => r.countryId)).size;
  if (capitalAttempted >= COUNTRIES_WITH_CAPITAL) unlocked.add("capital_completionist");

  if (stats.totalXp >= 1000) unlocked.add("xp_1000");
  if (stats.totalXp >= 10000) unlocked.add("xp_10000");

  return unlocked;
}
