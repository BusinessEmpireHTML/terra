import React, { useCallback, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { useFocusEffect, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { GradientBackground, PrimaryButton } from "../components/ui/Primitives";
import { useSafeBack } from "../hooks/useSafeBack";
import { useTheme } from "../theme/ThemeProvider";
import { fontFamily } from "../theme/tokens";
import { COUNTRIES } from "../data/countries";
import { progressStore } from "../services/progressStore";
import { computeAllMastery } from "../quiz/mastery";
import { EXPEDITIONS_BY_ID } from "../gamification/expeditions";
import { computeExpeditionProgress, EXPEDITION_COMPLETION_THRESHOLD } from "../gamification/expeditionProgress";
import type { CountryMastery } from "../quiz/types";
import type { Country } from "../types/country";

const COUNTRY_BY_ID = new Map(COUNTRIES.map((c) => [c.id, c]));
import type { ExpeditionProgress } from "../gamification/types";

export default function ExpeditionDetailScreen({ expeditionId }: { expeditionId: string }) {
  const { colors, type, space, radius } = useTheme();
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
          <Text style={[type.body, { color: colors.textMuted }]}>Expedition not found.</Text>
          <PrimaryButton label="Back" onPress={goBack} style={{ marginTop: space.lg, alignSelf: "stretch" }} />
        </SafeAreaView>
      </GradientBackground>
    );
  }

  const countries = expedition.countryIds.map((id) => COUNTRY_BY_ID.get(id)).filter((c): c is Country => Boolean(c));

  return (
    <GradientBackground>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ flexDirection: "row", alignItems: "center", paddingHorizontal: space.lg, paddingTop: space.sm, marginBottom: space.sm }}>
          <Pressable onPress={goBack} hitSlop={12} style={{ marginRight: space.sm }} accessibilityRole="button" accessibilityLabel="Back">
            <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
          </Pressable>
          <View style={{ flex: 1 }}>
            <Text accessibilityRole="header" style={[type.title, { color: colors.textPrimary }]}>
              {expedition.title}
            </Text>
            <Text style={[type.bodySmall, { color: colors.textMuted }]}>{expedition.description}</Text>
          </View>
        </View>

        <ScrollView contentContainerStyle={{ padding: space.lg, paddingTop: 0, paddingBottom: space.xxl }}>
          <View style={{ marginBottom: space.md }}>
            <Text style={[type.bodySmall, { color: colors.textMuted, marginBottom: space.sm }]}>
              {progress?.completedCountryIds.length ?? 0} of {expedition.countryIds.length} countries at {EXPEDITION_COMPLETION_THRESHOLD}%+ mastery
            </Text>
            <PrimaryButton
              label={progress?.isComplete ? "Keep practicing" : "Practice this expedition"}
              onPress={() => router.push(`/quiz/mixed?expedition=${expedition.id}`)}
              accessibilityHint="Starts a quiz drawn from this expedition's countries"
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
              <Text style={[type.body, { color: colors.background, fontFamily: fontFamily.bodySemiBold }]}>Expedition complete 🏅</Text>
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
                accessibilityLabel={`${c.name.common}, ${mastery?.score ?? 0}% mastery${done ? ", complete" : ""}`}
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
                  <Text style={{ fontSize: 24, marginRight: space.sm }}>{c.flagEmoji}</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={[type.body, { color: colors.textPrimary }]}>{c.name.common}</Text>
                    <Text style={[type.bodySmall, { color: colors.textMuted }]}>{mastery?.score ?? 0}% mastery</Text>
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
