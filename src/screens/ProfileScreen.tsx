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
import { fontFamily, DENSE_TEXT_MAX_SCALE } from "../theme/tokens";
import { computeStats, HEATMAP_DAYS } from "../services/activityStore";
import { achievementStore } from "../services/achievementStore";
import { ACHIEVEMENTS } from "../gamification/achievements";
import type { StatsSnapshot, UnlockedAchievement } from "../gamification/types";
import { useT } from "../i18n/useT";
import { achievementDescription, achievementTitle } from "../i18n/catalog";
import { LANGUAGES, localeFor, type TranslationKey } from "../i18n/core";
import { useAppStore, type LanguageMode } from "../store/useAppStore";
import { ensureReminderPermission, openNotificationSettings, remindersSupported, rescheduleReminders } from "../services/reminders";

const TIER_RANK = { gold: 0, silver: 1, bronze: 2 } as const;
const GRID_GAP = 8;
const THEME_OPTIONS = [
  { key: "system", label: "profile.themeSystem", icon: "phone-portrait-outline" },
  { key: "light", label: "profile.themeLight", icon: "sunny-outline" },
  { key: "dark", label: "profile.themeDark", icon: "moon-outline" },
] as const satisfies readonly { key: ThemeMode; label: TranslationKey; icon: React.ComponentProps<typeof Ionicons>["name"] }[];
/** Reminder times offered (local hour); null = off. */
const REMINDER_HOURS = [null, 8, 12, 18, 20] as const;

