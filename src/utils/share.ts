import { Platform, Share } from "react-native";
import * as Clipboard from "expo-clipboard";

export type ShareOutcome = "shared" | "copied" | "cancelled" | "failed";

/**
 * Opens the system share sheet with `message`. Browsers without the Web
 * Share API (most desktop browsers) get the text copied to the clipboard
 * instead, so the button always does something useful.
 */
export async function shareText(message: string): Promise<ShareOutcome> {
  const canShare = Platform.OS !== "web" || (typeof navigator !== "undefined" && typeof navigator.share === "function");
  if (canShare) {
    try {
      const result = await Share.share({ message });
      return result.action === Share.dismissedAction ? "cancelled" : "shared";
    } catch (err) {
      if ((err as { name?: string })?.name === "AbortError") return "cancelled"; // user closed the web share sheet
    }
  }
  try {
    return (await Clipboard.setStringAsync(message)) ? "copied" : "failed";
  } catch {
    return "failed";
  }
}
