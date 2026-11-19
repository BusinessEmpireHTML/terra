import React, { useCallback, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { GradientBackground, PrimaryButton } from "../components/ui/Primitives";
import { ActivityHeatmap } from "../components/gamification/ActivityHeatmap";
import { ContinentBarChart } from "../components/gamification/ContinentBarChart";
import { AchievementCard } from "../components/gamification/AchievementCard";
import { useTheme, type ThemeMode } from "../theme/ThemeProvider";
import { fontFamily } from "../theme/tokens";
import { computeStats, HEATMAP_DAYS } from "../services/activityStore";
import { achievementStore } from "../services/achievementStore";
import { ACHIEVEMENTS } from "../gamification/achievements";
import type { StatsSnapshot, UnlockedAchievement } from "../gamification/types";

const TIER_RANK = { gold: 0, silver: 1, bronze: 2 } as const;
const GRID_GAP = 8;
const THEME_OPTIONS: { key: ThemeMode; label: string; icon: React.ComponentProps<typeof Ionicons>["name"] }[] = [
  { key: "system", label: "System", icon: "phone-portrait-outline" },
  { key: "light", label: "Light", icon: "sunny-outline" },
  { key: "dark", label: "Dark", icon: "moon-outline" },
];

export default function ProfileScreen() {
  const { colors, type, space, radius } = useTheme();
  const [stats, setStats] = useState<StatsSnapshot | null>(null);
  const [unlocked, setUnlocked] = useState<Map<string, UnlockedAchievement>>(new Map());
  const [error, setError] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [gridWidth, setGridWidth] = useState(0);

  useFocusEffect(
    useCallback(() => {
      let cancelled = false;
      setError(false);
      Promise.all([computeStats(), achievementStore.getUnlocked()])
        .then(([s, list]) => {
          if (cancelled) return;
          setStats(s);
          setUnlocked(new Map(list.map((u) => [u.achievementId, u])));
        })
        .catch((err) => {
          if (__DEV__) console.warn("Failed to load profile:", err);
          if (!cancelled) setError(true);
        });
      return () => {
        cancelled = true;
      };
    }, [reloadKey])
  );

  if (!stats) {
    return (
      <GradientBackground>
        <SafeAreaView style={{ flex: 1, alignItems: "center", justifyContent: "center", padding: space.xl }}>
          <Text style={[type.body, { color: colors.textMuted, textAlign: "center" }]}>
            {error ? "Couldn't load your stats." : "Loading…"}
          </Text>
          {error && <PrimaryButton label="Try again" onPress={() => setReloadKey((k) => k + 1)} style={{ marginTop: space.lg, alignSelf: "stretch" }} />}
        </SafeAreaView>
      </GradientBackground>
    );
  }

  // Unlocked first (most recent first), then locked ones from gold to bronze.
  const sortedAchievements = [...ACHIEVEMENTS].sort((a, b) => {
    const ua = unlocked.get(a.id);
    const ub = unlocked.get(b.id);
    if (ua && ub) return ub.unlockedAt.localeCompare(ua.unlockedAt);
    if (ua || ub) return ua ? -1 : 1;
    return TIER_RANK[a.tier] - TIER_RANK[b.tier];
  });
  const selected = selectedId ? ACHIEVEMENTS.find((a) => a.id === selectedId) : null;
  const selectedUnlock = selected ? unlocked.get(selected.id) : undefined;
  const columns = gridWidth >= 560 ? 5 : 3;
  const cardWidth = gridWidth ? Math.floor((gridWidth - GRID_GAP * (columns - 1)) / columns) : 0;

  return (
    <GradientBackground>
      <SafeAreaView style={{ flex: 1 }} edges={["top", "left", "right"]}>
        <ScrollView contentContainerStyle={{ padding: space.lg, paddingBottom: space.xxl }}>
          <Text accessibilityRole="header" style={[type.hero, { color: colors.textPrimary, fontSize: 30 }]}>
            Profile
          </Text>
          <Text style={[type.subtitle, { color: colors.textMuted, marginTop: 2, marginBottom: space.lg }]}>
            {stats.totalXp.toLocaleString("en-US")} XP earned so far
          </Text>

          <View style={{ flexDirection: "row", gap: space.sm, marginBottom: space.lg }}>
            <Stat icon="flame" value={String(stats.currentStreak)} label="Day streak" />
            <Stat icon="trophy" value={`${unlocked.size}`} label="Achievements" />
            <Stat icon="locate" value={stats.totalAnswered ? `${stats.accuracy}%` : "—"} label="Accuracy" />
          </View>

          <SectionLabel text={`Last ${Math.round(HEATMAP_DAYS / 7)} weeks`} />
          <Card>
            <View style={{ alignItems: "center" }}>
              <ActivityHeatmap data={stats.heatmap} />
            </View>
            <Text style={[type.bodySmall, { color: colors.textMuted, marginTop: space.sm, textAlign: "center" }]}>
              {stats.questionsToday} answered today · Longest streak: {stats.longestStreak} {stats.longestStreak === 1 ? "day" : "days"}
            </Text>
          </Card>

          <SectionLabel text="Mastery by continent" />
          <Card>
            <ContinentBarChart data={stats.continents} />
            {stats.strongest && stats.weakest && stats.strongest.region !== stats.weakest.region && (
              <Text style={[type.bodySmall, { color: colors.textMuted, marginTop: space.sm }]}>
                Strongest: {stats.strongest.region} · Weakest: {stats.weakest.region}
              </Text>
            )}
          </Card>

          <SectionLabel text={`Achievements (${unlocked.size}/${ACHIEVEMENTS.length})`} />
          <Card style={{ marginBottom: space.sm, paddingVertical: space.sm }}>
            {selected ? (
              <>
                <Text style={[type.body, { color: colors.textPrimary, fontFamily: fontFamily.bodySemiBold }]}>{selected.title}</Text>
                <Text style={[type.bodySmall, { color: colors.textSecondary, marginTop: 2 }]}>{selected.description}</Text>
                <Text style={[type.label, { color: selectedUnlock ? colors.accentSecondary : colors.textMuted, marginTop: 6 }]}>
                  {selectedUnlock
                    ? `UNLOCKED ${new Date(selectedUnlock.unlockedAt).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" }).toUpperCase()}`
                    : `LOCKED · ${selected.tier.toUpperCase()} TIER`}
                </Text>
              </>
            ) : (
              <Text style={[type.bodySmall, { color: colors.textMuted }]}>Tap a badge to see how to earn it.</Text>
            )}
          </Card>
          <View
            onLayout={(e) => setGridWidth(e.nativeEvent.layout.width)}
            style={{ flexDirection: "row", flexWrap: "wrap", gap: GRID_GAP, marginBottom: space.lg }}
          >
            {cardWidth > 0 &&
              sortedAchievements.map((a) => (
                <AchievementCard
                  key={a.id}
                  achievement={a}
                  unlocked={unlocked.has(a.id)}
                  selected={a.id === selectedId}
                  width={cardWidth}
                  onPress={() => setSelectedId((cur) => (cur === a.id ? null : a.id))}
                />
              ))}
          </View>

          <SectionLabel text="Appearance" />
          <AppearancePicker />

          <Text style={[type.bodySmall, { color: colors.textMuted, marginTop: space.lg, textAlign: "center" }]}>
            Daily challenges and expeditions live in the Learn tab.
          </Text>
        </ScrollView>
      </SafeAreaView>
    </GradientBackground>
  );
}

function AppearancePicker() {
  const { colors, type, space, radius, mode, setMode } = useTheme();
  return (
    <View
      accessibilityRole="radiogroup"
      style={{
        flexDirection: "row",
        backgroundColor: colors.surfaceRaised,
        borderRadius: radius.md,
        borderWidth: 1,
        borderColor: colors.border,
        padding: 4,
        gap: 4,
      }}
    >
      {THEME_OPTIONS.map((opt) => {
        const active = mode === opt.key;
        return (
          <Pressable
            key={opt.key}
            onPress={() => setMode(opt.key)}
            accessibilityRole="radio"
            accessibilityState={{ checked: active }}
            accessibilityLabel={`${opt.label} appearance`}
            style={{
              flex: 1,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
              paddingVertical: space.sm,
              borderRadius: radius.sm,
              backgroundColor: active ? colors.accent : "transparent",
            }}
          >
            <Ionicons name={opt.icon} size={15} color={active ? colors.background : colors.textMuted} />
            <Text style={[type.bodySmall, { color: active ? colors.background : colors.textSecondary, fontFamily: fontFamily.bodySemiBold }]}>
              {opt.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

function Card({ children, style }: { children: React.ReactNode; style?: object }) {
  const { colors, space, radius } = useTheme();
  return (
    <View
      style={[
        { backgroundColor: colors.surfaceRaised, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, padding: space.md, marginBottom: space.lg },
        style,
      ]}
    >
      {children}
    </View>
  );
}

function Stat({ icon, value, label }: { icon: React.ComponentProps<typeof Ionicons>["name"]; value: string; label: string }) {
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
      <Ionicons name={icon} size={16} color={colors.accent} style={{ marginBottom: 2 }} />
      <Text style={[type.data, { color: colors.textPrimary, fontSize: 17 }]}>{value}</Text>
      <Text style={[type.label, { color: colors.textMuted, marginTop: 2, fontSize: 9 }]}>{label.toUpperCase()}</Text>
    </View>
  );
}

function SectionLabel({ text }: { text: string }) {
  const { colors, type, space } = useTheme();
  return (
    <Text accessibilityRole="header" style={[type.section, { color: colors.textMuted, marginBottom: space.sm }]}>
      {text.toUpperCase()}
    </Text>
  );
}
