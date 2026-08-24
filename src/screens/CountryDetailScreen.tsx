import React, { useCallback, useEffect, useState } from "react";
import { ScrollView, Text, View, Pressable, StyleSheet } from "react-native";
import { useFocusEffect, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { COUNTRIES } from "../data/countries";
import { COUNTRY_CONTENT } from "../data/countryContent";
import { useTheme } from "../theme/ThemeProvider";
import { useAppStore } from "../store/useAppStore";
import { formatCompactNumber } from "../utils/geo";
import { FactPill, SectionHeader, ComingSoonCard, AnimatedPressable } from "../components/ui/Primitives";
import { DishGrid, HistoryTimeline, LandmarkList, ParagraphBlock, ReligionBreakdown } from "../components/country/ContentSections";
import { progressStore } from "../services/progressStore";
import { computeMastery } from "../quiz/mastery";
import type { CountryMastery } from "../quiz/types";

export default function CountryDetailScreen({ cca3 }: { cca3: string }) {
  const { colors, type, space, radius, scheme } = useTheme();
  const router = useRouter();
  const country = COUNTRIES.find((c) => c.id === cca3);
  const content = COUNTRY_CONTENT[cca3];
  const isFavorite = useAppStore((s) => s.isFavorite(cca3));
  const toggleFavorite = useAppStore((s) => s.toggleFavorite);
  const recordVisit = useAppStore((s) => s.recordVisit);
  const [mastery, setMastery] = useState<CountryMastery | null>(null);

  useEffect(() => {
    if (country) recordVisit(country.id);
  }, [country?.id]);

  useFocusEffect(
    useCallback(() => {
      let cancelled = false;
      progressStore.getAll().then((records) => {
        if (!cancelled) setMastery(computeMastery(cca3, records));
      });
      return () => {
        cancelled = true;
      };
    }, [cca3])
  );

  if (!country) {
    return (
      <SafeAreaView style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: colors.background }}>
        <Text style={[type.body, { color: colors.textSecondary }]}>Country not found.</Text>
      </SafeAreaView>
    );
  }

  const heroFrom = country.accentColor ?? colors.surfaceRaised;
  const neighbors = (country.borders ?? [])
    .map((code) => COUNTRIES.find((c) => c.id === code))
    .filter(Boolean);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView contentContainerStyle={{ paddingBottom: space.xxl }} showsVerticalScrollIndicator={false}>
        <LinearGradient
          colors={[heroFrom, colors.background]}
          start={{ x: 0.2, y: 0 }}
          end={{ x: 0.8, y: 1 }}
          style={{ paddingTop: 60, paddingBottom: space.xl, paddingHorizontal: space.lg }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: space.lg }}>
            <Pressable onPress={() => router.back()} hitSlop={12} style={{ marginRight: space.sm }}>
              <Ionicons name="chevron-back" size={26} color={colors.textPrimary} />
            </Pressable>
            <View style={{ flex: 1 }} />
            <Pressable onPress={() => toggleFavorite(country.id)} hitSlop={12}>
              <Ionicons
                name={isFavorite ? "heart" : "heart-outline"}
                size={24}
                color={isFavorite ? colors.ember : colors.textPrimary}
              />
            </Pressable>
          </View>

          <View
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

          <Text style={[type.hero, { color: colors.textPrimary }]}>{country.name.common}</Text>
          <Text style={[type.subtitle, { color: colors.textSecondary, marginTop: 4 }]}>{country.name.official}</Text>

          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: space.md }}>
            {country.capital && <Chip label={`📍 ${country.capital[0]}`} />}
            <Chip label={country.region} />
            {country.subregion && <Chip label={country.subregion} />}
          </View>
        </LinearGradient>

        <View style={{ paddingHorizontal: space.lg }}>
          <SectionHeader title="Quick Facts" />
          <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" }}>
            <FactPill label="Population" value={formatCompactNumber(country.population)} />
            <FactPill label="Area" value={country.areaKm2 ? `${formatCompactNumber(country.areaKm2)} km²` : "—"} />
            <FactPill label="Languages" value={country.languages?.join(", ") || "—"} />
            <FactPill label="Currency" value={country.currencies?.map((c) => c.name).join(", ") || "—"} />
            <FactPill label="Calling code" value={country.callingCode || "—"} />
            <FactPill label="Internet TLD" value={country.tld?.join(", ") || "—"} />
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
                  <Text style={[type.body, { color: colors.textPrimary, fontFamily: "Manrope_700Bold" }]}>{mastery.levelLabel}</Text>
                  <Text style={[type.data, { color: colors.accent }]}>{mastery.score}%</Text>
                </View>
                <View style={{ height: 6, borderRadius: 3, backgroundColor: colors.background, marginTop: space.sm, overflow: "hidden" }}>
                  <View style={{ height: "100%", width: `${mastery.score}%`, backgroundColor: colors.accent }} />
                </View>
                <Text style={[type.bodySmall, { color: colors.textMuted, marginTop: 6 }]}>
                  {mastery.categoriesAttempted} / {mastery.categoriesAvailable} categories explored
                </Text>
                <AnimatedPressable onPress={() => router.push(`/quiz/mixed?country=${country.id}`)} style={{ marginTop: space.sm }}>
                  <View
                    style={{
                      backgroundColor: colors.accent,
                      borderRadius: radius.sm,
                      paddingVertical: 10,
                      alignItems: "center",
                    }}
                  >
                    <Text style={[type.bodySmall, { color: colors.background, fontFamily: "Manrope_700Bold" }]}>
                      Practice {country.name.common}
                    </Text>
                  </View>
                </AnimatedPressable>
              </View>
            </>
          )}

          {neighbors.length > 0 && (
            <>
              <SectionHeader title="Neighbors" />
              <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
                {neighbors.map((n) => (
                  <AnimatedPressable key={n!.id} onPress={() => router.push(`/country/${n!.id}`)}>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        backgroundColor: colors.surfaceRaised,
                        borderRadius: 999,
                        paddingVertical: 8,
                        paddingHorizontal: 14,
                        borderWidth: StyleSheet.hairlineWidth,
                        borderColor: colors.border,
                      }}
                    >
                      <Text style={{ fontSize: 16, marginRight: 6 }}>{n!.flagEmoji}</Text>
                      <Text style={[type.bodySmall, { color: colors.textPrimary }]}>{n!.name.common}</Text>
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
        </View>
      </ScrollView>
    </View>
  );
}

function Chip({ label }: { label: string }) {
  const { colors, type } = useTheme();
  return (
    <View
      style={{
        backgroundColor: "rgba(0,0,0,0.2)",
        borderRadius: 999,
        paddingVertical: 5,
        paddingHorizontal: 12,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: colors.border,
      }}
    >
      <Text style={[type.bodySmall, { color: colors.textPrimary }]}>{label}</Text>
    </View>
  );
}
