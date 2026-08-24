import React, { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import * as SplashScreen from "expo-splash-screen";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ThemeProvider, useTerraFonts, useTheme } from "../src/theme/ThemeProvider";
import { useAppStore } from "../src/store/useAppStore";

export { ErrorBoundary } from "expo-router";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, fontError] = useTerraFonts();
  const hydrated = useAppStore((s) => s.hydrated);
  const hydrateFromDisk = useAppStore((s) => s.hydrateFromDisk);

  useEffect(() => {
    hydrateFromDisk();
  }, []);

  const ready = (fontsLoaded || fontError) && hydrated;

  useEffect(() => {
    if (ready) SplashScreen.hideAsync();
  }, [ready]);

  if (!ready) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <Nav />
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}

function Nav() {
  const { scheme } = useTheme();
  return (
    <>
      <StatusBar style={scheme === "dark" ? "light" : "dark"} />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="country/[code]" options={{ presentation: "card" }} />
      </Stack>
    </>
  );
}
