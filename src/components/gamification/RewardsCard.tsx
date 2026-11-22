import React from "react";
import { Text, View } from "react-native";
import { useTheme } from "../../theme/ThemeProvider";
import { DENSE_TEXT_MAX_SCALE } from "../../theme/tokens";
import { useT } from "../../i18n/useT";
import { achievementTitle, expeditionTitle } from "../../i18n/catalog";
import type { Achievement, Expedition } from "../../gamification/types";

/** What a finished session earned: new passport stamps and achievements. Renders nothing if there are none. */
export function RewardsCard({ achievements, stamps = [] }: { achievements: Achievement[]; stamps?: Expedition[] }) {
  const { colors, type, space, radius } = useTheme();
  const t = useT();
  if (achievements.length === 0 && stamps.length === 0) return null;
  return (
    <View
      accessibilityLiveRegion="polite"
      style={{ marginTop: space.lg, alignItems: "center", padding: space.md, borderRadius: radius.md, borderWidth: 1, borderColor: colors.accent, alignSelf: "stretch" }}
    >
      {stamps.length > 0 && (
        <>
          <Text maxFontSizeMultiplier={DENSE_TEXT_MAX_SCALE} style={[type.label, { color: colors.accentSecondary }]}>
            {(stamps.length > 1 ? t("passport.newStamps") : t("passport.newStamp")).toUpperCase()}
          </Text>
          {stamps.map((e) => (
            <Text key={e.id} style={[type.body, { color: colors.textPrimary, marginTop: 4, textAlign: "center" }]}>
              🛂 {expeditionTitle(e, t.lang)}
            </Text>
          ))}
        </>
      )}
      {achievements.length > 0 && (
        <>
          <Text maxFontSizeMultiplier={DENSE_TEXT_MAX_SCALE} style={[type.label, { color: colors.accent, marginTop: stamps.length > 0 ? space.sm : 0 }]}>
            {(achievements.length > 1 ? t("quiz.achievementsUnlocked") : t("quiz.achievementUnlocked")).toUpperCase()}
          </Text>
          {achievements.map((a) => (
            <Text key={a.id} style={[type.body, { color: colors.textPrimary, marginTop: 4, textAlign: "center" }]}>
              🏅 {achievementTitle(a, t.lang)}
            </Text>
          ))}
        </>
      )}
    </View>
  );
}
