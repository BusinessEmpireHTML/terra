import React, { useCallback, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { useFocusEffect, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { GradientBackground, PrimaryButton } from "../components/ui/Primitives";
import { useSafeBack } from "../hooks/useSafeBack";
import { Flag } from "../components/ui/Flag";
import { useTheme } from "../theme/ThemeProvider";
import { fontFamily } from "../theme/tokens";
import { COUNTRIES } from "../data/countries";
import { progressStore } from "../services/progressStore";
import { computeAllMastery } from "../quiz/mastery";
import { EXPEDITIONS_BY_ID } from "../gamification/expeditions";
import { computeExpeditionProgress, EXPEDITION_COMPLETION_THRESHOLD } from "../gamification/expeditionProgress";
import type { CountryMastery } from "../quiz/types";
import type { Country } from "../types/country";

import type { ExpeditionProgress } from "../gamification/types";
import { useT } from "../i18n/useT";
import { expeditionDescription, expeditionTitle } from "../i18n/catalog";

const COUNTRY_BY_ID = new Map(COUNTRIES.map((c) => [c.id, c]));

export default function ExpeditionDetailScreen({ expeditionId }: { expeditionId: string }) {
  const { colors, type, space, radius } = useTheme();
  const t = useT();
  const router = useRouter();
  const goBack = useSafeBack();
  const expedition = EXPEDITIONS_BY_ID.get(expeditionId);
  const [masteryByCountry, setMasteryByCountry] = useState<Map<string, CountryMastery>>(new Map());
  const [progress, setProgress] = useState<ExpeditionProgress | null>(null);

  useFocusEffect(
    useCallback(() => {
      if (!expedition) return;
      let cancelled = false;
      progressStore
        .getAll()
        .then((records) => {
          if (cancelled) return;
          const mastery = computeAllMastery(records);
          setMasteryByCountry(mastery);
          setProgress(computeExpeditionProgress(expedition, mastery));
        })
        .catch(() => {});
      return () => {
        cancelled = true;
      };
    }, [expedition])
  );

  if (!expedition) {
    return (
      <GradientBackground>
        <SafeAreaView style={{ flex: 1, alignItems: "center", justifyContent: "center", padding: space.xl }}>
          <Text style={[type.body, { color: colors.textMuted }]}>{t("expeditions.notFound")}</Text>
          <PrimaryButton label={t("common.back")} onPress={goBack} style={{ marginTop: space.lg, alignSelf: "stretch" }} />
        </SafeAreaView>
      </GradientBackground>
    );
  }

  const countries = expedition.countryIds.map((id) => COUNTRY_BY_ID.get(id)).filter((c): c is Country => Boolean(c));

  return (
    <GradientBackground>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ flexDirection: "row", alignItems: "center", paddingHorizontal: space.lg, paddingTop: space.sm, marginBottom: space.sm }}>
          <Pressable onPress={goBack} hitSlop={12} style={{ marginRight: space.sm }} accessibilityRole="button" accessibilityLabel={t("common.back")}>
            <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
          </Pressable>
          <View style={{ flex: 1 }}>
            <Text accessibilityRole="header" style={[type.title, { color: colors.textPrimary }]}>
              {expeditionTitle(expedition, t.lang)}
            </Text>
            <Text style={[type.bodySmall, { color: colors.textMuted }]}>{expeditionDescription(expedition, t.lang)}</Text>
          </View>
        </View>

        <ScrollView contentContainerStyle={{ padding: space.lg, paddingTop: 0, paddingBottom: space.xxl }}>
          <View style={{ marginBottom: space.md }}>
            <Text style={[type.bodySmall, { color: colors.textMuted, marginBottom: space.sm }]}>
              {t("expeditions.progress", {
                done: progress?.completedCountryIds.length ?? 0,
                total: expedition.countryIds.length,
                percent: EXPEDITION_COMPLETION_THRESHOLD,
              })}
            </Text>
            <PrimaryButton
              label={progress?.isComplete ? t("expeditions.keepPracticing") : t("expeditions.practice")}
              onPress={() => router.push(`/quiz/mixed?expedition=${expedition.id}`)}
              accessibilityHint={t("expeditions.practiceHint")}
            />
          </View>

          {progress?.isComplete && (
            <View
              style={{
                backgroundColor: colors.accent,
                borderRadius: radius.md,
                padding: space.md,
                marginBottom: space.md,
                alignItems: "center",
              }}
            >
              <Text style={[type.body, { color: colors.background, fontFamily: fontFamily.bodySemiBold }]}>{t("expeditions.complete")} 🏅</Text>
            </View>
          )}

          {countries.map((c) => {
            const mastery = masteryByCountry.get(c.id);
            const done = (mastery?.score ?? 0) >= EXPEDITION_COMPLETION_THRESHOLD;
            return (
              <Pressable
                key={c.id}
                onPress={() => router.push(`/country/${c.id}`)}
                accessibilityRole="button"
                accessibilityLabel={`${t.country(c)}, ${t("expeditions.masteryPercent", { percent: mastery?.score ?? 0 })}${done ? `, ${t("expeditions.doneA11y")}` : ""}`}
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
                  <Flag cca2={c.cca2} width={32} style={{ marginRight: space.sm }} />
                  <View style={{ flex: 1 }}>
                    <Text style={[type.body, { color: colors.textPrimary }]}>{t.country(c)}</Text>
                    <Text style={[type.bodySmall, { color: colors.textMuted }]}>{t("expeditions.masteryPercent", { percent: mastery?.score ?? 0 })}</Text>
                  </View>
                  <Ionicons
                    name={done ? "checkmark-circle" : "ellipse-outline"}
                    size={22}
                    color={done ? colors.accentSecondary : colors.textMuted}
                  />
                </View>
              </Pressable>
            );
          })}
        </ScrollView>
      </SafeAreaView>
    </GradientBackground>
  );
}
