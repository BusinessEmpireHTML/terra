import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../theme/ThemeProvider";
import type { Achievement } from "../../gamification/types";

export function AchievementCard({ achievement, unlocked }: { achievement: Achievement; unlocked: boolean }) {
  const { colors, type, space, radius } = useTheme();
  const tierColor = achievement.tier === "gold" ? colors.accent : achievement.tier === "silver" ? colors.accentSecondary : colors.bronzeTier;

  return (
    <View
      style={{
        width: "31%",
        alignItems: "center",
        backgroundColor: colors.surfaceRaised,
        borderRadius: radius.md,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: unlocked ? tierColor : colors.border,
        paddingVertical: space.sm,
        paddingHorizontal: space.xs,
        opacity: unlocked ? 1 : 0.45,
      }}
    >
      <View
        style={{
          width: 40,
          height: 40,
          borderRadius: 20,
          backgroundColor: unlocked ? tierColor + "22" : colors.background,
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 6,
        }}
      >
        <Ionicons name={(unlocked ? achievement.icon : "lock-closed") as any} size={18} color={unlocked ? tierColor : colors.textMuted} />
      </View>
      <Text style={[type.bodySmall, { color: colors.textPrimary, textAlign: "center", fontSize: 11 }]} numberOfLines={2}>
        {achievement.title}
      </Text>
    </View>
  );
}
