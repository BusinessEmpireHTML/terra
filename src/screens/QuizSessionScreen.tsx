import React, { useEffect, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { GradientBackground, AnimatedPressable } from "../components/ui/Primitives";
import { QuestionCard } from "../components/quiz/QuestionCard";
import { useTheme } from "../theme/ThemeProvider";
import { useQuizSession } from "../quiz/useQuizSession";
import { QUIZ_CATEGORIES } from "../quiz/types";
import type { CategoryFilter } from "../quiz/sessionBuilder";
import { dailyStore } from "../services/dailyStore";
import { checkForNewAchievements } from "../gamification/checkAchievements";
import type { Achievement } from "../gamification/types";

interface Props {
  filter: CategoryFilter;
  focusCountryId?: string;
  isDailyChallenge?: boolean;
}

export default function QuizSessionScreen({ filter, focusCountryId, isDailyChallenge }: Props) {
  const { colors, type, space, radius } = useTheme();
  const router = useRouter();
  const { loading, currentQuestion, answered, index, total, correctCount, isComplete, submitAnswer, next } = useQuizSession(
    filter,
    isDailyChallenge ? 5 : 10,
    focusCountryId
  );
  const [newAchievements, setNewAchievements] = useState<Achievement[]>([]);
  const [wrapUpDone, setWrapUpDone] = useState(false);

  const categoryMeta = filter !== "mixed" ? QUIZ_CATEGORIES.find((c) => c.key === filter) : null;
  const title = focusCountryId ? "Country practice" : isDailyChallenge ? "Daily Quiz" : categoryMeta?.label ?? "Mixed review";

  useEffect(() => {
    if (!isComplete || total === 0 || wrapUpDone) return;
    setWrapUpDone(true);
    (async () => {
      if (isDailyChallenge) await dailyStore.markDailyQuizDone();
      const unlocked = await checkForNewAchievements();
      setNewAchievements(unlocked);
    })();
  }, [isComplete, total, wrapUpDone, isDailyChallenge]);

  return (
    <GradientBackground>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ flexDirection: "row", alignItems: "center", paddingHorizontal: space.lg, paddingTop: space.sm }}>
          <Pressable onPress={() => router.back()} hitSlop={12}>
            <Ionicons name="close" size={26} color={colors.textPrimary} />
          </Pressable>
          <View style={{ flex: 1, alignItems: "center" }}>
            <Text style={[type.section, { color: colors.textMuted }]}>{title.toUpperCase()}</Text>
            {!loading && !isComplete && (
              <Text style={[type.bodySmall, { color: colors.textMuted, marginTop: 2 }]}>
                {index + 1} / {total}
              </Text>
            )}
          </View>
          <View style={{ width: 26 }} />
        </View>

        {loading && (
          <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
            <Text style={[type.body, { color: colors.textMuted }]}>Building your session…</Text>
          </View>
        )}

        {!loading && !isComplete && currentQuestion && (
          <ScrollView contentContainerStyle={{ padding: space.lg, paddingBottom: space.xxl }}>
            <QuestionCard question={currentQuestion} answered={answered} onSelect={submitAnswer} />
          </ScrollView>
        )}

        {!loading && (isComplete || total === 0) && (
          <View style={{ flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: space.xl }}>
            {total === 0 ? (
              <>
                <Ionicons name="checkmark-done-circle-outline" size={56} color={colors.accent} />
                <Text style={[type.title, { color: colors.textPrimary, textAlign: "center", marginTop: space.md }]}>
                  Nothing to practice here yet
                </Text>
                <Text style={[type.body, { color: colors.textMuted, textAlign: "center", marginTop: space.sm }]}>
                  This category needs country content that isn't written yet — try Flags, Capitals, Shapes, Currencies, or
                  Neighbors instead.
                </Text>
              </>
            ) : (
              <>
                <Text style={{ fontSize: 56 }}>{correctCount / total >= 0.8 ? "🏆" : correctCount / total >= 0.5 ? "🌍" : "🧭"}</Text>
                <Text style={[type.hero, { color: colors.textPrimary, marginTop: space.md, fontSize: 32 }]}>
                  {correctCount} / {total}
                </Text>
                <Text style={[type.body, { color: colors.textMuted, marginTop: 4 }]}>
                  {Math.round((correctCount / total) * 100)}% correct
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
              </>
            )}

            <AnimatedPressable onPress={() => router.back()} style={{ marginTop: space.xl, width: "100%" }}>
              <View
                style={{
                  backgroundColor: colors.accent,
                  borderRadius: radius.md,
                  paddingVertical: space.md,
                  alignItems: "center",
                }}
              >
                <Text style={[type.body, { color: colors.background, fontWeight: "700" as const }]}>Done</Text>
              </View>
            </AnimatedPressable>
          </View>
        )}

        {!loading && !isComplete && currentQuestion && answered && (
          <View style={{ paddingHorizontal: space.lg, paddingBottom: space.md }}>
            <AnimatedPressable onPress={next}>
              <View
                style={{
                  backgroundColor: colors.accent,
                  borderRadius: radius.md,
                  paddingVertical: space.md,
                  alignItems: "center",
                }}
              >
                <Text style={[type.body, { color: colors.background, fontWeight: "700" as const }]}>
                  {index + 1 >= total ? "See results" : "Next"}
                </Text>
              </View>
            </AnimatedPressable>
          </View>
        )}
      </SafeAreaView>
    </GradientBackground>
  );
}
