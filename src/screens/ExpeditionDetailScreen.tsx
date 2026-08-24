import React, { useCallback, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { useFocusEffect, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { GradientBackground } from "../components/ui/Primitives";
import { useTheme } from "../theme/ThemeProvider";
import { COUNTRIES } from "../data/countries";
import { progressStore } from "../services/progressStore";
import { computeAllMastery } from "../quiz/mastery";
import { EXPEDITIONS_BY_ID } from "../gamification/expeditions";
import { computeExpeditionProgress, EXPEDITION_COMPLETION_THRESHOLD } from "../gamification/expeditionProgress";
import type { CountryMastery } from "../quiz/types";
import type { ExpeditionProgress } from "../gamification/types";

export default function ExpeditionDetailScreen({ expeditionId }: { expeditionId: string }) {
  const { colors, type, space, radius } = useTheme();
  const router = useRouter();
  const expedition = EXPEDITIONS_BY_ID.get(expeditionId);
  const [masteryByCountry, setMasteryByCountry] = useState<Map<string, CountryMastery>>(new Map());
  const [progress, setProgress] = useState<ExpeditionProgress | null>(null);

  useFocusEffect(
    useCallback(() => {
      if (!expedition) return;
      let cancelled = false;
      progressStore.getAll().then((records) => {
        if (cancelled) return;
        const mastery = computeAllMastery(records);
        setMasteryByCountry(mastery);
        setProgress(computeExpeditionProgress(expedition, mastery));
      });
      return () => {
        cancelled = true;
      };
    }, [expeditionId])
  );

  if (!expedition) {
    return (
      <GradientBackground>
        <SafeAreaView style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
          <Text style={[type.body, { color: colors.textMuted }]}>Expedition not found.</Text>
        </SafeAreaView>
      </GradientBackground>
    );
  }

  const countries = expedition.countryIds.map((id) => COUNTRIES.find((c) => c.id === id)).filter(Boolean);

  return (
    <GradientBackground>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ flexDirection: "row", alignItems: "center", paddingHorizontal: space.lg, paddingTop: space.sm, marginBottom: space.sm }}>
          <Pressable onPress={() => router.back()} hitSlop={12} style={{ marginRight: space.sm }}>
            <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
          </Pressable>
          <View style={{ flex: 1 }}>
            <Text style={[type.title, { color: colors.textPrimary }]}>{expedition.title}</Text>
            <Text style={[type.bodySmall, { color: colors.textMuted }]}>{expedition.description}</Text>
          </View>
        </View>

        <ScrollView contentContainerStyle={{ padding: space.lg, paddingTop: 0, paddingBottom: space.xxl }}>
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
              <Text style={[type.body, { color: colors.background, fontFamily: "Manrope_700Bold" }]}>Expedition complete 🏅</Text>
            </View>
          )}

          {countries.map((c) => {
            const mastery = masteryByCountry.get(c!.id);
            const done = (mastery?.score ?? 0) >= EXPEDITION_COMPLETION_THRESHOLD;
            return (
              <Pressable key={c!.id} onPress={() => router.push(`/country/${c!.id}`)}>
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
                  <Text style={{ fontSize: 24, marginRight: space.sm }}>{c!.flagEmoji}</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={[type.body, { color: colors.textPrimary }]}>{c!.name.common}</Text>
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
