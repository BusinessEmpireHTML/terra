import { create } from "zustand";
import { storage } from "../services/storage";

export type ThemeMode = "light" | "dark" | "system";
const THEME_MODES: ThemeMode[] = ["light", "dark", "system"];

interface AppState {
  hydrated: boolean;
  favorites: Set<string>;
  recents: string[]; // cca3 codes, most recent first
  themeMode: ThemeMode;
  toggleFavorite: (cca3: string) => void;
  recordVisit: (cca3: string) => void;
  setThemeMode: (mode: ThemeMode) => void;
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

  hydrateFromDisk: async () => {
    try {
      const [favorites, recents, themeMode] = await withTimeout(
        Promise.all([storage.loadFavorites(), storage.loadRecents(), storage.loadThemeMode()]),
        HYDRATE_TIMEOUT_MS
      );
      set({
        favorites: new Set(favorites),
        recents,
        themeMode: THEME_MODES.includes(themeMode as ThemeMode) ? (themeMode as ThemeMode) : "system",
        hydrated: true,
      });
    } catch {
      // Storage read failed or hung (corrupt data, disk issue, first-run edge case).
      // Fall back to empty state rather than leaving `hydrated` false forever
      // — the caller (app/_layout.tsx) gates the splash screen on this, so
      // never resolving would soft-lock the app on a blank screen.
      set({ hydrated: true });
    }
  },
}));
