import React from "react";
import { Text, View } from "react-native";
import { useTheme } from "../../theme/ThemeProvider";
import type { ContinentBreakdown } from "../../gamification/types";

/**
 * Horizontal bars of average mastery per continent. Plain flex views rather
 * than a fixed-width SVG, so it fits any screen (the old 260px bar plus
 * labels overflowed phones narrower than ~400pt).
 */
export function ContinentBarChart({ data }: { data: ContinentBreakdown[] }) {
  const { colors, type, space } = useTheme();
  const barHeight = 14;

  return (
    <View style={{ gap: 10 }}>
      {data.map((d) => {
        const started = d.countriesStarted > 0;
        return (
          <View
            key={d.region}
            accessible
            accessibilityLabel={
              started
                ? `${d.region}: ${d.avgScore}% average mastery across ${d.countriesStarted} of ${d.countriesTotal} countries`
                : `${d.region}: not started`
            }
            style={{ flexDirection: "row", alignItems: "center", gap: space.sm }}
          >
            <Text style={[type.bodySmall, { color: colors.textMuted, width: 72 }]} numberOfLines={1}>
              {d.region}
            </Text>
            <View style={{ flex: 1 }}>
              <View style={{ height: barHeight, borderRadius: barHeight / 2, backgroundColor: colors.background, overflow: "hidden" }}>
                <View
                  style={{
                    height: "100%",
                    width: started ? `${Math.max(3, d.avgScore)}%` : 0,
                    borderRadius: barHeight / 2,
                    backgroundColor: colors.accent,
                  }}
                />
              </View>
              <Text style={[type.label, { color: colors.textMuted, fontSize: 9, marginTop: 3, letterSpacing: 0.6 }]}>
                {d.countriesStarted}/{d.countriesTotal} STARTED
              </Text>
            </View>
            <Text style={[type.data, { color: colors.textMuted, fontSize: 12, width: 38, textAlign: "right" }]}>
              {started ? `${d.avgScore}%` : "—"}
            </Text>
          </View>
        );
      })}
    </View>
  );
}
