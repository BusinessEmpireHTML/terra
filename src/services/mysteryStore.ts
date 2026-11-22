import { kv } from "./kv";
import { isMysteryState, type MysteryState } from "../quiz/mystery";

/** The daily mystery's progress, so it can be played once a day and resumed if you leave mid-way. */
const key = (date: string) => `terra:mystery:${date}`;

export const mysteryStore = {
  async load(date: string): Promise<MysteryState | null> {
    const raw = await kv.getItemAsync(key(date));
    if (!raw) return null;
    try {
      const value: unknown = JSON.parse(raw);
      return isMysteryState(value) ? value : null;
    } catch {
      return null;
    }
  },

  async save(date: string, state: MysteryState): Promise<void> {
    await kv.setItemAsync(key(date), JSON.stringify(state));
  },
};
