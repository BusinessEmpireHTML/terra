import { applyAnswer, isDue, MAX_BOX, newProgressRecord, recallProbability, strengthLevel } from "../srs";
import type { ProgressRecord } from "../types";

const DAY = 24 * 60 * 60 * 1000;
const start = new Date("2026-06-01T12:00:00Z");
const at = (days: number) => new Date(start.getTime() + days * DAY);
const daysUntilDue = (r: ProgressRecord, from: Date) => Math.round((new Date(r.dueAt).getTime() - from.getTime()) / DAY);

describe("FSRS scheduling", () => {
  it("starts new records unseen and due immediately", () => {
    const r = newProgressRecord("FRA", "flag", start);
    expect(r.box).toBe(0);
    expect(r.stability).toBeNull();
    expect(isDue(r, start)).toBe(true);
    expect(recallProbability(r, start)).toBeNull();
  });

  it("spaces reviews further apart as answers keep being right", () => {
    let r = newProgressRecord("FRA", "flag", start);
    let now = start;
    const intervals: number[] = [];
    for (let i = 0; i < 4; i++) {
      r = applyAnswer(r, true, now);
      const gap = daysUntilDue(r, now);
      intervals.push(gap);
      now = at(intervals.reduce((a, b) => a + b, 0));
    }
    // Matches the FSRS reference for reviews taken exactly when due…
    expect(intervals.slice(0, 3)).toEqual([2, 11, 46]);
    // …and keeps growing by a large factor while answers stay right.
    expect(intervals[3]).toBeGreaterThan(intervals[2] * 3);
    expect(r.box).toBe(MAX_BOX);
    expect(r.correctCount).toBe(4);
  });

  it("brings a missed answer back within the next session", () => {
    const r = applyAnswer(newProgressRecord("FRA", "flag", start), false, start);
    expect(new Date(r.dueAt).getTime() - start.getTime()).toBe(10 * 60 * 1000);
    expect(r.incorrectCount).toBe(1);
    expect(r.box).toBe(0);
  });

  it("loses strength after a lapse", () => {
    let r = newProgressRecord("FRA", "flag", start);
    r = applyAnswer(r, true, start);
    r = applyAnswer(r, true, at(2));
    r = applyAnswer(r, true, at(13));
    const before = r.box;
    r = applyAnswer(r, false, at(60));
    expect(r.box).toBeLessThan(before);
  });

  it("migrates pre-FSRS Leitner records instead of resetting them", () => {
    const legacy: ProgressRecord = { countryId: "FRA", category: "flag", box: 4, correctCount: 4, incorrectCount: 0, dueAt: at(0).toISOString(), lastReviewedAt: at(-16).toISOString() };
    expect(recallProbability(legacy, at(0))).toBeCloseTo(0.9, 2); // box 4 ≈ 16-day stability
    const next = applyAnswer(legacy, true, at(0));
    expect(next.stability).toBeGreaterThan(16);
    expect(next.box).toBe(MAX_BOX);
  });

  it("maps stability to strength levels", () => {
    expect([0.2, 1, 2.3, 7, 20, 40].map(strengthLevel)).toEqual([0, 1, 1, 3, 4, 5]);
  });
});
