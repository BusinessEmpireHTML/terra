import type { GlobeHit } from "./globeData";

export type { GlobeHit };

export type GlobeLayer = "political" | "density" | "mastery";

/** People per km² buckets used by the density layer (and its legend on the home screen). */
export const DENSITY_BREAKS = [10, 50, 150, 400] as const;

/** Country fills used by game modes to mark answers. */
export type GlobeHighlight = "correct" | "wrong";

export interface GlobeProps {
  size: number;
  layer?: GlobeLayer;
  /** Draws a halo around this country's marker. */
  focusedCountryId?: string | null;
  /** countryId -> mastery score 0–100, only needed when layer === 'mastery'. Computed by the caller so the globe stays decoupled from storage. */
  masteryByCca3?: Map<string, number>;
  /** Fill specific countries (overrides the layer's fill for them). */
  highlights?: Record<string, GlobeHighlight>;
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
