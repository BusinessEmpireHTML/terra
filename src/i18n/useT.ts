import { useMemo } from "react";
import { useAppStore, type LanguageMode } from "../store/useAppStore";
import { countryName, translate, type Lang, type TranslationKey, type TranslationParams } from "./core";
import { deviceLanguage } from "./device";
import type { Country } from "../types/country";

export function resolveLanguage(mode: LanguageMode): Lang {
  return mode === "system" ? deviceLanguage() : mode;
}

/**
 * A translate function bound to one language, with `.lang` and
 * `.country(c)` (the country's name in that language) attached.
 */
export function makeT(lang: Lang) {
  const tr = (key: TranslationKey, params?: TranslationParams) => translate(lang, key, params);
  // Note: a function's own `name` is read-only, so helpers must not be called "name".
  return Object.assign(tr, { lang, country: (c: Pick<Country, "name" | "names">) => countryName(c, lang) });
}

/** `const t = useT(); t("tabs.globe")` — re-renders when the language changes. */
export function useT() {
  const mode = useAppStore((s) => s.languageMode);
  const lang = resolveLanguage(mode);
  return useMemo(() => makeT(lang), [lang]);
}
