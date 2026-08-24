import React from "react";
import { Link, Stack } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { GradientBackground } from "../src/components/ui/Primitives";
import { useTheme } from "../src/theme/ThemeProvider";

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "Off the map" }} />
      <GradientBackground>
        <NotFoundContent />
      </GradientBackground>
    </>
  );
}

function NotFoundContent() {
  const { colors, type, space } = useTheme();
  return (
    <View style={[styles.container, { paddingHorizontal: space.lg }]}>
      <Text style={[type.title, { color: colors.textPrimary, textAlign: "center" }]}>
        This corner of the map is uncharted.
      </Text>
      <Link href="/" style={styles.link}>
        <Text style={[type.body, { color: colors.accent }]}>Back to the globe</Text>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center" },
  link: { marginTop: 16, paddingVertical: 12 },
});
