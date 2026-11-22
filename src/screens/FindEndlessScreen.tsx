import React, { useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { GradientBackground, PrimaryButton } from "../components/ui/Primitives";
import { LocateCard } from "../components/quiz/LocateCard";
import { useTheme } from "../theme/ThemeProvider";
import { useEndlessLocate } from "../quiz/useEndlessLocate";
import { whenAnswersSaved } from "../quiz/answerRecorder";
import { checkForRewards } from "../gamification/checkAchievements";
import { RewardsCard } from "../components/gamification/RewardsCard";
import { useSafeBack } from "../hooks/useSafeBack";
import { useT } from "../i18n/useT";
import type { Achievement, Expedition } from "../gamification/types";
import { DENSE_TEXT_MAX_SCALE } from "../theme/tokens";

/** Endless "Find it on the globe": keep going as long as you like; your best streak is saved. */
export default function FindEndlessScreen() {
  const { colors, type, space } = useTheme();
  const goBack = useSafeBack();
  const t = useT();
  const game = useEndlessLocate();
  const [ended, setEnded] = useState(false);
  const [newAchievements, setNewAchievements] = useState<Achievement[]>([]);
  const [newStamps, setNewStamps] = useState<Expedition[]>([]);

  useEffect(() => {
    if (!ended) return;
    let cancelled = false;
    whenAnswersSaved()
      .then(() => checkForRewards())
      .then((rewards) => {
        if (cancelled) return;
        setNewAchievements(rewards.achievements);
        setNewStamps(rewards.stamps);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [ended]);

  const end = () => (game.attempts > 0 ? setEnded(true) : goBack());

  if (ended) {
    return (
      <GradientBackground>
        <SafeAreaView style={{ flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: space.xl }}>
          <Text style={{ fontSize: 56 }} accessible={false}>
            🧭
          </Text>
          <Text style={[type.hero, { color: colors.textPrimary, marginTop: space.md, fontSize: 32 }]}>
            {t("endless.points", { points: game.points })}
          </Text>
          <Text style={[type.body, { color: colors.textMuted, marginTop: 4, textAlign: "center" }]}>
            {t("endless.foundLine", { found: game.found, attempts: game.attempts })}
            {game.xpEarned > 0 ? ` · +${game.xpEarned} XP` : ""}
          </Text>
          <Text style={[type.body, { color: colors.textSecondary, marginTop: space.md, textAlign: "center" }]}>
            {t("endless.runBest", { streak: game.runBest })}
          </Text>
          <Text maxFontSizeMultiplier={DENSE_TEXT_MAX_SCALE} style={[type.label, { color: game.isNewBest ? colors.accent : colors.textMuted, marginTop: space.xs }]}>
            {(game.isNewBest ? t("endless.newBest") : t("endless.bestEver", { streak: game.bestEver })).toUpperCase()}
          </Text>
          <RewardsCard achievements={newAchievements} stamps={newStamps} />
          <PrimaryButton label={t("common.done")} onPress={goBack} style={{ marginTop: space.xl, width: "100%" }} />
        </SafeAreaView>
      </GradientBackground>
    );
  }

  return (
    <GradientBackground>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ flexDirection: "row", alignItems: "center", paddingHorizontal: space.lg, paddingTop: space.sm }}>
          <Pressable onPress={end} hitSlop={12} accessibilityRole="button" accessibilityLabel={t("endless.end")}>
            <Ionicons name="close" size={26} color={colors.textPrimary} />
          </Pressable>
          <View style={{ flex: 1, alignItems: "center" }}>
            <Text maxFontSizeMultiplier={DENSE_TEXT_MAX_SCALE} style={[type.section, { color: colors.textMuted }]}>{t("endless.title").toUpperCase()}</Text>
          </View>
          <View style={{ width: 26 }} />
        </View>

        <View
          accessible
          accessibilityLabel={t("endless.hudA11y", { points: game.points, found: game.found, streak: game.streak, best: game.bestEver })}
          style={{ flexDirection: "row", justifyContent: "center", gap: space.lg, marginTop: space.sm }}
        >
          <Stat label={t("endless.statPoints")} value={game.points} highlight />
          <Stat label={t("endless.statFound")} value={game.found} />
          <Stat label={t("endless.statStreak")} value={game.streak} highlight={game.streak > 0 && game.streak >= game.bestEver} />
          <Stat label={t("endless.statBest")} value={game.bestEver} />
        </View>

        {game.question ? (
          <View style={{ flex: 1, paddingTop: space.sm }}>
            <LocateCard question={game.question} answered={game.answered} onSelect={game.submit} />
          </View>
        ) : (
          <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
            <Text style={[type.body, { color: colors.textMuted }]}>{t("endless.loading")}</Text>
          </View>
        )}

        {game.answered && (
          <View style={{ paddingHorizontal: space.lg, paddingBottom: space.md }}>
            <PrimaryButton label={t("endless.next")} onPress={game.next} />
          </View>
        )}
      </SafeAreaView>
    </GradientBackground>
  );
}

function Stat({ label, value, highlight }: { label: string; value: number; highlight?: boolean }) {
  const { colors, type } = useTheme();
  return (
    <View style={{ alignItems: "center", minWidth: 56 }}>
      <Text style={[type.data, { color: highlight ? colors.accent : colors.textPrimary, fontSize: 20 }]}>{value}</Text>
      <Text maxFontSizeMultiplier={DENSE_TEXT_MAX_SCALE} style={[type.label, { color: colors.textMuted, fontSize: 9 }]}>{label.toUpperCase()}</Text>
    </View>
  );
}
