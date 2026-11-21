import { getLocales } from "expo-localization";
import { isLang, type Lang } from "./core";

/** The phone's preferred language, if Terra speaks it (otherwise English). */
export function deviceLanguage(): Lang {
  try {
    const code = getLocales()[0]?.languageCode;
    return isLang(code) ? code : "en";
  } catch {
    return "en";
  }
}
