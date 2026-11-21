import type { GlobeHit } from "./globeData";

export type { GlobeHit };

export type GlobeLayer = "political" | "population" | "density" | "mastery";

/** Total-population buckets for the population layer (and its legend on the home screen). */
export const POPULATION_BREAKS = [1_000_000, 10_000_000, 50_000_000, 200_000_000] as const;

/** People per km² buckets used by the density layer (and its legend on the home screen). */
export const DENSITY_BREAKS = [10, 50, 150, 400] as const;

/** Country fills used by game modes to mark answers. */
export type GlobeHighlight = "correct" | "wrong";

/** A wrong guess in Find it: a dot where the player tapped, optionally with an arrow aimed at `toward` (a point a little way along the route to the answer). */
export interface GlobeGuess {
  at: [number, number];
  toward?: [number, number] | null;
}

export interface GlobeProps {
  /** Diameter of the globe at normal zoom. */
  size: number;
  /** Visible area; defaults to a size×size square. Make it wider/taller than the globe so zooming in fills it instead of hitting a box. */
  width?: number;
  height?: number;
  layer?: GlobeLayer;
  /** Draws a halo around this country's marker. */
  focusedCountryId?: string | null;
  /** countryId -> mastery score 0–100, only needed when layer === 'mastery'. Computed by the caller so the globe stays decoupled from storage. */
  masteryByCca3?: Map<string, number>;
  /** Fill specific countries (overrides the layer's fill for them). */
  highlights?: Record<string, GlobeHighlight>;
  /** Wrong guesses to mark; the last one with `toward` gets a direction arrow. */
  guesses?: GlobeGuess[];
  /** Animate the globe to center this country whenever it changes. */
  flyToCountryId?: string | null;
  /**
   * Explore mode: a tapped country flies to the center, then this is called.
   * Ignored when `onTap` is set.
   */
  onSelectCountry?: (cca3: string) => void;
  /** Game mode: report every tap as-is (country or open ocean), without moving the globe. */
  onTap?: (hit: GlobeHit) => void;
}
