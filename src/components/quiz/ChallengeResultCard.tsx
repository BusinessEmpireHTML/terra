import React, { useState } from "react";
import { Text, View } from "react-native";
import * as Linking from "expo-linking";
import { useTheme } from "../../theme/ThemeProvider";
import { DENSE_TEXT_MAX_SCALE } from "../../theme/tokens";
import { PrimaryButton } from "../ui/Primitives";
import { useT } from "../../i18n/useT";
import { CHALLENGE_LENGTH, CHALLENGE_MAX_POINTS, encodeChallenge, formatChallengeCode } from "../../quiz/challenge";
import { shareText, type ShareOutcome } from "../../utils/share";

/** Result of a friend challenge: your score, the head-to-head verdict, and a code to send on. */
export function ChallengeResultCard({ seed, points, opponentScore }: { seed: number; points: number; opponentScore: number | null }) {
  const { colors, type, space, radius } = useTheme();
  const t = useT();
  const [outcome, setOutcome] = useState<ShareOutcome | null>(null);
  const code = encodeChallenge({ seed, score: points });
  const verdict =
    opponentScore == null ? null : points > opponentScore ? t("challenge.youWin") : points < opponentScore ? t("challenge.youLose") : t("challenge.tie");

  const share = async () => {
    const message = t("challenge.shareText", {
      points,
      max: CHALLENGE_MAX_POINTS,
      count: CHALLENGE_LENGTH,
      code: formatChallengeCode(code),
      link: Linking.createURL(`challenge/${code}`),
    });
    setOutcome(await shareText(message));
  };

  const status =
    outcome === "copied" ? t("challenge.copied") : outcome === "shared" ? t("challenge.shared") : outcome === "failed" ? t("challenge.shareFailed") : null;

  return (
    <View style={{ alignSelf: "stretch", alignItems: "center" }}>
      <View
        accessible
        accessibilityLabel={[t("challenge.youScored", { points, max: CHALLENGE_MAX_POINTS }), verdict].filter(Boolean).join(". ")}
        style={{
          alignSelf: "stretch",
          alignItems: "center",
          backgroundColor: colors.surfaceRaised,
          borderRadius: radius.lg,
          borderWidth: 1,
          borderColor: colors.accent,
          paddingVertical: space.lg,
          paddingHorizontal: space.md,
        }}
      >
        {verdict && <Text style={[type.title, { color: colors.textPrimary, textAlign: "center" }]}>{verdict}</Text>}
        <Text style={[type.hero, { color: colors.textPrimary, marginTop: space.xs }]}>
          {points}/{CHALLENGE_MAX_POINTS}
        </Text>
        {opponentScore != null && (
          <Text style={[type.body, { color: colors.textMuted, marginTop: space.xs }]}>{t("challenge.versus", { mine: points, theirs: opponentScore })}</Text>
        )}
        <Text maxFontSizeMultiplier={DENSE_TEXT_MAX_SCALE} style={[type.label, { color: colors.textMuted, marginTop: space.md }]}>
          {t("challenge.codeLabel").toUpperCase()}
        </Text>
        <Text selectable style={[type.data, { color: colors.accent, fontSize: 22, letterSpacing: 2, marginTop: 2 }]}>
          {formatChallengeCode(code)}
        </Text>
      </View>
      <PrimaryButton
        label={opponentScore == null ? t("challenge.send") : t("challenge.sendBack")}
        onPress={share}
        style={{ marginTop: space.md, alignSelf: "stretch" }}
      />
      {status && (
        <Text accessibilityLiveRegion="polite" style={[type.bodySmall, { color: colors.textMuted, marginTop: space.sm }]}>
          {status}
        </Text>
      )}
    </View>
  );
}
