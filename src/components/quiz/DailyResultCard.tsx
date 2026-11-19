import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../theme/ThemeProvider";
import { PrimaryButton } from "../ui/Primitives";
import { dailyNumber, dailyShareText, type DailyAnswer } from "../../quiz/daily";
import { QUIZ_CATEGORIES } from "../../quiz/types";
import { shareText, type ShareOutcome } from "../../utils/share";

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
  const [outcome, setOutcome] = useState<ShareOutcome | null>(null);
  const [countdown, setCountdown] = useState(() => untilMidnight());
  const score = answers.filter((a) => a.correct).length;

  useEffect(() => {
    const id = setInterval(() => setCountdown(untilMidnight()), 30_000);
    return () => clearInterval(id);
  }, []);

  const status =
    outcome === "copied" ? "Copied to your clipboard" : outcome === "failed" ? "Couldn't share — try again" : outcome === "shared" ? "Shared!" : null;

  return (
    <View style={{ alignSelf: "stretch", alignItems: "center" }}>
      <View
        accessible
        accessibilityLabel={`Terra Daily number ${dailyNumber(date)}: ${score} out of ${answers.length} correct`}
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
        <Text style={[type.label, { color: colors.accent }]}>TERRA DAILY #{dailyNumber(date)}</Text>
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
        label="Share result"
        onPress={async () => setOutcome(await shareText(dailyShareText(date, answers)))}
        accessibilityHint="Shares your score without spoiling the answers"
        style={{ marginTop: space.md, alignSelf: "stretch" }}
      />
      <Text style={[type.bodySmall, { color: colors.textMuted, marginTop: space.sm, minHeight: 18 }]} accessibilityLiveRegion="polite">
        {status ?? `Next Daily in ${countdown} — same questions for everyone`}
      </Text>
    </View>
  );
}
