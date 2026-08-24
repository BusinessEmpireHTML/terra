import React, { createContext, useContext, useMemo, useState } from "react";
import { useColorScheme } from "react-native";
import {
  useFonts,
  Fraunces_500Medium_Italic,
  Fraunces_600SemiBold,
  Fraunces_900Black,
} from "@expo-google-fonts/fraunces";
import { Manrope_400Regular, Manrope_500Medium, Manrope_700Bold } from "@expo-google-fonts/manrope";
import { JetBrainsMono_500Medium } from "@expo-google-fonts/jetbrains-mono";
import { darkColors, lightColors, type ThemeColors, type, space, radius } from "./tokens";

export type ThemeMode = "light" | "dark" | "system";

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

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useColorScheme();
  const [mode, setMode] = useState<ThemeMode>("system");

  const scheme = mode === "system" ? (systemScheme ?? "dark") : mode;
  const colors = scheme === "dark" ? darkColors : lightColors;

  const value = useMemo<ThemeContextValue>(
    () => ({ colors, scheme, mode, setMode, type, space, radius }),
    [colors, scheme, mode]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
