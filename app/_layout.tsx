import React, { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import * as SplashScreen from "expo-splash-screen";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ThemeProvider, useTerraFonts, useTheme } from "../src/theme/ThemeProvider";
import { useAppStore } from "../src/store/useAppStore";
import { useReminders } from "../src/services/reminders";

export { ErrorBoundary } from "expo-router";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, fontError] = useTerraFonts();
  const hydrated = useAppStore((s) => s.hydrated);
  const hydrateFromDisk = useAppStore((s) => s.hydrateFromDisk);

  useEffect(() => {
    hydrateFromDisk();
  }, [hydrateFromDisk]);

  const ready = (fontsLoaded || fontError) && hydrated;

  useEffect(() => {
    if (ready) SplashScreen.hideAsync().catch(() => {});
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
  const { scheme, colors } = useTheme();
  useReminders();
  return (
    <>
      <StatusBar style={scheme === "dark" ? "light" : "dark"} />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.background } }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="country/[code]" options={{ presentation: "card" }} />
        {/* Quizzes slide up like a sheet: they're a focused task you finish or close, not a place you navigate through. */}
        {/* No swipe-back on games: a drag that starts near the screen edge should turn the globe, not close the session. */}
        <Stack.Screen name="quiz/[category]" options={{ animation: "slide_from_bottom", gestureEnabled: false }} />
        <Stack.Screen name="find-endless" options={{ animation: "slide_from_bottom", gestureEnabled: false }} />
        <Stack.Screen name="challenge/new" options={{ animation: "slide_from_bottom", gestureEnabled: false }} />
        <Stack.Screen name="challenge/[code]" options={{ animation: "slide_from_bottom", gestureEnabled: false }} />
        <Stack.Screen name="challenge/enter" options={{ animation: "slide_from_bottom" }} />
        <Stack.Screen name="speed-round" options={{ animation: "slide_from_bottom", gestureEnabled: false }} />
      </Stack>
    </>
  );
}
