/**
 * Tiny localStorage helpers for the web build. expo-sqlite has no web
 * implementation in Expo SDK 52, so the `*.web.ts` stores keep the same
 * data as JSON instead. Every access is guarded: localStorage is missing
 * during static rendering (Node) and can throw in private browsing.
 */
export function readItem(key: string): string | null {
  try {
    return globalThis.localStorage?.getItem(key) ?? null;
  } catch {
    return null;
  }
}

export function writeItem(key: string, value: string): void {
  try {
    globalThis.localStorage?.setItem(key, value);
  } catch {
    // Quota exceeded or storage disabled: keep running without persistence.
  }
}

/** A JSON array persisted under one key — the web stand-in for a SQLite table. */
export function jsonTable<T>(key: string) {
  return {
    read(): T[] {
      const raw = readItem(key);
      if (!raw) return [];
      try {
        const value: unknown = JSON.parse(raw);
        return Array.isArray(value) ? (value as T[]) : [];
      } catch {
        return [];
      }
    },
    write(rows: T[]): void {
      writeItem(key, JSON.stringify(rows));
    },
  };
}
