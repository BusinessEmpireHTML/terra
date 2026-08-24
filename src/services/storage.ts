import { Storage } from "expo-sqlite/kv-store";

const FAVORITES_KEY = "terra:favorites";
const RECENTS_KEY = "terra:recents";

/**
 * Small persistence layer for Phase 1 (favorites + recently-viewed).
 * Backed by expo-sqlite's kv-store, so it's already the real SQLite path
 * this app will grow into for quiz progress, mastery, and stats in later
 * phases — no migration needed, just more keys.
 */
export const storage = {
  async loadFavorites(): Promise<string[]> {
    const raw = await Storage.getItemAsync(FAVORITES_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  },

  async saveFavorites(favorites: string[]): Promise<void> {
    await Storage.setItemAsync(FAVORITES_KEY, JSON.stringify(favorites));
  },

  async loadRecents(): Promise<string[]> {
    const raw = await Storage.getItemAsync(RECENTS_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  },

  async saveRecents(recents: string[]): Promise<void> {
    await Storage.setItemAsync(RECENTS_KEY, JSON.stringify(recents));
  },
};
