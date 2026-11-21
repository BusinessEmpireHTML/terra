import React from "react";
import { Text, View } from "react-native";
import { useTheme } from "../../theme/ThemeProvider";
import { useT } from "../../i18n/useT";
import type { DayCount } from "../../gamification/types";
import { DENSE_TEXT_MAX_SCALE } from "../../theme/tokens";

const CELL = 11;
const GAP = 3;
// Sunday-first rows; only Mon/Wed/Fri are labelled, like a wall calendar.
const DAY_LABEL_KEYS = [null, "heatmap.mon", null, "heatmap.wed", null, "heatmap.fri", null] as const;

/** Questions answered in a day -> 0–4 shading level. */
export function intensity(count: number): number {
  if (count <= 0) return 0;
  if (count <= 3) return 1;
  if (count <= 8) return 2;
  if (count <= 15) return 3;
  return 4;
}

export function ActivityHeatmap({ data }: { data: DayCount[] }) {
  const { colors, type } = useTheme();
  const t = useT();

  // Group into weeks (columns), Sunday-first, so it reads like a real calendar.
  const weeks: (DayCount | null)[][] = [];
  let current: (DayCount | null)[] = [];
  data.forEach((day, i) => {
    const dow = new Date(`${day.date}T00:00:00`).getDay();
    if (i === 0) {
      for (let pad = 0; pad < dow; pad++) current.push(null);
    }
    current.push(day);
    if (dow === 6) {
      weeks.push(current);
      current = [];
    }
  });
  if (current.length) weeks.push(current);

  const scale = [colors.surfaceRaised, colors.densityScale[0], colors.densityScale[1], colors.densityScale[2], colors.densityScale[4]];
  const activeDays = data.filter((d) => d.count > 0).length;
  const total = data.reduce((s, d) => s + d.count, 0);

  return (
    <View
      accessible
      accessibilityLabel={t("heatmap.a11y", { weeks: Math.round(data.length / 7), total, days: activeDays })}
    >
      <View style={{ flexDirection: "row", gap: GAP }}>
        <View style={{ gap: GAP, marginRight: 2 }}>
          {DAY_LABEL_KEYS.map((key, i) => (
            <Text key={i} style={[type.label, { color: colors.textMuted, fontSize: 8, height: CELL, lineHeight: CELL, letterSpacing: 0 }]}>
              {key ? t(key) : ""}
            </Text>
          ))}
        </View>
        {weeks.map((week, wi) => (
          <View key={wi} style={{ gap: GAP }}>
            {week.map((day, di) =>
              day == null ? (
                <View key={di} style={{ width: CELL, height: CELL }} />
              ) : (
                <View
                  key={di}
                  style={{
                    width: CELL,
                    height: CELL,
                    borderRadius: 3,
                    backgroundColor: scale[intensity(day.count)],
                    borderWidth: day.count === 0 ? 1 : 0,
                    borderColor: colors.border,
                  }}
                />
              )
            )}
          </View>
        ))}
      </View>

      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "flex-end", gap: GAP, marginTop: 8 }}>
        <Text maxFontSizeMultiplier={DENSE_TEXT_MAX_SCALE} style={[type.label, { color: colors.textMuted, fontSize: 8, marginRight: 2 }]}>{t("heatmap.less").toUpperCase()}</Text>
        {scale.map((c, i) => (
          <View key={i} style={{ width: CELL, height: CELL, borderRadius: 3, backgroundColor: c, borderWidth: i === 0 ? 1 : 0, borderColor: colors.border }} />
        ))}
        <Text maxFontSizeMultiplier={DENSE_TEXT_MAX_SCALE} style={[type.label, { color: colors.textMuted, fontSize: 8, marginLeft: 2 }]}>{t("heatmap.more").toUpperCase()}</Text>
      </View>
    </View>
  );
}
