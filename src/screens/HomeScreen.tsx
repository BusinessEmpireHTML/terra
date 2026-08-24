import React, { useCallback, useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View, useWindowDimensions } from "react-native";
import { useFocusEffect, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeOut } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { Globe, type GlobeLayer } from "../components/globe/Globe";
import { CountrySearchSheet } from "../components/search/CountrySearchSheet";
import { GradientBackground } from "../components/ui/Primitives";
import { useTheme } from "../theme/ThemeProvider";
import { useAppStore } from "../store/useAppStore";
import { COUNTRIES } from "../data/countries";
import { progressStore } from "../services/progressStore";
import { computeAllMastery } from "../quiz/mastery";

const LAYERS: { key: GlobeLayer; label: string }[] = [
  { key: "political", label: "Political" },
  { key: "density", label: "Population" },
  { key: "mastery", label: "Mastery" },
];

const DENSITY_LEGEND = ["<10/km²", "<50", "<150", "<400", "400+"];
const MASTERY_LEGEND = ["Started", "", "", "", "Mastered"];

export default function HomeScreen() {
  const { colors, type, space } = useTheme();
  const router = useRouter();
  const [searchOpen, setSearchOpen] = useState(false);
  const [showHint, setShowHint] = useState(true);
  const [layer, setLayer] = useState<GlobeLayer>("political");
  const [masteryByCca3, setMasteryByCca3] = useState<Map<string, number>>(new Map());
  const recents = useAppStore((s) => s.recents);

  const { width, height } = useWindowDimensions();
  // Bounded by both axes so short/small screens (or landscape) can't push
  // the fixed-size globe into the header or the recents row below it.
  const globeSize = Math.min(width - 32, height * 0.42, 420);

  useEffect(() => {
    const t = setTimeout(() => setShowHint(false), 4500);
    return () => clearTimeout(t);
  }, []);

  // Refresh on focus, not just mount, so finishing a quiz and returning here
  // immediately lights up the mastery layer instead of showing stale state.
  useFocusEffect(
    useCallback(() => {
      let cancelled = false;
      progressStore.getAll().then((records) => {
        if (cancelled) return;
        const byCountry = computeAllMastery(records);
        const scores = new Map<string, number>();
        byCountry.forEach((m, id) => scores.set(id, m.score));
        setMasteryByCca3(scores);
      });
      return () => {
        cancelled = true;
      };
    }, [])
  );

  const goToCountry = (cca3: string) => {
    setSearchOpen(false);
    router.push(`/country/${cca3}`);
  };

  const recentCountries = recents.map((id) => COUNTRIES.find((c) => c.id === id)).filter(Boolean);

  return (
    <GradientBackground>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ flexDirection: "row", alignItems: "center", paddingHorizontal: space.lg, paddingTop: space.sm }}>
          <View style={{ flex: 1 }}>
            <Text style={[type.hero, { color: colors.textPrimary, fontSize: 30 }]}>Terra</Text>
            <Text style={[type.subtitle, { color: colors.textMuted }]}>Explore the world, one country at a time</Text>
          </View>
          <Pressable
            onPress={() => setSearchOpen(true)}
            hitSlop={12}
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

        <View style={{ flexDirection: "row", justifyContent: "center", gap: space.sm, marginBottom: space.sm }}>
          {LAYERS.map((l) => {
            const active = layer === l.key;
            return (
              <Pressable
                key={l.key}
                onPress={() => setLayer(l.key)}
                style={{
                  paddingVertical: 6,
                  paddingHorizontal: 14,
                  borderRadius: 999,
                  backgroundColor: active ? colors.accent : "transparent",
                  borderWidth: 1,
                  borderColor: active ? colors.accent : colors.border,
                }}
              >
                <Text style={[type.label, { color: active ? colors.background : colors.textMuted }]}>
                  {l.label.toUpperCase()}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {layer === "density" && (
          <View style={{ flexDirection: "row", justifyContent: "center", gap: space.md, marginBottom: space.xs }}>
            {DENSITY_LEGEND.map((label, i) => (
              <View key={label} style={{ flexDirection: "row", alignItems: "center" }}>
                <View
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: 3.5,
                    backgroundColor: colors.densityScale[i],
                    marginRight: 4,
                    borderWidth: i === 0 ? StyleSheet.hairlineWidth : 0,
                    borderColor: colors.border,
                  }}
                />
                <Text style={[type.label, { color: colors.textMuted, fontSize: 10 }]}>{label}</Text>
              </View>
            ))}
          </View>
        )}

        {layer === "mastery" && (
          <View style={{ flexDirection: "row", justifyContent: "center", gap: space.md, marginBottom: space.xs }}>
            {MASTERY_LEGEND.map((label, i) =>
              label ? (
                <View key={i} style={{ flexDirection: "row", alignItems: "center" }}>
                  <View
                    style={{
                      width: 7,
                      height: 7,
                      borderRadius: 3.5,
                      backgroundColor: colors.densityScale[i],
                      marginRight: 4,
                    }}
                  />
                  <Text style={[type.label, { color: colors.textMuted, fontSize: 10 }]}>{label}</Text>
                </View>
              ) : null
            )}
          </View>
        )}

        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
          <Globe size={globeSize} layer={layer} masteryByCca3={masteryByCca3} onSelectCountry={goToCountry} />

          {showHint && (
            <Animated.View exiting={FadeOut.duration(400)} style={{ position: "absolute", bottom: -8, alignItems: "center" }}>
              <Text style={[type.bodySmall, { color: colors.textMuted }]}>
                Drag to rotate · Pinch to zoom · Tap a country
              </Text>
            </Animated.View>
          )}
        </View>

        {recentCountries.length > 0 && (
          <View style={{ paddingHorizontal: space.lg, paddingBottom: space.md }}>
            <Text style={[type.section, { color: colors.textMuted, marginBottom: space.sm }]}>RECENTLY EXPLORED</Text>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: space.sm }}>
              {recentCountries.slice(0, 6).map((c) => (
                <Pressable
                  key={c!.id}
                  onPress={() => goToCountry(c!.id)}
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
                  <Text style={{ fontSize: 16, marginRight: 6 }}>{c!.flagEmoji}</Text>
                  <Text style={[type.bodySmall, { color: colors.textPrimary }]}>{c!.name.common}</Text>
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
