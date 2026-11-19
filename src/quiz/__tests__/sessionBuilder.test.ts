import type { ProgressRecord } from "../types";

const mockRecords: ProgressRecord[] = [];
jest.mock("../../services/progressStore", () => ({
  progressStore: { getAll: jest.fn(async () => mockRecords) },
}));

// eslint-disable-next-line import/first
import { buildSession, isCategoryFilter, rankPairs, selectPairs } from "../sessionBuilder";

const now = new Date("2026-06-01T12:00:00Z");
function rec(countryId: string, category: ProgressRecord["category"], dueAt: string): ProgressRecord {
  return { countryId, category, box: 1, correctCount: 1, incorrectCount: 0, dueAt, lastReviewedAt: null };
}

describe("rankPairs", () => {
  it("puts overdue pairs first (oldest first), then unseen, then not-yet-due", () => {
    const pairs = [
      { countryId: "FRA", category: "flag" as const },
      { countryId: "DEU", category: "flag" as const },
      { countryId: "ITA", category: "flag" as const },
      { countryId: "ESP", category: "flag" as const },
    ];
    const records = [
      rec("FRA", "flag", "2026-05-31T00:00:00Z"), // overdue
      rec("DEU", "flag", "2026-05-01T00:00:00Z"), // more overdue
      rec("ITA", "flag", "2026-06-10T00:00:00Z"), // not due yet
    ];
    expect(rankPairs(pairs, records, now).map((p) => p.countryId)).toEqual(["DEU", "FRA", "ESP", "ITA"]);
  });
});

describe("selectPairs", () => {
  it("never repeats a pair, and avoids repeating a country until it has to", () => {
    const ranked = [
      { countryId: "FRA", category: "flag" as const },
      { countryId: "FRA", category: "capital" as const },
      { countryId: "DEU", category: "flag" as const },
      { countryId: "FRA", category: "flag" as const },
    ];
    expect(selectPairs(ranked, 2)).toEqual([ranked[0], ranked[2]]);
    expect(selectPairs(ranked, 10)).toEqual([ranked[0], ranked[2], ranked[1]]);
  });
});

describe("buildSession", () => {
  beforeEach(() => {
    mockRecords.length = 0;
  });

  it("builds a full mixed session of distinct countries", async () => {
    const qs = await buildSession("mixed", { length: 10 });
    expect(qs).toHaveLength(10);
    expect(new Set(qs.map((q) => q.countryId)).size).toBe(10);
  });

  it("practices one country across distinct categories", async () => {
    const qs = await buildSession("mixed", { length: 10, focusCountryId: "FRA" });
    expect(qs.every((q) => q.countryId === "FRA")).toBe(true);
    expect(new Set(qs.map((q) => q.category)).size).toBe(qs.length);
    expect(qs.length).toBe(7);
  });

  it("stays within an expedition's countries, repeating countries only when needed", async () => {
    const ids = ["CHN", "KAZ", "UZB", "IRN", "TUR"];
    const qs = await buildSession("mixed", { length: 10, countryIds: ids });
    expect(qs).toHaveLength(10);
    expect(qs.every((q) => ids.includes(q.countryId))).toBe(true);
    expect(new Set(qs.map((q) => `${q.countryId}|${q.category}`)).size).toBe(10);
  });

  it("serves due reviews before new material", async () => {
    mockRecords.push(rec("JPN", "capital", "2000-01-01T00:00:00Z"));
    const qs = await buildSession("capital", { length: 5 });
    expect(qs[0].countryId).toBe("JPN");
  });

  it("validates filters from URLs", () => {
    expect(isCategoryFilter("flag")).toBe(true);
    expect(isCategoryFilter("mixed")).toBe(true);
    expect(isCategoryFilter("nope")).toBe(false);
    expect(isCategoryFilter(undefined)).toBe(false);
  });
});
