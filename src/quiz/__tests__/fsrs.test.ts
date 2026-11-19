import { nextIntervalDays, nextMemoryState, Rating, retrievability, type MemoryState } from "../fsrs";

/**
 * Expected values were produced by the reference implementation
 * (ts-fsrs 6.0.0, FSRS-6 default weights, short-term scheduling on). The
 * implementation was also cross-checked against it on 240,000 random review
 * steps with zero difference; these fixtures keep that parity under test.
 * Each step: [elapsed days, rating, expected stability, expected difficulty].
 */
const REFERENCE: [number, Rating, number, number][][] = [
  [[0, 3, 2.3065, 2.11810397], [2, 3, 10.96433194, 2.11121424], [11, 3, 46.28021494, 2.1043314], [43, 3, 157.32699006, 2.09745544]],
  [[0, 1, 0.212, 6.4133], [0, 3, 0.24668919, 6.40211507], [1, 3, 2.02147724, 6.39094132], [4, 1, 0.57489456, 8.79895532], [1, 3, 1.65679755, 8.78538473]],
  [[0, 3, 2.3065, 2.11810397], [0, 3, 2.3065, 2.11121424], [0, 3, 2.3065, 2.1043314]],
  [[0, 4, 8.2956, 1], [30, 2, 49.40520236, 4.01060897], [90, 1, 3.12459512, 8.01655626], [2, 3, 6.09689826, 8.00376807]],
];

describe("FSRS-6 memory model", () => {
  it.each(REFERENCE.map((h, i) => [i, h] as const))("matches the reference implementation (history %i)", (_i, history) => {
    let state: MemoryState | null = null;
    for (const [elapsed, rating, stability, difficulty] of history) {
      state = nextMemoryState(state, elapsed, rating);
      expect(state.stability).toBeCloseTo(stability, 8);
      expect(state.difficulty).toBeCloseTo(difficulty, 8);
    }
  });

  it("predicts 90% recall exactly one stability-length after a review", () => {
    expect(retrievability(0, 5)).toBe(1);
    expect(retrievability(5, 5)).toBeCloseTo(0.9, 8);
    expect(retrievability(50, 5)).toBeLessThan(0.75);
  });

  it("schedules reviews for when recall drops to the desired retention", () => {
    expect(nextIntervalDays(10)).toBe(10);
    expect(nextIntervalDays(10, 0.8)).toBeGreaterThan(10);
    expect(nextIntervalDays(0.2)).toBe(1); // at least a day
    expect(nextIntervalDays(5000, 0.9, 365)).toBe(365); // capped
  });

  it("doesn't reward cramming: same-day successes leave stability unchanged", () => {
    const first = nextMemoryState(null, 0, Rating.Good);
    expect(nextMemoryState(first, 0, Rating.Good).stability).toBe(first.stability);
  });

  it("forgetting never increases stability", () => {
    const strong = { stability: 60, difficulty: 4 };
    expect(nextMemoryState(strong, 30, Rating.Again).stability).toBeLessThan(60);
  });
});
