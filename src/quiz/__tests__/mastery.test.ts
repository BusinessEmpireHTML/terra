import { availableCategoriesFor, computeAllMastery, computeMastery, overallStats } from "../mastery";
import { MAX_BOX } from "../srs";
import type { ProgressRecord, QuizCategory } from "../types";

function record(countryId: string, category: QuizCategory, box: number, correct = 1, incorrect = 0): ProgressRecord {
  return { countryId, category, box, correctCount: correct, incorrectCount: incorrect, dueAt: new Date().toISOString(), lastReviewedAt: null };
}

describe("mastery", () => {
  it("is zero before any practice", () => {
    const m = computeMastery("FRA", []);
    expect(m.score).toBe(0);
    expect(m.level).toBe("explorer");
    expect(m.categoriesAvailable).toBe(7);
  });

  it("requires breadth: one perfect category isn't mastery", () => {
    const m = computeMastery("FRA", [record("FRA", "flag", MAX_BOX)]);
    expect(m.score).toBe(Math.round(100 / 7));
  });

  it("lets an island nation reach Legend (no neighbor category to block it)", () => {
    const categories = availableCategoriesFor("ISL");
    expect(categories).not.toContain("neighbor");
    const m = computeMastery("ISL", categories.map((c) => record("ISL", c, MAX_BOX)));
    expect(m.score).toBe(100);
    expect(m.level).toBe("legend");
  });

  it("lets a microstate with no outline or neighbors reach Legend too", () => {
    const categories = availableCategoriesFor("TUV");
    expect(categories).not.toContain("shape");
    const m = computeMastery("TUV", categories.map((c) => record("TUV", c, MAX_BOX)));
    expect(m.score).toBe(100);
  });

  it("ignores records for categories that don't apply, so coverage can't exceed 100%", () => {
    const records = [...availableCategoriesFor("ISL").map((c) => record("ISL", c, MAX_BOX)), record("ISL", "neighbor", MAX_BOX)];
    expect(computeMastery("ISL", records).score).toBe(100);
  });

  it("ignores untouched records", () => {
    const m = computeMastery("FRA", [record("FRA", "flag", 3, 0, 0)]);
    expect(m.categoriesAttempted).toBe(0);
  });

  it("groups records per country and summarizes overall stats", () => {
    const records = [record("FRA", "flag", 2, 3, 1), record("DEU", "capital", 1, 1, 1)];
    const all = computeAllMastery(records);
    expect([...all.keys()].sort()).toEqual(["DEU", "FRA"]);
    expect(overallStats(records)).toMatchObject({ countriesStarted: 2, countriesMastered: 0, totalAnswered: 6, accuracy: 67 });
  });
});
