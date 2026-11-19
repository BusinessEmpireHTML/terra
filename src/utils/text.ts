/** Lowercase, trim, and strip accents ("São Tomé" -> "sao tome") for matching. */
export function normalizeName(s: string): string {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim();
}
