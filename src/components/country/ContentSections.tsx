import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useTheme } from "../../theme/ThemeProvider";
import type { Dish, HistoryEvent, Landmark } from "../../types/country";

export function ParagraphBlock({ text }: { text: string }) {
  const { colors, type } = useTheme();
  return <Text style={[type.body, { color: colors.textSecondary, lineHeight: 23 }]}>{text}</Text>;
}

const RELIGION_BAR_COLORS = ["accent", "accentSecondary", "accentBright", "ember"] as const;

export function ReligionBreakdown({ religions }: { religions: { name: string; percent: number }[] }) {
  const { colors, type, space, radius } = useTheme();
  const barColors = RELIGION_BAR_COLORS.map((k) => colors[k]);

  const shownTotal = religions.reduce((sum, r) => sum + r.percent, 0);
  const remainder = 100 - shownTotal;
  // Keep the bar an honest 0–100% scale — if the listed groups don't cover
  // the whole population, show what's left as its own neutral segment
  // rather than letting the shown slices silently fill the full width.
  const segments = remainder > 1.5 ? [...religions, { name: "Other / unspecified", percent: remainder }] : religions;

  return (
    <View>
      <View
        style={{
          flexDirection: "row",
          height: 10,
          borderRadius: radius.sm,
          overflow: "hidden",
          backgroundColor: colors.surfaceRaised,
          marginBottom: space.sm,
        }}
      >
        {segments.map((r, i) => (
          <View
            key={r.name}
            style={{ flex: r.percent, backgroundColor: i < religions.length ? barColors[i % barColors.length] : colors.border }}
          />
        ))}
      </View>
      <View style={{ gap: 6 }}>
        {segments.map((r, i) => (
          <View key={r.name} style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
            <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
              <View
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: i < religions.length ? barColors[i % barColors.length] : colors.border,
                  marginRight: space.sm,
                }}
              />
              <Text style={[type.body, { color: i < religions.length ? colors.textPrimary : colors.textMuted }]} numberOfLines={1}>
                {r.name}
              </Text>
            </View>
            <Text style={[type.data, { color: colors.textMuted, fontSize: 13 }]}>{Math.round(r.percent)}%</Text>
          </View>
        ))}
      </View>
      <Text style={[type.bodySmall, { color: colors.textMuted, marginTop: space.sm, fontStyle: "italic" }]}>
        Pew Research Center estimate, 2020. Self-reported religious affiliation is approximate by nature.
      </Text>
    </View>
  );
}

export function HistoryTimeline({ events }: { events: HistoryEvent[] }) {
  const { colors, type, space } = useTheme();
  return (
    <View>
      {events.map((e, i) => (
        <View key={`${e.year}-${i}`} style={{ flexDirection: "row" }}>
          <View style={{ width: 84, alignItems: "flex-end", paddingRight: space.sm }}>
            <Text style={[type.data, { color: colors.accent, fontSize: 13 }]} numberOfLines={1}>
              {e.year}
            </Text>
          </View>
          <View style={{ alignItems: "center", width: 16 }}>
            <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: colors.accent, marginTop: 4 }} />
            {i < events.length - 1 && <View style={{ width: StyleSheet.hairlineWidth * 2, flex: 1, backgroundColor: colors.border, marginTop: 2 }} />}
          </View>
          <View style={{ flex: 1, paddingLeft: space.sm, paddingBottom: space.md }}>
            <Text style={[type.body, { color: colors.textPrimary }]}>{e.label}</Text>
          </View>
        </View>
      ))}
    </View>
  );
}

export function DishGrid({ dishes }: { dishes: Dish[] }) {
  const { colors, type, space, radius } = useTheme();
  return (
    <View style={{ flexDirection: "row", flexWrap: "wrap", gap: space.sm }}>
      {dishes.map((d) => (
        <View
          key={d.name}
          style={{
            flexBasis: "100%",
            backgroundColor: colors.surfaceRaised,
            borderRadius: radius.md,
            borderWidth: StyleSheet.hairlineWidth,
            borderColor: colors.border,
            padding: space.md,
          }}
        >
          <Text style={[type.body, { color: colors.textPrimary, fontFamily: "Manrope_700Bold" }]}>{d.name}</Text>
          <Text style={[type.bodySmall, { color: colors.textMuted, marginTop: 2 }]}>{d.note}</Text>
        </View>
      ))}
    </View>
  );
}

export function LandmarkList({ landmarks }: { landmarks: Landmark[] }) {
  const { colors, type, space, radius } = useTheme();
  return (
    <View style={{ gap: space.sm }}>
      {landmarks.map((l) => (
        <View
          key={l.name}
          style={{
            flexDirection: "row",
            backgroundColor: colors.surfaceRaised,
            borderRadius: radius.md,
            borderWidth: StyleSheet.hairlineWidth,
            borderColor: colors.border,
            padding: space.md,
          }}
        >
          <View style={{ width: 4, borderRadius: 2, backgroundColor: colors.accentSecondary, marginRight: space.sm }} />
          <View style={{ flex: 1 }}>
            <Text style={[type.body, { color: colors.textPrimary, fontFamily: "Manrope_700Bold" }]}>{l.name}</Text>
            <Text style={[type.bodySmall, { color: colors.textMuted, marginTop: 2 }]}>{l.note}</Text>
          </View>
        </View>
      ))}
    </View>
  );
}
