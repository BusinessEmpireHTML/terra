import { Platform } from "react-native";
import * as Linking from "expo-linking";

/**
 * Where the web build is hosted below the domain root ("" locally, "/terra" on
 * GitHub Pages). Expo inlines this from `experiments.baseUrl` at build time.
 */
export const WEB_BASE_URL = process.env.EXPO_BASE_URL ?? "";

/** A file in public/ (e.g. "canvaskit.wasm"), resolved against the base URL. */
export function publicAsset(file: string): string {
  return `${WEB_BASE_URL}/${file}`;
}

/**
 * A link to an in-app path that someone else can open: a full web address on
 * the web (including the base path, which expo-linking leaves out), the app's
 * own URL scheme on iOS and Android.
 */
export function shareableUrl(path: string): string {
  const clean = path.replace(/^\//, "");
  if (Platform.OS === "web" && typeof window !== "undefined") return `${window.location.origin}${WEB_BASE_URL}/${clean}`;
  return Linking.createURL(clean);
}
