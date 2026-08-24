import React, { useCallback, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { useFocusEffect, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { GradientBackground } from "../components/ui/Primitives";
import { useTheme } from "../theme/ThemeProvider";
import { progressStore } from "../services/progressStore";
import { EXPEDITIONS } from "../gamification/expeditions";
import { computeAllExpeditionProgress } from "../gamification/expeditionProgress";
import type { ExpeditionProgress } from "../gamification/types";

export default function ExpeditionsScreen() {
  const { colors, type, space, radius } = useTheme();
  const router = useRouter();
  const [progress, setProgress] = useState<Map<string, ExpeditionProgress>>(new Map());

  useFocusEffect(
    useCallback(() => {
      let cancelled = false;
      progressStore.getAll().then((records) => {
        if (!cancelled) setProgress(computeAllExpeditionProgress(EXPEDITIONS, records));
      });
      return () => {
        cancelled = true;
      };
    }, [])
  );

  return (
    <GradientBackground>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ flexDirection: "row", alignItems: "center", paddingHorizontal: space.lg, paddingTop: space.sm, marginBottom: space.sm }}>
          <Pressable onPress={() => router.back()} hitSlop={12} style={{ marginRight: space.sm }}>
            <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
          </Pressable>
          <Text style={[type.title, { color: colors.textPrimary }]}>Expeditions</Text>
        </View>

        <ScrollView contentContainerStyle={{ padding: space.lg, paddingTop: 0 }}>
          {EXPEDITIONS.map((exp) => {
            const p = progress.get(exp.id);
            return (
              <Pressable key={exp.id} onPress={() => router.push(`/expeditions/${exp.id}`)}>
                <View
                  style={{
                    backgroundColor: colors.surfaceRaised,
                    borderRadius: radius.md,
                    borderWidth: 1,
                    borderColor: p?.isComplete ? colors.accent : colors.border,
                    padding: space.md,
                    marginBottom: space.sm,
                  }}
                >
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
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
                      <Ionicons name={exp.icon as any} size={19} color={colors.accent} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={[type.body, { color: colors.textPrimary, fontFamily: "Manrope_700Bold" }]}>{exp.title}</Text>
                      <Text style={[type.bodySmall, { color: colors.textMuted, marginTop: 2 }]} numberOfLines={1}>
                        {exp.description}
                      </Text>
                    </View>
                    {p?.isComplete && <Ionicons name="checkmark-circle" size={20} color={colors.accent} />}
                  </View>
                  <View style={{ height: 5, borderRadius: 2.5, backgroundColor: colors.background, marginTop: space.sm, overflow: "hidden" }}>
                    <View style={{ height: "100%", width: `${p?.percentComplete ?? 0}%`, backgroundColor: colors.accent }} />
                  </View>
                  <Text style={[type.bodySmall, { color: colors.textMuted, marginTop: 4, fontSize: 11 }]}>
                    {p?.completedCountryIds.length ?? 0} / {exp.countryIds.length} countries
                  </Text>
                </View>
              </Pressable>
            );
          })}
        </ScrollView>
      </SafeAreaView>
    </GradientBackground>
  );
}
