import { kv } from "./kv";

const FAVORITES_KEY = "terra:favorites";
const RECENTS_KEY = "terra:recents";

const THEME_MODE_KEY = "terra:themeMode";
const FIND_BEST_STREAK_KEY = "terra:findEndlessBestStreak";
const LANGUAGE_KEY = "terra:language";
const REMINDER_HOUR_KEY = "terra:reminderHour";

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

  async loadLanguageMode(): Promise<string | null> {
    return kv.getItemAsync(LANGUAGE_KEY);
  },

  async saveLanguageMode(mode: string): Promise<void> {
    await kv.setItemAsync(LANGUAGE_KEY, mode);
  },

  /** Reminder hour 0–23, or null when reminders are off. */
  async loadReminderHour(): Promise<number | null> {
    const raw = await kv.getItemAsync(REMINDER_HOUR_KEY);
    const n = raw == null || raw === "" ? NaN : Number(raw);
    return Number.isInteger(n) && n >= 0 && n <= 23 ? n : null;
  },

  async saveReminderHour(hour: number | null): Promise<void> {
    await kv.setItemAsync(REMINDER_HOUR_KEY, hour == null ? "" : String(hour));
  },

  /** Longest streak ever reached in endless Find it. */
  async loadFindBestStreak(): Promise<number> {
    const n = Number(await kv.getItemAsync(FIND_BEST_STREAK_KEY));
    return Number.isFinite(n) && n > 0 ? n : 0;
  },

  async saveFindBestStreak(streak: number): Promise<void> {
    await kv.setItemAsync(FIND_BEST_STREAK_KEY, String(streak));
  },
};
