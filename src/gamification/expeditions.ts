import type { Expedition } from "./types";

export const EXPEDITIONS: Expedition[] = [
  {
    id: "around_the_world",
    title: "Around the World",
    description: "A highlights tour touching every inhabited continent.",
    icon: "airplane",
    countryIds: ["USA", "BRA", "EGY", "JPN", "AUS", "FRA", "ZAF", "IND", "MEX", "RUS"],
  },
  {
    id: "european_capitals",
    title: "European Capitals",
    description: "From Lisbon to Athens, a sweep across Europe's great cities.",
    icon: "business",
    countryIds: ["FRA", "DEU", "ITA", "ESP", "GBR", "PRT", "POL", "GRC", "AUT", "CHE", "NLD", "SWE"],
  },
  {
    id: "african_safari",
    title: "African Safari",
    description: "The continent's great wildlife nations, from savanna to rainforest.",
    icon: "paw",
    countryIds: ["KEN", "TZA", "ZAF", "BWA", "NAM", "ZMB", "ZWE", "RWA", "UGA"],
  },
  {
    id: "island_nations",
    title: "Island Nations",
    description: "Countries with no land borders at all — just coastline.",
    icon: "boat",
    // Every one of these has no land neighbor (unlike the Dominican Republic,
    // Haiti, or Papua New Guinea, which share their islands) — enforced by a test.
    countryIds: ["ISL", "JPN", "NZL", "JAM", "CUB", "TTO", "FJI", "SGP", "PHL", "MDG", "MDV", "MUS"],
  },
  {
    id: "silk_road",
    title: "Silk Road",
    description: "The historic trade route linking China to the Mediterranean.",
    icon: "trail-sign",
    countryIds: ["CHN", "KAZ", "UZB", "IRN", "TUR"],
  },
  {
    id: "south_america",
    title: "South American Adventure",
    description: "All 12 countries on the continent, from the Andes to the Amazon.",
    icon: "leaf",
    countryIds: ["BRA", "ARG", "CHL", "PER", "COL", "ECU", "BOL", "PRY", "URY", "VEN", "GUY", "SUR"],
  },
  {
    id: "pacific_expedition",
    title: "Pacific Expedition",
    description: "Nations scattered across the world's largest ocean.",
    icon: "water",
    countryIds: ["AUS", "NZL", "FJI", "PNG", "WSM", "TON", "VUT", "SLB"],
  },
  {
    id: "equator_countries",
    title: "Countries of the Equator",
    description: "The 11 nations whose land the equator crosses.",
    icon: "sunny",
    // West to east. (Kiribati and the Maldives only have it pass through
    // their waters, so they're left out.)
    countryIds: ["ECU", "COL", "BRA", "STP", "GAB", "COG", "COD", "UGA", "KEN", "SOM", "IDN"],
  },
  {
    id: "nordic_lands",
    title: "Nordic Lands",
    description: "Iceland to Finland — fjords, saunas, and the midnight sun.",
    icon: "snow",
    countryIds: ["ISL", "SWE", "NOR", "DNK", "FIN"],
  },
  {
    id: "ancient_empires",
    title: "Ancient Empires",
    description: "Where some of history's greatest civilizations rose.",
    icon: "library",
    countryIds: ["EGY", "GRC", "ITA", "CHN", "IRN", "PER", "IND", "MEX"],
  },
];

export const EXPEDITIONS_BY_ID = new Map(EXPEDITIONS.map((e) => [e.id, e]));
