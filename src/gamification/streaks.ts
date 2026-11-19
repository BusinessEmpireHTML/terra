/** Pure date/streak helpers, kept free of storage so they're easy to test. */

/** Local calendar date as YYYY-MM-DD (not UTC — a streak follows the user's day). */
export function localDateString(d = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/** Whole calendar days from `a` to `b` (both YYYY-MM-DD). Rounded, so DST shifts don't produce 0.96-day gaps. */
export function daysBetween(a: string, b: string): number {
  const da = new Date(`${a}T00:00:00`);
  const db = new Date(`${b}T00:00:00`);
  return Math.round((db.getTime() - da.getTime()) / (24 * 60 * 60 * 1000));
}

export function addDays(date: string, delta: number): string {
  const d = new Date(`${date}T00:00:00`);
  d.setDate(d.getDate() + delta);
  return localDateString(d);
}

/**
 * Current and longest run of consecutive active days. The current streak
 * stays "alive" through today if the user practiced yesterday — it only
 * breaks once a full day is missed.
 */
export function computeStreaks(activeDates: Iterable<string>, today: string): { current: number; longest: number } {
  const dates = Array.from(new Set(activeDates)).sort(); // ascending, de-duplicated
  if (dates.length === 0) return { current: 0, longest: 0 };

  let longest = 1;
  let run = 1;
  for (let i = 1; i < dates.length; i++) {
    run = daysBetween(dates[i - 1], dates[i]) === 1 ? run + 1 : 1;
    longest = Math.max(longest, run);
  }

  let current = 0;
  const mostRecent = dates[dates.length - 1];
  if (daysBetween(mostRecent, today) <= 1) {
    current = 1;
    for (let i = dates.length - 2; i >= 0; i--) {
      if (daysBetween(dates[i], dates[i + 1]) !== 1) break;
      current++;
    }
  }
  return { current, longest };
}
