/**
 * Globe styles, unlocked by collecting passport stamps (completed
 * expeditions). "Classic" follows the app's light/dark theme; the others
 * recolor the ocean, land and borders.
 */
export type GlobeThemeId = "classic" | "parchment" | "atlas" | "nightLights" | "aurora";

export interface GlobeTheme {
  id: GlobeThemeId;
  /** Passport stamps needed to unlock it. */
  unlockAt: number;
  /** Ocean radial gradient: lit side, middle, rim. */
  ocean?: [string, string, string];
  /** Land fill (countries without a data/highlight fill). */
  land?: string;
  landAlpha?: number;
  /** Borders, rim and graticule. */
  outline?: string;
  /** Two colors for the picker swatch. */
  swatch: [string, string];
}

export const GLOBE_THEMES: readonly GlobeTheme[] = [
  { id: "classic", unlockAt: 0, swatch: ["#0E1B29", "#C9A24B"] },
  {
    id: "parchment",
    unlockAt: 1,
    ocean: ["#E6D3A3", "#CDB27A", "#8F7140"],
    land: "#F4E9CC",
    landAlpha: 0.9,
    outline: "#5B3A17",
    swatch: ["#CDB27A", "#5B3A17"],
  },
  {
    id: "atlas",
    unlockAt: 3,
    ocean: ["#CFEAF8", "#9CCDEB", "#5B98C6"],
    land: "#F2ECD3",
    landAlpha: 0.95,
    outline: "#2E5A7E",
    swatch: ["#9CCDEB", "#F2ECD3"],
  },
  {
    id: "nightLights",
    unlockAt: 5,
    ocean: ["#0F1E3C", "#07102A", "#030713"],
    land: "#18264A",
    landAlpha: 0.9,
    outline: "#FFCF6E",
    swatch: ["#07102A", "#FFCF6E"],
  },
  {
    id: "aurora",
    unlockAt: 10,
    ocean: ["#0F2C40", "#081A28", "#030B12"],
    land: "#0F2E30",
    landAlpha: 0.85,
    outline: "#5EF0B0",
    swatch: ["#081A28", "#5EF0B0"],
  },
];

export const GLOBE_THEME_BY_ID = new Map(GLOBE_THEMES.map((t) => [t.id, t]));

export function isGlobeThemeId(value: unknown): value is GlobeThemeId {
  return GLOBE_THEMES.some((t) => t.id === value);
}

export function isGlobeThemeUnlocked(id: GlobeThemeId, stampCount: number): boolean {
  return stampCount >= (GLOBE_THEME_BY_ID.get(id)?.unlockAt ?? Infinity);
}
