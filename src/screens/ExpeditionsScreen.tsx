import React, { useCallback, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { useFocusEffect, useRouter } from "expo-router";
import { useSafeBack } from "../hooks/useSafeBack";
import { fontFamily } from "../theme/tokens";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { GradientBackground } from "../components/ui/Primitives";
import { useTheme } from "../theme/ThemeProvider";
import { progressStore } from "../services/progressStore";
import { EXPEDITIONS } from "../gamification/expeditions";
import { computeAllExpeditionProgress, EXPEDITION_COMPLETION_THRESHOLD } from "../gamification/expeditionProgress";
import type { ExpeditionProgress } from "../gamification/types";
import { useT } from "../i18n/useT";
import { checkForNewStamps, loadStamps } from "../gamification/passport";
import { expeditionDescription, expeditionTitle } from "../i18n/catalog";

export default function ExpeditionsScreen() {
  const { colors, type, space, radius } = useTheme();
  const t = useT();
  const router = useRouter();
  const goBack = useSafeBack();
  const [progress, setProgress] = useState<Map<string, ExpeditionProgress>>(new Map());
  const [stamped, setStamped] = useState<Set<string>>(new Set());

  useFocusEffect(
    useCallback(() => {
      let cancelled = false;
      progressStore
        .getAll()
        .then((records) => {
          if (!cancelled) setProgress(computeAllExpeditionProgress(EXPEDITIONS, records));
        })
        .catch(() => {});
      checkForNewStamps()
        .catch(() => [])
        .then(() => loadStamps())
        .then((list) => !cancelled && setStamped(new Set(list.map((s) => s.expeditionId))))
        .catch(() => {});
      return () => {
        cancelled = true;
      };
    }, [])
  );

  return (
    <GradientBackground>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ flexDirection: "row", alignItems: "center", paddingHorizontal: space.lg, paddingTop: space.sm, marginBottom: space.sm }}>
          <Pressable onPress={goBack} hitSlop={12} style={{ marginRight: space.sm }} accessibilityRole="button" accessibilityLabel={t("common.back")}>
            <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
          </Pressable>
          <Text accessibilityRole="header" style={[type.title, { color: colors.textPrimary }]}>
            {t("learn.expeditions")}
          </Text>
        </View>

        <ScrollView contentContainerStyle={{ padding: space.lg, paddingTop: 0, paddingBottom: space.xxl }}>
          <Text style={[type.bodySmall, { color: colors.textMuted, marginBottom: space.md }]}>
            {t("expeditions.intro", { level: t("mastery.geographer"), percent: EXPEDITION_COMPLETION_THRESHOLD })} {t("expeditions.rewardsNote")}
          </Text>
          {EXPEDITIONS.map((exp) => {
            const p = progress.get(exp.id);
            const title = expeditionTitle(exp, t.lang);
            const description = expeditionDescription(exp, t.lang);
            const countLine = t("expeditions.countries", { done: p?.completedCountryIds.length ?? 0, total: exp.countryIds.length });
            return (
              <Pressable
                key={exp.id}
                onPress={() => router.push(`/expeditions/${exp.id}`)}
                accessibilityRole="button"
                accessibilityLabel={`${title}. ${description} ${countLine}.`}
              >
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
                      <Text style={[type.body, { color: colors.textPrimary, fontFamily: fontFamily.bodySemiBold }]}>{title}</Text>
                      <Text style={[type.bodySmall, { color: colors.textMuted, marginTop: 2 }]}>{description}</Text>
                    </View>
                    {stamped.has(exp.id) ? (
                      <Text accessibilityLabel={t("passport.newStamp")} style={{ fontSize: 18 }}>
                        🛂
                      </Text>
                    ) : (
                      p?.isComplete && <Ionicons name="checkmark-circle" size={20} color={colors.accent} />
                    )}
                  </View>
                  <View style={{ height: 5, borderRadius: 2.5, backgroundColor: colors.background, marginTop: space.sm, overflow: "hidden" }}>
                    <View style={{ height: "100%", width: `${p?.percentComplete ?? 0}%`, backgroundColor: colors.accent }} />
                  </View>
                  <Text style={[type.bodySmall, { color: colors.textMuted, marginTop: 4, fontSize: 11 }]}>
                    {countLine}
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
