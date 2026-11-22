import { en, type TranslationKey } from "../en";
import { es } from "../es";
import { fr } from "../fr";
import { de } from "../de";
import { pt } from "../pt";
import { countryName, formatNumber, LANGUAGES, listJoin, subregionName, translate } from "../core";
import { catalogFor, achievementTitle } from "../catalog";
import { makeT } from "../useT";
import { ACHIEVEMENTS } from "../../gamification/achievements";
import { EXPEDITIONS } from "../../gamification/expeditions";
import { COUNTRIES } from "../../data/countries";
import { areaComparison, densityComparison } from "../../utils/countryStats";
import { formatCompactNumber, formatLatLng } from "../../utils/geo";

const DICTIONARIES = { es, fr, de, pt };
const placeholders = (s: string) => new Set(Array.from(s.matchAll(/\{(\w+)\}/g), (m) => m[1]));

describe("translations", () => {
  const keys = Object.keys(en) as TranslationKey[];

  it.each(Object.entries(DICTIONARIES))("%s translates every key", (_lang, dict) => {
    for (const key of keys) {
      expect(typeof dict[key]).toBe("string");
      expect(dict[key].trim().length).toBeGreaterThan(0);
    }
    expect(Object.keys(dict).sort()).toEqual([...keys].sort());
  });

  it.each(Object.entries(DICTIONARIES))("%s only uses placeholders the English text provides", (_lang, dict) => {
    for (const key of keys) {
      for (const name of placeholders(dict[key])) {
        expect([key, name, placeholders(en[key]).has(name)]).toEqual([key, name, true]);
      }
    }
  });

  it("keeps numbers and counts in every sentence that needs them", () => {
    // Dropping {count} from a plural-bearing sentence would silently hide information.
    const mustKeep: TranslationKey[] = ["quiz.correctOutOf", "locate.missHint", "challenge.shareText", "reminder.streakTitle", "learn.due"];
    for (const dict of Object.values(DICTIONARIES)) {
      for (const key of mustKeep) {
        for (const name of placeholders(en[key])) {
          if (key === "locate.missHint" && name === "country") continue;
          expect([key, name, placeholders(dict[key]).has(name)]).toEqual([key, name, true]);
        }
      }
    }
  });

  it("covers every achievement and expedition in every language", () => {
    for (const { code } of LANGUAGES) {
      if (code === "en") continue;
      const catalog = catalogFor(code)!;
      for (const a of ACHIEVEMENTS) {
        expect([code, a.id, Boolean(catalog.achievements[a.id]?.title && catalog.achievements[a.id]?.description)]).toEqual([code, a.id, true]);
      }
      for (const e of EXPEDITIONS) {
        expect([code, e.id, Boolean(catalog.expeditions[e.id]?.title && catalog.expeditions[e.id]?.description)]).toEqual([code, e.id, true]);
      }
      expect(Object.keys(catalog.achievements).sort()).toEqual(ACHIEVEMENTS.map((a) => a.id).sort());
      expect(Object.keys(catalog.expeditions).sort()).toEqual(EXPEDITIONS.map((e) => e.id).sort());
    }
    expect(achievementTitle(ACHIEVEMENTS[0], "en")).toBe(ACHIEVEMENTS[0].title);
  });

  it("fills placeholders and formats numbers for the language", () => {
    expect(translate("en", "quiz.correctOutOf", { correct: 7, total: 10 })).toBe("7 out of 10 correct");
    expect(translate("de", "quiz.points", { earned: 1234, possible: 3000 })).toBe("1.234 / 3.000 Punkte");
    expect(formatNumber(1.5, "fr")).toBe("1,5");
    expect(formatCompactNumber(1_463_865_525, "es")).toBe("1,5 mil M");
    expect(formatCompactNumber(83_000_000, "de")).toBe("83 Mio.");
    expect(formatCompactNumber(9_492, "en")).toBe("9.5K");
    expect(formatLatLng(-33.9, -70.7, "pt")).toBe("33,9°S, 70,7°O");
    expect(listJoin(["A", "B", "C"], "fr")).toBe("A, B et C");
  });

  it("builds a bound translate function with helpers", () => {
    "use strict";
    const t = makeT("fr");
    expect(t("tabs.profile")).toBe("Profil");
    expect(t.lang).toBe("fr");
    expect(t.country(COUNTRIES.find((c) => c.id === "DEU")!)).toBe("Allemagne");
  });

  it("names countries and regions in the chosen language", () => {
    const germany = COUNTRIES.find((c) => c.id === "DEU")!;
    expect(countryName(germany, "en")).toBe("Germany");
    expect(countryName(germany, "es")).toBe("Alemania");
    expect(countryName(germany, "fr")).toBe("Allemagne");
    expect(countryName(germany, "de")).toBe("Deutschland");
    expect(countryName(germany, "pt")).toBe("Alemanha");
    expect(subregionName("Western Europe", "de")).toBe("Westeuropa");
    expect(subregionName("Somewhere New", "de")).toBe("Somewhere New");
    // Names are only stored where they differ from English ("Angola" stays "Angola").
    const angola = COUNTRIES.find((c) => c.id === "AGO")!;
    expect(countryName(angola, "de")).toBe("Angola");
    for (const lang of ["es", "fr", "de", "pt"] as const) {
      expect(COUNTRIES.filter((c) => c.names?.[lang]).length).toBeGreaterThan(COUNTRIES.length / 2);
    }
  });

  it("phrases relatable stats in the chosen language", () => {
    expect(areaComparison("BRA", "es")).toBe("Más o menos del tamaño de Estados Unidos");
    expect(areaComparison("RUS", "de")).toMatch(/^Etwa \d+(,\d)?-mal so groß wie Kanada$/);
    expect(densityComparison("MCO", "fr")).toBe("Le pays le plus densément peuplé du monde");
  });
});
