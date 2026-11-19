import { readItem, writeItem } from "./webStorage";
import type { KeyValueStore } from "./kv";

export type { KeyValueStore };

export const kv: KeyValueStore = {
  async getItemAsync(key) {
    return readItem(key);
  },
  async setItemAsync(key, value) {
    writeItem(key, value);
  },
};
