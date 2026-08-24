import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { GradientBackground } from "../components/ui/Primitives";
import { useTheme } from "../theme/ThemeProvider";

interface Props {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  phase: string;
  note: string;
}

export function PlaceholderScreen({ icon, title, phase, note }: Props) {
  const { colors, type, space, radius } = useTheme();
  return (
    <GradientBackground>
      <SafeAreaView style={{ flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: space.xl }}>
        <View
          style={{
            width: 72,
            height: 72,
            borderRadius: radius.lg,
            backgroundColor: colors.surfaceRaised,
            borderWidth: StyleSheet.hairlineWidth,
            borderColor: colors.border,
            alignItems: "center",
            justifyContent: "center",
            marginBottom: space.lg,
          }}
        >
          <Ionicons name={icon} size={30} color={colors.accent} />
        </View>
        <Text style={[type.title, { color: colors.textPrimary, textAlign: "center" }]}>{title}</Text>
        <Text style={[type.label, { color: colors.accent, marginTop: 8, letterSpacing: 1.6 }]}>{phase.toUpperCase()}</Text>
        <Text style={[type.body, { color: colors.textMuted, textAlign: "center", marginTop: space.sm }]}>{note}</Text>
      </SafeAreaView>
    </GradientBackground>
  );
}
