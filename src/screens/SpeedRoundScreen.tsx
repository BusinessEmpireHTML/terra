import React, { useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { GradientBackground, AnimatedPressable } from "../components/ui/Primitives";
import { CountrySilhouette } from "../components/quiz/CountrySilhouette";
import { useTheme } from "../theme/ThemeProvider";
import { useSpeedRound } from "../quiz/useSpeedRound";
import { dailyStore } from "../services/dailyStore";
import { checkForNewAchievements } from "../gamification/checkAchievements";
import { COUNTRIES } from "../data/countries";
import type { Achievement } from "../gamification/types";

export default function SpeedRoundScreen() {
  const { colors, type, space, radius } = useTheme();
  const router = useRouter();
  const { timeLeft, question, score, attempted, flash, isOver, answer } = useSpeedRound(60);
  const [newAchievements, setNewAchievements] = useState<Achievement[]>([]);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!isOver || saved) return;
    setSaved(true);
    (async () => {
      await dailyStore.recordSpeedRoundScore(score);
      const unlocked = await checkForNewAchievements();
      setNewAchievements(unlocked);
    })();
  }, [isOver, saved, score]);

  const country = COUNTRIES.find((c) => c.id === question.countryId);
  const flashColor = flash === "correct" ? colors.accentSecondary : flash === "wrong" ? colors.ember : "transparent";

  if (isOver) {
    return (
      <GradientBackground>
        <SafeAreaView style={{ flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: space.xl }}>
          <Text style={{ fontSize: 56 }}>⚡️</Text>
          <Text style={[type.hero, { color: colors.textPrimary, marginTop: space.md, fontSize: 34 }]}>{score}</Text>
          <Text style={[type.body, { color: colors.textMuted, marginTop: 4 }]}>
            correct out of {attempted} in 60 seconds
          </Text>
          {newAchievements.length > 0 && (
            <View style={{ marginTop: space.lg, alignItems: "center" }}>
              <Text style={[type.label, { color: colors.accent }]}>ACHIEVEMENT UNLOCKED</Text>
              {newAchievements.map((a) => (
                <Text key={a.id} style={[type.body, { color: colors.textPrimary, marginTop: 4 }]}>
                  🏅 {a.title}
                </Text>
              ))}
            </View>
          )}
          <AnimatedPressable onPress={() => router.back()} style={{ marginTop: space.xl, width: "100%" }}>
            <View style={{ backgroundColor: colors.accent, borderRadius: radius.md, paddingVertical: space.md, alignItems: "center" }}>
              <Text style={[type.body, { color: colors.background, fontWeight: "700" as const }]}>Done</Text>
            </View>
          </AnimatedPressable>
        </SafeAreaView>
      </GradientBackground>
    );
  }

  return (
    <GradientBackground>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ flexDirection: "row", alignItems: "center", paddingHorizontal: space.lg, paddingTop: space.sm }}>
          <Pressable onPress={() => router.back()} hitSlop={12}>
            <Ionicons name="close" size={26} color={colors.textPrimary} />
          </Pressable>
          <View style={{ flex: 1, alignItems: "center" }}>
            <Text style={[type.data, { color: timeLeft <= 10 ? colors.ember : colors.textPrimary, fontSize: 22 }]}>{timeLeft}s</Text>
          </View>
          <Text style={[type.data, { color: colors.accent, width: 26, textAlign: "right" }]}>{score}</Text>
        </View>

        <View
          style={{
            flex: 1,
            justifyContent: "center",
            paddingHorizontal: space.lg,
            backgroundColor: flashColor,
            opacity: flash ? 0.25 : 1,
          }}
        >
          <View style={{ alignItems: "center", marginBottom: space.lg }}>
            {question.promptVisual === "flag" && country && <Text style={{ fontSize: 80 }}>{country.flagEmoji}</Text>}
            {question.promptVisual === "shape" && <CountrySilhouette countryId={question.countryId} size={150} />}
            <Text style={[type.title, { color: colors.textPrimary, textAlign: "center", marginTop: space.md, fontSize: 20 }]}>
              {question.promptLabel}
            </Text>
          </View>

          <View style={{ gap: space.sm }}>
            {question.choices.map((choice) => (
              <Pressable
                key={choice.label}
                onPress={() => answer(choice.label)}
                style={{
                  borderRadius: radius.md,
                  borderWidth: 1.5,
                  borderColor: colors.border,
                  backgroundColor: colors.surfaceRaised,
                  paddingVertical: space.md,
                  paddingHorizontal: space.md,
                }}
              >
                <Text style={[type.body, { color: colors.textPrimary }]}>{choice.label}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      </SafeAreaView>
    </GradientBackground>
  );
}
