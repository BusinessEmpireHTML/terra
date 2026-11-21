import { create } from "zustand";
import { storage } from "../services/storage";
import { isLang, setCurrentLanguage, type Lang } from "../i18n/core";
import { deviceLanguage } from "../i18n/device";

export type ThemeMode = "light" | "dark" | "system";
const THEME_MODES: ThemeMode[] = ["light", "dark", "system"];
export type LanguageMode = Lang | "system";

function applyLanguage(mode: LanguageMode) {
  setCurrentLanguage(mode === "system" ? deviceLanguage() : mode);
}

interface AppState {
  hydrated: boolean;
  favorites: Set<string>;
  recents: string[]; // cca3 codes, most recent first
  themeMode: ThemeMode;
  languageMode: LanguageMode;
  /** Hour (0–23) of the daily streak reminder, or null when reminders are off. */
  reminderHour: number | null;
  toggleFavorite: (cca3: string) => void;
  recordVisit: (cca3: string) => void;
  setThemeMode: (mode: ThemeMode) => void;
  setLanguageMode: (mode: LanguageMode) => void;
  setReminderHour: (hour: number | null) => void;
  hydrateFromDisk: () => Promise<void>;
}

const MAX_RECENTS = 12;
/** The splash screen waits on hydration, so a storage call that never settles must not hang the app. */
const HYDRATE_TIMEOUT_MS = 4000;

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(`Timed out after ${ms}ms`)), ms);
    promise.then(
      (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      (err) => {
        clearTimeout(timer);
        reject(err);
      }
    );
  });
}

export const useAppStore = create<AppState>((set, get) => ({
  hydrated: false,
  favorites: new Set(),
  recents: [],
  themeMode: "system",
  languageMode: "system",
  reminderHour: null,

  toggleFavorite: (cca3) => {
    const next = new Set(get().favorites);
    if (next.has(cca3)) next.delete(cca3);
    else next.add(cca3);
    set({ favorites: next });
    storage.saveFavorites(Array.from(next)).catch(() => {});
  },

  recordVisit: (cca3) => {
    const recents = [cca3, ...get().recents.filter((c) => c !== cca3)].slice(0, MAX_RECENTS);
    set({ recents });
    storage.saveRecents(recents).catch(() => {});
  },

  setThemeMode: (mode) => {
    set({ themeMode: mode });
    storage.saveThemeMode(mode).catch(() => {});
  },

  setLanguageMode: (mode) => {
    applyLanguage(mode);
    set({ languageMode: mode });
    storage.saveLanguageMode(mode).catch(() => {});
  },

  setReminderHour: (hour) => {
    set({ reminderHour: hour });
    storage.saveReminderHour(hour).catch(() => {});
  },

  hydrateFromDisk: async () => {
    try {
      const [favorites, recents, themeMode, languageMode, reminderHour] = await withTimeout(
        Promise.all([storage.loadFavorites(), storage.loadRecents(), storage.loadThemeMode(), storage.loadLanguageMode(), storage.loadReminderHour()]),
        HYDRATE_TIMEOUT_MS
      );
      const language: LanguageMode = isLang(languageMode) ? languageMode : "system";
      applyLanguage(language);
      set({
        favorites: new Set(favorites),
        recents,
        themeMode: THEME_MODES.includes(themeMode as ThemeMode) ? (themeMode as ThemeMode) : "system",
        languageMode: language,
        reminderHour,
        hydrated: true,
      });
    } catch {
      // Storage read failed or hung (corrupt data, disk issue, first-run edge case).
      // Fall back to empty state rather than leaving `hydrated` false forever
      // — the caller (app/_layout.tsx) gates the splash screen on this, so
      // never resolving would soft-lock the app on a blank screen.
      applyLanguage("system");
      set({ hydrated: true });
    }
  },
}));
