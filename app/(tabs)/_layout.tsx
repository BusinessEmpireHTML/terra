import React from "react";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../src/theme/ThemeProvider";
import { useT } from "../../src/i18n/useT";

export default function TabLayout() {
  const { colors } = useTheme();
  const t = useT();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          borderTopWidth: 1,
        },
        tabBarLabelStyle: { fontSize: 11, fontFamily: "Manrope_500Medium" },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{ title: t("tabs.globe"), tabBarIcon: ({ color, size }) => <Ionicons name="globe-outline" size={size} color={String(color)} /> }}
      />
      <Tabs.Screen
        name="learn"
        options={{ title: t("tabs.learn"), tabBarIcon: ({ color, size }) => <Ionicons name="school-outline" size={size} color={String(color)} /> }}
      />
      <Tabs.Screen
        name="profile"
        options={{ title: t("tabs.profile"), tabBarIcon: ({ color, size }) => <Ionicons name="person-circle-outline" size={size} color={String(color)} /> }}
      />
    </Tabs>
  );
}
