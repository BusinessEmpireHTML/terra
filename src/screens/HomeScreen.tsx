import React, { useCallback, useEffect, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { useFocusEffect, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeOut } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { Globe, type GlobeLayer } from "../components/globe/Globe";
import { MapLegend } from "../components/globe/MapLegend";
import { CountrySearchSheet } from "../components/search/CountrySearchSheet";
import { GradientBackground } from "../components/ui/Primitives";
import { useTheme } from "../theme/ThemeProvider";
import { useAppStore } from "../store/useAppStore";
import { COUNTRIES } from "../data/countries";
import { progressStore } from "../services/progressStore";
import { computeAllMastery } from "../quiz/mastery";
import type { Country } from "../types/country";

const LAYERS: { key: GlobeLayer; label: string }[] = [
  { key: "political", label: "Borders" },
  { key: "population", label: "Population" },
  { key: "density", label: "Density" },
  { key: "mastery", label: "Mastery" },
];
const COUNTRY_BY_ID = new Map(COUNTRIES.map((c) => [c.id, c]));

export default function HomeScreen() {
  const { colors, type, space } = useTheme();
  const router = useRouter();
  const [searchOpen, setSearchOpen] = useState(false);
  const [showHint, setShowHint] = useState(true);
  const [layer, setLayer] = useState<GlobeLayer>("political");
  const [masteryByCca3, setMasteryByCca3] = useState<Map<string, number>>(new Map());
  const recents = useAppStore((s) => s.recents);

  const [area, setArea] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const t = setTimeout(() => setShowHint(false), 4500);
    return () => clearTimeout(t);
  }, []);

  // Refresh on focus, not just mount, so finishing a quiz and returning here
  // immediately lights up the mastery layer instead of showing stale state.
  useFocusEffect(
    useCallback(() => {
      let cancelled = false;
      progressStore
        .getAll()
        .then((records) => {
          if (cancelled) return;
          const byCountry = computeAllMastery(records);
          const scores = new Map<string, number>();
          byCountry.forEach((m, id) => scores.set(id, m.score));
          setMasteryByCca3(scores);
        })
        .catch(() => {});
      return () => {
        cancelled = true;
      };
    }, [])
  );

  const goToCountry = useCallback(
    (cca3: string) => {
      setSearchOpen(false);
      router.push(`/country/${cca3}`);
    },
    [router]
  );

  const recentCountries = recents.map((id) => COUNTRY_BY_ID.get(id)).filter((c): c is Country => Boolean(c));

  return (
    <GradientBackground>
      <SafeAreaView style={{ flex: 1 }} edges={["top", "left", "right"]}>
        <View style={{ flexDirection: "row", alignItems: "center", paddingHorizontal: space.lg, paddingTop: space.sm }}>
          <View style={{ flex: 1 }}>
            <Text accessibilityRole="header" style={[type.hero, { color: colors.textPrimary, fontSize: 30 }]}>
              Terra
            </Text>
            <Text style={[type.subtitle, { color: colors.textMuted }]}>Explore the world, one country at a time</Text>
          </View>
          <Pressable
            onPress={() => setSearchOpen(true)}
            hitSlop={12}
            accessibilityRole="button"
            accessibilityLabel="Search countries"
            style={{
              width: 44,
              height: 44,
              borderRadius: 22,
              backgroundColor: colors.surfaceRaised,
              borderWidth: 1,
              borderColor: colors.border,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Ionicons name="search" size={20} color={colors.accent} />
          </Pressable>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          accessibilityRole="radiogroup"
          style={{ flexGrow: 0, marginTop: space.sm, marginBottom: space.sm }}
          contentContainerStyle={{ gap: space.sm, paddingHorizontal: space.lg, flexGrow: 1, justifyContent: "center" }}
        >
          {LAYERS.map((l) => {
            const active = layer === l.key;
            return (
              <Pressable
                key={l.key}
                onPress={() => setLayer(l.key)}
                accessibilityRole="radio"
                accessibilityState={{ checked: active }}
                accessibilityLabel={`${l.label} map layer`}
                style={{
                  paddingVertical: 6,
                  paddingHorizontal: 12,
                  borderRadius: 999,
                  backgroundColor: active ? colors.accent : "transparent",
                  borderWidth: 1,
                  borderColor: active ? colors.accent : colors.border,
                }}
              >
                <Text style={[type.label, { color: active ? colors.background : colors.textMuted }]}>{l.label.toUpperCase()}</Text>
              </Pressable>
            );
          })}
        </ScrollView>

        <MapLegend layer={layer} />

        {/* The globe gets every pixel between the controls and the recents row, edge to edge, so zooming in fills the view. */}
        <View style={{ flex: 1 }} onLayout={(e) => setArea({ width: e.nativeEvent.layout.width, height: e.nativeEvent.layout.height })}>
          {area.height > 0 && (
            <Globe
              size={Math.min(area.width - 32, area.height - 16, 460)}
              width={area.width}
              height={area.height}
              layer={layer}
              masteryByCca3={masteryByCca3}
              onSelectCountry={goToCountry}
            />
          )}

          {showHint && (
            <Animated.View
              exiting={FadeOut.duration(400)}
              pointerEvents="none"
              style={{ position: "absolute", bottom: space.sm, left: 0, right: 0, alignItems: "center" }}
            >
              <Text style={[type.bodySmall, { color: colors.textMuted }]}>Drag to rotate · Pinch to zoom · Tap a country</Text>
            </Animated.View>
          )}
        </View>

        {recentCountries.length > 0 && (
          <View style={{ paddingHorizontal: space.lg, paddingBottom: space.md }}>
            <Text style={[type.section, { color: colors.textMuted, marginBottom: space.sm }]}>RECENTLY EXPLORED</Text>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: space.sm }}>
              {recentCountries.slice(0, 6).map((c) => (
                <Pressable
                  key={c.id}
                  onPress={() => goToCountry(c.id)}
                  accessibilityRole="button"
                  accessibilityLabel={c.name.common}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    backgroundColor: colors.surfaceRaised,
                    borderRadius: 999,
                    paddingVertical: 6,
                    paddingHorizontal: 12,
                    borderWidth: 1,
                    borderColor: colors.border,
                  }}
                >
                  <Text style={{ fontSize: 16, marginRight: 6 }}>{c.flagEmoji}</Text>
                  <Text style={[type.bodySmall, { color: colors.textPrimary }]}>{c.name.common}</Text>
                </Pressable>
              ))}
            </View>
          </View>
        )}
      </SafeAreaView>

      <CountrySearchSheet visible={searchOpen} onClose={() => setSearchOpen(false)} onSelect={goToCountry} />
    </GradientBackground>
  );
}
