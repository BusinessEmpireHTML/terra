import React from "react";
import { Text, View } from "react-native";
import Svg, { Rect } from "react-native-svg";
import { useTheme } from "../../theme/ThemeProvider";
import type { ContinentBreakdown } from "../../gamification/types";

export function ContinentBarChart({ data }: { data: ContinentBreakdown[] }) {
  const { colors, type, space } = useTheme();
  const barHeight = 18;
  const gap = 10;
  const width = 260;
  const height = data.length * (barHeight + gap);

  return (
    <View>
      {data.map((d, i) => {
        const barWidth = Math.max(4, (d.avgScore / 100) * width);
        return (
          <View key={d.region} style={{ flexDirection: "row", alignItems: "center", marginBottom: gap, gap: space.sm }}>
            <Text style={[type.bodySmall, { color: colors.textMuted, width: 76 }]}>{d.region}</Text>
            <Svg width={width} height={barHeight}>
              <Rect x={0} y={0} width={width} height={barHeight} rx={5} fill={colors.surfaceRaised} />
              <Rect
                x={0}
                y={0}
                width={barWidth}
                height={barHeight}
                rx={5}
                fill={d.countriesStarted === 0 ? colors.border : colors.accent}
              />
            </Svg>
            <Text style={[type.data, { color: colors.textMuted, fontSize: 11, width: 34, textAlign: "right" }]}>
              {d.countriesStarted > 0 ? `${d.avgScore}%` : "—"}
            </Text>
          </View>
        );
      })}
    </View>
  );
}
