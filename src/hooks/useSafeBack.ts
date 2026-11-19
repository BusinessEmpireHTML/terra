import { useCallback } from "react";
import { useRouter } from "expo-router";

/**
 * `router.back()` does nothing when there's no history — a deep link, a
 * shared URL, or a refreshed page on web — leaving close/back buttons dead.
 * This falls back to the home tab instead.
 */
export function useSafeBack() {
  const router = useRouter();
  return useCallback(() => {
    if (router.canGoBack()) router.back();
    else router.replace("/");
  }, [router]);
}
