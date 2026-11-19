import { kv } from "./kv";
import { COUNTRIES } from "../data/countries";
import { localDateString } from "../gamification/streaks";
import type { DailyState } from "../gamification/types";

const KEY_PREFIX = "terra:daily:";

/** Deterministic pick — the same country all day for every user, changing daily without needing a server. */
export function countryOfTheDay(date = localDateString()): string {
  let hash = 0;
  for (let i = 0; i < date.length; i++) {
    hash = (hash * 31 + date.charCodeAt(i)) >>> 0;
  }
  return COUNTRIES[hash % COUNTRIES.length].id;
}

export const dailyStore = {
  async getToday(): Promise<DailyState> {
    const date = localDateString();
    const fresh: DailyState = { date, countryOfTheDayId: countryOfTheDay(date), dailyQuizDone: false, speedRoundBestScore: null };
    const raw = await kv.getItemAsync(KEY_PREFIX + date);
    if (!raw) return fresh;
    try {
      return { ...fresh, ...(JSON.parse(raw) as Partial<DailyState>) };
    } catch {
      return fresh; // corrupt entry: start the day over rather than crash the Learn tab
    }
  },

  async save(state: DailyState): Promise<void> {
    await kv.setItemAsync(KEY_PREFIX + state.date, JSON.stringify(state));
  },

  async markDailyQuizDone(): Promise<void> {
    const state = await this.getToday();
    await this.save({ ...state, dailyQuizDone: true });
  },

  async recordSpeedRoundScore(score: number): Promise<void> {
    const state = await this.getToday();
    const best = state.speedRoundBestScore == null ? score : Math.max(state.speedRoundBestScore, score);
    await this.save({ ...state, speedRoundBestScore: best });
  },
};
