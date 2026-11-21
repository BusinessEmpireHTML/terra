import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../theme/ThemeProvider";
import { PrimaryButton } from "../ui/Primitives";
import { dailyNumber, dailyShareText, type DailyAnswer } from "../../quiz/daily";
import { QUIZ_CATEGORIES } from "../../quiz/types";
import { shareText, type ShareOutcome } from "../../utils/share";
import { useT } from "../../i18n/useT";
import { DENSE_TEXT_MAX_SCALE } from "../../theme/tokens";

function untilMidnight(now = new Date()): string {
  const midnight = new Date(now);
  midnight.setHours(24, 0, 0, 0);
  const minutes = Math.max(0, Math.ceil((midnight.getTime() - now.getTime()) / 60000));
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

/** The shareable result of today's Daily Quiz: score, one square per question, and the share button. */
export function DailyResultCard({ date, answers }: { date: string; answers: DailyAnswer[] }) {
  const { colors, type, space, radius } = useTheme();
  const t = useT();
  const [outcome, setOutcome] = useState<ShareOutcome | null>(null);
  const [countdown, setCountdown] = useState(() => untilMidnight());
  const score = answers.filter((a) => a.correct).length;

  useEffect(() => {
    const id = setInterval(() => setCountdown(untilMidnight()), 30_000);
    return () => clearInterval(id);
  }, []);

  const status =
    outcome === "copied" ? t("challenge.copied") : outcome === "failed" ? t("challenge.shareFailed") : outcome === "shared" ? t("daily.shared") : null;

  return (
    <View style={{ alignSelf: "stretch", alignItems: "center" }}>
      <View
        accessible
        accessibilityLabel={t("daily.resultA11y", { number: dailyNumber(date), score, total: answers.length })}
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
        <Text maxFontSizeMultiplier={DENSE_TEXT_MAX_SCALE} style={[type.label, { color: colors.accent }]}>
          {t("daily.cardTitle", { number: dailyNumber(date) }).toUpperCase()}
        </Text>
        <Text style={[type.hero, { color: colors.textPrimary, marginTop: space.xs }]}>
          {score}/{answers.length}
        </Text>
        <View style={{ flexDirection: "row", gap: space.sm, marginTop: space.md }}>
          {answers.map((a, i) => {
            const meta = QUIZ_CATEGORIES.find((c) => c.key === a.category);
            return (
              <View key={i} style={{ alignItems: "center", gap: 6 }}>
                <View
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: 8,
                    backgroundColor: a.correct ? colors.accentSecondary : colors.ember,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Ionicons name={a.correct ? "checkmark" : "close"} size={20} color="#fff" />
                </View>
                <Ionicons name={(meta?.icon ?? "help-outline") as React.ComponentProps<typeof Ionicons>["name"]} size={14} color={colors.textMuted} />
              </View>
            );
          })}
        </View>
      </View>

      <PrimaryButton
        label={t("daily.share")}
        onPress={async () => setOutcome(await shareText(dailyShareText(date, answers)))}
        accessibilityHint={t("daily.shareHint")}
        style={{ marginTop: space.md, alignSelf: "stretch" }}
      />
      <Text style={[type.bodySmall, { color: colors.textMuted, marginTop: space.sm, minHeight: 18 }]} accessibilityLiveRegion="polite">
        {status ?? t("daily.nextIn", { time: countdown })}
      </Text>
    </View>
  );
}
