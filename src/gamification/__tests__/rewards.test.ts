import { gameStats } from "../../services/activityStore";
import { parseStamps } from "../passport";
import { evaluateAchievements } from "../achievements";
import { GLOBE_THEMES, isGlobeThemeId, isGlobeThemeUnlocked } from "../../theme/globeThemes";
import { XP_PER_GAME_POINT, ROUTE_MAX_POINTS, MYSTERY_MAX_POINTS } from "../gameScoring";
import type { StatsSnapshot } from "../types";

const ev = (category: "route" | "mystery" | "flag", correct: boolean, points: number) => ({ category, correct, xpEarned: points * XP_PER_GAME_POINT });

describe("game stats", () => {
  it("counts finished routes, routes at par, and mysteries", () => {
    const stats = gameStats([
      ev("route", true, ROUTE_MAX_POINTS),
      ev("route", true, 1),
      ev("route", false, 0), // gave up
      ev("mystery", true, MYSTERY_MAX_POINTS),
      ev("mystery", true, 2),
      ev("mystery", false, 0),
      ev("flag", true, 2), // a quiz answer, not a game
    ]);
    expect(stats).toEqual({ routesFinished: 2, routesAtPar: 1, mysteriesSolved: 2, mysteriesWithOneClue: 1 });
  });
});

describe("passport", () => {
  it("reads saved stamps defensively", () => {
    expect(parseStamps(null)).toEqual([]);
    expect(parseStamps("not json")).toEqual([]);
    expect(parseStamps(JSON.stringify({}))).toEqual([]);
    const ok = { expeditionId: "silk_road", earnedAt: "2026-11-20T10:00:00.000Z" };
    expect(parseStamps(JSON.stringify([ok, { expeditionId: "no_such_trip", earnedAt: "x" }, { foo: 1 }]))).toEqual([ok]);
  });
});

describe("globe styles", () => {
  it("unlock as stamps are collected, starting with the classic look", () => {
    expect(GLOBE_THEMES[0].id).toBe("classic");
    expect(isGlobeThemeUnlocked("classic", 0)).toBe(true);
    expect(isGlobeThemeUnlocked("parchment", 0)).toBe(false);
    expect(isGlobeThemeUnlocked("parchment", 1)).toBe(true);
    expect(isGlobeThemeUnlocked("aurora", 9)).toBe(false);
    expect(isGlobeThemeUnlocked("aurora", 10)).toBe(true);
    const thresholds = GLOBE_THEMES.map((t) => t.unlockAt);
    expect(thresholds).toEqual([...thresholds].sort((a, b) => a - b));
    expect(isGlobeThemeId("atlas")).toBe(true);
    expect(isGlobeThemeId("neon")).toBe(false);
  });
});

describe("new achievements", () => {
  const stats = (games: Partial<StatsSnapshot["games"]>): StatsSnapshot => ({
    totalXp: 0,
    currentStreak: 0,
    longestStreak: 0,
    totalAnswered: 0,
    totalCorrect: 0,
    accuracy: 0,
    questionsToday: 0,
    continents: [],
    weakest: null,
    strongest: null,
    heatmap: [],
    games: { routesFinished: 0, routesAtPar: 0, mysteriesSolved: 0, mysteriesWithOneClue: 0, ...games },
  });
  const unlocked = (games: Partial<StatsSnapshot["games"]>, stampCount = 0) =>
    evaluateAchievements({ stats: stats(games), progressRecords: [], masteryByCountry: new Map(), favoritesCount: 0, stampCount });

  it("rewards Travel Route, Mystery Country and passport stamps", () => {
    expect(unlocked({}).size).toBe(0);
    expect([...unlocked({ routesFinished: 1, routesAtPar: 1 })]).toEqual(["route_par"]);
    expect(unlocked({ routesFinished: 25 }).has("route_25")).toBe(true);
    expect([...unlocked({ mysteriesSolved: 1 })]).toEqual(["mystery_solved"]);
    expect(unlocked({ mysteriesSolved: 1, mysteriesWithOneClue: 1 }).has("mystery_one_clue")).toBe(true);
    expect([...unlocked({}, 1)]).toEqual(["passport_1"]);
    expect(unlocked({}, 10).has("passport_10")).toBe(true);
  });
});
