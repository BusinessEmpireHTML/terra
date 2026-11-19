import { kv } from "./kv";

const FAVORITES_KEY = "terra:favorites";
const RECENTS_KEY = "terra:recents";

const THEME_MODE_KEY = "terra:themeMode";

/** Parses a stored JSON string array, treating anything malformed as empty. */
function parseStringArray(raw: string | null): string[] {
  if (!raw) return [];
  try {
    const value: unknown = JSON.parse(raw);
    return Array.isArray(value) ? value.filter((v): v is string => typeof v === "string") : [];
  } catch {
    return [];
  }
}

/**
 * Small key-value persistence for preferences and lists (favorites,
 * recently viewed, appearance). Backed by expo-sqlite's kv-store; quiz
 * progress and activity live in their own SQLite tables (see
 * progressStore / activityStore).
 */
export const storage = {
  async loadFavorites(): Promise<string[]> {
    return parseStringArray(await kv.getItemAsync(FAVORITES_KEY));
  },

  async saveFavorites(favorites: string[]): Promise<void> {
    await kv.setItemAsync(FAVORITES_KEY, JSON.stringify(favorites));
  },

  async loadRecents(): Promise<string[]> {
    return parseStringArray(await kv.getItemAsync(RECENTS_KEY));
  },

  async saveRecents(recents: string[]): Promise<void> {
    await kv.setItemAsync(RECENTS_KEY, JSON.stringify(recents));
  },

  async loadThemeMode(): Promise<string | null> {
    return kv.getItemAsync(THEME_MODE_KEY);
  },

  async saveThemeMode(mode: string): Promise<void> {
    await kv.setItemAsync(THEME_MODE_KEY, mode);
  },
};
