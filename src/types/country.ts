/**
 * Core country record, generated for all 194 countries by
 * scripts/prepare-data.mjs from open data (see README.md for sources).
 * Hand-written narrative content lives separately in
 * src/data/countryContent.ts, keyed by the same `id`.
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
  /** Common name in the other languages Terra speaks (from the source dataset's translations). */
  names?: Partial<Record<"es" | "fr" | "de" | "pt", string>>;

  flagEmoji: string;
  /** Accent color drawn from the flag's most distinctive hue (curated for every country). */
  accentColor?: string;

  region: Continent;
  subregion?: string;
  capital?: string[];
  /** [latitude, longitude] of the country's rough centroid. */
  latlng: [number, number];
  areaKm2?: number;
  /** Total population (World Bank, SP.POP.TOTL), latest year available. */
  population?: number;
  /** The year `population` refers to. */
  populationYear?: number;
  landlocked?: boolean;

  languages?: string[];
  currencies?: CountryCurrency[];
  callingCode?: string;
  tld?: string[];

  /** Land neighbors' cca3 codes. Every code resolves to another entry in COUNTRIES. */
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

  /** A single hand-written highlight (present for every country). */
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
 * three Landmarks without Food, etc. (Vatican City, for instance, has no
 * Food or Nature section.) CountryDetailScreen renders whatever exists.
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
