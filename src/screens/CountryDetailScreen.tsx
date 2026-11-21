import React, { useCallback, useEffect, useState } from "react";
import { ScrollView, Text, View, Pressable, StyleSheet } from "react-native";
import { useFocusEffect, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { COUNTRIES } from "../data/countries";
import { COUNTRY_CONTENT } from "../data/countryContent";
import { useTheme } from "../theme/ThemeProvider";
import { fontFamily } from "../theme/tokens";
import { useAppStore } from "../store/useAppStore";
import { formatCompactNumber, formatLatLng } from "../utils/geo";
import { areaComparison, densityComparison, populationRank } from "../utils/countryStats";
import { FactPill, SectionHeader, ComingSoonCard, AnimatedPressable, PrimaryButton } from "../components/ui/Primitives";
import { DishGrid, HistoryTimeline, LandmarkList, ParagraphBlock, ReligionBreakdown } from "../components/country/ContentSections";
import { progressStore } from "../services/progressStore";
import { computeMastery } from "../quiz/mastery";
import { checkForNewAchievements } from "../gamification/checkAchievements";
import { useSafeBack } from "../hooks/useSafeBack";
import type { Country } from "../types/country";
import type { CountryMastery } from "../quiz/types";

const COUNTRY_BY_ID = new Map(COUNTRIES.map((c) => [c.id, c]));

/** "Review due now" / "Next review tomorrow" / "Next review in 12 days" — when FSRS predicts recall dips to 90%. */
function describeNextReview(dueAt: number): string {
  const days = Math.ceil((dueAt - Date.now()) / (24 * 60 * 60 * 1000));
  if (days <= 0) return "review due now";
  if (days === 1) return "next review tomorrow";
  return `next review in ${days} days`;
}

function densityLabel(country: Country): string {
  if (!country.population || !country.areaKm2) return "—";
  const d = country.population / country.areaKm2;
  return `${d >= 100 ? Math.round(d).toLocaleString("en-US") : d.toFixed(1)} people per km²`;
}

export default function CountryDetailScreen({ cca3 }: { cca3: string }) {
  const { colors, type, space, radius, scheme } = useTheme();
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
        <Text style={[type.title, { color: colors.textPrimary, textAlign: "center" }]}>Country not found</Text>
        <Text style={[type.body, { color: colors.textMuted, textAlign: "center", marginTop: space.sm }]}>
          “{cca3}” isn’t one of the {COUNTRIES.length} countries in Terra.
        </Text>
        <PrimaryButton label="Back" onPress={goBack} style={{ marginTop: space.lg, alignSelf: "stretch" }} />
      </SafeAreaView>
    );
  }

  const heroFrom = country.accentColor ?? colors.surfaceRaised;
  const neighbors = (country.borders ?? []).map((code) => COUNTRY_BY_ID.get(code)).filter((c): c is Country => Boolean(c));
  const [lat, lng] = country.latlng;

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
            <Pressable onPress={goBack} hitSlop={12} style={{ marginRight: space.sm }} accessibilityRole="button" accessibilityLabel="Back">
              <Ionicons name="chevron-back" size={26} color={colors.textPrimary} />
            </Pressable>
            <View style={{ flex: 1 }} />
            <Pressable
              onPress={onToggleFavorite}
              hitSlop={12}
              accessibilityRole="button"
              accessibilityLabel={isFavorite ? `Remove ${country.name.common} from favorites` : `Add ${country.name.common} to favorites`}
              accessibilityState={{ selected: isFavorite }}
            >
              <Ionicons name={isFavorite ? "heart" : "heart-outline"} size={24} color={isFavorite ? colors.ember : colors.textPrimary} />
            </Pressable>
          </View>

          <View
            accessible
            accessibilityLabel={`Flag of ${country.name.common}`}
            style={{
              width: 84,
              height: 84,
              borderRadius: 42,
              backgroundColor: scheme === "dark" ? "rgba(0,0,0,0.25)" : "rgba(255,255,255,0.55)",
              borderWidth: 2,
              borderColor: colors.accent,
              alignItems: "center",
              justifyContent: "center",
              marginBottom: space.md,
            }}
          >
            <Text style={{ fontSize: 42 }}>{country.flagEmoji}</Text>
          </View>

          <Text accessibilityRole="header" style={[type.hero, { color: colors.textPrimary }]}>
            {country.name.common}
          </Text>
          {country.name.official !== country.name.common && (
            <Text style={[type.subtitle, { color: colors.textSecondary, marginTop: 4 }]}>{country.name.official}</Text>
          )}

          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: space.md }}>
            {country.capital && <Chip icon="location-outline" label={country.capital.join(" · ")} a11yPrefix="Capital" />}
            <Chip label={country.region} a11yPrefix="Region" />
            {country.subregion && <Chip label={country.subregion} a11yPrefix="Subregion" />}
            {country.landlocked && <Chip icon="lock-closed-outline" label="Landlocked" />}
          </View>
        </LinearGradient>

        <View style={{ paddingHorizontal: space.lg }}>
          <SectionHeader title="Quick Facts" />
          <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" }}>
            <FactPill
              label="Population"
              value={formatCompactNumber(country.population)}
              note={populationRank(country.id) ? `#${populationRank(country.id)} of ${COUNTRIES.length} countries${country.populationYear ? ` (${country.populationYear})` : ""}` : null}
            />
            <FactPill label="Area" value={country.areaKm2 ? `${country.areaKm2.toLocaleString("en-US")} km²` : "—"} note={areaComparison(country.id)} />
            <FactPill label="Density" value={densityLabel(country)} note={densityComparison(country.id)} />
            <FactPill label="Location" value={formatLatLng(lat, lng)} note={country.landlocked ? "Landlocked — no coastline" : null} />
            <FactPill label="Languages" value={country.languages?.join(", ") || "—"} />
            <FactPill label="Currency" value={country.currencies?.map((c) => c.name).join(", ") || "—"} />
            <FactPill label="Calling code" value={country.callingCode || "—"} />
            <FactPill label="Internet TLD" value={country.tld?.join(", ") || "—"} wide />
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
              <Text style={[type.label, { color: colors.accent, marginBottom: 4 }]}>DID YOU KNOW</Text>
              <Text style={[type.body, { color: colors.textPrimary }]}>{country.funFact}</Text>
            </View>
          )}

          {mastery && (
            <>
              <SectionHeader title="Mastery" />
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
                  <Text style={[type.body, { color: colors.textPrimary, fontFamily: fontFamily.bodySemiBold }]}>{mastery.levelLabel}</Text>
                  <Text style={[type.data, { color: colors.accent }]}>{mastery.score}%</Text>
                </View>
                <View
                  accessibilityRole="progressbar"
                  accessibilityLabel="Mastery"
                  accessibilityValue={{ min: 0, max: 100, now: mastery.score }}
                  style={{ height: 6, borderRadius: 3, backgroundColor: colors.background, marginTop: space.sm, overflow: "hidden" }}
                >
                  <View style={{ height: "100%", width: `${mastery.score}%`, backgroundColor: colors.accent }} />
                </View>
                <Text style={[type.bodySmall, { color: colors.textMuted, marginTop: 6 }]}>
                  {mastery.categoriesAttempted} / {mastery.categoriesAvailable} quiz categories explored
                  {nextReviewAt != null ? ` · ${describeNextReview(nextReviewAt)}` : ""}
                </Text>
                <PrimaryButton
                  label={`Practice ${country.name.common}`}
                  onPress={() => router.push(`/quiz/mixed?country=${country.id}`)}
                  style={{ marginTop: space.sm }}
                />
              </View>
            </>
          )}

          {neighbors.length > 0 && (
            <>
              <SectionHeader title={`Neighbors (${neighbors.length})`} />
              <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
                {neighbors.map((n) => (
                  <AnimatedPressable key={n.id} onPress={() => router.push(`/country/${n.id}`)} accessibilityLabel={n.name.common}>
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
                      <Text style={{ fontSize: 16, marginRight: 6 }}>{n.flagEmoji}</Text>
                      <Text style={[type.bodySmall, { color: colors.textPrimary }]}>{n.name.common}</Text>
                    </View>
                  </AnimatedPressable>
                ))}
              </View>
            </>
          )}

          {country.religions && country.religions.length > 0 && (
            <>
              <SectionHeader title="Religion" />
              <ReligionBreakdown religions={country.religions} />
            </>
          )}

          {content?.history && (
            <>
              <SectionHeader title="History" />
              <HistoryTimeline events={content.history} />
            </>
          )}

          {content?.culture && (
            <>
              <SectionHeader title="Culture" />
              <ParagraphBlock text={content.culture} />
            </>
          )}

          {content?.nature && (
            <>
              <SectionHeader title="Nature" />
              <ParagraphBlock text={content.nature} />
            </>
          )}

          {content?.food && (
            <>
              <SectionHeader title="Food" />
              <DishGrid dishes={content.food} />
            </>
          )}

          {content?.landmarks && (
            <>
              <SectionHeader title="Landmarks" />
              <LandmarkList landmarks={content.landmarks} />
            </>
          )}

          <SectionHeader title="Coming later" />
          <ComingSoonCard title="Language Lab" note="Greetings, numbers, writing practice, and pronunciation audio, per country." />

          <Text style={[type.bodySmall, { color: colors.textMuted, marginTop: space.lg, textAlign: "center" }]}>
            Population: World Bank. Country data: world-countries (ODbL).
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
