/**
 * Core country record. Phase 1 populates the "atlas" fields below for every
 * sovereign country from open geographic data. Richer, hand-authored content
 * (history, culture, nature, landmarks, food, language lessons) arrives in
 * later phases as `Country["content"]` grows — see CountryDetailScreen for
 * how unpopulated sections degrade gracefully in the meantime.
 */
export interface Country {
  /** ISO 3166-1 alpha-3 code. Primary key everywhere in the app. */
  id: string;
  cca2: string;
  ccn3?: string;

  name: {
    common: string;
    official: string;
  };

  flagEmoji: string;
  /** Accent color derived from the flag; only curated for featured countries so far. */
  accentColor?: string;

  region: Continent;
  subregion?: string;
  capital?: string[];
  /** [latitude, longitude] of the country's rough centroid. */
  latlng: [number, number];
  areaKm2?: number;
  population?: number;
  landlocked?: boolean;

  languages?: string[];
  currencies?: CountryCurrency[];
  callingCode?: string;
  tld?: string[];

  /** Neighboring countries' cca3 codes. */
  borders?: string[];

  /** Whether this country has renderable border geometry on the globe. */
  hasBorderGeometry: boolean;

  /**
   * Top religious groups by share of population, ~2020 estimates.
   * Source: Pew Research Center (CC BY 4.0) — see README.md for attribution.
   * Every country sums close to but not always exactly 100% (rounding,
   * plus very small groups omitted). Treat as a broad demographic picture,
   * not a precise or static count — religious self-identification is
   * inherently approximate and shifts over time.
   */
  religions?: ReligionShare[];

  /** A single hand-written highlight, only present for featured countries so far. */
  funFact?: string;
}

export interface ReligionShare {
  name: string;
  percent: number;
}

export type Continent = "Africa" | "Americas" | "Asia" | "Europe" | "Oceania" | "Antarctic";

export interface CountryCurrency {
  code: string;
  name: string;
  symbol?: string;
}

/**
 * Hand-authored narrative content, keyed separately from the auto-generated
 * `Country` records (see src/data/countryContent.ts). Every field is
 * optional and independent — a country can have History without Culture,
 * three Landmarks without Food, etc. CountryDetailScreen renders whatever
 * exists and shows an honest "coming soon" card for whatever doesn't.
 */
export interface CountryContent {
  history?: HistoryEvent[];
  culture?: string;
  nature?: string;
  food?: Dish[];
  landmarks?: Landmark[];
}

export interface HistoryEvent {
  year: string;
  label: string;
}

export interface Dish {
  name: string;
  note: string;
}

export interface Landmark {
  name: string;
  note: string;
}
