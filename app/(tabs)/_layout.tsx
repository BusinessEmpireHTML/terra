import React from "react";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../src/theme/ThemeProvider";

export default function TabLayout() {
  const { colors } = useTheme();

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
        options={{ title: "Globe", tabBarIcon: ({ color, size }) => <Ionicons name="globe-outline" size={size} color={color} /> }}
      />
      <Tabs.Screen
        name="learn"
        options={{ title: "Learn", tabBarIcon: ({ color, size }) => <Ionicons name="school-outline" size={size} color={color} /> }}
      />
      <Tabs.Screen
        name="profile"
        options={{ title: "Profile", tabBarIcon: ({ color, size }) => <Ionicons name="person-circle-outline" size={size} color={color} /> }}
      />
    </Tabs>
  );
}
