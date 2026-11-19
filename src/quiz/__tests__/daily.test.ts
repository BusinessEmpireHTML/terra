import { COUNTRIES } from "../../data/countries";
import { buildDailyQuiz, countryOfTheDay, DAILY_QUIZ_LENGTH, dailyNumber, dailyShareText } from "../daily";
import { hashString, seededRng } from "../../utils/random";

describe("Daily Quiz", () => {
  it("is identical for everyone on the same date — questions, choices and their order", () => {
    const a = buildDailyQuiz("2026-11-19");
    const b = buildDailyQuiz("2026-11-19");
    expect(a).toEqual(b);
  });

  it("changes from one day to the next", () => {
    const today = buildDailyQuiz("2026-11-19").map((q) => `${q.category}:${q.countryId}`);
    const tomorrow = buildDailyQuiz("2026-11-20").map((q) => `${q.category}:${q.countryId}`);
    expect(today).not.toEqual(tomorrow);
  });

  it("opens with the Country of the Day, then covers distinct categories and countries", () => {
    for (const date of ["2026-01-01", "2026-03-15", "2026-11-19", "2027-07-04"]) {
      const quiz = buildDailyQuiz(date);
      expect(quiz).toHaveLength(DAILY_QUIZ_LENGTH);
      expect(quiz[0].countryId).toBe(countryOfTheDay(date));
      expect(new Set(quiz.map((q) => q.category)).size).toBe(DAILY_QUIZ_LENGTH);
      expect(new Set(quiz.map((q) => q.countryId)).size).toBe(DAILY_QUIZ_LENGTH);
      expect(new Set(quiz.map((q) => q.id)).size).toBe(DAILY_QUIZ_LENGTH);
    }
  });

  it("keeps the Country of the Day stable for existing players", () => {
    expect(COUNTRIES.map((c) => c.id)).toContain(countryOfTheDay("2026-11-19"));
    expect(countryOfTheDay("2026-11-19")).toBe(countryOfTheDay("2026-11-19"));
  });

  it("numbers dailies from 1 January 2026", () => {
    expect(dailyNumber("2026-01-01")).toBe(1);
    expect(dailyNumber("2026-11-19")).toBe(323);
  });

  it("shares a spoiler-free result", () => {
    const text = dailyShareText("2026-11-19", [
      { category: "flag", correct: true },
      { category: "locate", correct: false },
      { category: "capital", correct: true },
    ]);
    expect(text).toBe("Terra Daily #323 🌍 2/3\n🟩🟥🟩\n🚩📍🏛️");
    for (const c of COUNTRIES) expect(text).not.toContain(c.name.common);
  });
});

describe("seeded RNG", () => {
  it("is reproducible and well spread", () => {
    const a = seededRng(hashString("x"));
    const b = seededRng(hashString("x"));
    const draws = Array.from({ length: 1000 }, () => a());
    expect(draws.slice(0, 5)).toEqual(Array.from({ length: 5 }, () => b()));
    expect(Math.min(...draws)).toBeGreaterThanOrEqual(0);
    expect(Math.max(...draws)).toBeLessThan(1);
    const mean = draws.reduce((s, x) => s + x, 0) / draws.length;
    expect(mean).toBeGreaterThan(0.45);
    expect(mean).toBeLessThan(0.55);
  });
});