export default function ProfileScreen() {
  const { colors, type, space, radius } = useTheme();
  const t = useT();
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
            {error ? t("profile.loadError") : t("common.loading")}
          </Text>
          {error && <PrimaryButton label={t("common.tryAgain")} onPress={() => setReloadKey((k) => k + 1)} style={{ marginTop: space.lg, alignSelf: "stretch" }} />}
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
            {t("tabs.profile")}
          </Text>
          <Text style={[type.subtitle, { color: colors.textMuted, marginTop: 2, marginBottom: space.lg }]}>
            {t("profile.xp", { xp: stats.totalXp })}
          </Text>

          <View style={{ flexDirection: "row", gap: space.sm, marginBottom: space.lg }}>
            <Stat icon="flame" value={String(stats.currentStreak)} label={t("profile.dayStreak")} />
            <Stat icon="trophy" value={`${unlocked.size}`} label={t("profile.achievements")} />
            <Stat icon="locate" value={stats.totalAnswered ? `${stats.accuracy}%` : "—"} label={t("learn.accuracy")} />
          </View>

          <SectionLabel text={t("profile.lastWeeks", { weeks: Math.round(HEATMAP_DAYS / 7) })} />
          <Card>
            <View style={{ alignItems: "center" }}>
              <ActivityHeatmap data={stats.heatmap} />
            </View>
            <Text style={[type.bodySmall, { color: colors.textMuted, marginTop: space.sm, textAlign: "center" }]}>
              {t(stats.longestStreak === 1 ? "profile.activityLineOne" : "profile.activityLine", {
                count: stats.questionsToday,
                streak: stats.longestStreak,
              })}
            </Text>
          </Card>

          <SectionLabel text={t("profile.masteryByContinent")} />
          <Card>
            <ContinentBarChart data={stats.continents} />
            {stats.strongest && stats.weakest && stats.strongest.region !== stats.weakest.region && (
              <Text style={[type.bodySmall, { color: colors.textMuted, marginTop: space.sm }]}>
                {t("profile.strongestWeakest", {
                  strong: t(`continent.${stats.strongest.region}` as TranslationKey),
                  weak: t(`continent.${stats.weakest.region}` as TranslationKey),
                })}
              </Text>
            )}
          </Card>

          <SectionLabel text={t("profile.achievementsCount", { unlocked: unlocked.size, total: ACHIEVEMENTS.length })} />
          <Card style={{ marginBottom: space.sm, paddingVertical: space.sm }}>
            {selected ? (
              <>
                <Text style={[type.body, { color: colors.textPrimary, fontFamily: fontFamily.bodySemiBold }]}>{achievementTitle(selected, t.lang)}</Text>
                <Text style={[type.bodySmall, { color: colors.textSecondary, marginTop: 2 }]}>{achievementDescription(selected, t.lang)}</Text>
                <Text maxFontSizeMultiplier={DENSE_TEXT_MAX_SCALE} style={[type.label, { color: selectedUnlock ? colors.accentSecondary : colors.textMuted, marginTop: 6 }]}>
                  {(selectedUnlock
                    ? t("profile.unlockedOn", {
                        date: new Date(selectedUnlock.unlockedAt).toLocaleDateString(localeFor(t.lang), { month: "short", day: "numeric", year: "numeric" }),
                      })
                    : t("profile.lockedTier", { tier: t(`tier.${selected.tier}`) })
                  ).toUpperCase()}
                </Text>
              </>
            ) : (
              <Text style={[type.bodySmall, { color: colors.textMuted }]}>{t("profile.tapBadge")}</Text>
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

          <SectionLabel text={t("settings.reminders")} />
          <ReminderPicker />

          <SectionLabel text={t("settings.language")} />
          <LanguagePicker />

          <SectionLabel text={t("profile.appearance")} />
          <AppearancePicker />

          <Text style={[type.bodySmall, { color: colors.textMuted, marginTop: space.lg, textAlign: "center" }]}>
            {t("profile.footer")}
          </Text>
        </ScrollView>
      </SafeAreaView>
    </GradientBackground>
  );
}

/** A row of pill-shaped radio buttons (wraps onto more lines when needed). */
function PillGroup<K extends string | number | null>({
  options,
  value,
  onChange,
}: {
  options: { key: K; label: string; a11yLabel?: string }[];
  value: K;
  onChange: (key: K) => void;
}) {
  const { colors, type, space, radius } = useTheme();
  return (
    <View accessibilityRole="radiogroup" style={{ flexDirection: "row", flexWrap: "wrap", gap: space.sm }}>
      {options.map((opt) => {
        const active = value === opt.key;
        return (
          <Pressable
            key={String(opt.key)}
            onPress={() => onChange(opt.key)}
            accessibilityRole="radio"
            accessibilityState={{ checked: active }}
            accessibilityLabel={opt.a11yLabel ?? opt.label}
            style={{
              paddingVertical: space.sm,
              paddingHorizontal: space.md,
              borderRadius: radius.pill,
              borderWidth: 1,
              borderColor: active ? colors.accent : colors.border,
              backgroundColor: active ? colors.accent : colors.surfaceRaised,
            }}
          >
            <Text style={[type.bodySmall, { color: active ? colors.background : colors.textSecondary, fontFamily: fontFamily.bodySemiBold }]}>
              {opt.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

function LanguagePicker() {
  const { colors, type, space } = useTheme();
  const t = useT();
  const mode = useAppStore((s) => s.languageMode);
  const setLanguageMode = useAppStore((s) => s.setLanguageMode);
  const onChange = (next: LanguageMode) => {
    setLanguageMode(next);
    // Scheduled reminders carry their text, so rewrite them in the new language.
    rescheduleReminders(useAppStore.getState().reminderHour).catch(() => {});
  };
  return (
    <View style={{ marginBottom: space.lg }}>
      <PillGroup<LanguageMode>
        options={[{ key: "system", label: t("settings.languageSystem") }, ...LANGUAGES.map((l) => ({ key: l.code, label: l.name }))]}
        value={mode}
        onChange={onChange}
      />
      {t.lang !== "en" && (
        <Text style={[type.bodySmall, { color: colors.textMuted, marginTop: space.sm }]}>{t("settings.storiesInEnglish")}</Text>
      )}
    </View>
  );
}

function formatHour(hour: number, locale: string): string {
  return new Date(2000, 0, 1, hour).toLocaleTimeString(locale, { hour: "numeric", minute: "2-digit" });
}

function ReminderPicker() {
  const { colors, type, space } = useTheme();
  const t = useT();
  const hour = useAppStore((s) => s.reminderHour);
  const setReminderHour = useAppStore((s) => s.setReminderHour);
  const [denied, setDenied] = useState(false);

  if (!remindersSupported) {
    return <Text style={[type.bodySmall, { color: colors.textMuted, marginBottom: space.lg }]}>{t("settings.remindersUnavailable")}</Text>;
  }

  const onChange = async (next: number | null) => {
    if (next != null && !(await ensureReminderPermission())) {
      setDenied(true);
      return;
    }
    setDenied(false);
    setReminderHour(next);
    rescheduleReminders(next).catch(() => {});
  };

  return (
    <View style={{ marginBottom: space.lg }}>
      <PillGroup<number | null>
        options={REMINDER_HOURS.map((h) => ({ key: h, label: h == null ? t("settings.remindersOff") : formatHour(h, localeFor(t.lang)) }))}
        value={hour}
        onChange={(next) => void onChange(next)}
      />
      <Text style={[type.bodySmall, { color: colors.textMuted, marginTop: space.sm }]}>{t("settings.remindersHint")}</Text>
      {denied && (
        <View style={{ flexDirection: "row", alignItems: "center", flexWrap: "wrap", gap: space.sm, marginTop: space.sm }}>
          <Text style={[type.bodySmall, { color: colors.ember }]}>{t("settings.remindersDenied")}</Text>
          <Pressable onPress={openNotificationSettings} accessibilityRole="button" hitSlop={8}>
            <Text style={[type.bodySmall, { color: colors.accent, fontFamily: fontFamily.bodySemiBold }]}>{t("settings.openSettings")}</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

function AppearancePicker() {
  const { colors, type, space, radius, mode, setMode } = useTheme();
  const t = useT();
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
            accessibilityLabel={t("profile.appearanceA11y", { option: t(opt.label) })}
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
              {t(opt.label)}
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
      <Text maxFontSizeMultiplier={DENSE_TEXT_MAX_SCALE} style={[type.label, { color: colors.textMuted, marginTop: 2, fontSize: 9 }]}>{label.toUpperCase()}</Text>
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
