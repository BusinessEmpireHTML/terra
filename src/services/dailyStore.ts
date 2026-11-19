import { kv } from "./kv";
import { localDateString } from "../gamification/streaks";
import { countryOfTheDay, type DailyAnswer } from "../quiz/daily";
import type { DailyState } from "../gamification/types";

export { countryOfTheDay };

const KEY_PREFIX = "terra:daily:";


export const dailyStore = {
  async getToday(): Promise<DailyState> {
    const date = localDateString();
    const fresh: DailyState = {
      date,
      countryOfTheDayId: countryOfTheDay(date),
      dailyQuizDone: false,
      dailyQuizAnswers: null,
      speedRoundBestScore: null,
    };
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

  /** Records today's Daily Quiz result. The first attempt is the one that counts (and gets shared). */
  async markDailyQuizDone(date: string, answers: DailyAnswer[]): Promise<void> {
    const state = await this.getToday();
    if (state.date !== date || state.dailyQuizDone) return;
    await this.save({ ...state, dailyQuizDone: true, dailyQuizAnswers: answers });
  },

  async recordSpeedRoundScore(score: number): Promise<void> {
    const state = await this.getToday();
    const best = state.speedRoundBestScore == null ? score : Math.max(state.speedRoundBestScore, score);
    await this.save({ ...state, speedRoundBestScore: best });
  },
};
