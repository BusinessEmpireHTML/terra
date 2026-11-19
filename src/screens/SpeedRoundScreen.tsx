import React, { useEffect, useRef, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { GradientBackground, PrimaryButton } from "../components/ui/Primitives";
import { CountrySilhouette } from "../components/quiz/CountrySilhouette";
import { useTheme } from "../theme/ThemeProvider";
import { useSpeedRound } from "../quiz/useSpeedRound";
import { whenAnswersSaved } from "../quiz/answerRecorder";
import { dailyStore } from "../services/dailyStore";
import { checkForNewAchievements } from "../gamification/checkAchievements";
import { COUNTRIES } from "../data/countries";
import { useSafeBack } from "../hooks/useSafeBack";
import type { Achievement } from "../gamification/types";

const ROUND_SECONDS = 60;

export default function SpeedRoundScreen() {
  const { colors, type, space, radius } = useTheme();
  const goBack = useSafeBack();
  const { timeLeft, question, score, attempted, flash, isOver, answer } = useSpeedRound(ROUND_SECONDS);
  const [newAchievements, setNewAchievements] = useState<Achievement[]>([]);
  const [previousBest, setPreviousBest] = useState<number | null>(null);
  const wrapUpStarted = useRef(false);

  useEffect(() => {
    dailyStore
      .getToday()
      .then((d) => setPreviousBest(d.speedRoundBestScore))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!isOver || wrapUpStarted.current) return;
    wrapUpStarted.current = true;
    (async () => {
      try {
        await dailyStore.recordSpeedRoundScore(score);
        await whenAnswersSaved();
        setNewAchievements(await checkForNewAchievements());
      } catch (err) {
        if (__DEV__) console.warn("Speed round wrap-up failed:", err);
      }
    })();
  }, [isOver, score]);

  const country = COUNTRIES.find((c) => c.id === question.countryId);
  const flashColor = flash === "correct" ? colors.accentSecondary : colors.ember;

  if (isOver) {
    const isNewBest = score > 0 && (previousBest == null || score > previousBest);
    return (
      <GradientBackground>
        <SafeAreaView style={{ flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: space.xl }}>
          <Text style={{ fontSize: 56 }} accessible={false}>
            ⚡️
          </Text>
          <Text style={[type.hero, { color: colors.textPrimary, marginTop: space.md, fontSize: 34 }]}>{score}</Text>
          <Text style={[type.body, { color: colors.textMuted, marginTop: 4, textAlign: "center" }]}>
            correct out of {attempted} in {ROUND_SECONDS} seconds
          </Text>
          {isNewBest && <Text style={[type.label, { color: colors.accent, marginTop: space.sm }]}>NEW BEST TODAY</Text>}
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
          <PrimaryButton label="Done" onPress={goBack} style={{ marginTop: space.xl, width: "100%" }} />
        </SafeAreaView>
      </GradientBackground>
    );
  }

  return (
    <GradientBackground>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ flexDirection: "row", alignItems: "center", paddingHorizontal: space.lg, paddingTop: space.sm }}>
          <Pressable onPress={goBack} hitSlop={12} accessibilityRole="button" accessibilityLabel="Quit speed round">
            <Ionicons name="close" size={26} color={colors.textPrimary} />
          </Pressable>
          <View style={{ flex: 1, alignItems: "center" }}>
            <Text
              style={[type.data, { color: timeLeft <= 10 ? colors.ember : colors.textPrimary, fontSize: 22 }]}
              accessibilityLabel={`${timeLeft} seconds left`}
            >
              {timeLeft}s
            </Text>
          </View>
          <Text style={[type.data, { color: colors.accent, minWidth: 26, textAlign: "right" }]} accessibilityLabel={`Score ${score}`}>
            {score}
          </Text>
        </View>

        <View style={{ flex: 1, justifyContent: "center", paddingHorizontal: space.lg }}>
          {flash && (
            <View
              pointerEvents="none"
              style={[StyleSheet.absoluteFill, { backgroundColor: flashColor, opacity: 0.18 }]}
              accessibilityLiveRegion="polite"
              accessibilityLabel={flash === "correct" ? "Correct" : "Wrong"}
            />
          )}
          <View style={{ alignItems: "center", marginBottom: space.lg }}>
            {question.promptVisual === "flag" && country && (
              <Text style={{ fontSize: 80 }} accessibilityLabel="Flag to identify">
                {country.flagEmoji}
              </Text>
            )}
            {question.promptVisual === "shape" && <CountrySilhouette countryId={question.countryId} size={150} />}
            <Text style={[type.title, { color: colors.textPrimary, textAlign: "center", marginTop: space.md, fontSize: 20, lineHeight: 26 }]}>
              {question.promptLabel}
            </Text>
          </View>

          <View style={{ gap: space.sm }}>
            {question.choices.map((choice) => (
              <Pressable
                key={choice.label}
                onPress={() => answer(choice.label)}
                accessibilityRole="button"
                accessibilityLabel={choice.label}
                style={({ pressed }) => ({
                  borderRadius: radius.md,
                  borderWidth: 1.5,
                  borderColor: pressed ? colors.accent : colors.border,
                  backgroundColor: colors.surfaceRaised,
                  paddingVertical: space.md,
                  paddingHorizontal: space.md,
                })}
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
