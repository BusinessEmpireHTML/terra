import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { COUNTRIES } from "../../data/countries";
import { useTheme } from "../../theme/ThemeProvider";
import { formatCompactNumber } from "../../utils/geo";
import type { GlobeLayer } from "./globeTypes";

const byId = new Map(COUNTRIES.map((c) => [c.id, c]));
const density = (id: string) => {
  const c = byId.get(id);
  return c?.population && c.areaKm2 ? Math.round(c.population / c.areaKm2) : 0;
};

/**
 * What the colors on each map layer mean, in plain words. Population and
 * density are easy to confuse (China and India have similar populations but
 * very different densities), so each layer says exactly what it measures.
 */
const LEGENDS: Record<Exclude<GlobeLayer, "political">, { title: string; swatches: string[]; caption: string }> = {
  population: {
    title: "How many people live there",
    swatches: ["Under 1M", "1–10M", "10–50M", "50–200M", "200M+"],
    caption: `India and China each have over ${formatCompactNumber(Math.min(byId.get("IND")?.population ?? 0, byId.get("CHN")?.population ?? 0))} people, so they share the top color.`,
  },
  density: {
    title: "How crowded it is — people per km²",
    swatches: ["Under 10", "10–50", "50–150", "150–400", "400+"],
    caption: `A km² is a square 1 km on each side (about 140 soccer fields). India fits about ${density("IND")} people in each one; China, with three times the land, about ${density("CHN")}.`,
  },
  mastery: {
    title: "How well you know each country",
    swatches: ["Just started", "", "", "", "Mastered"],
    caption: "Countries light up as you practice them.",
  },
};

export function MapLegend({ layer }: { layer: GlobeLayer }) {
  const { colors, type, space } = useTheme();
  if (layer === "political") return null;
  const legend = LEGENDS[layer];
  return (
    <View
      accessible
      accessibilityLabel={`${legend.title}. ${legend.swatches.filter(Boolean).join(", ")}. ${legend.caption}`}
      style={{ paddingHorizontal: space.lg, marginBottom: space.xs }}
    >
      <Text style={[type.bodySmall, { color: colors.textSecondary, textAlign: "center" }]}>{legend.title}</Text>
      <View style={{ flexDirection: "row", justifyContent: "center", flexWrap: "wrap", columnGap: space.md, rowGap: 2, marginTop: 4 }}>
        {legend.swatches.map((label, i) =>
          label ? (
            <View key={i} style={{ flexDirection: "row", alignItems: "center" }}>
              <View
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: colors.densityScale[i],
                  marginRight: 4,
                  borderWidth: i === 0 ? StyleSheet.hairlineWidth : 0,
                  borderColor: colors.border,
                }}
              />
              <Text style={[type.label, { color: colors.textMuted, fontSize: 10, letterSpacing: 0.4 }]}>{label}</Text>
            </View>
          ) : null
        )}
      </View>
      <Text style={[type.bodySmall, { color: colors.textMuted, textAlign: "center", fontSize: 12, lineHeight: 16, marginTop: 4 }]}>
        {legend.caption}
      </Text>
    </View>
  );
}
