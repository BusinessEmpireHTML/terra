import React, { createContext, useContext, useEffect, useMemo } from "react";
import { useColorScheme } from "react-native";
import * as SystemUI from "expo-system-ui";
import {
  useFonts,
  Fraunces_500Medium_Italic,
  Fraunces_600SemiBold,
  Fraunces_900Black,
} from "@expo-google-fonts/fraunces";
import { Manrope_400Regular, Manrope_500Medium, Manrope_700Bold } from "@expo-google-fonts/manrope";
import { JetBrainsMono_500Medium } from "@expo-google-fonts/jetbrains-mono";
import { darkColors, lightColors, type ThemeColors, type, space, radius } from "./tokens";
import { useAppStore, type ThemeMode } from "../store/useAppStore";

export type { ThemeMode };

interface ThemeContextValue {
  colors: ThemeColors;
  scheme: "light" | "dark";
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  type: typeof type;
  space: typeof space;
  radius: typeof radius;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}

export function useTerraFonts() {
  return useFonts({
    Fraunces_600SemiBold,
    Fraunces_900Black,
    Fraunces_500Medium_Italic,
    Manrope_400Regular,
    Manrope_500Medium,
    Manrope_700Bold,
    JetBrainsMono_500Medium,
  });
}

/** Theme mode comes from the app store, so the user's choice persists and is loaded before the splash screen hides. */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useColorScheme();
  const mode = useAppStore((s) => s.themeMode);
  const setMode = useAppStore((s) => s.setThemeMode);

  const scheme = mode === "system" ? (systemScheme === "light" ? "light" : "dark") : mode;
  const colors = scheme === "dark" ? darkColors : lightColors;

  // Paint the native root view to match, so screen transitions and the
  // keyboard's backdrop never flash white in dark mode (or ink in light).
  useEffect(() => {
    SystemUI.setBackgroundColorAsync(colors.background).catch(() => {});
  }, [colors.background]);

  const value = useMemo<ThemeContextValue>(
    () => ({ colors, scheme, mode, setMode, type, space, radius }),
    [colors, scheme, mode, setMode]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
