import React, { useCallback, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { useFocusEffect, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { GradientBackground, AnimatedPressable } from "../components/ui/Primitives";
import { useTheme } from "../theme/ThemeProvider";
import { progressStore } from "../services/progressStore";
import { dailyStore } from "../services/dailyStore";
import { overallStats } from "../quiz/mastery";
import { isDue } from "../quiz/srs";
import { COUNTRIES } from "../data/countries";
import { QUIZ_CATEGORIES, type QuizCategory } from "../quiz/types";
import type { ProgressRecord } from "../quiz/types";
import type { DailyState } from "../gamification/types";

export default function LearnScreen() {
  const { colors, type, space, radius } = useTheme();
  const router = useRouter();
  const [records, setRecords] = useState<ProgressRecord[] | null>(null);
  const [daily, setDaily] = useState<DailyState | null>(null);

  useFocusEffect(
    useCallback(() => {
      let cancelled = false;
      Promise.all([progressStore.getAll(), dailyStore.getToday()]).then(([r, d]) => {
        if (cancelled) return;
        setRecords(r);
        setDaily(d);
      });
      return () => {
        cancelled = true;
      };
    }, [])
  );

  const stats = records ? overallStats(records) : null;
  const dueByCategory = new Map<QuizCategory, number>();
  if (records) {
    for (const r of records) {
      if (isDue(r)) dueByCategory.set(r.category, (dueByCategory.get(r.category) ?? 0) + 1);
    }
  }
  const totalDue = Array.from(dueByCategory.values()).reduce((a, b) => a + b, 0);
  const countryOfDay = daily ? COUNTRIES.find((c) => c.id === daily.countryOfTheDayId) : null;

  return (
    <GradientBackground>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ padding: space.lg, paddingBottom: space.xxl }}>
          <Text style={[type.hero, { color: colors.textPrimary, fontSize: 30 }]}>Learn</Text>
          <Text style={[type.subtitle, { color: colors.textMuted, marginTop: 2, marginBottom: space.lg }]}>
            Flags, capitals, shapes, and more — spaced out so it sticks
          </Text>

          {stats && (
            <View style={{ flexDirection: "row", gap: space.sm, marginBottom: space.lg }}>
              <StatPill label="Started" value={String(stats.countriesStarted)} />
              <StatPill label="Mastered" value={String(stats.countriesMastered)} />
              <StatPill label="Accuracy" value={stats.totalAnswered ? `${stats.accuracy}%` : "—"} />
            </View>
          )}

          <Text style={[type.section, { color: colors.textMuted, marginBottom: space.sm }]}>TODAY</Text>

          {countryOfDay && (
            <Pressable onPress={() => router.push(`/country/${countryOfDay.id}`)}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor: colors.surfaceRaised,
                  borderRadius: radius.md,
                  borderWidth: 1,
                  borderColor: colors.border,
                  padding: space.md,
                  marginBottom: space.sm,
                }}
              >
                <Text style={{ fontSize: 30, marginRight: space.md }}>{countryOfDay.flagEmoji}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={[type.label, { color: colors.accent }]}>COUNTRY OF THE DAY</Text>
                  <Text style={[type.body, { color: colors.textPrimary, marginTop: 2 }]}>{countryOfDay.name.common}</Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
              </View>
            </Pressable>
          )}

          <View style={{ flexDirection: "row", gap: space.sm, marginBottom: space.lg }}>
            <Pressable style={{ flex: 1 }} onPress={() => router.push("/quiz/mixed?daily=1")}>
              <View
                style={{
                  backgroundColor: colors.surfaceRaised,
                  borderRadius: radius.md,
                  borderWidth: 1,
                  borderColor: daily?.dailyQuizDone ? colors.accentSecondary : colors.border,
                  padding: space.md,
                  alignItems: "center",
                }}
              >
                <Ionicons
                  name={daily?.dailyQuizDone ? "checkmark-circle" : "help-circle-outline"}
                  size={22}
                  color={daily?.dailyQuizDone ? colors.accentSecondary : colors.accent}
                />
                <Text style={[type.bodySmall, { color: colors.textPrimary, marginTop: 6, textAlign: "center" }]}>Daily Quiz</Text>
                <Text style={[type.label, { color: colors.textMuted, marginTop: 2, fontSize: 9 }]}>
                  {daily?.dailyQuizDone ? "DONE" : "5 QUESTIONS"}
                </Text>
              </View>
            </Pressable>

            <Pressable style={{ flex: 1 }} onPress={() => router.push("/speed-round")}>
              <View
                style={{
                  backgroundColor: colors.surfaceRaised,
                  borderRadius: radius.md,
                  borderWidth: 1,
                  borderColor: colors.border,
                  padding: space.md,
                  alignItems: "center",
                }}
              >
                <Ionicons name="flash-outline" size={22} color={colors.ember} />
                <Text style={[type.bodySmall, { color: colors.textPrimary, marginTop: 6, textAlign: "center" }]}>Speed Round</Text>
                <Text style={[type.label, { color: colors.textMuted, marginTop: 2, fontSize: 9 }]}>
                  {daily?.speedRoundBestScore != null ? `BEST: ${daily.speedRoundBestScore}` : "60 SECONDS"}
                </Text>
              </View>
            </Pressable>
          </View>

          <AnimatedPressable onPress={() => router.push("/expeditions")}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: colors.surfaceRaised,
                borderRadius: radius.md,
                borderWidth: 1,
                borderColor: colors.border,
                padding: space.md,
                marginBottom: space.lg,
              }}
            >
              <Ionicons name="map-outline" size={22} color={colors.accent} style={{ marginRight: space.md }} />
              <View style={{ flex: 1 }}>
                <Text style={[type.body, { color: colors.textPrimary, fontFamily: "Manrope_700Bold" }]}>Expeditions</Text>
                <Text style={[type.bodySmall, { color: colors.textMuted, marginTop: 2 }]}>Curated journeys through the world</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
            </View>
          </AnimatedPressable>

          <AnimatedPressable onPress={() => router.push("/quiz/mixed")}>
            <View
              style={{
                borderRadius: radius.lg,
                backgroundColor: colors.accent,
                padding: space.lg,
                marginBottom: space.lg,
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <View style={{ flex: 1 }}>
                <Text style={[type.title, { color: colors.background, fontSize: 22 }]}>Mixed Review</Text>
                <Text style={[type.bodySmall, { color: colors.background, opacity: 0.8, marginTop: 2 }]}>
                  {totalDue > 0 ? `${totalDue} due for review` : "A bit of everything"}
                </Text>
              </View>
              <Ionicons name="shuffle" size={28} color={colors.background} />
            </View>
          </AnimatedPressable>

          <Text style={[type.section, { color: colors.textMuted, marginBottom: space.sm }]}>MODES</Text>
          <View style={{ gap: space.sm }}>
            {QUIZ_CATEGORIES.map((cat) => (
              <Pressable key={cat.key} onPress={() => router.push(`/quiz/${cat.key}`)}>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    backgroundColor: colors.surfaceRaised,
                    borderRadius: radius.md,
                    borderWidth: 1,
                    borderColor: colors.border,
                    padding: space.md,
                  }}
                >
                  <View
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 20,
                      backgroundColor: colors.background,
                      alignItems: "center",
                      justifyContent: "center",
                      marginRight: space.md,
                    }}
                  >
                    <Ionicons name={cat.icon as any} size={19} color={colors.accent} />
                  </View>
                  <Text style={[type.body, { color: colors.textPrimary, flex: 1 }]}>{cat.label}</Text>
                  {dueByCategory.has(cat.key) && (
                    <View
                      style={{
                        backgroundColor: colors.ember,
                        borderRadius: 999,
                        paddingHorizontal: 8,
                        paddingVertical: 2,
                        marginRight: space.sm,
                      }}
                    >
                      <Text style={[type.label, { color: "#fff", fontSize: 10 }]}>{dueByCategory.get(cat.key)}</Text>
                    </View>
                  )}
                  <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
                </View>
              </Pressable>
            ))}
          </View>

          <Text style={[type.bodySmall, { color: colors.textMuted, marginTop: space.lg, textAlign: "center" }]}>
            Full stats and achievements live in the Profile tab.
          </Text>
        </ScrollView>
      </SafeAreaView>
    </GradientBackground>
  );
}

function StatPill({ label, value }: { label: string; value: string }) {
  const { colors, type, space, radius } = useTheme();
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.surfaceRaised,
        borderRadius: radius.md,
        borderWidth: 1,
        borderColor: colors.border,
        paddingVertical: space.sm,
        alignItems: "center",
      }}
    >
      <Text style={[type.data, { color: colors.accent, fontSize: 18 }]}>{value}</Text>
      <Text style={[type.label, { color: colors.textMuted, marginTop: 2 }]}>{label.toUpperCase()}</Text>
    </View>
  );
}
