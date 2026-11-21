import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { COUNTRIES } from "../../data/countries";
import { useTheme } from "../../theme/ThemeProvider";
import { formatCompactNumber } from "../../utils/geo";
import type { GlobeLayer } from "./globeTypes";
import { DENSE_TEXT_MAX_SCALE } from "../../theme/tokens";
import { useT } from "../../i18n/useT";

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
function legendFor(layer: Exclude<GlobeLayer, "political">, t: ReturnType<typeof useT>): { title: string; swatches: string[]; caption: string } {
  switch (layer) {
    case "population":
      return {
        title: t("legend.populationTitle"),
        swatches: [t("legend.pop1"), t("legend.pop2"), t("legend.pop3"), t("legend.pop4"), t("legend.pop5")],
        caption: t("legend.populationCaption", {
          count: formatCompactNumber(Math.min(byId.get("IND")?.population ?? 0, byId.get("CHN")?.population ?? 0), t.lang),
        }),
      };
    case "density":
      return {
        title: t("legend.densityTitle"),
        swatches: [t("legend.dens1"), t("legend.dens2"), t("legend.dens3"), t("legend.dens4"), t("legend.dens5")],
        caption: t("legend.densityCaption", { india: density("IND"), china: density("CHN") }),
      };
    case "mastery":
      return {
        title: t("legend.masteryTitle"),
        swatches: [t("legend.masteryLow"), "", "", "", t("legend.masteryHigh")],
        caption: t("legend.masteryCaption"),
      };
  }
}

export function MapLegend({ layer }: { layer: GlobeLayer }) {
  const { colors, type, space } = useTheme();
  const t = useT();
  if (layer === "political") return null;
  const legend = legendFor(layer, t);
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
              <Text maxFontSizeMultiplier={DENSE_TEXT_MAX_SCALE} style={[type.label, { color: colors.textMuted, fontSize: 10, letterSpacing: 0.4 }]}>{label}</Text>
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
