import React from "react";
import { Link, Stack } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { GradientBackground } from "../src/components/ui/Primitives";
import { useTheme } from "../src/theme/ThemeProvider";
import { useT } from "../src/i18n/useT";

export default function NotFoundScreen() {
  const t = useT();
  return (
    <>
      <Stack.Screen options={{ title: t("notFound.title") }} />
      <GradientBackground>
        <NotFoundContent />
      </GradientBackground>
    </>
  );
}

function NotFoundContent() {
  const { colors, type, space } = useTheme();
  const t = useT();
  return (
    <View style={[styles.container, { paddingHorizontal: space.lg }]}>
      <Text style={[type.title, { color: colors.textPrimary, textAlign: "center" }]}>
        {t("notFound.body")}
      </Text>
      <Link href="/" style={styles.link}>
        <Text style={[type.body, { color: colors.accent }]}>{t("notFound.back")}</Text>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center" },
  link: { marginTop: 16, paddingVertical: 12 },
});
