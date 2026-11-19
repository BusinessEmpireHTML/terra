import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../theme/ThemeProvider";
import type { Achievement } from "../../gamification/types";

interface Props {
  achievement: Achievement;
  unlocked: boolean;
  selected?: boolean;
  width: number;
  onPress?: () => void;
}

export function AchievementCard({ achievement, unlocked, selected, width, onPress }: Props) {
  const { colors, type, space, radius } = useTheme();
  const tierColor = achievement.tier === "gold" ? colors.accent : achievement.tier === "silver" ? colors.accentSecondary : colors.bronzeTier;

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${achievement.title}, ${achievement.tier}, ${unlocked ? "unlocked" : "locked"}. ${achievement.description}`}
      accessibilityState={{ selected }}
      style={{
        width,
        alignItems: "center",
        backgroundColor: colors.surfaceRaised,
        borderRadius: radius.md,
        borderWidth: selected ? 1.5 : StyleSheet.hairlineWidth,
        borderColor: selected ? colors.accentBright : unlocked ? tierColor : colors.border,
        paddingVertical: space.sm,
        paddingHorizontal: space.xs,
        opacity: unlocked || selected ? 1 : 0.5,
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
        <Ionicons
          name={(unlocked ? achievement.icon : "lock-closed") as React.ComponentProps<typeof Ionicons>["name"]}
          size={18}
          color={unlocked ? tierColor : colors.textMuted}
        />
      </View>
      <Text style={[type.bodySmall, { color: colors.textPrimary, textAlign: "center", fontSize: 11, lineHeight: 14 }]} numberOfLines={2}>
        {achievement.title}
      </Text>
    </Pressable>
  );
}
