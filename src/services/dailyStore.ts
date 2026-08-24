import { Storage } from "expo-sqlite/kv-store";
import { COUNTRIES } from "../data/countries";
import { localDateString } from "./activityStore";
import type { DailyState } from "../gamification/types";

const KEY_PREFIX = "terra:daily:";

/** Deterministic pick — same country all day for everyone on this device, changes daily without needing a server. */
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
    const raw = await Storage.getItemAsync(KEY_PREFIX + date);
    if (raw) return JSON.parse(raw) as DailyState;
    return { date, countryOfTheDayId: countryOfTheDay(date), dailyQuizDone: false, speedRoundBestScore: null };
  },

  async save(state: DailyState): Promise<void> {
    await Storage.setItemAsync(KEY_PREFIX + state.date, JSON.stringify(state));
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
