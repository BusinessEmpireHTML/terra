import { applyAnswer, isDue, MAX_BOX, newProgressRecord } from "../srs";

const DAY = 24 * 60 * 60 * 1000;
const now = new Date("2026-06-01T12:00:00Z");

describe("Leitner SRS", () => {
  it("starts new records in box 0, due immediately", () => {
    const r = newProgressRecord("FRA", "flag", now);
    expect(r.box).toBe(0);
    expect(isDue(r, now)).toBe(true);
  });

  it("moves up one box per correct answer with growing intervals", () => {
    let r = newProgressRecord("FRA", "flag", now);
    const intervals: number[] = [];
    for (let i = 0; i < 6; i++) {
      r = applyAnswer(r, true, now);
      intervals.push(Math.round((new Date(r.dueAt).getTime() - now.getTime()) / DAY));
    }
    expect(r.box).toBe(MAX_BOX);
    expect(intervals).toEqual([1, 3, 7, 16, 35, 35]);
    expect(r.correctCount).toBe(6);
  });

  it("drops two boxes on a wrong answer, never below zero", () => {
    let r = { ...newProgressRecord("FRA", "flag", now), box: 4 };
    r = applyAnswer(r, false, now);
    expect(r.box).toBe(2);
    r = applyAnswer(applyAnswer(r, false, now), false, now);
    expect(r.box).toBe(0);
    expect(r.incorrectCount).toBe(3);
  });

  it("is not due before its interval elapses", () => {
    const r = applyAnswer(newProgressRecord("FRA", "flag", now), true, now);
    expect(isDue(r, new Date(now.getTime() + DAY / 2))).toBe(false);
    expect(isDue(r, new Date(now.getTime() + DAY))).toBe(true);
  });
});
