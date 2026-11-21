import React, { useCallback, useEffect, useState } from "react";
import { ScrollView, Text, View, Pressable, StyleSheet } from "react-native";
import { useFocusEffect, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { COUNTRIES } from "../data/countries";
import { COUNTRY_CONTENT } from "../data/countryContent";
import { useTheme } from "../theme/ThemeProvider";
import { fontFamily, DENSE_TEXT_MAX_SCALE } from "../theme/tokens";
import { useAppStore } from "../store/useAppStore";
import { formatCompactNumber, formatLatLng } from "../utils/geo";
import { areaComparison, densityComparison, populationRank } from "../utils/countryStats";
import { FactPill, SectionHeader, ComingSoonCard, AnimatedPressable, PrimaryButton } from "../components/ui/Primitives";
import { DishGrid, HistoryTimeline, LandmarkList, ParagraphBlock, ReligionBreakdown } from "../components/country/ContentSections";
import { progressStore } from "../services/progressStore";
import { computeMastery } from "../quiz/mastery";
import { checkForNewAchievements } from "../gamification/checkAchievements";
import { useSafeBack } from "../hooks/useSafeBack";
import { Flag } from "../components/ui/Flag";
import type { Country } from "../types/country";
import type { CountryMastery } from "../quiz/types";
import { useT } from "../i18n/useT";
import { subregionName, type TranslationKey } from "../i18n/core";

const COUNTRY_BY_ID = new Map(COUNTRIES.map((c) => [c.id, c]));

type T = ReturnType<typeof useT>;

/** "Review due now" / "Next review tomorrow" / "Next review in 12 days" — when FSRS predicts recall dips to 90%. */
function describeNextReview(dueAt: number, t: T): string {
  const days = Math.ceil((dueAt - Date.now()) / (24 * 60 * 60 * 1000));
  if (days <= 0) return t("detail.reviewDue");
  if (days === 1) return t("detail.reviewTomorrow");
  return t("detail.reviewInDays", { days });
}

function densityLabel(country: Country, t: T): string {
  if (!country.population || !country.areaKm2) return "—";
  const d = country.population / country.areaKm2;
  return t("detail.densityValue", { value: d >= 100 ? Math.round(d) : Number(d.toFixed(1)) });
}

export default function CountryDetailScreen({ cca3 }: { cca3: string }) {
  const { colors, type, space, radius, scheme } = useTheme();
  const t = useT();
  const router = useRouter();
  const goBack = useSafeBack();
  const insets = useSafeAreaInsets();
  const country = COUNTRY_BY_ID.get(cca3);
  const content = COUNTRY_CONTENT[cca3];
  const isFavorite = useAppStore((s) => s.favorites.has(cca3));
  const toggleFavorite = useAppStore((s) => s.toggleFavorite);
  const recordVisit = useAppStore((s) => s.recordVisit);
  const [mastery, setMastery] = useState<CountryMastery | null>(null);
  const [nextReviewAt, setNextReviewAt] = useState<number | null>(null);

  useEffect(() => {
    if (country) recordVisit(country.id);
  }, [country, recordVisit]);

  useFocusEffect(
    useCallback(() => {
      let cancelled = false;
      progressStore
        .getAll()
        .then((records) => {
          if (cancelled) return;
          setMastery(computeMastery(cca3, records));
          const due = records.filter((r) => r.countryId === cca3 && r.lastReviewedAt).map((r) => new Date(r.dueAt).getTime());
          setNextReviewAt(due.length ? Math.min(...due) : null);
        })
        .catch(() => {});
      return () => {
        cancelled = true;
      };
    }, [cca3])
  );

  const onToggleFavorite = useCallback(() => {
    toggleFavorite(cca3);
    // Favorites count toward two achievements; record any unlock right away
    // so the Profile tab is up to date (it would otherwise wait for a quiz).
    checkForNewAchievements().catch(() => {});
  }, [cca3, toggleFavorite]);

  if (!country) {
    return (
      <SafeAreaView style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: colors.background, padding: space.xl }}>
        <Text style={[type.title, { color: colors.textPrimary, textAlign: "center" }]}>{t("detail.notFound")}</Text>
        <Text style={[type.body, { color: colors.textMuted, textAlign: "center", marginTop: space.sm }]}>
          {t("detail.notFoundBody", { code: cca3, count: COUNTRIES.length })}
        </Text>
        <PrimaryButton label={t("common.back")} onPress={goBack} style={{ marginTop: space.lg, alignSelf: "stretch" }} />
      </SafeAreaView>
    );
  }

  const heroFrom = country.accentColor ?? colors.surfaceRaised;
  const neighbors = (country.borders ?? []).map((code) => COUNTRY_BY_ID.get(code)).filter((c): c is Country => Boolean(c));
  const [lat, lng] = country.latlng;
  const name = t.country(country);
  const rank = populationRank(country.id);
  const hasStories = Boolean(content?.history || content?.culture || content?.nature || content?.food || content?.landmarks);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView contentContainerStyle={{ paddingBottom: space.xxl + insets.bottom }} showsVerticalScrollIndicator={false}>
        <LinearGradient
          colors={[heroFrom, colors.background]}
          start={{ x: 0.2, y: 0 }}
          end={{ x: 0.8, y: 1 }}
          style={{ paddingTop: insets.top + space.sm, paddingBottom: space.xl, paddingHorizontal: space.lg }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: space.lg }}>
            <Pressable onPress={goBack} hitSlop={12} style={{ marginRight: space.sm }} accessibilityRole="button" accessibilityLabel={t("common.back")}>
              <Ionicons name="chevron-back" size={26} color={colors.textPrimary} />
            </Pressable>
            <View style={{ flex: 1 }} />
            <Pressable
              onPress={onToggleFavorite}
              hitSlop={12}
              accessibilityRole="button"
              accessibilityLabel={isFavorite ? t("detail.removeFavorite", { name }) : t("detail.addFavorite", { name })}
              accessibilityState={{ selected: isFavorite }}
            >
              <Ionicons name={isFavorite ? "heart" : "heart-outline"} size={24} color={isFavorite ? colors.ember : colors.textPrimary} />
            </Pressable>
          </View>

          <View
            style={{
              alignSelf: "flex-start",
              padding: 4,
              borderRadius: radius.sm,
              backgroundColor: scheme === "dark" ? "rgba(0,0,0,0.25)" : "rgba(255,255,255,0.55)",
              borderWidth: 1.5,
              borderColor: colors.accent,
              marginBottom: space.md,
            }}
          >
            <Flag cca2={country.cca2} width={96} label={t("detail.flagOf", { name })} />
          </View>

          <Text accessibilityRole="header" style={[type.hero, { color: colors.textPrimary }]}>
            {name}
          </Text>
          {t.lang === "en" && country.name.official !== country.name.common && (
            <Text style={[type.subtitle, { color: colors.textSecondary, marginTop: 4 }]}>{country.name.official}</Text>
          )}

          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: space.md }}>
            {country.capital && <Chip icon="location-outline" label={country.capital.join(" · ")} a11yPrefix={t("detail.capital")} />}
            <Chip label={t(`continent.${country.region}` as TranslationKey)} a11yPrefix={t("detail.region")} />
            {country.subregion && <Chip label={subregionName(country.subregion, t.lang)} a11yPrefix={t("detail.subregion")} />}
            {country.landlocked && <Chip icon="lock-closed-outline" label={t("detail.landlocked")} />}
          </View>
        </LinearGradient>

        <View style={{ paddingHorizontal: space.lg }}>
          <SectionHeader title={t("detail.quickFacts")} />
          <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" }}>
            <FactPill
              label={t("detail.population")}
              value={formatCompactNumber(country.population, t.lang)}
              note={
                rank
                  ? country.populationYear
                    ? t("detail.populationRankYear", { rank, total: COUNTRIES.length, year: String(country.populationYear) })
                    : t("detail.populationRank", { rank, total: COUNTRIES.length })
                  : null
              }
            />
            <FactPill
              label={t("detail.area")}
              value={country.areaKm2 ? t("detail.areaValue", { value: country.areaKm2 }) : "—"}
              note={areaComparison(country.id, t.lang)}
            />
            <FactPill label={t("detail.density")} value={densityLabel(country, t)} note={densityComparison(country.id, t.lang)} />
            <FactPill label={t("detail.location")} value={formatLatLng(lat, lng, t.lang)} note={country.landlocked ? t("detail.landlockedNote") : null} />
            <FactPill label={t("detail.languages")} value={country.languages?.join(", ") || "—"} />
            <FactPill label={t("detail.currency")} value={country.currencies?.map((c) => c.name).join(", ") || "—"} />
            <FactPill label={t("detail.callingCode")} value={country.callingCode || "—"} />
            <FactPill label={t("detail.tld")} value={country.tld?.join(", ") || "—"} wide />
          </View>

          {country.funFact && (
            <View
              style={{
                backgroundColor: colors.surfaceRaised,
                borderRadius: radius.md,
                borderLeftWidth: 3,
                borderLeftColor: colors.accent,
                padding: space.md,
                marginTop: space.sm,
              }}
            >
              <Text maxFontSizeMultiplier={DENSE_TEXT_MAX_SCALE} style={[type.label, { color: colors.accent, marginBottom: 4 }]}>{t("detail.didYouKnow").toUpperCase()}</Text>
              <Text style={[type.body, { color: colors.textPrimary }]}>{country.funFact}</Text>
            </View>
          )}

          {mastery && (
            <>
              <SectionHeader title={t("detail.mastery")} />
              <View
                style={{
                  backgroundColor: colors.surfaceRaised,
                  borderRadius: radius.md,
                  borderWidth: StyleSheet.hairlineWidth,
                  borderColor: colors.border,
                  padding: space.md,
                }}
              >
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                  <Text style={[type.body, { color: colors.textPrimary, fontFamily: fontFamily.bodySemiBold }]}>{t(`mastery.${mastery.level}`)}</Text>
                  <Text style={[type.data, { color: colors.accent }]}>{mastery.score}%</Text>
                </View>
                <View
                  accessibilityRole="progressbar"
                  accessibilityLabel={t("detail.mastery")}
                  accessibilityValue={{ min: 0, max: 100, now: mastery.score }}
                  style={{ height: 6, borderRadius: 3, backgroundColor: colors.background, marginTop: space.sm, overflow: "hidden" }}
                >
                  <View style={{ height: "100%", width: `${mastery.score}%`, backgroundColor: colors.accent }} />
                </View>
                <Text style={[type.bodySmall, { color: colors.textMuted, marginTop: 6 }]}>
                  {t("detail.categoriesExplored", { attempted: mastery.categoriesAttempted, available: mastery.categoriesAvailable })}
                  {nextReviewAt != null ? ` · ${describeNextReview(nextReviewAt, t)}` : ""}
                </Text>
                <PrimaryButton
                  label={t("detail.practice", { name })}
                  onPress={() => router.push(`/quiz/mixed?country=${country.id}`)}
                  style={{ marginTop: space.sm }}
                />
              </View>
            </>
          )}

          {neighbors.length > 0 && (
            <>
              <SectionHeader title={t("detail.neighbors", { count: neighbors.length })} />
              <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
                {neighbors.map((n) => (
                  <AnimatedPressable key={n.id} onPress={() => router.push(`/country/${n.id}`)} accessibilityLabel={t.country(n)}>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        backgroundColor: colors.surfaceRaised,
                        borderRadius: radius.pill,
                        paddingVertical: 8,
                        paddingHorizontal: 14,
                        borderWidth: StyleSheet.hairlineWidth,
                        borderColor: colors.border,
                      }}
                    >
                      <Flag cca2={n.cca2} width={20} style={{ marginRight: 6 }} />
                      <Text style={[type.bodySmall, { color: colors.textPrimary }]}>{t.country(n)}</Text>
                    </View>
                  </AnimatedPressable>
                ))}
              </View>
            </>
          )}

          {country.religions && country.religions.length > 0 && (
            <>
              <SectionHeader title={t("detail.religion")} />
              <ReligionBreakdown religions={country.religions} />
            </>
          )}

          {hasStories && t.lang !== "en" && (
            <Text style={[type.bodySmall, { color: colors.textMuted, marginTop: space.lg, fontStyle: "italic" }]}>{t("settings.storiesInEnglish")}</Text>
          )}

          {content?.history && (
            <>
              <SectionHeader title={t("detail.history")} />
              <HistoryTimeline events={content.history} />
            </>
          )}

          {content?.culture && (
            <>
              <SectionHeader title={t("detail.culture")} />
              <ParagraphBlock text={content.culture} />
            </>
          )}

          {content?.nature && (
            <>
              <SectionHeader title={t("detail.nature")} />
              <ParagraphBlock text={content.nature} />
            </>
          )}

          {content?.food && (
            <>
              <SectionHeader title={t("detail.food")} />
              <DishGrid dishes={content.food} />
            </>
          )}

          {content?.landmarks && (
            <>
              <SectionHeader title={t("detail.landmarks")} />
              <LandmarkList landmarks={content.landmarks} />
            </>
          )}

          <SectionHeader title={t("detail.comingLater")} />
          <ComingSoonCard title={t("detail.languageLab")} note={t("detail.languageLabNote")} />

          <Text style={[type.bodySmall, { color: colors.textMuted, marginTop: space.lg, textAlign: "center" }]}>
            {t("detail.sources")}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

function Chip({ label, icon, a11yPrefix }: { label: string; icon?: React.ComponentProps<typeof Ionicons>["name"]; a11yPrefix?: string }) {
  const { colors, type, radius } = useTheme();
  return (
    <View
      accessible
      accessibilityLabel={a11yPrefix ? `${a11yPrefix}: ${label}` : label}
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
        backgroundColor: "rgba(0,0,0,0.2)",
        borderRadius: radius.pill,
        paddingVertical: 5,
        paddingHorizontal: 12,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: colors.border,
      }}
    >
      {icon && <Ionicons name={icon} size={13} color={colors.textPrimary} />}
      <Text style={[type.bodySmall, { color: colors.textPrimary }]}>{label}</Text>
    </View>
  );
}
