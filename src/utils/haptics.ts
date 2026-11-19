import { Platform } from "react-native";
import * as Haptics from "expo-haptics";

/** A light tap of haptic feedback. No-op on web (expo-haptics rejects there) and never throws. */
export function tapFeedback(): void {
  if (Platform.OS === "web") return;
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
}
