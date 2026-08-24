/**
 * Terra's design language: a brass-and-vellum instrument, not a travel app.
 * Signature: the globe reads like an engraved brass armillary sphere — deep
 * ink backgrounds, hairline gold linework, warm parchment surfaces for text.
 */

export const palette = {
  inkNavy: "#0E1B29", // primary dark background — night sky over open water, not pure black
  inkNavyDeep: "#081119",
  vellum: "#F3ECDA", // aged paper — light surfaces & text-on-dark
  vellumDim: "#D9CFB4",
  brass: "#C9A24B", // primary accent — engraving, borders, glow
  brassBright: "#E4C879",
  bronze: "#8B5E3C", // secondary accent — warmer shadow tone
  expedition: "#2F6E6A", // secondary hue — nautical-chart teal ink, keeps the palette from going monochrome gold
  ember: "#C1583F", // sparing use only — streaks, alerts, rare emphasis
  ink: "#141A1F", // near-black text on light surfaces
} as const;

export interface ThemeColors {
  background: string;
  backgroundDeep: string;
  surface: string;
  surfaceRaised: string;
  border: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  accent: string;
  accentBright: string;
  accentSecondary: string;
  ember: string;
  globeBase: string;
  globeHighlight: string;
  globeEdge: string;
  glow: string;
  /** Sequential 5-step scale for the population-density map layer — kept
   * separate from role colors above so each step stays legible both as a
   * globe fill and as a small legend swatch against the page background. */
  densityScale: [string, string, string, string, string];
  /** Third achievement tier — distinct from the brass/gold accent so gold badges still read as the top tier. */
  bronzeTier: string;
}

export const darkColors: ThemeColors = {
  background: palette.inkNavy,
  backgroundDeep: palette.inkNavyDeep,
  surface: "#152435",
  surfaceRaised: "#1B2C40",
  border: "rgba(201, 162, 75, 0.25)",
  textPrimary: palette.vellum,
  textSecondary: palette.vellumDim,
  textMuted: "rgba(217, 207, 180, 0.55)",
  accent: palette.brass,
  accentBright: palette.brassBright,
  accentSecondary: palette.expedition,
  ember: palette.ember,
  globeBase: "#12202E",
  globeHighlight: "#2A4258",
  globeEdge: "#050B11",
  glow: "rgba(201, 162, 75, 0.35)",
  densityScale: ["#3D5568", "#2F6E6A", "#C9A24B", "#E4C879", "#C1583F"],
  bronzeTier: "#B08D57",
};

export const lightColors: ThemeColors = {
  background: palette.vellum,
  backgroundDeep: "#EAE1C8",
  surface: "#FBF7EC",
  surfaceRaised: "#FFFFFF",
  border: "rgba(139, 94, 60, 0.25)",
  textPrimary: palette.ink,
  textSecondary: "#4A4137",
  textMuted: "rgba(20, 26, 31, 0.5)",
  accent: palette.bronze,
  accentBright: "#A9713F",
  accentSecondary: palette.expedition,
  ember: palette.ember,
  globeBase: "#DCD0AC",
  globeHighlight: "#F1E6C4",
  globeEdge: "#B9A876",
  glow: "rgba(139, 94, 60, 0.25)",
  densityScale: ["#B8C4CC", "#2F6E6A", "#8B5E3C", "#A9713F", "#C1583F"],
  bronzeTier: "#96703F",
};

// Type roles: Fraunces carries personality (used with restraint, headings only),
// Manrope is the clean workhorse for body/UI, JetBrains Mono reads like an
// instrument dial for coordinates, stats, and other "data" moments.
export const fontFamily = {
  display: "Fraunces_600SemiBold",
  displayItalic: "Fraunces_500Medium_Italic",
  displayBlack: "Fraunces_900Black",
  body: "Manrope_500Medium",
  bodySemiBold: "Manrope_700Bold",
  bodyRegular: "Manrope_400Regular",
  mono: "JetBrainsMono_500Medium",
} as const;

export const type = {
  hero: { fontFamily: fontFamily.display, fontSize: 40, lineHeight: 44, letterSpacing: -0.5 },
  title: { fontFamily: fontFamily.display, fontSize: 28, lineHeight: 33 },
  subtitle: { fontFamily: fontFamily.displayItalic, fontSize: 16, lineHeight: 22 },
  section: { fontFamily: fontFamily.bodySemiBold, fontSize: 13, letterSpacing: 1.6 },
  body: { fontFamily: fontFamily.body, fontSize: 15, lineHeight: 21 },
  bodySmall: { fontFamily: fontFamily.bodyRegular, fontSize: 13, lineHeight: 18 },
  label: { fontFamily: fontFamily.mono, fontSize: 11, letterSpacing: 1.2 },
  data: { fontFamily: fontFamily.mono, fontSize: 15, letterSpacing: 0.2 },
} as const;

export const space = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 48 } as const;
export const radius = { sm: 8, md: 14, lg: 22, pill: 999 } as const;
