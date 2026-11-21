import React, { useCallback, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { useFocusEffect, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { GradientBackground, AnimatedPressable } from "../components/ui/Primitives";
import { useTheme } from "../theme/ThemeProvider";
import { fontFamily, DENSE_TEXT_MAX_SCALE } from "../theme/tokens";
import { Flag } from "../components/ui/Flag";
import { DAILY_QUIZ_LENGTH, dailyNumber } from "../quiz/daily";
import { progressStore } from "../services/progressStore";
import { dailyStore } from "../services/dailyStore";
import { overallStats } from "../quiz/mastery";
import { isDue } from "../quiz/srs";
import { COUNTRIES } from "../data/countries";
import { QUIZ_CATEGORIES, type QuizCategory } from "../quiz/types";
import type { ProgressRecord } from "../quiz/types";
import type { DailyState } from "../gamification/types";
import { useT } from "../i18n/useT";

export default function LearnScreen() {
  const { colors, type, space, radius } = useTheme();
  const t = useT();
  const router = useRouter();
  const [records, setRecords] = useState<ProgressRecord[] | null>(null);
  const [daily, setDaily] = useState<DailyState | null>(null);

  useFocusEffect(
    useCallback(() => {
      let cancelled = false;
      Promise.all([progressStore.getAll(), dailyStore.getToday()])
        .then(([r, d]) => {
          if (cancelled) return;
          setRecords(r);
          setDaily(d);
        })
        .catch((err) => {
          // Keep the tab usable (every mode still works) even if stats can't load.
          if (__DEV__) console.warn("Failed to load learn stats:", err);
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
      <SafeAreaView style={{ flex: 1 }} edges={["top", "left", "right"]}>
        <ScrollView contentContainerStyle={{ padding: space.lg, paddingBottom: space.xxl }}>
          <Text accessibilityRole="header" style={[type.hero, { color: colors.textPrimary, fontSize: 30 }]}>
            {t("tabs.learn")}
          </Text>
          <Text style={[type.subtitle, { color: colors.textMuted, marginTop: 2, marginBottom: space.lg }]}>
            {t("learn.tagline")}
          </Text>

          {stats && (
            <View style={{ flexDirection: "row", gap: space.sm, marginBottom: space.lg }}>
              <StatPill label={t("learn.started")} value={String(stats.countriesStarted)} />
              <StatPill label={t("learn.mastered")} value={String(stats.countriesMastered)} />
              <StatPill label={t("learn.accuracy")} value={stats.totalAnswered ? `${stats.accuracy}%` : "—"} />
            </View>
          )}

          <Text maxFontSizeMultiplier={DENSE_TEXT_MAX_SCALE} style={[type.section, { color: colors.textMuted, marginBottom: space.sm }]}>{t("learn.today").toUpperCase()}</Text>

          {countryOfDay && (
            <Pressable
              onPress={() => router.push(`/country/${countryOfDay.id}`)}
              accessibilityRole="button"
              accessibilityLabel={`${t("learn.countryOfDay")}: ${t.country(countryOfDay)}`}
            >
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
                <Flag cca2={countryOfDay.cca2} width={42} style={{ marginRight: space.md }} />
                <View style={{ flex: 1 }}>
                  <Text maxFontSizeMultiplier={DENSE_TEXT_MAX_SCALE} style={[type.label, { color: colors.accent }]}>{t("learn.countryOfDay").toUpperCase()}</Text>
                  <Text style={[type.body, { color: colors.textPrimary, marginTop: 2 }]}>{t.country(countryOfDay)}</Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
              </View>
            </Pressable>
          )}

          <View style={{ flexDirection: "row", gap: space.sm, marginBottom: space.lg }}>
            <Pressable
              style={{ flex: 1 }}
              onPress={() => router.push("/quiz/mixed?daily=1")}
              accessibilityRole="button"
              accessibilityLabel={daily?.dailyQuizDone ? t("learn.dailyDoneA11y", { count: DAILY_QUIZ_LENGTH }) : t("learn.dailyA11y", { count: DAILY_QUIZ_LENGTH })}
            >
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
                <Text style={[type.bodySmall, { color: colors.textPrimary, marginTop: 6, textAlign: "center" }]}>
                  {daily ? t("quiz.dailyTitle", { number: dailyNumber(daily.date) }) : t("learn.daily")}
                </Text>
                <Text maxFontSizeMultiplier={DENSE_TEXT_MAX_SCALE} style={[type.label, { color: colors.textMuted, marginTop: 2, fontSize: 9 }]}>
                  {(daily?.dailyQuizAnswers
                    ? t("learn.dailyDone", { score: daily.dailyQuizAnswers.filter((a) => a.correct).length, total: daily.dailyQuizAnswers.length })
                    : t("learn.questions", { count: DAILY_QUIZ_LENGTH })
                  ).toUpperCase()}
                </Text>
              </View>
            </Pressable>

            <Pressable
              style={{ flex: 1 }}
              onPress={() => router.push("/speed-round")}
              accessibilityRole="button"
              accessibilityLabel={
                daily?.speedRoundBestScore != null ? t("learn.speedBestA11y", { score: daily.speedRoundBestScore }) : t("learn.speedA11y")
              }
            >
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
                <Text style={[type.bodySmall, { color: colors.textPrimary, marginTop: 6, textAlign: "center" }]}>{t("learn.speedRound")}</Text>
                <Text maxFontSizeMultiplier={DENSE_TEXT_MAX_SCALE} style={[type.label, { color: colors.textMuted, marginTop: 2, fontSize: 9 }]}>
                  {(daily?.speedRoundBestScore != null ? t("learn.todaysBest", { score: daily.speedRoundBestScore }) : t("learn.sixtySeconds")).toUpperCase()}
                </Text>
              </View>
            </Pressable>
          </View>

          <AnimatedPressable onPress={() => router.push("/expeditions")} accessibilityLabel={`${t("learn.expeditions")}: ${t("learn.expeditionsBody")}`}>
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
                <Text style={[type.body, { color: colors.textPrimary, fontFamily: fontFamily.bodySemiBold }]}>{t("learn.expeditions")}</Text>
                <Text style={[type.bodySmall, { color: colors.textMuted, marginTop: 2 }]}>{t("learn.expeditionsBody")}</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
            </View>
          </AnimatedPressable>

          <AnimatedPressable
            onPress={() => router.push("/quiz/mixed")}
            accessibilityLabel={totalDue > 0 ? `${t("quiz.mixedTitle")}, ${t("learn.dueForReview", { count: totalDue })}` : t("quiz.mixedTitle")}
          >
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
                <Text style={[type.title, { color: colors.background, fontSize: 22 }]}>{t("quiz.mixedTitle")}</Text>
                <Text style={[type.bodySmall, { color: colors.background, opacity: 0.8, marginTop: 2 }]}>
                  {totalDue > 0 ? t("learn.dueForReview", { count: totalDue }) : t("learn.bitOfEverything")}
                </Text>
              </View>
              <Ionicons name="shuffle" size={28} color={colors.background} />
            </View>
          </AnimatedPressable>

          <View
            style={{
              backgroundColor: colors.surfaceRaised,
              borderRadius: radius.lg,
              borderWidth: 1,
              borderColor: colors.accentSecondary,
              padding: space.md,
              marginBottom: space.lg,
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <View
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 22,
                  backgroundColor: colors.accentSecondary + "33",
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: space.md,
                }}
              >
                <Ionicons name="earth" size={24} color={colors.accentSecondary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[type.body, { color: colors.textPrimary, fontFamily: fontFamily.bodySemiBold }]}>{t("locate.header")}</Text>
                <Text style={[type.bodySmall, { color: colors.textMuted, marginTop: 2 }]}>{t("learn.findBody")}</Text>
              </View>
            </View>
            <View style={{ flexDirection: "row", gap: space.sm, marginTop: space.md }}>
              {[
                { label: t("learn.tenRounds"), icon: "flag-outline" as const, href: "/quiz/locate" as const, hint: t("learn.tenRoundsHint") },
                { label: t("learn.endless"), icon: "infinite" as const, href: "/find-endless" as const, hint: t("learn.endlessHint") },
              ].map((mode) => (
                <AnimatedPressable
                  key={mode.href}
                  onPress={() => router.push(mode.href)}
                  accessibilityLabel={`${t("locate.header")}, ${mode.label}`}
                  accessibilityHint={mode.hint}
                  containerStyle={{ flex: 1 }}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 6,
                    paddingVertical: space.sm,
                    borderRadius: radius.md,
                    backgroundColor: colors.accentSecondary,
                  }}
                >
                  <Ionicons name={mode.icon} size={16} color="#fff" />
                  <Text style={[type.bodySmall, { color: "#fff", fontFamily: fontFamily.bodySemiBold }]}>{mode.label}</Text>
                </AnimatedPressable>
              ))}
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginTop: space.md,
                paddingTop: space.sm,
                borderTopWidth: 1,
                borderTopColor: colors.border,
              }}
            >
              <Pressable
                onPress={() => router.push("/challenge/new")}
                accessibilityRole="button"
                accessibilityHint={t("learn.challengeHint")}
                hitSlop={8}
                style={{ flexDirection: "row", alignItems: "center", gap: 6, flex: 1, paddingVertical: 6 }}
              >
                <Ionicons name="people-outline" size={18} color={colors.accentSecondary} />
                <Text style={[type.bodySmall, { color: colors.textPrimary, fontFamily: fontFamily.bodySemiBold }]}>{t("challenge.cardAction")}</Text>
              </Pressable>
              <Pressable
                onPress={() => router.push("/challenge/enter")}
                accessibilityRole="button"
                hitSlop={8}
                style={{ flexDirection: "row", alignItems: "center", gap: 4, paddingVertical: 6 }}
              >
                <Ionicons name="keypad-outline" size={16} color={colors.textMuted} />
                <Text style={[type.bodySmall, { color: colors.textMuted }]}>{t("challenge.enterCode")}</Text>
              </Pressable>
            </View>
          </View>

          <Text maxFontSizeMultiplier={DENSE_TEXT_MAX_SCALE} style={[type.section, { color: colors.textMuted, marginBottom: space.sm }]}>{t("learn.modes").toUpperCase()}</Text>
          <View style={{ gap: space.sm }}>
            {QUIZ_CATEGORIES.map((cat) => (
              <Pressable
                key={cat.key}
                onPress={() => router.push(`/quiz/${cat.key}`)}
                accessibilityRole="button"
                accessibilityLabel={
                  dueByCategory.has(cat.key)
                    ? `${t(`category.${cat.key}`)}, ${t("learn.due", { count: dueByCategory.get(cat.key) ?? 0 })}`
                    : t(`category.${cat.key}`)
                }
              >
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
                  <Text style={[type.body, { color: colors.textPrimary, flex: 1 }]}>{t(`category.${cat.key}`)}</Text>
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
                      <Text maxFontSizeMultiplier={DENSE_TEXT_MAX_SCALE} style={[type.label, { color: "#fff", fontSize: 10, letterSpacing: 0.4 }]}>
                        {t("learn.due", { count: dueByCategory.get(cat.key) ?? 0 }).toUpperCase()}
                      </Text>
                    </View>
                  )}
                  <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
                </View>
              </Pressable>
            ))}
          </View>

          <Text style={[type.bodySmall, { color: colors.textMuted, marginTop: space.lg, textAlign: "center" }]}>
            {t("learn.profileNote")}
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
      accessible
      accessibilityLabel={`${label}: ${value}`}
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
      <Text maxFontSizeMultiplier={DENSE_TEXT_MAX_SCALE} style={[type.label, { color: colors.textMuted, marginTop: 2 }]}>{label.toUpperCase()}</Text>
    </View>
  );
}
