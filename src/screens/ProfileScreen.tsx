import React, { useCallback, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { GradientBackground } from "../components/ui/Primitives";
import { ActivityHeatmap } from "../components/gamification/ActivityHeatmap";
import { ContinentBarChart } from "../components/gamification/ContinentBarChart";
import { AchievementCard } from "../components/gamification/AchievementCard";
import { useTheme } from "../theme/ThemeProvider";
import { computeStats } from "../services/activityStore";
import { achievementStore } from "../services/achievementStore";
import { ACHIEVEMENTS } from "../gamification/achievements";
import type { StatsSnapshot } from "../gamification/types";

export default function ProfileScreen() {
  const { colors, type, space, radius } = useTheme();
  const [stats, setStats] = useState<StatsSnapshot | null>(null);
  const [unlockedIds, setUnlockedIds] = useState<Set<string>>(new Set());

  useFocusEffect(
    useCallback(() => {
      let cancelled = false;
      Promise.all([computeStats(), achievementStore.getUnlocked()]).then(([s, unlocked]) => {
        if (cancelled) return;
        setStats(s);
        setUnlockedIds(new Set(unlocked.map((u) => u.achievementId)));
      });
      return () => {
        cancelled = true;
      };
    }, [])
  );

  if (!stats) {
    return (
      <GradientBackground>
        <SafeAreaView style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
          <Text style={[type.body, { color: colors.textMuted }]}>Loading…</Text>
        </SafeAreaView>
      </GradientBackground>
    );
  }

  const sortedAchievements = [...ACHIEVEMENTS].sort((a, b) => Number(unlockedIds.has(b.id)) - Number(unlockedIds.has(a.id)));

  return (
    <GradientBackground>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ padding: space.lg, paddingBottom: space.xxl }}>
          <Text style={[type.hero, { color: colors.textPrimary, fontSize: 30 }]}>Profile</Text>
          <Text style={[type.subtitle, { color: colors.textMuted, marginTop: 2, marginBottom: space.lg }]}>
            {stats.totalXp.toLocaleString()} XP earned so far
          </Text>

          <View style={{ flexDirection: "row", gap: space.sm, marginBottom: space.lg }}>
            <Stat icon="flame" value={String(stats.currentStreak)} label="Day streak" />
            <Stat icon="trophy" value={String(unlockedIds.size)} label="Achievements" />
            <Stat icon="locate" value={stats.totalAnswered ? `${stats.accuracy}%` : "—"} label="Accuracy" />
          </View>

          <SectionLabel text="30-day activity" />
          <View
            style={{
              backgroundColor: colors.surfaceRaised,
              borderRadius: radius.md,
              borderWidth: 1,
              borderColor: colors.border,
              padding: space.md,
              marginBottom: space.lg,
              alignItems: "center",
            }}
          >
            <ActivityHeatmap data={stats.heatmap.slice(-84)} />
            <Text style={[type.bodySmall, { color: colors.textMuted, marginTop: space.sm }]}>
              Longest streak: {stats.longestStreak} {stats.longestStreak === 1 ? "day" : "days"}
            </Text>
          </View>

          <SectionLabel text="Mastery by continent" />
          <View
            style={{
              backgroundColor: colors.surfaceRaised,
              borderRadius: radius.md,
              borderWidth: 1,
              borderColor: colors.border,
              padding: space.md,
              marginBottom: space.lg,
            }}
          >
            <ContinentBarChart data={stats.continents} />
            {stats.strongest && stats.weakest && stats.strongest.region !== stats.weakest.region && (
              <Text style={[type.bodySmall, { color: colors.textMuted, marginTop: space.xs }]}>
                Strongest: {stats.strongest.region} · Weakest: {stats.weakest.region}
              </Text>
            )}
          </View>

          <SectionLabel text={`Achievements (${unlockedIds.size}/${ACHIEVEMENTS.length})`} />
          <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", gap: space.xs }}>
            {sortedAchievements.map((a) => (
              <AchievementCard key={a.id} achievement={a} unlocked={unlockedIds.has(a.id)} />
            ))}
          </View>

          <Text style={[type.bodySmall, { color: colors.textMuted, marginTop: space.lg, textAlign: "center" }]}>
            Daily challenges and expeditions live in the Learn tab.
          </Text>
        </ScrollView>
      </SafeAreaView>
    </GradientBackground>
  );
}

function Stat({ icon, value, label }: { icon: keyof typeof Ionicons.glyphMap; value: string; label: string }) {
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
      <Ionicons name={icon} size={16} color={colors.accent} style={{ marginBottom: 2 }} />
      <Text style={[type.data, { color: colors.textPrimary, fontSize: 17 }]}>{value}</Text>
      <Text style={[type.label, { color: colors.textMuted, marginTop: 2, fontSize: 9 }]}>{label.toUpperCase()}</Text>
    </View>
  );
}

function SectionLabel({ text }: { text: string }) {
  const { colors, type, space } = useTheme();
  return <Text style={[type.section, { color: colors.textMuted, marginBottom: space.sm }]}>{text.toUpperCase()}</Text>;
}
