import React from "react";
import { View } from "react-native";
import { useTheme } from "../../theme/ThemeProvider";
import type { DayCount } from "../../gamification/types";

const CELL = 11;
const GAP = 3;

function intensity(count: number): number {
  if (count === 0) return 0;
  if (count <= 3) return 1;
  if (count <= 8) return 2;
  if (count <= 15) return 3;
  return 4;
}

export function ActivityHeatmap({ data }: { data: DayCount[] }) {
  const { colors } = useTheme();

  // Group into weeks (columns), Sunday-first, so it reads like a real calendar.
  const weeks: DayCount[][] = [];
  let current: DayCount[] = [];
  data.forEach((day, i) => {
    const dow = new Date(`${day.date}T00:00:00`).getDay();
    if (i === 0) {
      for (let pad = 0; pad < dow; pad++) current.push({ date: "", count: -1, correct: 0 });
    }
    current.push(day);
    if (dow === 6) {
      weeks.push(current);
      current = [];
    }
  });
  if (current.length) weeks.push(current);

  const shade = (level: number) => {
    if (level === 0) return colors.surfaceRaised;
    const scale = [colors.densityScale[0], colors.densityScale[1], colors.densityScale[2], colors.densityScale[4]];
    return scale[level - 1];
  };

  return (
    <View style={{ flexDirection: "row", gap: GAP }}>
      {weeks.map((week, wi) => (
        <View key={wi} style={{ gap: GAP }}>
          {week.map((day, di) =>
            day.count === -1 ? (
              <View key={di} style={{ width: CELL, height: CELL }} />
            ) : (
              <View
                key={di}
                style={{
                  width: CELL,
                  height: CELL,
                  borderRadius: 3,
                  backgroundColor: shade(intensity(day.count)),
                  borderWidth: day.count === 0 ? 1 : 0,
                  borderColor: colors.border,
                }}
              />
            )
          )}
        </View>
      ))}
    </View>
  );
}
