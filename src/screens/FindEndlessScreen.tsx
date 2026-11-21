import React, { useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { GradientBackground, PrimaryButton } from "../components/ui/Primitives";
import { LocateCard } from "../components/quiz/LocateCard";
import { useTheme } from "../theme/ThemeProvider";
import { useEndlessLocate } from "../quiz/useEndlessLocate";
import { whenAnswersSaved } from "../quiz/answerRecorder";
import { checkForNewAchievements } from "../gamification/checkAchievements";
import { useSafeBack } from "../hooks/useSafeBack";
import type { Achievement } from "../gamification/types";

/** Endless "Find it on the globe": keep going as long as you like; your best streak is saved. */
export default function FindEndlessScreen() {
  const { colors, type, space } = useTheme();
  const goBack = useSafeBack();
  const game = useEndlessLocate();
  const [ended, setEnded] = useState(false);
  const [newAchievements, setNewAchievements] = useState<Achievement[]>([]);

  useEffect(() => {
    if (!ended) return;
    let cancelled = false;
    whenAnswersSaved()
      .then(() => checkForNewAchievements())
      .then((unlocked) => {
        if (!cancelled) setNewAchievements(unlocked);
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
            {game.found} / {game.attempts}
          </Text>
          <Text style={[type.body, { color: colors.textMuted, marginTop: 4, textAlign: "center" }]}>
            countries found{game.xpEarned > 0 ? ` · +${game.xpEarned} XP` : ""}
          </Text>
          <Text style={[type.body, { color: colors.textSecondary, marginTop: space.md, textAlign: "center" }]}>
            Longest streak this run: {game.runBest}
          </Text>
          <Text style={[type.label, { color: game.isNewBest ? colors.accent : colors.textMuted, marginTop: space.xs }]}>
            {game.isNewBest ? "NEW BEST STREAK!" : `BEST EVER: ${game.bestEver}`}
          </Text>
          {newAchievements.map((a) => (
            <Text key={a.id} style={[type.body, { color: colors.textPrimary, marginTop: space.sm }]}>
              🏅 {a.title}
            </Text>
          ))}
          <PrimaryButton label="Done" onPress={goBack} style={{ marginTop: space.xl, width: "100%" }} />
        </SafeAreaView>
      </GradientBackground>
    );
  }

  return (
    <GradientBackground>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ flexDirection: "row", alignItems: "center", paddingHorizontal: space.lg, paddingTop: space.sm }}>
          <Pressable onPress={end} hitSlop={12} accessibilityRole="button" accessibilityLabel="End endless mode">
            <Ionicons name="close" size={26} color={colors.textPrimary} />
          </Pressable>
          <View style={{ flex: 1, alignItems: "center" }}>
            <Text style={[type.section, { color: colors.textMuted }]}>FIND IT · ENDLESS</Text>
          </View>
          <View style={{ width: 26 }} />
        </View>

        <View
          accessible
          accessibilityLabel={`Found ${game.found}. Streak ${game.streak}. Best ${game.bestEver}.`}
          style={{ flexDirection: "row", justifyContent: "center", gap: space.lg, marginTop: space.sm }}
        >
          <Stat label="FOUND" value={game.found} />
          <Stat label="STREAK" value={game.streak} highlight={game.streak > 0 && game.streak >= game.bestEver} />
          <Stat label="BEST" value={game.bestEver} />
        </View>

        {game.question ? (
          <View style={{ flex: 1, paddingTop: space.sm }}>
            <LocateCard question={game.question} answered={game.answered} onSelect={game.submit} />
          </View>
        ) : (
          <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
            <Text style={[type.body, { color: colors.textMuted }]}>Spinning up the globe…</Text>
          </View>
        )}

        {game.answered && (
          <View style={{ paddingHorizontal: space.lg, paddingBottom: space.md }}>
            <PrimaryButton label="Next country" onPress={game.next} />
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
      <Text style={[type.label, { color: colors.textMuted, fontSize: 9 }]}>{label}</Text>
    </View>
  );
}
