import { create } from "zustand";
import { storage } from "../services/storage";

interface AppState {
  hydrated: boolean;
  favorites: Set<string>;
  recents: string[]; // cca3 codes, most recent first
  toggleFavorite: (cca3: string) => void;
  isFavorite: (cca3: string) => boolean;
  recordVisit: (cca3: string) => void;
  hydrateFromDisk: () => Promise<void>;
}

const MAX_RECENTS = 12;

export const useAppStore = create<AppState>((set, get) => ({
  hydrated: false,
  favorites: new Set(),
  recents: [],

  toggleFavorite: (cca3) =>
    set((state) => {
      const next = new Set(state.favorites);
      if (next.has(cca3)) next.delete(cca3);
      else next.add(cca3);
      storage.saveFavorites(Array.from(next)).catch(() => {});
      return { favorites: next };
    }),

  isFavorite: (cca3) => get().favorites.has(cca3),

  recordVisit: (cca3) =>
    set((state) => {
      const withoutDupe = state.recents.filter((c) => c !== cca3);
      const recents = [cca3, ...withoutDupe].slice(0, MAX_RECENTS);
      storage.saveRecents(recents).catch(() => {});
      return { recents };
    }),

  hydrateFromDisk: async () => {
    try {
      const [favorites, recents] = await Promise.all([storage.loadFavorites(), storage.loadRecents()]);
      set({ favorites: new Set(favorites), recents, hydrated: true });
    } catch {
      // Storage read failed (corrupt data, disk issue, first-run edge case).
      // Fall back to empty state rather than leaving `hydrated` false forever
      // — the caller (app/_layout.tsx) gates the splash screen on this, so
      // never resolving would soft-lock the app on a blank screen.
      set({ hydrated: true });
    }
  },
}));
