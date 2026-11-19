// Native key-value store (SQLite-backed). The web build uses kv.web.ts.
import { Storage } from "expo-sqlite/kv-store";

export interface KeyValueStore {
  getItemAsync(key: string): Promise<string | null>;
  setItemAsync(key: string, value: string): Promise<void>;
}

export const kv: KeyValueStore = Storage;
