import { COUNTRIES } from "../../data/countries";
import { ACHIEVEMENTS, evaluateAchievements } from "../achievements";
import { EXPEDITIONS } from "../expeditions";
import { computeExpeditionProgress } from "../expeditionProgress";
import type { StatsSnapshot } from "../types";
import type { CountryMastery, ProgressRecord } from "../../quiz/types";

const byId = new Map(COUNTRIES.map((c) => [c.id, c]));
const exp = (id: string) => EXPEDITIONS.find((e) => e.id === id)!;

describe("expeditions", () => {
  it("only reference real countries, without duplicates", () => {
    for (const e of EXPEDITIONS) {
      expect(new Set(e.countryIds).size).toBe(e.countryIds.length);
      for (const id of e.countryIds) expect(byId.has(id)).toBe(true);
    }
  });

  it("Island Nations are all countries with no land border", () => {
    for (const id of exp("island_nations").countryIds) expect(byId.get(id)!.borders ?? []).toHaveLength(0);
  });

  it("South American Adventure covers every country on the continent", () => {
    const southAmerica = COUNTRIES.filter((c) => c.subregion === "South America").map((c) => c.id).sort();
    expect([...exp("south_america").countryIds].sort()).toEqual(southAmerica);
  });

  it("Countries of the Equator includes every country whose land the equator crosses", () => {
    expect([...exp("equator_countries").countryIds].sort()).toEqual(
      ["BRA", "COD", "COG", "COL", "ECU", "GAB", "IDN", "KEN", "SOM", "STP", "UGA"].sort()
    );
  });

  it("computes progress from mastery scores", () => {
    const mastery = new Map<string, CountryMastery>([
      ["CHN", { countryId: "CHN", score: 90, level: "master", levelLabel: "Master", categoriesAttempted: 7, categoriesAvailable: 7 }],
    ]);
    const p = computeExpeditionProgress(exp("silk_road"), mastery);
    expect(p.completedCountryIds).toEqual(["CHN"]);
    expect(p.percentComplete).toBe(20);
    expect(p.isComplete).toBe(false);
  });
});

describe("achievements", () => {
  const emptyStats: StatsSnapshot = {
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
    games: { routesFinished: 0, routesAtPar: 0, mysteriesSolved: 0, mysteriesWithOneClue: 0 },
  };
  const ctx = (over: Partial<Parameters<typeof evaluateAchievements>[0]> = {}) =>
    evaluateAchievements({ stats: emptyStats, progressRecords: [], masteryByCountry: new Map(), favoritesCount: 0, stampCount: 0, ...over });
  const rec = (category: ProgressRecord["category"], correctCount: number): ProgressRecord => ({
    countryId: "FRA",
    category,
    box: 1,
    correctCount,
    incorrectCount: 0,
    dueAt: "",
    lastReviewedAt: null,
  });

  it("have unique ids", () => {
    expect(new Set(ACHIEVEMENTS.map((a) => a.id)).size).toBe(ACHIEVEMENTS.length);
  });

  it("unlocks nothing for a brand-new player", () => {
    expect(ctx().size).toBe(0);
  });

  it("awards First Flag for a correct flag answer, not any correct answer", () => {
    expect(ctx({ progressRecords: [rec("capital", 1)] }).has("first_flag")).toBe(false);
    expect(ctx({ progressRecords: [rec("flag", 1)] }).has("first_flag")).toBe(true);
  });

  it("counts favorites and streaks", () => {
    const unlocked = ctx({ favoritesCount: 5, stats: { ...emptyStats, longestStreak: 7 } });
    expect(unlocked.has("favorites_5")).toBe(true);
    expect(unlocked.has("streak_3")).toBe(true);
    expect(unlocked.has("streak_7")).toBe(true);
    expect(unlocked.has("streak_30")).toBe(false);
  });
});
