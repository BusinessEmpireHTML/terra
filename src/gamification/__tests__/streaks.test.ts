import { addDays, computeStreaks, daysBetween, localDateString } from "../streaks";

describe("date helpers", () => {
  it("formats local dates as YYYY-MM-DD", () => {
    expect(localDateString(new Date(2026, 0, 5))).toBe("2026-01-05");
  });

  it("counts whole days, including across month and year boundaries", () => {
    expect(daysBetween("2026-01-31", "2026-02-01")).toBe(1);
    expect(daysBetween("2025-12-31", "2026-01-01")).toBe(1);
    expect(daysBetween("2026-03-01", "2026-03-31")).toBe(30);
  });

  it("adds days", () => {
    expect(addDays("2026-02-27", 2)).toBe("2026-03-01");
    expect(addDays("2026-01-01", -1)).toBe("2025-12-31");
  });
});

describe("computeStreaks", () => {
  it("is zero with no activity", () => {
    expect(computeStreaks([], "2026-05-10")).toEqual({ current: 0, longest: 0 });
  });

  it("counts a run ending today", () => {
    expect(computeStreaks(["2026-05-08", "2026-05-09", "2026-05-10"], "2026-05-10")).toEqual({ current: 3, longest: 3 });
  });

  it("keeps the streak alive through today if the user practiced yesterday", () => {
    expect(computeStreaks(["2026-05-08", "2026-05-09"], "2026-05-10").current).toBe(2);
  });

  it("breaks the current streak after a missed day but remembers the longest", () => {
    const dates = ["2026-05-01", "2026-05-02", "2026-05-03", "2026-05-04", "2026-05-07"];
    expect(computeStreaks(dates, "2026-05-10")).toEqual({ current: 0, longest: 4 });
  });

  it("ignores duplicates and input order", () => {
    expect(computeStreaks(["2026-05-10", "2026-05-09", "2026-05-10"], "2026-05-10")).toEqual({ current: 2, longest: 2 });
  });
});
