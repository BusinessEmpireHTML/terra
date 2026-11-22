import type { Country } from "../types/country";
import { en, type TranslationKey } from "./en";
import { es } from "./es";
import { fr } from "./fr";
import { de } from "./de";
import { pt } from "./pt";

/**
 * Translations. UI text lives in typed dictionaries (one per language) —
 * every language must define every key, so a missing translation is a type
 * error, not a blank label. Country names come from the source dataset's own
 * translations. Hand-written stories (history, culture, food notes) are
 * English-only for now.
 *
 * This module is pure (no storage, no React), so quiz generators and stats can
 * use it; screens use `useT()` from ./useT, which re-renders on language change.
 */

export const LANGUAGES = [
  { code: "en", name: "English" },
  { code: "es", name: "Español" },
  { code: "fr", name: "Français" },
  { code: "de", name: "Deutsch" },
  { code: "pt", name: "Português" },
] as const;

export type Lang = (typeof LANGUAGES)[number]["code"];
export type { TranslationKey };
export type TranslationParams = Record<string, string | number>;

const DICTIONARIES: Record<Lang, Record<TranslationKey, string>> = { en, es, fr, de, pt };
const LOCALES: Record<Lang, string> = { en: "en-US", es: "es-ES", fr: "fr-FR", de: "de-DE", pt: "pt-BR" };

export function isLang(code: unknown): code is Lang {
  return LANGUAGES.some((l) => l.code === code);
}

let current: Lang = "en";

/** Set by the app store when the language preference loads or changes. */
export function setCurrentLanguage(lang: Lang): void {
  current = lang;
}

export function currentLanguage(): Lang {
  return current;
}

export function translate(lang: Lang, key: TranslationKey, params?: TranslationParams): string {
  const template = DICTIONARIES[lang][key] ?? en[key];
  if (!params) return template;
  return template.replace(/\{(\w+)\}/g, (match, name: string) => (name in params ? formatParam(lang, params[name]) : match));
}

function formatParam(lang: Lang, value: string | number): string {
  return typeof value === "number" ? formatNumber(value, lang) : value;
}

/** Translate in the current language (for non-React code: quiz prompts, stats, notifications). */
export function t(key: TranslationKey, params?: TranslationParams): string {
  return translate(current, key, params);
}

export function formatNumber(n: number, lang: Lang = current): string {
  return n.toLocaleString(LOCALES[lang]);
}

export function localeFor(lang: Lang = current): string {
  return LOCALES[lang];
}

/** A subregion name ("Eastern Africa") in the given language; unknown names pass through. */
export function subregionName(subregion: string, lang: Lang = current): string {
  const key = `subregion.${subregion}`;
  return key in en ? translate(lang, key as TranslationKey) : subregion;
}

/** "A, B and C" in the given language. */
export function listJoin(items: string[], lang: Lang = current): string {
  if (items.length <= 1) return items.join("");
  return `${items.slice(0, -1).join(", ")} ${translate(lang, "common.and")} ${items[items.length - 1]}`;
}

/** A country's common name in the given language (falls back to English). */
export function countryName(country: Pick<Country, "name" | "names">, lang: Lang = current): string {
  return lang === "en" ? country.name.common : country.names?.[lang] ?? country.name.common;
}
